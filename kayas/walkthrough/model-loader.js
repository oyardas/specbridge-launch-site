(async function(){
  const status=document.getElementById('loadStatus');
  try{
    if(typeof DecompressionStream!=='function') throw new Error('Bu deneyim güncel Chrome, Edge veya Safari gerektirir.');
    const manifest=await fetch('src/chunks/manifest.json?v=20260803-3',{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error('3D paket manifesti indirilemedi.');return r.json();});
    const parts=await Promise.all(manifest.files.map(f=>fetch('src/chunks/'+f+'?v=20260803-3',{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error('3D paket parçası indirilemedi: '+f);return r.text();})));
    const raw=atob(parts.join('').replace(/\s+/g,''));
    const bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const source=await new Response(stream).text();
    const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
    const script=document.createElement('script');script.src=url;
    script.onload=()=>{URL.revokeObjectURL(url);if(status)status.hidden=true;window.dispatchEvent(new Event('resize'));};
    script.onerror=()=>{URL.revokeObjectURL(url);if(status){status.hidden=false;status.querySelector('strong').textContent='3D motoru başlatılamadı';}};
    document.body.appendChild(script);
  }catch(err){if(status){status.hidden=false;status.querySelector('strong').textContent='3D deneyim açılamadı';status.querySelector('span').textContent=err.message||String(err);}}
})();
