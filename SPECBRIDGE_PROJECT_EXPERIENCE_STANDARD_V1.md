# SpecBridge Project Experience Standard v1.0

**Status:** CURRENT CROSS-PROJECT STANDARD  
**Effective date:** 2026-09-01  
**Reference implementations:** KAYAŞ Data Center, Haven Healthcare  
**Prepared / metadata author:** Önder Yardaş

## 1. Objective

A new infrastructure project must be instantiated from a reusable Project Experience Standard rather than designed as a new website from zero. Project identity, engineering facts and commercial narrative change; the information architecture, interaction model, data governance, mobile behavior, evidence boundary, theme behavior and acceptance discipline remain standardized.

## 2. Minimum project intake

The preferred starting package is:

1. **Geometry / plan source** — DWG preferred; DXF, IFC, PDF plan or dimensioned image can be used as fallback/companion formats when required by tooling or drawing quality.
2. **Configuration / BoQ** — equipment list, quantities, model/SKU, capacity and relevant commercial/service allocation.
3. **General project information** — owner/site, objective, scope, phase, rooms/zones, design targets, known constraints and confirmed assumptions.

Useful optional inputs include official datasheets, RFP/specification documents, rack/room schedules, cable schedules, service model, branding, preferred languages, photos/renders and existing topology drawings.

## 3. Project Package

Each new project should produce a reusable package containing at minimum:

```text
<project>/
  data/<project>-project-data.json     # canonical investor-facing facts
  architecture navigator              # project-prefix 00 master map
  engineering topology graph          # T00–Txx views
  official resources / evidence map
  project theme adapter
  project shell / navigation state
  mobile architecture mode
  print / confidentiality rules
  optional 3D / walkthrough modules
```

Project-specific code prefixes may differ (for example K00 and H00), while `T00–Txx` remains the engineering-view convention.

## 4. Canonical-data rule

Active project surfaces must consume one authoritative current project-data model wherever practical. Portal, topology, service/commercial views, investor guide, 3D overlays, mobile views and narration must not maintain independent current quantities.

Runtime normalization is a safety guard, not a substitute for maintaining clean source data.

## 5. Experience architecture

### Desktop

`WHY | WHAT / HOW | DETAIL / EVIDENCE`

- WHY — narrative, recommendation, risk, decision context
- WHAT / HOW — interactive topology and semantic flow
- DETAIL / EVIDENCE — selected-object facts, quantity, BoQ/reference/status

### Mobile

Topology-first layout with a fixed navigation dock and bottom-sheet access to:

- Why
- Details / Evidence
- Controls
- Fit / reset

Touch targets should be approximately 42–48 px where practical. Portrait must remain usable; landscape may be recommended for dense engineering views but must not be required for basic navigation.

## 6. Semantic topology and motion

Relationship meaning must be visually explicit. Typical semantic families are:

- confirmed / service
- management / OOB
- recommended / design
- future / design-to-finalize
- backup / replication
- security boundary

Motion should carry information rather than exist only as decoration. Flow, design paths, labels and evidence controls should be available when supported. `prefers-reduced-motion` must be respected.

## 7. Theme standard

Every new Project Experience is theme-switchable.

- Each project declares a **Project Default Theme** appropriate to its identity.
- User choices are **Light**, **Dark** and **System**.
- The selected preference is persisted under the shared SpecBridge project-theme preference so it can follow the user across compatible project experiences.
- If the user has never selected a preference, the project default applies.
- Switching theme must not require page reload.
- Project identity must survive theme switching; theme adapters use semantic project tokens rather than generic color inversion.
- 3D scene lighting/physical material appearance is not automatically inverted. Theme switching applies primarily to navigation, controls, overlays and information panels unless a scene-specific design explicitly supports both.
- Print/PDF output remains print-safe/light regardless of interactive theme unless a deliverable explicitly requires another treatment.

Reference defaults:

- KAYAŞ — Dark
- Haven Healthcare — Light

## 8. Language and state

Project language choices persist where provided. Navigation state, selected engineering view and compatible user preferences should survive normal page changes and reloads. Product names, model numbers and engineering identifiers are not mechanically translated.

## 9. Evidence boundary

Official manufacturer resources establish product/reference metadata unless stronger project evidence confirms selection. Confirmed project facts, consultant recommendations, design assumptions and items requiring final engineering must remain distinguishable.

## 10. Print / confidentiality

Investor-facing print/PDF should use a controlled print layout, preserve project confidentiality markings where required and retain author attribution when part of the project standard.

## 11. DWG-to-experience workflow

A normal new-project workflow is:

1. ingest DWG/plan and identify floors, rooms, zones, dimensions and major infrastructure areas;
2. ingest configuration/BoQ and normalize equipment/quantity/capacity records;
3. reconcile drawing geometry with project facts and flag unresolved contradictions;
4. create canonical project-data model;
5. generate master architecture navigator;
6. generate/validate T00–Txx engineering views and semantic relationships;
7. connect evidence and official resources;
8. instantiate investor narrative, mobile mode, selectable theme and print behavior;
9. optionally create 3D/walkthrough from validated geometry and zone data;
10. run desktop/mobile/theme/print/data-consistency acceptance before production deployment.

If a DWG cannot be reliably interpreted by the available runtime or lacks usable layers/geometry, request/export a DXF, IFC or dimensioned PDF companion rather than guessing geometry.

## 12. Change control

For an existing project, a change should normally update the canonical facts/model first, then propagate through the standard experience layers. Production source must be fresh-read before writes. Controlled branch review, stale-value checks, syntax/source integrity, mobile/theme regression and non-force deployment are the preferred release discipline.

## 13. Reuse rule

A similar new project should not begin with the question “what should the site look like?”. It should begin with “what is the project package, canonical data and project-specific identity that instantiate this standard?”.
