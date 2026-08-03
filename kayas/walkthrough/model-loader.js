(function(){
  'use strict';
  const status=document.getElementById('loadStatus');
  function showError(message){
    if(!status)return;
    status.hidden=false;
    const strong=status.querySelector('strong');
    const span=status.querySelector('span');
    if(strong)strong.textContent='3D deneyim açılamadı';
    if(span)span.textContent=message;
  }
  const script=document.createElement('script');
  script.src='src/kayas-3d.bundle.js?v=20260803-10';
  script.defer=true;
  script.onload=()=>{
    if(status)status.hidden=true;
    window.dispatchEvent(new Event('resize'));
  };
  script.onerror=()=>showError('3D motoru yüklenemedi. Dağıtım tamamlandıktan sonra sayfayı Ctrl+F5 ile yenileyin.');
  document.body.appendChild(script);
})();
