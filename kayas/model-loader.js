(function(){
  'use strict';

  var DATA_URL='data/kayas-project-data.json?v=20260804-dynamic-r1';
  var data=null;

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
    var value=node.nodeValue;
    if(!value)return;
    Object.keys(map).forEach(function(from){
      if(value.indexOf(from)!==-1)value=value.split(from).join(map[from]);
    });
    node.nodeValue=value;
  }

  function walkAndReplace(root){
    if(!root)return;
    var map=replacements();
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);
    var node;
    while((node=walker.nextNode()))replaceTextNode(node,map);
  }

  function applyMetrics(){
    var c=capacity();
    if(!c.itCabinetsTotal)return;

    var titleLine=document.querySelector('.app-title-block span');
    if(titleLine)titleLine.textContent=c.headerLine||replacements()['20 IC8000 pods × 10 cabinets · 110 m × 46 m'];

    var metricGrid=document.querySelector('.metric-grid');
    if(metricGrid){
      var cards=metricGrid.querySelectorAll(':scope > div');
      Array.prototype.forEach.call(cards,function(card){
        var label=card.querySelector('span');
        var value=card.querySelector('strong');
        if(!label||!value)return;
        if(label.textContent.indexOf('Kabinet hedefi')!==-1){
          value.textContent=String(c.itCabinetsTotal);
          label.textContent='IT kabinet hedefi';
        }
        if(label.textContent.indexOf('IC8000 pod')!==-1){
          value.textContent=String(c.ic8000Pods);
          label.textContent='IC8000 pod · '+c.itCabinetsPerPod+' IT kabinet/pod';
        }
      });

      if(!metricGrid.querySelector('[data-kayas-dynamic="cdu"]')){
        var cduCard=document.createElement('div');
        cduCard.setAttribute('data-kayas-dynamic','cdu');
        cduCard.innerHTML='<strong>'+c.cduCabinets+'</strong><span>CDU kabineti · yardımcı altyapı</span>';
        var podCard=Array.prototype.find.call(metricGrid.children,function(card){
          var label=card.querySelector&&card.querySelector('span');
          return label&&label.textContent.indexOf('IC8000 pod')!==-1;
        });
        if(podCard&&podCard.nextSibling)metricGrid.insertBefore(cduCard,podCard.nextSibling);else metricGrid.appendChild(cduCard);
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
    applyAll();
    var observer=new MutationObserver(function(){applyAll();});
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    window.KAYAS_applyProjectData=applyAll;
  });

  var s=document.createElement('script');
  s.src='src/kayas-3d.bundle.js?v=20260804-reports-presentations-r1';
  s.onload=function(){
    var e=document.getElementById('loadStatus');
    if(e)e.hidden=true;
    applyAll();
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
