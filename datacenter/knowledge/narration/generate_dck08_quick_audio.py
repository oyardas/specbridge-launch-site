#!/usr/bin/env python3
import difflib,json,os,re,sys,time,unicodedata
from pathlib import Path
from mutagen.mp3 import MP3
from num2words import num2words
from openai import OpenAI
ROOT=Path(__file__).resolve().parents[3]
MASTER=ROOT/'datacenter'/'knowledge'/'narration'/'DC-K08_QUICK_NARRATION_TR_V1.md'
CONFIG=ROOT/'datacenter'/'narration'/'PRODUCTION_VOICE_TR_V1.json'
OUT=ROOT/'datacenter'/'knowledge'/'audio'/'production'/'tr'/'dc-k08-quick-v1'
CH_RE=re.compile(r'^## \[(K08-Q)\]\s+(.+?)\s*$',re.MULTILINE); NUM_RE=re.compile(r'\d+(?:[\.,]\d+)?'); CITATION_RE=re.compile(r'\[R\d+\]|https?://',re.I)
CANON={'eks seks':'x86','iks seks':'x86','x 86':'x86','x86':'x86','si pi yu':'cpu','c p u':'cpu','cpu':'cpu','enyu em ey':'numa','n u m a':'numa','numa':'numa','pi si ay i':'pcie','p c i e':'pcie','pcie':'pcie','si eks el':'cxl','c x l':'cxl','cxl':'cxl','en vi em i':'nvme','n v m e':'nvme','nvme':'nvme','bi em si':'bmc','b m c':'bmc','bmc':'bmc','yu i ef ay':'uefi','u e f i':'uefi','uefi':'uefi','redfiş':'redfish','red fish':'redfish','redfish':'redfish','ti pi em':'tpm','t p m':'tpm','tpm':'tpm','ey si pi ay':'acpi','a c p i':'acpi','acpi':'acpi','reys':'ras','r a s':'ras','ras':'ras','hay si ay':'hci','h c i':'hci','hci':'hci','es di es':'sds','s d s':'sds','sds':'sds','es el ey':'sla','s l a':'sla','sla':'sla','ti si o':'tco','t c o':'tco','tco':'tco'}
def trnum(v):
    if ',' in v or '.' in v:
        sep=',' if ',' in v else '.'; a,b=v.split(sep,1); return num2words(int(a),lang='tr')+' virgül '+' '.join(num2words(int(x),lang='tr') for x in b if x.isdigit())
    return num2words(int(v),lang='tr')
def norm(t):
    t=NUM_RE.sub(lambda m:trnum(m.group(0)),t.casefold()).replace('’',"'")
    for a,b in CANON.items(): t=t.replace(a,b)
    t=re.sub(r"[^a-z0-9çğıöşü\s']",' ',t); return re.sub(r'\s+',' ',t).strip()
def sim(a,b): return difflib.SequenceMatcher(None,norm(a).split(),norm(b).split()).ratio()
def tail_score(a,b,n=8):
    sa=norm(a).split()[-n:]; sb=norm(b).split()[-max(n*3,n):]; return difflib.SequenceMatcher(None,sa,sb[-len(sa):]).ratio() if sa else 1.0
def slug(s):
    s=s.translate(str.maketrans({'ç':'c','ğ':'g','ı':'i','İ':'i','ö':'o','ş':'s','ü':'u','Ç':'c','Ğ':'g','Ö':'o','Ş':'s','Ü':'u'})); return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')[:72]
def extract(md):
    m=CH_RE.search(md)
    if not m:return None
    return {'id':m.group(1),'title':m.group(2).strip(),'text':re.sub(r'^---\s*$','',md[m.end():],flags=re.MULTILINE).strip()}
def source_qa(c):
    e=[]; words=[]; tail=''
    if not c:e.append('missing K08-Q chapter')
    else:
        words=norm(c['text']).split(); tail=c['text'].rstrip()[-1:] if c['text'].strip() else ''
        if len(words)<500:e.append(f'too short: {len(words)} words')
        if len(words)>900:e.append(f'too long: {len(words)} words')
        if tail not in '.!?':e.append('incomplete final sentence')
        if CITATION_RE.search(c['text']):e.append('citation/url residue')
    r={'version':'DC_K08_QUICK_SOURCE_QA_V1','chapter_count':1 if c else 0,'source_words':len(words),'final_char':tail,'errors':e,'accepted':not e}; print(json.dumps(r,ensure_ascii=False,indent=2)); return r
def retry(fn,label):
    for n in range(3):
        try:return fn()
        except Exception as e:
            if n==2:raise
            print(f'{label}: {e}',file=sys.stderr); time.sleep(2**(n+1))
def main():
    validate='--validate-source' in sys.argv; c=extract(MASTER.read_text(encoding='utf-8')); qa=source_qa(c)
    if not qa['accepted']:return 3
    if validate:return 0
    if not os.getenv('OPENAI_API_KEY'):return 2
    cfg=json.loads(CONFIG.read_text(encoding='utf-8')); vc=cfg['voice']; acc=cfg['acceptance']; client=OpenAI(); OUT.mkdir(parents=True,exist_ok=True)
    base='k08-quick-'+slug(c['title']); audio=OUT/f'{base}.mp3'; src=OUT/f'{base}.source.txt'; txp=OUT/f'{base}.transcript.txt'; src.write_text(c['text']+'\n',encoding='utf-8'); accepted=None; attempts=[]
    for attempt in range(1,4):
        def tts():
            r=client.audio.speech.create(model=cfg['model'],voice=vc['voice'],input=c['text'],instructions=vc['instructions'],response_format='mp3',speed=float(vc['speed'])); r.write_to_file(audio)
        retry(tts,f'tts attempt {attempt}')
        def transcribe():
            with audio.open('rb') as f:return client.audio.transcriptions.create(model=cfg['transcription_model'],file=f,response_format='text')
        tx=retry(transcribe,'transcribe'); text=(tx if isinstance(tx,str) else getattr(tx,'text',str(tx))).strip(); txp.write_text(text+'\n',encoding='utf-8')
        sw=norm(c['text']).split(); tw=norm(text).split(); ratio=sim(c['text'],text); wr=len(tw)/len(sw) if sw else 0; size=audio.stat().st_size; dur=round(MP3(audio).info.length,3); tail=tail_score(c['text'],text,int(acc.get('tail_word_count',8)))
        passed=ratio>=float(acc['minimum_transcript_similarity']) and float(acc['minimum_word_count_ratio'])<=wr<=float(acc['maximum_word_count_ratio']) and size>=int(acc['minimum_audio_bytes']) and tail>=0.62
        rec={'attempt':attempt,'duration_seconds':dur,'bytes':size,'source_words':len(sw),'transcript_words':len(tw),'word_count_ratio':round(wr,4),'transcript_similarity':round(ratio,4),'tail_score':round(tail,4),'accepted':passed}; attempts.append(rec); print(json.dumps(rec,ensure_ascii=False))
        if passed:accepted=rec; break
    result={'id':'K08-Q','title':c['title'],'audio':str(audio.relative_to(ROOT)),'source':str(src.relative_to(ROOT)),'transcript':str(txp.relative_to(ROOT)),'attempts':attempts,'automatic_acceptance':accepted is not None}
    if accepted:result.update(accepted)
    m={'version':'DC_K08_QUICK_AUDIO_V1','voice':vc,'chapter_count':1,'accepted_count':1 if accepted else 0,'failed_count':0 if accepted else 1,'total_duration_seconds':accepted['duration_seconds'] if accepted else 0,'source_qa':qa,'chapters':[result]}; (OUT/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); print(json.dumps(m,ensure_ascii=False,indent=2)); return 0 if accepted else 1
if __name__=='__main__':raise SystemExit(main())
