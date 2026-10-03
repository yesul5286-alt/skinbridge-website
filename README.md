# SKINBRIDGE Taiwan preview

This draft adds a responsive Traditional Chinese experience at `tw/`. The Korean and Simplified Chinese homepage is retained; its Traditional Chinese selector opens the new page. The production CNAME remains unchanged.

## Preview locally

Run `python -m http.server 8765 --bind 127.0.0.1` from this directory and open `http://127.0.0.1:8765/tw/`.

No build step, external libraries or third-party font requests are required.

## Korean owner review

Open `/ko-review/` to review the same layout, filters, details and inquiry flow in Korean. The top language links switch between this review and `/tw/`. Saved items and plans are separate in each language preview.

Edit Taiwan source files first, then run `python build-review.py` to regenerate the Korean review using `review-ko.tsv`. Shared CSS and image assets remain in `tw/`. The Korean files are generated; do not edit them directly. The build script is needed only when updating translations, not to serve the site.

Discovery now presents one question with five horizontally scrollable image cards. Each opens an introduction and consultation questions, then links to matching demo clinics. Treatment and region chips remain visible and filter results immediately. Photos retain bounded proportions on mobile and desktop.

Search controls use compact rows and an expandable budget control. Saved clinics are in a dedicated native dialog opened from the header or mobile heart tab, rather than a homepage section. A fixed right-side LINE button opens the configured official account; until configured, it explains the preview status and links to inquiry preparation. It does not send a message automatically.

The top campaign is a three-slide carousel: brand portrait, return-home care, and planned benefits. Visitors switch using native touch scrolling, arrows, dots or arrow keys on the focused track. There is no autoplay. Inactive slides are inert and hidden from assistive technology. The standalone benefits section has been removed; detailed aftercare information remains available below.

## Included

- Shareable query-string routes: `?view=procedure&procedure=clarity`, `?view=clinic&procedure=clarity&clinic=b`, and `?view=consultation&procedure=clarity&clinic=b`. Refresh and browser Back work without server rewrites. Language links preserve the selected route.
- Procedure context carries into clinic cards, detail and inquiry summaries. Only hydration has a demo price; other services show quotation after consultation. Clinic offerings are explicitly fictional mappings, not verified availability. Search includes procedure names and pico aliases.
- Consultation accepts an undecided date or a validated future date and an optional question. It generates a copyable summary, never submits a booking or medical information. The official LINE link is displayed only after configuration.

- Responsive desktop/mobile homepage, clinic search, concern/region/budget filters and empty states.
- Clinic details, 2–3-clinic comparison, saved clinics and trip-date planning.
- Local-browser persistence with a clear-data control.
- Inquiry preparation and copy-to-clipboard. Nothing is submitted or booked.
- Travel preparation articles, return-home support information and explicit partner-benefit status.
- Keyboard-accessible native dialogs, labeled controls and reduced-motion support.

## Before production release

1. Replace the fictional `CLINICS` records in `tw/app.js` with approved partner information, verified clinicians, addresses, treatments, like-for-like product/device/dose data, prices, extra charges and cancellation terms.
2. Supply the verified official LINE URL in `LINE_URL`. Update the inquiry wording to match the actual workflow; do not claim a request is confirmed before the clinic accepts it.
3. Replace AI-generated illustrative images with approved brand/clinic photography where appropriate. Current photos are visibly disclosed as examples, not actual patients or premises.
4. Confirm return-home medical contact responsibilities, response hours and emergency escalation. Local salon benefits must be separated from medical care. Do not enable unconfirmed coupons.
5. Review Traditional Chinese copy, privacy disclosures, medical advertising requirements and applicable partner terms before release.
6. Remove the preview notices and `noindex,nofollow` only after all real data and operational processes are ready.

The page stores only saved IDs, a date, and selected clinic/treatment in `localStorage`. It does not provide accounts, cross-device synchronization, a booking backend, medical assessment or active vouchers.

## Assets

The hero and clinic photographs were generated with the built-in ImageGen tool for this preview. The final generation briefs were a cream/blush skincare campaign portrait with right-aligned subject and a fictional sunlit Korean clinic interior; neither depicts actual patients or partners. Full prompts are in `ASSET-PROMPTS.md`.

## Source-backed clinic preview (2026-10-04)

`tw/real-clinics.js` supplies bilingual Selena Hongdae and Springday Sinchon profiles. Public sources and user-provided materials are tracked in `clinic-sources.json`. Inclusion does not imply partnership. Selena has 22 transcribed event rows from two equivalent artwork variants; no year is printed and VAT is excluded. Offers retain their conditions in inquiry summaries. Original patient and celebrity photos are not republished. Real clinics use labeled photo placeholders; fictional A/B/C remain identified examples. Real prices are not included in the sample hydration budget filter.
