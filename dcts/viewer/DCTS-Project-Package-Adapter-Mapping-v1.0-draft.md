# DCTS Project Package Adapter Mapping

**Document ID:** DCTS-VIEWER-WP2-MAP-001  
**Version:** v1.0.0-draft.1  
**Date:** 2026-08-31  
**Status:** REVIEW REQUIRED  
**Work Package:** V1-WP2 — Canonical Project Package Schema & Adapter Mapping

## 1. Purpose

Define the explicit migration contract from the current KAYAS and Haven Healthcare data structures into the DCTS Viewer v1.0 project package. This document is an adapter specification, not a runtime implementation.

The adapter SHALL preserve source semantics and SHALL NOT create missing facts in order to satisfy the target schema.

## 2. Package Resources

Required project-package resources:

- `project-config.json`
- `objects.json`
- `relationships.json`
- `evidence.json`
- `findings.json`
- `views.json`

Package integrity is described by `package-manifest.json`.

Optional resources remain project-controlled: narratives, translations, official resources, theme and assets.

## 3. Cross-Project Invariants

1. `object_id` is stable within a project and SHALL survive presentation/view changes.
2. Canonical relationships and presentation intents are different record classes.
3. `relationship.type` and `relationship.status` are independent.
4. Missing physical attributes SHALL remain absent/null; they are not defaulted.
5. Layout hints SHALL never be interpreted as physical placement evidence.
6. Legacy values SHALL be retained in `legacy_refs` or `extensions` when they cannot be losslessly represented.
7. Adapter uncertainty SHALL be emitted as `OPEN-CONFIRMATION REQUIRED`, not silently normalized.
8. Existing unresolved reconciliation items SHALL remain unresolved unless higher-priority evidence explicitly closes them.

## 4. KAYAS Adapter

### 4.1 Source role

KAYAS is the canonical-semantics Golden Reference. Its accepted graph remains authoritative during migration.

Controlled baseline to preserve:

- 19 canonical objects.
- 5 confirmed logical/service relationships.
- 0 confirmed physical relationships.
- architecture intents (`AINT-*`) are not canonical graph edges.

### 4.2 Object mapping

Current KAYAS topology objects map one-to-one into `objects.json`:

| Existing concept | DCTS package field |
|---|---|
| canonical topology object ID (`topobj_*`) | `object_id` |
| object display name | `display_name` |
| DCTS domain | `domain` |
| canonical role | `functional_role` |
| class/type | `object_class` / `object_type` |
| vendor | `vendor` |
| model | `model` |
| SKU | `sku` |
| quantity | `quantity` |
| accepted object status | `status` |
| source references | `source_refs` |

The adapter SHALL NOT generate new IDs merely to conform to the viewer package.

### 4.3 Relationship mapping

The five accepted KAYAS relationships map one-to-one into `relationships.json`. Their current logical/service semantics remain `CONFIRMED`.

No relationship with `layer=PHYSICAL` may be generated from KAYAS unless new evidence is approved.

The current confirmed set to preserve is:

1. CAS Virtualization Hosts → CAS Virtualization Platform — `MANAGED_BY`.
2. CloudOS Management Hosts → CloudOS Platform — `HOSTS`.
3. Management Host Cluster → AD-DC / SeerEngine-DC — `HOSTS`.
4. Management Host Cluster → SeerAnalyzer — `HOSTS`.
5. Backup Appliance → AnyBackup 7.0 Platform — `HOSTS`.

### 4.4 Architecture intents

`AINT-*` records SHALL migrate only to `views.json[].presentation_intents`.

They SHALL NOT appear in `relationships.json` unless an independent controlled design decision promotes the underlying claim to a canonical relationship.

### 4.5 Findings and reconciliation

Existing validation findings migrate to `findings.json` with their severity, affected object/view scope and current information status preserved.

The AnyBackup manufacturer reconciliation SHALL remain open:

- current normalized project object vendor value is preserved;
- conflicting official-manufacturer evidence is retained in evidence/findings;
- migration SHALL NOT silently overwrite the canonical vendor field.

## 5. Haven Healthcare Adapter

### 5.1 Source role

Haven is the presentation-UX reference fixture. Its current project-specific `HN` node arrays and `HT` topology arrays are migration inputs, not standard data structures.

### 5.2 `HN` node tuple mapping

Current Haven node tuples are interpreted as:

```text
HN[legacy_key] = [
  domain,
  display_name,
  model_or_description,
  quantity_text,
  investor_text_en,
  investor_text_tr,
  official_resource_links
]
```

Mapping:

| HN index | DCTS destination | Rule |
|---|---|---|
| legacy key | `object_id` source | Generate stable project-prefixed ID once; retain legacy key in `legacy_refs`. |
| 0 | `domain` | Map through explicit domain mapping; do not accept unsupported domain strings silently. |
| 1 | `display_name` | Preserve text. |
| 2 | `model` / `description` | Split only when product identity is unambiguous; otherwise preserve full text in `description`. |
| 3 | `quantity` | Preserve textual quantity when not losslessly numeric. |
| 4 | narratives EN | Move to optional `narratives.json`. |
| 5 | narratives TR | Move to optional `narratives.json`. |
| 6 | official resources | Move to optional `official-resources.json`; link back via object ID. |

### 5.3 Haven explicit domain/role mapping

The following migration mapping is controlled for the current fixture:

| Legacy key | DCTS domain | Functional role | Object class |
|---|---|---|---|
| ISP_SERVICES | EXTERNAL | EXTERNAL.CARRIER_SERVICE | EXTERNAL_NETWORK |
| NGFW_HA | SECURITY | SECURITY.FIREWALL | CLUSTER |
| CAMPUS_CORE | NETWORK | NETWORK.CORE | CLUSTER |
| ACCESS_LAYER | NETWORK | NETWORK.ACCESS | CLUSTER |
| IDF_ESTATE | NETWORK | NETWORK.DISTRIBUTION_FACILITY | FACILITY_ELEMENT |
| WLAN_CONTROLLERS | NETWORK | NETWORK.WLAN_CONTROLLER | CLUSTER |
| WIFI_AP_ESTATE | NETWORK | NETWORK.WLAN_ACCESS | CLUSTER |
| DC_FABRIC | NETWORK | NETWORK.DC_FABRIC | CLUSTER |
| HCI_CLUSTER | HCI | HCI.CLUSTER | CLUSTER |
| PACS_STORAGE | STORAGE | STORAGE.CLINICAL | CLUSTER |
| BACKUP_TIER | BACKUP | BACKUP.REPOSITORY | PHYSICAL_DEVICE |
| DR_TARGET | DR | DR.TARGET | LOGICAL_SERVICE |
| OOB_PAIR | OOB | NETWORK.OOB_SWITCH | CLUSTER |
| UCENTER | MONITORING | OPERATIONS.NMS | MANAGEMENT_SYSTEM |
| ADCAMPUS | MANAGEMENT | OPERATIONS.CAMPUS_MANAGEMENT | MANAGEMENT_SYSTEM |
| SERVER_DC_ZONE | SERVICE | SERVICE.APPLICATION_PLATFORM | LOGICAL_SERVICE |
| CLINICAL_ZONE | SERVICE | SERVICE.CLINICAL | LOGICAL_SERVICE |
| PACS_RIS_ZONE | SERVICE | SERVICE.IMAGING | LOGICAL_SERVICE |
| IOMT_ZONE | SERVICE | SERVICE.IOMT | LOGICAL_SERVICE |
| STAFF_WIFI_ZONE | SERVICE | SERVICE.STAFF_MOBILITY | LOGICAL_SERVICE |
| GUEST_WIFI_ZONE | SERVICE | SERVICE.GUEST_ACCESS | LOGICAL_SERVICE |
| BMS_OT_ZONE | SERVICE | SERVICE.BMS_OT | LOGICAL_SERVICE |
| NURSE_CALL_ZONE | SERVICE | SERVICE.NURSE_CALL | LOGICAL_SERVICE |
| CCTV_ZONE | SERVICE | SERVICE.CCTV | LOGICAL_SERVICE |
| ACCESS_CTRL_ZONE | SERVICE | SERVICE.ACCESS_CONTROL | LOGICAL_SERVICE |
| CORPORATE_ZONE | SERVICE | SERVICE.CORPORATE | LOGICAL_SERVICE |
| VOICE_IPTV_ZONE | SERVICE | SERVICE.VOICE_IPTV | LOGICAL_SERVICE |

These are adapter mappings for the Haven fixture. They do not automatically expand the universal taxonomy; taxonomy changes require controlled taxonomy revision.

### 5.4 Haven object status resolution

The current `HN` tuple does not carry DCTS information status. Therefore the adapter SHALL resolve object status from traceable evidence rather than assign `CONFIRMED` merely because a node exists in the visualization.

Rules:

- explicit approved/customer/project evidence → corresponding DCTS status;
- official vendor documentation proves product capability/identity only, not project selection;
- when project-selection provenance is not recoverable → `OPEN-CONFIRMATION REQUIRED`;
- preserve the legacy node regardless of unresolved status so migration remains traceable.

### 5.5 `HT.r` canonical relationship mapping

Current Haven `HT.r` entries have the logical shape:

```text
[ from_key, to_key, legacy_relation_class, label, evidence_note ]
```

Adapter rules:

- `from_key` / `to_key` resolve through the Haven object-ID map.
- `legacy_relation_class=MANAGEMENT` maps to DCTS management/OOB semantics according to endpoints.
- `legacy_relation_class=SERVICE` is not itself an information status. Relationship type/layer must be derived from the stated relationship claim and evidence.
- attributes such as `4 × 100G`, `16 × 25G`, `12 × 25G` may be populated only for the specific relationship where the existing evidence note explicitly supports them.
- an abstract architecture relationship may be confirmed while detailed physical port mapping remains open; the adapter SHALL not manufacture port/interface values.

Current Haven source-supported relationships include the campus/access architecture, campus-core to data-center fabric 100G uplinks, HCI-to-fabric 25G links, PACS-to-fabric 25G links and dedicated OOB management relationships. Each must retain its source note/evidence reference during conversion.

### 5.6 `HT.p` presentation/design path mapping

Current Haven `HT.p` records are presentation/design paths and SHALL NOT be promoted automatically to `relationships.json`.

They migrate to `views.json[].presentation_intents` first.

Legacy status handling:

| Haven legacy status | Default DCTS migration | Rationale |
|---|---|---|
| RECOMMENDED | OPEN-CONFIRMATION REQUIRED | `RECOMMENDED` does not identify whether the authority is vendor, customer, approved design or working assumption. Preserve legacy status until provenance is reconciled. |
| DESIGN_TO_FINALIZE | OPEN-CONFIRMATION REQUIRED | Explicitly unresolved design state. |

If evidence later proves a recommendation is an approved customer decision, vendor proposal or working assumption, the DCTS status may be changed through a controlled reconciliation record. The adapter SHALL preserve `legacy_status` during that change.

### 5.7 View mapping

Haven already implements T00–T08. These IDs map directly into the DCTS standard view set.

Current absolute coordinates in `HT.v` become normalized `views.json.layout.object_hints` only. They SHALL be marked presentation metadata and SHALL NOT populate location/rack fields.

### 5.8 Language, narration, print and credentials

- Haven English/Turkish/Dhivehi narratives migrate to optional narrative/translation resources.
- Narration capability is project configuration; voice selection remains runtime presentation behavior.
- Print/watermark configuration migrates to project config/theme.
- Authentication credentials SHALL NOT be part of the DCTS project package or shared renderer.

## 6. ID Strategy

### KAYAS
Existing `topobj_*`, relationship and finding IDs remain unchanged.

### Haven
A stable adapter-generated ID SHALL be persisted on first conversion, e.g. `haven_obj_<stable-hash>`. The legacy key remains in `legacy_refs`. The same source key SHALL always resolve to the same canonical ID for the same project namespace.

## 7. Evidence Priority During Adapter Reconciliation

When mappings conflict, use DCTS evidence priority:

1. latest explicit user decision;
2. latest approved project design;
3. latest official vendor documentation;
4. current BoQ/BoM;
5. existing HLD/topology;
6. verified engineering inference;
7. generic architecture practice.

Lower-priority evidence SHALL NOT silently replace a higher-priority explicit decision.

## 8. Adapter Validation Gates

A converted package SHALL fail validation when:

- duplicate object or relationship IDs exist;
- relationship endpoints do not resolve;
- a physical relationship lacks evidence for the asserted physical claim;
- unsupported status values are silently coerced;
- view layout coordinates appear in canonical location fields without evidence;
- a presentation intent is emitted as a confirmed relationship without promotion evidence;
- project-specific credentials are found in the package;
- KAYAS canonical counts change during viewer-only migration without an approved model revision.

## 9. WP2 Deliverable Boundary

WP2 defines the contract and mappings only. It does not yet replace KAYAS or Haven production viewers and does not start the shared renderer runtime.

After WP2 approval, the next package should create deterministic adapter fixtures for KAYAS and Haven and validate them against these schemas before building the shared viewer.

## Revision History

| Version | Date | Change | Rationale |
|---|---|---|---|
| v1.0.0-draft.1 | 2026-08-31 | Initial KAYAS/Haven adapter mapping | Establish loss-aware cross-project conversion into the DCTS Viewer v1.0 package contract. |
