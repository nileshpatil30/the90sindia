/* ==========================================================================
   90s REWIND TV — player page
   Reads js/tv-config.js, asks TVEngine "what is on right now?" once a second,
   and drives two YouTube players:
     main  = the show (official YouTube video, played from the right second)
     ad    = your own commercial clips, in their OWN slots between shows
   Nothing is ever drawn over a YouTube video while it is on screen. The
   title cards, commercial cards and test card only appear when no video is
   showing.
   ========================================================================== */
(function () {
  'use strict';

  var CH = window.TV_CHANNELS || [];
  var E = window.TVEngine;
  var $ = function (id) { return document.getElementById(id); };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var DAYS3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!E || !CH.length) {
    $('slate-title').textContent = 'TV is off';
    $('slate-line').textContent = 'No channels are configured. Edit js/tv-config.js.';
    $('tune-in').classList.add('gone');
    return;
  }

  var el = {
    tabs: $('era-tabs'), screen: $('tv-screen'), main: $('layer-main'), ad: $('layer-ad'),
    slate: $('slate'), kicker: $('slate-kicker'), title: $('slate-title'), line: $('slate-line'),
    badge: $('slate-badge'), next: $('slate-next'), flash: $('flash'), osd: $('osd'),
    tune: $('tune-in'), tuneSub: $('tune-sub'), mute: $('mute'), fs: $('fs'),
    up: $('ch-up'), down: $('ch-down'), clock: $('tv-clock'),
    nowTitle: $('now-title'), nowMeta: $('now-meta'), nowFill: $('now-fill'), upList: $('up-list'),
    guideCh: $('guide-ch'), guideNote: $('guide-note'), guideDays: $('guide-days')
  };

  var S = {
    idx: 0, started: false, muted: false,
    key: null, loc: null, ended: false, failed: false, playedKey: null,
    apiRequested: false, ready: false, readyCount: 0, main: null, ad: null,
    tAt: 0, watchdogDone: false, osdTimer: null
  };

  /* ---------- small helpers ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tzOf(ch) { return (ch.tz != null ? ch.tz : 330); }

  function fmtHM(ms, tz) {
    var d = new Date(ms + tz * 60000);
    return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
  }
  function fmtDayHM(ms, tz) {
    var d = new Date(ms + tz * 60000);
    return DAYS3[d.getUTCDay()] + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
  }
  function fmtHMS(ms, tz) {
    var d = new Date(ms + tz * 60000);
    return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
  }
  function rel(ms, now) {
    var m = Math.max(0, Math.round((ms - now) / 60000));
    if (m < 60) return 'in ' + m + 'm';
    var h = Math.floor(m / 60);
    if (h < 24) return 'in ' + h + 'h ' + pad(m % 60) + 'm';
    return 'in ' + Math.floor(h / 24) + 'd ' + (h % 24) + 'h';
  }
  function cur() { return CH[S.idx]; }
  function tryStore(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  function tryLoad(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function hasEpisodes(ch) {
    return (ch.slots || []).some(function (s) { return (s.episodes && s.episodes.length) || s.playlist; });
  }

  /* ---------- playlists: paste ONE playlist ID, episodes fill themselves ----------
     A slot may say  playlist: 'PLxxxx'  instead of listing episodes. The page asks
     YouTube's own player for the playlist's video IDs (no API key needed) and
     uses them, in order, one per week. The result is cached for a day. */
  var PL_TTL = 24 * 3600 * 1000;
  var PL = { queue: [], busy: null, timer: null, probe: null, ready: false };

  function slotsWithPlaylist(id) {
    var out = [];
    CH.forEach(function (c) { (c.slots || []).forEach(function (s) { if (s.playlist === id && !(s.episodes && s.episodes.length)) out.push(s); }); });
    return out;
  }
  function applyPlaylist(id, ids) {
    if (!ids || !ids.length) return false;
    slotsWithPlaylist(id).forEach(function (s) { s.episodes = ids.map(function (v) { return { video: v }; }); });
    S.key = null;
    return true;
  }
  function cachedPlaylist(id) {
    try {
      var o = JSON.parse(tryLoad('tv.pl.' + id) || 'null');
      if (o && o.ids && o.ids.length && Date.now() - o.t < PL_TTL) return o.ids;
    } catch (e) { /* bad cache */ }
    return null;
  }
  function wantPlaylists(ch) {
    (ch.slots || []).forEach(function (s) {
      if (!s.playlist || (s.episodes && s.episodes.length)) return;
      var c = cachedPlaylist(s.playlist);
      if (c) { applyPlaylist(s.playlist, c); return; }
      if (PL.queue.indexOf(s.playlist) < 0 && PL.busy !== s.playlist) PL.queue.push(s.playlist);
    });
    plNext();
  }
  function plNext() {
    if (!PL.ready || PL.busy || !PL.queue.length) return;
    PL.busy = PL.queue.shift();
    try { PL.probe.cuePlaylist({ listType: 'playlist', list: PL.busy }); } catch (e) { plDone(null); return; }
    PL.timer = setTimeout(function () { plDone(null); }, 10000);   // private/missing list: give up
  }
  function plDone(ids) {
    clearTimeout(PL.timer);
    var id = PL.busy; PL.busy = null;
    if (id && ids && applyPlaylist(id, ids)) tryStore('tv.pl.' + id, JSON.stringify({ t: Date.now(), ids: ids }));
    else if (id && window.console) console.warn('TV: could not read playlist ' + id);
    plNext(); tick();
  }
  function onProbeState(st) {
    if (st === 5 && PL.busy) {
      var ids = null; try { ids = PL.probe.getPlaylist(); } catch (e) { /* ignore */ }
      plDone(ids);
    }
  }

  function epLabel(entry, idx) {
    if (idx == null || idx < 0 || !(entry.ref.episodes && entry.ref.episodes.length)) return '';
    var nums = entry.ref.epNums;
    if (nums === false) return '';
    return 'Episode ' + (nums && nums[idx] != null ? nums[idx] : idx + 1);
  }

  /* ---------- slate (title card / commercial card / test card) ---------- */
  function showSlate(d) {
    el.slate.className = 'layer layer-slate' + (d.cls ? ' ' + d.cls : '');
    el.kicker.textContent = d.kicker || '';
    el.title.textContent = d.title || '';
    el.line.textContent = d.line || '';
    el.next.textContent = d.next || '';
    el.badge.textContent = '';
    if (d.badge) {
      var b = document.createElement('span');
      b.className = 'badge b-' + d.badge;
      b.textContent = d.badge.toUpperCase();
      el.badge.appendChild(b);
    }
  }
  function hideSlate() { el.slate.classList.add('is-off'); }

  function nextLine(loc, now) {
    if (!loc.next) return '';
    var tz = tzOf(cur());
    return 'NEXT: ' + loc.next.entry.ref.title + '  ·  ' + fmtDayHM(loc.next.startMs, tz) + ' IST  (' + rel(loc.next.startMs, now) + ')';
  }

  // What the slate should say for the current moment.
  function describe(loc, now, mode) {
    var ch = cur();
    var kicker = 'CH ' + ch.num + '  ·  ' + ch.name + ' ' + ch.era;
    var next = nextLine(loc, now);

    if (loc.state === 'closedown') {
      return {
        cls: 'is-card', kicker: kicker, title: loc.label || 'Transmission has ended',
        line: 'We resume at ' + fmtDayHM(loc.endMs, tzOf(ch)) + ' IST', next: next
      };
    }
    if (loc.state === 'break' || mode === 'filler') {
      var secs = Math.max(0, Math.round((loc.endMs - now) / 1000));
      var ad = loc.ad;
      return {
        cls: 'is-break', kicker: 'COMMERCIAL BREAK',
        title: ad && ad.sponsor ? ad.sponsor : 'We will be right back',
        line: mode === 'filler' ? 'We will be right back' : (ad && ad.title ? ad.title + '  ·  ' : '') + 'back in ' + secs + 's',
        next: next
      };
    }
    // show
    var ref = loc.entry.ref;
    if (mode === 'failed') {
      return { kicker: kicker, title: ref.title, line: 'This episode cannot play here right now. We will be right back.', badge: ref.confidence, next: next };
    }
    if (!loc.episode || !loc.episode.video) {
      return { kicker: 'ON AIR  ·  ' + kicker, title: ref.title, line: 'Tonight’s episode is coming soon.', badge: ref.confidence, next: next };
    }
    return { kicker: 'NOW SHOWING  ·  ' + kicker, title: ref.title, line: (epLabel(loc.entry, loc.episodeIndex) || 'Tuning in') + '  ·  tuning in…', badge: ref.confidence, next: next };
  }

  /* ---------- OSD + flash ---------- */
  function osd(text) {
    el.osd.textContent = text;
    el.osd.classList.add('show');
    clearTimeout(S.osdTimer);
    S.osdTimer = setTimeout(function () { el.osd.classList.remove('show'); }, 2600);
  }
  function flash() {
    el.flash.classList.remove('go');
    void el.flash.offsetWidth;
    el.flash.classList.add('go');
  }

  /* ---------- YouTube ---------- */
  function ensureAPI() {
    if (S.apiRequested) return;
    S.apiRequested = true;
    if (window.YT && window.YT.Player) { initPlayers(); return; }
    window.onYouTubeIframeAPIReady = initPlayers;
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = function () {
      showSlate({ cls: 'is-card', kicker: 'NO SIGNAL', title: 'Cannot reach YouTube', line: 'Check your connection and reload.' });
    };
    document.head.appendChild(s);
  }

  function makePlayer(domId, which) {
    var vars = { controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3 };
    if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    return new YT.Player(domId, {
      width: '100%', height: '100%', playerVars: vars,
      events: {
        onReady: function () { onPlayerReady(); },
        onStateChange: function (e) { onState(which, e.data); },
        onError: function () { onPlayerError(which); },
        onAutoplayBlocked: function () { onBlocked(which); }
      }
    });
  }

  function initPlayers() {
    S.main = makePlayer('yt-main', 'main');
    S.ad = makePlayer('yt-ad', 'ad');
    PL.probe = new YT.Player('yt-probe', {
      width: '200', height: '200',
      events: {
        onReady: function () { PL.ready = true; wantPlaylists(cur()); },
        onStateChange: function (e) { onProbeState(e.data); }
      }
    });
  }

  function onPlayerReady() {
    S.readyCount++;
    if (S.readyCount < 2) return;
    S.ready = true;
    applyMute();
    S.key = null;           // force a fresh transition
    tick();
  }

  function onState(which, st) {
    var loc = S.loc;
    if (!loc) return;
    if (st === 1) {                       // playing
      S.playedKey = S.key;
      el.osd.classList.remove('show');
    } else if (st === 0) {                // ended: fill the rest of the slot
      var live = (which === 'main' && loc.state === 'show') || (which === 'ad' && loc.state === 'break');
      if (!live) return;
      S.ended = true;
      el.main.classList.remove('is-on'); el.ad.classList.remove('is-on');
      showSlate(describe(loc, Date.now(), 'filler'));
    }
  }

  function onPlayerError(which) {
    var loc = S.loc;
    if (!loc) return;
    S.failed = true;
    el.main.classList.remove('is-on'); el.ad.classList.remove('is-on');
    showSlate(describe(loc, Date.now(), loc.state === 'show' ? 'failed' : 'filler'));
  }

  function onBlocked() {            // browser refused sound-on autoplay: retry muted
    S.muted = true; applyMute(); updateMuteBtn();
    try { (S.loc && S.loc.state === 'break' ? S.ad : S.main).playVideo(); } catch (e) { /* not ready */ }
    osd('TAP SOUND ON');
  }

  function applyMute() {
    [S.main, S.ad].forEach(function (p) {
      if (!p || !p.mute) return;
      try { S.muted ? p.mute() : p.unMute(); } catch (e) { /* not ready */ }
    });
  }

  function stopPlayers() {
    [S.main, S.ad].forEach(function (p) { try { p && p.stopVideo && p.stopVideo(); } catch (e) { /* ignore */ } });
    el.main.classList.remove('is-on'); el.ad.classList.remove('is-on');
  }

  function playOn(which, videoId, offset) {
    var p = S[which], other = which === 'main' ? S.ad : S.main;
    try { other && other.stopVideo && other.stopVideo(); } catch (e) { /* ignore */ }
    el[which === 'main' ? 'ad' : 'main'].classList.remove('is-on');
    el[which].classList.add('is-on');
    hideSlate();                      // the video is on screen: nothing goes over it
    applyMute();
    p.loadVideoById({ videoId: videoId, startSeconds: Math.max(0, Math.floor(offset)) });
  }

  /* ---------- the clock tick ---------- */
  function transition(loc, now) {
    S.key = loc.key; S.ended = false; S.failed = false; S.playedKey = null;
    S.tAt = now; S.watchdogDone = false;

    if (!S.started) { showSlate(describe(loc, now)); return; }
    if (!S.ready) { showSlate(describe(loc, now)); return; }

    if (loc.state === 'show' && loc.episode && loc.episode.video) {
      playOn('main', loc.episode.video, loc.offset);
    } else if (loc.state === 'break' && loc.ad && loc.ad.video) {
      playOn('ad', loc.ad.video, loc.offset);
    } else {
      stopPlayers();
      showSlate(describe(loc, now));
    }
  }

  function maintain(loc, now) {
    if (!S.started || !S.ready) { showSlate(describe(loc, now)); return; }

    var videoSlot = (loc.state === 'show' && loc.episode && loc.episode.video) ||
                    (loc.state === 'break' && loc.ad && loc.ad.video);

    if (!videoSlot || S.ended || S.failed) {
      // keep the slate countdown fresh
      var mode = S.failed ? (loc.state === 'show' ? 'failed' : 'filler') : (S.ended ? 'filler' : undefined);
      showSlate(describe(loc, now, mode));
      return;
    }

    var p = loc.state === 'show' ? S.main : S.ad;
    var st; try { st = p.getPlayerState(); } catch (e) { return; }

    if (st === 1) {                              // playing: correct drift against the clock
      var t = 0; try { t = p.getCurrentTime(); } catch (e2) { /* ignore */ }
      if (Math.abs(t - loc.offset) > 5) { try { p.seekTo(loc.offset, true); } catch (e3) { /* ignore */ } }
    } else if (st === 2) {                       // paused by the browser: resume
      try { p.playVideo(); } catch (e4) { /* ignore */ }
    } else if (!S.watchdogDone && now - S.tAt > 6000 && S.playedKey !== S.key) {
      S.watchdogDone = true;                     // never started: try muted
      S.muted = true; applyMute(); updateMuteBtn();
      try { p.playVideo(); } catch (e5) { /* ignore */ }
    }
  }

  function tick() {
    var ch = cur(), now = Date.now();
    var loc = E.locate(ch, now);
    S.loc = loc;
    var tz = tzOf(ch);

    el.clock.textContent = 'IST ' + fmtHMS(now, tz) +
      (new Date().getTimezoneOffset() !== -tz ? '  ·  your time ' + new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

    if (loc.key !== S.key) { transition(loc, now); markGuide(loc); } else { maintain(loc, now); }
    renderNowNext(loc, now);

    if (!S.started) {
      el.tuneSub.textContent = 'CH ' + ch.num + '  ·  ' + ch.name + ' ' + ch.era +
        (loc.state === 'show' ? '  ·  ' + loc.entry.ref.title + ' is on' : '');
    }
  }

  /* ---------- on-now / up-next ---------- */
  function renderNowNext(loc, now) {
    var tz = tzOf(cur());
    var total = Math.max(1, loc.endMs - loc.startMs);
    var done = Math.min(1, Math.max(0, (now - loc.startMs) / total));
    if (loc.state === 'show') {
      el.nowTitle.textContent = loc.entry.ref.title;
      el.nowMeta.textContent = (epLabel(loc.entry, loc.episodeIndex) ? epLabel(loc.entry, loc.episodeIndex) + '  ·  ' : '') + fmtHM(loc.startMs, tz) + ' – ' + fmtHM(loc.endMs, tz) + ' IST';
    } else if (loc.state === 'closedown') {
      el.nowTitle.textContent = 'Off air';
      el.nowMeta.textContent = loc.label || 'Transmission has ended';
    } else {
      el.nowTitle.textContent = 'Commercial break';
      el.nowMeta.textContent = 'Back with ' + loc.next.entry.ref.title;
    }
    el.nowFill.style.width = (loc.state === 'show' ? done * 100 : 0) + '%';

    var ups = E.upcoming(cur(), now, 4);
    el.upList.textContent = '';
    ups.forEach(function (u) {
      var li = document.createElement('li');
      var w = document.createElement('span'); w.className = 'u-when';
      w.textContent = fmtDayHM(u.startMs, tz);
      var t = document.createElement('span'); t.className = 'u-title';
      t.textContent = u.entry.ref.title + (epLabel(u.entry, u.episodeIndex) ? ' \u2013 ' + epLabel(u.entry, u.episodeIndex) : '') + '  (' + rel(u.startMs, now) + ')';
      li.appendChild(w); li.appendChild(t); el.upList.appendChild(li);
    });
  }

  /* ---------- weekly guide ---------- */
  function renderGuide() {
    var ch = cur();
    var model = E.normalize(ch);
    el.guideCh.textContent = ch.name + ' ' + ch.era;
    el.guideNote.textContent = (ch.tag ? ch.tag + '. ' : '') + 'Fixed weekly timetable, India time (IST). One new episode every week.';
    el.guideDays.textContent = '';
    var CAP = 8;
    for (var d = 0; d < 7; d++) {
      var box = document.createElement('div'); box.className = 'g-day'; box.dataset.day = d;
      var h = document.createElement('h3'); h.textContent = DAYS[d]; box.appendChild(h);
      var rows = model.entries.filter(function (x) { return x.day === d; });
      if (!rows.length) {
        var em = document.createElement('div'); em.className = 'g-empty'; em.textContent = 'Nothing scheduled';
        box.appendChild(em);
      }
      rows.slice(0, CAP).forEach(function (x) {
        var r = document.createElement('div'); r.className = 'g-row'; r.dataset.start = x.start;
        var tm = document.createElement('span'); tm.className = 'g-time'; tm.textContent = x.ref.time;
        var ti = document.createElement('span'); ti.className = 'g-title'; ti.textContent = x.ref.title;
        var sub = document.createElement('span'); sub.className = 'g-sub';
        sub.appendChild(document.createTextNode(x.ref.duration + ' min  '));
        if (x.ref.confidence) {
          var b = document.createElement('span'); b.className = 'badge b-' + x.ref.confidence;
          b.textContent = x.ref.confidence.toUpperCase(); sub.appendChild(b);
        }
        if (x.ref.source) r.title = x.ref.source;
        ti.appendChild(sub);
        r.appendChild(tm); r.appendChild(ti); box.appendChild(r);
      });
      if (rows.length > CAP) {
        var more = document.createElement('div'); more.className = 'g-empty';
        more.textContent = '+ ' + (rows.length - CAP) + ' more slots through the day';
        box.appendChild(more);
      }
      el.guideDays.appendChild(box);
    }
  }

  function markGuide(loc) {
    var c = E._clock(cur(), Date.now());
    var today = Math.floor(c.weekSec / 86400);
    Array.prototype.forEach.call(el.guideDays.children, function (box) {
      box.classList.toggle('is-today', +box.dataset.day === today);
      Array.prototype.forEach.call(box.querySelectorAll('.g-row'), function (r) {
        r.classList.toggle('is-now', loc.state === 'show' && +r.dataset.start === loc.entry.start);
      });
    });
  }

  /* ---------- channels ---------- */
  function renderTabs() {
    el.tabs.textContent = '';
    CH.forEach(function (ch, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'era-tab' + (i === S.idx ? ' is-on' : ''); b.dataset.idx = i;
      var n = document.createElement('span'); n.className = 'e-num'; n.textContent = 'CH ' + ch.num;
      var e = document.createElement('span'); e.className = 'e-era'; e.textContent = ch.era;
      var m = document.createElement('span'); m.className = 'e-name'; m.textContent = ch.name;
      b.appendChild(n); b.appendChild(e); b.appendChild(m);
      b.addEventListener('click', function () { selectChannel(i); });
      el.tabs.appendChild(b);
    });
  }

  function selectChannel(i) {
    i = ((i % CH.length) + CH.length) % CH.length;
    var changed = i !== S.idx || S.key === null;
    S.idx = i; S.key = null; S.ended = false; S.failed = false;
    if (S.ready) stopPlayers();
    Array.prototype.forEach.call(el.tabs.children, function (b, k) { b.classList.toggle('is-on', k === i); });
    var ch = cur();
    tryStore('tv.ch', ch.num);
    try { history.replaceState(null, '', '#ch=' + ch.num); } catch (e) { /* file:// etc. */ }
    renderGuide();
    wantPlaylists(ch);
    showSlate({ kicker: 'TUNING…', title: 'CH ' + ch.num, line: ch.name + ' ' + ch.era });
    if (changed) { flash(); osd('CH ' + ch.num + '  ' + ch.name); }
    tick();
  }

  function pickStart() {
    var m = /ch=(\w+)/.exec(location.hash || '');
    var want = (m && m[1]) || tryLoad('tv.ch');
    var byNum = CH.findIndex(function (c) { return c.num === want; });
    if (byNum >= 0) return byNum;
    var withEps = CH.findIndex(hasEpisodes);
    return withEps >= 0 ? withEps : 0;
  }

  /* ---------- controls ---------- */
  function updateMuteBtn() {
    el.mute.textContent = S.muted ? 'MUTED – TAP FOR SOUND' : 'SOUND ON';
    el.mute.setAttribute('aria-pressed', S.muted ? 'true' : 'false');
  }

  function toggleFullscreen() {
    var t = el.screen;
    var inFs = document.fullscreenElement || document.webkitFullscreenElement;
    if (inFs) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
    else if (t.requestFullscreen) t.requestFullscreen();
    else if (t.webkitRequestFullscreen) t.webkitRequestFullscreen();
  }

  el.tune.addEventListener('click', function () {
    S.started = true;
    el.tune.classList.add('gone');
    ensureAPI();
    S.key = null;
    tick();
  });
  el.up.addEventListener('click', function () { selectChannel(S.idx + 1); });
  el.down.addEventListener('click', function () { selectChannel(S.idx - 1); });
  el.mute.addEventListener('click', function () { S.muted = !S.muted; applyMute(); updateMuteBtn(); });
  el.fs.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', function (ev) {
    var tag = (ev.target && ev.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.key === 'ArrowUp') { ev.preventDefault(); selectChannel(S.idx + 1); }
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); selectChannel(S.idx - 1); }
    else if (ev.key === 'm' || ev.key === 'M') { S.muted = !S.muted; applyMute(); updateMuteBtn(); }
    else if (ev.key === 'f' || ev.key === 'F') { toggleFullscreen(); }
  });

  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });

  /* ---------- go ---------- */
  S.idx = pickStart();
  renderTabs();
  updateMuteBtn();
  selectChannel(S.idx);
  setInterval(tick, 1000);
})();
