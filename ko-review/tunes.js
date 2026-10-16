'use strict';
// User-supplied price PDF: 250430 Salon de Dr.Tunes Clinic Price List.pdf.
// Each row preserves an explicit device/product, quantity and pre-tax amount.
const TUNES_OFFERS=[
 ['Ulthera 100 發','울쎄라 100샷',500000,'firmness',1],
 ['Ultherapy Prime 100 發','울쎄라피 프라임 100샷',600000,'firmness',1],
 ['Thermage FLX 300 發','써마지 FLX 300샷',1500000,'firmness',1],
 ['Thermage FLX 600 發','써마지 FLX 600샷',3000000,'firmness',1],
 ['Thermage FLX 900 發','써마지 FLX 900샷',4300000,'firmness',1],
 ['Thermage FLX 眼周 450 發','아이 써마지 FLX 450샷',2500000,'firmness',1],
 ['Salon de Tune 80kJ','살롱드 튠 80kJ',1200000,'firmness',1],
 ['Tune Eyes','튠 아이즈',600000,'firmness',1],
 ['Titanium 80kJ','티타늄 80kJ',1200000,'firmness',1],
 ['Sofwave 300 pulses','소프웨이브 300펄스',3600000,'firmness',1],
 ['Emface 1 次','엠페이스 1회',1200000,'firmness',1],
 ['Emface 5 次','엠페이스 5회',5000000,'firmness',1],
 ['Potenza 毛孔 + 彈性','포텐자 모공 + 탄력',500000,'texture',1],
 ['Potenza Pumping tip（疤痕）+ Custom Booster','포텐자 펌핑팁(흉터) + 맞춤 부스터',1100000,'texture',1],
 ['Belotero REVIVE 1cc','벨로테로 리바이브 1cc',800000,'first',2],
 ['Belotero REVIVE 2cc','벨로테로 리바이브 2cc',1500000,'first',2],
 ['Juvelook 1v','쥬베룩 1바이알',800000,'first',2],
 ['Juvelook Volume 1v','쥬베룩 볼륨 1바이알',1000000,'first',2],
 ['Laetigen 2cc','레티젠 2cc',700000,'first',2],
 ['Rejuran Healer 2cc','리쥬란 힐러 2cc',600000,'first',2],
 ['Rejuran hb+ 1cc','리쥬란 HB+ 1cc',400000,'first',2],
 ['Rejuran Eye 1cc','리쥬란 아이 1cc',400000,'first',2],
 ['HydraFacial 保濕 / 營養','하이드라페이셜 보습 / 영양',550000,'hydration',4],
 ['Geneo X Detox / 保濕','제네오 X 디톡스 / 보습',550000,'hydration',4],
 ['SkinCeuticals 美白 / 保濕 / 抗氧化','스킨수티컬즈 미백 / 보습 / 항산화',550000,'hydration',4],
 ['Intense Ultra 再生 / 緊緻','인텐스 울트라 재생 / 탄력',300000,'hydration',4],
 ['Pascella 臉部 60 分鐘','파셀라 페이셜 60분',300000,'hydration',4],
 ['Endermologie & Pascella 身體管理 90 分鐘','엔더몰로지 & 파셀라 바디케어 90분',800000,'first',4]
];
REAL_CLINICS.push({id:'tunes',real:true,name:L('살롱드닥터튠즈의원','Salon de Dr. Tune’s Clinic'),area:L('청담','清潭'),concerns:[L('보습관리','保濕管理'),L('모공','毛孔'),L('탄력','緊緻')],price:null,language:L('한·영·중 상담 안내 · 방문일 지원 확인','韓英中諮詢資訊 · 到訪日支援需確認'),extra:L('제공 가격표 부가세 별도 · 추가 비용 확인','提供的價格表未含 VAT · 額外費用需確認'),followup:L('일반 문의 이메일 안내 · 사후관리 응답 시간 확인 필요','提供一般聯絡信箱 · 術後回覆時限待確認'),brand:'SALON DE DR. TUNE’S',source:'https://medicaltour.gangnam.go.kr/medical/clinic/view.do?cid=408&lang=ko&medical_seq=867&mid=403-408&pgno=4',address:L('서울 강남구 선릉로158길 14-3, 1~2층','首爾江南區宣陵路 158 街 14-3，1–2 樓'),station:L('서울 청담동 · 방문 전 예약 확인','首爾清潭洞 · 到訪前確認預約'),intro:L('장비와 용량을 확인하며, 나에게 맞는 상담을 준비해요.','先看設備與用量，再準備適合自己的諮詢。'),sections:[
 [L('진료시간','看診時間'),L('제공 소개서: 평일 10:00–19:00, 토요일 10:00–16:00. 일요일·공휴일 및 접수 마감 시간은 방문 전에 확인하세요.','提供的介紹書：平日 10:00–19:00，週六 10:00–16:00。週日、假日及最後受理時間請於到訪前確認。')],
 [L('의료진과 공간','醫師與空間'),L('소개서는 나지혜 대표원장과 별도 휴식 라운지를 안내합니다. 담당 의료진, 시술 공간 및 희망 장비는 상담 시 확인하세요.','介紹書列出代表院長羅智惠（나지혜）及休息 lounge。實際負責醫師、療程空間與所需設備請於諮詢時確認。')],
 [L('언어와 예약','語言與預約'),L('강남 메디컬 투어센터에는 한국어·영어·중국어 상담이 안내되어 있습니다. 통역 시간·비용과 예약 변경·취소 조건은 병원에 확인하세요.','江南醫療觀光中心列有韓文、英文及中文諮詢。口譯時段、費用及預約更改取消條件需向院所確認。')],
 [L('연락과 사후관리','聯絡與後續照護'),L('일반 문의: 02-540-8873 / salondedrtunes@naver.com. 귀국 후 전용 연락 창구, 응답 시간과 추가 진료비는 자료에서 확인되지 않았습니다.','一般聯絡：+82-2-540-8873 / salondedrtunes@naver.com。資料未確認返台後專用窗口、回覆時限與額外診療費。')]
]});
function clinicOfferList(c){return c?.id==='tunes'?TUNES_OFFERS:c?.id==='selena'?SELENA_OFFERS:[];}
function clinicOfferTerms(c){return c?.id==='tunes'?L('부가세 별도 · 제공 가격표 기준, 현재 적용 확인 필요','未含 VAT · 依提供的價格表，現行適用性待確認'):L('부가세 별도 · 행사 연도·적용 여부 확인 필요','未含 VAT · 活動年份及適用性待確認');}
function tunesPriceSection(){const categories=[['firmness',L('리프팅·탄력','拉提與緊緻')],['texture',L('모공·피부결','毛孔與膚質')],['first',L('주입 시술·기타','注射與其他項目')],['hydration',L('피부관리','肌膚管理')]];return `<section class="real-offers"><p class="eyebrow">KNOW YOUR OPTIONS</p><h2>${L('시술 조건부터, 차근차근 비교해요','從療程條件開始，慢慢比較')}</h2><p class="notice">${L('제공 가격표에서 28개 옵션을 정리했습니다. 전 항목 부가세 별도이며 현재 확정 견적이 아닙니다. 파일명은 250430으로 시작하지만 문서 안에 유효기간은 없습니다.','從提供的價格表整理 28 個選項。全部未含 VAT，並非現行確定報價。檔名以 250430 開頭，文件未列有效期間。')}</p>${categories.map(([key,label],idx)=>`<details><summary>${label} <span class="muted">${TUNES_OFFERS.filter(o=>o[3]===key).length}</span></summary>${TUNES_OFFERS.map((o,i)=>o[3]!==key?'':`<div class="offer-row"><div><strong>${esc(o[isKo?1:0])}</strong><small>${L('제공 가격표','提供價格表')} p.${o[4]}</small></div><span>₩${o[2].toLocaleString('en-US')}<small>${L('부가세 별도','未含 VAT')}</small></span><a class="text-button" href="${flowUrl('consultation',o[3],'tunes')}&offer=${i}">${L('문의','詢問')} ↗</a></div>`).join('')}</details>`).join('')}<p class="small muted">${L('브랜드·샷 수·용량이 다른 상품끼리는 같은 조건의 가격으로 비교할 수 없어요.','品牌、發數與用量不同，不能直接當作相同條件比較。')}</p><a class="text-button" href="../tw/assets/tunes-price-list.pdf" target="_blank" rel="noopener">${L('제공받은 전체 가격표 PDF 보기','查看提供的完整價格表 PDF')} ↗</a></section>`;}
