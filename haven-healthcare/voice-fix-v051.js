(function(){
'use strict';
if(window.__HAVEN_VOICE_FIX_052__) return;
window.__HAVEN_VOICE_FIX_052__=true;
function toast(msg){let t=document.getElementById('hvVoiceToast');if(!t){t=document.createElement('div');t.id='hvVoiceToast';t.style.cssText='position:fixed;right:14px;bottom:14px;z-index:99999;background:#103650;color:#fff;padding:10px 13px;border-radius:8px;font:11px Segoe UI,Arial,sans-serif;box-shadow:0 8px 24px #0003';document.body.appendChild(t);}t.textContent=msg;clearTimeout(t._tm);t._tm=setTimeout(()=>t.remove(),5000);}
function lang(){const s=document.getElementById('hvLangSelect');return s?s.value:'en';}
function text(){const n=document.getElementById('narrativeText');return n?n.textContent.trim():'';}
function voices(){return window.speechSynthesis?speechSynthesis.getVoices():[];}
function turkishPool(){const vs=voices();const exact=vs.filter(v=>(v.lang||'').toLowerCase()==='tr-tr');const named=vs.filter(v=>/turkish|türk|türkçe|emel|ahmet|filiz|tolga/i.test((v.name||'')+' '+(v.voiceURI||'')));return [...new Map([...exact,...named].map(v=>[(v.voiceURI||v.name),v])).values()];}
function score(v){const n=(v.name||'').toLowerCase();let s=0;if((v.lang||'').toLowerCase()==='tr-tr')s+=100;if(n.includes('natural'))s+=40;if(n.includes('neural'))s+=35;if(n.includes('online'))s+=25;if(n.includes('microsoft'))s+=15;if(n.includes('google'))s+=12;if(/emel|ahmet|filiz|tolga/.test(n))s+=18;if(v.localService===false)s+=8;return s;}
function bestTurkish(){return turkishPool().sort((a,b)=>score(b)-score(a))[0]||null;}
function bestExact(code){const lc=code.toLowerCase();return voices().filter(v=>(v.lang||'').toLowerCase()===lc).sort((a,b)=>score(b)-score(a))[0]||null;}
function turkishSpeechText(tx){return tx
.replace(/Haven Healthcare/gi,'Heyvın Heltker')
.replace(/executive architecture/gi,'yönetici mimarisi')
.replace(/logical network/gi,'mantıksal ağ')
.replace(/physical connectivity/gi,'fiziksel bağlantı')
.replace(/private cloud/gi,'özel bulut')
.replace(/campus backbone/gi,'kampüs omurgası')
.replace(/campus core/gi,'kampüs çekirdeği')
.replace(/data[- ]center fabric/gi,'veri merkezi omurgası')
.replace(/data center/gi,'veri merkezi')
.replace(/healthcare services/gi,'sağlık hizmetleri')
.replace(/security/gi,'güvenlik')
.replace(/recovery/gi,'geri dönüş')
.replace(/backup/gi,'yedekleme')
.replace(/disaster recovery/gi,'felaket kurtarma')
.replace(/access control/gi,'erişim kontrolü')
.replace(/firewall/gi,'güvenlik duvarı')
.replace(/network/gi,'ağ')
.replace(/wireless/gi,'kablosuz')
.replace(/storage/gi,'depolama')
.replace(/PACS/gi,'paks')
.replace(/HCI/gi,'eyç si ay')
.replace(/Wi[- ]?Fi/gi,'vay fay')
.replace(/IoMT/gi,'medikal nesnelerin interneti')
.replace(/IoT/gi,'nesnelerin interneti')
.replace(/OOB/gi,'bant dışı yönetim')
.replace(/RPO/gi,'ar pi o')
.replace(/RTO/gi,'ar ti o')
.replace(/100G/gi,'yüz gigabit')
.replace(/25G/gi,'yirmi beş gigabit')
.replace(/4-node/gi,'dört düğümlü')
.replace(/3-node/gi,'üç düğümlü');}
function ensureVoiceSelector(){let s=document.getElementById('hvTrVoiceSelect');if(!s){s=document.createElement('select');s.id='hvTrVoiceSelect';s.title='Türkçe ses seçimi';s.style.cssText='display:none;max-width:170px;height:29px;border:1px solid #ffffff55;border-radius:7px;background:#173f58;color:#fff;font:8px Segoe UI,Arial,sans-serif;padding:0 5px;';const actions=document.querySelector('.actions');const print=document.querySelector('.print-wrap');if(actions)actions.insertBefore(s,print||null);s.addEventListener('change',()=>{try{localStorage.setItem('haven_tr_voice_uri',s.value)}catch(_){}});}return s;}
function refreshVoiceSelector(){const s=ensureVoiceSelector(),tr=lang()==='tr';s.style.display=tr?'inline-block':'none';if(!tr)return;const pool=turkishPool().sort((a,b)=>score(b)-score(a));const saved=(()=>{try{return localStorage.getItem('haven_tr_voice_uri')||''}catch(_){return''}})();s.innerHTML='';if(!pool.length){const o=document.createElement('option');o.value='';o.textContent='Türkçe ses yok';s.appendChild(o);return;}pool.forEach(v=>{const o=document.createElement('option');o.value=v.voiceURI||v.name;o.textContent=v.name+' · '+v.lang;s.appendChild(o);});const chosen=pool.find(v=>(v.voiceURI||v.name)===saved)||pool[0];s.value=chosen.voiceURI||chosen.name;}
function selectedTurkishVoice(){const s=ensureVoiceSelector(),pool=turkishPool();return pool.find(v=>(v.voiceURI||v.name)===s.value)||bestTurkish();}
function speakStrict(){const l=lang(),raw=text();if(!raw)return;speechSynthesis.cancel();let code=l==='tr'?'tr-TR':l==='dv'?'dv-MV':'en-US';let v=l==='tr'?selectedTurkishVoice():bestExact(code);if(l==='tr'&&!v){toast('Bu Chrome profilinde Türkçe TTS sesi bulunamadı. Windows Ayarlar > Saat ve dil > Dil ve bölge > Türkçe > Konuşma paketini yükleyin veya Microsoft Edge ile açın.');return;}if(l==='dv'&&!v){toast('Dhivehi (dv-MV) TTS sesi bu tarayıcıda kurulu değil.');return;}const tx=l==='tr'?turkishSpeechText(raw):raw;const u=new SpeechSynthesisUtterance(tx);u.lang=code;u.rate=l==='tr'?0.88:0.94;u.pitch=1;if(v)u.voice=v;u.onstart=()=>toast((l==='tr'?'Türkçe ses: ':l==='dv'?'Dhivehi voice: ':'Voice: ')+(v?v.name:code));speechSynthesis.speak(u);}
document.addEventListener('click',function(e){const b=e.target.closest&&e.target.closest('#voiceBtn,#playBtn');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();speakStrict();},true);
function sync(){refreshVoiceSelector();}
document.addEventListener('change',e=>{if(e.target&&e.target.id==='hvLangSelect')setTimeout(sync,0)},true);
if(window.speechSynthesis){speechSynthesis.getVoices();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',sync);}
setTimeout(sync,0);setTimeout(sync,500);setTimeout(sync,1500);
})();