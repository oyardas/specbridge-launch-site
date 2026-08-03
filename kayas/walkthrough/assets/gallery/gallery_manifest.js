(function(){
  'use strict';
  var storedThree=window.THREE;
  var patched=false;

  function captured(renderer,scene,camera){
    if(renderer)window.__KAYAS_RENDERER__=renderer;
    if(scene)window.__KAYAS_SCENE__=scene;
    if(camera)window.__KAYAS_CAMERA__=camera;
    if(window.__KAYAS_RENDERER__&&window.__KAYAS_SCENE__&&window.__KAYAS_CAMERA__&&!window.__KAYAS_ENGINE_CAPTURED__){
      window.__KAYAS_ENGINE_CAPTURED__=true;
      window.dispatchEvent(new CustomEvent('kayas-engine-captured'));
      console.info('[KAYAS v19] Engine captured before model render.');
    }
  }

  function replaceConstructor(namespace,key,decorate){
    var Original=namespace&&namespace[key];
    if(typeof Original!=='function'||Original.__KAYAS_CAPTURE_WRAPPED__)return false;
    function WrappedConstructor(){
      var args=Array.prototype.slice.call(arguments);
      var instance=Reflect.construct(Original,args,Original);
      decorate(instance);
      return instance;
    }
    try{Object.setPrototypeOf(WrappedConstructor,Original);}catch(_error){}
    WrappedConstructor.prototype=Original.prototype;
    Object.defineProperty(WrappedConstructor,'__KAYAS_CAPTURE_WRAPPED__',{value:true});
    try{
      Object.defineProperty(namespace,key,{configurable:true,enumerable:true,writable:true,value:WrappedConstructor});
      return namespace[key]===WrappedConstructor;
    }catch(_error){
      try{namespace[key]=WrappedConstructor;return namespace[key]===WrappedConstructor;}catch(_ignored){return false;}
    }
  }

  function patchThree(namespace){
    if(!namespace||patched||namespace.__KAYAS_ENGINE_CAPTURE_PATCHED__)return;
    var sceneWrapped=replaceConstructor(namespace,'Scene',function(instance){captured(null,instance,null);});
    var cameraWrapped=replaceConstructor(namespace,'PerspectiveCamera',function(instance){captured(null,null,instance);});
    var rendererWrapped=replaceConstructor(namespace,'WebGLRenderer',function(instance){
      window.__KAYAS_RENDERER__=instance;
      var originalRender=instance&&instance.render;
      if(typeof originalRender==='function'&&!originalRender.__KAYAS_CAPTURE_WRAPPED__){
        var wrappedRender=function(scene,camera){captured(instance,scene,camera);return originalRender.apply(instance,arguments);};
        Object.defineProperty(wrappedRender,'__KAYAS_CAPTURE_WRAPPED__',{value:true});
        instance.render=wrappedRender;
      }
      captured(instance,null,null);
    });
    try{Object.defineProperty(namespace,'__KAYAS_ENGINE_CAPTURE_PATCHED__',{value:true});}catch(_error){}
    patched=sceneWrapped||cameraWrapped||rendererWrapped;
    window.__KAYAS_ENGINE_CAPTURE_PATCH_RESULT__={sceneWrapped:sceneWrapped,cameraWrapped:cameraWrapped,rendererWrapped:rendererWrapped};
  }

  if(storedThree)patchThree(storedThree);
  try{
    Object.defineProperty(window,'THREE',{
      configurable:true,
      enumerable:true,
      get:function(){return storedThree;},
      set:function(value){storedThree=value;patchThree(value);}
    });
  }catch(_error){
    var timer=window.setInterval(function(){if(window.THREE){window.clearInterval(timer);patchThree(window.THREE);}},10);
    window.setTimeout(function(){window.clearInterval(timer);},30000);
  }
})();

window.KAYAS_GALLERY_DATA={
  project:"KAYAS OSB Data Center Investor Visuals",
  version:"v19_curated_investor_gallery",
  count:2,
  items:[
    {number:1,category:"Concept Portfolio",title:"24 Görsellik KAYAS Konsept Panosu",full:"https://drive.google.com/uc?export=view&id=1TKKF1NsETSk68T0xbZa86DThc4dJ2gwT",thumb:"https://drive.google.com/uc?export=view&id=1TKKF1NsETSk68T0xbZa86DThc4dJ2gwT",original:"https://drive.google.com/file/d/1TKKF1NsETSk68T0xbZa86DThc4dJ2gwT/view",notes:"Giriş, fuaye, güvenlik, NOC, veri salonu, teknik alanlar, teras ve ziyaretçi rotasını kapsayan konsept görsel seti."},
    {number:2,category:"Product Video",title:"H3C IC8000 Video Önizlemesi",full:"https://img.youtube.com/vi/gxWI5p_MH3E/maxresdefault.jpg",thumb:"https://img.youtube.com/vi/gxWI5p_MH3E/hqdefault.jpg",original:"https://youtu.be/gxWI5p_MH3E?t=5",notes:"H3C IC8000 ürün videosu. Yeni sekmede video açılır."}
  ]
};
