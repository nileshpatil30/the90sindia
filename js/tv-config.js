/* ==========================================================================
   90s REWIND TV — TIMETABLE CONFIG
   ==========================================================================
   Edit THIS file to change what is "on air". Times are 24-hour, India time
   (IST, UTC+5:30), and the page converts them for every viewer, so
   "Sunday 09:00" is the same instant for everyone.

   EACH CHANNEL IS ONE ERA. Flip channels to flip years.

   A SLOT:
     { day: "Sun", time: "09:30", duration: 35, title: "Ramayan",
       episodes: [ { video: "YOUTUBE_ID" }, ... ],   // one episode per week
       confidence: "verified" | "recalled" | "approx",
       source: "where this time came from" }

     day       "Sun".."Sat", an array like ["Tue","Thu"], or "daily" /
               "weekdays" / "weekend"
     playlist  EASIEST: paste ONE official YouTube playlist ID here instead of
               listing episodes, e.g. playlist: "PLxxxxxxxxxxxx". The page reads
               the video IDs from YouTube itself (cached a day) and plays one per
               week, in playlist order. episodes, if given, wins over playlist.
     startDate  "YYYY-MM-DD": the week containing this date plays episodes[0],
               the next week episodes[1], and so on IN LIST ORDER (Episode 1,
               2, 3...). Without it, episodes rotate by calendar week.
     epNums    optional list of the real episode numbers, parallel to episodes
               (use when the list skips numbers). Default: position + 1.
     duration  whole MINUTES the slot is on air
     episodes  OFFICIAL YouTube video IDs only. Week 1 plays episodes[0],
               week 2 plays episodes[1], and so on, looping. Leave empty
               until you add them: the slot then shows a title card.
               If an episode ends before the slot does, the rest of the slot
               is filled with commercials, exactly like real TV.

   CONFIDENCE (shown as a badge on the guide):
     verified  start day/time (or the fact it aired in this block) is stated
               by a source listed below
     recalled  widely remembered but I could not find a primary source:
               please confirm against an old newspaper listing
     approx    the show/slot is real but the clock time is a placeholder

   COMMERCIALS (ads): your own clips, played between shows and to fill gaps.
     { title, sponsor, duration (SECONDS), video: "" }
     Leave video empty to show a "commercial break" card (default).
     NEVER overlay or cover YouTube's own ads: only use these slots.

   HOW TO GET A YOUTUBE VIDEO ID: from youtube.com/watch?v=XXXXXXXXXXX the ID
   is the part after v=. Official rights-holder channels only (DD National /
   Prasar Bharati, the show's own producer, Zee, Star, Cartoon Network).

   SOURCES FOR THE VERIFIED TIMES (researched Nov 2026)
     - Rangoli on Sunday mornings from 7:30 am; Chitrahaar in the 8:00-8:30
       pm slot (Deccan Herald, "Where did DD trip fall")
     - Chitrahaar on Fridays, Sunday-evening weekly Hindi film, weekday DD
       hours of 7-9 am and 3-10 pm in the early 1980s (Eastern Mirror)
     - Chitrahaar from 15 Aug 1982, 25 min; Rangoli 60 min (Wikipedia)
     - Ramayan from 25 Jan 1987, 35-min episodes; Mahabharat every Sunday
       for an hour from 1988 (ThePrint)
     - Ramayan/Mahabharat "at 9 on Sunday morning" (reader memory, Ravish
       Kumar blog, 2006); DD news at 8:30 pm in the early 1990s (a comment on
       that same post: treat as approx)
     - Hum Paanch on Zee, Tuesdays 8 pm, ~30 min (Wikipedia)
     - Shaktimaan on DD National, Sundays, 27 Sep 1997 to 27 Mar 2005
       (Wikipedia, clock time not stated: 12:00 is recalled)
     - Kaun Banega Crorepati and Kyunki Saas Bhi Kabhi Bahu Thi both began
       on 3 Jul 2000 in the evening (IndianTelevision.com; clock times are
       recalled)
     - Cartoon Network India Hindi-dubbed blocks from 4 Jan 1999: 3-5 pm on
       weekdays, 2-4 pm on weekends (Wikipedia)

   STILL UNCONFIRMED (no day/time found online, so NOT scheduled yet):
     Hum Log, Buniyaad, Malgudi Days, Nukkad, Fauji, Circus, Surabhi,
     Dekh Bhai Dekh, Superhit Muqabla, Byomkesh Bakshi, Saturday Suspense,
     Antakshari, Banegi Apni Baat, Vikram Aur Betaal, Jungle Book, Alif
     Laila, WWF on Star Sports, cricket. If you have old newspaper TV
     listings (even a phone photo), send them and these slots get filled in.
   ========================================================================== */

// Official episode lists live in js/tv-episodes.js (loaded first).
var EP_RAMAYAN = (typeof RAMAYAN_TILAK !== 'undefined') ? RAMAYAN_TILAK : [];
var EP_HUMPAANCH = (typeof HUM_PAANCH_ZEE !== 'undefined') ? HUM_PAANCH_ZEE : [];
var EP_HUMPAANCH_NUMS = (typeof HUM_PAANCH_NUMS !== 'undefined') ? HUM_PAANCH_NUMS : [];
function eps(ids) { return ids.map(function (v) { return { video: v }; }); }

// Shared commercial rotation. Your own clips go here.
const TV_ADS = [
  { title: 'Commercial break', sponsor: 'Your 90s ad here', duration: 30, video: '' },
  { title: 'Commercial break', sponsor: 'Sponsor this break', duration: 30, video: '' },
  { title: 'Commercial break', sponsor: 'Your 90s ad here', duration: 20, video: '' }
];

// Doordarshan switched off at night: a test card shows in this window.
const DD_CLOSEDOWN = { from: '23:30', to: '06:30', label: 'Transmission has ended for the day' };

const TV_CHANNELS = [
  {
    num: '01',
    name: 'DD National',
    era: '1987-88',
    tag: 'The Ramayan year',
    tz: 330,
    ads: TV_ADS,
    closedown: DD_CLOSEDOWN,
    slots: [
      { day: 'Sun', time: '09:30', duration: 40, title: 'Ramayan', episodes: eps(EP_RAMAYAN), startDate: '2026-11-08',
        confidence: 'recalled', source: 'Sunday morning + 35-min episodes verified; 9:30 start recalled (one reader remembers 9:00). Slot is 40 min because the Tilak uploads run 32-40 min. Episodes 1-78 in order, one a week from 8 Nov 2026.' },
      { day: 'Fri', time: '20:00', duration: 25, title: 'Chitrahaar', episodes: [],
        confidence: 'verified', source: 'Friday (Eastern Mirror); 8:00-8:30 pm slot (Deccan Herald)' },
      { day: 'Sun', time: '17:00', duration: 150, title: 'Sunday Feature Film', episodes: [],
        confidence: 'approx', source: 'Weekly Hindi film on Sunday evening is verified; clock time is a placeholder' }
    ]
  },
  {
    num: '02',
    name: 'DD National',
    era: '1988-90',
    tag: 'Rangoli and Mahabharat',
    tz: 330,
    ads: TV_ADS,
    closedown: DD_CLOSEDOWN,
    slots: [
      { day: 'Sun', time: '07:30', duration: 60, title: 'Rangoli', episodes: [],
        confidence: 'verified', source: 'Sunday mornings from 7:30 am (Deccan Herald); 60 min (Wikipedia)' },
      { day: 'Sun', time: '09:00', duration: 60, title: 'Mahabharat', episodes: [],
        confidence: 'verified', source: 'Every Sunday for an hour (ThePrint); 9 am (reader memory)' },
      { day: 'Fri', time: '20:00', duration: 25, title: 'Chitrahaar', episodes: [],
        confidence: 'verified', source: 'Friday (Eastern Mirror); 8:00-8:30 pm slot (Deccan Herald)' },
      { day: 'Sun', time: '17:00', duration: 150, title: 'Sunday Feature Film', episodes: [],
        confidence: 'approx', source: 'Sunday-evening Hindi film verified; clock time is a placeholder' }
    ]
  },
  {
    num: '03',
    name: 'DD National',
    era: '1990-94',
    tag: 'Before satellite took over',
    tz: 330,
    ads: TV_ADS,
    closedown: DD_CLOSEDOWN,
    slots: [
      { day: 'Sun', time: '07:30', duration: 60, title: 'Rangoli', episodes: [],
        confidence: 'verified', source: 'Sunday mornings from 7:30 am (Deccan Herald)' },
      { day: 'Fri', time: '20:00', duration: 25, title: 'Chitrahaar', episodes: [],
        confidence: 'verified', source: 'Friday (Eastern Mirror); 8:00-8:30 pm slot (Deccan Herald)' },
      { day: 'daily', time: '20:30', duration: 15, title: 'Hindi News (Samachar)', episodes: [],
        confidence: 'approx', source: '8:30 pm bulletin remembered in a reader comment (Ravish Kumar blog)' },
      { day: 'Sun', time: '17:00', duration: 150, title: 'Sunday Feature Film', episodes: [],
        confidence: 'approx', source: 'Sunday-evening Hindi film verified; clock time is a placeholder' }
    ]
  },
  {
    num: '04',
    name: 'DD + Zee',
    era: '1995-99',
    tag: 'Satellite arrives',
    tz: 330,
    ads: TV_ADS,
    closedown: null,
    slots: [
      { day: 'Sun', time: '07:30', duration: 60, title: 'Rangoli', episodes: [],
        confidence: 'verified', source: 'Sunday mornings from 7:30 am (Deccan Herald)' },
      { day: 'Tue', time: '20:00', duration: 35, title: 'Hum Paanch (Zee TV)', episodes: eps(EP_HUMPAANCH), epNums: EP_HUMPAANCH_NUMS, startDate: '2026-11-08',
        confidence: 'verified', source: 'Tuesdays 8 pm, ~30 min (Wikipedia). Zee TV official uploads, episodes in order from Ep 1 (6 are not public on YouTube so numbers skip them); slot padded to 35 min for the longest uploads.' },
      { day: 'Fri', time: '20:00', duration: 25, title: 'Chitrahaar', episodes: [],
        confidence: 'verified', source: 'Friday (Eastern Mirror); 8:00-8:30 pm slot (Deccan Herald)' },
      { day: 'Sun', time: '12:00', duration: 30, title: 'Shaktimaan (from 27 Sep 1997)', episodes: [],
        confidence: 'recalled', source: 'Sundays on DD National verified (Wikipedia); noon start recalled' }
    ]
  },
  {
    num: '05',
    name: 'Star Plus',
    era: '2000',
    tag: 'KBC and the saas-bahu boom',
    tz: 330,
    ads: TV_ADS,
    closedown: null,
    slots: [
      { day: ['Mon', 'Tue', 'Wed', 'Thu'], time: '21:00', duration: 60, title: 'Kaun Banega Crorepati (from 3 Jul 2000)', episodes: [],
        confidence: 'recalled', source: 'Launch date and evening start verified (IndianTelevision.com); days and clock time recalled' },
      { day: ['Mon', 'Tue', 'Wed', 'Thu'], time: '22:30', duration: 30, title: 'Kyunki Saas Bhi Kabhi Bahu Thi (from 3 Jul 2000)', episodes: [],
        confidence: 'recalled', source: 'Launch date and evening start verified (IndianTelevision.com); days and clock time recalled' }
    ]
  },
  {
    num: '06',
    name: 'Cartoon Network',
    era: '1999-2000',
    tag: 'Hindi-dubbed blocks',
    tz: 330,
    ads: TV_ADS,
    closedown: null,
    slots: [
      { day: 'weekdays', time: '15:00', duration: 120, title: 'Hindi-dubbed cartoons', episodes: [],
        confidence: 'verified', source: '3-5 pm on weekdays from 4 Jan 1999 (Wikipedia)' },
      { day: 'weekend', time: '14:00', duration: 120, title: 'Hindi-dubbed cartoons', episodes: [],
        confidence: 'verified', source: '2-4 pm on weekends from 4 Jan 1999 (Wikipedia)' }
    ]
  },
  {
    num: '00',
    name: 'DEMO',
    era: 'test',
    tag: 'Working demo: swap for real content',
    tz: 330,
    ads: TV_ADS,
    closedown: null,
    // A slot every 30 minutes, all day, so you can see playback and commercial
    // fill straight away. These are open-licence Blender Foundation films
    // (official channel); each is shorter than 30 min, so the rest of every
    // slot fills with commercial break cards.
    slots: Array.from({ length: 48 }, function (_, n) {
      var hh = String(Math.floor(n / 2)).padStart(2, '0');
      var mm = n % 2 ? '30' : '00';
      return {
        day: 'daily', time: hh + ':' + mm, duration: 30,
        title: 'Demo Feature ' + (n + 1),
        episodes: [{ video: 'aqz-KE-bpKQ' }, { video: 'eRsGyueVLvQ' }, { video: 'R6MlUcmOul8' }],
        source: 'Demo slot'
      };
    })
  }
];

if (typeof window !== 'undefined') { window.TV_CHANNELS = TV_CHANNELS; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { TV_CHANNELS: TV_CHANNELS }; }
