#!/usr/bin/env python3
"""Deterministic zh-TW draft graphics. Never auto-publish."""
import csv,json,os,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.getenv("SELENA_OUTPUT",str(ROOT/"generated")))
FONT_PATHS=[
"/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
"/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
"/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
def font(sz,bold=False):
 p=FONT_PATHS[1 if bold else 0]
 if not Path(p).exists():p=FONT_PATHS[2]
 return ImageFont.truetype(p,sz)
def lines(d,s,max_width,sz,bold=False):
 parts=[]
 for paragraph in s.split("\n"):
  line=""
  for ch in paragraph:
   cand=line+ch
   if line and d.textbbox((0,0),cand,font=font(sz,bold))[2]>max_width:
    parts.append(line);line=ch
   else:line=cand
  parts.append(line)
 return parts
def write(d,s,x,y,max_width,sz=48,fill="#292C2E",bold=False,spacing=15):
 for l in lines(d,s,max_width,sz,bold):
  d.text((x,y),l,font=font(sz,bold),fill=fill)
  y+=sz+spacing
 return y
def validate(prices,campaigns):
 for k,c in campaigns.items():
  if c["price_key"] not in prices:raise ValueError("Missing price key: "+k)
  p=prices[c["price_key"]]
  if p.get("vat")!="excluded" or int(p["price_krw"])<=0:raise ValueError("Unsafe price/tax for "+k)
  if len(c["slides"])!=5:raise ValueError("Expected 5 cards: "+k)
  if any(x["type"] not in ("cover","difference","technology","trust","price") for x in c["slides"]):raise ValueError("Unexpected slide type")
def portrait():
 p=ROOT/"assets"/"portrait.png"
 if p.exists():
  return ImageOps.fit(Image.open(p).convert("RGB"),(1080,1350))
 return None
def make(c,key,slide,idx,price,photo,size=(1080,1350)):
 w,h=1080,1350
 bg="#F4F4F1" if idx%2 else "#F0F2F2"
 im=Image.new("RGB",(w,h),bg)
 d=ImageDraw.Draw(im)
 if idx==1:
  d.rectangle((0,0,w,h),fill="#AAB4BA")
  if photo:im.paste(photo,(0,0))
  shade=Image.new("RGBA",(w,h),(25,31,37,70))
  im=Image.alpha_composite(im.convert("RGBA"),shade).convert("RGB")
  d=ImageDraw.Draw(im)
  d.text((74,72),"SELENA CLINIC",font=font(29,True),fill="white")
  write(d,slide["headline"],72,450,850,74,"white",True,30)
  write(d,slide["subtitle"],78,915,830,34,"white")
 else:
  d.text((74,62),"SELENA CLINIC  |  首爾弘大",font=font(26,True),fill="#343738")
  d.text((920,62),f"0{idx}/05",font=font(28),fill="#343738")
  d.line((74,122,1006,122),fill="#CDD1D2",width=2)
  yy=write(d,slide["headline"],74,205,905,65,"#24292B",True,17)
  yy=write(d,slide["subtitle"],77,max(yy+25,365),900,32,"#6F7376")
  if idx in (2,3,4):
   y=max(yy+90,520)
   for i,t in enumerate(slide.get("items",[])):
    d.rounded_rectangle((77,y,999,y+160),radius=21,fill="white",outline="#D5DADC",width=2)
    d.ellipse((110,y+43,185,y+118),fill="#E2E9EA")
    d.text((134,y+54),str(i+1),font=font(32,True),fill="#2E3D44")
    write(d,t,212,y+48,736,36,"#333739",True)
    y+=193
  else:
   amount="₩"+format(int(price),",")
   yy=max(yy+115,530)
   write(d,amount,71,yy,942,105,"#24282A",True)
   yy+=168
   d.line((74,yy,1003,yy),fill="#CACBC9",width=2)
   yy+=97
   write(d,"LINE 中文諮詢",79,yy,900,50,"#2B3639",True)
   yy+=96
   write(d,slide.get("footnote",""),79,yy,900,26,"#6C7375")
   d.rounded_rectangle((73,1070,1005,1160),radius=15,fill="#386F60")
   d.text((201,1093),"LINE 免費諮詢 · 依醫師評估",font=font(32,True),fill="white")
  d.line((74,1260,1004,1260),fill="#CDD1D2",width=2)
  d.text((76,1278),"未稅｜VAT另計 · 效果與風險因人而異",font=font(23),fill="#6A7073")
 if size==(1080,1080):
  small=im.resize((864,1080),Image.Resampling.LANCZOS)
  sq=Image.new("RGB",(1080,1080),"#F4F4F1")
  sq.paste(small,(108,0))
  return sq
 return im
def run():
 with open(ROOT/"data"/"prices.csv",encoding="utf-8-sig",newline="") as fh:
  prices={row["key"]:row for row in csv.DictReader(fh)}
 campaigns=json.loads((ROOT/"data"/"campaigns.json").read_text(encoding="utf-8"))
 validate(prices,campaigns)
 picture=portrait(); manifest=[]
 for key,c in campaigns.items():
  p=prices[c["price_key"]]
  for idx,slide in enumerate(c["slides"],1):
   for folder,size in (("instagram_4x5",(1080,1350)),("threads_square",(1080,1080))):
    target=OUT/folder
    target.mkdir(parents=True,exist_ok=True)
    image=make(c,key,slide,idx,p["price_krw"],picture,size)
    image.save(target/f"{key}_{idx:02}.png",optimize=True)
   manifest.append(dict(campaign=key,slide=idx,price_krw=int(p["price_krw"]),status="DRAFT_PENDING_APPROVAL"))
 assert len(manifest)==15
 (OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
 review=["# SELENA verification report","Status: DRAFT ONLY — do not publish automatically.","","## Price sources / flags"]
 for key,c in campaigns.items():
  p=prices[c["price_key"]]
  review.append(f"- {key}: ₩{int(p['price_krw']):,} / VAT extra / {p['source']} / status={p['status']}")
 review+=["","Check clinic price, offer validity, Chinese copy, medical ad review, image permissions, and live LINE route before posting."]
 (OUT/"review.md").write_text("\n".join(review),encoding="utf-8")
 print("Rendered 15 cards per format; 30 PNG draft files total. No publishing.")
if __name__=="__main__":run()
