/* DCTS v0.12.0 — WP6 semantic hover-flow + digital-core polish */
(function(){
  const NS='http://www.w3.org/2000/svg';
  const BASE_T00=renderT00Overview;

  const focusMap=[
    ['.t00-external-panel','external','External / Service Ingress','Open T01 Executive'],
    ['.t00-security-panel','security','Security Boundary','Open T02 Network Logical'],
    ['.t00-cloud-panel','cloud','Cloud Service Platform','Open T06 Service'],
    ['.t00-storage-panel','storage','Storage','Open T04 Compute / HCI / Storage'],
    ['.t00-protect-panel','protection','Data Protection','Open T06 Service'],
    ['.t00-management-panel','management','Management / OOB / Analytics','Open T05 Management'],
    ['.t00-core-shell','core','Data Center Digital Core','Open T02 Network or T04 Compute']
  ];

  function addSvg(tag,attrs,parent){
    const el=document.createElementNS(NS,tag);
    Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,v));
    parent.appendChild(el);return el;
  }
  function setFocus(stage,key,title,target){
    stage.dataset.focus=key;
    const hint=stage.querySelector('.t00-hover-hint');
    if(hint)hint.innerHTML=`<b>${title}</b><span>${target} ↗</span>`;
  }
  function clearFocus(stage){stage.dataset.focus=''}

  function enhanceFlows(stage){
    const paths=[...stage.querySelectorAll('.t00-flow-svg > path.t00-flow')];
    const classes=[
      ['f-external','f-core'],
      ['f-security','f-core'],
      ['f-storage','f-core'],
      ['f-cloud','f-core'],
      ['f-protection','f-core'],
      ['f-management','f-core'],
      ['f-management','f-storage'],
      ['f-management','f-cloud']
    ];
    paths.forEach((p,i)=>(classes[i]||[]).forEach(c=>p.classList.add(c)));
  }

  function enhanceCore(stage){
    const svg=stage.querySelector('.t00-iso-svg');
    if(!svg||svg.dataset.polished)return;
    svg.dataset.polished='1';

    const layer=addSvg('g',{'class':'t00-iso-semantic-layer'},svg);
    addSvg('polygon',{'class':'t00-iso-compute-plane','points':'128,174 242,117 382,181 255,240','tabindex':'0','role':'button','aria-label':'Open compute architecture in T04'},layer);
    const l1=addSvg('text',{'class':'t00-iso-plane-label compute','x':'292','y':'218'},layer);l1.textContent='COMPUTE PLANE';

    const n1=addSvg('polygon',{'class':'t00-iso-fabric-node','points':'175,57 214,38 250,55 211,75','tabindex':'0','role':'button','aria-label':'Open network fabric in T02'},layer);
    const n2=addSvg('polygon',{'class':'t00-iso-fabric-node','points':'246,58 285,39 321,56 282,76','tabindex':'0','role':'button','aria-label':'Open network fabric in T02'},layer);
    const lf=addSvg('text',{'class':'t00-iso-plane-label fabric','x':'206','y':'31'},layer);lf.textContent='FABRIC PLANE';
    ['M210 75 L150 120','M211 75 L216 112','M282 76 L278 124','M282 76 L341 145','M250 55 L246 109'].forEach(d=>addSvg('path',{'class':'t00-iso-fabric-line','d':d},layer));
    addSvg('circle',{'class':'t00-iso-packet','cx':'225','cy':'67','r':'2'},layer);
    addSvg('circle',{'class':'t00-iso-packet','cx':'298','cy':'65','r':'2'},layer);

    const go=(target,e)=>{e.stopPropagation();t00Navigate(target)};
    [n1,n2].forEach(n=>{
      n.style.cursor='pointer';
      n.addEventListener('click',e=>go('T02',e));
      n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go('T02',e)}});
      n.addEventListener('mouseenter',()=>setFocus(stage,'core','Fabric Plane','Open T02 Network Logical'));
    });
    const plane=layer.querySelector('.t00-iso-compute-plane');
    plane.style.cursor='pointer';
    plane.addEventListener('click',e=>go('T04',e));
    plane.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go('T04',e)}});
    plane.addEventListener('mouseenter',()=>setFocus(stage,'core','Compute Plane','Open T04 Compute / HCI / Storage'));
  }

  function enhanceT00(){
    const stage=document.querySelector('.t00-premium-stage');
    if(!stage||stage.dataset.wp6)return;
    stage.dataset.wp6='1';stage.dataset.focus='';
    const hint=document.createElement('div');hint.className='t00-hover-hint';hint.textContent='Select a domain to enter its controlled detail view';stage.appendChild(hint);
    enhanceFlows(stage);enhanceCore(stage);

    focusMap.forEach(([sel,key,title,target])=>{
      const el=stage.querySelector(sel);if(!el)return;
      el.dataset.focusKey=key;
      el.addEventListener('mouseenter',()=>setFocus(stage,key,title,target));
      el.addEventListener('focusin',()=>setFocus(stage,key,title,target));
      el.addEventListener('mouseleave',()=>clearFocus(stage));
      el.addEventListener('focusout',e=>{if(!el.contains(e.relatedTarget))clearFocus(stage)});
    });
  }

  renderT00Overview=function(){BASE_T00();requestAnimationFrame(enhanceT00)};
  if(view==='T00'){requestAnimationFrame(enhanceT00)}
  const brand=document.querySelector('.brand small');
  if(brand)brand.textContent='v0.12.0 Preview · Premium Interactive T00 · WP1–WP6 visual polish';
})();
