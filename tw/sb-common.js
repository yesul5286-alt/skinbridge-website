/* ===== 설정 ===== */
const LINE_ID = "@911xoyoc";          // 스킨 브릿지 LINE 공식 계정 ID
const LIFF_ID = "2012557390-efGtDTc1"; // LIFF 앱 "Skin Bridge 申請" (주소 https://www.skinbridgekorea.com/apply/, 친구 추가 Aggressive)
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz-YzlW7zmdNgjbvBS_gRTcaHsQduwrXHz3MZAIV4KG3RXmCTUjdIHjwKn8uxBQqBY39g/exec"; // 구글 시트 "Skin Bridge 신청서" 웹 앱
const IS_SITE = /(^|\.)skinbridgekorea\.com$/.test(location.hostname); // 실제 홈페이지에서만 true
const TWD_RATE = 41.6;                // 1 NT$ = 41.6원 (2026.11)

/* ===== 데이터 ===== */
const REGIONS = ["首爾","釜山","濟州","大邱"];
const CATS = ["電波拉提","微針","膠原增生","肌膚管理","雷射","肉毒"];

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
    ]},
  { id:"gangnam-a", name:"江南 範例診所 A", region:"首爾", area:"江南", tone:"t3", example:true,
    tags:["中文諮詢"], address:"（範例）江南站附近", langs:"韓・繁中", about:"範例內容。", policy:"", more:"",
    menu:[{n:"音波拉提",s:"",krw:null},{n:"肉毒除皺",s:"",krw:null}]},
  { id:"busan-b", name:"釜山 範例診所 B", region:"釜山", area:"西面", tone:"t5", example:true,
    tags:["中文諮詢"], address:"（範例）西面站附近", langs:"韓・繁中", about:"範例內容。", policy:"", more:"",
    menu:[{n:"水光肌膚管理",s:"",krw:null},{n:"皮秒雷射",s:"",krw:null}]},
  { id:"jeju-c", name:"濟州 範例診所 C", region:"濟州", area:"濟州市", tone:"t2", example:true,
    tags:["中文諮詢"], address:"（範例）濟州市", langs:"韓・繁中", about:"範例內容。", policy:"", more:"",
    menu:[{n:"皮秒雷射",s:"",krw:null}]},
  { id:"daegu-d", name:"大邱 範例診所 D", region:"大邱", area:"東城路", tone:"t4", example:true,
    tags:["中文諮詢"], address:"（範例）東城路", langs:"韓・繁中", about:"範例內容。", policy:"", more:"",
    menu:[{n:"肉毒除皺",s:"",krw:null}]},
];

const CAMPS = [
  {id:"k1", clinic:"selena",   title:"Potenza 微針電波體驗", short:"Potenza", cat:"微針",     end:"2026-11-16", applied:32, quota:3, tone:"t1"},
  {id:"k2", clinic:"selena",   title:"Juvelook 膠原增生體驗", short:"Juvelook", cat:"膠原增生", end:"2026-11-20", applied:21, quota:2, tone:"t4"},
  {id:"k3", clinic:"busan-b",  title:"水光肌膚管理體驗",      short:"水光",     cat:"肌膚管理", end:"2026-11-20", applied:18, quota:5, tone:"t2"},
  {id:"k4", clinic:"jeju-c",   title:"皮秒雷射體驗",          short:"皮秒",     cat:"雷射",     end:"2026-11-23", applied:7,  quota:2, tone:"t3"},
  {id:"k5", clinic:"daegu-d",  title:"肉毒除皺體驗",          short:"肉毒",     cat:"肉毒",     end:"2026-11-12", applied:41, quota:2, tone:"t4"},
  {id:"k6", clinic:"gangnam-a",title:"音波拉提體驗",          short:"拉提",     cat:"電波拉提", end:"2026-11-13", applied:27, quota:3, tone:"t2"},
];

/* ===== 도우미 ===== */
const $ = s => document.querySelector(s);
const clinicOf = id => CLINICS.find(c => c.id === id);
const today = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const daysLeft = end => Math.round((new Date(end + "T00:00:00") - today()) / 864e5);
const openCamps = () => CAMPS.filter(k => daysLeft(k.end) >= 0);
const won = n => "₩" + n.toLocaleString("en-US");
const twd = n => "≈ NT$" + (Math.round(n / TWD_RATE / 10) * 10).toLocaleString("en-US");
const esc = s => String(s).replace(/[&<>"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
const exTag = c => c.example ? '<span class="ex">範例</span>' : "";

const state = { region:"全部", cat:"全部", q:"", cq:"", tab:"price", prefill:null };

function ddLabel(k){ const d = daysLeft(k.end); return d === 0 ? "今天截止" : "D-" + d; }

function campCard(k){
  const c = clinicOf(k.clinic), d = daysLeft(k.end);
  return `<a class="camp" href="#c-${c.id}" data-tab="camps">
    <div class="ph ${k.tone}"><span class="dd ${d <= 2 ? "hot" : ""}">${ddLabel(k)}</span><b>${esc(k.short)}</b></div>
    <span class="loc">${c.region} · ${esc(c.area)}</span>
    <div class="t">${esc(k.title)}${c.example ? '<span class="ex">範例</span>' : ""}</div>
    <div class="m">${esc(c.name)} · 報名 <span class="num">${k.applied}</span> / ${k.quota} 人</div>
  </a>`;
}
function clinicCard(c){
  const n = openCamps().filter(k => k.clinic === c.id).length;
  const sub = [c.rating ? `★ <span class="num">${c.rating}</span>` : "", ...c.tags.slice(0,2)].filter(Boolean).join(" · ");
  return `<a class="clinic" href="#c-${c.id}">
    <div class="ph ${c.tone}">${c.region.toUpperCase()}</div>
    <div class="bd"><span class="loc">${c.region} · ${esc(c.area)}</span>
      <div class="n">${esc(c.name)}${exTag(c)}</div>
      <div class="s">${sub}</div>
      <div class="go">${n ? `體驗團 ${n} 項招募中 · ` : ""}預約諮詢 →</div></div>
  </a>`;
}
function chips(list, cur, key){
  return `<div class="chips" role="group">${["全部", ...list].map(v =>
    `<button class="chip ${v === cur ? "on" : ""}" data-${key}="${v}" aria-pressed="${v === cur}">${v}</button>`).join("")}</div>`;
}
function section(en, title, more, body){
  return `<section class="sec"><div class="sh"><div><span class="en">${en}</span><h2>${title}</h2></div>${more ? `<a href="${more}">更多 →</a>` : ""}</div>${body}</section>`;
}
