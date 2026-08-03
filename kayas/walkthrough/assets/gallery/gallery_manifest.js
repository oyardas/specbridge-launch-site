window.KAYAS_GALLERY_DATA={
  project:"KAYAS OSB Data Center Investor Visuals",
  version:"v22_same_origin_gallery",
  count:2,
  items:[
    {number:1,category:"Concept Portfolio",title:"KAYAS Yerleşim ve Konsept Görseli",full:"assets/gallery/kayas_concept_board.svg",thumb:"assets/gallery/kayas_concept_board.svg",original:"assets/gallery/kayas_concept_board.svg",notes:"Authoritative v8 yerleşimini temel alan, aynı origin üzerinden sunulan yatırımcı konsept görseli."},
    {number:2,category:"Product Video",title:"H3C IC8000 Video Önizlemesi",full:"https://img.youtube.com/vi/gxWI5p_MH3E/maxresdefault.jpg",thumb:"https://img.youtube.com/vi/gxWI5p_MH3E/hqdefault.jpg",original:"https://youtu.be/gxWI5p_MH3E?t=5",notes:"H3C IC8000 ürün videosu. Yeni sekmede video açılır."}
  ]
};

(function(){
  'use strict';
  var overlays=['labelsToggle','routeToggle','zoningToggle','futureToggle','coolingToggle','powerToggle','fiberToggle','safetyToggle'];
  function setProfessionalDefaults(){
    overlays.forEach(function(id){
      var input=document.getElementById(id);
      if(!input||!input.checked)return;
      input.checked=false;
      input.dispatchEvent(new Event('change',{bubbles:true}));
    });
  }
  function suppressPrimitiveDecor(){
    var scene=window.__KAYAS_SCENE__;
    if(!scene||!scene.traverse)return false;
    scene.traverse(function(object){
      if(!object||!object.visible)return;
      var name=String(object.name||'').toLowerCase();
      if(!name)return;
      if(/screen|dashboard|monitor|rack|cabinet|ic8000|door|wall|floor|glass|table|chair|reception|mantrap|battery|fiber|hvac|chiller|cooler/.test(name))return;
      if(/person|human|visitor|avatar|figure|receptionist|staff|plant|tree|shrub|foliage|greenery|potted/.test(name)){
        object.visible=false;
        object.userData=object.userData||{};
        object.userData.kayasV22Suppressed=true;
      }
    });
    return true;
  }
  function install(){
    setProfessionalDefaults();
    var attempts=0;
    var timer=setInterval(function(){
      attempts+=1;
      setProfessionalDefaults();
      if(suppressPrimitiveDecor()||attempts>120)clearInterval(timer);
    },250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
