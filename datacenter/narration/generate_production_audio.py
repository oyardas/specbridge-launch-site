#!/usr/bin/env python3
import difflib
import json
import os
import re
import sys
import time
import unicodedata
from pathlib import Path

from mutagen.mp3 import MP3
from num2words import num2words
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[2]
MASTER = ROOT / "datacenter" / "narration" / "MASTER_NARRATION_TR_V1.md"
CONFIG = ROOT / "datacenter" / "narration" / "PRODUCTION_VOICE_TR_V1.json"
OUT = ROOT / "datacenter" / "audio" / "production" / "tr"

CHAPTER_RE = re.compile(r"^# CHAPTER\s+(\d{2})\s+—\s+(.+?)\s*$", re.MULTILINE)
META_RE = re.compile(r"^\*\*(Target|Purpose|Primary visual|Source cues):\*\*.*$", re.MULTILINE)
NUMBER_RE = re.compile(r"\d+(?:[\.,]\d+)?")


def turkish_number(value: str) -> str:
    value = value.strip()
    if "," in value or "." in value:
        sep = "," if "," in value else "."
        left, right = value.split(sep, 1)
        left_words = num2words(int(left), lang="tr")
        right_words = " ".join(num2words(int(ch), lang="tr") for ch in right if ch.isdigit())
        return f"{left_words} virgül {right_words}".strip()
    return num2words(int(value), lang="tr")


def expand_numbers(text: str) -> str:
    def repl(match: re.Match) -> str:
        try:
            return turkish_number(match.group(0))
        except Exception:
            return match.group(0)
    return NUMBER_RE.sub(repl, text)


def normalize(text: str) -> str:
    text = expand_numbers(text.casefold())
    text = text.replace("’", "'")
    text = re.sub(r"[^a-z0-9çğıöşü\s']", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def words(text: str):
    return normalize(text).split()


def similarity(a: str, b: str) -> float:
    return difflib.SequenceMatcher(None, words(a), words(b)).ratio()


def slugify(text: str) -> str:
    trans = str.maketrans({"ç": "c", "Ç": "c", "ğ": "g", "Ğ": "g", "ı": "i", "İ": "i", "ö": "o", "Ö": "o", "ş": "s", "Ş": "s", "ü": "u", "Ü": "u"})
    text = text.translate(trans)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text[:72] or "chapter"


def clean_spoken_text(block: str) -> str:
    # The master script places source-register and editorial notes after [END].
    # They are production metadata, never narration.
    if "[END]" in block:
        block = block.split("[END]", 1)[0]
    block = re.sub(r"```.*?```", "", block, flags=re.DOTALL)
    block = META_RE.sub("", block)
    block = re.sub(r"\[PAUSE\s+[0-9.]+\]", "\n\n", block)
    block = re.sub(r"\[(?:EMPHASIS|SLOW)\]", "", block)
    block = re.sub(r"\[(?:VISUAL|SOURCE|TRANSITION)(?::[^\]]*)?\]", "", block)
    block = re.sub(r"^---\s*$", "", block, flags=re.MULTILINE)
    block = re.sub(r"^#{1,6}\s+", "", block, flags=re.MULTILINE)
    block = re.sub(r"^[-*]\s+", "", block, flags=re.MULTILINE)
    block = block.replace("**", "").replace("__", "").replace("`", "")
    block = re.sub(r"[ \t]+", " ", block)
    block = re.sub(r"\n\s*\n\s*\n+", "\n\n", block)
    return block.strip()


def extract_chapters(markdown: str):
    matches = list(CHAPTER_RE.finditer(markdown))
    chapters = []
    for idx, match in enumerate(matches):
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(markdown)
        cid = match.group(1)
        title = match.group(2).strip()
        spoken = clean_spoken_text(markdown[start:end])
        chapters.append({"id": cid, "title": title, "text": spoken})
    return chapters


def call_with_retry(fn, label: str, attempts: int = 3):
    last_exc = None
    for attempt in range(1, attempts + 1):
        try:
            return fn()
        except Exception as exc:
            last_exc = exc
            if attempt == attempts:
                break
            wait = 2 ** attempt
            print(f"{label} failed on attempt {attempt}: {exc}. Retrying in {wait}s...", file=sys.stderr)
            time.sleep(wait)
    raise last_exc


def main() -> int:
    if not os.getenv("OPENAI_API_KEY"):
        print("OPENAI_API_KEY is required", file=sys.stderr)
        return 2

    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    master = MASTER.read_text(encoding="utf-8")
    chapters = extract_chapters(master)
    expected = int(cfg.get("expected_chapters", 15))
    expected_ids = [f"{i:02d}" for i in range(expected)]
    actual_ids = [c["id"] for c in chapters]
    if len(chapters) != expected or actual_ids != expected_ids:
        print(f"Chapter contract failed. expected={expected_ids} actual={actual_ids}", file=sys.stderr)
        return 3

    OUT.mkdir(parents=True, exist_ok=True)
    client = OpenAI()
    voice_cfg = cfg["voice"]
    accept = cfg["acceptance"]
    results = []
    failures = []

    for chapter in chapters:
        cid = chapter["id"]
        title = chapter["title"]
        source_text = chapter["text"]
        base = f"{cid}-{slugify(title)}"
        audio_path = OUT / f"{base}.mp3"
        transcript_path = OUT / f"{base}.transcript.txt"
        source_path = OUT / f"{base}.source.txt"
        source_path.write_text(source_text + "\n", encoding="utf-8")

        print(f"Generating chapter {cid}: {title}")

        def make_audio():
            response = client.audio.speech.create(
                model=cfg["model"],
                voice=voice_cfg["voice"],
                input=source_text,
                instructions=voice_cfg["instructions"],
                response_format=cfg.get("response_format", "mp3"),
                speed=float(voice_cfg.get("speed", 1.0)),
            )
            response.write_to_file(audio_path)
            return response

        call_with_retry(make_audio, f"TTS chapter {cid}")

        def make_transcript():
            with audio_path.open("rb") as af:
                return client.audio.transcriptions.create(
                    model=cfg["transcription_model"],
                    file=af,
                    response_format="text",
                )

        tx = call_with_retry(make_transcript, f"Transcription chapter {cid}")
        transcript = tx if isinstance(tx, str) else getattr(tx, "text", str(tx))
        transcript = transcript.strip()
        transcript_path.write_text(transcript + "\n", encoding="utf-8")

        ratio = similarity(source_text, transcript)
        source_words = words(source_text)
        transcript_words = words(transcript)
        word_ratio = (len(transcript_words) / len(source_words)) if source_words else 0.0
        tail_count = int(accept.get("tail_word_count", 8))
        tail_source = source_words[-tail_count:]
        tail_transcript = transcript_words[-tail_count:]
        tail_similarity = difflib.SequenceMatcher(None, tail_source, tail_transcript).ratio() if tail_source else 0.0
        bytes_count = audio_path.stat().st_size
        duration = round(float(MP3(audio_path).info.length), 3)
        passed = (
            ratio >= float(accept["minimum_transcript_similarity"])
            and word_ratio >= float(accept["minimum_word_count_ratio"])
            and word_ratio <= float(accept["maximum_word_count_ratio"])
            and bytes_count >= int(accept["minimum_audio_bytes"])
        )

        result = {
            "id": cid,
            "title": title,
            "voice_profile": voice_cfg["id"],
            "audio": str(audio_path.relative_to(ROOT)),
            "source": str(source_path.relative_to(ROOT)),
            "transcript": str(transcript_path.relative_to(ROOT)),
            "duration_seconds": duration,
            "bytes": bytes_count,
            "source_words": len(source_words),
            "transcript_words": len(transcript_words),
            "word_count_ratio": round(word_ratio, 4),
            "transcript_similarity": round(ratio, 4),
            "tail_similarity": round(tail_similarity, 4),
            "automatic_acceptance": passed,
        }
        results.append(result)
        if not passed:
            failures.append(result)
        print(json.dumps(result, ensure_ascii=False))

    manifest = {
        "version": "DATACENTER_TR_PRODUCTION_AUDIO_V1",
        "language": cfg["language"],
        "voice": voice_cfg,
        "model": cfg["model"],
        "transcription_model": cfg["transcription_model"],
        "disclosure": cfg["disclosure"],
        "chapter_count": len(results),
        "accepted_count": sum(1 for r in results if r["automatic_acceptance"]),
        "failed_count": len(failures),
        "total_duration_seconds": round(sum(r["duration_seconds"] for r in results), 3),
        "chapters": results,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps(manifest, ensure_ascii=False, indent=2))
    if failures:
        print(f"Production acceptance failed for {len(failures)} chapter(s). Artifact retained for review.", file=sys.stderr)
        return 1
    print("PRODUCTION_AUDIO_ACCEPTANCE=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
