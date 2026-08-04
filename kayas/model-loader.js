(function(){
  'use strict';

  var DATA_URL='data/kayas-project-data.json?v=20260804-dynamic-r1';
  var data=null;
  var observer=null;
  var observerConfig={subtree:true,childList:true,characterData:true};
  var applyQueued=false;
  var isApplying=false;

  function readProjectData(){
    try{
      var xhr=new XMLHttpRequest();
      xhr.open('GET',DATA_URL,false);
      xhr.send(null);
      if(xhr.status===200||xhr.status===0){
        data=JSON.parse(xhr.responseText);
        window.KAYAS_PROJECT_DATA=data;
      }
    }catch(_){data=null;}
  }

  function capacity(){return data&&data.capacity?data.capacity:{};}
  function dimensions(){return data&&data.dimensions?data.dimensions:{};}

  function replacements(){
    var c=capacity(),d=dimensions();
    var pods=c.ic8000Pods||20;
    var perPod=c.itCabinetsPerPod||10;
    var it=c.itCabinetsTotal||200;
    var cdu=c.cduCabinets||6;
    var header=c.headerLine||(pods+' IC8000 pods × '+perPod+' IT cabinets + '+cdu+' CDU · '+(d.lengthM||110)+' m × '+(d.depthM||46)+' m');
    var title=pods+' H3C IC8000 pods, '+it+' IT cabinets and '+cdu+' CDU cabinets';
    var narrative='The phase-1 structure uses '+pods+' IC8000 pods with '+perPod+' IT cabinets per pod, preserving '+it+' IT cabinets. '+cdu+' CDU cabinets are added as auxiliary liquid-cooling infrastructure and are not counted as sellable IT cabinets.';
    return {
      '20 IC8000 pods × 10 cabinets · 110 m × 46 m':header,
      '20 H3C IC8000 pods and 200 total cabinets':title,
      'The phase-1 concept includes 20 IC8000 pods with 10 cabinets each, targeting 200 cabinets in total. The layout remains fully inside the enclosed data center volume, outside the 5-meter terrace band.':narrative,
      '200-cabinet target / 20 IC8000 pods':it+' IT cabinets + '+cdu+' CDU / '+pods+' IC8000 pods',
      '200-cabinet target / 20 pods':it+' IT cabinets + '+cdu+' CDU',
      '10 cabinets / active':perPod+' IT cabinets / pod'
    };
  }

  function replaceTextNode(node,map){
    if(!node||node.nodeType!==3)return;
    var original=node.nodeValue;
    if(!original)return;
    var next=original;
    Object.keys(map).forEach(function(from){
      if(next.indexOf(from)!==-1)next=next.split(from).join(map[from]);
    });
    if(next!==original)node.nodeValue=next;
  }

  function walkAndReplace(root){
    if(!root)return;
    var map=replacements();
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);
    var node;
    while((node=walker.nextNode()))replaceTextNode(node,map);
  }

  function setTextIfChanged(element,value){
    if(element&&element.textContent!==value)element.textContent=value;
  }

  function applyMetrics(){
    var c=capacity();
    if(!c.itCabinetsTotal)return;

    var titleLine=document.querySelector('.app-title-block span');
    setTextIfChanged(titleLine,c.headerLine||replacements()['20 IC8000 pods × 10 cabinets · 110 m × 46 m']);

    var metricGrid=document.querySelector('.metric-grid');
    if(metricGrid){
      var cards=metricGrid.querySelectorAll(':scope > div');
      var existingCduCard=null;

      Array.prototype.forEach.call(cards,function(card){
        var label=card.querySelector('span');
        var value=card.querySelector('strong');
        if(!label||!value)return;
        var labelText=label.textContent||'';

        if(labelText.indexOf('Kabinet hedefi')!==-1||labelText.indexOf('IT cabinet target')!==-1||labelText.indexOf('IT kabinet hedefi')!==-1){
          setTextIfChanged(value,String(c.itCabinetsTotal));
          setTextIfChanged(label,'IT cabinet target');
        }

        if(labelText.indexOf('IC8000 pod')!==-1){
          setTextIfChanged(value,String(c.ic8000Pods));
          setTextIfChanged(label,'IC8000 pod · '+c.itCabinetsPerPod+' IT cabinets/pod');
        }

        if(labelText.toLowerCase().indexOf('cdu')!==-1){
          existingCduCard=card;
        }
      });

      if(existingCduCard){
        existingCduCard.setAttribute('data-kayas-dynamic','cdu');
        setTextIfChanged(existingCduCard.querySelector('strong'),String(c.cduCabinets));
        setTextIfChanged(existingCduCard.querySelector('span'),'CDU cabinets · auxiliary');
      }else{
        var cduCard=document.createElement('div');
        cduCard.setAttribute('data-kayas-dynamic','cdu');
        cduCard.innerHTML='<strong>'+c.cduCabinets+'</strong><span>CDU cabinets · auxiliary</span>';
        metricGrid.appendChild(cduCard);
      }

      var duplicateCduCards=metricGrid.querySelectorAll('[data-kayas-dynamic="cdu"]');
      for(var i=1;i<duplicateCduCards.length;i++){
        duplicateCduCards[i].parentNode.removeChild(duplicateCduCards[i]);
      }

      if(!document.querySelector('.cdu-scope-note')){
        var note=document.createElement('p');
        note.className='subtitle cdu-scope-note';
        note.innerHTML='<strong>Counting rule:</strong> '+c.physicalEquipmentCabinetsTotal+' physical equipment positions = '+c.itCabinetsTotal+' IT cabinets + '+c.cduCabinets+' CDU cabinets. CDU cabinets are auxiliary and not sellable IT cabinets.';
        metricGrid.parentNode.insertBefore(note,metricGrid.nextSibling);
      }
    }
  }

  function applyAll(){
    walkAndReplace(document.body);
    applyMetrics();
  }

  function applyAllSafely(){
    if(isApplying)return;
    isApplying=true;
    if(observer)observer.disconnect();
    try{
      applyAll();
    }finally{
      isApplying=false;
      if(observer&&document.body)observer.observe(document.body,observerConfig);
    }
  }

  function scheduleApply(){
    if(applyQueued)return;
    applyQueued=true;
    window.setTimeout(function(){
      applyQueued=false;
      applyAllSafely();
    },50);
  }

  function patchSpeech(){
    try{
      if(!window.speechSynthesis||window.speechSynthesis.__kayasDynamicPatched)return;
      var original=window.speechSynthesis.speak.bind(window.speechSynthesis);
      window.speechSynthesis.speak=function(utterance){
        if(utterance&&typeof utterance.text==='string'){
          var map=replacements();
          Object.keys(map).forEach(function(from){
            if(utterance.text.indexOf(from)!==-1)utterance.text=utterance.text.split(from).join(map[from]);
          });
        }
        return original(utterance);
      };
      window.speechSynthesis.__kayasDynamicPatched=true;
    }catch(_){/* narration remains available without dynamic patch */}
  }

  readProjectData();
  patchSpeech();

  document.addEventListener('DOMContentLoaded',function(){
    applyAllSafely();
    observer=new MutationObserver(function(){
      if(!isApplying)scheduleApply();
    });
    observer.observe(document.body,observerConfig);
    window.KAYAS_applyProjectData=applyAllSafely;
  });

  var s=document.createElement('script');
  s.src='src/kayas-3d.bundle.js?v=20260804-reports-presentations-r1-repair1';
  s.onload=function(){
    var e=document.getElementById('loadStatus');
    if(e)e.hidden=true;
    applyAllSafely();
    window.dispatchEvent(new Event('resize'));
  };
  s.onerror=function(){
    var e=document.getElementById('loadStatus');
    if(e){
      e.hidden=false;
      e.querySelector('strong').textContent='3D deneyim açılamadı';
      e.querySelector('span').textContent='Paket dosyaları eksik veya tarayıcı WebGL başlatamadı.';
    }
  };
  document.body.appendChild(s);
})();
