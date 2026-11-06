#!/usr/bin/env node
/* ==========================================================================
   90s REWIND TV — ADD A VIDEO OR PLAYLIST TO THE CONTENT FILE

   Usage (run from the project folder, needs Node 18+ and internet):

     node tools/add-content.js <video or playlist: an ID or a YouTube link> --cat <category> [options]

   Categories: tv  movies  ads  songs  cricket  wwf  cartoons  other
   Options:
     --title "..."     use this title instead of YouTube's
     --year 1995       year it came out / aired (also read from "(1995)" in the title)
     --sub "..."       the small line on the card (default: the channel name)
     --desc "..."      one honest line about it
     --featured        also show it on the homepage row for its category
     --official        the upload is from the rights-holder's own channel
     --write           put the line into js/content.js for you (otherwise it is only printed)

   What it does:
     1. works out whether it is a video or a playlist,
     2. asks YouTube whether it may be embedded (oEmbed: 200 yes, 401 no, 400 not found),
     3. reads the title and channel (and the first video's picture, for a playlist),
     4. prints one ready-made line for js/content.js, or writes it in with --write.

   API KEY (optional, never put in the website): if the environment variable YT_API_KEY is set,
   the script also asks the YouTube Data API for the description and the "embeddable" flag.
   Without a key everything above still works. The key stays on YOUR computer, in your terminal:
       YT_API_KEY=xxxx node tools/add-content.js <id> --cat songs
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const CATS = ['tv', 'movies', 'ads', 'songs', 'cricket', 'wwf', 'cartoons', 'other'];

/* Pull a video or playlist id out of whatever was pasted. */
function parseTarget(input) {
  const s = String(input || '').trim();
  if (!s) return null;
  let m;
  if ((m = s.match(/[?&]list=([A-Za-z0-9_-]{10,})/))) return { kind: 'playlist', id: m[1] };
  if ((m = s.match(/[?&]v=([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/))) return { kind: 'video', id: m[1] };
  if ((m = s.match(/(?:youtu\.be\/|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/))) return { kind: 'video', id: m[1] };
  if (/^(PL|UU|OL|FL|LL|RD)[A-Za-z0-9_-]{8,}$/.test(s)) return { kind: 'playlist', id: s };
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return { kind: 'video', id: s };
  return null;
}

function parseArgs(argv) {
  const o = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (['featured', 'official', 'write', 'help'].includes(k)) o.flags[k] = true;
      else o.flags[k] = argv[++i];
    } else o._.push(a);
  }
  return o;
}

const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

/* The line to paste into js/content.js. */
function buildLine(t, meta, o) {
  const title = o.title || meta.title;
  const parts = ['cat: ' + q(o.cat), 'title: ' + q(title)];
  const sub = o.sub || meta.author || '';
  if (sub) parts.push('sub: ' + q(sub));
  if (meta.author) parts.push('credit: ' + q(meta.author));
  if (o.official) parts.push('official: true');
  parts.push((t.kind === 'playlist' ? 'playlist: ' : 'yt: ') + q(t.id));
  if (t.kind === 'playlist' && meta.thumbVideo) parts.push('thumb: ' + q(meta.thumbVideo));
  const year = o.year || (String(title).match(/\((19\d\d|20[01]\d)\)/) || [])[1];
  if (year) parts.push('year: ' + year);
  if (o.featured) parts.push('featured: true');
  if (o.desc || meta.desc) parts.push('desc: ' + q(o.desc || meta.desc));
  return '  { ' + parts.join(', ') + ' },';
}

/* Ask YouTube. deps.fetch is injected so the tests can run without a network. */
async function lookup(t, deps) {
  const url = t.kind === 'playlist' ? 'https://www.youtube.com/playlist?list=' + t.id : 'https://www.youtube.com/watch?v=' + t.id;
  const r = await deps.fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(url));
  if (r.status === 401) throw new Error('YouTube will not let this ' + t.kind + ' be embedded on other sites (oEmbed answered 401). Pick another upload.');
  if (r.status === 400 || r.status === 404) throw new Error('YouTube says this ' + t.kind + ' does not exist or is private (oEmbed answered ' + r.status + '). Check the id.');
  if (!r.ok) throw new Error('YouTube answered ' + r.status + '. Try again in a minute.');
  const j = await r.json();
  const meta = { title: j.title, author: j.author_name };
  const tm = String(j.thumbnail_url || '').match(/\/vi\/([A-Za-z0-9_-]{11})\//);
  if (t.kind === 'playlist' && tm) meta.thumbVideo = tm[1];
  const key = deps.env && deps.env.YT_API_KEY;
  if (key && t.kind === 'video') {
    try {
      const a = await deps.fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=' + t.id + '&key=' + encodeURIComponent(key));
      const aj = await a.json(), it = aj.items && aj.items[0];
      if (it) {
        if (it.status && it.status.embeddable === false) throw new Error('The YouTube Data API says this video is not embeddable.');
        const first = String((it.snippet && it.snippet.description) || '').split('\n')[0].trim();
        if (first && first.length < 140) meta.desc = first;
      }
    } catch (e) { if (/not embeddable/.test(e.message)) throw e; /* any other API trouble: carry on without it */ }
  }
  return meta;
}

/* Put the line at the end of its category's block in js/content.js. Returns the new file text. */
function insertLine(text, cat, line) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => /^var CONTENT = \[/.test(l));
  const end = lines.findIndex((l, i) => i > start && /^\];/.test(l));
  if (start < 0 || end < 0) throw new Error('Could not find the CONTENT list in js/content.js.');
  let last = -1;
  for (let i = start + 1; i < end; i++) if (new RegExp("\\bcat:\\s*'" + cat + "'").test(lines[i])) last = i;
  if (last >= 0) { while (last < end - 1 && !/\}\s*,?\s*$/.test(lines[last])) last++; lines.splice(last + 1, 0, line); }
  else lines.splice(end, 0, '', line);                          // first item of a new category: at the end of the list
  return lines.join('\n');
}

async function main(argv, deps) {
  const log = deps.log || console.log, o = parseArgs(argv);
  if (o.flags.help || !o._.length) { log('Usage: node tools/add-content.js <video or playlist id or YouTube link> --cat <' + CATS.join('|') + '> [--title ""] [--year N] [--sub ""] [--desc ""] [--featured] [--official] [--write]'); return o.flags.help ? 0 : 1; }
  const t = parseTarget(o._[0]);
  if (!t) { log('That does not look like a YouTube video or playlist id or link.'); return 1; }
  const cat = o.flags.cat;
  if (!CATS.includes(cat)) { log('Pass --cat with one of: ' + CATS.join(', ')); return 1; }
  const file = deps.contentFile;
  let text = deps.readFile(file);
  if (text.indexOf(q(t.id)) >= 0) { log('Already in ' + path.basename(file) + ': ' + t.id + '. Nothing added.'); return 0; }
  let meta;
  try { meta = await lookup(t, deps); } catch (e) { log('Not added. ' + e.message); return 1; }
  const line = buildLine(t, meta, Object.assign({ cat: cat }, o.flags));
  log('Found ' + t.kind + ': ' + meta.title + (meta.author ? ' (' + meta.author + ')' : '') + '. It can be embedded.');
  if (o.flags.write) {
    deps.writeFile(file, insertLine(text, cat, line));
    log('Written into ' + path.basename(file) + ' under ' + cat + ':');
  } else log('Paste this line into js/content.js (in the ' + cat + ' part):');
  log(line);
  if (!meta.author) log('(Tip: add credit: and official: true if it is the rights-holder\'s own upload.)');
  return 0;
}

module.exports = { parseTarget, buildLine, insertLine, lookup, main, CATS };

if (require.main === module) {
  main(process.argv.slice(2), {
    fetch: (...a) => fetch(...a), env: process.env, log: console.log,
    contentFile: path.join(__dirname, '..', 'js', 'content.js'),
    readFile: (f) => fs.readFileSync(f, 'utf8'), writeFile: (f, s) => fs.writeFileSync(f, s)
  }).then((code) => { process.exitCode = code; }, (e) => { console.error(e.message); process.exitCode = 1; });
}
