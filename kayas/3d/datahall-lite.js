(function(){
'use strict';
if(typeof THREE==='undefined'||typeof scene==='undefined')return;
if(window.__KAYAS_LITE_DATAHALL__)return;window.__KAYAS_LITE_DATAHALL__=true;
const PODS=[
{x:20.7,z:42.3,w:6,d:3.6,a:10,b:10},{x:28.3,z:42.3,w:6,d:3.6,a:10,b:10},{x:20.7,z:47.5,w:6,d:3.6,a:10,b:10},{x:28.3,z:47.5,w:6,d:3.6,a:10,b:10},{x:20.7,z:52.7,w:6,d:3.6,a:10,b:10},{x:28.3,z:52.7,w:6,d:3.6,a:10,b:10},{x:20.7,z:57.9,w:6,d:3.6,a:10,b:9},{x:28.3,z:57.9,w:6,d:3.6,a:9,b:10},{x:20.7,z:63.1,w:6,d:3.6,a:10,b:9},{x:28.3,z:63.1,w:6,d:3.6,a:9,b:10}
];
function build(){
 const group=new THREE.Group();group.name='KAYAS_LITE_IC8000';scene.add(group);
 const bodyMat=new THREE.MeshStandardMaterial({color:0x303940,roughness:.62,metalness:.28});
 const faceMat=new THREE.MeshStandardMaterial({color:0x111b21,roughness:.35,metalness:.25});
 const redMat=new THREE.MeshStandardMaterial({color:0xd71920,roughness:.4,metalness:.15});
 const blueMat=new THREE.MeshStandardMaterial({color:0x277da1,roughness:.45,metalness:.35});
 const frameMat=new THREE.MeshStandardMaterial({color:0x69757d,roughness:.38,metalness:.72});
 const bodyG=new THREE.BoxGeometry(.56,2.12,1.08),faceG=new THREE.BoxGeometry(.50,1.80,.025),lightG=new THREE.BoxGeometry(.07,.035,.03);
 const bodies=new THREE.InstancedMesh(bodyG,bodyMat,196),faces=new THREE.InstancedMesh(faceG,faceMat,196),lights=new THREE.InstancedMesh(lightG,redMat,196);
 const m=new THREE.Matrix4();let k=0;
 for(const pod of PODS){const rowZ=[pod.z+.62,pod.z+pod.d-.62],counts=[pod.a,pod.b];for(let r=0;r<2;r++){const count=counts[r],usable=5.72,spacing=usable/10,start=pod.x+.14+(10-count)*spacing/2;for(let i=0;i<count;i++){const x=start+spacing*(i+.5),z=rowZ[r],frontZ=z+(r===0?.553:-.553);m.makeTranslation(x,1.06,z);bodies.setMatrixAt(k,m);m.makeTranslation(x,1.06,frontZ);faces.setMatrixAt(k,m);m.makeTranslation(x,1.83,frontZ+(r===0?.018:-.018));lights.setMatrixAt(k,m);k++}}}
 bodies.count=faces.count=lights.count=k;bodies.frustumCulled=faces.frustumCulled=lights.frustumCulled=false;group.add(bodies,faces,lights);
 const liquidG=new THREE.BoxGeometry(.62,2.18,1.16),liquid=new THREE.InstancedMesh(liquidG,blueMat,10),liquidFace=new THREE.InstancedMesh(new THREE.BoxGeometry(.54,1.86,.03),faceMat,10);
 for(let i=0;i<10;i++){const z=43+i*1.72;m.makeTranslation(38.5,1.09,z);liquid.setMatrixAt(i,m);m.makeTranslation(38.5,1.09,z+.595);liquidFace.setMatrixAt(i,m)}liquid.frustumCulled=liquidFace.frustumCulled=false;group.add(liquid,liquidFace);
 const hBeam=new THREE.InstancedMesh(new THREE.BoxGeometry(6,.07,.07),frameMat,20),vBeam=new THREE.InstancedMesh(new THREE.BoxGeometry(.07,.07,3.6),frameMat,20);let hi=0,vi=0;for(const pod of PODS){for(const z of[pod.z+.03,pod.z+pod.d-.03]){m.makeTranslation(pod.x+pod.w/2,2.42,z);hBeam.setMatrixAt(hi++,m)}for(const x of[pod.x+.03,pod.x+pod.w-.03]){m.makeTranslation(x,2.42,pod.z+pod.d/2);vBeam.setMatrixAt(vi++,m)}}hBeam.frustumCulled=vBeam.frustumCulled=false;group.add(hBeam,vBeam);
 window.ensureKAYASAssets=()=>Promise.resolve(true);window.ensureKayasAssets=window.ensureKAYASAssets;
 const st=document.getElementById('status');if(st)st.textContent='206 IT CABINETS · 1,972 kW';
}
if('requestIdleCallback'in window)requestIdleCallback(build,{timeout:600});else setTimeout(build,180);
})();