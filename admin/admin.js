/* Skin Bridge 관리자 화면 — Apps Script 'Admin.html' 이 이 파일을 불러온다 */
(function(){
const SEED = (typeof CLINICS !== "undefined" ? CLINICS : []).map(c => JSON.parse(JSON.stringify(c)));
const REGIONS = ["首爾","釜山","濟州","大邱","仁川","京畿"];
const ICONS = [["train","역·교통"],["shield","정품·인증"],["chat","외국어 상담"],["tag","가격"],["cal","진료일"],["list","기타"]];
const TIERS = [["free","무료 체험(免費體驗)"],["20","20% 할인"],["15","15% 할인"],["10","10% 할인"],["5","5% 할인"]];
const DAYS = ["월","화","수","목","금","토","일"];
let LIST = [], cur = null;   // cur = {id, isNew, order, visible, data}

const $ = s => document.querySelector(s);
const h = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const call = (fn, ...args) => new Promise((ok, no) => google.script.run.withSuccessHandler(ok).withFailureHandler(e => no(e))[fn](...args));
const msg = (t, kind) => { const m = $("#msg"); if (m) { m.textContent = t; m.className = "msg " + (kind || ""); } };

(function addSiteLinks(){
  const hd = document.querySelector("header");
  const box = document.createElement("span");
  box.className = "site-links";
  box.innerHTML = `<a href="https://www.skinbridgekorea.com/tw/" target="_blank" rel="noopener">홈페이지 보기 ↗</a>`;
  hd.insertBefore(box, hd.querySelector("#who"));
})();
async function boot(){
  try {
    $("#who").textContent = await call("adminWho") + " 로 로그인됨";
    $("#wrap").hidden = false;
    await loadList();
  } catch (e) {
    $("#fatal").innerHTML = `<div class="err-box">${h(e.message || e)}</div>`;
    $("#who").textContent = "권한 없음";
  }
}
async function loadList(){
  LIST = await call("adminList");
  $("#seedBtn").hidden = LIST.length > 0;
  $("#list").innerHTML = LIST.length ? LIST.map(c => `<li><button data-id="${h(c.id)}" class="${cur && cur.id === c.id ? "on" : ""}">
    ${h(c.name)}${c.visible ? "" : '<span class="hidden-tag">숨김</span>'}
    <small>${h(c.region)} ${h(c.area)} · ${h(c.updated || "")} ${h(c.by || "")}</small></button></li>`).join("")
    : `<li class="hint">아직 등록된 병원이 없어요.</li>`;
}

$("#list").addEventListener("click", async e => {
  const b = e.target.closest("button[data-id]"); if (!b) return;
  const r = await call("adminGet", b.dataset.id);
  cur = { id: r.id, isNew: false, order: r.order, visible: r.visible, data: r.data };
  render(); loadList();
});
$("#newBtn").addEventListener("click", () => {
  cur = { id: "", isNew: true, order: (LIST.length + 1) * 10, visible: false,
          data: { name:"", region:"首爾", area:"", tone:"t1", tags:[], menu:[], features:[], doctors:[], photos:[] } };
  render(); loadList();
});
$("#seedBtn").addEventListener("click", async () => {
  if (!(await confirmBox("지금 홈페이지에 있는 병원 데이터를 관리자 시트로 옮길까요? 예시 병원은 숨김으로 들어가요."))) return;
  $("#seedBtn").disabled = true; $("#seedBtn").textContent = "넣는 중…";
  for (let i = 0; i < SEED.length; i++) {
    const c = Object.assign({}, SEED[i]); const id = c.id; delete c.id;
    await call("adminSave", id, c, !c.example, (i + 1) * 10);
  }
  await loadList();
});
function confirmBox(text){
  return new Promise(ok => {
    const bg = document.createElement("div");
    bg.className = "modal-bg";
    bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><p>${h(text)}</p>
      <div class="modal-acts"><button class="btn" data-a="no">취소</button><button class="btn pri" data-a="yes">확인</button></div></div>`;
    document.body.appendChild(bg);
    bg.addEventListener("click", e => {
      const a = e.target.dataset && e.target.dataset.a; if (!a) return;
      bg.remove(); ok(a === "yes");
    });
    bg.querySelector('[data-a="yes"]').focus();
  });
}

/* ── 편집 화면 ── */
function render(){
  const d = cur.data;
  const camp = d.camp || null;
  const hours = d.hours || ["","","","","","",""];
  $("#editor").innerHTML = `
  <h2>${cur.isNew ? "새 병원" : h(d.name || cur.id)}${cur.isNew ? "" : ` <a class="view-link" href="https://www.skinbridgekorea.com/tw/#c-${h(cur.id)}" target="_blank" rel="noopener">홈페이지에서 보기 ↗</a>`}</h2>

  <fieldset><legend>기본 정보</legend>
    <div class="grid">
      <label class="f">주소용 영문 id (예: selena)<input id="i_id" value="${h(cur.id)}" ${cur.isNew ? "" : "readonly"} placeholder="영문 소문자·숫자·하이픈"></label>
      <label class="f">병원 이름 (페이지 표시)<input id="i_name" value="${h(d.name)}"></label>
      <label class="f">지역<select id="i_region">${REGIONS.map(r => `<option ${r === d.region ? "selected" : ""}>${r}</option>`).join("")}</select></label>
      <label class="f">동네 (例: 弘大)<input id="i_area" value="${h(d.area)}"></label>
      <label class="f">가까운 역 (例: 弘大入口站 8 號出口)<input id="i_station" value="${h(d.station)}"></label>
      <label class="f full">주소<input id="i_address" value="${h(d.address)}"></label>
      <label class="f">상담 언어<input id="i_langs" value="${h(d.langs)}"></label>
      <label class="f">Google 평점<input id="i_rating" value="${h(d.rating)}" placeholder="4.9"></label>
      <label class="f">Google 리뷰 수<input id="i_reviews" value="${h(d.reviews)}" inputmode="numeric"></label>
      <label class="f">짧은 태그 (쉼표로 구분)<input id="i_tags" value="${h((d.tags || []).join(", "))}"></label>
      <label class="f full">병원 소개 (줄바꿈 가능)<textarea id="i_intro">${h(d.intro || d.about)}</textarea></label>
      <label class="f full">한 줄 강점 (병원 찾기 카드에 나와요, 繁體)<input id="i_one" value="${h(d.oneliner)}" placeholder="例：自然拉提・院長親自諮詢"></label>
      <div class="f full">피부 고민 (필터)<div class="cks">${CONCERNS.map(x => `<label><input type="checkbox" data-ck="concerns" value="${h(x)}" ${(d.concerns || []).includes(x) ? "checked" : ""}> ${h(x)}</label>`).join("")}</div></div>
      <div class="f full">대표 시술 (필터)<div class="cks">${TREATS.map(x => `<label><input type="checkbox" data-ck="treats" value="${h(x)}" ${(d.treats || []).includes(x) ? "checked" : ""}> ${h(x)}</label>`).join("")}</div></div>
      <div class="f full">병원 특징 (필터)<div class="cks">${TRAITS.map(x => `<label><input type="checkbox" data-ck="traits" value="${h(x)}" ${(d.traits || []).includes(x) ? "checked" : ""}> ${h(x)}</label>`).join("")}</div></div>
      <label class="f full">진료 항목 (쉼표로 구분)<input id="i_fields" value="${h((d.fields || []).join(", "))}"></label>
      <label class="f full">주요 설비 (쉼표로 구분, '主要設備' 칸에 나와요)<input id="i_equip" value="${h((d.equipment || []).join(", "))}"></label>
      <label class="f full">안전 원칙·하지 않는 시술<input id="i_policy" value="${h(d.policy)}"></label>
      <label class="f full">병원 자체 페이지 링크<input id="i_more" value="${h(d.more)}" placeholder="https://"></label>
      <label class="f">목록 순서 (작을수록 위)<input id="i_order" value="${h(cur.order)}" inputmode="numeric"></label>
      <label class="chk"><input type="checkbox" id="i_visible" ${cur.visible ? "checked" : ""}> 홈페이지에 공개</label>
      <label class="chk"><input type="checkbox" id="i_benefit" ${d.benefit ? "checked" : ""}> '全療程 9折專屬禮遇' 표시 (외국인환자 유치기관 등록·계약 확인된 병원만)</label>
      <label class="chk"><input type="checkbox" id="i_selected" ${d.selected ? "checked" : ""}> 'SKINBRIDGE SELECTED' 배지 (일부 병원만)</label>
      <label class="chk"><input type="checkbox" id="i_example" ${d.example ? "checked" : ""}> '範例(예시)' 표시</label>
    </div>
  </fieldset>

  <fieldset><legend>병원 로고</legend>
    <p class="hint">병원 목록 카드에 사진 대신 이 로고가 나와요. 배경이 투명한 PNG가 가장 좋아요.</p>
    <div class="imgs" id="logoBox"></div>
  </fieldset>

  <fieldset><legend>병원 사진</legend>
    <p class="hint">병원 페이지 맨 위에서 옆으로 넘겨 보는 표지예요. 정사각형(1:1) 이미지가 좋고, 첫 장이 병원 목록 카드의 대표 사진이 돼요.</p>
    <div class="imgs" id="photos"></div>
    <p class="hint" style="margin-top:12px">로그인 후에만 보이는 병원 제공 전후 사진·후기 캡처('評價' 칸).</p>
    <div class="imgs" id="gated"></div>
    <p class="hint" style="margin-top:12px">병원 환경 사진('診所環境' 칸에 나와요).</p>
    <div class="imgs" id="interior"></div>
  </fieldset>

  <fieldset><legend>병원 특징 (아이콘)</legend>
    <div class="rows" id="feats"></div>
    <button class="btn sm" data-add="feats">+ 특징 추가</button>
  </fieldset>

  <fieldset><legend>광고 이미지 ('活動・優惠' 칸)</legend>
    <p class="hint">병원 광고 이미지(정사각형이 가장 좋아요)와 시술 이름·가격. 병원 페이지에 2칸 격자로 나와요.</p>
    <div class="rows" id="ads"></div>
    <button class="btn sm" data-add="ads">+ 광고 추가</button>
  </fieldset>

  <fieldset><legend>특색 시술 (사진 + 설명, '特色療程' 칸)</legend>
    <div class="rows" id="progs"></div>
    <button class="btn sm" data-add="progs">+ 특색 시술 추가</button>
  </fieldset>

  <fieldset><legend>주요 의료진</legend>
    <div class="rows" id="docs"></div>
    <button class="btn sm" data-add="docs">+ 의료진 추가</button>
  </fieldset>

  <fieldset><legend>진료 시간</legend>
    <p class="hint">비워 두면 '休診(휴진)'으로 나와요. 모두 비우면 'LINE으로 확인' 안내가 나와요. 예: 10:00-20:00</p>
    <div class="grid">${DAYS.map((d, i) => `<label class="f">${d}<input id="i_h${i}" value="${h(hours[i])}"></label>`).join("")}
      <label class="f">점심시간<input id="i_lunch" value="${h(d.lunch)}" placeholder="13:30-14:30"></label>
      <label class="f full">진료 시간 안내 (예: 最後預約 平日 19:00)<input id="i_hnote" value="${h(d.hoursNote)}"></label></div>
  </fieldset>

  <fieldset><legend>시술·가격 (기본 가격표)</legend>
    <p class="hint">가격표 이미지(병원이 준 가격표 그대로). 이미지와 아래 표 중 하나만 넣어도 되고, 둘 다 넣으면 이미지 → 표 순서로 나와요.</p>
    <div class="imgs" id="pimgs"></div>
    <label class="f" style="margin:10px 0">가격 안내 문구<input id="i_pnote" value="${h(d.priceNote)}" placeholder="VAT 另計"></label>
    <p class="hint">'분류'를 적으면 표에 분류 제목이 생겨요(같은 분류끼리 붙여서 입력).</p>
    <div class="rows" id="menu"></div>
    <button class="btn sm" data-add="menu">+ 시술 추가</button>
  </fieldset>

  <fieldset><legend>이달 이벤트 (이미지 카드)</legend>
    <div class="grid">
      <label class="f">이벤트 이름 (例: 11 月)<input id="i_month" value="${h(d.monthly && d.monthly.month)}"></label>
      <label class="f">가격 안내 (例: VAT 另計)<input id="i_mnote" value="${h(d.monthly && d.monthly.note)}"></label>
    </div>
    <p class="hint">이벤트 포스터 이미지(세로로 긴 이미지 그대로 보여요). 포스터와 아래 항목 중 하나만 넣어도 돼요.</p>
    <div class="imgs" id="posters"></div>
    <p class="hint" style="margin-top:10px">항목별 이벤트 카드(선택). 둘 다 비워 두면 기본 가격표가 대신 나와요.</p>
    <div class="rows" id="events"></div>
    <button class="btn sm" data-add="events">+ 이벤트 항목 추가</button>
  </fieldset>

  <fieldset><legend>예약하면 주는 서비스</legend>
    <label class="f full">예: 舒緩保濕護理 1 次 (없으면 비우기)<input id="i_perk" value="${h(d.perk)}"></label>
  </fieldset>

  <fieldset><legend>체험단</legend>
    <label class="chk"><input type="checkbox" id="c_on" ${camp ? "checked" : ""}> 체험단 모집 중</label>
    <div id="campBox" ${camp ? "" : "hidden"}>
      <div class="grid" style="margin-top:10px">
        <label class="f">마감일<input type="date" id="c_end" value="${h(camp && camp.end)}"></label>
        <label class="f">대상 시술 (例: Potenza・Juvelook)<input id="c_target" value="${h(camp && camp.target)}"></label>
        <label class="f">시술 분류 (쉼표: 電波拉提, 微針 …)<input id="c_cats" value="${h(camp && (camp.cats || []).join(", "))}"></label>
        <label class="chk"><input type="checkbox" id="c_example" ${camp && camp.example ? "checked" : ""}> '範例' 표시</label>
      </div>
      <p class="hint" style="margin-top:10px">혜택 단계는 큰 혜택부터 위에 놓으세요.</p>
      <div class="rows" id="tiers"></div>
      <button class="btn sm" data-add="tiers">+ 단계 추가</button>
    </div>
  </fieldset>

  <details><summary>고급: 전체 내용을 JSON으로 보기·붙여넣기</summary>
    <p class="hint">Claude가 병원 자료를 정리해 준 JSON을 붙여 넣고 [JSON 적용]을 누르면 위 칸이 채워져요. 저장은 따로 눌러야 해요.</p>
    <textarea id="jsonBox" style="min-height:160px;font-family:monospace;font-size:12px"></textarea>
    <div style="display:flex;gap:8px;margin-top:6px"><button class="btn sm" id="jsonShow">현재 내용 보기</button><button class="btn sm" id="jsonApply">JSON 적용</button></div>
  </details>

  <div class="savebar">
    <span class="msg" id="msg"></span>
    ${cur.isNew ? "" : `<button class="btn del" id="delBtn">삭제</button>`}
    <button class="btn pri" id="saveBtn">저장</button>
  </div>`;

  addSecNav();
  drawLogo(); drawPhotos(); drawInterior(); drawGated(); drawPimgs(); drawPosters(); drawRows("progs"); drawRows("ads"); drawRows("feats"); drawRows("docs"); drawRows("menu"); drawRows("events"); drawRows("tiers");
  $("#c_on").onchange = e => { $("#campBox").hidden = !e.target.checked; };
}

/* 위쪽 항목 버튼: 누르면 그 칸으로 이동 */
function addSecNav(){
  const ed = $("#editor");
  const secs = [...ed.querySelectorAll("fieldset")];
  secs.forEach((f, i) => { f.id = "sec-" + i; });
  const nav = document.createElement("nav");
  nav.className = "secnav"; nav.setAttribute("aria-label", "항목으로 이동");
  nav.innerHTML = secs.map((f, i) => `<button type="button" data-sec="${i}">${h(f.querySelector("legend").textContent.trim())}</button>`).join("")
    + `<button type="button" data-sec="json">JSON</button>`;
  ed.querySelector("h2").after(nav);
  nav.addEventListener("click", e => {
    const b = e.target.closest("[data-sec]"); if (!b) return;
    let target = b.dataset.sec === "json" ? ed.querySelector("details") : document.getElementById("sec-" + b.dataset.sec);
    if (b.dataset.sec === "json") target.open = true;
    const top = target.getBoundingClientRect().top + scrollY - (document.querySelector("header").offsetHeight + nav.offsetHeight + 12);
    scrollTo({ top, behavior: "smooth" });
  });
}

/* 반복 칸 */
const ROWDEF = {
  feats:  { cols:"160px 1fr auto", empty:{icon:"list",label:""}, src:() => cur.data.features || (cur.data.features = []),
            html:(x,i) => `<label class="f">아이콘<select data-k="icon">${ICONS.map(([v,t]) => `<option value="${v}" ${v === x.icon ? "selected" : ""}>${t}</option>`).join("")}</select></label>
                           <label class="f">문구 (繁體)<input data-k="label" value="${h(x.label)}"></label>` },
  docs:   { cols:"auto 1fr 1fr 2fr auto", empty:{name:"",role:"",tags:[],photo:""}, src:() => cur.data.doctors || (cur.data.doctors = []),
            html:(x,i) => `<div class="one-img">${x.photo ? `<img src="${h(x.photo)}" alt="">` : ""}<label class="up" style="width:72px;height:54px">사진<input type="file" accept="image/*" data-img="docs:${i}"></label></div>
                           <label class="f">이름<input data-k="name" value="${h(x.name)}"></label>
                           <label class="f">직함 (例: 代表院長)<input data-k="role" value="${h(x.role)}"></label>
                           <label class="f">경력·전문 (쉼표)<input data-k="tags" value="${h((x.tags || []).join(", "))}"></label>` },
  ads:    { cols:"auto 2fr 1fr 1fr 1fr auto", empty:{img:"",n:"",s:"",orig:null,krw:null}, src:() => cur.data.ads || (cur.data.ads = []),
            html:(x,i) => `<div class="one-img">${x.img ? `<img src="${h(x.img)}" alt="">` : ""}<label class="up" style="width:72px;height:54px">이미지<input type="file" accept="image/*" data-img="ads:${i}"></label></div>
                           <label class="f">시술 이름<input data-k="n" value="${h(x.n)}"></label>
                           <label class="f">세부<input data-k="s" value="${h(x.s)}"></label>
                           <label class="f">원래 가격(선택)<input data-k="orig" value="${h(x.orig)}" inputmode="numeric"></label>
                           <label class="f">가격(원)<input data-k="krw" value="${h(x.krw)}" inputmode="numeric"></label>` },
  progs:  { cols:"auto 1fr 2fr auto", empty:{title:"",desc:"",img:""}, src:() => cur.data.programs || (cur.data.programs = []),
            html:(x,i) => `<div class="one-img">${x.img ? `<img src="${h(x.img)}" alt="">` : ""}<label class="up" style="width:72px;height:54px">사진<input type="file" accept="image/*" data-img="progs:${i}"></label></div>
                           <label class="f">이름<input data-k="title" value="${h(x.title)}"></label>
                           <label class="f">설명 (繁體)<textarea data-k="desc" rows="2">${h(x.desc)}</textarea></label>` },
  menu:   { cols:"1fr 2fr 1fr 1fr auto", empty:{g:"",n:"",s:"",krw:null}, src:() => cur.data.menu || (cur.data.menu = []),
            html:(x,i) => `<label class="f">분류 (선택)<input data-k="g" value="${h(x.g)}"></label>
                           <label class="f">시술 이름<input data-k="n" value="${h(x.n)}"></label>
                           <label class="f">세부 (부위·샷)<input data-k="s" value="${h(x.s)}"></label>
                           <label class="f">가격(원, 비우면 LINE 문의)<input data-k="krw" value="${h(x.krw)}" inputmode="numeric"></label>` },
  events: { cols:"auto 2fr 1fr 1fr 1fr auto", empty:{n:"",s:"",krw:null,orig:null,img:""},
            src:() => { const d = cur.data; d.monthly = d.monthly || {month:"",note:"",items:[]}; d.monthly.items = d.monthly.items || []; return d.monthly.items; },
            html:(x,i) => `<div class="one-img">${x.img ? `<img src="${h(x.img)}" alt="">` : ""}<label class="up" style="width:72px;height:54px">이미지<input type="file" accept="image/*" data-img="events:${i}"></label></div>
                           <label class="f">이벤트 이름<input data-k="n" value="${h(x.n)}"></label>
                           <label class="f">세부<input data-k="s" value="${h(x.s)}"></label>
                           <label class="f">원래 가격(원, 선택)<input data-k="orig" value="${h(x.orig)}" inputmode="numeric"></label>
                           <label class="f">이벤트 가격(원)<input data-k="krw" value="${h(x.krw)}" inputmode="numeric"></label>` },
  tiers:  { cols:"1fr 90px auto auto auto", empty:{type:10,quota:1,influencer:false,all:false,items:"",notes:""},
            src:() => { const d = cur.data; d.camp = d.camp || {end:"",target:"",cats:[],tiers:[]}; d.camp.tiers = d.camp.tiers || []; return d.camp.tiers; },
            html:(x,i) => `<label class="f">혜택<select data-k="type">${TIERS.map(([v,t]) => `<option value="${v}" ${String(x.type) === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>
                           <label class="f">인원<input data-k="quota" value="${h(x.quota)}" inputmode="numeric"></label>
                           <label class="chk"><input type="checkbox" data-k="influencer" ${x.influencer ? "checked" : ""}> 인플루언서 한정</label>
                           <label class="chk"><input type="checkbox" data-k="all" ${x.all ? "checked" : ""}> 모든 시술</label>
                           <label class="f full" style="grid-column:1 / -1">대상 시술 목록 (한 줄에 하나, '모든 시술'이면 비워도 돼요)<textarea data-k="items" rows="3" placeholder="Potenza 微針電波 1 次&#10;水光針 2cc">${h(x.items)}</textarea></label>
                           <label class="f full" style="grid-column:1 / -1">주의사항 (번체로, 길게 써도 돼요)<textarea data-k="notes" rows="3" placeholder="例：需於活動期間內到診、需配合拍攝…">${h(x.notes)}</textarea></label>` },
};
function drawRows(key){
  const def = ROWDEF[key], box = $("#" + key); if (!box) return;
  const arr = def.src();
  box.innerHTML = arr.map((x, i) => `<div class="r" style="grid-template-columns:${def.cols}" data-row="${key}:${i}">${def.html(x, i)}
      <button class="btn sm x" data-del="${key}:${i}" title="삭제">✕</button></div>`).join("") || `<p class="hint">아직 없어요.</p>`;
}
function posterArr(){ const d = cur.data; d.monthly = d.monthly || {month:"",note:"",items:[]}; d.monthly.items = d.monthly.items || []; return d.monthly.posters || (d.monthly.posters = []); }
function drawPosters(){
  const arr = posterArr();
  $("#posters").innerHTML = arr.map((p, i) => `<div class="thumb" style="height:138px"><img src="${h(p.img)}" alt=""><button data-delposter="${i}" title="삭제">✕</button></div>`).join("")
    + `<label class="up" style="height:138px">+ 포스터 올리기<input type="file" accept="image/*" multiple data-img="posters"></label>`;
}
function drawLogo(){
  const u = cur.data.logo;
  $("#logoBox").innerHTML = (u ? `<div class="thumb" style="background:#F3EFEA"><img src="${h(u)}" alt="" style="object-fit:contain"><button data-dellogo="1" title="삭제">✕</button></div>` : "")
    + `<label class="up">${u ? "로고 바꾸기" : "+ 로고 올리기"}<input type="file" accept="image/png,image/webp,image/jpeg" data-img="logo"></label>`;
}
function drawPimgs(){
  const arr = cur.data.priceImgs || (cur.data.priceImgs = []);
  $("#pimgs").innerHTML = arr.map((u, i) => `<div class="thumb" style="height:138px"><img src="${h(u)}" alt=""><button data-delpimg="${i}" title="삭제">✕</button></div>`).join("")
    + `<label class="up" style="height:138px">+ 가격표 이미지<input type="file" accept="image/*" multiple data-img="pimgs"></label>`;
}
function drawGated(){
  const arr = cur.data.gated || (cur.data.gated = []);
  $("#gated").innerHTML = arr.map((u, i) => `<div class="thumb"><img src="${h(u)}" alt=""><button data-delgated="${i}" title="삭제">✕</button></div>`).join("")
    + `<label class="up">+ 전후 사진<input type="file" accept="image/*" multiple data-img="gated"></label>`;
}
function drawInterior(){
  const arr = cur.data.interior || (cur.data.interior = []);
  $("#interior").innerHTML = arr.map((u, i) => `<div class="thumb"><img src="${h(u)}" alt=""><button data-delint="${i}" title="삭제">✕</button></div>`).join("")
    + `<label class="up">+ 환경 사진<input type="file" accept="image/*" multiple data-img="interior"></label>`;
}
function drawPhotos(){
  const arr = cur.data.photos || (cur.data.photos = []);
  $("#photos").innerHTML = arr.map((u, i) => `<div class="thumb"><img src="${h(u)}" alt=""><button data-delphoto="${i}" title="삭제">✕</button></div>`).join("")
    + `<label class="up">+ 사진 올리기<input type="file" accept="image/*" multiple data-img="photos"></label>`;
}

/* 칸 값 → 데이터 */
function readRows(){
  document.querySelectorAll("[data-row]").forEach(r => {
    const [key, i] = r.dataset.row.split(":"); const x = ROWDEF[key].src()[+i];
    r.querySelectorAll("[data-k]").forEach(el => {
      const k = el.dataset.k;
      if (el.type === "checkbox") x[k] = el.checked;
      else if (k === "tags") x[k] = el.value.split(/[,，、]/).map(s => s.trim()).filter(Boolean);
      else if (["krw","orig","quota"].includes(k)) x[k] = el.value.trim() === "" ? null : Number(el.value.replace(/[^\d]/g, ""));
      else if (k === "type") x[k] = el.value === "free" ? "free" : Number(el.value);
      else x[k] = el.value.trim();
    });
  });
}
function readForm(){
  readRows();
  const v = id => ($("#" + id) ? $("#" + id).value.trim() : "");
  const list = id => v(id).split(/[,，、]/).map(s => s.trim()).filter(Boolean);
  const d = cur.data;
  Object.assign(d, { name:v("i_name"), region:v("i_region"), area:v("i_area"), station:v("i_station"), address:v("i_address"),
    langs:v("i_langs"), rating:v("i_rating"), reviews:v("i_reviews") ? Number(v("i_reviews")) : null, tags:list("i_tags"),
    intro:v("i_intro"), about:v("i_intro").split("\n")[0], fields:list("i_fields"), oneliner:v("i_one"), selected:$("#i_selected").checked, benefit:$("#i_benefit").checked,
    concerns:[...document.querySelectorAll('[data-ck="concerns"]:checked')].map(e => e.value),
    treats:[...document.querySelectorAll('[data-ck="treats"]:checked')].map(e => e.value),
    traits:[...document.querySelectorAll('[data-ck="traits"]:checked')].map(e => e.value), equipment:list("i_equip"), priceNote:v("i_pnote"), policy:v("i_policy"), more:v("i_more"),
    example:$("#i_example").checked, perk:v("i_perk"), lunch:v("i_lunch"), hoursNote:v("i_hnote") });
  const hrs = [0,1,2,3,4,5,6].map(i => v("i_h" + i));
  d.hours = hrs.some(Boolean) ? hrs : null;
  if (d.monthly) { d.monthly.month = v("i_month"); d.monthly.note = v("i_mnote"); if (!d.monthly.items.length && !(d.monthly.posters || []).length && !d.monthly.month) d.monthly = null; }
  if ($("#c_on").checked) {
    d.camp = d.camp || {tiers:[]};
    Object.assign(d.camp, { end:v("c_end"), target:v("c_target"), cats:list("c_cats"), example:$("#c_example").checked });
  } else d.camp = null;
  cur.visible = $("#i_visible").checked;
  cur.order = Number(v("i_order")) || 0;
  if (cur.isNew) cur.id = v("i_id").toLowerCase();
}

/* 클릭 처리 */
$("#editor").addEventListener("click", async e => {
  const t = e.target;
  if (t.dataset.add) { readForm(); ROWDEF[t.dataset.add].src().push(JSON.parse(JSON.stringify(ROWDEF[t.dataset.add].empty))); drawRows(t.dataset.add); }
  else if (t.dataset.del) { readForm(); const [k, i] = t.dataset.del.split(":"); ROWDEF[k].src().splice(+i, 1); drawRows(k); }
  else if (t.dataset.dellogo) { readForm(); cur.data.logo = ""; drawLogo(); }
  else if (t.dataset.delpimg != null) { readForm(); cur.data.priceImgs.splice(+t.dataset.delpimg, 1); drawPimgs(); }
  else if (t.dataset.delgated != null) { readForm(); cur.data.gated.splice(+t.dataset.delgated, 1); drawGated(); }
  else if (t.dataset.delint != null) { readForm(); cur.data.interior.splice(+t.dataset.delint, 1); drawInterior(); }
  else if (t.dataset.delposter != null) { readForm(); posterArr().splice(+t.dataset.delposter, 1); drawPosters(); }
  else if (t.dataset.delphoto != null) { readForm(); cur.data.photos.splice(+t.dataset.delphoto, 1); drawPhotos(); }
  else if (t.id === "saveBtn") save();
  else if (t.id === "delBtn") {
    if (!(await confirmBox(`'${cur.data.name}' 병원을 완전히 지울까요? 되돌릴 수 없어요. 잠시 숨기려면 '홈페이지에 공개'만 끄세요.`))) return;
    await call("adminDelete", cur.id); cur = null; $("#editor").innerHTML = `<p class="empty">삭제했어요.</p>`; loadList();
  }
  else if (t.id === "jsonShow") { readForm(); $("#jsonBox").value = JSON.stringify(Object.assign({id: cur.id}, cur.data), null, 2); }
  else if (t.id === "jsonApply") {
    try { const j = JSON.parse($("#jsonBox").value); if (cur.isNew && j.id) cur.id = j.id; delete j.id; if (j._merge) { delete j._merge; readForm(); cur.data = Object.assign(cur.data, j); } else cur.data = j; render(); if (cur.isNew) $("#i_id").value = cur.id; msg("JSON을 채웠어요. 확인하고 저장하세요.", "ok"); }
    catch (err) { msg("JSON 형식이 맞지 않아요: " + err.message, "err"); }
  }
});

/* 이미지 올리기: 긴 쪽 1600px로 줄여서 JPEG로 */
$("#editor").addEventListener("change", async e => {
  const t = e.target; if (!t.dataset.img || !t.files.length) return;
  readForm();
  const files = [...t.files];
  msg(`이미지 ${files.length}장 올리는 중…`);
  try {
    for (const f of files) {
      const { b64, mime } = await shrink(f, t.dataset.img === "logo" ? 800 : 1600, t.dataset.img === "logo");
      const res = await call("adminUpload", f.name, mime, b64);
      const [key, i] = t.dataset.img.split(":");
      if (key === "photos") cur.data.photos.push(res.url);
      else if (key === "posters") posterArr().push({ img: res.url, title: "" });
      else if (key === "logo") cur.data.logo = res.url;
      else if (key === "gated") (cur.data.gated || (cur.data.gated = [])).push(res.url);
      else if (key === "pimgs") (cur.data.priceImgs || (cur.data.priceImgs = [])).push(res.url);
      else if (key === "progs") ROWDEF.progs.src()[+i].img = res.url;
      else if (key === "ads") ROWDEF.ads.src()[+i].img = res.url;
      else if (key === "interior") (cur.data.interior || (cur.data.interior = [])).push(res.url);
      else if (key === "docs") ROWDEF.docs.src()[+i].photo = res.url;
      else if (key === "events") ROWDEF.events.src()[+i].img = res.url;
    }
    drawLogo(); drawPhotos(); drawInterior(); drawGated(); drawPimgs(); drawPosters(); drawRows("progs"); drawRows("ads"); drawRows("docs"); drawRows("events");
    msg("이미지를 올렸어요. 저장을 눌러야 홈페이지에 반영돼요.", "ok");
  } catch (err) { msg("이미지 올리기 실패: " + (err.message || err), "err"); }
});
function shrink(file, max, png){
  return new Promise((ok, no) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      ok(png ? { b64: c.toDataURL("image/png").split(",")[1], mime: "image/png" } : { b64: c.toDataURL("image/jpeg", 0.86).split(",")[1], mime: "image/jpeg" });
    };
    img.onerror = () => no(new Error("이미지를 읽을 수 없어요."));
    img.src = url;
  });
}

async function save(){
  readForm();
  if (!cur.data.name) return msg("병원 이름을 적어 주세요.", "err");
  if (!/^[a-z0-9-]{2,40}$/.test(cur.id)) return msg("영문 id는 소문자·숫자·하이픈 2~40자예요. 예: selena", "err");
  if (cur.isNew && LIST.some(c => c.id === cur.id)) return msg("이미 있는 id예요. 다른 id를 적어 주세요.", "err");
  $("#saveBtn").disabled = true; msg("저장 중…");
  try {
    await call("adminSave", cur.id, cur.data, cur.visible, cur.order);
    cur.isNew = false; msg("저장했어요. 1~2분 안에 홈페이지에 반영돼요.", "ok");
    await loadList(); render(); msg("저장했어요. 1~2분 안에 홈페이지에 반영돼요.", "ok");
  } catch (err) { msg("저장 실패: " + (err.message || err), "err"); }
  finally { const b = $("#saveBtn"); if (b) b.disabled = false; }
}

/* ── 후기 관리 ── */
(function addReviewButton(){
  const b = document.createElement("button");
  b.className = "btn"; b.id = "revBtn"; b.textContent = "후기 관리";
  const stack = document.querySelector("aside .stack"); stack.insertBefore(b, stack.children[1]);
  b.addEventListener("click", showReviews);
})();
async function showReviews(){
  cur = null; loadList();
  $("#editor").innerHTML = `<h2>후기 관리</h2><p class="hint">고객이 쓴 후기는 '대기'로 들어와요. 내용과 사진을 확인하고 [공개]를 누르면 LINE 로그인한 사람에게만 보여요. 얼굴이 드러나거나 효과를 과장하는 후기는 [숨김]을 권해요.</p><div id="revList"><p class="empty">불러오는 중…</p></div>`;
  try {
    const list = await call("adminReviews");
    $("#revList").innerHTML = list.length ? list.map(r => `<div class="revrow" data-rid="${h(r.id)}">
      <div class="revtop"><b>${h(r.clinicName)}</b> · ${"★".repeat(r.rating)} · ${h(r.name)} · ${h(r.at)} <span class="st st-${h(r.status)}">${h(r.status)}</span></div>
      ${r.item ? `<div class="hint" style="margin:0">${h(r.item)}</div>` : ""}
      <p style="margin:6px 0;white-space:pre-wrap">${h(r.text)}</p>
      <div class="revph" id="ph-${h(r.id)}">${r.hasBefore || r.hasAfter ? `<button class="btn sm" data-ph="${h(r.id)}">사진 보기</button>` : `<span class="hint">사진 없음</span>`}</div>
      <div style="display:flex;gap:6px;margin-top:8px">${["공개","대기","숨김"].map(s => `<button class="btn sm ${s === "공개" ? "pri" : ""}" data-rset="${s}" ${s === r.status ? "disabled" : ""}>${s}</button>`).join("")}</div>
    </div>`).join("") : `<p class="empty">아직 들어온 후기가 없어요.</p>`;
  } catch (e) { $("#revList").innerHTML = `<p class="err-box">${h(e.message || e)}</p>`; }
}
$("#editor").addEventListener("click", async e => {
  const t = e.target;
  if (t.dataset.ph) {
    t.disabled = true; t.textContent = "불러오는 중…";
    const p = await call("adminReviewPhotos", t.dataset.ph);
    $("#ph-" + t.dataset.ph).innerHTML = [p.before && `<figure><img src="${p.before}" alt=""><figcaption>전</figcaption></figure>`, p.after && `<figure><img src="${p.after}" alt=""><figcaption>후</figcaption></figure>`].filter(Boolean).join("");
  } else if (t.dataset.rset) {
    const id = t.closest("[data-rid]").dataset.rid;
    t.disabled = true;
    try { await call("adminReviewSet", id, t.dataset.rset); showReviews(); }
    catch (err) { alertBox("바꾸지 못했어요: " + (err.message || err)); }
  }
});
function alertBox(text){ confirmBox(text); }

boot();

})();
