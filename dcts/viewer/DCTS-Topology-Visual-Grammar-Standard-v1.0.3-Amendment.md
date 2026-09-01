# DCTS Topology Visual Grammar Standard — v1.0.3 Amendment

**Document ID:** DCTS-VISUAL-STD-002-A03  
**Parent:** DCTS-VISUAL-STD-002  
**Version:** v1.0.3  
**Date:** 2026-09-01  
**Status:** CONTROLLED AMENDMENT — PRODUCTION PROMOTION

## 1. Change rationale

The topology-first visual grammar and its lifecycle/status-safety controls completed human preview validation for KAYAS and Haven Healthcare. This amendment defines controlled promotion from preview-only usage to stable production topology endpoints without changing canonical project objects, relationships, evidence or validation findings.

## 2. Production endpoint rule

The shared DCTS topology runtime remains project-neutral. A project may expose the accepted runtime through a stable production endpoint while retaining its own authentication, investor shell and navigation entry points.

Approved production topology endpoints for this amendment:

- **KAYAS:** `/kayas/topology/`
- **Haven Healthcare:** `/haven-healthcare/topology/`

Preview endpoints remain available for development/acceptance validation and are not the primary production entry point after promotion.

## 3. KAYAS promotion

`/kayas/topology/` SHALL load the accepted shared DCTS viewer package through the KAYAS project fixture and SHALL preserve the KAYAS outer authentication/theme shell.

Legacy `K00` entry SHALL map to canonical DCTS `T00` Overview / Navigation Map. Existing T00–T06 view hashes SHALL remain valid.

The previous production shell is retained as a rollback artifact:

`/kayas/topology/index-pre-dcts-topology-standard-v1.0.2.html`

## 4. Haven Healthcare promotion

The Haven Healthcare investor application remains the primary investor shell. Engineering topology selections T00–T08 SHALL route to:

`/haven-healthcare/topology/`

The production topology endpoint SHALL use the Haven canonical DCTS package and the same shared topology runtime used during preview acceptance.

The investor shell itself is not replaced by this amendment.

## 5. View lifecycle requirement

Presentation projection layers MUST NOT remain visible when:

- the viewer switches to ENGINEERING mode;
- another view becomes active;
- object focus is closed or invalidated;
- a production route is changed.

The shared lifecycle control remains mandatory for all production topology endpoints.

## 6. Semantic guardrails

Production promotion does not authorize any semantic inference. Specifically:

- canonical objects are not created or modified by the visual runtime;
- canonical relationships are not created or modified by layout or routing;
- missing ports, speeds, A/B paths, VLAN/VRF/VNI, optics, rack positions, management paths, storage paths, backup paths or HA relationships remain `OPEN-CONFIRMATION REQUIRED` unless evidence exists;
- presentation grouping is non-semantic;
- design/presentation intent remains `NOT CANONICAL`;
- missing information status must not be rendered as `CONFIRMED`.

## 7. Promotion acceptance

Promotion is complete only after:

1. production endpoint deployment succeeds;
2. KAYAS T00–T06 mode/view transition smoke test passes;
3. Haven T00–T08 route and return smoke test passes;
4. no stale projection is visible outside PRESENTATION mode;
5. no regression is observed in Inspector, evidence, findings, print or return behavior.

## 8. Revision history

| Version | Date | Change rationale |
|---|---|---|
| v1.0.3 | 2026-09-01 | Promote accepted project-neutral topology visual grammar to stable KAYAS and Haven production topology endpoints while preserving project shells and semantic guardrails. |
