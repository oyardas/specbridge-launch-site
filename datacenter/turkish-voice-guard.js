(()=>{
'use strict';
if(window.SPECBRIDGE_TR_VOICE_GUARD)return;window.SPECBRIDGE_TR_VOICE_GUARD=true;
const SUPPORT_URL='https://support.microsoft.com/tr-tr/accessibility/windows/narrator/appendix-a-supported-languages-and-voices';
const $=s=>document.querySelector(s);
function synth(){return ('speechSynthesis'in window)?window.speechSynthesis:null}
function allVoices(){try{return synth()?.getVoices?.().filter(Boolean)||[]}catch(_){return[]}}
function trVoices(vs=allVoices()){return vs.filter(v=>/^tr(?:-|$)/i.test(String(v.lang||'')))}
function currentMastered(){try{const s=window.SPECBRIDGE_BRIEFING?.getState?.();const c=window.DATACENTER_BRIEFING?.chapters?.[s?.chapter||0];return !!(c?.audio&&Array.isArray(c.cues)&&c.cues.length)}catch(_){return false}}
function setStatus(text,help=false){const n=$('#voiceStatus');if(!n)return;n.textContent=text;n.title=help?'Windows Türkçe TTS sesi Tolga’yı eklemek için tıklayın.':'';n.style.cursor=help?'pointer':'';n.onclick=help?()=>window.open(SUPPORT_URL,'_blank','noopener'):null}
function refresh(){const sel=$('#voiceSelect');if(!sel)return;const all=allVoices(),tr=trVoices(all);if(tr.length){const preferred=tr.find(v=>/tolga|natural|neural|online|premium/i.test(v.name))||tr[0];sel.disabled=false;sel.innerHTML=tr.map(v=>`<option value="${all.indexOf(v)}">${v.name} · ${v.lang}</option>`).join('');sel.value=String(all.indexOf(preferred));sel.dispatchEvent(new Event('change',{bubbles:true}));setStatus(`Türkçe TTS · ${preferred.name} · browser fallback`,false);return true}sel.innerHTML='<option value="-1">Türkçe ses bulunamadı · Windows Tolga gerekli</option>';sel.disabled=true;sel.value='-1';sel.dispatchEvent(new Event('change',{bubbles:true}));if(currentMastered())setStatus('Profesyonel Türkçe mastered audio kullanılacak.',false);else setStatus('Türkçe ses yok · Windows Tolga’yı yüklemek için tıklayın.',true);return false}
function guardPlay(e){if(currentMastered()||trVoices().length)return;e.preventDefault();e.stopImmediatePropagation();setStatus('Türkçe ses yok · Windows Tolga’yı yüklemek için tıklayın.',true)}
function install(){const play=$('#playBtn');if(play)play.addEventListener('click',guardPlay,true);const s=synth();if(s){s.addEventListener?.('voiceschanged',()=>setTimeout(refresh,60));}refresh();setTimeout(refresh,300);setTimeout(refresh,1200);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
