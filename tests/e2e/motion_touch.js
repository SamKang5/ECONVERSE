async (page) => {
  // Open the CLI session with --mobile so this exercises touch, not just a viewport.
  const checks=[];const verify=(value,name)=>{if(!value)throw new Error(name);checks.push(name);};
  await page.getByRole('heading',{level:1}).waitFor();
  verify(await page.evaluate(()=>navigator.maxTouchPoints>0&&matchMedia('(pointer:coarse)').matches),'Actual mobile emulation has touch input and a coarse pointer');
  await page.getByRole('button',{name:'Mở menu',exact:true}).tap();
  await page.getByRole('link',{name:'Thư viện bài học',exact:true}).tap();
  await page.getByRole('textbox',{name:'Tìm bài học'}).fill('Độ co giãn của cầu theo giá');
  await page.locator('.library-lesson').first().tap();
  await page.getByRole('button',{name:'Làm bài kiểm tra',exact:true}).tap();
  await page.locator('.quiz-question').first().waitFor();
  await page.locator('.quiz-option').first().tap();
  verify(await page.getByRole('radio').first().isChecked(),'Touch selects a quiz answer');
  verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile quiz has no horizontal overflow');
  await page.emulateMedia({reducedMotion:'reduce'});
  verify(await page.locator('.quiz-area').evaluate(e=>getComputedStyle(e).animationName==='none'),'Touch quiz respects reduced motion');
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:'tests/e2e/motion-evidence/after-quiz-touch.png',fullPage:true});
  return {passed:true,checks};
}
