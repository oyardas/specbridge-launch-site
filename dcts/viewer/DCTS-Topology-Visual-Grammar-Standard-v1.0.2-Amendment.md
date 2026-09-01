# DCTS Topology Visual Grammar Standard — v1.0.2 Amendment

**Document ID:** DCTS-VISUAL-STD-002-AMEND-002  
**Parent:** DCTS-VISUAL-STD-002 v1.0.0  
**Version:** v1.0.2  
**Date:** 2026-09-01  
**Status:** CONTROLLED AMENDMENT

## Change rationale

A stale presentation projection could remain visible after the viewer changed to a non-presentation mode, causing the previous topology canvas to visually cover the current view. This was observed while switching KAYAS views in ENGINEERING mode.

## Controlled change

1. The shared topology projection SHALL be visible only when the current hash mode is `PRESENTATION`.
2. On transition to any other mode, the projection SHALL be hidden immediately and any standard object-focus scene SHALL be closed.
3. On return to `PRESENTATION`, the projection SHALL remain hidden until the shared runtime has rendered the topology for the current `view` value; a stale previous-view projection SHALL NOT be exposed during the transition.
4. The lifecycle control is project-neutral and SHALL apply equally to all projects using the shared DCTS runtime.
5. This amendment changes presentation/runtime lifecycle only. It SHALL NOT mutate canonical objects, relationships, evidence, findings, information status, or project package data.

## Runtime implementation

`/dcts/viewer/runtime/dcts-viewer-topology-standard-view-lifecycle-v1a2.js`

## Affected rollout

- KAYAS preview: T00–T06
- Haven Healthcare preview: T00–T08

## Change classification

Compatible visual/runtime correction; no schema change and no topology semantic change.
