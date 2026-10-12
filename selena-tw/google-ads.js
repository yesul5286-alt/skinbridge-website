/* SELENA only. Fill the verified SELENA_LINE_Click label before enabling conversions. */
(() => {
  if (window.selenaGoogleAdsInitialized) return;
  window.selenaGoogleAdsInitialized = true;
  const id = 'AW-18507170992';
  const conversionLabel = ''; // Awaiting the user's Google Ads event snippet.
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
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a.js-line');
    if (!link || event.defaultPrevented || !conversionLabel) return;
    const now = Date.now();
    if (now - lastClick < 2000) return;
    lastClick = now;
    window.gtag('event', 'conversion', { send_to: id + '/' + conversionLabel });
  });
})();
