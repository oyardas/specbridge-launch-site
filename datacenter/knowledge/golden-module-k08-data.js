(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K08');
if(!K||!m)return;
K.version='2.0';
K.updated='2026-09-02-dck08-golden-v2-live';
m.status='golden-v2-live';
m.tags=['x86','server','CPU','socket','NUMA','memory','bandwidth','PCIe','CXL','NVMe','NIC','BMC','UEFI','Redfish','RAS','security','power','thermal','serviceability','TCO'];
const platformLayers=[
 ['ISA / SOFTWARE CONTRACT','x86-64 instruction set · OS / hypervisor · driver / application compatibility'],
 ['CPU / SOCKET','Core · thread · cache · frequency · 1S / 2S · inter-socket coherency'],
 ['MEMORY','Capacity · channel count · DIMM population · ECC / RAS · effective speed'],
 ['NUMA / LOCALITY','CPU-memory affinity · PCIe root locality · remote-access cost'],
 ['PCIe / CXL','Generation · width · lane budget · switches · retimers · device capability'],
 ['STORAGE / BOOT','Boot media · NVMe · HBA / RAID · backplane · endurance · service model'],
 ['NETWORK / OOB','NIC bandwidth · queues · offload · redundancy · dedicated management path'],
 ['FIRMWARE / MANAGEMENT','UEFI · ACPI · BMC · Redfish · firmware baseline · telemetry'],
 ['POWER / THERMAL / SERVICE','PSU A/B · sustained power · airflow · fan policy · serviceability · lifecycle']
];
const workloadMatrix=[
 ['Virtualization','Balanced multi-core throughput','High capacity + balanced channels','NIC + storage I/O','VM density, NUMA and failover benchmark'],
 ['Database','Per-core + cache sensitive','Capacity, latency and locality','Storage latency + NIC path','Representative DB workload and licensing model'],
 ['HCI','Compute + storage services together','Capacity + bandwidth','NVMe/backplane + east-west network','Node-loss, storage and network saturation test'],
 ['Storage node','Moderate compute, data-path focused','Metadata/cache dependent','Drive count, PCIe lanes and NIC throughput','End-to-end storage throughput + rebuild state'],
 ['HPC','High sustained compute','Bandwidth/locality critical','High-speed fabric + accelerators','NUMA-aware benchmark and fabric locality'],
 ['AI host','CPU feeds accelerator domain','Host memory + accelerator coordination','PCIe/CXL + GPU/DPU/NIC topology','Topology-aware accelerator and network acceptance'],
 ['Edge','Right-sized compute','Capacity constrained by form/power','Compact storage/network','Remote management, power and serviceability validation']
];
const localityAudit=[
 ['CPU topology','1S or 2S chosen from real workload need','2S selected only for headline core count','Compare compute, memory, I/O and license requirement'],
 ['Memory population','Channels populated to capacity + bandwidth target','Large DIMMs leave channels underused','Validate population matrix and measured bandwidth'],
 ['NUMA memory','Workload memory local to execution domain where practical','Frequent remote-memory traffic','Inspect OS/hypervisor NUMA topology and counters'],
 ['NIC locality','Latency/throughput workload near NIC root complex','NIC traffic crosses socket unnecessarily','Map NIC slot → root complex → workload placement'],
 ['NVMe / HBA locality','Storage path aligned to processing/storage service','Cross-socket PCIe traffic becomes bottleneck','Trace backplane/switch/root-complex path'],
 ['Accelerators','GPU/DPU/FPGA topology validated','Lane oversubscription or wrong locality','Validate slot width, generation, peer path and software support'],
 ['PSU / rack feed','Dual PSU mapped to intended A/B feeds','Two PSUs on one upstream failure domain','Trace PSU-to-rack-to-upstream power path']
];
const decisionChain=[
 ['D1','Workload','Throughput, latency, consolidation, licensing, availability and lifecycle target'],
 ['D2','CPU topology','Core/per-core profile, 1S/2S, cache and sustained-frequency behavior'],
 ['D3','Memory','Capacity, channels, DIMM population, bandwidth, ECC/RAS and NUMA distribution'],
 ['D4','I/O budget','PCIe/CXL generations, widths, lanes, switches, NIC/NVMe/HBA/accelerator demand'],
 ['D5','Storage & network','Boot model, local-storage role, network throughput, redundancy and OOB'],
 ['D6','Management & security','BMC/Redfish, UEFI, secure boot, firmware baseline and telemetry'],
 ['D7','Power / thermal / service','PSU mapping, sustained watts, airflow, acoustics/thermal limits and FRU access'],
 ['D8','Acceptance / lifecycle','Representative workload benchmark, failure test, HCL/support, firmware and refresh plan']
];
m.golden={
 version:'V2',researchStatus:'COMPLETE',quickAudioStatus:'LIVE',quickAudioQA:'1/1 PASS',fullAudioStatus:'LIVE',fullAudioQA:'8/8 PASS',
 quickDuration:348.624,quickDurationLabel:'5:49',fullDuration:2146.656,fullDurationLabel:'35:47',researchSections:261,sourceCount:28,targetFullMinutes:'35:47',
 quickNarrationFile:'narration/DC-K08_QUICK_NARRATION_TR_V1.md',quickManifest:'audio/production/tr/dc-k08-quick-v1/manifest.json',
 narrationFile:'narration/DC-K08_FULL_NARRATION_TR_V2.md',manifest:'audio/production/tr/dc-k08-v2/manifest.json',
 chapters:[
  ['K08-00','x86 server gerçekte nedir?',279.768,'audio/production/tr/dc-k08-v2/k08-00-x86-server-gercekte-nedir.mp3','audio/production/tr/dc-k08-v2/k08-00-x86-server-gercekte-nedir.source.txt'],
  ['K08-01','Core, thread, socket, cache ve CPU topology',276.504,'audio/production/tr/dc-k08-v2/k08-01-core-thread-socket-cache-ve-cpu-topology.mp3','audio/production/tr/dc-k08-v2/k08-01-core-thread-socket-cache-ve-cpu-topology.source.txt'],
  ['K08-02','Memory channels, DIMMs, ECC, RAS ve bandwidth',269.256,'audio/production/tr/dc-k08-v2/k08-02-memory-channels-dimms-ecc-ras-ve-bandwidth.mp3','audio/production/tr/dc-k08-v2/k08-02-memory-channels-dimms-ecc-ras-ve-bandwidth.source.txt'],
  ['K08-03','NUMA ve locality',269.016,'audio/production/tr/dc-k08-v2/k08-03-numa-ve-locality.mp3','audio/production/tr/dc-k08-v2/k08-03-numa-ve-locality.source.txt'],
  ['K08-04','PCIe, CXL ve I/O lane budget',269.112,'audio/production/tr/dc-k08-v2/k08-04-pcie-cxl-ve-i-o-lane-budget.mp3','audio/production/tr/dc-k08-v2/k08-04-pcie-cxl-ve-i-o-lane-budget.source.txt'],
  ['K08-05','Boot, NVMe, local storage ve network interfaces',250.728,'audio/production/tr/dc-k08-v2/k08-05-boot-nvme-local-storage-ve-network-interfaces.mp3','audio/production/tr/dc-k08-v2/k08-05-boot-nvme-local-storage-ve-network-interfaces.source.txt'],
  ['K08-06','BMC, UEFI, Redfish, firmware ve platform security',264.72,'audio/production/tr/dc-k08-v2/k08-06-bmc-uefi-redfish-firmware-ve-platform-security.mp3','audio/production/tr/dc-k08-v2/k08-06-bmc-uefi-redfish-firmware-ve-platform-security.source.txt'],
  ['K08-07','Power, thermal, serviceability, TCO ve hangi server ne zaman?',267.552,'audio/production/tr/dc-k08-v2/k08-07-power-thermal-serviceability-tco-ve-hangi-server-ne-zaman.mp3','audio/production/tr/dc-k08-v2/k08-07-power-thermal-serviceability-tco-ve-hangi-server-ne-zaman.source.txt']
 ],
 platformLayers,workloadMatrix,localityAudit,decisionChain,
 serviceFamilies:platformLayers,
 responsibility:localityAudit,
 facilityFit:workloadMatrix,
 maturity:decisionChain,
 goldenRule:'WORKLOAD → CPU TOPOLOGY → MEMORY CAPACITY / BANDWIDTH → NUMA LOCALITY → PCIe / CXL LANE BUDGET → STORAGE / BOOT → NETWORK / OOB → MANAGEMENT / SECURITY → POWER / THERMAL / SERVICEABILITY → REPRESENTATIVE BENCHMARK → LIFECYCLE / BoQ FREEZE'
};
})();
