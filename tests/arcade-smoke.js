/* Browser check of the Arcade (headless Chromium):
     node tests/arcade-smoke.js        (needs Playwright; the server must be running: python3 -m http.server 8123)
   Covers: the sections, the cards and their links, search, every filter (checked against the data, not against
   hard-coded numbers), the URL state, Recently Played, the game page in all three modes, the embedded-game player
   (tested with a stand-in game on a made-up address, never a real one), the homepage Games row, and no sideways scroll on a phone.
   External sites are never contacted: their addresses are answered with a tiny stand-in page. */
'use strict';
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8123';
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL: ' + m); } };
const STAND_IN = '<!doctype html><title>stand-in</title><body>stand-in page</body>';
const TEST_GAMES = "\nARCADE_GAMES.push(" + JSON.stringify({
  id: 'test-embed', title: 'Test Embed Game', year: 1990, yearLabel: '1990', publisher: 'Test', platform: 'Arcade', genre: 'arcade', description: 'A stand-in embedded game used only by the tests, never shipped.',
  thumb: 'assets/arcade/arcade.svg', status: 'website', sourceName: 'Stand-in', sourceUrl: 'https://source.example.test/', embedUrl: 'https://embed.example.test/game', repoUrl: '', licence: 'Test', contentRights: 'Test',
  embedding: 'Permitted by the stand-in owner (test only)', commercialUse: 'Unknown', rom: 'none', mobile: 'Unknown', controls: 'Arrow keys.', notes: 'Test entry.', verified: '2026-11-06', aspect: '4 / 3'
}) + ");\nARCADE_GAMES.push(" + JSON.stringify({
  id: 'test-http', title: 'Test Insecure Game', year: 1990, yearLabel: '1990', publisher: 'Test', platform: 'Arcade', genre: 'arcade', description: 'A stand-in with an insecure embed address; it must never be shown in a frame.',
  thumb: 'assets/arcade/arcade.svg', status: 'website', sourceName: 'Stand-in', sourceUrl: '', embedUrl: 'http://embed.example.test/game', repoUrl: '', licence: 'Test', contentRights: 'Test',
  embedding: 'Permitted (test only)', commercialUse: 'Unknown', rom: 'none', mobile: 'Unknown', controls: '', notes: 'Test entry.', verified: '2026-11-06'
}) + ");\n";

async function setup(b, vp, withTestGames) {
  const ctx = await b.newContext({ viewport: vp });
  const pg = await ctx.newPage();
  pg.errs = []; pg.hits = {};
  pg.on('pageerror', (e) => pg.errs.push(e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) pg.errs.push(m.text()); });
  await pg.route('https://i.ytimg.com/**', (r) => r.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#557"/></svg>' }));
  await pg.route('https://www.youtube.com/iframe_api', (r) => r.fulfill({ contentType: 'text/javascript', body: '' }));
  await ctx.route(/https:\/\/(play\.tetris\.com|www\.google\.com|www\.taito\.co\.jp|captown\.capcom\.com|embed\.example\.test|source\.example\.test)\/.*/, (r) => { const h = new URL(r.request().url()).hostname; pg.hits[h] = (pg.hits[h] || 0) + 1; r.fulfill({ contentType: 'text/html', body: STAND_IN }); });
  if (withTestGames) await pg.route('**/js/arcade-data.js', async (r) => { const resp = await r.fetch(); r.fulfill({ response: resp, body: (await resp.text()) + TEST_GAMES }); });
  return { ctx, pg };
}
const titles = (pg, sel) => pg.locator(sel + ' .gcard h3').allTextContents();
const SECTIONS = ['featured', 'racing', 'platform', 'action', 'arcade', 'puzzle', 'sports', 'recent', 'popular', 'all'];

(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 800 }]) {
    const w = vp.width + 'px: ';
    const { ctx, pg } = await setup(b, vp, false);
    await pg.goto(BASE + '/arcade.html', { waitUntil: 'load' });
    const data = await pg.evaluate(() => ({ games: window.ARCADE_GAMES, periods: [[1970, 1979], [1980, 1989], [1990, 1999], [2000, 2009]] }));
    const G = data.games;

    /* ---- sections and cards ---- */
    ok(await pg.locator('.tab').count() === 11 && (await pg.locator('.tab[aria-current=page]').getAttribute('href')) === 'arcade.html', w + 'Games tab is current and points to arcade.html');
    ok((await pg.locator('h1').textContent()).replace(/\s+/g, ' ') === '90s Rewind Arcade', w + 'page title');
    ok((await pg.locator('.arc-tag').textContent()) === 'Your childhood games are back. Play them again!', w + 'tagline');
    const ids = await pg.locator('.arc-sec').evaluateAll((els) => els.map((e) => e.id.replace('s-', '')));
    ok(JSON.stringify(ids) === JSON.stringify(SECTIONS), w + 'the 10 sections in the brief order, got ' + ids.join(','));
    ok((await titles(pg, '#s-all')).length === 40, w + 'All Games lists 40');
    ok((await titles(pg, '#s-featured')).length === G.filter((g) => g.featured).length && (await titles(pg, '#s-featured'))[0] === 'Pac-Man', w + 'Featured Classics starts with Pac-Man');
    for (const gn of ['racing', 'platform', 'action', 'arcade', 'puzzle', 'sports']) ok((await titles(pg, '#s-' + gn)).length === G.filter((g) => g.genre === gn || (gn === 'x')).length, w + gn + ' section count');
    ok(await pg.locator('#s-recent .arc-empty').isVisible(), w + 'Recently Played says it is empty at first');
    ok(await pg.locator('.arc-jump a').count() === 10, w + '10 jump links');
    // a card shows thumbnail, title, year, platform, genre and status
    const sf = pg.locator('#s-featured .gcard[data-id=street-fighter-ii]');
    ok(await sf.locator('img').count() === 1 && (await sf.locator('img').getAttribute('loading')) === 'lazy', w + 'cards have lazy thumbnails');
    ok((await sf.locator('.gcard-m').textContent()) === '1991 · Arcade' && (await sf.locator('.gtag').textContent()) === 'Action & Fighting' && (await sf.locator('.stat').textContent()) === 'OFFICIAL SITE', w + 'card shows year, platform, genre, status');
    // Play Now: official card opens the owner's page in a new tab; Coming Soon has no button and no outside link
    const play = sf.locator('a.gbtn');
    ok((await play.getAttribute('href')) === 'https://captown.capcom.com/en/classic_games/23' && (await play.getAttribute('target')) === '_blank' && /noopener/.test(await play.getAttribute('rel')), w + 'official Play Now: right address, new tab, noopener');
    ok((await sf.locator('.gsrc').textContent()) === 'on captown.capcom.com', w + 'the external source is named on the card');
    const soon = pg.locator('#s-racing .gcard[data-id=road-rash]');
    ok(await soon.locator('a.gbtn, button, a[target=_blank]').count() === 0 && (await soon.locator('.gsoon').textContent()) === 'Coming soon', w + 'Coming Soon card: no Play button, no outside link');
    ok(await pg.locator('.gcard.is-soon a[href^="http"]').count() === 0, w + 'no Coming Soon card links outside the site');
    ok((await pg.locator('#f-status .fchip').allTextContents()).map((t) => t.replace(/\s+/g, ' ').trim()).join('|') === 'All 40|Playable Now 0|External Play 4|Coming Soon 36', w + 'status chips with counts');

    /* ---- search ---- */
    const search = async (q) => { await pg.locator('#f-q').fill(q); return titles(pg, '#s-results'); };
    let r = await search('mario');
    ok(r.length === 2 && r.every((t) => /Mario/.test(t)), w + 'search "mario" finds the two Mario games');
    ok(!(await pg.locator('#s-featured').count()) && (await pg.locator('#s-results .sec-n').textContent()) === '2', w + 'sections give way to Results while searching');
    ok((await search('pacman')).join() === 'Pac-Man', w + 'search "pacman" finds Pac-Man');
    ok((await search('street fighter 2')).join() === 'Street Fighter II: The World Warrior', w + 'search "street fighter 2" finds Street Fighter II');
    ok((await search('road rash')).length === 3, w + 'search "road rash" finds three');
    ok((await search('nintendo')).length >= 5, w + 'search also matches the publisher');
    ok((await search('1984')).every((t) => G.find((g) => g.title === t).year === 1984) && (await search('1984')).length === G.filter((g) => g.year === 1984).length, w + 'search by year');
    r = await search('zzzzqq');
    ok(r.length === 0 && /No games match/.test(await pg.locator('#s-results').textContent()), w + 'no-match message');
    ok(location_q(await pg.url()) === 'zzzzqq', w + 'the search is kept in the address');
    await pg.locator('[data-clear]').click();
    ok((await pg.locator('.arc-sec').count()) === 10 && (await pg.locator('#f-q').inputValue()) === '', w + 'Clear brings the sections back');

    /* ---- filters, compared with the data ---- */
    const expect = (f) => G.filter((g) => (!f.genre || g.genre === f.genre) && (!f.platform || g.platform === f.platform) &&
      (!f.period || (g.year >= +f.period.slice(0, 4) && g.year <= +f.period.slice(0, 4) + 9)) && (!f.status || g.status === f.status)).map((g) => g.title).sort();
    const got = async () => (await titles(pg, '#s-results')).sort();
    const reset = async () => { if (await pg.locator('#f-clear').isVisible()) await pg.locator('#f-clear').click(); };
    for (const gn of ['racing', 'platform', 'action', 'arcade', 'puzzle', 'sports']) {
      await pg.locator('#f-genre').selectOption(gn);
      ok(JSON.stringify(await got()) === JSON.stringify(expect({ genre: gn })), w + 'genre filter ' + gn);
      await reset();
    }
    const platforms = await pg.locator('#f-platform option').evaluateAll((o) => o.map((x) => x.value).filter(Boolean));
    ok(platforms.length >= 6, w + 'platform list built from the data: ' + platforms.length);
    for (const pf of platforms) { await pg.locator('#f-platform').selectOption(pf); ok(JSON.stringify(await got()) === JSON.stringify(expect({ platform: pf })), w + 'platform filter ' + pf); await reset(); }
    for (const pr of ['1970s', '1980s', '1990s']) { await pg.locator('#f-period').selectOption(pr); ok(JSON.stringify(await got()) === JSON.stringify(expect({ period: pr })), w + 'period filter ' + pr); await reset(); }
    ok((await pg.locator('#f-period option').allTextContents()).join() === 'Any period,1970s,1980s,1990s', w + 'only periods that have games');
    await pg.locator('#f-status [data-status=official]').click();
    ok(JSON.stringify(await got()) === JSON.stringify(expect({ status: 'official' })) && (await got()).length === 4, w + 'External Play shows the 4 official-site games');
    ok((await pg.locator('#f-status [data-status=official]').getAttribute('aria-pressed')) === 'true', w + 'the chip is pressed');
    await pg.locator('#f-status [data-status=soon]').click();
    ok((await got()).length === 36, w + 'Coming Soon shows 36');
    await pg.locator('#f-status [data-status=website]').click();
    ok((await got()).length === 0 && /No game can be played inside this site yet/.test(await pg.locator('#s-results').textContent()), w + 'Playable Now explains why it is empty');
    await pg.locator('[data-set-status=official]').click();
    ok((await got()).length === 4, w + 'the empty-state link jumps to External Play');
    await pg.locator('#f-genre').selectOption('puzzle');
    ok(JSON.stringify(await got()) === JSON.stringify(expect({ genre: 'puzzle', status: 'official' })), w + 'filters combine (puzzle + official = Tetris)');
    ok((await pg.url()).indexOf('genre=puzzle') > 0 && (await pg.url()).indexOf('status=official') > 0, w + 'filters are kept in the address');
    await pg.locator('#f-q').fill('tet');
    ok((await got()).join() === 'Tetris', w + 'search and filters combine');
    await reset();
    // a link with filters opens already filtered
    await pg.goto(BASE + '/arcade.html?genre=racing&period=1980s&status=soon', { waitUntil: 'load' });
    ok(JSON.stringify(await got()) === JSON.stringify(expect({ genre: 'racing', period: '1980s', status: 'soon' })) && (await pg.locator('#f-genre').inputValue()) === 'racing', w + 'a shared link opens filtered');
    await pg.goto(BASE + '/arcade.html?genre=nonsense&status=nonsense', { waitUntil: 'load' });
    ok((await pg.locator('.arc-sec').count()) === 10, w + 'bad values in the address are ignored');

    /* ---- header search on this page: drop-down goes to the game page; Go stays in the Arcade ---- */
    await pg.locator('#q').fill('tetris');
    ok((await pg.locator('#sugg .sg').first().getAttribute('href')) === 'game.html?id=tetris', w + 'header search result opens the game page');
    ok((await pg.locator('#search').getAttribute('action')) === 'arcade.html', w + 'header search form stays in the Arcade');

    /* ---- Recently Played ---- */
    await pg.goto(BASE + '/arcade.html', { waitUntil: 'load' });
    const [pop] = await Promise.all([pg.waitForEvent('popup'), pg.locator('#s-featured .gcard[data-id=tetris] a.gbtn').click()]);
    await pop.close();
    ok(pg.hits['play.tetris.com'] === 1, w + 'Play Now opened the official Tetris address in a new tab');
    await pg.reload({ waitUntil: 'load' });
    ok((await titles(pg, '#s-recent')).join() === 'Tetris', w + 'Recently Played now lists Tetris');
    const [pop2] = await Promise.all([pg.waitForEvent('popup'), pg.locator('#s-recent ~ * a.gbtn, #s-featured .gcard[data-id=pac-man] a.gbtn').first().click()]);
    await pop2.close(); await pg.reload({ waitUntil: 'load' });
    ok((await titles(pg, '#s-recent')).length === 2 && (await titles(pg, '#s-recent'))[0] === 'Pac-Man', w + 'most recent first');
    ok(await pg.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), w + 'no sideways scroll on the Arcade page');

    /* ---- the game page: official / coming soon / unknown ---- */
    await pg.goto(BASE + '/game.html?id=street-fighter-ii', { waitUntil: 'load' });
    ok((await pg.title()).indexOf('Street Fighter II') === 0, w + 'game page title');
    ok((await pg.locator('h1').textContent()) === 'Street Fighter II: The World Warrior', w + 'game name');
    ok((await pg.locator('.gp-meta').textContent()).indexOf('1991') > 0 && (await pg.locator('.gp-meta').textContent()).indexOf('Arcade') > 0, w + 'year and original platform shown');
    const pn = pg.locator('.ph-card a.btn-big');
    ok((await pn.getAttribute('href')) === 'https://captown.capcom.com/en/classic_games/23' && (await pn.getAttribute('target')) === '_blank', w + 'official page: big Play Now opens the owner in a new tab');
    ok((await pg.locator('.ph-card').textContent()).indexOf('captown.capcom.com') > 0 && await pg.locator('iframe').count() === 0, w + 'official page names the external source and shows no iframe');
    ok(await pg.locator('#screen').count() === 0 && await pg.locator('#t-full').count() === 0, w + 'no fullscreen/restart for a link-out game');
    ok((await pg.locator('.facts dt').allTextContents()).slice(0, 4).join('|') === 'A. Software licence|B. Game content rights|C. Embedding on this site|D. Commercial use', w + 'the four permissions are shown separately');
    ok((await pg.locator('.facts').textContent()).indexOf('Last checked2026-11-06') > 0, w + 'last-checked date shown');
    ok(await pg.locator('.gp-info .panel').count() === 2 && (await pg.locator('.gp-info').textContent()).indexOf('Keyboard, controller or on-screen') > 0, w + 'About and How to play');
    ok(await pg.locator('#h-more').count() === 1 && await pg.locator('.gp-grid ~ .arc-sec .gcard').count() === 5, w + 'More Classic Games shows 5');
    ok((await pg.locator('.gp-grid ~ .arc-sec .gcard').first().getAttribute('data-id')) !== 'street-fighter-ii', w + 'More Classic Games leaves out this game');
    ok(await pg.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), w + 'no sideways scroll on a game page');
    // Return to Arcade (direct visit: normal link)
    ok((await pg.locator('#gp-back').getAttribute('href')) === 'arcade.html', w + 'Return to Arcade link');

    await pg.goto(BASE + '/game.html?id=road-rash', { waitUntil: 'load' });
    ok(await pg.locator('main a[target=_blank]').count() === 0 && await pg.locator('main a:has-text("Play Now"), main button:has-text("Play Now")').count() === 0, w + 'Coming Soon page: no Play button and no outside link');
    ok(/COMING SOON/.test(await pg.locator('.ph-card').textContent()) && /We will not swap in a remake/.test(await pg.locator('.ph-card').textContent()), w + 'Coming Soon page says so honestly');
    ok(await pg.locator('.facts dd.fv-unk').count() >= 3, w + 'unknown permissions are marked as unknown');
    ok((await pg.locator('.facts-n').textContent()).indexOf('Electronic Arts') > 0, w + 'verification notes are shown');
    await pg.locator('.ph-card a.btn').click();
    ok(/arcade\.html$/.test(pg.url()), w + 'the Coming Soon page leads back to the Arcade');
    await pg.goto(BASE + '/game.html?id=does-not-exist', { waitUntil: 'load' });
    ok(/Game not found/.test(await pg.locator('h1').textContent()) && await pg.locator('a[href="arcade.html"]').count() >= 1, w + 'unknown game id: friendly message');
    await pg.goto(BASE + '/game.html', { waitUntil: 'load' });
    ok(/Game not found/.test(await pg.locator('h1').textContent()), w + 'no id: friendly message');

    // Return to Arcade after coming from a filtered Arcade goes back to the same filters
    await pg.goto(BASE + '/arcade.html?genre=racing', { waitUntil: 'load' });
    await pg.locator('#s-results .gcard h3 a').first().click();
    await pg.locator('#gp-back').click();
    await pg.waitForURL(/arcade\.html\?genre=racing/);
    ok(/genre=racing/.test(pg.url()) && (await pg.locator('#f-genre').inputValue()) === 'racing', w + 'Return to Arcade keeps your filters');

    ok(pg.errs.length === 0, w + 'no page errors: ' + pg.errs.join(' | '));
    await ctx.close();

    /* ---- Mode A: the embedded player, with stand-in games ---- */
    const t = await setup(b, vp, true), tp = t.pg;
    await tp.goto(BASE + '/game.html?id=test-embed', { waitUntil: 'load' });
    await tp.waitForSelector('#game-frame[src]');
    ok((await tp.locator('#game-frame').getAttribute('src')) === 'https://embed.example.test/game', w + 'embedded game: the iframe loads the https embed address');
    ok(/allow-scripts/.test(await tp.locator('#game-frame').getAttribute('sandbox')) && !/allow-top-navigation/.test(await tp.locator('#game-frame').getAttribute('sandbox')), w + 'the iframe is sandboxed (no top navigation)');
    await tp.waitForFunction(() => document.getElementById('screen-load').hidden);
    ok(await tp.locator('#screen-load').isHidden(), w + 'the loading indicator goes away when the game has loaded');
    ok((await tp.locator('#screen').evaluate((e) => e.style.aspectRatio.replace(/\s/g, ''))) === '4/3', w + 'aspect ratio of the game is kept');
    ok(await tp.locator('#t-restart').isVisible() && (await tp.locator('.gp-tools a').getAttribute('href')) === 'https://source.example.test/', w + 'Restart and "Open on source" are offered');
    ok((await tp.locator('.gp-info').textContent()).indexOf('Arrow keys.') > 0 && /Sound is the game/.test(await tp.locator('.gp-info').textContent()), w + 'controls and the sound note are shown');
    const before = tp.hits['embed.example.test'] || 0;
    await tp.locator('#t-restart').click();
    await tp.waitForFunction(() => document.getElementById('screen-load').hidden);
    ok((tp.hits['embed.example.test'] || 0) === before + 1, w + 'Restart reloads the game');
    ok((await tp.evaluate(() => localStorage.getItem('arcade.recent'))).indexOf('test-embed') > 0, w + 'playing it adds it to Recently Played');
    if (await tp.locator('#t-full').isVisible()) {
      await tp.locator('#t-full').click();
      await tp.waitForTimeout(300);
      const fs = await tp.evaluate(() => !!document.fullscreenElement && document.fullscreenElement.id);
      ok(fs === 'screen', w + 'Fullscreen puts the game screen (not the page) in fullscreen, got ' + fs);
      await tp.keyboard.press('Escape'); await tp.evaluate(() => document.fullscreenElement && document.exitFullscreen());
    } else ok(true, w + '(fullscreen button hidden: this browser has no element fullscreen)');
    // the arcade lists it as Playable Now, with a real Play Now button that stays on our site
    await tp.goto(BASE + '/arcade.html?status=website', { waitUntil: 'load' });
    ok((await titles(tp, '#s-results')).join() === 'Test Embed Game,Test Insecure Game'.split(',').filter((x) => x).join() || (await titles(tp, '#s-results')).length === 2, w + 'Playable Now lists the stand-in games');
    ok((await tp.locator('#s-results .gcard[data-id=test-embed] a.gbtn').getAttribute('href')) === 'game.html?id=test-embed', w + 'a Play-on-site card opens the on-site player');
    // an insecure embed address is never put in a frame
    await tp.goto(BASE + '/game.html?id=test-http', { waitUntil: 'load' });
    ok(await tp.locator('iframe').count() === 0 && /COMING SOON/.test(await tp.locator('.ph-card').textContent()), w + 'an http (insecure) embed address falls back to Coming Soon, no iframe');
    ok(tp.errs.length === 0, w + 'no page errors with stand-in games: ' + tp.errs.join(' | '));
    await t.ctx.close();

    /* ---- homepage Games row ---- */
    const h = await setup(b, vp, false), hp = h.pg;
    await hp.goto(BASE + '/home.html', { waitUntil: 'load' });
    ok(await hp.locator('#g-games > *').count() === 5, w + 'homepage Games row has 5 cards');
    ok((await hp.locator('#g-games > a').first().getAttribute('href')) === 'game.html?id=pac-man' && (await hp.locator('#g-games > a').first().locator('.stat').textContent()) === 'OFFICIAL SITE', w + 'first homepage game card: Pac-Man, with its status');
    ok((await hp.locator('#games .sec-h a').getAttribute('href')) === 'arcade.html', w + 'homepage "View All" opens the Arcade');
    ok((await hp.locator('.tab[href="arcade.html"]').count()) === 1, w + 'Games tab opens the Arcade');
    ok(await hp.locator('#g-games .soon').count() <= 1, w + 'no stray SOON ribbons');
    await hp.locator('#g-games > a').nth(1).click();
    ok(/game\.html\?id=/.test(hp.url()), w + 'a homepage game card opens its game page');
    ok(hp.errs.length === 0, w + 'homepage: no page errors: ' + hp.errs.join(' | '));
    await h.ctx.close();
  }
  await b.close();
  console.log((fail ? 'FAILED' : 'ALL OK') + ' — ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
function location_q(u) { return new URL(u).searchParams.get('q'); }
