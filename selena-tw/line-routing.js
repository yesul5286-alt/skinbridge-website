/* 셀레나 LINE 버튼 경로 + 첫 메시지 꼬리표 (2026-11-15)
 * 라인 버튼(a.js-line)을 '친구 추가' 링크 대신 LINE 대화창(oaMessage)으로 연다.
 * 대화창에는 「您好，我想諮詢療程 #꼬리표」가 미리 입력되어, 상담 화면에서 손님이 어디서 왔는지 보인다.
 *
 * 꼬리표 규칙 (같은 탭 안에서 페이지를 옮겨도 sessionStorage 로 이어 간다)
 *   #G        구글 검색 광고 (gclid/gbraid/wbraid 또는 utm_source=google + cpc 계열)
 *   #M1234    메타 광고. utm_content={{ad.id}} 이면 광고 ID 끝 4자리, 없으면 #M
 *   #IG #TH #FB  인스타·스레드·페이스북 일반 게시물·프로필 링크 (utm_source 또는 유입 주소)
 *   #W        그 밖의 방문 (직접 입력, 검색 결과 등)
 * 꼬리표와 광고 이름 대응표는 광고 관리자의 광고 ID 로 맞춘다.
 * 이전 방식(2026-11-08): 구글 광고 손님은 lin.ee/uUMIWdP, 나머지는 lin.ee/pjUu4a4 (친구 추가 링크).
 */
(() => {
  const LINE_ID = '@168qbbhv';
  const params = new URLSearchParams(window.location.search);
  const get = key => (params.get(key) || '').trim().toLowerCase();
  const source = get('utm_source');
  const medium = get('utm_medium');
  const network = get('network');
  const content = (params.get('utm_content') || '').trim();
  const googleClick = ['gclid', 'gbraid', 'wbraid'].some(key => (params.get(key) || '').trim());
  const metaClick = params.has('fbclid');

  const SEARCH_PAID = ['cpc', 'ppc', 'paidsearch', 'paid_search'];
  const SOCIAL_PAID = ['cpc', 'ppc', 'paid', 'paid_social', 'paidsocial', 'ads', 'ad'];
  const META_SOURCES = ['meta', 'facebook', 'fb', 'ig', 'instagram', 'threads'];

  function socialFromReferrer() {
    let host = '';
    try { host = new URL(document.referrer).hostname.toLowerCase(); } catch (_) { return ''; }
    if (/(^|\.)threads\.(net|com)$/.test(host)) return '#TH';
    if (/(^|\.)instagram\.com$/.test(host)) return '#IG';
    if (/(^|\.)(facebook|fb|messenger)\.com$/.test(host)) return '#FB';
    return '';
  }

  function tagFromLanding() {
    // 구글 검색 광고
    const nonGoogle = source && source !== 'google';
    const nonSearch = (medium && !SEARCH_PAID.includes(medium)) || (network && !['g', 's'].includes(network)) || metaClick;
    if (!nonGoogle && !nonSearch && (googleClick || (source === 'google' && SEARCH_PAID.includes(medium)))) return '#G';
    // 메타 광고 (utm 이 메타 + 유료)
    if (META_SOURCES.includes(source) && SOCIAL_PAID.includes(medium)) {
      const digits = content.replace(/\D/g, '');
      return digits.length >= 4 ? '#M' + digits.slice(-4) : '#M';
    }
    // 일반 소셜 (utm 지정)
    if (source === 'threads') return '#TH';
    if (source === 'ig' || source === 'instagram') return '#IG';
    if (source === 'fb' || source === 'facebook') return '#FB';
    // utm 없이 들어온 경우: 유입 주소로 판단. fbclid 만 있으면 메타 쪽(광고·게시물 구분 불가)
    const social = socialFromReferrer();
    if (social) return social;
    if (metaClick) return '#M';
    return '';
  }

  let tag = tagFromLanding();
  try {
    if (tag) sessionStorage.setItem('selenaLineTag', tag);
    else tag = sessionStorage.getItem('selenaLineTag') || '';
  } catch (_) { /* 저장소를 못 쓰면 현재 주소만으로 판단 */ }
  if (!tag) tag = '#W';

  const href = text => 'https://line.me/R/oaMessage/' + encodeURIComponent(LINE_ID) + '/?' + encodeURIComponent(text);

  // 다른 스크립트(nov-ad 의 시술 선택 등)에서 문구를 바꿔 쓸 수 있게 공개
  window.selenaLine = { tag, href, withTag: text => href(text + '\n' + tag) };

  document.querySelectorAll('a.js-line').forEach(link => {
    link.href = href('您好，我想諮詢療程 ' + tag);
    link.dataset.lineSource = tag;
  });
})();
