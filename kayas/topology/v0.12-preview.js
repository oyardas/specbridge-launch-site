/* DCTS v0.12.0 — Premium Interactive Overview Map — WP1-WP4 checkpoint */
(function(){
  const BASE_RENDER_GROUPS=renderGroups;
  renderGroups=function(){
    document.body.classList.toggle('t00-premium',view==='T00'&&!domainFocus);
    return BASE_RENDER_GROUPS();
  };

  function shortName(o){
    const m={
      'Legacy Interconnect Switches':'Legacy Interconnect','DC Fabric Spine Pair':'Spine Pair','Server / Tenant Leaf Pair':'Leaf Pair','Storage Network Switches':'Storage Switches',
      'Perimeter Firewall Pair':'Perimeter Firewall','ADC Pair':'ADC','Egress Firewall Pair':'Egress Firewall','CAS Virtualization Hosts':'CAS Hosts','CAS Virtualization Platform':'CAS Platform',
      'All-Flash Storage Nodes':'All-Flash Nodes','ONEStor Block Platform':'ONEStor','CloudOS Management Hosts':'Cloud Mgmt Hosts','CloudOS Platform':'CloudOS',
      'Backup Appliance':'Backup Appliance','AnyBackup 7.0 Platform':'AnyBackup 7.0','Management Host Cluster':'Mgmt Host Cluster','AD-DC / SeerEngine-DC':'AD-DC / SeerEngine',
      'OOB Switch Pair':'OOB Switch Pair','SeerAnalyzer':'SeerAnalyzer'
    };
    return m[o.name]||o.name;
  }
  function mini(id,target,forcedLabel=''){
    const o=obj(id);if(!o)return '';
    const label=forcedLabel||shortName(o);
    return `<button class="t00-hot-object" style="--accent:${C[o.domain]}" onclick="t00Navigate('${target}','${id}')">
      <span class="miniico">${icon(o)}</span><span><b>${label}</b><em>${investorSubtitle(o)}</em></span><span class="goto">${target} ↗</span>
    </button>`;
  }
  function coreChip(id,target,cls,label){
    const o=obj(id);if(!o)return '';
    return `<button class="t00-core-label ${cls}" onclick="t00Navigate('${target}','${id}')" style="--accent:${C[o.domain]}">${icon(o)}<b>${label||shortName(o)}</b><span>${target} · ${investorSubtitle(o)}</span></button>`;
  }
  function panel(title,target,cls,body){
    return `<section class="t00-panel ${cls}"><div class="t00-panel-title" onclick="t00Navigate('${target}')">${title}<small>Open ${target} ↗</small></div><div class="t00-panel-body">${body}</div></section>`;
  }

  window.t00Navigate=function(target,id=null){
    if(!V[target])return;
    stopStory();
    view=target;selected=id||null;domainFocus=null;
    document.body.classList.remove('t00-premium');
    render();
    const h=`view=${encodeURIComponent(target)}${id?`&object=${encodeURIComponent(id)}`:''}`;
    try{history.replaceState(null,'',`#${h}`)}catch(_){}
    if(id){
      setTimeout(()=>{
        renderInspector();
        if(semantic)openFocus(id);
      },220);
    }
  };

  renderT00Overview=function(){
    const cloud=mini('topobj_f61dad7a8323cc32b048','T06')+mini('topobj_4290683013244cf50d95','T06');
    const security=mini('topobj_dc750ed177fb87984c3a','T02')+mini('topobj_d22103a970df15ebc013','T02')+mini('topobj_4a235cb934f5c5a46901','T02');
    const storage=mini('topobj_6a8d3500c63b7ce61860','T04')+mini('topobj_1d5cc2cacf4060035882','T04');
    const protection=mini('topobj_bba651ea257e81f79ce6','T06')+mini('topobj_f59c004a4842a0ab2300','T06');
    const management=mini('topobj_ca569b60f525d5fd277f','T05','Mgmt Hosts')+mini('topobj_56b5cee0b4c39857a70a','T05','OOB')+mini('topobj_bbc53ea9c663404b7a82','T05','AD-DC / SeerEngine')+mini('topobj_60b6648480d5d86edc25','T05','Analytics');

    const iso=`<svg class="t00-iso-svg" viewBox="0 0 500 250" aria-hidden="true">
      <polygon class="t00-iso-floor" points="48,142 245,44 452,142 252,238"/>
      <path class="t00-iso-grid" d="M88 122l203 96M128 102l203 96M168 82l203 96M208 62l203 96M410 122L212 218M370 102L172 198M330 82L132 178M290 62L92 158"/>
      <g transform="translate(116 90)"><polygon class="t00-rack-top" points="0,16 27,2 50,13 23,27"/><polygon class="t00-rack-front" points="23,27 50,13 50,78 23,92"/><polygon class="t00-rack-side" points="0,16 23,27 23,92 0,80"/><circle class="t00-rack-led" cx="40" cy="31" r="1.5"/><circle class="t00-rack-led" cx="40" cy="42" r="1.5"/><circle class="t00-rack-led" cx="40" cy="53" r="1.5"/></g>
      <g transform="translate(178 61)"><polygon class="t00-rack-top" points="0,16 27,2 50,13 23,27"/><polygon class="t00-rack-front" points="23,27 50,13 50,78 23,92"/><polygon class="t00-rack-side" points="0,16 23,27 23,92 0,80"/><circle class="t00-rack-led" cx="40" cy="31" r="1.5"/><circle class="t00-rack-led" cx="40" cy="42" r="1.5"/><circle class="t00-rack-led" cx="40" cy="53" r="1.5"/></g>
      <g transform="translate(240 82)"><polygon class="t00-rack-top" points="0,16 27,2 50,13 23,27"/><polygon class="t00-rack-front" points="23,27 50,13 50,78 23,92"/><polygon class="t00-rack-side" points="0,16 23,27 23,92 0,80"/><circle class="t00-rack-led" cx="40" cy="31" r="1.5"/><circle class="t00-rack-led" cx="40" cy="42" r="1.5"/><circle class="t00-rack-led" cx="40" cy="53" r="1.5"/></g>
      <g transform="translate(302 110)"><polygon class="t00-rack-top" points="0,16 27,2 50,13 23,27"/><polygon class="t00-rack-front" points="23,27 50,13 50,78 23,92"/><polygon class="t00-rack-side" points="0,16 23,27 23,92 0,80"/><circle class="t00-rack-led" cx="40" cy="31" r="1.5"/><circle class="t00-rack-led" cx="40" cy="42" r="1.5"/><circle class="t00-rack-led" cx="40" cy="53" r="1.5"/></g>
    </svg>`;

    const flows=`<svg class="t00-flow-svg" viewBox="0 0 1160 650" aria-hidden="true"><defs>
      <marker id="t00cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path class="t00-flow-arrow" d="M0 0L10 5L0 10z"/></marker>
      <marker id="t00purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path class="t00-flow-arrow mgmt" d="M0 0L10 5L0 10z"/></marker>
      <marker id="t00green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path class="t00-flow-arrow service" d="M0 0L10 5L0 10z"/></marker>
      </defs>
      <path class="t00-flow" marker-end="url(#t00cyan)" d="M148 202 H214 V322 H238"/><text class="t00-flow-label" x="156" y="194">SERVICE INGRESS</text>
      <path class="t00-flow" marker-end="url(#t00cyan)" d="M200 408 H226 V310 H250"/>
      <path class="t00-flow" marker-end="url(#t00cyan)" d="M828 292 H862"/><text class="t00-flow-label" x="830" y="282">DATA SERVICES</text>
      <path class="t00-flow service" marker-end="url(#t00green)" d="M676 148 V124"/>
      <path class="t00-flow service" marker-end="url(#t00green)" d="M810 414 H862"/>
      <path class="t00-flow mgmt" marker-end="url(#t00purple)" d="M540 548 V514 H534 V488"/>
      <path class="t00-flow mgmt" marker-end="url(#t00purple)" d="M650 548 V510 H950 V352"/>
      <path class="t00-flow mgmt" marker-end="url(#t00purple)" d="M720 548 V520 H728 V124"/>
      <text class="t00-flow-label" x="554" y="536">MANAGEMENT / CONTROL CONTEXT</text>
    </svg>`;

    $('#groups').className='groups reference-t00';
    $('#groups').innerHTML=`<div class="t00-premium-stage">
      <div class="t00-premium-kicker">DCTS · KAYAS · MASTER ARCHITECTURE NAVIGATION</div>
      <div class="t00-premium-title">KAYAS <span>Digital Infrastructure Platform</span></div>
      <div class="t00-premium-subtitle">Investor-oriented master map · select a technology domain or component to enter the controlled detailed view</div>
      <div class="t00-legend"><span><i></i>Architecture flow</span><span><i class="mgmt"></i>Management context</span><span><i class="nav"></i>Navigation / evidence boundary</span></div>
      ${flows}
      ${panel('External / Service Ingress','T01','t00-external-panel',`<button class="t00-context-chip" onclick="t00Navigate('T01')">Internet / Carrier</button><button class="t00-context-chip" onclick="t00Navigate('T01')">Public Cloud</button><button class="t00-context-chip" onclick="t00Navigate('T01')">Partners</button><button class="t00-context-chip" onclick="t00Navigate('T01')">Users / Tenants</button>`)}
      ${panel('Security Boundary','T02','t00-security-panel',security)}
      ${panel('Cloud Service Platform','T06','t00-cloud-panel',cloud)}
      ${panel('Storage','T04','t00-storage-panel',storage)}
      ${panel('Data Protection','T06','t00-protect-panel',protection)}
      ${panel('Management / OOB / Analytics','T05','t00-management-panel',management)}
      <section class="t00-core-shell">
        <div class="t00-core-head" onclick="t00Navigate('T02')">Data Center Digital Core <small>Network fabric + compute · Open T02 / T04</small></div>
        ${iso}
        ${coreChip('topobj_f8b344bf31c75571769f','T02','c1','Interconnect')}
        ${coreChip('topobj_6c9587efb3d0b49bed8e','T02','c2','Spine Pair')}
        ${coreChip('topobj_689f284af5e658a26b88','T02','c3','Leaf Pair')}
        ${coreChip('topobj_dc742080923da3053e85','T02','c4','Storage Switching')}
        ${coreChip('topobj_6de1118a2c5c7827fc65','T04','c5','CAS Hosts')}
        ${coreChip('topobj_deecc8375d65efa2cb1c','T04','c6','CAS Platform')}
        <button class="t00-physical-cta" onclick="t00Navigate('T03')">PHYSICAL CONNECTIVITY · OPEN T03 ↗</button>
      </section>
      <button class="t00-domain-badge network" onclick="t00Navigate('T02')">NETWORK LOGICAL · T02 ↗</button>
      <button class="t00-domain-badge compute" onclick="t00Navigate('T04')">COMPUTE / STORAGE · T04 ↗</button>
      <div class="t00-premium-note"><b>Evidence-safe:</b> this is a presentation/navigation projection. Detailed canonical relationship status remains authoritative in T01–T06.</div>
    </div>`;
  };

  const brand=document.querySelector('.brand small');
  if(brand)brand.textContent='v0.12.0 Preview · Premium Interactive T00 · WP1–WP4 checkpoint';
  if(view==='T00')render();
})();
