window.KAYAS_GALLERY_DATA={
  project:"KAYAS OSB Data Center Investor Visuals",
  version:"20260803-v24-investor-model",
  count:2,
  items:[
    {
      number:1,
      category:"Concept Portfolio",
      title:"KAYAS Veri Merkezi Konsept Portföyü",
      full:"assets/gallery/kayas_concept_board.svg?v=20260803-v24",
      thumb:"assets/gallery/kayas_concept_board.svg?v=20260803-v24",
      original:"assets/gallery/kayas_concept_board.svg?v=20260803-v24",
      notes:"Authoritative v8 yerleşimini koruyan giriş, resepsiyon, mantrap, veri salonu, fuaye ve teras konsept panosu."
    },
    {
      number:2,
      category:"Product Video",
      title:"H3C IC8000 Video Önizlemesi",
      full:"https://img.youtube.com/vi/gxWI5p_MH3E/maxresdefault.jpg",
      thumb:"https://img.youtube.com/vi/gxWI5p_MH3E/hqdefault.jpg",
      original:"https://youtu.be/gxWI5p_MH3E?t=5",
      notes:"H3C IC8000 ürün videosu. Yeni sekmede video açılır."
    }
  ]
};

(function(){
  'use strict';
  var v23='20260803-v23-investor-v1';
  var v24='20260803-v24-investor-model';
  if(!document.getElementById('kayas-v23-css')){
    var baseLink=document.createElement('link');
    baseLink.id='kayas-v23-css';baseLink.rel='stylesheet';baseLink.href='v23-investor.css?v='+v23;document.head.appendChild(baseLink);
  }
  if(!document.getElementById('kayas-v24-css')){
    var link=document.createElement('link');
    link.id='kayas-v24-css';link.rel='stylesheet';link.href='v24-investor-model.css?v='+v24;document.head.appendChild(link);
  }
  if(!document.getElementById('kayas-v23-js')){
    var baseScript=document.createElement('script');
    baseScript.id='kayas-v23-js';baseScript.src='v23-investor.js?v='+v23;baseScript.defer=true;document.head.appendChild(baseScript);
  }
  if(!document.getElementById('kayas-v24-js')){
    var script=document.createElement('script');
    script.id='kayas-v24-js';script.src='v24-investor-model.js?v='+v24;script.defer=true;document.head.appendChild(script);
  }
})();
