const companyToggle = document.querySelector('.company-menu');
const companyMenu = document.querySelector('#company-mobile');
function closeCompanyMenu(){companyMenu.hidden=true;companyToggle.setAttribute('aria-expanded','false');}
companyToggle.addEventListener('click',()=>{const open=companyToggle.getAttribute('aria-expanded')==='true';companyMenu.hidden=open;companyToggle.setAttribute('aria-expanded',String(!open));});
companyMenu.addEventListener('click',e=>{if(e.target.closest('a,button'))closeCompanyMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!companyMenu.hidden){closeCompanyMenu();companyToggle.focus();}});
document.addEventListener('click',e=>{document.querySelectorAll('.language-picker[open]').forEach(picker=>{if(!picker.contains(e.target))picker.open=false;});});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.language-picker[open]').forEach(picker=>{picker.open=false;picker.querySelector('summary').focus();});}});
matchMedia('(min-width: 1051px)').addEventListener('change',closeCompanyMenu);
