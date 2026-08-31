# DCTS Display Terminology Standard

**Document ID:** DCTS-TERM-001  
**Version:** v1.0.0  
**Date:** 2026-08-31  
**Status:** CONTROLLED STANDARD  
**Approval:** Explicit user approval on 2026-08-31  
**Scope:** Cross-project DCTS presentation, narration, inspector, print and export terminology.

## 1. Purpose

DCTS shall preserve vendor-neutral canonical engineering semantics while presenting infrastructure objects with terminology that is immediately understandable to technical and non-technical users.

Display terminology is a presentation normalization layer. It SHALL NOT change canonical object IDs, object types, functional roles, evidence, vendor/model fields or relationship semantics.

## 2. General Rule

Where a common infrastructure acronym is technically correct but may be ambiguous to a customer, investor or general IT audience, DCTS SHOULD display the canonical term together with its widely understood functional name.

Format:

`Canonical term / Common functional term`

The canonical engineering term remains authoritative in Engineering Mode and machine-readable exports.

## 3. ADC / Load Balancer Standard

| Context | DCTS Standard |
|---|---|
| Canonical object type | `ADC` |
| Canonical functional role | `SECURITY.ADC.*` |
| Presentation label — single logical/device instance | `ADC / Load Balancer` |
| Presentation label — redundant pair | `ADC / Load Balancer Pair` |
| Engineering explanatory label | `Application Delivery Controller (ADC / Load Balancer)` |
| Accepted source aliases | `ADC`, `Application Delivery Controller`, `Load Balancer`, `LB`, `Application Load Balancer` |

### 3.1 Normalization rule

A source object identified as an Application Delivery Controller or enterprise load-balancing appliance SHALL remain canonically typed as `ADC` when that is the supported DCTS classification. Presentation surfaces SHALL use `ADC / Load Balancer` so that the load-balancing function is explicit.

### 3.2 Redundancy rule

The word `Pair` SHALL only be shown when the source/evidence or controlled project model supports a redundant two-instance pair. DCTS SHALL NOT infer HA membership merely from quantity unless the project model explicitly treats the two units as a pair.

### 3.3 Vendor neutrality

The display label SHALL NOT contain vendor branding. Vendor and model remain separate metadata fields. Example:

- Display label: `ADC / Load Balancer Pair`
- Vendor: `H3C`
- Model: `SecPath L5000-AD520-G`

## 4. Viewer Behavior

Presentation Mode SHALL prefer the standard display label.

Engineering Mode SHALL expose both the standard display label and the canonical technical classification/role.

Hover/focus detail, narration, inspector titles, T-view cards, print output and presentation exports SHOULD use the same normalized display label.

## 5. Adapter / Ingestion Behavior

Project adapters SHOULD recognize accepted aliases and map them to the canonical DCTS type without rewriting source evidence. The original source term MAY be retained in source metadata or legacy references for traceability.

## 6. Backward Compatibility

Existing canonical IDs and role strings SHALL NOT be renamed solely for display terminology normalization. Legacy project packages that contain `ADC Pair` remain structurally valid; the Viewer MAY normalize the presentation label at render time.

## 7. Initial Adoption

KAYAS is the first reference adoption. The existing H3C SecPath L5000-AD520-G pair remains canonically `ADC` / `SECURITY.ADC.ADC`, while the user-facing label is standardized to `ADC / Load Balancer Pair`.

Future DCTS project packages and viewers SHALL follow this rule unless an approved project-specific terminology profile explicitly overrides it.

## Revision History

| Version | Date | Change | Rationale |
|---|---|---|---|
| v1.0.0 | 2026-08-31 | Established ADC / Load Balancer presentation terminology | Make a technically correct acronym immediately understandable without changing canonical semantics. |
