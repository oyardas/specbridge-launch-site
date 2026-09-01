#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path

from mutagen.mp3 import MP3
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[2]
AUDIO_ROOT = ROOT / "datacenter" / "audio" / "production" / "tr"
MANIFEST = AUDIO_ROOT / "manifest.json"
OUT_JS = ROOT / "datacenter" / "briefing-audio-data.js"
VTT_DIR = ROOT / "datacenter" / "captions" / "tr"


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
        if not audio_path.exists():
            failures.append(f"{cid}: missing audio")
            continue
        duration = float(MP3(audio_path).info.length)
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
        segments = []
        cues = []
        for idx, seg in enumerate(raw_segments):
            text = str(obj_get(seg, "text", "") or "").strip()
            if not text:
                continue
            start = float(obj_get(seg, "start", 0.0) or 0.0)
            end = float(obj_get(seg, "end", start) or start)
            if end <= start:
                end = min(duration, start + 1.0)
            segments.append(text)
            cues.append({"segment": len(segments)-1, "start": round(start, 3), "end": round(min(end, duration), 3)})

        if not segments:
            failures.append(f"{cid}: no timestamp segments")
            continue
        if cues[-1]["end"] < duration - 15:
            failures.append(f"{cid}: timestamp tail too short ({cues[-1]['end']:.1f}/{duration:.1f})")

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
        print(json.dumps({"id": cid, "segments": len(segments), "duration": round(duration,3), "last_end": cues[-1]["end"]}, ensure_ascii=False))

    if len(chapters) != 15:
        failures.append(f"chapter count={len(chapters)}")

    payload = {
        "version": "DATACENTER_AUDIO_SYNC_TR_V1",
        "language": "tr-TR",
        "voice": manifest["voice"],
        "disclosure": manifest.get("disclosure"),
        "sync_mode": "whisper-1 segment timestamps",
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
