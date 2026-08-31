# DCTS Project Package Schema

**Document ID:** DCTS-VIEWER-WP2-SCHEMA-001  
**Version:** v1.0.0-draft.1  
**Date:** 2026-08-31  
**Status:** REVIEW REQUIRED  
**Work Package:** V1-WP2 — Canonical Project Package Schema & Adapter Mapping

## 1. Purpose

Define the machine-readable resource contract consumed by DCTS Viewer v1.0 and its future export adapters. The schema separates canonical engineering facts from presentation metadata.

## 2. Required Resources

| Resource | Schema | Purpose |
|---|---|---|
| package-manifest.json | `schema/package-manifest.schema.json` | Package identity, revision and resource integrity references. |
| project-config.json | `schema/project-config.schema.json` | Project/viewer configuration without canonical topology facts. |
| objects.json | `schema/objects.schema.json` | Canonical topology objects. |
| relationships.json | `schema/relationships.schema.json` | Canonical explicit relationships. |
| evidence.json | `schema/evidence.schema.json` | Source and evidence register. |
| findings.json | `schema/findings.schema.json` | Validation/open-design findings. |
| views.json | `schema/views.schema.json` | View membership, layout hints, navigation and non-canonical presentation intents. |

Optional resources such as narratives, translations, official resources, themes and assets remain external to the canonical graph.

## 3. Canonical vs Presentation Boundary

Canonical resources:

- objects.json
- relationships.json
- evidence.json
- findings.json

Presentation/view resources:

- views.json
- narratives/translations
- theme/assets

`views.json.presentation_intents` is explicitly non-canonical. A viewer SHALL never promote these records into canonical relationships.

## 4. Null / Missing Data Rule

Fields are optional unless required by schema. Missing engineering data SHALL remain absent or null. Producers SHALL NOT invent placeholder values such as `TBD-1`, `AUTO`, fake ports, synthetic bandwidth or assumed A/B paths merely to satisfy rendering.

Where a missing item itself is an engineering concern, it belongs in `findings.json` with `OPEN-CONFIRMATION REQUIRED`.

## 5. Traceability Rule

Every object/relationship that depends on evidence SHOULD carry `source_refs`. `evidence.json` preserves source file, source revision and optional BoQ line/locator.

A renderer may hide traceability in Presentation Mode, but may not discard it from the project package.

## 6. Identity Rule

IDs are project-scoped canonical identifiers. Presentation layout, object labels or theme changes SHALL NOT regenerate IDs.

Legacy source keys may be retained under `legacy_refs` or `extensions` during migration.

## 7. Relationship Attribute Rule

`relationships.attributes` is sparse by design. Port, speed, quantity, media, optics, path role, VLAN, VRF, VNI and bandwidth are populated only when supported by evidence for that specific relationship.

A relationship may be logically confirmed while some or all physical attributes remain absent.

## 8. Layout Rule

Normalized X/Y hints, lane and order values in `views.json` are presentation metadata only. They must not populate canonical location fields unless separate evidence confirms the location.

## 9. Information Status Rule

Allowed values are:

- CONFIRMED
- VENDOR PROPOSAL
- CUSTOMER INPUT
- WORKING ASSUMPTION
- OPEN-CONFIRMATION REQUIRED
- SUPERSEDED

Legacy status values are never silently coerced. Adapter mappings define explicit resolution behavior.

## 10. Security Boundary

Credentials, passwords, API keys, tokens and customer secrets are outside the project-package contract. Authentication belongs to the hosting/application boundary, not topology data.

## 11. Versioning

Current schema contract: `1.0.0-draft.1`.

WP2 approval will freeze the field semantics. Later compatible additions may move to `1.0.x`; breaking package-shape changes require controlled major/minor revision according to DCTS document control.

## 12. Next Gate

After WP2 approval, create deterministic KAYAS and Haven package fixtures and validate cross-project semantic equivalence before shared renderer implementation.

## Revision History

| Version | Date | Change | Rationale |
|---|---|---|---|
| v1.0.0-draft.1 | 2026-08-31 | Initial canonical project-package schema contract | Separate reusable viewer input from project-specific runtime structures. |
