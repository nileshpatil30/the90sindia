# Making `home.html` the domain homepage (plan, not yet done)

**Goal:** `https://the90sindia.com/` shows the new portal. The old single-page prototype is kept as `prototype.html`.
A static host (Hostinger included) serves `index.html` at `/`, so the swap is two renames plus tidying. Do it at deployment, after the four PRs are merged (#1, #2, #3, #4, in that order).

## Steps
1. `git mv index.html prototype.html` then `git mv home.html index.html`.
2. Update the references to `home.html` (11 files, all small):
   - `js/content.js` NAV "Home" link and `js/site.js` logo link: `home.html` becomes `index.html`.
   - Comments in `js/home*.js`, `css/home.css`, `docs/arcade-research.md`, `README.md` (4 places, including the "Run it" table).
   - Tests: `tests/site-smoke.js` (1), `tests/arcade-smoke.js` (1), `tests/pages-test.js` (3).
3. **Legacy anchors used by the Live TV page.** `tv.html` is protected, and its top bar and "Back to 90s REWIND" link point at the old prototype: `index.html#hero`, `#shows`, `#arcade`, `#hit-parade`, `#photo-wall`, `#vault`, `#adda`. After the swap those would open the new homepage with no matching section. Without touching `tv.html`, add invisible ids to the new `index.html`:

   | legacy anchor | new target |
   |---|---|
   | `#hero` | top of the page (`#main`) |
   | `#shows` | Popular TV Shows (`#tv-shows`) |
   | `#arcade` | Play 90s Games Online (`#games`) |
   | `#hit-parade` | Songs of the 90s (`#songs`) |
   | `#photo-wall` | Photos and Wallpapers (`#photos`) |
   | `#vault` | Cricket Classics (`#cricket`) |
   | `#adda` | Top Discussions panel |
4. `prototype.html`: add `<meta name="robots" content="noindex">` so it never competes with the real homepage in search. Its own files (`css/style.css`, `js/app.js`, `js/config.js`) are referenced by relative path, so it keeps working after the rename.
5. Optional: leave a one-line `home.html` that redirects to `/` for anyone who bookmarked it. Nothing is public yet, so it can be skipped.
6. Check: run every test suite, crawl every link, open `/`, `/prototype.html` and `/tv.html` and click the top-bar links on the TV page.

## Why not the alternatives
- **Server setting (`DirectoryIndex home.html`):** no renames, but `/` and `/index.html` would then be two different pages and the setting is easy to lose when changing host.
- **A redirecting `index.html`:** costs an extra page load and weakens the homepage for search.

## Risk
Low. No visual change. The only visitor-facing effect is that the Live TV page's HOME, SHOWS, ARCADE and similar links now land on the new portal instead of the old prototype.
