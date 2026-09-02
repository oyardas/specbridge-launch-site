# DC-K06 — UPS & Energy Storage — GOLDEN V2 FREEZE

## Authoritative state

`DC_K06_GOLDEN_V2 = ACCEPTED`

Date: 2026-09-02

This document freezes the accepted Golden V2 production state for DC-K06 — UPS & Energy Storage. It records the evidence, production artifacts, UI/deployment boundary and reusable engineering controls that must remain authoritative unless a later controlled revision explicitly supersedes this freeze.

---

## 1. Accepted production state

- Module: `DC-K06 — UPS & Energy Storage`
- Research state: `COMPLETE`
- Golden UI state: `golden-v2-live`
- Quick Brief: `LIVE`
- Quick Brief QA: `1/1 PASS`
- Quick Brief duration: `334.296 s` (`5:34`)
- Full Briefing: `LIVE`
- Full Briefing chapters: `8`
- Full Briefing duration: `2073.696 s` (`34:34`)
- Full Audio QA: `8/8 PASS`
- Full Audio failed chapters: `0`
- Full narration source QA: `PASS`
- Full narration normalized source words: `3788`
- Research sections: `85`
- Source register: `36` source families
- Source-register correction: `DC-K06_SOURCE_REGISTER_CORRECTION.md`
- Voice standard: `S3F / Sage Senior Adviser / sage / speed 1.04`
- Voice config: `datacenter/narration/PRODUCTION_VOICE_TR_V1.json`

Full production manifest:

`datacenter/knowledge/audio/production/tr/dc-k06-v2/manifest.json`

Quick production manifest:

`datacenter/knowledge/audio/production/tr/dc-k06-quick-v1/manifest.json`

Full narration source:

`datacenter/knowledge/narration/DC-K06_FULL_NARRATION_TR_V2.md`

Quick narration source:

`datacenter/knowledge/narration/DC-K06_QUICK_NARRATION_TR_V1.md`

Golden module bootstrap:

`datacenter/knowledge/golden-module-k06-bootstrap.js`

Golden metadata adapter:

`datacenter/knowledge/golden-module-k06-data.js`

Golden UI adapter:

`datacenter/knowledge/golden-module-k06-ui.js`

---

## 2. Research evidence and source-register correction

The accepted K06 research model covers UPS functional classes and topologies, bypass/fault behavior, redundancy/failure domains, generator compatibility, protection/selectivity, stored-energy technologies, autonomy sizing, BMS/monitoring, battery safety, lifecycle, BESS boundary, grid interaction, AI load behavior and state-based commissioning.

The evidence set includes the authoritative correction:

`datacenter/knowledge/research/DC-K06_SOURCE_REGISTER_CORRECTION.md`

The original research source register entry 19 recorded an incorrect IEEE 484-2019 URL path. The accepted evidence set supersedes only that URL field with the canonical IEEE Standards Association path:

`https://standards.ieee.org/ieee/484/5765/`

This correction is part of the K06 Golden acceptance boundary. No other research content is altered by that correction.

The research continues to preserve the explicit evidence-language separation:

- FACT
- ENGINEERING GUIDANCE
- VENDOR CLAIM
- SPECBRIDGE INTERPRETATION
- DECISION GUIDANCE

---

## 3. Full Audio acceptance evidence

Authoritative Full Audio generation workflow run:

- Run: `33629330448`
- Artifact ID: `9846375615`
- Artifact SHA-256: `1ae5dbe9e0a9acccb220dfff00021f461862da5d28b0d0f6d914466cc4fbdd57`
- Manifest version: `DC_K06_GOLDEN_AUDIO_V2`
- Accepted: `8`
- Failed: `0`
- Total duration: `2073.696 s`
- Source QA accepted: `true`
- Source QA normalized word count: `3788`

All eight chapters passed on attempt 1:

1. `K06-00` — `244.584 s` — transcript similarity `0.9382` — word ratio `1.0044` — tail `1.0`
2. `K06-01` — `256.560 s` — transcript similarity `0.9602` — word ratio `0.9936` — tail `0.875`
3. `K06-02` — `250.200 s` — transcript similarity `0.9302` — word ratio `0.9893` — tail `0.625`
4. `K06-03` — `244.296 s` — transcript similarity `0.9523` — word ratio `0.9914` — tail `1.0`
5. `K06-04` — `288.816 s` — transcript similarity `0.9243` — word ratio `1.0120` — tail `0.75`
6. `K06-05` — `287.184 s` — transcript similarity `0.9060` — word ratio `0.9881` — tail `1.0`
7. `K06-06` — `260.544 s` — transcript similarity `0.9505` — word ratio `0.9959` — tail `1.0`
8. `K06-07` — `241.512 s` — transcript similarity `0.9157` — word ratio `1.0000` — tail `1.0`

Accepted Full Audio was published from the already accepted artifact without TTS regeneration:

- Pipeline PR: `#31`
- Pipeline merge commit: `cfe85c56bc789409622bab23f9248e6091edd801`
- Publish PR: `#32`
- Publish workflow run: `33630378308`
- Generate job during publish: `SKIPPED`
- Publish verification: `PASS_8_OF_8 2073.696`
- Production merge commit: `26b91981099e6123fd8492b19f72dcdec0ff69f4`

The production Full artifact set contains:

- 8 MP3 chapter files
- 8 source files
- 8 ASR transcript files
- 1 manifest

Accepted chapters must not be regenerated merely for stylistic variation. If a future proven QA defect exists, regeneration must be limited to failed chapter IDs.

---

## 4. Quick Brief acceptance evidence

K06 did not have a pre-existing Quick Brief artifact when Full Audio was completed. A separate Quick Brief was therefore generated and QA-accepted rather than inventing an audio path or reusing Full Audio.

Authoritative Quick generation workflow run:

- Run: `33631138398`
- Artifact ID: `9846885883`
- Artifact SHA-256: `f0a37152576282c5874fb80dde288470249ddbff95895aae02f06a0b10f3749f`
- Manifest version: `DC_K06_QUICK_AUDIO_V1`
- Accepted: `1`
- Failed: `0`
- Duration: `334.296 s` (`5:34`)
- Source words: `592`
- Transcript words: `590`
- Word-count ratio: `0.9966`
- Transcript similarity: `0.9036`
- Tail score: `0.875`

Accepted Quick Audio was published from the accepted artifact without regeneration:

- Quick pipeline PR: `#34`
- Quick pipeline merge commit: `9ba8ae18e984c538c036e3caed619eaaa68198cd`
- Quick publish PR: `#35`
- Quick publish workflow run: `33631857377`
- Generate job during publish: `SKIPPED`
- Publish verification: `PASS_QUICK_1_OF_1 334.296`
- Production merge commit: `dd2b75cd3e6809dd2618dd6b6b65b41909268362`

Quick Brief and Full Briefing remain separate production modes and separate audio artifacts.

---

## 5. Full Briefing chapter freeze

1. `K06-00` — UPS neden sadece bir cihaz değildir? — `244.584 s`
2. `K06-01` — VFI, VI, VFD, double conversion, bypass ve operating modes — `256.560 s`
3. `K06-02` — Redundancy, fault current, generator compatibility ve selectivity — `250.200 s`
4. `K06-03` — Autonomy nasıl gerçekten boyutlandırılır? — `244.296 s`
5. `K06-04` — VRLA, lithium-ion, NiCd, flywheel ve supercapacitor — `288.816 s`
6. `K06-05` — BMS, battery safety, thermal runaway ve lifecycle — `287.184 s`
7. `K06-06` — UPS battery, BESS, grid interaction ve AI power smoothing — `260.544 s`
8. `K06-07` — Commissioning, maintenance, TCO ve hangi mimari ne zaman? — `241.512 s`

Exact file names and acceptance metrics are authoritative in the production manifest.

---

## 6. Golden engineering conclusion

The accepted K06 model treats UPS architecture as a critical-load continuity state machine rather than a device count or isolated battery-sizing exercise.

The frozen decision chain is:

`CRITICAL LOAD → SOURCE STATES → UPS FUNCTIONAL CLASS → POWER PATH / BYPASS → STORED-ENERGY TECHNOLOGY → AUTONOMY STATE CHAIN → PROTECTION / BMS / SAFETY → GENERATOR & COOLING RECOVERY → BESS BOUNDARY → COMMISSIONING → LIFECYCLE → FREEZE`

Key distinctions that must remain explicit:

- UPS power capacity and stored-energy capacity are different engineering quantities;
- N+1 UPS modules do not prove end-to-end redundancy when bypass, output bus, controller, battery bus, source or downstream distribution is shared;
- static bypass is not maintenance bypass and neither automatically creates a second independent facility power path;
- VFI / VI / VFD behavior is more precise than relying only on marketing labels such as online, line-interactive or standby;
- autonomy is not equal to generator engine-start time; source stabilization, qualification, transfer, rectifier acceptance, cooling/TCS recovery and contingency reserve belong in the same state chain;
- VRLA, lithium-ion, NiCd, flywheel and supercapacitor have different power, energy, temperature, lifecycle, serviceability and safety behaviors;
- lithium-ion acceptance is a system-level decision involving chemistry, module/cabinet construction, BMS, propagation behavior, ventilation/fire strategy and tested UPS integration;
- UPS battery and grid-interactive BESS are related but not identical control objectives;
- external grid/BESS services must not consume resilience reserve without explicit governance;
- AI/high-density loads require attention to load steps, power smoothing, generator interaction, recharge behavior and thermal continuity;
- commissioning must exercise normal, stored-energy, generator, bypass, maintenance, module-loss, battery/BMS-loss, common-control and return-to-normal states rather than only perform a static load test.

---

## 7. Golden UI freeze

The accepted K06 decision visuals are:

1. UPS & Stored-Energy System Boundary
2. Technology Fit Matrix
3. Autonomy Is a State Chain
4. State-Based UPS Commissioning

Quick Brief and Full Briefing remain separate modes.

The existing shared Full Player is reused without a K06-specific player fork. The K06 UI integration did not modify the shared player file.

K06 must continue to satisfy the accepted shared-player contract:

- Quick and Full playback are mutually exclusive;
- starting Full pauses Quick;
- starting Quick closes/pauses Full before Quick Media Session ownership is applied;
- chapter previous/next, seek, speed, pause/resume and auto-next remain supported;
- module-specific progress remains persistent;
- Media Session metadata/handlers belong to the actively playing mode;
- K01–K05 accepted behavior must not be regressed while changing K06 or later modules.

Golden UI integration evidence:

- UI PR: `#36`
- UI merge commit: `f5fab8b8f411b83d15b6d7c5b8bfbe33c5596c90`
- UI diff scope: K06 bootstrap + K06 data + K06 UI + Knowledge Library index wiring only
- Shared Full Player modified by K06 UI integration: `NO`

---

## 8. Deployment acceptance

GitHub Pages run:

`33632875072`

Acceptance result:

- Pages build: `SUCCESS`
- report-build-status: `SUCCESS`
- Pages deploy: `SUCCESS`
- production `main` source parity: `PASS`
- exact Full chapter duration sum: `2073.696 s`
- Quick Brief production duration: `334.296 s`
- Quick production path: `audio/production/tr/dc-k06-quick-v1/k06-quick-ups-ve-enerji-depolamada-dogru-karar-cercevesi.mp3`
- Full production manifest path: `audio/production/tr/dc-k06-v2/manifest.json`
- shared Full Player unchanged by K06 UI integration
- K06 roadmap entry promoted into active Golden module at runtime

Acceptance does not claim a physical desktop-browser, Android Media Session lock-screen or other physical-device test. Device-level behavior must only be claimed after it has actually been exercised in the corresponding browser/device environment.

KAYAS maintenance/build workflow failures that were independently auto-triggered by repository pushes are outside this acceptance scope and were not modified as part of K06.

---

## 9. Reusable Golden standard

DC-K06 preserves and extends the Golden production standard established by K01–K05. Future modules should preserve these controls unless a justified architecture-level revision explicitly supersedes them:

- vendor-neutral deep research before narration;
- primary/authoritative evidence hierarchy;
- explicit separation of FACT / ENGINEERING GUIDANCE / VENDOR CLAIM / SPECBRIDGE INTERPRETATION / DECISION GUIDANCE;
- canonical taxonomy and explicit system/interface boundaries;
- decision matrices, state models and failure-mode analysis rather than prose-only explanation;
- separate Quick Brief and Full Briefing modes;
- chaptered S3F long-form Turkish narration;
- source-contract QA before paid TTS execution;
- transcript similarity, word-count ratio, nonzero audio integrity and tail-completeness QA;
- selective failed-chapter regeneration only;
- accepted artifact publishing without TTS regeneration;
- exact manifest-driven UI metadata;
- isolated module adapters where possible to reduce regression surface;
- shared player behavior preserved across Golden modules;
- successful Pages build/deploy plus production source parity before freeze;
- physical-device claims withheld unless physically tested;
- authoritative source corrections preserved as part of the accepted evidence set rather than silently rewriting unrelated research.

---

## 10. Scope protection

This freeze applies only to the Data Center Knowledge Library DC-K06 workstream.

It does not authorize changes to KAYAS, DCTS or unrelated SpecBridge runtime/workflows. Existing K01–K05 Golden states remain authoritative and must not be rolled back by future work.

---

## 11. Next gate

`DC-K07 — Facility & Building Architecture — Golden Deep Research`

K07 shall start from the accepted main branch and follow the frozen Golden production standard.