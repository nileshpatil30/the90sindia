/* ==========================================================================
   90s REWIND TV — PHOTO GALLERY (gallery.html)
   Draws the grid from js/gallery-data.js, filters by category (?cat=wallpapers keeps the choice in the address),
   and hands the big view, Previous / Next and the keyboard arrows to the shared pop-up in js/site.js.
   Hidden tiles are skipped by Previous / Next, so you only flip through what the filter shows.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Site, $ = S && S.$, esc = S && S.esc;
  var grid = document.getElementById('g-grid');
  if (!S || !grid) return;
  var ITEMS = (window.GALLERY || []).filter(function (g) { return g && g.src && g.title; }), CATS = window.GALLERY_CATS || [];
  if (!ITEMS.length) { grid.innerHTML = '<li class="load-err">There are no pictures yet.</li>'; return; }

  var counts = {}; ITEMS.forEach(function (g) { counts[g.cat] = (counts[g.cat] || 0) + 1; });
  var cats = CATS.filter(function (c) { return counts[c.id]; });
  var cat = S.qs.get('cat') || '';
  if (cat && !counts[cat]) cat = '';
  var label = function (id) { var c = CATS.filter(function (x) { return x.id === id; })[0]; return c ? c.label : id; };

  grid.innerHTML = ITEMS.map(function (g) {
    return '<li class="pix-item" data-cat="' + esc(g.cat) + '"><a class="pix-tile" href="' + esc(g.src) + '" data-zoom data-group="gallery" data-src="' + esc(g.src) + '" data-alt="' + esc(g.title) + '" aria-label="' + esc(g.title + ': open the big picture') + '">' +
      '<span class="pix-pic"><img src="' + esc(g.src) + '" alt="' + esc(g.alt || g.title) + '" loading="lazy" decoding="async"></span>' +
      '<span class="pix-cap"><b>' + esc(g.title) + '</b><small>' + esc(label(g.cat)) + (g.year ? ' · ' + esc(g.year) : '') + '</small></span></a></li>';
  }).join('');
  [].forEach.call(grid.querySelectorAll('img'), function (im) {
    im.addEventListener('error', function () { im.closest('.pix-pic').classList.add('is-broken'); im.remove(); });       // a missing file shows a neutral box, not a broken-image icon
  });

  function draw() {
    var n = 0;
    [].forEach.call(grid.children, function (li) { var on = !cat || li.getAttribute('data-cat') === cat; li.hidden = !on; if (on) n++; });
    $('g-cats').innerHTML = '<a class="fchip" href="gallery.html" data-cat=""' + (!cat ? ' aria-current="true"' : '') + '>All<b>' + ITEMS.length + '</b></a>' +
      cats.map(function (c) { return '<a class="fchip" href="gallery.html?cat=' + esc(c.id) + '" data-cat="' + esc(c.id) + '"' + (cat === c.id ? ' aria-current="true"' : '') + '>' + esc(c.label) + '<b>' + counts[c.id] + '</b></a>'; }).join('');
    $('g-count').textContent = n + (n === 1 ? ' picture' : ' pictures') + (cat ? ' in ' + label(cat) : '');
    document.title = (cat ? label(cat) + ' — ' : '') + 'Photos & Wallpapers — 90s Rewind TV';
  }
  $('g-cats').addEventListener('click', function (e) {
    var a = e.target.closest('a[data-cat]'); if (!a) return;
    e.preventDefault();
    cat = a.getAttribute('data-cat');
    try { history.replaceState(null, '', cat ? 'gallery.html?cat=' + encodeURIComponent(cat) : 'gallery.html'); } catch (x) { /* the filter still works */ }
    draw();
    var cur = $('g-cats').querySelector('a[aria-current="true"]'); if (cur) cur.focus({ preventScroll: true });
  });
  draw();
  window.GalleryPage = { show: function (c) { cat = counts[c] ? c : ''; draw(); } };
})();
