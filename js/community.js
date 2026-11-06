/* ==========================================================================
   90s REWIND TV — COMMUNITY PAGE (community.html)
   forum      look-only preview of sample topics (js/community-data.js). Nothing can be posted yet.
   memories   saved ONLY in this browser (localStorage). Text is escaped before it is shown, length-limited and capped.
              Nothing is sent anywhere. To share memories between visitors a backend is needed (docs/backend-options.md).
   polls      every poll in js/poll-data.js, one vote each, through Engage (js/engage.js)
   trivia     the Trivia Challenge, through Engage
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site, E = window.Engage, D = window.COMMUNITY || {};
  if (!S) return;
  var $ = S.$, esc = S.esc, store = S.store;

  /* ---------------------------------------------------------------- forum (look only) */
  (function forum() {
    var topics = D.topics || [], cats = D.forumCats || [], cat = 'all';
    var catLabel = function (id) { var c = cats.filter(function (x) { return x.id === id; })[0]; return c ? c.label : id; };
    function draw() {
      var list = topics.filter(function (t) { return cat === 'all' || t.cat === cat; });
      $('f-cats').innerHTML = cats.map(function (c) {
        var n = c.id === 'all' ? topics.length : topics.filter(function (t) { return t.cat === c.id; }).length;
        return n ? '<button class="fchip" type="button" data-cat="' + esc(c.id) + '" aria-pressed="' + (c.id === cat) + '">' + esc(c.label) + '<b>' + n + '</b></button>' : '';
      }).join('');
      $('f-list').innerHTML = list.length ? list.map(function (t) {
        return '<li class="cm-topic"><span class="cm-n" aria-label="' + t.n + ' replies"><b>' + t.n + '</b><small>replies</small></span>' +
          '<span class="cm-t"><b>' + esc(t.t) + '</b><small><span class="gtag">' + esc(catLabel(t.cat)) + '</span> started by ' + esc(t.by) + ' · ' + esc(t.when) + (t.hot ? ' · <i class="cm-hot">Hot</i>' : '') + '</small></span>' +
          '<span class="stat stat-soon cm-s">SAMPLE</span></li>';
      }).join('') : '<li class="load-err">No topics here yet.</li>';
    }
    $('f-cats').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cat]'); if (!b) return;
      cat = b.getAttribute('data-cat'); draw();
      var cur = $('f-cats').querySelector('[aria-pressed="true"]'); if (cur) cur.focus({ preventScroll: true });
    });
    $('f-new').addEventListener('click', function () {
      var m = $('f-msg');
      m.textContent = 'Starting topics opens when the forum goes live. It needs member accounts and an online place to keep the posts. Until then, tell us your idea through Submit or Contact on the About page.';
      m.hidden = false;
    });
    draw();
  })();

  /* ---------------------------------------------------------------- memories (this browser only) */
  (function memories() {
    var KEY = 'community.memories.v1', MAX = 30, MIN_LEN = 10, MAX_LEN = 500;
    var mem = [];                                           // used if the browser blocks localStorage
    function load() {
      var raw = store.get(KEY), arr = [];
      try { arr = JSON.parse(raw || '[]'); } catch (e) { arr = []; }
      if (!Array.isArray(arr)) arr = [];
      // keep only well-formed entries, whatever was in storage
      var clean = arr.filter(function (m) { return m && typeof m.text === 'string' && m.text.length >= 1 && typeof m.id === 'string'; })
        .map(function (m) { return { id: m.id.slice(0, 40), name: String(m.name || '').slice(0, 30), year: /^\d{4}$/.test(m.year) ? m.year : '', text: m.text.slice(0, MAX_LEN), at: +m.at || 0 }; });
      return raw == null ? mem.slice() : clean;           // raw == null: nothing stored (or storage blocked), so use the in-page copy
    }
    function save(list) { mem = list.slice(); return store.set(KEY, JSON.stringify(list)); }
    var list = load();
    var clean = function (s) { return String(s || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim(); };

    function line(m, mine) {
      return '<li class="cm-mem"><p>' + esc(m.text) + '</p><footer><span>' + esc(m.name || 'Anonymous') + (m.year ? ' · ' + esc(m.year) : '') + '</span>' +
        (mine ? '<button class="cm-del" type="button" data-id="' + esc(m.id) + '" aria-label="Delete this memory">Delete</button>' : '') + '</footer></li>';
    }
    function draw() {
      $('m-mine').innerHTML = list.length ? list.slice().reverse().map(function (m) { return line(m, true); }).join('') : '<li class="cm-empty">Nothing saved yet. Write your first memory on the left.</li>';
      $('m-count').textContent = list.length ? '(' + list.length + ' of ' + MAX + ')' : '';
      $('m-clear-wrap').hidden = !list.length;
      $('m-sample').innerHTML = (D.memories || []).map(function (m) { return line(m, false); }).join('');
    }
    var text = $('m-text'), left = $('m-left'), err = $('m-err'), prompts = D.memoryPrompts || [];
    function count() { left.textContent = MAX_LEN - text.value.length; }
    text.addEventListener('input', count);
    if (prompts.length) $('m-prompt').textContent = 'Need an idea? ' + prompts[Math.floor(Date.now() / 86400000) % prompts.length] + '.';
    function fail(m) { err.textContent = m; err.hidden = false; }

    $('m-form').addEventListener('submit', function (e) {
      e.preventDefault(); err.hidden = true;
      var t = clean(text.value), name = clean($('m-name').value).slice(0, 30), year = clean($('m-year').value);
      if (t.length < MIN_LEN) { fail('Please write a little more (at least ' + MIN_LEN + ' characters).'); text.focus(); return; }
      if (t.length > MAX_LEN) { fail('That is too long. Please keep it under ' + MAX_LEN + ' characters.'); text.focus(); return; }
      if (year && (!/^\d{4}$/.test(year) || +year < 1985 || +year > 2005)) { fail('If you add a year, use four digits between 1985 and 2005, for example 1996.'); $('m-year').focus(); return; }
      if (list.length >= MAX) { fail('You have saved ' + MAX + ' memories, the most this page keeps. Delete one to make room.'); return; }
      if (list.length && list[list.length - 1].text === t) { fail('You already saved exactly that one.'); return; }
      var id = 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      list.push({ id: id, name: name, year: year, text: t, at: Date.now() });
      if (!save(list)) S.toast('Your browser is not saving data, so this memory will disappear when you leave the page.');
      text.value = ''; $('m-name').value = ''; $('m-year').value = ''; count(); draw();
      S.toast('Saved on this device.');
    });
    $('m-mine').addEventListener('click', function (e) {
      var b = e.target.closest('.cm-del'); if (!b) return;
      var id = b.getAttribute('data-id');
      list = list.filter(function (m) { return m.id !== id; }); save(list); draw();
      var next = $('m-mine').querySelector('.cm-del'); (next || text).focus({ preventScroll: true });
    });
    var armed = 0;
    $('m-clear').addEventListener('click', function () {                          // two clicks, no pop-up box
      var b = $('m-clear');
      if (!armed) { armed = setTimeout(function () { armed = 0; b.textContent = 'Remove all of mine'; }, 4000); b.textContent = 'Click again to remove all'; return; }
      clearTimeout(armed); armed = 0; b.textContent = 'Remove all of mine';
      list = []; save(list); draw(); text.focus({ preventScroll: true });
    });
    draw();
  })();

  /* ---------------------------------------------------------------- polls */
  (function polls() {
    var box = $('p-list');
    if (!E || !E.polls.length) { box.innerHTML = '<p class="load-err">The polls could not be loaded.</p>'; return; }
    var today = E.dailyPoll();
    var order = E.polls.slice().sort(function (a, b) { return (b === today) - (a === today); });          // today's poll first
    box.innerHTML = order.map(function (p) {
      return '<section class="panel cm-poll" aria-labelledby="pq-' + esc(p.id) + '"><header class="panel-h"><h3 id="pq-' + esc(p.id) + '">' + esc(p.q) + '</h3>' + (p === today ? '<span class="stat stat-web">TODAY’S POLL</span>' : '') + '</header>' +
        '<form class="panel-b cm-pf" id="pf-' + esc(p.id) + '"><div class="cm-popts" id="po-' + esc(p.id) + '"></div><div class="cm-pa"><button class="btn" type="submit" id="pb-' + esc(p.id) + '">Vote!</button><small class="cm-pn" id="pn-' + esc(p.id) + '" role="status"></small></div></form></section>';
    }).join('');
    order.forEach(function (p) {
      E.poll.bind({ form: $('pf-' + p.id), box: $('po-' + p.id), btn: $('pb-' + p.id), note: $('pn-' + p.id) }, p, { compact: false });
    });
  })();

  /* ---------------------------------------------------------------- trivia */
  (function trivia() {
    var el = $('tg');
    if (!E || !(window.TRIVIA || []).length) { el.innerHTML = '<p class="load-err">The questions could not be loaded.</p>'; return; }
    E.trivia.game(el);
    $('tg-note').innerHTML = '<b>' + window.TRIVIA.length + ' questions</b> so far, from TV, ads, cricket, WWF, movies and games. Your best score is kept on this device only.';
  })();
})();
