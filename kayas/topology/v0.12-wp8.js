/* DCTS v0.12.0 — WP8 clean T00 rendering + reliable navigation */
(function(){
  const OMAP={
    security:[['topobj_dc750ed177fb87984c3a','T02','Perimeter Firewall'],['topobj_d22103a970df15ebc013','T02','ADC'],['topobj_4a235cb934f5c5a46901','T02','Egress Firewall']],
    cloud:[['topobj_f61dad7a8323cc32b048','T06','Cloud Mgmt Hosts'],['topobj_4290683013244cf50d95','T06','CloudOS']],
    storage:[['topobj_6a8d3500c63b7ce61860','T04','All-Flash Nodes'],['topobj_1d5cc2cacf4060035882','T04','ONEStor']],
    protection:[['topobj_bba651ea257e81f79ce6','T06','Backup Appliance'],['topobj_f59c004a4842a0ab2300','T06','AnyBackup 7.0']],
    management:[['topobj_ca569b60f525d5fd277f','T05','Mgmt Hosts'],['topobj_56b5cee0b4c39857a70a','T05','OOB'],['topobj_bbc53ea9c663404b7a82','T05','AD-DC / SeerEngine'],['topobj_60b6648480d5d86edc25','T05','Analytics']],
    network:[['topobj_f8b344bf31c75571769f','T02','Interconnect'],['topobj_6c9587efb3d0b49bed8e','T02','Spine Pair'],['topobj_689f284af5e658a26b88','T02','Leaf Pair'],['topobj_dc742080923da3053e85','T02','Storage Switching']],
    compute:[['topobj_6de1118a2c5c7827fc65','T04','CAS Hosts'],['topobj_deecc8375d65efa2cb1c','T04','CAS Platform']]
  };
  const DOMAIN_TARGET={external:'T01',security:'T02',cloud:'T06',storage:'T04',protection:'T06',management:'T05',core:'T02'};
  const DOMAIN_HINT={
    external:['External / Service Ingress','Open T01 Executive'],security:['Security Boundary','Open T02 Network Logical'],cloud:['Cloud Service Platform','Open T06 Service'],storage:['Storage','Open T04 Compute / HCI / Storage'],protection:['Data Protection','Open T06 Service'],management:['Management / OOB / Analytics','Open T05 Management'],core:['Data Center Digital Core','Open T02 Network or T04 Compute']
  };

  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function getObj(id){try{return obj(id)}catch(_){return null}}
  function subtitle(o){try{return investorSubtitle(o)}catch(_){return o?.role||''}}
  function ico(o){try{return icon(o)}catch(_){return '◈'}}
  function card(id,target,label){
    const o=getObj(id);if(!o)return '';
    const accent=(typeof C!=='undefined'&&C[o.domain])||'#36d6e6';
    return `<button class="wp8-card" style="--accent:${accent}" data-t00-target="${target}" data-t00-object="${id}" aria-label="Open ${esc(label)} in ${target}"><span class="wp8-ico">${ico(o)}</span><span><b>${esc(label)}</b><em>${esc(subtitle(o))}</em></span><span class="wp8-goto">${target} ↗</span></button>`;
  }
  function panel(cls,key,title,target,body){
    return `<section class="wp8-panel ${cls}" data-focus-key="${key}" data-t00-target="${target}" tabindex="0" role="button" aria-label="Open ${esc(title)} in ${target}"><div class="wp8-panel-head">${esc(title)}<small>Open ${target} ↗</small></div><div class="wp8-body">${body}</div></section>`;
  }
  function cards(arr){return arr.map(x=>card(x[0],x[1],x[2])).join('')}

  function coreScene(){
    return `<div class="wp8-scene" data-focus-key="core"><svg viewBox="0 0 420 150" aria-label="Representational digital core scene"><defs><linearGradient id="wp8rf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12394b"/><stop offset="1" stop-color="#071923"/></linearGradient><linearGradient id="wp8rt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d5267"/><stop offset="1" stop-color="#0d2c3b"/></linearGradient><linearGradient id="wp8rs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b2634"/><stop offset="1" stop-color="#041018"/></linearGradient></defs>
      <polygon class="wp8-floor" points="42,88 203,18 379,88 211,145"/><path class="wp8-gridline" d="M77 73l172 71M112 58l172 72M147 43l172 72M342 73L178 139M307 58L143 124M272 43L108 109"/>
      <polygon class="wp8-plane" points="108,104 207,62 315,104 211,139" data-t00-target="T04" tabindex="0" role="button" aria-label="Compute Plane — Open T04"/><text class="wp8-plane-label" x="258" y="130">COMPUTE PLANE</text>
      <path class="wp8-fabric-line" d="M150 57 L126 83 M198 39 L184 71 M246 46 L250 79 M291 62 L302 91"/>
      ${rack(116,62)}${rack(164,42)}${rack(214,50)}${rack(265,67)}
      <text class="wp8-plane-label" x="183" y="33" style="fill:#77e5ef">FABRIC PLANE</text>
      <rect x="130" y="28" width="190" height="70" fill="transparent" data-t00-target="T02" tabindex="0" role="button" aria-label="Fabric Plane — Open T02"/>
    </svg></div>`;
  }
  function rack(x,y){return `<g transform="translate(${x} ${y})"><polygon class="wp8-rack-top" points="0,8 13,1 25,7 12,14"/><polygon class="wp8-rack-front" points="12,14 25,7 25,48 12,55"/><polygon class="wp8-rack-side" points="0,8 12,14 12,55 0,49"/><circle class="wp8-led" cx="20" cy="22" r="1.3"/><circle class="wp8-led" cx="20" cy="30" r="1.3"/><circle class="wp8-led" cx="20" cy="38" r="1.3"/></g>`}

  function flows(){
    return `<svg class="wp8-flows" viewBox="0 0 1160 620" aria-hidden="true"><defs><marker id="wp8a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2fd1e1"/></marker><marker id="wp8g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="#55dca0"/></marker><marker id="wp8p" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="#a970ff"/></marker></defs>
      <path class="wp8-flow f-external f-core" marker-end="url(#wp8a)" d="M200 188 H220 V350 H235"/>
      <path class="wp8-flow security f-security f-core" d="M212 405 H224 V390 H235"/>
      <path class="wp8-flow f-cloud f-core" marker-end="url(#wp8a)" d="M580 210 V228"/>
      <path class="wp8-flow service f-storage f-core" marker-end="url(#wp8g)" d="M895 325 H932"/>
      <path class="wp8-flow service f-protection f-core" marker-end="url(#wp8g)" d="M895 430 H932"/>
      <path class="wp8-flow mgmt f-management f-core" marker-end="url(#wp8p)" d="M580 535 V516"/>
    </svg>`;
  }

  function go(target,id){
    if(!target||typeof V==='undefined'||!V[target])return;
    try{if(typeof stopStory==='function')stopStory()}catch(_){}
    if(typeof switchView==='function')switchView(target);else{view=target;selected=null;domainFocus=null;render()}
    if(id){
      selected=id;
      try{renderInspector()}catch(_){}
      requestAnimationFrame(()=>{
        try{if(typeof semantic==='undefined'||semantic){if(typeof openFocus==='function')openFocus(id)}}catch(_){}
      });
    }
    try{history.replaceState(null,'',`#view=${encodeURIComponent(target)}${id?`&object=${encodeURIComponent(id)}`:''}`)}catch(_){}
  }

  function bind(stage){
    if(stage.dataset.bound)return;stage.dataset.bound='1';
    const activate=(hit,e)=>{
      const t=hit.dataset.t00Target,id=hit.dataset.t00Object||null;
      e.preventDefault();e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      go(t,id);
    };
    stage.addEventListener('pointerdown',e=>{const hit=e.target.closest?.('[data-t00-target]');if(hit)e.stopPropagation()},true);
    stage.addEventListener('click',e=>{const hit=e.target.closest?.('[data-t00-target]');if(hit)activate(hit,e)},true);
    stage.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const hit=e.target.closest?.('[data-t00-target]');if(hit)activate(hit,e)},true);
    stage.addEventListener('pointerover',e=>{
      const box=e.target.closest?.('[data-focus-key]');if(!box)return;
      const key=box.dataset.focusKey;stage.dataset.focus=key||'';
      const hint=stage.querySelector('.wp8-context'),h=DOMAIN_HINT[key];
      if(h&&hint){hint.innerHTML=`<b>${h[0]}</b><span>${h[1]} ↗</span>`;hint.classList.add('show')}
    });
    stage.addEventListener('pointerout',e=>{
      if(e.relatedTarget&&stage.contains(e.relatedTarget)){const next=e.relatedTarget.closest?.('[data-focus-key]');if(next)return}
      stage.dataset.focus='';stage.querySelector('.wp8-context')?.classList.remove('show');
    });
  }

  window.renderT00Overview=function(){
    const external=`<button class="wp8-chip" data-t00-target="T01">Internet / Carrier</button><button class="wp8-chip" data-t00-target="T01">Public Cloud</button><button class="wp8-chip" data-t00-target="T01">Partners</button><button class="wp8-chip" data-t00-target="T01">Users / Tenants</button>`;
    const net=cards(OMAP.network),cmp=cards(OMAP.compute);
    $('#groups').className='groups reference-t00';
    $('#groups').innerHTML=`<div class="t00-wp8-stage" data-focus="">
      <div class="wp8-head"><div><div class="wp8-kicker">DCTS · KAYAS · MASTER ARCHITECTURE NAVIGATION</div><div class="wp8-title">KAYAS <span>Digital Infrastructure Platform</span></div><div class="wp8-sub">Clean investor-oriented overview · click any domain or component to open the controlled detailed view</div></div><div class="wp8-legend"><span><i></i>Architecture flow</span><span><i class="mgmt"></i>Management association</span><span><i class="open"></i>Open / evidence boundary</span></div></div>
      <div class="wp8-context"></div>${flows()}
      ${panel('wp8-external','external','External / Service Ingress','T01',external)}
      ${panel('wp8-security','security','Security Boundary','T02',cards(OMAP.security))}
      ${panel('wp8-cloud','cloud','Cloud Service Platform','T06',cards(OMAP.cloud))}
      ${panel('wp8-storage','storage','Storage','T04',cards(OMAP.storage))}
      ${panel('wp8-protection','protection','Data Protection','T06',cards(OMAP.protection))}
      ${panel('wp8-management','management','Management / OOB / Analytics','T05',cards(OMAP.management))}
      <section class="wp8-core" data-focus-key="core" data-t00-target="T02" tabindex="0" role="button" aria-label="Open Data Center Digital Core in T02"><div class="wp8-core-head"><span>Data Center Digital Core</span><small>Network fabric + compute</small><span class="wp8-core-nav"><button data-t00-target="T02">T02 Network ↗</button><button data-t00-target="T04">T04 Compute ↗</button></span></div><div class="wp8-core-net">${net}</div>${coreScene()}<div class="wp8-core-bottom">${cmp}<button class="wp8-physical" data-t00-target="T03">T03 Physical Connectivity ↗</button></div></section>
      <div class="wp8-note"><b>Evidence-safe overview:</b> representational navigation only. Detailed canonical relationship status remains authoritative in T01–T06.</div>
    </div>`;
    const stage=document.querySelector('.t00-wp8-stage');if(stage)bind(stage);
  };

  const prevRenderGroups=renderGroups;
  renderGroups=function(){
    document.body.classList.toggle('t00-premium',view==='T00'&&!domainFocus);
    return prevRenderGroups();
  };
  const brand=document.querySelector('.brand small');if(brand)brand.textContent='v0.12.0 Preview · T00 WP8 Clean Production-Candidate Layout';
  if(view==='T00')render();
})();
