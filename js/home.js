/* ==========================================================================
   90s REWIND TV — HOMEPAGE BEHAVIOUR (home.html)
   Fills the card rows from the catalogue (js/catalogue.js, built from js/content.js),
   and wires the poll and trivia (js/engage.js), the discussions and the login note.
   The shared parts (header, tabs, ticker, search, pop-up player, toast, footer) are
   in js/site.js. The CRT television is in js/home-live.js.
   ========================================================================== */
(function () {
  'use strict';
  const H = window.HOME, S = window.Site, C = window.Catalogue;
  if (!H || !S) return;
  const $ = S.$, esc = S.esc, store = S.store, icon = S.icon, toast = S.toast;
  const fill = (id, items, fn) => { const el = $(id); if (el) el.innerHTML = items.map(fn).join(''); };

  /* ---------- card rows: the featured items of each category, in the order of js/content.js ---------- */
  if (C) {
    const feat = (cat) => C.featured(cat);
    fill('g-tv', feat('tv'), (it) => S.card(it));
    fill('g-movies', feat('movies'), (it) => S.card(it));
    fill('g-ads', feat('ads'), (it) => S.card(it));
    fill('g-games', feat('games').slice(0, 5), (it) => S.card(it));
    fill('g-songs', feat('songs'), S.wide);
    fill('g-cricket', feat('cricket'), S.wide);
    fill('g-wwf', feat('wwf'), (it) => S.card(it, { dark: true, sub: true }));
  } else {
    ['g-tv', 'g-movies', 'g-ads', 'g-games', 'g-songs', 'g-cricket', 'g-wwf'].forEach((id) => { const el = $(id); if (el) el.innerHTML = '<p class="load-err">The video list could not be loaded. Please reload the page.</p>'; });
  }

  /* ---------- browse tiles ---------- */
  fill('tiles', H.tiles, (t) =>
    '<a class="tile" href="' + esc(t.href) + '" style="--c1:' + t.c1 + ';--c2:' + t.c2 + '"><img src="' + icon(t.icon) + '" alt="" width="38" height="38"><span>' + esc(t.label) + '</span></a>');

  /* ---------- daily poll and trivia (js/engage.js; the questions are in js/poll-data.js and js/trivia-data.js) ---------- */
  const E = window.Engage;
  if (E) {
    const P = E.dailyPoll();
    if (P) {
      $('poll-q').textContent = P.q;
      E.poll.bind({ form: $('poll'), box: $('poll-opts'), btn: $('poll-go'), note: $('poll-note') }, P, { compact: true });
    }
    E.trivia.compact({ q: $('trivia-q'), opts: $('trivia-opts'), fb: $('trivia-a'), score: $('trivia-score'), go: $('trivia-go') });
  } else {
    $('poll-opts').innerHTML = '<p class="load-err">The poll could not be loaded.</p>';
    $('trivia-q').textContent = 'The trivia could not be loaded. Please reload the page.';
  }

  /* ---------- member login (look only: accounts come in a later phase) ---------- */
  function loginNote(e) {
    if (e) e.preventDefault();
    const n = $('login-note');
    n.textContent = 'Member accounts open in a later phase. Nothing you type here is sent or saved.';
    n.hidden = false;
    $('lg-p').value = '';                       // never keep a typed password
  }
  $('login-form').addEventListener('submit', loginNote);

  /* ---------- photo strip + wallpapers (a click opens the picture large, with Previous / Next) ---------- */
  const zoomLink = (group) => (g) => '<a href="' + esc(g.src) + '" data-zoom data-group="' + group + '" data-src="' + esc(g.src) + '" data-alt="' + esc(g.alt) + '" aria-label="' + esc(g.alt) + '"><img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" loading="lazy"></a>';
  fill('gal', H.gallery, zoomLink('gal'));
  fill('g-walls', H.walls, zoomLink('walls'));

  /* ---------- community + goodies ---------- */
  fill('comm', H.community, (c) => '<li><a href="' + esc(c.href) + '"><img src="' + icon(c.icon) + '" alt="" width="30" height="30"><span>' + esc(c.label) + '</span></a></li>');
  fill('goodies', H.goodies, (g) => '<li><a href="' + esc(g.href) + '"' + (g.soon ? ' data-soon="' + esc(g.label) + '"' : '') + '><img src="' + icon(g.icon) + '" alt="" width="56" height="56"><b>' + esc(g.label) + '</b><small>' + esc(g.sub) + '</small></a></li>');

  /* ---------- discussions (sample): Top / New / Chat ---------- */
  (function disc() {
    const ul = $('disc'), D = H.discussions;
    function draw(tab) {
      let html;
      if (tab === 'chat') html = D.chat.map((c) => '<li class="chat"><span><b>' + esc(c.u) + ':</b> ' + esc(c.m) + '</span></li>').join('');
      else html = D[tab].map((d) => '<li><img src="' + icon('bubble') + '" alt="" width="26" height="26"><a href="community.html#forum">' + esc(d.t) + '</a><span class="n">' + d.n + ' <img src="' + icon('comment') + '" alt=""></span></li>').join('');
      ul.innerHTML = html;
    }
    document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
      document.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-selected', x === b ? 'true' : 'false'));
      $('h-disc').textContent = ({ top: 'Top Discussions', 'new': 'Latest', chat: 'Live Chat' })[b.dataset.tab];
      draw(b.dataset.tab);
    }));
    draw('top');
  })();
})();
