(function(){
'use strict';

const VERSION='20260804-v29-asset-resilience';
const state={ready:false,observed:0,recovered:0,healthy:0,errors:[]};
const selector='.h3c-wordmark-logo img,.gallery-hero-image img,.gallery-grid img,.specbridge-brand img,.drawer-specbridge-logo img,.loading-brand';

function escapeText(value){return String(value||'KAYAS').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function placeholder(label,kind){
  const dark=document.body?.dataset.theme!=='light';
  const bg=dark?'#0b1724':'#eef3f7';
  const fg=kind==='h3c'?'#e31837':(dark?'#e8f0f6':'#102131');
  const sub=dark?'#8ba0b3':'#526779';
  const safe=escapeText(label);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="${bg}"/><path d="M0 590L310 320l190 175 180-155 520 335H0z" fill="${dark?'#14283a':'#dbe5ec'}"/><rect x="72" y="72" width="1056" height="531" rx="24" fill="none" stroke="${sub}" stroke-opacity=".42" stroke-width="3"/><text x="600" y="292" text-anchor="middle" fill="${fg}" font-family="Arial,sans-serif" font-size="72" font-weight="700">${safe}</text><text x="600" y="362" text-anchor="middle" fill="${sub}" font-family="Arial,sans-serif" font-size="30">Görsel güvenli yedek katmanla sunuluyor</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function classify(image){
  const context=((image.alt||'')+' '+(image.className||'')+' '+(image.closest('.h3c-wordmark-logo')?'h3c':'')).toLowerCase();
  if(context.includes('h3c'))return {kind:'h3c',label:'H3C'};
  if(context.includes('specbridge'))return {kind:'specbridge',label:'SpecBridge AI'};
  return {kind:'gallery',label:'KAYAS Veri Merkezi'};
}
function recover(image){
  if(!image||image.dataset.kayasV29Recovered==='1')return;
  image.dataset.kayasV29Recovered='1';
  const meta=classify(image);
  image.src=placeholder(meta.label,meta.kind);
  image.removeAttribute('srcset');
  image.loading='eager';
  image.decoding='async';
  image.classList.add('kayas-v29-fallback');
  image.setAttribute('data-asset-state','fallback');
  state.recovered+=1;
}
function inspect(image){
  if(!image||image.dataset.kayasV29Observed==='1')return;
  image.dataset.kayasV29Observed='1';state.observed+=1;
  image.addEventListener('error',()=>recover(image),{once:true});
  if(image.complete){
    if(image.naturalWidth>0){image.setAttribute('data-asset-state','healthy');state.healthy+=1;}
    else recover(image);
  }else image.addEventListener('load',()=>{image.setAttribute('data-asset-state','healthy');state.healthy+=1;publish();},{once:true});
}
function publish(){window.__KAYAS_V29_STATUS={...state,version:VERSION};}
function scan(){document.querySelectorAll(selector).forEach(inspect);publish();}
function install(){
  try{
    scan();
    const observer=new MutationObserver(scan);
    observer.observe(document.documentElement,{childList:true,subtree:true});
    state.ready=true;publish();
  }catch(error){state.errors.push(error.stack||error.message||String(error));publish();}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
