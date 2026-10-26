async (page) => {
  // Read-only Chrome/CDP measurement; invoke through Playwright CLI run-code.
  await page.goto('http://127.0.0.1:8788');
  await page.setViewportSize({width:1440,height:1000});
  await page.getByRole('heading',{level:1}).waitFor();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  const before = (await cdp.send('Performance.getMetrics')).metrics;
  await page.evaluate(() => {
    window.motionPerf = {shifts:0,longTasks:[],frames:[],last:0};
    window.motionObservers = [new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.motionPerf.shifts+=e.value;})),new PerformanceObserver(list=>list.getEntries().forEach(e=>window.motionPerf.longTasks.push(e.duration)))];
    window.motionObservers[0].observe({type:'layout-shift',buffered:false});
    window.motionObservers[1].observe({type:'longtask',buffered:false});
    window.motionFrames = new Promise(resolve=>{
      function sample(time) {const p=window.motionPerf;if(p.last)p.frames.push(time-p.last);p.last=time;if(p.frames.length<90)requestAnimationFrame(sample);else resolve();}
      requestAnimationFrame(sample);
    });
  });
  await page.getByRole('link',{name:'Thư viện bài học',exact:true}).click();
  await page.getByRole('heading',{name:'Thư viện bài học',exact:true}).waitFor();
  await page.getByRole('button',{name:'Tài chính',exact:true}).click();
  await page.getByRole('button',{name:'Tất cả',exact:true}).click();
  await page.getByRole('link',{name:'Tổng quan',exact:true}).click();
  const browserMetrics = await page.evaluate(async()=>{
    await window.motionFrames;window.motionObservers.forEach(o=>o.disconnect());
    const p=window.motionPerf;return {cls:p.shifts,longTasks:p.longTasks,frameMedian:p.frames.toSorted((a,b)=>a-b)[45],framesOver34ms:p.frames.filter(f=>f>34).length};
  });
  const after = (await cdp.send('Performance.getMetrics')).metrics;
  const delta = name=>after.find(m=>m.name===name).value-before.find(m=>m.name===name).value;
  await cdp.detach();
  return {...browserMetrics,layoutCount:delta('LayoutCount'),styleCount:delta('RecalcStyleCount'),taskDurationMs:delta('TaskDuration')*1000};
}
