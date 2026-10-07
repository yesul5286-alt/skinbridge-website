const META_PIXEL_ID = "";

(function(){
  if(!META_PIXEL_ID) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',META_PIXEL_ID); fbq('track','PageView');
})();

const p=new URLSearchParams(location.search);
const content=p.get('utm_content')||'selena-tw';
document.querySelectorAll('.js-line').forEach(a=>a.addEventListener('click',()=>{
  if(typeof fbq==='function') fbq('track','Contact',{content_name:content});
}));
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(b.dataset.copy);const old=b.textContent;b.textContent='已複製';setTimeout(()=>b.textContent=old,1500)}
  catch(e){window.prompt('請複製地址',b.dataset.copy)}
}));
