/* ==========================================================================
   90s REWIND TV — THE CATALOGUE
   One list of everything watchable or playable, built from the data files:
     js/content.js     movies, ads, songs, cricket, WWF and other videos (+ which shows are featured)
     js/tv-library.js  every TV show and cartoon (through TV_SHOWS, built by js/tv-config.js)
     js/games-data.js  the games
   Category pages, search and the homepage rows all read this, so a new line in a data
   file appears everywhere. Nothing here draws anything.

   Catalogue.items            every item (see "an item" below)
   Catalogue.cats             the categories, in order
   Catalogue.byCat(id)        the items of a category (featured first, then A to Z; TV by title)
   Catalogue.featured(id)     the homepage row for a category, in the order of js/content.js
   Catalogue.search(q, max)   items matching every word of q, best first
   Catalogue.catLabel(id)

   AN ITEM  { id, cat, catLabel, title, short, sub, credit, desc, year, featured, official,
              thumb (picture URL or ''), img (local picture), c (colour), dark,
              open: { type: 'yt' | 'pl' | 'show' | 'href' | 'soon', value } }
   ========================================================================== */
(function () {
  'use strict';
  var CATS = (window.CATEGORIES || []).slice();
  var GAMES_CAT = { id: 'games', label: 'Games', icon: 'games', sec: 'sec-games', long: 'Play 90s Games Online', blurb: 'Original browser games in the old arcade spirit.' };
  var cats = CATS.concat([GAMES_CAT]);
  var catBy = {}; cats.forEach(function (c) { catBy[c.id] = c; });
  var NETNAME = {}; (window.TV_NETS || []).forEach(function (n) { NETNAME[n.id] = n.name; });

  var ytThumb = function (id) { return id ? 'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg' : ''; };
  var dmThumb = function (id) { return id ? 'https://www.dailymotion.com/thumbnail/video/' + id : ''; };
  var slug = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  var seen = {};
  function uid(base) { var id = base, n = 2; while (seen[id]) { id = base + '-' + n++; } seen[id] = 1; return id; }

  var items = [];
  var featuredShow = {};        // show title -> the content.js item that features it

  /* ---- 1. content.js ---- */
  (window.CONTENT || []).forEach(function (c, ci) {
    c._i = ci;
    if (!catBy[c.cat]) { if (window.console) console.warn('content.js: unknown category', c.cat, c.title); return; }
    if (c.show) { featuredShow[c.show] = c; return; }           // decorates the show's own entry below
    var open = c.yt ? { type: 'yt', value: c.yt } : c.playlist ? { type: 'pl', value: c.playlist } : c.href ? { type: 'href', value: c.href } : null;
    var pic = c.img || ytThumb(c.thumb || c.yt) || (c.playlist && window.TV_PL_THUMBS ? ytThumb(window.TV_PL_THUMBS[c.playlist]) : '');
    items.push({
      id: uid(c.cat + '-' + slug(c.title)), cat: c.cat, catLabel: catBy[c.cat].label, title: c.title, short: c.short || '', sub: c.sub || '', credit: c.credit || '',
      kind: '', desc: c.desc || '', year: c.year || 0, featured: !!c.featured, official: !!c.official, thumb: pic, img: c.img || '', c: c.c || '', dark: !!c.dark,
      open: open || { type: 'soon', value: c.title }, order: ci
    });
  });

  /* ---- 2. every TV show and cartoon ---- */
  function showCat(s) {
    if (s.kind === 'ads') return 'ads';
    if (s.kind === 'kids') return 'cartoons';
    if (s.kind === 'sports') return /wwf|wwe|wrestl/i.test(s.title) ? 'wwf' : 'cricket';
    return 'tv';
  }
  function yearsOf(s) {
    if (s.years) return s.years;
    var lo = 9999, hi = 0; (s.runs || []).forEach(function (r) { if (r.from < lo) lo = r.from; if (r.to > hi) hi = r.to; });
    return hi ? (lo === hi ? String(lo) : lo + '–' + String(hi).slice(-2)) : '';
  }
  (window.TV_SHOWS || []).forEach(function (s) {
    var cat = showCat(s), f = featuredShow[s.title] || {};
    var pic = f.thumb ? ytThumb(f.thumb)
      : s.host === 'dm' ? dmThumb(s.episodes[0])
      : s.episodes && s.episodes.length ? ytThumb(s.episodes[0])
      : s.playlist && window.TV_PL_THUMBS ? ytThumb(window.TV_PL_THUMBS[s.playlist]) : '';
    var yrs = yearsOf(s), first = parseInt(yrs, 10) || 0;
    var nets = (s.nets || []).map(function (n) { return NETNAME[n] || n; });
    items.push({
      id: uid(cat + '-' + slug(s.title)), cat: cat, catLabel: catBy[cat].label, title: s.title, short: '',
      sub: f.sub || [yrs, nets.slice(0, 2).join(' / ')].filter(Boolean).join(' · '),
      kind: s.kind || '', credit: s.official ? 'Official upload' : 'Community upload', desc: f.desc || s.note || '', year: f.year || first,
      featured: !!f.title, official: !!s.official, thumb: pic, img: '', c: f.c || '', dark: !!f.dark,
      open: { type: 'show', value: s.title }, order: f.title ? f._i : 100000 + items.length
    });
  });

  /* ---- 3. games ---- */
  (window.GAMES || []).forEach(function (g, gi) {
    items.push({
      id: uid('games-' + g.id), cat: 'games', catLabel: 'Games', title: g.title, short: '', sub: g.ready ? 'Play now' : 'Coming soon', credit: g.credit || 'Original game',
      kind: '', desc: g.desc || '', year: 0, featured: !!g.featured, official: true, thumb: '', img: g.img || '', c: g.c || '', dark: !!g.dark,
      open: g.ready ? { type: 'href', value: g.href || 'games.html#' + g.id } : { type: 'soon', value: g.title }, order: 200000 + gi
    });
  });

  /* ---- queries ---- */
  var norm = function (s) { return String(s || '').toLowerCase().replace(/[‘’'`]/g, '').replace(/[^a-z0-9ऀ-ॿ]+/g, ' ').trim(); };
  items.forEach(function (it) { it._t = norm(it.title); it._all = norm([it.title, it.sub, it.credit, it.desc, it.catLabel, it.kind, it.year || ''].join(' ')); });

  function byCat(id) {
    var list = items.filter(function (it) { return it.cat === id; });
    list.sort(function (a, b) {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.featured && b.featured) return a.order - b.order;
      var x = a.title.replace(/^(the|a)\s+/i, '').toLowerCase(), y = b.title.replace(/^(the|a)\s+/i, '').toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    return list;
  }
  function featured(id) { return items.filter(function (it) { return it.cat === id && it.featured; }).sort(function (a, b) { return a.order - b.order; }); }
  function search(q, max) {
    var toks = norm(q).split(' ').filter(Boolean); if (!toks.length) return [];
    var out = [];
    items.forEach(function (it) {
      var score = 0;
      for (var i = 0; i < toks.length; i++) {
        var t = toks[i], s = 0;
        if (it._t === t) s = 60;
        else if (it._t.indexOf(t) === 0) s = 40;
        else if ((' ' + it._t).indexOf(' ' + t) >= 0) s = 25;
        else if (it._t.indexOf(t) >= 0) s = 12;
        else if ((' ' + it._all).indexOf(' ' + t) >= 0) s = 5;
        else if (it._all.indexOf(t) >= 0) s = 2;
        if (!s) return;                       // every word must match somewhere
        score += s;
      }
      if (it.featured) score += 3;
      out.push({ it: it, s: score });
    });
    out.sort(function (a, b) { return b.s - a.s || (a.it._t < b.it._t ? -1 : 1); });
    out = out.map(function (o) { return o.it; });
    return max ? out.slice(0, max) : out;
  }

  window.Catalogue = {
    items: items, cats: cats, byCat: byCat, featured: featured, search: search,
    cat: function (id) { return catBy[id] || null; }, catLabel: function (id) { return catBy[id] ? catBy[id].label : id; },
    ytThumb: ytThumb
  };
})();
