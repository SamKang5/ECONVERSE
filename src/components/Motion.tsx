import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';

/** Native modal semantics keep background controls inert and restore the opener. */
export function MotionDialog({open,onClose,labelledBy,children,busy=false}:{open:boolean;onClose:()=>void;labelledBy:string;children:ReactNode;busy?:boolean}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement|null>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if(!open)return;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=overflow;};
  },[open]);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if(open&&!wasOpen.current)opener.current=document.activeElement as HTMLElement|null;
    wasOpen.current=open;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (open && !dialog.open) dialog.showModal();
    if (!dialog.open) return;
    dialog.classList.toggle('is-closing',!open);
    const animation = dialog.animate(open
      ? [{opacity:0,transform:'translateY(10px) scale(.99)'},{opacity:1,transform:'none'}]
      : [{opacity:1,transform:'none'},{opacity:0,transform:'translateY(6px) scale(.995)'}],
      {duration:reduced ? 0 : open ? 240 : 160,easing:'cubic-bezier(.2,.7,.2,1)'});
    animation.finished.then(() => {
      if(!open){
        dialog.close();
        // WebKit does not consistently restore the opener after an animated close.
        const previous=opener.current;
        if(previous?.isConnected&&!previous.closest('[inert]')&&previous.getClientRects().length)previous.focus({preventScroll:true});
        else document.getElementById('main-content')?.focus({preventScroll:true});
      }
    }).catch(() => {});
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => {if(preference.matches) animation.finish();};
    preference.addEventListener('change',finish);
    return () => {animation.cancel();preference.removeEventListener('change',finish);};
  },[open]);
  useEffect(() => () => ref.current?.close(),[]);
  return <dialog ref={ref} className="motion-dialog" aria-modal="true" aria-labelledby={labelledBy} aria-busy={busy}
    onKeyDown={event=>{
      if(event.key!=='Tab')return;
      const controls=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]')).filter(control=>control.getClientRects().length && !control.closest('[inert]'));
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    }}
    onCancel={event=>{event.preventDefault();if(!busy)onClose();}}
    onClick={event=>{if(event.target===event.currentTarget&&!busy)onClose();}}>{children}</dialog>;
}

/** Content stays mounted, while inert removes collapsed controls from keyboard navigation. */
export function Collapse({open,id,children}:{open:boolean;id:string;children:ReactNode}) {
  return <div id={id} className={`motion-collapse ${open ? 'is-expanded' : ''}`} inert={!open} aria-hidden={!open}><div>{children}</div></div>;
}

export function AnimatedProgress({value,max=100,label}:{value:number;max?:number;label:string}) {
  return <div className="motion-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
    <span style={{transform:`scaleX(${Math.max(0,Math.min(1,value/max))})`}}/>
  </div>;
}
