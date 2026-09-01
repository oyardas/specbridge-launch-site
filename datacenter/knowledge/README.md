# SpecBridge Data Center Knowledge Library v1

Status: ACTIVE PROGRAM
Author: Önder Yardaş
Started: 2026-09-01

## Purpose

Build a reusable, vendor-neutral, research-led data-center knowledge system that converts complex infrastructure subjects into decision-ready written research, engineering comparisons, visual explanations and professional Turkish narration.

This library is not a product brochure and not a vendor training portal. It separates standards, accepted engineering practice, manufacturer implementation examples and project-specific recommendations.

## Standard output per module

Each module should contain, where applicable:

1. Deep Research Paper
2. Executive Explanation
3. Engineering Deep Dive
4. Comparison Matrix
5. Decision Guide — which approach fits which requirement
6. Architecture / topology / flow visual
7. Failure modes and common design mistakes
8. Authoritative source register
9. Quick Narration (2–4 min)
10. Full Narration (8–15 min)
11. Engineering Narration when useful (15–30 min)
12. Synchronized transcript and captions
13. Reusable decision data for project-specific generation

## Evidence hierarchy

1. Standards bodies / industry standards and certification authorities
2. Protocol / architecture maintainers and open engineering specifications
3. Official hyperscaler / cloud / platform documentation
4. Manufacturer engineering guides and reference architectures
5. Independent industry research
6. Secondary sources only for context, never as the sole engineering authority

Vendor examples must be labeled as implementation examples rather than universal standards.

## Decision principle

There is no globally correct architecture independent of workload, service model, availability requirement, rack density, growth model, site constraints and operations maturity. The library must explain trade-offs rather than present a single technology as universally superior.

## Research program

The master program contains 50 primary tracks and is expected to expand into roughly 150–200 independent knowledge modules.

### Wave 1 — Fundamentals & Physical Infrastructure

- DC-K01 Data Center Service Models
- DC-K02 Data Center Types, Traditional vs Prefabricated/Modular
- DC-K03 Rack & Cabinet Engineering
- DC-K04 Data Center Power Architecture
- DC-K05 Cooling Architecture

### Wave 2 — Compute & Data

- x86 / ARM / accelerated compute
- virtualization and containers
- storage fundamentals and enterprise storage
- HCI
- backup, replication, DR and cyber recovery

### Wave 3 — Network

- L1/L2/L3 fundamentals
- traditional 3-tier, collapsed core, ring, mesh, Clos/spine-leaf
- topology-to-workload decision matrix
- EVPN/VXLAN
- redundancy and multi-homing
- 1G–800G speed families
- optics and cabling
- AI/HPC Ethernet, RoCE and InfiniBand
- carrier/interconnection/MMR/DCI
- OOB management

### Wave 4 — Security, Resilience & Operations

- physical security
- network/cybersecurity
- IAM/PAM/SIEM/SOC/SOAR
- OT/BMS/EPMS/DCIM security
- N/N+1/2N/2N+1/distributed redundant
- FMEA/FMECA and failure domains
- commissioning
- SOP/MOP/EOP and operations
- capacity management

### Wave 5 — AI, Economics, Standards & Türkiye

- AI/high-density infrastructure
- sustainability/PUE/WUE/CUE
- CAPEX/OPEX/TCO and service pricing
- procurement/BoQ/vendor-neutrality
- Tier/TIA-942/EN 50600/ISO-IEC 22237 positioning
- independent technical advisory
- Türkiye market, energy, connectivity, sovereignty, location and risk

## Narration standard

Production voice baseline: S3F — Sage Senior Adviser.

Narration must sound like a senior technical adviser explaining the system to an intelligent decision-maker. Avoid advertising voice, casual podcast dialogue, unnecessary drama and unexplained acronym dumping.

Every narration should answer:

- What is it?
- Why does it exist?
- How does it work?
- What are the alternatives?
- What fails?
- When should I choose it?
- What changes at larger scale or higher density?
- What should an investor, architect or engineer verify?

## Project reuse

Generic knowledge modules are written once. Future projects should combine:

GENERAL KNOWLEDGE LAYER + PROJECT DATA + PROJECT CONSTRAINTS -> PROJECT-SPECIFIC EXPLANATION

This avoids recreating fundamentals for KAYAŞ, Haven Healthcare or future projects while preserving project-specific engineering decisions.