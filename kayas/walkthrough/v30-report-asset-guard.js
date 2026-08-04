(function(){
'use strict';

const VERSION='20260804-v30-report-asset-guard';
const MISSING='assets/report/KAYAS_OSB_Yerinde_Fizibilite_Saha_Raporu.pdf';
const state={ready:false,disabledItems:0,frameGuarded:false,errors:[]};

function isMissing(value){
  return String(value||'').split('#')[0].split('?')[0].endsWith(MISSING);
}

function makeUnavailable(item){
  if(!item||item.dataset.kayasV30ReportGuard==='1')return;
  item.dataset.kayasV30ReportGuard='1';
  item.classList.add('is-pending');
  item.disabled=true;
  item.setAttribute('aria-disabled','true');
  item.removeAttribute('data-report-src');
  item.removeAttribute('data-report-download');
  const small=item.querySelector('small');
  if(small)small.textContent='Doküman henüz portala yüklenmedi';
  const marker=item.querySelector('b');
  if(marker)marker.textContent='•';
  state.disabledItems+=1;
}

function guardFrame(){
  const frame=document.getElementById('reportFrame');
  if(frame&&isMissing(frame.getAttribute('src'))){
    frame.removeAttribute('src');
    frame.srcdoc='<!doctype html><html lang="tr"><meta charset="utf-8"><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#0b1724;color:#dce8f1;font:600 18px Arial,sans-serif;text-align:center}p{max-width:520px;line-height:1.5;padding:32px}</style><p>Saha fizibilite raporu henüz yatırımcı portalına yüklenmedi.</p></html>';
    frame.dataset.assetState='unavailable';
    state.frameGuarded=true;
  }
  ['reportOpen','reportDownload'].forEach(function(id){
    const link=document.getElementById(id);
    if(link&&isMissing(link.getAttribute('href'))){
      link.removeAttribute('href');
      link.setAttribute('aria-disabled','true');
      link.classList.add('is-disabled');
      link.addEventListener('click',function(event){event.preventDefault();});
    }
  });
}

function install(){
  try{
    document.querySelectorAll('.report-item').forEach(function(item){
      if(isMissing(item.dataset.reportSrc)||isMissing(item.dataset.reportDownload))makeUnavailable(item);
    });
    guardFrame();
    document.addEventListener('click',function(event){
      const item=event.target.closest('.report-item');
      if(item&&item.dataset.kayasV30ReportGuard==='1'){
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },true);
    state.ready=true;
  }catch(error){
    state.errors.push(error.stack||error.message||String(error));
  }
  window.__KAYAS_V30_REPORT_GUARD_STATUS=Object.assign({},state,{version:VERSION});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
