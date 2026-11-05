/* ==========================================================================
   90s REWIND TV — ARCADE: SHARED PARTS (used by arcade.html and game.html)
   Reads js/arcade-data.js. Draws the game card, remembers "Recently Played" in this
   browser (localStorage only: nothing is sent anywhere), and answers questions about a game.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site, G = window.ARCADE_GAMES || [], GEN = window.ARCADE_GENRES || [], ST = window.ARCADE_STATUS || {};
  if (!S) return;
  var esc = S.esc, store = S.store, RECENT_KEY = 'arcade.recent', RECENT_MAX = 8;

  var byId = {}; G.forEach(function (g) { byId[g.id] = g; });
  var genreBy = {}; GEN.forEach(function (x) { genreBy[x.id] = x; });
  var rank = { website: 0, official: 1, soon: 2 };

  function genreLabel(g) { return (genreBy[g.genre] || {}).label || g.genre; }
  function statusOf(g) { return ST[g.status] || { label: g.status, short: g.status, filter: g.status }; }
  function statClass(g) { return g.status === 'website' ? 'web' : g.status === 'official' ? 'ext' : 'soon'; }
  function host(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }
  function safeHttps(url) { try { var u = new URL(url); return u.protocol === 'https:' ? u.href : ''; } catch (e) { return ''; } }
  function href(g) { return 'game.html?id=' + encodeURIComponent(g.id); }
  // playable first, then the order of the catalogue file
  function byStatus(a, b) { return rank[a.status] - rank[b.status] || G.indexOf(a) - G.indexOf(b); }

  /* ---------- Recently Played (this browser only) ---------- */
  function recent() {
    var raw = store.get(RECENT_KEY), ids = [];
    try { ids = JSON.parse(raw || '[]'); } catch (e) { ids = []; }
    if (!Array.isArray(ids)) ids = [];
    return ids.filter(function (id) { return byId[id]; }).map(function (id) { return byId[id]; });
  }
  function recordPlay(id) {
    if (!byId[id]) return;
    var ids = recent().map(function (g) { return g.id; }).filter(function (x) { return x !== id; });
    ids.unshift(id);
    store.set(RECENT_KEY, JSON.stringify(ids.slice(0, RECENT_MAX)));
  }
  // Any element with data-play="gameId" records a play when clicked (the link itself still works).
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-play]') : null;
    if (t) recordPlay(t.getAttribute('data-play'));
  });

  /* ---------- the card ---------- */
  function playBtn(g) {
    if (g.status === 'website') return '<a class="btn gbtn" href="' + esc(href(g)) + '" data-play="' + esc(g.id) + '">Play Now</a>';
    if (g.status === 'official' && safeHttps(g.sourceUrl))
      return '<a class="btn gbtn" href="' + esc(safeHttps(g.sourceUrl)) + '" target="_blank" rel="noopener noreferrer" data-play="' + esc(g.id) + '" aria-label="Play ' + esc(g.title) + ' on ' + esc(host(g.sourceUrl)) + ' (opens in a new tab)">Play Now ↗</a>' +
        '<small class="gsrc">on ' + esc(host(g.sourceUrl)) + '</small>';
    return '<span class="gsoon">Coming soon</span>';
  }
  function card(g) {
    var st = statusOf(g);
    return '<article class="gcard is-' + esc(g.status) + '" data-id="' + esc(g.id) + '">' +
      '<a class="gcard-img" href="' + esc(href(g)) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(g.thumb) + '" alt="" width="320" height="240" loading="lazy" decoding="async">' +
      '<span class="stat stat-' + statClass(g) + '">' + esc(st.short) + '</span><span class="yr">' + esc(g.yearLabel) + '</span></a>' +
      '<div class="gcard-b"><h3><a href="' + esc(href(g)) + '">' + esc(g.title) + '</a></h3>' +
      '<p class="gcard-m">' + esc(g.yearLabel) + ' · ' + esc(g.platform) + '</p>' +
      '<p class="gcard-g"><span class="gtag">' + esc(genreLabel(g)) + '</span></p>' +
      '<div class="gcard-a">' + playBtn(g) + '</div></div></article>';
  }

  window.ArcadeUI = {
    games: G, genres: GEN, status: ST, byId: byId, genreLabel: genreLabel, statusOf: statusOf, statClass: statClass,
    host: host, safeHttps: safeHttps, href: href, byStatus: byStatus, card: card, playBtn: playBtn, recent: recent, recordPlay: recordPlay
  };
})();
