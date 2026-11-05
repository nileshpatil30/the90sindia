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

  var NETS = window.TV_NETS || [];
  var YEARS = window.TV_YEARS || { from: 1984, to: 2007 };
  var CH = (window.TV_CHANNELS || []).concat(window.TV_DEMO ? [window.TV_DEMO] : []);
  var LEGACY = window.TV_LEGACY || {};
  var E = window.TVEngine;
  var $ = function (id) { return document.getElementById(id); };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var DAYS3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!E || !CH.length) {
    $('slate-title').textContent = 'TV is off';
    $('slate-line').textContent = 'No channels are configured. Edit js/tv-schedule.js.';
    $('tune-in').classList.add('gone');
    return;
  }

  var el = {
    nets: $('net-grid'), years: $('year-pills'), chanSub: $('chan-sub'), yearSub: $('year-sub'),
    onairH: $('onair-h'), onair: $('onair-chips'), yrUp: $('yr-up'), yrDown: $('yr-down'),
    screen: $('tv-screen'), main: $('layer-main'), ad: $('layer-ad'),
    slate: $('slate'), kicker: $('slate-kicker'), title: $('slate-title'), line: $('slate-line'),
    badge: $('slate-badge'), next: $('slate-next'), flash: $('flash'), osd: $('osd'),
    tune: $('tune-in'), tuneSub: $('tune-sub'), mute: $('mute'), fs: $('fs'),
    up: $('ch-up'), down: $('ch-down'), clock: $('tv-clock'),
    nowTitle: $('now-title'), nowMeta: $('now-meta'), nowFill: $('now-fill'), upList: $('up-list'),
    guideCh: $('guide-ch'), guideNote: $('guide-note'), guideDays: $('guide-days')
  };

  // channel number -> index, and the years each network has a timetable for
  var BY = {}, AVAIL = {};
  CH.forEach(function (c, i) {
    BY[c.num] = i;
    if (c.net !== 'demo') { (AVAIL[c.net] = AVAIL[c.net] || []).push(c.year); }
  });
  Object.keys(AVAIL).forEach(function (k) { AVAIL[k].sort(function (a, b) { return a - b; }); });

  var S = {
    idx: 0, net: '', year: 0, shelfAt: 0, started: false, muted: false,
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
  function chLabel(ch) { return ch.net === 'demo' ? 'DEMO' : ch.name + ' ' + ch.year; }
  // an APPROX slot has a placeholder clock time: show it with a ~
  function tilde(ref) { return ref && ref.confidence === 'approx' ? '~' : ''; }
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
    // only restart playback if the show on air just got its episodes
    if (S.loc && S.loc.state === 'show' && S.loc.entry.ref.playlist === id) S.key = null;
    return true;
  }
  function cachedPlaylist(id) {
    try {
      var o = JSON.parse(tryLoad('tv.pl.' + id) || 'null');
      if (o && o.ids && o.ids.length && Date.now() - o.t < PL_TTL) return o.ids;
    } catch (e) { /* bad cache */ }
    return null;
  }
  // Only the show on air and the next few are resolved, so a channel with
  // hundreds of playlist slots stays fast.
  function wantPlaylists(ch) {
    var now = Date.now(), refs = [];
    try {
      var loc = E.locate(ch, now);
      if (loc.state === 'show') refs.push(loc.entry.ref);
      if (loc.next) refs.push(loc.next.entry.ref);
      E.upcoming(ch, now, 4).forEach(function (u) { refs.push(u.entry.ref); });
    } catch (e) { /* ignore */ }
    refs.forEach(function (s) {
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
    return 'NEXT: ' + loc.next.entry.ref.title + '  ·  ' + tilde(loc.next.entry.ref) + fmtDayHM(loc.next.startMs, tz) + ' IST  (' + rel(loc.next.startMs, now) + ')';
  }

  // What the slate should say for the current moment.
  function describe(loc, now, mode) {
    var ch = cur();
    var kicker = chLabel(ch);
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
    if (ref.fixture) {
      return { kicker: 'ON AIR  ·  ' + kicker, title: ref.title, line: 'Listed in the timetable. There is no video for this one.', badge: ref.confidence, next: next };
    }
    if ((!loc.episode || !loc.episode.video) && ref.playlist) {
      return { kicker: 'NOW SHOWING  ·  ' + kicker, title: ref.title, line: 'Finding the episode…', badge: ref.confidence, next: next };
    }
    if (!loc.episode || !loc.episode.video) {
      return { kicker: 'ON AIR  ·  ' + kicker, title: ref.title, line: 'No playable copy of this show yet. It is listed so the timetable is right.', badge: ref.confidence, next: next };
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

    if (loc.key !== S.key) { transition(loc, now); markGuide(loc); wantPlaylists(ch); } else { maintain(loc, now); }
    renderNowNext(loc, now);

    if (!S.started) {
      el.tuneSub.textContent = chLabel(ch) +
        (loc.state === 'show' ? '  ·  ' + loc.entry.ref.title + ' is on' : '');
    }
    if (now - S.shelfAt > 15000) { S.shelfAt = now; markDial(now); renderOnAir(now); }
  }

  /* ---------- on-now / up-next ---------- */
  function renderNowNext(loc, now) {
    var tz = tzOf(cur());
    var total = Math.max(1, loc.endMs - loc.startMs);
    var done = Math.min(1, Math.max(0, (now - loc.startMs) / total));
    if (loc.state === 'show') {
      el.nowTitle.textContent = loc.entry.ref.title;
      el.nowMeta.textContent = (epLabel(loc.entry, loc.episodeIndex) ? epLabel(loc.entry, loc.episodeIndex) + '  ·  ' : '') + tilde(loc.entry.ref) + fmtHM(loc.startMs, tz) + ' – ' + fmtHM(loc.endMs, tz) + ' IST';
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
      w.textContent = tilde(u.entry.ref) + fmtDayHM(u.startMs, tz);
      var t = document.createElement('span'); t.className = 'u-title';
      t.textContent = u.entry.ref.title + (epLabel(u.entry, u.episodeIndex) ? ' \u2013 ' + epLabel(u.entry, u.episodeIndex) : '') + '  (' + rel(u.startMs, now) + ')';
      li.appendChild(w); li.appendChild(t); el.upList.appendChild(li);
    });
  }

  /* ---------- weekly guide ---------- */
  function renderGuide() {
    var ch = cur();
    var model = E.normalize(ch);
    el.guideCh.textContent = chLabel(ch);
    el.guideNote.textContent = (ch.tag ? 'On this channel: ' + ch.tag + '. ' : '') + 'Fixed weekly timetable, India time (IST), one new episode a week. Tap a show to see where its slot comes from.';
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
        var r = document.createElement('div'); r.className = 'g-row' + (x.ref.fixture ? ' g-fixture' : ''); r.dataset.start = x.start;
        r.tabIndex = 0; r.setAttribute('role', 'button');
        var tm = document.createElement('span'); tm.className = 'g-time'; tm.textContent = tilde(x.ref) + x.ref.time;
        var ti = document.createElement('span'); ti.className = 'g-title'; ti.textContent = x.ref.title;
        var sub = document.createElement('span'); sub.className = 'g-sub';
        sub.appendChild(document.createTextNode(x.ref.duration + ' min' + (x.ref.fixture ? ' · listing only' : '') + '  '));
        if (x.ref.confidence) {
          var b = document.createElement('span'); b.className = 'badge b-' + x.ref.confidence;
          b.textContent = x.ref.confidence.toUpperCase(); sub.appendChild(b);
        }
        ti.appendChild(sub);
        if (x.ref.source) {
          var src = document.createElement('span'); src.className = 'g-src'; src.textContent = x.ref.source; ti.appendChild(src);
          var flip = function () { r.classList.toggle('open'); };
          r.addEventListener('click', flip);
          r.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); flip(); } });
        }
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

  /* ---------- channels: a network grid + a year row ---------- */
  function nearestYear(ys, y) {
    var best = ys[0];
    ys.forEach(function (v) { if (Math.abs(v - y) < Math.abs(best - y)) best = v; });
    return best;
  }
  function netById(id) { for (var i = 0; i < NETS.length; i++) { if (NETS[i].id === id) return NETS[i]; } return null; }

  function renderNets() {
    el.nets.textContent = '';
    NETS.forEach(function (n) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'net-btn'; b.dataset.net = n.id;
      b.style.setProperty('--c', n.color);
      var s = document.createElement('span'); s.className = 'n-short'; s.textContent = n.short;
      var nm = document.createElement('span'); nm.className = 'n-name'; nm.textContent = n.name;
      var now = document.createElement('span'); now.className = 'n-now';
      b.appendChild(s); b.appendChild(nm); b.appendChild(now);
      b.addEventListener('click', function () { selectNet(n.id); });
      el.nets.appendChild(b);
    });
  }

  function renderYears() {
    el.years.textContent = '';
    var decade = -1;
    for (var y = YEARS.from; y <= YEARS.to; y++) {
      var d = Math.floor(y / 10) * 10;
      if (d !== decade) {
        decade = d;
        var lab = document.createElement('span'); lab.className = 'yr-dec';
        lab.textContent = d >= 2000 ? '2000s' : String(d) + 's';
        el.years.appendChild(lab);
      }
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'yr'; b.dataset.year = y; b.textContent = y;
      b.addEventListener('click', (function (yy) { return function () { selectYear(yy); }; })(y));
      el.years.appendChild(b);
    }
  }

  // What is a network doing in the selected year? One short line for its grid button.
  function nowText(netId, now) {
    var i = BY[netId + '-' + S.year];
    if (i == null) {
      var ys = AVAIL[netId] || [];
      if (!ys.length) return '';
      if (S.year < ys[0]) return 'starts ' + ys[0];
      if (S.year > ys[ys.length - 1]) return 'last: ' + ys[ys.length - 1];
      return 'nothing listed';
    }
    var loc = E.locate(CH[i], now);
    if (loc.state === 'show') return '▶ ' + loc.entry.ref.title;
    if (loc.state === 'closedown') return 'off air';
    return 'next: ' + loc.next.entry.ref.title;
  }

  function markDial(now) {
    now = now || Date.now();
    Array.prototype.forEach.call(el.nets.children, function (b) {
      var id = b.dataset.net, has = BY[id + '-' + S.year] != null;
      b.classList.toggle('is-on', id === S.net);
      b.classList.toggle('is-away', !has);
      b.setAttribute('aria-pressed', id === S.net ? 'true' : 'false');
      b.querySelector('.n-now').textContent = nowText(id, now);
    });
    var ys = AVAIL[S.net] || [];
    Array.prototype.forEach.call(el.years.querySelectorAll('.yr'), function (b) {
      var y = +b.dataset.year, ok = ys.indexOf(y) >= 0;
      b.disabled = !ok;
      b.classList.toggle('is-on', y === S.year);
      b.setAttribute('aria-pressed', y === S.year ? 'true' : 'false');
    });
    var n = netById(S.net);
    el.chanSub.textContent = n ? n.blurb : 'test channel';
    el.yearSub.textContent = ys.length ? (n.name + ' listings: ' + ys[0] + (ys.length > 1 ? ' to ' + ys[ys.length - 1] : '')) : '';
  }

  // Every channel and year that has a show on air this minute (and the ones about to start).
  function renderOnAir(now) {
    var live = [], soon = [];
    CH.forEach(function (ch, i) {
      if (ch.net === 'demo') return;
      var loc; try { loc = E.locate(ch, now); } catch (e) { return; }
      if (loc.state === 'show' && !loc.entry.ref.fixture) {
        var r = loc.entry.ref;
        if ((r.episodes && r.episodes.length) || r.playlist) live.push({ i: i, title: r.title, ch: ch });
      } else if (loc.next && !loc.next.entry.ref.fixture) {
        var mins = (loc.next.startMs - now) / 60000;
        var nr = loc.next.entry.ref;
        if (mins <= 120 && ((nr.episodes && nr.episodes.length) || nr.playlist)) soon.push({ i: i, title: nr.title, ch: ch, t: loc.next.startMs });
      }
    });
    el.onair.textContent = '';
    function chip(o, tail) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip' + (o.i === S.idx ? ' is-on' : '');
      var net = netById(o.ch.net);
      if (net) b.style.setProperty('--c', net.color);
      b.textContent = (tail ? '' : '▶ ') + o.title + '  ·  ' + chLabel(o.ch) + (tail ? '  ·  ' + tail : '');
      b.addEventListener('click', function () { selectChannel(o.i); });
      el.onair.appendChild(b);
    }
    live.sort(function (a, b) { return a.ch.year - b.ch.year; });
    if (live.length) {
      el.onairH.textContent = 'ON AIR RIGHT NOW, ANYWHERE IN TIME  (' + live.length + ')';
      live.slice(0, 14).forEach(function (o) { chip(o); });
      if (live.length > 14) {
        var more = document.createElement('span'); more.className = 'chip-more'; more.textContent = '+ ' + (live.length - 14) + ' more';
        el.onair.appendChild(more);
      }
    } else {
      el.onairH.textContent = 'NOTHING IS ON AIR THIS MINUTE. STARTING SOON:';
      soon.sort(function (a, b) { return a.t - b.t; });
      soon.slice(0, 10).forEach(function (o) { chip(o, rel(o.t, now)); });
      if (!soon.length) {
        var none = document.createElement('span'); none.className = 'chip-more';
        none.textContent = 'Nothing starts in the next two hours. Open the week guide below to see what is on later.';
        el.onair.appendChild(none);
      }
    }
  }

  function selectChannel(i, note) {
    i = ((i % CH.length) + CH.length) % CH.length;
    var changed = i !== S.idx || S.key === null;
    S.idx = i; S.key = null; S.ended = false; S.failed = false;
    if (S.ready) stopPlayers();
    var ch = cur();
    S.net = ch.net; if (ch.net !== 'demo') S.year = ch.year;
    tryStore('tv.ch', ch.num);
    try { history.replaceState(null, '', '#ch=' + ch.num); } catch (e) { /* file:// etc. */ }
    renderGuide();
    markDial();
    renderOnAir(Date.now());
    wantPlaylists(ch);
    showSlate({ kicker: 'TUNING…', title: ch.name, line: ch.net === 'demo' ? ch.tag : String(ch.year) });
    if (changed) { flash(); osd(chLabel(ch) + (note ? '\n' + note : '')); }
    tick();
  }

  function selectNet(id) {
    var ys = AVAIL[id]; if (!ys || !ys.length) return;
    var y = S.year || ys[0], note = '';
    if (ys.indexOf(y) < 0) {
      var ny = nearestYear(ys, y);
      note = netById(id).name + ' has no listing for ' + y + ' (' + ys[0] + ' to ' + ys[ys.length - 1] + ')';
      y = ny;
    }
    selectChannel(BY[id + '-' + y], note);
  }

  function selectYear(y) {
    var i = BY[S.net + '-' + y];
    if (i != null) selectChannel(i);
  }

  // CH up / down: next network that has a timetable in the same year (like flipping channels in that year).
  function stepNet(dir) {
    var at = -1;
    for (var k = 0; k < NETS.length; k++) { if (NETS[k].id === S.net) at = k; }
    for (var n = 1; n <= NETS.length; n++) {
      var cand = NETS[((at + dir * n) % NETS.length + NETS.length) % NETS.length];
      var i = BY[cand.id + '-' + S.year];
      if (i != null) { selectChannel(i); return; }
    }
  }
  // YEAR back / forward on the same network, skipping years it has no timetable for.
  function stepYear(dir) {
    var ys = AVAIL[S.net]; if (!ys || ys.length < 2) return;
    var at = ys.indexOf(S.year);
    var next = at < 0 ? ys[0] : ys[((at + dir) % ys.length + ys.length) % ys.length];
    selectYear(next);
  }

  // First visit: land on a channel that has something playable on air right now.
  function bestNow() {
    var now = Date.now(), live = [], soon = [], withEps = -1;
    CH.forEach(function (ch, i) {
      if (ch.net === 'demo') return;
      if (withEps < 0 && hasEpisodes(ch)) withEps = i;
      var loc; try { loc = E.locate(ch, now); } catch (e) { return; }
      var r = loc.state === 'show' ? loc.entry.ref : null;
      if (r && !r.fixture && ((r.episodes && r.episodes.length) || r.playlist)) live.push(i);
      else if (loc.next) {
        var nr = loc.next.entry.ref;
        if (!nr.fixture && ((nr.episodes && nr.episodes.length) || nr.playlist)) soon.push({ i: i, t: loc.next.startMs });
      }
    });
    if (live.length) return live[Math.floor(Math.random() * live.length)];
    if (soon.length) { soon.sort(function (a, b) { return a.t - b.t; }); return soon[0].i; }
    return withEps >= 0 ? withEps : 0;
  }

  function pickStart() {
    var m = /ch=([\w-]+)/.exec(location.hash || '');
    var want = (m && m[1]) || tryLoad('tv.ch');
    if (want && LEGACY[want]) want = LEGACY[want];
    if (want != null && BY[want] != null) return BY[want];
    return bestNow();
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
  el.up.addEventListener('click', function () { stepNet(1); });
  el.down.addEventListener('click', function () { stepNet(-1); });
  el.yrUp.addEventListener('click', function () { stepYear(1); });
  el.yrDown.addEventListener('click', function () { stepYear(-1); });
  el.mute.addEventListener('click', function () { S.muted = !S.muted; applyMute(); updateMuteBtn(); });
  el.fs.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', function (ev) {
    var tag = (ev.target && ev.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.key === 'ArrowUp') { ev.preventDefault(); stepNet(1); }
    else if (ev.key === 'ArrowDown') { ev.preventDefault(); stepNet(-1); }
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); stepYear(1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); stepYear(-1); }
    else if (ev.key === 'm' || ev.key === 'M') { S.muted = !S.muted; applyMute(); updateMuteBtn(); }
    else if (ev.key === 'f' || ev.key === 'F') { toggleFullscreen(); }
  });

  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });

  /* ---------- go ---------- */
  S.idx = pickStart();
  renderNets();
  renderYears();
  updateMuteBtn();
  selectChannel(S.idx);
  setInterval(tick, 1000);
})();
