# DCTS Viewer Standard

**Document ID:** DCTS-VIEWER-STD-001  
**Version:** v1.0.0-rc.1  
**Date:** 2026-08-31  
**Status:** WP1 FROZEN / CONTROLLED BASELINE  
**Work Package:** V1-WP1 — Shared Viewer Architecture & Visual Standard Freeze  
**Approval:** Explicit user approval on 2026-08-31  
**Change rationale:** Standardize the strongest KAYAS/DCTS engineering model with the stronger Haven Healthcare presentation UX into one reusable cross-project viewer standard.

## 1. Purpose

DCTS Viewer v1.0 defines a reusable, vendor-neutral presentation and engineering viewer for DCTS topology models. The viewer must render multiple projects from the same canonical data and relationship contracts without project-specific renderer logic.

The initial cross-project fixtures are:

- KAYAS — Golden Reference for canonical DCTS object, relationship, evidence, validation and traceability semantics.
- Haven Healthcare — Reference for investor-oriented visual shell, readable topology presentation, multilingual narration and print/export usability.

The standard SHALL combine the KAYAS/DCTS engineering discipline with the Haven presentation strengths. It SHALL NOT copy project-specific data models, product names, coordinates or assumptions into the standard.

## 2. Core Design Decision

**DCTS Core semantics are authoritative. DCTS Viewer is a rendering layer.**

The viewer SHALL NOT mutate canonical topology facts. It SHALL consume a project package and produce synchronized views.

```text
DCTS Canonical Model
  ├─ Objects
  ├─ Relationships
  ├─ Evidence / Sources
  ├─ Validation Findings
  └─ Information Status
          ↓
DCTS View Model
          ↓
DCTS Viewer v1.0
          ↓
Presentation Mode / Engineering Mode / Export
```

## 3. Standard View Set

| ID | Standard Name | Purpose |
|---|---|---|
| T00 | Overview / Navigation Map | Master project navigation and architecture overview. |
| T01 | Executive Architecture | Investor, executive and management architecture story. |
| T02 | Network Logical | Logical network, fabric, segmentation and logical service context. |
| T03 | Physical Connectivity | Evidence-supported physical devices, ports, links, speeds, media and A/B paths only. |
| T04 | Compute / HCI / Storage | Compute, HCI, hypervisor and storage platform architecture. |
| T05 | Management / OOB / Operations | OOB, BMC, NMS, DCIM, analytics, monitoring and operations. |
| T06 | Service / Tenant | Cloud/service/tenant and workload relationships. |
| T07 | Security | Security boundaries, controls, policy zones and protection relationships. |
| T08 | Backup / DR | Backup, repositories, replication, recovery and DR architecture. |

Extension views:
- T09 — AI / GPU Fabric
- T10 — Multi-site / DR

A project MAY omit a standard view when the project package contains no supported content for that view. Omission SHALL be explicit; the viewer SHALL NOT invent content to populate an empty view.

## 4. Standard Application Shell

The default desktop shell SHALL use a three-region layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ Project / DCTS       T00 T01 ... T08          Mode / Actions │
├────────────────┬─────────────────────────────┬───────────────┤
│ Narrative /    │                             │ Inspector /   │
│ View Summary   │       TOPOLOGY CANVAS       │ Evidence /    │
│ Findings       │                             │ Traceability  │
└────────────────┴─────────────────────────────┴───────────────┘
```

### 4.1 Header
The header SHALL provide project identity, viewer version, T-view navigation, Presentation/Engineering mode control, optional language/narration controls, print/export actions, and project return navigation when configured.

### 4.2 Left Narrative Panel
Presentation Mode SHALL prioritize view purpose, executive/investor narrative, key architecture messages, and controlled open/design items. Engineering Mode MAY expose filters, validation summaries and engineering navigation.

### 4.3 Topology Canvas
The canvas SHALL preserve hierarchy, avoid overlap under supported viewport classes, distinguish relationship semantics, support selection/navigation, and never imply facts absent from the canonical model.

### 4.4 Inspector
The inspector SHALL expose:
1. **Overview** — role, domain, object type, vendor/model metadata and investor meaning.
2. **Engineering** — relationships, attributes, validation findings and open confirmations.
3. **Evidence & Traceability** — source file, BoQ line, source revision, status, confidence and canonical identifiers.

## 5. Viewer Modes

### 5.1 Presentation Mode
- light/default professional theme;
- high legibility and whitespace;
- minimal canonical identifiers;
- simplified relationship labels;
- narrative panel;
- print/PDF support;
- optional controlled watermark;
- optional narration.

### 5.2 Engineering Mode
- canonical IDs;
- relationship type and status;
- evidence and traceability;
- validation findings;
- unresolved confirmations;
- supported relationship attributes;
- engineering warnings remain visible.

Both modes SHALL render from the same project package and canonical graph.

## 6. Information-Status Visual Grammar

| Information Status | Standard Visual Treatment |
|---|---|
| CONFIRMED | Solid primary relationship / normal object treatment. |
| CUSTOMER INPUT | Solid or controlled secondary treatment with explicit source badge. |
| VENDOR PROPOSAL | Blue dashed relationship / proposal badge. |
| WORKING ASSUMPTION | Purple dashed relationship / assumption badge. |
| OPEN-CONFIRMATION REQUIRED | Amber dashed treatment / open-confirmation badge. |
| SUPERSEDED | Greyed/dimmed and excluded from current active topology by default. |

Exact theme colors MAY vary for accessibility, but semantic differentiation SHALL remain unambiguous.

## 7. Relationship Visual Grammar

Relationship type and information status are independent dimensions. Standard relationship types SHALL include at least:

CONNECTS_TO, UPLINKS_TO, DOWNLINKS_TO, MANAGED_BY, OOB_MANAGED_BY, MEMBER_OF, PROTECTED_BY, CONTROLS, MONITORS, STORES_DATA_FOR, BACKS_UP, REPLICATES_TO, PROVIDES_SERVICE_TO.

Presentation styling SHALL distinguish physical connectivity, logical/service relationships, management/OOB relationships, service flow, and redundant A/B paths only when explicitly evidenced.

A physical-looking line SHALL NOT be used for a logical or management relationship if it could be interpreted as an asserted cable/path.

## 8. Project Package Contract

Minimum package resources:

```text
project-config.json
objects.json
relationships.json
evidence.json
findings.json
views.json
```

Optional resources:

```text
narratives.json
translations.json
official-resources.json
theme.json
assets/
```

The renderer SHALL contain no project-specific SKU, customer, domain-coordinate or credential logic.

## 9. Layout Contract

Layout is presentation metadata, not canonical evidence. A project MAY supply group ordering, preferred columns, visual lane, section priority and normalized X/Y hints. Layout metadata SHALL NOT be interpreted as rack position, room position, physical adjacency or connectivity evidence unless separately confirmed in the canonical model.

The renderer SHOULD prefer automatic/group-based layout over absolute project-specific coordinates. Explicit coordinates MAY be used only as controlled presentation metadata.

## 10. Interaction Contract

The viewer SHALL support section click → correct T-view; object click → target T-view + selected canonical object; keyboard activation; contextual hover/focus; deep-link state; refresh restoration; browser back/forward restoration; responsive re-fit; Escape to close focus; and reduced-motion preference.

## 11. Language and Narration

UI strings SHALL be externalizable. Project narratives MAY provide per-language text. Narration SHALL use provided narrative text and browser/system speech capabilities when enabled. Missing translation SHALL fall back to the project default language and SHALL NOT fabricate translated technical content.

## 12. Print / Export Contract

Minimum output behavior:
- current view print;
- all-view print deck;
- browser Save as PDF compatibility;
- SVG/PNG export integration point;
- PPTX export integration point through DCTS export adapters.

Watermarking SHALL be controlled by project configuration.

## 13. Evidence Safety

The viewer SHALL NEVER silently invent connections, ports, bandwidth, VLAN/VRF/VNI, IP addresses, optics/media, rack/room placement, HA membership, OOB relations, storage paths, management paths or DR relationships.

Missing information SHALL surface as OPEN-CONFIRMATION REQUIRED when relevant.

## 14. Initial Cross-Project Migration Rules

### KAYAS
- Preserve the accepted canonical graph and evidence model.
- Preserve confirmed/open/proposed semantics.
- Migrate through a preview first.
- Do not alter production until cross-view acceptance passes.

### Haven Healthcare
- Preserve source-supported physical/logical relationships.
- Convert project-specific HN/HT arrays into DCTS project-package objects and relationships.
- Treat existing coordinates as presentation hints only.
- Map RECOMMENDED and DESIGN_TO_FINALIZE through explicit adapter rules; do not silently relabel them.

## 15. WP1 Acceptance Result

V1-WP1 was explicitly approved on 2026-08-31. The following are frozen as the controlled baseline:

1. Shared renderer architecture.
2. T00–T08 standard view set and T09/T10 extension policy.
3. Presentation / Engineering dual-mode contract.
4. Three-region application shell.
5. Evidence/status visual grammar.
6. Shared inspector structure.
7. Project package boundary between data and renderer.
8. Layout-as-presentation-metadata rule.
9. Interaction/deep-link contract.
10. Print/language/narration capability boundaries.
11. KAYAS and Haven migration rules.
12. No project-specific data inside the shared renderer.

Changes to these frozen decisions require a controlled revision with rationale; they SHALL NOT be silently overwritten during WP2 or implementation.

## 16. Next Work Package

**V1-WP2 — Canonical Project Package Schema & Adapter Mapping**

WP2 defines machine-readable package schemas and explicit KAYAS/Haven adapter mappings. Runtime shared-viewer implementation SHALL not begin until the WP2 contract is reviewed and approved.

## Revision History

| Version | Date | Change | Rationale |
|---|---|---|---|
| v1.0.0-draft.1 | 2026-08-31 | Initial shared viewer standard draft | Combine DCTS/KAYAS engineering rigor with Haven presentation UX. |
| v1.0.0-rc.1 | 2026-08-31 | WP1 approved and frozen | Establish controlled architecture and visual-standard baseline before canonical package schema work. |
