/* 대표원장 영상 재생 (의료진 칸 대표 영상 + 院長解說 줄 + 원장 사진 ▶)
 * 영상 목록은 index.html 의 window.SELENA_DOCTOR_VIDEOS. 누를 때만 영상을 불러온다. */
(function () {
  var list = window.SELENA_DOCTOR_VIDEOS || [];
  var dlg = document.getElementById('dvDialog');
  var video = document.getElementById('dvVideo');
  var title = document.getElementById('dvTitle');
  if (!list.length || !dlg || !video) return;
  var cur = 0;

  function open(i) {
    cur = (i + list.length) % list.length;
    var v = list[cur];
    video.pause();
    video.poster = v.poster;
    video.src = v.src;
    title.textContent = v.title + '（' + (cur + 1) + ' / ' + list.length + '）';
    if (!dlg.open) {
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    }
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }
  function close() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    if (dlg.open) dlg.close ? dlg.close() : dlg.removeAttribute('open');
  }

  document.querySelectorAll('[data-dv]').forEach(function (btn) {
    btn.addEventListener('click', function () { open(parseInt(btn.getAttribute('data-dv'), 10) || 0); });
  });
  dlg.querySelector('[data-dv-close]').addEventListener('click', close);
  dlg.querySelector('[data-dv-prev]').addEventListener('click', function () { open(cur - 1); });
  dlg.querySelector('[data-dv-next]').addEventListener('click', function () { open(cur + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });   // 바깥 누르면 닫기
  dlg.addEventListener('cancel', function () { video.pause(); });                    // Esc
  dlg.addEventListener('close', function () { video.pause(); });
})();
