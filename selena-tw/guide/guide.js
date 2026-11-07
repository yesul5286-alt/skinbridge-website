// 편별 안내 페이지 공통: 가격 채우기(prices.js 한 파일) + 메타 픽셀(운영 랜딩과 같은 ID) + LINE 클릭 추적
(function () {
  var META_PIXEL_ID = "4662163010727947";
  var page = document.body.getAttribute("data-guide") || "";

  // 가격: <div id="prices" data-set="skin-booster">에 채운다. 기간이 지나면 LINE 문의 안내로 바꾼다.
  var box = document.getElementById("prices");
  var P = window.SELENA_PRICES;
  if (box && P) {
    var set = P.sets[box.getAttribute("data-set")] || [];
    var expired = new Date() > new Date(P.ends + "T23:59:59+09:00");
    var sec = box.closest("section");
    if (!set.length) { if (sec) sec.hidden = true; }
    else if (expired) { box.innerHTML = '<p class="pr"><span>最新價格請透過繁中 LINE 詢問</span></p>'; }
    else {
      var review = document.body.classList.contains("review");
      box.innerHTML = set.map(function (it) {
        return '<div class="pr"><span>' + it.zh + (review ? '<i class="ko">' + it.ko + "</i>" : "") +
          '</span><strong>' + it.price + "<small>韓幣</small></strong></div>";
      }).join("");
      var per = document.getElementById("period");
      if (per) per.innerHTML = P.period_zh + (review ? '<i class="ko">' + P.period_ko + "</i>" : "");
    }
  }

  // 메타 픽셀
  if (META_PIXEL_ID && !document.body.classList.contains("review")) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", META_PIXEL_ID);
    fbq("trackSingle", META_PIXEL_ID, "PageView");
    fbq("trackSingle", META_PIXEL_ID, "ViewContent", { content_name: "guide-" + page });
  }
  document.querySelectorAll("a[data-line]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (typeof window.fbq === "function") window.fbq("trackSingle", META_PIXEL_ID, "Contact", { content_name: "guide-" + page });
    });
  });
})();
