const META_PIXEL_ID = "";

(function initMetaPixel(){
  if(!META_PIXEL_ID) return;
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
    t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',META_PIXEL_ID);
  fbq('track','PageView');
})();

const params = new URLSearchParams(location.search);
const campaign = params.get('utm_campaign') || 'selena_tw';
const content = params.get('utm_content') || 'landing';

document.querySelectorAll('.js-line').forEach(link=>{
  link.addEventListener('click',()=>{
    if(typeof fbq === 'function'){
      fbq('track','Contact',{campaign,content_name:content});
    }
  });
});

document.querySelectorAll('[data-copy]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const original=btn.textContent;
    try{
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent='已複製';
    }catch(e){
      window.prompt('請複製地址',btn.dataset.copy);
    }
    setTimeout(()=>btn.textContent=original,1500);
  });
});
