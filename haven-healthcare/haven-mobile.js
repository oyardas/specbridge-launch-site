(()=>{
'use strict';
if(window.SPECBRIDGE_HAVEN_MOBILE)return;window.SPECBRIDGE_HAVEN_MOBILE=true;
const mq=matchMedia('(max-width:820px)');let mode=null;
function mobile(){return mq.matches}
function clone(sel){const src=document.querySelector(sel);if(!src)return '<p>No content is available for this view.</p>';const c=src.cloneNode(true);c.removeAttribute('id');c.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));return c.outerHTML}
function sourceFor(kind){const master=document.body.classList.contains('hv-master-open');if(kind==='why')return master?'.hv-m-left':'.left';if(kind==='details')return master?'.hv-m-right':'.right';return null}
function buttonState(id){const b=document.querySelector(id);return !!(b&&b.classList.contains('on'))}
function controlsHtml(){return `<div class="hvm-controls">
<button data-proxy="#motionBtn" class="${buttonState('#motionBtn')?'on':''}">Flow: ${buttonState('#motionBtn')?'On':'Off'}</button>
<button data-proxy="#designBtn" class="${buttonState('#designBtn')?'on':''}">Design: ${buttonState('#designBtn')?'On':'Off'}</button>
<button data-proxy="#hvLabelsBtn" class="${buttonState('#hvLabelsBtn')?'on':''}">Labels: ${buttonState('#hvLabelsBtn')?'On':'Off'}</button>
<button data-proxy="#hvEvidenceBtn" class="${buttonState('#hvEvidenceBtn')?'on':''}">Evidence: ${buttonState('#hvEvidenceBtn')?'On':'Off'}</button>
<button data-proxy="#voiceBtn">Narration</button><button data-action="print">Print / PDF</button>
<button data-action="fit">Fit Topology</button><button data-action="master">H00 Master</button>
<div class="hvm-lang"><button data-lang="en">EN</button><button data-lang="tr">TR</button><button data-lang="dv">DV</button></div>
</div>`}
function render(kind){const body=document.querySelector('#hvmSheet .hvm-body'),title=document.querySelector('#hvmSheet .hvm-head b'),sub=document.querySelector('#hvmSheet .hvm-head span');if(!body)return;mode=kind;document.querySelectorAll('#hvmDock button').forEach(b=>b.classList.toggle('active',b.dataset.kind===kind));if(kind==='controls'){title.textContent='Controls';sub.textContent='Mobile architecture controls';body.innerHTML=controlsHtml();body.querySelectorAll('[data-proxy]').forEach(b=>b.onclick=()=>{document.querySelector(b.dataset.proxy)?.click();setTimeout(()=>render('controls'),20)});body.querySelector('[data-action="print"]')?.addEventListener('click',()=>document.querySelector('#printBtn')?.click());body.querySelector('[data-action="fit"]')?.addEventListener('click',fit);body.querySelector('[data-action="master"]')?.addEventListener('click',()=>{close();document.querySelector('#hvMasterBtn')?.click()});body.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{document.querySelector(`[data-hvl="${b.dataset.lang}"]`)?.click();setTimeout(()=>render('controls'),20)});return}const sel=sourceFor(kind);title.textContent=kind==='why'?'Why / Narrative':'Details / Evidence';sub.textContent=kind==='why'?'Clinical and design context':'Selected infrastructure object';body.innerHTML=clone(sel);body.querySelectorAll('a').forEach(a=>{a.target=a.target||'_blank';a.rel='noopener'});}
function open(kind){if(!mobile())return;render(kind);document.body.classList.add('hvm-sheet-open')}
function close(){document.body.classList.remove('hvm-sheet-open');document.querySelectorAll('#hvmDock button').forEach(b=>b.classList.remove('active'));mode=null}
function fit(){close();const active=document.querySelector('#tabs button.on');if(active){active.click();return}window.dispatchEvent(new Event('resize'))}
function install(){if(document.getElementById('hvmDock'))return;const back=document.createElement('div');back.id='hvmBackdrop';back.onclick=close;const sheet=document.createElement('section');sheet.id='hvmSheet';sheet.setAttribute('aria-label','Mobile architecture panel');sheet.innerHTML='<div class="hvm-head"><div><b>Details</b><span></span></div><button type="button" aria-label="Close">×</button></div><div class="hvm-body"></div>';sheet.querySelector('.hvm-head button').onclick=close;const dock=document.createElement('nav');dock.id='hvmDock';dock.setAttribute('aria-label','Mobile architecture navigation');dock.innerHTML='<button data-kind="why">Why</button><button data-kind="details">Details</button><button data-kind="controls">Controls</button><button data-kind="fit">Fit</button>';dock.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;b.dataset.kind==='fit'?fit():open(b.dataset.kind)});const hint=document.createElement('div');hint.id='hvmRotateHint';hint.textContent='Rotate to landscape for maximum topology space';document.body.append(back,sheet,dock,hint);
 document.addEventListener('click',e=>{if(!mobile())return;if(e.target.closest('.node,.hv-map-card'))setTimeout(()=>open('details'),80)},true);
 const right=document.querySelector('.right');if(right)new MutationObserver(()=>{if(mobile()&&mode==='details')render('details')}).observe(right,{subtree:true,childList:true,characterData:true});
 mq.addEventListener?.('change',()=>{if(!mobile())close()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
