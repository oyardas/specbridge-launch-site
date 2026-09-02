#!/usr/bin/env python3
import argparse,difflib,json,os,re,sys,time,unicodedata
from pathlib import Path
from mutagen.mp3 import MP3
from num2words import num2words
from openai import OpenAI

ROOT=Path(__file__).resolve().parents[3]
MASTER=ROOT/'datacenter'/'knowledge'/'narration'/'DC-K03_FULL_NARRATION_TR_V2.md'
CONFIG=ROOT/'datacenter'/'narration'/'PRODUCTION_VOICE_TR_V1.json'
OUT=ROOT/'datacenter'/'knowledge'/'audio'/'production'/'tr'/'dc-k03-v2'
CH_RE=re.compile(r'^## \[(K03-\d{2})\]\s+(.+?)\s*$',re.MULTILINE)
NUM_RE=re.compile(r'\d+(?:[\.,]\d+)?')
CITATION_RE=re.compile(r'\[R\d+\]|https?://',re.I)
EXPECTED=[f'K03-{i:02d}' for i in range(8)]

CANON={
    'ci pi yu':'cpu','cipiyu':'cpu','ci pi yu lar':'cpu',
    'ci pi yu':'cpu','ci pi yu':'cpu','cipiyu':'cpu',
    'cipiyu':'cpu','ci pi yu':'cpu','ci pi yu':'cpu',
    'gpu':'gpu','ci pi yu':'cpu','em ci eks':'mgx','emcieks':'mgx',
    'or vi üç':'orv3','or v üç':'orv3','orv üç':'orv3','orv3':'orv3',
    'open yu':'openu','open u':'openu','openyu':'openu',
    'or dablyu':'orw','or double yu':'orw','orw':'orw',
    'ar di eyç eks':'rdhx','rd eyç eks':'rdhx','rdhx':'rdhx',
    'si di yu':'cdu','c d u':'cdu','cdu':'cdu',
    'ti si es':'tcs','t c s':'tcs','tcs':'tcs',
    'pi di yu':'pdu','p d u':'pdu','pdu':'pdu',
    'en vi link':'nvlink','nv link':'nvlink','nvlink':'nvlink',
    'en vi el':'nvl','nvl':'nvl','kapeks':'capex','opeks':'opex',
    'haybrid':'hybrid','kolokeyşın':'colocation','kolokasyon':'colocation'
}

def trnum(v):
    if ',' in v or '.' in v:
        sep=',' if ',' in v else '.'
        a,b=v.split(sep,1)
        return num2words(int(a),lang='tr')+' virgül '+' '.join(num2words(int(x),lang='tr') for x in b if x.isdigit())
    return num2words(int(v),lang='tr')

def norm(t):
    t=NUM_RE.sub(lambda m:trnum(m.group(0)),t.casefold()).replace('’',"'")
    for a,b in CANON.items(): t=t.replace(a,b)
    t=re.sub(r"[^a-z0-9çğıöşü\s']",' ',t)
    return re.sub(r'\s+',' ',t).strip()

def sim(a,b):
    return difflib.SequenceMatcher(None,norm(a).split(),norm(b).split()).ratio()

def tail_score(a,b,n=12):
    sa=norm(a).split()[-n:]
    sb=norm(b).split()[-max(n*3,n):]
    if not sa:return 1.0
    return difflib.SequenceMatcher(None,sa,sb[-len(sa):]).ratio()

def slug(s):
    s=s.translate(str.maketrans({'ç':'c','ğ':'g','ı':'i','İ':'i','ö':'o','ş':'s','ü':'u','Ç':'c','Ğ':'g','Ö':'o','Ş':'s','Ü':'u'}))
    return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')[:72]

def extract(md):
    ms=list(CH_RE.finditer(md)); out=[]
    for i,m in enumerate(ms):
        block=md[m.end():ms[i+1].start() if i+1<len(ms) else len(md)]
        block=re.sub(r'^---\s*$','',block,flags=re.MULTILINE).strip()
        out.append({'id':m.group(1),'title':m.group(2).strip(),'text':block})
    return out

def source_qa(chapters):
    errors=[]; rows=[]
    ids=[c['id'] for c in chapters]
    if ids!=EXPECTED: errors.append(f'chapter contract failed: {ids}')
    if len({c['title'] for c in chapters})!=len(chapters): errors.append('duplicate chapter title')
    for c in chapters:
        words=norm(c['text']).split()
        tail=c['text'].rstrip()[-1:] if c['text'].strip() else ''
        row={'id':c['id'],'title':c['title'],'source_words':len(words),'final_char':tail}
        rows.append(row)
        if len(words)<450: errors.append(f"{c['id']} too short: {len(words)} words")
        if len(words)>1200: errors.append(f"{c['id']} too long: {len(words)} words")
        if tail not in '.!?': errors.append(f"{c['id']} incomplete final sentence")
        if CITATION_RE.search(c['text']): errors.append(f"{c['id']} contains citation/url residue")
        if c['text'].count('Bir sonraki bölüm')>1: errors.append(f"{c['id']} repeated transition phrase")
    result={'version':'DC_K03_NARRATION_SOURCE_QA_V2','chapter_count':len(chapters),'total_source_words':sum(r['source_words'] for r in rows),'chapters':rows,'errors':errors,'accepted':not errors}
    print(json.dumps(result,ensure_ascii=False,indent=2))
    return result

def retry_call(fn,label):
    for n in range(3):
        try:return fn()
        except Exception as e:
            if n==2:raise
            print(f'{label}: {e}',file=sys.stderr); time.sleep(2**(n+1))

def transcribe(client,cfg,audio):
    def call():
        with audio.open('rb') as f:
            return client.audio.transcriptions.create(model=cfg['transcription_model'],file=f,response_format='text')
    tx=retry_call(call,'transcribe '+audio.name)
    return (tx if isinstance(tx,str) else getattr(tx,'text',str(tx))).strip()

def parse_selected(raw):
    if not raw:return set(EXPECTED)
    vals={x.strip().upper() for x in raw.split(',') if x.strip()}
    bad=sorted(vals-set(EXPECTED))
    if bad:raise ValueError(f'unknown chapter ids: {bad}')
    return vals

def previous_results(selected):
    if selected==set(EXPECTED):return {}
    manifest=OUT/'manifest.json'
    if not manifest.exists():raise RuntimeError('selective regeneration requires an existing artifact/manifest')
    old=json.loads(manifest.read_text(encoding='utf-8'))
    if old.get('version')!='DC_K03_GOLDEN_AUDIO_V2':raise RuntimeError('existing manifest version mismatch')
    return {x['id']:x for x in old.get('chapters',[]) if x.get('automatic_acceptance') is True}

def files_exist(rec):
    for k in ('audio','source','transcript'):
        p=ROOT/rec.get(k,'')
        if not p.is_file() or p.stat().st_size==0:return False
    return True

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--validate-source',action='store_true')
    ap.add_argument('--chapters',default='',help='comma-separated failed chapter ids for selective regeneration')
    args=ap.parse_args()
    chapters=extract(MASTER.read_text(encoding='utf-8'))
    qa=source_qa(chapters)
    if not qa['accepted']: return 3
    if args.validate_source: return 0
    if not os.getenv('OPENAI_API_KEY'):
        print('OPENAI_API_KEY missing',file=sys.stderr); return 2
    try:selected=parse_selected(args.chapters)
    except ValueError as e:
        print(str(e),file=sys.stderr); return 4
    OUT.mkdir(parents=True,exist_ok=True)
    try:prior=previous_results(selected)
    except RuntimeError as e:
        print(str(e),file=sys.stderr); return 5
    if selected!=set(EXPECTED):
        print(json.dumps({'mode':'SELECTIVE_REGENERATION','chapters':sorted(selected)},ensure_ascii=False))
    client=OpenAI(); cfg=json.loads(CONFIG.read_text(encoding='utf-8')); vc=cfg['voice']; acc=cfg['acceptance']
    min_sim=float(acc['minimum_transcript_similarity']); min_wr=float(acc['minimum_word_count_ratio']); max_wr=float(acc['maximum_word_count_ratio'])
    min_bytes=int(acc['minimum_audio_bytes']); tail_n=int(acc.get('tail_word_count',8)); results=[]; failures=[]
    for c in chapters:
        if c['id'] not in selected:
            rec=prior.get(c['id'])
            if not rec or not files_exist(rec):
                print(f"cannot preserve {c['id']}: accepted prior files missing",file=sys.stderr); return 6
            rec={**rec,'preserved_from_prior_artifact':True}
            results.append(rec); continue
        base=f"{c['id'].lower()}-{slug(c['title'])}"
        audio=OUT/f'{base}.mp3'; txp=OUT/f'{base}.transcript.txt'; src=OUT/f'{base}.source.txt'
        src.write_text(c['text']+'\n',encoding='utf-8')
        accepted=None; attempts=[]
        for attempt in range(1,4):
            def tts():
                r=client.audio.speech.create(model=cfg['model'],voice=vc['voice'],input=c['text'],instructions=vc['instructions'],response_format='mp3',speed=float(vc['speed']))
                r.write_to_file(audio)
            retry_call(tts,f"tts {c['id']} attempt {attempt}")
            text=transcribe(client,cfg,audio); txp.write_text(text+'\n',encoding='utf-8')
            ratio=sim(c['text'],text); sw=norm(c['text']).split(); tw=norm(text).split(); wr=len(tw)/len(sw) if sw else 0
            size=audio.stat().st_size; dur=round(MP3(audio).info.length,3); tail=tail_score(c['text'],text,tail_n)
            passed=(ratio>=min_sim and min_wr<=wr<=max_wr and size>=min_bytes and tail>=0.62)
            rec={'attempt':attempt,'duration_seconds':dur,'bytes':size,'source_words':len(sw),'transcript_words':len(tw),'word_count_ratio':round(wr,4),'transcript_similarity':round(ratio,4),'tail_score':round(tail,4),'accepted':passed}
            attempts.append(rec); print(json.dumps({'id':c['id'],**rec},ensure_ascii=False))
            if passed:
                accepted=rec; break
            time.sleep(2)
        result={'id':c['id'],'title':c['title'],'audio':str(audio.relative_to(ROOT)),'source':str(src.relative_to(ROOT)),'transcript':str(txp.relative_to(ROOT)),'attempts':attempts,'automatic_acceptance':accepted is not None}
        if accepted: result.update(accepted)
        else: failures.append(result)
        results.append(result)
    failures=[x for x in results if x.get('automatic_acceptance') is not True]
    manifest={'version':'DC_K03_GOLDEN_AUDIO_V2','voice':vc,'chapter_count':len(results),'accepted_count':len(results)-len(failures),'failed_count':len(failures),'total_duration_seconds':round(sum(float(x.get('duration_seconds',0)) for x in results if x.get('automatic_acceptance') is True),3),'source_qa':qa,'regenerated_chapters':sorted(selected),'chapters':results}
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(manifest,ensure_ascii=False,indent=2))
    return 1 if failures else 0

if __name__=='__main__':
    raise SystemExit(main())
