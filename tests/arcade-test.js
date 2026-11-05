/* Checks the Arcade catalogue (js/arcade-data.js) without a browser:
     node tests/arcade-test.js
   The rules that keep the Arcade honest are tested here, so a mistake cannot ship quietly:
   - all 40 target games are listed, with every field the brief asks for
   - a game may only say "Play on our site" with an https embed address AND a stated embedding permission
   - a game may only say "Play on official site" with an https address on a host we have verified
   - "Coming soon" games have no link of any kind (no fake Play button, no ROM-site links)
   - thumbnails are our own neutral art; nothing points at a publisher's picture
   To add an official source: verify it first (docs/arcade-research.md), then add its host to VERIFIED_HOSTS below. */
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = global;
['tv-episodes', 'tv-library', 'tv-mahabharat', 'tv-ads', 'tv-schedule', 'tv-config', 'tv-thumbs', 'content', 'arcade-data', 'catalogue']
  .forEach((f) => require(path.join(root, 'js', f + '.js')));
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL: ' + m); } };

/* Hosts whose official pages were opened and checked (6 Nov 2026). Everything else is refused. */
const VERIFIED_HOSTS = ['play.tetris.com', 'www.google.com', 'www.taito.co.jp', 'captown.capcom.com'];
const TARGETS = ['Road Rash', 'Road Rash II', 'Road Rash 3', 'Super Hang-On', 'Excitebike', 'OutRun', 'Super Monaco GP', 'Road Fighter',
  'Super Mario Bros.', 'Super Mario Bros. 3', 'Sonic the Hedgehog', 'Sonic the Hedgehog 2', 'Aladdin', 'The Lion King', 'Prince of Persia', 'Dangerous Dave', 'Dangerous Dave 2', 'DuckTales',
  'Contra', 'Super Contra', 'Double Dragon', 'Streets of Rage', 'Street Fighter II', 'Mortal Kombat', 'Golden Axe', 'Teenage Mutant Ninja Turtles',
  'Pac-Man', 'Battle City', 'Galaga', 'Space Invaders', 'Donkey Kong', 'Circus Charlie', 'Tetris', 'Bomberman', 'Arkanoid',
  'International Superstar Soccer', 'Tecmo Bowl', 'NBA Jam', 'Sensible Soccer', 'Classic Cricket Games'];
const FIELDS = ['id', 'title', 'year', 'publisher', 'platform', 'genre', 'description', 'thumb', 'status', 'sourceName', 'sourceUrl', 'embedUrl', 'repoUrl',
  'licence', 'contentRights', 'embedding', 'commercialUse', 'rom', 'mobile', 'notes', 'verified'];

const G = ARCADE_GAMES, genres = ARCADE_GENRES.map((g) => g.id);
ok(G.length === 40, '40 games, got ' + G.length);
ok(new Set(G.map((g) => g.id)).size === G.length, 'ids are unique');
ok(new Set(G.map((g) => g.title)).size === G.length, 'titles are unique');
TARGETS.forEach((t) => ok(G.some((g) => g.title.toLowerCase().indexOf(t.toLowerCase()) === 0), 'target game is listed: ' + t));
ok(ARCADE_GENRES.length === 6, '6 genres');

const featuredRanks = [], popularRanks = [];
G.forEach((g) => {
  const tag = g.id;
  FIELDS.forEach((f) => ok(f in g && g[f] !== undefined && g[f] !== null && (f === 'sourceName' || f === 'sourceUrl' || f === 'embedUrl' || f === 'repoUrl' || f === 'rom' || String(g[f]).length > 0), tag + ': field missing: ' + f));
  ok(/^[a-z0-9-]+$/.test(g.id), tag + ': id should be a lower-case slug');
  ok(Number.isInteger(g.year) && g.year >= 1970 && g.year <= 2009, tag + ': odd year ' + g.year);
  ok(genres.includes(g.genre), tag + ': unknown genre ' + g.genre);
  ok(['website', 'official', 'soon'].includes(g.status), tag + ': unknown status ' + g.status);
  ok(/^\d{4}-\d{2}-\d{2}$/.test(g.verified), tag + ': verification date should be YYYY-MM-DD');
  ok(/^assets\/arcade\/[a-z]+\.svg$/.test(g.thumb) && fs.existsSync(path.join(root, g.thumb)), tag + ': thumbnail must be our own art in assets/arcade/ and exist');
  ok(g.description.length >= 30 && g.description.length <= 200, tag + ': description length ' + g.description.length);
  ok(g.notes.length >= 20, tag + ': verification notes needed');
  if (g.featured) featuredRanks.push(g.featured);
  if (g.popular) popularRanks.push(g.popular);

  if (g.status === 'website') {
    ok(/^https:\/\//.test(g.embedUrl), tag + ': an embedded game needs an https embedUrl');
    ok(/^https:\/\//.test(g.sourceUrl), tag + ': an embedded game needs a sourceUrl');
    ok(/^permitted/i.test(g.embedding), tag + ': the embedding field must start with "Permitted" and name the evidence');
    ok(g.embedding.length > 30, tag + ': say who permitted it and where');
    ok(VERIFIED_HOSTS.includes(new URL(g.embedUrl).hostname) || process.env.ALLOW_NEW_EMBED_HOST, tag + ': embed host is not in VERIFIED_HOSTS');
  }
  if (g.status === 'official') {
    ok(/^https:\/\//.test(g.sourceUrl), tag + ': an official-site game needs an https sourceUrl');
    ok(VERIFIED_HOSTS.includes(new URL(g.sourceUrl).hostname), tag + ': ' + g.sourceUrl + ' is not on a verified host');
    ok(g.embedUrl === '', tag + ': an official-site game must not have an embedUrl (embedding is not permitted)');
    ok(!/^permitted/i.test(g.embedding), tag + ': official-site games are link-out only');
    ok(g.sourceName.length > 2, tag + ': name the source');
  }
  if (g.status === 'soon') {
    ok(g.sourceUrl === '' && g.embedUrl === '' && g.repoUrl === '', tag + ': a Coming Soon game must have no links at all');
    ok(!/^permitted/i.test(g.embedding), tag + ': a Coming Soon game cannot have embedding permission');
  }
  // never anything that looks like a ROM, emulator or download link
  [g.sourceUrl, g.embedUrl, g.repoUrl].forEach((u) => ok(!/\.(nes|sfc|smc|gen|md|bin|zip|7z|rom|iso)(\?|$)/i.test(u), tag + ': a link looks like a game file'));
});
ok(new Set(featuredRanks).size === featuredRanks.length && featuredRanks.length >= 4, 'featured ranks are unique (and at least 4)');
ok(new Set(popularRanks).size === popularRanks.length && popularRanks.length >= 4, 'popular ranks are unique (and at least 4)');
// every genre has a game, and the filters have something to show
genres.forEach((id) => ok(G.some((g) => g.genre === id), 'genre ' + id + ' has games'));
ok(G.filter((g) => g.status === 'official').length === 4, 'exactly the 4 verified official pages today (update when more are verified), got ' + G.filter((g) => g.status === 'official').length);

// the four verified ones, by name
const want = { 'pac-man': 'www.google.com', 'tetris': 'play.tetris.com', 'space-invaders': 'www.taito.co.jp', 'street-fighter-ii': 'captown.capcom.com' };
Object.keys(want).forEach((id) => { const g = G.find((x) => x.id === id); ok(g && g.status === 'official' && new URL(g.sourceUrl).hostname === want[id], id + ' should be an official-site game on ' + want[id]); });

/* ---------------- the catalogue sees the games ---------------- */
const items = Catalogue.items.filter((i) => i.cat === 'games');
ok(items.length === 40, 'the catalogue has all 40 games, got ' + items.length);
ok(items.every((i) => i.open.type === 'href' && /^game\.html\?id=[a-z0-9-]+$/.test(i.open.value)), 'every game card opens its own game page');
ok(Catalogue.search('pacman').some((i) => i.cat === 'games' && i.title === 'Pac-Man') || Catalogue.search('pac man').some((i) => i.title === 'Pac-Man'), 'site search finds Pac-Man');
ok(Catalogue.search('road rash', 10).filter((i) => i.cat === 'games').length === 3, 'site search finds the three Road Rash games');
ok(Catalogue.featured('games').length === featuredRanks.length, 'featured games reach the homepage row');
ok(Catalogue.featured('games')[0].title === 'Pac-Man', 'Pac-Man is the first featured game');
ok(items.filter((i) => i.badge === 'COMING SOON').length === 36 && items.filter((i) => i.badge === 'OFFICIAL SITE').length === 4, 'badges match the statuses');

console.log((fail ? 'FAILED' : 'ALL OK') + ' — ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
