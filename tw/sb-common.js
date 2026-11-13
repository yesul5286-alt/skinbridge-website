/* ===== 설정 ===== */
const LINE_ID = "@911xoyoc";          // 스킨 브릿지 LINE 공식 계정 ID
const LIFF_ID = "2012557390-efGtDTc1"; // LIFF 앱 "Skin Bridge 申請" (주소 https://www.skinbridgekorea.com/apply/, 친구 추가 Aggressive)
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz-YzlW7zmdNgjbvBS_gRTcaHsQduwrXHz3MZAIV4KG3RXmCTUjdIHjwKn8uxBQqBY39g/exec"; // 구글 시트 "Skin Bridge 신청서" 웹 앱
const IS_SITE = /(^|\.)skinbridgekorea\.com$/.test(location.hostname); // 실제 홈페이지에서만 true
const TWD_RATE = 41.6;                // 1 NT$ = 41.6원 (2026.11)

/* ===== 데이터 ===== */
const REGIONS = ["首爾","釜山","濟州","大邱"];
const CATS = ["電波拉提","微針","膠原增生","肌膚管理","雷射","肉毒"];
const CONCERNS = ["拉提","毛孔","痘痘","痘疤","色素","輪廓","皺紋","彈力","身體雕塑"];
const TREATS = ["Ultherapy","Thermage","Potenza","Rejuran","ONDA","肉毒","玻尿酸","InMode","水光","線雕","抽脂"];
const TRAITS = ["院長親診","女醫師","全預約制","私人空間","拉提專門","中文諮詢","可辦退稅","車站直達"];
const LANGS = [["中文","中"],["英文","英"],["日文","日"]];

/* 병원마다 정하는 것
   perk : 예약하면 주는 서비스(없으면 "")
   camp : 체험단(없으면 null)
     end    마감일, target 대상 시술, cats 시술 분류, example 예시 여부
     tiers  혜택 단계(위에서부터 큰 혜택) — type: "free" 또는 할인율 숫자, quota 인원, influencer 인플루언서 한정, items 무료 시술 내용 */
const CLINICS = [
  { id:"selena", name:"SELENA", region:"首爾", area:"弘大", tone:"t1", example:false,
    rating:"4.9", reviews:339,
    tags:["中文諮詢","週日也看診","外國顧客同價"],
    address:"弘大入口站 8 號出口正前方・Kakao Friends 所在大樓 9 樓",
    langs:"韓・繁中・簡中・日・英",
    about:"所有設備皆為原廠正品認證，價格事先公開，外國顧客與韓國顧客同價。",
    policy:"不提供睡眠麻醉、鼻部填充、線雕。",
    more:"https://skinbridgekorea.com/selena-tw/",
    menu:[
      {n:"鳳凰電波 Thermage FLX", s:"眼周 225 發", krw:1089000},
      {n:"鳳凰電波 Thermage FLX", s:"眼周 450 發", krw:1790000},
      {n:"鳳凰電波 Thermage FLX", s:"全臉 600 發", krw:1990000},
      {n:"Potenza 微針電波", s:"", krw:null},
      {n:"Juvelook 膠原增生", s:"", krw:null},
      {n:"Volnewmer 電波拉提", s:"", krw:null},
      {n:"Ultherapy PRIME 音波拉提", s:"", krw:null},
    ],
    perk:"舒緩保濕護理 1 次", perkExample:true,
    station:"弘大入口站 8 號出口",
    features:[
      {icon:"train",  label:"8 號出口步行 1 分鐘"},
      {icon:"shield", label:"設備原廠正品認證"},
      {icon:"chat",   label:"繁中・簡中・日・英諮詢"},
      {icon:"tag",    label:"外國顧客同價"},
      {icon:"cal",    label:"週日也看診"},
      {icon:"list",   label:"價格事先公開"},
    ],
    intro:"SELENA 位於弘大入口站 8 號出口正前方。所有設備皆為原廠正品認證，價格事先公開，外國顧客與韓國顧客同價。\n不提供睡眠麻醉、鼻部填充、線雕，只建議真正需要的療程。",
    fields:["電波拉提","音波拉提","微針","膠原增生","肌膚管理"],
    doctors:[
      {name:"Lee Sang-kyung", role:"代表院長", tags:["臨床經歷 10 年以上","Potenza Key Doctor","Juvelook Key Doctor","Volnewmer Key Doctor"]},
    ],
    hours:null, hoursExample:true,
    monthly:{ month:"11 月", note:"VAT 另計", example:false, items:[
      {n:"鳳凰電波 Thermage FLX", s:"眼周 225 發", krw:1089000},
      {n:"鳳凰電波 Thermage FLX", s:"眼周 450 發", krw:1790000},
      {n:"鳳凰電波 Thermage FLX", s:"全臉 600 發", krw:1990000},
    ]},
    camp:{ end:"2026-11-30", target:"Potenza・Juvelook・Volnewmer", cats:["微針","膠原增生","電波拉提"], example:true,
      tiers:[
        {type:"free", quota:2,  influencer:true,  items:"Potenza 微針電波 1 次"},
        {type:20,     quota:3,  influencer:true},
        {type:15,     quota:5,  influencer:false},
        {type:10,     quota:10, influencer:false},
        {type:5,      quota:20, influencer:false},
      ]}},
  { id:"gangnam-a", name:"江南 範例診所 A", region:"首爾", area:"江南", tone:"t3", example:true,
    tags:["中文諮詢"], address:"（範例）江南站附近", langs:"韓・繁中", about:"範例內容。", policy:"", more:"",
    menu:[{n:"音波拉提",s:"",krw:null},{n:"肉毒除皺",s:"",krw:null}],
    perk:"肉毒 1 部位", camp:{ end:"2026-11-25", target:"音波拉提", cats:["電波拉提"], example:true,
      tiers:[{type:20, quota:2, influencer:true},{type:10, quota:5, influencer:false}]}},
  { id:"busan-b", name:"釜山 範例診所 B", region:"釜山", area:"西面", tone:"t5", example:true,
    tags:["中文諮詢"], address:"（範例）西面站附近", langs:"韓・繁中", about:"範例內容。", policy:"", more:"",
    menu:[{n:"水光肌膚管理",s:"",krw:null},{n:"皮秒雷射",s:"",krw:null}],
    perk:"", camp:{ end:"2026-11-28", target:"水光肌膚管理", cats:["肌膚管理"], example:true,
      tiers:[{type:"free", quota:1, influencer:true, items:"水光肌膚管理 1 次"},{type:15, quota:5, influencer:false},{type:5, quota:10, influencer:false}]}},
  { id:"jeju-c", name:"濟州 範例診所 C", region:"濟州", area:"濟州市", tone:"t2", example:true,
    tags:["中文諮詢"], address:"（範例）濟州市", langs:"韓・繁中", about:"範例內容。", policy:"", more:"",
    menu:[{n:"皮秒雷射",s:"",krw:null}],
    perk:"術後鎮靜面膜", camp:null},
  { id:"daegu-d", name:"大邱 範例診所 D", region:"大邱", area:"東城路", tone:"t4", example:true,
    tags:["中文諮詢"], address:"（範例）東城路", langs:"韓・繁中", about:"範例內容。", policy:"", more:"",
    menu:[{n:"肉毒除皺",s:"",krw:null}],
    perk:"", camp:{ end:"2026-12-05", target:"肉毒除皺", cats:["肉毒"], example:true,
      tiers:[{type:10, quota:5, influencer:false},{type:5, quota:10, influencer:false}]}},
];

/* ===== 도우미 ===== */
const $ = s => document.querySelector(s);
const clinicOf = id => CLINICS.find(c => c.id === id);
const today = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const daysLeft = end => Math.round((new Date(end + "T00:00:00") - today()) / 864e5);
const won = n => "₩" + n.toLocaleString("en-US");
const twd = n => "≈ NT$" + (Math.round(n / TWD_RATE / 10) * 10).toLocaleString("en-US");
const esc = s => String(s).replace(/[&<>"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
const exTag = c => c.example ? '<span class="ex">範例</span>' : "";

const ICON = {
  train:'<path d="M7 3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/><path d="M4 11h16M9 21l-2 0 2-4M15 21h2l-2-4"/><circle cx="8.5" cy="14" r=".6"/><circle cx="15.5" cy="14" r=".6"/>',
  shield:'<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5V6Z"/><path d="m8.8 12 2.3 2.3 4.2-4.6"/>',
  chat:'<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9.5h8M8 12.5h5"/>',
  tag:'<path d="M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5Z"/><circle cx="8" cy="8.5" r="1.3"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  list:'<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r=".8"/><circle cx="4" cy="12" r=".8"/><circle cx="4" cy="18" r=".8"/>'
};
const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k] || ICON.list}</svg>`;
const DAYS = ["週一","週二","週三","週四","週五","週六","週日"];
const HOME_URL = /\/apply\//.test(location.pathname) ? "/tw/" : "#";
const stars = n => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
const tierLabel = t => t.type === "free" ? "免費體驗" : `${t.type}% OFF`;
const tierKey = t => t.type === "free" ? "free" : String(t.type);

/* 체험단 목록은 병원 데이터에서 만든다
   (2026-11-14) 모든 제휴 병원이 기본으로 '全療程 10% OFF·인원 제한 없음·매달 말일 마감' 체험단을 가진다.
   병원이 따로 넣은 다른 단계(예: 셀레나 무료 1명)는 그 병원 마감일까지 함께 보인다.
   quota 0 = 인원 제한 없음(名額不限). */
const STD_RATE = 10;
const STD_NOTES = "【合作發布要求】\n1. 到院當天發布 Instagram 限時動態 1 則\n2. 體驗後 1 週內發布 Reels 影片 1 支\n3. 發布時加入共同創作者：@skinbridge_kr\n4. 追蹤帳號：@skinbridge_kr";
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const monthEnd = () => { const d = new Date(); return ymd(new Date(d.getFullYear(), d.getMonth() + 1, 0)); };
const tierRank = t => t.type === "free" ? 1000 : Number(t.type) || 0;
let CAMPS = [];
function campFor(c){
  const own = c.camp && Array.isArray(c.camp.tiers) ? c.camp.tiers : [];
  if (c.example) {   // 미리보기용 예시 병원은 예전 방식 그대로
    return own.length && c.camp.end ? { end: c.camp.end, target: c.camp.target, cats: c.camp.cats, tiers: own, example: true } : null;
  }
  const ownOpen = c.camp && c.camp.end && daysLeft(c.camp.end) >= 0;
  const std = own.find(t => tierKey(t) === String(STD_RATE));
  const extras = ownOpen ? own.filter(t => tierKey(t) !== String(STD_RATE)) : [];
  const tiers = [...extras, { type: STD_RATE, quota: 0, all: true, influencer: false, items: "", notes: (std && std.notes) || STD_NOTES }]
    .sort((a, b) => tierRank(b) - tierRank(a));
  return { end: monthEnd(), target: (c.camp && c.camp.target) || "全療程 10% OFF", cats: (c.camp && c.camp.cats) || [], tiers, example: false };
}
function buildCamps(){ CAMPS = CLINICS.map(c => [c, campFor(c)]).filter(([, k]) => k).map(([c, k]) => ({
  id: c.id, clinic: c.id, tone: c.tone, end: k.end, cats: k.cats || [], target: k.target,
  example: c.example || k.example, tiers: k.tiers,
  title: `${c.name} 體驗團`,
  quota: k.tiers.some(t => !t.quota) ? 0 : k.tiers.reduce((s, t) => s + t.quota, 0),
  best: tierLabel(k.tiers[0])
})); }
const quotaTxt = q => q ? `招募 <span class="num">${q}</span> 名` : "名額不限";
buildCamps();

/* 관리자 시트의 최신 병원 데이터를 읽는다. 실패하면 이 파일에 적힌 데이터를 그대로 쓴다. */
const DATA_URL = SHEET_URL ? SHEET_URL + "?action=data" : "";
function normClinic(c){
  return Object.assign({ tone:"t1", tags:[], menu:[], features:null, doctors:[], photos:[], fields:null, perk:"", camp:null,
    address:"", langs:"", about:"", policy:"", more:"", area:"", region:"首爾" }, c);
}
async function loadData(){
  if (!DATA_URL) return false;
  try {
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 6000);
    const r = await fetch(DATA_URL, { signal: ctl.signal }); clearTimeout(timer);
    const j = await r.json();
    if (!j || !Array.isArray(j.clinics) || !j.clinics.length) return false;
    CLINICS.splice(0, CLINICS.length, ...j.clinics.map(normClinic));
    buildCamps();
    return true;
  } catch (_) { return false; }
}
const bg = (c, i) => { const u = c.photos && c.photos[i || 0]; return u ? ` style="background-image:url('${String(u).replace(/['"()\\]/g, "")}')"` : ""; };
const openCamps = () => CAMPS.filter(k => daysLeft(k.end) >= 0);
const campOf = id => openCamps().find(k => k.clinic === id);

const state = { sheet:"", region:"全部", cat:"全部", q:"", cq:"", dirArea:"", dirN:20, tab:"price", prefill:null, f:{ area:"", concern:"", treat:"", lang:"", trait:"", camp:false, ben:"", sort:"rec" } };

function ddLabel(k){ const d = daysLeft(k.end); return d === 0 ? "今天截止" : "D-" + d; }

function campCard(k){
  const c = clinicOf(k.clinic), d = daysLeft(k.end);
  const inf = k.tiers.filter(t => t.influencer).reduce((s, t) => s + t.quota, 0);
  return `<a class="camp" href="#c-${c.id}">
    ${c.photos && c.photos.length
      ? `<div class="cimg" style="--bg:url('${esc(c.photos[0]).replace(/'/g, "")}')"><img src="${esc(c.photos[0])}" alt="${esc(c.name)}" loading="lazy"></div>`
      : `<div class="cimg ph ${k.tone}"></div>`}
    <div class="cchips"><span class="dd2 ${d <= 2 ? "hot" : ""}">${ddLabel(k)}</span>${k.tiers.map(t => `<span class="best">${tierLabel(t)}</span>`).join("")}</div>
    <span class="loc">${c.region} · ${esc(c.area)}</span>
    <div class="t">${esc(k.target)}${k.example ? '<span class="ex">範例</span>' : ""}</div>
    <div class="m">${esc(c.name)} · ${k.tiers.length > 1 ? `${k.tiers.length} 種方案 · ` : ""}${k.quota ? `共 <span class="num">${k.quota}</span> 名` : "名額不限"}${inf ? `（網紅 ${inf}）` : ""}</div>
  </a>`;
}
function clinicCard(c){
  const k = campOf(c.id);
  const sub = [c.rating ? `★ <span class="num">${c.rating}</span>` : "", ...c.tags.slice(0,2)].filter(Boolean).join(" · ");
  return `<a class="clinic" href="#c-${c.id}">
    ${c.logo ? `<div class="logo-ph"><img src="${esc(c.logo)}" alt="${esc(c.name)} logo" loading="lazy"></div>`
             : `<div class="ph ${c.tone} ${c.photos && c.photos.length ? "has-img" : ""}"${bg(c)}>${c.region.toUpperCase()}</div>`}
    <div class="bd"><span class="loc">${c.region} · ${esc(c.area)}</span>
      <div class="n">${esc(c.name)}${exTag(c)}</div>
      <div class="s">${sub}</div>
      ${c.perk ? `<div class="perk-s">預約即贈 ${esc(c.perk)}</div>` : ""}
      <div class="go">${k ? `體驗團 ${k.tiers.map(tierLabel).join("・")} · ` : ""}預約諮詢 →</div></div>
  </a>`;
}
function ladder(k){
  return `<ol class="ladder">${k.tiers.map((t, i) => `<li class="lv lv${Math.min(i,2)}">
      <span class="tl">${tierLabel(t)}</span>
      <span class="tq">${t.quota ? `<span class="num">${t.quota}</span> 名` : "名額不限"}</span>
      ${t.influencer ? `<span class="inf">網紅限定</span>` : ""}
      ${t.items ? `<span class="ti">${esc(t.items)}</span>` : ""}
    </li>`).join("")}</ol>`;
}
function perkBox(c){
  return c.perk ? `<div class="perk"><span class="en">BOOKING GIFT</span><b>預約諮詢即贈：${esc(c.perk)}</b>${c.perkExample ? '<span class="ex">範例</span>' : ""}</div>` : "";
}
function chips(list, cur, key){
  return `<div class="chips" role="group">${["全部", ...list].map(v =>
    `<button class="chip ${v === cur ? "on" : ""}" data-${key}="${v}" aria-pressed="${v === cur}">${v}</button>`).join("")}</div>`;
}
function section(en, title, more, body){
  return `<section class="sec"><div class="sh"><div><span class="en">${en}</span><h2>${title}</h2></div>${more ? `<a href="${more}">更多 →</a>` : ""}</div>${body}</section>`;
}
