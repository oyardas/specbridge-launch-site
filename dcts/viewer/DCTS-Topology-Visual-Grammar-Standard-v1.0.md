# DCTS Topology Visual Grammar Standard

**Document ID:** DCTS-VISUAL-STD-002  
**Version:** v1.0.0  
**Date:** 2026-09-01  
**Status:** CONTROLLED / APPROVED BASELINE  
**Scope:** Shared DCTS topology presentation grammar for KAYAS, Haven Healthcare and future project packages  
**Approval:** Explicit user approval on 2026-09-01  
**Supersedes:** Project-specific v1a15/v1a16 topology-first presentation tuning as the reusable visual baseline  
**Change rationale:** Convert the accepted topology-first KAYAS mockup direction into a vendor-neutral, project-neutral standard and apply the same grammar across all supported DCTS views without changing canonical semantics.

## 1. Purpose

This standard defines how DCTS topology views SHALL look and behave when rendered from canonical DCTS project packages. It standardizes the visual hierarchy accepted during the KAYAS topology review while preserving the DCTS evidence, status, traceability and drill-down model.

The target is:

> topology readability of a conventional engineering diagram + DCTS evidence discipline + interactive inspector/drill-down.

The visual grammar is a rendering contract only. It SHALL NOT create or alter canonical objects, relationships, quantities, evidence, findings, ports, bandwidth, VLAN/VRF/VNI, IP addressing, optics, rack/room placement, HA membership, OOB paths, storage paths or DR relationships.

## 2. Authoritative Principles

1. **Topology-first, not card-first.** The topology canvas SHALL make architectural hierarchy and relationship flow readable before detailed metadata.
2. **Evidence-before-aesthetics.** Missing connectivity SHALL remain missing. A visually incomplete graph is preferable to an invented link.
3. **Project-neutral renderer.** Project IDs, customer names, SKUs and absolute coordinates SHALL NOT be embedded in the shared runtime.
4. **One canonical graph, multiple synchronized views.** T00-T10 are projections of the same underlying model.
5. **Layout is non-semantic.** Zone placement, lane placement, X/Y position and spacing are presentation metadata only.
6. **Progressive disclosure.** Canvas nodes stay compact; vendor/model/source/BoQ/evidence details belong in Inspector or object focus.
7. **Status and relationship semantics are independent dimensions.** Relationship type controls semantic color; information status controls line treatment/badge.

## 3. Standard Node Language

The default presentation node SHALL contain only:

- functional icon;
- display name;
- canonical functional role;
- information-status indicator;
- represented quantity when encoded.

Vendor, model, SKU, BoQ line, source revision, confidence and detailed attributes SHALL be exposed through Inspector / Engineering / Evidence & Traceability views rather than permanently occupying the topology canvas.

### 3.1 Node categories

- physical device;
- logical fabric/service;
- cluster/group;
- security control/boundary;
- management/operations system;
- external/provider context when explicitly present in the view model;
- tenant/service object.

No visual node may imply a physical device when the underlying object is a logical service or context.

## 4. Standard Zone and Hierarchy Language

Views SHALL use broad visual zones or lanes to communicate architecture hierarchy. Zones are derived from DCTS domains/roles and current-view composition, not from invented physical placement.

Typical semantic zone families:

- EXTERNAL / CARRIER / EDGE;
- SECURITY;
- NETWORK / FABRIC;
- COMPUTE / HCI;
- STORAGE;
- CLOUD / SERVICE / TENANT;
- BACKUP / DR;
- MANAGEMENT / OOB / MONITORING / DCIM / OPERATIONS.

Zone backgrounds SHALL be low-saturation and subordinate to nodes and relationships.

## 5. Relationship Visual Grammar

### 5.1 Semantic color

| Semantic family | Standard treatment |
|---|---|
| Network / data | Blue |
| Service / application | Teal |
| Management / OOB | Purple |
| Security / protection | Red |
| Backup / DR | Green |
| Presentation / design intent | Amber |
| Context / reference only | Neutral grey |

### 5.2 Information-status line treatment

| Information status | Treatment |
|---|---|
| CONFIRMED | Solid, normal visual weight |
| CUSTOMER INPUT | Solid secondary treatment with status visible in Inspector |
| WORKING ASSUMPTION | Dashed, reduced opacity |
| VENDOR PROPOSAL | Dashed, reduced opacity |
| OPEN-CONFIRMATION REQUIRED | Fine dashed/dotted, reduced opacity |
| SUPERSEDED | Excluded from active topology by default or clearly dimmed when explicitly requested |

### 5.3 Presentation intent

Presentation/design intent SHALL:

- remain visually lighter than canonical relationships;
- be amber and dashed;
- expose tooltip/status text including **NOT CANONICAL**;
- never be promoted to a canonical relationship by the renderer.

## 6. Standard View Grammar

### T00 — Overview / Navigation Map
Use domain-level architecture bands. Optimize for orientation and drill-down, not port/device detail.

### T01 — Executive Architecture
Use a small number of architectural tiers: external/edge/security, digital infrastructure/platform, service/operations. Keep canonical identifiers hidden in Presentation Mode.

### T02 — Network Logical
Prioritize hierarchy and flow: external/edge/security → network/fabric → access/service/workload zones → management/OOB. Do not invent routers, spine/leaf, Internet, carrier, or cross-connect objects absent from the current view.

### T03 — Physical Connectivity
Prioritize evidence-supported physical adjacency and connection paths. Ports, speeds, media, optics and A/B paths SHALL appear only when explicitly supported by the canonical model.

### T04 — Compute / HCI / Storage
Prioritize compute/HCI tier, storage tier, data-protection tier and platform/management relationships.

### T05 — Management / OOB / Operations
Prioritize management/operations core → OOB plane → managed infrastructure. Only canonical management/OOB/monitoring relationships are asserted.

### T06 — Service / Tenant
Prioritize service/tenant/cloud layer → underlying compute/storage/network/security dependencies → protection/management dependencies.

### T07 — Security
Prioritize security boundaries, controls, protected objects and supported policy/protection relationships.

### T08 — Backup / DR
Prioritize protected workloads → backup/repository → replication/recovery/DR targets. A backup link and a DR replication link are distinct relationships.

### T09 — AI / GPU Fabric
Use only when the project package includes supported AI/GPU objects. Separate AI compute, AI fabric, high-throughput storage and management/cooling context without inventing fabric technology or bandwidth.

### T10 — Multi-site / DR
Use only when multiple sites/DR contexts are encoded. Site-to-site links, replication and failover paths require explicit evidence.

## 7. Layout Algorithm Contract

The shared renderer SHALL use the following precedence:

1. normalized `view.layout.object_hints` when supplied;
2. view-specific domain/role lane grouping;
3. deterministic automatic grid placement within the lane.

The renderer SHALL apply collision avoidance and responsive fitting. It SHALL NOT interpret X/Y position as physical location evidence.

Hard-coded project object IDs are prohibited in the standard runtime.

## 8. Interaction Contract

- Single click → select the canonical object and open/update Inspector.
- Hover/focus → emphasize the selected node and only its current-view connected paths; de-emphasize unrelated paths.
- Double click / expand → enter Object Focus using the same canonical object ID.
- Object Focus → show only canonical current-view neighbors and existing presentation intents when explicitly enabled.
- Escape / Back → return one semantic level.
- Fit → fit current standard topology to available canvas.
- Design Paths toggle → show/hide presentation/design intents without mutating canonical graph.

## 9. Presentation vs Engineering Mode

**Presentation Mode** SHALL use this topology-first projection by default.

**Engineering Mode** SHALL preserve the detailed evidence-oriented engineering renderer. The visual standard may share icons/colors/interaction semantics, but SHALL NOT hide required engineering attributes merely for presentation simplicity.

## 10. Canvas Information Policy

Permanent debug banners or development messages SHALL NOT overlay the final topology.

Evidence-safety guidance MAY be exposed through a compact information control. The left narrative panel, findings panel and Inspector remain authoritative for detailed explanation.

## 11. Cross-Project Application

### KAYAS
- Apply the standard to every enabled DCTS view in the KAYAS project package.
- Preserve KAYAS-specific service model, statuses, findings and evidence as project data only.
- KAYAS-specific 40/80/80/AI10 labels may appear only when encoded by the KAYAS package.

### Haven Healthcare
- Apply the same shared runtime to every enabled DCTS view in the Haven project package.
- Preserve Haven normalized layout hints as presentation metadata.
- Preserve `RECOMMENDED` / `DESIGN_TO_FINALIZE` migration semantics through their explicit DCTS status mapping; do not silently relabel them.

## 12. Runtime Reference

Controlled runtime implementation:

```text
dcts/viewer/runtime/dcts-viewer-topology-standard-v1.css
dcts/viewer/runtime/dcts-viewer-topology-standard-v1.js
```

The runtime SHALL be package-driven through `window.DCTS_VIEWER_BOOT.packageBase` and SHALL contain no customer-specific object identifiers.

## 13. Acceptance Criteria

A project/view passes the visual standard when:

1. all current-view canonical objects remain selectable;
2. no object/relationship is invented;
3. no canonical relationship is omitted by the standard renderer unless deliberately filtered by mode/status policy;
4. presentation intents are visibly non-canonical;
5. zones and node positions do not overlap at supported desktop viewport classes;
6. relationship hierarchy remains readable without selection;
7. hover/select clearly isolates connected paths;
8. Inspector and evidence/traceability remain reachable;
9. all enabled project views can render from the same runtime;
10. renderer contains no project-specific IDs or coordinates.

## Revision History

| Version | Date | Change | Rationale |
|---|---|---|---|
| v1.0.0 | 2026-09-01 | Initial controlled topology visual grammar | Freeze the accepted KAYAS topology-first direction as a reusable DCTS standard and apply it cross-project to KAYAS and Haven Healthcare. |
