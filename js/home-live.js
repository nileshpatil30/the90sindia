/* ==========================================================================
   90s REWIND TV — THE HOMEPAGE TELEVISION (home.html)
   The CRT is a separate frame image (assets/ui/crt.svg) with a transparent
   screen opening; YouTube's own player sits behind the opening. Nothing is ever
   drawn over the video. It plays the SAME fixed weekly timetables as the Live TV
   page (js/tv-schedule.js), so what is on air here is what is on air there.

     top knob     next channel          lower knob   sound on / off
     ON AIR       what is playing now, with the real episode number
     UP NEXT      the next three slots on this channel (IST)

   Video starts muted (browsers block sound-on autoplay): tap the lower knob.
   ========================================================================== */
(function () {
  'use strict';
  const E = window.TVEngine, CH = window.TV_CHANNELS || [];
  const $ = (id) => document.getElementById(id);
  if (!E || !CH.length || !$('crt')) return;

  const S = { idx: -1, muted: true, ready: false, key: null, loc: null, vod: false, visible: true, ended: false, failed: false, tAt: 0, spin: 0, apiAsked: false };
  const el = {
    yt: $('crt-yt'), slate: $('crt-slate'), sk: $('slate-k'), st: $('slate-t'), sl: $('slate-l'),
    title: $('oa-title'), ep: $('oa-ep'), fill: $('oa-fill'), time: $('oa-time'), ch: $('oa-ch'), up: $('up-list'), all: $('up-all'),
    knobCh: $('knob-ch'), knobSnd: $('knob-snd')
  };
  const tz = 330;                                   // IST, like the timetables
  const pad = (n) => (n < 10 ? '0' : '') + n;
  const clock = (sec) => { sec = Math.max(0, Math.floor(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return h ? h + ':' + pad(m) + ':' + pad(s) : m + ':' + pad(s); };
  function at12(ms) { const d = new Date(ms + tz * 60000); let h = d.getUTCHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return pad(h) + ':' + pad(d.getUTCMinutes()) + ' ' + ap; }
  const label = (ch) => ch.name + ' ' + ch.year;
  const playable = (ep) => !!(ep && ep.video);       // (Dailymotion-only shows play on the TV page, not here)
  const hasVideo = (r) => !!(r && !r.fixture && ((r.episodes && r.episodes.length && r.episodes[0].video) || r.playlist));
  const tryStore = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } };
  const tryLoad = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* ---------- which channel? one that has a real show on air right now ---------- */
  function liveList(now) {
    const out = [];
    CH.forEach((c, i) => { try { const l = E.locate(c, now); if (l.state === 'show' && hasVideo(l.entry.ref)) out.push(i); } catch (e) { /* skip */ } });
    return out;
  }
  function pickStart() {
    const now = Date.now(), live = liveList(now);
    if (live.length) return live[Math.floor(now / 1800000) % live.length];   // changes every 30 minutes
    // nothing on air anywhere (late at night, IST): tune to the channel that comes back soonest
    let best = 0, bestT = Infinity;
    CH.forEach((c, i) => { try { const u = E.upcoming(c, now, 1)[0]; if (u && u.startMs < bestT && hasVideo(u.entry.ref)) { bestT = u.startMs; best = i; } } catch (e) { /* skip */ } });
    return best;
  }
  function nextChannel() {
    const now = Date.now(), live = liveList(now), pool = live.length ? live : CH.map((c, i) => i);
    let k = pool.indexOf(S.idx);
    S.idx = pool[(k + 1) % pool.length];
    tryStore('home.ch', CH[S.idx].num);
    S.key = null; S.ended = false; S.failed = false; tick();
  }
  function startIdx() {
    const m = /ch=([\w-]+)/.exec(location.hash || '');
    const want = (m && m[1]) || tryLoad('home.ch');
    // a remembered channel only if something is on air on it now (otherwise the screen would be a slate)
    if (want) { for (let i = 0; i < CH.length; i++) { if (CH[i].num === want) { try { const l = E.locate(CH[i], Date.now()); if (l.state === 'show' && hasVideo(l.entry.ref)) return i; } catch (e) { /* ignore */ } } } }
    return pickStart();
  }

  /* ---------- playlists: ask YouTube's own player for the IDs (same cache as the TV page) ---------- */
  const PL = { queue: [], busy: null, timer: 0, probe: null, ready: false }, PL_TTL = 24 * 3600 * 1000;
  function slotsWithPlaylist(id) { const o = []; CH.forEach((c) => c.slots.forEach((s) => { if (s.playlist === id && !(s.episodes && s.episodes.length)) o.push(s); })); return o; }
  function applyPlaylist(id, ids) {
    if (!ids || !ids.length) return false;
    slotsWithPlaylist(id).forEach((s) => { s.episodes = ids.map((v) => ({ video: v })); });
    if (S.loc && S.loc.state === 'show' && S.loc.entry.ref.playlist === id) S.key = null;
    return true;
  }
  function cachedPlaylist(id) { try { const o = JSON.parse(tryLoad('tv.pl.' + id) || 'null'); if (o && o.ids && o.ids.length && Date.now() - o.t < PL_TTL) return o.ids; } catch (e) { /* bad cache */ } return null; }
  function wantPlaylists(ch) {
    const now = Date.now(), refs = [];
    try { const l = E.locate(ch, now); if (l.state === 'show') refs.push(l.entry.ref); E.upcoming(ch, now, 3).forEach((u) => refs.push(u.entry.ref)); } catch (e) { /* ignore */ }
    refs.forEach((s) => {
      if (!s.playlist || (s.episodes && s.episodes.length)) return;
      const c = cachedPlaylist(s.playlist);
      if (c) { applyPlaylist(s.playlist, c); return; }
      if (PL.queue.indexOf(s.playlist) < 0 && PL.busy !== s.playlist) PL.queue.push(s.playlist);
    });
    plNext();
  }
  function plNext() {
    if (!PL.ready || PL.busy || !PL.queue.length) return;
    PL.busy = PL.queue.shift();
    try { PL.probe.cuePlaylist({ listType: 'playlist', list: PL.busy }); } catch (e) { plDone(null); return; }
    PL.timer = setTimeout(() => plDone(null), 10000);
  }
  function plDone(ids) {
    clearTimeout(PL.timer);
    const id = PL.busy; PL.busy = null;
    if (id && ids && applyPlaylist(id, ids)) tryStore('tv.pl.' + id, JSON.stringify({ t: Date.now(), ids: ids }));
    plNext(); tick();
  }

  /* ---------- YouTube ---------- */
  function ensureAPI() {
    if (S.apiAsked) return; S.apiAsked = true;
    if (window.YT && window.YT.Player) { initPlayers(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (typeof prev === 'function') { try { prev(); } catch (e) { /* ignore */ } } initPlayers(); };
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => slate('NO SIGNAL', 'Cannot reach YouTube', 'Check your connection and reload the page.');
    document.head.appendChild(s);
  }
  function initPlayers() {
    const vars = { controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, mute: 1 };
    if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    S.p = new YT.Player('crt-yt', {
      width: '100%', height: '100%', playerVars: vars,
      events: {
        onReady: () => { S.ready = true; applyMute(); S.key = null; tick(); },
        onStateChange: (e) => { if (e.data === 0 && S.loc && S.loc.state !== 'closedown') { S.ended = true; hideVideo(); } },
        onError: () => { S.failed = true; hideVideo(); },
        onAutoplayBlocked: () => { S.muted = true; applyMute(); try { S.p.playVideo(); } catch (e) { /* ignore */ } }
      }
    });
    const wrap = document.createElement('div'); wrap.style.cssText = 'position:absolute;left:-9999px;top:0;width:200px;height:200px;overflow:hidden';
    const probe = document.createElement('div'); probe.id = 'crt-probe'; wrap.appendChild(probe); document.body.appendChild(wrap);
    PL.probe = new YT.Player('crt-probe', { width: '200', height: '200', events: {
      onReady: () => { PL.ready = true; wantPlaylists(CH[S.idx]); },
      onStateChange: (e) => { if (e.data === 5 && PL.busy) { let ids = null; try { ids = PL.probe.getPlaylist(); } catch (x) { /* ignore */ } plDone(ids); } }
    } });
  }
  function applyMute() { if (!S.p || !S.p.mute) return; try { S.muted ? S.p.mute() : S.p.unMute(); } catch (e) { /* not ready */ } syncKnob(); }
  function syncKnob() { el.knobSnd.setAttribute('aria-pressed', S.muted ? 'false' : 'true'); el.knobSnd.title = S.muted ? 'Sound is off. Tap for sound' : 'Sound is on. Tap to mute'; }

  /* ---------- screen ---------- */
  function hideVideo() { try { S.p && S.p.stopVideo && S.p.stopVideo(); } catch (e) { /* ignore */ } const f = el.yt.tagName === 'IFRAME' ? el.yt : document.querySelector('#crt-screen iframe'); if (f) f.style.visibility = 'hidden'; }
  function showVideo() { const f = document.querySelector('#crt-screen iframe'); if (f) f.style.visibility = ''; el.slate.hidden = true; }
  function slate(k, t, l) { el.sk.textContent = k; el.st.textContent = t; el.sl.textContent = l || ''; el.slate.hidden = false; }
  function describeGap(loc, now, why) {
    const ch = CH[S.idx], nx = loc.next && loc.next.entry.ref;
    if (loc.state === 'show') {
      const r = loc.entry.ref;
      if (why === 'failed') return ['ON AIR · ' + label(ch).toUpperCase(), r.title, 'YouTube would not play this one. The timetable carries on.'];
      if (why === 'ended') return ['ON AIR · ' + label(ch).toUpperCase(), r.title, 'This copy has ended. The slot is not over yet.'];
      return ['ON AIR · ' + label(ch).toUpperCase(), r.title, r.fixture ? 'A real part of this channel’s week with no recording to play.' : 'No playable copy of this show yet. It is listed so the timetable is right.'];
    }
    if (loc.state === 'closedown') return ['OFF AIR', loc.label || 'Transmission has ended for the day', nx ? 'Back with ' + nx.title + ' in ' + clock(loc.remaining) : ''];
    return ['COMMERCIAL BREAK', nx ? 'Back with ' + nx.title : 'We will be right back', 'in ' + clock(loc.remaining)];
  }

  /* ---------- ON AIR / UP NEXT ---------- */
  function epLabel(entry, idx) {
    if (idx == null || idx < 0 || !(entry.ref.episodes && entry.ref.episodes.length)) return '';
    const nums = entry.ref.epNums; if (nums === false) return '';
    return 'Episode ' + (nums && nums[idx] != null ? nums[idx] : idx + 1);
  }
  function render(loc, now) {
    const ch = CH[S.idx];
    el.ch.textContent = label(ch);
    el.all.href = 'tv.html#ch=' + ch.num;
    const total = Math.max(1, loc.endMs - loc.startMs), done = Math.min(1, Math.max(0, (now - loc.startMs) / total));
    if (loc.state === 'show') {
      el.title.textContent = loc.entry.ref.title;
      el.ep.textContent = epLabel(loc.entry, loc.episodeIndex) || ((loc.entry.ref.confidence === 'approx' ? '~' : '') + at12(loc.startMs) + ' – ' + at12(loc.endMs));
      el.fill.style.width = (done * 100) + '%';
      el.time.textContent = clock((now - loc.startMs) / 1000) + ' / ' + clock(total / 1000);
    } else if (loc.state === 'closedown') {
      el.title.textContent = 'Off air'; el.ep.textContent = loc.label || ''; el.fill.style.width = '0'; el.time.textContent = '';
    } else {
      el.title.textContent = 'Commercial break'; el.ep.textContent = loc.ad && loc.ad.sponsor ? loc.ad.sponsor : 'Back soon'; el.fill.style.width = '0'; el.time.textContent = '';
    }
    let ups = []; try { ups = E.upcoming(ch, now, 3); } catch (e) { /* ignore */ }
    el.up.innerHTML = ups.map((u) => '<li><b>' + (u.entry.ref.confidence === 'approx' ? '~' : '') + at12(u.startMs) + '</b><span title="' + u.entry.ref.title.replace(/[&<>"]/g, '') + '">' + u.entry.ref.title.replace(/[&<>"]/g, '') + '</span></li>').join('');
  }

  /* ---------- the clock ---------- */
  function play(id, offset) {
    hideSlateKeepVideo();
    applyMute();
    try { S.p.loadVideoById({ videoId: id, startSeconds: Math.max(0, Math.floor(offset)) }); } catch (e) { /* ignore */ }
  }
  function hideSlateKeepVideo() { showVideo(); }
  function transition(loc, now) {
    S.key = loc.key; S.ended = false; S.failed = false; S.tAt = now;
    if (!S.ready || S.vod || !S.visible && S.muted) { const g = describeGap(loc, now); slate(g[0], g[1], 'Starting…'); return; }
    if (loc.state === 'show' && playable(loc.episode)) play(loc.episode.video, loc.offset);
    else if (loc.state === 'break' && loc.ad && loc.ad.video) play(loc.ad.video, loc.offset);
    else { hideVideo(); const g = describeGap(loc, now); slate(g[0], g[1], g[2]); }
  }
  function maintain(loc, now) {
    const vid = (loc.state === 'show' && playable(loc.episode)) || (loc.state === 'break' && loc.ad && loc.ad.video);
    if (!S.ready || !vid || S.ended || S.failed) {
      const g = describeGap(loc, now, S.failed ? 'failed' : (S.ended ? 'ended' : undefined));
      slate(g[0], g[1], g[2]); return;
    }
    let st; try { st = S.p.getPlayerState(); } catch (e) { return; }
    if (st === 1) {
      let t = 0; try { t = S.p.getCurrentTime(); } catch (e) { /* ignore */ }
      if (Math.abs(t - loc.offset) > 5) { try { S.p.seekTo(loc.offset, true); } catch (e) { /* ignore */ } }
    } else if (st === 2) { try { S.p.playVideo(); } catch (e) { /* ignore */ } }
  }
  function tick() {
    if (S.idx < 0) return;
    const ch = CH[S.idx], now = Date.now();
    const loc = E.locate(ch, now); S.loc = loc;
    render(loc, now);
    if (S.vod) return;                                  // a pop-up video is playing: the TV waits
    if (loc.key !== S.key) { transition(loc, now); wantPlaylists(ch); } else maintain(loc, now);
  }

  /* ---------- controls ---------- */
  el.knobCh.addEventListener('click', () => { S.spin += 60; el.knobCh.style.setProperty('--a', S.spin + 'deg'); nextChannel(); });
  $('oa-next').addEventListener('click', () => { S.spin += 60; el.knobCh.style.setProperty('--a', S.spin + 'deg'); nextChannel(); });
  el.knobSnd.addEventListener('click', () => { S.muted = !S.muted; S.spin += 45; el.knobSnd.style.setProperty('--a', S.spin + 'deg'); applyMute(); if (!S.muted) { try { S.p && S.p.playVideo(); } catch (e) { /* ignore */ } } });
  // a pop-up video (movie, song, ad ...) is open: stop the TV so two things never play at once
  document.addEventListener('home:vod', (ev) => {
    S.vod = !!(ev.detail && ev.detail.open);
    if (S.vod) { try { S.p && S.p.pauseVideo && S.p.pauseVideo(); } catch (e) { /* ignore */ } } else { S.key = null; tick(); }
  });
  // do not stream a muted video nobody can see
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((en) => {
      const v = en[0].isIntersecting;
      if (v === S.visible) return;
      S.visible = v;
      if (!v && S.muted) { try { S.p && S.p.pauseVideo && S.p.pauseVideo(); } catch (e) { /* ignore */ } }
      else { S.key = null; tick(); }
    }, { threshold: 0.05 }).observe($('crt'));
  }

  S.idx = startIdx(); syncKnob();
  slate('TUNING IN', label(CH[S.idx]), 'Connecting to the broadcast…');
  tick(); wantPlaylists(CH[S.idx]);
  ensureAPI();
  setInterval(tick, 1000);
  window.HomeLive = { next: nextChannel, channel: () => CH[S.idx], state: () => S };
})();
