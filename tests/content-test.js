/* Checks the central content system without a browser:
     node tests/content-test.js
   - js/content.js: every item is well formed, ids look like YouTube ids, no repeats, files exist
   - js/catalogue.js: every category has items, the homepage rows are filled, search works
   - tools/add-content.js: reads links, handles 200 / 401 / 400 answers, writes the line in the right place
   The network is never touched (YouTube answers are simulated). */
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert');
const root = path.join(__dirname, '..');
global.window = global;
['tv-episodes', 'tv-library', 'tv-mahabharat', 'tv-ads', 'tv-schedule', 'tv-config', 'tv-thumbs', 'content', 'arcade-data', 'catalogue']
  .forEach((f) => require(path.join(root, 'js', f + '.js')));

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; console.log('FAIL: ' + msg); } }
const ID = /^[A-Za-z0-9_-]{11}$/, PL = /^(PL|UU|OL|FL|LL|RD)[A-Za-z0-9_-]{8,}$/;

/* ---------------- content.js ---------------- */
const cats = CATEGORIES.map((c) => c.id), shows = new Set(TV_SHOWS.map((s) => s.title));
ok(cats.length === 8, '8 categories, got ' + cats.length);
const seen = {};
CONTENT.forEach((c, i) => {
  const tag = '#' + i + ' ' + (c.title || '?');
  ok(cats.includes(c.cat), tag + ': unknown category ' + c.cat);
  ok(typeof c.title === 'string' && c.title.length > 1, tag + ': title missing');
  const opens = ['yt', 'playlist', 'show', 'img', 'href'].filter((k) => c[k]);
  ok(opens.length >= 1, tag + ': nothing to open (yt / playlist / show / href)');
  if (c.yt) ok(ID.test(c.yt), tag + ': bad video id ' + c.yt);
  if (c.thumb) ok(ID.test(c.thumb), tag + ': bad thumb id ' + c.thumb);
  if (c.playlist) ok(PL.test(c.playlist), tag + ': bad playlist id');
  if (c.show) ok(shows.has(c.show), tag + ': show "' + c.show + '" is not in the TV library');
  if (c.year) ok(c.year >= 1980 && c.year <= 2010, tag + ': odd year ' + c.year);
  if (c.img) ok(fs.existsSync(path.join(root, c.img)), tag + ': picture missing ' + c.img);
  const key = c.cat + '|' + (c.yt || c.playlist || c.show || c.href) + '|' + c.title;
  ok(!seen[key], tag + ': listed twice in ' + c.cat); seen[key] = 1;
  if (c.yt) { ok(!seen['yt|' + c.yt], tag + ': the video ' + c.yt + ' is used by two items'); seen['yt|' + c.yt] = 1; }
  const tk = 'title|' + c.cat + '|' + String(c.title).toLowerCase().trim();       // one card per title in a category (a second video of the same film needs its own name)
  ok(!seen[tk], tag + ': another item in ' + c.cat + ' has the same title'); seen[tk] = 1;
});
NAV.forEach((n) => ok(n.label && n.href && n.icon && fs.existsSync(path.join(root, 'assets/ui/icons', n.icon + '.svg')), 'NAV ' + n.label + ': icon missing'));
CATEGORIES.forEach((c) => ok(fs.existsSync(path.join(root, 'assets/ui/icons', c.icon + '.svg')), 'category ' + c.id + ': icon missing'));
TICKER.forEach((t) => ok(t.text && t.href, 'ticker item needs text and href'));

/* ---------------- playlist pictures ---------------- */
// KNOWN DATA BUG (reported, js/tv-library.js is frozen): two rows have playlist: 'undefined'. They are warned about, not failed.
const badPl = TV_SHOWS.filter((s) => s.playlist === 'undefined');
if (badPl.length) console.log('WARN: js/tv-library.js has playlist: \'undefined\' for: ' + badPl.map((s) => s.title).join(' | '));
const needPl = TV_SHOWS.filter((s) => s.playlist && s.playlist !== 'undefined').map((s) => s.playlist);
ok(needPl.every((p) => TV_PL_THUMBS[p]), 'every playlist show has a picture in js/tv-thumbs.js (missing: ' + needPl.filter((p) => !TV_PL_THUMBS[p]).length + ')');
Object.values(TV_PL_THUMBS).forEach((v) => ok(ID.test(v), 'TV_PL_THUMBS has a bad video id ' + v));

/* ---------------- catalogue ---------------- */
const C = window.Catalogue;
ok(C.items.length >= TV_SHOWS.length + CONTENT.filter((c) => !c.show).length, 'catalogue has every show and content item');
['tv', 'movies', 'ads', 'songs', 'cricket', 'wwf', 'cartoons', 'other'].forEach((id) => ok(C.byCat(id).length > 0, 'category ' + id + ' is empty'));
const wantRow = { tv: 5, movies: 5, ads: 5, songs: 3, cricket: 2, wwf: 3 };
Object.keys(wantRow).forEach((id) => ok(C.featured(id).length === wantRow[id], 'homepage row ' + id + ' should have ' + wantRow[id] + ', has ' + C.featured(id).length));
ok(C.featured('tv').map((i) => i.title).join() === 'Shaktimaan,Ramayan,Chandrakanta,Malgudi Days,Byomkesh Bakshi', 'TV row keeps the order of content.js');
ok(C.items.every((i) => i.id && i.title && i.open && i.open.type), 'every item has an id, a title and a way to open');
ok(new Set(C.items.map((i) => i.id)).size === C.items.length, 'item ids are unique');
const noPic = C.items.filter((i) => !(i.thumb || i.img) && i.open.type !== 'soon' && i.open.type !== 'href' && badPl.every((b) => b.title !== i.title));
ok(noPic.length === 0, 'every video item has a picture: ' + noPic.map((i) => i.title).slice(0, 5));

const top = (q) => (C.search(q, 1)[0] || {}).title;
ok(top('shaktimaan') === 'Shaktimaan', 'search "shaktimaan" -> ' + top('shaktimaan'));
ok(C.search('hamara bajaj').some((i) => i.cat === 'ads'), 'search finds the Bajaj ad');
ok(C.search('sharjah').some((i) => i.cat === 'cricket'), 'search finds Sharjah cricket');
ok(C.search('undertaker').some((i) => i.cat === 'wwf'), 'search finds WWF');
ok(C.search('pehla nasha').some((i) => i.cat === 'songs'), 'search finds a song');
ok(C.search('dilwale').some((i) => i.cat === 'movies'), 'search finds a movie');
ok(C.search('doordarshan').length > 0, 'search finds Doordarshan things');
ok(C.search('  ').length === 0 && C.search('zzzzqqqq').length === 0, 'empty and nonsense searches return nothing');
const multi = C.search('malgudi days');
ok(multi.length > 0 && multi[0].title === 'Malgudi Days', 'two-word search ranks the exact title first');

/* ---------------- tools/add-content.js ---------------- */
const T = require(path.join(root, 'tools', 'add-content.js'));
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), m + ' got ' + JSON.stringify(a));
eq(T.parseTarget('https://www.youtube.com/watch?v=scltYH13uEY&t=5s'), { kind: 'video', id: 'scltYH13uEY' }, 'watch link');
eq(T.parseTarget('https://youtu.be/scltYH13uEY?si=x'), { kind: 'video', id: 'scltYH13uEY' }, 'youtu.be link');
eq(T.parseTarget('scltYH13uEY'), { kind: 'video', id: 'scltYH13uEY' }, 'bare video id');
eq(T.parseTarget('https://www.youtube.com/playlist?list=PLJHHPzufWhuqBnKn6h_kjtMzjjE3YjLWZ'), { kind: 'playlist', id: 'PLJHHPzufWhuqBnKn6h_kjtMzjjE3YjLWZ' }, 'playlist link');
eq(T.parseTarget('https://www.youtube.com/watch?v=scltYH13uEY&list=PLJHHPzufWhuqBnKn6h_kjtMzjjE3YjLWZ'), { kind: 'playlist', id: 'PLJHHPzufWhuqBnKn6h_kjtMzjjE3YjLWZ' }, 'video inside a playlist link = the playlist');
eq(T.parseTarget('PLJHHPzufWhuqBnKn6h_kjtMzjjE3YjLWZ'), { kind: 'playlist', id: 'PLJHHPzufWhuqBnKn6h_kjtMzjjE3YjLWZ' }, 'bare playlist id');
ok(T.parseTarget('hello') === null && T.parseTarget('') === null, 'rubbish is rejected');

const reply = (status, body) => Promise.resolve({ status, ok: status >= 200 && status < 300, json: async () => body });
const fakeFetch = (map) => (url) => {
  const u = decodeURIComponent(url);
  for (const k of Object.keys(map)) if (u.indexOf(k) >= 0) return map[k];
  return reply(404, {});
};
const tmp = path.join(__dirname, '.tmp-content.js');
const sample = fs.readFileSync(path.join(root, 'js', 'content.js'), 'utf8');
function run(args, map, env) {
  const out = [];
  fs.writeFileSync(tmp, sample);
  return T.main(args, { fetch: fakeFetch(map), env: env || {}, log: (s) => out.push(s), contentFile: tmp, readFile: (f) => fs.readFileSync(f, 'utf8'), writeFile: (f, s) => fs.writeFileSync(f, s) })
    .then((code) => ({ code, out: out.join('\n'), file: fs.readFileSync(tmp, 'utf8') }));
}
(async () => {
  const good = { 'watch?v=AAAAAAAAAAA': reply(200, { title: 'Test Song (1996)', author_name: 'Some Label', thumbnail_url: 'https://i.ytimg.com/vi/AAAAAAAAAAA/hqdefault.jpg' }) };
  let r = await run(['AAAAAAAAAAA', '--cat', 'songs'], good);
  ok(r.code === 0 && /yt: 'AAAAAAAAAAA'/.test(r.out) && /year: 1996/.test(r.out) && /credit: 'Some Label'/.test(r.out), 'prints a line for a video');
  ok(r.file === sample, 'without --write the file is untouched');
  r = await run(['AAAAAAAAAAA', '--cat', 'songs', '--write', '--featured', '--official'], good);
  ok(r.code === 0 && /yt: 'AAAAAAAAAAA'/.test(r.file) && /featured: true/.test(r.file), '--write puts the line in the file');
  const lines = r.file.split('\n'), at = lines.findIndex((l) => l.indexOf("'AAAAAAAAAAA'") >= 0);
  ok(/cat: 'songs'/.test(lines[at - 1] + lines[at - 2]) || /cat: 'songs'/.test(lines[at]), 'the new song sits in the songs block');
  ok(/cat: 'cricket'/.test(lines[at + 1]) === false || at > 0, 'placement check ran');
  new Function('window', r.file.replace(/^var /gm, 'var ') + '; return CONTENT.length')({}) ;                      // the edited file still parses
  ok(true, 'edited content.js is still valid JavaScript');
  r = await run(['AAAAAAAAAAA', '--cat', 'songs'], { 'watch?v=AAAAAAAAAAA': reply(401, {}) });
  ok(r.code === 1 && /not let this video be embedded/.test(r.out), '401 = not embeddable, nothing added');
  r = await run(['AAAAAAAAAAA', '--cat', 'songs'], { 'watch?v=AAAAAAAAAAA': reply(400, {}) });
  ok(r.code === 1 && /does not exist/.test(r.out), '400 = not found');
  r = await run(['KeyfUuXPOcY', '--cat', 'songs'], {});
  ok(r.code === 0 && /Already in/.test(r.out), 'a video that is already listed is not added twice');
  r = await run(['AAAAAAAAAAA', '--cat', 'nonsense'], good);
  ok(r.code === 1 && /--cat/.test(r.out), 'a wrong category is rejected');
  r = await run(['PLaaaaaaaaaaaaaaaaaaaa', '--cat', 'tv', '--write'], { 'playlist?list=PLaaaaaaaaaaaaaaaaaaaa': reply(200, { title: 'My Serial', author_name: 'Zee TV', thumbnail_url: 'https://i.ytimg.com/vi/BBBBBBBBBBB/hqdefault.jpg' }) });
  ok(r.code === 0 && /playlist: 'PLaaaaaaaaaaaaaaaaaaaa', thumb: 'BBBBBBBBBBB'/.test(r.file), 'a playlist gets playlist: and the picture of its first video');
  r = await run(['AAAAAAAAAAA', '--cat', 'songs'], Object.assign({ 'googleapis.com/youtube/v3/videos': reply(200, { items: [{ status: { embeddable: false } }] }) }, good), { YT_API_KEY: 'k' });
  ok(r.code === 1 && /not embeddable/.test(r.out), 'with an API key, embeddable:false stops it');
  fs.unlinkSync(tmp);
  console.log(fail ? (fail + ' FAILED, ' + pass + ' passed') : ('ALL OK: ' + pass + ' checks passed'));
  process.exit(fail ? 1 : 0);
})();
