(function(){
  'use strict';
  var VERSION='20260804-v30-reference-asset-repair-r1';
  var MISSING='assets/reference/ic8000_cold_aisle_left_view.png';
  var FALLBACK='assets/gallery/kayas_concept_board.svg?v='+VERSION;
  var state={ready:false,replaced:0,missing:MISSING,fallback:FALLBACK,errors:[]};
  var latestSnapshot=null;
  function shouldReplace(value){return String(value||'').indexOf(MISSING)!==-1;}
  function publish(){
    latestSnapshot=Object.assign({},state,{version:VERSION});
    try{
      Object.defineProperty(window,'__KAYAS_V30_REFERENCE_ASSET_STATUS',{
        configurable:true,
        enumerable:false,
        get:function(){return latestSnapshot;}
      });
    }catch(error){
      window.__KAYAS_V30_REFERENCE_ASSET_STATUS=latestSnapshot;
    }
    if(document.documentElement){
      document.documentElement.dataset.kayasV30ReferenceAssetReady=state.ready?'true':'false';
      document.documentElement.dataset.kayasV30ReferenceAssetReplaced=String(state.replaced);
    }
  }
  try{
    var descriptor=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
    if(descriptor&&descriptor.get&&descriptor.set&&!HTMLImageElement.prototype.__kayasV30ReferenceGuard){
      Object.defineProperty(HTMLImageElement.prototype,'src',{
        configurable:descriptor.configurable,
        enumerable:descriptor.enumerable,
        get:descriptor.get,
        set:function(value){
          if(shouldReplace(value)){value=FALLBACK;state.replaced+=1;publish();}
          return descriptor.set.call(this,value);
        }
      });
      HTMLImageElement.prototype.__kayasV30ReferenceGuard=true;
    }
    var nativeSetAttribute=HTMLImageElement.prototype.setAttribute;
    if(!HTMLImageElement.prototype.__kayasV30ReferenceAttributeGuard){
      HTMLImageElement.prototype.setAttribute=function(name,value){
        if(String(name).toLowerCase()==='src'&&shouldReplace(value)){value=FALLBACK;state.replaced+=1;publish();}
        return nativeSetAttribute.call(this,name,value);
      };
      HTMLImageElement.prototype.__kayasV30ReferenceAttributeGuard=true;
    }
    state.ready=true;
  }catch(error){state.errors.push(error&&error.stack||error&&error.message||String(error));}
  publish();
})();

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
