/* ==========================================================================
   90s REWIND TV — ABOUT PAGE (about.html)
   The contact list, and the "Submit a Playlist" form. There is no server: the form checks the link,
   then builds a ready-filled GitHub "new issue" address, which opens in a new tab only when the visitor
   presses the button. Nothing is stored and nothing is sent by this page itself.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site, $ = S && S.$, esc = S && S.esc;
  if (!S) return;
  var SITE = window.SITE || {}, contact = SITE.contact || {};

  /* ---------- contact list ---------- */
  var li = [];
  if (contact.github) li.push('<li><b>Message us on GitHub:</b> <a href="' + esc(contact.github) + '" target="_blank" rel="noopener noreferrer">open a new message</a> (free GitHub account needed).</li>');
  if (contact.email) li.push('<li><b>Email:</b> <a href="mailto:' + esc(contact.email) + '">' + esc(contact.email) + '</a></li>');
  li.push('<li><b>Instagram:</b> <b>@the90sindia</b></li>');
  $('contact-list').innerHTML = li.join('');

  /* ---------- the form ---------- */
  var cats = (window.CATEGORIES || []).map(function (c) { return { id: c.id, label: c.label }; }).concat([{ id: 'games', label: 'Games' }, { id: 'photos', label: 'Photos & wallpapers' }]);
  $('s-cat').innerHTML = cats.map(function (c) { return '<option value="' + esc(c.label) + '">' + esc(c.label) + '</option>'; }).join('');

  // A YouTube address is a watch / short / youtu.be link with a video id, or a playlist address with a list id.
  function parse(url) {
    var u; try { u = new URL(url.trim()); } catch (e) { return null; }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    var h = u.hostname.replace(/^www\.|^m\./, '');
    var list = u.searchParams.get('list'), v = u.searchParams.get('v');
    if (h === 'youtu.be' && /^[A-Za-z0-9_-]{11}$/.test(u.pathname.slice(1))) return { kind: 'video', id: u.pathname.slice(1) };
    if (h === 'youtube.com' || h === 'music.youtube.com' || h === 'youtube-nocookie.com') {
      if (list && /^[A-Za-z0-9_-]{10,}$/.test(list) && (u.pathname === '/playlist' || !v)) return { kind: 'playlist', id: list };
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return { kind: 'video', id: v };
      var m = u.pathname.match(/^\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{11})/);
      if (m) return { kind: 'video', id: m[1] };
    }
    return null;
  }
  function issueUrl(f) {
    var p = parse(f.url);
    var body = ['**Link:** ' + (p.kind === 'playlist' ? 'https://www.youtube.com/playlist?list=' + p.id : 'https://www.youtube.com/watch?v=' + p.id) + ' (' + p.kind + ')',
      '**Category:** ' + f.cat, f.title ? '**Title:** ' + f.title : '', f.year ? '**Year:** ' + f.year : '', f.note ? '**Notes:** ' + f.note : '',
      '', '_Sent from the Submit page on 90s Rewind TV._'].filter(function (x, i) { return x !== '' || i > 4; }).join('\n');
    var base = (contact.github || 'https://github.com/nileshpatil30/the90sindia/issues/new').split('?')[0];
    return base + '?title=' + encodeURIComponent('Submission: ' + (f.title || (p.kind === 'playlist' ? 'playlist ' : 'video ') + p.id)) + '&body=' + encodeURIComponent(body);
  }
  var err = $('s-err');
  function fail(m, el) { err.textContent = m; err.hidden = false; if (el) el.focus(); }
  $('sub-form').addEventListener('submit', function (e) {
    e.preventDefault(); err.hidden = true;
    var f = { url: $('s-url').value, cat: $('s-cat').value, title: $('s-title').value.trim(), year: $('s-year').value.trim(), note: $('s-note').value.trim() };
    if (!f.url.trim()) return fail('Paste a YouTube link first.', $('s-url'));
    if (!parse(f.url)) return fail('That does not look like a YouTube video or playlist link. Paste the address from the YouTube page.', $('s-url'));
    if (f.year && !/^(19[7-9]\d|20[01]\d)$/.test(f.year)) return fail('Year should be four digits, like 1995 (or leave it empty).', $('s-year'));
    window.open(issueUrl(f), '_blank', 'noopener');
  });
  window.AboutPage = { parse: parse, issueUrl: issueUrl };
})();
