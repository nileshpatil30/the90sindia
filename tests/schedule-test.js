/* Schedule sanity tests. Run:  node tests/schedule-test.js
   Loads the same scripts the page loads (no browser needed) and checks that
   every channel is well formed, no two shows overlap, and the facts we have
   sources for are really in the timetable. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = vm.createContext({ console: console });
['tv-episodes', 'tv-library', 'tv-schedule', 'tv-config', 'tv-engine'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
});
const get = (name) => vm.runInContext(name, ctx);
const CH = get('TV_CHANNELS'), NETS = get('TV_NETS'), RUNS = get('TV_RUNS'), E = get('TVEngine');

let fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; console.log('FAIL  ' + msg); } }
const DAYN = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const byNum = {}; CH.forEach(c => { byNum[c.num] = c; });

// 1. every channel builds and has no overlapping slots
CH.forEach(function (c) {
  ok(c.slots.length > 0, c.num + ' has slots');
  let model; try { model = E.normalize(c); } catch (e) { ok(false, c.num + ' normalize: ' + e.message); return; }
  const E_ = model.entries;
  for (let i = 0; i < E_.length; i++) {
    const a = E_[i], b = E_[(i + 1) % E_.length];
    const bs = i + 1 < E_.length ? b.start : b.start + 604800;
    if (E_.length > 1) ok(a.end <= bs, c.num + ': "' + a.ref.title + '" ' + a.ref.day + ' ' + a.ref.time + ' overlaps "' + b.ref.title + '" ' + b.ref.day + ' ' + b.ref.time);
  }
});

// 2. runs point at real networks and years, and shows have a source of videos
const netIds = NETS.map(n => n.id);
RUNS.forEach(function (r) {
  ok(netIds.indexOf(r.net) >= 0, r.show + ': unknown network ' + r.net);
  ok(r.from <= r.to, r.show + ': from > to');
  ok(['verified', 'recalled', 'approx'].indexOf(r.conf) >= 0, r.show + ': bad conf');
  ok(!!r.src, r.show + ': missing src');
});

// 3. facts that have a source (see js/tv-schedule.js)
function slot(num, title) { const c = byNum[num]; return c && c.slots.filter(s => s.title === title); }
function has(num, title, day, time, dur) {
  const ss = slot(num, title) || [];
  const hit = ss.filter(s => String(s.day).toLowerCase() === day.toLowerCase() && s.time === time && (!dur || s.duration === dur));
  ok(hit.length === 1, num + ': ' + title + ' should be ' + day + ' ' + time + ' (found ' + ss.map(s => s.day + ' ' + s.time).join(', ') + ')');
}
has('ddn-1987', 'Ramayan', 'Sun', '09:30'); has('ddn-1988', 'Ramayan', 'Sun', '09:30');
has('ddn-1989', 'Mahabharat', 'Sun', '09:00'); has('ddn-1990', 'Mahabharat', 'Sun', '09:00');
has('ddn-1992', 'The Jungle Book (Mowgli)', 'Sun', '10:00'); has('ddn-1993', 'The Jungle Book (Mowgli)', 'Sun', '10:00');
has('ddn-1998', 'Captain Vyom', 'Sun', '10:00');
has('ddn-1995', 'Chandrakanta', 'Sun', '09:00');
has('ddn-1999', 'Shaktimaan', 'Sun', '12:00'); has('ddn-2003', 'Aryamaan', 'Sun', '12:00');
has('ddn-1990', 'Rangoli', 'Sun', '07:30'); has('ddn-1990', 'Chitrahaar', 'Fri', '20:00');
has('zee-1997', 'Hum Paanch', 'Tue', '20:00');
has('sony-2007', 'Comedy Circus', 'Sat', '21:30');
has('ddn-1986', 'Buniyaad', 'Tue', '21:00'); has('ddn-1986', 'Buniyaad', 'Sat', '21:00');
has('ddn-1985', 'Hum Log', 'Tue', '21:00'); has('ddn-1985', 'Hum Log', 'Sat', '21:00');
has('ddm-1994', 'Shrimaan Shrimati', 'Fri', '21:00');
has('ddm-1993', 'Dekh Bhai Dekh', 'Thu', '21:30');
// shows live on the network the sources say
ok(byNum['ddm-1995'] && slot('ddm-1995', 'Tu Tu Main Main').length === 1, 'Tu Tu Main Main on DD Metro 1995');
ok(byNum['star-1998'] && slot('star-1998', 'Tu Tu Main Main').length === 1, 'Tu Tu Main Main on Star Plus 1998');
ok(!byNum['ddn-1992'].slots.some(s => s.title === 'Mahabharat'), 'Mahabharat is not on in 1992');
ok(!byNum['ddn-1988'].slots.some(s => s.title === 'Mahabharat'), '1988 dial holds Ramayan, not Mahabharat');
ok(!CH.some(c => c.slots.some(s => /Comedy Circus Ki/.test(s.title))), 'Kahani Comedy Circus Ki (2012) is not scheduled');
ok(!byNum['zee-1988'], 'Zee TV did not exist in 1988');

// 4. consecutive episodes for a show that airs twice a week
const start = Date.UTC(2026, 10, 15, 0, 0) - 330 * 60000;         // Sun 15 Nov 2026 00:00 IST (one week after the epoch)
const bun = byNum['ddn-1986'];
function epAt(ch, title, dayIdx, hhmm) {
  const t = start + (dayIdx * 86400 + (+hhmm.slice(0, 2) * 3600 + +hhmm.slice(3) * 60) + 60) * 1000;
  const loc = E.locate(ch, t);
  return loc.state === 'show' && loc.entry.ref.title === title ? loc.episodeIndex : null;
}
const tue = epAt(bun, 'Buniyaad', 2, '21:00'), sat = epAt(bun, 'Buniyaad', 6, '21:00');
ok(tue === 2 && sat === 3, 'Buniyaad week 2: Tue ep index 2, Sat ep index 3 (got ' + tue + ', ' + sat + ')');
const next = (function () { const t = start + (7 * 86400 + 2 * 86400 + 21 * 3600 + 60) * 1000; const l = E.locate(bun, t); return l.episodeIndex; })();
ok(next === 4, 'Buniyaad week 3 Tuesday continues at ep index 4 (got ' + next + ')');
// a single-slot show moves one episode a week and starts at Episode 1
const ram = byNum['ddn-1987'];
function ramAt(offsetDays) { const t = Date.UTC(2026, 10, 8, 4, 30) + offsetDays * 86400000 + 5 * 60000; return E.locate(ram, t); }  // Sun 9:35 IST
ok(ramAt(0).episodeIndex === 0 && ramAt(7).episodeIndex === 1 && ramAt(14).episodeIndex === 2, 'Ramayan: Episode 1, 2, 3 on consecutive Sundays');

// 5. summary
const counts = { verified: 0, recalled: 0, approx: 0 };
RUNS.forEach(r => counts[r.conf]++);
const titles = new Set(RUNS.filter(r => !r.fixture && !r.gen).map(r => r.show));
console.log(CH.length + ' channels, ' + RUNS.length + ' schedule rows, ' + titles.size + ' shows | verified ' + counts.verified + ', recalled ' + counts.recalled + ', approx ' + counts.approx);
const noVideo = [...titles].filter(t => !CH.some(c => c.slots.some(s => s.title === t && ((s.episodes && s.episodes.length) || s.playlist))));
console.log('shows with no playable video yet: ' + (noVideo.join(', ') || 'none'));
console.log(checks + ' checks, ' + fails + ' failed');
process.exit(fails ? 1 : 0);
