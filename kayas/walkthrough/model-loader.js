(async function(){
  'use strict';
  const status=document.getElementById('loadStatus');
  const EXPECTED_SHA256='3d31f4ec24f4554a742ca7de7a53d34de5dfdb812ad102a929c6967aa96e34b5';

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
  function applyUnifiedPatch(source,patchText){
    const src=source.replace(/\r\n/g,'\n').split('\n');
    const lines=patchText.replace(/\r\n/g,'\n').split('\n');
    const output=[];
    let srcIndex=0;
    let patchIndex=0;
    let hunkCount=0;
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
        const marker=line[0];
        const text=line.slice(1);
        if(marker===' '){
          if(src[srcIndex]!==text)throw new Error('v10 patch context mismatch at source line '+(srcIndex+1));
          output.push(src[srcIndex++]);
        }else if(marker==='-'){
          if(src[srcIndex]!==text)throw new Error('v10 patch deletion mismatch at source line '+(srcIndex+1));
          srcIndex+=1;
        }else if(marker==='+'){
          output.push(text);
        }else if(line!==''){
          throw new Error('Unsupported v10 patch instruction.');
        }
        patchIndex+=1;
      }
    }
    if(!hunkCount)throw new Error('v10 patch contains no hunks.');
    while(srcIndex<src.length)output.push(src[srcIndex++]);
    return output.join('\n');
  }
  async function sha256(text){
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  }
  function execute(source){
    const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
    const script=document.createElement('script');
    script.src=url;
    script.onload=()=>{
      URL.revokeObjectURL(url);
      if(status)status.hidden=true;
      window.dispatchEvent(new Event('resize'));
      console.info('[KAYAS v10] 3D engine active.');
    };
    script.onerror=()=>{
      URL.revokeObjectURL(url);
      fail('3D motoru başlatılamadı. Sayfayı Ctrl+F5 ile yenileyin.');
    };
    document.body.appendChild(script);
  }

  try{
    setStatus('3D yatırımcı deneyimi yükleniyor…','v8 kaynak modeli ve v10 geliştirmeleri doğrulanıyor.');
    const [sourceResponse,patchResponse]=await Promise.all([
      fetch('src/kayas-3d.bundle.js?v=20260803-v8-source',{cache:'no-store'}),
      fetch('kayas-v10.patch?v=20260803-10',{cache:'no-store'})
    ]);
    if(!sourceResponse.ok)throw new Error('v8 3D kaynak paketi alınamadı: HTTP '+sourceResponse.status);
    const original=await sourceResponse.text();
    let source=original;
    if(!original.includes('window.KAYAS_APP = { camera, renderer, scene, floor, zones, pods, updateScaleBar')){
      if(!patchResponse.ok)throw new Error('v10 model patch dosyası alınamadı: HTTP '+patchResponse.status);
      source=applyUnifiedPatch(original,await patchResponse.text());
    }
    if(window.crypto&&crypto.subtle){
      const actual=await sha256(source);
      if(actual!==EXPECTED_SHA256)throw new Error('v10 model bütünlük doğrulaması başarısız: '+actual.slice(0,12));
    }
    execute(source);
  }catch(error){
    fail(error&&error.message?error.message:String(error));
  }
})();
