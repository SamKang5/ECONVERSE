import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, GraduationCap, House, LayoutDashboard, LogOut, Menu, ShieldCheck, UserRound, X } from 'lucide-react';
import mascot from './assets/econverse-logo.webp';
import { AuthModal } from './components/AuthModal';
import { LearnerDashboard } from './components/LearnerDashboard';
import { CourseLibrary } from './components/CourseLibrary';
import { LessonExperience } from './components/LessonExperience';
import { LearnerProfile } from './components/LearnerProfile';
import ManagementPage from './components/ManagementPage';
import { apiClient, type ProgressResponse, type PublicUser } from './services/api';
import { getCourses, type PublishedCourse } from './services/content';

type View = 'dashboard' | 'library' | 'lesson' | 'profile' | 'management';
const EMPTY_PROGRESS: ProgressResponse = { lessons: [], gamification: { totalXp: 0, level: 1, currentStreak: 0 } };
function readLocation(): { view: View; lessonId: string | null } {
  const [view, lessonId] = location.hash.slice(1).split('/');
  if (view === 'lesson' && lessonId) { try { return { view: 'lesson', lessonId: decodeURIComponent(lessonId) }; } catch { return {view:'library',lessonId:null}; } }
  return { view: ['library','profile','management'].includes(view) ? view as View : 'dashboard', lessonId: null };
}

export default function App() {
  const [route, setRoute] = useState(readLocation);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [courses, setCourses] = useState<PublishedCourse[]>([]);
  const [progress, setProgress] = useState<ProgressResponse>(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobile,setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const previousRoute = useRef(`${route.view}:${route.lessonId || ''}`);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [authVisible,setAuthVisible] = useState(false);
  const [authRequest,setAuthRequest] = useState(0);
  const sessionEpoch=useRef(0);
  const sessionRefresh=useRef(0);
  const currentUserId=useRef<string|null>(null);
  function openAuth(mode:'login'|'register') {setAuthMode(mode);setAuthRequest(value=>value+1);setAuthVisible(true);}
  useEffect(() => {
    const media=window.matchMedia('(max-width: 760px)');
    const changed=()=>{setMobile(media.matches);if(!media.matches)setMenuOpen(false);};
    media.addEventListener('change',changed);
    return ()=>media.removeEventListener('change',changed);
  },[]);
  useEffect(() => {
    if(!menuOpen)return;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    sidebarRef.current?.querySelector<HTMLElement>('.close-menu')?.focus();
    const keydown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();setMenuOpen(false);}
      if(event.key!=='Tab')return;
      const controls=Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>('a[href],button:not(:disabled)')||[]);
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    };
    document.addEventListener('keydown',keydown);
    return ()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',keydown);if(menuButtonRef.current?.getClientRects().length)menuButtonRef.current.focus();else mainRef.current?.focus({preventScroll:true});};
  },[menuOpen]);
  useEffect(() => {
    const key=`${route.view}:${route.lessonId || ''}`;
    if(previousRoute.current===key)return;
    previousRoute.current=key;
    mainRef.current?.focus({preventScroll:true});
  },[route.view,route.lessonId]);
  const refreshCourses = useCallback(async () => {
    setLoading(true);
    try { setCourses(await getCourses()); setError(''); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể tải nội dung.'); }
    finally { setLoading(false); }
  }, []);
  const refreshSession = useCallback(async () => {
    const epoch=sessionEpoch.current,request=++sessionRefresh.current;
    const current=()=>epoch===sessionEpoch.current&&request===sessionRefresh.current;
    try {
      const session = await apiClient.auth.getSession();
      if(!current())return;
      if (session.authenticated && session.user) {
        if(currentUserId.current!==session.user.id)setProgress(EMPTY_PROGRESS);
        currentUserId.current=session.user.id;setUser(session.user);
        const nextProgress=await apiClient.progress.get();
        if(current())setProgress(nextProgress);
      } else {currentUserId.current=null;setUser(null);setProgress(EMPTY_PROGRESS);}
    } catch (cause) {if(current())setError(cause instanceof Error ? cause.message : 'Không thể đồng bộ tài khoản.');}
    finally {if(current())setSessionLoading(false);}
  }, []);
  useEffect(()=>()=>{sessionEpoch.current++;sessionRefresh.current++;},[]);
  useEffect(() => { void refreshCourses(); void refreshSession(); }, [refreshCourses, refreshSession]);
  useEffect(() => {
    const changed = () => { setRoute(readLocation()); setMenuOpen(false); window.scrollTo({top:0,behavior:'instant'}); };
    window.addEventListener('hashchange', changed); window.addEventListener('focus', refreshSession);
    return () => { window.removeEventListener('hashchange', changed); window.removeEventListener('focus', refreshSession); };
  }, [refreshSession]);
  const navigate = (view: View) => { location.hash = view; if (view === 'library') void refreshCourses(); void refreshSession(); };
  const openLesson = (id: string) => { location.hash = `lesson/${encodeURIComponent(id)}`; };
  const authenticated = (next: PublicUser) => {
    sessionEpoch.current++;
    if(currentUserId.current!==next.id)setProgress(EMPTY_PROGRESS);
    currentUserId.current=next.id;setUser(next);void refreshSession();
  };
  const updatedUser=(next:PublicUser)=>{if(next.id===currentUserId.current){setUser(next);void refreshSession();}};
  const logout = async () => {
    const epoch=++sessionEpoch.current;
    try { await apiClient.auth.logout();if(epoch!==sessionEpoch.current)return;sessionRefresh.current++;currentUserId.current=null;setUser(null);setProgress(EMPTY_PROGRESS);navigate('dashboard'); }
    catch (cause) {if(epoch===sessionEpoch.current)setError(cause instanceof Error ? cause.message : 'Không thể đăng xuất.');}
  };
  const activeEntry = courses.flatMap(course => course.lessons.map(lesson => ({ course, lesson }))).find(entry => entry.lesson.id === route.lessonId);
  const privileged = user?.role === 'editor' || user?.role === 'admin';
  const navItems = [
    { view:'dashboard' as View, label:'Tổng quan', icon:House },
    { view:'library' as View, label:'Thư viện bài học', icon:BookOpen },
    { view:'profile' as View, label:'Hồ sơ của tôi', icon:UserRound },
    ...(privileged ? [{view:'management' as View,label:user?.role === 'admin' ? 'Admin Console' : 'Content Studio',icon:ShieldCheck}] : []),
  ];
  const title = route.view === 'lesson' ? 'Không gian học tập' : navItems.find(item => item.view === route.view)?.label || 'ECONVERSE';
  return <div className="learning-app">
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Đến nội dung chính</a>
    <aside ref={sidebarRef} id="primary-navigation" inert={mobile && !menuOpen} role={mobile && menuOpen ? 'dialog' : undefined} aria-modal={mobile && menuOpen ? true : undefined} className={`sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="Điều hướng chính">
      <a className="brand" href="#dashboard"><img src={mascot} alt="" /><span>ECONVERSE<small>LEARN. THINK. GROW.</small></span></a>
      <button className="icon-button close-menu" aria-label="Đóng menu" onClick={() => setMenuOpen(false)}><X size={20}/></button>
      <p className="nav-caption">KHÔNG GIAN CỦA BẠN</p>
      <nav>{navItems.map(({view,label,icon:Icon}) => <a key={view} href={`#${view}`} aria-current={(route.view === view || view === 'library' && route.view === 'lesson') ? 'page' : undefined} className={(route.view === view || view === 'library' && route.view === 'lesson') ? 'active' : ''} onClick={event => {event.preventDefault();navigate(view);}}><Icon size={19}/>{label}</a>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><GraduationCap size={23}/><strong>Mỗi bài học, một góc nhìn mới.</strong><p>Cùng Tũn khám phá kinh tế từ những điều gần gũi.</p><button onClick={() => navigate('library')}>Khám phá thư viện <ArrowUpRight size={16}/></button></div>{user && <button className="sidebar-logout" onClick={logout}><LogOut size={17}/>Đăng xuất</button>}<span className="sidebar-foot">ECONVERSE · Học để hiểu hơn</span></div>
    </aside>
    {menuOpen && <button className="menu-backdrop" aria-label="Đóng điều hướng" onClick={() => setMenuOpen(false)}/>}
    <div className="workspace" inert={mobile && menuOpen}><header className="topbar"><div className="topbar-left"><button className="icon-button open-menu" ref={menuButtonRef} aria-controls="primary-navigation" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={23}/></button><span className="breadcrumb">ECONVERSE <span>/</span> <b>{title}</b></span></div><div className="top-actions">{user ? <><span className="account-role">{user.role === 'learner' ? 'Học viên' : user.role === 'editor' ? 'Editor' : 'Admin'}</span><button className="account-button" onClick={() => navigate('profile')} aria-label={`Hồ sơ ${user.displayName}`}><span className="avatar">{user.displayName.slice(0,1).toUpperCase()}</span><span>{user.displayName}</span></button></> : <button className="button button-dark" disabled={sessionLoading} onClick={event => {event.currentTarget.focus();openAuth('login');}}>{sessionLoading ? 'Đang kết nối…' : 'Đăng nhập'}</button>}</div></header>
      <main ref={mainRef} id="main-content" tabIndex={-1}><div className="page-transition" key={`${route.view}:${route.lessonId || ''}`}>
        {error && <div className="notice notice-error" role="alert"><span>{error}</span><button onClick={() => {void refreshCourses();void refreshSession();}}>Thử lại</button></div>}
        {loading && !courses.length ? <div className="page-loading" role="status"><BookOpen size={30}/><p>Đang mở thư viện của bạn…</p></div> : <>
          {route.view === 'dashboard' && <LearnerDashboard user={user} courses={courses} progress={progress} onOpenLesson={openLesson} onOpenLibrary={() => navigate('library')} onRegister={() => openAuth('register')}/>}
          {route.view === 'library' && <CourseLibrary courses={courses} progress={progress.lessons} onOpenLesson={openLesson}/>}
          {route.view === 'lesson' && (activeEntry ? <LessonExperience key={`${activeEntry.lesson.id}:${activeEntry.lesson.revisionId}`} user={user} {...activeEntry} progress={progress.lessons} onOpenLesson={openLesson} onBack={() => navigate('library')} onLogin={() => openAuth('login')} onProgressChange={refreshSession}/> : <div className="empty-state"><BookOpen size={32}/><h1>Bài học chưa được xuất bản</h1><p>Nội dung có thể đã được cập nhật hoặc tạm ẩn.</p><button className="button button-dark" onClick={() => navigate('library')}>Về thư viện</button></div>)}
          {route.view === 'profile' && <LearnerProfile key={user?.id || 'guest'} user={user} courses={courses} progress={progress} onLogin={() => openAuth('login')} onUserChange={updatedUser} onOpenLesson={openLesson} onLogout={logout}/>}
          {route.view === 'management' && (privileged && user ? <ManagementPage key={user.id} user={user} onUserChange={() => {void refreshSession();void refreshCourses();}}/> : <div className="empty-state"><LayoutDashboard size={32}/><h1>Không có quyền truy cập</h1><p>Không gian này dành cho Editor và Admin.</p><button className="button button-dark" onClick={() => navigate('dashboard')}>Về tổng quan</button></div>)}
        </>}
      </div></main><footer className="page-footer"><span>ECONVERSE</span><span>Kiến thức nhỏ. Thay đổi lớn.</span></footer>
    </div>{authMode && <AuthModal key={`${authMode}:${authRequest}`} isOpen={authVisible} initialMode={authMode} onClose={() => setAuthVisible(false)} onSuccess={authenticated}/>}
  </div>;
}
