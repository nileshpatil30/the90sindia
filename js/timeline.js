/* ==========================================================================
   90s REWIND TV — ON THIS DAY (timeline.html)
   Draws the two views from the events in js/timeline-data-*.js, using the rules in js/timeline-core.js:
     Today     the events dated today (Indian time). On a day with none: a line that says so, then the next seven days,
               then the rest of the month, then the next event in the archive, each card with its real date.
     By year   decade chips (once two decades have events), a year rail, and the year's events: day, then month, then year only.
   The tab and the year live in the address (timeline.html?tab=year&y=1995) so a view can be shared.
   The Sources button opens a panel with publisher, link, type, publication date and the date a person opened it.
   Only events that pass every rule are drawn, even if a bad record is added by mistake (it is reported in the console).
   Nothing is stored and nothing is sent anywhere.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site, T = window.TimelineCore, out = document.getElementById('tl-out'), tabs = document.getElementById('tl-tabs');
  if (!S || !T || !out || !tabs) return;
  var esc = S.esc;

  var ALL = window.TIMELINE_EVENTS || [];
  var report = T.validateSet(ALL);
  if (report.errors.length && window.console && console.warn) console.warn('On This Day: ' + report.errors.length + ' problem(s) in the event data. Events that break a rule are not shown.\n' + report.errors.join('\n'));
  var LIVE = T.liveEvents(ALL);
  var BY_ID = {}; LIVE.forEach(function (e) { BY_ID[e.id] = e; });

  var state = T.parseState(location.search, LIVE);

  /* ---------------------------------------------------------------- a related video from the catalogue */
  var catIndex = null;
  function clipOf(ev) {
    var C = window.Catalogue;
    if (!C || !C.items || !ev.related || !ev.related.length) return null;
    if (!catIndex) { catIndex = {}; C.items.forEach(function (it) { catIndex[it.id] = it; }); }
    for (var i = 0; i < ev.related.length; i++) {
      var it = catIndex[ev.related[i]];
      if (it && it.open && it.open.type !== 'soon') return it;
    }
    return null;
  }

  /* ---------------------------------------------------------------- pieces of a card */
  function chipsHTML(ev) {
    var cl = { verified: 'tl-v', probable: 'tl-p', disputed: 'tl-d' }[ev.confidence];
    return '<div class="tl-chips"><span class="tl-chip ' + cl + '">' + T.CONFIDENCE_LABEL[ev.confidence] + '</span>' +
      '<span class="tl-chip">' + T.plural(ev.sources.length, 'source') + '</span>' +
      '<span class="tl-chip">' + esc(T.CATEGORY_LABEL[ev.category]) + '</span></div>';
  }
  function actionsHTML(ev) {
    var clip = clipOf(ev);
    return '<div class="tl-act"><button class="btn tl-btn" type="button" data-sources="' + esc(ev.id) + '" aria-label="Sources for ' + esc(ev.title) + '">Sources</button>' +
      (clip ? '<button class="btn tl-btn" type="button" data-clip="' + esc(clip.id) + '" aria-label="Watch the clip: ' + esc(clip.title) + '">Watch the clip</button>' : '') + '</div>';
  }
  function bodyHTML(ev) {
    var why = ev.confidence !== 'verified' && ev.confidenceNote ? '<p class="tl-why">Why ' + T.CONFIDENCE_LABEL[ev.confidence] + ': ' + esc(ev.confidenceNote) + '</p>' : '';
    return '<h3>' + esc(ev.title) + '</h3><p>' + esc(ev.summary) + '</p>' + why + chipsHTML(ev) + actionsHTML(ev);
  }
  // A card in the Today view: the year and how long ago, or (in the empty-day fallback) the real date and how many days away.
  function dayCard(item, today, fallback) {
    var ev = item.ev;
    var top = fallback
      ? '<span class="tl-yr tl-date">' + esc(T.fmtShort(ev.date)) + '</span><span class="tl-ago">' + esc(T.inDays(item.days)) + '</span>'
      : '<span class="tl-yr">' + ev.date.y + '</span><span class="tl-ago">' + esc(T.yearsAgo(ev.date.y, today)) + '</span>';
    return '<li class="tl-card"><header class="tl-top">' + top + '</header>' + bodyHTML(ev) + '</li>';
  }

  /* ---------------------------------------------------------------- the Today view */
  function noticeHTML(head, line) { return '<div class="tl-notice" role="note"><b>' + esc(head) + '</b><span>' + esc(line) + '</span></div>'; }
  function emptyArchive() {
    return noticeHTML(LIVE.length ? 'No event in the archive has an exact day yet.' : 'No events are published yet.',
      LIVE.length ? 'Open “By year” to see the events we have.' : 'Each event is checked against its sources before it appears here. The first ones will show up once they have been reviewed.');
  }
  function todayHTML() {
    var today = T.istToday(new Date()), v = T.dayView(LIVE, today), dm = T.fmtDayMonth(today.m, today.d);
    var count = v.step === 'today' ? T.plural(v.count, 'event') : v.step === 'none' ? 'no events yet' : 'no events on this date';
    var h = '<div class="tl-bar"><h2>' + esc(dm) + '</h2><p class="fcount" role="status" aria-live="polite">' + esc(count) + '</p></div>';
    if (v.step === 'none') return h + emptyArchive();
    if (v.step === 'today') return h + '<ul class="tl-cards" aria-label="Events on ' + esc(dm) + '">' + v.items.map(function (i) { return dayCard(i, today, false); }).join('') + '</ul>';
    var head = 'Nothing in the archive for ' + dm + '.', line;
    if (v.step === 'week') line = 'Coming up in the next seven days: ' + T.plural(v.count, 'event') + '. Each card shows its real date.';
    else if (v.step === 'month') line = 'Nothing in the next seven days. Later this month: ' + T.plural(v.count, 'event') + ', shown with their real dates.';
    else {
      var n = v.items[0].next;
      line = 'Nothing in the next seven days or later this month. The next date in the archive is ' + T.fmtDayMonth(n.m, n.d) + ', ' + T.inDays(n.days) + (v.count > 1 ? ', with ' + v.count + ' events' : '') + '.';
    }
    return h + noticeHTML(head, line) + '<ul class="tl-cards" aria-label="Coming up">' + v.items.map(function (i) { return dayCard(i, today, true); }).join('') + '</ul>';
  }

  /* ---------------------------------------------------------------- the By year view */
  function whenHTML(ev) {
    var d = ev.date;
    if (d.precision === 'day') return '<div class="tl-when">' + d.d + ' ' + T.MONTHS[d.m - 1].slice(0, 3) + '<small>exact date</small></div>';
    if (d.precision === 'month') return '<div class="tl-when">' + T.MONTHS[d.m - 1].slice(0, 3) + '<small>month only</small></div>';
    return '<div class="tl-when">Year only<small>' + d.y + '</small></div>';
  }
  function yearHTML() {
    if (!LIVE.length) return noticeHTML('No events are published yet.', 'Each event is checked against its sources before it appears here. The first ones will show up once they have been reviewed.');
    var y = state.y, dec = T.decadeOf(y), counts = T.yearCounts(LIVE), decs = T.decades(LIVE);
    var h = '';
    if (decs.length >= 2) {                                          // one chip would filter nothing
      h += '<div class="fchips tl-decades" role="group" aria-label="Decade">' + decs.map(function (d) {
        return '<button class="fchip" type="button" data-dec="' + d.decade + '" aria-pressed="' + (d.decade === dec) + '" aria-label="' + d.label + ', ' + T.plural(d.count, 'event') + '">' + d.label + ' <b>' + d.count + '</b></button>';
      }).join('') + '</div>';
    }
    h += '<div class="fchips tl-rail" id="tl-rail" role="group" aria-label="Year">' + T.yearsOfDecade(dec).map(function (yy) {
      var n = counts[yy] || 0;
      return '<button class="fchip' + (n ? '' : ' tl-empty') + '" type="button" data-year="' + yy + '" aria-pressed="' + (yy === y) + '"' + ' aria-label="' + yy + ', ' + (n ? T.plural(n, 'event') : 'no events yet') + '">' + yy + (n ? ' <b>' + n + '</b>' : '') + '</button>';
    }).join('') + '</div>';
    var list = T.inYear(LIVE, y);
    h += '<div class="tl-bar"><h2>' + y + '</h2><p class="fcount" role="status" aria-live="polite">' + esc(list.length ? T.plural(list.length, 'event') : 'no events yet') + '</p></div>';
    if (!list.length) return h + noticeHTML('Nothing in the archive for ' + y + ' yet.', 'Pick a year with a number next to it.');
    return h + '<ol class="tl-rows" aria-label="Events in ' + y + '">' + list.map(function (ev) {
      return '<li class="tl-row">' + whenHTML(ev) + '<article class="tl-card">' + bodyHTML(ev) + '</article></li>';
    }).join('') + '</ol>';
  }

  /* ---------------------------------------------------------------- draw, and keep the address in step */
  function render(focusSel) {
    [].forEach.call(tabs.querySelectorAll('[data-tab]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tab') === state.tab)); });
    out.innerHTML = state.tab === 'year' ? yearHTML() : todayHTML();
    document.title = (state.tab === 'year' && state.y ? state.y + ' — ' : '') + 'On This Day — 90s Rewind TV';
    var rail = document.getElementById('tl-rail'), cur = rail && rail.querySelector('[aria-pressed="true"]');
    if (cur && rail.scrollWidth > rail.clientWidth) rail.scrollLeft = Math.max(0, cur.offsetLeft - (rail.clientWidth - cur.offsetWidth) / 2);     // phones: bring the chosen year into view
    if (focusSel) { var f = document.querySelector(focusSel); if (f) f.focus({ preventScroll: true }); }
  }
  function go(next, focusSel) {
    state = next;
    try { history.replaceState(null, '', T.stateUrl(state)); } catch (e) { /* the view still works without it */ }
    render(focusSel);
  }
  function firstYearOf(dec) {
    var c = T.yearCounts(LIVE), ys = T.yearsOfDecade(dec).filter(function (yy) { return c[yy]; });
    return ys.length ? ys[0] : dec;
  }

  tabs.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-tab]') : null; if (!b) return;
    var tab = b.getAttribute('data-tab');
    go(tab === 'year' ? { tab: 'year', y: state.y || T.defaultYear(LIVE) } : { tab: 'today', y: state.y }, '[data-tab="' + tab + '"]');
  });
  out.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t) return;
    var src = t.closest('[data-sources]'); if (src) { openPanel(src.getAttribute('data-sources'), src); return; }
    var clip = t.closest('[data-clip]');
    if (clip) { var it = window.Catalogue && window.Catalogue.items.filter(function (x) { return x.id === clip.getAttribute('data-clip'); })[0]; if (it) S.open(it); return; }
    var dec = t.closest('[data-dec]'); if (dec) { var d = +dec.getAttribute('data-dec'); go({ tab: 'year', y: firstYearOf(d) }, '[data-dec="' + d + '"]'); return; }
    var yr = t.closest('[data-year]'); if (yr) { var y = +yr.getAttribute('data-year'); go({ tab: 'year', y: y }, '[data-year="' + y + '"]'); }
  });
  window.addEventListener('popstate', function () { state = T.parseState(location.search, LIVE); render(); closePanel(); });     // Back or Forward redraws the page, so an open panel closes with it

  /* ---------------------------------------------------------------- the Sources panel: a modal dialog
     Opening it: the rest of the page is made inert and hidden from screen readers, the page behind stops scrolling, and focus moves to the dialog itself, so a
     screen reader announces "Sources, dialog" and the event before anything else. Tab then walks Close and the links, and wraps round inside.
     Closing it (Escape, Close, or a click on the dim area) puts back exactly what was changed: focus on the button that opened it, and the scroll position. */
  var panel = null, pop = null, opener = null, openerId = '', held = null, downOnVeil = false;
  var TYPE_NOTE = '<b>The four types.</b> Primary: a government record or a company’s own statement. Authoritative: a statistical record, such as a scorecard archive. Reference: an encyclopaedia. Press: a news report.';
  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'tl-veil'; panel.hidden = true;
    panel.innerHTML = '<div class="tl-pop" id="tl-pop" role="dialog" aria-modal="true" aria-labelledby="tl-pop-h" aria-describedby="tl-pop-t" tabindex="-1">' +
      '<div class="tl-pop-h"><h2 id="tl-pop-h">Sources</h2><button class="btn tl-btn" type="button" id="tl-pop-x" aria-label="Close sources">Close</button></div>' +
      '<div class="tl-pop-b" id="tl-pop-b"></div></div>';
    document.body.appendChild(panel);
    pop = document.getElementById('tl-pop');
    document.getElementById('tl-pop-x').addEventListener('click', closePanel);
    panel.addEventListener('pointerdown', function (e) { downOnVeil = e.target === panel; });                   // a drag that starts inside the panel and ends on the dim area is not a click outside
    panel.addEventListener('click', function (e) { var outside = e.target === panel && downOnVeil; downOnVeil = false; if (outside) closePanel(); });
    panel.addEventListener('touchmove', function (e) { if (!pop.contains(e.target)) e.preventDefault(); }, { passive: false });   // older phones: do not scroll the page through the dim area
    document.addEventListener('keydown', function (e) {
      if (panel.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closePanel(); }
      else if (e.key === 'Tab') trapTab(e);
    });
    document.addEventListener('focusin', function (e) {                                                          // a browser without `inert`: pull stray focus back in
      if (!panel.hidden && !panel.contains(e.target)) pop.focus({ preventScroll: true });
    });
  }
  function stops() { return [].filter.call(pop.querySelectorAll('a[href], button:not([disabled])'), function (x) { return !x.closest('[hidden]'); }); }
  function trapTab(e) {                                                                                          // Tab and Shift+Tab wrap round inside the panel
    var f = stops(), a = document.activeElement;
    if (!f.length) { e.preventDefault(); pop.focus({ preventScroll: true }); return; }
    var first = f[0], last = f[f.length - 1];
    if (!pop.contains(a)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
    if (e.shiftKey && (a === first || a === pop)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  }
  // Everything the open panel changes outside itself is recorded here, so that closing puts it back exactly as it was.
  function holdPage() {
    var de = document.documentElement;
    var bar = window.innerWidth - de.clientWidth, pad = parseFloat(window.getComputedStyle(de).paddingRight) || 0;     // bar: the width of the page's scrollbar, 0 for overlay scrollbars
    held = { x: window.pageXOffset, y: window.pageYOffset, overflow: de.style.overflow, padRight: de.style.paddingRight, nodes: [] };
    [].forEach.call(document.body.children, function (el) {
      if (el === panel || /^(SCRIPT|STYLE|LINK|NOSCRIPT)$/.test(el.tagName)) return;
      held.nodes.push({ el: el, inert: el.hasAttribute('inert'), hidden: el.getAttribute('aria-hidden') });
      el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true');
    });
    de.style.overflow = 'hidden';                                                                                // the page behind stops scrolling; padding stands in for the scrollbar so nothing shifts
    if (bar > 0) {
      de.style.paddingRight = (pad + bar) + 'px';
      panel.style.paddingRight = ((parseFloat(window.getComputedStyle(panel).paddingRight) || 0) + bar) + 'px';        // and the panel stays centred where it was, not 7px to the right
    }
  }
  function releasePage() {
    var h = held; if (!h) return null;
    held = null;
    h.nodes.forEach(function (n) {
      if (!n.inert) n.el.removeAttribute('inert');
      if (n.hidden === null) n.el.removeAttribute('aria-hidden'); else n.el.setAttribute('aria-hidden', n.hidden);
    });
    var de = document.documentElement;
    de.style.overflow = h.overflow; de.style.paddingRight = h.padRight;
    panel.style.paddingRight = '';
    return h;
  }
  function scrollTo(x, y) {
    if (window.pageXOffset === x && window.pageYOffset === y) return;
    try { window.scrollTo({ left: x, top: y, behavior: 'instant' }); } catch (e) { window.scrollTo(x, y); }
  }
  function backToOpener() {
    var t = opener && document.contains(opener) ? opener : null;
    if (!t && openerId) [].forEach.call(out.querySelectorAll('[data-sources]'), function (b) { if (!t && b.getAttribute('data-sources') === openerId) t = b; });   // the page was redrawn: the same event's button, if it is still there
    if (!t) t = tabs.querySelector('[aria-pressed="true"]');                                                     // otherwise the open tab
    if (t && t.focus) t.focus({ preventScroll: true });
  }
  function sourceHTML(s, all) {
    var rep = s.basedOn ? all.filter(function (o) { return o.url === s.basedOn; })[0] : null;
    var line = 'Published: ' + T.fmtPublishedOn(s.publishedOn) + ' · Opened ' + T.fmtIso(s.opened) + (rep ? ' · Repeats ' + rep.publisher : '');
    return '<li class="tl-src"><b>' + esc(s.publisher) + '</b><span class="tl-chip' + (s.type === 'primary' || s.type === 'authoritative' ? ' tl-t' : '') + '"><span class="sr">Type: </span>' + T.SOURCE_TYPE_LABEL[s.type] + '</span>' +
      '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">' + esc(s.label) + '<span class="sr"> (opens in a new tab)</span></a><small>' + esc(line) + '</small></li>';
  }
  function openPanel(id, from) {
    var ev = BY_ID[id]; if (!ev) return;
    if (!panel) buildPanel();
    if (!panel.hidden) return;
    opener = from || document.activeElement; openerId = id;
    var why = ev.confidence !== 'verified' && ev.confidenceNote ? '<p class="tl-pop-why"><b>Why ' + T.CONFIDENCE_LABEL[ev.confidence] + '.</b> ' + esc(ev.confidenceNote) + '</p>' : '';
    document.getElementById('tl-pop-b').innerHTML = '<p class="tl-pop-t" id="tl-pop-t">' + esc(ev.title) + ' · ' + esc(T.fmtShort(ev.date)) + '</p>' + why +
      '<ul class="tl-srcs" role="list">' + ev.sources.map(function (s) { return sourceHTML(s, ev.sources); }).join('') + '</ul><p class="tl-key">' + TYPE_NOTE + '</p>';
    panel.hidden = false;
    holdPage();
    pop.scrollTop = 0;
    pop.focus({ preventScroll: true });
  }
  function closePanel() {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    var was = releasePage();
    backToOpener();
    if (was) scrollTo(was.x, was.y);
    opener = null; openerId = '';
  }

  render();
  window.TimelinePage = { state: function () { return { tab: state.tab, y: state.y }; }, live: function () { return LIVE.length; } };
})();
