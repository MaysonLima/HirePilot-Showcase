import {useEffect,useMemo,useState} from 'react'
import {Kanban,Plus,Search,Trash2,FolderPlus,ExternalLink,FileText,Mail,Radar,ChartNoAxesCombined,GraduationCap,Save,X,RefreshCw,Sparkles,Settings2,Sun,Moon,Monitor,Languages,LockKeyhole} from 'lucide-react'
import {translate,LANGUAGE_NAMES} from './i18n'
import type {TranslationKey} from './i18n'
import {usePreferences} from './usePreferences'
type Stage='preparing'|'applied'|'tests'|'interviews'|'closed'
type WorkMode='remote'|'hybrid'|'onsite'|'unknown'
type Job={id:number;company:string;title:string;stage:Stage;work_mode:WorkMode;contract:string;level:string;location:string;source_url:string|null;applied_at:string|null;deadline_at:string|null;description:string;notes:string;folder_path:string|null;outcome:string}
const stages:{id:Stage;name:string;color:string}[]=[
{id:'preparing',name:'Preparando',color:'#8A9AB4'},{id:'applied',name:'Inscrição enviada',color:'#3165E8'},{id:'tests',name:'Testes e desafios',color:'#E5A82A'},{id:'interviews',name:'Entrevistas',color:'#886BDA'},{id:'closed',name:'Finalizadas',color:'#16AC92'}]
const empty={company:'',title:'',stage:'preparing' as Stage,work_mode:'unknown' as WorkMode,contract:'unknown',level:'unknown',location:'',source_url:'',applied_at:'',deadline_at:'',description:'',notes:'',outcome:'unknown'}
type Draft=typeof empty
type Page='board'|'stats'|'radar'|'resume'|'coach'|'mail'|'settings'
const stageKeys:Record<Stage,TranslationKey>={preparing:'stagePreparing',applied:'stageApplied',tests:'stageTests',interviews:'stageInterviews',closed:'stageClosed'}
const menuKeys:Record<Page,TranslationKey>={board:'navBoard',stats:'navStats',radar:'navRadar',resume:'navResume',coach:'navCoach',mail:'navMail',settings:'navSettings'}
const optionKeys:Record<string,TranslationKey>={unknown:'unknown',remote:'remote',hybrid:'hybrid',onsite:'onsite',internship:'internship',clt:'clt',pj:'pj',freelance:'freelance',trainee:'trainee',junior:'junior',mid:'mid',senior:'senior',approved:'approved',rejected:'rejected',withdrawn:'withdrawn'}
const themeChoices=[{id:'light',key:'settingsLight',icon:Sun},{id:'dark',key:'settingsDark',icon:Moon},{id:'system',key:'settingsSystem',icon:Monitor}] as const
async function api<T>(path:string,method='GET',body?:unknown):Promise<T>{
  let response:Response
  try {response=await fetch('/api'+path,{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined})}
  catch {throw new Error('API indisponível. Inicie o servidor Python na porta 8000.')}
  if(!response.ok){const info=await response.json().catch(()=>({}));throw new Error(typeof info.detail==='string'?info.detail:'Falha na operação ('+response.status+')')}
  return response.status===204?undefined as T:response.json()
}
const menus:{id:Page;name:string;icon:typeof Kanban}[]=[
{id:'board',name:'Candidaturas',icon:Kanban},{id:'stats',name:'Estatísticas',icon:ChartNoAxesCombined},
{id:'radar',name:'Job Radar',icon:Radar},{id:'resume',name:'Resume AI',icon:FileText},
{id:'coach',name:'Interview Coach',icon:GraduationCap},{id:'mail',name:'Mail Tracker',icon:Mail},{id:'settings',name:'Configurações',icon:Settings2}]
const options={work_mode:[['unknown','Não informado'],['remote','Remoto'],['hybrid','Híbrido'],['onsite','Presencial']],contract:[['unknown','Não informado'],['internship','Estágio'],['clt','CLT'],['pj','PJ'],['freelance','Freelancer']],level:[['unknown','Não informado'],['internship','Estágio'],['trainee','Trainee'],['junior','Júnior'],['mid','Pleno'],['senior','Sênior']],outcome:[['unknown','Não definido'],['approved','Aprovado'],['rejected','Reprovado'],['withdrawn','Desistência']]}
export default function App(){
 const {language,setLanguage,theme,setTheme}=usePreferences()
 const t=(key:TranslationKey)=>translate(language,key)
 const optionLabel=(code:string)=>t(optionKeys[code]??'unknown')
 const menuLabel=(id:Page)=>t(menuKeys[id])
 const [jobs,setJobs]=useState<Job[]>([]),[page,setPage]=useState<Page>('board'),[search,setSearch]=useState(''),[filter,setFilter]=useState('all')
 const [editing,setEditing]=useState<Job|null|undefined>(undefined),[draft,setDraft]=useState<Draft>({...empty})
 const [error,setError]=useState(''),[info,setInfo]=useState(''),[busy,setBusy]=useState(false),[drag,setDrag]=useState<number|null>(null)
 async function reload(){try{setJobs(await api<Job[]>('/jobs'));setError('')}catch(e){setError((e as Error).message)}}
 useEffect(()=>{void reload()},[])
 const shown=useMemo(()=>jobs.filter(j=>(filter==='all'||j.work_mode===filter)&&[j.company,j.title,j.notes,j.location].some(x=>x.toLowerCase().includes(search.toLowerCase()))),[jobs,search,filter])
 function edit(job:Job|null){setEditing(job);setDraft(job?{company:job.company,title:job.title,stage:job.stage,work_mode:job.work_mode,contract:job.contract,level:job.level,location:job.location,source_url:job.source_url||'',applied_at:job.applied_at||'',deadline_at:job.deadline_at||'',description:job.description,notes:job.notes,outcome:job.outcome}:{...empty})}
 async function operation(fn:()=>Promise<void>){setBusy(true);setError('');setInfo('');try{await fn();await reload()}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 function update(key:keyof Draft,value:string){setDraft(v=>({...v,[key]:value}))}
 async function save(e:React.FormEvent){e.preventDefault();await operation(async()=>{const payload={...draft,source_url:draft.source_url||null,applied_at:draft.applied_at||null,deadline_at:draft.deadline_at||null};if(editing)await api('/jobs/'+editing.id,'PATCH',payload);else await api('/jobs','POST',payload);setEditing(undefined)})}
 async function move(id:number,stage:Stage){await operation(async()=>{await api('/jobs/'+id,'PATCH',{stage})})}
 async function remove(){if(!editing||!confirm(t('deleteConfirm')))return;await operation(async()=>{await api('/jobs/'+editing.id,'DELETE');setEditing(undefined)})}
 async function folder(){if(!editing)return;await operation(async()=>{const r=await api<{path:string}>('/jobs/'+editing.id+'/folder','POST');setInfo(t('folderSuccess')+' '+r.path);setEditing(undefined)})}
 function exportCsv(){const keys=['company','title','stage','work_mode','contract','level','location','source_url','applied_at','deadline_at','notes'] as const;const csv=[keys.join(';'),...jobs.map(j=>keys.map(k=>'"'+String(j[k]??'').replaceAll('"','""').replace(/^[=+\-@]/,"'")+'"').join(';'))].join('\r\n');const u=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));const a=document.createElement('a');a.href=u;a.download='hirepilot-vagas.csv';a.click();URL.revokeObjectURL(u)}
 return <div className="shell"><aside className="sidebar"><div className="brand"><img className="brand-logo brand-logo-light" src="/hirepilot-wordmark-light.png" alt="HirePilot"/><img className="brand-logo brand-logo-dark" src="/hirepilot-wordmark-dark.png" alt="HirePilot"/></div><p className="overline">{t('workspace')}</p>{menus.map(m=>{const Icon=m.icon;return <button key={m.id} className={'nav '+(page===m.id?'active':'')} onClick={()=>setPage(m.id)}><Icon size={18}/>{menuLabel(m.id)}{m.id==='board'&&<em>{jobs.length}</em>}</button>})}<div className="sidebar-footer"><span className="dot"/>{t('localStorage')}<br/><small>v0.1 — MVP</small></div></aside>
 <div className="main-wrap"><header className="topbar"><span>{t('topWorkspace')} / <b>{menuLabel(page)}</b></span><span className="local"><span className="dot"/>{t('local')}</span></header>
 <main><div className="heading"><div><small className="overline">{t('appWorkspace')}</small><h1>{page==='board'?t('boardHeading'):menuLabel(page)}</h1><p>{page==='board'?t('boardIntro'):page==='settings'?t('settingsIntro'):t('generalIntro')}</p></div>{page==='board'&&<button className="primary" onClick={()=>edit(null)}><Plus size={18}/> {t('newApplication')}</button>}</div>
 {error&&<div className="alert error" role="alert">{error}<button onClick={()=>setError('')} aria-label={t('close')}>×</button></div>}{info&&<div className="alert">{info}<button onClick={()=>setInfo('')} aria-label={t('close')}>×</button></div>}
 {(page==='board'||page==='stats')&&<div className="metrics">{[{name:t('totalJobs'),n:jobs.length},{name:t('activeJobs'),n:jobs.filter(j=>j.stage!=='closed').length},{name:t('interviews'),n:jobs.filter(j=>j.stage==='interviews').length},{name:t('closedJobs'),n:jobs.filter(j=>j.stage==='closed').length}].map(c=><div className="metric" key={c.name}><span>{c.name}</span><strong>{c.n}</strong><small>{t('metricSuffix')}</small></div>)}</div>}
 {page==='board'&&<><div className="toolbar"><h2>{t('opportunities')}</h2><div className="toolbar-controls"><div className="search"><Search size={17}/><input aria-label={t('searchLabel')} placeholder={t('searchPlaceholder')} value={search} onChange={e=>setSearch(e.target.value)}/></div><select aria-label={t('filterLabel')} value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{t('allModes')}</option>{options.work_mode.map(([k])=><option key={k} value={k}>{optionLabel(k)}</option>)}</select><button className="icon-button" title={t('refresh')} onClick={()=>void reload()}><RefreshCw size={17}/></button></div></div><div className="board" aria-label={t('boardAria')}>{stages.map(s=><section className="column" key={s.id} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(drag!==null)void move(drag,s.id);setDrag(null)}}><div className="column-header"><i style={{background:s.color}}/><strong>{t(stageKeys[s.id])}</strong><span>{shown.filter(j=>j.stage===s.id).length}</span></div>{shown.filter(j=>j.stage===s.id).map(j=><article key={j.id} className="job" draggable onDragStart={()=>setDrag(j.id)} onDragEnd={()=>setDrag(null)}><button className="job-title" onClick={()=>edit(j)}><span className="initials">{j.company.substring(0,2).toUpperCase()}</span><strong>{j.company}</strong></button><button className="job-role" onClick={()=>edit(j)}>{j.title}</button><div className="tags"><span>{optionLabel(j.work_mode)}</span>{j.contract!=='unknown'&&<span>{optionLabel(j.contract)}</span>}</div><div className="job-bottom"><small>{j.applied_at?t('sentOn')+' '+j.applied_at.split('-').reverse().join('/'):t('notSent')}</small>{j.source_url&&<a href={j.source_url} target="_blank" rel="noopener noreferrer" title={t('openPosting')}><ExternalLink size={15}/></a>}</div><div className="move-buttons">{stages.findIndex(t=>t.id===s.id)>0&&<button title={t('previousStage')} onClick={()=>void move(j.id,stages[stages.findIndex(t=>t.id===s.id)-1].id)}>←</button>}{stages.findIndex(t=>t.id===s.id)<4&&<button title={t('nextStage')} onClick={()=>void move(j.id,stages[stages.findIndex(t=>t.id===s.id)+1].id)}>→</button>}</div></article>)}<button className="add-card" onClick={()=>edit(null)}><Plus size={15}/> {t('addJob')}</button></section>)}</div><p className="hint">{t('dragHint')}</p></>}
 {page==='stats'&&<div className="coming"><h2>{t('statsTitle')}</h2><p>{t('statsIntro')}</p><button className="primary" onClick={exportCsv}>{t('exportCsv')}</button></div>}
 {!['board','stats','settings'].includes(page)&&<div className="coming"><div className="coming-icon"><Sparkles size={30}/></div><h2>{t('plannedTitle')}</h2><p>{({radar:t('radarIntro'),resume:t('resumeIntro'),coach:t('coachIntro'),mail:t('mailIntro')} as Record<string,string>)[page]}</p><p>{t('plannedIntro')}</p><button className="secondary" onClick={()=>setPage('board')}>{t('backToBoard')}</button></div>}

 {page==='settings'&&<div className="settings-layout">
  <section className="settings-card" aria-labelledby="appearance-title">
   <div className="settings-card-head">
    <div className="settings-card-icon"><Sun size={22}/></div>
    <div><h2 id="appearance-title">{t('settingsAppearance')}</h2><p>{t('settingsAppearanceDesc')}</p></div>
   </div>
   <div className="preference-options" role="group" aria-label={t('settingsAppearance')}>
    {themeChoices.map(choice=>{const Icon=choice.icon;return <label className={'preference-option '+(theme===choice.id?'chosen':'')} key={choice.id}>
      <input type="radio" name="hirepilot-theme" value={choice.id} checked={theme===choice.id} onChange={()=>setTheme(choice.id)}/>
      <Icon size={22}/><strong>{t(choice.key)}</strong>
      {theme===choice.id&&<span className="preference-check" aria-hidden="true">✓</span>}
    </label>})}
   </div>
   <p className="settings-hint">{t('settingsSystemDesc')} · {t('settingsPreview')}</p>
  </section>
  <section className="settings-card" aria-labelledby="language-title">
   <div className="settings-card-head">
    <div className="settings-card-icon"><Languages size={22}/></div>
    <div><h2 id="language-title">{t('settingsLanguage')}</h2><p>{t('settingsLanguageDesc')}</p></div>
   </div>
   <div className="preference-options languages" role="group" aria-label={t('settingsLanguage')}>
    {LANGUAGE_NAMES.map(choice=><label className={'preference-option '+(language===choice.id?'chosen':'')} key={choice.id}>
      <input type="radio" name="hirepilot-language" value={choice.id} checked={language===choice.id} onChange={()=>setLanguage(choice.id)}/>
      <span className="language-short">{choice.short}</span><strong>{choice.label}</strong>
      {language===choice.id&&<span className="preference-check" aria-hidden="true">✓</span>}
    </label>)}
   </div>
   <p className="settings-hint">{t('settingsSaved')}</p>
  </section>
  <section className="settings-card privacy-card">
   <div className="settings-card-head">
    <div className="settings-card-icon"><LockKeyhole size={22}/></div>
    <div><h2>{t('settingsPrivacy')}</h2><p>{t('settingsPrivacyDesc')}</p></div>
   </div>
  </section>
 </div>}
  </main></div>
 {editing!==undefined&&<div className="backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setEditing(undefined)}}><div className="dialog" role="dialog" aria-modal="true" aria-label={t('editApplication')}><div className="dialog-head"><div><small className="overline">{t('formSection')}</small><h2>{editing?t('editApplication'):t('formNew')}</h2></div><button className="icon-button" onClick={()=>setEditing(undefined)} aria-label={t('close')}><X size={21}/></button></div><form onSubmit={e=>void save(e)}><div className="form-grid"><label>{t('company')} *<input required maxLength={160} value={draft.company} onChange={e=>update('company',e.target.value)} placeholder={t('companyPlaceholder')}/></label><label>{t('role')} *<input required maxLength={200} value={draft.title} onChange={e=>update('title',e.target.value)} placeholder={t('rolePlaceholder')}/></label><label>{t('stage')}<select value={draft.stage} onChange={e=>update('stage',e.target.value)}>{stages.map(s=><option key={s.id} value={s.id}>{t(stageKeys[s.id])}</option>)}</select></label>{(['work_mode','contract','level','outcome'] as const).map(key=><label key={key}>{({work_mode:t('workMode'),contract:t('contract'),level:t('level'),outcome:t('outcome')})[key]}<select value={draft[key]} onChange={e=>update(key,e.target.value)}>{options[key].map(([k])=><option key={k} value={k}>{optionLabel(k)}</option>)}</select></label>)}<label>{t('location')}<input value={draft.location} onChange={e=>update('location',e.target.value)}/></label><label>{t('applicationDate')}<input type="date" value={draft.applied_at} onChange={e=>update('applied_at',e.target.value)}/></label><label>{t('deadline')}<input type="date" value={draft.deadline_at} onChange={e=>update('deadline_at',e.target.value)}/></label><label className="wide">{t('postingUrl')}<input type="url" placeholder={t('postingPlaceholder')} value={draft.source_url} onChange={e=>update('source_url',e.target.value)}/></label><label className="wide">{t('description')}<textarea rows={4} maxLength={20000} value={draft.description} onChange={e=>update('description',e.target.value)} placeholder={t('descriptionPlaceholder')}/></label><label className="wide">{t('notes')}<textarea rows={3} maxLength={20000} value={draft.notes} onChange={e=>update('notes',e.target.value)}/></label></div>{editing?.folder_path&&<p className="folder-text">{editing.folder_path}</p>}<div className="form-actions">{editing&&<><button type="button" className="danger" disabled={busy} onClick={()=>void remove()}><Trash2 size={16}/> {t('remove')}</button><button type="button" className="secondary" disabled={busy} onClick={()=>void folder()}><FolderPlus size={16}/> {t('createFolder')}</button></>}<span className="spacer"/><button type="button" className="secondary" onClick={()=>setEditing(undefined)}>{t('cancel')}</button><button type="submit" className="primary" disabled={busy||!draft.company.trim()||!draft.title.trim()}><Save size={16}/>{busy?t('saving'):t('saveJob')}</button></div></form></div></div>}
 </div>
}
