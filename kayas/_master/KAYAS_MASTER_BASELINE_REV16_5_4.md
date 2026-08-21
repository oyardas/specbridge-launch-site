# KAYAS MASTER BASELINE — Rev16.5.4

**Status:** MASTER BASELINE / DESIGN LOCK  
**Public root:** https://specbridge.co/kayas/  
**Repository:** `oyardas/specbridge-launch-site`  
**Baseline commit before documentation:** `1f7d86c895edf00e9639f7f471be4868d853bdf8`  
**Baseline branch:** `kayas-master-rev16-5-4`  
**Prepared / metadata author:** Önder Yardaş  
**Project brand:** KAYAS  

---

## 1. Purpose of this baseline

Rev16.5.4 is the single approved design baseline for the KAYAS investor portal. All future design, content, navigation, visual, data, report, 3D, performance, or integration changes must be implemented as controlled revisions of this baseline. No future change may restart the portal from an older version, alternate theme, superseded layout, or parallel prototype unless Önder Yardaş explicitly approves a new baseline.

This document is the handover and change-control source for future work. The live portal, this file, the machine-readable manifest, the baseline branch, and the exported Google Drive package should be treated together as the baseline set.

---

## 2. Project identity

- Project: **KAYAS / KAYAŞ OSB Entegre Veri Merkezi ve Dijital Hizmet Platformu**
- Location: **Kahramanmaraş / Türkoğlu / Ceceli, Kayas Ambalaj tesisi**
- Main data-center area: **building 3rd floor**
- Investors: **Furkan Bayazıt, Sinan Bayazıt**
- Prepared / metadata author: **Önder Yardaş**
- Global brand spelling: **KAYAS**
- The project must never be shown as being in Ankara.

The project is not only a cabinet or hardware acquisition. The target is an operable, integrated, revenue-generating digital service platform that combines H3C IC8000 physical data-center infrastructure, UIS HCI, CAS virtualization, ONEStor storage, CloudOS cloud management, data-center networking, security, backup/DR, DCIM and NOC functions.

H3C positioning must focus on end-to-end integration, lifecycle consistency, Day-2 operational simplicity, unified architecture and a single escalation model. Do not claim H3C is categorically the best vendor in every category.

---

## 3. Approved portal architecture

### 3.1 Main portal behavior

The `/kayas/` root is intentionally a **safe integrated investor portal**.

Approved behavior:
- Executive Summary loads as normal HTML.
- Reports load as normal HTML.
- Investor Guide is directly accessible.
- Main portal does **not** auto-start WebGL.
- Main portal does **not** auto-load the heavy 3D experience in an iframe.
- The 3D experience is launched only after an explicit user action.
- 3D must open independently so a WebGL/GPU/main-thread issue cannot freeze the investor portal itself.
- Investor-facing navigation remains usable even if the 3D experience fails.

This separation is a mandatory performance and resilience rule for all future revisions unless explicitly changed by Önder Yardaş.

### 3.2 Baseline visual character

The approved portal style is:
- dark premium investor interface,
- deep blue/charcoal background,
- restrained cyan interaction accents,
- compact status and metric components,
- responsive card-based layout,
- high information density without visual clutter,
- no unnecessary animation that risks browser responsiveness,
- H3C and SpecBridge branding used only where appropriate.

Do not replace this with a light-theme portal, generic corporate dashboard, template marketplace style, or an older KAYAS design without explicit approval.

### 3.3 Current root build marker

`Rev16.5.4 Safe Integrated Investor Portal`

---

## 4. Current technical baseline

### 4.1 IT cabinets and IT load

Current approved baseline:
- **196 air-cooled IT cabinets × 7 kW = 1,372 kW**
- **10 liquid-cooled IT cabinets × 60 kW = 600 kW**
- **206 total IT cabinets**
- **1,972 kW total design IT load**

Superseded baseline:
- 190 air-cooled + 10 liquid-cooled = 200 IT cabinets.
- The 200-cabinet design must be marked **SUPERSEDED / previous revision** when retained for history.

The H3C presentation value of **1,792 kW is mathematically incorrect and must not be used**.

### 4.2 Cabinet-count scope

Working assumption until written H3C confirmation:
- the 206 count covers **IT cabinets only**;
- in-row cooling cabinets, power-distribution cabinets, CDU units and auxiliary cabinets are not included in the 206 count.

Status: **H3C CONFIRMATION REQUIRED**.

### 4.3 Compute / HCI working BOM

Working baseline:
- **19 × UIS 3000 G6**
- **4 × R4900 G6**

Status: sizing / BoQ / SPQ confirmation required.
Do not mix this baseline with old 12-node or 15-node scenarios.

---

## 5. Electrical and facility-power rules

H3C electrical concept is not final engineering.

Current concept:
- IT power paths: 2N target.
- Mechanical systems: N+1 / 2N evaluation.
- Power Room A: 4 × 600 kVA IT UPS + 2 × 500 kVA mechanical UPS.
- Power Room B: 4 × 600 kVA IT UPS.
- Full-load battery target: approximately 15 minutes.

Mandatory rule:
- UPS, transformer, generator, cooling, pumps, auxiliary load and total facility power must be recalculated against the current **1,972 kW IT load**.
- **3,100 kW facility power must not be presented as final or confirmed before recalculation.**
- **16.5 MW site capacity is CUSTOMER INPUT** and requires DSO and electrical-engineer confirmation.

---

## 6. Cooling and CDU rules

- CDU = Coolant Distribution Unit.
- It controls flow, pressure and temperature in the liquid-cooled IT loop.
- It isolates facility water from the IT loop through a heat exchanger.
- It supports pumping, filtration, valves, sensing, leak detection and alarm management.

Current liquid-cooling load:
- 10 liquid-cooled IT cabinets.
- 600 kW total design load.

Open items:
- CDU count,
- CDU capacity,
- CDU location,
- CDU redundancy.

These must not be shown as final values before confirmation.

H3C concept options include:
- DX precision cooling + refrigerant pump + outdoor condenser,
- or free-cooling chiller + chilled-water system,
- plus closed-loop liquid cooling with pumps, CDU, water treatment and pressurization.

Natural water around 8°C may be considered as an opportunity only after confirming flow, seasonal temperature, chemistry, licensing and redundancy. Natural water must never be connected directly to the IT loop; isolation through heat exchanger/CDU is mandatory.

---

## 7. Site and layout assumptions

Working site assumptions:
- approximately 2,000 m² working area,
- main entrance west,
- terrace / mechanical area east,
- power, battery and fiber support areas south,
- expansion direction north,
- approximately 5 m terrace work area subject to confirmation.

All dimensions, columns, escape routes, doors, fire zones, structural limits and net areas must be validated against the latest DWG and authorized engineering calculations before implementation decisions.

---

## 8. Authoritative 41-zone registry

01 — A-01 — 2 Passenger Elevators — 8×14 m — 112 m²  
02 — A-04 — Elevator Arrival Lobby — 7×8 m — 56 m²  
03 — A-05 — Security Control Point — 7×4 m — 28 m²  
04 — A-03 — Access Control Vestibule — 7×4 m — 28 m²  
05 — A-02 — Secure Foyer / Waiting — 7×10 m — 70 m²  
06 — B-01 — Large Meeting Room — 8×6 m — 48 m²  
07 — B-02 — Visitor WC + Accessible WC — 8×5 m — 40 m²  
08 — B-03 — Small Meeting Room — 7×7 m — 49 m²  
09 — S-02 — Mantrap / Anti-tailgating — 3×12 m — 36 m²  
10 — C-10 — Pre-function / Hold — 3×7 m — 21 m²  
11 — C-11 — Critical Cross Corridor — 3×7 m — 21 m²  
12 — C-08 — South Visitor / Admin Corridor — 2×33 m — 66 m²  
13 — C-09 — Operations Access Buffer — 3×7 m — 21 m²  
14 — T-04 — Freight Elevator + Lobby — 7×18 m — 126 m²  
15 — T-03 — Controlled Staging / Unpacking — 7×15 m — 105 m²  
16 — C-12 — Technical Front Corridor — 14×3 m — 42 m²  
17 — P-01 — UPS Room A — 7×9 m — 63 m²  
18 — P-02 — UPS Room B — 7×9 m — 63 m²  
19 — P-03 — Battery Room A — 7×8 m — 56 m²  
20 — P-04 — Battery Room B — 7×8 m — 56 m²  
21 — P-05 — Main Distribution / Bypass — 14×6 m — 84 m²  
22 — P-06 — Aux Electrical / Riser — 14×7 m — 98 m²  
23 — T-02 — Meet-Me Room A / MMR-A — 8×8 m — 64 m²  
24 — C-06 — Controlled Technical Service Spine — 27×7 m — 189 m²  
25 — D-02 — Phase-1 Active IC8000 Data Hall — 27×31 m — 837 m²  
26 — C-05 — Cross Spine / Egress Corridor — 27×4 m — 108 m²  
27 — D-01 — VIP Opening Foyer / Conference Hall / Future White-Space Reserve — 27×28 m — 756 m²  
28 — C-04 — West Observation / Service Strip — 4×70 m — 280 m²  
29 — C-03 — Operations Access Corridor — 2×70 m — 140 m²  
30 — O-07 — Store / Janitor — 8×7 m — 56 m²  
31 — O-06 — Staff WC + Locker — 8×8 m — 64 m²  
32 — O-05 — Staff Lounge + Kitchenette — 8×10 m — 80 m²  
33 — O-04 — Management Offices — 8×8 m — 64 m²  
34 — O-03 — Operators Room — 8×8 m — 64 m²  
35 — O-02 — NOC — 8×12 m — 96 m²  
36 — O-01 — Carrier / Technical Support — 8×7 m — 56 m²  
37 — T-01 — Meet-Me Room B / MMR-B — 8×10 m — 80 m²  
38 — C-02 — North Buffer / Technical Strip — 36×4 m — 144 m²  
39 — C-01 — North Egress Strip — 36×3 m — 108 m²  
40 — S-01 — NW Fire Stair — 5×7 m — 35 m²  
41 — TR-01 — East 5 m Service Terrace — 5×110 m — 550 m²

---

## 9. Architectural source hierarchy

For floor plan, topology, adjacency, doors, room envelopes, zone IDs and 3D/visual geometry, use this hierarchy:

1. Latest explicit decision from Önder Yardaş.
2. Latest written H3C confirmation.
3. Latest H3C presentation and DWG.
4. Verified field report.
5. Current BOM / SPQ / BoQ.
6. Master schedule.
7. Derived analysis and older presentations.

For zone visual production specifically:
1. Master numbered layout showing zones 1–41.
2. Authoritative 41-zone registry.
3. Explicit user corrections.
4. Current HTML only for zone IDs/UI integration.
5. Approved visuals for style continuity.
6. Other project documents only when required.

Never silently reconcile contradictory geometry. Flag the conflict and wait for an explicit decision if topology would change.

---

## 10. Critical architectural correction

Passenger elevators are located at the extreme building corner. When exiting the passenger elevators there is **no additional room, corridor or area to the right** unless a later authoritative drawing explicitly proves otherwise.

This correction overrides generic architectural assumptions and style-reference imagery.

Do not invent:
- a fantasy right-side corridor,
- extra lobby width,
- additional door openings,
- secondary rooms,
- unapproved circulation branches.

---

## 11. Visual-production rules

- One main approved-candidate image per zone.
- 16:9 format.
- Human-eye camera height approximately 1.55–1.70 m.
- Moderate lens perspective; no fisheye or extreme ultra-wide distortion.
- No exaggerated ceiling height.
- Realistic furniture, cabinet, corridor and maintenance clearances.
- No people during production unless explicitly requested later.
- Visitor-facing spaces: warmer, refined tone.
- Technical spaces: cooler, functional tone.
- Maintain one-building material and lighting continuity.
- Props and furniture only when functionally justified.
- Circulation and maintenance clearance have priority over decoration.
- No arbitrary signage.
- No invented doors, corridors, rooms or openings.
- Unknown details must remain minimal WORKING ASSUMPTIONS and must not change topology.
- H3C logos only on actual H3C equipment when technically appropriate.
- No H3C logos in generic lobby, foyer, meeting, NOC, offices, staff spaces or general architecture.
- On light/open backgrounds use red transparent H3C logo; on dark equipment/backgrounds use the white H3C logo.
- SpecBridge AI is positioned only as digital presentation / production partner.

Zone image status values:
- PENDING
- IN PRODUCTION
- REVISION REQUIRED
- APPROVED

Once explicitly approved, a zone visual is visually locked until Önder Yardaş requests a revision.

Recommended filenames:
`NN_ZONE-ID_Area_Name.png`

---

## 12. Branding rules

### KAYAS
- Global spelling: **KAYAS**.
- Do not switch the primary public brand to KAYAŞ inside global-facing visual identity unless specifically required for Turkish editorial text.

### H3C
- H3C is a technology manufacturer / solution vendor in this project, not to be misrepresented as the overall system integrator when that is not contractually true.
- Do not expose raw H3C `Secret/机密` materials to customers.
- Logos must follow approved contrast rules.
- Do not over-brand customer architecture.

### SpecBridge AI
- Use as digital presentation / production partner only.
- Do not position SpecBridge AI as owner, investor, EPC, engineering authority, certification body or H3C reseller unless separately approved.

---

## 13. Information status taxonomy

Use one of the following statuses when technical or commercial facts are not uniformly confirmed:

- CONFIRMED
- H3C PROPOSAL
- CUSTOMER INPUT
- WORKING ASSUMPTION
- OPEN-CONFIRMATION REQUIRED
- SUPERSEDED

Old values must not be silently deleted. When replaced, preserve revision history with:
- source,
- date,
- old value,
- new value,
- reason for change.

---

## 14. Revenue and service-platform positioning

KAYAS must not be positioned only as a colocation facility.

Potential services include:
- colocation,
- rack / kW,
- cross-connect,
- internet transit,
- private cloud,
- VM / VDC,
- storage,
- BaaS,
- DRaaS,
- managed network,
- managed security,
- NOC,
- managed infrastructure,
- GPU / AI infrastructure,
- demo / POC services,
- academy / training services.

---

## 15. Expected H3C non-product support

Items to request and document with scope, duration, owner and written commitment:
- Demo center and H3C Academy support.
- Regional cloud / service node.
- Global or regional reference-project positioning.
- Joint marketing and opening activity.
- Joint GTM and customer acquisition.
- POC/demo licenses.
- Training and certification.
- Named solution architect and executive sponsor.
- Local spare-part and field SLA model.
- L2/L3 expert support.
- Design, FAT/SAT, integration and first-customer onboarding support.

---

## 16. Competitive-analysis rule

Relevant competitors may include Huawei, Schneider, Vertiv, Dell, HPE, Nutanix, VMware, Cisco, Arista and Juniper.

Do not demean competitors. Compare through:
- integration model,
- accountability,
- lifecycle,
- licensing,
- Day-2 operations,
- local support,
- SLA,
- energy efficiency,
- total cost of ownership.

---

## 17. Project schedule baseline

- IC8000 commercial approval and PO target: **17 August 2026**.
- Commercial close target: **August 2026**.
- Opening target: **February 2027**.

All dates remain dependent on production, SPQ, contracting, import, site preparation and engineering approvals.

---

## 18. Critical open items

- 206 count scope and equipment distribution per micro-module.
- Total physical cabinet/equipment count.
- CDU capacity and redundancy.
- Facility-power calculation for 1,972 kW IT load.
- UPS / transformer / generator / cooling sizing.
- Natural-water tests.
- Structural suitability of floor and terrace.
- Fire, egress and seismic requirements.
- MMR-A / MMR-B and independent fiber entries.
- OOB, DDoS, SLA, spare parts and 24×7 NOC model.
- H3C demo / academy / regional-cloud commitments.
- Current SPQ and commercial terms.

---

## 19. Change-control protocol from Rev16.5.4 onward

Every future change must follow this logic:

1. Start from Rev16.5.4 or a documented descendant revision.
2. Identify the exact component being changed.
3. Preserve unrelated approved behavior and styling.
4. Check whether the change affects technical baseline, topology, branding, reports, 3D, performance or access control.
5. If technical values change, update both UI and machine-readable manifest.
6. If topology changes, update the zone registry / authoritative layout source.
7. If a prior value becomes obsolete, mark it SUPERSEDED rather than silently deleting it from project history.
8. Increment revision identifier.
9. Add a revision-history entry.
10. Keep the safe-portal rule: no automatic heavy WebGL startup unless explicitly re-approved.
11. Test the portal root independently from 3D.
12. Only after validation should the new revision replace the live root.

### Forbidden future workflow

Do not:
- restart from an older portal,
- recreate the design from memory,
- replace the style with a generic template,
- silently restore 200-cabinet values,
- reintroduce the incorrect 1,792 kW figure,
- auto-load 3D at root without explicit approval,
- invent architecture to make a render look better,
- expose restricted H3C files directly.

---

## 20. Baseline preservation rule

The branch `kayas-master-rev16-5-4` is the frozen design reference. The live `main` branch may evolve, but all future work must be traceable back to this baseline or a formally approved successor baseline.

If future work becomes unstable, the correct recovery action is to return to this baseline and reapply approved changes incrementally. Do not reconstruct the portal from an earlier revision.
