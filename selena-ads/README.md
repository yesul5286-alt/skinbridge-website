# SELENA Taiwan ad drafts — beginner guide

**Purpose:** 3 clinic treatments × 5 cards. Creates **draft** zh-TW images when a reviewed pricing ledger changes in GitHub. It never publishes ads, changes the live website, modifies Threads automation, or charges for an AI image API.

## Simple workflow
1. After this PR is reviewed/merged, open **selena-ads/data/prices.csv** on GitHub and click the pencil. Edit only the verified `price_krw`, `verified_at` and `source` fields; preserve `vat=excluded`. Commit the edit.
2. GitHub Actions → **SELENA Taiwan ad drafts** will run from that CSV change and create an artifact `SELENA-draft-cards` containing the refreshed draft PNGs, captions and validation report.
3. Download the artifact. Clinic confirms price, promo conditions, clinical copy, visual rights, Meta/platform suitability; only then manually post an approved version.
4. To change copy, edit **selena-ads/data/campaigns.json** and commit. To use approved portrait art, place an owned/authorized photo at **selena-ads/assets/portrait.png**. If omitted, the generator renders a clean text-led layout.
5. Uploading a PDF to **selena-ads/price_uploads/** produces a text-extraction report for review. It does **not** replace any approved numeric price and it does **not** silently OCR scans.

## Codes and prices
- `rejuran`: Rejuran Healer 2cc (₩189,000, VAT extra)
- `potenza`: Potenza Multitip full face 1 session (₩129,000, VAT extra); 3-session note ₩349,000 VAT extra
- `onda_ultherapy`: ONDA 70kJ + Ultherapy PRIME 300 shots (₩1,494,000, VAT extra); promotional period needs final validation

## Files
- `AGENTS.md` — Codex operating safeguards and creative rules
- `data/prices.csv` — versioned, reviewed numbers
- `data/campaigns.json` — five-card copy for each of three campaigns
- `scripts/generate.py` — deterministic drafts (Pillow; no AI API)
- `scripts/review_prices.py` — extracts searchable PDF text to a review report, never changes CSV
- `.github/workflows/selena-ad-drafts.yml` — runs on relevant edits after the PR is merged

## Local run (optional)
Install Python 3.11 and Pillow: `pip install pillow`.
`python selena-ads/scripts/generate.py`
Outputs to `selena-ads/generated/` (locally), ignored by git. The GitHub workflow uploads separate generated artifacts.

**Limits:** This is real file-change automation, not automatic monitoring of attachments uploaded inside ChatGPT/Codex chats; those inputs must reach the repository. The templates update prices and create reviewable image drafts but do not independently search the internet or invent new campaigns.
