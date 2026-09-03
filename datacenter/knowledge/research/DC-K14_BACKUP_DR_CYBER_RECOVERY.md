# DC-K14 — Backup / DR / Cyber Recovery — Golden Deep Research

**Research state:** `DC_K14_GOLDEN_DEEP_RESEARCH = COMPLETE`  
**Research date:** 2026-09-03  
**Scope:** Vendor-neutral backup, disaster recovery and cyber-recovery architecture from business impact analysis and recovery objectives through copy design, immutability/isolation, application-consistent protection, replication, clean-room recovery, ransomware response, recovery sequencing, testing, evidence, operations, lifecycle, acceptance and BoQ freeze.  
**Next production stage:** 8-chapter Full Narration TR V2 + independent Quick Brief + frozen S3F audio QA.

---

## 1. Executive engineering position

Backup, disaster recovery and cyber recovery are related but different engineering disciplines. Treating them as interchangeable creates one of the most dangerous architecture errors in a data center: an organization may own many copies of data and still be unable to restore a trusted business service within the required time.

A Golden design must answer four separate questions:

1. **Can the organization recover deleted, corrupted or lost data?** This is primarily a backup and restore question.
2. **Can the organization continue or re-establish a business service after loss of a system, site or dependency?** This is a disaster-recovery and continuity question.
3. **Can the organization recover when the production environment and normal administrative trust are themselves compromised?** This is a cyber-recovery question.
4. **Can the organization prove, repeatedly and under realistic failure conditions, that the recovery works?** This is an acceptance, testing and operational-governance question.

The correct architecture therefore starts with business service criticality and recovery objectives, not with backup appliance capacity, deduplication ratio or replication features.

The core decision chain is:

`BUSINESS SERVICE → BIA / DEPENDENCIES → RPO / RTO / RECOVERY TIER → DATA + CONFIG + IDENTITY + CODE PROTECTION → COPY ISOLATION / IMMUTABILITY → RESTORE PATH → DR ORCHESTRATION → CYBER CLEAN-ROOM → TEST / EVIDENCE → OPERATIONS → CAPACITY / TCO → BoQ FREEZE`

---

## 2. Current official-source baseline

This research uses official, technology-neutral guidance and explicitly distinguishes current final publications from drafts or older still-relevant references.

### 2.1 NIST Cybersecurity Framework 2.0 — Recover

NIST CSF 2.0, published 26 February 2024, treats recovery as a first-class cybersecurity outcome. Of particular importance to backup and cyber recovery:

- recovery actions must be selected, scoped, prioritized and performed;
- backup and other restoration-asset integrity must be verified before restoration;
- critical mission functions and cybersecurity risk must influence post-incident operating norms;
- restored assets must have their integrity verified before normal operations are confirmed;
- recovery closure must use defined criteria and complete incident documentation;
- recovery activities and progress must be coordinated and communicated.

Official source: https://www.nist.gov/cyberframework  
Framework publication: https://doi.org/10.6028/NIST.CSWP.29

### 2.2 NIST IR 8374 Rev. 1 — Ransomware Risk Management, final June 2026

NIST published **NIST IR 8374 Revision 1** on 11 June 2026 as a final CSF 2.0 Community Profile for ransomware risk management. It spans Govern, Identify, Protect, Detect, Respond and Recover and is especially relevant because cyber recovery cannot be engineered as a backup-only subsystem. Recovery readiness depends on prior governance, asset knowledge, access control, monitoring, incident handling and tested recovery practices.

Official source: https://www.nist.gov/publications/nist-ir-8374r1-ransomware-risk-management-cybersecurity-framework-20-community-profile  
DOI: https://doi.org/10.6028/NIST.IR.8374r1

### 2.3 NIST SP 800-61 Rev. 3 — Incident Response, final April 2025

NIST SP 800-61 Rev. 3, finalized 3 April 2025, integrates incident response with CSF 2.0 risk-management activities. This matters to recovery architecture because restore decisions cannot be isolated from incident analysis: restoring an infected workload, compromised identity system or malicious configuration simply recreates the incident.

Official source: https://csrc.nist.gov/pubs/sp/800/61/r3/final  
DOI: https://doi.org/10.6028/NIST.SP.800-61r3

### 2.4 NIST SP 800-184 — Guide for Cybersecurity Event Recovery

SP 800-184 remains a useful technology-neutral recovery-planning reference. It emphasizes prioritized resources, recovery plans/playbooks, realistic test scenarios, metrics and continual improvement. Its importance is conceptual: a recovery capability is an operational program, not a one-time infrastructure purchase.

Official source: https://csrc.nist.gov/pubs/sp/800/184/final  
DOI: https://doi.org/10.6028/NIST.SP.800-184

### 2.5 NIST SP 800-209 and Rev. 1 draft — Storage security

NIST SP 800-209 addresses storage-specific security areas including data protection, isolation, restoration assurance and encryption. NIST issued **SP 800-209 Rev. 1 Initial Public Draft on 22 July 2026**, with comments due 8 September 2026. Because the revision is still draft at this research date, it is useful as a current directional reference but is not treated as a final normative baseline.

Final 2020 source: https://csrc.nist.gov/pubs/sp/800/209/final  
2026 Rev.1 draft: https://csrc.nist.gov/pubs/sp/800/209/r1/ipd

### 2.6 CISA #StopRansomware Guide

CISA’s current #StopRansomware guidance recommends maintaining offline, encrypted backups of critical data, regularly testing backup availability and integrity in DR scenarios, maintaining golden images and offline infrastructure-as-code or software resources, and restoring prioritized critical services from trusted backups while avoiding reinfection. CISA also highlights delete protection/object lock and versioning for cloud storage where applicable.

Official source: https://www.cisa.gov/stopransomware/ransomware-guide

### 2.7 NIST data-integrity recovery references

NIST’s ransomware/data-integrity project also maintains final applied publications for identifying/protecting assets, detecting/responding to destructive events and recovering from them, including SP 1800-11, SP 1800-25 and SP 1800-26. These are useful implementation references but do not replace architecture-level business and recovery requirements.

Official publication index: https://csrc.nist.gov/Projects/ransomware-protection-and-response/publications

---

## 3. Backup, replication, DR and cyber recovery are not synonyms

### 3.1 Backup

A backup is an independent recovery copy or recovery representation of data and, where required, associated system state. Its primary value is historical recovery and restoration after deletion, corruption, logical error, system failure or malicious change.

A backup architecture must define:

- protected objects: files, blocks, databases, VMs, containers, cloud resources, SaaS data, configuration, identity and application state;
- backup frequency and achievable RPO;
- retention and version history;
- consistency model;
- backup-copy placement and failure domains;
- immutability or isolation controls;
- encryption and key ownership;
- restore path and restore bandwidth;
- indexing/catalog dependencies;
- verification and test frequency;
- capacity growth and expiry behavior.

A backup that cannot be restored within the service requirement is not an accepted protection design.

### 3.2 Snapshot

A snapshot is typically a point-in-time representation within or closely coupled to the primary storage/control system. It can provide very fast rollback and operational recovery, but a snapshot alone is normally not an independent backup because it may share:

- the same array or storage cluster;
- the same administrative plane;
- the same credentials;
- the same site;
- the same encryption key hierarchy;
- the same attack surface.

Snapshots are valuable recovery layers but must not be counted as independent copies without proving failure-domain and trust-domain separation.

### 3.3 Replication

Replication creates another current or near-current copy. It is useful for availability and DR, but it usually propagates logical change. Deletion, corruption, ransomware encryption or malicious administrative operations can also be replicated.

Therefore:

`REPLICATION ≠ BACKUP`

Replication should be paired with versioned, immutable or otherwise independently recoverable history when cyber or logical corruption is in scope.

### 3.4 Disaster recovery

DR is service recovery after a major infrastructure or site disruption. It includes much more than copying data:

- alternate compute capacity;
- network and routing;
- DNS and load balancing;
- identity and authentication;
- security controls;
- application dependencies;
- secrets/certificates/keys;
- automation/orchestration;
- operational runbooks;
- data recovery or replication;
- service validation;
- failback.

A second storage array at another site is not, by itself, a DR solution.

### 3.5 Cyber recovery

Cyber recovery assumes that normal production trust may be compromised. Attackers may have:

- domain or identity-admin privileges;
- backup-admin credentials;
- storage credentials;
- hypervisor access;
- cloud control-plane access;
- API tokens;
- long-lived persistence;
- the ability to delete, encrypt or poison recovery assets.

Cyber recovery therefore introduces stronger requirements for:

- administrative separation;
- immutable and/or offline recovery copies;
- isolated recovery infrastructure;
- trusted identity bootstrap;
- clean-room validation;
- malware and integrity checks;
- recovery-point selection based on compromise timeline;
- staged reconnection to production networks.

---

## 4. Business Impact Analysis, service tiers, RPO and RTO

### 4.1 Start from the business service

Protection policies should not start from servers. A business service may depend on:

- application nodes;
- databases;
- identity providers;
- DNS/NTP/PKI;
- message queues;
- file/object stores;
- network/security policies;
- certificates and secrets;
- external APIs;
- SaaS systems;
- configuration repositories;
- automation pipelines.

The recovery unit is therefore often a **service dependency graph**, not a single VM.

### 4.2 RPO

**Recovery Point Objective (RPO)** expresses the maximum tolerable data-loss window in time terms. It drives protection frequency and replication design.

An RPO is not the same as backup frequency. A job scheduled every 15 minutes does not prove a 15-minute RPO if jobs can fail, queue, overrun or produce unusable recovery points.

Acceptance should measure **achieved recoverable RPO**, including failed-job and validation scenarios.

### 4.3 RTO

**Recovery Time Objective (RTO)** is the target time to restore required service capability after the recovery process is initiated according to the defined scenario.

RTO must include all required stages, not only data transfer:

- incident decision and authorization;
- environment preparation;
- recovery-point identification;
- data restoration;
- compute/network/security rebuild;
- dependency ordering;
- integrity validation;
- application checks;
- business-owner acceptance.

### 4.4 MTPD / maximum tolerable outage

Business continuity planning should identify the maximum tolerable disruption for critical services. Engineering RTO should fit inside that business tolerance with operational margin.

### 4.5 Recovery tiers

A practical tiering model can group services by RPO/RTO and dependency requirements, for example:

- **Tier 0:** identity, DNS/NTP, PKI, recovery-control infrastructure and other foundational dependencies;
- **Tier 1:** mission/business critical, very low RPO/RTO;
- **Tier 2:** important production workloads with moderate recovery targets;
- **Tier 3:** non-critical, archival or long-RTO services.

Tier names are organization-specific; what matters is measurable policy and dependency order.

---

## 5. Copy architecture: more copies are not automatically safer

### 5.1 Failure-domain model

For every recovery copy, document whether it shares the following with production:

| Domain | Question |
|---|---|
| Storage | Same array/cluster/media pool? |
| Compute | Same hypervisor/cluster? |
| Network | Same switching/routing/security domain? |
| Site | Same building/campus/power/cooling risk? |
| Identity | Same directory and privileged credentials? |
| Management | Same backup/storage/cloud admin account? |
| Cloud | Same tenant/account/subscription/project? |
| Encryption | Same key-management dependency? |
| Software | Same backup-control server and catalog? |
| Operations | Same staff/process/change channel? |

A copy that shares most of these domains has limited independence even if it is physically another device.

### 5.2 3-2-1 and stronger operational interpretations

Industry shorthand such as 3-2-1 can be useful as a memory aid, but Golden acceptance must not stop at copy counting. Cyber resilience additionally requires explicit immutability/isolation, verification and restore testing.

The design question is not “How many copies?” but:

- how many **independent recoverable versions** exist;
- how many distinct **failure domains** they span;
- how many distinct **trust domains** they span;
- how quickly each can be restored;
- whether compromise of production credentials can alter them.

### 5.3 Immutable retention

Immutability should specify the mechanism and control boundary:

- object-lock/WORM retention;
- hardened repository with protected retention;
- offline media;
- immutable snapshots where administrative deletion is constrained;
- cloud retention locks where supported.

“Immutable” must not be accepted as a marketing label. Test whether a compromised production or backup administrator can shorten retention, delete the copy, destroy the catalog, revoke keys or delete the account holding the copy.

### 5.4 Offline / logically isolated copies

Offline or strongly isolated copies reduce the probability that an attacker can reach recovery assets using normal online credentials. The tradeoff is operational complexity and possibly longer restore time.

A cyber-recovery design may combine:

- fast online operational copies;
- immutable nearline copies;
- isolated/offline tertiary copies;
- clean-room recovery capability.

---

## 6. Consistency: crash-consistent is not always application-consistent

A storage-consistent or crash-consistent snapshot may preserve block ordering sufficiently for some workloads, but databases and transactional systems may require application-aware quiescing, log handling or coordinated consistency groups.

For each protected application define:

- required consistency model;
- application/database APIs used;
- log backup frequency;
- transaction-log replay limits;
- consistency-group membership;
- credential requirements;
- post-restore application validation.

A successful backup job is not equivalent to a successful application recovery.

---

## 7. Backup control plane is a Tier-0 security system

Modern ransomware operators target backup infrastructure because destroying recovery capability increases leverage. Therefore backup systems should be treated as privileged security infrastructure.

Golden controls should include:

- dedicated backup administration roles;
- MFA for privileged access where supported;
- least privilege;
- separation from normal production administrators where practical;
- hardened management hosts;
- restricted network access;
- separate service accounts;
- credential rotation;
- protected configuration/catalog backups;
- audit logging sent to a separate monitoring domain;
- secure API use;
- patch/vulnerability management;
- documented break-glass process;
- protection of encryption keys.

A backup platform that depends entirely on the same compromised identity domain as production requires a documented recovery bootstrap strategy.

---

## 8. DR architecture: service recovery, not storage mirroring

### 8.1 DR patterns

Common patterns include:

- backup-and-restore into alternate infrastructure;
- asynchronous replication to warm standby;
- synchronous or near-synchronous metro designs where distance/latency allow;
- active-passive application deployment;
- active-active service architecture;
- cloud recovery using replicated data and infrastructure-as-code;
- hybrid combinations by service tier.

The correct pattern depends on RPO/RTO, consistency, distance, failure domain, application support and cost.

### 8.2 Dependency orchestration

Recovery sequencing should be explicit. A typical dependency sequence may include:

1. recovery network/security baseline;
2. time/DNS foundational services;
3. identity/authentication;
4. PKI/secrets/key access;
5. storage/data services;
6. databases/message services;
7. application tiers;
8. integrations;
9. user access;
10. monitoring and business validation.

The exact order is application-specific and must be tested.

### 8.3 Failover and failback

DR acceptance must test both directions. Failover without a safe return-to-normal process leaves an incomplete lifecycle.

Validate:

- split-brain prevention;
- replication direction change;
- changed-data reconciliation;
- DNS/routing TTL behavior;
- certificates and endpoint identity;
- security-policy consistency;
- rollback criteria;
- business approval.

---

## 9. Cyber recovery and clean-room architecture

### 9.1 Assume normal trust is contaminated

In a cyber event, the latest backup may contain malware, compromised credentials or malicious configuration. Recovery-point selection must therefore consider the estimated compromise timeline.

### 9.2 Clean-room / isolated recovery environment

A cyber recovery environment should provide controlled isolation for:

- restoring selected data and systems;
- malware scanning and forensic inspection;
- integrity validation;
- identity reset/bootstrap;
- application testing;
- staged promotion to production.

Isolation should cover network, identity and administrative trust, not only VLAN separation.

### 9.3 Recovery point selection

The process should combine:

- incident timeline;
- threat intelligence/IOCs;
- backup metadata;
- configuration history;
- file/system integrity evidence;
- business RPO tolerance;
- known-good reference images.

The newest recovery point is not automatically the safest recovery point.

### 9.4 Identity recovery

If directory services or privileged identities are compromised, application recovery may be unsafe until identity is rebuilt or trusted. Protect and test:

- directory/system-state recovery;
- MFA configuration where export/backup is supported;
- PKI and certificate authority recovery;
- privileged-access configuration;
- emergency accounts;
- secrets and key-management recovery.

### 9.5 Golden images and infrastructure-as-code

CISA specifically recommends maintaining golden images and keeping infrastructure-as-code/template resources available for recovery. For modern environments this can materially shorten RTO and reduce the risk of restoring compromised operating-system state.

Golden acceptance should verify that image, code and configuration sources are themselves protected and version-controlled.

---

## 10. Cloud and SaaS recovery boundaries

Cloud services do not eliminate customer recovery responsibility. The architecture must document the shared-responsibility boundary for each service.

Questions include:

- Does the provider protect only infrastructure availability, or customer data history too?
- Can accidental/malicious deletion be recovered independently?
- Are snapshots/versions in the same account and credential domain?
- Can account compromise delete backups?
- Are cross-account or cross-region copies required?
- Are retention locks configured?
- How are keys and secrets recovered?
- Is SaaS data export/API backup required?
- What are egress and restore-throughput limits?

CISA warns that simple automated cloud synchronization may propagate encrypted or damaged data. Versioning, delete protection, object locking and independent cloud-to-cloud or cross-account protection may therefore be relevant depending on service risk.

---

## 11. Capacity engineering and the backup window

Backup sizing must be based on protected-data behavior, not only front-end TB.

Model at minimum:

- protected logical capacity;
- daily change rate;
- retention policy;
- full/incremental strategy;
- data-reduction assumptions;
- immutable retention overhead;
- growth rate;
- metadata/catalog overhead;
- replication copy count;
- reserve/headroom;
- rebuild/recovery capacity;
- legal hold where applicable.

If deduplication/compression is used in commercial sizing, the assumed reduction ratio should be documented as a sensitivity variable rather than guaranteed unless contractually supported.

### 11.1 Backup window

Required ingest throughput approximately depends on changed data divided by available protection window, but include protocol overhead, concurrency and source limits.

### 11.2 Restore throughput is often the hidden bottleneck

Many designs size for backup speed but not restore speed. Golden sizing must estimate the bandwidth and concurrency required to meet RTO for the largest required recovery set.

For example, recovering tens or hundreds of terabytes within a short RTO may require substantially more read, network and target-write performance than routine daily backups.

### 11.3 Recovery concurrency

A site-wide event may require many workloads to restore at once. Test aggregate recovery, not just one VM or one database.

---

## 12. Testing: a backup is not accepted until restore is proven

### 12.1 Test levels

A mature validation program should include multiple levels:

- automated backup-job verification;
- checksum/integrity validation;
- file-level restore tests;
- VM/system restore tests;
- database/application-consistent restore;
- service-level dependency recovery;
- alternate-site DR exercise;
- cyber clean-room exercise;
- identity recovery exercise;
- failback exercise.

### 12.2 Evidence to capture

Record:

- test scenario;
- selected recovery point;
- actual achieved RPO;
- actual RTO by stage;
- data volume;
- restore throughput;
- systems/dependencies recovered;
- integrity checks;
- security/malware checks;
- application-owner validation;
- defects and remediation;
- next retest date.

### 12.3 Test the failure, not just the happy path

Inject realistic constraints:

- primary site unavailable;
- one backup repository unavailable;
- production identity unavailable;
- catalog server lost;
- WAN constrained;
- latest restore point rejected as contaminated;
- encryption-key service unavailable;
- corrupted backup copy;
- failed DR orchestration step.

A plan that works only when all supporting services are healthy is not a resilient recovery plan.

---

## 13. Recovery acceptance metrics

Golden acceptance should use measurable outcomes.

| Metric | Engineering meaning |
|---|---|
| Backup success rate | Job completion only; not sufficient by itself |
| Recoverable point success | Percentage of tested restore points that pass integrity/application validation |
| Achieved RPO | Time gap between incident boundary and trusted recoverable data |
| Achieved RTO | Time to required service capability, including validation |
| Restore throughput | Sustained recovery data rate under representative concurrency |
| Recovery concurrency | Number of simultaneous recoveries while meeting targets |
| Immutable-copy survivability | Ability of protected copies to resist deletion/retention reduction under tested admin compromise assumptions |
| Recovery-point confidence | Evidence that selected point predates compromise/corruption |
| DR failover time | Time to alternate service capability |
| Failback time | Time and risk to return to normal architecture |
| Exercise closure | Defects remediated and retested, not merely documented |

---

## 14. Common architecture traps

### Trap 1 — “We replicate, therefore we are backed up”

Replication can copy bad state. Require independent history.

### Trap 2 — “Snapshot equals backup”

If snapshot shares primary failure and admin domains, independence is weak.

### Trap 3 — “Immutable means ransomware-proof”

Test credential, key, retention and account-deletion attack paths.

### Trap 4 — “The backup job is green, therefore recovery works”

Only restore/application validation proves recoverability.

### Trap 5 — “RTO is restore duration”

RTO includes decision, infrastructure, dependency, validation and business handoff.

### Trap 6 — “DR site means cyber recovery”

A replicated DR site may contain the same compromise and share the same identity/control plane.

### Trap 7 — “Latest backup is best”

During cyber recovery, latest may be contaminated.

### Trap 8 — “Cloud provider handles backup”

Shared responsibility and version/delete behavior must be documented.

### Trap 9 — “One annual DR test is enough”

Architecture, credentials, applications and dependencies change continuously. Testing frequency should follow business criticality and change rate.

### Trap 10 — “Backup capacity is the main sizing question”

Restore bandwidth, concurrency and RTO are often the real constraints.

---

## 15. Vendor-neutral architecture requirements

A procurement or technical specification should avoid brand-specific features and require measurable capabilities.

### 15.1 Protection capabilities

Specify:

- workload types and APIs;
- RPO tiers;
- retention tiers;
- consistency requirements;
- immutable/offline requirements;
- encryption requirements;
- copy/failure-domain requirements;
- restore granularity;
- catalog/search requirements;
- cloud/SaaS coverage where required.

### 15.2 Recovery capabilities

Specify:

- workload recovery time targets;
- aggregate restore throughput;
- concurrent recovery targets;
- alternate-site requirements;
- network and dependency orchestration;
- clean-room/isolation requirements;
- malware/integrity validation interfaces;
- identity recovery requirements;
- test automation and reporting.

### 15.3 Security requirements

Specify outcomes such as:

- MFA/strong privileged authentication;
- role separation;
- immutable audit logs;
- least privilege;
- encryption in transit/at rest;
- protected keys;
- isolated management access;
- vulnerability/patch lifecycle;
- secure configuration backup;
- support for independent monitoring.

Avoid writing a requirement around one vendor’s trademarked “vault” or feature name if the required outcome can be stated technically.

---

## 16. Operations and lifecycle

Protection environments fail when operational governance is weak. Define ownership for:

- failed backup jobs;
- missed RPO;
- capacity thresholds;
- immutable-retention exceptions;
- expired certificates/credentials;
- software/firmware upgrades;
- restore tests;
- DR exercises;
- security incidents;
- key rotation;
- catalog protection;
- policy changes;
- legal retention changes.

Lifecycle planning must consider:

- protected-data growth;
- repository refresh;
- tape/media lifecycle if used;
- cloud storage class and egress behavior;
- software licensing growth;
- application version compatibility;
- backup agent/plugin compatibility;
- hypervisor/database/API evolution;
- migration of historical restore points.

---

## 17. Golden acceptance test plan

A DC-K14 implementation should not be accepted solely from screenshots or vendor health status. Minimum test families should include:

### A. Policy and source protection

- prove all in-scope workloads are covered;
- prove configured RPO/retention matches design;
- prove application-consistent behavior for selected transactional workloads.

### B. Copy independence

- map storage/site/identity/management failure domains;
- demonstrate immutable retention behavior;
- demonstrate offline/isolation procedure where specified;
- verify encryption and key access.

### C. Restore

- restore files and representative systems;
- restore database/application state;
- measure actual throughput;
- measure actual achieved RPO/RTO;
- verify application integrity.

### D. DR

- execute alternate-site failover;
- validate dependencies and network/security behavior;
- validate business service;
- execute or fully rehearse controlled failback.

### E. Cyber recovery

- assume production privileged credentials are compromised;
- select a trusted recovery point using incident timeline;
- restore into isolated clean environment;
- verify malware/integrity state;
- rebuild/reset identity trust as required;
- reconnect in controlled stages.

### F. Control-plane loss

- recover backup catalog/configuration where required;
- prove access to protected copies without relying on a single unrecoverable control-plane component.

### G. Evidence

- retain timestamps, logs, metrics, issues and business-owner signoff;
- record defects and retest results.

---

## 18. BoQ freeze checklist

Do not freeze the BoQ until these parameters are explicit:

### Business / policy

- protected applications and data volumes;
- criticality tier;
- RPO/RTO per tier;
- retention per tier;
- compliance/legal hold requirements.

### Source / workload

- VM count and hypervisors;
- physical servers;
- databases and consistency method;
- Kubernetes/container state if in scope;
- NAS/file shares;
- object data;
- SaaS/cloud workloads;
- identity, PKI, secrets and configuration systems.

### Capacity

- current logical data;
- change rate;
- growth rate;
- retention;
- assumed data reduction;
- immutable reserve;
- replication copies;
- headroom;
- recovery staging space.

### Performance

- backup window;
- target ingest throughput;
- restore throughput;
- concurrent restore requirement;
- WAN bandwidth;
- cloud egress/restore constraints.

### Resilience / cyber

- copy locations;
- failure domains;
- immutable/offline mechanisms;
- admin/identity separation;
- clean-room capacity;
- golden images/IaC;
- security monitoring.

### Licensing / operations

- capacity/workload/subscription licensing basis;
- support term;
- cloud consumption;
- media costs;
- network ports/optics where required;
- rack/power for appliances;
- implementation services;
- DR/cyber exercise services;
- training and handover.

A BoQ frozen without RPO/RTO, retention, change rate and restore-performance assumptions is commercially incomplete.

---

## 19. Decision matrices

### 19.1 Protection method matrix

| Method | Best use | Primary limitation |
|---|---|---|
| Local snapshot | Fast operational rollback | Often shares primary failure/trust domain |
| Backup repository | Historical recovery | Restore speed/capacity must be engineered |
| Immutable repository/object | Cyber-resilient history | Immutability boundary must be tested |
| Offline media | Strong reachability separation | Longer operational/restore workflow |
| Replication | Low RPO / DR availability | Copies logical corruption and malicious change |
| Cross-site backup copy | Site independence | Network/capacity cost |
| Cross-account/cloud copy | Additional administrative isolation | Cloud IAM, key and account controls still critical |

### 19.2 Recovery architecture matrix

| Requirement | Architecture implication |
|---|---|
| Very low RPO | Frequent log/data replication or continuous protection |
| Very low RTO | Pre-positioned compute/network/application capacity |
| Site-loss tolerance | Independent alternate site/region and dependencies |
| Ransomware recovery | Immutable/offline copies + separate trust + clean-room validation |
| Identity compromise | Independent identity/bootstrap recovery plan |
| Large restore set | High aggregate read/network/write performance |
| Long retention | Capacity/media lifecycle and search/catalog design |

---

## 20. Engineer’s review questions

Before approving a design, ask:

1. What exact business service are we recovering?
2. What are its dependencies?
3. What are the measurable RPO and RTO?
4. Which recovery points are independent of production storage?
5. Which are independent of production identity and administrators?
6. Can a compromised backup admin delete or shorten retention?
7. How is the backup catalog itself recovered?
8. What happens if the latest backup is contaminated?
9. Where is the clean recovery environment?
10. How is identity/PKI/secrets trust re-established?
11. What is measured aggregate restore throughput?
12. How many workloads can be restored concurrently?
13. Has DR failover been tested end-to-end?
14. Has failback been tested?
15. Has a cyber scenario been tested, not only a site failure?
16. Are cloud/SaaS shared-responsibility assumptions documented?
17. Are golden images, code and IaC protected?
18. Are actual test RPO/RTO results retained as evidence?
19. What breaks when backup control-plane credentials are unavailable?
20. Which BoQ assumptions change cost the most?

If these questions cannot be answered, the design is not ready for Golden acceptance.

---

## 21. Canonical Golden rule

**Backup protects recoverable history. DR restores business service after infrastructure disruption. Cyber recovery restores trusted service after compromise. None is complete until an independent recovery point can be restored, validated and returned to operation within measured business objectives.**

Canonical engineering sequence:

`SERVICE CRITICALITY → BIA → DEPENDENCIES → RPO / RTO → PROTECTION POLICY → CONSISTENCY → COPY / FAILURE DOMAINS → IMMUTABILITY / ISOLATION → SECURITY / IDENTITY → RESTORE PERFORMANCE → DR ORCHESTRATION → CYBER CLEAN-ROOM → TEST / EVIDENCE → OPERATIONS / LIFECYCLE → TCO → BoQ FREEZE`

---

## 22. Official sources frozen for DC-K14

1. **NIST Cybersecurity Framework 2.0 (CSWP 29), final, 2024-02-26**  
   https://doi.org/10.6028/NIST.CSWP.29
2. **NIST IR 8374 Rev.1 — Ransomware Risk Management: A CSF 2.0 Community Profile, final, 2026-06-11**  
   https://doi.org/10.6028/NIST.IR.8374r1
3. **NIST SP 800-61 Rev.3 — Incident Response Recommendations and Considerations for Cybersecurity Risk Management, final, 2025-04-03**  
   https://doi.org/10.6028/NIST.SP.800-61r3
4. **NIST SP 800-184 — Guide for Cybersecurity Event Recovery, final**  
   https://doi.org/10.6028/NIST.SP.800-184
5. **NIST SP 800-209 — Security Guidelines for Storage Infrastructure, final**  
   https://doi.org/10.6028/NIST.SP.800-209
6. **NIST SP 800-209 Rev.1 Initial Public Draft, 2026-07-22 — directional/current draft only**  
   https://csrc.nist.gov/pubs/sp/800/209/r1/ipd
7. **NIST Ransomware Protection and Response publication index**, updated with current ransomware recovery references  
   https://csrc.nist.gov/Projects/ransomware-protection-and-response/publications
8. **CISA #StopRansomware Guide** — offline encrypted backups, regular integrity/DR testing, golden images, IaC protection, recovery sequencing and reinfection avoidance  
   https://www.cisa.gov/stopransomware/ransomware-guide
9. **NIST contingency planning topic / SP 800-34 lineage** — BIA, recovery strategy, plans, exercises and maintenance  
   https://csrc.nist.gov/topics/security-and-privacy/security-programs-and-operations/contingency-planning

**Source-status note:** NIST SP 800-209 Rev.1 is an Initial Public Draft as of this research date and is not represented as final. The final 2020 SP 800-209 remains the final publication baseline while the July 2026 draft is used only to capture current direction. NIST IR 8374 Rev.1 is final as of 11 June 2026.
