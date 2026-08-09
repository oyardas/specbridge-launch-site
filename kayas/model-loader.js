(function(){
  'use strict';

  var DATA_URL='data/kayas-project-data.json?v=20260804-dynamic-r1';
  var GUIDE_URL='yatirim_ve_teknoloji_rehberi/';
  var data=null;
  var observer=null;
  var observerConfig={subtree:true,childList:true,characterData:true};
  var applyQueued=false;
  var isApplying=false;

  function ensurePortalPatch(){
    if(!document.querySelector('link[data-kayas-portal-patch]')){
      var link=document.createElement('link');link.rel='stylesheet';link.href='portal-light-mobile.css?v=20260809-v1';link.setAttribute('data-kayas-portal-patch','1');document.head.appendChild(link);
    }
  }
  function applyPortalDefaults(){
    document.body.classList.remove('is-night');
    var night=document.getElementById('nightToggle');if(night)night.checked=false;
    var themeMeta=document.querySelector('meta[name="theme-color"]');if(themeMeta)themeMeta.setAttribute('content','#f7fafc');
  }
  function readProjectData(){try{var xhr=new XMLHttpRequest();xhr.open('GET',DATA_URL,false);xhr.send(null);if(xhr.status===200||xhr.status===0){data=JSON.parse(xhr.responseText);window.KAYAS_PROJECT_DATA=data;}}catch(_){data=null;}}
  function capacity(){return data&&data.capacity?data.capacity:{};}
  function dimensions(){return data&&data.dimensions?data.dimensions:{};}
  function replacements(){
    var c=capacity(),d=dimensions();var pods=c.ic8000Pods||20,perPod=c.itCabinetsPerPod||10,it=c.itCabinetsTotal||200,cdu=c.cduCabinets||6;var header=c.headerLine||(pods+' IC8000 pods × '+perPod+' IT cabinets + '+cdu+' CDU · '+(d.lengthM||110)+' m × '+(d.depthM||46)+' m');
    return {'20 IC8000 pods × 10 cabinets · 110 m × 46 m':header,'20 H3C IC8000 pods and 200 total cabinets':pods+' H3C IC8000 pods, '+it+' IT cabinets and '+cdu+' CDU cabinets','The phase-1 concept includes 20 IC8000 pods with 10 cabinets each, targeting 200 cabinets in total. The layout remains fully inside the enclosed data center volume, outside the 5-meter terrace band.':'The represented 3D geometry is the previous concept revision: '+pods+' IC8000 pods with '+perPod+' IT cabinets per pod ('+it+' IT cabinets) plus '+cdu+' auxiliary CDU cabinets. For current investment and capacity decisions, use the Yatırım ve Teknoloji Rehberi baseline: 206 IT cabinets = 196 air-cooled × 7 kW + 10 liquid-cooled × 60 kW = 1.972 MW. The 3D capacity geometry is SUPERSEDED.','200-cabinet target / 20 IC8000 pods':it+' IT cabinets + '+cdu+' CDU / '+pods+' IC8000 pods','200-cabinet target / 20 pods':it+' IT cabinets + '+cdu+' CDU','10 cabinets / active':perPod+' IT cabinets / pod'};
  }
  function replaceTextNode(node,map){if(!node||node.nodeType!==3)return;var original=node.nodeValue;if(!original)return;var next=original;Object.keys(map).forEach(function(from){if(next.indexOf(from)!==-1)next=next.split(from).join(map[from]);});if(next!==original)node.nodeValue=next;}
  function walkAndReplace(root){if(!root)return;var map=replacements();var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false),node;while((node=walker.nextNode()))replaceTextNode(node,map);}
  function setTextIfChanged(el,value){if(el&&el.textContent!==value)el.textContent=value;}
  function applyMetrics(){
    var c=capacity();if(!c.itCabinetsTotal)return;var titleLine=document.querySelector('.app-title-block span');setTextIfChanged(titleLine,c.headerLine||replacements()['20 IC8000 pods × 10 cabinets · 110 m × 46 m']);var metricGrid=document.querySelector('.metric-grid');if(!metricGrid)return;var cards=metricGrid.querySelectorAll(':scope > div'),existingCduCard=null;
    Array.prototype.forEach.call(cards,function(card){var label=card.querySelector('span'),value=card.querySelector('strong');if(!label||!value)return;var text=label.textContent||'';if(text.indexOf('Kabinet hedefi')!==-1||text.indexOf('IT cabinet target')!==-1||text.indexOf('IT kabinet hedefi')!==-1){setTextIfChanged(value,String(c.itCabinetsTotal));setTextIfChanged(label,'IT cabinet target · SUPERSEDED 3D revision');}if(text.indexOf('IC8000 pod')!==-1){setTextIfChanged(value,String(c.ic8000Pods));setTextIfChanged(label,'IC8000 pod · '+c.itCabinetsPerPod+' IT cabinets/pod');}if(text.toLowerCase().indexOf('cdu')!==-1)existingCduCard=card;});
    if(existingCduCard){existingCduCard.setAttribute('data-kayas-dynamic','cdu');setTextIfChanged(existingCduCard.querySelector('strong'),String(c.cduCabinets));setTextIfChanged(existingCduCard.querySelector('span'),'CDU cabinets · auxiliary');}else{var cduCard=document.createElement('div');cduCard.setAttribute('data-kayas-dynamic','cdu');cduCard.innerHTML='<strong>'+c.cduCabinets+'</strong><span>CDU cabinets · auxiliary</span>';metricGrid.appendChild(cduCard);}var duplicates=metricGrid.querySelectorAll('[data-kayas-dynamic="cdu"]');for(var i=1;i<duplicates.length;i++)duplicates[i].remove();
  }
  function applyGuideLinks(){
    var actions=document.querySelector('.app-bar-actions');if(actions&&!document.getElementById('investmentGuideLink')){var top=document.createElement('a');top.id='investmentGuideLink';top.className='tour-button';top.href=GUIDE_URL;top.target='_blank';top.rel='noopener';top.title='KAYAS Yatırım ve Teknoloji Rehberi';top.innerHTML='▣ <span>Yatırım Rehberi</span>';var tour=document.getElementById('tourButton');actions.insertBefore(top,tour||actions.firstChild);}
    var reportList=document.querySelector('.report-list');if(reportList&&!document.getElementById('investmentGuideReportLink')){var item=document.createElement('a');item.id='investmentGuideReportLink';item.className='report-item';item.href=GUIDE_URL;item.target='_blank';item.rel='noopener';item.innerHTML='<span class="report-icon green">WEB</span><span><strong>Yatırım ve Teknoloji Rehberi</strong><small>23 bölüm + ekler · Investor Edition 2026 · ayrı sayfada açılır</small></span><b>↗</b>';var reportsLabel=Array.prototype.find.call(reportList.children,function(el){return el.classList&&el.classList.contains('report-group-label')&&/Reports/i.test(el.textContent||'');});if(reportsLabel&&reportsLabel.nextSibling)reportList.insertBefore(item,reportsLabel.nextSibling);else reportList.insertBefore(item,reportList.firstChild);}
    var panel=document.getElementById('controlPanel');if(panel&&!document.getElementById('currentBaselineNotice')){var note=document.createElement('div');note.id='currentBaselineNotice';note.className='controls';note.innerHTML='<p><strong>CURRENT DECISION BASELINE:</strong> 206 IT cabinets = 196 air × 7 kW + 10 liquid × 60 kW = <strong>1.972 MW</strong>.</p><p>The visible 3D capacity geometry is the previous 200-IT-cabinet concept revision and is <strong>SUPERSEDED</strong> for capacity decisions. <a href="'+GUIDE_URL+'" target="_blank" rel="noopener">Open the current guide →</a></p>';panel.appendChild(note);}
    if(panel&&!document.getElementById('mobilePrimaryActions')){var row=document.createElement('div');row.id='mobilePrimaryActions';row.className='mobile-primary-actions';row.innerHTML='<button type="button" id="mobileTourStart">▶ Turu Başlat</button><a href="'+GUIDE_URL+'" target="_blank" rel="noopener">▣ Investor Rehberi</a>';var tabs=panel.querySelector('.presentation-tabs');if(tabs&&tabs.nextSibling)tabs.parentNode.insertBefore(row,tabs.nextSibling);else panel.insertBefore(row,panel.firstChild);var start=row.querySelector('#mobileTourStart');if(start)start.addEventListener('click',function(){var t=document.getElementById('tourButton');if(t)t.click();});}
  }
  function applyAll(){walkAndReplace(document.body);applyMetrics();applyGuideLinks();}
  function applyAllSafely(){if(isApplying)return;isApplying=true;if(observer)observer.disconnect();try{applyAll();}finally{isApplying=false;if(observer&&document.body)observer.observe(document.body,observerConfig);}}
  function scheduleApply(){if(applyQueued)return;applyQueued=true;window.setTimeout(function(){applyQueued=false;applyAllSafely();},80);}
  function patchSpeech(){try{if(!window.speechSynthesis||window.speechSynthesis.__kayasDynamicPatched)return;var original=window.speechSynthesis.speak.bind(window.speechSynthesis);window.speechSynthesis.speak=function(utterance){if(utterance&&typeof utterance.text==='string'){var map=replacements();Object.keys(map).forEach(function(from){if(utterance.text.indexOf(from)!==-1)utterance.text=utterance.text.split(from).join(map[from]);});}return original(utterance);};window.speechSynthesis.__kayasDynamicPatched=true;}catch(_){} }
  ensurePortalPatch();readProjectData();patchSpeech();
  document.addEventListener('DOMContentLoaded',function(){applyPortalDefaults();applyAllSafely();observer=new MutationObserver(function(){if(!isApplying)scheduleApply();});observer.observe(document.body,observerConfig);window.KAYAS_applyProjectData=applyAllSafely;});
  var s=document.createElement('script');s.src='src/kayas-3d.bundle.js?v=20260804-reports-presentations-r1-repair1';s.onload=function(){var e=document.getElementById('loadStatus');if(e)e.hidden=true;applyAllSafely();window.dispatchEvent(new Event('resize'));};s.onerror=function(){var e=document.getElementById('loadStatus');if(e){e.hidden=false;e.querySelector('strong').textContent='3D deneyim açılamadı';e.querySelector('span').textContent='Paket dosyaları eksik veya tarayıcı WebGL başlatamadı.';}};document.body.appendChild(s);
})();
