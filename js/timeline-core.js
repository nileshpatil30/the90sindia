/* ==========================================================================
   90s REWIND TV — ON THIS DAY: THE RULES (timeline-core.js)
   Pure functions, no page code, so the tests can load this file on its own.
   The page (js/timeline.js) and tests/timeline-test.js both use these same functions, so the
   rules that are tested are the rules the page runs.

   What is in here
     dates      istToday(now)  isValidDate  daysBetween  nextOccurrence  ago/format helpers
     the rules  validateEvent(ev)  validateSet(all)  — the schema and the nine rules of the Phase 1 spec
     who shows  placement(ev)  liveEvents(all)       — where an event may appear, worked out from its fields
     views      dayView(events, today)               — events for today, or the empty-day fallback
                yearView helpers, decade list, address-bar state
     review     sampleSize(n)                        — how many entries of a batch the owner checks

   Nothing is stored. "Visible" is always derived from the fields, never kept as a field of its own.
   Works in a browser (window.TimelineCore) and in Node (module.exports).
   ========================================================================== */
(function (root) {
  'use strict';

  var MIN_YEAR = 1980, MAX_YEAR = 2010;
  var CATEGORIES = ['tv', 'music', 'film', 'cricket', 'news', 'tech', 'ads', 'prices', 'society'];
  var CATEGORY_LABEL = { tv: 'TV', music: 'Music', film: 'Film', cricket: 'Cricket', news: 'News', tech: 'Tech', ads: 'Ads', prices: 'Prices', society: 'Society' };
  var CONFIDENCE = ['verified', 'probable', 'disputed'];
  var CONFIDENCE_LABEL = { verified: 'Verified', probable: 'Probable', disputed: 'Disputed' };
  var SOURCE_TYPES = ['primary', 'authoritative', 'reference', 'press'];
  var SOURCE_TYPE_LABEL = { primary: 'Primary', authoritative: 'Authoritative', reference: 'Reference', press: 'Press' };
  var SENSITIVITY = ['standard', 'review'];
  var SENSITIVITY_REASONS = ['political', 'communal', 'violence', 'tragedy', 'military', 'legal', 'privacy', 'other'];
  var PRECISIONS = ['day', 'month', 'year'];
  var REVIEW_MODES = ['individual', 'sampled'];
  var INDIVIDUAL_FIRST = 20;                       // rule 8: sampled batches only after this many individual approvals
  var SUPERLATIVES = /\b(first|biggest|only|largest)\b/i;

  var EVENT_KEYS = ['id', 'date', 'title', 'summary', 'category', 'confidence', 'confidenceNote', 'sources', 'sensitivity', 'sensitivityReason',
    'sensitivityApprovedBy', 'sensitivityApprovedOn', 'related', 'ticker', 'reviewedBy', 'reviewedOn', 'reviewMode', 'reviewBatch', 'published'];
  var SOURCE_KEYS = ['publisher', 'label', 'url', 'type', 'publishedOn', 'opened', 'basedOn'];
  var DATE_KEYS = ['y', 'm', 'd', 'precision'];

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MON = MONTHS.map(function (m) { return m.slice(0, 3); });

  /* ------------------------------------------------------------------ small helpers */
  function has(a, v) { return a.indexOf(v) >= 0; }
  function isInt(n) { return typeof n === 'number' && isFinite(n) && Math.floor(n) === n; }
  function str(s) { return typeof s === 'string' ? s.trim() : ''; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }

  /* ------------------------------------------------------------------ dates */
  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function daysInMonth(y, m) { return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]; }
  function isValidDate(y, m, d) { return isInt(y) && isInt(m) && isInt(d) && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m); }
  function dayNumber(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 86400000); }
  function daysBetween(a, b) { return dayNumber(b.y, b.m, b.d) - dayNumber(a.y, a.m, a.d); }
  function isoDate(s) {                                   // 'YYYY-MM-DD' that is a real calendar day
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    return !!m && isValidDate(+m[1], +m[2], +m[3]);
  }
  function publishedOnOk(s) {                             // 'YYYY', 'YYYY-MM', 'YYYY-MM-DD' or 'undated'
    if (s === 'undated') return true;
    var m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(s || '');
    if (!m) return false;
    if (m[3]) return isValidDate(+m[1], +m[2], +m[3]);
    if (m[2]) return +m[2] >= 1 && +m[2] <= 12;
    return true;
  }
  // "Today" is the date in India, not the visitor's time zone. India has no summer time, so a fixed +5:30 is exact.
  function istToday(now) {
    var t = new Date((now || new Date()).getTime() + 330 * 60000);
    return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
  }
  // The next real calendar day, on or after `today`, on which this month and day fall. 29 February waits for the next leap year.
  function nextOccurrence(date, today) {
    for (var y = today.y; y <= today.y + 8; y++) {
      if (!isValidDate(y, date.m, date.d)) continue;
      var days = daysBetween(today, { y: y, m: date.m, d: date.d });
      if (days >= 0) return { y: y, m: date.m, d: date.d, days: days };
    }
    return null;
  }
  function fmtDayMonth(m, d) { return d + ' ' + MONTHS[m - 1]; }                         // 24 July
  function fmtShort(date) {                                                                // 24 Jul 1991 · Jul 1991 · 1991
    if (date.precision === 'year') return String(date.y);
    if (date.precision === 'month') return MON[date.m - 1] + ' ' + date.y;
    return date.d + ' ' + MON[date.m - 1] + ' ' + date.y;
  }
  function fmtIso(s) {                                                                     // opened / reviewed dates
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    return m ? (+m[3]) + ' ' + MON[+m[2] - 1] + ' ' + m[1] : String(s || '');
  }
  function fmtPublishedOn(s) {
    if (s === 'undated') return 'no date on the page';
    var m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(s || '');
    if (!m) return '';
    if (m[3]) return (+m[3]) + ' ' + MON[+m[2] - 1] + ' ' + m[1];
    if (m[2]) return MON[+m[2] - 1] + ' ' + m[1];
    return m[1];
  }
  function yearsAgo(y, today) { return plural(today.y - y, 'year') + ' ago'; }
  function inDays(n) { return 'in ' + plural(n, 'day'); }
  function decadeOf(y) { return Math.floor(y / 10) * 10; }

  /* ------------------------------------------------------------------ the schema and the nine rules */
  function dateErrors(date, w, out) {
    if (!date || typeof date !== 'object') { out.push(w + 'date is missing'); return; }
    Object.keys(date).forEach(function (k) { if (!has(DATE_KEYS, k)) out.push(w + 'date has an unknown field "' + k + '"'); });
    if (!has(PRECISIONS, date.precision)) { out.push(w + 'date.precision must be day, month or year'); return; }
    if (!isInt(date.y) || date.y < MIN_YEAR || date.y > MAX_YEAR) { out.push(w + 'date.y must be a year from ' + MIN_YEAR + ' to ' + MAX_YEAR); return; }
    if (date.precision === 'year') {
      if (date.m !== undefined || date.d !== undefined) out.push(w + 'a year-only date must not have m or d');
    } else if (date.precision === 'month') {
      if (!isInt(date.m) || date.m < 1 || date.m > 12) out.push(w + 'date.m must be 1 to 12');
      if (date.d !== undefined) out.push(w + 'a month-only date must not have d');
    } else if (!isValidDate(date.y, date.m, date.d)) {
      out.push(w + 'date is not a real calendar day (' + date.y + '-' + date.m + '-' + date.d + ')');
    }
  }
  function idMatchesDate(id, date) {
    if (!date || !has(PRECISIONS, date.precision) || !isInt(date.y)) return false;
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    var prefix = date.precision === 'day' ? date.y + '-' + p(date.m) + '-' + p(date.d) + '-'
      : date.precision === 'month' ? date.y + '-' + p(date.m) + '-' : date.y + '-';
    return id.indexOf(prefix) === 0 && /^[a-z][a-z0-9-]*$/.test(id.slice(prefix.length));
  }
  // Sources that count towards "independent": not based on another listed source.
  function independentSources(sources) {
    var urls = sources.map(function (s) { return s && s.url; });
    return sources.filter(function (s) { return s && !(s.basedOn && s.basedOn !== s.url && has(urls, s.basedOn)); });
  }
  function distinctPublishers(list) {
    var seen = {}, n = 0;
    list.forEach(function (s) { var k = str(s.publisher).toLowerCase(); if (k && !seen[k]) { seen[k] = 1; n++; } });
    return n;
  }

  // Returns { errors: [...], warnings: [...] }. Every message starts with the id so a test shows which entry to fix.
  function validateEvent(ev) {
    var errors = [], warnings = [];
    if (!ev || typeof ev !== 'object') return { errors: ['an event is not an object'], warnings: warnings };
    var w = (typeof ev.id === 'string' && ev.id ? ev.id : '(no id)') + ': ';
    var published = ev.published === true;

    Object.keys(ev).forEach(function (k) { if (!has(EVENT_KEYS, k)) errors.push(w + 'unknown field "' + k + '"'); });
    if (typeof ev.published !== 'boolean') errors.push(w + 'published must be true or false');
    if (ev.ticker !== undefined && typeof ev.ticker !== 'boolean') errors.push(w + 'ticker must be true or false');

    // id, date
    if (typeof ev.id !== 'string' || !ev.id) errors.push(w + 'id is missing');
    dateErrors(ev.date, w, errors);
    if (typeof ev.id === 'string' && ev.id && ev.date && !idMatchesDate(ev.id, ev.date)) errors.push(w + 'id does not match the date (day: YYYY-MM-DD-slug, month: YYYY-MM-slug, year: YYYY-slug; the slug starts with a letter)');

    // words
    if (!str(ev.title)) errors.push(w + 'title is missing'); else if (ev.title.length > 80) errors.push(w + 'title is ' + ev.title.length + ' characters (80 at most)');
    if (!str(ev.summary)) errors.push(w + 'summary is missing'); else if (ev.summary.length > 280) errors.push(w + 'summary is ' + ev.summary.length + ' characters (280 at most)');
    if (!has(CATEGORIES, ev.category)) errors.push(w + 'category must be one of ' + CATEGORIES.join(', '));
    if (!has(CONFIDENCE, ev.confidence)) errors.push(w + 'confidence must be verified, probable or disputed');
    if (ev.confidenceNote !== undefined && typeof ev.confidenceNote !== 'string') errors.push(w + 'confidenceNote must be text');
    if (ev.related !== undefined && !(Array.isArray(ev.related) && ev.related.every(function (r) { return typeof r === 'string' && r; }))) errors.push(w + 'related must be a list of catalogue ids');

    // sources: structure always, completeness when published (rule 6)
    var sources = Array.isArray(ev.sources) ? ev.sources : null;
    if (!sources || !sources.length) errors.push(w + 'at least one source is needed');
    (sources || []).forEach(function (s, i) {
      var sw = w + 'source ' + (i + 1) + ': ';
      if (!s || typeof s !== 'object') { errors.push(sw + 'is not an object'); return; }
      Object.keys(s).forEach(function (k) { if (!has(SOURCE_KEYS, k)) errors.push(sw + 'unknown field "' + k + '"'); });
      if (!str(s.publisher)) errors.push(sw + 'publisher is missing');
      if (!str(s.label)) errors.push(sw + 'label is missing');
      if (!/^https:\/\/[^\s\/$.?#][^\s]*$/.test(s.url || '') || s.url.length > 2000) errors.push(sw + 'url must be an https link');
      if (!has(SOURCE_TYPES, s.type)) errors.push(sw + 'type must be primary, authoritative, reference or press');
      if (!isoDate(s.opened)) errors.push(sw + 'opened must be the date a person opened the page (YYYY-MM-DD)');
      if (s.publishedOn === undefined || s.publishedOn === '') { if (published) errors.push(sw + 'publishedOn is required to publish (a date, or "undated" when the page has none)'); }
      else if (!publishedOnOk(s.publishedOn)) errors.push(sw + 'publishedOn must be YYYY, YYYY-MM, YYYY-MM-DD or "undated"');
      if (s.basedOn !== undefined) {
        var others = sources.filter(function (o, j) { return j !== i && o && o.url === s.basedOn; });
        if (!others.length) errors.push(sw + 'basedOn must be the link of another source listed on this event');
      }
    });

    // sensitivity (separate from category)
    if (!has(SENSITIVITY, ev.sensitivity)) errors.push(w + 'sensitivity must be standard or review');
    if (ev.sensitivityReason !== undefined && ev.sensitivityReason !== '' && !has(SENSITIVITY_REASONS, ev.sensitivityReason)) errors.push(w + 'sensitivityReason must be one of ' + SENSITIVITY_REASONS.join(', '));
    if (ev.sensitivity === 'review') {
      if (!has(SENSITIVITY_REASONS, ev.sensitivityReason)) errors.push(w + 'a review event needs a sensitivityReason (rule 7)');          // rule 7
      if (published) {
        if (!str(ev.sensitivityApprovedBy) || !isoDate(ev.sensitivityApprovedOn)) errors.push(w + 'a review event cannot be published until sensitivityApprovedBy and sensitivityApprovedOn are filled (rule 7)');
        if (ev.reviewMode !== 'individual') errors.push(w + 'a review event needs reviewMode: individual (rule 7)');
      }
    }

    // review record
    if (ev.reviewMode !== undefined && ev.reviewMode !== '' && !has(REVIEW_MODES, ev.reviewMode)) errors.push(w + 'reviewMode must be individual or sampled');
    if (ev.reviewedOn !== undefined && ev.reviewedOn !== '' && !isoDate(ev.reviewedOn)) errors.push(w + 'reviewedOn must be YYYY-MM-DD');
    if (ev.reviewMode === 'sampled' && !/^B\d{3}$/.test(ev.reviewBatch || '')) errors.push(w + 'a sampled entry needs a reviewBatch such as B001 (rule 8)');
    if (published) {                                                                                                                                // rule 5
      if (!str(ev.reviewedBy)) errors.push(w + 'published needs reviewedBy (rule 5)');
      if (!isoDate(ev.reviewedOn)) errors.push(w + 'published needs reviewedOn (rule 5)');
      if (!has(REVIEW_MODES, ev.reviewMode)) errors.push(w + 'published needs reviewMode (rule 5)');
    }

    // rules 1 to 4: confidence
    var good = Array.isArray(ev.sources) ? ev.sources.filter(function (s) { return s && typeof s === 'object'; }) : [];
    if (ev.confidence === 'verified') {                                                                                                             // rule 1
      var ind = independentSources(good);
      if (distinctPublishers(ind) < 2) errors.push(w + 'verified needs two or more independent sources (different publishers, none based on another listed source) (rule 1)');
      if (!ind.some(function (s) { return s.type === 'primary' || s.type === 'authoritative'; })) errors.push(w + 'verified needs at least one independent primary or authoritative source (rule 1)');
    }
    if (ev.confidence === 'probable') {                                                                                                             // rule 2
      if (!good.length) errors.push(w + 'probable needs one or more sources (rule 2)');
      if (ev.ticker === true) errors.push(w + 'a probable event can never be in the ticker (rule 2)');
    }
    if (ev.confidence === 'disputed') {                                                                                                             // rule 3
      if (!str(ev.confidenceNote)) errors.push(w + 'disputed needs a confidenceNote (rule 3)');
      if (ev.date && ev.date.precision === 'day') errors.push(w + 'disputed cannot have day precision (rule 3)');
      if (ev.ticker === true) errors.push(w + 'a disputed event can never be in the ticker (rule 3)');
      if (published && ev.reviewMode !== 'individual') errors.push(w + 'disputed needs reviewMode: individual (rule 3)');
    }
    if (ev.ticker === true) {                                                                                                                       // rule 4
      if (ev.confidence !== 'verified') errors.push(w + 'only Verified events can be in the ticker (rule 4)');
      if (!ev.date || ev.date.precision !== 'day') errors.push(w + 'a ticker event needs day precision (rule 4)');
      if (ev.sensitivity !== 'standard') errors.push(w + 'a ticker event needs standard sensitivity (rule 4)');
      if (!published) errors.push(w + 'a ticker event needs published: true (rule 4)');
    }

    // rule 9: superlatives need their own source (a warning for the reviewer, not a failure)
    [['title', ev.title], ['summary', ev.summary]].forEach(function (p) {
      var m = typeof p[1] === 'string' ? SUPERLATIVES.exec(p[1]) : null;
      if (m) warnings.push(w + p[0] + ' says "' + m[1].toLowerCase() + '": confirm a listed source says so, or leave the word out (rule 9)');
    });
    return { errors: errors, warnings: warnings };
  }

  // The checks that need the whole list: unique ids, and rule 8 (sampled only after 20 individual approvals).
  function validateSet(all) {
    var errors = [], warnings = [], ids = {};
    (all || []).forEach(function (ev) {
      var r = validateEvent(ev);
      errors.push.apply(errors, r.errors); warnings.push.apply(warnings, r.warnings);
      if (ev && typeof ev.id === 'string') { if (ids[ev.id]) errors.push(ev.id + ': id is used twice'); ids[ev.id] = 1; }
    });
    var individual = (all || []).filter(function (e) { return e && e.published === true && e.reviewMode === 'individual'; }).length;
    (all || []).forEach(function (e) {
      if (e && e.published === true && e.reviewMode === 'sampled' && individual < INDIVIDUAL_FIRST) {
        errors.push(e.id + ': sampled review is allowed only after ' + INDIVIDUAL_FIRST + ' published events were approved individually (now ' + individual + ') (rule 8)');
      }
    });
    return { errors: errors, warnings: warnings };
  }

  /* ------------------------------------------------------------------ who may be seen, and where */
  // Defence in depth: the page shows only events that pass every rule, even if a bad record slipped into a data file.
  function liveEvents(all) {
    var seen = {};
    var ok = (all || []).filter(function (e) {
      if (!e || e.published !== true || validateEvent(e).errors.length) return false;
      if (seen[e.id]) return false;
      seen[e.id] = 1; return true;
    });
    var individual = ok.filter(function (e) { return e.reviewMode === 'individual'; }).length;
    if (individual < INDIVIDUAL_FIRST) ok = ok.filter(function (e) { return e.reviewMode !== 'sampled'; });
    return ok;
  }
  // The visibility table of the spec, worked out from the fields. Assumes the event is live (see liveEvents).
  function placement(ev) {
    var day = ev.date.precision === 'day';
    if (ev.confidence === 'verified') return { year: true, today: day, ticker: day && ev.ticker === true && ev.sensitivity === 'standard' };
    if (ev.confidence === 'probable') return { year: true, today: day, ticker: false };
    return { year: true, today: false, ticker: false };                                      // disputed: the year view only
  }
  function sampleSize(n) { return Math.min(n, Math.max(3, Math.ceil(n * 0.2))); }          // the greater of 3 or 20%, rounded up

  /* ------------------------------------------------------------------ the Today view and the empty-day fallback */
  function byYearThenTitle(a, b) { return a.ev.date.y - b.ev.date.y || (a.ev.title < b.ev.title ? -1 : a.ev.title > b.ev.title ? 1 : 0); }
  function byDaysThenYear(a, b) { return a.days - b.days || byYearThenTitle(a, b); }

  // step: 'today' (events on this date) · 'week' (next seven days) · 'month' (later this month) · 'next' (next event in the archive) · 'none' (the archive is empty)
  // items: { ev, days, next } where next is the real date of the coming anniversary and days is the count until it.
  function dayView(events, today) {
    var pool = events.filter(function (e) { return placement(e).today; });
    var here = pool.filter(function (e) { return e.date.m === today.m && e.date.d === today.d; }).map(function (e) { return { ev: e, days: 0, next: { y: today.y, m: today.m, d: today.d, days: 0 } }; }).sort(byYearThenTitle);
    if (here.length) return { step: 'today', items: here, count: here.length };
    if (!pool.length) return { step: 'none', items: [], count: 0 };
    var later = pool.map(function (e) { var n = nextOccurrence(e.date, today); return n ? { ev: e, days: n.days, next: n } : null; })
      .filter(function (x) { return x && x.days >= 1; }).sort(byDaysThenYear);
    var week = later.filter(function (x) { return x.days <= 7; });
    if (week.length) return { step: 'week', items: week, count: week.length };
    var month = later.filter(function (x) { return x.next.y === today.y && x.next.m === today.m; });
    if (month.length) return { step: 'month', items: month, count: month.length };
    if (!later.length) return { step: 'none', items: [], count: 0 };
    var nextDays = later[0].days;
    var next = later.filter(function (x) { return x.days === nextDays; });
    return { step: 'next', items: next, count: next.length };
  }

  /* ------------------------------------------------------------------ the By year view */
  var RANK = { day: 0, month: 1, year: 2 };
  function inYear(events, y) {                       // day events first, then month, then year only; each in date order
    return events.filter(function (e) { return placement(e).year && e.date.y === y; }).sort(function (a, b) {
      return RANK[a.date.precision] - RANK[b.date.precision] || (a.date.m || 0) - (b.date.m || 0) || (a.date.d || 0) - (b.date.d || 0) || (a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
    });
  }
  function yearCounts(events) {
    var c = {};
    events.forEach(function (e) { if (placement(e).year) c[e.date.y] = (c[e.date.y] || 0) + 1; });
    return c;
  }
  // A decade appears once its first reviewed event is live.
  function decades(events) {
    var c = yearCounts(events), d = {};
    Object.keys(c).forEach(function (y) { var k = decadeOf(+y); d[k] = (d[k] || 0) + c[y]; });
    return Object.keys(d).map(Number).sort(function (a, b) { return a - b; }).map(function (k) { return { decade: k, label: k + 's', count: d[k] }; });
  }
  function yearsOfDecade(dec) {
    var out = [];
    for (var y = dec; y < dec + 10; y++) if (y >= MIN_YEAR && y <= MAX_YEAR) out.push(y);
    return out;
  }
  // The 1990s are the launch collection, so they open first when they have events; otherwise the earliest decade with events.
  function defaultYear(events) {
    var c = yearCounts(events), ys = Object.keys(c).map(Number).sort(function (a, b) { return a - b; });
    if (!ys.length) return null;
    var nineties = ys.filter(function (y) { return decadeOf(y) === 1990; });
    var pool = nineties.length ? nineties : ys.filter(function (y) { return decadeOf(y) === decadeOf(ys[0]); });
    return pool[0];
  }

  /* ------------------------------------------------------------------ the address bar: timeline.html?tab=year&y=1992 */
  function parseState(search, events) {
    var q = {}, s = String(search || '').replace(/^\?/, '');
    s.split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('='), k = i < 0 ? kv : kv.slice(0, i), v = i < 0 ? '' : kv.slice(i + 1).replace(/\+/g, ' ');
      try { v = decodeURIComponent(v); } catch (e) { v = ''; }                // a broken address falls back to the default view
      q[k] = v;
    });
    if (q.tab !== 'year') return { tab: 'today', y: null };
    var y = /^\d{4}$/.test(q.y || '') ? +q.y : NaN;
    if (!(y >= MIN_YEAR && y <= MAX_YEAR)) y = defaultYear(events);
    return { tab: 'year', y: y };
  }
  function stateUrl(st) { return st.tab === 'year' ? 'timeline.html?tab=year' + (st.y ? '&y=' + st.y : '') : 'timeline.html'; }

  var api = {
    MIN_YEAR: MIN_YEAR, MAX_YEAR: MAX_YEAR, CATEGORIES: CATEGORIES, CATEGORY_LABEL: CATEGORY_LABEL, CONFIDENCE: CONFIDENCE, CONFIDENCE_LABEL: CONFIDENCE_LABEL,
    SOURCE_TYPES: SOURCE_TYPES, SOURCE_TYPE_LABEL: SOURCE_TYPE_LABEL, SENSITIVITY: SENSITIVITY, SENSITIVITY_REASONS: SENSITIVITY_REASONS, INDIVIDUAL_FIRST: INDIVIDUAL_FIRST,
    MONTHS: MONTHS,
    isLeap: isLeap, daysInMonth: daysInMonth, isValidDate: isValidDate, daysBetween: daysBetween, istToday: istToday, nextOccurrence: nextOccurrence,
    fmtDayMonth: fmtDayMonth, fmtShort: fmtShort, fmtIso: fmtIso, fmtPublishedOn: fmtPublishedOn, yearsAgo: yearsAgo, inDays: inDays, plural: plural, decadeOf: decadeOf,
    validateEvent: validateEvent, validateSet: validateSet, independentSources: independentSources,
    liveEvents: liveEvents, placement: placement, sampleSize: sampleSize,
    dayView: dayView, inYear: inYear, yearCounts: yearCounts, decades: decades, yearsOfDecade: yearsOfDecade, defaultYear: defaultYear,
    parseState: parseState, stateUrl: stateUrl
  };
  root.TimelineCore = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
