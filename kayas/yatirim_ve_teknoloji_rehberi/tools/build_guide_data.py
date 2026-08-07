#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import Table
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl

if len(sys.argv)!=3:
    raise SystemExit("usage: build_guide_data.py INPUT.docx OUTPUT.js")
src=Path(sys.argv[1]); out=Path(sys.argv[2])
doc=Document(src)

def blocks(parent):
    for child in parent.element.body.iterchildren():
        if isinstance(child,CT_P): yield Paragraph(child,parent)
        elif isinstance(child,CT_Tbl): yield Table(child,parent)

front=[]; chapters=[]; current=None
for block in blocks(doc):
    if isinstance(block,Paragraph):
        text=' '.join(block.text.split())
        style=block.style.name if block.style else ''
        if not text: continue
        if style in ('Heading 1','Appendix Heading'):
            current={'id':None,'title':text,'kind':'appendix' if style=='Appendix Heading' else 'chapter','blocks':[]}
            chapters.append(current); continue
        target=front if current is None else current['blocks']
        if style=='Heading 2': target.append({'type':'h2','text':text})
        elif style=='List Bullet': target.append({'type':'li','text':text})
        elif style=='Caption': target.append({'type':'caption','text':text})
        else: target.append({'type':'p','text':text})
    else:
        rows=[]
        for row in block.rows:
            cells=[' '.join(c.text.split()) for c in row.cells]
            if any(cells): rows.append(cells)
        if rows: (front if current is None else current['blocks']).append({'type':'table','rows':rows})

n=0
for c in chapters:
    if c['kind']=='chapter' and c['title']!='Bu rehber nasıl okunmalı?':
        n+=1;c['id']=f'{n:02d}'
    elif c['title']=='Bu rehber nasıl okunmalı?': c['id']='00'
    else:
        m=re.search(r'EK\s+([A-Z])',c['title']);c['id']='EK-'+(m.group(1) if m else 'X')

payload={
 'schemaVersion':'KAYAS_DC_GUIDE_WEB_V1',
 'source':{'title':'KAYAS Veri Merkezi Yatırım ve Teknoloji Rehberi','projectCode':'KAYAS-DC-GUIDE','webRelease':'v1.0','sourceDocument':src.name,'sourcePdf':'KAYAS_DC_Yatirim_ve_Teknoloji_Rehberi_v3.2_Editorial_Editable_Final.pdf','preparedBy':'Önder Yardaş','sourceDate':'2026'},
 'currentBaseline':{'status':'H3C PROPOSAL / OPEN-CONFIRMATION REQUIRED','itCabinetsTotal':206,'airCooledCabinets':196,'airCooledKwPerCabinet':7,'liquidCooledCabinets':10,'liquidCooledKwPerCabinet':60,'itLoadKw':1972,'longTermCabinetsApprox':2000,'tierTarget':'Tier III','naturalWaterCApprox':8,'location':'Kahramanmaraş / Türkoğlu / Ceceli','scopeNote':'206 sayısının yalnız IT kabinetlerini kapsadığı kabulü H3C yazılı teyidine tabidir. In-row klima, güç dağıtım kabineti, CDU ve diğer yardımcı ekipmanlar ayrı fiziksel ekipman sayımı olarak ele alınmalıdır.'},
 'front':front,'chapters':chapters
}
out.write_text('window.KAYAS_GUIDE='+json.dumps(payload,ensure_ascii=False,separators=(",",":"))+';\n',encoding='utf-8')
print(f'chapters={n} total_entries={len(chapters)} bytes={out.stat().st_size}')
