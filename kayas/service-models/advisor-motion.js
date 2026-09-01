(()=>{
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root=document.documentElement;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

  function animateCounter(el){
    if(!el||el.dataset.counted==='1')return;
    const target=Number((el.textContent||'').replace(/[^0-9.]/g,''));
    if(!Number.isFinite(target))return;
    el.dataset.counted='1';
    if(reduce){el.textContent=String(target);return;}
    const start=performance.now(),duration=850;
    const step=(now)=>{
      const p=clamp((now-start)/duration,0,1);
      const eased=1-Math.pow(1-p,3);
      el.textContent=String(Math.round(target*eased));
      if(p<1)requestAnimationFrame(step);else el.textContent=String(target);
    };
    requestAnimationFrame(step);
  }

  function setupReveal(){
    const selectors=[
      '.hero > div', '.hero-card',
      '.section > .section-head',
      '.section .visual-card',
      '.section .note-card',
      '.section .video-card',
      '.section .matrix-wrap',
      '.section .arch',
      '.section .family',
      '.section .detail-card',
      '.section .phasecard',
      '.section .kpi',
      '.section .metric',
      '.section .ref',
      '#advisor-40-80-80 .advisor-hero'
    ];
    const targets=[...document.querySelectorAll(selectors.join(','))];
    targets.forEach((el,i)=>{
      el.classList.add('motion-reveal');
      el.style.setProperty('--reveal-delay',`${(i%6)*55}ms`);
    });

    if(reduce||!('IntersectionObserver' in window)){
      targets.forEach(el=>el.classList.add('is-visible'));
      document.querySelectorAll('.ratio-block b').forEach(animateCounter);
      document.getElementById('advisor-40-80-80')?.classList.add('motion-active');
      return;
    }

    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        const el=entry.target;
        el.classList.add('is-visible');
        if(el.classList.contains('advisor-hero'))el.querySelectorAll('.ratio-block b').forEach(animateCounter);
        io.unobserve(el);
      });
    },{threshold:.1,rootMargin:'0px 0px -7% 0px'});
    targets.forEach(el=>io.observe(el));

    const advisor=document.getElementById('advisor-40-80-80');
    if(advisor){
      const advisorIo=new IntersectionObserver(([entry])=>advisor.classList.toggle('motion-active',entry.isIntersecting),{threshold:.08,rootMargin:'-10% 0px -20% 0px'});
      advisorIo.observe(advisor);
    }
  }

  function setupSubnav(){
    const links=[...document.querySelectorAll('.subnav a[href^="#"]')];
    const pairs=links.map(a=>[a,document.querySelector(a.getAttribute('href'))]).filter(([,el])=>el);
    if(!pairs.length||!('IntersectionObserver' in window))return;
    const io=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+visible.target.id));
    },{threshold:[.15,.3,.5],rootMargin:'-18% 0px -60% 0px'});
    pairs.forEach(([,el])=>io.observe(el));
  }

  function setupAnchorMotion(){
    document.addEventListener('click',e=>{
      const a=e.target.closest('a[href^="#"]');
      if(!a)return;
      const id=a.getAttribute('href');
      if(!id||id==='#')return;
      const target=document.querySelector(id);
      if(!target)return;
      e.preventDefault();
      target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
      history.replaceState(null,'',id);
    });
  }

  function init(){
    root.classList.add('motion-ready');
    setupReveal();
    setupSubnav();
    setupAnchorMotion();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();