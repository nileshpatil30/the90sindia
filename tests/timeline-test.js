/* Checks for On This Day (timeline.html), the Phase 1 timeline engine.
     node tests/timeline-test.js                 everything (needs Playwright; the server must be running: python3 -m http.server 8123)
     node tests/timeline-test.js --no-browser    part 1 only: the rules and the data files, no browser, no server
   Part 1 (no browser)
     - the real data files (js/timeline-data-*.js): every record passes the schema and the nine rules, each file holds its own decade
     - the schema, one case for each field; the nine rules of the spec, each shown to fail and to pass
     - who may be seen where: one case for every row of the visibility table
     - dates: 29 February, "today" in Indian time from any time zone, the empty-day steps in order with the real count
     - nothing else links to the page (direct address only) and no existing file mentions it
   Part 2 (headless Chromium)
     - the page with the real (empty) data: it says so plainly
     - the page with the test fixtures (tests/timeline-fixtures.js): Today, empty days, By year, decade chips, the Sources panel,
       the address bar, a clip from the catalogue, text that cannot run as code, a broken record that stays hidden,
       1440 and 390 pixel widths with no sideways scroll, no console errors, nothing outside localhost contacted
   Nothing here publishes or approves an event: the fixtures are test-only and say "TEST FIXTURE" as the reviewer. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const BASE = process.env.BASE || 'http://localhost:8123';
const NO_BROWSER = process.argv.includes('--no-browser');
global.window = global;                                              // the catalogue files attach themselves to window
['tv-episodes', 'tv-library', 'tv-mahabharat', 'tv-ads', 'tv-schedule', 'tv-config', 'tv-thumbs', 'content', 'arcade-data', 'catalogue']
  .forEach((f) => require(path.join(ROOT, 'js', f + '.js')));
const T = require(path.join(ROOT, 'js', 'timeline-core.js'));
const { mk, src, SAMPLES, OPENED } = require('./timeline-fixtures.js');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL: ' + m); } };
const errs = (ev) => T.validateEvent(ev).errors;
const warns = (ev) => T.validateEvent(ev).warnings;
const fails = (ev, part, m) => ok(errs(ev).some((e) => e.includes(part)), m + ' (wanted an error containing "' + part + '", got ' + JSON.stringify(errs(ev)) + ')');
const clean = (ev, m) => ok(errs(ev).length === 0, m + ' ' + JSON.stringify(errs(ev)));
const D = (y, m, d, precision) => ({ y, m, d, precision: precision || 'day' });
const day = (y, m, d, extra) => mk(Object.assign({ id: y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0') + '-fixture', date: D(y, m, d), title: 'E ' + y + '-' + m + '-' + d }, extra || {}));

/* ================================================================ part 1a: the real data files */
const DATA_FILES = [['js/timeline-data-1980s.js', 1980, 1989], ['js/timeline-data-1990s.js', 1990, 1999], ['js/timeline-data-2000s.js', 2000, 2010]];
const REAL = [];
DATA_FILES.forEach(([f, lo, hi]) => {
  ok(fs.existsSync(path.join(ROOT, f)), f + ' exists');
  const ctx = vm.createContext({ window: {}, console });
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  const list = ctx.window.TIMELINE_EVENTS || [];
  ok(Array.isArray(list), f + ' defines window.TIMELINE_EVENTS');
  list.forEach((e) => { REAL.push(e); ok(e.date && e.date.y >= lo && e.date.y <= hi, f + ': ' + e.id + ' belongs in a different decade file'); });
});
{
  const r = T.validateSet(REAL);
  ok(r.errors.length === 0, 'real data: every record passes the schema and the nine rules ' + JSON.stringify(r.errors));
  REAL.forEach((e) => ok(e.published !== true || (e.reviewedBy && e.reviewedBy !== 'TEST FIXTURE' && e.reviewedOn && e.reviewMode), 'real data: ' + e.id + ' is published without a real reviewer'));
  ok(!REAL.some((e) => e.reviewedBy === 'TEST FIXTURE'), 'real data: no test fixture leaked into a data file');
  const cat = new Set(window.Catalogue.items.map((i) => i.id));
  REAL.forEach((e) => (e.related || []).forEach((id) => ok(cat.has(id), 'real data: ' + e.id + ' relates to "' + id + '", which is not in the catalogue')));
  console.log('info: ' + REAL.length + ' records in the data files, ' + REAL.filter((e) => e.published).length + ' published (launch state is 0 published until the owner approves events)');
}

/* ================================================================ part 1b: the schema */
ok(errs(mk()).length === 0 && warns(mk()).length === 0, 'a plain valid event has no errors and no warnings');
SAMPLES.forEach((s) => clean(s, 'fixture ' + s.id + ' is valid'));
ok(T.validateSet(SAMPLES).errors.length === 0, 'the eight fixtures are valid together');

// id and date
fails(mk({ id: '' }), 'id is missing', 'id: empty');
fails(mk({ id: undefined }), 'id is missing', 'id: absent');
fails(mk({ id: '2000-01-02-fixture' }), 'id does not match the date', 'id: wrong day');
fails(mk({ id: '2000-01-01-1fixture' }), 'id does not match the date', 'id: slug must start with a letter');
fails(mk({ id: '2000-01-01-Fixture' }), 'id does not match the date', 'id: slug is lower case');
clean(mk({ id: '1995-08-vsnl', date: D(1995, 8, undefined, 'month'), confidence: 'probable', confidenceNote: 'x' }), 'id: month precision uses YYYY-MM-slug');
clean(mk({ id: '1995-album', date: { y: 1995, precision: 'year' } }), 'id: year precision uses YYYY-slug');
fails(mk({ id: '1995-08-vsnl', date: { y: 1995, precision: 'year' } }), 'id does not match the date', 'id: month id on a year date');
fails(mk({ date: D(1979, 12, 31) }), 'date.y must be a year from 1980 to 2010', 'date: 1979');
fails(mk({ date: D(2011, 1, 1) }), 'date.y must be a year from 1980 to 2010', 'date: 2011');
clean(mk({ id: '1980-01-01-a', date: D(1980, 1, 1) }), 'date: 1980 is allowed');
clean(mk({ id: '2010-12-31-a', date: D(2010, 12, 31) }), 'date: 2010 is allowed');
fails(mk({ id: '1999-02-29-a', date: D(1999, 2, 29) }), 'not a real calendar day', 'date: 29 February 1999');
clean(mk({ id: '2000-02-29-a', date: D(2000, 2, 29) }), 'date: 29 February 2000 is a real day');
clean(mk({ id: '1996-02-29-a', date: D(1996, 2, 29) }), 'date: 29 February 1996 is a real day');
fails(mk({ id: '1995-04-31-a', date: D(1995, 4, 31) }), 'not a real calendar day', 'date: 31 April');
fails(mk({ id: '1995-13-01-a', date: D(1995, 13, 1) }), 'not a real calendar day', 'date: month 13');
fails(mk({ date: { y: 2000, m: 1, d: 1, precision: 'week' } }), 'precision', 'date: unknown precision');
fails(mk({ date: { y: 2000, m: 1, d: 1 } }), 'precision', 'date: no precision');
fails(mk({ id: '1995-08-x', date: { y: 1995, m: 8, d: 3, precision: 'month' }, confidence: 'probable' }), 'month-only date must not have d', 'date: month with a day');
fails(mk({ id: '1995-x', date: { y: 1995, m: 8, precision: 'year' } }), 'year-only date must not have m or d', 'date: year with a month');
fails(mk({ date: undefined }), 'date is missing', 'date: absent');
fails(mk({ date: { y: 2000, m: 1, d: 1, precision: 'day', x: 1 } }), 'unknown field "x"', 'date: unknown field');

// words and lists
fails(mk({ title: '' }), 'title is missing', 'title: empty');
fails(mk({ title: 'x'.repeat(81) }), 'title is 81 characters', 'title: 81 characters');
clean(mk({ title: 'x'.repeat(80) }), 'title: 80 characters is fine');
fails(mk({ summary: '' }), 'summary is missing', 'summary: empty');
fails(mk({ summary: 'x'.repeat(281) }), 'summary is 281 characters', 'summary: 281 characters');
clean(mk({ summary: 'x'.repeat(280) }), 'summary: 280 characters is fine');
T.CATEGORIES.forEach((c) => clean(mk({ category: c }), 'category ' + c + ' is allowed'));
ok(T.CATEGORIES.join() === 'tv,music,film,cricket,news,tech,ads,prices,society', 'the nine categories are exactly the specified ones');
fails(mk({ category: 'sensitive' }), 'category must be one of', 'category: sensitivity is not a category');
fails(mk({ category: 'politics' }), 'category must be one of', 'category: unknown');
fails(mk({ confidence: 'certain' }), 'confidence must be', 'confidence: unknown');
fails(mk({ published: 'yes' }), 'published must be true or false', 'published: not a boolean');
fails(mk({ ticker: 'yes' }), 'ticker must be true or false', 'ticker: not a boolean');
fails(mk({ confidnce: 'verified' }), 'unknown field "confidnce"', 'a misspelt field is caught');
fails(mk({ related: 'abc' }), 'related must be a list', 'related: not a list');
clean(mk({ related: ['abc'] }), 'related: a list of ids');
fails(null, 'not an object', 'an event must be an object');

// sources
fails(mk({ sources: [] }), 'at least one source', 'sources: none');
fails(mk({ sources: undefined, confidence: 'probable' }), 'at least one source', 'sources: absent');
const goodSrc = () => src('Alpha Office', 'Record', 'https://example.org/alpha', 'primary');
const withSrc = (extra) => mk({ confidence: 'probable', sources: [Object.assign(goodSrc(), extra)] });
clean(withSrc({}), 'source: a complete source');
fails(withSrc({ publisher: '' }), 'publisher is missing', 'source: no publisher');
fails(withSrc({ label: '' }), 'label is missing', 'source: no label');
fails(withSrc({ url: 'http://example.org/a' }), 'https link', 'source: http link refused');
fails(withSrc({ url: 'javascript:alert(1)' }), 'https link', 'source: javascript: link refused');
fails(withSrc({ url: 'https://exa mple.org' }), 'https link', 'source: a link with a space refused');
fails(withSrc({ url: '' }), 'https link', 'source: no link');
fails(withSrc({ type: 'blog' }), 'type must be', 'source: unknown type');
T.SOURCE_TYPES.forEach((t) => clean(withSrc({ type: t }), 'source: type ' + t + ' is allowed'));
fails(withSrc({ opened: '' }), 'opened', 'source: no opened date');
fails(withSrc({ opened: '2026-02-30' }), 'opened', 'source: opened is a real day');
fails(withSrc({ publishedOn: '' }), 'publishedOn is required to publish', 'source: a published event needs publishedOn');
fails(withSrc({ publishedOn: undefined }), 'publishedOn is required to publish', 'source: publishedOn absent on a published event');
clean(Object.assign(withSrc({ publishedOn: '' }), { published: false, reviewedBy: '', reviewedOn: '', reviewMode: '' }), 'source: an unpublished draft may leave publishedOn empty');
['undated', '2020', '2020-07', '2020-07-24'].forEach((v) => clean(withSrc({ publishedOn: v }), 'source: publishedOn "' + v + '" is allowed'));
['2020-13', '2020-02-30', 'July 2020', '20', 'unknown', 'Undated'].forEach((v) => fails(withSrc({ publishedOn: v }), 'publishedOn must be', 'source: publishedOn "' + v + '" is refused'));
fails(withSrc({ basedOn: 'https://example.org/nowhere' }), 'basedOn must be the link of another source', 'source: basedOn must point at a listed source');
fails(withSrc({ basedOn: 'https://example.org/alpha' }), 'basedOn must be the link of another source', 'source: a source cannot be based on itself');
fails(withSrc({ extra: 1 }), 'unknown field "extra"', 'source: unknown field');

// sensitivity is separate from category
fails(mk({ sensitivity: 'maybe' }), 'sensitivity must be standard or review', 'sensitivity: unknown value');
ok(T.SENSITIVITY_REASONS.join() === 'political,communal,violence,tragedy,military,legal,privacy,other', 'the eight sensitivity reasons are exactly the specified ones');
clean(mk({ category: 'news' }), 'a news event is standard unless flagged (category does not imply review)');
fails(mk({ sensitivityReason: 'gossip' }), 'sensitivityReason must be one of', 'sensitivityReason: unknown');

/* ================================================================ part 1c: the nine rules */
const A = src('Alpha Office', 'Record', 'https://example.org/alpha', 'primary');
const B = src('Beta Daily', 'Report', 'https://example.org/beta', 'press');
const C = src('Gamma Archive', 'Scorecard', 'https://example.org/gamma', 'authoritative');
const R = src('Delta Reference', 'Entry', 'https://example.org/delta', 'reference');

// rule 1: verified
clean(mk({ sources: [A, B] }), 'rule 1: primary + press is verified');
clean(mk({ sources: [C, R] }), 'rule 1: authoritative + reference is verified');
clean(mk({ sources: [C, src('Epsilon Archive', 'Scorecard 2', 'https://example.org/eps', 'authoritative')] }), 'rule 1: two authoritative archives are verified');
fails(mk({ sources: [A] }), 'rule 1', 'rule 1: one source is not enough');
fails(mk({ sources: [B, src('Zeta News', 'Another report', 'https://example.org/zeta', 'press')] }), 'at least one independent primary or authoritative', 'rule 1: two press sources are Probable at best');
fails(mk({ sources: [R, B] }), 'at least one independent primary or authoritative', 'rule 1: reference + press has no primary or authoritative');
fails(mk({ sources: [A, src('Alpha Office', 'Second page', 'https://example.org/alpha2', 'primary')] }), 'two or more independent sources', 'rule 1: the same publisher counts once');
fails(mk({ sources: [A, src('ALPHA OFFICE ', 'Second page', 'https://example.org/alpha2', 'authoritative')] }), 'two or more independent sources', 'rule 1: publisher compare ignores case and spaces');
fails(mk({ sources: [A, Object.assign({}, B, { basedOn: A.url })] }), 'two or more independent sources', 'rule 1: a source based on another is not independent');
fails(mk({ sources: [Object.assign({}, A, { basedOn: B.url }), B] }), 'at least one independent primary or authoritative', 'rule 1: a primary source based on a press one leaves no primary');
clean(mk({ sources: [A, B, Object.assign({}, R, { basedOn: B.url })] }), 'rule 1: a third source based on the second does not stop two others counting');
ok(T.independentSources([A, Object.assign({}, B, { basedOn: A.url })]).length === 1, 'independentSources drops the repeat');

// rule 2: probable
clean(mk({ confidence: 'probable', sources: [B] }), 'rule 2: probable with one source');
fails(mk({ confidence: 'probable', sources: [] }), 'rule 2', 'rule 2: probable with no source');
fails(mk({ confidence: 'probable', sources: [B], ticker: true }), 'probable event can never be in the ticker', 'rule 2: probable never in the ticker');

// rule 3: disputed
const disp = (x) => mk(Object.assign({ id: '1995-08-vsnl', date: D(1995, 8, undefined, 'month'), confidence: 'disputed', confidenceNote: 'Sources differ.', sources: [B, src('Other Daily', 'Other', 'https://example.org/o', 'press')] }, x || {}));
clean(disp(), 'rule 3: a disputed month event');
clean(disp({ id: '1995-album', date: { y: 1995, precision: 'year' } }), 'rule 3: a disputed year event');
fails(disp({ confidenceNote: '' }), 'disputed needs a confidenceNote', 'rule 3: a note is required');
fails(disp({ confidenceNote: undefined }), 'disputed needs a confidenceNote', 'rule 3: a note is required (absent)');
fails(disp({ id: '1995-08-14-vsnl', date: D(1995, 8, 14) }), 'disputed cannot have day precision', 'rule 3: no day precision');
fails(disp({ ticker: true }), 'disputed event can never be in the ticker', 'rule 3: never in the ticker');
fails(disp({ reviewMode: 'sampled', reviewBatch: 'B001' }), 'disputed needs reviewMode: individual', 'rule 3: a disputed event is reviewed individually');

// rule 4: ticker
clean(mk({ ticker: true }), 'rule 4: a verified, exact-day, standard, published event can be in the ticker');
fails(mk({ ticker: true, confidence: 'probable', sources: [B] }), 'only Verified events can be in the ticker', 'rule 4: Probable refused');
fails(mk({ ticker: true, id: '2000-01-x', date: D(2000, 1, undefined, 'month') }), 'ticker event needs day precision', 'rule 4: month precision refused');
fails(mk({ ticker: true, sensitivity: 'review', sensitivityReason: 'political', sensitivityApprovedBy: 'T', sensitivityApprovedOn: OPENED }), 'standard sensitivity', 'rule 4: a review event refused');
fails(mk({ ticker: true, published: false, reviewedBy: '', reviewedOn: '', reviewMode: '' }), 'needs published: true', 'rule 4: unpublished refused');

// rule 5: published needs the review record
fails(mk({ reviewedBy: '' }), 'published needs reviewedBy', 'rule 5: reviewer name');
fails(mk({ reviewedOn: '' }), 'published needs reviewedOn', 'rule 5: reviewed date');
fails(mk({ reviewedOn: '2026-13-01' }), 'reviewedOn', 'rule 5: reviewed date must be real');
fails(mk({ reviewMode: '' }), 'published needs reviewMode', 'rule 5: review mode');
fails(mk({ reviewMode: 'quick' }), 'reviewMode must be individual or sampled', 'rule 5: review mode value');
clean(mk({ published: false, reviewedBy: '', reviewedOn: '', reviewMode: '' }), 'rule 5: a draft needs no review record');

// rule 6 is covered by the source cases above; the page-level check is in part 2

// rule 7: sensitivity review
const rv = (x) => mk(Object.assign({ sensitivity: 'review', sensitivityReason: 'military', sensitivityApprovedBy: 'TEST FIXTURE', sensitivityApprovedOn: OPENED }, x || {}));
clean(rv(), 'rule 7: a review event with reason and approval can be published');
fails(rv({ sensitivityReason: undefined }), 'needs a sensitivityReason', 'rule 7: a reason is required');
fails(rv({ sensitivityApprovedBy: '' }), 'cannot be published until sensitivityApprovedBy', 'rule 7: approver required');
fails(rv({ sensitivityApprovedOn: '' }), 'cannot be published until sensitivityApprovedBy', 'rule 7: approval date required');
fails(rv({ sensitivityApprovedOn: '2026-02-31' }), 'cannot be published until sensitivityApprovedBy', 'rule 7: approval date must be real');
fails(rv({ reviewMode: 'sampled', reviewBatch: 'B001' }), 'needs reviewMode: individual', 'rule 7: never reviewed from a sample');
clean(rv({ published: false, reviewedBy: '', reviewedOn: '', reviewMode: '', sensitivityApprovedBy: '', sensitivityApprovedOn: '' }), 'rule 7: an unapproved review event is fine as an unpublished draft');
T.SENSITIVITY_REASONS.forEach((r) => clean(rv({ sensitivityReason: r }), 'rule 7: reason ' + r + ' is accepted'));

// rule 8: sampled review
fails(mk({ reviewMode: 'sampled' }), 'needs a reviewBatch', 'rule 8: a sampled entry needs a batch');
fails(mk({ reviewMode: 'sampled', reviewBatch: 'batch1' }), 'needs a reviewBatch', 'rule 8: the batch looks like B001');
clean(mk({ reviewMode: 'sampled', reviewBatch: 'B001' }), 'rule 8: a sampled entry with a batch is valid on its own');
const manyIndividual = (n) => Array.from({ length: n }, (_, i) => mk({ id: '1990-01-01-ind' + String.fromCharCode(97 + (i % 26)) + String.fromCharCode(97 + Math.floor(i / 26)), date: D(1990, 1, 1) }));
const sampled = mk({ id: '1991-01-01-samp', date: D(1991, 1, 1), reviewMode: 'sampled', reviewBatch: 'B001' });
ok(T.validateSet(manyIndividual(19).concat([sampled])).errors.some((e) => e.includes('rule 8')), 'rule 8: 19 individual approvals are not enough for a sampled entry');
ok(!T.validateSet(manyIndividual(20).concat([sampled])).errors.some((e) => e.includes('rule 8')), 'rule 8: 20 individual approvals allow a sampled entry');
ok(T.liveEvents(manyIndividual(19).concat([sampled])).every((e) => e.reviewMode === 'individual'), 'rule 8: the page hides a sampled entry before 20 individual approvals');
ok(T.liveEvents(manyIndividual(20).concat([sampled])).some((e) => e.reviewMode === 'sampled'), 'rule 8: the page shows a sampled entry after 20 individual approvals');
ok(!T.validateSet(manyIndividual(3).concat([Object.assign({}, sampled, { published: false, reviewedBy: '', reviewedOn: '', reviewMode: 'sampled' })])).errors.some((e) => e.includes('rule 8')), 'rule 8: an unpublished draft is not counted against the limit');
ok(T.validateSet(manyIndividual(20).concat(manyIndividual(1).map((e) => Object.assign({}, e)))).errors.some((e) => e.includes('id is used twice')), 'ids must be unique');
// the owner's sampling rule: the greater of 3 or 20% of the batch, rounded up
[[1, 1], [2, 2], [3, 3], [10, 3], [15, 3], [16, 4], [20, 4], [21, 5], [50, 10], [100, 20]].forEach(([n, s]) => ok(T.sampleSize(n) === s, 'sample size for a batch of ' + n + ' is ' + s + ' (got ' + T.sampleSize(n) + ')'));

// rule 9: superlatives
['first', 'biggest', 'only', 'largest', 'FIRST', 'First'].forEach((w) => {
  ok(warns(mk({ title: 'The ' + w + ' thing' })).length === 1, 'rule 9: "' + w + '" in a title raises a warning');
  ok(warns(mk({ summary: 'It was the ' + w + ' of its kind.' })).length === 1, 'rule 9: "' + w + '" in a summary raises a warning');
});
ok(warns(mk({ title: 'Firsthand account', summary: 'Lonely, firstly, onlyness' })).length === 0, 'rule 9: whole words only');
ok(errs(mk({ title: 'The first thing' })).length === 0, 'rule 9: a warning is not an error');

/* ================================================================ part 1d: who may be seen where (the visibility table) */
{
  const verDay = day(1991, 7, 24, { id: '1991-07-24-vd', ticker: true });
  const verDayNoTicker = day(1991, 7, 25, { id: '1991-07-25-vn' });
  const verMonth = mk({ id: '1991-07-vm', date: D(1991, 7, undefined, 'month'), title: 'VM' });
  const verYear = mk({ id: '1991-vy', date: { y: 1991, precision: 'year' }, title: 'VY' });
  const probDay = day(1992, 10, 2, { id: '1992-10-02-pd', confidence: 'probable', sources: [B] });
  const probMonth = mk({ id: '1992-10-pm', date: D(1992, 10, undefined, 'month'), confidence: 'probable', sources: [B], title: 'PM' });
  const probYear = mk({ id: '1992-py', date: { y: 1992, precision: 'year' }, confidence: 'probable', sources: [B], title: 'PY' });
  const dispMonth = disp({ id: '1993-08-dm', date: D(1993, 8, undefined, 'month'), title: 'DM' });
  const dispYear = disp({ id: '1993-dy', date: { y: 1993, precision: 'year' }, title: 'DY' });
  const reviewUnapproved = mk({ id: '1994-05-11-ru', date: D(1994, 5, 11), sensitivity: 'review', sensitivityReason: 'military', published: false, reviewedBy: '', reviewedOn: '', reviewMode: '' });
  const reviewUnapprovedButPublished = mk({ id: '1994-05-12-rp', date: D(1994, 5, 12), sensitivity: 'review', sensitivityReason: 'military' });
  const draft = day(1994, 6, 1, { id: '1994-06-01-dr', published: false, reviewedBy: '', reviewedOn: '', reviewMode: '' });
  const all = [verDay, verDayNoTicker, verMonth, verYear, probDay, probMonth, probYear, dispMonth, dispYear, reviewUnapproved, reviewUnapprovedButPublished, draft];
  const live = T.liveEvents(all), liveIds = live.map((e) => e.id);
  const P = (e) => T.placement(e);
  ok(P(verDay).year && P(verDay).today && P(verDay).ticker, 'table: Verified exact day: timeline, This Day, and the ticker when ticker is true');
  ok(P(verDayNoTicker).year && P(verDayNoTicker).today && !P(verDayNoTicker).ticker, 'table: Verified exact day without the flag is not in the ticker');
  ok(P(verMonth).year && !P(verMonth).today && !P(verMonth).ticker, 'table: Verified month only: timeline only');
  ok(P(verYear).year && !P(verYear).today && !P(verYear).ticker, 'table: Verified year only: timeline only');
  ok(P(probDay).year && P(probDay).today && !P(probDay).ticker, 'table: Probable exact day: timeline and This Day, never the ticker');
  ok(P(probMonth).year && !P(probMonth).today && !P(probMonth).ticker, 'table: Probable month only: timeline only');
  ok(P(probYear).year && !P(probYear).today && !P(probYear).ticker, 'table: Probable year only: timeline only');
  ok(P(dispMonth).year && !P(dispMonth).today && !P(dispMonth).ticker, 'table: Disputed month: timeline only');
  ok(P(dispYear).year && !P(dispYear).today && !P(dispYear).ticker, 'table: Disputed year: timeline only');
  ok(!liveIds.includes('1994-05-11-ru'), 'table: an unapproved review event is not live');
  ok(!liveIds.includes('1994-05-12-rp'), 'table: a review event marked published without approval is still not live');
  ok(!liveIds.includes('1994-06-01-dr'), 'table: an unpublished event is not live');
  ok(live.length === 9, 'table: nine of the twelve are live (got ' + live.length + ')');
  // through the views: the Today view uses today-placement only, the year view uses year-placement
  const todayIds = (m, d) => T.dayView(live, { y: 2026, m, d }).items.map((i) => i.ev.id);
  ok(todayIds(7, 24).join() === '1991-07-24-vd', 'table: Today shows the Verified exact-day event');
  ok(todayIds(10, 2).join() === '1992-10-02-pd', 'table: Today shows a Probable exact-day event');
  ok(T.dayView(live, { y: 2026, m: 7, d: 1 }).items.every((i) => !['1991-07-vm', '1991-vy', '1992-10-pm', '1992-py', '1993-08-dm', '1993-dy'].includes(i.ev.id)), 'table: month-only, year-only and Disputed events never reach Today, even as a fallback');
  ok(T.inYear(live, 1993).map((e) => e.id).join() === '1993-08-dm,1993-dy', 'table: Disputed events appear in the year view');
  ok(T.inYear(live, 1994).length === 0, 'table: review and draft events never appear in the year view');
  const ids = live.map((e) => e.id);
  ok(ids.filter((i) => P(live.find((e) => e.id === i)).ticker).join() === '1991-07-24-vd', 'table: exactly one event is ticker-eligible');
}

/* ================================================================ part 1e: dates */
{
  const iso = (s) => T.istToday(new Date(s));
  const eq = (a, y, m, d) => a.y === y && a.m === m && a.d === d;
  ok(eq(iso('2026-07-23T20:00:00-07:00'), 2026, 7, 24), 'IST: 8pm in Los Angeles on 23 July is already 24 July in India');
  ok(eq(iso('2026-07-24T00:10:00+05:30'), 2026, 7, 24), 'IST: ten past midnight in India is the new day');
  ok(eq(iso('2026-07-23T18:29:59Z'), 2026, 7, 23), 'IST: 23:59:59 in India is still 23 July');
  ok(eq(iso('2026-07-23T18:30:00Z'), 2026, 7, 24), 'IST: 00:00:00 in India is 24 July');
  ok(eq(iso('2026-12-31T19:00:00Z'), 2027, 1, 1), 'IST: the new year arrives in India first');
  ok(eq(iso('2028-02-28T19:00:00Z'), 2028, 2, 29), 'IST: 29 February 2028 exists');
  ok(eq(iso('2027-02-28T19:00:00Z'), 2027, 3, 1), 'IST: 28 February 2027 ends into 1 March');
  ok(T.istToday().y >= 2026, 'IST: with no argument it uses the clock');
  ok(T.daysBetween({ y: 2026, m: 7, d: 15 }, { y: 2026, m: 7, d: 24 }) === 9, 'daysBetween: 9 days');
  ok(T.daysBetween({ y: 2027, m: 12, d: 31 }, { y: 2028, m: 3, d: 1 }) === 61, 'daysBetween: across a leap February');
  ok(T.daysBetween({ y: 2026, m: 7, d: 24 }, { y: 2026, m: 7, d: 15 }) === -9, 'daysBetween: negative when backwards');
  ok(T.isLeap(2000) && T.isLeap(1996) && !T.isLeap(1900) && !T.isLeap(2026), 'isLeap');
  let n = T.nextOccurrence({ m: 2, d: 29 }, { y: 2026, m: 3, d: 1 });
  ok(eq(n, 2028, 2, 29), '29 February waits for the next leap year, never an invented date (' + JSON.stringify(n) + ')');
  n = T.nextOccurrence({ m: 2, d: 29 }, { y: 2028, m: 2, d: 29 }); ok(eq(n, 2028, 2, 29) && n.days === 0, '29 February on 29 February is today');
  n = T.nextOccurrence({ m: 7, d: 24 }, { y: 2026, m: 7, d: 25 }); ok(eq(n, 2027, 7, 24) && n.days === 364, 'an anniversary that has passed rolls to next year');
  ok(T.fmtDayMonth(7, 24) === '24 July' && T.fmtShort(D(1991, 7, 24)) === '24 Jul 1991' && T.fmtShort(D(1995, 8, undefined, 'month')) === 'Aug 1995' && T.fmtShort({ y: 1995, precision: 'year' }) === '1995', 'date formats');
  ok(T.yearsAgo(1991, { y: 2026 }) === '35 years ago' && T.yearsAgo(2025, { y: 2026 }) === '1 year ago', 'years ago: plural and singular');
  ok(T.inDays(9) === 'in 9 days' && T.inDays(1) === 'in 1 day', 'in N days: plural and singular');
  ok(T.fmtIso('2026-11-06') === '6 Nov 2026' && T.fmtPublishedOn('undated') === 'no date on the page' && T.fmtPublishedOn('2020') === '2020' && T.fmtPublishedOn('2020-07') === 'Jul 2020' && T.fmtPublishedOn('2020-07-24') === '24 Jul 2020', 'source date formats');
}

// the empty-day steps, in order
{
  const E = (y, m, d, x) => day(y, m, d, Object.assign({ id: y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0') + '-e' + (x && x.tag || ''), title: 'E ' + y + '-' + m + '-' + d + (x && x.tag || '') }, x && x.o || {}));
  const view = (events, t) => T.dayView(events, { y: t[0], m: t[1], d: t[2] });
  const ids = (v) => v.items.map((i) => i.ev.date.y + '-' + i.ev.date.m + '-' + i.ev.date.d).join(' ');
  const jul24a = E(1991, 7, 24), jul24b = E(1985, 7, 24, { tag: 'b' }), jul31 = E(1995, 7, 31), aug2 = E(1996, 8, 2), oct2 = E(1992, 10, 2), mar15 = E(1999, 3, 15);
  const set = [jul24a, jul24b, jul31, aug2, oct2, mar15];
  let v = view(set, [2026, 7, 24]);
  ok(v.step === 'today' && v.count === 2 && v.items.map((i) => i.ev.date.y).join() === '1985,1991', 'steps: events on the date come first, earliest year first');
  ok(v.items.every((i) => i.days === 0), 'steps: today items are zero days away');
  v = view(set, [2026, 7, 20]);
  ok(v.step === 'week' && v.count === 2 && ids(v) === '1985-7-24 1991-7-24' && v.items[0].days === 4, 'steps: the next seven days (4 days away), counted correctly');
  v = view(set, [2026, 7, 17]);
  ok(v.step === 'week' && ids(v) === '1985-7-24 1991-7-24' && v.items[0].days === 7, 'steps: seven days away is inside the week');
  v = view(set, [2026, 7, 16]);
  ok(v.step === 'month' && v.count === 3 && v.items[0].days === 8 && ids(v) === '1985-7-24 1991-7-24 1995-7-31', 'steps: eight days away is "later this month", not the week (' + v.step + ')');
  ok(v.items.every((i) => i.next.m === 7 && i.next.y === 2026), 'steps: the rest of the month stays in the month');
  v = view(set, [2026, 8, 1]);
  ok(v.step === 'week' && ids(v) === '1996-8-2', 'steps: the week can cross into the next month');
  v = view(set, [2026, 8, 20]);
  ok(v.step === 'next' && v.count === 1 && ids(v) === '1992-10-2' && v.items[0].days === 43, 'steps: nothing for the rest of the month, so the next event in the archive (43 days, got ' + (v.items[0] && v.items[0].days) + ')');
  v = view(set, [2026, 12, 20]);
  ok(v.step === 'next' && ids(v) === '1999-3-15' && v.items[0].next.y === 2027 && v.items[0].days === 85, 'steps: the next event runs on into the following year');
  const two = [E(1991, 3, 15), E(1993, 3, 15, { tag: 'x' }), E(1994, 5, 5)];
  v = view(two, [2026, 12, 20]);
  ok(v.step === 'next' && v.count === 2 && ids(v) === '1991-3-15 1993-3-15', 'steps: events sharing the next date are all shown, and only those');
  ok(view([], [2026, 7, 24]).step === 'none' && view([], [2026, 7, 24]).count === 0, 'steps: an empty archive says so');
  const notDay = [mk({ id: '1991-07-m', date: D(1991, 7, undefined, 'month') }), mk({ id: '1991-y', date: { y: 1991, precision: 'year' } })];
  ok(view(notDay, [2026, 7, 24]).step === 'none', 'steps: month-only and year-only events never count as dated events');
  // the fallback never claims an event is today
  [[2026, 7, 16], [2026, 7, 20], [2026, 8, 20], [2026, 12, 20]].forEach((t) => {
    const f = view(set, t);
    ok(f.items.length === f.count && f.count > 0, 'steps: the stated count equals the cards shown on ' + t.join('-'));
    ok(f.items.every((i) => i.days >= 1 && !(i.next.m === t[1] && i.next.d === t[2] && i.next.y === t[0])), 'steps: no fallback card is dated today (' + t.join('-') + ')');
  });
  // 29 February
  const leapDay = E(1996, 2, 29);
  ok(view([leapDay], [2027, 2, 28]).step === 'next' && view([leapDay], [2027, 2, 28]).items[0].next.y === 2028 && view([leapDay], [2027, 2, 28]).items[0].next.d === 29, 'steps: a 29 February event is never shown on 28 February or 1 March of a normal year, its real date is 29 February 2028');
  ok(view([leapDay], [2027, 3, 1]).step === 'next', 'steps: 1 March 2027 does not borrow the 29 February event');
  ok(view([leapDay], [2028, 2, 29]).step === 'today', 'steps: it shows on 29 February in a leap year');
  // probable exact-day events take part; the order is days first, then year
  const prob = E(1992, 10, 2, { tag: 'p', o: { confidence: 'probable', sources: [B] } });
  ok(view([prob], [2026, 10, 2]).step === 'today', 'steps: a Probable exact-day event is shown on its day');
}

// the year view helpers
{
  const y95 = [
    mk({ id: '1995-y1', date: { y: 1995, precision: 'year' }, title: 'Y' }), mk({ id: '1995-08-m1', date: D(1995, 8, undefined, 'month'), title: 'M Aug' }),
    mk({ id: '1995-01-m2', date: D(1995, 1, undefined, 'month'), title: 'M Jan' }), day(1995, 7, 31, { id: '1995-07-31-d1', title: 'D 31 Jul' }), day(1995, 2, 3, { id: '1995-02-03-d2', title: 'D 3 Feb' })];
  ok(T.inYear(y95, 1995).map((e) => e.title).join('|') === 'D 3 Feb|D 31 Jul|M Jan|M Aug|Y', 'year view: day events, then month, then year only, each in date order');
  const yc = T.yearCounts(y95.concat([day(1996, 1, 1)])); ok(yc[1995] === 5 && yc[1996] === 1 && !yc[1997], 'year counts');
  const ds = (list) => T.decades(list).map((d) => d.label + ':' + d.count).join();
  ok(ds([]) === '', 'decades: none with no events');
  ok(ds(y95) === '1990s:5', 'decades: a decade appears when it has an event');
  ok(ds(y95.concat([day(1983, 6, 25), day(2010, 3, 3, { id: '2010-03-03-x' })])) === '1980s:1,1990s:5,2010s:1', 'decades: 2010 is its own decade chip');
  ok(T.yearsOfDecade(1990).join() === '1990,1991,1992,1993,1994,1995,1996,1997,1998,1999', 'rail: ten years for a full decade');
  ok(T.yearsOfDecade(2010).join() === '2010' && T.yearsOfDecade(2000).length === 10, 'rail: the last decade stops at 2010');
  ok(T.defaultYear([]) === null, 'default year: none for an empty archive');
  ok(T.defaultYear(y95.concat([day(1983, 6, 25)])) === 1995, 'default year: the 1990s open first when they have events');
  ok(T.defaultYear([day(1983, 6, 25), day(1985, 1, 1)]) === 1983, 'default year: otherwise the earliest decade, earliest year');
  const live = y95.concat([day(1996, 1, 1)]);
  ok(JSON.stringify(T.parseState('', live)) === JSON.stringify({ tab: 'today', y: null }), 'address: no query is the Today view');
  ok(JSON.stringify(T.parseState('?tab=year&y=1996', live)) === JSON.stringify({ tab: 'year', y: 1996 }), 'address: ?tab=year&y=1996');
  ok(T.parseState('?tab=year', live).y === 1995, 'address: no year falls back to the default year');
  ok(T.parseState('?tab=year&y=abcd', live).y === 1995 && T.parseState('?tab=year&y=1850', live).y === 1995 && T.parseState('?tab=year&y=2099', live).y === 1995, 'address: a bad year falls back to the default');
  ok(T.parseState('?tab=year&y=%E0%A4%A', live).tab === 'year', 'address: a broken percent sequence does not throw');
  ok(T.parseState('?tab=other&y=1996', live).tab === 'today', 'address: an unknown tab is Today');
  ok(T.stateUrl({ tab: 'today', y: 1996 }) === 'timeline.html' && T.stateUrl({ tab: 'year', y: 1992 }) === 'timeline.html?tab=year&y=1992', 'address: the shareable form');
}

/* ================================================================ part 1f: direct address only */
{
  const files = fs.readdirSync(ROOT).filter((f) => /\.html$/.test(f) && f !== 'timeline.html')
    .concat(fs.readdirSync(path.join(ROOT, 'js')).filter((f) => !/^timeline/.test(f)).map((f) => 'js/' + f))
    .concat(fs.readdirSync(path.join(ROOT, 'css')).filter((f) => !/^timeline/.test(f)).map((f) => 'css/' + f));
  const linking = files.filter((f) => /timeline\.html|On This Day|timeline-core|timeline\.js/i.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  ok(!linking.length, 'direct address only: no existing page, script or style mentions the page (' + linking + ')');
  ok(!(window.NAV || []).some((n) => /timeline/i.test(n.href + n.label + n.id)), 'direct address only: no navigation entry');
  ok(!(window.TICKER || []).some((t) => /timeline/i.test(t.href + t.text)), 'direct address only: nothing in the ticker');
  const html = fs.readFileSync(path.join(ROOT, 'timeline.html'), 'utf8');
  ok(/<body data-page="timeline">/.test(html), 'the page opts in to the shared shell');
  ['css/timeline.css', 'js/timeline-core.js', 'js/timeline-data-1980s.js', 'js/timeline-data-1990s.js', 'js/timeline-data-2000s.js', 'js/timeline.js'].forEach((f) => ok(html.includes(f) && fs.existsSync(path.join(ROOT, f)), 'timeline.html loads ' + f));
  const css = fs.readFileSync(path.join(ROOT, 'css/timeline.css'), 'utf8');
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, '').match(/[^{}]+(?=\{)/g).join(',').split(',').map((s) => s.trim()).filter((s) => !/^\d+%|^@media|^from|^to/.test(s));
  const bad = selectors.filter((sel) => !/\.tl(?![\w-])|\.tl-/.test(sel));
  ok(!bad.length, 'css/timeline.css: every rule is scoped to a tl- class, so nothing else on the site can change (' + [...new Set(bad)].slice(0, 5) + ')');
  const own = (css.replace(/\/\*[\s\S]*?\*\//g, '').match(/\.[a-z][\w-]*/gi) || []).filter((c) => !/^\.(tl|tl-[\w-]+|fchip|fchips|fcount|btn|load-err|\d+)$/.test(c) && !/^\.\d/.test(c));
  ok(!own.length, 'css/timeline.css only uses tl- classes plus the shared chips and buttons (found ' + [...new Set(own)].slice(0, 5) + ')');
  const jsx = fs.readFileSync(path.join(ROOT, 'js/timeline.js'), 'utf8');
  ok(!/\b(is-empty|is-date)\b/.test(jsx), 'js/timeline.js uses no un-prefixed state classes');
}

console.log('part 1: ' + pass + ' passed, ' + fail + ' failed');
if (NO_BROWSER) { console.log(fail ? 'FAILED' : 'ALL OK (no browser)'); process.exit(fail ? 1 : 0); }

/* ================================================================ part 2: the page in a browser */
const { chromium } = require('playwright');
const STAND_IN = '<!doctype html><title>stand-in</title><body>stand-in</body>';
const dataJs = (events) => '(window.TIMELINE_EVENTS = window.TIMELINE_EVENTS || []).push.apply(window.TIMELINE_EVENTS, ' + JSON.stringify(events) + ');';
async function open(b, url, o) {
  o = o || {};
  const ctx = await b.newContext({ viewport: o.vp || { width: 1440, height: 900 }, timezoneId: o.tz || 'Asia/Kolkata' });
  const pg = await ctx.newPage();
  pg.errs = []; pg.warns = []; pg.outside = [];
  pg.on('pageerror', (e) => pg.errs.push(e.message));
  pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) pg.errs.push(m.text()); if (m.type() === 'warning') pg.warns.push(m.text()); });
  await ctx.route(/^https?:\/\/(?!localhost)/, (r) => { const u = r.request().url(); pg.outside.push(u); r.fulfill(/\.js(\?|$)|iframe_api/.test(u) ? { contentType: 'text/javascript', body: '' } : { contentType: 'text/html', body: STAND_IN }); });
  await pg.route('https://i.ytimg.com/**', (r) => r.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#557"/></svg>' }));
  if (o.events) await ctx.route('**/js/timeline-data-1990s.js', (r) => r.fulfill({ contentType: 'text/javascript', body: dataJs(o.events) }));
  if (o.now) await ctx.clock.setFixedTime(new Date(o.now));
  if (url) await pg.goto(BASE + '/' + url, { waitUntil: 'load' });
  return { ctx, pg };
}
const noSideScroll = (pg) => pg.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
const text = (pg, sel) => pg.locator(sel).first().innerText();
const count = (pg, sel) => pg.locator(sel).count();
const pressed = (pg, sel) => pg.locator(sel).first().getAttribute('aria-pressed');
const clipId = (window.Catalogue.items.find((i) => i.open && i.open.type === 'yt') || {}).id;

(async () => {
  const b = await chromium.launch();
  const VPS = [{ width: 1440, height: 900 }, { width: 390, height: 800 }];

  /* ---- launch state: the real, empty data ---- */
  for (const vp of VPS) {
    const w = 'launch ' + vp.width + 'px: ';
    const { ctx, pg } = await open(b, 'timeline.html', { vp });
    ok(/On This\s+Day/i.test(await text(pg, 'h1')), w + 'the heading is "On This Day"');
    ok((await text(pg, '.tl-notice')).includes('No events are published yet'), w + 'it says plainly that nothing is published yet');
    ok(await count(pg, '.tl-card') === 0, w + 'no event card is shown');
    ok((await text(pg, '.fcount')).includes('no events yet'), w + 'the count says no events yet');
    ok(await pressed(pg, '[data-tab=today]') === 'true' && await pressed(pg, '[data-tab=year]') === 'false', w + 'Today is the open tab');
    await pg.click('[data-tab=year]');
    ok((await text(pg, '#tl-out')).includes('No events are published yet') && await count(pg, '#tl-rail') === 0 && await count(pg, '.tl-decades') === 0, w + 'By year says so too, with no empty rail or chips');
    ok(pg.url().endsWith('timeline.html?tab=year'), w + 'the address follows the tab (' + pg.url() + ')');
    ok(await count(pg, '.tab[aria-current=page]') === 0, w + 'no main tab is marked current: the page is not part of the menu');
    ok(await count(pg, '.tab') === 11, w + 'the main menu is unchanged (11 tabs)');
    ok(await noSideScroll(pg), w + 'no sideways scroll');
    ok(pg.errs.length === 0, w + 'no page errors ' + pg.errs);
    ok(pg.outside.length === 0, w + 'nothing outside localhost was contacted ' + pg.outside);
    ok(await count(pg, '.ticker-items a') >= 8, w + 'the existing ticker is untouched');
    await ctx.close();
  }

  /* ---- with events: Today ---- */
  const FX = SAMPLES.concat([]);
  for (const vp of VPS) {
    const w = 'today ' + vp.width + 'px: ';
    const { ctx, pg } = await open(b, 'timeline.html', { vp, events: FX, now: '2026-07-24T10:00:00+05:30' });
    ok((await text(pg, '.tl-bar h2')) === '24 July', w + 'the date is shown');
    ok((await text(pg, '.fcount')) === '1 event', w + 'one event today');
    const card = pg.locator('.tl-card').first();
    ok(await count(pg, '.tl-card') === 1, w + 'one card');
    ok((await card.locator('.tl-yr').innerText()) === '1991' && (await card.locator('.tl-ago').innerText()) === '35 years ago', w + 'the year and how long ago');
    ok((await card.locator('h3').innerText()) === 'Union Budget 1991-92 presented', w + 'the title');
    const chips = await card.locator('.tl-chip').allInnerTexts();
    ok(chips.join('|') === 'Verified|2 sources|News', w + 'status, source count and category as words (' + chips + ')');
    ok(await card.locator('[data-clip]').count() === 0, w + 'no clip button without a related video');
    ok(await noSideScroll(pg), w + 'no sideways scroll');

    // the Sources panel
    const btn = card.locator('[data-sources]');
    await btn.click();
    const panel = pg.locator('.tl-veil:not([hidden])');
    ok(await panel.count() === 1, w + 'the Sources panel opens');
    const pop = await text(pg, '.tl-pop-b');
    ok(pop.includes('Ministry of Finance') && pop.includes('Budget speech 1991-92') && pop.includes('Primary') && pop.includes('Business Today') && pop.includes('Press'), w + 'publisher, title and type in words');
    ok(pop.includes('Published: no date on the page') && pop.includes('Opened 6 Nov 2026'), w + 'publication date and the date it was opened');
    ok(pop.includes('The four types'), w + 'the key to the four types');
    const links = await pg.locator('.tl-src a').evaluateAll((as) => as.map((a) => [a.getAttribute('href'), a.target, a.rel]));
    ok(links.length === 2 && links.every((l) => /^https:\/\//.test(l[0]) && l[1] === '_blank' && /noopener/.test(l[2])), w + 'source links are https and open in a new tab safely ' + JSON.stringify(links));
    ok(await pg.evaluate(() => document.activeElement.id) === 'tl-pop-x', w + 'focus moves to Close');
    for (let i = 0; i < 6; i++) { await pg.keyboard.press('Tab'); if (!(await pg.evaluate(() => !!document.activeElement.closest('.tl-pop')))) break; }
    ok(await pg.evaluate(() => !!document.activeElement.closest('.tl-pop')), w + 'Tab stays inside the panel');
    await pg.keyboard.press('Shift+Tab');
    ok(await pg.evaluate(() => !!document.activeElement.closest('.tl-pop')), w + 'Shift+Tab stays inside the panel');
    await pg.keyboard.press('Escape');
    ok(await pg.locator('.tl-veil:not([hidden])').count() === 0, w + 'Escape closes the panel');
    ok(await pg.evaluate(() => document.activeElement.hasAttribute('data-sources')), w + 'focus returns to the Sources button');
    await btn.click(); await pg.click('#tl-pop-x');
    ok(await pg.locator('.tl-veil:not([hidden])').count() === 0, w + 'Close closes the panel');
    await btn.click(); await pg.mouse.click(2, 2);
    ok(await pg.locator('.tl-veil:not([hidden])').count() === 0, w + 'a click outside closes the panel');
    ok(pg.errs.length === 0, w + 'no page errors ' + pg.errs);
    ok(pg.outside.length === 0, w + 'nothing outside localhost was contacted ' + pg.outside);
    await ctx.close();
  }

  /* ---- "Today" is the date in India, from any time zone ---- */
  for (const [tz, now, want] of [['America/Los_Angeles', '2026-07-23T20:00:00-07:00', '24 July'], ['Pacific/Honolulu', '2026-07-24T00:10:00+05:30', '24 July'], ['Asia/Tokyo', '2026-07-24T23:50:00+05:30', '24 July'], ['Europe/London', '2026-07-24T00:10:00+05:30', '24 July']]) {
    const { ctx, pg } = await open(b, 'timeline.html', { events: FX, now, tz });
    ok((await text(pg, '.tl-bar h2')) === want && await count(pg, '.tl-card') === 1, 'IST: browser in ' + tz + ' at ' + now + ' shows ' + want);
    await ctx.close();
  }

  /* ---- empty days ---- */
  {
    const run = async (now) => { const o = await open(b, 'timeline.html', { events: FX, now }); o.txt = await text(o.pg, '#tl-out'); return o; };
    let o = await run('2026-07-20T10:00:00+05:30');
    ok(o.txt.includes('Nothing in the archive for 20 July.') && o.txt.includes('Coming up in the next seven days: 1 event.'), 'empty day (20 Jul): says so, then the next seven days');
    ok(await text(o.pg, '.fcount') === 'no events on this date', 'empty day: the count says no events on this date');
    ok(await text(o.pg, '.tl-card .tl-yr') === '24 Jul 1991' && await text(o.pg, '.tl-card .tl-ago') === 'in 4 days', 'empty day: the card shows its real date and the days to go');
    await o.ctx.close();
    o = await run('2026-07-15T10:00:00+05:30');
    ok(o.txt.includes('Nothing in the archive for 15 July.') && o.txt.includes('Nothing in the next seven days. Later this month: 2 events'), 'empty day (15 Jul): the rest of the month with the count');
    const tops = await o.pg.locator('.tl-card .tl-yr').allInnerTexts(), agos = await o.pg.locator('.tl-card .tl-ago').allInnerTexts();
    ok(tops.join('|') === '24 Jul 1991|31 Jul 1995' && agos.join('|') === 'in 9 days|in 16 days', 'empty day: each card carries its own real date and days away (' + tops + ' / ' + agos + ')');
    const cardText = (await o.pg.locator('.tl-card').allInnerTexts()).join(' ');
    ok(!/years? ago/.test(cardText) && !/15 Jul/.test(cardText), 'empty day: no card says "years ago" or shows today\'s date');
    await o.ctx.close();
    o = await run('2026-08-01T10:00:00+05:30');
    ok(o.txt.includes('The next date in the archive is 2 October, in 62 days.'), 'empty day (1 Aug): the next event in the archive, with its date and days (' + o.txt.slice(0, 200).replace(/\n/g, ' ') + ')');
    ok(await count(o.pg, '.tl-card') === 1 && await text(o.pg, '.tl-card .tl-yr') === '2 Oct 1992', 'empty day: that one card');
    await o.ctx.close();
    o = await run('2026-12-20T10:00:00+05:30');
    ok(o.txt.includes('in 87 days') || /in \d+ days/.test(o.txt), 'empty day (20 Dec): the next event runs into the following year');
    await o.ctx.close();
    o = await open(b, 'timeline.html', { events: [mk({ id: '1991-07-m1', date: D(1991, 7, undefined, 'month'), title: 'Only a month' })], now: '2026-07-24T10:00:00+05:30' });
    ok((await text(o.pg, '#tl-out')).includes('No event in the archive has an exact day yet.') && await count(o.pg, '.tl-card') === 0, 'a archive with only month or year events says no event has an exact day');
    await o.ctx.close();
  }

  /* ---- By year ---- */
  for (const vp of VPS) {
    const w = 'year ' + vp.width + 'px: ';
    const { ctx, pg } = await open(b, 'timeline.html?tab=year&y=1995', { vp, events: FX, now: '2026-07-24T10:00:00+05:30' });
    ok(await pressed(pg, '[data-tab=year]') === 'true', w + 'By year is the open tab');
    ok(await count(pg, '.tl-decades .fchip') === 2, w + 'two decade chips: the 1980s and 1990s (the 2000s has no event, so no chip)');
    ok((await pg.locator('.tl-decades .fchip').allInnerTexts()).join('|').replace(/\s+/g, ' ') === '1980s 1|1990s 6', w + 'chips carry their counts');
    ok(await pressed(pg, '[data-dec="1990"]') === 'true', w + 'the 1990s are open');
    const yrs = await pg.locator('#tl-rail .fchip').allInnerTexts();
    ok(yrs.length === 10 && yrs[0].trim() === '1990' && yrs[5].replace(/\s+/g, ' ') === '1995 3', w + 'the rail: ten years, 1995 has 3 (' + yrs.join(',').replace(/\n/g, ' ') + ')');
    ok(await count(pg, '#tl-rail .fchip.tl-empty') === 6 && (await pg.locator('#tl-rail .fchip.tl-empty').first().getAttribute('aria-label')).includes('no events yet'), w + 'years with no events are greyed, and say so to a screen reader');
    ok((await text(pg, '.tl-bar h2')) === '1995' && (await text(pg, '.fcount')) === '3 events', w + 'heading and count');
    const whens = await pg.locator('.tl-when').allInnerTexts();
    ok(whens.map((s) => s.replace(/\s+/g, ' ')).join('|') === '31 Jul exact date|Aug month only|Year only 1995', w + 'rows run day, then month, then year only (' + whens.join('|').replace(/\n/g, ' ') + ')');
    const rows = pg.locator('.tl-row');
    const rowChips = [];
    for (let i = 0; i < 3; i++) rowChips.push((await rows.nth(i).locator('.tl-chip').first().innerText()));
    ok(rowChips.join() === 'Probable,Disputed,Probable', w + 'each row carries its status word (' + rowChips + ')');
    ok((await rows.nth(1).locator('.tl-why').innerText()).startsWith('Why Disputed: Voice&Data gives 14 August.'), w + 'a Disputed row states why');
    ok((await rows.nth(1).locator('p').first().innerText()).includes('14 or 15 August'), w + 'a Disputed row states both claims');
    ok(await noSideScroll(pg), w + 'no sideways scroll');
    if (vp.width < 500) {
      const railScrolls = await pg.evaluate(() => { const r = document.getElementById('tl-rail'); return r.scrollWidth > r.clientWidth; });
      ok(railScrolls, w + 'on a phone only the year rail scrolls sideways');
      ok(await pg.evaluate(() => { const r = document.getElementById('tl-rail'), c = r.querySelector('[aria-pressed="true"]').getBoundingClientRect(), rr = r.getBoundingClientRect(); return c.left >= rr.left - 1 && c.right <= rr.right + 1; }), w + 'the chosen year is scrolled into view');
    }
    // switching year and decade updates the address
    await pg.click('[data-year="1996"]');
    ok(pg.url().endsWith('timeline.html?tab=year&y=1996') && (await text(pg, '.tl-bar h2')) === '1996' && (await text(pg, '.fcount')) === '1 event', w + 'clicking 1996 changes the view and the address');
    ok(await pg.evaluate(() => document.activeElement.getAttribute('data-year')) === '1996', w + 'keyboard focus stays on the chip that was pressed');
    await pg.click('[data-year="1993"]');
    ok((await text(pg, '.tl-notice')).includes('Nothing in the archive for 1993 yet.') && (await text(pg, '.fcount')) === 'no events yet', w + 'an empty year says so');
    await pg.click('[data-dec="1980"]');
    ok((await text(pg, '.tl-bar h2')) === '1983' && pg.url().endsWith('y=1983'), w + 'the 1980s chip opens its first year with events');
    ok((await text(pg, '.tl-row .tl-when')).startsWith('25 Jun'), w + '1983 shows the final');
    await pg.goto(BASE + '/timeline.html?tab=year&y=1996', { waitUntil: 'load' });
    ok((await text(pg, '.tl-bar h2')) === '1996', w + 'a shared address opens the same year');
    await pg.goto(BASE + '/timeline.html?tab=year&y=nonsense', { waitUntil: 'load' });
    ok((await text(pg, '.tl-bar h2')) === '1991', w + 'a bad year falls back to the first 1990s year with events (' + (await text(pg, '.tl-bar h2')) + ')');
    await pg.click('[data-tab=today]');
    ok(pg.url().endsWith('timeline.html') && (await text(pg, '.tl-bar h2')) === '24 July', w + 'Today returns to the plain address');
    ok(pg.errs.length === 0, w + 'no page errors ' + pg.errs);
    ok(pg.outside.length === 0, w + 'nothing outside localhost was contacted ' + pg.outside);
    await ctx.close();
  }

  /* ---- decade chips appear only when the decade has an event ---- */
  {
    const only90 = SAMPLES.filter((e) => e.date.y >= 1990);
    let o = await open(b, 'timeline.html?tab=year', { events: only90, now: '2026-07-24T10:00:00+05:30' });
    ok(await count(o.pg, '.tl-decades') === 0, 'decades: with events in one decade only, there is no chip row (one chip filters nothing)');
    ok((await text(o.pg, '.tl-bar h2')) === '1991', 'decades: the 1990s open directly (first year with events: ' + (await text(o.pg, '.tl-bar h2')) + ')');
    await o.ctx.close();
    o = await open(b, 'timeline.html?tab=year', { events: only90.concat([mk({ id: '2003-04-05-x', date: D(2003, 4, 5), title: 'A 2003 event' })]), now: '2026-07-24T10:00:00+05:30' });
    ok((await o.pg.locator('.tl-decades .fchip').allInnerTexts()).map((s) => s.replace(/\s+/g, ' ')).join('|') === '1990s 6|2000s 1', 'decades: the 2000s chip appears once its first event is live');
    await o.pg.click('[data-dec="2000"]');
    ok((await text(o.pg, '.tl-bar h2')) === '2003' && await count(o.pg, '#tl-rail .fchip') === 10, 'decades: the 2000s chip opens 2003 with a ten-year rail');
    await o.ctx.close();
    o = await open(b, 'timeline.html?tab=year', { events: [mk({ id: '2010-03-03-x', date: D(2010, 3, 3), title: 'A 2010 event' }), mk({ id: '1983-03-03-x', date: D(1983, 3, 3), title: 'A 1983 event' })], now: '2026-07-24T10:00:00+05:30' });
    await o.pg.click('[data-dec="2010"]');
    ok(await count(o.pg, '#tl-rail .fchip') === 1 && (await text(o.pg, '.tl-bar h2')) === '2010', 'decades: 2010 has its own one-year rail');
    await o.ctx.close();
  }

  /* ---- held back, broken and hostile records ---- */
  {
    const hostile = mk({ id: '1990-05-05-xss', date: D(1990, 5, 5), title: '<img src=x onerror="window.__xss=1">', summary: '<script>window.__xss=2<\/script> & "quotes" \'single\'', sources: [src('<b>Pub</b>', '<i>Label</i>', 'https://example.org/a?x=1&y="2"', 'primary'), src('Other', 'O', 'https://example.org/o', 'press')] });
    const broken = mk({ id: '1990-05-06-broken', date: D(1990, 5, 6), title: 'BROKEN RECORD', sources: [src('Only One', 'One', 'https://example.org/one', 'press')] });                       // Verified with one press source
    const unapprovedReview = mk({ id: '1990-05-07-held', date: D(1990, 5, 7), title: 'HELD BACK', sensitivity: 'review', sensitivityReason: 'violence' });                                       // published without approval
    const o = await open(b, 'timeline.html?tab=year&y=1990', { events: [hostile, broken, unapprovedReview], now: '2026-05-05T10:00:00+05:30' });
    const all = await text(o.pg, '#tl-out');
    ok(all.includes('<img src=x onerror="window.__xss=1">'), 'safe: markup in a title is shown as text');
    ok(await o.pg.evaluate(() => window.__xss === undefined) && await count(o.pg, '#tl-out img') === 0 && await count(o.pg, '#tl-out script') === 0, 'safe: nothing in a record can run as code');
    ok(!all.includes('BROKEN RECORD'), 'a record that breaks a rule is not shown even if marked published');
    ok(!all.includes('HELD BACK'), 'a sensitive record without approval is not shown even if marked published');
    ok(o.pg.warns.some((m) => m.includes('BROKEN') || m.includes('1990-05-06-broken')), 'the broken record is reported in the console (warning)');
    ok((await text(o.pg, '.fcount')) === '1 event', 'only the one good record is counted');
    await o.pg.click('[data-sources]');
    const pop = await text(o.pg, '.tl-pop-b');
    ok(pop.includes('<b>Pub</b>') && await count(o.pg, '.tl-pop b') <= 3, 'safe: markup in a source name is shown as text in the Sources panel');
    ok((await o.pg.locator('.tl-src a').first().getAttribute('href')) === 'https://example.org/a?x=1&y="2"', 'safe: the link is kept exactly');
    ok(o.pg.errs.length === 0, 'safe: no page errors ' + o.pg.errs);
    await o.ctx.close();
  }

  /* ---- Probable / Disputed notes in the panel, repeats, and a clip from the catalogue ---- */
  {
    const base = [src('Alpha Office', 'Record', 'https://example.org/alpha', 'primary'), Object.assign(src('Beta Daily', 'Report', 'https://example.org/beta', 'press'), { basedOn: 'https://example.org/alpha', publishedOn: '2020-07-24' })];
    const probable = mk({ id: '1990-05-05-p', date: D(1990, 5, 5), title: 'P', confidence: 'probable', confidenceNote: 'Needs a second source.', sources: base, related: ['not-in-catalogue', clipId] });
    const o = await open(b, 'timeline.html', { events: [probable], now: '2026-05-05T10:00:00+05:30' });
    ok(await count(o.pg, '[data-clip]') === 1, 'clip: a related catalogue item gives a "Watch the clip" button');
    ok((await text(o.pg, '.tl-why')) === 'Why Probable: Needs a second source.', 'a Probable card shows its note');
    await o.pg.click('[data-sources]');
    const pop = await text(o.pg, '.tl-pop-b');
    ok(pop.includes('Why Probable. Needs a second source.'), 'the panel repeats the note');
    ok(pop.includes('Repeats Alpha Office') && pop.includes('Published: 24 Jul 2020'), 'the panel shows "Repeats" and a real publication date');
    await o.pg.keyboard.press('Escape');
    await o.pg.click('[data-clip]');
    ok(await o.pg.locator('#modal:not([hidden])').count() === 1, 'clip: the button opens the shared player');
    await o.pg.keyboard.press('Escape');
    ok(await o.pg.locator('#modal:not([hidden])').count() === 0, 'clip: Escape closes it');
    ok(o.pg.errs.length === 0, 'clip: no page errors ' + o.pg.errs);
    await o.ctx.close();
    const p2 = await open(b, 'timeline.html', { events: [mk({ id: '1990-05-05-q', date: D(1990, 5, 5), related: ['not-in-catalogue'] })], now: '2026-05-05T10:00:00+05:30' });
    ok(await count(p2.pg, '[data-clip]') === 0, 'clip: an id that is not in the catalogue gives no button');
    await p2.ctx.close();
  }

  /* ---- three cards on a wide screen, one on a phone ---- */
  {
    const three = [1, 2, 3].map((n) => mk({ id: (1985 + n) + '-05-05-t' + n, date: D(1985 + n, 5, 5), title: 'Card ' + n }));
    let o = await open(b, 'timeline.html', { events: three, now: '2026-05-05T10:00:00+05:30' });
    const xs = await o.pg.locator('.tl-card').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    ok(xs[0] === xs[1] && xs[1] === xs[2], 'layout: three cards sit in one row on a wide screen');
    ok((await text(o.pg, '.fcount')) === '3 events', 'layout: "3 events"');
    ok((await o.pg.locator('.tl-card .tl-yr').allInnerTexts()).join() === '1986,1987,1988', 'layout: earliest year first');
    await o.ctx.close();
    o = await open(b, 'timeline.html', { vp: VPS[1], events: three, now: '2026-05-05T10:00:00+05:30' });
    const ys = await o.pg.locator('.tl-card').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    ok(ys[0] < ys[1] && ys[1] < ys[2] && await noSideScroll(o.pg), 'layout: cards stack on a phone with no sideways scroll');
    await o.ctx.close();
  }

  await b.close();
  console.log((fail ? 'FAILED: ' : 'ALL OK: ') + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
