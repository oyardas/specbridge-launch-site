(function(){
  const style=document.createElement('style');
  style.id='kayas-professional-typography-v10';
  style.textContent=`
    .hero{padding:56px 0 34px}
    .hero h1{max-width:900px;font-size:clamp(36px,4.25vw,60px);line-height:1.04;letter-spacing:-2.1px;margin:16px 0}
    .hero .lead{max-width:860px;font-size:17px;line-height:1.62}
    .hero-actions{margin-top:23px}
    .nav a{font-size:12.5px;padding:8px 9px}
    .topbar{min-height:68px}
    .section-head h2{font-size:clamp(25px,2.25vw,31px);letter-spacing:-.7px}
    .section-head p{font-size:14px}
    .kpi strong{font-size:23px}
    .kpi span{font-size:11.5px}
    .hero-card{padding:21px}
    .hero-card h3{font-size:17px}
    .status-row{padding:11px 0}
    .status-row span{font-size:12px}
    .btn{font-size:13px}
    @media(max-width:900px){.hero{padding:44px 0 28px}.hero h1{font-size:clamp(34px,8vw,52px)}.hero .lead{font-size:16px}}
    @media(max-width:560px){.hero h1{font-size:36px;letter-spacing:-1.4px}.hero .lead{font-size:15px}.section-head h2{font-size:24px}}
  `;
  document.head.appendChild(style);
})();
window.KAYAS_SEC={salt:"QBcPWbKjRcu+R8jEjX+1Ig==",iv:"jO8Kz1+SdoldAclO",iterations:310000,gzip:true,parts:[]};
