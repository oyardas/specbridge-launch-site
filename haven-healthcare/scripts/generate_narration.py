#!/usr/bin/env python3
# Static Haven narration generator: Turkish and English only.
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NARRATION_FILE = ROOT / "narration" / "narration.json"
AUDIO_ROOT = ROOT / "audio"
API_URL = "https://api.openai.com/v1/audio/speech"
MODEL = os.environ.get("TTS_MODEL", "gpt-4o-mini-tts")
VOICES = {
    "tr": os.environ.get("TTS_VOICE_TR", "marin"),
    "en": os.environ.get("TTS_VOICE_EN", "cedar"),
}
INSTRUCTIONS = {
    "tr": (
        "Speak entirely in Turkish with a natural native Istanbul Turkish accent. "
        "Use a calm, confident, premium investor-presentation style. "
        "Do not use an English accent. Pronounce Turkish words natively and read technical terms "
        "according to the Turkish wording provided in the input. Moderate pace, clear diction, warm but professional tone."
    ),
    "en": (
        "Speak in clear international English with a calm, confident, premium investor-presentation style. "
        "Moderate pace, precise technical diction, natural phrasing, no exaggerated sales tone."
    ),
}


def request_speech(api_key: str, text: str, lang: str) -> bytes:
    body = json.dumps(
        {
            "model": MODEL,
            "voice": VOICES[lang],
            "input": text,
            "instructions": INSTRUCTIONS[lang],
            "response_format": "mp3",
        },
        ensure_ascii=False,
    ).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as response:
            return response.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI TTS HTTP {exc.code}: {detail}") from exc


def main() -> int:
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        print("OPENAI_API_KEY is required.", file=sys.stderr)
        return 2

    force = os.environ.get("FORCE_REGENERATE", "false").lower() in {"1", "true", "yes", "on"}
    data = json.loads(NARRATION_FILE.read_text(encoding="utf-8"))
    generated = []

    for lang in ("tr", "en"):
        target_dir = AUDIO_ROOT / lang
        target_dir.mkdir(parents=True, exist_ok=True)
        for view_id in [f"T{i:02d}" for i in range(0, 9)]:
            text = data[view_id][lang].strip()
            out = target_dir / f"{view_id}.mp3"
            if out.exists() and out.stat().st_size > 1000 and not force:
                print(f"SKIP {out.relative_to(ROOT)}")
                continue
            print(f"GENERATE {lang}/{view_id} with {VOICES[lang]} ...", flush=True)
            audio = request_speech(api_key, text, lang)
            if len(audio) < 1000:
                raise RuntimeError(f"Unexpectedly small audio payload for {lang}/{view_id}: {len(audio)} bytes")
            out.write_bytes(audio)
            generated.append(str(out.relative_to(ROOT)))
            time.sleep(0.35)

    manifest = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "model": MODEL,
        "voices": VOICES,
        "languages": ["tr", "en"],
        "views": [f"T{i:02d}" for i in range(0, 9)],
        "generated_files": generated,
        "delivery": "static-mp3",
        "note": "Dhivehi text remains available in the UI; spoken Dhivehi narration is intentionally disabled pending native-language validation.",
    }
    (AUDIO_ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"DONE generated={len(generated)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
