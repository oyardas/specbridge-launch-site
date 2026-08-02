import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/+esm';

const canvas=document.getElementById('scene');
const zoneTitle=document.getElementById('zoneTitle');
const zoneText=document.getElementById('zoneText');
const mobile=matchMedia('(max-width:760px)').matches;
const C={red:0xd71920,cyan:0x2fd5d0,blue:0x3f88ff,amber:0xffbb4d,green:0x42d99b,dark:0x071421};

const scene=new THREE.Scene();
scene.background=new THREE.Color(C.dark);
scene.fog=new THREE.FogExp2(C.dark,mobile?.010:.0065);
const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.08,400);
camera.position.set(-52,1.7,0);camera.rotation.order='YXZ';
const renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:2));renderer.setSize(innerWidth,innerHeight,false);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
renderer.shadowMap.enabled=!mobile;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const hemi=new THREE.HemisphereLight(0xb9dfff,0x172337,1.6);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,2.1);sun.position.set(-35,55,-25);sun.castShadow=!mobile;sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);sun.shadow.camera.left=-80;sun.shadow.camera.right=80;sun.shadow.camera.top=55;sun.shadow.camera.bottom=-55;scene.add(sun);

const root=new THREE.Group(),zoning=new THREE.Group(),labels=new THREE.Group(),route=new THREE.Group(),future=new THREE.Group(),cooling=new THREE.Group(),power=new THREE.Group(),fiber=new THREE.Group(),safety=new THREE.Group(),design=new THREE.Group(),ceiling=new THREE.Group();
scene.add(root,zoning,labels,route,future,cooling,power,fiber,safety,design,ceiling);
const pickables=[],obstacles=[];
const material=(color,metal=.05,rough=.68,transparent=false,opacity=1)=>new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough,transparent,opacity,side:THREE.DoubleSide});
function box(name,size,pos,mat,parent=root,shadow=true){const m=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);m.name=name;m.position.set(...pos);m.castShadow=shadow&&!mobile;m.receiveShadow=!mobile;parent.add(m);return m}
function cyl(name,r,h,pos,mat,parent=root,segments=20){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),mat);m.name=name;m.position.set(...pos);m.castShadow=!mobile;parent.add(m);return m}
function tube(points,color,r=.06,parent=root,opacity=1){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*12),r,8,false),material(color,.05,.35,opacity<1,opacity));parent.add(mesh);return mesh}
function line(points,color,parent){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity:.85}));parent.add(l);return l}
function addObstacle(x,z,w,d){obstacles.push({minX:x-w/2-.35,maxX:x+w/2+.35,minZ:z-d/2-.35,maxZ:z+d/2+.35})}
function texture(text,bg='#071421',color='#fff',size=58){const c=document.createElement('canvas');c.width=768;c.height=192;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);x.font=`800 ${size}px Arial`;x.fillStyle=color;x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function sign(text,pos,rot=0,w=6,bg='#071421',color='#fff'){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w/4),new THREE.MeshBasicMaterial({map:texture(text,bg,color),transparent:true,side:THREE.DoubleSide}));m.position.set(...pos);m.rotation.y=rot;design.add(m);return m}
function label(text,pos,w=6,color='#dff6ff'){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:texture(text,'rgba(4,15,28,.82)',color,45),transparent:true,depthTest:false}));s.position.set(...pos);s.scale.set(w,w/4,1);s.renderOrder=20;labels.add(s);return s}
function zone(name,title,description,x,z,w,d,color){const m=box(name,[w,.025,d],[x,.026,z],material(color,0,.75,true,.16),zoning,false);m.userData={zone:true,title,description};pickables.push(m);const rim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w,.035,d)),new THREE.LineBasicMaterial({color,transparent:true,opacity:.55}));rim.position.set(x,.04,z);zoning.add(rim);return m}

// 110 m x 46 m existing-building conversion, west entrance and 5 m east terrace.
box('floor',[110,.16,46],[0,-.08,0],material(0x17283b,.15,.74),root,false);
box('terrace',[5,.22,46],[52.5,-.05,0],material(0x39495a,.1,.85),root,false);
const wall=material(0x9fb4c8,.05,.8,true,.30),solid=material(0x20344a,.1,.72,true,.84),glass=material(0x6fcfff,.15,.08,true,.16);
box('north wall',[110,4.5,.22],[0,2.2,-23],solid);box('south wall',[110,4.5,.22],[0,2.2,23],solid);box('east wall',[.22,4.5,46],[50,2.2,0],solid);
box('west north',[.22,4.5,15],[-55,2.2,-15.5],solid);box('west south',[.22,4.5,15],[-55,2.2,15.5],solid);box('west glass',[.12,4.2,16],[-55,2.1,0],glass);
box('ceiling',[110,.12,46],[0,4.55,0],material(0xd8e3ed,0,.9,true,.13),ceiling,false);for(let x=-50;x<=45;x+=10)line([[x,4.48,-22.5],[x,4.48,22.5]],0x7893ad,ceiling);for(let z=-20;z<=20;z+=5)line([[-54.5,4.48,z],[49.5,4.48,z]],0x7893ad,ceiling);ceiling.visible=false;

zone('entrance','Batı Giriş & Güvenlik','Ziyaretçi kabulü, turnike, güvenlik taraması ve kontrollü yatırımcı giriş noktası.',-50,0,10,17,C.blue);
zone('showroom','Yatırımcı Fuayesi & Showroom','H3C IC8000 demo, dijital ikiz ekranları ve müşteri brifing alanı.',-38,0,13,17,0x8a6dff);
zone('noc','NOC & Operasyon','7/24 DCIM/BMS, güvenlik, olay yönetimi ve operasyon komuta alanı.',-36,16,15,12,C.green);
zone('air','Hava Soğutmalı Veri Salonu','190 kabinet için hot/cold aisle containment, A/B enerji ve çift fiber güzergâhı.',7,0,61,29,C.blue);
zone('ai','AI / Liquid Cooling Zone','10 yüksek yoğunluklu sıvı soğutmalı H3C IC8000 kabinet ve CDU dağıtımı.',43,0,12,28,C.red);
zone('utility','Batarya, Fiber & Teknik Odalar','Güney teknik bandında batarya, MMR/fiber ve elektrik dağıtım alanları.',5,18.5,62,8,C.amber);
zone('future','Kuzey Genişleme Rezervi','Gelecek faz için ayrılmış kabinet, mekanik ve enerji genişleme alanı.',19,-19,47,7,0x6a7f96);
zone('terrace zone','Doğu Teknik Terası','5 m terasta eşanjör, kuru soğutucu, pompa ve yedek mekanik ekipman.',52.5,0,5,46,C.cyan);

// Investor entrance and showroom.
box('security desk',[4,1.05,1.2],[-51.5,.53,4.5],material(0x223d59,.35,.45));
for(let z=-4;z<=2;z+=3){box('turnstile',[1.2,.9,.18],[-48,.45,z],material(0xb8c8d8,.55,.3));cyl('post',.12,1,[-48,.5,z],material(0x8ba0b5,.75,.25))}
sign('KAYAS DIGITAL SERVICE PLATFORM',[-54.78,3.35,0],Math.PI/2,12);sign('SpecBridge AI',[-49.8,3.25,-8.2],0,6,'#092659','#35d8d0');sign('H3C IC8000 EXPERIENCE',[-38,3.25,-8.35],0,7.4,'#fff','#d71920');
const demo=box('showroom IC8000',[4.6,2.75,2.2],[-37,1.38,0],material(0x111b27,.75,.28));demo.userData={zone:true,title:'H3C IC8000 Demo Pod',description:'Fiziksel kabinet, liquid cooling ve DCIM yatırımcı deneyim noktası.'};pickables.push(demo);
box('showroom glass',[8,3.1,.08],[-37,1.55,5],glass,design,false);box('dashboard',[.08,2.25,5.5],[-43.8,1.7,0],material(0x06101b,.1,.2),design);const d=new THREE.Mesh(new THREE.PlaneGeometry(5.1,1.7),new THREE.MeshBasicMaterial({map:texture('LIVE DIGITAL TWIN','#071c31','#45dfd8',68)}));d.position.set(-43.74,1.85,0);d.rotation.y=Math.PI/2;design.add(d);

// NOC.
box('noc divider',[.2,3.5,12],[-28.5,1.75,16],wall);box('noc north',[15,3.5,.2],[-36,1.75,10.1],wall);
for(let i=0;i<4;i++){const x=-41.5+i*3.4;box('console',[2.8,.72,1.1],[x,.36,15.5],material(0x25384b,.45,.42));box('screen',[2.4,1.15,.08],[x,1.45,14.96],material(0x0b1622,.1,.18));const s=new THREE.Mesh(new THREE.PlaneGeometry(2.15,.94),new THREE.MeshBasicMaterial({map:texture(`DCIM ${i+1}`,'#06182a',i===3?'#ffbb4d':'#43d9d3',70)}));s.position.set(x,1.48,14.9);design.add(s)}
sign('NETWORK OPERATIONS CENTER',[-36,3.25,21.75],Math.PI,7,'#071421','#42d99b');

// 190 standard racks rendered efficiently as one instanced mesh.
const rackGeo=new THREE.BoxGeometry(.82,2.25,1.15),rackMat=material(0x121923,.78,.28),racks=new THREE.InstancedMesh(rackGeo,rackMat,190),dummy=new THREE.Object3D();let index=0;const rows=[-12.3,-9.5,-6.7,-3.9,-1.1,1.7,4.5,7.3,10.1,12.9];
for(let r=0;r<10;r++)for(let c=0;c<19;c++){const x=-20+c*3.05,z=rows[r];dummy.position.set(x,1.13,z);dummy.rotation.y=r%2?Math.PI:0;dummy.updateMatrix();racks.setMatrixAt(index++,dummy.matrix);addObstacle(x,z,.82,1.15)}root.add(racks);
for(let r=0;r<10;r++){const z=rows[r],side=r%2?-.61:.61;tube([[-20,2.15,z+side],[34.9,2.15,z+side]],r%4===0?C.cyan:C.blue,.025,design,.95);if(r%2===0){const a=box('cold aisle',[55,2.7,1.35],[7.4,1.4,(z+rows[r+1])/2],material(0x66cfff,.05,.1,true,.07),design,false);a.userData={zone:true,title:`Cold Aisle ${r/2+1}`,description:'Kapalı soğuk koridor, sıra bazlı sıcaklık ve basınç izleme.'};pickables.push(a)}}
sign('AIR-COOLED DATA HALL · 190 RACKS',[6,4.05,-14.4],0,11,'#09213a','#58a4ff');

// Ten liquid-cooled H3C IC8000 cabinets.
const h3c=texture('H3C','#fff','#d71920',105);
for(let row=0;row<2;row++)for(let col=0;col<5;col++){const x=40.6+col*1.65,z=-7+row*14,p=box('H3C IC8000',[1.25,2.65,1.65],[x,1.33,z],material(0x0c121a,.82,.22));addObstacle(x,z,1.25,1.65);p.userData={zone:true,title:`H3C IC8000 AI Cabinet ${row*5+col+1}`,description:'A/B güç, liquid cooling manifold, sızıntı algılama ve DCIM izleme.'};pickables.push(p);const logo=new THREE.Mesh(new THREE.PlaneGeometry(.82,.28),new THREE.MeshBasicMaterial({map:h3c}));logo.position.set(x,2,z+(row===0?.831:-.831));logo.rotation.y=row===0?0:Math.PI;design.add(logo);tube([[x,3,z-.55],[x,3.75,z-.55],[49,3.75,z-.55]],0x1bc7dd,.055,cooling);tube([[x,3.12,z-.42],[x,3.9,z-.42],[49,3.9,z-.42]],0x1b6aff,.055,cooling)}
sign('H3C IC8000 · LIQUID-COOLED AI ZONE',[44.5,4.05,-14.25],0,10,'#fff','#d71920');

// South technical band.
const tech=[[-20,'UPS A',0xffbf4d],[-9,'UPS B',0xffbf4d],[2,'BATTERY A',0xf19140],[13,'BATTERY B',0xf19140],[24,'MMR / FIBER A',0x7b6cff],[35,'MMR / FIBER B',0x7b6cff]];
for(const [x,name,color] of tech){box(name,[10,3.35,.18],[x,1.68,14.6],wall);box(name,[10,3.35,.18],[x,1.68,22.4],solid);box(name,[.18,3.35,7.8],[x-5,1.68,18.5],wall);sign(name,[x,2.85,14.48],0,5.5,'#0b1c2f',`#${color.toString(16).padStart(6,'0')}`)}

// East terrace mechanical equipment.
for(let i=0;i<5;i++){const z=-18+i*9,u=box('dry cooler',[3.6,2.2,5.5],[52.4,1.1,z],material(0x6f8293,.55,.5));u.userData={zone:true,title:`Dry Cooler / Heat Exchanger ${i+1}`,description:'Yaklaşık 8°C doğal su potansiyeli için ayrık eşanjörlü ve yedekli mekanik sistem.'};pickables.push(u);for(let f=-1;f<=1;f++){const fan=cyl('fan',.52,.08,[52.4,2.24,z+f*1.55],material(0x172433,.65,.32),design,24);fan.rotation.z=Math.PI/2}}
tube([[49,3.75,-20],[49,3.75,20]],0x12c8e3,.10,cooling);tube([[48.65,3.95,-20],[48.65,3.95,20]],0x1b67ff,.10,cooling);label('DOĞAL SU / EŞANJÖR / YEDEK SOĞUTMA',[52.5,4.15,0],10,'#63e7e1');

// Technical layers.
for(let z=-12;z<=12;z+=5.6){tube([[-22,3.82,z],[48,3.82,z]],C.amber,.07,power);tube([[-22,4.05,z+.18],[48,4.05,z+.18]],0xffdc6b,.035,fiber)}
for(let x=-45;x<=45;x+=10){line([[x,4.2,-21.5],[x,4.2,21.5]],C.red,safety);for(let z=-18;z<=18;z+=9){const sensor=cyl('fire sensor',.08,.08,[x,4.32,z],material(C.red,.1,.35),safety,12);sensor.rotation.z=Math.PI/2}}
const cameras=[[-52,3.7,-10],[-52,3.7,10],[-30,3.7,-13],[20,3.7,-13],[47,3.7,-13],[47,3.7,13]];for(const p of cameras){const c=box('security camera',[.45,.22,.22],p,material(0xd5e0e8,.25,.4),safety);c.userData={zone:true,title:'CCTV & Physical Security',description:'Kapı, koridor ve kritik alanları kapsayan güvenlik izleme noktası.'};pickables.push(c)}
for(let x=-2;x<=39;x+=3.1)for(const z of [-20.2,-17.7])box('future rack',[.82,2.2,1.15],[x,1.1,z],material(0x6a7f96,.1,.55,true,.22),future,false);label('PHASE 2 EXPANSION RESERVE',[19,3.2,-19],8.5,'#b9c9d8');
const visitor=[[-53,.08,0],[-48,.08,0],[-43,.08,0],[-38,.08,0],[-31,.08,0],[-27,.08,-10],[-20,.08,-15.2],[11,.08,-15.2],[39,.08,-15.2],[48,.08,-10],[48,.08,10],[39,.08,15.2],[-20,.08,15.2],[-29,.08,16]];tube(visitor,C.cyan,.07,route,.75);for(let i=0;i<visitor.length;i+=2)cyl('route node',.16,.03,[visitor[i][0],.1,visitor[i][2]],material(0xffffff,.1,.25),route,20);

// Navigation, preset camera views and collision.
const keys=new Set();let yaw=Math.PI/2,pitch=0,drag=false,lastX=0,lastY=0,walk=true,animation=null;
const presets={entrance:{p:[-52,1.7,0],l:[-39,1.5,0],t:'Batı Giriş & Güvenlik'},foyer:{p:[-46,1.7,-5],l:[-36,1.4,0],t:'Yatırımcı Fuayesi & Showroom'},datahall:{p:[-22,1.7,-15.5],l:[18,1.5,-8],t:'Hava Soğutmalı Veri Salonu'},noc:{p:[-38,1.7,11.5],l:[-36,1.3,17],t:'NOC & Operasyon Merkezi'},terrace:{p:[47.5,1.8,-13],l:[52.5,1.5,0],t:'Doğu Teknik Terası'},walk:{p:[-49,1.7,0],l:[-37,1.55,0],t:'Serbest Yürüme Modu'},layers:{p:[-8,26,39],l:[5,0,0],t:'Teknik Katmanlar'},top:{p:[0,62,.1],l:[0,0,0],t:'Üst Görünüm'}};
function angles(p,l){const v=new THREE.Vector3(...l).sub(new THREE.Vector3(...p)).normalize();return{y:Math.atan2(-v.x,-v.z),x:Math.asin(v.y)}}
function go(name){const v=presets[name]||presets.entrance,a=angles(v.p,v.l);animation={from:camera.position.clone(),to:new THREE.Vector3(...v.p),y0:yaw,x0:pitch,y1:a.y,x1:a.x,t:performance.now(),d:name==='top'||name==='layers'?1300:900};walk=!['top','layers'].includes(name);document.getElementById('walkModeToggle').checked=walk;zoneTitle.textContent=v.t;zoneText.textContent=name==='walk'?'W/A/S/D, ok tuşları veya mobil yön pedi ile alan içinde gezebilirsiniz.':'Kamera seçilen yatırımcı anlatım noktasına taşındı.'}
function valid(x,z){if(x<-54.2||x>54.2||z<-22.2||z>22.2)return false;return !obstacles.some(o=>x>o.minX&&x<o.maxX&&z>o.minZ&&z<o.maxZ)}
window.addEventListener('keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){keys.add(e.code);e.preventDefault()}});window.addEventListener('keyup',e=>keys.delete(e.code));
canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.0032;pitch=Math.max(-1.28,Math.min(1.28,pitch-dy*.0026));camera.rotation.set(pitch,yaw,0)});canvas.addEventListener('pointerup',e=>{drag=false;canvas.releasePointerCapture?.(e.pointerId)});canvas.addEventListener('pointercancel',()=>drag=false);
canvas.addEventListener('wheel',e=>{e.preventDefault();const v=new THREE.Vector3();camera.getWorldDirection(v);v.y=0;v.normalize();const n=camera.position.clone().addScaledVector(v,e.deltaY<0?.9:-.9);if(valid(n.x,n.z))camera.position.copy(n)},{passive:false});
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));window.start3D=()=>go('entrance');

// Zone picking and technical layer switches.
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=-(e.clientY-r.top)/r.height*2+1;ray.setFromCamera(pointer,camera);const h=ray.intersectObjects(pickables,false)[0];if(h?.object.userData.zone){zoneTitle.textContent=h.object.userData.title;zoneText.textContent=h.object.userData.description}});
function toggle(id,group){const el=document.getElementById(id);if(!el)return;group.visible=el.checked;el.addEventListener('change',()=>group.visible=el.checked)}toggle('labelsToggle',labels);toggle('zoningToggle',zoning);toggle('ceilingToggle',ceiling);toggle('routeToggle',route);toggle('futureToggle',future);toggle('coolingToggle',cooling);toggle('powerToggle',power);toggle('fiberToggle',fiber);toggle('safetyToggle',safety);toggle('designToggle',design);document.getElementById('walkModeToggle').addEventListener('change',e=>walk=e.target.checked);document.getElementById('nightToggle').addEventListener('change',e=>{const n=e.target.checked;scene.background.set(n?C.dark:0xddeaf4);scene.fog.color.set(n?C.dark:0xddeaf4);hemi.intensity=n?1.6:2.25;sun.intensity=n?2.1:2.8;renderer.toneMappingExposure=n?1.12:1.28});

// Gallery and report panels.
const drawer=document.getElementById('customerDrawer'),galleryPanel=document.querySelector('[data-content="gallery"]'),reportPanel=document.querySelector('[data-content="report"]');
function closeDrawer(){drawer.hidden=true;document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('is-active',b.dataset.panel==='model'))}function openDrawer(type){drawer.hidden=false;galleryPanel.hidden=type!=='gallery';reportPanel.hidden=type!=='report';document.getElementById('drawerTitle').textContent=type==='gallery'?'Konsept Görseller':'Saha Fizibilite Raporu';document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('is-active',b.dataset.panel===type))}
document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>b.dataset.panel==='model'?closeDrawer():openDrawer(b.dataset.panel)));document.getElementById('drawerClose').addEventListener('click',closeDrawer);
const items=window.KAYAS_GALLERY_DATA?.items||[],grid=document.getElementById('galleryGrid');function select(item,i){document.getElementById('galleryHero').src=item.full;document.getElementById('galleryCategory').textContent=item.category;document.getElementById('galleryTitle').textContent=item.title;document.getElementById('galleryNote').textContent=item.notes||'';document.getElementById('galleryHeroButton').dataset.index=i;grid.querySelectorAll('.gallery-thumb').forEach((b,j)=>b.classList.toggle('is-selected',i===j))}function lightbox(item){const l=document.getElementById('imageLightbox');l.hidden=false;document.getElementById('lightboxImage').src=item.full;document.getElementById('lightboxCategory').textContent=item.category;document.getElementById('lightboxTitle').textContent=item.title;document.getElementById('lightboxOpenOriginal').href=item.original||item.full}
items.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.className='gallery-thumb';b.innerHTML=`<img src="${item.thumb}" alt=""><strong>${item.title}</strong><span>${item.category}</span>`;b.addEventListener('click',()=>{select(item,i);lightbox(item)});grid.appendChild(b)});if(items[0])select(items[0],0);document.getElementById('galleryHeroButton').addEventListener('click',()=>{const i=Number(document.getElementById('galleryHeroButton').dataset.index||0);if(items[i])lightbox(items[i])});document.getElementById('lightboxClose').addEventListener('click',()=>document.getElementById('imageLightbox').hidden=true);

const clock=new THREE.Clock();function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.045);if(animation){const t=Math.min(1,(performance.now()-animation.t)/animation.d),s=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;camera.position.lerpVectors(animation.from,animation.to,s);yaw=THREE.MathUtils.lerp(animation.y0,animation.y1,s);pitch=THREE.MathUtils.lerp(animation.x0,animation.x1,s);camera.rotation.set(pitch,yaw,0);if(t===1)animation=null}else if(walk){const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new THREE.Vector3(-f.z,0,f.x),m=new THREE.Vector3();if(keys.has('KeyW')||keys.has('ArrowUp'))m.add(f);if(keys.has('KeyS')||keys.has('ArrowDown'))m.sub(f);if(keys.has('KeyD')||keys.has('ArrowRight'))m.add(r);if(keys.has('KeyA')||keys.has('ArrowLeft'))m.sub(r);if(m.lengthSq()){m.normalize().multiplyScalar(3.3*dt);const x=camera.position.x+m.x,z=camera.position.z+m.z;if(valid(x,camera.position.z))camera.position.x=x;if(valid(camera.position.x,z))camera.position.z=z;camera.position.y=1.7}}renderer.render(scene,camera)}
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:2));renderer.setSize(innerWidth,innerHeight,false)});
go('entrance');frame();document.getElementById('loadStatus').hidden=true;
