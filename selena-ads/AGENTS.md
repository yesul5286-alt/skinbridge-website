# SELENA_TW_ADS — Codex instructions

## Scope
Work only under `selena-ads/` unless the user explicitly authorizes another path. Never modify the website root, `selena-tw/`, `CNAME`, `threads-auto`, its posting schedules, credentials or queue.

## Mission
Create trustworthy Taiwanese Traditional Chinese (zh-TW) dermatology promotional drafts that lead to informed LINE inquiries rather than promising outcomes. Prioritize accurate prices, physician review, clear risks and consent.

## Source of truth
1. `data/prices.csv` is the reviewed price ledger; `data/campaigns.json` is approved draft copy. Keep version/source/date, energy/shot/cc unit, tax treatment, promotion status, and product keys consistent.
2. New PDFs or screenshots in `price_uploads/` are UNVERIFIED input. Extract where possible, create a comparison report, and request human review before changing `prices.csv`. Never infer illegible figures or automatically approve a changed price.
3. Price treatment is explicitly `excluded`: show 未稅｜VAT另計 and never label tax-included. Never invent discounts, deadlines, comparative results or renewal/efficacy rates.
4. Rejuran Healer 2cc / Potenza multitip full face / ONDA 70kJ with Ultherapy PRIME 300 shots are separate products, not interchangeable.

## Cards
- 5-card flow: (1) concern/question, (2) distinction/education, (3) mechanisms and real quantified treatment, (4) physician assessment and risks, (5) exact price and LINE inquiry.
- Alternate discovery, information, trust and price-led hooks; change substance, not just palette.
- Taiwanese idiomatic zh-TW with Korean review notes. Single core message per card.
- Default Instagram 4:5 and Threads square; cool gray, ivory, champagne accent; strong legible Traditional Chinese typography.
- No handwriting, doodles, gratuitous English labels, arbitrary stickers/badges, mock patient testimonials, fabricated physician quotes, unofficial QR/logos, exaggerated skin editing.
- AI editorial images are models, not real patients; do not label any generated image as before/after. Use consented unretouched originals only after clinic approval.

## Compliance / quality
- Do not imply every patient requires treatment or guarantee immediate facial change, 1-year durability, scar elimination or zero downtime.
- State important pain, redness, bruising, pigmentation risks appropriately for the advertised treatment, plus efficacy variability.
- Clinical assessment, clinic medical-ad review, image usage consent, offer validity, price and VAT must be reviewed before publication.
- Distinguish rendered template draft from novel AI campaign research. Do not claim web research, auto-replies or new AI art unless actually executed.
- Never post, message a patient, deploy, pay for ads, or modify external credentials without an explicit separate approval.

## Automation
- Workflow only reads approved CSV and regenerates DRAFT graphics and manifest as GitHub Actions artifacts. No automatic publishing, no payments, no autonomous model call.
- Uploaded raw PDF/text reports require review; CSV approval is a separate human action.
- Project instructions alone do not create a perpetual Codex agent or live trigger. Verify the workflow runs after merge to default branch.
- Before reporting complete, run generator/tests and confirm all 15 output files and pricing checks.
