# Haven Healthcare Experience Standard v1.0

**Status:** CURRENT PROJECT EXPERIENCE STANDARD  
**Effective date:** 2026-09-01  
**Canonical project data:** `/haven-healthcare/data/haven-project-data.json`  
**Prepared / metadata author:** Önder Yardaş

## 1. Experience objective

Haven Healthcare shall present one integrated digital-hospital architecture experience rather than a collection of isolated topology screens. Its default presentation remains light, clinical and clarity-oriented. The information architecture follows the common SpecBridge model: investor narrative, master architecture, progressive engineering drill-down and evidence.

## 2. H00 Master Architecture

H00 is the project-experience navigation layer above the existing engineering views.

- H00 — Master Architecture
- H01 — Executive Architecture
- H02 — Network Logical
- H03 — Physical Connectivity
- H04 — Compute / HCI / Storage
- H05 — Management / OOB
- H06 — Healthcare Services
- H07 — Security
- H08 — Backup / DR
- H09 — Evidence & Official Resources

Existing T00–T08 identifiers remain valid engineering-view identifiers and are not replaced by H-codes.

## 3. Three-panel reading model

Architecture experiences must answer three questions simultaneously:

- **WHY** — investor narrative, clinical/operational rationale and design boundary
- **WHAT / HOW** — interactive topology and semantic infrastructure flows
- **DETAIL / EVIDENCE** — selected-object properties, quantities, official references and design status

Progressive disclosure is preferred over showing all engineering detail at once.

## 4. Semantic relationship controls

The existing relationship model is preserved and standardized:

- Confirmed/service relationship — teal solid
- Management / OOB — purple dashed
- Recommended/design path — blue dashed
- Design-to-finalize — amber dashed

The user must be able to control Flow, Design Paths, Labels and Evidence. Motion must respect `prefers-reduced-motion`.

## 5. Canonical project-data rule

Current investor-facing quantities represented in the experience are centralized in `/haven-healthcare/data/haven-project-data.json`, including:

- 2 campus-core switches
- 26 active + 2 spare access switches
- 7 preliminary IDFs
- 2 WLAN controllers
- 104 active + 6 spare Wi-Fi 7 APs
- 2 data-center fabric switches
- 4 HCI nodes
- 3 PACS storage nodes
- 1 backup system
- 2 OOB switches
- 140 CCTV endpoints
- 50 IPTV endpoints

The runtime canonical layer normalizes active Haven topology objects against this source. Existing `nodes.js`, topology data and official-resource data remain engineering/source inputs; the canonical project-data file is the investor-facing quantity baseline.

## 6. Evidence boundary

Official manufacturer URLs establish product/reference metadata only. They do not by themselves prove final project selection. Confirmed facts, recommended paths and design-to-finalize items must remain visually distinct.

## 7. Language architecture

English, Turkish and Dhivehi are preserved. Language choice should persist between page reloads. Technical product names and engineering identifiers are not mechanically translated.

## 8. Readability

Investor narrative, callouts, inspector text and official-reference links should be readable on a standard desktop display without browser zoom. Technical identifiers may remain smaller than descriptive content.

## 9. Theme standard

Haven Healthcare declares **Light** as its Project Default Theme, but the active Project Experience supports **Light**, **Dark** and **System** user modes.

- The user choice is persistent and uses the shared SpecBridge project-theme preference.
- If the user has never selected a preference, Haven opens in Light.
- Theme changes are applied without page reload.
- The Dark theme must preserve the clinical/healthcare information hierarchy rather than becoming a generic dark dashboard.
- Theme switching applies to H00, T00–T08, inspector/evidence panels and mobile bottom sheets.
- Print/PDF remains print-safe/light and retains the confidentiality watermark and author attribution.

## 10. Print / confidentiality

Existing print/PDF behavior is retained. Investor-print output must preserve the `specbridge.co - confidential` watermark and the `Önder Yardaş` attribution.

## 11. Change control

New investor-facing Haven surfaces should consume the canonical runtime and follow H00/H-code navigation, progressive disclosure, semantic controls, persistent language/theme state and evidence-boundary conventions unless a documented technical constraint requires an exception.

## 12. Mobile Architecture Mode

At phone/tablet breakpoints, Haven uses a topology-first mobile interaction model rather than compressing the desktop three-panel layout.

- The central topology remains visible and receives the majority of screen area.
- WHY, DETAIL/EVIDENCE and controls move into bottom sheets.
- Selecting a topology node opens the Details sheet automatically.
- Flow, Design Paths, Labels, Evidence, Narration, Print, Theme and EN/TR/DV language controls remain accessible through mobile proxy controls backed by the existing desktop/native controls.
- A Fit action re-renders the active engineering view into its default framing.
- H00 Master Architecture becomes a compact one/two-column card map depending on available width.
- Desktop sidebars and dense action bars are hidden on small screens; information is not discarded, only progressively disclosed.
- Touch targets should be approximately 42–44 px or larger where practical.
- Portrait mode may show a non-blocking landscape suggestion; rotation is optional.
- `viewport-fit=cover`, safe-area insets and `prefers-reduced-motion` must be supported.
