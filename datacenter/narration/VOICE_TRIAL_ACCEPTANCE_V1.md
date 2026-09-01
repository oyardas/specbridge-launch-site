# Data Center Turkish Voice Trial — Acceptance Pack v1

## Purpose

Generate three comparable Turkish narration samples for Chapter 00 before producing the full 15-chapter audio master.

## Profiles

- **A — Executive Adviser / cedar**: calm, measured, corporate senior-adviser delivery.
- **B — Documentary Authority / onyx**: slightly deeper and slower, more deliberate pauses.
- **C — Technical Strategist / sage**: crisp technical articulation, neutral and analytical.

All profiles use the exact same Turkish source text. Only the voice and delivery instructions differ.

## Automatic acceptance

Each generated MP3 is transcribed back to text with `gpt-4o-mini-transcribe`. The pipeline rejects a sample when:

- normalized transcript similarity is below 0.88;
- the required final phrase is absent, which is used as a truncation guard;
- the output file is implausibly small.

Automatic acceptance is necessary but not sufficient.

## Human listening acceptance

Score each sample from 1–5 on:

1. Native-enough Turkish pronunciation
2. Credibility as a senior technical adviser
3. Clarity of English technical terminology
4. Pace and pause discipline
5. Absence of advertising / radio / casual podcast tone
6. Long-form listening comfort

Choose one production profile only after listening on both desktop headphones and a mobile phone speaker/headset.

## AI disclosure

The final experience must clearly disclose that the narration voice is AI-generated.

## Output

The workflow creates a GitHub Actions artifact named `datacenter-turkish-voice-trials` containing:

- `chapter00-trial-a.mp3`
- `chapter00-trial-b.mp3`
- `chapter00-trial-c.mp3`
- three verification transcripts
- `validation.json`

No OpenAI API key is written into repository files or artifacts.
