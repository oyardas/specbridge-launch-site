(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K09');
if(!K||!m)return;
K.version='2.0';
K.updated='2026-09-02-dck09-golden-v2-live';
m.status='golden-v2-live';
m.tags=['accelerated compute','GPU','AI ASIC','FPGA','HBM','PCIe','CXL','NUMA','scale-up','scale-out','DPU','IPU','SmartNIC','SR-IOV','partitioning','Kubernetes DRA','power','liquid cooling','benchmark','TCO'];
const roleStack=[
 ['APPLICATION COMPUTE','GPU · AI ASIC · FPGA · workload-specific accelerator'],
 ['HOST / MEMORY / PCIe-CXL','CPU · NUMA · host memory · PCIe root/switch/retimer · CXL capability'],
 ['INFRASTRUCTURE OFFLOAD','DPU · IPU · SmartNIC · network/storage/security/virtualization services'],
 ['SCALE-UP / SCALE-OUT / STORAGE','Peer fabric · collective domain · scale-out NIC/fabric · storage data path'],
 ['POWER / COOLING / OPERATIONS','Rack power · liquid/air boundary · telemetry · failure isolation · lifecycle']
];
const dataMovement=[
 ['Storage','NIC / DPU','Storage traffic enters the node through the intended network/offload path','Validate storage protocol, NIC/DPU ownership and failure path'],
 ['NIC / DPU','PCIe root complex','Infrastructure traffic reaches host/accelerator domain through a negotiated PCIe path','Check generation, width, switch/retimer path and NUMA root locality'],
 ['PCIe root complex','GPU HBM','Application data is staged or transferred into accelerator-local memory','Validate host-memory, DMA/P2P capability and software support'],
 ['GPU HBM','Scale-up peers','Peer traffic uses the platform scale-up domain where supported','Do not infer collective efficiency from link presence alone'],
 ['Scale-up domain','Scale-out NICs','Traffic crosses node/rack boundary through the scale-out fabric','Validate oversubscription, congestion control and topology'],
 ['All domains','CPU / NUMA locality','CPU placement can amplify or reduce remote-memory and cross-root traffic','Map process, memory, NIC and accelerator affinity end to end']
];
const scaleMatrix=[
 ['Device','HBM/local fabric','Lowest within-device','Device / partition boundary','None or local interconnect only'],
 ['Baseboard / node','High-bandwidth peer links / PCIe','Low, topology-dependent','Accelerator/baseboard/node','May be independent of Ethernet scale-out'],
 ['Rack','Scale-up extension or high-speed fabric','Higher than node-local','Rack / fabric segment','Often depends on fabric design and switch topology'],
 ['Multi-rack','Scale-out network','Highest among listed domains','Network, rack, path and congestion domains','Fundamentally network-dependent']
];
const responsibility=[
 ['Application compute','GPU / accelerator','Model execution, matrix/vector/graphics or workload-specific acceleration'],
 ['Network','NIC / SmartNIC / DPU / IPU','Packet processing, transport and selected infrastructure offloads'],
 ['Storage','NIC / DPU / host stack','Storage protocol/data path; direct paths depend on platform/software support'],
 ['Security','CPU and/or infrastructure offload','Crypto, isolation, policy enforcement or service chaining where supported'],
 ['Virtualization','CPU/IOMMU plus accelerator/DPU capabilities','Passthrough, SR-IOV, mediated/partitioned device access'],
 ['Telemetry','BMC / host / accelerator / fabric telemetry','Health, utilization, errors, thermals, fabric and workload observability'],
 ['Isolation','Platform-specific partitioning and IOMMU controls','A virtual function or partition is not automatically a physical failure domain'],
 ['Operations','Scheduler / orchestration / lifecycle tooling','Placement, firmware, drivers, maintenance, capacity and failure handling']
];
const decisionChain=[
 ['D1','Workload','Define model/application, precision, dataset, latency, throughput and availability objectives'],
 ['D2','Software / precision','Validate framework, compiler, driver, library and supported numeric precision'],
 ['D3','HBM','Size accelerator memory capacity and measured memory bandwidth to the workload'],
 ['D4','Host / NUMA','Map CPU, host memory, accelerator slots and locality requirements'],
 ['D5','PCIe / CXL','Validate negotiated end-to-end generation, width, switching, retimers and platform support'],
 ['D6','Scale-up','Validate peer topology, bandwidth, latency, collective behavior and failure domain'],
 ['D7','NIC / DPU / storage','Define infrastructure offload and direct-data paths without conflating DPU with ordinary NIC'],
 ['D8','Scale-out','Validate fabric bandwidth, congestion behavior, topology and multi-rack failure boundaries'],
 ['D9','Sharing / scheduling','Validate passthrough, SR-IOV, partitioning, device plugins/DRA and placement rules'],
 ['D10','Power / thermal','Close sustained rack power, airflow/liquid boundary, coolant/CDU interfaces and telemetry'],
 ['D11','Failure test','Exercise device, link, switch, node, rack, cooling and software failure scenarios'],
 ['D12','Benchmark / TCO / BoQ freeze','Measure representative application performance, lifecycle/support and freeze exact topology in BoQ']
];
m.golden={
 version:'V2',researchStatus:'COMPLETE',quickAudioStatus:'LIVE',quickAudioQA:'1/1 PASS',fullAudioStatus:'LIVE',fullAudioQA:'8/8 PASS',
 quickDuration:379.488,quickDurationLabel:'6:19',fullDuration:2220.072,fullDurationLabel:'37:00',researchSections:193,sourceCount:30,sourceWords:3911,targetFullMinutes:'37:00',
 quickNarrationFile:'narration/DC-K09_QUICK_NARRATION_TR_V1.md',quickManifest:'audio/production/tr/dc-k09-quick-v1/manifest.json',
 narrationFile:'narration/DC-K09_FULL_NARRATION_TR_V2.md',manifest:'audio/production/tr/dc-k09-v2/manifest.json',
 chapters:[
  ['K09-00','Accelerated compute nedir; GPU, DPU, SmartNIC ve FPGA neden aynı şey değildir?',284.52,'audio/production/tr/dc-k09-v2/k09-00-accelerated-compute-nedir-gpu-dpu-smartnic-ve-fpga-neden-ayni-sey-degild.mp3','audio/production/tr/dc-k09-v2/k09-00-accelerated-compute-nedir-gpu-dpu-smartnic-ve-fpga-neden-ayni-sey-degild.source.txt'],
  ['K09-01','GPU compute, precision, HBM capacity ve memory bandwidth',284.352,'audio/production/tr/dc-k09-v2/k09-01-gpu-compute-precision-hbm-capacity-ve-memory-bandwidth.mp3','audio/production/tr/dc-k09-v2/k09-01-gpu-compute-precision-hbm-capacity-ve-memory-bandwidth.source.txt'],
  ['K09-02','PCIe, CXL, NUMA ve accelerator locality',287.52,'audio/production/tr/dc-k09-v2/k09-02-pcie-cxl-numa-ve-accelerator-locality.mp3','audio/production/tr/dc-k09-v2/k09-02-pcie-cxl-numa-ve-accelerator-locality.source.txt'],
  ['K09-03','Scale-up, scale-out ve multi-accelerator topology',275.208,'audio/production/tr/dc-k09-v2/k09-03-scale-up-scale-out-ve-multi-accelerator-topology.mp3','audio/production/tr/dc-k09-v2/k09-03-scale-up-scale-out-ve-multi-accelerator-topology.source.txt'],
  ['K09-04','DPU, IPU ve SmartNIC gerçekte ne yapar?',276.312,'audio/production/tr/dc-k09-v2/k09-04-dpu-ipu-ve-smartnic-gercekte-ne-yapar.mp3','audio/production/tr/dc-k09-v2/k09-04-dpu-ipu-ve-smartnic-gercekte-ne-yapar.source.txt'],
  ['K09-05','Virtualization, partitioning ve accelerator scheduling',275.88,'audio/production/tr/dc-k09-v2/k09-05-virtualization-partitioning-ve-accelerator-scheduling.mp3','audio/production/tr/dc-k09-v2/k09-05-virtualization-partitioning-ve-accelerator-scheduling.source.txt'],
  ['K09-06','Power, liquid cooling, rack-scale integration ve failure modes',255.984,'audio/production/tr/dc-k09-v2/k09-06-power-liquid-cooling-rack-scale-integration-ve-failure-modes.mp3','audio/production/tr/dc-k09-v2/k09-06-power-liquid-cooling-rack-scale-integration-ve-failure-modes.source.txt'],
  ['K09-07','Accelerator platformu nasıl seçilir, benchmark edilir ve BoQ’da freeze edilir?',280.296,'audio/production/tr/dc-k09-v2/k09-07-accelerator-platformu-nasil-secilir-benchmark-edilir-ve-boqda-freeze-edi.mp3','audio/production/tr/dc-k09-v2/k09-07-accelerator-platformu-nasil-secilir-benchmark-edilir-ve-boqda-freeze-edi.source.txt']
 ],
 roleStack,dataMovement,scaleMatrix,responsibility,decisionChain,
 serviceFamilies:roleStack,
 facilityFit:scaleMatrix,
 maturity:decisionChain,
 goldenRule:'WORKLOAD → SOFTWARE / PRECISION → HBM CAPACITY / BANDWIDTH → HOST / NUMA → PCIe / CXL → SCALE-UP → NIC / DPU / STORAGE → SCALE-OUT → SHARING / SCHEDULING → POWER / THERMAL → FAILURE TEST → REPRESENTATIVE BENCHMARK → TCO / LIFECYCLE → BoQ FREEZE'
};
})();
