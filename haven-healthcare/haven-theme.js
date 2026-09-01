(()=>{
'use strict';
if(window.HAVEN_THEME_RUNTIME)return;window.HAVEN_THEME_RUNTIME=true;
const KEY='specbridge_project_theme',PROJECT_DEFAULT='light';
function pref(){try{const v=localStorage.getItem(KEY);return['light','dark','system'].includes(v)?v:''}catch(_){return''}}
function effective(p=pref()){if(p==='light'||p==='dark')return p;if(p==='system')return matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';return PROJECT_DEFAULT}
function render(){const p=pref()||PROJECT_DEFAULT;document.querySelectorAll('#hvThemeSwitch button').forEach(b=>b.classList.toggle('on',b.dataset.theme===p))}
function apply(p=pref(),animate=false){const t=effective(p);if(animate){document.documentElement.classList.add('sb-theme-transition');setTimeout(()=>document.documentElement.classList.remove('sb-theme-transition'),360)}document.documentElement.dataset.sbTheme=t;document.documentElement.dataset.sbThemePreference=p||'project';document.documentElement.style.colorScheme=t;render();try{parent.document.documentElement.dataset.sbTheme=t}catch(_){}window.dispatchEvent(new CustomEvent('specbridge:theme',{detail:{project:'haven-healthcare',preference:p||'project',theme:t}}));return t}
function set(p){if(!['light','dark','system'].includes(p))return;try{localStorage.setItem(KEY,p)}catch(_){}apply(p,true)}
function install(){apply(pref());const actions=document.querySelector('.actions');if(actions&&!document.getElementById('hvThemeSwitch')){const w=document.createElement('span');w.id='hvThemeSwitch';w.setAttribute('aria-label','Theme');w.innerHTML='<button type="button" data-theme="light" title="Light theme" aria-label="Light theme">L</button><button type="button" data-theme="dark" title="Dark theme" aria-label="Dark theme">D</button><button type="button" data-theme="system" title="System theme" aria-label="System theme">S</button>';w.addEventListener('click',e=>{const b=e.target.closest('[data-theme]');if(b)set(b.dataset.theme)});const lang=document.getElementById('hvLangWrap');actions.insertBefore(w,lang||actions.firstChild);render()}matchMedia('(prefers-color-scheme:dark)').addEventListener?.('change',()=>{if(pref()==='system')apply('system',true)})}
window.HAVEN_THEME={getPreference:pref,getEffective:effective,set,apply};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
