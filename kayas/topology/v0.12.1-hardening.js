/* DCTS v0.12.1 — production hardening
   Behavior/state layer only. No canonical graph or T00 geometry mutation. */
(function(){
  let applyingHash=false;
  let resizeTimer=null;

  function parseHash(raw){
    const s=String(raw||'').replace(/^#/,'');
    const p=new URLSearchParams(s);
    const v=p.get('view')||null;
    const object=p.get('object')||null;
    return {view:v,object};
  }
  function validView(v){return !!(v && typeof V!=='undefined' && V[v]);}
  function validObject(id){
    if(!id)return false;
    try{return !!obj(id)}catch(_){return false}
  }
  function parentHash(){
    try{return parent && parent!==window ? parent.location.hash : location.hash}catch(_){return location.hash}
  }
  function writeHash(v,id){
    if(applyingHash||!validView(v))return;
    const h=`#view=${encodeURIComponent(v)}${id?`&object=${encodeURIComponent(id)}`:''}`;
    try{
      if(parent && parent!==window) parent.history.replaceState(null,'',h);
      else history.replaceState(null,'',h);
    }catch(_){
      try{history.replaceState(null,'',h)}catch(__){}
    }
  }
  function safeFit(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      try{if(typeof fit==='function')fit(false)}catch(_){}
    },90);
  }
  function applyStateFromHash(){
    const s=parseHash(parentHash());
    if(!validView(s.view))return;
    applyingHash=true;
    try{
      if(typeof closeFocus==='function')closeFocus();
      if(view!==s.view){
        if(typeof switchView==='function')switchView(s.view);
        else{view=s.view;selected=null;domainFocus=null;render()}
      }
      if(validObject(s.object)){
        selected=s.object;
        try{renderInspector()}catch(_){}
        requestAnimationFrame(()=>{
          try{if(typeof openFocus==='function')openFocus(s.object)}catch(_){}
        });
      }else{
        selected=null;
        try{renderInspector()}catch(_){}
      }
      requestAnimationFrame(safeFit);
    }finally{
      setTimeout(()=>{applyingHash=false},0);
    }
  }

  if(typeof switchView==='function'){
    const baseSwitch=switchView;
    window.switchView=function(v){
      const out=baseSwitch(v);
      writeHash(v,null);
      requestAnimationFrame(safeFit);
      return out;
    };
  }
  if(typeof openFocus==='function'){
    const baseOpen=openFocus;
    window.openFocus=function(id){
      const out=baseOpen(id);
      if(validObject(id))writeHash(view,id);
      return out;
    };
  }
  if(typeof closeFocus==='function'){
    const baseClose=closeFocus;
    window.closeFocus=function(){
      const out=baseClose();
      writeHash(view,null);
      return out;
    };
  }

  try{
    const host=(parent&&parent!==window)?parent:window;
    host.addEventListener('hashchange',applyStateFromHash);
  }catch(_){}

  window.addEventListener('resize',safeFit,{passive:true});
  if(typeof ResizeObserver!=='undefined'){
    try{
      const vp=document.getElementById('viewport');
      if(vp){
        const ro=new ResizeObserver(()=>safeFit());
        ro.observe(vp);
        window.__DCTS_V0121_RESIZE_OBSERVER=ro;
      }
    }catch(_){}
  }

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && document.body.classList.contains('focus-active')){
      e.preventDefault();
      try{closeFocus()}catch(_){}
    }
  },true);

  function runtimeCheck(){
    const checks={
      version:'v0.12.1',
      switchView:typeof switchView==='function',
      fit:typeof fit==='function',
      t00Stage:!!document.querySelector('.t00-wp8-stage'),
      t01:!!document.querySelector('[data-t00-target="T01"]'),
      t02:!!document.querySelector('[data-t00-target="T02"]'),
      t03:!!document.querySelector('[data-t00-target="T03"]'),
      t04:!!document.querySelector('[data-t00-target="T04"]'),
      t05:!!document.querySelector('[data-t00-target="T05"]'),
      t06:!!document.querySelector('[data-t00-target="T06"]')
    };
    checks.pass=Object.entries(checks).filter(([k])=>!['version','pass'].includes(k)).every(([,v])=>v===true);
    window.DCTS_V0121_STATUS=checks;
    document.documentElement.dataset.dctsHardening=checks.pass?'pass':'check';
  }

  const brand=document.querySelector('.brand small');
  if(brand)brand.textContent='v0.12.1 · Production Hardening · T00 Frozen Candidate';

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    applyStateFromHash();
    runtimeCheck();
    safeFit();
  }));
})();
