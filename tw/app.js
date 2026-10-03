'use strict';
// Real profiles retain source status; a/b/c are fictional UI samples.
const CLINICS = [...REAL_CLINICS,
  {id:'a',name:'範例院所 A',area:'江南',concerns:['保濕管理','毛孔'],price:100000,language:'預約中文協助（示例）',duration:'約 60 分鐘（示例）',inclusions:'基礎清潔與保濕管理一次；稅額包含（示例）',extra:'其他項目另行報價；需先確認（示例）',followup:'院所中文聯絡窗口，服務時間待確認',position:'left'},
  {id:'b',name:'範例院所 B',area:'弘大',concerns:['保濕管理','斑點'],price:120000,language:'現場口譯須預約（示例）',duration:'約 60 分鐘（示例）',inclusions:'基礎清潔與保濕管理一次；稅額包含（示例）',extra:'口譯費用是否另計需確認（示例）',followup:'院所聯絡窗口，語言與服務時間待確認',position:'center'},
  {id:'c',name:'範例院所 C',area:'新沙',concerns:['保濕管理','緊緻'],price:150000,language:'中文服務時段需確認（示例）',duration:'約 60 分鐘（示例）',inclusions:'基礎清潔與保濕管理一次；稅額包含（示例）',extra:'其他項目另行報價；需先確認（示例）',followup:'院所聯絡窗口，回覆時間待確認',position:'right'}
];
// Configure only an officially confirmed https://lin.ee/... or https://line.me/... account.
const LINE_URL = '';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const currency = n => '₩' + n.toLocaleString('en-US');
const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function readState(){try { const raw=JSON.parse(localStorage.getItem('skinbridge.tw.v1') || '{}');return raw && typeof raw==='object' ? raw : {}; } catch {return {};}}

const FLOW_OFFERINGS={selena:['clarity','texture','firmness','first'],'springday-sinchon':['first'],a:['hydration','texture','first'],b:['hydration','clarity','first'],c:['hydration','firmness','first']};
const FLOW_LABELS={hydration:'保濕管理',texture:'毛孔療程諮詢',clarity:'皮秒雷射諮詢',firmness:'緊緻療程諮詢',first:'初次肌膚諮詢'};
function selectedProcedureKey(){const route=new URLSearchParams(location.search).get('procedure');if(FLOW_LABELS[route])return route;const query=$('#search')?.value.trim().toLowerCase()||'';if(/皮秒|pico|피코/.test(query))return 'clarity';return ({'保濕管理':'hydration','毛孔':'texture','斑點':'clarity','緊緻':'firmness'})[$('#concern')?.value]||'first';}
function flowUrl(view,pid='first',clinic=''){const params=new URLSearchParams({view,procedure:pid});if(clinic)params.set('clinic',clinic);return '?'+params.toString();}
function flowPrice(c,pid){return !c.real&&pid==='hydration'?currency(c.price)+' · 示例':'諮詢後報價';}
function navigateFlow(view,pid,clinic=''){location.href=flowUrl(view,pid,clinic);}

const initial=readState();
const saved=new Set(Array.isArray(initial.saved)?initial.saved.filter(id=>CLINICS.some(c=>c.id===id)):[]);
const compared=new Set();
let returnFocus=null, toastTimer;
function persist(){try{localStorage.setItem('skinbridge.tw.v1',JSON.stringify({saved:[...saved],date:$('#visit-date').value,clinic:$('#plan-clinic').value,treatment:$('#plan-treatment').value}));}catch{toast('此瀏覽器無法儲存資料；本次仍可繼續使用。');}}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200);}
function clinicCard(c,pid=selectedProcedureKey()){if(!FLOW_OFFERINGS[c.id].includes(pid))pid='first';return `<article class="clinic-card"><div class="clinic-image"><a class="image-open" href="${flowUrl('clinic',pid,c.id)}" aria-label="查看${c.name}詳細資料">${c.real?realClinicMedia(c):`<img src="assets/clinic.webp" width="1536" height="1024" loading="lazy" style="object-position:${c.position}" alt="AI 生成的院所空間示意，非實際院所">`}</a><span class="image-label">${c.real?L('실제 병원 자료','實際院所資料'):'示意圖片'}</span><button class="heart" data-save="${c.id}" aria-pressed="${saved.has(c.id)}" aria-label="${saved.has(c.id)?'取消收藏':'收藏'}${c.name}">${saved.has(c.id)?'♥':'♡'}</button></div><div class="clinic-meta"><p class="clinic-region">SEOUL / ${c.area}</p><a class="clinic-name" href="${flowUrl('clinic',pid,c.id)}">${c.name}</a><p class="clinic-tags">${FLOW_LABELS[pid]}</p><p class="clinic-price">${flowPrice(c,pid)}</p><p class="small muted">${c.language}</p><div class="clinic-actions"><label class="compare-check"><input type="checkbox" data-compare="${c.id}" ${compared.has(c.id)?'checked':''}>加入比較</label><a class="text-button" href="${flowUrl('clinic',pid,c.id)}">查看詳情 ↗</a></div></div></article>`;}
function renderClinics(){ $('#budget-status').textContent=$('#budget').value?' · '+currency(Number($('#budget').value)):''; $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',$('#'+b.dataset.filter).value===b.dataset.value));const query=$('#search').value.trim().toLowerCase(),area=$('#area').value,concern=$('#concern').value,budget=Number($('#budget').value)||Infinity,pid=selectedProcedureKey();const list=CLINICS.filter(c=>(!query || [c.name,c.area,...c.concerns,...FLOW_OFFERINGS[c.id].map(key=>FLOW_LABELS[key]),...(['b','selena'].includes(c.id)?['pico','피코']:[])].join(' ').toLowerCase().includes(query))&&(!area||area===c.area)&&(!concern||c.concerns.includes(concern))&&(budget===Infinity||(!c.real&&pid==='hydration'&&c.price<=budget)));$('#clinic-grid').innerHTML=list.length?list.map(c=>clinicCard(c,pid)).join(''):'<div class="empty"><p>暫時沒有符合的院所。</p><button class="text-button" data-reset>清除條件，再看看</button></div>';$('#result-count').textContent=`找到 ${list.length} 間院所`;}

function renderSaved(){const list=CLINICS.filter(c=>saved.has(c.id));$('#saved-grid').innerHTML=list.length?list.map(c=>clinicCard(c,FLOW_OFFERINGS[c.id].includes(selectedProcedureKey())?selectedProcedureKey():'first')).join(''):'<div class="empty"><p>遇見喜歡的院所，按下 ♡ 收藏。</p><a href="#clinics">開始探索 ↗</a></div>';$$('.saved-count').forEach(el=>el.textContent=saved.size);$('#plan-clinics').innerHTML=list.length?`<div class="plan-chips">${list.map(c=>`<button class="plan-chip" data-choose="${c.id}">${c.name} · ${c.area} ↗</button>`).join('')}</div>`:'<p class="muted">可以先收藏，也可以直接在右側選擇示例院所。</p>';}
function updateComparison(){const count=compared.size;$('#compare-bar').hidden=!count;$('#compare-count').textContent=`已選 ${count} / 3 間`;$('#compare-open').disabled=count<2;$('#compare-open').textContent=count<2?'再選 1 間':'比較院所';$$('[data-compare]').forEach(el=>el.checked=compared.has(el.dataset.compare));}
function openDialog(content){returnFocus=document.activeElement;$('#dialog-content').innerHTML=content;if(!$('#dialog').open)$('#dialog').showModal();document.body.classList.add('modal-open');$('#dialog-close').focus();}
function closeDialog(){$('#dialog').close();}
$('#dialog').addEventListener('close',()=>{if(!$('#saved-dialog').open)document.body.classList.remove('modal-open');if(returnFocus?.isConnected)returnFocus.focus();});
$('#dialog-close').addEventListener('click',closeDialog);
$('#dialog').addEventListener('click',event=>{if(event.target===$('#dialog')){const r=$('#dialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
function detail(id){navigateFlow('clinic',selectedProcedureKey(),id);}
function compare(){const pid=selectedProcedureKey();const list=CLINICS.filter(c=>compared.has(c.id)&&FLOW_OFFERINGS[c.id].includes(pid));if(list.length<2){toast('請選擇提供相同項目的院所。');return;}const rows=[['地區',c=>c.area],['相同比較項目',()=> FLOW_LABELS[pid]],['費用',c=>flowPrice(c,pid)],['包含項目',c=>pid==='hydration'?c.inclusions:'尚待實際院所資料確認'],['可能額外費用',c=>c.extra],['中文服務',c=>c.language],['設備、產品、醫師',()=> '尚待實際院所資料確認'],['回台後聯繫',c=>c.followup],['取消與退款',()=> '尚待實際院所條款確認']];openDialog(`<h2 id="dialog-title">一起看，清楚比較</h2><p class="notice">實際院所資料與虛構示例分別標示；費用與服務條件請向院所確認。</p><div class="comparison-wrap" tabindex="0" role="region" aria-label="院所比較表，可左右捲動"><table class="comparison"><thead><tr><th scope="col">比較項目</th>${list.map(c=>`<th scope="col">${c.name}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,fn])=>`<tr><th scope="row">${label}</th>${list.map(c=>`<td>${fn(c)}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">下一步</th>${list.map(c=>`<td><button class="primary" data-choose="${c.id}">選擇 ${c.id.toUpperCase()}</button></td>`).join('')}</tr></tbody></table></div><p class="small muted">手機可左右滑動表格。正式預約需經院所確認。</p>`);}
const ARTICLES={first:{title:'第一次赴韓，怎麼開始？',body:'<ol><li>整理想了解的項目、預算與赴韓日期。</li><li>比較院所的醫師、項目條件、中文服務和完整費用。</li><li>與院所確認諮詢安排，由醫師評估療程適合性。</li><li>確認取消退款條件、行程限制與後續聯繫，再決定預約。</li></ol><p>不要僅依照網路照片或價格決定療程。這份指南是預約準備資訊，不是醫療建議。</p>'},price:{title:'比較價格前，先看這些。',body:'<ul><li>項目名稱相同，產品、設備、用量與施作範圍也相同嗎？</li><li>費用是否包含稅額、麻醉、診察及口譯？</li><li>需要幾次療程？有沒有後續就診費用？</li><li>實際結算幣別是什麼？匯率及支付費用如何計算？</li><li>把交通、住宿及可能的回診成本也納入預算。</li></ul><p>本體驗版以韓元顯示虛構示例，尚未提供實際報價。</p>'},return:{title:'回台之後，找誰協助？',body:'<ol><li>赴韓前確認院所的術後聯繫窗口與服務時間。</li><li>離院時取得院所提供的照護說明和必要就診資料。</li><li>回台後依院所指示聯繫；需要醫療處置時由合格醫療機構評估。</li></ol><p>如有緊急或嚴重不適，請立即尋求當地醫療協助，不要等待線上客服。</p><h3>台灣合作方案</h3><p>目前仍在規劃，沒有已啟用的診療承諾、管理券或折扣。現地診療與非醫療皮膚管理服務會分別列明費用和範圍。</p>'},privacy:{title:'隱私與資料使用',body:'<p>本體驗版只在目前瀏覽器儲存收藏、所選院所、項目及訪韓日期，未建立帳號，也不會把預約或醫療資料傳送到伺服器。清除網站資料將移除這些本機紀錄。</p><p>複製的諮詢內容由妳自行決定是否分享。請勿透過本體驗版提交病歷或醫療照片。正式上線前會提供對應的個資告知與服務條款。</p><button class="outline" id="clear-local">清除本機收藏與計畫</button>'}};
ARTICLES.perks={title:'下一份小小期待，準備中。',body:'<p>台灣店家體驗與預約禮遇仍在規劃，目前沒有可領取的優惠券，也沒有已啟用的折扣。</p><h3>正式方案會說清楚</h3><ul><li>合作店家與可使用的地點</li><li>實際提供的內容及是否需另付費</li><li>適用資格、有效日期與預約方式</li><li>變更、取消與使用限制</li></ul><p>皮膚管理體驗和醫療後續診療將分別說明。預約前可以先整理妳想詢問的事項。</p>'};
function article(id){const a=ARTICLES[id];if(a)openDialog(`<h2 id="dialog-title">${a.title}</h2>${a.body}`);}
document.addEventListener('click',event=>{const entry=event.target.closest('[data-discover],[data-area]');if(!entry)return;$('#search').value='';$('#budget').value='';$('#concern').value=entry.dataset.discover||'';$('#area').value=entry.dataset.area||'';$('#filters').hidden=false;$('#filter-toggle').setAttribute('aria-expanded','true');$('#filter-toggle').innerHTML='篩選條件 <span aria-hidden="true">−</span>';renderClinics();if($('#dialog').open)closeDialog();location.hash='clinics';});
function choose(id){navigateFlow('consultation',selectedProcedureKey(),id);}
document.addEventListener('click',event=>{const detailButton=event.target.closest('[data-detail]');if(detailButton)return detail(detailButton.dataset.detail);const save=event.target.closest('[data-save]');if(save){const id=save.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);persist();renderClinics();renderSaved();if($('#dialog').open){save.setAttribute('aria-pressed',saved.has(id));save.textContent=saved.has(id)?'已收藏 ♥':'收藏院所 ♡';}else{const replacement=($('#saved-dialog').open?$('#saved-dialog'):document).querySelector(`[data-save="${id}"]`);replacement?.focus({preventScroll:true});}toast(saved.has(id)?'已加入收藏':'已取消收藏');return;}const choice=event.target.closest('[data-choose]');if(choice)return choose(choice.dataset.choose);const art=event.target.closest('[data-article]');if(art)return article(art.dataset.article);if(event.target.closest('[data-reset]')){$('#search-form').reset();return;}if(event.target.id==='clear-local'){saved.clear();$('#plan-form').reset();persist();renderClinics();renderSaved();toast('已清除本機收藏與計畫');closeDialog();}});
document.addEventListener('change',event=>{if(event.target.matches('[data-compare]')){const id=event.target.dataset.compare;if(event.target.checked&&compared.size>=3){event.target.checked=false;toast(L('최대 3곳까지 비교할 수 있어요.','最多可比較 3 間院所。'));return;}event.target.checked?compared.add(id):compared.delete(id);updateComparison();}});
$('#compare-open').addEventListener('click',compare);$('#compare-clear').addEventListener('click',()=>{compared.clear();updateComparison();});
$('#filter-toggle').addEventListener('click',()=>{const open=$('#filters').hidden;$('#filters').hidden=!open;$('#filter-toggle').setAttribute('aria-expanded',open);$('#filter-toggle').innerHTML=`篩選條件 <span aria-hidden="true">${open?'−':'＋'}</span>`;});
$('#search-form').addEventListener('submit',event=>{event.preventDefault();renderClinics();});$('#search-form').addEventListener('reset',()=>setTimeout(renderClinics,0));$('#search').addEventListener('input',renderClinics);['area','concern','budget'].forEach(id=>$('#'+id).addEventListener('change',renderClinics));
CLINICS.forEach(c=>{const opt=document.createElement('option');opt.value=c.id;opt.textContent=`${c.name} · ${c.area}`;$('#plan-clinic').append(opt);});
const now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;$('#visit-date').min=today;
if(typeof initial.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(initial.date)&&initial.date>=today)$('#visit-date').value=initial.date;
if(CLINICS.some(c=>c.id===initial.clinic))$('#plan-clinic').value=initial.clinic;
if([...$('#plan-treatment').options].some(o=>o.value===initial.treatment))$('#plan-treatment').value=initial.treatment;
$('#plan-form').addEventListener('change',persist);
$('#plan-form').addEventListener('submit',event=>{event.preventDefault();if(!$('#plan-form').reportValidity())return;const c=CLINICS.find(c=>c.id===$('#plan-clinic').value);if(!c)return;persist();const summary=`【SKINBRIDGE 體驗版・未送出預約】\n想了解的院所：${c.name}（${c.area}）\n想了解的項目：${$('#plan-treatment').value}\n預計赴韓日期：${$('#visit-date').value||'日期未定'}\n\n想確認：正式費用與包含項目、中文服務、取消條件、術後聯繫。\n以上為諮詢準備，非正式預約。`;openDialog(`<h2 id="dialog-title">諮詢內容，整理好了。</h2><p>先複製這份內容。正式 LINE 帳號接入後，可由妳自行開啟並傳送。</p><textarea id="inquiry-summary" class="summary-box" readonly aria-label="諮詢內容">${esc(summary)}</textarea><p class="notice">目前 LINE 帳號尚未接入。沒有資料送出，也沒有成立預約。</p><div class="dialog-actions"><button class="primary" id="copy-inquiry">複製諮詢內容</button>${LINE_URL && /^https:\/\/(lin\.ee|line\.me)\//.test(LINE_URL)?`<a class="outline" href="${esc(LINE_URL)}" target="_blank" rel="noopener">開啟官方 LINE ↗</a>`:''}</div>`);$('#copy-inquiry').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary);toast('已複製，可貼至諮詢對話');}catch{$('#inquiry-summary').focus();$('#inquiry-summary').select();toast('請複製已選取的諮詢內容');}});});
$('.menu-toggle').addEventListener('click',()=>{const open=$('#mobile-menu').hidden;$('#mobile-menu').hidden=!open;$('.menu-toggle').setAttribute('aria-expanded',open);$('.menu-toggle').setAttribute('aria-label',open?'關閉選單':'開啟選單');});
$$('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>{$('#mobile-menu').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','開啟選單');}));
renderClinics();renderSaved();updateComparison();

const PROCEDURES={
 hydration:{title:'保濕管理',tag:'保濕管理',intro:'從清潔、保濕到日常照護，先了解院所提供哪些內容。',questions:['包含哪些步驟、產品與費用？','敏感肌需要先確認什麼？','當天的行程與日常保養要注意什麼？']},
 texture:{title:'毛孔療程諮詢',tag:'毛孔',intro:'毛孔與膚質的困擾各有不同，先和醫師釐清想改善的問題。',questions:['院所會如何評估我的膚況？','建議的療程、次數與完整費用？','恢復期與後續照護如何安排？']},
 clarity:{title:'皮秒雷射諮詢',tag:'斑點',intro:'想了解皮秒雷射？可以先整理問題，向醫師確認適合性與選擇。',questions:['我的斑點類型適合什麼方式？','使用的設備、範圍與完整費用？','風險、恢復期與回台後聯繫？']},
 firmness:{title:'緊緻療程諮詢',tag:'緊緻',intro:'不同設備與方式的適用情況不同，從想了解的輪廓問題開始諮詢。',questions:['醫師會如何評估適合的方式？','設備、施作範圍與完整費用？','風險與術後照護需要確認什麼？']},
 first:{title:'初次肌膚諮詢',tag:'',intro:'還沒決定療程也沒關係，先比較院所、溝通方式與諮詢安排。',questions:['有中文諮詢或口譯服務嗎？','初次諮詢的費用與流程？','諮詢後可以再決定是否預約嗎？']}
};
document.addEventListener('click',event=>{
 const filter=event.target.closest('[data-filter]');
 if(filter){$('#'+filter.dataset.filter).value=filter.dataset.value;renderClinics();return;}
 const arrow=event.target.closest('[data-scroll]');
 if(arrow){const rail=$('#procedure-rail');rail.scrollBy({left:Number(arrow.dataset.scroll)*(rail.querySelector('.procedure-card').offsetWidth+20),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return;}
 const card=event.target.closest('[data-procedure]');
 if(card)navigateFlow('procedure',card.dataset.procedure);
});

let savedReturnFocus=null;
function openSaved(){savedReturnFocus=document.activeElement;$('#saved-dialog').showModal();document.body.classList.add('modal-open');$('#saved-close').focus();}
$('#saved-close').addEventListener('click',()=>$('#saved-dialog').close());
$('#saved-dialog').addEventListener('close',()=>{if(!$('#dialog').open)document.body.classList.remove('modal-open');if(savedReturnFocus?.isConnected)savedReturnFocus.focus({preventScroll:true});});
document.addEventListener('click',event=>{
 if(event.target.closest('[data-open-saved]')){event.preventDefault();openSaved();return;}
 if(event.target.closest('#saved-dialog a[href^="#"]'))$('#saved-dialog').close();
 if(event.target.closest('[data-go-plan]')){closeDialog();navigateFlow('consultation',selectedProcedureKey(),new URLSearchParams(location.search).get('clinic')||'');}
});
$('#line-contact').addEventListener('click',()=>{
 if(/^https:\/\/(lin\.ee|line\.me)\//.test(LINE_URL)){window.open(LINE_URL,'_blank','noopener');return;}
 openDialog('<h2 id="dialog-title">LINE 諮詢</h2><p>目前 LINE 帳號尚未接入。沒有資料送出，也沒有成立預約。</p><p>可以先整理想了解的院所與日期。</p><div class="dialog-actions"><button class="primary" data-go-plan>整理諮詢內容 ↗</button></div>');
});
if(location.hash==='#saved')openSaved();

// No autoplay: visitors control the campaign with swipe, keyboard or buttons.
const heroTrack=$('#hero-track'),heroSlides=$$('.hero-slide');
let heroIndex=0,heroFrame=0;
function syncHero(){
 heroIndex=Math.max(0,Math.min(heroSlides.length-1,Math.round(heroTrack.scrollLeft/heroTrack.clientWidth)));
 heroSlides.forEach((slide,i)=>{slide.inert=i!==heroIndex;slide.setAttribute('aria-hidden',String(i!==heroIndex));});
 $$('[data-hero-slide]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===heroIndex)));
 $('#hero-counter').textContent=`0${heroIndex+1} / 03`;
}
function moveHero(index){const next=(index+heroSlides.length)%heroSlides.length;heroTrack.scrollTo({left:next*heroTrack.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
heroTrack.addEventListener('scroll',()=>{cancelAnimationFrame(heroFrame);heroFrame=requestAnimationFrame(syncHero);},{passive:true});
heroTrack.addEventListener('keydown',event=>{if(event.target!==heroTrack)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();moveHero(heroIndex+(event.key==='ArrowRight'?1:-1));}});
$$('[data-hero-step]').forEach(b=>b.addEventListener('click',()=>moveHero(heroIndex+Number(b.dataset.heroStep))));
$$('[data-hero-slide]').forEach(b=>b.addEventListener('click',()=>moveHero(Number(b.dataset.heroSlide))));
new ResizeObserver(()=>{heroTrack.scrollTo({left:heroIndex*heroTrack.clientWidth,behavior:'instant'});syncHero();}).observe(heroTrack);
syncHero();

document.addEventListener('click',event=>{if(event.target.closest('a[href="#plan"]')){event.preventDefault();navigateFlow('consultation',selectedProcedureKey());}});
