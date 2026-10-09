#!/usr/bin/env python3
"""Raw PDF/text input extractor: review-only; never overwrite approved prices."""
from pathlib import Path
import os
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.getenv("SELENA_OUTPUT",str(ROOT/"generated")))
OUT.mkdir(parents=True,exist_ok=True)
notes=["# Incoming price sheets: HUMAN REVIEW REQUIRED","","Nothing extracted here modifies data/prices.csv.","Scanned image-only PDFs need human transcription; numbers are never guessed.",""]
folder=ROOT/"price_uploads"
for p in sorted(folder.glob("*")):
 if not p.is_file() or p.name.lower()=="readme.md":continue
 notes.append(f"## {p.name}")
 if p.suffix.lower()==".pdf":
  try:
   import fitz
   doc=fitz.open(str(p))
   t="\n".join(pg.get_text() for pg in doc)
   notes.append(t[:15000] if t.strip() else "[No selectable text. Manually review page images.]")
  except Exception as exc:notes.append("[PDF not parsed. Manual review needed: "+str(exc)+"]")
 elif p.suffix.lower() in (".txt",".csv",".md"):
  notes.append(p.read_text(encoding="utf-8-sig",errors="replace")[:15000])
 else:notes.append("[Image or unsupported file: manually inspect; no OCR.]")
notes.append("\nAfter verifying a new price, update data/prices.csv and commit to trigger new draft renders.")
(OUT/"price-upload-review.md").write_text("\n".join(notes),encoding="utf-8")
print("Source review report created; official prices unchanged.")
