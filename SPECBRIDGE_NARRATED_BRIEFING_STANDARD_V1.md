# SpecBridge Narrated Briefing Standard v1.0

**Status:** CURRENT CROSS-PROJECT NARRATED EXPERIENCE STANDARD  
**Effective date:** 2026-09-01  
**Reference implementation:** `/datacenter/`  
**Prepared / metadata author:** Önder Yardaş

## 1. Objective

A narrated investor experience is not a document read aloud and is not a casual two-person podcast. It is a controlled executive briefing delivered by one authoritative narrator, supported by synchronized subtitles/transcript, visual evidence and direct chapter navigation.

## 2. Editorial voice

- One primary narrator.
- Senior adviser / executive documentary tone.
- Calm, technically authoritative and non-promotional.
- No synthetic banter, fake questions between uninformed hosts or casual entertainment framing.
- Claims must remain distinguishable as confirmed facts, estimates, recommendations or design assumptions.
- Statistics are interpreted; they are not read as disconnected numbers.

## 3. Narrative architecture

Each briefing is divided into independently addressable chapters. A chapter contains:

- code / order
- title and short summary
- narration segments
- current visual or chart
- source references
- optional professional audio asset
- optional WebVTT/SRT captions

The user can jump between chapters without replaying earlier material.

## 4. Listening and presentation modes

### Listen Mode
Optimized for phone, headphones and background listening. Chapter, transport, live subtitle and transcript remain available.

### Presentation Mode
Optimized for an investor meeting or large display. The current visual receives priority while the synchronized subtitle and transport remain visible.

## 5. Subtitle and transcript model

- The active spoken segment is always displayed as a subtitle.
- Transcript segments are clickable and act as seek points.
- With final recorded audio, captions should be time-aligned to the mastered audio and exported as WebVTT plus SRT.
- Browser TTS may be used as a functional fallback, but it is not treated as the final professional voice master.

## 6. Audio model

The runtime should prefer mastered chapter audio when an asset is available. If no audio asset exists, browser/OS speech synthesis may provide a temporary single-narrator fallback.

Professional audio should normally be produced chapter-by-chapter rather than as one irreversible long file. This allows a chapter, statistic or regulatory statement to be revised without regenerating the entire briefing.

## 7. Visual cue model

Visuals change by chapter and must clarify the current argument. Suitable visuals include:

- system-of-systems architecture
- power and cooling chains
- sourced bar/line charts
- security layers
- operations lifecycle
- commissioning scenarios
- adviser-governance diagrams
- country opportunity indicators
- phased investment paths

Decorative visuals should not overpower evidence or narration.

## 8. Source model

Sources are presented adjacent to the chapter they support, not only as a bibliography at the end. Official and primary sources are preferred. A source link proves only the claim it actually supports.

## 9. Playback controls

At minimum:

- play / pause
- stop
- previous / next segment or chapter
- chapter navigation
- playback speed
- continue-from-last-position
- auto-next toggle
- transcript jump
- source view

## 10. Theme and responsive behavior

Narrated experiences use the shared SpecBridge `Light / Dark / System` project-theme preference. Mobile remains fully usable in portrait; presentation mode can benefit from landscape but must not require it for core navigation.

## 11. Language architecture

Language-specific narration, transcript and caption assets may share the same visual and chapter manifest. Translation must preserve technical meaning and should not mechanically translate product names, model numbers or engineering identifiers.

## 12. Professional voice master workflow

1. Freeze the master narration script.
2. Add emphasis and pause direction to the narrator edition.
3. Record or synthesize the approved single narrator voice chapter-by-chapter.
4. Master loudness and remove excessive silence/noise.
5. Align the clean transcript to the final mastered audio.
6. Export WebVTT and SRT.
7. Update the chapter manifest to prefer audio assets instead of TTS fallback.
8. Run chapter-jump, subtitle-sync, mobile, theme and source-link acceptance.

## 13. Data-center reference implementation

`/datacenter/` demonstrates the standard with 15 chapters covering:

- what a data center actually is
- global demand
- AI/high-density change
- power scarcity
- electrical and thermal chains
- interconnection
- security
- 24×7 operations
- commissioning
- independent technical advisory
- Türkiye opportunity
- why now
- phased investment
- conclusion

## 14. Reuse rule

Future project briefings should instantiate this structure from the project canonical data and evidence package rather than inventing a new audio UX or podcast format from zero.
