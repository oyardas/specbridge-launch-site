window.KAYAS_GALLERY_DATA={
  project:"KAYAS OSB Data Center Investor Visuals",
  version:"20260803-v23-investor-v1",
  count:2,
  items:[
    {
      number:1,
      category:"Concept Portfolio",
      title:"24 Görsellik KAYAS Konsept Panosu",
      full:"assets/gallery/kayas_concept_contact_sheet.webp?v=20260803-v23",
      thumb:"assets/gallery/kayas_concept_contact_sheet.webp?v=20260803-v23",
      original:"assets/gallery/kayas_concept_contact_sheet.webp?v=20260803-v23",
      notes:"Giriş, fuaye, güvenlik, NOC, veri salonu, teknik alanlar, teras ve ziyaretçi rotasını kapsayan konsept görsel seti."
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
  var version='20260803-v23-investor-v1';
  if(!document.getElementById('kayas-v23-css')){
    var link=document.createElement('link');
    link.id='kayas-v23-css';
    link.rel='stylesheet';
    link.href='v23-investor.css?v='+version;
    document.head.appendChild(link);
  }
  if(!document.getElementById('kayas-v23-js')){
    var script=document.createElement('script');
    script.id='kayas-v23-js';
    script.src='v23-investor.js?v='+version;
    script.defer=true;
    document.head.appendChild(script);
  }
})();
