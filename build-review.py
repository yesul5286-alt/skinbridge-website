"""Regenerate Korean owner-review UI from the shared Taiwan preview sources."""
from pathlib import Path
import re
root = Path(__file__).resolve().parent
pairs = [line.split('\t', 1) for line in (root/'review-ko.tsv').read_text(encoding='utf-8').splitlines() if '\t' in line]
translations = dict(pairs)
pattern = re.compile('|'.join(re.escape(key) for key in sorted(translations, key=len, reverse=True)))
out = root/'ko-review'
out.mkdir(exist_ok=True)
for name in ['index.html', 'app.js']:
    text = (root/'tw'/name).read_text(encoding='utf-8-sig')
    text = pattern.sub(lambda match: translations[match.group()], text)
    text = text.replace('src="assets/', 'src="../tw/assets/').replace('href="styles.css"', 'href="../tw/styles.css"').replace('href="favicon.svg"', 'href="../tw/favicon.svg"')
    text = text.replace('lang="zh-TW"', 'lang="ko"', 1).replace('skinbridge.tw.v1', 'skinbridge.ko-review.v1')
    (out/name).write_text(text, encoding='utf-8')
print('Korean review generated: ko-review/index.html and app.js')
