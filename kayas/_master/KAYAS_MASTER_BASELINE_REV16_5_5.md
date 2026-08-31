# KAYAS MASTER BASELINE — Rev16.5.5

**Status:** CURRENT CABINET / IT-LOAD BASELINE ADDENDUM  
**Effective date:** 2026-08-31  
**Supersedes:** Rev16.5.4 Section 4.1 cabinet-count and derived IT-load values  
**Prepared / metadata author:** Önder Yardaş

## 1. Authoritative cabinet baseline

The current approved KAYAS Phase-1 IT cabinet baseline is:

- **200 standard / air-cooled IT cabinets**
- **10 AI / high-density IT cabinets**
- **210 total IT cabinets**

The previous **196 standard + 10 AI = 206 total IT cabinets** baseline is **SUPERSEDED**.
The older **190 standard + 10 AI = 200 total IT cabinets** baseline is also **SUPERSEDED**.

## 2. Current working design IT load

Until a later engineering sizing decision changes per-rack design assumptions, retain the previous working density assumptions:

- 200 standard cabinets × 7 kW = **1,400 kW**
- 10 AI / high-density cabinets × 60 kW = **600 kW**
- Total working design IT load = **2,000 kW**

The previous **1,972 kW** value was derived from the superseded 196 + 10 cabinet baseline and must no longer be presented as the current project value.

The 60 kW per AI cabinet value remains a **WORKING DESIGN ASSUMPTION** until final AI server, power and cooling sizing is approved.

## 3. Commercial service allocation

For service-model planning, the **200 standard cabinets** are allocated as the current recommended starting model:

- **40 cabinets — IaaS / Cloud Platform**
- **80 cabinets — Managed Colocation**
- **80 cabinets — Customer-Managed Colocation**

The additional **10 AI / high-density cabinets** sit outside the 40+80+80 standard-cabinet allocation and may be commercialized as GPUaaS / AI Cloud capacity, Managed AI Colocation, or Customer AI Colocation according to demand.

Therefore:

**40 + 80 + 80 = 200 standard service cabinets**  
**200 standard + 10 AI = 210 total IT cabinets**

## 4. Change-control rule

Any current investor portal, Service Models page, topology, 3D experience, report, manifest, BoQ-derived view or future KAYAS artifact that presents 196+10, 206 total, 190+10, 200 total, or 1,972 kW as the current baseline must be treated as stale and updated when that artifact is next revised.

All Rev16.5.4 rules not explicitly replaced by this addendum remain in force.