/* ==========================================================================
   90s REWIND TV — THE ARCADE PAGE (arcade.html)
   Draws the sections, and runs the search and the filters:
     title search · genre · original platform · release period · Playable Now / External Play / Coming Soon
   With no filter on, the themed sections show. With any filter on, only the matching games show.
   The filter state lives in the address (arcade.html?q=mario&genre=platform...), so a link keeps it.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site, U = window.ArcadeUI;
  if (!S || !U) return;
  var $ = S.$, esc = S.esc, G = U.games;

  var PERIODS = [
    { id: '1970s', label: '1970s', from: 1970, to: 1979 }, { id: '1980s', label: '1980s', from: 1980, to: 1989 },
    { id: '1990s', label: '1990s', from: 1990, to: 1999 }, { id: '2000s', label: '2000s', from: 2000, to: 2009 }
  ];
  var STATUS_CHIPS = [
    { id: '', label: 'All' }, { id: 'website', label: 'Playable Now' }, { id: 'official', label: 'External Play' }, { id: 'soon', label: 'Coming Soon' }
  ];

  /* ---------- search ---------- */
  function norm(s) {
    return String(s || '').toLowerCase().replace(/[‘’'`]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ')
      .replace(/\biii\b/g, '3').replace(/\bii\b/g, '2').replace(/\biv\b/g, '4').trim();
  }
  var hay = {}; G.forEach(function (g) { hay[g.id] = ' ' + norm([g.title, g.yearLabel, g.platform, g.publisher, U.genreLabel(g)].join(' ')) + ' '; });
  function matchesText(g, q) {
    var toks = norm(q).split(' ').filter(Boolean); if (!toks.length) return true;
    var h = hay[g.id], flat = h.replace(/ /g, '');
    return toks.every(function (t) { return h.indexOf(t) >= 0 || flat.indexOf(t) >= 0; });      // "pacman" finds "Pac-Man"
  }
  function periodOf(g) { for (var i = 0; i < PERIODS.length; i++) if (g.year >= PERIODS[i].from && g.year <= PERIODS[i].to) return PERIODS[i].id; return ''; }

  /* filters = { q, genre, platform, period, status } (empty string = no filter) */
  function apply(f) {
    return G.filter(function (g) {
      return (!f.genre || g.genre === f.genre) && (!f.platform || g.platform === f.platform) &&
        (!f.period || periodOf(g) === f.period) && (!f.status || g.status === f.status) && matchesText(g, f.q);
    });
  }
  function isActive(f) { return !!(f.q || f.genre || f.platform || f.period || f.status); }

  /* ---------- state in the address ---------- */
  var KEYS = ['q', 'genre', 'platform', 'period', 'status'];
  function readUrl() {
    var f = {}; KEYS.forEach(function (k) { f[k] = (S.qs.get(k) || '').trim(); });
    if (!U.genres.some(function (x) { return x.id === f.genre; })) f.genre = '';
    if (!G.some(function (g) { return g.platform === f.platform; })) f.platform = '';
    if (!PERIODS.some(function (p) { return p.id === f.period; })) f.period = '';
    if (!U.status[f.status]) f.status = '';
    return f;
  }
  var state = readUrl();
  function writeUrl() {
    var p = new URLSearchParams(); KEYS.forEach(function (k) { if (state[k]) p.set(k, state[k]); });
    try { history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : '') + location.hash); } catch (e) { /* file:// */ }
  }

  /* ---------- filter bar ---------- */
  var platforms = []; G.forEach(function (g) { if (platforms.indexOf(g.platform) < 0) platforms.push(g.platform); });
  platforms.sort(function (a, b) { return a === 'Various' ? 1 : b === 'Various' ? -1 : a < b ? -1 : 1; });
  var periods = PERIODS.filter(function (p) { return G.some(function (g) { return periodOf(g) === p.id; }); });

  function options(list, cur, allLabel) {
    return '<option value="">' + esc(allLabel) + '</option>' + list.map(function (o) {
      return '<option value="' + esc(o.id) + '"' + (o.id === cur ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('');
  }
  function drawBar() {
    $('f-genre').innerHTML = options(U.genres.map(function (x) { return { id: x.id, label: x.label }; }), state.genre, 'All genres');
    $('f-platform').innerHTML = options(platforms.map(function (p) { return { id: p, label: p }; }), state.platform, 'All platforms');
    $('f-period').innerHTML = options(periods, state.period, 'Any period');
    $('f-q').value = state.q;
    var hq = $('q'); if (hq && state.q && !hq.value) hq.value = state.q;
    $('f-status').innerHTML = STATUS_CHIPS.map(function (c) {
      var n = c.id ? G.filter(function (g) { return g.status === c.id; }).length : G.length;
      return '<button type="button" class="fchip" data-status="' + c.id + '" aria-pressed="' + (state.status === c.id ? 'true' : 'false') + '">' + esc(c.label) + ' <b>' + n + '</b></button>';
    }).join('');
  }

  /* ---------- sections ---------- */
  var out = $('arc-out');
  function grid(list) { return '<div class="garid">' + list.map(U.card).join('') + '</div>'; }
  function section(id, title, count, body, extra) {
    return '<section class="sec arc-sec" id="s-' + id + '" aria-labelledby="h-' + id + '"><header class="sec-h"><img src="assets/ui/icons/sec-games.svg" alt="" width="34" height="34"><h2 id="h-' + id + '">' + esc(title) + '</h2>' +
      '<span class="sec-n">' + count + '</span>' + (extra || '') + '</header><div class="sec-b">' + body + '</div></section>';
  }
  function drawSections() {
    var html = [], jump = [];
    function add(id, label, title, list, body) { html.push(section(id, title, list ? list.length : '', body || grid(list))); jump.push('<a href="#s-' + id + '">' + esc(label) + '</a>'); }
    var featured = G.filter(function (g) { return g.featured; }).sort(function (a, b) { return a.featured - b.featured; });
    add('featured', 'Featured', 'Featured Classics', featured);
    U.genres.forEach(function (x) {
      var list = G.filter(function (g) { return g.genre === x.id; }).sort(U.byStatus);
      add(x.id, x.label, x.section, list);
    });
    var rec = U.recent();
    add('recent', 'Recently Played', 'Recently Played', rec,
      rec.length ? grid(rec) : '<p class="arc-empty">Games you open with <b>Play Now</b> will show up here. This list is kept in this browser only.</p>');
    var pop = G.filter(function (g) { return g.popular; }).sort(function (a, b) { return a.popular - b.popular; });
    add('popular', 'Popular', 'Popular Games', pop, '<p class="arc-note">Our picks of the best-known childhood favourites (not a visit count).</p>' + grid(pop));
    var all = G.slice().sort(function (a, b) { var x = norm(a.title), y = norm(b.title); return x < y ? -1 : x > y ? 1 : 0; });
    add('all', 'All Games', 'All Games', all);
    out.innerHTML = html.join('');
    $('arc-jump').innerHTML = jump.join('');
    $('arc-jump').hidden = false;
  }
  function drawResults(list) {
    var body;
    if (list.length) body = grid(list);
    else if (state.status === 'website' && !G.some(function (g) { return g.status === 'website'; }))
      body = '<p class="arc-empty"><b>No game can be played inside this site yet.</b> Every source we have verified lets you play only on its own website, so try <button type="button" class="linkish" data-set-status="official">External Play</button>.</p>';
    else body = '<p class="arc-empty"><b>No games match.</b> Try a shorter name, or <button type="button" class="linkish" data-clear>clear the filters</button>.</p>';
    out.innerHTML = section('results', 'Results', list.length, body);
    $('arc-jump').hidden = true;
  }

  function render() {
    var active = isActive(state), list = apply(state);
    if (active) drawResults(list); else drawSections();
    $('f-clear').hidden = !active;
    $('f-count').textContent = active ? list.length + (list.length === 1 ? ' game found' : ' games found') : G.length + ' classics in the Arcade';
    [].forEach.call(document.querySelectorAll('#f-status .fchip'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-status') === state.status ? 'true' : 'false'); });
    writeUrl();
  }

  /* ---------- events ---------- */
  function set(k, v) { state[k] = v; render(); }
  $('f-q').addEventListener('input', function () { set('q', this.value.trim()); });
  $('f-genre').addEventListener('change', function () { set('genre', this.value); });
  $('f-platform').addEventListener('change', function () { set('platform', this.value); });
  $('f-period').addEventListener('change', function () { set('period', this.value); });
  $('f-status').addEventListener('click', function (e) { var b = e.target.closest('.fchip'); if (b) set('status', b.getAttribute('data-status')); });
  function clearAll() { state = { q: '', genre: '', platform: '', period: '', status: '' }; drawBar(); render(); }
  $('f-clear').addEventListener('click', clearAll);
  $('arc-form').addEventListener('submit', function (e) { e.preventDefault(); });
  out.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear]')) clearAll();
    var s = e.target.closest('[data-set-status]'); if (s) { state.status = s.getAttribute('data-set-status'); drawBar(); render(); }
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted && !isActive(state)) render(); });       // back button: refresh "Recently Played"

  drawBar(); render();
  window.Arcade = { apply: apply, norm: norm, periodOf: periodOf, state: function () { return state; } };
})();
