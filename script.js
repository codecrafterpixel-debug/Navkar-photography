const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);

/* Preloader — fast, upward slide */
const pre=$("#preloader");
if(pre){
  let p=0,bar=pre.querySelector(".loadbar span");
  const finish=()=>{if(bar)bar.style.width="100%";setTimeout(()=>pre.classList.add("done"),220)};
  const t=setInterval(()=>{p+=14+Math.random()*18;if(p>=100){clearInterval(t);finish()}else if(bar)bar.style.width=p+"%"},55);
  window.addEventListener("load",()=>{clearInterval(t);finish()},{once:true});
}

const header=$("#header");
addEventListener("scroll",()=>header?.classList.toggle("scrolled",scrollY>30),{passive:true});
const ham=$("#hamb"),mn=$("#mobileNav");
ham?.addEventListener("click",()=>{mn.classList.toggle("open");document.body.classList.toggle("menu-open",mn.classList.contains("open"))});
$$(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>{mn?.classList.remove("open");document.body.classList.remove("menu-open")}));

/* Smooth custom cursor */
let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,cur=$("#cursor"),dot=$("#dot");
addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;if(dot){dot.style.left=mx+"px";dot.style.top=my+"px"}});
(function loop(){if(cur){cx+=(mx-cx)*.22;cy+=(my-cy)*.22;cur.style.left=cx+"px";cur.style.top=cy+"px"}requestAnimationFrame(loop)})();
/* Cursor stays visible everywhere — no hover-only activation. */

/* Hero fade slider */
const hs=$$(".hero-slide");
if(hs.length){
  let i=0,hb=$("#heroBar"),hc=$("#heroCount");
  function go(n){hs.forEach(x=>x.classList.remove("active"));hs[n].classList.add("active");if(hc)hc.textContent=`0${n+1} / ${String(hs.length).padStart(2,"0")}`;if(hb){hb.style.transition="none";hb.style.width="0";requestAnimationFrame(()=>{hb.style.transition="width 6s linear";hb.style.width="100%"})}i=n}
  go(0);setInterval(()=>go((i+1)%hs.length),6000);
}

/* Feature slider */
const fs=$$(".feature-slide");
if(fs.length){
  let i=0,fc=$("#fc");
  function fg(n){fs.forEach(x=>x.classList.remove("active"));fs[n].classList.add("active");if(fc)fc.textContent=`0${n+1} / 0${fs.length}`;i=n}
  $("#fn")?.addEventListener("click",()=>fg((i+1)%fs.length));$("#fp")?.addEventListener("click",()=>fg((i+fs.length-1)%fs.length));setInterval(()=>fg((i+1)%fs.length),7500);
}

$("#form")?.addEventListener("submit",e=>{e.preventDefault();$("#msg").textContent="Thank you — we will contact you shortly.";e.target.reset()});

/* Scroll progress */
const progress=$("#scrollProgress");
function updateProgress(){if(!progress)return;const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,(scrollY/max)*100):0)+"%"}
addEventListener("scroll",updateProgress,{passive:true});addEventListener("resize",updateProgress);updateProgress();

/* Smooth cross-page transition — no long blocking animation */
const transition=$("#pageTransition");
if(transition){
  requestAnimationFrame(()=>transition.classList.add("is-enter"));
  setTimeout(()=>transition.classList.remove("is-enter"),650);
  $$(".page-link").forEach(a=>a.addEventListener("click",e=>{
    const href=a.getAttribute("href");
    if(!href||href.startsWith("#")||a.target==="_blank"||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const url=new URL(href,location.href);if(url.origin!==location.origin)return;
    e.preventDefault();
    transition.classList.remove("is-enter");
    transition.classList.remove("is-leave");
    void transition.offsetWidth;
    transition.classList.add("is-leave");
    setTimeout(()=>{location.href=url.href},470);
  }));
}

/* Lightbox */
const lb=$("#lightbox");
if(lb){
  const triggers=[...$$(".lightbox-trigger")],image=$("#lightboxImage"),meta=$("#lightboxMeta");let li=0;
  function openLightbox(index){li=(index+triggers.length)%triggers.length;const t=triggers[li];image.src=t.currentSrc||t.src;image.alt=t.alt||"";meta.textContent=`${String(li+1).padStart(2,"0")} / ${String(triggers.length).padStart(2,"0")} · ${t.dataset.lightbox||"Gallery"}`;lb.classList.add("open");lb.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
  function closeLightbox(){lb.classList.remove("open");lb.setAttribute("aria-hidden","true");document.body.style.overflow=""}
  triggers.forEach((t,n)=>t.addEventListener("click",()=>openLightbox(n)));
  $("#lightboxClose")?.addEventListener("click",closeLightbox);$("#lightboxPrev")?.addEventListener("click",()=>openLightbox(li-1));$("#lightboxNext")?.addEventListener("click",()=>openLightbox(li+1));
  lb.addEventListener("click",e=>{if(e.target===lb)closeLightbox()});
  addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft")openLightbox(li-1);if(e.key==="ArrowRight")openLightbox(li+1)});
}
