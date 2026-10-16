const menuButton=document.querySelector('#menu-button');
const navigation=document.querySelector('#navigation');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('open');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});
navigation.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navigation.classList.contains('open')){closeMenu();menuButton.focus();}});
matchMedia('(min-width: 1051px)').addEventListener('change',closeMenu);
document.addEventListener('click',e=>{document.querySelectorAll('.language-picker[open]').forEach(picker=>{if(!picker.contains(e.target))picker.open=false;});});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.language-picker[open]').forEach(picker=>{picker.open=false;picker.querySelector('summary').focus();});}});
const partnerDetails=[...document.querySelectorAll('.partner-details>details')];
partnerDetails.forEach(detail=>{detail.hidden=true;});
document.querySelectorAll('[data-partner]').forEach(link=>link.addEventListener('click',()=>{partnerDetails.forEach(detail=>{const selected=detail.id===link.dataset.partner;detail.hidden=!selected;detail.open=selected;});}));
// Progressive enhancement: content stays visible if JS or observers are unavailable.
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}});},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
// User-confirmed business destinations. No message is sent by this page.
const config=window.SKINBRIDGE_PARTNERS||{};
const channelHosts={lineUrl:['line.me','lin.ee'],kakaoUrl:['open.kakao.com'],instagramUrl:['www.instagram.com','instagram.com']};
document.querySelectorAll('[data-channel]').forEach(link=>{
  try{const url=new URL(config[link.dataset.channel]);if(url.protocol==='https:'&&channelHosts[link.dataset.channel].includes(url.hostname))link.href=url.href;}catch{}
});
const dock=document.querySelector('.social-dock'), toggle=document.querySelector('#social-toggle');
function closeSocial(){dock.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';dock.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
dock.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeSocial));
document.addEventListener('click',event=>{if(!dock.contains(event.target))closeSocial();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dock.classList.contains('open')){closeSocial();toggle.focus();}});
matchMedia('(min-width: 1060px)').addEventListener('change',closeSocial);
