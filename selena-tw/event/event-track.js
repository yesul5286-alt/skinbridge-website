/* 이벤트 목록·상세 페이지 광고 추적 (랜딩 script.js 의 메타 픽셀 부분과 같은 동작)
 * - 메타 픽셀 2개 PageView
 * - LINE 링크(a.js-line) 클릭 시 Contact
 * 구글 광고 전환(SELENA_LINE_Click)은 ../google-ads.js, LINE 주소 분기는 ../line-routing.js 가 맡는다. */
(function () {
  var META_PIXEL_IDS = ["4662163010727947", "1668583751442846", "1776658760237143"];
  if (!window.selenaPixelInitialized) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    META_PIXEL_IDS.forEach(function (id) { fbq('init', id); });
    META_PIXEL_IDS.forEach(function (id) { fbq('trackSingle', id, 'PageView'); });
    window.selenaPixelInitialized = true;
  }
  document.querySelectorAll('a.js-line').forEach(function (link) {
    if (link.dataset.pixelBound) return;
    link.dataset.pixelBound = 'true';
    link.addEventListener('click', function () {
      if (typeof window.fbq === 'function') {
        META_PIXEL_IDS.forEach(function (id) { window.fbq('trackSingle', id, 'Contact'); });
      }
    });
  });
})();
