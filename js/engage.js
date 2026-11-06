/* ==========================================================================
   90s REWIND TV — POLLS AND TRIVIA (shared by the homepage and the community page)
   Needs js/site.js, js/poll-data.js and js/trivia-data.js.

   Engage.backend        where votes are kept. Today: THIS BROWSER ONLY (localStorage), one vote per poll.
                         To use a server later, replace the three functions (mine, vote, counts) with calls to it;
                         they already return promises, and no page code changes. See docs/backend-options.md.
   Engage.dailyPoll()    today's poll (the polls take turns, by Indian date)
   Engage.poll.bind(nodes, poll, opts)    draws a poll into existing elements and handles the vote
   Engage.trivia.compact(nodes)           the small multiple-choice trivia panel on the homepage
   Engage.trivia.game(el)                 the Trivia Challenge: a round of questions with a score and a best score
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site;
  if (!S) return;
  var esc = S.esc, store = S.store;
  var POLLS = window.POLLS || [], TRIVIA = window.TRIVIA || [], CATS = window.TRIVIA_CATS || {};
  var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

  /* ---------- the backend (temporary: this browser only) ---------- */
  var mem = {};                                         // used if the browser blocks localStorage
  var KEY = function (id) { return 'home.poll.' + id; };
  var backend = {
    name: 'browser',
    mine: function (id) {
      var v = store.get(KEY(id)); if (v == null) v = mem[id];
      v = v == null ? -1 : parseInt(v, 10);
      return v >= 0 ? v : null;
    },
    vote: function (id, i) {
      mem[id] = i;
      var saved = store.set(KEY(id), String(i));
      return Promise.resolve({ ok: true, saved: saved });
    },
    // the numbers to draw: the sample numbers from js/poll-data.js plus this browser's own vote
    counts: function (poll) {
      var c = poll.seed.slice(), m = backend.mine(poll.id);
      if (m != null && c[m] != null) c[m] += 1;
      return Promise.resolve({ counts: c, sample: true });
    }
  };

  var istDay = function () { return Math.floor((Date.now() + 19800000) / 86400000); };
  function dailyPoll() { return POLLS.length ? POLLS[istDay() % POLLS.length] : null; }

  /* ---------- polls ----------
     nodes = { form, box, btn, note (optional) }      opts.compact = the small homepage look */
  function pollBind(nodes, poll, opts) {
    opts = opts || {};
    var box = nodes.box, btn = nodes.btn, form = nodes.form, note = nodes.note, name = 'poll-' + poll.id;
    function results(mine) {
      return backend.counts(poll).then(function (r) {
        var counts = r.counts, total = counts.reduce(function (a, b) { return a + b; }, 0), max = Math.max.apply(null, counts) || 1;
        box.innerHTML = poll.options.map(function (o, i) {
          var pc = total ? Math.round(counts[i] / total * 100) : 0, tick = i === mine ? ' ✓' : '';
          if (opts.compact) return '<span class="res" title="' + fmt(counts[i]) + ' votes"><i style="width:' + Math.round(counts[i] / max * 100) + '%"></i>' + esc(o) + ' ' + pc + '%' + tick + '<span class="sr"> (' + fmt(counts[i]) + ' votes)</span></span>';
          return '<div class="pres' + (i === mine ? ' is-mine' : '') + '"><span class="pl">' + esc(o) + tick + '</span><span class="pbar" aria-hidden="true"><i style="width:' + Math.round(counts[i] / max * 100) + '%"></i></span><span class="pn"><b>' + pc + '%</b> · ' + fmt(counts[i]) + ' votes</span></div>';
        }).join('');
        btn.textContent = 'Thanks!'; btn.disabled = true;
        if (note) note.textContent = fmt(total) + ' votes' + (r.sample ? ' · sample + yours' : '');
      }, function () { box.innerHTML = '<p class="load-err">The results could not be loaded.</p>'; });
    }
    function choices() {
      box.innerHTML = poll.options.map(function (o, i) {
        return '<label><input type="radio" name="' + esc(name) + '" value="' + i + '"><span>' + esc(o) + '</span></label>';
      }).join('');
      btn.textContent = 'Vote!'; btn.disabled = false;
      if (note) note.textContent = '';
    }
    var mine = backend.mine(poll.id);
    if (mine != null && poll.options[mine]) { results(mine); return { voted: true }; }
    choices();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      var c = box.querySelector('input:checked');
      if (!c) { S.toast('Pick an answer first, then Vote!'); return; }
      var i = parseInt(c.value, 10);
      backend.vote(poll.id, i).then(function (r) {
        if (r && r.saved === false) S.toast('Your browser is not saving data, so this vote will not be remembered.');
        return results(i);
      });
    });
    return { voted: false };
  }

  /* ---------- trivia ---------- */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // a question with its answers in a fresh random order (so "the right one is always B" never happens)
  function ask(t) {
    var order = shuffle([0, 1, 2, 3]);
    return { id: t.id, cat: t.cat, q: t.q, why: t.why, opts: order.map(function (i) { return t.options[i]; }), correct: order.indexOf(t.answer) };
  }
  function verdict(item, picked) {
    return picked === item.correct ? '<b>Correct!</b> ' + esc(item.why) : '<b>Not quite.</b> It was ' + esc(item.opts[item.correct]) + '. ' + esc(item.why);
  }
  function mark(box, item, picked) {
    [].forEach.call(box.querySelectorAll('button'), function (b, i) {
      b.disabled = true;
      if (i === item.correct) b.classList.add('is-right');
      else if (i === picked) b.classList.add('is-wrong');
    });
  }

  /* the small homepage panel. nodes = { q, opts, fb, score, go } */
  function triviaCompact(nodes) {
    if (!TRIVIA.length) return;
    var i = istDay() % TRIVIA.length, item, right = 0, asked = 0, done = false;
    function score(extra) { nodes.score.textContent = 'Score ' + right + '/' + asked + (extra ? ' · ' + extra : ''); }
    function draw() {
      item = ask(TRIVIA[i % TRIVIA.length]); done = false;
      nodes.q.textContent = item.q; nodes.q.hidden = false; nodes.fb.hidden = true; nodes.go.hidden = true;
      nodes.opts.innerHTML = item.opts.map(function (o, k) { return '<button type="button" data-i="' + k + '" title="' + esc(o) + '">' + esc(o) + '</button>'; }).join('');
      score('pick one');
    }
    nodes.opts.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || done) return;
      var picked = parseInt(b.getAttribute('data-i'), 10); done = true; asked++; if (picked === item.correct) right++;
      mark(nodes.opts, item, picked);
      nodes.q.hidden = true; nodes.fb.innerHTML = verdict(item, picked); nodes.fb.hidden = false;
      nodes.go.hidden = false; nodes.go.focus({ preventScroll: true }); score('');
    });
    nodes.go.addEventListener('click', function () { i++; draw(); });
    draw();
  }

  /* the Trivia Challenge. A round = up to 10 questions, from every topic or one. */
  var BEST = 'trivia.best';
  function triviaGame(el) {
    if (!TRIVIA.length) return;
    var topic = '', round, n, right, item, answered;
    function pool() { return TRIVIA.filter(function (t) { return !topic || t.cat === topic; }); }
    function best() { var v = parseInt(store.get(BEST), 10); return isNaN(v) ? null : v; }
    function topicSelect() {
      return '<label class="tg-topic"><span>Topic</span><select id="tg-topic"><option value="">All topics (' + TRIVIA.length + ')</option>' +
        Object.keys(CATS).map(function (k) { var c = TRIVIA.filter(function (t) { return t.cat === k; }).length; return c ? '<option value="' + k + '"' + (topic === k ? ' selected' : '') + '>' + esc(CATS[k]) + ' (' + c + ')</option>' : ''; }).join('') + '</select></label>';
    }
    function start() {
      round = shuffle(pool()).slice(0, 10); n = 0; right = 0; next();
    }
    function head() {
      var b = best();
      return '<div class="tg-head"><span class="tg-prog">Question ' + (n + 1) + ' of ' + round.length + '</span><span class="tg-score">Score ' + right + '</span><span class="tg-best">' + (b == null ? 'No best score yet' : 'Best score ' + b) + '</span></div>';
    }
    function next() {
      if (n >= round.length) { finish(); return; }
      item = ask(round[n]); answered = false;
      el.innerHTML = head() + '<p class="tg-cat">' + esc(CATS[item.cat] || '') + '</p><h3 class="tg-q" id="tg-q" tabindex="-1">' + esc(item.q) + '</h3>' +
        '<div class="tg-opts" role="group" aria-labelledby="tg-q">' + item.opts.map(function (o, k) { return '<button type="button" data-i="' + k + '"><i>' + 'ABCD'.charAt(k) + '</i><span>' + esc(o) + '</span></button>'; }).join('') + '</div>' +
        '<div class="tg-fb" id="tg-fb" role="status" aria-live="polite" hidden></div><div class="tg-act"><button class="btn" id="tg-next" type="button" hidden>' + (n + 1 >= round.length ? 'See my score »' : 'Next Question »') + '</button></div>';
      var q = document.getElementById('tg-q'); if (q) q.focus({ preventScroll: true });
    }
    function finish() {
      var total = round.length, prev = best(), isBest = prev == null || right > prev;
      if (isBest) store.set(BEST, String(right));
      var msg = right === total ? 'Perfect! You really lived the 90s.' : right >= total * 0.7 ? 'Brilliant! A true 90s kid.' : right >= total * 0.4 ? 'Not bad. A few more Sundays of Doordarshan needed.' : 'Time to rewatch some classics!';
      el.innerHTML = '<div class="tg-end"><p class="tg-big">' + right + ' / ' + total + '</p><p class="tg-msg">' + msg + '</p>' +
        '<p class="tg-bestline">' + (isBest ? 'New best score on this device!' : 'Your best on this device: ' + prev) + '</p>' +
        topicSelect() + '<div class="tg-act"><button class="btn" id="tg-again" type="button">Play again »</button></div></div>';
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.tg-opts button');
      if (b && !answered) {
        answered = true; var picked = parseInt(b.getAttribute('data-i'), 10); if (picked === item.correct) right++;
        mark(el.querySelector('.tg-opts'), item, picked);
        var fb = document.getElementById('tg-fb'); fb.innerHTML = verdict(item, picked); fb.hidden = false;
        var nx = document.getElementById('tg-next'); nx.hidden = false; nx.focus({ preventScroll: true });
        el.querySelector('.tg-score').textContent = 'Score ' + right;
        return;
      }
      if (e.target.closest('#tg-next')) { n++; next(); }
      else if (e.target.closest('#tg-again')) start();
    });
    el.addEventListener('change', function (e) { if (e.target.id === 'tg-topic') topic = e.target.value; });
    el.innerHTML = '<div class="tg-end"><p class="tg-msg">Ten questions. Pick an answer, see the reason, and try to beat your best score.</p>' + topicSelect() +
      '<div class="tg-act"><button class="btn" id="tg-again" type="button">Start the Challenge »</button></div></div>';
  }

  window.Engage = {
    backend: backend, istDay: istDay, dailyPoll: dailyPoll, polls: POLLS, fmt: fmt, shuffle: shuffle,
    poll: { bind: pollBind }, trivia: { compact: triviaCompact, game: triviaGame }
  };
})();
