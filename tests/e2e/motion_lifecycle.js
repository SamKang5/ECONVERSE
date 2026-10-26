async (page) => {
  // Compare post-GC browser counters after warming the same navigation/modal flow.
  await page.goto('http://127.0.0.1:8788');await page.getByRole('heading',{level:1}).waitFor();
  await page.getByRole('button',{name:'Đang kết nối…'}).waitFor({state:'hidden'});
  const settled=()=>page.evaluate(async()=>{await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
  const cycle=async()=>{
    for(const name of ['Thư viện bài học','Tổng quan']) {
      const response=page.waitForResponse(r=>r.url().endsWith('/api/auth/session'));
      await page.getByRole('link',{name,exact:true}).click();await response;
      await page.getByRole('heading',{level:1}).waitFor();await settled();
    }
    await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await settled();
    await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});await settled();
  };
  await cycle();
  const cdp=await page.context().newCDPSession(page);
  const counters=async()=>{await cdp.send('HeapProfiler.collectGarbage');return await cdp.send('Memory.getDOMCounters');};
  const before=await counters();for(let i=0;i<10;i++)await cycle();const after=await counters();await cdp.detach();
  return {cycles:10,before,after,activeAnimations:await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)};
}
