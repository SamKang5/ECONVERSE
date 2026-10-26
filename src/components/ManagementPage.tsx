import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, Eye, FileText, Plus, RefreshCw, Save, Send, ShieldCheck, Trash2, Users } from 'lucide-react';
import type { PublicUser } from '../services/api';
import { managementApi, ManagementError, type Analytics, type AuditEntry, type ManagedUser, type Page, type Revision, type RevisionContent, type RevisionStatus } from '../services/management';
import './ManagementPage.css';
import { Collapse, MotionDialog } from './Motion';

function EditorSection({title,disabled,children}:{title:string;disabled:boolean;children:ReactNode}) {
  const [open,setOpen]=useState(true);
  const id=useId();
  const invalidControl=useRef<HTMLInputElement|null>(null);
  useEffect(()=>{
    if(open&&invalidControl.current){const control=invalidControl.current;invalidControl.current=null;control.focus();control.reportValidity();}
  },[open]);
  return <section className="mg-panel mg-editor-section" onInvalidCapture={event=>{
    if(!open){event.preventDefault();invalidControl.current=event.target as HTMLInputElement;setOpen(true);}
  }}><button type="button" className="mg-section-toggle" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>{title}<ChevronDown size={18}/></button><Collapse id={id} open={open}><fieldset disabled={disabled}><legend className="sr-only">{title}</legend>{children}</fieldset></Collapse></section>;
}

type Tab = 'studio' | 'review' | 'users' | 'analytics' | 'audit';
const statusNames: Record<RevisionStatus, string> = { draft: 'Draft', in_review: 'In review', published: 'Published', archived: 'Archived' };
const emptyContent = (): RevisionContent => ({
  moduleId: '', moduleTitle: '', moduleDescription: '', category: 'economics', unitCode: '', episodeCode: '',
  title: '', shortDescription: '', duration: '', videoUrl: '', overview: '', mainContentTitle: '', mainContent: [], objectives: [],
  summary: { title: '', points: [] }, pointsReward: 45, quiz: [],
});
const emptyPage: Page = { total: 0, page: 1, pageSize: 25 };
const lines = (text: string) => text.split('\n');
const date = (value: string) => new Date(value).toLocaleString('vi-VN');

function Pagination({ data, busy, change }: { data: Page; busy: boolean; change: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));
  return <div className="mg-pagination"><span>{data.total} records · Page {data.page} of {pages}</span><div>
    <button type="button" aria-label="Previous page" disabled={busy || data.page <= 1} onClick={() => change(data.page - 1)}><ChevronLeft size={17} /></button>
    <button type="button" aria-label="Next page" disabled={busy || data.page >= pages} onClick={() => change(data.page + 1)}><ChevronRight size={17} /></button>
  </div></div>;
}

function videoEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    let value = '';
    if (host === 'youtu.be') value = parsed.pathname.slice(1);
    if (['youtube.com', 'www.youtube.com', 'www.youtube-nocookie.com'].includes(host)) {
      value = parsed.searchParams.get('v') || parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] || '';
    }
    return /^[A-Za-z0-9_-]{11}$/.test(value) ? `https://www.youtube-nocookie.com/embed/${value}` : null;
  } catch { return null; }
}

export default function ManagementPage({ user, onUserChange }: { user: PublicUser; onUserChange: () => void }) {
  const [tab, setTab] = useState<Tab>('studio');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [records, setRecords] = useState<Revision[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [pagination, setPagination] = useState<Page>(emptyPage);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState<Revision | null>(null);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState<RevisionContent>(emptyContent);
  const [lessonId, setLessonId] = useState('');
  const [preview, setPreview] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [confirmUnpublish,setConfirmUnpublish] = useState(false);
  const [removingQuestion,setRemovingQuestion] = useState(false);
  const removalAnimation = useRef<Animation|null>(null);
  const restoreQuestionFocus = useRef(false);
  const addQuestionRef = useRef<HTMLButtonElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const isAdmin = user.role === 'admin';
  const editable = !selected || selected.status === 'draft';
  const dirty = selected ? JSON.stringify(content) !== JSON.stringify(selected.content) : Boolean(lessonId || JSON.stringify(content) !== JSON.stringify(emptyContent()));
  useEffect(()=>{viewRef.current?.focus({preventScroll:true});},[tab,editing,preview]);
  useEffect(()=>()=>removalAnimation.current?.cancel(),[]);
  useEffect(()=>{
    if(!removingQuestion&&restoreQuestionFocus.current){addQuestionRef.current?.focus({preventScroll:true});restoreQuestionFocus.current=false;}
  },[removingQuestion]);
  async function removeQuestion(id:string,element:HTMLElement) {
    if(removingQuestion)return;
    restoreQuestionFocus.current=true;
    setRemovingQuestion(true);
    element.inert=true;
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    if(!preference.matches) {
      const animation=element.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-6px)'}],{duration:150,easing:'ease-out'});
      removalAnimation.current=animation;
      const finish=()=>{if(preference.matches)animation.finish();};
      preference.addEventListener('change',finish);
      try {await animation.finished;} catch {return;}
      finally {preference.removeEventListener('change',finish);removalAnimation.current=null;}
    }
    setContent(current=>({...current,quiz:current.quiz.filter(question=>question.id!==id)}));
    setRemovingQuestion(false);
  }
  const reload = () => setRefresh(value => value + 1);
  const refreshDeniedSession = (reason: unknown) => {
    if (!(reason instanceof ManagementError) || ![401, 403].includes(reason.status)) return;
    setRecords([]); setUsers([]); setAudit([]); setAnalytics(null);
    setSelected(null); setEditing(false); setPreview(false);
    onUserChange();
  };

  useEffect(() => {
    if (user.role === 'learner') return;
    let cancelled = false;
    setLoading(true);
    setError('');
    const load = async () => {
      try {
        if (tab === 'studio' || tab === 'review') {
          const result = await managementApi.listRevisions(tab === 'review' ? 'in_review' : filter, page);
          if (!cancelled) { setRecords(result.revisions); setPagination(result); }
        } else if (tab === 'users') {
          const result = await managementApi.users(search, page);
          if (!cancelled) { setUsers(result.users); setPagination(result); }
        } else if (tab === 'audit') {
          const result = await managementApi.audit(page);
          if (!cancelled) { setAudit(result.entries); setPagination(result); }
        } else {
          const result = await managementApi.analytics();
          if (!cancelled) setAnalytics(result);
        }
      } catch (reason) {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : 'Could not load the workspace.');
          refreshDeniedSession(reason);
        }
      } finally { if (!cancelled) setLoading(false); }
    };
    void load();
    return () => { cancelled = true; };
  }, [tab, filter, page, search, refresh, user.role]);

  useEffect(() => {
    if (!isAdmin && tab !== 'studio') { setTab('studio'); setEditing(false); }
  }, [isAdmin, tab]);

  if (user.role === 'learner') return <section className="management"><p role="alert">Content Studio requires Editor access.</p></section>;

  async function perform(action: () => Promise<void>, message: string) {
    if (busy) return;
    setBusy(true); setError(''); setSuccess('');
    try { await action(); setSuccess(message); reload(); }
    catch (reason) {
      setError(reason instanceof Error ? `${reason.message}${reason instanceof ManagementError && reason.status === 409 ? ' Reload this revision before making another change.' : ''}` : 'The action could not be completed.');
      refreshDeniedSession(reason);
    } finally { setBusy(false); }
  }

  function openRevision(revision: Revision) {
    setSelected(revision); setContent(structuredClone(revision.content)); setLessonId(revision.lessonId);
    setEditing(true); setPreview(false); setFeedback(''); setError(''); setSuccess('');
  }
  function navigate(next: Tab) {
    setTab(next); setPage(1); setEditing(false); setPreview(false); setError(''); setSuccess('');
  }
  function create() {
    setSelected(null); setContent(emptyContent()); setLessonId(''); setEditing(true); setPreview(false); setError(''); setSuccess('');
  }
  const update = <K extends keyof RevisionContent>(key: K, value: RevisionContent[K]) => setContent(current => ({ ...current, [key]: value }));
  async function persist(): Promise<Revision> {
    if (!lessonId.trim()) throw new Error('Enter a stable Lesson ID before saving.');
    const result = selected
      ? await managementApi.save(selected.id, selected.lockVersion, content)
      : await managementApi.create(lessonId.trim(), content);
    setSelected(result.revision); setContent(structuredClone(result.revision.content));
    return result.revision;
  }
  async function previewSaved() {
    const saved = editable ? await persist() : selected!;
    const result = await managementApi.getRevision(saved.id);
    setSelected(result.revision); setContent(structuredClone(result.revision.content)); setPreview(true);
  }
  async function review(action: 'publish' | 'reject' | 'unpublish') {
    if (!selected) return;
    if (action === 'reject' && !feedback.trim()) throw new Error('Explain the changes needed before rejecting this revision.');
    const result = await managementApi.review(selected.id, action, selected.lockVersion, feedback.trim());
    setSelected(result.revision); setContent(structuredClone(result.revision.content)); setFeedback('');
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'studio', label: 'Content Studio' },
    ...(isAdmin ? [{ key: 'review' as const, label: 'Review queue' }, { key: 'users' as const, label: 'Users' }, { key: 'analytics' as const, label: 'Analytics' }, { key: 'audit' as const, label: 'Audit log' }] : []),
  ];
  const field = (label: string, key: keyof RevisionContent, multiline = false) => <label className="mg-field" key={key}>{label}
    {multiline ? <textarea value={String(content[key] ?? '')} onChange={event => update(key, event.target.value)} rows={3} disabled={!editable || busy} />
      : <input value={String(content[key] ?? '')} onChange={event => update(key, event.target.value)} disabled={!editable || busy} />}
  </label>;
  const arrayField = (label: string, key: 'mainContent' | 'objectives') => <label className="mg-field">{label}<textarea rows={key === 'mainContent' ? 7 : 4} value={(content[key] || []).join('\n')} onChange={event => update(key, lines(event.target.value))} disabled={!editable || busy} /></label>;
  const video = videoEmbed(content.videoUrl || '');

  return <section className="management" aria-label={isAdmin ? 'Admin Console' : 'Content Studio'}>
    <header className="mg-heading"><div><p className="mg-eyebrow">{isAdmin ? 'PLATFORM OPERATIONS' : 'EDITOR WORKSPACE'}</p><h1>{isAdmin ? 'Admin Console' : 'Content Studio'}</h1><p>Thoughtful lessons. Clear reviews. A lasting learning experience.</p></div><span className="mg-role"><ShieldCheck size={16} />{isAdmin ? 'Admin' : 'Editor'}</span></header>
    <nav className="mg-tabs" aria-label="Management sections">{tabs.map(item => <button type="button" key={item.key} aria-current={tab === item.key ? 'page' : undefined} onClick={() => navigate(item.key)}>{item.label}</button>)}</nav>
    {error && <div className="mg-alert mg-error" role="alert">{error}</div>}
    {success && <div className="mg-alert mg-success" role="status"><Check size={17} />{success}</div>}

    <div className="mg-view" ref={viewRef} tabIndex={-1} key={`${tab}:${editing}:${preview}`}>
    {(tab === 'studio' || tab === 'review') && !editing && <>
      <div className="mg-toolbar"><div><h2>{tab === 'review' ? 'Ready for your review' : 'Lesson revisions'}</h2><p>{tab === 'review' ? 'Review each lesson and its quiz before publishing.' : 'Published lessons stay live while you work on a separate draft.'}</p></div><div className="mg-actions">
        {tab === 'studio' && <><label className="mg-filter">Status<select aria-label="Filter revisions by status" value={filter} onChange={event => { setFilter(event.target.value); setPage(1); }}><option value="">All statuses</option>{Object.entries(statusNames).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><button type="button" className="mg-primary" onClick={create}><Plus size={17} />Create lesson</button></>}
        <button type="button" aria-label="Refresh revisions" onClick={reload} disabled={loading}><RefreshCw size={17} /></button>
      </div></div>
      <div className="mg-panel" aria-busy={loading}>{loading ? <p className="mg-empty" role="status">Loading revisions…</p> : records.length === 0 ? <div className="mg-empty"><FileText size={28} /><h3>{tab === 'review' ? 'The review queue is clear' : 'No revisions here yet'}</h3><p>{tab === 'review' ? 'Submitted lessons will appear here.' : 'Create a lesson or choose another status.'}</p></div> : <div className="mg-table-wrap"><table><thead><tr><th>Lesson</th><th>Revision</th><th>Status</th><th>Updated</th><th><span className="mg-sr">Actions</span></th></tr></thead><tbody>{records.map(revision => <tr key={revision.id}><td><strong>{revision.content.title || 'Untitled lesson'}</strong><small>{revision.lessonId} · {revision.content.episodeCode}</small></td><td>v{revision.version}</td><td><span className={`mg-status mg-status-${revision.status}`}>{statusNames[revision.status]}</span></td><td>{date(revision.updatedAt)}</td><td><button type="button" aria-label={`Open ${revision.content.title || revision.lessonId} revision ${revision.version}`} onClick={() => openRevision(revision)}><BookOpen size={16} />Open</button></td></tr>)}</tbody></table></div>}
        <Pagination data={pagination} busy={loading} change={setPage} />
      </div>
    </>}

    {(tab === 'studio' || tab === 'review') && editing && <>
      <div className="mg-toolbar"><button type="button" onClick={() => { setEditing(false); setPreview(false); }} disabled={busy || removingQuestion}><ArrowLeft size={17} />Back to lessons</button><div className="mg-actions">{selected && <span className={`mg-status mg-status-${selected.status}`}>{statusNames[selected.status]} · v{selected.version} · edit {selected.lockVersion}</span>}<button type="button" onClick={() => void perform(async () => { if (preview) setPreview(false); else await previewSaved(); }, preview ? 'Returned to editor.' : 'Preview loaded from saved revision.')} disabled={busy || removingQuestion}><Eye size={17} />{preview ? 'Back to editor' : editable ? 'Save & preview' : 'Preview'}</button></div></div>
      {selected?.feedback && <div className="mg-alert"><strong>Reviewer feedback</strong><p>{selected.feedback}</p></div>}
      {selected && !editable && <div className="mg-context">{selected.status === 'published' ? 'This revision is live. Create a draft to make changes without changing the published lesson.' : selected.status === 'in_review' ? 'This revision is awaiting review. Its content is locked until an admin publishes it or requests changes.' : 'This archived revision is retained for history.'}<button type="button" disabled={busy || removingQuestion} onClick={() => void perform(async () => { const result = await managementApi.branch(selected.lessonId); openRevision(result.revision); }, 'A separate draft is ready to edit.')}><Plus size={16} />Create new draft</button></div>}
      {preview ? <article className="mg-panel mg-preview"><p className="mg-eyebrow">PRIVATE DRAFT PREVIEW · {content.episodeCode}</p><h2>{content.title || 'Untitled lesson'}</h2><p className="mg-lead">{content.shortDescription}</p>{video ? <iframe title="Draft lesson video" src={video} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <p className="mg-context">Add a valid YouTube video to preview the player.</p>}<p>{content.overview}</p><h3>Learning objectives</h3><ul>{content.objectives.map((objective, index) => <li key={index}>{objective}</li>)}</ul><h3>{content.mainContentTitle}</h3>{content.mainContent.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<h3>{content.summary?.title || 'Summary'}</h3><ul>{content.summary?.points.map((point, index) => <li key={index}>{point}</li>)}</ul><h3>Quiz preview · {content.quiz.length} questions</h3>{content.quiz.map((question, index) => <section className="mg-preview-question" key={question.id}><h4>{index + 1}. {question.question}</h4><ol type="A">{question.options.map((option, optionIndex) => <li key={optionIndex}>{option}{question.correctAnswer === optionIndex && <span className="mg-answer"> Correct answer</span>}</li>)}</ol><p>{question.explanation}</p></section>)}<p className="mg-context">Answer keys are visible here to authorized staff only. Learners receive explanations after submitting.</p></article> : <form className="mg-editor" onSubmit={event => { event.preventDefault(); void perform(async () => { await persist(); }, 'Draft saved.'); }}>
        <p className="mg-save-state" role="status">{busy ? 'Saving changes…' : dirty ? 'Unsaved changes · Save draft to persist.' : selected ? 'All changes saved.' : 'Draft not saved yet.'}</p>
        <EditorSection disabled={!editable || busy || removingQuestion} title="Lesson details"><div className="mg-grid">
          <label className="mg-field">Lesson ID<input required value={lessonId} disabled={!!selected || busy} onChange={event => setLessonId(event.target.value)} placeholder="A unique, permanent ID" /></label>
          {field('Episode code', 'episodeCode')}{field('Lesson title', 'title')}{field('Duration', 'duration')}
          {field('Module ID', 'moduleId')}{field('Module title', 'moduleTitle')}{field('Unit code', 'unitCode')}
          <label className="mg-field">Category<select value={content.category} onChange={event => update('category', event.target.value as RevisionContent['category'])}><option value="economics">Economics</option><option value="finance">Finance</option></select></label>
          <label className="mg-field">XP reward<input type="number" min="0" max="1000" value={content.pointsReward} onChange={event => update('pointsReward', Number(event.target.value))} /></label>
          <label className="mg-field">YouTube video URL<input type="url" value={content.videoUrl || ''} onChange={event => update('videoUrl', event.target.value)} placeholder="https://www.youtube.com/watch?v=…" /></label>
        </div>{field('Module description', 'moduleDescription', true)}{field('Short description', 'shortDescription', true)}{field('Overview', 'overview', true)}</EditorSection>
        <EditorSection disabled={!editable || busy || removingQuestion} title="Written lesson">{field('Content heading', 'mainContentTitle')}{arrayField('Content paragraphs · one paragraph per line', 'mainContent')}{arrayField('Learning objectives · one per line', 'objectives')}<label className="mg-field">Summary title<input value={content.summary?.title || ''} onChange={event => update('summary', { ...content.summary, title: event.target.value })} /></label><label className="mg-field">Summary points · one per line<textarea rows={4} value={(content.summary?.points || []).join('\n')} onChange={event => update('summary', { title: content.summary?.title || '', points: lines(event.target.value) })} /></label></EditorSection>
        <EditorSection disabled={!editable || busy || removingQuestion} title="Quiz builder"><p className="mg-help">Set an answer and explanation for every question. Learners cannot see these keys before submission.</p>{content.quiz.map((question, questionIndex) => {
          const questionUpdate = (patch: Partial<typeof question>) => update('quiz', content.quiz.map((item, index) => index === questionIndex ? { ...item, ...patch } : item));
          return <section className="mg-question" key={question.id}><div className="mg-section-title"><h3>Question {questionIndex + 1}</h3><button type="button" aria-label={`Remove question ${questionIndex + 1}`} onClick={event => void removeQuestion(question.id,event.currentTarget.closest<HTMLElement>('.mg-question')!)}><Trash2 size={16} />Remove</button></div><label className="mg-field">Question {questionIndex + 1} text<textarea rows={2} value={question.question} onChange={event => questionUpdate({ question: event.target.value })} /></label>{question.options.map((option, optionIndex) => <div className="mg-option" key={optionIndex}><label className="mg-field">Question {questionIndex + 1} option {String.fromCharCode(65 + optionIndex)}<input value={option} onChange={event => questionUpdate({ options: question.options.map((item, index) => index === optionIndex ? event.target.value : item) })} /></label><label className="mg-radio"><input type="radio" name={`correct-${question.id}`} checked={question.correctAnswer === optionIndex} onChange={() => questionUpdate({ correctAnswer: optionIndex })} />Correct</label>{question.options.length > 2 && <button type="button" aria-label={`Remove question ${questionIndex + 1} option ${String.fromCharCode(65 + optionIndex)}`} onClick={() => questionUpdate({ options: question.options.filter((_, index) => index !== optionIndex), correctAnswer: question.correctAnswer === optionIndex ? 0 : question.correctAnswer > optionIndex ? question.correctAnswer - 1 : question.correctAnswer })}><Trash2 size={15} /></button>}</div>)}{question.options.length < 6 && <button type="button" onClick={() => questionUpdate({ options: [...question.options, ''] })}><Plus size={15} />Add option</button>}<label className="mg-field">Question {questionIndex + 1} explanation<textarea rows={2} value={question.explanation} onChange={event => questionUpdate({ explanation: event.target.value })} /></label></section>;
        })}<button type="button" ref={addQuestionRef} onClick={() => update('quiz', [...content.quiz, { id: `q_${crypto.randomUUID().replaceAll('-', '')}`, question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }])}><Plus size={16} />Add question</button></EditorSection>
        {editable && <div className="mg-savebar"><p>{busy ? 'Saving changes…' : 'Your live lesson stays unchanged until an admin publishes this draft.'}</p><div className="mg-actions"><button type="submit" disabled={busy || removingQuestion} aria-busy={busy}><Save size={17} />Save draft</button><button type="button" className="mg-primary" disabled={busy || removingQuestion} onClick={() => void perform(async () => { const saved = await persist(); const result = await managementApi.submit(saved.id, saved.lockVersion); setSelected(result.revision); setContent(structuredClone(result.revision.content)); }, 'Draft submitted for review.')}><Send size={17} />Submit for review</button></div></div>}
      </form>}
      {isAdmin && selected?.status === 'in_review' && <div className="mg-panel mg-review"><h2>Review decision</h2><p>Check the lesson, video, objectives, and every quiz answer before publishing.</p><label className="mg-field">Reviewer feedback<textarea value={feedback} onChange={event => setFeedback(event.target.value)} rows={3} disabled={busy || removingQuestion} placeholder="Describe the changes needed if returning this lesson to its author." /></label><div className="mg-actions"><button type="button" disabled={busy || removingQuestion} onClick={() => void perform(() => review('reject'), 'Revision returned to draft with feedback.')} >Request changes</button><button type="button" className="mg-primary" disabled={busy || removingQuestion} onClick={() => void perform(() => review('publish'), 'Lesson published. Learners can now see this revision.')}><Check size={17} />Publish lesson</button></div></div>}
      {isAdmin && selected?.status === 'published' && <div className="mg-panel mg-review"><h2>Publication controls</h2><p>Unpublishing removes this lesson from the learner library. Historical progress and quiz attempts remain recorded.</p><button type="button" className="mg-danger" disabled={busy || removingQuestion} onClick={event => {event.currentTarget.focus();setError('');setConfirmUnpublish(true);}} >Unpublish lesson</button></div>}
      {selected && error && <button type="button" disabled={busy || removingQuestion} onClick={() => void perform(async () => { const result = await managementApi.getRevision(selected.id); openRevision(result.revision); }, 'Latest saved revision loaded.')}><RefreshCw size={16} />Reload latest revision</button>}
    </>}

    {tab === 'users' && isAdmin && <><div className="mg-toolbar"><div><h2>People & permissions</h2><p>Changes apply to existing sessions immediately.</p></div><form className="mg-search" onSubmit={event => { event.preventDefault(); setSearch(searchInput.trim()); setPage(1); }}><label className="mg-sr" htmlFor="mg-user-search">Search users</label><input id="mg-user-search" placeholder="Search name or email" value={searchInput} onChange={event => setSearchInput(event.target.value)} /><button type="submit">Search</button></form></div><div className="mg-panel" aria-busy={loading}>{loading ? <p className="mg-empty" role="status">Loading users…</p> : users.length === 0 ? <p className="mg-empty">No matching accounts.</p> : <div className="mg-table-wrap"><table><thead><tr><th>Account</th><th>Role</th><th>Status</th><th>Activation</th></tr></thead><tbody>{users.map(account => <tr key={account.id}><td><strong>{account.displayName}{account.id === user.id ? ' (you)' : ''}</strong><small>{account.email}</small></td><td><label className="mg-sr" htmlFor={`role-${account.id}`}>Role for {account.email}</label><select id={`role-${account.id}`} value={account.role} disabled={busy || removingQuestion} onChange={event => { const role = event.target.value as PublicUser['role']; void perform(async () => { await managementApi.updateUser(account.id, { role }); if (account.id === user.id) onUserChange(); }, 'Account role updated.'); }}><option value="learner">Learner</option><option value="editor">Editor</option><option value="admin">Admin</option></select></td><td><span className={`mg-status ${account.isActive ? 'mg-status-published' : 'mg-status-archived'}`}>{account.isActive ? 'Active' : 'Inactive'}</span></td><td><button type="button" disabled={busy || removingQuestion} aria-label={`${account.isActive ? 'Deactivate' : 'Activate'} ${account.email}`} onClick={() => void perform(async () => { await managementApi.updateUser(account.id, { isActive: !account.isActive }); if (account.id === user.id) onUserChange(); }, account.isActive ? 'Account deactivated.' : 'Account activated.')}>{account.isActive ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table></div>}<Pagination data={pagination} busy={loading || busy} change={setPage} /></div><p className="mg-context"><ShieldCheck size={18} />The last active Admin is protected by the server. Public registration always creates a Learner.</p></>}

    {tab === 'analytics' && isAdmin && <><div className="mg-toolbar"><div><h2>Platform overview</h2><p>Current totals from the learning database.</p></div><button type="button" onClick={reload} disabled={loading}><RefreshCw size={16} />Refresh</button></div>{loading ? <p className="mg-panel mg-empty" role="status">Loading analytics…</p> : analytics && <><div className="mg-metrics">{[['Accounts', analytics.users], ['Active accounts', analytics.activeUsers], ['Published lessons', analytics.publishedLessons], ['Completed lessons', analytics.completedLessons], ['Quiz attempts', analytics.quizAttempts], ['XP earned', analytics.totalXp]].map(([label, value]) => <article className="mg-panel" key={label}><span>{label}</span><strong>{Number(value).toLocaleString('vi-VN')}</strong></article>)}</div><div className="mg-panel"><div className="mg-section-title"><h3><Users size={19} />Community roles</h3></div><div className="mg-roles">{(['learner', 'editor', 'admin'] as const).map(role => <div key={role}><span>{role}</span><strong>{analytics.roles[role].toLocaleString('vi-VN')}</strong><progress aria-label={`${role} share`} value={analytics.roles[role]} max={Math.max(1, analytics.users)} /></div>)}</div></div></>}</>}

    {tab === 'audit' && isAdmin && <><div className="mg-toolbar"><div><h2>Audit history</h2><p>Content decisions and account changes, recorded by the server.</p></div><button type="button" onClick={reload} disabled={loading}><RefreshCw size={16} />Refresh</button></div><div className="mg-panel" aria-busy={loading}>{loading ? <p className="mg-empty" role="status">Loading audit history…</p> : audit.length === 0 ? <p className="mg-empty">No audit entries recorded yet.</p> : <div className="mg-table-wrap"><table><thead><tr><th>When</th><th>Action</th><th>Actor</th><th>Target</th><th>Details</th></tr></thead><tbody>{audit.map(entry => <tr key={entry.id}><td>{date(entry.createdAt)}</td><td><strong>{entry.action}</strong></td><td><code>{entry.actorId || 'System'}</code></td><td><code>{entry.targetId}</code></td><td>{entry.metadata != null && <details><summary>View details</summary><pre>{JSON.stringify(entry.metadata, null, 2)}</pre></details>}</td></tr>)}</tbody></table></div>}<Pagination data={pagination} busy={loading} change={setPage} /></div></>}
  </div><MotionDialog open={confirmUnpublish} onClose={()=>setConfirmUnpublish(false)} labelledBy="unpublish-title" busy={busy}><div className="confirm-dialog"><h2 id="unpublish-title">Unpublish this lesson?</h2><p>This lesson will leave the learner library. Learning history and XP will stay recorded.</p>{error && <p className="form-error" role="alert">{error}</p>}<div className="confirm-actions"><button className="button button-outline" disabled={busy || removingQuestion} autoFocus onClick={()=>setConfirmUnpublish(false)}>Keep published</button><button className="button button-dark" disabled={busy || removingQuestion} aria-busy={busy} onClick={()=>void perform(async()=>{await review('unpublish');setConfirmUnpublish(false);},'Lesson unpublished. Learning history has been preserved.')}>Confirm unpublish</button></div></div></MotionDialog></section>;
}
