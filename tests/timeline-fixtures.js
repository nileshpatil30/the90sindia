/* ==========================================================================
   TEST FIXTURES for On This Day. NOT SITE DATA: nothing here is published or approved.
   tests/timeline-test.js feeds these to the page in a test browser so the page can be checked with events on it.
   reviewedBy says "TEST FIXTURE" on purpose: it is not anyone's approval, and the real data files (js/timeline-data-*.js) stay empty.
   The eight SAMPLES are the candidates from the Phase 1 specification, written as if published so the cards can be drawn.
   Their source dates are the placeholder "undated" because the real publication dates have not been recorded yet.
   ========================================================================== */
'use strict';

const OPENED = '2026-11-06';
const src = (publisher, label, url, type, extra) => Object.assign({ publisher, label, url, type, publishedOn: 'undated', opened: OPENED }, extra || {});

// A small valid, published, Verified event. Pass overrides for the fields a test wants to change.
function mk(o) {
  return Object.assign({
    id: '2000-01-01-fixture-event',
    date: { y: 2000, m: 1, d: 1, precision: 'day' },
    title: 'Fixture event',
    summary: 'A made-up event used by the tests.',
    category: 'news',
    confidence: 'verified',
    sources: [src('Alpha Office', 'Record', 'https://example.org/alpha', 'primary'), src('Beta Daily', 'Report', 'https://example.org/beta', 'press')],
    sensitivity: 'standard',
    ticker: false,
    reviewedBy: 'TEST FIXTURE',
    reviewedOn: OPENED,
    reviewMode: 'individual',
    published: true
  }, o || {});
}

const review = { reviewedBy: 'TEST FIXTURE', reviewedOn: OPENED, reviewMode: 'individual', published: true };

const SAMPLES = [
  Object.assign({
    id: '1983-06-25-india-win-world-cup-final',
    date: { y: 1983, m: 6, d: 25, precision: 'day' },
    title: 'India win the 1983 World Cup final at Lord’s',
    summary: 'India beat the West Indies by 43 runs at Lord’s to win the 1983 cricket World Cup.',
    category: 'cricket', confidence: 'verified',
    sources: [
      src('ESPNcricinfo', 'India v West Indies, World Cup final scorecard', 'https://www.espncricinfo.com/series/8039/game/65090', 'authoritative'),
      src('CricketArchive', 'Scorecard, 25 June 1983', 'https://cricketarchive.com/Archive/Scorecards/43/43681.html', 'authoritative'),
      src('Wikipedia', '1983 Cricket World Cup final', 'https://en.wikipedia.org/wiki/1983_Cricket_World_Cup_final', 'reference')],
    sensitivity: 'standard', ticker: true
  }, review),
  Object.assign({
    id: '1991-07-24-union-budget',
    date: { y: 1991, m: 7, d: 24, precision: 'day' },
    title: 'Union Budget 1991-92 presented',
    summary: 'Finance Minister Manmohan Singh presented the 1991-92 Union Budget. The speech set out plans to deregulate industry, open trade to foreign competition and ease rules on foreign investment.',
    category: 'news', confidence: 'verified',
    sources: [
      src('Ministry of Finance', 'Budget speech 1991-92', 'https://www.indiabudget.gov.in/doc/bspeech/bs199192.pdf', 'primary'),
      src('Business Today', '35 years of liberalisation', 'https://www.businesstoday.in/latest/economy/story/35-years-of-liberalisation-how-a-budget-speech-on-this-day-in-1991-changed-indias-economic-trajectory-545008-2026-07-24', 'press')],
    sensitivity: 'standard', ticker: true
  }, review),
  Object.assign({
    id: '1996-03-17-sri-lanka-win-world-cup-final',
    date: { y: 1996, m: 3, d: 17, precision: 'day' },
    title: 'Sri Lanka win the 1996 World Cup final in Lahore',
    summary: 'Sri Lanka beat Australia by seven wickets at Lahore to win the 1996 cricket World Cup.',
    category: 'cricket', confidence: 'verified',
    sources: [
      src('ESPNcricinfo', 'Australia v Sri Lanka, World Cup final scorecard', 'https://www.espncricinfo.com/series/8039/game/65192', 'authoritative'),
      src('CricketArchive', 'Scorecard, 17 March 1996', 'https://cricketarchive.co.uk/Scorecards/61/61955.html', 'authoritative')],
    sensitivity: 'standard', ticker: false
  }, review),
  // Held back by decision 7: a sensitive event stays unpublished until the owner approves it individually.
  {
    id: '1998-05-11-pokhran-nuclear-tests',
    date: { y: 1998, m: 5, d: 11, precision: 'day' },
    title: 'India carries out nuclear tests at Pokhran',
    summary: 'India carried out three underground nuclear tests at Pokhran on 11 May 1998. Two more followed on 13 May.',
    category: 'news', confidence: 'verified',
    sources: [
      src('Lok Sabha', 'Prime Minister’s statement, 27 May 1998', 'https://eparlib.nic.in/bitstream/123456789/800809/1/pms_12_02_27-05-1998.pdf', 'primary'),
      src('Federation of American Scientists', 'Shakti test site', 'https://nuke.fas.org/guide/india/nuke/shakti-pix.htm', 'reference')],
    sensitivity: 'review', sensitivityReason: 'military', ticker: false,
    reviewedBy: '', reviewedOn: '', reviewMode: '', published: false
  },
  Object.assign({
    id: '1992-10-02-zee-tv-launch',
    date: { y: 1992, m: 10, d: 2, precision: 'day' },
    title: 'Zee TV is launched',
    summary: 'Zee TV began broadcasting in India on 2 October 1992.',
    category: 'tv', confidence: 'probable',
    confidenceNote: 'The company statement is Zee’s own and the other source repeats it. We need one source that is not derived from Zee.',
    sources: [
      src('Zee Entertainment', 'Company statement', 'https://www.zee.com/?p=4691', 'primary'),
      src('WION', 'Zee TV launched on 2 October 1992', 'https://www.wionews.com/india-news/october-2-1992-dr-subhash-chandra-launched-indias-first-private-satellite-channel-zee-tv-417589/amp', 'press')],
    sensitivity: 'standard', ticker: false
  }, review),
  Object.assign({
    id: '1995-07-31-mobile-call-kolkata-delhi',
    date: { y: 1995, m: 7, d: 31, precision: 'day' },
    title: 'A mobile call is placed between Kolkata and Delhi',
    summary: 'On 31 July 1995 a mobile phone call was placed between Kolkata and Delhi on the Modi Telstra network. Two press reports agree on the date. We have not yet found a primary record.',
    category: 'tech', confidence: 'probable',
    confidenceNote: 'Two press reports agree on the date. No primary record found yet.',
    sources: [
      src('Voice&Data', 'Dialling into the past', 'https://www.voicendata.com/mobile-phones/dialling-into-the-past-celebrating-29-years-of-mobile-connectivity-in-india-9608829', 'press'),
      src('Business Standard', 'The day India’s mobile revolution began', 'https://business-standard.com/article/opinion/atc-india-s-umang-das-recalls-the-day-india-s-mobile-revolution-began-120072301938_1.html', 'press')],
    sensitivity: 'standard', ticker: false
  }, review),
  Object.assign({
    id: '1995-08-vsnl-public-internet',
    date: { y: 1995, m: 8, precision: 'month' },
    title: 'VSNL begins public internet access',
    summary: 'VSNL opened its Gateway Internet Access Service to the public in Indian cities. Sources differ on whether it went live on 14 or 15 August.',
    category: 'tech', confidence: 'disputed',
    confidenceNote: 'Voice&Data gives 14 August. The Better India gives 15 August and cites no primary document.',
    sources: [
      src('Voice&Data', 'The internet comes to India', 'https://www.voicendata.com/internet-comes-india', 'press'),
      src('The Better India', '25 years of the internet in India', 'https://thebetterindia.com/485523/internet-india-launch-independence-day-vsnl-1995', 'press')],
    sensitivity: 'standard', ticker: false
  }, review),
  Object.assign({
    id: '1995-alisha-chinai-made-in-india',
    date: { y: 1995, precision: 'year' },
    title: 'Alisha Chinai releases Made in India',
    summary: 'Alisha Chinai’s album Made in India came out in 1995. Two sources give the year. We do not have the month or day.',
    category: 'music', confidence: 'probable',
    confidenceNote: 'Two sources give the year only.',
    sources: [
      src('Wikipedia', 'Indian pop', 'https://en.wikipedia.org/wiki/Indian_pop', 'reference'),
      src('Scroll', 'The ultimate 1990s Indipop songlist', 'https://scroll.in/reel/942185/press-play-and-wipe-away-the-tears-the-ultimate-1990s-indipop-songlist', 'press')],
    sensitivity: 'standard', ticker: false
  }, review)
];

module.exports = { mk, src, SAMPLES, OPENED };
