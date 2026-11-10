const META_PIXEL_ID = "4662163010727947";
const META_PIXEL_IDS = [META_PIXEL_ID, "1668583751442846", "1776658760237143"];

(function initMetaPixel(){
  if(window.selenaPixelInitialized) return;
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
    t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  META_PIXEL_IDS.forEach(id=>fbq('init',id));
  META_PIXEL_IDS.forEach(id=>fbq('trackSingle',id,'PageView'));
  window.selenaPixelInitialized = true;
})();

document.querySelectorAll('.js-line').forEach(link=>{
  if(link.dataset.pixelBound) return;
  link.dataset.pixelBound = 'true';
  link.addEventListener('click',()=>{
    if(typeof window.fbq === 'function'){
      META_PIXEL_IDS.forEach(id=>window.fbq('trackSingle',id,'Contact'));
    }
  });
});

document.querySelectorAll('[data-copy]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const original = btn.textContent;
    try{
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = '已複製';
    }catch(e){
      window.prompt('請複製地址', btn.dataset.copy);
    }
    setTimeout(()=>btn.textContent = original, 1500);
  });
});

const posterGroups = [
  {
    title:'肌膚精選',
    slides:[
      {src:'assets/nov-skin-01.webp', title:'喬雅露 JUVELOOK'},
      {src:'assets/nov-skin-03.webp', title:'Meister of JUVELOOK'},
      {src:'assets/nov-skin-02.webp', title:'11 月肌膚精選'}
    ]
  },
  {
    title:'拉提精選',
    slides:[
      {src:'assets/nov-lifting-01.webp', title:'海芙電波 VOLNEWMER'},
      {src:'assets/nov-lifting-03.webp', title:'音波？電波？怎麼選？'},
      {src:'assets/nov-lifting-02.webp', title:'11 月拉提精選'}
    ]
  },
  {
    title:'秋季肌膚管理',
    slides:[
      {src:'assets/nov-autumn-01.jpg', title:'秋季肌膚管理計劃'},
      {src:'assets/nov-autumn-02.jpg', title:'秋季熱門組合'},
      {src:'assets/nov-autumn-03.jpg', title:'來院資訊與預約方式'}
    ]
  },
  {
    title:'秋季皮膚改善計劃',
    slides:[
      {src:'assets/nov-care-01.jpg', title:'11 月秋季皮膚改善計劃'},
      {src:'assets/nov-care-02.jpg', title:'全臉黃金微針・喬雅露'},
      {src:'assets/nov-care-03.jpg', title:'組合方案與麗珠蘭'}
    ]
  }
];

const posterDialog = document.querySelector('#posterDialog');
const posterImage = document.querySelector('#posterDialogImage');
const posterTitle = document.querySelector('#posterDialogTitle');
const posterCounter = document.querySelector('#posterDialogCounter');
let posterGroupIndex = 0;
let posterSlideIndex = 0;

function showPoster(groupIndex, slideIndex){
  const group = posterGroups[groupIndex];
  if(!group) return;
  const total = group.slides.length;
  posterGroupIndex = groupIndex;
  posterSlideIndex = (slideIndex + total) % total;
  const item = group.slides[posterSlideIndex];
  posterImage.src = item.src;
  posterImage.alt = item.title;
  posterTitle.textContent = item.title;
  posterCounter.textContent = `${posterSlideIndex + 1} / ${total}`;
}

document.querySelectorAll('[data-poster-group]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const groupIndex = Number(btn.dataset.posterGroup || 0);
    showPoster(groupIndex, 0);
    if(!posterDialog.open) posterDialog.showModal();
  });
});

document.querySelector('[data-poster-prev]')?.addEventListener('click',()=>showPoster(posterGroupIndex, posterSlideIndex - 1));
document.querySelector('[data-poster-next]')?.addEventListener('click',()=>showPoster(posterGroupIndex, posterSlideIndex + 1));
document.querySelector('[data-close-dialog]')?.addEventListener('click',()=>posterDialog.close());
posterDialog?.addEventListener('click',e=>{ if(e.target === posterDialog) posterDialog.close(); });

const reviewCards = [...document.querySelectorAll('.review-card')];
const reviewDialog = document.querySelector('#reviewDialog');
const reviewDialogVideo = document.querySelector('#reviewDialogVideo');
const reviewDialogTitle = document.querySelector('#reviewDialogTitle');
const reviewDialogCounter = document.querySelector('#reviewDialogCounter');
const reviewFallback = document.querySelector('#reviewFallback');
const reviewFallbackImage = document.querySelector('#reviewFallbackImage');
let reviewIndex = 0;
const reviewStates = new Map();

function checkVideoExists(path){
  if(reviewStates.has(path)) return Promise.resolve(reviewStates.get(path));
  return fetch(path, {method:'HEAD', cache:'no-store'})
    .then(res => {
      const ok = !!res.ok;
      reviewStates.set(path, ok);
      return ok;
    })
    .catch(()=>{
      reviewStates.set(path, false);
      return false;
    });
}

async function openReview(index){
  if(!reviewCards.length) return;
  reviewIndex = (index + reviewCards.length) % reviewCards.length;
  const card = reviewCards[reviewIndex];
  const title = card.dataset.title || `REVIEW ${reviewIndex+1}`;
  const desc = card.dataset.desc || '';
  const video = card.dataset.video || '';
  const thumb = card.dataset.thumb || '';

  reviewDialogTitle.textContent = `${title} · ${desc}`;
  reviewDialogCounter.textContent = `${reviewIndex + 1} / ${reviewCards.length}`;

  reviewDialogVideo.pause();
  reviewDialogVideo.classList.remove('is-visible');
  reviewFallback.classList.remove('is-visible');
  reviewDialogVideo.removeAttribute('src');

  const hasVideo = video ? await checkVideoExists(video) : false;
  if(hasVideo){
    reviewDialogVideo.poster = thumb;
    reviewDialogVideo.src = video;
    reviewDialogVideo.classList.add('is-visible');
  }else{
    reviewFallbackImage.src = thumb;
    reviewFallbackImage.alt = title;
    reviewFallback.classList.add('is-visible');
  }

  if(!reviewDialog.open) reviewDialog.showModal();
  if(hasVideo){
    reviewDialogVideo.play().catch(()=>{});
  }
}

reviewCards.forEach((card, index)=>{
  card.addEventListener('click',()=>openReview(index));
});

document.querySelector('[data-review-prev]')?.addEventListener('click',()=>openReview(reviewIndex - 1));
document.querySelector('[data-review-next]')?.addEventListener('click',()=>openReview(reviewIndex + 1));
document.querySelector('[data-close-review]')?.addEventListener('click',()=>{
  reviewDialogVideo.pause();
  reviewDialog.close();
});
reviewDialog?.addEventListener('close',()=>{
  reviewDialogVideo.pause();
  reviewDialogVideo.removeAttribute('src');
  reviewDialogVideo.load();
});
reviewDialog?.addEventListener('click',e=>{ if(e.target === reviewDialog) reviewDialog.close(); });

document.addEventListener('keydown',e=>{
  if(posterDialog?.open){
    if(e.key === 'ArrowLeft') showPoster(posterGroupIndex, posterSlideIndex - 1);
    if(e.key === 'ArrowRight') showPoster(posterGroupIndex, posterSlideIndex + 1);
  }else if(reviewDialog?.open){
    if(e.key === 'ArrowLeft') openReview(reviewIndex - 1);
    if(e.key === 'ArrowRight') openReview(reviewIndex + 1);
  }
});

function addSwipe(el, onLeft, onRight){
  if(!el) return;
  let x = null;
  el.addEventListener('touchstart',e=>{ x = e.touches[0].clientX; }, {passive:true});
  el.addEventListener('touchend',e=>{
    if(x === null) return;
    const dx = e.changedTouches[0].clientX - x;
    if(Math.abs(dx) > 45){ dx < 0 ? onLeft() : onRight(); }
    x = null;
  }, {passive:true});
}

addSwipe(posterDialog, ()=>showPoster(posterGroupIndex, posterSlideIndex + 1), ()=>showPoster(posterGroupIndex, posterSlideIndex - 1));
addSwipe(reviewDialog, ()=>openReview(reviewIndex + 1), ()=>openReview(reviewIndex - 1));

// Editorial navigation and reveal deep-linked prices without changing inquiry routing.
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
menuToggle?.addEventListener('click',()=>{
  const open=menuToggle.getAttribute('aria-expanded')!=='true';
  menuToggle.setAttribute('aria-expanded',String(open)); mainNav.classList.toggle('is-open',open);
});
mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  mainNav.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded','false');
}));

const searchInput = document.querySelector('#priceSearch');
const priceCategories = [...document.querySelectorAll('.price-category')];
let previousOpen = null;
function filterPrices(){
 const query=searchInput.value.trim().toLocaleLowerCase();
 if(query && previousOpen===null) previousOpen=priceCategories.map(el=>el.open);
 let count=0;
 priceCategories.forEach((category,index)=>{
  let matches=0;
  category.querySelectorAll('.treatment-price').forEach(item=>{
   const match=!query || item.dataset.search.toLocaleLowerCase().includes(query);
   item.hidden=!match; if(match) matches++;
  });
  category.querySelectorAll('.price-subgroup').forEach(group=>{
   group.hidden=![...group.querySelectorAll('.treatment-price')].some(item=>!item.hidden);
  });
  category.hidden=matches===0;
  if(query) category.open=matches>0;
  else if(previousOpen) category.open=previousOpen[index];
  count+=matches;
 });
 if(!query) previousOpen=null;
 document.querySelector('#priceNoResults').hidden=count!==0;
 document.querySelector('#priceSearchStatus').textContent=query ? `${count} 項療程` : '';
}
searchInput.addEventListener('input',filterPrices);
function revealPriceHash(){
 const id=location.hash.slice(1);
 if(!['prices','rejuran-prices','potenza-prices','season-prices'].includes(id)) return;
 if(id!=='prices'){
  searchInput.value=''; filterPrices();
  const target=document.getElementById(id);
  const category=target?.closest('.price-category'); if(category) category.open=true;
 }
 requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}));
}
window.addEventListener('hashchange',revealPriceHash); revealPriceHash();
// Preserve each uploaded video's native ratio in the player.
reviewDialogVideo.addEventListener('loadedmetadata',()=>{
 reviewDialogVideo.style.aspectRatio=`${reviewDialogVideo.videoWidth} / ${reviewDialogVideo.videoHeight}`;
});

// 11월 포스터: 자동으로 천천히 흐르고, 누르거나 만지는 동안에는 멈춘다.
(function(){
 const rail=document.querySelector('.treatments .poster-rail');
 if(!rail || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const originals=[...rail.querySelectorAll('.poster-card')];
 originals.forEach(card=>{
  const copy=card.cloneNode(true);
  copy.classList.add('is-copy');
  copy.setAttribute('aria-hidden','true');
  copy.tabIndex=-1;
  copy.addEventListener('click',()=>card.click());
  rail.append(copy);
 });
 const firstCopy=rail.querySelector('.is-copy');
 let pos=0, resumeAt=0, last=0;
 const hold=ms=>{resumeAt=performance.now()+ms};
 ['pointerenter','pointerdown','touchstart','focusin','wheel'].forEach(type=>rail.addEventListener(type,()=>hold(2500),{passive:true}));
 rail.addEventListener('scroll',()=>{ if(performance.now()<resumeAt) pos=rail.scrollLeft; },{passive:true});
 function tick(now){
  const dt=Math.min(now-last,50); last=now;
  const loop=firstCopy.offsetLeft-originals[0].offsetLeft;
  if(now>=resumeAt && !rail.matches(':hover') && !posterDialog?.open && loop>0){
   pos+=dt*.03;
   if(pos>=loop) pos-=loop;
   rail.scrollLeft=pos;
  }
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
})();

// 전체 가격표: 처음에는 접혀 있고, 가격표로 가는 링크를 누르면 펼친다.
(function(){
 const all=document.querySelector('#priceAll');
 if(!all) return;
 const open=()=>{ if(['#prices','#rejuran-prices','#potenza-prices'].includes(location.hash)) all.open=true; };
 window.addEventListener('hashchange',open);
 open();
 document.querySelectorAll('a[href="#prices"]').forEach(link=>link.addEventListener('click',()=>{all.open=true;}));
})();
