(() => {
 const popup=document.querySelector('#welcomePopup');
 if(!popup)return;
 const image=popup.querySelector('#welcomeImage'),count=popup.querySelector('#welcomeCount');
 const photo=popup.querySelector('.welcome-photo'),hide=popup.querySelector('#welcomeHideToday');
 const key='selena.welcome.hidden-day.v1';
 // Taiwan customer day; expiry follows the calendar rather than 24 hours.
 const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 let index=0,start=null,suppressClick=false,returnTo=null;
 const base=new URL(image.src);
 function show(next){
  index=(next+5)%5;
  image.src=new URL(`welcome-${String(index+1).padStart(2,'0')}.png`,base).href;
  image.alt=`SELENA 診所介紹 ${index+1} / 5`;
  count.textContent=`${index+1} / 5`;
 }
 function remember(){try{if(hide.checked)localStorage.setItem(key,day());}catch{}}
 popup.querySelectorAll('[data-welcome-close]').forEach(button=>button.addEventListener('click',()=>popup.close()));
 popup.querySelector('[data-welcome-prev]').addEventListener('click',()=>show(index-1));
 popup.querySelector('[data-welcome-next]').addEventListener('click',()=>show(index+1));
 popup.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));}
 });
 popup.addEventListener('click',event=>{
  if(event.target!==popup)return;
  const r=popup.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)popup.close();
 });
 popup.addEventListener('close',()=>{remember();if(returnTo?.isConnected)returnTo.focus({preventScroll:true});});
 hide.addEventListener('change',()=>{try{if(hide.checked)remember();else localStorage.removeItem(key);}catch{}});
 photo.addEventListener('dragstart',event=>event.preventDefault());
 photo.addEventListener('pointerdown',event=>{suppressClick=false;start={x:event.clientX,y:event.clientY};});
 photo.addEventListener('pointerup',event=>{
  if(!start)return;
  const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){suppressClick=true;show(index+(dx<0?1:-1));}
 });
 photo.addEventListener('pointercancel',()=>{start=null;});
 // Capture prevents both navigation and the existing Contact tracker on a swipe.
 photo.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false;}},true);
 let hidden=false;try{hidden=localStorage.getItem(key)===day();}catch{}
 if(!hidden){returnTo=document.activeElement;popup.showModal();popup.querySelector('[data-welcome-close]').focus();}
})();
