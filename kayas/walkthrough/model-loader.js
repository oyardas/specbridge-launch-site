(async function(){
  'use strict';
  const status=document.getElementById('loadStatus');
  const ORIGINAL_SHA256='003d42f6fa45b0d30edb7c20f59512b3455ceacc00783795b3c8196a3fa5227d';
  const PATCHED_SHA256='3d31f4ec24f4554a742ca7de7a53d34de5dfdb812ad102a929c6967aa96e34b5';

  function setStatus(title,message){
    if(!status)return;
    status.hidden=false;
    const strong=status.querySelector('strong');
    const span=status.querySelector('span');
    if(strong)strong.textContent=title;
    if(span)span.textContent=message;
  }
  function fail(message){
    console.error('[KAYAS v10]',message);
    setStatus('3D deneyim açılamadı',message);
  }
  async function sha256(text){
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  }
  function applyUnifiedPatch(source,patchText){
    const src=source.replace(/\r\n/g,'\n').split('\n');
    const lines=patchText.replace(/\r\n/g,'\n').split('\n');
    const output=[];
    let srcIndex=0,patchIndex=0,hunkCount=0;
    while(patchIndex<lines.length){
      const header=lines[patchIndex].match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if(!header){patchIndex+=1;continue;}
      hunkCount+=1;
      const oldStart=Number(header[1])-1;
      while(srcIndex<oldStart)output.push(src[srcIndex++]);
      patchIndex+=1;
      while(patchIndex<lines.length&&!lines[patchIndex].startsWith('@@ ')){
        const line=lines[patchIndex];
        if(line.startsWith('--- ')||line.startsWith('+++ ')){patchIndex+=1;continue;}
        if(line==='\\ No newline at end of file'){patchIndex+=1;continue;}
        const marker=line[0],text=line.slice(1);
        if(marker===' '){
          if(src[srcIndex]!==text)throw new Error('v10 patch context mismatch at source line '+(srcIndex+1));
          output.push(src[srcIndex++]);
        }else if(marker==='-'){
          if(src[srcIndex]!==text)throw new Error('v10 patch deletion mismatch at source line '+(srcIndex+1));
          srcIndex+=1;
        }else if(marker==='+')output.push(text);
        else if(line!=='')throw new Error('Unsupported v10 patch instruction.');
        patchIndex+=1;
      }
    }
    if(!hunkCount)throw new Error('v10 patch contains no hunks.');
    while(srcIndex<src.length)output.push(src[srcIndex++]);
    return output.join('\n');
  }
  async function reconstructV8Source(){
    if(typeof DecompressionStream!=='function')throw new Error('Tam v8 modeli için güncel Chrome, Edge veya Safari gereklidir.');
    setStatus('Orijinal v8 modeli hazırlanıyor…','Bina yerleşimi değiştirilmeden tam 3D kaynak paketi birleştiriliyor.');
    const manifestResponse=await fetch('src/chunks/manifest.json?v=20260803-v8',{cache:'no-store'});
    if(!manifestResponse.ok)throw new Error('v8 model manifesti alınamadı: HTTP '+manifestResponse.status);
    const manifest=await manifestResponse.json();
    if(!manifest||!Array.isArray(manifest.files)||!manifest.files.length)throw new Error('v8 model manifesti geçersiz.');
    const parts=await Promise.all(manifest.files.map((file,index)=>fetch('src/chunks/'+file+'?v=20260803-v8',{cache:'force-cache'}).then(response=>{
      if(!response.ok)throw new Error('v8 model parçası eksik: '+file);
      setStatus('Orijinal v8 modeli hazırlanıyor…',(index+1)+' / '+manifest.files.length+' model parçası doğrulanıyor.');
      return response.text();
    })));
    const encoded=parts.join('').replace(/\s+/g,'');
    const raw=atob(encoded);
    const bytes=new Uint8Array(raw.length);
    for(let index=0;index<raw.length;index+=1)bytes[index]=raw.charCodeAt(index);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const source=await new Response(stream).text();
    if(window.crypto&&crypto.subtle){
      const actual=await sha256(source);
      if(actual!==ORIGINAL_SHA256)throw new Error('v8 model bütünlük doğrulaması başarısız: '+actual.slice(0,12));
    }
    return source;
  }
  function execute(source){
    const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
    const script=document.createElement('script');
    script.src=url;
    script.onload=()=>{
      URL.revokeObjectURL(url);
      if(status)status.hidden=true;
      window.dispatchEvent(new Event('resize'));
      console.info('[KAYAS v10] Authoritative v8 geometry and v10 features active.');
    };
    script.onerror=()=>{
      URL.revokeObjectURL(url);
      fail('3D motoru başlatılamadı. Sayfayı Ctrl+F5 ile yenileyin.');
    };
    document.body.appendChild(script);
  }

  try{
    const [patchResponse,directResponse]=await Promise.all([
      fetch('kayas-v10.patch?v=20260803-10',{cache:'no-store'}),
      fetch('src/kayas-3d.bundle.js?v=20260803-direct-check',{cache:'no-store'}).catch(()=>null)
    ]);
    if(!patchResponse.ok)throw new Error('v10 model patch dosyası alınamadı: HTTP '+patchResponse.status);
    let original='';
    if(directResponse&&directResponse.ok){
      const candidate=await directResponse.text();
      if(candidate.includes('const floor = {')&&candidate.includes('const zones = {')&&candidate.length>1000000)original=candidate;
      if(candidate.includes('window.KAYAS_APP = { camera, renderer, scene, floor, zones, pods, updateScaleBar')){
        if(window.crypto&&crypto.subtle){const actual=await sha256(candidate);if(actual!==PATCHED_SHA256)throw new Error('Mevcut v10 model bütünlüğü geçersiz.');}
        execute(candidate);return;
      }
    }
    if(!original)original=await reconstructV8Source();
    setStatus('v10 geliştirmeleri uygulanıyor…','Dinamik ölçek, SpecBridge markası ve IC8000 detayları etkinleştiriliyor.');
    const patched=applyUnifiedPatch(original,await patchResponse.text());
    if(window.crypto&&crypto.subtle){
      const actual=await sha256(patched);
      if(actual!==PATCHED_SHA256)throw new Error('v10 model bütünlük doğrulaması başarısız: '+actual.slice(0,12));
    }
    execute(patched);
  }catch(error){fail(error&&error.message?error.message:String(error));}
})();
