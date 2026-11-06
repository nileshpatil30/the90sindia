/* ==========================================================================
   90s REWIND TV — ALL SHOWS (watch any show on demand)
   Lists every show in js/tv-library.js (+ the hand-checked episode sets and the
   ad-break recordings), built into window.TV_SHOWS by js/tv-config.js.
   Click a show: it opens on its OWN player below the list. Live TV pauses
   while it is open and comes back when you close it.
   Nothing here draws over a YouTube player.
   ========================================================================== */
(function () {
  'use strict';

  var SHOWS = window.TV_SHOWS || [];
  var NETS = window.TV_NETS || [];
  var $ = function (id) { return document.getElementById(id); };
  if (!SHOWS.length || !$('show-grid')) return;

  var el = {
    section: $('all-shows'), count: $('shows-count'), q: $('shows-q'), nets: $('shows-net'), kinds: $('shows-kind'), grid: $('show-grid'),
    vod: $('vod'), title: $('vod-title'), meta: $('vod-meta'), note: $('vod-note'), live: $('vod-live'), eps: $('vod-eps'),
    dm: $('vod-dm'), close: $('vod-close'), prev: $('vod-prev'), next: $('vod-next'), ep: $('vod-ep'), yt: $('vod-yt')
  };

  var NET_NAME = {}; NETS.forEach(function (n) { NET_NAME[n.id] = n.name; });
  var NET_COLOR = {}; NETS.forEach(function (n) { NET_COLOR[n.id] = n.color; });
  var KIND_GROUPS = [
    ['comedy', 'Comedy', ['comedy']], ['drama', 'Drama', ['drama']], ['thriller', 'Thriller and horror', ['thriller', 'horror']],
    ['kids', 'Kids and cartoons', ['kids']], ['fantasy', 'Fantasy and sci-fi', ['fantasy']], ['history', 'Epics and history', ['history', 'religious']],
    ['music', 'Music and quizzes', ['music']], ['sports', 'Sports', ['sports']], ['ads', 'Ads and idents', ['ads']], ['other', 'Other', ['other']]
  ];
  var GROUP_OF = {}; KIND_GROUPS.forEach(function (g) { g[2].forEach(function (k) { GROUP_OF[k] = g[0]; }); });
  function groupOf(s) { return GROUP_OF[s.kind] || 'other'; }

  var F = { net: 'all', kind: 'all', q: '' };
  var V = { show: null, idx: 0, player: null, ready: false, wantPlay: false, plIds: null, fails: 0 };

  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function mk(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function netOf(s) { return s.nets.length ? s.nets[0] : ''; }
  function netsText(s) {
    if (!s.nets.length) return 'Not on a channel yet';
    return s.nets.map(function (n) { return NET_NAME[n] || n; }).join(' · ');
  }
  function sizeText(s) {
    if (s.playlist) return 'playlist';
    var n = s.episodes.length;
    if (s.kind === 'ads') return plural(n, 'recording');
    return n > 6 ? plural(n, 'episode') : plural(n, 'video');
  }

  /* ---------- filters + grid ---------- */
  function matches(s) {
    if (F.net !== 'all') { if (F.net === 'none' ? s.nets.length : s.nets.indexOf(F.net) < 0) return false; }
    if (F.kind !== 'all' && groupOf(s) !== F.kind) return false;
    if (F.q) {
      var hay = (s.title + ' ' + netsText(s) + ' ' + s.years + ' ' + s.kind).toLowerCase();
      var parts = F.q.split(/\s+/);
      for (var i = 0; i < parts.length; i++) { if (parts[i] && hay.indexOf(parts[i]) < 0) return false; }
    }
    return true;
  }

  function chip(label, count, on, fn, color) {
    var b = mk('button', 'chip' + (on ? ' is-on' : ''), label + (count != null ? ' ' + count : ''));
    b.type = 'button';
    if (color) b.style.setProperty('--c', color);
    b.addEventListener('click', fn);
    return b;
  }

  function renderFilters() {
    clear(el.nets); clear(el.kinds);
    var byNet = {}, none = 0, byKind = {};
    SHOWS.forEach(function (s) {
      if (!s.nets.length) none++;
      s.nets.forEach(function (n) { byNet[n] = (byNet[n] || 0) + 1; });
      byKind[groupOf(s)] = (byKind[groupOf(s)] || 0) + 1;
    });
    el.nets.appendChild(chip('All channels', SHOWS.length, F.net === 'all', function () { F.net = 'all'; render(); }));
    NETS.forEach(function (n) {
      if (!byNet[n.id]) return;
      el.nets.appendChild(chip(n.name, byNet[n.id], F.net === n.id, function () { F.net = n.id; render(); }, n.color));
    });
    if (none) el.nets.appendChild(chip('Not on a channel', none, F.net === 'none', function () { F.net = 'none'; render(); }));
    el.kinds.appendChild(chip('Every kind', null, F.kind === 'all', function () { F.kind = 'all'; render(); }));
    KIND_GROUPS.forEach(function (g) {
      if (!byKind[g[0]]) return;
      el.kinds.appendChild(chip(g[1], byKind[g[0]], F.kind === g[0], function () { F.kind = g[0]; render(); }));
    });
  }

  function renderGrid() {
    clear(el.grid);
    var shown = SHOWS.filter(matches);
    el.count.textContent = shown.length === SHOWS.length ? plural(SHOWS.length, 'show') : shown.length + ' of ' + SHOWS.length;
    if (!shown.length) { el.grid.appendChild(mk('p', 'show-none', 'No show matches. Try fewer words, or pick "All channels".')); return; }
    shown.forEach(function (s) {
      var c = mk('button', 'show-card' + (V.show === s ? ' is-open' : ''));
      c.type = 'button';
      c.style.setProperty('--c', NET_COLOR[netOf(s)] || 'var(--purple)');
      c.appendChild(mk('span', 'sc-title', s.title));
      c.appendChild(mk('span', 'sc-meta', netsText(s) + (s.years ? ' · ' + s.years : '')));
      var row = mk('span', 'sc-row');
      row.appendChild(mk('span', 'sc-size', sizeText(s)));
      row.appendChild(mk('span', 'sc-src ' + (s.official ? 'is-official' : 'is-community'), s.official ? 'OFFICIAL' : 'COMMUNITY'));
      c.appendChild(row);
      c.addEventListener('click', function () { openShow(s, 0); });
      el.grid.appendChild(c);
    });
  }

  function render() { renderFilters(); renderGrid(); }

  /* ---------- YouTube ---------- */
  function whenYT(cb) {
    if (window.YT && window.YT.Player) { cb(); return; }
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (typeof prev === 'function') { try { prev(); } catch (e) { /* ignore */ } } cb(); };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      var s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = function () { say('Cannot reach YouTube. Check your connection and try again.'); };
      document.head.appendChild(s);
    }
  }

  function ensurePlayer(cb) {
    if (V.player) { cb(); return; }
    whenYT(function () {
      if (V.player) { cb(); return; }
      var vars = { rel: 0, playsinline: 1, modestbranding: 1 };
      if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
      V.player = new window.YT.Player('yt-vod', {
        width: '100%', height: '100%', playerVars: vars,
        events: {
          onReady: function () { V.ready = true; cb(); },
          onStateChange: function (e) { onState(e.data); },
          onError: function () { onError(); }
        }
      });
    });
  }

  function say(text) { el.note.textContent = text || ''; el.note.hidden = !text; }

  /* Dailymotion shows (Mahabharat): a plain Dailymotion player, no events, so NEXT is pressed by hand. */
  function isDM() { return !!(V.show && V.show.host === 'dm'); }
  function showDMFrame(id) {
    var yt = $('yt-vod'); if (yt) yt.style.display = 'none';
    el.dm.hidden = false;
    while (el.dm.firstChild) el.dm.removeChild(el.dm.firstChild);
    var f = document.createElement('iframe');
    f.allow = 'autoplay; fullscreen; picture-in-picture'; f.setAttribute('allowfullscreen', ''); f.title = V.show.title;
    f.src = 'https://geo.dailymotion.com/player.html?video=' + encodeURIComponent(id) + '&autoplay=true&queue-enable=false&sharing-enable=false&ui-logo=false';
    el.dm.appendChild(f);
  }
  function hideDMFrame() {
    while (el.dm.firstChild) el.dm.removeChild(el.dm.firstChild);
    el.dm.hidden = true;
    var yt = $('yt-vod'); if (yt) yt.style.display = '';
  }

  function curId() { var s = V.show; return s && s.episodes.length ? s.episodes[V.idx] : null; }

  function ytLink() {
    var s = V.show;
    if (!s) return '#';
    if (s.playlist) return 'https://www.youtube.com/playlist?list=' + s.playlist;
    var id = curId();
    if (isDM()) return id ? 'https://www.dailymotion.com/video/' + id : '#';
    return id ? 'https://www.youtube.com/watch?v=' + id : '#';
  }

  function epLabel(s, i) {
    if (s.labels && s.labels[i]) return s.labels[i];
    if (s.nums && s.nums[i] != null) return 'Episode ' + s.nums[i];
    return s.episodes.length > 1 ? 'Part ' + (i + 1) : s.title;
  }
  function epShort(s, i) { return s.nums && s.nums[i] != null ? String(s.nums[i]) : String(i + 1); }

  function play() {
    var s = V.show;
    if (!s) return;
    if (isDM()) {
      try { V.player && V.player.stopVideo && V.player.stopVideo(); } catch (e) { /* ignore */ }
      showDMFrame(s.episodes[V.idx]); paintEpisode(); return;
    }
    hideDMFrame();
    ensurePlayer(function () {
      if (!V.show) return;
      say('');
      try {
        if (s.playlist) { V.plIds = null; V.player.loadPlaylist({ listType: 'playlist', list: s.playlist, index: 0 }); }
        else V.player.loadVideoById({ videoId: s.episodes[V.idx] });
      } catch (e) { say('The player is not ready yet. Try again in a moment.'); }
    });
    paintEpisode();
  }

  function paintEpisode() {
    var s = V.show; if (!s) return;
    el.yt.href = ytLink(); el.yt.textContent = isDM() ? 'Open on Dailymotion' : 'Open on YouTube';
    if (s.playlist) {
      el.ep.textContent = V.plIds ? 'Video ' + (V.idx + 1) + ' of ' + V.plIds.length : 'Playlist';
      el.prev.disabled = el.next.disabled = false;
    } else {
      el.ep.textContent = epLabel(s, V.idx) + (s.episodes.length > 1 ? '  ·  ' + (V.idx + 1) + ' of ' + s.episodes.length : '');
      el.prev.disabled = V.idx <= 0; el.next.disabled = V.idx >= s.episodes.length - 1;
    }
    var btns = el.eps.children;
    for (var i = 0; i < btns.length; i++) { btns[i].classList.toggle('is-on', +btns[i].dataset.i === V.idx); }
    var on = el.eps.querySelector('.is-on');
    if (on && on.scrollIntoView && el.eps.scrollHeight > el.eps.clientHeight) {
      var top = on.offsetTop - el.eps.offsetTop - 6; if (top < el.eps.scrollTop || top > el.eps.scrollTop + el.eps.clientHeight - 40) el.eps.scrollTop = Math.max(0, top);
    }
  }

  function renderEpisodes(n, labelFn) {
    clear(el.eps);
    if (n < 2) { el.eps.hidden = true; return; }
    el.eps.hidden = false;
    for (var i = 0; i < n; i++) {
      var b = mk('button', 'vod-ep-btn', labelFn(i));
      b.type = 'button'; b.dataset.i = i;
      b.title = V.show.playlist ? 'Video ' + (i + 1) : epLabel(V.show, i);
      b.addEventListener('click', onEpisodeClick);
      el.eps.appendChild(b);
    }
  }
  function onEpisodeClick(ev) { go(+ev.currentTarget.dataset.i); }

  function go(i) {
    var s = V.show; if (!s) return;
    if (s.playlist) {
      V.idx = i; paintEpisode();
      try { V.player.playVideoAt(i); } catch (e) { /* not ready */ }
      return;
    }
    if (i < 0 || i >= s.episodes.length) return;
    V.idx = i; V.fails = 0; say('');
    if (isDM()) { showDMFrame(s.episodes[i]); paintEpisode(); return; }
    ensurePlayer(function () { try { V.player.loadVideoById({ videoId: s.episodes[i] }); } catch (e) { /* ignore */ } });
    paintEpisode();
  }

  function onState(st) {
    var s = V.show; if (!s) return;
    if (st === 1 || st === 5) {
      V.fails = 0;
      if (s.playlist) {
        try {
          var ids = V.player.getPlaylist();
          if (ids && ids.length && (!V.plIds || V.plIds.length !== ids.length)) { V.plIds = ids; renderEpisodes(ids.length, function (i) { return String(i + 1); }); }
          var at = V.player.getPlaylistIndex();
          if (typeof at === 'number' && at >= 0) V.idx = at;
        } catch (e) { /* ignore */ }
        paintEpisode();
      }
    } else if (st === 0 && !s.playlist && V.idx < s.episodes.length - 1) {
      go(V.idx + 1);                                     // autoplay the next episode
    }
  }

  function onError() {
    var s = V.show; if (!s) return;
    if (s.playlist) { say('That video cannot be played here. Use NEXT, or open it on YouTube.'); return; }
    V.fails++;
    if (V.fails < s.episodes.length && V.idx < s.episodes.length - 1) {
      say(epLabel(s, V.idx) + ' cannot be played here (the uploader may have removed it). Skipping to the next one.');
      var at = V.idx;
      setTimeout(function () { if (V.show === s && V.idx === at) { var keep = V.fails; go(at + 1); V.fails = keep; say(epLabel(s, at) + ' could not be played here, so this is the next one.'); } }, 1400);
    } else {
      say(epLabel(s, V.idx) + ' cannot be played here. Try "Open on YouTube".');
    }
  }

  /* ---------- open / close ---------- */
  function tuneButtons(s) {
    clear(el.live);
    var seen = {}, any = false;
    s.runs.forEach(function (r) {
      if (seen[r.net] || r.fixture) return;
      seen[r.net] = 1;
      var year = r.from;
      var b = mk('button', 'vod-live-btn', 'WATCH LIVE: ' + (NET_NAME[r.net] || r.net) + ' ' + year + (r.day ? '  ·  ' + dayText(r) : ''));
      b.type = 'button';
      b.style.setProperty('--c', NET_COLOR[r.net] || 'var(--cyan)');
      b.addEventListener('click', function () {
        closeShow();
        if (window.TVLive && window.TVLive.tune) window.TVLive.tune(r.net + '-' + year);
        window.scrollTo(0, 0);
      });
      el.live.appendChild(b); any = true;
    });
    el.live.hidden = !any;
  }
  function dayText(r) {
    var d = Array.isArray(r.day) ? r.day.join('/') : (r.day === 'daily' ? 'daily' : r.day);
    return d + ' ' + (r.conf === 'approx' ? '~' : '') + r.time;
  }

  function openShow(s, idx) {
    V.show = s; V.idx = idx || 0; V.plIds = null; V.fails = 0;
    el.vod.hidden = false;
    el.title.textContent = s.title;
    el.meta.textContent = netsText(s) + (s.years ? ' · ' + s.years : '') + ' · ' + sizeText(s) + ' · ' + (s.official ? 'official upload' : 'community upload');
    el.note.hidden = true;
    var extra = s.note || '';
    el.meta.title = extra;
    $('vod-about').textContent = extra; $('vod-about').hidden = !extra;
    tuneButtons(s);
    renderEpisodes(s.playlist ? 0 : s.episodes.length, function (i) { return epShort(s, i); });
    document.dispatchEvent(new CustomEvent('tv:vod', { detail: { open: true } }));
    play();
    renderGrid();
    if (el.vod.scrollIntoView) el.vod.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeShow() {
    if (!V.show) return;
    try { V.player && V.player.stopVideo && V.player.stopVideo(); } catch (e) { /* ignore */ }
    hideDMFrame();
    V.show = null;
    el.vod.hidden = true;
    document.dispatchEvent(new CustomEvent('tv:vod', { detail: { open: false } }));
    renderGrid();
  }

  el.close.addEventListener('click', function () { closeShow(); window.scrollTo(0, 0); });
  el.prev.addEventListener('click', function () {
    if (!V.show) return;
    if (V.show.playlist) { try { V.player.previousVideo(); } catch (e) { /* ignore */ } } else go(V.idx - 1);
  });
  el.next.addEventListener('click', function () {
    if (!V.show) return;
    if (V.show.playlist) { try { V.player.nextVideo(); } catch (e) { /* ignore */ } } else go(V.idx + 1);
  });
  el.q.addEventListener('input', function () { F.q = el.q.value.trim().toLowerCase(); renderGrid(); });

  window.TVShows = {
    open: function (title) { for (var i = 0; i < SHOWS.length; i++) { if (SHOWS[i].title === title) { openShow(SHOWS[i], 0); return true; } } return false; },
    close: closeShow
  };

  // Links into this list, e.g. from the homepage:  tv.html#show=Malgudi Days   #kind=ads   #q=cricket
  function param(h, k) { var m = new RegExp('(?:^|&)' + k + '=([^&]*)').exec(h); if (!m) return null; try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; } }
  function applyHash() {
    var h = (location.hash || '').replace(/^#/, ''), v;
    if ((v = param(h, 'show')) != null) {
      var key = v.toLowerCase(), hit = null;
      for (var i = 0; i < SHOWS.length; i++) { if (SHOWS[i].title.toLowerCase() === key || SHOWS[i].id === key) { hit = SHOWS[i]; break; } }
      if (hit) { openShow(hit, 0); return; }
      F.q = key; el.q.value = v; renderGrid();
    } else if ((v = param(h, 'kind')) != null) {
      if (KIND_GROUPS.some(function (g) { return g[0] === v; })) { F.kind = v; render(); } else return;
    } else if ((v = param(h, 'q')) != null) {
      F.q = v.trim().toLowerCase(); el.q.value = v; renderGrid();
    } else return;
    if (el.section && el.section.scrollIntoView) el.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render();
  applyHash();
  window.addEventListener('hashchange', applyHash);
})();
