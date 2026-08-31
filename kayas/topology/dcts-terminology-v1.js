/* DCTS Display Terminology v1.0.0 — cross-project presentation normalization */
(function(){'use strict';
const ADC_ID='topobj_d22103a970df15ebc013';
const ADC_LABEL='ADC / Load Balancer Pair';
function adopt(){
  try{
    const o=typeof obj==='function'?obj(ADC_ID):null;
    if(!o)return;
    if(typeof INVESTOR_COPY!=='undefined'&&INVESTOR_COPY[o.name]&&!INVESTOR_COPY[ADC_LABEL])INVESTOR_COPY[ADC_LABEL]=INVESTOR_COPY[o.name];
    o.name=ADC_LABEL;
  }catch(e){console.warn('[DCTS terminology] ADC normalization skipped',e)}
}
function patchT02Label(){
  document.querySelectorAll('.t02stage .dev').forEach(el=>{
    const oc=el.getAttribute('onclick')||'';
    if(!oc.includes(ADC_ID))return;
    const b=el.querySelector('b');if(b)b.textContent=ADC_LABEL;
    el.dataset.ht=ADC_LABEL;
    el.dataset.hm='Application Delivery Controller (ADC / Load Balancer) · redundant pair';
  });
}
adopt();
if(typeof renderT02Reference==='function'){
  const prev=renderT02Reference;
  renderT02Reference=function(){const r=prev.apply(this,arguments);patchT02Label();return r};
}
patchT02Label();
try{if(typeof renderInspector==='function')renderInspector()}catch(_){}
})();
