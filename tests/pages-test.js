/* Checks for the site pages built in Phase 2 (Browse, About, Gallery, Community, Join) and the homepage Poll and Trivia.
     node tests/pages-test.js            (needs Playwright; the server must be running: python3 -m http.server 8123)
   Part 1 checks the data files (limits that keep the homepage layout steady, files that exist, no repeats).
   Part 2 drives the pages in headless Chromium: filters, search, the picture viewer, polls (one vote per browser),
   the trivia game, memories (escaping, limits, delete), the Join page (nothing sent, nothing stored, passwords cleared),
   the hero height staying put after voting, and no sideways scroll on a phone.
   Nothing outside localhost is contacted: other addresses are answered with a stand-in. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BASE = process.env.BASE || 'http://localhost:8123';
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL: ' + m); } };

/* ---------------------------------------------------------------- part 1: the data */
function load(files) {
  const ctx = vm.createContext({ window: {}, console });
  files.forEach((f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }));
  return ctx;
}
const dups = (a) => a.filter((x, i) => a.indexOf(x) !== i);
(function data() {
  const T = load(['js/trivia-data.js']), TR = vm.runInContext('TRIVIA', T), TC = vm.runInContext('TRIVIA_CATS', T);
  ok(TR.length >= 30, 'trivia: at least 30 questions (have ' + TR.length + ')');
  ok(!dups(TR.map((t) => t.id)).length, 'trivia: ids are unique ' + dups(TR.map((t) => t.id)));
  ok(!dups(TR.map((t) => t.q)).length, 'trivia: no question appears twice');
  TR.forEach((t) => {
    const w = 'trivia ' + t.id + ': ';
    ok(t.options && t.options.length === 4, w + 'exactly 4 options');
    ok(Number.isInteger(t.answer) && t.answer >= 0 && t.answer <= 3, w + 'answer is 0 to 3');
    ok(t.q && t.q.length <= 65, w + 'question is 65 characters or fewer (' + (t.q || '').length + ')');
    ok(t.options.every((o) => o && o.length <= 22), w + 'every option is 22 characters or fewer: ' + t.options.filter((o) => o.length > 22));
    ok(new Set(t.options).size === 4, w + 'options differ from each other');
    ok(t.why && t.why.length <= 80, w + 'explanation is 80 characters or fewer (' + (t.why || '').length + ')');
    ok(TC[t.cat], w + 'category exists');
  });
  Object.keys(TC).forEach((k) => ok(TR.some((t) => t.cat === k), 'trivia: category ' + k + ' has questions'));
  const P = load(['js/poll-data.js']), PO = vm.runInContext('POLLS', P);
  ok(PO.length >= 7, 'polls: at least 7 (daily poll rotates, so a week without a repeat)');
  ok(!dups(PO.map((p) => p.id)).length, 'polls: ids are unique');
  PO.forEach((p) => {
    const w = 'poll ' + p.id + ': ';
    ok(p.q && p.q.length <= 30, w + 'question is 30 characters or fewer (' + (p.q || '').length + ')');
    ok(p.options.length >= 2 && p.options.length <= 6, w + '2 to 6 options');
    ok(p.options.every((o) => o.length <= 16), w + 'every option is 16 characters or fewer: ' + p.options.filter((o) => o.length > 16));
    ok(p.seed && p.seed.length === p.options.length && p.seed.every((n) => Number.isInteger(n) && n >= 0), w + 'one sample count per option');
  });
  const G = load(['js/gallery-data.js']), GL = vm.runInContext('GALLERY', G), GC = vm.runInContext('GALLERY_CATS', G).map((c) => c.id);
  ok(GL.length >= 12, 'gallery: at least 12 pictures');
  ok(!dups(GL.map((g) => g.id)).length, 'gallery: ids are unique');
  GL.forEach((g) => { ok(fs.existsSync(path.join(ROOT, g.src)), 'gallery ' + g.id + ': file exists (' + g.src + ')'); ok(GC.includes(g.cat), 'gallery ' + g.id + ': category exists'); ok(g.alt && g.title, 'gallery ' + g.id + ': has a title and a description'); });
  GC.forEach((c) => ok(GL.some((g) => g.cat === c), 'gallery: category ' + c + ' has pictures'));
  const C = load(['js/community-data.js']), CM = vm.runInContext('COMMUNITY', C), fc = CM.forumCats.map((c) => c.id);
  ok(CM.topics.length >= 8, 'community: at least 8 sample topics');
  CM.topics.forEach((t) => { ok(fc.includes(t.cat) && t.t && t.by && Number.isInteger(t.n), 'community topic "' + t.t + '" is complete'); });
  ok(CM.memories.length >= 2 && CM.memories.every((m) => m.name === 'Sample'), 'community: sample memories are labelled as samples');
  // the pages that must exist, because other pages link to them
  ['browse.html', 'about.html', 'gallery.html', 'community.html', 'join.html'].forEach((f) => ok(fs.existsSync(path.join(ROOT, f)), f + ' exists'));
})();

/* ---------------------------------------------------------------- part 2: the pages */
const { chromium } = require('playwright');
const STAND_IN = '<!doctype html><title>stand-in</title><body>stand-in</body>';
async function open(b, url, vp) {
  const ctx = await b.newContext({ viewport: vp || { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  pg.errs = []; pg.outside = [];
  pg.on('pageerror', (e) => pg.errs.push(e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) pg.errs.push(m.text()); });
  await pg.route('https://i.ytimg.com/**', (r) => r.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#557"/></svg>' }));
  await ctx.route(/^https?:\/\/(?!localhost)/, (r) => { const u = r.request().url(); pg.outside.push(u); r.fulfill(/\.js(\?|$)|iframe_api/.test(u) ? { contentType: 'text/javascript', body: '' } : { contentType: 'text/html', body: STAND_IN }); });
  if (url) await pg.goto(BASE + '/' + url, { waitUntil: 'load' });
  return { ctx, pg };
}
const noSideScroll = (pg) => pg.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
const vis = (pg, sel) => pg.locator(sel + ':not([hidden])').count();

(async () => {
  const b = await chromium.launch();

  /* ---- Browse ---- */
  {
    const { ctx, pg } = await open(b, 'browse.html?cat=movies');
    const n = await pg.locator('#b-out .card, #b-out article').count();
    ok(n > 0, 'browse: the movies list shows cards (' + n + ')');
    ok(/Movies/i.test(await pg.textContent('h1')), 'browse: the heading names the category');
    ok((await pg.locator('#b-cats a[aria-current="true"]').textContent()).includes('Movies'), 'browse: the Movies chip is marked as current');
    await pg.fill('#b-q', 'zzzz-no-such-title');
    await pg.waitForTimeout(300);
    ok(/no|nothing|did not/i.test(await pg.textContent('#b-out')), 'browse: a search with no match says so');
    await pg.fill('#b-q', '');
    const all = await pg.locator('#b-out .card, #b-out article').count();
    await pg.check('#b-official'); await pg.waitForTimeout(200);
    const off = await pg.locator('#b-out .card, #b-out article').count();
    ok(off <= all, 'browse: "official only" never adds items (' + off + ' of ' + all + ')');
    await pg.goto(BASE + '/browse.html?q=bajaj'); await pg.waitForTimeout(300);
    ok(await pg.locator('#b-out .card, #b-out article').count() > 0, 'browse: ?q=bajaj finds results across the site');
    await pg.goto(BASE + '/browse.html?featured=1'); ok(await pg.locator('#b-out .card, #b-out article').count() > 0, 'browse: featured list is not empty');
    await pg.goto(BASE + '/browse.html?memory=1'); ok(await pg.locator('#b-out [id^="y-"]').count() > 0, 'browse: Memory Lane groups items by year');
    await pg.goto(BASE + '/browse.html?cat=nonsense'); ok(await pg.locator('#b-out .card, #b-out article').count() > 0, 'browse: an unknown category falls back to everything');
    await pg.goto(BASE + '/browse.html?cat=games'); await pg.waitForURL(/arcade\.html/); ok(true, 'browse: ?cat=games goes to the Arcade');
    ok(!pg.errs.length, 'browse: no page errors ' + pg.errs);
    await ctx.close();
  }

  /* ---- About / Submit ---- */
  {
    const { ctx, pg } = await open(b, 'about.html');
    for (const id of ['about', 'submit', 'guidelines', 'contact']) ok(await pg.locator('#' + id).count() === 1, 'about: section #' + id);
    await pg.fill('#s-url', 'https://example.com/not-youtube'); await pg.click('#sub-form button[type=submit]');
    ok(!(await pg.locator('#s-err').isHidden()), 'about: a non-YouTube link is refused with a message');
    await pg.fill('#s-url', 'javascript:alert(1)'); await pg.click('#sub-form button[type=submit]');
    ok(!(await pg.locator('#s-err').isHidden()), 'about: a javascript: link is refused');
    const popup = ctx.waitForEvent('page', { timeout: 3000 }).catch(() => null);
    await pg.fill('#s-url', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'); await pg.click('#sub-form button[type=submit]');
    const p2 = await popup;
    ok(p2 && /github\.com/.test(p2.url()), 'about: a valid link opens a prefilled GitHub message (' + (p2 && p2.url().slice(0, 60)) + ')');
    ok(!pg.errs.length, 'about: no page errors ' + pg.errs);
    await ctx.close();
  }

  /* ---- Gallery ---- */
  {
    const { ctx, pg } = await open(b, 'gallery.html');
    const total = await vis(pg, '.pix-item');
    ok(total >= 12, 'gallery: shows every picture (' + total + ')');
    await pg.click('#g-cats a[data-cat=wallpapers]');
    const w = await vis(pg, '.pix-item');
    ok(w > 0 && w < total, 'gallery: the Wallpapers filter narrows the grid (' + w + ' of ' + total + ')');
    ok(/wallpapers/.test(pg.url()), 'gallery: the filter is kept in the address');
    await pg.locator('.pix-item:not([hidden]) a').first().click();
    ok(await pg.locator('#m-v img').isVisible(), 'gallery: a click opens the big picture');
    ok(/^1 of /.test(await pg.textContent('#m-count')), 'gallery: the viewer says which picture it is');
    ok(await pg.locator('#m-prev').isDisabled(), 'gallery: Previous is disabled on the first picture');
    await pg.click('#m-next'); ok(/^2 of /.test(await pg.textContent('#m-count')), 'gallery: Next moves on');
    await pg.keyboard.press('ArrowLeft'); ok(/^1 of /.test(await pg.textContent('#m-count')), 'gallery: the left arrow key goes back');
    for (let i = 0; i < w + 2; i++) await pg.keyboard.press('ArrowRight');
    ok(new RegExp('^' + w + ' of ' + w).test(await pg.textContent('#m-count')), 'gallery: viewer only flips through the filtered pictures (' + (await pg.textContent('#m-count')) + ')');
    ok(await pg.locator('#m-next').isDisabled(), 'gallery: Next is disabled on the last picture');
    await pg.keyboard.press('Escape'); ok(await pg.locator('#m-v img').count() === 0, 'gallery: Escape closes the viewer');
    await pg.goto(BASE + '/gallery.html?cat=things'); ok(await vis(pg, '.pix-item') > 0 && await vis(pg, '.pix-item') < total, 'gallery: a filtered address opens already filtered');
    await pg.goto(BASE + '/gallery.html?cat=nope'); ok(await vis(pg, '.pix-item') === total, 'gallery: an unknown category shows everything');
    ok(!pg.errs.length, 'gallery: no page errors ' + pg.errs);
    await ctx.close();
    const m = await open(b, 'gallery.html', { width: 390, height: 800 });
    ok(await noSideScroll(m.pg), 'gallery: no sideways scroll on a phone'); await m.ctx.close();
  }

  /* ---- Community ---- */
  {
    const { ctx, pg } = await open(b, 'community.html');
    // forum
    const all = await pg.locator('#f-list .cm-topic').count();
    ok(all >= 8, 'forum: sample topics are listed (' + all + ')');
    ok((await pg.locator('#f-list .cm-s').count()) === all, 'forum: every topic is labelled SAMPLE');
    await pg.click('#f-cats button[data-cat=cricket]');
    const cr = await pg.locator('#f-list .cm-topic').count(); ok(cr > 0 && cr < all, 'forum: a topic filter narrows the list (' + cr + ')');
    await pg.click('#f-new'); ok(!(await pg.locator('#f-msg').isHidden()), 'forum: Start a Topic explains that posting is not open yet');
    // memories
    const mine = '#m-mine .cm-mem';
    ok((await pg.locator(mine).count()) === 0, 'memories: starts empty');
    await pg.fill('#m-text', 'short'); await pg.click('#m-form button[type=submit]');
    ok(!(await pg.locator('#m-err').isHidden()), 'memories: a too-short memory is refused');
    await pg.fill('#m-text', 'Watching Shaktimaan every Sunday with the whole building.'); await pg.fill('#m-year', '1850'); await pg.click('#m-form button[type=submit]');
    ok(!(await pg.locator('#m-err').isHidden()), 'memories: a year outside 1985 to 2005 is refused');
    await pg.fill('#m-year', '1997'); await pg.fill('#m-name', '<b>bold</b>'); await pg.click('#m-form button[type=submit]');
    ok((await pg.locator(mine).count()) === 1, 'memories: a good memory is saved and listed');
    ok((await pg.locator('#m-mine b').count()) === 0, 'memories: a name containing HTML is shown as text, not as HTML');
    await pg.fill('#m-text', '<img src=x onerror="window.__xss=1"> and <script>window.__xss=1</script> plus some words'); await pg.click('#m-form button[type=submit]');
    await pg.waitForTimeout(200);
    ok(!(await pg.evaluate(() => window.__xss)), 'memories: HTML typed into a memory never runs');
    ok((await pg.locator('#m-mine img').count()) === 0, 'memories: HTML typed into a memory creates no elements');
    ok((await pg.locator(mine).count()) === 2, 'memories: both are listed');
    await pg.reload(); ok((await pg.locator(mine).count()) === 2, 'memories: they are still there after a reload (this browser)');
    ok(/This device|this device/.test(await pg.textContent('#memories')), 'memories: the page says they are saved only on this device');
    await pg.locator('#m-mine .cm-del').first().click(); ok((await pg.locator(mine).count()) === 1, 'memories: Delete removes one');
    await pg.click('#m-clear'); ok((await pg.locator(mine).count()) === 1, 'memories: "remove all" needs a second click');
    await pg.click('#m-clear'); ok((await pg.locator(mine).count()) === 0, 'memories: a second click removes all');
    const stored = await pg.evaluate(() => localStorage.getItem('community.memories.v1')); ok(stored === '[]', 'memories: storage is emptied after removing all');
    // the cap
    await pg.evaluate(() => { const a = []; for (let i = 0; i < 30; i++) a.push({ id: 'x' + i, name: '', year: '', text: 'Memory number ' + i + ' for the cap test', at: i }); localStorage.setItem('community.memories.v1', JSON.stringify(a)); });
    await pg.reload(); await pg.fill('#m-text', 'One more memory than the page allows.'); await pg.click('#m-form button[type=submit]');
    ok(!(await pg.locator('#m-err').isHidden()) && (await pg.locator(mine).count()) === 30, 'memories: the 31st is refused with a message');
    await pg.evaluate(() => localStorage.setItem('community.memories.v1', '{not json')); await pg.reload();
    ok((await pg.locator(mine).count()) === 0 && !pg.errs.length, 'memories: damaged saved data is ignored without an error ' + pg.errs);
    // polls
    await pg.evaluate(() => localStorage.clear()); await pg.reload();
    const polls = await pg.locator('.cm-poll').count(); ok(polls >= 7, 'polls: the archive lists every poll (' + polls + ')');
    ok((await pg.locator('.cm-poll').first().textContent()).includes('TODAY'), 'polls: today’s poll comes first and is marked');
    const first = pg.locator('.cm-poll').first();
    await first.locator('button[type=submit]').click();
    ok((await first.locator('input[type=radio]').count()) > 0, 'polls: not yet voted: choices still shown');
    await first.locator('input[type=radio]').nth(1).check(); await first.locator('button[type=submit]').click();
    const pcts = await first.locator('.pres .pn b').allTextContents();
    ok(pcts.length >= 2 && pcts.every((t) => /^\d+%$/.test(t)), 'polls: after voting, every option shows a percentage (' + pcts + ')');
    const sum = pcts.reduce((a, t) => a + parseInt(t, 10), 0); ok(sum >= 98 && sum <= 102, 'polls: percentages add up to about 100 (' + sum + ')');
    ok(/\d[\d,]* votes/.test(await first.locator('.pres .pn').first().textContent()), 'polls: vote counts are shown');
    ok((await first.locator('.pres.is-mine').count()) === 1, 'polls: your own choice is marked');
    ok(await first.locator('button[type=submit]').isDisabled(), 'polls: the Vote button is disabled after voting');
    ok(/sample/i.test(await first.locator('.cm-pn').textContent()), 'polls: results say they include sample numbers');
    await pg.reload();
    const again = pg.locator('.cm-poll').first();
    ok((await again.locator('input[type=radio]').count()) === 0 && (await again.locator('.pres').count()) >= 2, 'polls: after a reload the same browser sees results, not a second ballot (one vote)');
    ok((await pg.locator('.cm-poll').nth(1).locator('input[type=radio]').count()) > 0, 'polls: other polls are still open');
    // trivia
    await pg.click('#tg-again');
    ok(/Question 1 of 10/.test(await pg.textContent('.tg-prog')), 'trivia: a round has 10 questions');
    let right = 0;
    for (let i = 0; i < 10; i++) {
      ok((await pg.locator('.tg-opts button').count()) === 4, 'trivia: question ' + (i + 1) + ' has 4 answers');
      await pg.locator('.tg-opts button').nth(i % 4).click();
      ok(!(await pg.locator('#tg-fb').isHidden()) && (await pg.textContent('#tg-fb')).length > 10, 'trivia: an explanation appears after answering');
      ok((await pg.locator('.tg-opts .is-right').count()) === 1, 'trivia: the right answer is revealed');
      ok((await pg.locator('.tg-opts button:not(:disabled)').count()) === 0, 'trivia: answers lock after one pick');
      if (await pg.locator('.tg-opts .is-wrong').count() === 0) right++;
      await pg.click('#tg-next');
    }
    ok(/\/ 10/.test(await pg.textContent('.tg-big')), 'trivia: the round ends with a score out of 10');
    ok((await pg.textContent('.tg-big')).startsWith(right + ' /'), 'trivia: the final score matches the right answers (' + right + ')');
    ok((await pg.evaluate(() => localStorage.getItem('trivia.best'))) === String(right), 'trivia: the best score is kept on this device');
    await pg.selectOption('#tg-topic', 'cricket'); await pg.click('#tg-again');
    ok((await pg.locator('.tg-cat').textContent()).toLowerCase().includes('cricket'), 'trivia: a topic choice limits the questions');
    ok(!pg.errs.length, 'community: no page errors ' + pg.errs);
    ok(!pg.outside.length, 'community: contacts nothing outside this site ' + pg.outside);
    await ctx.close();
    const m = await open(b, 'community.html', { width: 390, height: 800 });
    ok(await noSideScroll(m.pg), 'community: no sideways scroll on a phone'); await m.ctx.close();
  }

  /* ---- Join ---- */
  {
    const { ctx, pg } = await open(b, 'join.html');
    const reqs = []; pg.on('request', (r) => { if (r.method() !== 'GET' || !r.url().startsWith(BASE)) reqs.push(r.method() + ' ' + r.url()); });
    ok((await pg.locator('#h-join').count()) === 1 && /not switched on/i.test(await pg.textContent('.arc-sub')), 'join: says plainly that accounts are not switched on');
    ok((await pg.locator('main input[name]').count()) === 0, 'join: no input has a name, so a password can never be put in a link');
    await pg.click('#lg-form button[type=submit]'); ok(!(await pg.locator('#lg-err').isHidden()), 'join: empty login shows an error');
    await pg.fill('#jn-email', 'not-an-email'); await pg.click('#jn-form button[type=submit]'); ok(/email/i.test(await pg.textContent('#jn-err')), 'join: a bad email is refused');
    await pg.fill('#jn-email', 'a@b.co'); await pg.fill('#jn-nick', 'ab'); await pg.click('#jn-form button[type=submit]'); ok(/nickname/i.test(await pg.textContent('#jn-err')), 'join: a short nickname is refused');
    await pg.fill('#jn-nick', 'retro_fan'); await pg.fill('#jn-pw', 'short'); await pg.click('#jn-form button[type=submit]'); ok(/10 characters/.test(await pg.textContent('#jn-err')), 'join: a short password is refused');
    await pg.fill('#jn-pw', 'long enough pw'); await pg.fill('#jn-pw2', 'different pw!!'); await pg.click('#jn-form button[type=submit]'); ok(/match/.test(await pg.textContent('#jn-err')), 'join: mismatched passwords are refused');
    await pg.fill('#jn-pw2', 'long enough pw'); await pg.click('#jn-form button[type=submit]'); ok(/13 or older/.test(await pg.textContent('#jn-err')), 'join: the age/guidelines box is required');
    await pg.click('#jn-pw ~ .jn-eye, [data-for=jn-pw]'); ok((await pg.getAttribute('#jn-pw', 'type')) === 'text', 'join: Show reveals the password');
    await pg.click('[data-for=jn-pw]'); ok((await pg.getAttribute('#jn-pw', 'type')) === 'password', 'join: Hide hides it again');
    await pg.check('#jn-ok'); await pg.click('#jn-form button[type=submit]');
    ok(!(await pg.locator('#jn-note').isHidden()) && /not switched on/i.test(await pg.textContent('#jn-note')), 'join: a valid form ends with a clear "not switched on" message');
    ok((await pg.inputValue('#jn-pw')) === '' && (await pg.inputValue('#jn-pw2')) === '', 'join: the password fields are cleared');
    await pg.fill('#lg-id', 'retro_fan'); await pg.fill('#lg-pw', 'secret-password-123'); await pg.click('#lg-form button[type=submit]');
    ok((await pg.inputValue('#lg-pw')) === '' && /not switched on/i.test(await pg.textContent('#jn-note')), 'join: login clears the password and says it is not switched on');
    const dump = await pg.evaluate(() => JSON.stringify([Object.entries(localStorage), Object.entries(sessionStorage), document.cookie, location.href]));
    ok(!/secret-password|long enough pw/.test(dump), 'join: no password reaches storage, cookies or the address bar');
    ok(!reqs.length, 'join: nothing was sent anywhere ' + reqs);
    ok(!pg.errs.length, 'join: no page errors ' + pg.errs);
    await ctx.close();
    const m = await open(b, 'join.html', { width: 390, height: 800 });
    ok(await noSideScroll(m.pg), 'join: no sideways scroll on a phone'); await m.ctx.close();
  }

  /* ---- Homepage: poll, trivia, links ---- */
  for (const w of [1440, 1280]) {
    const { ctx, pg } = await open(b, 'home.html', { width: w, height: 900 });
    const hero = () => pg.evaluate(() => document.querySelector('.hero').offsetHeight);
    const h0 = await hero();
    ok((await pg.locator('#poll-opts input').count()) >= 2, 'home ' + w + ': the poll shows its choices');
    await pg.locator('#poll-opts input').nth(0).check(); await pg.click('#poll-go');
    const res = await pg.locator('#poll-opts .res').allTextContents();
    ok(res.length >= 2 && res.every((t) => /\d+%/.test(t)), 'home ' + w + ': results show percentages (' + res.length + ' rows)');
    ok(/votes/.test(await pg.textContent('#poll-note')), 'home ' + w + ': the total vote count is shown');
    await pg.locator('#trivia-opts button').nth(1).click();
    ok(!(await pg.locator('#trivia-a').isHidden()), 'home ' + w + ': trivia shows the explanation');
    ok(/Score 0\/1|Score 1\/1/.test(await pg.textContent('#trivia-score')), 'home ' + w + ': the trivia score is tracked');
    ok((await hero()) === h0, 'home ' + w + ': the hero height does not change after voting and answering (' + h0 + ' then ' + (await hero()) + ')');
    const q1 = await pg.textContent('#trivia-q'); await pg.click('#trivia-go');
    ok((await pg.textContent('#trivia-q')) !== q1, 'home ' + w + ': Next Question brings a different question');
    ok((await hero()) === h0, 'home ' + w + ': the hero height is steady after Next');
    await pg.reload(); ok((await pg.locator('#poll-opts .res').count()) >= 2, 'home ' + w + ': after a reload the poll shows results (one vote per browser)');
    if (w === 1440) {
      ok((await pg.getAttribute('#join', 'href')) === 'join.html#join', 'home: Join Now! goes to the Join page');
      await pg.fill('#lg-p', 'typed-password'); await pg.click('#login-form button[type=submit]');
      ok((await pg.inputValue('#lg-p')) === '' && !/typed-password/.test(pg.url()), 'home: the login box clears a typed password and sends nothing');
      ok((await pg.locator('#login-form input[name]').count()) === 0, 'home: the login inputs have no name, so a password can never be put in a link');
    }
    ok(!pg.errs.length, 'home ' + w + ': no page errors ' + pg.errs);
    await ctx.close();
  }
  {
    const { ctx, pg } = await open(b, 'community.html');
    ok((await pg.getAttribute('.hd-login', 'href')) === 'join.html', 'header: Login / Join goes to the Join page from other pages');
    await ctx.close();
  }

  /* ---- No sideways scroll on a phone, on the pages without their own phone check ---- */
  for (const u of ['browse.html', 'browse.html?cat=tv', 'about.html', 'home.html']) {
    const m = await open(b, u, { width: 390, height: 800 });
    ok(await noSideScroll(m.pg), u + ': no sideways scroll on a phone'); ok(!m.pg.errs.length, u + ' (phone): no page errors ' + m.pg.errs); await m.ctx.close();
  }

  /* ---- Every link the homepage and the footer point at exists ---- */
  {
    const { ctx, pg } = await open(b, 'home.html');
    const hrefs = await pg.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => h && !/^(https?:|mailto:|#|javascript:)/.test(h)).map((h) => h.split('#')[0].split('?')[0]).filter(Boolean))]);
    for (const h of hrefs) ok(fs.existsSync(path.join(ROOT, h)), 'home: link target exists: ' + h);
    await ctx.close();
  }

  await b.close();
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
