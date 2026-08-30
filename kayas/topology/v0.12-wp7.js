/* DCTS v0.12.0 — WP7 final T00 interaction / rendering polish */
(function(){
  const NS='http://www.w3.org/2000/svg';
  const BASE_T00=renderT00Overview;

  function svg(tag,attrs,parent){
    const el=document.createElementNS(NS,tag);
    Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,v));
    parent.appendChild(el);return el;
  }

  function addGradients(stage){
    const iso=stage.querySelector('.t00-iso-svg');
    if(!iso||iso.querySelector('#t00-wp7-gradients'))return;
    const defs=svg('defs',{'id':'t00-wp7-gradients'},iso);
    const mk=(id,a,b,x1='0%',y1='0%',x2='100%',y2='100%')=>{
      const g=svg('linearGradient',{id,x1,y1,x2,y2},defs);
      svg('stop',{offset:'0%','stop-color':a},g);
      svg('stop',{offset:'100%','stop-color':b},g);
    };
    mk('t00-wp7-floor','#0d2938','#06121b','0%','0%','100%','100%');
    mk('t00-wp7-rack-front','#12384a','#071923','0%','0%','100%','100%');
    mk('t00-wp7-rack-top','#1b5064','#0d2c3c','0%','0%','100%','100%');
    mk('t00-wp7-rack-side','#0b2634','#041018','0%','0%','100%','100%');
    iso.insertBefore(defs,iso.firstChild);
  }

  function refineManagementFlows(stage){
    const mgmt=[...stage.querySelectorAll('.t00-flow-svg path.t00-flow.mgmt')];
    if(!mgmt.length)return;

    // WP7 presentation rule: management is shown as local contextual association,
    // not as a long physical-looking trunk across unrelated domains.
    if(mgmt[0]){
      mgmt[0].setAttribute('d','M540 548 V526');
      mgmt[0].classList.remove('f-storage','f-cloud','f-protection');
      mgmt[0].classList.add('f-management','f-core');
    }
    if(mgmt[1]){
      mgmt[1].setAttribute('d','M838 558 H862');
      mgmt[1].classList.remove('f-storage','f-cloud','f-core');
      mgmt[1].classList.add('f-management','f-protection');
    }
    if(mgmt[2]){
      mgmt[2].style.display='none';
      mgmt[2].classList.remove('f-storage','f-cloud','f-core','f-protection');
    }

    const label=[...stage.querySelectorAll('.t00-flow-label')].find(x=>/MANAGEMENT/i.test(x.textContent||''));
    if(label){
      label.textContent='MANAGEMENT ASSOCIATION';
      label.setAttribute('x','552');
      label.setAttribute('y','540');
    }
  }

  function stableCoreHint(stage){
    const hint=stage.querySelector('.t00-hover-hint');
    if(!hint)return;
    const reset=()=>{
      if(stage.dataset.focus==='core')hint.innerHTML='<b>Data Center Digital Core</b><span>Open T02 Network or T04 Compute ↗</span>';
    };
    stage.querySelectorAll('.t00-iso-fabric-node,.t00-iso-compute-plane').forEach(el=>{
      el.addEventListener('mouseleave',()=>requestAnimationFrame(reset));
      el.addEventListener('blur',()=>requestAnimationFrame(reset));
    });
  }

  function refineCoreClickTargets(stage){
    const compute=stage.querySelector('.t00-iso-compute-plane');
    if(compute){
      compute.setAttribute('focusable','true');
      compute.setAttribute('aria-label','Compute Plane — Open T04 Compute / HCI / Storage');
    }
    stage.querySelectorAll('.t00-iso-fabric-node').forEach(n=>{
      n.setAttribute('focusable','true');
      n.setAttribute('aria-label','Fabric Plane — Open T02 Network Logical');
    });
  }

  function enhanceWP7(){
    const stage=document.querySelector('.t00-premium-stage');
    if(!stage||stage.dataset.wp7)return;
    stage.dataset.wp7='1';
    addGradients(stage);
    refineManagementFlows(stage);
    refineCoreClickTargets(stage);
    stableCoreHint(stage);
  }

  renderT00Overview=function(){
    BASE_T00();
    requestAnimationFrame(()=>requestAnimationFrame(enhanceWP7));
  };

  if(view==='T00')requestAnimationFrame(()=>requestAnimationFrame(enhanceWP7));
  const brand=document.querySelector('.brand small');
  if(brand)brand.textContent='v0.12.0 Preview · Premium Interactive T00 · WP1–WP7 final visual polish';
})();
