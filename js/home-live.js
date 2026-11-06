/* ==========================================================================
   90s REWIND TV — THE HOMEPAGE TELEVISION (home.html)
   The CRT is a separate frame image (assets/ui/crt.svg) with a transparent
   screen opening; YouTube's own player sits behind the opening. Nothing is ever
   drawn over the video. It plays the SAME fixed weekly timetables as the Live TV
   page (js/tv-schedule.js), so what is on air here is what is on air there.

     top knob     next channel          lower knob   sound on / off
     ON AIR       what is playing now, with the real episode number
     UP NEXT      the next three slots on this channel (IST)
     remote strip previous / pause / next channel, mute + volume, and a channel picker
                  (every network and year in the timetable). Pause then play jumps back to
                  the live position, like switching a real TV off and on again.

   Video starts muted (browsers block sound-on autoplay): tap the lower knob.
   ========================================================================== */
(function () {
  'use strict';
  const E = window.TVEngine, CH = window.TV_CHANNELS || [];
  const $ = (id) => document.getElementById(id);
  if (!E || !CH.length || !$('crt')) return;

  const S = { idx: -1, muted: true, ready: false, key: null, loc: null, vod: false, visible: true, ended: false, failed: false, tAt: 0, spin: 0, apiAsked: false, paused: false, vol: 70, filling: false };
  const el = {
    yt: $('crt-yt'), slate: $('crt-slate'), sk: $('slate-k'), st: $('slate-t'), sl: $('slate-l'),
    title: $('oa-title'), ep: $('oa-ep'), fill: $('oa-fill'), time: $('oa-time'), ch: $('oa-ch'), up: $('up-list'), all: $('up-all'),
    knobCh: $('knob-ch'), knobSnd: $('knob-snd'),
    rPrev: $('rc-prev'), rPlay: $('rc-play'), rPlayI: $('rc-play-i'), rNext: $('rc-next'), rMute: $('rc-mute'), rMuteI: $('rc-mute-i'), rVol: $('rc-vol'), rSel: $('rc-ch')
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
  function pool(now) { const live = liveList(now); return live.length ? live : CH.map((c, i) => i); }
  function nextChannel() {
    const p = pool(Date.now()), k = p.indexOf(S.idx);
    if (k >= 0) S.idx = p[(k + 1) % p.length]; else { const after = p.filter((i) => i > S.idx); S.idx = after.length ? after[0] : p[0]; }
    tune();
  }
  function prevChannel() {
    const p = pool(Date.now()), k = p.indexOf(S.idx);
    if (k >= 0) S.idx = p[(k - 1 + p.length) % p.length]; else { const before = p.filter((i) => i < S.idx); S.idx = before.length ? before[before.length - 1] : p[p.length - 1]; }
    tune();
  }
  function tune() { tryStore('home.ch', CH[S.idx].num); S.key = null; S.ended = false; S.failed = false; S.paused = false; S.filling = false; syncRemote(); tick(); }
  function tuneTo(num) { for (let i = 0; i < CH.length; i++) { if (CH[i].num === num) { S.idx = i; tune(); return; } } }
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function buildSelect() {
    if (!el.rSel) return;
    const nets = window.TV_NETS || [], by = {};
    CH.forEach((c, i) => { (by[c.net] = by[c.net] || []).push(i); });
    const order = nets.map((n) => n.id).filter((k) => by[k]).concat(Object.keys(by).filter((k) => !nets.some((n) => n.id === k)));
    el.rSel.innerHTML = order.map((k) => {
      const nm = (nets.filter((n) => n.id === k)[0] || { name: CH[by[k][0]].name }).name;
      return '<optgroup label="' + esc(nm) + '">' + by[k].map((i) => '<option value="' + esc(CH[i].num) + '">' + esc(label(CH[i])) + '</option>').join('') + '</optgroup>';
    }).join('');
  }
  function syncRemote() {
    if (el.rSel && S.idx >= 0) el.rSel.value = CH[S.idx].num;
    if (el.rPlay) {
      el.rPlay.setAttribute('aria-pressed', S.paused ? 'true' : 'false');
      el.rPlay.setAttribute('aria-label', S.paused ? 'Play (back to live)' : 'Pause'); el.rPlay.title = S.paused ? 'Play (back to live)' : 'Pause';
      el.rPlayI.src = 'assets/ui/icons/' + (S.paused ? 'r-play' : 'r-pause') + '.svg';
    }
    if (el.rMute) {
      const off = S.muted || S.vol === 0;
      el.rMute.setAttribute('aria-pressed', off ? 'true' : 'false'); el.rMute.title = off ? 'Sound is off. Tap for sound' : 'Sound is on. Tap to mute';
      el.rMuteI.src = 'assets/ui/icons/' + (off ? 'r-mute' : 'r-vol') + '.svg';
      el.rVol.value = S.vol;
    }
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
        onStateChange: (e) => { if (e.data === 0 && S.loc && S.loc.state !== 'closedown' && !S.filling) { S.ended = true; if (S.fillDone) hideVideo(); } },
        onError: () => { S.failed = true; if (!S.filling) hideVideo(); },
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
  function applyMute() {
    if (S.p && S.p.mute) { try { if (S.muted) S.p.mute(); else { S.p.unMute(); S.p.setVolume && S.p.setVolume(S.vol); } } catch (e) { /* not ready */ } }
    syncKnob();
  }
  function syncKnob() { el.knobSnd.setAttribute('aria-pressed', S.muted ? 'false' : 'true'); el.knobSnd.title = S.muted ? 'Sound is off. Tap for sound' : 'Sound is on. Tap to mute'; syncRemote(); }
  function setMuted(m) { S.muted = !!m; applyMute(); if (!S.muted && !S.paused) { try { S.p && S.p.playVideo(); } catch (e) { /* ignore */ } } }

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
    el.all.href = 'tv.html?ch=' + ch.num + '#guide';
    if (el.rSel && el.rSel.value !== ch.num && document.activeElement !== el.rSel) el.rSel.value = ch.num;
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
    S.paused = false; syncRemote();
    hideSlateKeepVideo();
    applyMute();
    try { S.p.loadVideoById({ videoId: id, startSeconds: Math.max(0, Math.floor(offset)) }); } catch (e) { /* ignore */ }
  }
  function hideSlateKeepVideo() { showVideo(); }
  function transition(loc, now) {
    S.key = loc.key; S.ended = false; S.failed = false; S.filling = false; S.fillDone = false; S.tAt = now;
    if (!S.ready || S.vod || !S.visible && S.muted) { const g = describeGap(loc, now); slate(g[0], g[1], 'Starting…'); return; }
    if (loc.state === 'show' && playable(loc.episode)) play(loc.episode.video, loc.offset);
    else if (loc.state === 'break' && loc.ad && loc.ad.video) play(loc.ad.video, loc.offset);
    else { hideVideo(); const g = describeGap(loc, now); slate(g[0], g[1], g[2]); }
  }
  function maintain(loc, now) {
    if (S.paused) return;                              // the viewer paused: stay put until Play
    const vid = (loc.state === 'show' && playable(loc.episode)) || (loc.state === 'break' && loc.ad && loc.ad.video);
    // the episode ended before its slot did: fill the rest with this channel's ad breaks and idents
    if (S.ready && S.ended && !S.filling && loc.state === 'show') {
      const ads = (CH[S.idx].ads || []).filter((a) => a && a.video);
      if (ads.length) { const a = ads[Math.floor((loc.episodeIndex || 0) + loc.startMs / 60000) % ads.length]; S.filling = true; S.fillAt = now; S.ended = false; play(a.video, 0); return; }
    }
    if (S.filling) {
      let st = -1; try { st = S.p.getPlayerState(); } catch (e) { /* ignore */ }
      if ((st === 0 && now - S.fillAt > 4000) || S.failed) { S.filling = false; S.ended = true; S.fillDone = true; hideVideo(); } else return;
    }
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
    if (S.vod || S.paused) return;                      // a pop-up video is playing, or the viewer paused: the TV waits
    if (loc.key !== S.key) { transition(loc, now); wantPlaylists(ch); } else maintain(loc, now);
  }

  /* ---------- controls ---------- */
  el.knobCh.addEventListener('click', () => { S.spin += 60; el.knobCh.style.setProperty('--a', S.spin + 'deg'); nextChannel(); });
  $('oa-next').addEventListener('click', () => { S.spin += 60; el.knobCh.style.setProperty('--a', S.spin + 'deg'); nextChannel(); });
  el.knobSnd.addEventListener('click', () => { S.spin += 45; el.knobSnd.style.setProperty('--a', S.spin + 'deg'); setMuted(!S.muted); });
  el.rNext.addEventListener('click', () => { S.spin += 60; el.knobCh.style.setProperty('--a', S.spin + 'deg'); nextChannel(); });
  el.rPrev.addEventListener('click', () => { S.spin -= 60; el.knobCh.style.setProperty('--a', S.spin + 'deg'); prevChannel(); });
  el.rMute.addEventListener('click', () => { if (S.muted && S.vol === 0) S.vol = 50; setMuted(!S.muted); });
  el.rVol.addEventListener('input', () => {
    S.vol = +el.rVol.value; tryStore('home.vol', S.vol);
    if (S.vol === 0) { S.muted = true; applyMute(); } else { S.muted = false; applyMute(); try { S.p && S.p.playVideo(); } catch (e) { /* ignore */ } }
  });
  el.rSel.addEventListener('change', () => { tuneTo(el.rSel.value); el.rSel.blur(); });
  el.rPlay.addEventListener('click', () => {
    if (!S.p || !S.ready) return;
    if (!S.paused && !el.slate.hidden) { if (window.HomeUI) window.HomeUI.toast('Nothing to pause right now: no video is playing.'); return; }
    if (!S.paused) { S.paused = true; try { S.p.pauseVideo(); } catch (e) { /* ignore */ } syncRemote(); return; }
    S.paused = false; S.key = null; syncRemote(); tick();          // back to the live position
  });
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
      else if (!S.paused) { S.key = null; tick(); }
    }, { threshold: 0.05 }).observe($('crt'));
  }

  { const v = parseInt(tryLoad('home.vol'), 10); if (v >= 0 && v <= 100) S.vol = v; el.rVol.value = S.vol; }
  buildSelect();
  S.idx = startIdx(); syncKnob(); syncRemote();
  slate('TUNING IN', label(CH[S.idx]), 'Connecting to the broadcast…');
  tick(); wantPlaylists(CH[S.idx]);
  ensureAPI();
  setInterval(tick, 1000);
  window.HomeLive = { next: nextChannel, prev: prevChannel, tuneTo: tuneTo, channel: () => CH[S.idx], state: () => S };
})();
