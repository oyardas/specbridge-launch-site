(function(){
  'use strict';
  function install(){
    if(document.getElementById('hvHeaderFixV046')) return;
    const s=document.createElement('style');
    s.id='hvHeaderFixV046';
    s.textContent=`
      header{padding-right:190px!important;}
      .actions{padding-right:0!important;gap:5px!important;}
      .hv-lang-wrap{position:fixed!important;top:14px!important;right:84px!important;z-index:1260!important;display:block!important;}
      .hv-lang-wrap>button{min-width:58px!important;text-align:center!important;}
      .print-wrap{position:fixed!important;top:14px!important;right:12px!important;z-index:1270!important;display:block!important;}
      .print-wrap>#printBtn{min-width:62px!important;text-align:center!important;}
      .hv-lang-menu{right:0!important;}
      .print-menu{right:0!important;}
      @media(max-width:1450px){
        header{padding-right:180px!important;}
        .brand{width:190px!important;}
        #tabs button,.actions button,.hv-lang-wrap>button{padding:6px 5px!important;font-size:7.6px!important;}
        .hv-lang-wrap{right:80px!important;}
      }
      @media(max-width:1220px){
        header{padding-right:170px!important;}
        .brand{width:175px!important;}
        .hv-lang-wrap{right:76px!important;}
        .print-wrap{right:8px!important;}
      }
    `;
    document.head.appendChild(s);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true}); else install();
})();