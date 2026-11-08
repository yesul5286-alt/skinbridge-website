/* Google Ads LINE routing; attribution is based on the current landing only.
 * Current landing parameters only: direct/social return visits keep the default URL.
 * gclid/braid identify Google Ads, not the campaign network; use search-only UTMs.
 */
(() => {
  const params = new URLSearchParams(window.location.search);
  const source = (params.get('utm_source') || '').trim().toLowerCase();
  const medium = (params.get('utm_medium') || '').trim().toLowerCase();
  const network = (params.get('network') || '').trim().toLowerCase();
  const clickId = ['gclid', 'gbraid', 'wbraid'].some(key => (params.get(key) || '').trim());
  const nonGoogleSource = source && source !== 'google';
  const nonSearch = (medium && !['cpc', 'ppc', 'paidsearch', 'paid_search'].includes(medium)) || (network && !['g', 's'].includes(network)) || params.has('fbclid');
  let googleAds = !nonGoogleSource && !nonSearch && (clickId || (source === 'google' && ['cpc', 'ppc', 'paidsearch', 'paid_search'].includes(medium)));
  // 2026-11-08: 같은 창(탭) 안에서 랜딩 → 이벤트 페이지로 넘어갈 때 유입 정보를 이어 간다.
  // 주소에 유입 정보가 있으면 그 판단을 저장하고, 없으면(사이트 안 이동) 같은 탭에서 저장된 판단을 쓴다.
  const hasAttribution = Boolean(source || medium || network || clickId || params.has('fbclid'));
  try {
    if (hasAttribution) sessionStorage.setItem('selenaLineSource', googleAds ? 'google_ads' : 'default');
    else if (sessionStorage.getItem('selenaLineSource') === 'google_ads') googleAds = true;
  } catch (_) { /* 저장소를 못 쓰면 현재 주소만으로 판단 */ }
  const href = googleAds ? 'https://lin.ee/uUMIWdP' : 'https://lin.ee/pjUu4a4';
  document.querySelectorAll('a.js-line').forEach(link => {
    link.href = href;
    link.dataset.lineSource = googleAds ? 'google_ads' : 'default';
  });
})();
