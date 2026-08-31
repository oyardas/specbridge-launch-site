(function(){
'use strict';
if(window.__HAVEN_VOICE_FIX_051__) return;
window.__HAVEN_VOICE_FIX_051__=true;
function toast(msg){let t=document.getElementById('hvVoiceToast');if(!t){t=document.createElement('div');t.id='hvVoiceToast';t.style.cssText='position:fixed;right:14px;bottom:14px;z-index:99999;background:#103650;color:#fff;padding:10px 13px;border-radius:8px;font:11px Segoe UI,Arial,sans-serif;box-shadow:0 8px 24px #0003';document.body.appendChild(t);}t.textContent=msg;clearTimeout(t._tm);t._tm=setTimeout(()=>t.remove(),4200);}
function lang(){const s=document.getElementById('hvLangSelect');return s?s.value:'en';}
function view(){const b=document.querySelector('#tabs button.on');return b?(b.dataset.v||((b.textContent.match(/T0[0-8]/)||['T00'])[0])):'T00';}
function text(){const n=document.getElementById('narrativeText');return n?n.textContent.trim():'';}
function voices(){return window.speechSynthesis?speechSynthesis.getVoices():[];}
function strictTurkishVoice(){
  const vs=voices();
  const exact=vs.filter(v=>(v.lang||'').toLowerCase()==='tr-tr');
  const named=vs.filter(v=>/turkish|türk|türkçe|emel|ahmet|filiz/i.test((v.name||'')+' '+(v.voiceURI||'')));
  const pool=[...new Map([...exact,...named].map(v=>[(v.voiceURI||v.name),v])).values()];
  const score=v=>{const n=(v.name||'').toLowerCase();let s=0;if((v.lang||'').toLowerCase()==='tr-tr')s+=100;if(n.includes('natural'))s+=35;if(n.includes('neural'))s+=30;if(n.includes('online'))s+=20;if(n.includes('microsoft'))s+=12;if(n.includes('google'))s+=10;if(/emel|ahmet|filiz/.test(n))s+=18;return s;};
  return pool.sort((a,b)=>score(b)-score(a))[0]||null;
}
function bestExact(code){const lc=code.toLowerCase();return voices().filter(v=>(v.lang||'').toLowerCase()===lc).sort((a,b)=>{const an=(a.name||'').toLowerCase(),bn=(b.name||'').toLowerCase();const sc=n=>(n.includes('natural')?30:0)+(n.includes('neural')?25:0)+(n.includes('online')?15:0)+(n.includes('microsoft')?10:0)+(n.includes('google')?8:0);return sc(bn)-sc(an);})[0]||null;}
function speakStrict(){
  const l=lang(),tx=text();if(!tx)return;
  speechSynthesis.cancel();
  let code=l==='tr'?'tr-TR':l==='dv'?'dv-MV':'en-US';
  let v=l==='tr'?strictTurkishVoice():bestExact(code);
  if(l==='tr'&&!v){toast('Bu tarayıcıda Türkçe (tr-TR) TTS sesi bulunamadı. İngilizce aksanlı fallback devre dışı bırakıldı.');return;}
  if(l==='dv'&&!v){toast('Dhivehi (dv-MV) TTS sesi bu tarayıcıda kurulu değil.');return;}
  const u=new SpeechSynthesisUtterance(tx);u.lang=code;u.rate=l==='tr'?0.91:0.94;u.pitch=1;if(v)u.voice=v;
  u.onstart=()=>toast((l==='tr'?'Türkçe ses: ':l==='dv'?'Dhivehi voice: ':'Voice: ')+(v?v.name:code));
  speechSynthesis.speak(u);
}
// Capture-phase override prevents older English-fallback handlers from running.
document.addEventListener('click',function(e){const b=e.target.closest&&e.target.closest('#voiceBtn,#playBtn');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();speakStrict();},true);
// Prime voices on browsers that populate asynchronously.
if(window.speechSynthesis){speechSynthesis.getVoices();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',()=>speechSynthesis.getVoices());}
})();