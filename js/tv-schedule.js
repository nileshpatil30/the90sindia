/* ==========================================================================
   90s REWIND TV — THE SCHEDULE
   ==========================================================================
   ONE TABLE, ONE ROW PER SHOW-ON-A-CHANNEL. Edit this file to change what
   airs where and when. Nothing else needs touching: js/tv-config.js reads
   this table and builds every channel (network x year) automatically.

   Times are 24-hour India time (IST, UTC+5:30). The page converts them for
   every viewer, so "Sun 09:30" is the same instant for everyone.

   A ROW (TV_RUNS)
     { net: 'ddn',            which network (see TV_NETS below)
       from: 1987, to: 1988,  first and last YEAR this slot existed (inclusive)
       show: 'Ramayan',       title on screen. Also the name looked up in
                              js/tv-library.js, unless lib: 'Other Name' is given
       day: 'Sun',            'Sun'..'Sat', ['Tue','Sat'], 'weekdays', 'daily'
       time: '09:30',         start time, 24h IST
       dur: 40,               minutes on air (episode + ad break)
       conf: 'verified',      verified | recalled | approx   (see below)
       src: 'where from',     one honest line: what is sourced, what is a guess
       eps: 'RAMAYAN' }       optional: use a built-in episode list from
                              js/tv-episodes.js instead of a library row
     optional: fixture: true  a listing only (no video), such as a weekly film

   A show on two or more days a week (day: ['Tue','Sat']) plays CONSECUTIVE
   episodes: Tuesday = episode 1, Saturday = episode 2, next Tuesday = 3 ...
   Every show starts at Episode 1 in the week of TV_EPOCH and then moves on
   one episode per week (per slot), in order.

   HOW SURE IS A SLOT? (shown as a badge on the guide)
     verified  a source states the day AND the time (see SOURCES)
     recalled  day and time are widely remembered but no printed source found
     approx    the show really ran on this network in these years, but the
               exact day or clock time is a placeholder (the guide shows ~)

   WANT IT EXACT? Old newspaper TV listings settle every APPROX in one look.
   Send a phone photo of any week's listing and the slots get fixed.

   SOURCES (researched Nov 2026)
     - Rangoli on Sunday mornings from 7:30 am; Chitrahaar in the 8:00-8:30 pm
       slot (Deccan Herald, "Where did DD trip fall")
     - Chitrahaar on Fridays; a weekly Hindi film on Sunday evenings (Eastern
       Mirror, "Revisiting DD, the period that was")
     - Ramayan from 25 Jan 1987, Sundays; Mahabharat every Sunday for an hour
       from 1988 (ThePrint); both remembered at 9 on Sunday morning (reader
       memory, Ravish Kumar blog)
     - The Jungle Book (Hindi): Sundays 10:00 am, 1 Nov 1992 to 24 Oct 1993
       (animemirchi.com fan guide)
     - Aryamaan: from 14 Jul 2002, DD National, Sunday 12:00-13:00 (Wikipedia)
     - Shaktimaan: Sundays on DD National, 27 Sep 1997 to 27 Mar 2005
       (Wikipedia; the clock time is recalled)
     - Hum Paanch: Zee TV, Tuesdays 8 pm (Wikipedia)
     - Dekh Bhai Dekh: DD Metro, from 6 May 1993 to 1997 (Wikipedia)
     - Tu Tu Main Main: DD Metro 1994 to 1996, then Star Plus (Wikipedia)
     - Shrimaan Shrimati: from Fri 29 Jul 1994 (Wikipedia)
     - Shri Krishna: DD Metro from Sun 18 Jul 1993 (Wikipedia)
     - Hum Log: Sat 7 Jul 1984 to Tue 17 Dec 1985, 156 episodes, about two a
       week (Wikipedia dates; the weekdays are worked out from them)
     - Buniyaad: Tuesday and Saturday nights, 1986-87 (India Today)
     - Karamchand first aired June 1985 on DD1; Hasratein on Zee TV 1996-99;
       Zee Horror Show on Zee TV 1993-2001; Office Office from 3 Sep 2001 on
       SAB TV; The Sword of Tipu Sultan from Feb 1990 on DD National (Wikipedia)
     - Cartoon Network India Hindi-dubbed blocks from 4 Jan 1999: 3-5 pm
       weekdays, 2-4 pm weekends (Wikipedia)
     - Kaun Banega Crorepati and Kyunki Saas Bhi Kabhi Bahu Thi both began on
       3 Jul 2000 in the evening (IndianTelevision.com)
     - Comedy Circus: from Sat 16 Jun 2007, 9:30 pm on SET India (exchange4media)
     - Zee TV's years for ~45 serials and sitcoms: Wikipedia, "List of programmes
       broadcast by Zee TV" (no days or times given there, so every one of those
       slots is APPROX). Saturday Suspense: every Saturday 1998-2000 (ninetiestv
       blog). Hasratein and Tara/Banegi Apni Baat years are from the same pages.
     - Home TV: Kabhi Idhar Kabhi Udhar 1996 (Shekhar Suman's Wikipedia page);
       Zabaan Sambhalke on DD Metro 1993-94 and on Home TV 1997-98 (Wikipedia);
       Hindi-dubbed Chinese serials 1998-2000 (viewer forum). V3 on Home TV is
       as remembered by viewers; its years are a placeholder.
     - Star Sports launched in India on 28 Oct 1996. WWF and cricket replay slots
       on Star Sports and ESPN are placeholders: no listing for them was found.
     - Members of the Old Doordarshan Serials Facebook group remember a 9 pm
       English news bulletin, Krishi Darshan at 7 pm and UGC at noon and 4 pm
       (not scheduled: no video exists for them)

   NOT SCHEDULED YET (no network or slot found, so they are left out rather
   than guessed): Ek Tha Rusty, Idhar Udhar, Street Sharks, Dennis the Menace,
   Chip 'n Dale Rescue Rangers, Kahani Comedy Circus Ki (it began in 2012), and
   about 40 Zee TV classics whose years are unknown. They stay in
   js/tv-library.js and in the ALL SHOWS page, ready for the day a slot is found.
   ========================================================================== */

// The week containing this Sunday plays Episode 1 of every show.
const TV_EPOCH = '2026-11-08';

// The years the dial covers.
const TV_YEARS = { from: 1984, to: 2007 };

// Networks, in channel order (CH up / CH down walks this list).
const TV_NETS = [
  { id: 'ddn',  name: 'DD National',     short: 'DD1',   color: '#ff7a1a', closedown: true,
    blurb: 'Doordarshan, the only channel in most homes until the early 90s' },
  { id: 'ddm',  name: 'DD Metro',        short: 'DD2',   color: '#2fd0ff', closedown: true,
    blurb: "Doordarshan's entertainment channel for the cities: sitcoms and soaps" },
  { id: 'zee',  name: 'Zee TV',          short: 'ZEE',   color: '#ff2f8e', closedown: false,
    blurb: "India's first private Hindi satellite channel, on air since 2 Oct 1992" },
  { id: 'home', name: 'Home TV',         short: 'HOME',  color: '#4df0c4', closedown: false,
    blurb: 'Home TV, a Hindi channel of the late 90s: sitcoms, V3 and dubbed Chinese serials' },
  { id: 'star', name: 'Star Plus',       short: 'STAR',  color: '#ffd93b', closedown: false,
    blurb: 'Star Plus: from sitcoms to KBC and the saas-bahu boom' },
  { id: 'sony', name: 'Sony / SET',      short: 'SET',   color: '#9b6bff', closedown: false,
    blurb: 'Sony Entertainment Television (SET India), on air since Oct 1995' },
  { id: 'sab',  name: 'SAB TV',          short: 'SAB',   color: '#7bf26a', closedown: false,
    blurb: 'SAB TV, the comedy channel' },
  { id: 'mtv',  name: 'MTV India',       short: 'MTV',   color: '#ff3fa4', closedown: false,
    blurb: 'MTV India: Indipop videos, VJs and MTV Bakra' },
  { id: 'cn',   name: 'Cartoon Network', short: 'CN',    color: '#ff5f45', closedown: false,
    blurb: 'Cartoon Network India, with Hindi-dubbed blocks from 4 Jan 1999' },
  { id: 'sstar', name: 'Star Sports',    short: 'SPORT', color: '#3b9bff', closedown: false,
    blurb: 'Star Sports India, on air from 28 Oct 1996: cricket and WWF wrestling' },
  { id: 'espn', name: 'ESPN',            short: 'ESPN',  color: '#ff4d6a', closedown: false,
    blurb: 'ESPN Star Sports: more cricket and wrestling' }
];

const TV_RUNS = [

  /* ------------------------------------------------------------------ DD NATIONAL */
  { net: 'ddn', from: 1984, to: 2007, show: 'Rangoli', day: 'Sun', time: '07:30', dur: 60, conf: 'verified', eps: 'RANGOLI',
    src: 'Sunday mornings from 7:30 am (Deccan Herald); 60 min (Wikipedia). Official DD National uploads, in order.' },
  { net: 'ddn', from: 1984, to: 2007, show: 'Chitrahaar', day: 'Fri', time: '20:00', dur: 30, conf: 'verified', eps: 'CHITRAHAAR',
    src: 'Fridays (Eastern Mirror); the 8:00-8:30 pm slot (Deccan Herald). Videos: a community upload of song clips.' },
  { net: 'ddn', from: 1984, to: 2007, show: 'Sunday Hindi Feature Film', day: 'Sun', time: '17:00', dur: 150, conf: 'approx', fixture: true,
    src: 'A weekly Hindi film on Sunday evenings is verified (Eastern Mirror); the clock time is a placeholder. Listing only: no video.' },

  { net: 'ddn', from: 1984, to: 1985, show: 'Hum Log', day: ['Tue', 'Sat'], time: '21:00', dur: 30, conf: 'approx',
    src: 'First episode Sat 7 Jul 1984, last Tue 17 Dec 1985, 156 episodes (Wikipedia): about two a week, so Tuesday and Saturday is worked out from those dates. Clock time is a placeholder.' },
  { net: 'ddn', from: 1985, to: 1986, show: 'Vikram Aur Betaal', day: 'Sun', time: '16:30', dur: 30, conf: 'recalled',
    src: 'Sunday late afternoon, 1985-86, recalled from nostalgia sources. Videos: Tilak community playlist.' },
  { net: 'ddn', from: 1985, to: 1986, show: 'Karamchand', day: 'Sun', time: '20:00', dur: 45, conf: 'approx',
    src: 'First aired June 1985 on DD1 (Wikipedia). Day and clock time are placeholders.' },

  { net: 'ddn', from: 1986, to: 1987, show: 'Buniyaad', day: ['Tue', 'Sat'], time: '21:00', dur: 30, conf: 'approx',
    src: 'Tuesday and Saturday nights (India Today). The clock time is a placeholder.' },
  { net: 'ddn', from: 1986, to: 1987, show: 'Nukkad', day: 'Thu', time: '21:00', dur: 30, conf: 'approx',
    src: 'Ran on DD National 1986-87. Day and clock time are placeholders.' },
  { net: 'ddn', from: 1986, to: 1987, show: 'Dada Dadi Ki Kahaniyan', day: 'Sat', time: '18:00', dur: 30, conf: 'approx',
    src: 'Children\'s storytelling show on DD National, 1986-87. Day and clock time are placeholders.' },

  { net: 'ddn', from: 1987, to: 1987, show: 'Gul Gulshan Gulfaam', day: 'Wed', time: '21:00', dur: 15, conf: 'approx',
    src: 'A 1987 DD National serial (Wikipedia). Day and clock time are placeholders. Videos: short community clips.' },
  { net: 'ddn', from: 1987, to: 1988, show: 'Malgudi Days', day: 'Sat', time: '10:00', dur: 30, conf: 'recalled',
    src: '"Every Saturday morning at 10am" (Caleidoscope nostalgia article). Videos: community playlist.' },
  { net: 'ddn', from: 1987, to: 1988, show: 'Ramayan', day: 'Sun', time: '09:30', dur: 40, conf: 'verified', eps: 'RAMAYAN',
    src: 'Sunday mornings from 25 Jan 1987, 35-min episodes (ThePrint); 9:30 start. Slot is 40 min because the Tilak uploads run 32-40 min. Episodes 1-78 in order.' },

  { net: 'ddn', from: 1988, to: 1988, show: 'Mirza Ghalib', day: 'Sat', time: '21:00', dur: 30, conf: 'approx',
    src: 'Gulzar\'s Mirza Ghalib aired on DD National in 1988 (Wikipedia). Day and clock time are placeholders.' },
  { net: 'ddn', from: 1988, to: 1989, show: 'Mr. Yogi', day: 'Mon', time: '21:00', dur: 30, conf: 'approx',
    src: 'Aired on DD1 1988-89 (Wikipedia). Day and clock time are placeholders.' },
  { net: 'ddn', from: 1988, to: 1989, show: 'Fauji', day: 'Wed', time: '21:00', dur: 30, conf: 'approx',
    src: 'Shah Rukh Khan\'s first serial, DD National 1988-89. Day and clock time are placeholders.' },
  { net: 'ddn', from: 1988, to: 1990, show: 'Wagle Ki Duniya', day: 'Thu', time: '21:00', dur: 30, conf: 'approx',
    src: 'Aired on DD National from 1988 to 1990 (Wikipedia). Day and clock time are placeholders.' },
  { net: 'ddn', from: 1988, to: 1989, show: 'Bharat Ek Khoj', day: 'Sun', time: '11:00', dur: 60, conf: 'recalled',
    src: 'Sunday late morning, 1988-89, recalled from earlier research. Videos: official Doordarshan uploads.' },

  { net: 'ddn', from: 1989, to: 1990, show: 'Mahabharat', day: 'Sun', time: '09:00', dur: 60, conf: 'verified', eps: 'MAHABHARAT',
    src: 'Every Sunday for an hour from 2 Oct 1988 to 24 Jun 1990 (ThePrint); 9 am (reader memory). It ran into the last months of 1988 too, but Ramayan holds the 1988 dial. Videos: community uploads on Dailymotion, 56 of the 94 episodes, in order (the numbers that are missing stay missing).' },
  { net: 'ddn', from: 1989, to: 1990, show: 'Flop Show', day: 'Sun', time: '20:30', dur: 30, conf: 'approx',
    src: 'Jaspal Bhatti\'s satire, DD National 1989-90. Day and clock time are placeholders.' },

  { net: 'ddn', from: 1990, to: 1991, show: 'The Sword of Tipu Sultan', day: 'Sat', time: '21:00', dur: 45, conf: 'approx',
    src: 'First broadcast on DD National in Feb 1990 (Wikipedia). Day and clock time are placeholders.' },
  { net: 'ddn', from: 1991, to: 1991, show: 'Kahkashan', day: 'Sun', time: '21:30', dur: 15, conf: 'approx',
    src: 'Ali Sardar Jafri\'s Urdu poets series, DD National 1991. Day and clock time are placeholders.' },
  { net: 'ddn', from: 1991, to: 1992, show: 'Akbar Birbal', day: 'Sat', time: '20:30', dur: 30, conf: 'approx',
    src: 'Early-90s DD National serial. Years, day and clock time are placeholders.' },

  { net: 'ddn', from: 1992, to: 1993, show: 'The Jungle Book (Mowgli)', day: 'Sun', time: '10:00', dur: 30, conf: 'verified', lib: 'The Jungle Book (Mowgli)',
    src: 'Sundays 10:00 am, 1 Nov 1992 to 24 Oct 1993, 52 episodes (animemirchi.com fan guide). Videos: Hindi dub, community upload, 23 of the 52 episodes, played in order.' },
  { net: 'ddn', from: 1993, to: 1997, show: 'Alif Laila', day: 'Sat', time: '19:00', dur: 30, conf: 'approx',
    src: 'Sagar Arts, DD National 1993-97 (Wikipedia). Day and clock time are placeholders.' },
  { net: 'ddn', from: 1993, to: 1997, show: 'Byomkesh Bakshi', day: 'Wed', time: '20:30', dur: 45, conf: 'approx',
    src: 'Premiered Wed 7 Apr 1993 (listing site, weak source). Clock time is a placeholder. Videos: official Doordarshan uploads.' },
  { net: 'ddn', from: 1994, to: 1996, show: 'Chandrakanta', day: 'Sun', time: '09:00', dur: 30, conf: 'recalled',
    src: 'Sunday 9 am, 1994-96, recalled from earlier research. Videos: community playlist.' },
  { net: 'ddn', from: 1994, to: 1997, show: 'Tehkikaat', day: 'Sun', time: '21:00', dur: 60, conf: 'approx',
    src: 'Vijay Anand\'s detective series on Doordarshan, 1994-97. Day and clock time are placeholders.' },

  { net: 'ddn', from: 1997, to: 2001, show: 'Shaktimaan', day: 'Sun', time: '12:00', dur: 60, conf: 'recalled', eps: 'SHAKTIMAAN',
    src: 'Sundays on DD National from 27 Sep 1997 (Wikipedia); the noon start is recalled.' },
  { net: 'ddn', from: 1998, to: 1999, show: 'Captain Vyom', day: 'Sun', time: '10:00', dur: 30, conf: 'recalled',
    src: 'Sunday 10 am, 1998-99, recalled. Videos: community playlist.' },
  { net: 'ddn', from: 1998, to: 1999, show: 'Ulta Pulta', day: 'Thu', time: '19:30', dur: 15, conf: 'approx',
    src: 'Jaspal Bhatti\'s 10-minute satire, DD National 1998. Day and clock time are placeholders.' },
  { net: 'ddn', from: 2002, to: 2005, show: 'Shaktimaan', day: 'Sun', time: '11:00', dur: 60, conf: 'approx', eps: 'SHAKTIMAAN',
    src: 'Still on Sundays until 27 Mar 2005 (Wikipedia), but Aryamaan took the noon slot in Jul 2002, so 11:00 is a placeholder.' },
  { net: 'ddn', from: 2002, to: 2003, show: 'Aryamaan', day: 'Sun', time: '12:00', dur: 60, conf: 'verified',
    src: 'Started 14 Jul 2002 in DD National\'s Sunday 12:00-13:00 slot (Wikipedia). Videos: community playlist.' },

  /* ------------------------------------------------------------------ DD METRO */
  { net: 'ddm', from: 1993, to: 1996, show: 'Shri Krishna', day: 'Sun', time: '09:30', dur: 60, conf: 'approx', lib: 'Shri Krishna',
    src: 'Started Sun 18 Jul 1993 on DD Metro (Wikipedia). The clock time is a placeholder. Videos: Tilak official channel, 219 of 221 episodes, in order.' },
  { net: 'ddm', from: 1993, to: 1994, show: 'Zabaan Sambhalke', day: 'Mon', time: '21:00', dur: 30, conf: 'approx',
    src: 'DD Metro, 1993-94, 54 episodes (Wikipedia); it came back on Home TV in 1997-98. Day and clock time are placeholders. Videos: official channel playlist.' },
  { net: 'ddm', from: 1993, to: 1997, show: 'Dekh Bhai Dekh', day: 'Thu', time: '21:30', dur: 30, conf: 'approx',
    src: 'Premiered Thu 6 May 1993 on DD Metro and ran to 1997 (Wikipedia). 9:30 pm from a listing site (weak). Videos: only 6 episodes are embeddable.' },
  { net: 'ddm', from: 1994, to: 1997, show: 'Shrimaan Shrimati', day: 'Fri', time: '21:00', dur: 30, conf: 'approx',
    src: 'Premiered Fri 29 Jul 1994 on Doordarshan, ran to 1997 (Wikipedia). Clock time is a placeholder.' },
  { net: 'ddm', from: 1994, to: 1996, show: 'Tu Tu Main Main', day: 'Sat', time: '21:00', dur: 30, conf: 'approx',
    src: 'Premiered on DD Metro in 1994 and ran there till 1996 before moving to Star Plus (Wikipedia). Day and clock time are placeholders.' },
  { net: 'ddm', from: 1995, to: 1997, show: 'Swabhimaan', day: 'Tue', time: '21:00', dur: 30, conf: 'approx',
    src: 'Mahesh Bhatt\'s serial, Doordarshan 1995-97. Network, day and clock time are placeholders.' },

  /* ------------------------------------------------------------------ ZEE TV */
  { net: 'zee', from: 1993, to: 2001, show: 'Zee Horror Show', day: 'Fri', time: '22:00', dur: 30, conf: 'approx',
    src: 'Weekly, on Zee TV 1993-2001 (Wikipedia). Day and clock time are placeholders. Videos: Ramsay Brothers official channel.' },
  { net: 'zee', from: 1994, to: 1995, show: 'Kabhi Yeh Kabhi Woh', day: 'Mon', time: '19:30', dur: 15, conf: 'approx',
    src: 'Zee TV, 1994 (a listing site, weak source). Day and clock time are placeholders. Videos: short community clips.' },
  { net: 'zee', from: 1995, to: 1999, show: 'Hum Paanch', day: 'Tue', time: '20:00', dur: 35, conf: 'verified', eps: 'HUM_PAANCH',
    src: 'Tuesdays 8 pm, ~30 min (Wikipedia). Zee TV official uploads, in order from Ep 1 (6 are not public on YouTube so numbers skip them); slot is 35 min for the longest uploads.' },
  { net: 'zee', from: 1996, to: 1999, show: 'Hasratein', day: 'Sat', time: '21:30', dur: 30, conf: 'approx',
    src: 'Premiered on Zee TV in 1996 and ended in 1999, 208 episodes (Wikipedia). Day and clock time are placeholders.' },


  // Zee shows whose YEARS are sourced (Wikipedia's list of Zee programmes) but whose day and clock time are not.
  // The slots below were handed out so that no two shows overlap; treat every one of them as a placeholder (shown with ~).
  { net: 'zee', from: 1998, to: 2000, show: 'Saturday Suspense', day: 'Sat', time: '22:00', dur: 30, conf: 'recalled',
    src: 'Telecast every Saturday, 1998 to 2000, 109 episodes (ninetiestv blog); the 10 pm start is a placeholder. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1992, to: 1992, show: 'Commander', day: 'Mon', time: '21:00', dur: 30, conf: 'approx',
    src: 'Zee TV 1992 (Wikipedia list of Zee programmes). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1993, to: 1997, show: 'Banegi Apni Baat', day: 'Wed', time: '21:00', dur: 30, conf: 'approx',
    src: 'Zee TV 1993-97 (Wikipedia). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1993, to: 1997, show: 'Campus', day: 'Thu', time: '21:00', dur: 30, conf: 'approx',
    src: 'Zee TV 1993-97 (Wikipedia list of Zee programmes). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1993, to: 1996, show: 'Filmi Chakkar', day: 'Mon', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV early-to-mid 90s; years from the show page, not a printed source. Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1993, to: 1997, show: 'Tara', day: 'Mon', time: '21:00', dur: 30, conf: 'approx',
    src: 'Zee TV 1993-97 (Wikipedia), Zee\'s first big serial; 23-minute episodes. Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1995, to: 1995, show: 'Baat Ban Jaaye', day: 'Wed', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1995 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1995, to: 1995, show: 'Chamatkaar', day: 'Thu', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1995; year from the show page, not a printed source. Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1995, to: 1996, show: 'Dastaan', day: 'Mon', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1995-96 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1995, to: 1995, show: 'Mano Ya Na Mano', day: 'Sun', time: '22:00', dur: 30, conf: 'approx',
    src: 'Zee TV 1995 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1997, to: 1998, show: 'Ghar Jamai', day: 'Mon', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1997-98 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1997, to: 1997, show: 'Margarita', day: 'Mon', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1997 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1997, to: 1997, show: 'Mrs. Madhuri Dixit', day: 'Wed', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1997 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1998, to: 1999, show: 'Chashme Baddoor', day: 'Fri', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1998-99 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1998, to: 1999, show: 'Gudgudee', day: 'Wed', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1998-99 (Wikipedia list). 93 episodes, all from Zee\'s own channel. Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1998, to: 2001, show: 'Hip Hip Hurray', day: 'Wed', time: '21:00', dur: 30, conf: 'approx',
    src: 'Zee TV 1998-2001 (Wikipedia list of Zee programmes); an earlier version of this table had it on DD National, which no source backs. Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1998, to: 1999, show: 'Hudd Kar Di', day: 'Thu', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1998-99 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1998, to: 1999, show: 'Shapath', day: 'Fri', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1998-99 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1998, to: 2002, show: 'X Zone', day: 'Sun', time: '22:00', dur: 30, conf: 'approx',
    src: 'Zee TV 1998-2002 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1999, to: 2003, show: 'Aangan', day: 'Mon', time: '21:00', dur: 30, conf: 'approx',
    src: 'Zee TV 1999-2003 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1999, to: 2000, show: 'Hello Friends', day: 'Mon', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 1999-2000 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 1999, to: 2000, show: 'Professor Pyarelal', day: 'Mon', time: '20:00', dur: 30, conf: 'approx',
    src: 'Zee TV 1999-2000 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2000, to: 2000, show: 'Dastak', day: 'Wed', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2000 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2000, to: 2000, show: 'Hotel Hindustani', day: 'Thu', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2000 (Wikipedia lists it as Hotel Hindustan). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2000, to: 2000, show: 'Kashti', day: 'Mon', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2000 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2000, to: 2002, show: 'Koshish Ek Aashaa', day: 'Thu', time: '21:00', dur: 30, conf: 'approx',
    src: 'Zee TV 2000-02 (Wikipedia lists it as Koshish). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2000, to: 2000, show: 'Little Mirchi Thoda Pepper', day: 'Wed', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2000 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2000, to: 2000, show: 'Suspense Hour', day: 'Fri', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2000, 20 episodes (the Saturday Suspense show renamed; ninetiestv blog). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2001, to: 2001, show: 'Apun To Bas Vaise Hi', day: 'Mon', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2001 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2001, to: 2002, show: 'Mujhe Dor Koi Khinche', day: 'Mon', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2001-02 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2001, to: 2001, show: 'Yeh Dil Kya Kare', day: 'Wed', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2001 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2001, to: 2001, show: 'Yeh Hai Mumbai Meri Jaan', day: 'Wed', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2001 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2002, to: 2003, show: 'Kitne Kool Hain Hum', day: 'Mon', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2002-03 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2002, to: 2004, show: 'Kittie Party', day: 'Wed', time: '21:00', dur: 30, conf: 'approx',
    src: 'Zee TV 2002-04 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2002, to: 2002, show: 'Saanjjhi', day: 'Wed', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2002 (Wikipedia lists it as Saanjhi). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2003, to: 2003, show: 'Mulk', day: 'Thu', time: '21:00', dur: 30, conf: 'approx',
    src: 'Zee TV 2003 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2003, to: 2003, show: 'Pyar Zindagi Hai', day: 'Mon', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2003 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2003, to: 2003, show: 'The Magic Make-Up Box', day: 'Sat', time: '17:00', dur: 30, conf: 'approx',
    src: 'Zee TV 2003 children\'s show. Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2004, to: 2005, show: 'Chi and Me', day: 'Sat', time: '17:00', dur: 30, conf: 'approx',
    src: 'Zee TV 2004-05 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2004, to: 2005, show: 'Rooh', day: 'Sun', time: '22:00', dur: 30, conf: 'approx',
    src: 'Zee TV 2004-05 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2004, to: 2004, show: 'Tamanna House', day: 'Fri', time: '21:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2004 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2005, to: 2006, show: 'Kabhi Haan Kabhi Naa', day: 'Mon', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2005-06 (Wikipedia list). Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2006, to: 2007, show: 'Pandey Aur Pandey', day: 'Wed', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2006-07; years from the show page, not a printed source. Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },
  { net: 'zee', from: 2007, to: 2007, show: 'Chaldi Da Naam Gaddi', day: 'Mon', time: '20:30', dur: 30, conf: 'approx',
    src: 'Zee TV 2007-08; years from the show page, not a printed source. Day and clock time are placeholders. Videos: Zee TV\'s own YouTube channel.' },

  /* ------------------------------------------------------------------ HOME TV */
  { net: 'home', from: 1996, to: 2000, show: 'Weekend Hindi Film', day: ['Sat', 'Sun'], time: '20:00', dur: 150, conf: 'recalled', fixture: true,
    src: 'A film at 8 pm on weekends, as remembered by viewers of the channel; no printed listing found. Listing only: no video.' },
  { net: 'home', from: 1996, to: 1996, show: 'Kabhi Idhar Kabhi Udhar', day: 'Fri', time: '21:00', dur: 30, conf: 'approx', fixture: true,
    src: 'Shekhar Suman\'s comedy on Home TV in 1996 (Wikipedia). Day and clock time are placeholders. Only three short clips exist online: find them in ALL SHOWS.' },
  { net: 'home', from: 1997, to: 1998, show: 'Zabaan Sambhalke', day: 'Mon', time: '21:00', dur: 30, conf: 'approx',
    src: 'Second run on Home TV, 1997-98, 52 episodes (Wikipedia). Day and clock time are placeholders. Videos: the DD Metro official playlist.' },
  { net: 'home', from: 1998, to: 1999, show: 'V3', day: 'Thu', time: '21:30', dur: 30, conf: 'approx',
    src: 'On Home TV, as remembered by viewers; the years are a placeholder (the channel\'s 1998 ident is the earliest trace). Videos: all 116 public episodes from Zee TV\'s own channel, numbered as Zee numbers them.' },
  { net: 'home', from: 1998, to: 2000, show: 'Hindi-dubbed Chinese serials', day: 'daily', time: '19:00', dur: 60, conf: 'approx', fixture: true,
    src: 'The Zu Mountain Saga, Legend of the Condor Heroes, Land of the Condors and Blood Stained Intrigue aired in Hindi on Home TV, 1998-2000 (a viewer forum). Day and time are placeholders. Only short clips exist online: find them in ALL SHOWS.' },

  /* ------------------------------------------------------------------ STAR PLUS */
  { net: 'star', from: 1996, to: 2000, show: 'Tu Tu Main Main', day: 'Sat', time: '21:00', dur: 30, conf: 'approx',
    src: 'Moved from DD Metro to Star Plus in 1996 and got a new season there in 2000 (Wikipedia). Day and clock time are placeholders.' },
  { net: 'star', from: 1997, to: 1999, show: 'Aap Beeti', day: 'Sat', time: '21:30', dur: 45, conf: 'recalled',
    src: 'B.R. Chopra\'s horror anthology; "every Saturday at 9:30 p.m." (News18, read from a search snippet).' },
  { net: 'star', from: 2000, to: 2001, show: 'Kaun Banega Crorepati', day: ['Mon', 'Tue', 'Wed', 'Thu'], time: '21:00', dur: 60, conf: 'recalled', eps: 'KBC',
    src: 'Began 3 Jul 2000 in the evening (IndianTelevision.com); days and clock time recalled. Videos: community clips, not numbered.' },
  { net: 'star', from: 2000, to: 2007, show: 'Kyunki Saas Bhi Kabhi Bahu Thi', day: ['Mon', 'Tue', 'Wed', 'Thu'], time: '22:30', dur: 30, conf: 'recalled',
    src: 'Began 3 Jul 2000 in the evening (IndianTelevision.com); days and clock time recalled. Videos: community playlist.' },

  /* ------------------------------------------------------------------ SONY / SET */
  { net: 'sony', from: 1996, to: 1998, show: 'Just Mohabbat', day: 'Wed', time: '20:30', dur: 30, conf: 'approx',
    src: 'A Sony Entertainment Television youth show of the late 90s. Years, day and clock time are placeholders. Videos: official channel playlist.' },
  { net: 'sony', from: 2007, to: 2007, show: 'Comedy Circus', day: 'Sat', time: '21:30', dur: 60, conf: 'verified',
    src: 'Launched Sat 16 Jun 2007, every Saturday 9:30 pm (exchange4media). Videos: SET India official channel, episodes 1 to 19 in order (episode 3 has no embeddable upload).' },

  /* ------------------------------------------------------------------ SAB TV */
  { net: 'sab', from: 2001, to: 2003, show: 'Office Office', day: 'Mon', time: '21:00', dur: 30, conf: 'approx',
    src: 'Premiered Mon 3 Sep 2001 on SAB TV (Wikipedia). Clock time is a placeholder.' },

  /* ------------------------------------------------------------------ MTV INDIA */
  { net: 'mtv', from: 1996, to: 1998, show: 'MTV Made in India', day: 'daily', time: '18:00', dur: 15, conf: 'approx',
    src: 'MTV Made in India ran 1996-98 (Wikipedia, list of MTV India programmes, which gives no day or time). Clock time is a placeholder. Videos: Indipop hits of the era, picked by us, from the labels\' own channels.' },
  { net: 'mtv', from: 1998, to: 1999, show: 'MTV Most Wanted', lib: 'MTV Made in India', day: 'daily', time: '19:00', dur: 15, conf: 'approx',
    src: 'MTV Most Wanted ran 1998-99 (Wikipedia). A music-video countdown; day and clock time are placeholders. The videos are the same Indipop set as MTV Made in India: the real countdowns were not uploaded in full.' },
  { net: 'mtv', from: 1999, to: 2005, show: 'MTV Bakra', day: 'Sat', time: '20:00', dur: 15, conf: 'approx',
    src: 'MTV Bakra ran 1999-2005 (Wikipedia). Day and clock time are placeholders. Videos: two short fan-uploaded clips; no full episodes are embeddable.' },

  /* ------------------------------------------------------------------ CARTOON NETWORK */
  { net: 'cn', from: 1999, to: 2007, show: 'Hindi-dubbed cartoons', gen: 'cn', conf: 'verified',
    src: '3-5 pm on weekdays, 2-4 pm on weekends from 4 Jan 1999 (Wikipedia). Videos: Cartoon Network India official channel.' },

  /* ------------------------------------------------------------------ STAR SPORTS */
  { net: 'sstar', from: 1997, to: 2001, show: 'WWF Superstars', day: 'Sat', time: '10:00', dur: 50, conf: 'approx',
    src: 'WWF wrestling aired on Indian sports channels in the late 90s; which channel, which day and what time are not sourced, so this is a placeholder. Videos: official WWE Vault uploads of Superstars episodes dated 1991-97, in date order.' },
  { net: 'sstar', from: 1996, to: 2007, show: 'Classic Cricket Replays', day: ['Sat', 'Sun'], time: '14:00', dur: 60, conf: 'approx',
    src: 'Star Sports carried cricket from 28 Oct 1996. This is a replay slot made up for the dial; no real listing found. Videos: fan-uploaded highlights packages of Sharjah 1998 and the 1996 and 1999 World Cups.' },

  /* ------------------------------------------------------------------ ESPN */
  { net: 'espn', from: 1997, to: 2001, show: 'WWF Raw, Shotgun and Saturday Night\'s Main Event', day: 'Sun', time: '10:00', dur: 50, conf: 'approx',
    src: 'WWF wrestling aired on Indian sports channels in the late 90s; which channel, which day and what time are not sourced, so this is a placeholder. Videos: official WWE Vault uploads.' },
  { net: 'espn', from: 1996, to: 2007, show: 'Cricket Classics from Lord\'s and the ICC', day: ['Sat', 'Sun'], time: '16:00', dur: 30, conf: 'approx',
    src: 'A replay slot made up for the dial; no real listing found. Videos: official ICC and Lord\'s Cricket Ground clips (World Cup 1999, NatWest Series final 2002).' }
];

if (typeof window !== 'undefined') { window.TV_EPOCH = TV_EPOCH; window.TV_YEARS = TV_YEARS; window.TV_NETS = TV_NETS; window.TV_RUNS = TV_RUNS; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { TV_EPOCH: TV_EPOCH, TV_YEARS: TV_YEARS, TV_NETS: TV_NETS, TV_RUNS: TV_RUNS }; }
