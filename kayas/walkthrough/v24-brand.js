(function(){
'use strict';

const VERSION='20260804-v30-brand-syntax-repair';

function h3cLogoDataUri(){
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 67" role="img" aria-label="H3C"><rect width="240" height="67" rx="7" fill="#ffffff"/><text x="120" y="49" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="48" font-weight="700" fill="#e31837">H3C</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

function install(){
  const src=h3cLogoDataUri();
  let count=0;
  document.querySelectorAll('.h3c-wordmark-logo').forEach(function(node){
    let image=node.querySelector('img');
    if(!image){
      image=document.createElement('img');
      node.textContent='';
      node.appendChild(image);
    }
    image.src=src;
    image.alt='H3C';
    image.loading='eager';
    image.decoding='async';
    image.setAttribute('data-kayas-brand-version',VERSION);
    count+=1;
  });
  window.__KAYAS_V24_BRAND_STATUS={ready:true,version:VERSION,count:count};
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
