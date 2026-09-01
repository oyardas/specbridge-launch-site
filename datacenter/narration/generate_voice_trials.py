#!/usr/bin/env python3
import difflib
import json
import os
import re
import sys
from pathlib import Path

from openai import OpenAI

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "datacenter" / "narration" / "VOICE_TRIAL_PROFILES_TR_V1.json"
OUT = ROOT / "datacenter" / "audio" / "trials" / "tr"


def normalize(text: str) -> str:
    text = text.casefold()
    text = re.sub(r"[^a-z0-9çğıöşü\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def similarity(a: str, b: str) -> float:
    return difflib.SequenceMatcher(None, normalize(a), normalize(b)).ratio()


def main() -> int:
    if not os.getenv("OPENAI_API_KEY"):
        print("OPENAI_API_KEY is required", file=sys.stderr)
        return 2

    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    client = OpenAI()
    source_text = cfg["sample"]["text"]
    min_ratio = float(cfg["acceptance"]["minimum_transcript_similarity"])
    final_phrase = normalize(cfg["acceptance"]["required_final_phrase"])
    results = []
    failures = []

    for profile in cfg["profiles"]:
        pid = profile["id"]
        audio_path = OUT / f"chapter00-trial-{pid.lower()}.mp3"
        transcript_path = OUT / f"chapter00-trial-{pid.lower()}.transcript.txt"

        print(f"Generating profile {pid} — {profile['name']} / {profile['voice']}")
        response = client.audio.speech.create(
            model=cfg["model"],
            voice=profile["voice"],
            input=source_text,
            instructions=profile["instructions"],
            response_format=cfg.get("response_format", "mp3"),
            speed=float(profile.get("speed", 1.0)),
        )
        response.write_to_file(audio_path)

        with audio_path.open("rb") as af:
            tx = client.audio.transcriptions.create(
                model=cfg["transcription_model"],
                file=af,
                response_format="text",
            )
        transcript = tx if isinstance(tx, str) else getattr(tx, "text", str(tx))
        transcript_path.write_text(transcript.strip() + "\n", encoding="utf-8")

        ratio = similarity(source_text, transcript)
        final_ok = final_phrase in normalize(transcript)
        passed = ratio >= min_ratio and final_ok and audio_path.stat().st_size > 10_000
        result = {
            "id": pid,
            "name": profile["name"],
            "voice": profile["voice"],
            "audio": str(audio_path.relative_to(ROOT)),
            "transcript": str(transcript_path.relative_to(ROOT)),
            "bytes": audio_path.stat().st_size,
            "transcript_similarity": round(ratio, 4),
            "final_phrase_present": final_ok,
            "automatic_acceptance": passed,
        }
        results.append(result)
        if not passed:
            failures.append(result)

    report = {
        "model": cfg["model"],
        "transcription_model": cfg["transcription_model"],
        "sample_chapter": cfg["sample"]["chapter"],
        "disclosure": cfg["disclosure"],
        "results": results,
        "manual_checks": cfg["acceptance"]["manual_checks"],
    }
    (OUT / "validation.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print(json.dumps(report, ensure_ascii=False, indent=2))
    if failures:
        print(f"Automatic acceptance failed for {len(failures)} profile(s).", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
