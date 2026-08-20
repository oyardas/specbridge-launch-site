# KAYAS Rev16.5.2 — Architecture-Locked Zone Review

This is a standalone review build derived from `KAYAS_Rev16_5_1_EXPANDED_ZONE_INFO_PANEL`.

## Locked baseline
- 41-zone master numbered layout is the authoritative spatial reference.
- No room, corridor, door, opening, stair, elevator or adjacent volume may be invented.
- A-01 is a building-corner zone: its west and south sides are exterior boundaries.
- Current IT baseline: 196 air-cooled cabinets × 7 kW + 10 liquid-cooled cabinets × 60 kW = 206 IT cabinets / 1,972 kW.
- 200-cabinet / 1,792 kW values are superseded for current design decisions.
- Zone photoreal visuals remain unmapped until individually approved.

## Review build note
To prioritize architectural correctness, this review build uses procedural cabinet/furniture geometry instead of embedding large binary GLB assets. The production IC8000 GLB can be reintroduced after spatial QA without changing the locked room topology.
