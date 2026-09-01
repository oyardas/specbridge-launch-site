# KAYAS Experience Standard v1.0

**Status:** CURRENT PROJECT EXPERIENCE STANDARD  
**Effective date:** 2026-09-01  
**Canonical project data:** `/kayas/data/kayas-project-data.json`  
**Prepared / metadata author:** Önder Yardaş

## 1. Experience objective

KAYAS shall present one integrated project experience rather than a collection of unrelated pages. The presentation layer remains dark, premium and infrastructure-oriented, while the information architecture follows a common SpecBridge model: executive narrative, architecture navigation, progressive technical drill-down and evidence.

## 2. Common project shell

Active investor-facing KAYAS surfaces must provide consistent navigation between:

- Overview / Investor Portal
- K00 Master Architecture / DCTS
- Service Models
- Investor Guide
- 3D Experience

The shell must preserve project context and language state.

## 3. K00 Master Architecture

K00 is the non-destructive master navigation layer above DCTS engineering views.

- K00 — Master Architecture
- K01 — Facility & Building
- K02 — Power Infrastructure
- K03 — Cooling Infrastructure
- K04 — Network & Connectivity
- K05 — Compute / HCI / Storage
- K06 — Cloud & Service Platform
- K07 — Security
- K08 — Backup / DR
- K09 — AI / High-Density
- K10 — Service Models

DCTS T00–T10 identifiers remain valid engineering view identifiers and are not replaced by K-codes.

## 4. Three-panel architecture reading model

Architecture experiences should answer three questions at the same time:

- **WHY** — narrative, recommendation, risks, decision context
- **WHAT / HOW** — interactive topology and semantic flows
- **DETAIL / EVIDENCE** — selected-object properties, status, BoQ/evidence/reference context

Progressive disclosure is preferred over presenting all engineering detail at once.

## 5. Semantic relationship motion

Motion must carry information rather than serve only as decoration.

- Confirmed relationship — solid cyan
- Management / OOB — purple dashed
- Design path — blue dashed
- Future / open path — amber dashed
- Backup / replication — green animated where encoded
- Security boundary — red / controlled where encoded

User controls must be available for Flow, Design Paths, Labels and Evidence where the architecture viewer supports those layers. `prefers-reduced-motion` must be respected.

## 6. Readability

Investor and engineering views may remain information-dense, but micro-text should be avoided where practical. Narrative and inspector text must be readable on normal desktop displays without browser zoom. Technical identifiers can remain smaller than descriptive content.

## 7. Canonical project-data rule

The current cabinet and service baseline is:

- 200 standard IT cabinets
- 10 additional AI / high-density IT cabinets
- 210 total IT cabinets
- 2.00 MW current working design IT load
- 40 IaaS / Cloud Platform standard cabinets
- 80 Managed Colocation standard cabinets
- 80 Customer-Managed Colocation standard cabinets

These values must be consumed from `/kayas/data/kayas-project-data.json` on active production surfaces whenever technically practical. Runtime stale-value normalization is a safety net, not the preferred authoring model.

## 8. Language architecture

English and Turkish share one persistent language state. Where a dedicated localized page exists, changing language should retain the same page position/hash where practical. Technical product names and DCTS identifiers are not translated mechanically.

## 9. Theme rule

KAYAS remains a dark, premium infrastructure experience. The common SpecBridge interaction standard does not require visual identity to match other projects such as Haven Healthcare; common information architecture and interaction behavior are shared, not project-specific visual styling.

## 10. Change-control

Any new KAYAS investor-facing page should use the common canonical runtime, common navigation pattern and motion/accessibility conventions unless a documented technical reason requires an exception.

## 11. Mobile Architecture Mode

At phone/tablet breakpoints, the desktop three-panel architecture must transform into a topology-first mobile experience rather than merely shrinking the desktop layout.

- The topology remains the primary viewport.
- WHY, DETAIL/EVIDENCE and controls are exposed through a bottom-sheet pattern.
- Selecting a topology node on mobile opens the Details sheet automatically.
- Flow, Design Paths, Labels and Evidence remain controllable through mobile proxy controls backed by the existing native state.
- A Fit action must restore the active topology view to a readable default framing.
- Touch targets should be approximately 42–44 px or larger where practical.
- Portrait mode may show a non-blocking recommendation to rotate for maximum topology area; landscape is not mandatory.
- Existing DCTS pan/zoom behavior must remain authoritative rather than introducing a second mobile topology engine.
- The standalone 3D experience must use viewport-safe controls, horizontally scrollable toolbars where necessary and mobile-sized touch targets.
- `viewport-fit=cover`, safe-area insets and `prefers-reduced-motion` must be supported.
