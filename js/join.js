/* ==========================================================================
   90s REWIND TV — LOGIN / JOIN (join.html): THE INTERFACE ONLY
   Accounts are not switched on, because the site has no server and no sign-in service yet.
   What this file does:  checks the form so people see how it will behave, shows a clear
   "not switched on" message, and CLEARS the password fields.
   What it never does:   send anything anywhere, save anything in the browser (no localStorage,
   cookies, or the address bar) or keep a password in a variable after the click.
   The inputs have no `name` attribute on purpose: even if this script failed to load, the browser
   would have nothing to put in a link, so a password can never end up in the address.
   To make it real, replace the body of `submitJoin` and `submitLogin` with calls to a sign-in service
   (see docs/backend-options.md). The service stores the password as a hash; this site must not.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site; if (!S) return;
  var $ = S.$;

  function show(el, msg) { el.textContent = msg; el.hidden = false; }
  function note(msg) { var n = $('jn-note'); n.textContent = msg; n.hidden = false; n.focus({ preventScroll: false }); }
  function wipe(ids) { ids.forEach(function (id) { var e = $(id); if (e) e.value = ''; }); }

  // Show / Hide password
  [].forEach.call(document.querySelectorAll('.jn-eye'), function (b) {
    b.addEventListener('click', function () {
      var i = $(b.getAttribute('data-for')), on = i.type === 'password';
      i.type = on ? 'text' : 'password';
      b.textContent = on ? 'Hide' : 'Show'; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? 'Hide password' : 'Show password');
    });
  });

  // Forgot password: nothing to reset yet
  var forgot = document.querySelector('[data-soon-link]');
  if (forgot) forgot.addEventListener('click', function (e) { e.preventDefault(); note('Password reset will work once accounts are switched on. There are no accounts yet, so there is nothing to reset.'); });

  /* ---------- login ---------- */
  function submitLogin(e) {
    e.preventDefault();
    var err = $('lg-err'); err.hidden = true;
    var id = $('lg-id').value.trim(), pw = $('lg-pw').value;
    if (!id) { show(err, 'Type your email or nickname.'); $('lg-id').focus(); return; }
    if (!pw) { show(err, 'Type your password.'); $('lg-pw').focus(); return; }
    wipe(['lg-pw']);
    note('Login is not switched on yet. Your details were not sent or saved, and there is nothing to log in to. You can still watch, play, vote and browse without an account.');
  }

  /* ---------- join ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, NICK = /^[A-Za-z0-9_]{3,30}$/;
  function submitJoin(e) {
    e.preventDefault();
    var err = $('jn-err'); err.hidden = true;
    var email = $('jn-email').value.trim(), nick = $('jn-nick').value.trim(), pw = $('jn-pw').value, pw2 = $('jn-pw2').value;
    var bad = !EMAIL.test(email) ? ['jn-email', 'Please enter a valid email address.'] :
      !NICK.test(nick) ? ['jn-nick', 'The nickname needs 3 to 30 letters, numbers or underscores.'] :
      pw.length < 10 ? ['jn-pw', 'The password needs at least 10 characters.'] :
      pw !== pw2 ? ['jn-pw2', 'The two passwords do not match.'] :
      !$('jn-ok').checked ? ['jn-ok', 'Please confirm you are 13 or older and agree to the Community Guidelines.'] : null;
    if (bad) { show(err, bad[1]); $(bad[0]).focus(); return; }
    wipe(['jn-pw', 'jn-pw2']); pw = pw2 = '';
    note('Thank you. Joining is not switched on yet, so no account was created and nothing was sent or saved. Your details look fine, and this is how sign-up will work once accounts are ready.');
  }
  $('lg-form').addEventListener('submit', submitLogin);
  $('jn-form').addEventListener('submit', submitJoin);

  // arriving as join.html#join or #login: move to that box
  if (location.hash === '#join' || location.hash === '#login') { var t = $(location.hash.slice(1)); if (t) { var f = t.querySelector('input'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 200); } }
})();
