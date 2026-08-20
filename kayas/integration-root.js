(function(){
'use strict';
function patchControlledPortalLinks(){
  const panel=document.getElementById('reportsPanel');
  if(!panel)return;
  panel.querySelectorAll('a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(href==='../index.html'||href.endsWith('/index.html')){
      a.setAttribute('href','../legacy-portal.html');
      if(/Open Main Portal/i.test(a.textContent||''))a.textContent='Open Controlled Presentation Portal';
    }
  });
}
function addInvestorGuideShortcut(){
  const nav=document.querySelector('.nav');
  if(!nav||document.getElementById('investorGuideBtn'))return;
  const b=document.createElement('button');
  b.id='investorGuideBtn';
  b.className='project-nav';
  b.textContent='Investor Guide';
  b.addEventListener('click',()=>window.open('../yatirim_ve_teknoloji_rehberi/investor-edition-en.html','_blank','noopener'));
  nav.appendChild(b);
}
function boot(){
  patchControlledPortalLinks();
  addInvestorGuideShortcut();
  const reports=document.getElementById('reportsPanel');
  if(reports)new MutationObserver(patchControlledPortalLinks).observe(reports,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
