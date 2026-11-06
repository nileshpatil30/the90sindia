/* ==========================================================================
   90s REWIND TV — THE GAME PAGE (game.html?id=...)
   One reusable page for every game in js/arcade-data.js. What it shows depends on the status:
     website   the game inside this page (lazy-loaded iframe, loading indicator, Fullscreen, Restart)
     official  a clear Play Now button that opens the owner's own page in a new tab
     soon      a "Coming soon" notice, no Play button
   The iframe is only ever used for a game that has status 'website' AND an https embedUrl,
   and it is sandboxed. We never try to get around a site's own framing rules.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site, U = window.ArcadeUI;
  if (!S || !U) return;
  var $ = S.$, esc = S.esc, main = $('main');
  var g = U.byId[S.qs.get('id') || ''];

  function notFound() {
    document.title = 'Game not found — 90s Rewind Arcade';
    main.innerHTML = '<section class="arc-hero gp-missing"><div class="arc-hero-t"><h1>Game not found</h1><p class="arc-sub">That game is not in the Arcade (yet). It may have been renamed.</p>' +
      '<p><a class="btn" href="arcade.html">« Return to Arcade</a></p></div></section>';
  }
  if (!g) { notFound(); return; }

  var st = U.statusOf(g), host = U.host(g.sourceUrl), srcUrl = U.safeHttps(g.sourceUrl), embed = g.status === 'website' ? U.safeHttps(g.embedUrl) : '';
  var mode = g.status === 'website' && embed ? 'website' : g.status === 'official' && srcUrl ? 'official' : 'soon';       // a broken entry falls back to the honest "soon"
  document.title = g.title + ' (' + g.yearLabel + ') — 90s Rewind Arcade';
  var meta = document.querySelector('meta[name=description]');
  if (meta) meta.setAttribute('content', g.title + ' (' + g.yearLabel + ', ' + g.platform + '): ' + (mode === 'official' ? 'play it on its official site.' : mode === 'website' ? 'play it right here.' : 'coming soon to the Arcade.'));

  /* ---------- the game screen ---------- */
  function screen() {
    if (mode === 'website') {
      return '<div class="screen" id="screen" style="aspect-ratio:' + esc(g.aspect || '4 / 3') + '">' +
        '<div class="screen-load" id="screen-load" role="status"><i class="spin" aria-hidden="true"></i><span>Loading ' + esc(g.title) + '…</span></div>' +
        '<iframe id="game-frame" title="' + esc(g.title) + '" allow="fullscreen; autoplay; gamepad" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" ' +
        'sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"></iframe></div>' +
        '<div class="gp-tools" id="gp-tools"><button class="btn" id="t-full" type="button">Fullscreen</button><button class="btn" id="t-restart" type="button">Restart</button>' +
        (srcUrl ? '<a class="btn" href="' + esc(srcUrl) + '" target="_blank" rel="noopener noreferrer">Open on ' + esc(host) + ' ↗</a>' : '') + '</div>' +
        '<p class="gp-warn" id="screen-err" role="alert" hidden>Still loading? The source may be slow or unavailable. ' + (srcUrl ? '<a href="' + esc(srcUrl) + '" target="_blank" rel="noopener noreferrer">Play it on ' + esc(host) + ' ↗</a>' : '') + '</p>';
    }
    if (mode === 'official') {
      return '<div class="screen screen-ph"><img class="screen-bg" src="' + esc(g.thumb) + '" alt=""><div class="ph-card"><span class="stat stat-ext">OFFICIAL SITE</span>' +
        '<h2>Plays on ' + esc(g.sourceName || host) + '</h2>' +
        '<p>This game is run by its owner on <b>' + esc(host) + '</b>. Its owner has not given other websites permission to show it, so we open it for you in a new tab. This page stays open here.</p>' +
        '<a class="btn btn-big" href="' + esc(srcUrl) + '" target="_blank" rel="noopener noreferrer" data-play="' + esc(g.id) + '">Play Now on ' + esc(host) + ' ↗</a>' +
        '<small>90s Rewind TV is a fan site and is not connected to the owner of this game.</small></div></div>';
    }
    return '<div class="screen screen-ph"><img class="screen-bg" src="' + esc(g.thumb) + '" alt=""><div class="ph-card"><span class="stat stat-soon">COMING SOON</span>' +
      '<h2>Not playable yet</h2><p>We have not found an authorised version of <b>' + esc(g.title) + '</b> that works in a browser, so there is no Play button. We will not swap in a remake or link to ROM sites.</p>' +
      '<a class="btn" href="arcade.html">Find a game you can play</a></div></div>';
  }

  /* ---------- the facts ---------- */
  function fv(v) {
    var cls = /^unknown/i.test(v) ? ' class="fv-unk"' : /^(no|not|none)\b/i.test(v) ? ' class="fv-no"' : /^permitted/i.test(v) ? ' class="fv-yes"' : '';
    return '<dd' + cls + '>' + esc(v) + '</dd>';
  }
  function row(k, v) { return '<dt>' + esc(k) + '</dt>' + fv(v); }
  function facts() {
    return '<dl class="facts">' +
      row('A. Software licence', g.licence) + row('B. Game content rights', g.contentRights) +
      row('C. Embedding on this site', g.embedding) + row('D. Commercial use', g.commercialUse) +
      row('ROM or game file needed', g.rom) + row('Mobile', g.mobile) +
      '<dt>Source</dt><dd>' + (srcUrl ? '<a href="' + esc(srcUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(g.sourceName || host) + ' (' + esc(host) + ') ↗</a>' : 'None yet') + '</dd>' +
      (g.repoUrl && U.safeHttps(g.repoUrl) ? '<dt>Project repository</dt><dd><a href="' + esc(U.safeHttps(g.repoUrl)) + '" target="_blank" rel="noopener noreferrer">' + esc(U.host(g.repoUrl)) + ' ↗</a></dd>' : '') +
      row('Last checked', g.verified) + '</dl>' +
      '<p class="facts-n"><b>What we found:</b> ' + esc(g.notes) + '</p>' +
      '<p class="facts-k">These four permissions are separate: having one does not give us the others. “Unknown” means we could not confirm it, not that it is allowed.</p>';
  }

  function howTo() {
    var t = [];
    if (g.controls) t.push('<p>' + esc(g.controls) + '</p>');
    else if (mode === 'soon') t.push('<p>Controls will be listed here once a playable version is available.</p>');
    if (mode === 'website') t.push('<p>Click inside the game first so it can see your keyboard. Sound is the game’s own: the browser does not let us mute another site.</p>');
    if (mode === 'official') t.push('<p>The game’s own page lists its keyboard, touch or gamepad controls.</p>');
    t.push('<p class="hp-m"><b>Phone or tablet:</b> ' + esc(g.mobile) + '.</p>');
    return t.join('');
  }

  /* ---------- more classic games ---------- */
  function more() {
    var same = U.games.filter(function (x) { return x.id !== g.id && x.genre === g.genre; }).sort(U.byStatus);
    var rest = U.games.filter(function (x) { return x.id !== g.id && x.genre !== g.genre; }).sort(U.byStatus);
    return same.concat(rest).slice(0, 5);
  }

  /* ---------- the page ---------- */
  var gen = U.genreLabel(g);
  main.innerHTML =
    '<nav class="gp-bar" aria-label="Arcade"><a class="btn" id="gp-back" href="arcade.html">« Return to Arcade</a>' +
    '<p class="gp-crumb"><a href="arcade.html">Arcade</a> › <a href="arcade.html?genre=' + esc(g.genre) + '">' + esc(gen) + '</a> › ' + esc(g.title) + '</p></nav>' +
    '<header class="gp-head"><h1>' + esc(g.title) + '</h1><p class="gp-meta"><span class="stat stat-' + U.statClass(g) + '">' + esc(st.short) + '</span>' +
    '<span class="gtag">' + esc(g.yearLabel) + '</span><span class="gtag">' + esc(g.platform) + '</span><span class="gtag">' + esc(gen) + '</span><span class="gpub">' + esc(g.publisher) + '</span></p></header>' +
    '<div class="gp-grid"><section class="gp-play" aria-label="Game screen">' + screen() + '</section>' +
    '<aside class="gp-info"><section class="panel gp-box"><header class="panel-h"><h2>About</h2></header><div class="panel-b"><p>' + esc(g.description) + '</p></div></section>' +
    '<section class="panel gp-box"><header class="panel-h"><h2>How to play</h2></header><div class="panel-b">' + howTo() + '</div></section></aside></div>' +
    '<section class="sec arc-sec gp-check" aria-labelledby="h-check"><header class="sec-h"><img src="assets/ui/icons/sec-games.svg" alt="" width="34" height="34"><h2 id="h-check">What we checked</h2></header><div class="sec-b">' + facts() + '</div></section>' +
    '<section class="sec arc-sec" aria-labelledby="h-more"><header class="sec-h"><img src="assets/ui/icons/sec-games.svg" alt="" width="34" height="34"><h2 id="h-more">More Classic Games</h2><a href="arcade.html">View All »</a></header>' +
    '<div class="sec-b"><div class="garid">' + more().map(U.card).join('') + '</div></div></section>';

  // Return to Arcade: go back (keeps the filters you had) when you came from the Arcade, else open it
  $('gp-back').addEventListener('click', function (e) {
    var r = document.referrer;
    if (r && r.indexOf(location.origin) === 0 && /\/arcade\.html/.test(r) && history.length > 1) { e.preventDefault(); history.back(); }
  });

  /* ---------- Mode A: the embedded game ---------- */
  if (mode === 'website') {
    var frame = $('game-frame'), load = $('screen-load'), err = $('screen-err'), timer = 0;
    var start = function () {
      load.hidden = false; err.hidden = true; clearTimeout(timer);
      frame.src = embed;                                    // the player loads only now, on this page
      timer = setTimeout(function () { err.hidden = false; }, 12000);
    };
    frame.addEventListener('load', function () { if (!frame.getAttribute('src')) return; clearTimeout(timer); load.hidden = true; err.hidden = true; U.recordPlay(g.id); });
    $('t-restart').addEventListener('click', function () { frame.removeAttribute('src'); start(); });
    var box = $('screen'), full = $('t-full');
    var canFull = !!(document.fullscreenEnabled && box.requestFullscreen);
    if (!canFull) full.hidden = true;                      // e.g. iPhone Safari has no element fullscreen
    full.addEventListener('click', function () { if (document.fullscreenElement) document.exitFullscreen(); else box.requestFullscreen(); });
    document.addEventListener('fullscreenchange', function () { full.textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen'; });
    start();
  }
  main.focus({ preventScroll: true });
})();
