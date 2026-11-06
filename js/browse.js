/* ==========================================================================
   90s REWIND TV — BROWSE PAGE (browse.html)
   One page for every list on the site, driven by the address:
     browse.html?cat=movies            a category (the "View All" links, the tabs and the tiles)
     browse.html?q=bajaj               search results across everything
     browse.html?featured=1            the featured picks
     browse.html?memory=1              Memory Lane: everything by the year it came out
   plus ?sort=  ?decade=  ?official=1 and ?q= inside a category.
   Everything comes from js/catalogue.js, so a new line in a data file shows up here by itself.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site, C = window.Catalogue;
  if (!S || !C) { var o = document.getElementById('b-out'); if (o) o.innerHTML = '<p class="load-err">The list could not be loaded. Please reload the page.</p>'; return; }
  var $ = S.$, esc = S.esc, out = $('b-out');

  var PAGE = 30;
  var QS = S.qs;
  var cats = C.cats;
  var state = {
    cat: QS.get('cat') || '', q: (QS.get('q') || '').trim(), sort: QS.get('sort') || '', decade: QS.get('decade') || '',
    official: QS.get('official') === '1', featured: QS.get('featured') === '1', memory: QS.get('memory') === '1'
  };
  if (state.cat === 'games') { location.replace('arcade.html' + (state.q ? '?q=' + encodeURIComponent(state.q) : '')); return; }      // games live in the Arcade
  if (state.cat && !C.cat(state.cat)) state.cat = '';
  var shown = PAGE;

  /* ---------- the list ---------- */
  var decadeOf = function (it) { return it.year ? String(Math.floor(it.year / 10) * 10) + 's' : 'none'; };
  var tl = function (it) { return it.title.replace(/^(the|a)\s+/i, '').toLowerCase(); };
  function pool(ignoreCat) {
    var list = state.q ? C.search(state.q) : C.items.slice();
    return list.filter(function (it) {
      return (ignoreCat || !state.cat || it.cat === state.cat) && (!state.featured || it.featured) && (!state.official || it.official) &&
        (!state.decade || decadeOf(it) === state.decade);
    });
  }
  function sortList(list) {
    var s = state.memory ? 'old' : state.sort || (state.q ? 'best' : 'feat');
    if (s === 'best' && state.q) return list;
    if (s === 'az') return list.sort(function (a, b) { return tl(a) < tl(b) ? -1 : tl(a) > tl(b) ? 1 : 0; });
    if (s === 'old') return list.sort(function (a, b) { return ((a.year || 99999) - (b.year || 99999)) || (tl(a) < tl(b) ? -1 : 1); });         // no year: last
    if (s === 'new') return list.sort(function (a, b) { var x = a.year || -1, y = b.year || -1; return (y - x) || (tl(a) < tl(b) ? -1 : 1); });
    // featured first (in the order of js/content.js), then A to Z
    return list.sort(function (a, b) {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.featured) return a.order - b.order;
      return tl(a) < tl(b) ? -1 : tl(a) > tl(b) ? 1 : 0;
    });
  }

  /* ---------- words for the top of the page ---------- */
  function headline() {
    if (state.memory) return { t: 'Memory Lane', b: 'Everything, by the year it first came out. Items with no year we could confirm come last.', ico: 'sec-photos' };
    if (state.featured) return { t: 'Featured Picks', b: 'Our hand-picked favourites from every category.', ico: 'sec-star' };
    if (state.q) return { t: 'Search: “' + state.q + '”', b: 'Matches across TV shows, movies, ads, songs, cricket, WWF, cartoons and games.', ico: 'search' };
    if (state.cat) { var c = C.cat(state.cat); return { t: c.long || c.label, b: c.blurb || '', ico: c.sec || 'sec-star' }; }
    return { t: 'Browse Everything', b: 'Every show, movie, ad, song and classic match on 90s Rewind TV. Pick a category or search.', ico: 'sec-star' };
  }

  /* ---------- controls ---------- */
  function drawControls() {
    var years = {};
    C.items.forEach(function (it) { years[decadeOf(it)] = (years[decadeOf(it)] || 0) + 1; });
    var dec = Object.keys(years).filter(function (k) { return k !== 'none'; }).sort();
    $('b-decade').innerHTML = '<option value="">Any year</option>' + dec.map(function (d) { return '<option value="' + d + '"' + (state.decade === d ? ' selected' : '') + '>' + d + '</option>'; }).join('') +
      '<option value="none"' + (state.decade === 'none' ? ' selected' : '') + '>Year not listed</option>';
    var opts = [['feat', 'Featured first'], ['az', 'A to Z'], ['old', 'Year: oldest first'], ['new', 'Year: newest first']];
    if (state.q) opts.unshift(['best', 'Best match']);
    var cur = state.memory ? 'old' : state.sort || (state.q ? 'best' : 'feat');
    $('b-sort').innerHTML = opts.map(function (o) { return '<option value="' + o[0] + '"' + (cur === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
    $('b-sort').disabled = state.memory;
    $('b-official').checked = state.official;
    var counts = {}, total = 0; pool(true).forEach(function (it) { counts[it.cat] = (counts[it.cat] || 0) + 1; total++; });
    var keep = [];                                                // keep the other parameters when the category changes
    ['q', 'sort', 'decade'].forEach(function (k) { if (state[k]) keep.push(k + '=' + encodeURIComponent(state[k])); });
    ['official', 'featured', 'memory'].forEach(function (k) { if (state[k]) keep.push(k + '=1'); });
    var chip = function (id, label, n) {
      var qs = (id ? ['cat=' + id] : []).concat(keep).join('&');
      return '<a class="fchip" href="browse.html' + (qs ? '?' + qs : '') + '"' + (state.cat === id ? ' aria-current="true"' : '') + '>' + esc(label) + ' <b>' + n + '</b></a>';
    };
    $('b-cats').innerHTML = chip('', 'All', total) + cats.filter(function (c) { return c.id !== 'games'; }).map(function (c) { return chip(c.id, c.label, counts[c.id] || 0); }).join('');
  }

  /* ---------- drawing ---------- */
  function cardsHTML(list) { return '<div class="cards brw-cards">' + list.map(function (it) { return S.card(it, { sub: true, label: !state.cat }); }).join('') + '</div>'; }
  function section(title, n, body, id) {
    return '<section class="sec brw-sec"' + (id ? ' id="' + id + '"' : '') + '><header class="sec-h"><h2>' + esc(title) + '</h2><span class="sec-n">' + n + '</span></header><div class="sec-b">' + body + '</div></section>';
  }
  function render() {
    var list = sortList(pool(false)), h = headline(), more = $('b-more-wrap');
    document.title = h.t + ' — 90s Rewind TV';
    $('h-browse').textContent = h.t; $('b-blurb').textContent = h.b; $('b-ico').src = 'assets/ui/icons/' + h.ico + '.svg';
    $('b-qlabel').textContent = state.cat ? 'Find in ' + (C.cat(state.cat).label) : 'Find in the list';
    $('b-clear').hidden = !(state.q || state.decade || state.official || state.sort);
    more.hidden = true;
    if (!list.length) {
      out.innerHTML = '<div class="arc-empty"><b>Nothing matches.</b> Try fewer words' + (state.q || state.decade || state.official ? ', or <button type="button" class="linkish" data-clear>clear the filters</button>' : '') + '.</div>';
      $('b-count').textContent = '0 found'; return;
    }
    if (state.memory) {                                                         // Memory Lane: one block per year
      var groups = {}, order = [];
      list.forEach(function (it) { var k = it.year || 'none'; if (!groups[k]) { groups[k] = []; order.push(k); } groups[k].push(it); });
      out.innerHTML = order.map(function (k) { return section(k === 'none' ? 'Year not listed' : String(k), groups[k].length, cardsHTML(groups[k]), 'y-' + k); }).join('');
      $('b-count').textContent = list.length + ' items, ' + order.length + (order.length === 1 ? ' group' : ' groups');
    } else {
      var part = list.slice(0, shown);
      out.innerHTML = section(state.q ? 'Results' : headline().t, list.length, cardsHTML(part));
      $('b-count').textContent = 'Showing ' + part.length + ' of ' + list.length;
      if (list.length > shown) { more.hidden = false; $('b-more').textContent = 'Show ' + Math.min(PAGE, list.length - shown) + ' more'; }
    }
  }
  function writeUrl() {
    var p = new URLSearchParams();
    ['cat', 'q', 'sort', 'decade'].forEach(function (k) { if (state[k]) p.set(k, state[k]); });
    ['official', 'featured', 'memory'].forEach(function (k) { if (state[k]) p.set(k, '1'); });
    try { history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : '')); } catch (e) { /* file:// */ }
  }
  function update(k, v) { state[k] = v; shown = PAGE; drawControls(); render(); writeUrl(); }

  /* ---------- events ---------- */
  $('b-q').addEventListener('input', function () { update('q', this.value.trim()); });                // the input keeps what you typed; only the lists redraw
  $('b-sort').addEventListener('change', function () { update('sort', this.value === (state.q ? 'best' : 'feat') ? '' : this.value); });
  $('b-decade').addEventListener('change', function () { update('decade', this.value); });
  $('b-official').addEventListener('change', function () { update('official', this.checked); });
  $('b-form').addEventListener('submit', function (e) { e.preventDefault(); });
  function clear() { state.q = ''; state.sort = ''; state.decade = ''; state.official = false; shown = PAGE; $('b-q').value = ''; drawControls(); render(); writeUrl(); }
  $('b-clear').addEventListener('click', clear);
  out.addEventListener('click', function (e) { if (e.target.closest('[data-clear]')) clear(); });
  $('b-more').addEventListener('click', function () { shown += PAGE; render(); });

  $('b-q').value = state.q;
  drawControls(); render();
  window.Browse = { state: function () { return state; } };
})();
