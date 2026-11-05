/* ==========================================================================
   90s REWIND TV — THE SHARED SITE SHELL
   Everything every page has in common, written once:
     - the header, the tabs, the What's New ticker, the footer
     - the search box with its drop-down of results
     - the pop-up (YouTube's own embedded player, a playlist, or a large picture)
     - the little message at the bottom of the screen ("toast")
     - the card builders that draw an item from js/catalogue.js

   A page opts in with:   <body data-page="home">   (or "browse", "games", ...)
                          <div id="site-top"></div>      the header + ticker bar go here
                          <div id="site-bottom"></div>   the footer goes here
   Needs, in this order:  js/content.js  js/games-data.js  (js/tv-*.js for the shows)  js/catalogue.js

   Opening things: any element with one of these attributes opens in the pop-up:
     data-yt="VIDEO_ID"          one video
     data-pl="PLAYLIST_ID"       a playlist (YouTube plays the next video itself)
     data-zoom data-src data-alt a picture; add data-group="x" for Previous/Next between them
     data-soon="Title"           a "coming soon" message
   Nothing is downloaded or re-hosted: videos are YouTube's own embed.
   ========================================================================== */
(function () {
  'use strict';
  var D = document;
  var $ = function (id) { return D.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* private mode */ } }
  };
  var icon = function (n) { return 'assets/ui/icons/' + n + '.svg'; };
  var PAGE = (D.body && D.body.getAttribute('data-page')) || '';
  var QS = new URLSearchParams(location.search);
  var CAT = function () { return window.Catalogue; };
  var SITE = window.SITE || {};

  /* ---------------------------------------------------------------- toast */
  var toastTimer = 0;
  function toast(msg) {
    var t = $('toast'); if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }

  /* ---------------------------------------------------------------- pictures that may fail */
  function pic(src, title, cls) {
    return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + esc(src) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-fb="' + esc(title) + '">';
  }
  // A picture that cannot load (offline, removed video) turns into a colour block with the title.
  D.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.dataset || !img.dataset.fb) return;
    var box = img.parentNode; img.remove();
    if (box && !box.querySelector('.fb')) box.insertAdjacentHTML('beforeend', '<b class="fb">' + esc(img.dataset.fb) + '</b>');
  }, true);

  /* ---------------------------------------------------------------- header, tabs, bar, footer */
  function headerHTML() {
    return '<header class="hd" id="top"><div class="hd-in">' +
      '<a class="hd-logo" href="home.html" aria-label="90s Rewind TV, home"><img src="assets/ui/logo.svg" alt="90s Rewind TV" width="280" height="219"></a>' +
      '<p class="hd-tag">India\'s<br>90s Nostalgia<br>Hangout!</p>' +
      '<img class="hd-vhs" src="assets/ui/vhs.svg" alt="" width="118" height="84">' +
      '<p class="hd-banner">TV Shows • Movies • Ads • Games • Songs • Cricket • WWF<br>&amp; Everything 90s!</p>' +
      '<img class="hd-cola" src="assets/ui/cola.svg" alt="" width="44" height="112">' +
      '<img class="hd-cube" src="assets/ui/rubik.svg" alt="" width="76" height="76">' +
      '<a class="btn hd-login" href="' + (PAGE === 'home' ? '#login' : 'home.html#login') + '"><img src="assets/ui/icons/user.svg" alt="" width="26" height="26"><span>Login / Join</span></a>' +
      '<nav class="tabs" id="tabs" aria-label="Main sections"></nav></div></header>' +
      '<div class="bar"><div class="bar-in">' +
      '<span class="new-pill"><b aria-hidden="true">»</b> What\'s New?</span>' +
      '<div class="ticker" aria-label="What\'s new">' +
      '<svg class="ticker-star" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,1.5 15,8.6 22.5,9.3 16.8,14.3 18.6,21.8 12,17.8 5.4,21.8 7.2,14.3 1.5,9.3 9,8.6" fill="#ff2a3a" stroke="#1a0f2e" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
      '<div class="ticker-items" id="ticker"></div>' +
      '<button class="ticker-next" id="ticker-next" type="button" aria-label="Next headline">»</button></div>' +
      '<div class="search-box">' +
      '<form class="search" id="search" role="search" action="browse.html" method="get" autocomplete="off">' +
      '<img src="assets/ui/icons/search.svg" alt="" width="22" height="22">' +
      '<input id="q" name="q" type="search" placeholder="Search shows, movies, ads, games.." aria-label="Search shows, movies, ads, songs, cricket, WWF and games" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="sugg" autocapitalize="off" spellcheck="false">' +
      '<button class="btn" type="submit">Go</button></form>' +
      '<div class="sugg" id="sugg" role="listbox" aria-label="Search results" hidden></div></div>' +
      '</div></div>';
  }

  function footerHTML() {
    var l = SITE.pages || {};
    return '<footer class="ft">' +
      '<img class="ft-zig ft-zig-l" src="assets/ui/zig-lime.svg" alt="" width="72" height="75">' +
      '<img class="ft-zig ft-zig-r" src="assets/ui/zig-pink.svg" alt="" width="72" height="75">' +
      '<div class="ft-art ft-art-l"><img class="ft-cass" src="assets/ui/cassette.svg" alt="" width="216" height="147"><img class="ft-ear" src="assets/ui/earbuds.svg" alt="" width="86" height="76"></div>' +
      '<div class="ft-mid"><img class="ft-word" src="assets/ui/wordmark.svg" alt="90s Rewind TV" height="66">' +
      '<p class="ft-tag">Relive the TV, Movies, Ads, Games, Songs and Moments of the 90s!</p>' +
      '<nav class="ft-links" aria-label="Footer"><a href="' + (l.about || 'about.html#about') + '">About</a><a href="' + (l.submit || 'about.html#submit') + '">Submit Playlist</a><a href="' + (l.guidelines || 'about.html#guidelines') + '">Community Guidelines</a><a href="' + (l.contact || 'about.html#contact') + '">Contact</a></nav></div>' +
      '<div class="ft-art ft-art-r"><img class="ft-stack" src="assets/ui/vhs-stack.svg" alt="" width="190" height="167"><img class="ft-cube" src="assets/ui/rubik.svg" alt="" width="92" height="92"></div>' +
      '</footer>';
  }

  var MODAL_HTML =
    '<div class="modal" id="modal" hidden role="dialog" aria-modal="true" aria-labelledby="m-title"><div class="modal-box">' +
    '<header class="modal-h"><h3 id="m-title">Now playing</h3><button class="modal-x" id="m-close" type="button" aria-label="Close">✕</button></header>' +
    '<div class="modal-v" id="m-v"></div>' +
    '<div class="modal-n" id="m-n" hidden><button type="button" id="m-prev" aria-label="Previous picture">« Previous</button><span id="m-count"></span><button type="button" id="m-next" aria-label="Next picture">Next »</button></div>' +
    '<p class="modal-s" id="m-sub"></p></div></div>' +
    '<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>';

  function currentTab() {
    if (PAGE === 'browse') return QS.get('cat') || '';
    return PAGE;
  }
  function drawTabs() {
    var nav = $('tabs'); if (!nav) return;
    var cur = currentTab();
    nav.innerHTML = (window.NAV || []).map(function (n) {
      return '<a class="tab" href="' + esc(n.href) + '" style="--c:' + n.color + '"' + (n.id === cur ? ' aria-current="page"' : '') + '>' +
        '<img src="' + icon(n.icon) + '" alt="" width="34" height="34"><span>' + esc(n.label) + '</span></a>';
    }).join('');
  }

  var tick = (window.TICKER || []).slice();
  function drawTicker() {
    var el = $('ticker'); if (!el) return;
    var one = tick.map(function (t) { return '<a href="' + esc(t.href) + '">' + esc(t.text) + '</a>'; }).join('');
    el.innerHTML = '<div>' + one + one + '</div>';
  }

  /* ---------------------------------------------------------------- cards */
  function subOf(it) { return [it.sub, it.credit].filter(Boolean).join(' · '); }
  function chipOf(it) { var s = (it.sub || '').split(' · ')[0]; return /^(song|trailer|part)/i.test(s) ? s.toUpperCase().replace(/ OF \d+/, '') : ''; }
  function showHref(t) { return 'tv.html#show=' + encodeURIComponent(t); }
  function playable(it) { return it.open.type === 'yt' || it.open.type === 'pl'; }

  // The outer element of a card: a link for pages and shows, a button for things that open the pop-up.
  function shell(it, cls, inner) {
    var o = it.open, tip = ' title="' + esc(it.title + (subOf(it) ? ' · ' + subOf(it) : '')) + '"';
    if (o.type === 'show') return '<a class="' + cls + '" href="' + esc(showHref(o.value)) + '"' + tip + '>' + inner + '</a>';
    if (o.type === 'href') return '<a class="' + cls + '" href="' + esc(o.value) + '"' + tip + '>' + inner + '</a>';
    if (o.type === 'soon') return '<button class="' + cls + '" type="button" data-soon="' + esc(o.value) + '"' + tip + '>' + inner + '</button>';
    return '<button class="' + cls + '" type="button" ' + (o.type === 'pl' ? 'data-pl' : 'data-yt') + '="' + esc(o.value) + '" data-title="' + esc(it.title) + '" data-sub="' + esc(subOf(it)) + '"' + tip + '>' + inner + '</button>';
  }
  // o.sub = show the small grey line under the title; o.label = show the category name on the picture
  function card(it, o) {
    o = o || {};
    var src = it.img || it.thumb, chip = playable(it) && it.cat === 'movies' ? chipOf(it) : '';
    var inner = '<span class="card-img" style="--c:' + (it.c || '#3a2a66') + '">' + (src ? pic(src, it.title) : '<b class="fb">' + esc(it.title) + '</b>') +
      (chip ? '<span class="chip">' + esc(chip) + '</span>' : '') +
      (o.label ? '<span class="cat-lbl">' + esc(it.catLabel) + '</span>' : '') +
      (playable(it) ? '<i class="ytag"></i>' : '') + (it.open.type === 'soon' ? '<span class="soon">SOON</span>' : '') + '</span>' +
      '<span class="card-t"><span>' + esc(it.short || it.title) + (o.sub && it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</span></span>';
    return shell(it, 'card' + (it.dark || o.dark ? ' is-dark' : ''), inner);
  }
  function wide(it) {
    var inner = (it.thumb ? pic(it.thumb, it.title, 'bg') : '<b class="fb">' + esc(it.title) + '</b>') +
      '<span class="wide-t"><b>' + esc(it.title) + '</b><span>' + esc(it.sub) + '</span></span><span class="pb"><img src="' + icon('play') + '" alt="" width="40" height="40"></span>';
    return shell(it, 'wide', inner);
  }

  /* ---------------------------------------------------------------- the pop-up */
  var modal, lastFocus = null, navFns = null;
  function modalEl() { return modal || (modal = $('modal')); }
  function vodEvent(open) { D.dispatchEvent(new CustomEvent('home:vod', { detail: { open: open } })); }
  function openModal(title) {
    var m = modalEl(); if (!m) return null;
    if (m.hidden) lastFocus = D.activeElement;
    $('m-title').textContent = title;
    m.hidden = false; $('m-close').focus();
    return m;
  }
  function frame(src, title) {
    return '<iframe id="m-yt" src="' + esc(src) + '" title="' + esc(title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  }
  function openVideo(id, title, sub) {
    if (!openModal(title || 'Now playing')) return;
    navFns = null; $('m-n').hidden = true;
    $('m-v').className = 'modal-v';
    $('m-v').innerHTML = frame('https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&playsinline=1', title);
    $('m-sub').innerHTML = (sub ? esc(sub) + ' · ' : '') + '<a href="https://www.youtube.com/watch?v=' + encodeURIComponent(id) + '" target="_blank" rel="noopener">Watch on YouTube</a>';
    vodEvent(true);
  }
  function openPlaylist(id, title, sub) {
    if (!openModal(title || 'Playlist')) return;
    navFns = null; $('m-n').hidden = true;
    $('m-v').className = 'modal-v';
    $('m-v').innerHTML = frame('https://www.youtube-nocookie.com/embed/videoseries?list=' + encodeURIComponent(id) + '&autoplay=1&rel=0&playsinline=1', title);
    $('m-sub').innerHTML = (sub ? esc(sub) + ' · ' : '') + 'Plays the whole playlist, one video after another · <a href="https://www.youtube.com/playlist?list=' + encodeURIComponent(id) + '" target="_blank" rel="noopener">Watch on YouTube</a>';
    vodEvent(true);
  }
  // opts.prev / opts.next: functions that open the neighbouring picture; opts.count: "3 of 12"
  function openImage(src, title, opts) {
    opts = opts || {};
    if (!openModal(title || 'Picture')) return;
    $('m-v').className = 'modal-v is-img';
    $('m-v').innerHTML = '<img class="modal-img" src="' + esc(src) + '" alt="' + esc(title || '') + '">';
    $('m-sub').innerHTML = '<a href="' + esc(src) + '" download>Download</a>';
    navFns = opts.prev || opts.next ? opts : null;
    $('m-n').hidden = !navFns;
    if (navFns) { $('m-count').textContent = opts.count || ''; $('m-prev').disabled = !opts.prev; $('m-next').disabled = !opts.next; }
    vodEvent(false);
  }
  function closeModal() {
    var m = modalEl(); if (!m || m.hidden) return;
    m.hidden = true; $('m-v').innerHTML = ''; navFns = null;
    vodEvent(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  // Open the picture of a [data-zoom] element, with Previous/Next across its group (the visible ones, in page order).
  function zoom(el) {
    var group = el.getAttribute('data-group'), all = [el];
    if (group) all = [].filter.call(D.querySelectorAll('[data-zoom][data-group="' + group + '"]'), function (x) { return !x.closest('[hidden]'); });
    var i = Math.max(0, all.indexOf(el));
    function at(k) { var t = all[k]; openImage(t.getAttribute('data-src'), t.getAttribute('data-alt'), {
      prev: k > 0 ? function () { at(k - 1); } : null, next: k < all.length - 1 ? function () { at(k + 1); } : null, count: all.length > 1 ? (k + 1) + ' of ' + all.length : '' }); }
    at(i);
  }

  // Open any catalogue item the way its card would.
  function open(it) {
    var o = it.open;
    if (o.type === 'yt') openVideo(o.value, it.title, subOf(it));
    else if (o.type === 'pl') openPlaylist(o.value, it.title, subOf(it));
    else if (o.type === 'show') location.href = showHref(o.value);
    else if (o.type === 'href') location.href = o.value;
    else toast(it.title + ' is coming soon.');
  }

  function bindModal() {
    var m = modalEl(); if (!m) return;
    $('m-close').addEventListener('click', closeModal);
    $('m-prev').addEventListener('click', function () { if (navFns && navFns.prev) navFns.prev(); });
    $('m-next').addEventListener('click', function () { if (navFns && navFns.next) navFns.next(); });
    m.addEventListener('click', function (e) { if (e.target === m) closeModal(); });
    D.addEventListener('keydown', function (e) {
      if (m.hidden) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'ArrowLeft' && navFns && navFns.prev) { e.preventDefault(); navFns.prev(); return; }
      if (e.key === 'ArrowRight' && navFns && navFns.next) { e.preventDefault(); navFns.next(); return; }
      if (e.key === 'Tab') {                      // keep the keyboard inside the pop-up
        var f = [].filter.call(m.querySelectorAll('button, a[href], iframe'), function (x) { return !x.disabled && !x.closest('[hidden]'); });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && D.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && D.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    D.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target : null; if (!t) return;
      var yt = t.closest('[data-yt]');
      if (yt) { e.preventDefault(); openVideo(yt.dataset.yt, yt.dataset.title, yt.dataset.sub); return; }
      var pl = t.closest('[data-pl]');
      if (pl) { e.preventDefault(); openPlaylist(pl.dataset.pl, pl.dataset.title, pl.dataset.sub); return; }
      var zm = t.closest('[data-zoom]');
      if (zm) { e.preventDefault(); zoom(zm); return; }
      var so = t.closest('[data-soon]');
      if (so) { e.preventDefault(); toast(so.dataset.soon + ' is coming soon.'); }
    });
  }

  /* ---------------------------------------------------------------- search box with a drop-down */
  function bindSearch() {
    var input = $('q'), form = $('search'), box = $('sugg');
    if (!input || !form || !box) return;
    if (QS.get('q') && PAGE === 'browse') input.value = QS.get('q');
    var list = [], active = -1, total = 0;
    function hide() { box.hidden = true; active = -1; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); }
    function mark(i) {
      active = i;
      [].forEach.call(box.querySelectorAll('[role=option]'), function (el, k) { el.setAttribute('aria-selected', k === i ? 'true' : 'false'); if (k === i) { input.setAttribute('aria-activedescendant', el.id); el.scrollIntoView({ block: 'nearest' }); } });
      if (i < 0) input.removeAttribute('aria-activedescendant');
    }
    function all() { return 'browse.html?q=' + encodeURIComponent(input.value.trim()); }
    function draw() {
      var q = input.value.trim(), C = CAT();
      if (q.length < 2 || !C) { hide(); return; }
      var res = C.search(q); total = res.length; list = res.slice(0, 7);
      var h = list.map(function (it, i) {
        var src = it.img || it.thumb;
        return '<a role="option" id="sg-' + i + '" aria-selected="false" class="sg" href="' + esc(it.open.type === 'show' ? showHref(it.open.value) : it.open.type === 'href' ? it.open.value : '#') + '" data-i="' + i + '">' +
          '<span class="sg-p">' + (src ? pic(src, it.title) : '<b class="fb">' + esc(it.title) + '</b>') + '</span>' +
          '<span class="sg-t"><b>' + esc(it.title) + '</b><small>' + esc(it.sub || '') + '</small></span><span class="sg-c">' + esc(it.catLabel) + '</span></a>';
      }).join('');
      if (!list.length) h = '<p class="sg-none">No match for “' + esc(q) + '”. Try a show name, an actor, a year or a category.</p>';
      else if (total > list.length) h += '<a class="sg-all" href="' + esc(all()) + '">See all ' + total + ' results »</a>';
      else h += '<a class="sg-all" href="' + esc(all()) + '">Open results page »</a>';
      box.innerHTML = h; box.hidden = false; active = -1;
      input.setAttribute('aria-expanded', 'true');
    }
    input.addEventListener('input', draw);
    input.addEventListener('focus', function () { if (input.value.trim().length >= 2) draw(); });
    input.addEventListener('keydown', function (e) {
      if (box.hidden) { if (e.key === 'ArrowDown' && input.value.trim().length >= 2) { draw(); e.preventDefault(); } return; }
      var n = list.length;
      if (e.key === 'ArrowDown') { e.preventDefault(); mark(active + 1 >= n ? 0 : active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); mark(active <= 0 ? n - 1 : active - 1); }
      else if (e.key === 'Escape') { hide(); }
      else if (e.key === 'Enter' && active >= 0 && list[active]) { e.preventDefault(); var it = list[active]; hide(); open(it); }
    });
    box.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.sg') : null;
      if (!a) return;
      var it = list[+a.dataset.i]; if (!it) return;
      if (it.open.type === 'yt' || it.open.type === 'pl' || it.open.type === 'soon') { e.preventDefault(); hide(); open(it); }
    });
    box.addEventListener('mousedown', function (e) { e.preventDefault(); });          // keep the input focused while clicking a result
    D.addEventListener('click', function (e) { if (!form.contains(e.target) && !box.contains(e.target)) hide(); });
    form.addEventListener('submit', function (e) {
      var q = input.value.trim();
      if (!q) { e.preventDefault(); input.focus(); return; }
      if (active >= 0) { e.preventDefault(); return; }
      // a plain GET to browse.html?q=... (works without JavaScript too)
    });
    D.addEventListener('keydown', function (e) {       // "/" jumps to the search box
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = D.activeElement; if (t && /^(input|textarea|select)$/i.test(t.tagName)) return;
      e.preventDefault(); input.focus(); input.select();
    });
  }

  /* ---------------------------------------------------------------- mount */
  function mountTop() {
    var ph = $('site-top'); if (!ph) return;
    ph.insertAdjacentHTML('beforebegin', headerHTML()); ph.remove();
    drawTabs(); drawTicker();
    var nx = $('ticker-next'); if (nx) nx.addEventListener('click', function () { tick.push(tick.shift()); drawTicker(); });
    var lg = D.querySelector('.hd-login');
    if (lg && PAGE === 'home') lg.addEventListener('click', function () { setTimeout(function () { var u = $('lg-u'); if (u) u.focus({ preventScroll: true }); }, 300); });
  }
  function mountBottom() {
    var ph = $('site-bottom');
    if (ph) { ph.insertAdjacentHTML('beforebegin', footerHTML()); ph.remove(); } else D.body.insertAdjacentHTML('beforeend', footerHTML());
    D.body.insertAdjacentHTML('beforeend', MODAL_HTML);
    bindModal(); bindSearch();
  }
  function ready(fn) { if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', fn); else fn(); }

  if (D.body) mountTop();
  ready(function () { if (!$('tabs')) mountTop(); mountBottom(); D.dispatchEvent(new CustomEvent('site:ready')); });

  window.Site = {
    $: $, esc: esc, store: store, icon: icon, qs: QS, page: PAGE, toast: toast, pic: pic, ready: ready,
    card: card, wide: wide, open: open, showHref: showHref, subOf: subOf,
    openVideo: openVideo, openPlaylist: openPlaylist, openImage: openImage, closeModal: closeModal
  };
  // The homepage TV pop-up helper used by js/home-live.js
  window.HomeUI = { toast: toast, openVideo: openVideo };
})();
