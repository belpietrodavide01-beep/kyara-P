(function(){
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var force=/[?&]intro/.test(location.search);
var seen=false; try{seen=!force&&localStorage.getItem('kc-intro-seen')==='1';}catch(e){}
if(!seen&&!reduce&&window.Element&&Element.prototype.animate){
  try{localStorage.setItem('kc-intro-seen','1');}catch(e){}
  var d=document.documentElement;d.classList.add('intro');
  var mount=function(){
    var line=document.querySelector('.index'),spine=document.querySelector('.spine .name');
    if(!line||!spine){d.classList.remove('intro');return;}
    var v=document.createElement('div');v.className='kc-intro';
    v.innerHTML='<b>K</b><b>C</b>';
    document.body.appendChild(v);document.body.classList.add('intro-lock');
    var K=v.children[0],C=v.children[1];
    var lr=line.getBoundingClientRect(),sr=spine.getBoundingClientRect();
    var floor=lr.top,cx=lr.left+lr.width/2;
    var kw=K.offsetWidth,ch=K.offsetHeight;
    var kx=cx-kw-1,cx2=cx+1,rest=floor-ch;
    var tx=sr.left+sr.width/2-kw/2,ty=sr.top+sr.height/2-ch/2;
    function drop(el,x,delay){
      var f=[
        {transform:'translate('+x+'px,'+(-ch-40)+'px)',offset:0,easing:'cubic-bezier(.4,0,1,1)'},
        {transform:'translate('+x+'px,'+rest+'px)',offset:.34,easing:'cubic-bezier(0,0,.3,1)'},
        {transform:'translate('+x+'px,'+(rest-52)+'px)',offset:.52,easing:'cubic-bezier(.5,0,1,1)'},
        {transform:'translate('+x+'px,'+rest+'px)',offset:.66,easing:'cubic-bezier(0,0,.3,1)'},
        {transform:'translate('+x+'px,'+(rest-19)+'px)',offset:.77,easing:'cubic-bezier(.5,0,1,1)'},
        {transform:'translate('+x+'px,'+rest+'px)',offset:.86,easing:'cubic-bezier(0,0,.3,1)'},
        {transform:'translate('+x+'px,'+(rest-6)+'px)',offset:.93,easing:'cubic-bezier(.5,0,1,1)'},
        {transform:'translate('+x+'px,'+rest+'px)',offset:1}
      ];
      return el.animate(f,{duration:1900,delay:delay,fill:'both'});
    }
    drop(K,kx,0);var last=drop(C,cx2,150);
    last.finished.then(function(){
      var opt={duration:950,easing:'cubic-bezier(.7,0,.2,1)',fill:'both'};
      K.animate([{transform:'translate('+kx+'px,'+rest+'px) rotate(0deg)'},{transform:'translate('+tx+'px,'+ty+'px) rotate(90deg)'}],opt);
      var a=C.animate([{transform:'translate('+cx2+'px,'+rest+'px) rotate(0deg)'},{transform:'translate('+tx+'px,'+(ty+kw*1.1)+'px) rotate(90deg)'}],opt);
      v.animate([{opacity:1,offset:.72},{opacity:0,offset:1}],{duration:950,fill:'both'});
      a.finished.then(function(){
        v.remove();document.body.classList.remove('intro-lock');d.classList.remove('intro');
      });
    });
  };
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);
}
var scrollY=0,current=null;
function reveal(scope,root){
  var els=scope.querySelectorAll('h1,h2,h3,p,.index a,.meta dl,.tl>div,.shot,figure.plate,form label,form button,.contacts .row');
  if(!('IntersectionObserver' in window)) return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{root:root||null,rootMargin:'0px 0px -6% 0px',threshold:.05});
  Array.prototype.forEach.call(els,function(el){el.classList.add('rv');io.observe(el);});
}
function open(id){
  var ov=document.getElementById(id); if(!ov) return;
  current=ov; scrollY=window.pageYOffset;
  ov.classList.add('is-open');
  document.body.style.overflow='hidden';
  ov.scrollTop=0;
  var b=ov.querySelector('.close'); if(b) b.focus({preventScroll:true});
  if(!ov.dataset.rvDone){ ov.dataset.rvDone='1'; reveal(ov,ov); }
}
function close(){
  if(!current) return;
  current.classList.remove('is-open'); current=null;
  document.body.style.overflow='';
  window.scrollTo(0,scrollY);
}
document.addEventListener('click',function(e){
  if(e.target.closest('.ov .close')){ e.preventDefault(); close(); return; }
  var t=e.target.closest('[data-open]');
  if(t){ e.preventDefault(); open(t.getAttribute('data-open')); }
});
document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
var f=document.getElementById('contact');
if(f) f.addEventListener('submit',function(e){
  e.preventDefault();
  var d=new FormData(f), g=function(k){return (d.get(k)||'').toString().trim();};
  var body='Nome: '+g('nome')+'\nAzienda: '+g('azienda')+'\nContatto: '+g('contatto')+'\n\n'+g('messaggio');
  window.location.href='mailto:kyara.cortes.kc@gmail.com?subject='+encodeURIComponent('Portfolio — '+(g('nome')||'contatto'))+'&body='+encodeURIComponent(body);
});
reveal(document.querySelector('.page'),null);
})();
