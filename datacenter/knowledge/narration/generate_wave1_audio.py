#!/usr/bin/env python3
import difflib,json,os,re,sys,time,unicodedata
from pathlib import Path
from mutagen.mp3 import MP3
from num2words import num2words
from openai import OpenAI
ROOT=Path(__file__).resolve().parents[3]
MASTER=ROOT/'datacenter'/'knowledge'/'narration'/'WAVE1_MASTER_NARRATION_TR.md'
CONFIG=ROOT/'datacenter'/'narration'/'PRODUCTION_VOICE_TR_V1.json'
OUT=ROOT/'datacenter'/'knowledge'/'audio'/'production'/'tr'
MOD_RE=re.compile(r'^## \[(DC-K\d{2})\]\s+(.+?)\s*$',re.MULTILINE)
NUM_RE=re.compile(r'\d+(?:[\.,]\d+)?')
def trnum(v):
    if ',' in v or '.' in v:
        sep=',' if ',' in v else '.';a,b=v.split(sep,1)
        return num2words(int(a),lang='tr')+' virgül '+' '.join(num2words(int(x),lang='tr') for x in b if x.isdigit())
    return num2words(int(v),lang='tr')
def norm(t):
    t=NUM_RE.sub(lambda m:trnum(m.group(0)),t.casefold()).replace('’',"'")
    return re.sub(r'\s+',' ',re.sub(r"[^a-z0-9çğıöşü\s']",' ',t)).strip()
def sim(a,b):return difflib.SequenceMatcher(None,norm(a).split(),norm(b).split()).ratio()
def slug(s):
    s=s.translate(str.maketrans({'ç':'c','ğ':'g','ı':'i','İ':'i','ö':'o','ş':'s','ü':'u','Ç':'c','Ğ':'g','Ö':'o','Ş':'s','Ü':'u'}))
    return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')[:64]
def extract(md):
    ms=list(MOD_RE.finditer(md));out=[]
    for i,m in enumerate(ms):
        block=md[m.end():ms[i+1].start() if i+1<len(ms) else len(md)]
        block=re.sub(r'^---\s*$','',block,flags=re.MULTILINE).strip()
        out.append({'id':m.group(1),'title':m.group(2).strip(),'text':block})
    return out
def retry(fn,label):
    for n in range(3):
        try:return fn()
        except Exception as e:
            if n==2:raise
            print(label,e,file=sys.stderr);time.sleep(2**(n+1))
def main():
    if not os.getenv('OPENAI_API_KEY'):return 2
    cfg=json.loads(CONFIG.read_text(encoding='utf-8'));mods=extract(MASTER.read_text(encoding='utf-8'))
    ids=[m['id'] for m in mods];expected=[f'DC-K{i:02d}' for i in range(1,6)]
    if ids!=expected:print(f'contract failed {ids}',file=sys.stderr);return 3
    OUT.mkdir(parents=True,exist_ok=True);client=OpenAI();vc=cfg['voice'];acc=cfg['acceptance'];results=[];fails=[]
    for m in mods:
        base=f"{m['id'].lower()}-{slug(m['title'])}";audio=OUT/f'{base}.mp3';txp=OUT/f'{base}.transcript.txt';src=OUT/f'{base}.source.txt';src.write_text(m['text']+'\n',encoding='utf-8')
        def tts():
            r=client.audio.speech.create(model=cfg['model'],voice=vc['voice'],input=m['text'],instructions=vc['instructions'],response_format='mp3',speed=float(vc['speed']));r.write_to_file(audio)
        retry(tts,'tts '+m['id'])
        def trans():
            with audio.open('rb') as f:return client.audio.transcriptions.create(model=cfg['transcription_model'],file=f,response_format='text')
        tx=retry(trans,'tx '+m['id']);text=(tx if isinstance(tx,str) else getattr(tx,'text',str(tx))).strip();txp.write_text(text+'\n',encoding='utf-8')
        ratio=sim(m['text'],text);sw=norm(m['text']).split();tw=norm(text).split();wr=len(tw)/len(sw) if sw else 0;size=audio.stat().st_size;dur=round(MP3(audio).info.length,3)
        passed=ratio>=float(acc['minimum_transcript_similarity']) and .84<=wr<=1.16 and size>=50000
        r={'id':m['id'],'title':m['title'],'audio':str(audio.relative_to(ROOT)),'duration_seconds':dur,'bytes':size,'source_words':len(sw),'transcript_words':len(tw),'word_count_ratio':round(wr,4),'transcript_similarity':round(ratio,4),'automatic_acceptance':passed};results.append(r);fails += ([] if passed else [r]);print(json.dumps(r,ensure_ascii=False))
    manifest={'version':'DC_KNOWLEDGE_WAVE1_AUDIO_V1','voice':vc,'module_count':len(results),'accepted_count':len(results)-len(fails),'failed_count':len(fails),'total_duration_seconds':round(sum(x['duration_seconds'] for x in results),3),'modules':results}
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(manifest,ensure_ascii=False,indent=2));return 1 if fails else 0
if __name__=='__main__':raise SystemExit(main())