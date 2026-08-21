# KAYAS MASTER DESIGN RULES

**Canonical live portal:** https://specbridge.co/kayas/

**Canonical design branch:** `kayas-design-master`

## Core rule

All future KAYAS design, content, navigation, report, 3D, branding, performance and integration changes must start from this branch. Do not restart from an older portal, parallel prototype or generic template unless Önder Yardaş explicitly approves a replacement master.

## Investor-facing presentation hygiene

The public/investor portal must read as a finished professional experience.

Never expose the following in investor-facing copy or UI:

- revision numbers or release identifiers
- build numbers
- commit hashes or branch names
- optimization notes
- WebGL/GPU/browser/main-thread commentary
- debugging or deployment notes
- migration/fallback notes
- phrases such as `Current status`, `being optimized separately`, `performance isolated`, `fail-open`, `runtime`, `fallback mode`, `build`, `freeze fix` or equivalent production terminology
- notes written for the development/design team rather than investors
- customer-facing references to restricted/internal files merely to explain that they are hidden

Internal versioning belongs only in source control, change-control records and handover documentation.

## Public portal structure

- Executive
- Reports
- 3D Experience
- Investor Guide

The main portal must remain usable independently of the 3D renderer. The 3D experience is user-initiated. Public copy should simply invite the visitor to explore the facility; it must not explain the implementation mechanism.

## Public design language

- English only
- dark premium investor interface
- deep blue / charcoal background
- restrained cyan interaction accents
- compact management metrics
- responsive card-based composition
- professional, factual and investor-oriented language
- no visible internal-development terminology
- no unnecessary animation that reduces responsiveness

## Current project baseline

- Location: Kahramanmaraş / Türkoğlu / Ceceli, Kayas Ambalaj facility
- Main area: building 3rd floor
- Global brand spelling: KAYAS
- 196 air-cooled IT cabinets × 7 kW = 1,372 kW
- 10 liquid-cooled IT cabinets × 60 kW = 600 kW
- Total: 206 IT cabinets
- Design IT load: 1,972 kW
- 200-cabinet configuration is SUPERSEDED
- 1,792 kW is invalid and must not be used
- Working BOM: 19 × UIS 3000 G6 + 4 × R4900 G6, subject to sizing / BoQ / SPQ confirmation

## Source hierarchy

1. Latest explicit decision from Önder Yardaş
2. Latest written H3C confirmation
3. Latest H3C presentation and DWG
4. Verified field report
5. Current BOM / SPQ / BoQ
6. Master schedule
7. Derived analysis and older presentations

Visual/topology hierarchy:

1. Master numbered layout with zones 1–41
2. Authoritative 41-zone registry
3. Explicit user corrections
4. Current HTML only for zone IDs/UI integration
5. Approved visuals for style continuity
6. Other project documents only when required

## Architectural lock

Passenger elevators are at the extreme building corner. When exiting the passenger elevators, there is no additional room, corridor or area to the right unless a later authoritative drawing explicitly proves otherwise.

Never invent rooms, openings, corridors or circulation branches.

## Visual-production rules

- one main approved-candidate image per zone
- 16:9
- human-eye camera approx. 1.55–1.70 m
- moderate perspective; no fisheye/extreme ultra-wide
- realistic dimensions and maintenance clearances
- no people unless explicitly requested
- visitor areas warmer/refined; technical areas cooler/functional
- no arbitrary signage
- H3C logos only on real H3C equipment
- SpecBridge AI only as digital presentation / production partner

Zone visual states: PENDING / IN PRODUCTION / REVISION REQUIRED / APPROVED.

## Information status

CONFIRMED / H3C PROPOSAL / CUSTOMER INPUT / WORKING ASSUMPTION / OPEN-CONFIRMATION REQUIRED / SUPERSEDED

Do not silently erase superseded values; preserve them in internal revision history.

## Change control

Every future change must:

1. start from `kayas-design-master`
2. change only the requested scope
3. preserve unrelated approved styling and behavior
4. verify technical-data and topology impact
5. keep public copy free of internal production commentary
6. test the main portal independently from 3D
7. promote the validated result back to `kayas-design-master`

Forbidden: restarting from an older portal, restoring 200 cabinets or 1,792 kW as current, inventing architecture, exposing restricted H3C files, or exposing internal build/runtime notes to investors.
