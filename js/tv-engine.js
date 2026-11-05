/* ==========================================================================
   90s REWIND TV — WEEKLY TIMETABLE ENGINE
   Pure functions, no DOM. Works in the browser (window.TVEngine) and in
   Node (module.exports) so the schedule math can be tested.

   HOW IT WORKS
   Each channel is a fixed WEEKLY timetable, like a real TV guide:
   "Sunday 09:00 — Mahabharat". Times are read in the channel's own time
   zone (India, UTC+5:30 by default), so a viewer anywhere in the world sees
   the same show at the same instant.

   - Inside a slot: the show plays from its start (offset = time since start).
   - One episode per week: episode index = week number mod number of episodes.
   - Between slots: commercial breaks (your own ad clips, rotating), or a
     "closedown" test card inside the channel's off-air window.
   ========================================================================== */
(function (root) {
  'use strict';

  var DAY = 86400, WEEK = 604800;
  var DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var cache = new WeakMap();

  function dayIndex(d) {
    if (typeof d === 'number') return d;
    var i = DAY_NAMES.indexOf(String(d).slice(0, 3).toLowerCase());
    if (i < 0) throw new Error('Unknown day "' + d + '" (use Sun..Sat, 0-6, "daily", "weekdays" or "weekend")');
    return i;
  }

  function expandDays(day) {
    if (day === 'daily') return [0, 1, 2, 3, 4, 5, 6];
    if (day === 'weekdays') return [1, 2, 3, 4, 5];
    if (day === 'weekend') return [6, 0];
    return (Array.isArray(day) ? day : [day]).map(dayIndex);
  }

  function parseHM(t) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(t || '');
    if (!m || +m[1] > 23 || +m[2] > 59) throw new Error('Bad time "' + t + '" (use 24h HH:MM)');
    return +m[1] * 3600 + +m[2] * 60;
  }

  function mod(a, n) { return ((a % n) + n) % n; }

  // Expand a channel's slot list into one sorted array of weekly entries.
  function normalize(channel) {
    if (cache.has(channel)) return cache.get(channel);
    var entries = [];
    (channel.slots || []).forEach(function (s, idx) {
      if (!(s.duration > 0) || Math.floor(s.duration) !== s.duration) {
        throw new Error(channel.name + ': "' + s.title + '" duration must be whole minutes > 0');
      }
      if (s.startDate) weekOfDate(s.startDate);
      var tod = parseHM(s.time);
      expandDays(s.day).forEach(function (d) {
        var start = d * DAY + tod;
        entries.push({ ref: s, slotIndex: idx, day: d, start: start, end: start + s.duration * 60 });
      });
    });
    if (!entries.length) throw new Error(channel.name + ': has no slots');
    entries.sort(function (a, b) { return a.start - b.start; });

    var ads = (channel.ads || []).slice();
    var adLoop = 0;
    ads.forEach(function (a) {
      if (!(a.duration > 0)) throw new Error('Ad "' + a.title + '" needs a duration in seconds');
      a._from = adLoop; adLoop += a.duration;
    });

    var cd = channel.closedown || null;
    var model = {
      entries: entries,
      ads: ads,
      adLoop: adLoop,
      tzMs: (channel.tz != null ? channel.tz : 330) * 60000,
      closedown: cd ? { from: parseHM(cd.from), to: parseHM(cd.to), label: cd.label || '' } : null
    };
    cache.set(channel, model);
    return model;
  }

  function inClosedown(model, sod) {
    var c = model.closedown;
    if (!c) return false;
    return c.from <= c.to ? (sod >= c.from && sod < c.to) : (sod >= c.from || sod < c.to);
  }

  // Week number (same counter as clock().weekIndex) of a YYYY-MM-DD date.
  function weekOfDate(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || '');
    if (!m) throw new Error('Bad startDate "' + str + '" (use YYYY-MM-DD)');
    return Math.floor((Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000 + 4) / 7);
  }

  // Which list position plays in this week?
  //   With startDate: week of startDate = item 0, the next week = item 1, ...
  //   (before the start date: item 0), then loops. Episodes play in LIST ORDER.
  //   Without startDate: rotates by calendar week.
  //   One show in several slots a week (the Rewind Mix does this): give each slot
  //   epOffset 0,1,2... and every slot epStep = how many slots the show has per week.
  //   Week 1 then plays items 0..step-1, week 2 the next `step` items, and so on,
  //   so no episode repeats until the whole list has been played.
  function episodeIdx(entry, weekIndex) {
    var eps = entry.ref.episodes || [];
    if (!eps.length) return -1;
    var off = entry.ref.epOffset || 0;
    var step = entry.ref.epStep || 1;
    if (entry.ref.startDate) return (Math.max(0, weekIndex - weekOfDate(entry.ref.startDate)) * step + off) % eps.length;
    return mod(weekIndex * step + off, eps.length);
  }
  function episodeFor(entry, weekIndex) {
    var i = episodeIdx(entry, weekIndex);
    return i < 0 ? null : entry.ref.episodes[i];
  }

  // Where is "now" in the channel's local week?
  function clock(model, nowMs) {
    var loc = nowMs + model.tzMs;
    var days = Math.floor(loc / 86400000);
    var dow = mod(days + 4, 7);                    // 1970-01-01 was a Thursday
    var weekIndex = Math.floor((days + 4) / 7);    // increments every Sunday
    var sod = (loc - days * 86400000) / 1000;
    var weekSec = dow * DAY + sod;
    return { weekSec: weekSec, sod: sod, weekIndex: weekIndex, weekStartMs: nowMs - weekSec * 1000 };
  }

  // What is on right now?
  //   state: 'show' | 'break' | 'closedown'
  function locate(channel, nowMs) {
    var M = normalize(channel);
    var c = clock(model_(M), nowMs);
    var E = M.entries;

    var i = -1;
    for (var k = 0; k < E.length; k++) { if (E[k].start <= c.weekSec) i = k; else break; }
    var shift = 0;                                  // 0 = this week, -1 = last week's final slot
    if (i < 0) { i = E.length - 1; shift = -1; }

    var e = E[i];
    var eStart = e.start + shift * WEEK;
    var eEnd = e.end + shift * WEEK;
    var wk = c.weekIndex + shift;

    var j = (i + 1) % E.length;
    var nextStart = E[j].start + (shift + (j <= i ? 1 : 0)) * WEEK;
    var next = { entry: E[j], startMs: c.weekStartMs + nextStart * 1000 };

    function ms(sec) { return c.weekStartMs + sec * 1000; }

    if (c.weekSec < eEnd) {
      return {
        state: 'show', entry: e, episode: episodeFor(e, wk), episodeIndex: episodeIdx(e, wk), weekIndex: wk,
        key: 'show:' + e.start + ':' + wk,
        offset: c.weekSec - eStart, remaining: eEnd - c.weekSec,
        startMs: ms(eStart), endMs: ms(eEnd), next: next
      };
    }

    // Gap between shows
    var gapStart = eEnd;
    if (inClosedown(M, c.sod)) {
      return {
        state: 'closedown', key: 'closedown:' + e.start, next: next,
        label: M.closedown.label, remaining: nextStart - c.weekSec,
        startMs: ms(gapStart), endMs: ms(nextStart)
      };
    }
    if (M.ads.length) {
      var pos = c.weekSec - gapStart;
      var p = pos % M.adLoop;
      var ad = M.ads[0];
      for (var a = 0; a < M.ads.length; a++) { if (p >= M.ads[a]._from) ad = M.ads[a]; else break; }
      var adOffset = p - ad._from;
      var cycle = Math.floor(pos / M.adLoop);
      var adEndSec = Math.min(c.weekSec + (ad.duration - adOffset), nextStart);
      return {
        state: 'break', ad: ad, key: 'break:' + e.start + ':' + cycle + ':' + ad._from, next: next,
        offset: adOffset, remaining: adEndSec - c.weekSec,
        startMs: ms(c.weekSec - adOffset), endMs: ms(adEndSec)
      };
    }
    return {
      state: 'break', ad: null, key: 'break:' + e.start, next: next,
      offset: 0, remaining: nextStart - c.weekSec, startMs: ms(gapStart), endMs: ms(nextStart)
    };
  }

  function model_(M) { return M; }

  // The next `count` shows after now (gaps skipped), with absolute times.
  function upcoming(channel, nowMs, count) {
    var M = normalize(channel);
    var c = clock(M, nowMs);
    var out = [];
    for (var w = 0; w < 4 && out.length < count; w++) {
      for (var k = 0; k < M.entries.length && out.length < count; k++) {
        var e = M.entries[k];
        var startMs = c.weekStartMs + (e.start + w * WEEK) * 1000;
        if (startMs > nowMs) {
          out.push({ entry: e, startMs: startMs, endMs: startMs + e.ref.duration * 60000,
                     episode: episodeFor(e, c.weekIndex + w), episodeIndex: episodeIdx(e, c.weekIndex + w) });
        }
      }
    }
    return out;
  }

  var api = { locate: locate, upcoming: upcoming, normalize: normalize, _clock: function (ch, ms) { return clock(normalize(ch), ms); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TVEngine = api;
})(typeof window !== 'undefined' ? window : this);
