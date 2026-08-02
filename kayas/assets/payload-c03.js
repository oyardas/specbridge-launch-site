
(function(){
  var l=document.createElement("link");l.rel="stylesheet";l.href="assets/kayas-documents.css?v=20260803-10";document.head.appendChild(l);
  window.openExistingWalkthrough=function(){window.location.href="walkthrough/";};
  window.openPortalFrame=function(src,title){document.body.style.overflow="hidden";var c=document.getElementById("modalCard"),m=document.getElementById("modal");c.className="modal-card frame-modal";c.innerHTML='<div class="modal-head"><div><span class="pill plan">Güvenli Portal İçeriği</span><h3>'+title+'</h3></div><div style="display:flex;gap:8px"><a class="btn small" href="'+src+'" target="_blank" rel="noopener">Yeni Sekme</a><button class="close-btn" onclick="closePortalFrame()">Kapat</button></div></div><div class="frame-body"><iframe src="'+src+'" title="'+title+'" allow="fullscreen; autoplay" loading="eager"></iframe></div>';m.classList.remove("hidden");};
  window.closePortalFrame=function(){document.body.style.overflow="";if(typeof closeModal==="function")closeModal();};
})();
