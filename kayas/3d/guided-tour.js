(function(){
'use strict';
const STOPS=window.KAYAS_TOUR_STOPS||[];
if(typeof THREE==='undefined'||typeof scene==='undefined'||typeof camera==='undefined'||typeof renderer==='undefined'||!STOPS.length)return;

renderer.setPixelRatio(Math.min(1,window.devicePixelRatio||1));
renderer.shadowMap.enabled=false;
try{sun.castShadow=false}catch(_){}

document.body.insertAdjacentHTML('beforeend',`
<div id="kayasTourBar">
 <button id="ktThird" class="active">3rd Floor</button><button id="ktBuilding">Building Overview</button><button id="ktCutaway">Cutaway</button><button id="ktTour">Guided Tour</button><button id="ktStops">Route Stops</button>
</div>
<div id="kayasStops"></div>
<div id="kayasTourPanel"><div class="kicker" id="ktCounter">Guided Tour</div><h3 id="ktTitle"></h3><div class="zones" id="ktZones"></div><div class="copy" id="ktCopy"></div><div class="progress"><span id="ktProgress"></span></div>
 <div class="actions"><button id="ktPrev">Previous</button><button id="ktNext">Next</button><button id="ktAuto">Auto Route</button><button id="ktSpeak">Play Audio</button><button id="ktStop">Stop Audio</button><select id="ktVoice"><option>Loading voices…</option></select><button id="ktClose">Close</button></div>
</div>
<div id="kayasFloorTools"><button id="ktSeparate">Separate Floors</button><button id="ktFloor1">Floor 1</button><button id="ktFloor2">Floor 2</button><button id="ktFloor3">3rd Floor Data Center</button></div>
<div id="kayasFloorBadge">3rd Floor · Roofless Review</div><div id="kayasFade"></div>`);

const $=id=>document.getElementById(id),panel=$('kayasTourPanel'),stopBox=$('kayasStops'),fade=$('kayasFade'),badge=$('kayasFloorBadge');
let idx=0,auto=false,nextTimer=null,voices=[],exploded=false;
const FLOOR=4;

function mat(color,opacity=.28,metal=.05){return new THREE.MeshStandardMaterial({color,roughness:.72,metalness:metal,transparent:opacity<1,opacity,depthWrite:opacity>.45})}
function box(w,h,d,m,x,y,z,p){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);(p||scene).add(o);return o}

const building=new THREE.Group();building.name='KAYAS_BUILDING_CONTEXT';scene.add(building);
const lower=new THREE.Group();lower.name='KAYAS_LOWER_FLOORS';building.add(lower);
function floor(y,color){
 const g=new THREE.Group();g.position.y=y;lower.add(g);
 box(41,.18,110,mat(0x6f7e87,.42),20.5,-.09,55,g);const w=mat(color,.18);
 box(.28,3.7,110,w,.14,1.85,55,g);box(.28,3.7,110,w,40.86,1.85,55,g);box(41,3.7,.28,w,20.5,1.85,.14,g);box(41,3.7,.28,w,20.5,1.85,109.86,g);return g
}
const floor2=floor(-FLOOR,0x547187),floor1=floor(-FLOOR*2,0x455f70);
lower.visible=false;

const lifts=new THREE.Group();lifts.name='KAYAS_ELEVATORS';scene.add(lifts);
function shaft(x,z,w,d){box(w,12,d,mat(0x8aa4b2,.16,.2),x,-2,z,lifts)}
function door(x,z,w,h,ry,freight){
 const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;lifts.add(g);
 const fm=new THREE.MeshStandardMaterial({color:freight?0x4d5960:0x616d74,roughness:.32,metalness:.72}),dm=new THREE.MeshStandardMaterial({color:freight?0x6e777c:0xaeb9be,roughness:.28,metalness:.78}),dk=new THREE.MeshStandardMaterial({color:0x111a1f});
 box(w+.24,.10,.12,fm,0,h+.05,0,g);box(.10,h,.12,fm,-w/2-.07,h/2,0,g);box(.10,h,.12,fm,w/2+.07,h/2,0,g);box(w/2-.03,h-.12,.07,dm,-w/4,h/2,0,g);box(w/2-.03,h-.12,.07,dm,w/4,h/2,0,g);box(.06,h-.18,.09,dk,0,h/2,.005,g);box(.16,.34,.05,dk,w/2+.24,1.2,.03,g)
}
shaft(2.25,103,2.7,5.4);shaft(5.55,103,2.7,5.4);shaft(23.5,101.2,5,8);
door(7.88,101,1.45,2.35,Math.PI/2,false);door(7.88,105,1.45,2.35,Math.PI/2,false);door(23.5,92.12,2.8,2.75,0,true);

const pickMat=new THREE.MeshBasicMaterial({color:0x67d6ff,transparent:true,opacity:.002,depthWrite:false,side:THREE.DoubleSide});
const pickGeom=new THREE.BoxGeometry(41,.18,110),pickers=[];
function picker(level,y){const p=new THREE.Mesh(pickGeom,pickMat);p.position.set(20.5,y,55);p.userData.floor=level;scene.add(p);pickers.push(p);return p}
const p3=picker(3,.08),p2=picker(2,-3.92),p1=picker(1,-7.92);
function syncPick(){p2.position.y=floor2.position.y+.08;p1.position.y=floor1.position.y+.08}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function animY(o,to){const from=o.position.y,s=performance.now();(function f(n){const q=Math.min(1,(n-s)/500);o.position.y=from+(to-from)*ease(q);syncPick();if(q<1)requestAnimationFrame(f)})(performance.now())}
function stack(){exploded=false;$('ktSeparate').classList.remove('active');$('ktSeparate').textContent='Separate Floors';animY(floor2,-4);animY(floor1,-8)}
function separate(){exploded=true;lower.visible=true;$('ktSeparate').classList.add('active');$('ktSeparate').textContent='Stack Floors';animY(floor2,-7);animY(floor1,-14);camera.position.set(76,31,132);camera.lookAt(21,-4.5,55);badge.textContent='Select a floor to enter'}
function third(){stack();lower.visible=false;badge.textContent='3rd Floor · Roofless Review';try{mode='overview';overview()}catch(_){camera.position.set(62,34,135);camera.lookAt(23,0,55)}}
function buildingView(){stack();lower.visible=true;badge.textContent='Full Building Overview';try{mode='guided'}catch(_){}camera.position.set(82,42,145);camera.lookAt(22,-2,55)}
function cutaway(){stack();lower.visible=true;badge.textContent='3-Level Cutaway · 3rd Floor Focus';try{mode='guided'}catch(_){}camera.position.set(70,30,128);camera.lookAt(22,-2,55)}
function enterFloor(level){stack();lower.visible=level!==3;if(level===3){third();return}const y=level===2?-2.3:-6.3;badge.textContent=`Floor ${level} · Building Shell`;try{mode='guided'}catch(_){}camera.position.set(20.5,y,93);camera.lookAt(20.5,y,55)}

$('ktThird').onclick=third;$('ktBuilding').onclick=buildingView;$('ktCutaway').onclick=cutaway;$('ktSeparate').onclick=()=>exploded?stack():separate;$('ktFloor1').onclick=()=>enterFloor(1);$('ktFloor2').onclick=()=>enterFloor(2);$('ktFloor3').onclick=()=>enterFloor(3);
const ray=new THREE.Raycaster(),pt=new THREE.Vector2();renderer.domElement.addEventListener('click',e=>{if(!exploded)return;const r=renderer.domElement.getBoundingClientRect();pt.x=((e.clientX-r.left)/r.width)*2-1;pt.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(pt,camera);const h=ray.intersectObjects(pickers,false)[0];if(h)enterFloor(h.object.userData.floor)});

function cancel(){if(nextTimer){clearTimeout(nextTimer);nextTimer=null}try{speechSynthesis.cancel()}catch(_){}}
function score(v){let s=(v.lang||'').toLowerCase().startsWith('en')?50:-200,n=v.name||'';if(/natural/i.test(n))s+=180;if(/neural/i.test(n))s+=160;if(/online/i.test(n))s+=100;if(/Jenny|Aria|Ava|Emma|Sonia|Libby|Natasha|Serena|Samantha|Victoria|Zira|Hazel|Susan|Catherine|Karen|Moira|Tessa/i.test(n))s+=120;if(/David|Mark|George|Guy|Daniel|Ryan|Thomas|James|Richard/i.test(n))s-=90;return s}
function loadVoices(){if(!('speechSynthesis'in window))return;voices=speechSynthesis.getVoices().filter(v=>(v.lang||'').toLowerCase().startsWith('en')).sort((a,b)=>score(b)-score(a));const s=$('ktVoice');s.innerHTML='';(voices.length?voices:[{name:'Default English',lang:'en-US'}]).forEach((v,i)=>{const o=document.createElement('option');o.value=v.name;o.textContent=`${v.name} (${v.lang||'en-US'})`;if(i===0)o.selected=true;s.appendChild(o)})}
loadVoices();if('speechSynthesis'in window)speechSynthesis.onvoiceschanged=loadVoices;
function selectedVoice(){return voices.find(v=>v.name===$('ktVoice').value)||voices[0]||null}
function speak(done){
 cancel();const text=STOPS[idx].text;if(!text){done&&done();return}
 if(!('speechSynthesis'in window)){nextTimer=setTimeout(()=>done&&done(),Math.max(4500,text.split(/\s+/).length/135*60000));return}
 const u=new SpeechSynthesisUtterance(text),v=selectedVoice();if(v){u.voice=v;u.lang=v.lang||'en-US'}else u.lang='en-US';u.rate=.91;u.pitch=1.03;u.volume=1;u.onend=()=>done&&done();u.onerror=()=>done&&done();speechSynthesis.speak(u)
}
$('ktVoice').onchange=()=>{cancel();if(!('speechSynthesis'in window))return;const u=new SpeechSynthesisUtterance('Welcome to the KAYAS integrated data center and digital services platform.'),v=selectedVoice();if(v){u.voice=v;u.lang=v.lang}u.rate=.91;u.pitch=1.03;speechSynthesis.speak(u)};

function pose(s){fade.classList.add('on');setTimeout(()=>{if(s.zones==='BUILDING'||s.zones.startsWith('BUILDING')){lower.visible=true}else lower.visible=false;try{mode='guided'}catch(_){}camera.position.set(...s.pos);camera.lookAt(new THREE.Vector3(...s.look));try{player.x=s.pos[0];player.y=s.pos[1];player.z=s.pos[2];const dx=s.look[0]-s.pos[0],dz=s.look[2]-s.pos[2];yaw=Math.atan2(dx,dz);targetYaw=yaw;pitch=0;targetPitch=0}catch(_){}fade.classList.remove('on')},180)}
function render(i,move=true){idx=(i+STOPS.length)%STOPS.length;const s=STOPS[idx];$('ktCounter').textContent=`Stop ${idx+1} of ${STOPS.length}`;$('ktTitle').textContent=s.title;$('ktZones').textContent=s.zones;$('ktCopy').textContent=s.text;$('ktProgress').style.width=`${(idx+1)/STOPS.length*100}%`;panel.classList.add('open');[...stopBox.children].forEach((b,n)=>b.classList.toggle('active',n===idx));if(move)pose(s)}
STOPS.forEach((s,i)=>{const b=document.createElement('button');b.textContent=`${String(i+1).padStart(2,'0')} · ${s.title}`;b.onclick=()=>{stopAuto();render(i,true);stopBox.classList.remove('open')};stopBox.appendChild(b)});
function advanceAfterSpeech(){if(!auto)return;nextTimer=setTimeout(()=>{if(!auto)return;render(idx+1,true);setTimeout(()=>speak(advanceAfterSpeech),250)},700)}
function startAuto(){auto=true;$('ktAuto').textContent='Stop Auto';render(idx,false);speak(advanceAfterSpeech)}
function stopAuto(){auto=false;$('ktAuto').textContent='Auto Route';cancel()}
$('ktTour').onclick=()=>render(idx,false);$('ktStops').onclick=()=>stopBox.classList.toggle('open');$('ktPrev').onclick=()=>{stopAuto();render(idx-1,true)};$('ktNext').onclick=()=>{stopAuto();render(idx+1,true)};$('ktAuto').onclick=()=>auto?stopAuto():startAuto();$('ktSpeak').onclick=()=>{stopAuto();speak()};$('ktStop').onclick=stopAuto;$('ktClose').onclick=()=>{stopAuto();panel.classList.remove('open');third()};

setTimeout(()=>{const l=$('landing');if(l)l.classList.add('hidden');third()},120);
window.addEventListener('beforeunload',stopAuto);
})();
