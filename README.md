# SKINBRIDGE Taiwan preview

This draft adds a responsive Traditional Chinese experience at `tw/`. The Korean and Simplified Chinese homepage is retained; its Traditional Chinese selector opens the new page. The production CNAME remains unchanged.

## Preview locally

Run `python -m http.server 8765 --bind 127.0.0.1` from this directory and open `http://127.0.0.1:8765/tw/`.

No build step, external libraries or third-party font requests are required.

## Included

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
