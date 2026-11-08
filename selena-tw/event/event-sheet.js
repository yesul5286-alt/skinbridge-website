/* 하단 이벤트 창: 첫 화면을 지나 조금 내리면(또는 8초 뒤) 한 번 올라오고, 카드가 자동으로 옆으로 넘어간다.
 * 손가락·마우스가 닿으면 잠시 멈추고, 「今天不再顯示」를 체크하면 대만 날짜 기준 오늘은 다시 안 뜬다. */
(function () {
  var sheet = document.getElementById('eventSheet');
  var rail = document.getElementById('esRail');
  if (!sheet || !rail) return;
  var KEY = 'selena.eventsheet.hidden-day.v1';
  var day = function () {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  };
  try { if (localStorage.getItem(KEY) === day()) return; } catch (e) { /* 저장소를 못 쓰면 그냥 보여 준다 */ }

  var shown = false, timer = null, paused = false, resumeT = null;

  // 닫은 뒤 다시 여는 작은 버튼 (「今天不再顯示」로 닫으면 안 보임)
  var pill = document.createElement('button');
  pill.type = 'button';
  pill.className = 'es-reopen';
  pill.hidden = true;
  pill.setAttribute('aria-label', '再次查看 11 月活動');
  pill.innerHTML = '<span class="es-dot" aria-hidden="true"></span>11 月活動 <span class="es-n">' + rail.children.length + '</span><span class="es-up" aria-hidden="true">↑</span>';
  sheet.parentNode.insertBefore(pill, sheet.nextSibling);
  function pillOn(on) {
    if (on) { pill.hidden = false; requestAnimationFrame(function () { pill.classList.add('is-on'); }); }
    else { pill.classList.remove('is-on'); pill.hidden = true; }
  }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function next() {
    if (paused) return;
    var cards = rail.children;
    if (!cards.length) return;
    var x = rail.scrollLeft, w = cards[0].getBoundingClientRect().width + 10;
    var max = rail.scrollWidth - rail.clientWidth - 2;
    rail.scrollTo({ left: x >= max ? 0 : Math.min(x + w, max + 2), behavior: 'smooth' });
  }
  function pause() {
    paused = true;
    clearTimeout(resumeT);
    resumeT = setTimeout(function () { paused = false; }, 5000);
  }
  function show() {
    if (shown) return;
    shown = true;
    pillOn(false);
    sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add('is-open'); });
    if (!reduce) timer = setInterval(next, 3000);
  }
  function hide() {
    sheet.classList.remove('is-open');
    clearInterval(timer);
    var today = false;
    try { today = document.getElementById('esHideToday').checked; if (today) localStorage.setItem(KEY, day()); } catch (e) {}
    setTimeout(function () { sheet.hidden = true; shown = false; if (!today) pillOn(true); }, 350);
  }

  ['pointerdown', 'touchstart', 'wheel', 'mouseenter'].forEach(function (ev) {
    rail.addEventListener(ev, pause, { passive: true });
  });
  sheet.querySelector('[data-es-close]').addEventListener('click', hide);
  pill.addEventListener('click', show);

  // 첫 화면(.hero)을 지나면 올라오고, 안 내려도 8초 뒤에는 올라온다
  var hero = document.querySelector('.hero');
  var limit = hero ? hero.offsetTop + hero.offsetHeight * 0.8 : 400;
  var onScroll = function () { if (window.scrollY > limit) { show(); window.removeEventListener('scroll', onScroll); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  setTimeout(function () { if (!shown && pill.hidden) show(); }, 8000);
})();
