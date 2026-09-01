# DC-K01 Golden V2 — Acceptance & Freeze

**Program:** SpecBridge Data Center Knowledge Library  
**Module:** DC-K01 — Data Center Hizmet Modelleri  
**Acceptance marker:** `DC_K01_GOLDEN_V2 = ACCEPTED`  
**Freeze date:** 2026-09-01  
**Production branch:** `main`

## Authoritative production state

- Quick Brief remains the short-form S3F narration and is preserved as a separate mode.
- Full Briefing is live as an 8-chapter S3F narration set.
- Full Briefing production QA: 8 accepted / 0 failed.
- Full Briefing duration: 2042.256 seconds (~34:02).
- Quick and Full playback are separate player modes with explicit ownership handoff.
- Final Quick/Full handoff was merged through PR #8.
- Accepted handoff merge commit: `f24dd8d7f6462d7cab3f4327f2673518c1966c81`.
- GitHub Pages run `33556365472`: build = SUCCESS; deploy = SUCCESS.

## Quick / Full handoff acceptance

### Full → Quick

Accepted implementation behavior:

- Full player authority is cleared before Full pause propagation.
- Full playback is paused when Quick playback becomes authoritative.
- Full player is closed.
- Quick player metadata and Media Session handlers are restored.
- Media Session playback state is explicitly restored to Quick playback.
- Full player playback-state writes are gated while Full is not authoritative, preventing a stale Full pause event from overwriting Quick state.

### Quick → Full

Accepted implementation behavior:

- Quick audio is paused before / when Full playback becomes authoritative.
- Quick player is closed.
- Full chapter player becomes authoritative.
- Full chapter Media Session metadata and action handlers are installed.
- Previous / next chapter, seek, play / pause and playback-rate code paths remain present.

## Desktop / code-path acceptance

Validated against the production JavaScript now on `main`:

- DC-K01 requires exactly 8 Full chapters before Full player activation.
- Chapter selection is wired for all 8 chapter rows.
- Previous chapter / next chapter handlers are present.
- ±15 second seek and global seek-bar handling are present.
- Playback speed handling is present.
- Pause / resume handling is present.
- Full → Quick and Quick → Full mutual-exclusion paths are present.
- Media Session previous / next / seek handlers are present for Full mode and are cleared / reassigned for Quick mode as appropriate.
- JavaScript syntax validation passed for the accepted production file.

## Mobile / Media Session acceptance boundary

Code-path validation is accepted for:

- Media Session metadata ownership.
- play / pause.
- previous / next chapter in Full mode.
- seek backward / forward.
- Quick / Full ownership handoff.
- prevention of stale Full playback state after switching to Quick.

Physical Android / Chrome lock-screen execution was **not** performed in this acceptance environment and must not be represented as device-level validation.

## Public deployment boundary

The accepted merge produced a successful GitHub Pages build and deploy. The production `datacenter/knowledge/index.html` loads:

- `knowledge-data.js`
- `knowledge.js`
- `dck01-full-player.js`

The production data declares DC-K01 as Golden V2 live with Quick Audio live, Full Audio live, Full QA 8/8 PASS and eight chapter assets.

Direct interactive audio playback and physical mobile lock-screen behavior are outside this non-device acceptance environment; no claim is made beyond source, integration, deployment and code-path validation.

## Frozen Golden standard

The following DC-K01 patterns are frozen as the reusable Golden Module standard for DC-K02 through DC-K05:

1. research structure
2. evidence hierarchy
3. authoritative source register
4. professional engineering / investor visual architecture style
5. decision and comparison matrices
6. distinct Quick Brief vs Full Briefing modes
7. chaptered S3F Full Briefing audio
8. transcript / semantic / tail QA pipeline
9. permanent accepted audio assets
10. player ownership and handoff behavior
11. mobile / Media Session code-path design
12. Golden Module presentation structure
13. vendor-neutral architecture language
14. explicit separation of fact, engineering guidance, vendor claim, SpecBridge interpretation and decision guidance

## Next gate

Proceed without another approval to:

**DC-K02 — Veri Merkezi Tipleri & Modülerlik — Golden Deep Research**

DC-K02 must reuse this frozen Golden standard. Research quality precedes narration and audio production.