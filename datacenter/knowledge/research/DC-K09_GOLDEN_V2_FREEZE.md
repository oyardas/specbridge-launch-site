# DC-K09 — Accelerated Compute / GPU / DPU — Golden V2 Freeze

**Authoritative marker:** `DC_K09_GOLDEN_V2 = ACCEPTED`  
**Freeze date:** 2026-09-02  
**Module:** DC-K09 — Accelerated Compute / GPU / DPU  
**State:** Golden V2 accepted and frozen  
**Next gate:** DC-K10 — Virtualization & Containers — Golden Deep Research

---

## 1. Acceptance statement

DC-K09 is accepted as a Golden V2 Knowledge Library module. The accepted scope combines vendor-neutral deep research, an independently produced Quick Brief, an eight-chapter Full Briefing, transcript/audio QA, selective retry of only the failed Full chapter, publish-without-regeneration, modular Golden UI integration, production-source parity and successful GitHub Pages build/deploy.

This freeze does not certify physical desktop, mobile, Android lock-screen or other real-device playback behavior. No physical-device playback test was performed in this gate. The accepted UI boundary is source/code-path verification plus production parity plus successful Pages deployment.

---

## 2. Research acceptance

Canonical research file:

`datacenter/knowledge/research/DC-K09_ACCELERATED_COMPUTE_GPU_DPU.md`

Research baseline:

- 193 numbered sections (`0–192`)
- 30 classified sources
- 20 FMEA seeds
- vendor-neutral accelerator taxonomy and decision model
- GPU, AI ASIC, FPGA, DPU, IPU and SmartNIC role boundaries
- HBM capacity/bandwidth and delivered-performance distinctions
- CPU/NUMA locality, PCIe, CXL and UCIe integration
- OCP OAI/OAM and accelerator module/baseboard topology
- scale-up versus scale-out architecture
- DPU/IPU infrastructure offload and direct-data paths
- passthrough, SR-IOV, partitioning, Kubernetes Device Plugins and DRA
- scheduling and observability
- rack power, thermal and liquid-cooling coupling
- failure analysis, acceptance, BoQ and TCO/lifecycle
- eight-chapter Full Briefing plan

Research PR:

- PR #52 — `Add DC-K09 Golden deep research`
- merge commit: `f6438deed65fe2fd9dc2e7261ac4437e9922e0ef`

Canonical distinctions frozen by this module include:

- `GPU ≠ DPU ≠ IPU ≠ SmartNIC ≠ FPGA ≠ custom AI ASIC`
- `accelerator compute ≠ infrastructure offload`
- `device memory capacity ≠ device memory bandwidth`
- `peak arithmetic throughput ≠ delivered application throughput`
- `PCIe generation ≠ negotiated end-to-end capability`
- `CXL standard availability ≠ deployed platform capability`
- `scale-up ≠ scale-out`
- `peer-to-peer path ≠ guaranteed collective efficiency`
- `GPU partitioning ≠ node-level HA`
- `virtual function ≠ dedicated physical failure domain`
- `DPU ≠ ordinary NIC`
- `dual accelerator fabric ≠ end-to-end path independence`
- `rack power capacity ≠ application performance`
- `liquid-ready facility ≠ validated accelerator thermal solution`

Vendor architectures remain examples/references and are not promoted to universal standards.

---

## 3. Full Narration and Full Audio acceptance

Narration source:

`datacenter/knowledge/narration/DC-K09_FULL_NARRATION_TR_V2.md`

Pipeline PR:

- PR #53 — `Add DC-K09 Golden narration and audio pipeline`
- merge commit: `9e9b96ab2063552107b50c81bc783925c554b7c6`

Accepted generation run:

- workflow run: `33658883327`
- artifact ID: `9858196632`
- artifact name: `datacenter-knowledge-dck09-golden-audio-tr-v2`
- artifact size: `34,227,586 bytes`
- artifact digest: `sha256:547156a192a8da9a007a36428376785cab4859bc4050222f0a609e588bef0dd6`
- source QA: PASS
- exact chapter set: `K09-00` through `K09-07`
- normalized source words: `3,911`
- accepted chapters: `8/8`
- failed chapters after final acceptance: `0`
- total accepted duration: `2220.072 seconds`
- display duration: `37:00`

Accepted chapter metrics:

| Chapter | Duration | Transcript similarity | Tail score | Final attempt |
|---|---:|---:|---:|---:|
| K09-00 | 284.520 s | 0.9021 | 1.000 | 1 |
| K09-01 | 284.352 s | 0.9497 | 1.000 | 1 |
| K09-02 | 287.520 s | 0.9360 | 1.000 | 1 |
| K09-03 | 275.208 s | 0.9051 | 1.000 | 1 |
| K09-04 | 276.312 s | 0.9341 | 0.750 | 1 |
| K09-05 | 275.880 s | 0.9484 | 0.875 | 1 |
| K09-06 | 255.984 s | 0.9338 | 1.000 | 1 |
| K09-07 | 280.296 s | 0.9405 | 0.750 | 2 |

K09-07 failed its first audio attempt and was selectively regenerated. The other seven accepted chapters were preserved and were not regenerated.

The Full Audio production assets were published from the already accepted artifact without TTS regeneration:

- PR #54 — `[PUBLISH AUDIO] DC-K09 Golden v2 accepted 8/8`
- merge commit: `791873bebe80f8a9292f91b7e75eba28145a12e3`
- publish source run: `33658883327`
- permanent manifest: `datacenter/knowledge/audio/production/tr/dc-k09-v2/manifest.json`

---

## 4. Quick Brief acceptance

Quick narration source:

`datacenter/knowledge/narration/DC-K09_QUICK_NARRATION_TR_V1.md`

Quick pipeline PR:

- PR #55 — `Add DC-K09 independent Quick Brief pipeline`
- merge commit: `73d1af68940f6f0ece7d91563ad0cbd16038d43c`

Accepted Quick generation:

- workflow run: `33660667794`
- artifact ID: `9858633918`
- artifact name: `datacenter-knowledge-dck09-quick-audio-tr-v1`
- artifact size: `5,899,244 bytes`
- artifact digest: `sha256:1e865a86d7fdbefea150ab26e9b794602cc115e67df1aac1f79ef9dfae6a097c`
- source words: `690`
- accepted: `1/1`
- failed: `0`
- duration: `379.488 seconds`
- display duration: `6:19`
- transcript words: `689`
- word-count ratio: `0.9986`
- transcript similarity: `0.9471`
- tail score: `1.000`

The accepted Quick Brief was published without regeneration:

- PR #56 — `[PUBLISH QUICK] DC-K09 accepted 1/1`
- merge commit: `7162f0204c37fb81c3922fa121b20cd91181ecaf`
- publish source run: `33660667794`
- permanent manifest: `datacenter/knowledge/audio/production/tr/dc-k09-quick-v1/manifest.json`

Quick Brief and Full Briefing remain distinct assets and distinct user modes.

---

## 5. Golden UI acceptance

Golden UI PR:

- PR #57 — `Promote DC-K09 to Golden UI`
- merge commit: `58cc3da22a3d7316286b85e583baf52931adf7de`

Accepted modular integration files:

- `datacenter/knowledge/golden-module-k09-bootstrap.js`
- `datacenter/knowledge/golden-module-k09-data.js`
- `datacenter/knowledge/golden-module-k09-ui.js`
- `datacenter/knowledge/index.html`

Core `knowledge.js`, the shared Full Player, CSS and K01-K08 Golden adapters/renderers were not modified by the K09 UI promotion.

Accepted K09 decision visuals:

1. Accelerator Role Stack
2. Data-Movement Topology
3. Scale-Up vs Scale-Out Matrix
4. GPU / DPU Responsibility Matrix
5. Accelerator Acceptance Chain

Accepted production metadata:

- module status: `golden-v2-live`
- research: `193` sections / `30` classified sources
- Quick QA: `1/1 PASS`, `6:19`
- Full QA: `8/8 PASS`, `37:00`
- aggregate UI status after promotion: `9` Golden modules, `72/72` Full Brief QA, `9` Quick Brief audio assets
- next roadmap module after promotion: `DC-K10 — Virtualization & Containers`

Pages acceptance for the UI merge:

- Pages run: `33663197279`
- merge/head commit: `58cc3da22a3d7316286b85e583baf52931adf7de`
- build: SUCCESS
- deploy: SUCCESS
- report-build-status: SUCCESS

Production source parity was verified on `main` after deployment for the K09 bootstrap, data adapter, renderer and index wiring.

---

## 6. Frozen Golden rule

`WORKLOAD → SOFTWARE / PRECISION → HBM CAPACITY / BANDWIDTH → HOST / NUMA → PCIe / CXL → SCALE-UP → NIC / DPU / STORAGE → SCALE-OUT → SHARING / SCHEDULING → POWER / THERMAL → FAILURE TEST → REPRESENTATIVE BENCHMARK → TCO / LIFECYCLE → BoQ FREEZE`

This chain is the reusable K09 engineering contract. Accelerator infrastructure must not be frozen from GPU count, headline FLOPS/TOPS, HBM capacity, PCIe generation or rack power alone.

---

## 7. Regression and scope boundary

K09 acceptance does not reopen or modify the accepted K01-K08 Golden modules. KAYAS and DCTS remain separate workstreams and are explicitly outside this freeze.

Push-triggered KAYAS workflow failures observed during Knowledge Library deployments are not K09 acceptance failures because the K09 scope did not change KAYAS files. No KAYAS remediation is authorized by this freeze.

Physical desktop/mobile/Android lock-screen playback remains outside the verified acceptance boundary unless a separate real-device test is performed.

---

## 8. Final status

`DC_K09_GOLDEN_V2 = ACCEPTED`

**Program progress after merge:** `9 / 50 complete`  
**Remaining:** `41`  
**Ready for next gate:** YES  
**Next gate:** `DC-K10 — Virtualization & Containers — Golden Deep Research`
