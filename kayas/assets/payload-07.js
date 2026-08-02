setTimeout(function(){
  window.openData=async function(raw){
    const k=await crypto.subtle.importKey("raw",raw,"AES-GCM",false,["decrypt"]);
    const packed=new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM",iv:b64(SEC.iv)},k,b64(SEC.cipher)));
    if(typeof DecompressionStream!=="function")throw new Error("Güncel Chrome, Edge veya Safari kullanın.");
    const stream=new Blob([packed]).stream().pipeThrough(new DecompressionStream("gzip"));
    return JSON.parse(await new Response(stream).text());
  };
},0);
