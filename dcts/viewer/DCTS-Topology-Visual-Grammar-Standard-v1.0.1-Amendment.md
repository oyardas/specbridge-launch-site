# DCTS Topology Visual Grammar Standard — v1.0.1 Amendment

**Document ID:** DCTS-VISUAL-STD-002-A01  
**Parent Standard:** DCTS-VISUAL-STD-002 v1.0.0  
**Version:** v1.0.1  
**Date:** 2026-09-01  
**Status:** CONTROLLED AMENDMENT  

## Change 1 — Missing status safety

A missing object or relationship information-status value SHALL NOT be rendered as `CONFIRMED`.

When the canonical package does not encode status, the presentation renderer SHALL use a neutral `STATUS NOT ENCODED` treatment. This amendment changes presentation only; it does not write status back into the package.

## Change 2 — Package-driven service segmentation

When a T02 package explicitly provides multiple service-model objects through structured project metadata (for example `extensions.service_model.service_code`), the shared renderer MAY subdivide the workload/service lane into separate visual service segments.

This segmentation is permitted only when the package itself carries the service grouping. It SHALL NOT be inferred from commercial best practice or invented to complete the diagram.

Where service segmentation is absent from the package, the normal vendor-neutral T02 workload/service lane remains in effect.

The renderer may also co-locate explicitly encoded AI/high-density objects into a dedicated AI/high-density visual segment when those objects are already present in the current view. This is presentation grouping only and does not assert fabric technology, bandwidth, cooling method or physical placement.

## Runtime Amendment

```text
dcts/viewer/runtime/dcts-viewer-topology-standard-status-safety-v1a1.css
dcts/viewer/runtime/dcts-viewer-topology-standard-status-safety-v1a1.js
dcts/viewer/runtime/dcts-viewer-topology-standard-service-segmentation-v1a1.js
```

## Semantic Guardrails

- No canonical object mutation.
- No canonical relationship mutation.
- No missing status promoted to confirmed.
- No presentation grouping converted into topology semantics.
- No hard-coded project object IDs in shared runtime.
- Presentation intents remain `NOT CANONICAL`.

## Revision Record

| Version | Date | Change rationale |
|---|---|---|
| v1.0.1 | 2026-09-01 | Preserve the accepted multi-service KAYAS T02 visual structure using package-driven metadata while correcting missing-status rendering so absence of evidence is never displayed as confirmation. |
