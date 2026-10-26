async (page) => {
  const config = __REVIEW_CONFIG__;
  const checks = [], accessibility = [], playback = [];
  const verify = (value, message) => { if (!value) throw new Error(message); checks.push(message); };
  const path = name => config.evidence + '/' + name;
  const screenshot = async (target, name) => { await target.evaluate(() => window.scrollTo({top:0,behavior:'instant'})); await target.screenshot({path:path(name),fullPage:true}); };
  const ready = async target => { await target.locator('main h1').first().waitFor(); await target.getByRole('button',{name:'Đang kết nối…'}).waitFor({state:'hidden'}); };
  const a11y = async (target, name) => {
    await target.evaluate(async () => { await Promise.all(document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))); });
    if (!await target.evaluate(() => Boolean(window.axe))) await target.addScriptTag({url:config.base+'/__review-axe.js'});
    const results = await target.evaluate(async () => window.axe.run(document,{iframes:false,runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
    const violations=results.violations.map(item=>({id:item.id,impact:item.impact,help:item.help,nodes:item.nodes.map(node=>({target:node.target,summary:node.failureSummary}))}));
    accessibility.push({screen:name,violations});
    if(!violations.length) checks.push(`${name}: zero WCAG A/AA violations`);
  };
  async function login(target, account) {
    await target.goto(config.base); await ready(target);
    await target.getByRole('button',{name:'Đăng nhập',exact:true}).click();
    const dialog=target.getByRole('dialog');
    await dialog.getByLabel('Địa chỉ email').fill(account.email);
    await dialog.getByLabel('Mật khẩu').fill(account.password);
    await dialog.getByRole('button',{name:'Đăng nhập ngay',exact:true}).click();
    await dialog.waitFor({state:'hidden'});
    await target.getByRole('button',{name:`Hồ sơ ${account.displayName}`,exact:true}).waitFor();
  }
  try {
  await page.setViewportSize({width:1440,height:1000});
  await ready(page);
  await a11y(page,'guest dashboard');
  await screenshot(page,'01-dashboard-desktop.png');
  // Registration and a distinct subsequent UI login.
  await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();
  let dialog=page.getByRole('dialog');
  await dialog.getByRole('button',{name:'Đăng ký',exact:true}).click();
  const learner={email:`browser-${config.suffix}@review.invalid`,password:`Review-${config.suffix}-aA1!`,displayName:'Browser Learner'};
  await dialog.getByLabel('Tên hiển thị').fill(learner.displayName);
  await dialog.getByLabel('Địa chỉ email').fill(learner.email);
  await dialog.getByLabel('Mật khẩu').fill(learner.password);
  await dialog.getByRole('button',{name:'Tạo tài khoản & Bắt đầu học',exact:true}).click();
  await dialog.waitFor({state:'hidden'});
  await page.getByRole('button',{name:`Hồ sơ ${learner.displayName}`,exact:true}).waitFor();
  verify(await page.getByText('Học viên',{exact:true}).count()>0,'Registration creates visible learner account');
  await page.getByRole('button',{name:'Đăng xuất',exact:true}).click();
  await page.getByRole('button',{name:'Đăng nhập',exact:true}).waitFor();
  await login(page,learner);
  verify(true,'Registered learner can log out and log in through UI');
  await page.getByRole('link',{name:'Thư viện bài học',exact:true}).click();
  await page.getByRole('heading',{name:'Thư viện bài học',exact:true}).waitFor();
  await page.getByRole('button',{name:'Tài chính',exact:true}).click();
  await page.getByRole('textbox',{name:'Tìm bài học'}).fill('Lập ngân sách');
  verify(await page.locator('.library-lesson').count()===1,'Finance category and keyword search filter canonical lessons');
  await page.getByRole('textbox',{name:'Tìm bài học'}).fill('');
  await page.getByRole('button',{name:'Tất cả',exact:true}).click();
  await a11y(page,'course library');
  await screenshot(page,'02-library-desktop.png');
  await page.getByRole('textbox',{name:'Tìm bài học'}).fill('Độ co giãn của cầu theo giá');
  await page.locator('.library-lesson').first().click();
  await page.getByRole('heading',{name:'Độ co giãn của cầu theo giá (PED)',exact:true}).waitFor();
  const video=page.locator('iframe');const originalVideo=await video.elementHandle();
  verify((await video.getAttribute('src')).includes('fO4tKHj3_lA'),'Historical YouTube video ID retained in responsive player');
  await a11y(page,'lesson player');
  await screenshot(page,'03-lesson-desktop.png');
  try {
    const frame=page.frameLocator('iframe');
    const play=frame.getByRole('button',{name:/play|phát/i}).first();
    await play.click({timeout:30000});
    const videoDocument=page.frames().find(item=>item.url().includes('youtube-nocookie.com/embed/fO4tKHj3_lA'));
    if(!videoDocument) throw new Error('YouTube frame did not load.');
    await videoDocument.waitForFunction(()=>{const video=document.querySelector('video');return video&&!video.paused&&video.readyState>=2&&video.currentTime>.2;},{},{timeout:30000,polling:100});
    const state=await frame.locator('video').evaluate(element=>({paused:element.paused,readyState:element.readyState,currentTime:element.currentTime,error:element.error?.message}),{},{timeout:12000});
    playback.push({verified:!state.paused&&state.readyState>=2,state});
    await screenshot(page,'03b-video-playing.png');
  } catch(error) { playback.push({verified:false,reason:String(error).slice(0,400)}); }
  if(playback[0]?.verified) {
    const refreshed=page.waitForResponse(response=>response.url()===config.base+'/api/auth/session');
    await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await refreshed;
    const videoDocument=page.frames().find(item=>item.url().includes('youtube-nocookie.com/embed/fO4tKHj3_lA'));
    await videoDocument.waitForFunction(start=>{const element=document.querySelector('video');return element&&!element.paused&&element.currentTime>start+.1;},playback[0].state.currentTime,{timeout:15000,polling:100});
    const state=await videoDocument.locator('video').evaluate(element=>({paused:element.paused,currentTime:element.currentTime,readyState:element.readyState}));
    playback.push({verified:!state.paused&&await originalVideo.evaluate(element=>element.isConnected),state,after:'session refresh'});
    verify(playback.at(-1).verified,'Actual playing video survives unrelated session refresh without iframe remount');
  }
  await page.getByRole('button',{name:'Làm bài kiểm tra',exact:true}).click();
  await page.locator('.quiz-question').first().waitFor();
  await page.getByRole('button',{name:'Nộp bài kiểm tra',exact:true}).click();
  verify((await page.getByRole('alert').innerText()).includes('tất cả câu hỏi'),'Incomplete quiz is validated before submission');
  for(let i=0;i<config.answers.length;i++) await page.locator('.quiz-question').nth(i).getByRole('radio').nth(config.answers[i]).check();
  await a11y(page,'quiz');
  verify(await originalVideo.evaluate(element=>element.isConnected),'Real playing iframe remains mounted through quiz selection and validation');
  if(playback[0]?.verified) {
    const videoDocument=page.frames().find(item=>item.url().includes('youtube-nocookie.com/embed/fO4tKHj3_lA'));
    // Hidden cross-origin frames may suspend requestAnimationFrame; poll media state directly.
    await videoDocument.waitForFunction(start=>{const element=document.querySelector('video');return element&&!element.paused&&element.currentTime>start+.1;},playback[0].state.currentTime,{timeout:15000,polling:100});
    const state=await videoDocument.locator('video').evaluate(element=>({paused:element.paused,currentTime:element.currentTime,readyState:element.readyState}));
    playback.push({verified:!state.paused,state,after:'quiz selection and validation'});
    verify(!state.paused,'Actual YouTube playback continues after unrelated quiz interactions');
  }
  await page.getByRole('button',{name:'Nộp bài kiểm tra',exact:true}).click();
  await page.getByRole('heading',{name:'100% · 4/4 câu đúng',exact:true}).waitFor();
  verify((await page.locator('.quiz-result').innerText()).includes('+45 XP'),'Server grading returns perfect score and 45 XP');
  verify(await page.locator('.quiz-explanation').count()===4,'Explanations become available after grading');
  await screenshot(page,'04-quiz-result.png');
  await page.reload(); await ready(page);
  await page.locator('.completed-label').waitFor();
  verify(true,'Lesson completion persists after reload');
  await page.getByRole('link',{name:'Hồ sơ của tôi',exact:true}).click();
  await page.getByRole('heading',{name:'Hồ sơ của tôi',exact:true}).waitFor();
  await page.locator('.xp-history li').first().waitFor();
  verify((await page.locator('.xp-history').innerText()).includes('+45 XP'),'XP ledger appears in profile after reload');
  await page.getByLabel('Tên hiển thị',{exact:true}).fill('Browser Learner Updated');
  await page.getByRole('button',{name:'Lưu thay đổi',exact:true}).click();
  await page.locator('.form-success').waitFor();
  await a11y(page,'profile');
  await screenshot(page,'05-profile.png');
  await page.reload(); await ready(page);
  await page.waitForFunction(()=>document.querySelector('.profile-account input')?.value==='Browser Learner Updated');
  await page.locator('.xp-history li').first().waitFor();
  verify(await page.getByLabel('Tên hiển thị',{exact:true}).inputValue()==='Browser Learner Updated','Profile settings persist in D1');
  for(const viewport of [{width:768,height:1024},{width:390,height:844}]) {
    await page.setViewportSize(viewport); await page.goto(config.base+'/#dashboard'); await ready(page);
    verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${viewport.width}px dashboard has no page overflow`);
    await a11y(page,`${viewport.width}px dashboard`);
    await screenshot(page,`06-dashboard-${viewport.width}.png`);
    if(viewport.width===390) {
      await page.getByRole('button',{name:'Mở menu',exact:true}).click();
      await page.getByRole('link',{name:'Thư viện bài học',exact:true}).click();
      await page.getByRole('heading',{name:'Thư viện bài học',exact:true}).waitFor();
      verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile library navigation and layout work');
      await a11y(page,'mobile library');
      await screenshot(page,'07-library-mobile.png');
    }
  }
  const browser=page.context().browser();
  const editorContext=await browser.newContext({viewport:{width:1440,height:1000}});
  const editor=await editorContext.newPage(); await login(editor,config.accounts.editor);
  for(const id of ['lesson-2a','lesson-2b']) {
    const viewed=editor.waitForResponse(response=>response.url().endsWith('/api/progress/'+id)&&response.request().method()==='PUT');
    await editor.goto(config.base+'/#lesson/'+id);await viewed;
  }
  const recentProgress=editor.waitForResponse(response=>response.url().endsWith('/api/progress')&&response.status()===200);
  await editor.getByRole('link',{name:'Tổng quan',exact:true}).click();await recentProgress;
  await editor.locator('.hero-copy > p').filter({hasText:'Các yếu tố ảnh hưởng PED'}).waitFor();
  verify((await editor.locator('.hero-copy > p').innerText()).includes('Các yếu tố ảnh hưởng PED'),'Continue Learning resumes most recently viewed unfinished lesson');
  verify((await editor.locator('.lesson-list-item').first().innerText()).includes('Các yếu tố ảnh hưởng PED'),'Recent lessons list uses persistent view order');
  await editor.getByRole('link',{name:'Content Studio',exact:true}).click();
  await editor.getByRole('button',{name:'Create lesson',exact:true}).waitFor();
  verify(await editor.getByRole('button',{name:'Users',exact:true}).count()===0,'Editor UI excludes privileged admin controls');
  await editor.getByRole('button',{name:'Create lesson',exact:true}).click();
  const lessonId='browser-'+config.suffix, lessonTitle='Browser reviewed economics lesson '+config.suffix;
  const fields={'Lesson ID':lessonId,'Episode code':'R2','Lesson title':lessonTitle,'Duration':'02 phút','Module ID':'browser-review','Module title':'Browser review course','Unit code':'review','YouTube video URL':'https://www.youtube.com/watch?v=fO4tKHj3_lA','Module description':'Isolated local review','Short description':'End to end browser workflow rehearsal','Overview':'Editors draft and administrators publish.','Content heading':'Learning workflow','Content paragraphs · one paragraph per line':'This local-only lesson verifies the full content review journey.','Learning objectives · one per line':'Explain the draft and publication workflow.'};
  for(const [label,value] of Object.entries(fields)) await editor.getByLabel(label,{exact:true}).fill(value);
  await editor.getByRole('button',{name:'Add question',exact:true}).click();
  await editor.getByLabel('Question 1 text',{exact:true}).fill('Who publishes content?');
  for(const [index,letter] of ['A','B','C','D'].entries()) await editor.getByLabel('Question 1 option '+letter,{exact:true}).fill(['Administrator','Learner','Guest','Editor'][index]);
  await editor.getByRole('radio',{name:'Correct',exact:true}).first().check();
  await editor.getByLabel('Question 1 explanation',{exact:true}).fill('The administrator reviews and publishes the submitted draft.');
  await editor.getByRole('button',{name:'Save draft',exact:true}).click();
  await editor.getByRole('status').filter({hasText:'Draft saved'}).waitFor();
  await editor.getByRole('button',{name:'Save & preview',exact:true}).click();
  await editor.getByRole('heading',{name:lessonTitle,exact:true}).waitFor();
  await a11y(editor,'editor draft preview');
  await screenshot(editor,'08-editor-preview.png');
  await editor.getByRole('button',{name:'Back to editor',exact:true}).click();
  await editor.getByRole('button',{name:'Submit for review',exact:true}).click();
  await editor.getByRole('status').filter({hasText:/submitted for review/i}).waitFor();
  verify(true,'Editor creates draft, edits quiz, previews and submits through real UI');
  await screenshot(editor,'09-editor-submitted.png');
  const adminContext=await browser.newContext({viewport:{width:1440,height:1000}});
  const admin=await adminContext.newPage(); await login(admin,config.accounts.admin);
  await admin.getByRole('link',{name:'Admin Console',exact:true}).click();
  await admin.getByRole('button',{name:'Review queue',exact:true}).click();
  const reviewRow=admin.getByRole('row').filter({hasText:lessonTitle});
  await reviewRow.getByRole('button',{name:`Open ${lessonTitle} revision 1`,exact:true}).click();
  await admin.getByRole('button',{name:'Publish lesson',exact:true}).click();
  await admin.getByRole('status').filter({hasText:'published'}).waitFor();
  verify(true,'Admin reviews and publishes submitted content through real UI');
  await a11y(admin,'admin review');
  await screenshot(admin,'10-admin-published.png');
  await page.setViewportSize({width:1440,height:1000});
  const refreshed=page.waitForResponse(response=>response.url()===config.base+'/api/courses'&&response.status()===200);
  await page.getByRole('link',{name:'Thư viện bài học',exact:true}).click();await refreshed;
  await page.getByRole('textbox',{name:'Tìm bài học'}).fill(lessonTitle);
  await page.locator('.library-lesson').first().waitFor();
  verify((await page.locator('.library-lesson').innerText()).includes(lessonTitle),'Newly published lesson is visible to learner');
  await admin.getByRole('button',{name:'Users',exact:true}).click();
  await admin.getByRole('textbox',{name:'Search users'}).fill(learner.email);
  await admin.getByRole('button',{name:'Search',exact:true}).click();
  const role=admin.getByRole('combobox',{name:'Role for '+learner.email,exact:true});
  const promoted=admin.waitForResponse(response=>response.url().includes('/api/admin/users/')&&response.request().method()==='PATCH'&&response.status()===200);
  await role.selectOption('editor');await promoted;
  await admin.getByRole('status').filter({hasText:'Account role updated'}).waitFor();
  await page.reload();await ready(page);
  verify(await page.getByRole('link',{name:'Content Studio',exact:true}).count()===1,'Admin role assignment updates learner existing session UI');
  const demoted=admin.waitForResponse(response=>response.url().includes('/api/admin/users/')&&response.request().method()==='PATCH'&&response.status()===200);
  await role.selectOption('learner');await demoted;await admin.getByRole('status').filter({hasText:'Account role updated'}).waitFor();
  await admin.getByRole('button',{name:'Audit log',exact:true}).click();
  await admin.getByRole('heading',{name:'Audit history',exact:true}).waitFor();
  await admin.getByRole('cell',{name:'user.update',exact:true}).first().waitFor();
  verify(true,'Admin reviews persisted audit entries after changing user role');
  await a11y(admin,'admin audit');await screenshot(admin,'11-admin-audit.png');
  await admin.getByRole('button',{name:'Analytics',exact:true}).click();
  await admin.getByRole('heading',{name:'Platform overview',exact:true}).waitFor();
  await a11y(admin,'admin analytics');await screenshot(admin,'12-admin-analytics.png');
  for(const width of [768,390]) {
    await admin.setViewportSize({width,height:1000});
    verify(await admin.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px Admin Console has no page overflow`);
    await a11y(admin,`${width}px admin analytics`);
    await screenshot(admin,`13-admin-${width}.png`);
  }
  await editor.setViewportSize({width:390,height:844});
  verify(await editor.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile Content Studio has no page overflow');
  await a11y(editor,'mobile editor studio');await screenshot(editor,'14-editor-mobile.png');
  await editorContext.close();await adminContext.close();
  return {passed:accessibility.every(item=>item.violations.length===0)&&playback.every(item=>item.verified),checks,accessibility,playback};
  } catch(error) {
    await screenshot(page,'failure.png');
    return {passed:false,error:String(error),checks,accessibility,playback};
  }
}
