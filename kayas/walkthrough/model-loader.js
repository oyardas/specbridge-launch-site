(async function(){
  const status=document.getElementById('loadStatus');
  const showError=(message)=>{if(!status)return;status.hidden=false;status.querySelector('strong').textContent='3D deneyim açılamadı';status.querySelector('span').textContent=message;};
  const appendSource=(src,onFailure)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=()=>{if(status)status.hidden=true;window.dispatchEvent(new Event('resize'));};
    script.onerror=onFailure;
    document.body.appendChild(script);
  };
  try{
    const direct=await fetch('src/kayas-3d.bundle.js?v=20260803-4',{method:'HEAD',cache:'no-store'}).catch(()=>null);
    if(direct&&direct.ok){
      appendSource('src/kayas-3d.bundle.js?v=20260803-4',()=>showError('3D motoru yüklenemedi. Sayfayı yenileyin.'));
      return;
    }
    if(typeof DecompressionStream!=='function') throw new Error('3D varlık dağıtımı sürüyor. Birkaç dakika sonra güncel Chrome, Edge veya Safari ile tekrar deneyin.');
    const manifest=await fetch('src/chunks/manifest.json?v=20260803-4',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('3D paket dağıtımı henüz tamamlanmadı.');return r.json();});
    const parts=await Promise.all(manifest.files.map(f=>fetch('src/chunks/'+f+'?v=20260803-4',{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error('3D paket parçası eksik: '+f);return r.text();})));
    const raw=atob(parts.join('').replace(/\s+/g,''));
    const bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const source=await new Response(stream).text();
    const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
    appendSource(url,()=>{URL.revokeObjectURL(url);showError('3D motoru başlatılamadı.');});
  }catch(err){showError(err.message||String(err));}
})();
