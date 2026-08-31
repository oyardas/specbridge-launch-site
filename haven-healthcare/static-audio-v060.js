(function(){
'use strict';
if(window.__HAVEN_STATIC_AUDIO_V061__) return;
window.__HAVEN_STATIC_AUDIO_V061__=true;
let audio=null;
function toast(msg){let t=document.getElementById('hvAudioToast');if(!t){t=document.createElement('div');t.id='hvAudioToast';t.style.cssText='position:fixed;right:14px;bottom:14px;z-index:99999;background:#103650;color:#fff;padding:10px 13px;border-radius:8px;font:11px Segoe UI,Arial,sans-serif;box-shadow:0 8px 24px #0003;max-width:420px';document.body.appendChild(t);}t.textContent=msg;clearTimeout(t._tm);t._tm=setTimeout(()=>t.remove(),4500);}
function lang(){const s=document.getElementById('hvLangSelect');if(s)return s.value;const b=document.getElementById('langBtn');return (b&&b.textContent||'EN').trim().toLowerCase();}
function view(){const b=document.querySelector('#tabs button.on');return b?(b.dataset.v||((b.textContent.match(/T0[0-8]/)||['T00'])[0])):'T00';}
function stop(){if(audio){audio.pause();audio.currentTime=0;audio=null;}setButtons(false);}
function setButtons(playing){const l=lang();const v=document.getElementById('voiceBtn'),p=document.getElementById('playBtn');let on='⏸ Narration',off='▶ Narration',pon='⏸ Pause',poff='▶ Play';if(l==='tr'){on='⏸ Seslendirme';off='▶ Seslendirme';pon='⏸ Duraklat';poff='▶ Dinlet';}else if(l==='dv'){on='⏸ އަޑު';off='▶ އަޑު';pon='⏸ މަޑުކުރަން';poff='▶ އަޑު އަހާ';}if(v)v.textContent=playing?on:off;if(p)p.textContent=playing?pon:poff;}
function errorMessage(l){if(l==='tr')return'Türkçe statik ses dosyası bulunamadı.';if(l==='dv')return'ދިވެހި ސްޓެޓިކް އޯޑިއޯ ފައިލް ނުފެނުނު.';return'English static narration file is not available.';}
function play(){const l=lang(),v=view();if(!['tr','en','dv'].includes(l)){toast('Bu dil için ses paketi bulunmuyor.');return;}if(audio&&audio.dataset&&audio.dataset.key===l+':'+v){if(audio.paused){audio.play().catch(()=>{});setButtons(true);}else{audio.pause();setButtons(false);}return;}stop();const src=`audio/${l}/${v}.mp3?v=20260831-1325`;audio=new Audio(src);audio.preload='auto';audio.dataset.key=l+':'+v;audio.onplay=()=>setButtons(true);audio.onpause=()=>setButtons(false);audio.onended=()=>{setButtons(false);audio=null;};audio.onerror=()=>{stop();toast(errorMessage(l));};audio.play().catch(()=>{toast(l==='dv'?'އޯޑިއޯ ޕްލޭ ނުކުރެވުނު.':l==='tr'?'Ses dosyası oynatılamadı.':'Audio could not be played.');});}
document.addEventListener('click',function(e){const b=e.target.closest&&e.target.closest('#voiceBtn,#playBtn');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();play();},true);
document.addEventListener('change',function(e){if(e.target&&e.target.id==='hvLangSelect')stop();},true);
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#tabs button,[data-map]'))stop();},true);
window.addEventListener('beforeunload',stop);
})();
