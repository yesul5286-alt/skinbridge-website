/* SELENA_LINE_Click: user-provided Google Ads conversion destination. */
(() => {
  if (window.selenaGoogleAdsInitialized) return;
  window.selenaGoogleAdsInitialized = true;
  const id = 'AW-18507170992';
  const conversionLabel = '2nJbCOnnnpodELCJ9PhE';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
    window.gtag('js', new Date());
  }
  window.gtag('config', id);
  let lastClick = -Infinity;
  window.gtag_report_conversion = function (url) {
    const now = Date.now();
    if (now - lastClick < 2000) return false;
    lastClick = now;
    let finished = false;
    let timer;
    const callback = function () {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (url) window.location.assign(url);
    };
    // A blocked tag must never block the consultation link.
    timer = setTimeout(callback, 1000);
    try {
      window.gtag('event', 'conversion', {
        send_to: id + '/' + conversionLabel,
        event_callback: callback,
        event_timeout: 900
      });
    } catch (_) { callback(); }
    return false;
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a.js-line');
    if (!link || event.defaultPrevented) return;
    // Modified clicks retain native new-tab behavior.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      window.gtag_report_conversion();
      return;
    }
    event.preventDefault();
    window.gtag_report_conversion(link.href);
  });
})();