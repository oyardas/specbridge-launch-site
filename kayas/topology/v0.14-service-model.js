/* KAYAS DCTS v0.14.1 — canonical service/network runtime bridge */
(function(){'use strict';
function AO(a){if(!O.some(x=>x.id===a[0]))O.push({id:a[0],name:a[1],domain:a[2],cls:a[3],role:a[4],type:'LOGICAL',qty:a[5],vendor:'KAYAS / DCTS',model:a[6],sku:'Not encoded',find:0,open:1,views:a[7],status:a[8]})}
function AR(a){if(!R.some(x=>x.id===a[0]))R.push({id:a[0],from:a[1],to:a[2],type:a[3],cat:a[4],views:a[5],status:'WORKING ASSUMPTION',evidence:['KAYAS-DCTS:210-SERVICE-MODEL']})}
try{
C.SERVICE='#35d5e5';C.TENANT='#52df8b';C.AI='#f3b744';
[
['topobj_kayas_service_iaas_40','IaaS / Cloud — 40 Standard Racks','SERVICE','SERVICE_DOMAIN','SERVICE.DOMAIN.IAAS_CLOUD',40,'IaaS / Cloud',['T02','T06'],'VENDOR PROPOSAL'],
['topobj_kayas_service_managed_colo_80','Managed Colocation — 80 Standard Racks','SERVICE','SERVICE_DOMAIN','SERVICE.DOMAIN.MANAGED_COLOCATION',80,'Managed Colocation',['T02','T06'],'VENDOR PROPOSAL'],
['topobj_kayas_service_colo_80','Colocation — 80 Standard Racks','SERVICE','SERVICE_DOMAIN','SERVICE.DOMAIN.COLOCATION',80,'Pure Colocation',['T02','T06'],'VENDOR PROPOSAL'],
['topobj_kayas_rackpool_iaas','Standard Pods 01–02 — 40 Racks','TENANT','RACK_POOL','TENANT.CAPACITY.RACK_POOL',40,'POD-01–02',['T06'],'WORKING ASSUMPTION'],
['topobj_kayas_rackpool_managed_colo','Standard Pods 03–06 — 80 Racks','TENANT','RACK_POOL','TENANT.CAPACITY.RACK_POOL',80,'POD-03–06',['T06'],'WORKING ASSUMPTION'],
['topobj_kayas_rackpool_colo','Standard Pods 07–10 — 80 Racks','TENANT','RACK_POOL','TENANT.CAPACITY.RACK_POOL',80,'POD-07–10',['T06'],'WORKING ASSUMPTION'],
['topobj_kayas_shared_dc_services','Shared DC Services','SERVICE','SHARED_SERVICE','SERVICE.SHARED.DC_SERVICES',null,'Network / Security / Operations / Management',['T06'],'WORKING ASSUMPTION'],
['topobj_kayas_ai_hd_zone','AI / High-Density Zone — +10 Additional Racks','AI','RACK_POOL','AI.CAPACITY.HIGH_DENSITY_ZONE',10,'Additional AI / High-Density Capacity',['T02','T06'],'CUSTOMER INPUT'],
['topobj_kayas_dc_network_fabric','Shared DC Network Fabric','NETWORK','LOGICAL_FABRIC','NETWORK.FABRIC.SHARED_SERVICE_FABRIC',null,'Provider-controlled shared fabric',['T02'],'WORKING ASSUMPTION'],
['topobj_kayas_colo_demarcation','Colocation Demarcation / Cross-Connect','NETWORK','DEMARCATION','NETWORK.DEMARCATION.COLOCATION',null,'Provider-to-customer handoff',['T02'],'WORKING ASSUMPTION'],
['topobj_kayas_ai_network_fabric','AI / High-Density Network Fabric','AI','LOGICAL_FABRIC','NETWORK.FABRIC.AI_HIGH_SPEED',null,'High-speed AI fabric — sizing pending',['T02'],'WORKING ASSUMPTION'],
['topobj_kayas_oob_plane_210','Independent OOB Management Plane — 210 Racks','OOB','MANAGEMENT_PLANE','OOB.MANAGEMENT.PLANE',210,'Independent management plane',['T02'],'WORKING ASSUMPTION']].forEach(AO);
[
['rel_kayas_iaas_pool_member','topobj_kayas_rackpool_iaas','topobj_kayas_service_iaas_40','SERVICE.MEMBER_OF','SERVICE',['T06']],
['rel_kayas_managed_pool_member','topobj_kayas_rackpool_managed_colo','topobj_kayas_service_managed_colo_80','SERVICE.MEMBER_OF','SERVICE',['T06']],
['rel_kayas_colo_pool_member','topobj_kayas_rackpool_colo','topobj_kayas_service_colo_80','SERVICE.MEMBER_OF','SERVICE',['T06']],
['rel_kayas_shared_to_iaas','topobj_kayas_shared_dc_services','topobj_kayas_service_iaas_40','SERVICE.PROVIDES_SERVICE_TO','SERVICE',['T06']],
['rel_kayas_shared_to_managed','topobj_kayas_shared_dc_services','topobj_kayas_service_managed_colo_80','SERVICE.PROVIDES_SERVICE_TO','SERVICE',['T06']],
['rel_kayas_shared_to_colo','topobj_kayas_shared_dc_services','topobj_kayas_service_colo_80','SERVICE.PROVIDES_SERVICE_TO','SERVICE',['T06']],
['rel_kayas_net_fabric_to_iaas','topobj_kayas_dc_network_fabric','topobj_kayas_service_iaas_40','SERVICE.PROVIDES_SERVICE_TO','SERVICE',['T02']],
['rel_kayas_net_fabric_to_managed','topobj_kayas_dc_network_fabric','topobj_kayas_service_managed_colo_80','SERVICE.PROVIDES_SERVICE_TO','SERVICE',['T02']],
['rel_kayas_net_fabric_to_colo_demarc','topobj_kayas_dc_network_fabric','topobj_kayas_colo_demarcation','LOGICAL.CONNECTS_TO','LOGICAL',['T02']],
['rel_kayas_colo_demarc_to_colo','topobj_kayas_colo_demarcation','topobj_kayas_service_colo_80','SERVICE.PROVIDES_SERVICE_TO','SERVICE',['T02']],
['rel_kayas_net_fabric_to_ai_fabric','topobj_kayas_dc_network_fabric','topobj_kayas_ai_network_fabric','LOGICAL.CONNECTS_TO','LOGICAL',['T02']],
['rel_kayas_ai_fabric_to_ai_zone','topobj_kayas_ai_network_fabric','topobj_kayas_ai_hd_zone','SERVICE.PROVIDES_SERVICE_TO','SERVICE',['T02']],
['rel_kayas_oob_to_iaas','topobj_kayas_oob_plane_210','topobj_kayas_service_iaas_40','OOB.PROVIDES_SERVICE_TO','MANAGEMENT',['T02']],
['rel_kayas_oob_to_managed','topobj_kayas_oob_plane_210','topobj_kayas_service_managed_colo_80','OOB.PROVIDES_SERVICE_TO','MANAGEMENT',['T02']],
['rel_kayas_oob_to_colo','topobj_kayas_oob_plane_210','topobj_kayas_service_colo_80','OOB.PROVIDES_SERVICE_TO','MANAGEMENT',['T02']],
['rel_kayas_oob_to_ai','topobj_kayas_oob_plane_210','topobj_kayas_ai_hd_zone','OOB.PROVIDES_SERVICE_TO','MANAGEMENT',['T02']]].forEach(AR);
if(typeof investorRelationshipStats==='function')investorRelationshipStats=function(o){
  const q=R.filter(r=>r.views.includes(view)&&(r.from===o.id||r.to===o.id));
  const confirmed=q.filter(r=>!r.status||r.status==='CONFIRMED').length;
  const modeled=q.filter(r=>r.status&&r.status!=='CONFIRMED').length;
  const proposed=A.filter(r=>r.views.includes(view)&&(r.from===o.id||r.to===o.id)).length+modeled;
  return {confirmed,proposed,open:o.open??0};
};
V.T02.name='Network Service Architecture';
V.T02.note='210 total cabinets: 200 standard racks allocated as 40 IaaS + 80 Managed Colocation + 80 Pure Colocation, plus 10 additional AI/high-density racks. IaaS and Managed Colo use the shared provider fabric; Pure Colo uses a demarcation/cross-connect boundary; AI uses a separate high-speed logical fabric; OOB spans all 210 racks. Physical switch, port and bandwidth sizing remains open.';
if(typeof STORY_T02!=='undefined')STORY_T02.splice(0,STORY_T02.length,
{step:0,title:'210-Cabinet Capacity Model',caption:'KAYAS has 210 total cabinets: 200 standard cabinets divided into 40 IaaS, 80 Managed Colocation and 80 Pure Colocation cabinets, plus ten additional AI and high-density cabinets.',selectors:['.cap'],current:['.cap'],zoom:.96,duration:6800},
{step:1,title:'Security and Shared Fabric',caption:'The upstream security chain hands traffic to the shared provider-controlled data-center fabric. Security handoff remains a controlled design path.',selectors:['.security'],current:['.security'],zoom:.95,duration:7000},
{step:2,title:'Service Domains',caption:'IaaS and Managed Colocation consume the provider fabric directly. Pure Colocation crosses a provider-to-customer demarcation boundary. The ten AI racks use a separate high-speed AI fabric.',selectors:['.services'],current:['.services'],zoom:.91,duration:8200},
{step:3,title:'OOB and Open Sizing',caption:'Independent out-of-band management covers all 210 racks. Switch quantities, rack-facing ports, uplinks, optics, oversubscription and the AI Ethernet or RoCE profile remain open sizing inputs.',selectors:['.oob','.open'],current:['.oob','.open'],zoom:.90,duration:8200});
const p=document.querySelector('.statuspill');if(p)p.textContent=`${O.length} objects · ${R.length} modeled rels`;
}catch(e){console.error('[DCTS v0.14.1 model]',e)}})();
