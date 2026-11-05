/* Browser check of the shared shell on the homepage (headless Chromium, YouTube stubbed):
     node tests/site-smoke.js          (needs Playwright; the server must be running: python3 -m http.server 8123)
   Covers: header and tabs, the card rows, the pop-up player, picture zoom with Previous / Next,
   the search drop-down (mouse and keyboard), keyboard focus staying in the pop-up. */
'use strict';
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8123';
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL: ' + m); } };
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 800 }]) {
    const pg = await b.newPage({ viewport: vp });
    const errs = [];
    pg.on('pageerror', (e) => errs.push(e.message));
    pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errs.push(m.text()); });
    await pg.route('https://i.ytimg.com/**', (r) => r.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#557"/></svg>' }));
    await pg.route('https://www.youtube.com/iframe_api', (r) => r.fulfill({ contentType: 'text/javascript', body: 'window.YT={Player:function(id,o){var el=document.getElementById(id);var d=document.createElement("div");d.id=id;if(el&&el.parentNode)el.parentNode.replaceChild(d,el);this.mute=this.unMute=this.playVideo=this.pauseVideo=this.stopVideo=this.seekTo=this.cuePlaylist=this.loadVideoById=function(){};this.getPlayerState=function(){return 1};this.getCurrentTime=function(){return 0};this.getPlaylist=function(){return null};setTimeout(function(){o.events&&o.events.onReady&&o.events.onReady()},30)}};setTimeout(function(){window.onYouTubeIframeAPIReady&&window.onYouTubeIframeAPIReady()},10);' }));
    await pg.route('https://www.youtube-nocookie.com/**', (r) => r.fulfill({ contentType: 'text/html', body: '<body>player</body>' }));
    await pg.goto(BASE + '/home.html', { waitUntil: 'load' });
    const w = vp.width + 'px: ';
    ok(await pg.locator('.tab').count() === 11, w + '11 tabs');
    ok(await pg.locator('.tab[aria-current=page]').count() === 1, w + 'one current tab');
    ok(await pg.locator('#ticker a').count() >= 8, w + 'ticker items');
    for (const [id, n] of [['g-tv', 5], ['g-movies', 5], ['g-ads', 5], ['g-songs', 3], ['g-cricket', 2], ['g-wwf', 3]]) ok(await pg.locator('#' + id + ' > *').count() === n, w + id + ' has ' + n + ' cards');
    ok(await pg.locator('.ft-links a').count() === 4, w + 'footer links');

    // pop-up player: opens on a movie card, Tab stays inside, Escape closes and returns focus
    const card = pg.locator('#g-movies > button').first();
    await card.scrollIntoViewIfNeeded(); await card.click();
    ok(await pg.locator('#modal').isVisible(), w + 'pop-up opens');
    ok((await pg.locator('#m-yt').getAttribute('src')).indexOf('youtube-nocookie.com/embed/') > 0, w + 'player is the nocookie embed');
    for (let i = 0; i < 3; i++) await pg.keyboard.press('Tab');   // close -> player -> link -> back to close (keys typed inside YouTube's own frame never reach the page)
    ok(await pg.evaluate(() => document.getElementById('modal').contains(document.activeElement)), w + 'Tab stays inside the pop-up');
    await pg.keyboard.press('Escape');
    ok(await pg.locator('#modal').isHidden(), w + 'Escape closes the pop-up');
    ok(await pg.evaluate(() => document.activeElement && document.activeElement.closest('#g-movies') !== null), w + 'focus goes back to the card');

    // picture zoom with Previous / Next
    const first = pg.locator('#gal a').first();
    await first.scrollIntoViewIfNeeded(); await first.click();
    ok(await pg.locator('#modal .modal-img').isVisible(), w + 'picture opens large');
    ok((await pg.locator('#m-count').textContent()) === '1 of 4', w + 'count 1 of 4');
    await pg.keyboard.press('ArrowRight');
    ok((await pg.locator('#m-count').textContent()) === '2 of 4', w + 'ArrowRight goes to picture 2');
    await pg.locator('#m-prev').click();
    ok((await pg.locator('#m-count').textContent()) === '1 of 4' && await pg.locator('#m-prev').isDisabled(), w + 'Previous works and stops at the first');
    await pg.locator('#m-close').click();

    // search: drop-down with thumbnails and category labels
    await pg.locator('#q').fill('shakti');
    ok(await pg.locator('#sugg').isVisible() && await pg.locator('#sugg .sg').count() >= 1, w + 'search drop-down shows results');
    ok((await pg.locator('#sugg .sg').first().locator('.sg-c').textContent()).length > 0 && await pg.locator('#sugg .sg').first().locator('img, .fb').count() === 1, w + 'a result has a category label and a picture');
    await pg.locator('#q').fill('hamara bajaj');
    await pg.keyboard.press('ArrowDown'); await pg.keyboard.press('Enter');
    ok(await pg.locator('#modal').isVisible(), w + 'Enter on a video result opens the player');
    await pg.keyboard.press('Escape');
    await pg.locator('#q').fill('zzzzqq');
    ok((await pg.locator('#sugg').textContent()).indexOf('No match') >= 0, w + 'no-match message');
    await pg.keyboard.press('Escape');
    ok(await pg.locator('#sugg').isHidden(), w + 'Escape closes the drop-down');
    ok(errs.length === 0, w + 'no page errors: ' + errs.join(' | '));
    ok(await pg.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), w + 'no sideways scroll');
    await pg.close();
  }
  await b.close();
  console.log(fail ? (fail + ' FAILED, ' + pass + ' passed') : ('ALL OK: ' + pass + ' checks passed'));
  process.exit(fail ? 1 : 0);
})();
