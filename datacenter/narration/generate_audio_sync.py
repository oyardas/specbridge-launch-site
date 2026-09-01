#!/usr/bin/env python3
import json
import os
import re
import sys
from pathlib import Path

from mutagen.mp3 import MP3
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[2]
AUDIO_ROOT = ROOT / "datacenter" / "audio" / "production" / "tr"
MANIFEST = AUDIO_ROOT / "manifest.json"
OUT_JS = ROOT / "datacenter" / "briefing-audio-data.js"
VTT_DIR = ROOT / "datacenter" / "captions" / "tr"
WORD_RE = re.compile(r"[0-9A-Za-zÇĞİÖŞÜçğıöşü]+(?:['’][0-9A-Za-zÇĞİÖŞÜçğıöşü]+)?")


def fmt_vtt(seconds: float) -> str:
    ms = max(0, int(round(seconds * 1000)))
    h, rem = divmod(ms, 3600000)
    m, rem = divmod(rem, 60000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def obj_get(o, key, default=None):
    if isinstance(o, dict):
        return o.get(key, default)
    return getattr(o, key, default)


def word_count(text: str) -> int:
    return len(WORD_RE.findall(text))


def authoritative_chunks(text: str, max_words: int = 22):
    text = re.sub(r"\s+", " ", text).strip()
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    out = []
    for sentence in sentences:
        if word_count(sentence) <= max_words:
            out.append(sentence)
            continue
        clauses = [c.strip() for c in re.split(r"(?<=[,;:])\s+", sentence) if c.strip()]
        if len(clauses) == 1:
            words = sentence.split()
            for i in range(0, len(words), max_words):
                out.append(" ".join(words[i:i + max_words]))
            continue
        buf = []
        for clause in clauses:
            trial = " ".join(buf + [clause]).strip()
            if buf and word_count(trial) > max_words:
                out.append(" ".join(buf).strip())
                buf = [clause]
            else:
                buf.append(clause)
        if buf:
            joined = " ".join(buf).strip()
            if word_count(joined) <= max_words:
                out.append(joined)
            else:
                words = joined.split()
                for i in range(0, len(words), max_words):
                    out.append(" ".join(words[i:i + max_words]))
    return [x for x in out if word_count(x)]


def time_for_word_position(asr_segments, position: float, total_words: int, duration: float) -> float:
    if not asr_segments or total_words <= 0:
        return max(0.0, min(duration, (position / max(total_words, 1)) * duration))
    cursor = 0.0
    for seg in asr_segments:
        wc = max(1, seg["words"])
        next_cursor = cursor + wc
        if position <= next_cursor:
            frac = max(0.0, min(1.0, (position - cursor) / wc))
            return seg["start"] + frac * max(0.0, seg["end"] - seg["start"])
        cursor = next_cursor
    return min(duration, asr_segments[-1]["end"])


def main() -> int:
    if not os.getenv("OPENAI_API_KEY"):
        print("OPENAI_API_KEY is required", file=sys.stderr)
        return 2
    if not MANIFEST.exists():
        print("Production manifest missing", file=sys.stderr)
        return 3

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assert manifest.get("accepted_count") == 15
    assert manifest.get("failed_count") == 0

    client = OpenAI()
    VTT_DIR.mkdir(parents=True, exist_ok=True)
    chapters = {}
    failures = []

    for item in manifest["chapters"]:
        cid = item["id"]
        audio_path = ROOT / item["audio"]
        source_path = ROOT / item["source"]
        if not audio_path.exists() or not source_path.exists():
            failures.append(f"{cid}: missing audio/source")
            continue
        duration = float(MP3(audio_path).info.length)
        source_text = source_path.read_text(encoding="utf-8").strip()
        chunks = authoritative_chunks(source_text)
        source_words = sum(word_count(x) for x in chunks)
        if not chunks or source_words < 20:
            failures.append(f"{cid}: authoritative source too short")
            continue

        print(f"Timestamping chapter {cid}: {audio_path.name}")
        with audio_path.open("rb") as af:
            tx = client.audio.transcriptions.create(
                model="whisper-1",
                file=af,
                language="tr",
                response_format="verbose_json",
                timestamp_granularities=["segment"],
            )

        raw_segments = obj_get(tx, "segments", []) or []
        asr_segments = []
        for seg in raw_segments:
            text = str(obj_get(seg, "text", "") or "").strip()
            if not text:
                continue
            start = float(obj_get(seg, "start", 0.0) or 0.0)
            end = float(obj_get(seg, "end", start) or start)
            if end <= start:
                end = min(duration, start + 1.0)
            asr_segments.append({"start": start, "end": min(end, duration), "words": max(1, word_count(text))})

        if not asr_segments:
            failures.append(f"{cid}: no timestamp segments")
            continue
        asr_words = sum(x["words"] for x in asr_segments)
        ratio = asr_words / source_words
        if not (0.82 <= ratio <= 1.18):
            failures.append(f"{cid}: ASR/source word ratio {ratio:.3f}")
            continue

        segments = chunks
        cues = []
        source_cursor = 0.0
        previous_end = 0.0
        for idx, text in enumerate(segments):
            wc = word_count(text)
            asr_start_pos = (source_cursor / source_words) * asr_words
            asr_end_pos = ((source_cursor + wc) / source_words) * asr_words
            start = time_for_word_position(asr_segments, asr_start_pos, asr_words, duration)
            end = time_for_word_position(asr_segments, asr_end_pos, asr_words, duration)
            start = max(previous_end, start)
            end = max(start + 0.35, end)
            if idx == len(segments) - 1:
                end = duration
            end = min(duration, end)
            cues.append({"segment": idx, "start": round(start, 3), "end": round(end, 3)})
            previous_end = end
            source_cursor += wc

        vtt_name = f"{cid}.vtt"
        vtt_lines = ["WEBVTT", ""]
        for i, (text, cue) in enumerate(zip(segments, cues), start=1):
            vtt_lines.extend([
                str(i),
                f"{fmt_vtt(cue['start'])} --> {fmt_vtt(cue['end'])}",
                text,
                "",
            ])
        (VTT_DIR / vtt_name).write_text("\n".join(vtt_lines), encoding="utf-8")

        chapters[cid] = {
            "audio": item["audio"].replace("datacenter/", ""),
            "vtt": f"captions/tr/{vtt_name}",
            "duration": round(duration, 3),
            "segments": segments,
            "cues": cues,
        }
        print(json.dumps({"id": cid, "segments": len(segments), "duration": round(duration,3), "asr_source_ratio": round(ratio,3)}, ensure_ascii=False))

    if len(chapters) != 15:
        failures.append(f"chapter count={len(chapters)}")

    payload = {
        "version": "DATACENTER_AUDIO_SYNC_TR_V2",
        "language": "tr-TR",
        "voice": manifest["voice"],
        "disclosure": manifest.get("disclosure"),
        "sync_mode": "whisper-1 timing + authoritative master narration text",
        "chapter_count": len(chapters),
        "chapters": chapters,
    }
    OUT_JS.write_text(
        "window.DATACENTER_AUDIO_SYNC=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )

    if failures:
        print("SYNC_ACCEPTANCE=FAIL", file=sys.stderr)
        for f in failures:
            print(f, file=sys.stderr)
        return 1
    print("SYNC_ACCEPTANCE=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
