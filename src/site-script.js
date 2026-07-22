
(function(){
  var root=document.documentElement, hdr=document.getElementById('hdr');
  document.getElementById('tgl').addEventListener('click',function(){
    var cur=root.getAttribute('data-theme');
    if(!cur){ cur = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark':'light'; }
    root.setAttribute('data-theme', cur==='dark'?'light':'dark');
  });
  addEventListener('scroll',function(){ hdr.classList.toggle('scrolled', scrollY>20); },{passive:true});

  // Full-screen menu
  var fsmenu=document.getElementById('fsmenu'), menuBtn=document.getElementById('menuBtn');
  function openMenu(){ fsmenu.classList.add('open'); document.body.classList.add('menu-open'); menuBtn.setAttribute('aria-expanded','true'); fsmenu.setAttribute('aria-hidden','false'); }
  function closeMenu(){ fsmenu.classList.remove('open'); document.body.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded','false'); fsmenu.setAttribute('aria-hidden','true'); }
  menuBtn.addEventListener('click',function(){ fsmenu.classList.contains('open')?closeMenu():openMenu(); });
  document.getElementById('fsClose').addEventListener('click',closeMenu);
  fsmenu.querySelectorAll('[data-fs]').forEach(function(a){ a.addEventListener('click',closeMenu); });
  addEventListener('keydown',function(e){ if(e.key==='Escape') closeMenu(); });

  // Floating contact button — entrance after LCP
  setTimeout(function(){ var f=document.getElementById('fab'); if(f) f.classList.add('in'); }, 700);

  // Reveals
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  // Compteurs animés (9 ans / 5 ans)
  var cObs=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cObs.unobserve(e.target); } }); },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cObs.observe(el); });
  function countUp(el){ if(reduce){ el.textContent=el.getAttribute('data-count'); return; }
    var t=+el.getAttribute('data-count'), d=1100, s=null;
    requestAnimationFrame(function step(ts){ if(!s) s=ts; var p=Math.min((ts-s)/d,1);
      el.textContent=Math.round(p*t); if(p<1) requestAnimationFrame(step); });
  }

  // Parallaxe souris sur le héros (desktop uniquement)
  var heroMedia=document.querySelector('.hero-media'), heroSec=document.querySelector('.hero');
  if(heroMedia && heroSec && matchMedia('(pointer:fine)').matches && !reduce){
    heroSec.addEventListener('mousemove',function(e){ var r=heroSec.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      heroMedia.style.transform='translate('+(x*16)+'px,'+(y*16)+'px)'; });
    heroSec.addEventListener('mouseleave',function(){ heroMedia.style.transform=''; });
  }

  // Parallaxe scroll de la bannière immersive
  var plxBg=document.querySelector('.immersive__bg img'), imm=document.querySelector('.immersive');
  if(plxBg && imm && !reduce){
    var tick=false;
    function plx(){ if(tick) return; tick=true; requestAnimationFrame(function(){
      var r=imm.getBoundingClientRect(), vh=innerHeight;
      if(r.bottom>0 && r.top<vh){ var prog=(r.top+r.height/2 - vh/2)/vh; plxBg.style.transform='translateY('+(prog*-46)+'px)'; }
      tick=false; }); }
    addEventListener('scroll', plx, {passive:true}); plx();
  }

  // Gallery filter
  var items=document.querySelectorAll('.gitem');
  document.querySelectorAll('.filt').forEach(function(b){
    b.addEventListener('click',function(){
      document.querySelectorAll('.filt').forEach(function(x){x.classList.remove('on')}); b.classList.add('on');
      var f=b.getAttribute('data-f');
      items.forEach(function(it){ it.classList.toggle('hide', f!=='all' && it.getAttribute('data-cat')!==f); });
    });
  });
  // Lightbox
  var lb=document.getElementById('lb'), lbimg=document.getElementById('lbimg');
  items.forEach(function(it){ it.addEventListener('click',function(){ var im=it.querySelector('img'); lbimg.src=im.src; lbimg.alt=im.alt; lb.classList.add('on'); }); });
  lb.addEventListener('click',function(){ lb.classList.remove('on'); lbimg.src=''; });
  addEventListener('keydown',function(e){ if(e.key==='Escape') lb.classList.remove('on'); });

  // Contact — parcours projet interactif
  // ⚠️ Rémi : remplace ces 3 valeurs par les vraies coordonnées de Constance
  var CONTACT = { email:'contact@constance-mep.fr', wa:'33600000000', ig:'https://www.instagram.com/creartist.even/' };
  var pj=document.getElementById('pj');
  if(pj){
    var steps=pj.querySelectorAll('.pj__step'), fill=document.getElementById('pjfill'), cur=0;
    var state={projet:'',prestations:[],date:'',lieu:'',name:'',msg:''};
    function show(i){ cur=Math.max(0,Math.min(steps.length-1,i));
      steps.forEach(function(s,k){ s.classList.toggle('is-active',k===cur); });
      fill.style.width=Math.round((cur+1)/steps.length*100)+'%';
    }
    function collect(){
      var m=pj.querySelector('[data-multi]'); state.prestations=[];
      m.querySelectorAll('.chip.on').forEach(function(c){ state.prestations.push(c.getAttribute('data-v')); });
      state.date=(document.getElementById('pjdate').value||'').trim();
      state.lieu=(document.getElementById('pjlieu').value||'').trim();
      state.name=(document.getElementById('pjname').value||'').trim();
      state.msg=(document.getElementById('pjmsg').value||'').trim();
    }
    function msgText(){
      var p=['Bonjour Constance !','Je vous contacte pour '+(state.projet||'un projet')+'.'];
      if(state.prestations.length) p.push('Prestations souhaitées : '+state.prestations.join(', ')+'.');
      if(state.date) p.push('Date : '+state.date+'.');
      if(state.lieu) p.push('Lieu : '+state.lieu+'.');
      if(state.msg) p.push(state.msg);
      p.push('— '+(state.name||''));
      return p.join('\n');
    }
    function buildFinal(){
      collect();
      var r=document.getElementById('pjrecap'); r.innerHTML='';
      function row(k,v){ if(!v) return; var d=document.createElement('div'); d.className='row';
        var b=document.createElement('b'); b.textContent=k; var s=document.createElement('span'); s.textContent=v;
        d.appendChild(b); d.appendChild(s); r.appendChild(d); }
      row('Projet', state.projet.replace(/^une? /,''));
      row('Prestations', state.prestations.join(', '));
      row('Date', state.date); row('Lieu', state.lieu); row('Prénom', state.name);
      if(state.msg) row('Message', state.msg);
      var enc=encodeURIComponent(msgText()), sub=encodeURIComponent('Demande — mise en beauté événementielle');
      document.getElementById('sMail').href='mailto:'+CONTACT.email+'?subject='+sub+'&body='+enc;
      document.getElementById('sWa').href='https://wa.me/'+CONTACT.wa+'?text='+enc;
      document.getElementById('sIg').href=CONTACT.ig;
    }
    pj.querySelectorAll('[data-single] .chip').forEach(function(c){ c.addEventListener('click',function(){
      c.parentNode.querySelectorAll('.chip').forEach(function(x){x.classList.remove('on')}); c.classList.add('on');
      state.projet=c.getAttribute('data-v'); setTimeout(function(){ show(cur+1); },220);
    }); });
    pj.querySelectorAll('[data-multi] .chip').forEach(function(c){ c.addEventListener('click',function(){ c.classList.toggle('on'); }); });
    pj.querySelectorAll('[data-next]').forEach(function(b){ b.addEventListener('click',function(){
      collect(); if(cur===steps.length-2) buildFinal(); show(cur+1);
    }); });
    pj.querySelectorAll('[data-back]').forEach(function(b){ b.addEventListener('click',function(){ show(cur-1); }); });
    pj.querySelector('[data-restart]').addEventListener('click',function(){
      state={projet:'',prestations:[],date:'',lieu:'',name:'',msg:''};
      pj.querySelectorAll('.chip.on').forEach(function(c){ c.classList.remove('on'); });
      ['pjdate','pjlieu','pjname','pjmsg'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
      show(0);
    });
    show(0);
  }
})();


  // Nav active selon l'URL (multi-pages)
  (function(){ var path=location.pathname.replace(/\/index\.html$/,'/').replace(/(.)\/$/,'$1');
    document.querySelectorAll('a[data-nav]').forEach(function(a){
      var href=(a.getAttribute('href')||'').replace(/(.)\/$/,'$1');
      if(href===path || (path==='' && href==='/')) a.classList.add('current');
    }); })();
