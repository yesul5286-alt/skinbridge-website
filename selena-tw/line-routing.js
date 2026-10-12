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
  const googleAds = !nonGoogleSource && !nonSearch && (clickId || (source === 'google' && ['cpc', 'ppc', 'paidsearch', 'paid_search'].includes(medium)));
  const href = googleAds ? 'https://lin.ee/uUMIWdP' : 'https://lin.ee/pjUu4a4';
  document.querySelectorAll('a.js-line').forEach(link => {
    link.href = href;
    link.dataset.lineSource = googleAds ? 'google_ads' : 'default';
  });
})();
