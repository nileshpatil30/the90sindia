// Browser smoke test for the TV page (needs Playwright). Stubs the YouTube API and fixes the clock.
// Run:  python3 -m http.server 8123  (in the repo root, in another terminal),  then  node tests/tv-smoke.js
// Screenshots go to $SP (or the temp folder).
const { chromium } = require('playwright');
const SP = process.env.SP || require('os').tmpdir();
const STUB = `
(function(){
  var Y = window.__yt = { players: {}, calls: [] };
  function P(id, opts){
    var self = this; this.id = id; this.state = -1; this.t = 0; Y.players[id] = this;
    var ev = (opts && opts.events) || {};
    this.loadVideoById = function(o){ Y.calls.push({ p: id, fn: 'load', v: o.videoId, s: o.startSeconds }); self.state = 1; self.t = o.startSeconds || 0;
      setTimeout(function(){ ev.onStateChange && ev.onStateChange({ data: 1 }); }, 5); };
    this.cuePlaylist = function(o){ Y.calls.push({ p: id, fn: 'cuePlaylist', list: o.list }); setTimeout(function(){ ev.onStateChange && ev.onStateChange({ data: 5 }); }, 20); };
    this.getPlaylist = function(){ return ['PL00000001a','PL00000002b','PL00000003c','PL00000004d']; };
    this.loadPlaylist = function(o){ Y.calls.push({ p: id, fn: 'loadPlaylist', list: o.list }); self.pi = 0; self.state = 1; setTimeout(function(){ ev.onStateChange && ev.onStateChange({ data: 1 }); }, 5); };
    this.playVideoAt = function(i){ Y.calls.push({ p: id, fn: 'playVideoAt', i: i }); self.pi = i; };
    this.getPlaylistIndex = function(){ return self.pi || 0; };
    this.nextVideo = function(){ Y.calls.push({ p: id, fn: 'next' }); self.pi = (self.pi||0) + 1; };
    this.previousVideo = function(){ Y.calls.push({ p: id, fn: 'prev' }); self.pi = Math.max(0, (self.pi||0) - 1); };
    this.stopVideo = function(){ self.state = -1; };
    this.playVideo = function(){}; this.pauseVideo = function(){}; this.mute = function(){}; this.unMute = function(){};
    this.getPlayerState = function(){ return self.state; };
    this.getCurrentTime = function(){ return self.t; };
    this.seekTo = function(s){ self.t = s; };
    setTimeout(function(){ ev.onReady && ev.onReady({}); }, 10);
  }
  window.YT = { Player: P };
})();`;

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };
const IST = (iso) => new Date(new Date(iso + ':00Z').getTime() - 330 * 60000);   // "2026-11-15T10:05" read as IST

async function open(b, vp, hash, when) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  await p.route(u => !/^(127\.0\.0\.1|localhost)$/.test(new URL(u).hostname), r => r.abort());
  await p.addInitScript(STUB);
  if (when) await p.clock.setFixedTime(when);
  await p.goto('http://127.0.0.1:8123/tv.html' + (hash || ''));
  await p.waitForTimeout(700);
  return { p, ctx, errs };
}

(async () => {
  const b = await chromium.launch();

  // 1. layout: phone and desktop, nothing sideways, every network visible
  for (const vp of [{ width: 1100, height: 900 }, { width: 390, height: 844 }]) {
    const { p, ctx, errs } = await open(b, vp, '#ch=ddn-1992', IST('2026-11-15T10:05'));
    const info = await p.evaluate(() => {
      const r = el => el.getBoundingClientRect();
      const btns = [...document.querySelectorAll('.net-btn')].map(e => { const q = r(e); return { n: e.dataset.net, l: Math.round(q.left), r: Math.round(q.right), w: Math.round(q.width), h: Math.round(q.height) }; });
      return {
        nets: btns.length, yrs: document.querySelectorAll('.yr').length, yrOn: document.querySelectorAll('.yr:not(:disabled)').length,
        chips: document.querySelectorAll('.chip').length, rows: document.querySelectorAll('.g-row').length,
        hscroll: document.documentElement.scrollWidth > innerWidth, sw: document.documentElement.scrollWidth, iw: innerWidth,
        btns, guide: document.getElementById('guide-ch').textContent, now: document.getElementById('now-title').textContent,
        meta: document.getElementById('now-meta').textContent, hash: location.hash, onairH: document.getElementById('onair-h').textContent
      };
    });
    console.log(vp.width, JSON.stringify({ ...info, btns: undefined }));
    ok(info.nets === 11, vp.width + ': 11 network buttons (got ' + info.nets + ')');
    ok(info.yrs === 24, vp.width + ': 24 year pills (got ' + info.yrs + ')');
    ok(!info.hscroll, vp.width + ': no sideways scroll (' + info.sw + ' > ' + info.iw + ')');
    ok(info.btns.every(x => x.l >= 0 && x.r <= vp.width), vp.width + ': every network button is inside the screen ' + JSON.stringify(info.btns.filter(x => x.l < 0 || x.r > vp.width)));
    ok(info.btns.every(x => x.h >= 40), vp.width + ': network buttons are tall enough to tap');
    ok(info.guide === 'DD National 1992', vp.width + ': guide title ' + info.guide);
    ok(info.now === 'The Jungle Book (Mowgli)', vp.width + ': Sunday 10:05 IST on DD National 1992 is The Jungle Book (got ' + info.now + ')');
    ok(info.chips > 0, vp.width + ': on-air shelf has chips');
    ok(info.hash === '#ch=ddn-1992', vp.width + ': hash ' + info.hash);
    await p.screenshot({ path: `${SP}/tv-${vp.width}.png` });
    await p.screenshot({ path: `${SP}/tv-${vp.width}-full.png`, fullPage: true });
    ok(errs.length === 0, vp.width + ': no page errors ' + errs.join(' | '));
    await ctx.close();
  }

  // 2. clicking through every network and every year works, and tuning in plays the right thing
  {
    const { p, ctx, errs } = await open(b, { width: 390, height: 844 }, '#ch=ddn-1992', IST('2026-11-15T10:05'));
    await p.click('#tune-in');
    await p.waitForTimeout(400);
    const first = await p.evaluate(() => window.__yt.calls.filter(c => c.fn === 'load'));
    ok(first.length === 1 && first[0].p === 'yt-main', 'tune in: one video loaded on the main player (' + JSON.stringify(first) + ')');
    ok(await p.evaluate(() => document.getElementById('slate').classList.contains('is-off')), 'tune in: title card hides while the video plays');

    // each network button
    for (const n of ['ddn', 'ddm', 'zee', 'home', 'star', 'sony', 'sab', 'cn', 'sstar', 'espn']) {
      await p.click(`.net-btn[data-net="${n}"]`);
      await p.waitForTimeout(80);
      const s = await p.evaluate(() => ({ on: document.querySelector('.net-btn.is-on')?.dataset.net, g: document.getElementById('guide-ch').textContent, h: location.hash }));
      ok(s.on === n, 'network ' + n + ' becomes selected (' + s.on + ')');
      ok(/^#ch=/.test(s.h) && s.g.length > 3, 'network ' + n + ' shows a guide (' + s.g + ')');
    }
    // year pills
    await p.click('.net-btn[data-net="ddn"]');
    const years = await p.evaluate(() => [...document.querySelectorAll('.yr:not(:disabled)')].map(e => +e.dataset.year));
    for (const y of years) {
      await p.click(`.yr[data-year="${y}"]`);
      const g = await p.evaluate(() => document.getElementById('guide-ch').textContent);
      ok(g === 'DD National ' + y, 'year ' + y + ' selects DD National ' + y + ' (' + g + ')');
    }
    // jump to Zee, which started 1993: DD year 2007 is the last click, so Zee should land on the nearest year it has
    await p.click('.net-btn[data-net="zee"]');
    const z = await p.evaluate(() => document.getElementById('guide-ch').textContent);
    ok(/^Zee TV 2007$/.test(z), 'Zee from DD 2007 lands on Zee TV 2007 (' + z + ')');
    // 1984 on Zee does not exist: greyed out
    const dis = await p.evaluate(() => document.querySelector('.yr[data-year="1984"]').disabled);
    ok(dis, 'Zee has no 1984 pill to press');
    // CH up/down and YEAR left/right, keyboard
    await p.click('.net-btn[data-net="ddn"]'); await p.click('.yr[data-year="1997"]');
    await p.click('#ch-up'); let g = await p.evaluate(() => document.getElementById('guide-ch').textContent);
    ok(g === 'DD Metro 1997', 'CH up from DD National 1997 goes to DD Metro 1997 (' + g + ')');
    await p.click('#ch-down'); g = await p.evaluate(() => document.getElementById('guide-ch').textContent);
    ok(g === 'DD National 1997', 'CH down comes back (' + g + ')');
    await p.click('#yr-up'); g = await p.evaluate(() => document.getElementById('guide-ch').textContent);
    ok(g === 'DD National 1998', 'YEAR forward goes to 1998 (' + g + ')');
    await p.keyboard.press('ArrowLeft'); g = await p.evaluate(() => document.getElementById('guide-ch').textContent);
    ok(g === 'DD National 1997', 'ArrowLeft goes back a year (' + g + ')');
    ok(errs.length === 0, 'no page errors while clicking around ' + errs.join(' | '));
    await ctx.close();
  }

  // 3. real moments: what plays when
  const moments = [
    ['#ch=ddn-1987', '2026-11-15T09:35', 'Ramayan'],
    ['#ch=ddn-1989', '2026-11-15T09:20', 'Mahabharat'],
    ['#ch=ddn-1998', '2026-11-15T10:10', 'Captain Vyom'],
    ['#ch=ddn-1999', '2026-11-15T12:10', 'Shaktimaan'],
    ['#ch=ddn-2003', '2026-11-15T11:30', 'Shaktimaan'],
    ['#ch=ddn-2003', '2026-11-15T12:10', 'Aryamaan'],
    ['#ch=ddn-1995', '2026-11-15T09:10', 'Chandrakanta'],
    ['#ch=zee-1997', '2026-11-17T20:10', 'Hum Paanch'],
    ['#ch=sony-2007', '2026-11-21T21:45', 'Comedy Circus'],
    ['#ch=ddn-1990', '2026-11-20T20:10', 'Chitrahaar'],
    ['#ch=ddn-1990', '2026-11-15T07:40', 'Rangoli'],
    ['#ch=ddm-1993', '2026-11-19T21:40', 'Dekh Bhai Dekh'],
    ['#ch=home-1998', '2026-11-19T21:40', 'V3'],
    ['#ch=home-1997', '2026-11-16T21:10', 'Zabaan Sambhalke'],
    ['#ch=sstar-1998', '2026-11-14T10:10', 'WWF Superstars'],
    ['#ch=espn-2002', '2026-11-15T16:10', "Cricket Classics from Lord's and the ICC"],
    ['#ch=zee-1998', '2026-11-14T22:10', 'Saturday Suspense'],
    ['#ch=zee-1994', '2026-11-16T21:10', 'Tara']
  ];
  for (const [hash, when, want] of moments) {
    const { p, ctx, errs } = await open(b, { width: 390, height: 844 }, hash, IST(when));
    const s = await p.evaluate(() => ({ now: document.getElementById('now-title').textContent, meta: document.getElementById('now-meta').textContent }));
    ok(s.now === want, hash + ' at ' + when + ' IST should be ' + want + ' (got ' + s.now + ' | ' + s.meta + ')');
    ok(errs.length === 0, hash + ' errors ' + errs.join('|'));
    await ctx.close();
  }

  // 4. Ramayan counts up one episode a week
  {
    const eps = [];
    for (const d of ['2026-11-08', '2026-11-15', '2026-11-22']) {
      const { p, ctx } = await open(b, { width: 390, height: 844 }, '#ch=ddn-1987', IST(d + 'T09:35'));
      eps.push(await p.evaluate(() => document.getElementById('now-meta').textContent));
      await ctx.close();
    }
    console.log(eps.join('  /  '));
    ok(/Episode 1\b/.test(eps[0]) && /Episode 2\b/.test(eps[1]) && /Episode 3\b/.test(eps[2]), 'Ramayan runs Episode 1, 2, 3 on consecutive Sundays');
  }

  // 4b. commercial breaks play recordings from the channel's own ad pack, in our own slot
  {
    const { p, ctx, errs } = await open(b, { width: 390, height: 844 }, '#ch=ddn-1992', IST('2026-11-15T10:40'));
    await p.click('#tune-in'); await p.waitForTimeout(400);
    const calls = await p.evaluate(() => window.__yt.calls.filter(c => c.fn === 'load'));
    ok(calls.length === 1 && calls[0].p === 'yt-ad', 'ad gap after the Jungle Book plays on the AD player (' + JSON.stringify(calls) + ')');
    ok(['2NJ3G1Hp6TE', 'r2FFTZ6ltwQ', 'kW_V5upL8z4'].indexOf(calls[0] && calls[0].v) >= 0, 'the DD ad pack is what plays (' + (calls[0] && calls[0].v) + ')');
    ok(errs.length === 0, 'ad break errors ' + errs.join('|'));
    await ctx.close();
  }

  // 4a. Mahabharat plays from Dailymotion, at the right second of the right episode
  {
    const { p, ctx, errs } = await open(b, { width: 390, height: 844 }, '#ch=ddn-1989', IST('2026-11-15T09:20'));
    await p.click('#tune-in'); await p.waitForTimeout(400);
    const d = await p.evaluate(() => { const f = document.querySelector('#layer-dm iframe'); return { src: f && f.src, on: document.getElementById('layer-dm').classList.contains('is-on'), yt: window.__yt.calls.filter(c => c.fn === 'load').length, meta: document.getElementById('now-meta').textContent }; });
    ok(d.on && d.src && /video=x3w9eui/.test(d.src), 'Mahabharat week 2 plays Episode 2 from Dailymotion (' + d.src + ')');
    ok(/startTime=1[12]\d\d/.test(d.src), 'it starts about 20 minutes in, as if tuned in at 9:20 (' + d.src + ')');
    ok(d.yt === 0 && /Episode 2\b/.test(d.meta), 'no YouTube video loaded for it (' + d.yt + ', ' + d.meta + ')');
    ok(errs.length === 0, 'Mahabharat errors ' + errs.join('|'));
    await ctx.close();
    const t = await open(b, { width: 390, height: 844 }, '#ch=ddn-1989', IST('2026-11-15T09:50'));   // episode (46 min) is long over by 9:50: slot is 60 min, so ad break not yet; check the filler
    await t.p.click('#tune-in'); await t.p.waitForTimeout(400);
    const e2 = await t.p.evaluate(() => ({ iframe: !!document.querySelector('#layer-dm iframe'), slate: document.getElementById('slate').classList.contains('is-off'), title: document.getElementById('slate-title').textContent }));
    ok(!e2.iframe && !e2.slate, 'after the episode ends (46 min in) the Dailymotion player is removed and a card shows (' + JSON.stringify(e2) + ')');
    await t.ctx.close();
  }

  // 4c. ALL SHOWS: browse, search, filter, watch on the separate player, live TV pauses and resumes
  for (const vp of [{ width: 390, height: 844 }, { width: 1100, height: 900 }]) {
    const { p, ctx, errs } = await open(b, vp, '#ch=ddn-1992', IST('2026-11-15T10:05'));
    const n0 = await p.evaluate(() => document.querySelectorAll('.show-card').length);
    ok(n0 >= 120, vp.width + ': ALL SHOWS lists many shows (' + n0 + ')');
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), vp.width + ': no sideways scroll with ALL SHOWS');
    await p.screenshot({ path: `${SP}/shows-${vp.width}.png`, clip: undefined, fullPage: true });
    await p.fill('#shows-q', 'tara');
    const names = await p.evaluate(() => [...document.querySelectorAll('.sc-title')].map(e => e.textContent));
    ok(names.indexOf('Tara') >= 0 && names.length < 10, vp.width + ': search "tara" finds Tara (' + names.join(',') + ')');
    await p.fill('#shows-q', '');
    // channel filter + kind filter
    await p.click('#shows-net .chip:has-text("Star Sports")');
    const sp = await p.evaluate(() => [...document.querySelectorAll('.sc-title')].map(e => e.textContent));
    ok(sp.indexOf('WWF Superstars') >= 0 && sp.indexOf('Classic Cricket Replays') >= 0, vp.width + ': Star Sports filter lists WWF + cricket (' + sp.join(',') + ')');
    await p.click('#shows-net .chip:has-text("All channels")');
    await p.click('#shows-kind .chip:has-text("Ads and idents")');
    const ads = await p.evaluate(() => document.querySelectorAll('.show-card').length);
    ok(ads === 11, vp.width + ': one ad-break entry per channel (' + ads + ')');
    await p.click('#shows-kind .chip:has-text("Every kind")');

    // live TV is playing, then a show is opened on demand
    await p.click('#tune-in'); await p.waitForTimeout(300);
    await p.fill('#shows-q', 'tara');
    await p.click('.show-card:has(.sc-title:text-is("Tara"))');
    await p.waitForTimeout(400);
    const v = await p.evaluate(() => ({ open: !document.getElementById('vod').hidden, title: document.getElementById('vod-title').textContent, ep: document.getElementById('vod-ep').textContent,
      calls: window.__yt.calls.filter(c => c.p === 'yt-vod').map(c => c.fn + ':' + (c.v || c.list || '')), slate: document.getElementById('slate-title').textContent, epBtns: document.querySelectorAll('.vod-ep-btn').length }));
    ok(v.open && v.title === 'Tara', vp.width + ': Tara opens on its own player');
    ok(v.calls[0] && v.calls[0].indexOf('load:') === 0, vp.width + ': the on-demand player loads Tara episode 1 (' + v.calls + ')');
    ok(/Episode 1\b/.test(v.ep), vp.width + ': label says Episode 1 (' + v.ep + ')');
    ok(v.epBtns > 100, vp.width + ': episode buttons listed (' + v.epBtns + ')');
    ok(/paused/i.test(v.slate), vp.width + ': live TV is paused while it plays (' + v.slate + ')');
    await p.click('#vod-next'); await p.waitForTimeout(100);
    const v2 = await p.evaluate(() => ({ ep: document.getElementById('vod-ep').textContent, calls: window.__yt.calls.filter(c => c.p === 'yt-vod').length }));
    ok(/Episode 2\b/.test(v2.ep) && v2.calls === 2, vp.width + ': NEXT goes to the next numbered episode (' + v2.ep + ')');
    // a playlist show
    await p.fill('#shows-q', 'hasratein');
    await p.click('.show-card:has(.sc-title:text-is("Hasratein"))');
    await p.waitForTimeout(300);
    const pl = await p.evaluate(() => window.__yt.calls.filter(c => c.p === 'yt-vod' && c.fn === 'loadPlaylist').length);
    ok(pl === 1, vp.width + ': a playlist show loads as a playlist');
    // Mahabharat (Dailymotion) opens its own iframe and NEXT moves on by hand
    await p.fill('#shows-q', 'mahabharat');
    await p.click('.show-card:has(.sc-title:text-is("Mahabharat"))');
    await p.waitForTimeout(200);
    const md = await p.evaluate(() => ({ src: (document.querySelector('#vod-dm iframe') || {}).src, ep: document.getElementById('vod-ep').textContent, link: document.getElementById('vod-yt').textContent }));
    ok(/video=x50nb80/.test(md.src || '') && /Episode 1\b/.test(md.ep) && /Dailymotion/.test(md.link), vp.width + ': Mahabharat opens on the Dailymotion player (' + JSON.stringify(md) + ')');
    await p.click('#vod-next');
    ok(/video=x3w9eui/.test(await p.evaluate(() => document.querySelector('#vod-dm iframe').src)), vp.width + ': NEXT loads the next Mahabharat episode');
    // WATCH LIVE button jumps to the timetable
    await p.fill('#shows-q', 'v3');
    await p.click('.show-card:has(.sc-title:text-is("V3"))');
    const liveBtn = await p.evaluate(() => [...document.querySelectorAll('.vod-live-btn')].map(e => e.textContent));
    ok(liveBtn.length === 1 && /Home TV 1998/.test(liveBtn[0]), vp.width + ': V3 offers WATCH LIVE on Home TV (' + liveBtn + ')');
    await p.click('.vod-live-btn');
    const after = await p.evaluate(() => ({ g: document.getElementById('guide-ch').textContent, open: !document.getElementById('vod').hidden }));
    ok(after.g === 'Home TV 1998' && !after.open, vp.width + ': WATCH LIVE closes the player and tunes the channel (' + after.g + ')');
    // close resumes live TV
    await p.fill('#shows-q', 'tara');
    await p.click('.show-card:has(.sc-title:text-is("Tara"))');
    await p.click('#vod-close'); await p.waitForTimeout(400);
    const back = await p.evaluate(() => ({ open: !document.getElementById('vod').hidden, loads: window.__yt.calls.filter(c => c.p === 'yt-main' && c.fn === 'load').length }));
    ok(!back.open && back.loads >= 1, vp.width + ': closing the show player brings live TV back (' + JSON.stringify(back) + ')');
    ok(errs.length === 0, vp.width + ': ALL SHOWS errors ' + errs.join(' | '));
    await ctx.close();
  }

  // 5. a closed-down channel and a night slot
  {
    const { p, ctx } = await open(b, { width: 390, height: 844 }, '#ch=ddn-1992', IST('2026-11-16T02:00'));
    const s = await p.evaluate(() => ({ now: document.getElementById('now-title').textContent, slate: document.getElementById('slate-title').textContent }));
    ok(/Off air/.test(s.now), 'DD at 2 am is off air (' + s.now + ')');
    await ctx.close();
  }

  console.log(fails ? fails + ' FAILED' : 'ALL OK');
  await b.close();
  process.exit(fails ? 1 : 0);
})();
