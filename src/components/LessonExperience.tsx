import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronRight, CirclePlay, Clock3, ListChecks, RotateCcw, Sparkles } from 'lucide-react';
import { apiClient, type LessonProgressItem, type PublicUser, type QuizQuestionsResponse, type QuizSubmitResponse } from '../services/api';
import type { PublishedCourse, PublishedLesson } from '../services/content';
import { youtubeEmbedUrl } from '../learnerModel';
import { AnimatedProgress } from './Motion';
import mascot from '../assets/tun-mascot.webp';

interface Props {user:PublicUser|null;course:PublishedCourse;lesson:PublishedLesson;progress:LessonProgressItem[];onOpenLesson:(id:string)=>void;onBack:()=>void;onLogin:()=>void;onProgressChange:()=>Promise<void>;}
export function LessonExperience({user,course,lesson,progress,onOpenLesson,onBack,onLogin,onProgressChange}:Props) {
  const [stage,setStage] = useState<'lesson'|'quiz'>('lesson');
  const [quiz,setQuiz] = useState<QuizQuestionsResponse|null>(null);
  const [answers,setAnswers] = useState<Record<string,number>>({});
  const [result,setResult] = useState<QuizSubmitResponse|null>(null);
  const [loading,setLoading] = useState(false);
  const [submitting,setSubmitting] = useState(false);
  const [error,setError] = useState('');
  const [celebrating,setCelebrating] = useState(false);
  const quizRef = useRef<HTMLElement>(null);
  const keyRef = useRef<string|null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef(user?.id ?? null);
  const submissionVersion = useRef(0);
  useLayoutEffect(() => {
    const previous=accountRef.current;
    accountRef.current=user?.id ?? null;
    if(previous&&previous!==accountRef.current){
      submissionVersion.current++;keyRef.current=null;
      setResult(null);setAnswers({});setCelebrating(false);setSubmitting(false);setError('');
    }
  },[user?.id]);
  useEffect(()=>()=>{submissionVersion.current++;},[]);
  const video = youtubeEmbedUrl(lesson.videoUrl,lesson.youtubeId);
  const index = course.lessons.findIndex(item => item.id === lesson.id);
  const next = course.lessons[index+1];
  useEffect(() => {if(result)resultRef.current?.focus();},[result?.attemptId]);
  useEffect(() => {
    if(stage==='quiz'&&!loading&&!result)quizRef.current?.querySelector<HTMLElement>('h2')?.focus();
  },[stage,loading,result]);
  useEffect(() => {
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const changed=()=>{if(preference.matches)setCelebrating(false);};
    preference.addEventListener('change',changed);
    return ()=>preference.removeEventListener('change',changed);
  },[]);
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    apiClient.progress.update(lesson.id,'in_progress').then(() => { if (mounted) void onProgressChange(); }).catch(cause => {if (mounted) setError(cause.message || 'Không thể lưu tiến độ.');});
    return () => {mounted=false;};
  }, [lesson.id,user?.id]);
  async function loadQuiz() {
    setLoading(true);setError('');
    try { setQuiz(await apiClient.quizzes.get(lesson.id)); }
    catch(cause) {setError(cause instanceof Error ? cause.message : 'Không thể tải bài kiểm tra.');}
    finally {setLoading(false);}
  }
  async function openQuiz() {setStage('quiz');if (!quiz) await loadQuiz();window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});}
  async function submit() {
    if(submitting)return;
    if (!user) {onLogin();return;}
    const missing = quiz?.questions.find(question => answers[question.id] === undefined);
    if (!quiz || missing) {setError('Vui lòng chọn đáp án cho tất cả câu hỏi trước khi nộp bài.');Array.from(quizRef.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]')||[]).find(input=>input.name===`question-${missing?.id}`)?.focus();return;}
    setSubmitting(true);setError('');
    const version=++submissionVersion.current;
    const account=user.id;
    const current=()=>version===submissionVersion.current&&account===accountRef.current;
    keyRef.current ??= `quiz_${crypto.randomUUID()}`;
    try {
      const submitted = await apiClient.quizzes.submit(lesson.id,{answers,idempotencyKey:keyRef.current,revisionId:quiz.revisionId});
      if(!current())return;
      setResult(submitted);setCelebrating(submitted.lessonCompleted && submitted.xpAwarded > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);await onProgressChange();
    } catch(cause) {if(current())setError(cause instanceof Error ? cause.message : 'Không thể nộp bài. Bạn có thể thử lại.');}
    finally {if(current())setSubmitting(false);}
  }
  function retry() {setResult(null);setCelebrating(false);setAnswers({});keyRef.current=null;setError('');void loadQuiz();}
  return <div className="lesson-page">
    <button className="text-button back-link" onClick={onBack}><ArrowLeft size={16}/>Thư viện bài học</button>
    <div className="page-heading lesson-heading"><div><p className="eyebrow">{course.title} <ChevronRight size={12}/> TẬP {lesson.order}</p><h1>{lesson.title}</h1><p className="subtitle">{lesson.shortDescription}</p><div className="lesson-meta"><span><Clock3 size={15}/>{lesson.duration}</span><span><Sparkles size={15}/>{lesson.pointsReward} XP khi hoàn thành</span>{progress.some(item => item.lessonId === lesson.id && item.status === 'completed') && <span className="completed-label"><CheckCircle2 size={15}/>Đã hoàn thành</span>}</div></div></div>
    <div className="lesson-layout"><div className="lesson-main"><div className="lesson-stage-tabs" role="group" aria-label="Nội dung bài học"><button className={stage === 'lesson' ? 'active' : ''} aria-pressed={stage === 'lesson'} onClick={() => {setStage('lesson');setCelebrating(false);}}><CirclePlay size={17}/>Bài học</button><button className={stage === 'quiz' ? 'active' : ''} aria-pressed={stage === 'quiz'} onClick={openQuiz}><ListChecks size={17}/>Kiểm tra kiến thức</button></div>
      {error && <div className="notice notice-error" role="alert">{error}</div>}
      <div className="lesson-content" hidden={stage !== 'lesson'}>
        {video ? <div className="video-container"><iframe src={video} title={`Video bài học: ${lesson.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div> : <div className="video-unavailable"><CirclePlay size={38}/><h2>Video đang được cập nhật</h2><p>Bạn vẫn có thể khám phá nội dung và làm bài kiểm tra bên dưới.</p></div>}
        <article className="panel lesson-article"><span className="eyebrow">HIỂU THẬT DỄ, NHỚ THẬT LÂU</span><h2>{lesson.mainContentTitle || 'Khám phá bài học'}</h2>{lesson.overview && <p className="lesson-intro">{lesson.overview}</p>}{lesson.mainContent?.map((paragraph,index) => <p key={index}>{paragraph}</p>)}{lesson.objectives?.length ? <section className="objectives"><h3><CheckCircle2 size={20}/>Sau bài này, bạn sẽ</h3><ul>{lesson.objectives.map((objective,index) => <li key={index}>{objective}</li>)}</ul></section> : null}{lesson.summary && <section className="lesson-summary"><h3>{lesson.summary.title}</h3><ul>{lesson.summary.points.map((point,index) => <li key={index}>{point}</li>)}</ul></section>}</article>
        <div className="lesson-next-step"><div><span className="eyebrow">ĐẾN LƯỢT BẠN</span><h2>Thử xem bạn nhớ được gì?</h2><p>Một bài kiểm tra ngắn để kiến thức ở lại lâu hơn.</p></div><button className="button button-dark" onClick={openQuiz}>Làm bài kiểm tra <ArrowRight size={17}/></button></div>
      </div><section ref={quizRef} className="quiz-area" hidden={stage !== 'quiz'} aria-label="Bài kiểm tra kiến thức">
        <div className="section-heading"><div><h2 tabIndex={-1}>Kiểm tra kiến thức</h2><p className="muted">Chọn một đáp án cho mỗi câu hỏi.</p></div><span className="status-pill">{Object.keys(answers).length}/{quiz?.questions.length || 0} câu</span></div>
        <div className="quiz-completion-progress"><AnimatedProgress value={Object.keys(answers).length} max={Math.max(1,quiz?.questions.length || 1)} label="Số câu đã trả lời"/></div>
        {loading && <div className="panel" role="status" aria-busy="true">Đang tải câu hỏi…</div>}
        {!loading && !quiz && <div className="panel"><p>Chưa tải được bài kiểm tra.</p><button className="button button-outline" onClick={loadQuiz}>Thử lại</button></div>}
        {result && <div className={`quiz-result ${result.lessonCompleted ? 'is-perfect' : ''}`} role="status" tabIndex={-1} ref={resultRef}><TrophyMark perfect={result.lessonCompleted}/><div><span className="eyebrow">KẾT QUẢ CỦA BẠN</span><h2>{result.score}% · {result.correctCount}/{result.totalQuestions} câu đúng</h2><div className="quiz-score"><AnimatedProgress value={result.score} label="Điểm bài kiểm tra"/></div><p>{result.lessonCompleted ? result.xpAwarded > 0 ? `Tuyệt lắm! Bạn nhận +${result.xpAwarded} XP và đã hoàn thành bài học.` : 'Bạn đã hoàn thành bài học. XP của bài này đã được ghi nhận trước đó.' : 'Một lần thử là một lần học. Xem giải thích bên dưới rồi thử lại nhé.'}</p><div className="result-rewards">{result.xpAwarded > 0 && <div className={`xp-reward ${celebrating ? 'is-celebrating' : ''}`} onAnimationEnd={event=>{if(event.target===event.currentTarget)setCelebrating(false);}}><Sparkles size={17}/>+{result.xpAwarded} XP<span className="reward-particles" aria-hidden="true"><i/><i/><i/></span></div>}{result.lessonCompleted && <img className={`result-mascot ${celebrating ? 'is-celebrating' : ''}`} src={mascot} width={42} height={48} alt="Tũn chúc mừng bạn hoàn thành bài học"/>}</div><div className="result-actions"><button className="button button-outline" onClick={retry}><RotateCcw size={16}/>Làm lại</button>{next && <button className="button button-dark" onClick={() => onOpenLesson(next.id)}>Bài tiếp theo <ArrowRight size={16}/></button>}</div></div></div>}
        {!loading && quiz?.questions.map((question,questionIndex) => {
          const feedback = result?.feedback?.find(item => item.id === question.id);
          return <fieldset className="panel quiz-question" key={question.id} aria-describedby={feedback ? `feedback-${question.id}` : undefined} disabled={submitting || Boolean(result)}><legend><span>CÂU {questionIndex+1}</span>{question.questionText}</legend><div className="quiz-options">{question.options.map((option,optionIndex) => {
            const correct = feedback?.correctAnswer === optionIndex;
            const wrong = Boolean(feedback) && answers[question.id] === optionIndex && !correct;
            return <label key={optionIndex} className={`quiz-option ${answers[question.id] === optionIndex ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}><input type="radio" name={`question-${question.id}`} value={optionIndex} checked={answers[question.id] === optionIndex} onChange={() => {setAnswers(current => ({...current,[question.id]:optionIndex}));keyRef.current=null;setError('');}}/><span className="option-letter">{String.fromCharCode(65+optionIndex)}</span><span>{option}</span>{correct && <><CheckCircle2 size={18}/><span className="sr-only">Đáp án đúng</span></>}{wrong && <span className="sr-only">Đáp án bạn chọn chưa đúng</span>}</label>;
          })}</div>{feedback && <p className="quiz-explanation" id={`feedback-${question.id}`}><strong>Giải thích: </strong>{feedback.explanation}</p>}</fieldset>;
        })}
        {!result && quiz && !loading && <div className="quiz-submit"><p>{user ? 'Đạt điểm tối đa để hoàn thành bài học. XP chỉ được thưởng một lần.' : 'Đăng nhập để nộp bài, nhận XP và lưu kết quả.'}</p><button className="button button-dark" disabled={submitting || !quiz.questions.length} aria-busy={submitting} onClick={event=>{event.currentTarget.focus();void submit();}}>{submitting ? 'Đang nộp bài…' : user ? 'Nộp bài kiểm tra' : 'Đăng nhập để nộp bài'}<ArrowRight size={17}/></button></div>}
      </section>
    </div><aside className="lesson-outline panel"><div className="section-heading"><h2>Trong chương này</h2><BookOpen size={19}/></div><p className="muted">{course.title}</p><ol>{course.lessons.map(item => <li key={item.id}><button className={item.id === lesson.id ? 'active' : ''} aria-current={item.id === lesson.id ? 'step' : undefined} onClick={() => onOpenLesson(item.id)}><span>{item.order}</span><strong>{item.title}</strong>{progress.some(state => state.lessonId === item.id && state.status === 'completed') && <CheckCircle2 size={16}/>}</button></li>)}</ol>{index > 0 && <button className="text-button" onClick={() => onOpenLesson(course.lessons[index-1].id)}><ArrowLeft size={15}/>Bài trước</button>}</aside></div>
  </div>;
}
function TrophyMark({perfect}:{perfect:boolean}) {return <span className="quiz-result-icon">{perfect ? <Sparkles size={28}/> : <BookOpen size={28}/>}</span>;}
