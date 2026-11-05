/* ==========================================================================
   90s REWIND TV — HOMEPAGE BEHAVIOUR (home.html)
   Builds every card, tab and list from js/home-data.js (window.HOME) and wires
   the poll, trivia, search, discussions, login demo and the video pop-up.
   The CRT television is in js/home-live.js.
   ========================================================================== */
(function () {
  'use strict';
  const H = window.HOME;
  if (!H) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  const thumb = (id) => 'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg';
  const icon = (name) => 'assets/ui/icons/' + name + '.svg';
  const showHref = (t) => 'tv.html#show=' + encodeURIComponent(t);

  /* ---------- toast ---------- */
  let toastTimer = 0;
  function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
  }

  /* ---------- picture with a fallback (a thumbnail that cannot load becomes a colour block with the title) ---------- */
  function pic(src, title) {
    return '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-fb="' + esc(title) + '">';
  }
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.dataset || !img.dataset.fb) return;
    const box = img.parentNode; img.remove();
    if (box && !box.querySelector('.fb')) box.insertAdjacentHTML('beforeend', '<b class="fb">' + esc(img.dataset.fb) + '</b>');
  }, true);

  /* ---------- navigation tabs ---------- */
  $('tabs').innerHTML = H.nav.map((n) =>
    '<a class="tab" href="' + esc(n.href) + '" style="--c:' + n.color + '"' + (n.current ? ' aria-current="page"' : '') + '>' +
    '<img src="' + icon(n.icon) + '" alt="" width="34" height="34"><span>' + esc(n.label) + '</span></a>').join('');

  /* ---------- what's new ticker ---------- */
  let tick = H.ticker.slice();
  function drawTicker() {
    const one = tick.map((t) => '<a href="' + esc(t.href) + '">' + esc(t.text) + '</a>').join('');
    $('ticker').innerHTML = '<div>' + one + one + '</div>';
  }
  drawTicker();
  $('ticker-next').addEventListener('click', () => { tick.push(tick.shift()); drawTicker(); });

  /* ---------- search: finds a show in the TV catalogue, else searches ALL SHOWS ---------- */
  const SHOWS = window.TV_SHOWS || [];
  $('q-list').innerHTML = SHOWS.map((s) => '<option value="' + esc(s.title) + '">').join('');
  $('search').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('q').value.trim(); if (!q) { $('q').focus(); return; }
    const low = q.toLowerCase();
    let hit = SHOWS.filter((s) => s.title.toLowerCase() === low)[0] || SHOWS.filter((s) => s.title.toLowerCase().indexOf(low) === 0)[0];
    if (hit) { location.href = showHref(hit.title); return; }
    location.href = 'tv.html#q=' + encodeURIComponent(q);
  });

  /* ---------- daily poll ---------- */
  (function poll() {
    const P = H.poll, key = 'home.poll.' + P.id, box = $('poll-opts'), btn = $('poll-go');
    $('poll-q').textContent = P.q;
    function results(mine) {
      const counts = P.seed.slice(); if (mine >= 0) counts[mine] += 1;
      const total = counts.reduce((a, b) => a + b, 0), max = Math.max.apply(null, counts);
      box.innerHTML = P.options.map((o, i) => '<span class="res"><i style="width:' + Math.round(counts[i] / max * 100) + '%"></i>' + esc(o) + ' ' + Math.round(counts[i] / total * 100) + '%' + (i === mine ? ' ✓' : '') + '</span>').join('');
      btn.textContent = 'Thanks!'; btn.disabled = true;
    }
    const voted = store.get(key);
    if (voted != null && P.options[+voted]) { results(+voted); return; }
    box.innerHTML = P.options.map((o, i) => '<label><input type="radio" name="poll" value="' + i + '"><span>' + esc(o) + '</span></label>').join('');
    $('poll').addEventListener('submit', (e) => {
      e.preventDefault();
      const c = box.querySelector('input:checked');
      if (!c) { toast('Pick a show first, then Vote!'); return; }
      store.set(key, c.value); results(+c.value);
    });
  })();

  /* ---------- 90s trivia ---------- */
  (function trivia() {
    let i = Math.floor(Date.now() / 86400000) % H.trivia.length, shown = false;
    const q = $('trivia-q'), a = $('trivia-a'), b = $('trivia-go');
    function draw() { q.textContent = H.trivia[i].q; a.hidden = true; b.textContent = 'Check Answer »'; shown = false; }
    b.addEventListener('click', () => {
      if (!shown) { a.textContent = H.trivia[i].a; a.hidden = false; b.textContent = 'Next Question »'; shown = true; }
      else { i = (i + 1) % H.trivia.length; draw(); }
    });
    draw();
  })();

  /* ---------- member login (look only: accounts come in a later phase) ---------- */
  function loginNote(e) {
    if (e) e.preventDefault();
    const n = $('login-note');
    n.textContent = 'Member accounts open in a later phase. Nothing you type here is sent or saved.';
    n.hidden = false;
  }
  $('login-form').addEventListener('submit', loginNote);
  $('join').addEventListener('click', loginNote);
  document.querySelector('.hd-login').addEventListener('click', () => { setTimeout(() => $('lg-u').focus({ preventScroll: true }), 300); });

  /* ---------- browse tiles ---------- */
  $('tiles').innerHTML = H.tiles.map((t) =>
    '<a class="tile" href="' + esc(t.href) + '" style="--c1:' + t.c1 + ';--c2:' + t.c2 + '"><img src="' + icon(t.icon) + '" alt="" width="38" height="38"><span>' + esc(t.label) + '</span></a>').join('');

  /* ---------- cards ---------- */
  function chipOf(it) { const s = (it.sub || '').split(' · ')[0]; return /^(song|trailer|part)/i.test(s) ? s.toUpperCase().replace(/ OF 17/, '') : ''; }
  function subOf(it) { return [it.sub, it.credit].filter(Boolean).join(' · '); }
  function cardHTML(it, extra) {
    const dark = it.dark ? ' is-dark' : '';
    const src = it.img || (it.yt ? thumb(it.yt) : '');
    const label = esc(it.short || it.title);
    const chip = it.yt && !it.show ? chipOf(it) : '';
    const inner =
      '<span class="card-img" style="--c:' + (it.c || '#3a2a66') + '">' + (src ? pic(src, it.title) : '') +
      (chip ? '<span class="chip">' + esc(chip) + '</span>' : '') +
      (it.yt && !it.show ? '<i class="ytag"></i>' : '') + (it.soon ? '<span class="soon">SOON</span>' : '') + '</span>' +
      '<span class="card-t"><span>' + label + (extra && it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</span></span>';
    const tip = ' title="' + esc(it.title + (subOf(it) ? ' · ' + subOf(it) : '')) + '"';
    if (it.show) return '<a class="card' + dark + '" href="' + showHref(it.show) + '"' + tip + '>' + inner + '</a>';
    if (it.href) return '<a class="card' + dark + '" href="' + esc(it.href) + '"' + tip + '>' + inner + '</a>';
    if (it.soon) return '<button class="card' + dark + '" type="button" data-soon="' + esc(it.title) + '"' + tip + '>' + inner + '</button>';
    return '<button class="card' + dark + '" type="button" data-yt="' + esc(it.yt) + '" data-title="' + esc(it.title) + '" data-sub="' + esc(subOf(it)) + '"' + tip + '>' + inner + '</button>';
  }
  function wideHTML(it) {
    return '<button class="wide" type="button" data-yt="' + esc(it.yt) + '" data-title="' + esc(it.title) + '" data-sub="' + esc(subOf(it)) + '" title="' + esc(it.title + ' · ' + subOf(it)) + '">' +
      pic(thumb(it.yt), it.title).replace('<img ', '<img class="bg" ') +
      '<span class="wide-t"><b>' + esc(it.title) + '</b><span>' + esc(it.sub) + '</span></span><span class="pb"><img src="' + icon('play') + '" alt="" width="40" height="40"></span></button>';
  }
  const fill = (id, items, fn) => { $(id).innerHTML = items.map(fn).join(''); };
  fill('g-tv', H.tv, (it) => cardHTML(it));
  fill('g-movies', H.movies, (it) => cardHTML(it));
  fill('g-ads', H.ads, (it) => cardHTML(it));
  fill('g-games', H.games, (it) => cardHTML(it));
  fill('g-songs', H.songs, wideHTML);
  fill('g-cricket', H.cricket, wideHTML);
  fill('g-wwf', H.wwf, (it) => cardHTML(Object.assign({ dark: true }, it), true));

  /* ---------- photo gallery, wallpapers (open large in the pop-up) ---------- */
  fill('gal', H.gallery, (g, i) => '<a href="' + esc(g.src) + '" data-img="' + i + '" aria-label="' + esc(g.alt) + '"><img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" loading="lazy"></a>');
  fill('g-walls', H.walls, (g, i) => '<a href="' + esc(g.src) + '" data-wall="' + i + '" aria-label="' + esc(g.alt) + '"><img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" loading="lazy"></a>');

  /* ---------- community + goodies ---------- */
  fill('comm', H.community, (c) => '<li><a href="' + esc(c.href) + '"><img src="' + icon(c.icon) + '" alt="" width="30" height="30"><span>' + esc(c.label) + '</span></a></li>');
  fill('goodies', H.goodies, (g) => '<li><a href="' + esc(g.href) + '"' + (g.soon ? ' data-soon="' + esc(g.label) + '"' : '') + '><img src="' + icon(g.icon) + '" alt="" width="56" height="56"><b>' + esc(g.label) + '</b><small>' + esc(g.sub) + '</small></a></li>');

  /* ---------- discussions (sample): Top / New / Chat ---------- */
  (function disc() {
    const ul = $('disc'), D = H.discussions;
    function draw(tab) {
      let html;
      if (tab === 'chat') html = D.chat.map((c) => '<li class="chat"><span><b>' + esc(c.u) + ':</b> ' + esc(c.m) + '</span></li>').join('');
      else html = D[tab].map((d) => '<li><img src="' + icon('bubble') + '" alt="" width="26" height="26"><a href="#community">' + esc(d.t) + '</a><span class="n">' + d.n + ' <img src="' + icon('comment') + '" alt=""></span></li>').join('');
      ul.innerHTML = html;
    }
    document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
      document.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-selected', x === b ? 'true' : 'false'));
      $('h-disc').textContent = ({ top: 'Top Discussions', 'new': 'Latest', chat: 'Live Chat' })[b.dataset.tab];
      draw(b.dataset.tab);
    }));
    draw('top');
  })();

  /* ---------- the pop-up: YouTube's own embedded player, or a large picture ---------- */
  const modal = $('modal'); let lastFocus = null;
  function openModal(kind, o) {
    lastFocus = document.activeElement;
    $('m-title').textContent = o.title;
    const v = modal.querySelector('.modal-v');
    $('m-sub').innerHTML = '';
    if (kind === 'video') {
      v.hidden = false; const old = modal.querySelector('.modal-img'); if (old) old.remove();
      v.innerHTML = '<iframe id="m-yt" src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(o.id) + '?autoplay=1&rel=0&playsinline=1" title="' + esc(o.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      $('m-sub').innerHTML = esc(o.sub || '') + (o.sub ? ' · ' : '') + '<a href="https://www.youtube.com/watch?v=' + encodeURIComponent(o.id) + '" target="_blank" rel="noopener">Watch on YouTube</a>';
      document.dispatchEvent(new CustomEvent('home:vod', { detail: { open: true } }));
    } else {
      v.hidden = true; v.innerHTML = '';
      let im = modal.querySelector('.modal-img'); if (!im) { im = document.createElement('img'); im.className = 'modal-img'; v.parentNode.insertBefore(im, $('m-sub')); }
      im.src = o.src; im.alt = o.title;
      $('m-sub').innerHTML = '<a href="' + esc(o.src) + '" download>Download</a>';
    }
    modal.hidden = false; $('m-close').focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true; modal.querySelector('.modal-v').innerHTML = '';
    document.dispatchEvent(new CustomEvent('home:vod', { detail: { open: false } }));
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('m-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  document.addEventListener('click', (e) => {
    const t = e.target.closest ? e.target : null; if (!t) return;
    const yt = t.closest('[data-yt]');
    if (yt) { e.preventDefault(); openModal('video', { id: yt.dataset.yt, title: yt.dataset.title, sub: yt.dataset.sub }); return; }
    const gi = t.closest('[data-img]');
    if (gi) { e.preventDefault(); const g = H.gallery[+gi.dataset.img]; openModal('image', { src: g.src, title: g.alt }); return; }
    const wl = t.closest('[data-wall]');
    if (wl) { e.preventDefault(); const g = H.walls[+wl.dataset.wall]; openModal('image', { src: g.src, title: g.alt }); return; }
    const so = t.closest('[data-soon]');
    if (so) { e.preventDefault(); toast(so.dataset.soon + ' is coming soon.' + (so.dataset.soon === 'Nostalgia Store' ? '' : ' Rewind Runner is playable now.')); }
  });

  window.HomeUI = { toast: toast, openVideo: (id, title, sub) => openModal('video', { id: id, title: title, sub: sub }) };
})();
