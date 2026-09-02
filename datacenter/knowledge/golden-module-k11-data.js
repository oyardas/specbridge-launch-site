(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K11');
if(!K||!m)return;
K.version='2.0';
K.updated='2026-09-03-dck11-golden-v2-live';
m.status='golden-v2-live';
m.tags=['HCI','hyperconverged','distributed storage','replication','erasure coding','quorum','witness','failure domain','resilient usable capacity','rebuild reserve','east-west network','RDMA','VM','Kubernetes','backup','DR','lifecycle','TCO','BoQ'];
const architectureStack=[
 ['WORKLOAD / SLA','State · latency · throughput · availability · RPO/RTO'],
 ['VIRTUALIZATION / ORCHESTRATION','VM platform · Kubernetes · policy · mobility'],
 ['DISTRIBUTED DATA LAYER','Placement · replication/EC · metadata · rebuild/rebalance'],
 ['NODE RESOURCE LAYER','CPU · memory · NIC · cache/capacity media · PCIe'],
 ['PHYSICAL FAILURE DOMAINS','Drive · node · ToR · rack · power · room/site']
];
const capacityModel=[
 ['Raw capacity','Nameplate media before resilience and overhead','Never treat as workload-usable capacity'],
 ['Usable capacity','After resilience/system overhead','Freeze policy assumptions and calculator inputs'],
 ['Resilient usable capacity','Safely operable capacity during required failure/maintenance state','Include rebuild/rebalance reserve and operational headroom'],
 ['Logical provisioned capacity','Thin-provisioned addressable space','Not evidence of physical capacity'],
 ['Data-reduced capacity','Compression/dedupe dependent result','Do not bank on best-case reduction ratios']
];
const failureMatrix=[
 ['Drive','Media/device path loss','Replica/EC placement and rebuild','Inject device failure and observe repair scope'],
 ['Node','Compute + memory + storage contribution lost together','Cluster reserve plus placement policy','Fail node under representative workload'],
 ['Network/ToR','Storage components may become unreachable','Independent fabrics/path policy/quorum behavior','Partition/link failure and recovery test'],
 ['Rack/power','Multiple nodes can disappear together','Rack-aware placement and capacity reserve','Prove rack-domain tolerance where required'],
 ['Site','Whole cluster location unavailable','Independent backup/DR or stretched design where justified','Prove RTO/RPO with actual recovery exercise']
];
const networkPath=[
 ['Client / north-south','Application traffic','Do not size HCI only from client traffic'],
 ['Storage east-west','Replication, reads, writes, rebuild, rebalance','Engineer concurrent steady + degraded traffic'],
 ['Migration / mobility','VM or workload movement','Validate contention with storage traffic'],
 ['Cluster control','Membership, metadata, management','Separate control reachability from data availability'],
 ['Backup / DR','Protection and replication flows','Avoid hidden oversubscription during recovery windows']
];
const lifecycleStates=[
 ['Normal','Target production load','Preserve steady-state headroom'],
 ['Single-node failure','Displaced compute + storage repair','Prove capacity and latency remain acceptable'],
 ['Maintenance','Node evacuation / component service','Reserve capacity before entering maintenance'],
 ['Rolling upgrade','Mixed-version and sequential evacuation','Freeze supported order and compatibility matrix'],
 ['Rebuild / rebalance','Background data movement','Measure application impact and completion time'],
 ['Restore / DR','Recovery plus dependency restart','Prove RTO/RPO from an actual test']
];
const decisionChain=[
 ['D1','Workload fit','Classify state, SLA, RPO/RTO, growth and operational model'],
 ['D2','Architecture fit','Choose HCI versus three-tier/converged/disaggregated based on coupling trade-offs'],
 ['D3','Node model','Freeze CPU, memory, media, NIC and PCIe contribution per node'],
 ['D4','Data policy','Freeze replication/EC, placement and integrity services'],
 ['D5','Failure domains','Map device/node/rack/network/power/site boundaries explicitly'],
 ['D6','Capacity','Calculate resilient usable capacity including repair reserve and headroom'],
 ['D7','Network','Size east-west, mobility, control and protection traffic concurrently'],
 ['D8','Platform integration','Validate VM/Kubernetes/CSI and support matrix'],
 ['D9','Protection','Separate HA restart, snapshot, backup, replication and DR'],
 ['D10','Lifecycle','Validate maintenance, firmware/software upgrade and rollback sequence'],
 ['D11','Failure acceptance','Test node/link/media loss plus rebuild under representative workload'],
 ['D12','TCO / BoQ freeze','Freeze licensing, support, node count, growth unit and acceptance criteria']
];
m.golden={
 version:'V2',researchStatus:'COMPLETE',quickAudioStatus:'LIVE',quickAudioQA:'1/1 PASS',fullAudioStatus:'LIVE',fullAudioQA:'8/8 PASS',
 quickDuration:320.064,quickDurationLabel:'5:20',fullDuration:2773.944,fullDurationLabel:'46:14',researchSections:253,sourceWords:4880,
 quickNarrationFile:'narration/DC-K11_QUICK_NARRATION_TR_V1.md',quickManifest:'audio/production/tr/dc-k11-quick-v1/manifest.json',
 narrationFile:'narration/DC-K11_FULL_NARRATION_TR_V2.md',manifest:'audio/production/tr/dc-k11-v2/manifest.json',
 chapters:[
  ['K11-00','HCI neden yalnızca server ve disk değildir?',291.024,'audio/production/tr/dc-k11-v2/k11-00-hci-neden-yalnizca-server-ve-disk-degildir.mp3'],
  ['K11-01','HCI node, compute ve resource coupling',354.624,'audio/production/tr/dc-k11-v2/k11-01-hci-node-compute-ve-resource-coupling.mp3'],
  ['K11-02','Distributed storage, replicas, erasure coding ve usable capacity',358.008,'audio/production/tr/dc-k11-v2/k11-02-distributed-storage-replicas-erasure-coding-ve-usable-capacity.mp3'],
  ['K11-03','Quorum, witness ve failure domains',343.656,'audio/production/tr/dc-k11-v2/k11-03-quorum-witness-ve-failure-domains.mp3'],
  ['K11-04','HCI network architecture',333.384,'audio/production/tr/dc-k11-v2/k11-04-hci-network-architecture.mp3'],
  ['K11-05','VM, Kubernetes, backup ve DR',355.872,'audio/production/tr/dc-k11-v2/k11-05-vm-kubernetes-backup-ve-dr.mp3'],
  ['K11-06','Scale, lifecycle, operations ve performance under failure',327.552,'audio/production/tr/dc-k11-v2/k11-06-scale-lifecycle-operations-ve-performance-under-failure.mp3'],
  ['K11-07','Sizing, TCO, acceptance ve hangi mimari ne zaman?',409.824,'audio/production/tr/dc-k11-v2/k11-07-sizing-tco-acceptance-ve-hangi-mimari-ne-zaman.mp3']
 ],
 architectureStack,capacityModel,failureMatrix,networkPath,lifecycleStates,decisionChain,
 serviceFamilies:architectureStack,facilityFit:failureMatrix,maturity:decisionChain,
 goldenRule:'WORKLOAD / SLA → HCI FIT → NODE RESOURCE MODEL → DATA PLACEMENT / REPLICATION / EC → FAILURE DOMAINS / QUORUM → RESILIENT USABLE CAPACITY → EAST-WEST NETWORK → VM / KUBERNETES INTEGRATION → HA / BACKUP / DR → MAINTENANCE & REBUILD RESERVE → FAILURE TEST UNDER LOAD → LIFECYCLE / TCO → BoQ FREEZE'
};
})();
