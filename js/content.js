/* ==========================================================================
   90s REWIND TV — THE CONTENT FILE
   Everything you can watch on the site, apart from the TV timetable and the
   games and photos (those have their own data files), is listed here. Add a
   line, reload the page: it shows up on its category page (browse.html), in
   search, and on the homepage row if it is featured.

   AN ITEM
     cat        one of the CATEGORIES ids below  (required)
     title      what the card says               (required)
     yt         a YouTube VIDEO id               ┐ one of these is required:
     playlist   a YouTube PLAYLIST id            │  yt       plays that video in the pop-up
     show       a show title from the TV library │  playlist plays the whole playlist in the pop-up
     img / href a local picture / a plain link   ┘  show     opens that show in the ALL SHOWS player
     thumb      a YouTube video id used only for the picture (a playlist has no picture of its
                own, so give the id of any video inside it). Defaults to yt.
     year       when it came out / aired
     desc       one honest line about it
     sub        the small grey line on a card ("Song · Tips")
     credit     the channel that uploaded it. Official uploads from the rights holder are
                preferred; say so with official: true, and label fan uploads honestly.
     featured   true = shown on the homepage row for its category (in the order listed here)
     short      a shorter title if the card is narrow;  c = colour block behind the picture
     dark       true = light text on this card

   FASTEST WAY TO ADD ONE:   node tools/add-content.js <video or playlist id or URL> --cat songs
   (it prints a ready-made line to paste below; see README.md).
   Videos must allow embedding: https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=ID
   has to answer 200, not 401. All of these were checked on 5 Nov 2026.

   TV SHOWS and CARTOONS are not listed here: they come straight from js/tv-library.js (the same
   160 shows as the ALL SHOWS player), so adding a show there adds it everywhere. The items
   below with show: only choose which shows are featured on the homepage and what their card says.
   ========================================================================== */

var CATEGORIES = [
  { id: 'tv',      label: 'TV Shows',       icon: 'tv',      sec: 'sec-star',    blurb: 'Serials, sitcoms, thrillers and epics. Every show plays on demand, in order.' },
  { id: 'movies',  label: 'Movies',         icon: 'movies',  sec: 'sec-movies',  blurb: 'Trailers, songs and the first part of 90s films, from the studios’ own channels.' },
  { id: 'ads',     label: 'Classic Ads',    icon: 'ads',     sec: 'sec-ads',     long: 'Classic Advertisements', blurb: 'Doordarshan-era commercials, jingles and ad breaks.' },
  { id: 'songs',   label: 'Songs',          icon: 'songs',   sec: 'sec-songs',   long: 'Songs of the 90s', blurb: 'Film songs, Indipop and MTV-era videos.' },
  { id: 'cricket', label: 'Cricket',        icon: 'cricket', sec: 'sec-cricket', long: 'Cricket Classics', blurb: 'World Cups, Sharjah and the matches everyone remembers.' },
  { id: 'wwf',     label: 'WWF / WWE',      icon: 'wwf',     sec: 'sec-wwf',     long: 'WWF / WWE Classics', blurb: 'The Attitude Era and before, from WWE’s own channels.' },
  { id: 'cartoons', label: 'Cartoons',      icon: 'tv',      sec: 'sec-star',    blurb: 'Hindi-dubbed cartoons and kids’ shows.' },
  { id: 'other',   label: 'Other 90s Videos', icon: 'gallery', sec: 'sec-photos', blurb: 'Doordarshan tunes, national-integration films and other things you will remember.' }
];

/* The tabs along the top, in order. href is a page of this site. */
var NAV = [
  { label: 'Home',      href: 'home.html',                 icon: 'home',      color: '#f6ee26', id: 'home' },
  { label: 'Live TV',   href: 'tv.html',                   icon: 'livetv',    color: '#ff8a5c', id: 'live' },
  { label: 'TV Shows',  href: 'browse.html?cat=tv',        icon: 'tv',        color: '#4fd2ff', id: 'tv' },
  { label: 'Movies',    href: 'browse.html?cat=movies',    icon: 'movies',    color: '#ff6fd0', id: 'movies' },
  { label: 'Ads',       href: 'browse.html?cat=ads',       icon: 'ads',       color: '#ffb21f', id: 'ads' },
  { label: 'Games',     href: 'arcade.html',                icon: 'games',     color: '#8ee33a', id: 'games' },
  { label: 'Songs',     href: 'browse.html?cat=songs',     icon: 'songs',     color: '#a878f0', id: 'songs' },
  { label: 'Cricket',   href: 'browse.html?cat=cricket',   icon: 'cricket',   color: '#ffa31a', id: 'cricket' },
  { label: 'WWF',       href: 'browse.html?cat=wwf',       icon: 'wwf',       color: '#ff74cf', id: 'wwf' },
  { label: 'Photos',    href: 'gallery.html',              icon: 'photos',    color: '#6fd8ff', id: 'photos' },
  { label: 'Community', href: 'community.html',            icon: 'community', color: '#ff7ed3', id: 'community' }
];

/* The "What's New?" ticker on every page: { text, href } */
var TICKER = [
  { text: 'Added: Malgudi Days (Full Playlist)', href: 'tv.html#show=Malgudi Days' },
  { text: 'Shaktimaan Episodes', href: 'tv.html#show=Shaktimaan' },
  { text: 'Classic Ads Collection', href: 'browse.html?cat=ads' },
  { text: 'WWF 90s Matches', href: 'browse.html?cat=wwf' },
  { text: 'MTV India joins Live TV', href: 'tv.html?ch=mtv-1998#guide' },
  { text: 'Home TV, Star Sports and ESPN channels on Live TV', href: 'tv.html' },
  { text: 'Zee TV classics: Tara, Gudgudee, V3, Filmi Chakkar', href: 'tv.html#show=Tara' },
  { text: 'Mahabharat: 56 episodes', href: 'tv.html#show=Mahabharat' }
];

/* Site-wide settings. Change contact details here; the footer and the About page read them. */
var SITE = {
  name: '90s Rewind TV',
  contact: { github: 'https://github.com/nileshpatil30/the90sindia/issues/new', email: '' },      // email: '' = not shown
  pages: { about: 'about.html#about', submit: 'about.html#submit', guidelines: 'about.html#guidelines', contact: 'about.html#contact' }
};

var CONTENT = [

  /* ---------------------------------------------------------------- TV SHOWS (featured on the homepage) */
  { cat: 'tv', title: 'Shaktimaan',      show: 'Shaktimaan',      thumb: 'YHFpFe-itLE', year: 1997, featured: true, c: '#7a1020',
    desc: 'The Hindi superhero serial on DD National, 1997 to 2005, with Mukesh Khanna.' },
  { cat: 'tv', title: 'Ramayan',         show: 'Ramayan',         thumb: 'RG3Hqth0Eus', year: 1987, featured: true, c: '#8a5a12',
    desc: 'Ramanand Sagar’s Ramayan, on Sunday mornings from 25 January 1987.' },
  { cat: 'tv', title: 'Chandrakanta',    show: 'Chandrakanta',    thumb: '4-bRopmzlms', year: 1994, featured: true, c: '#5a3a2a',
    desc: 'Fantasy serial from Devaki Nandan Khatri’s novel, on DD National in the mid 90s.' },
  { cat: 'tv', title: 'Malgudi Days',    show: 'Malgudi Days',    thumb: 'mIYA5qANs_A', year: 1986, featured: true, c: '#3a5a2a',
    desc: 'R. K. Narayan’s small-town stories, directed by Shankar Nag, on Doordarshan from 1986.' },
  { cat: 'tv', title: 'Byomkesh Bakshi', show: 'Byomkesh Bakshi', thumb: 'dpdo8t2F8cQ', year: 1993, featured: true, c: '#1a1a22', dark: true,
    desc: 'The detective serial from Sharadindu Bandyopadhyay’s stories, on DD National from 1993.' },

  /* ---------------------------------------------------------------- MOVIES */
  { cat: 'movies', title: 'Dilwale Dulhania Le Jayenge', short: 'Dilwale Dulhania…', sub: 'Song · YRF', credit: 'YRF', official: true,
    yt: 'cNV5hLSa9H8', year: 1995, featured: true, c: '#2f55b8', desc: 'Tujhe Dekha To, from the 1995 Yash Raj Films romance with Shah Rukh Khan and Kajol.' },
  { cat: 'movies', title: 'Andaz Apna Apna', sub: 'Trailer · Tips', credit: 'Tips Official', official: true,
    yt: 'ggGMb7oVEHc', year: 1994, featured: true, c: '#8a3fe0', desc: 'The re-release trailer of the 1994 Aamir Khan and Salman Khan comedy.' },
  { cat: 'movies', title: 'Hum Aapke Hain Koun..!', sub: 'Part 1 of 17 · Rajshri', credit: 'Rajshri', official: true,
    yt: 'KySzjuXUjcY', year: 1994, featured: true, c: '#a0305a', desc: 'The 1994 family film with Salman Khan and Madhuri Dixit, in parts, from Rajshri.' },
  { cat: 'movies', title: 'Karan Arjun', sub: 'Song · Tips', credit: 'Tips Official', official: true,
    yt: 'OPHZKBRI5oc', year: 1995, featured: true, c: '#2a2a3a', desc: 'A song from the 1995 reincarnation drama with Shah Rukh Khan and Salman Khan.' },
  { cat: 'movies', title: 'Border', sub: 'Song · Ishtar', credit: 'Ishtar Music', official: true,
    yt: 'YczkDMTaek4', year: 1997, featured: true, c: '#3a4a2a', desc: 'A song from J. P. Dutta’s 1997 war film.' },
  { cat: 'movies', title: 'Dilwale Dulhania Le Jayenge', sub: 'Trailer · YRF', credit: 'YRF Movies', official: true,
    yt: 'cmax1C1p660', year: 1995, c: '#2f55b8', desc: 'The trailer of the 1995 film.' },
  { cat: 'movies', title: 'Kuch Kuch Hota Hai', sub: 'Trailer · Dharma', credit: 'Dharma Productions', official: true,
    yt: 'IR5ReWgs-iQ', year: 1998, c: '#c24a8a', desc: 'The trailer of Karan Johar’s 1998 debut.' },
  { cat: 'movies', title: 'Hum Saath Saath Hain', sub: 'Part 1 of 16 · Rajshri', credit: 'Rajshri', official: true,
    yt: 'Rgi_x7zq9IM', year: 1999, c: '#c98a12', desc: 'The first part of the 1999 Rajshri family film.' },

  /* ---------------------------------------------------------------- CLASSIC ADS */
  { cat: 'ads', title: 'Hamara Bajaj', sub: '1989 · DD ad', yt: 'scltYH13uEY', year: 1989, featured: true, c: '#2f55b8',
    desc: '“Buland Bharat ki buland tasveer”: the Bajaj scooter ad.' },
  { cat: 'ads', title: 'Boost', sub: 'Sachin Tendulkar', yt: 'fA-ycugvzno', featured: true, c: '#a0305a', desc: 'The Boost ad with Sachin Tendulkar.' },
  { cat: 'ads', title: 'Nirma', sub: 'Washing powder', yt: 'A28vF1aGjGY', featured: true, c: '#2f8a8a', desc: 'The Nirma washing powder jingle.' },
  { cat: 'ads', title: 'Lijjat Papad', sub: 'TV ad', yt: 'CFDkFq8yHEQ', featured: true, c: '#c98a12', desc: 'The Lijjat Papad ad.' },
  { cat: 'ads', title: 'Cadbury', sub: '1994 cricket ad', yt: 'ZwrS0UkGrPw', year: 1994, featured: true, c: '#5a1a7a', desc: 'The cricket-ground Cadbury ad.' },
  { cat: 'ads', title: 'Vicco Turmeric', sub: '1990 · Doordarshan', credit: 'Fan upload', yt: 'meo1WwmsKhE', year: 1990, c: '#c98a12', desc: 'Vicco Turmeric, not a cosmetic, as shown on Doordarshan.' },
  { cat: 'ads', title: 'Maggi 2-Minute Noodles', sub: 'Doordarshan ad', credit: 'Fan upload', yt: '8_D-nQSTn-E', c: '#d83a2a', desc: 'An old Doordarshan Maggi ad.' },
  { cat: 'ads', title: 'Amul Butter', sub: 'Utterly butterly', credit: 'Amul TV', official: true, yt: '2YqO3swh56A', c: '#e8b020', desc: 'The Amul butter ad, from Amul’s own channel.' },

  /* ---------------------------------------------------------------- SONGS */
  { cat: 'songs', title: 'Dheere Dheere Se',  sub: 'Aashiqui (1990)',        credit: 'T-Series',     official: true, yt: 'KeyfUuXPOcY', year: 1990, featured: true },
  { cat: 'songs', title: 'Pehla Nasha',       sub: 'Jo Jeeta Wohi Sikandar', credit: 'Saregama',     official: true, yt: 'iSUK1QoK9-E', year: 1992, featured: true },
  { cat: 'songs', title: 'Chura Ke Dil Mera', sub: 'Main Khiladi Tu Anari',  credit: 'Ishtar Music', official: true, yt: 'Yqj1_V90KJo', year: 1994, featured: true },
  { cat: 'songs', title: 'Pehla Pehla Pyar Hai', sub: 'Hum Aapke Hain Koun',  credit: 'Rajshri',     official: true, yt: 'gIODEFkvjTA', year: 1994 },
  { cat: 'songs', title: 'Yeh Kaali Kaali Aankhen', sub: 'Baazigar',          credit: 'Ishtar Music', official: true, yt: 'ken7_9Jh0eE', year: 1993 },
  { cat: 'songs', title: 'Tu Cheez Badi Hai Mast', sub: 'Mohra',              credit: 'Ishtar Music', official: true, yt: 'bH_8yww6BAI', year: 1994 },
  { cat: 'songs', title: 'Mere Khwabon Mein', sub: 'Dilwale Dulhania Le Jayenge', credit: 'YRF',    official: true, yt: 's1LozokQjIg', year: 1995 },
  { cat: 'songs', title: 'Dil To Pagal Hai',  sub: 'Dil To Pagal Hai',       credit: 'YRF',          official: true, yt: 'lZ2PhyBF3GQ', year: 1997 },
  { cat: 'songs', title: 'Kuch Kuch Hota Hai', sub: 'Title track',           credit: 'Sony Music India', official: true, yt: 'bKZTnnFU9HA', year: 1998 },
  { cat: 'songs', title: 'Made in India',    sub: 'Alisha Chinai · Indipop', credit: 'Sony Music India', official: true, yt: 'IvloHsmi_vg', year: 1995 },
  { cat: 'songs', title: 'Krishna',          sub: 'Colonial Cousins · Indipop', credit: 'Sony Music India', official: true, yt: 'CJvK0dox0_M', year: 1996 },
  { cat: 'songs', title: 'O Sanam',          sub: 'Lucky Ali · Indipop', credit: 'Sony Music India', official: true, yt: 'dWqb-WqbGh8', year: 1996 },
  { cat: 'songs', title: 'Bolo Ta Ra Ra',    sub: 'Daler Mehndi · Indipop', credit: 'Daler Mehndi', official: true, yt: 'h6Ze5Hqa1wA', year: 1996 },
  { cat: 'songs', title: 'Dooba Dooba',      sub: 'Silk Route · Indipop', credit: 'Sony Music India', official: true, yt: 'ecPMVO7JuTo', year: 1998 },
  { cat: 'songs', title: 'Dhoom',            sub: 'Euphoria · Indipop', credit: 'Euphoria', official: true, yt: 'nlqeTUGdMSs', year: 1998 },
  { cat: 'songs', title: 'Tanha Dil',        sub: 'Shaan · Indipop',    credit: 'Universal Music India', official: true, yt: '64KSVbMDr0c', year: 2000 },

  /* ---------------------------------------------------------------- CRICKET */
  { cat: 'cricket', title: 'India vs Australia', sub: 'Sharjah Cup (1998)', credit: 'Desert Storm highlights, community upload', yt: 'fZqa4OtUlGY', year: 1998, featured: true,
    desc: 'Sachin Tendulkar’s Desert Storm innings against Australia.' },
  { cat: 'cricket', title: '1996 World Cup', sub: 'India vs Pakistan QF', credit: 'Highlights, community upload', yt: '5XBuSRKFM1k', year: 1996, featured: true,
    desc: 'India against Pakistan in the 1996 World Cup quarter-final.' },
  { cat: 'cricket', title: '1983 World Cup Final', sub: 'India vs West Indies', credit: 'Sports Tak, highlights', yt: 'WmKQ7W-Miso', year: 1983,
    desc: 'The Prudential World Cup final at Lord’s that India won.' },
  { cat: 'cricket', title: '1996 World Cup Semi-final', sub: 'India vs Sri Lanka', credit: 'MSU Videos, community upload', yt: 'AjCg3so4DHA', year: 1996,
    desc: 'Highlights of the Eden Gardens semi-final.' },
  { cat: 'cricket', title: 'Sachin 143 at Sharjah', sub: 'Ball by ball', credit: 'Cricket Archive, community upload', yt: 'doy61ubn8cM', year: 1998,
    desc: 'Tendulkar’s 143 against Australia, Sharjah 1998.' },

  /* ---------------------------------------------------------------- WWF / WWE */
  { cat: 'wwf', title: 'The Undertaker', sub: 'vs Hulk Hogan, 1991', credit: 'WWE', official: true, yt: 'DHK2d6WFdk8', year: 1991, featured: true },
  { cat: 'wwf', title: 'The Rock',       sub: 'Funniest moments',    credit: 'WWE', official: true, yt: 'BwjACCd3k6k', featured: true },
  { cat: 'wwf', title: 'Stone Cold',     sub: 'His rise',            credit: 'WWE Vault', official: true, yt: 'SCHuOf12S4o', featured: true },
  { cat: 'wwf', title: 'Bret Hart vs Shawn Michaels', sub: 'Iron Man, WrestleMania XII', credit: 'WWE', official: true, yt: '0a6SUIvOw7A', year: 1996,
    desc: 'The 60-minute Iron Man match for the WWF title.' },
  { cat: 'wwf', title: 'Stone Cold vs Undertaker', sub: 'SummerSlam 1998', credit: 'WWE', official: true, yt: 'cbKuGjpmOYU', year: 1998,
    desc: 'The WWF title match from SummerSlam 1998.' },

  /* ---------------------------------------------------------------- OTHER 90s VIDEOS */
  { cat: 'other', title: 'Mile Sur Mera Tumhara', sub: 'National integration film', credit: 'Fan upload', yt: 'k8DtPqXjptM', year: 1988,
    desc: 'The Doordarshan film that put India’s languages into one song.' },
  { cat: 'other', title: 'Doordarshan Signature Tune', sub: 'And the montage', credit: 'Fan upload', yt: 'iPjXxH7tJpo',
    desc: 'The tune and the animation that opened the day on Doordarshan.' },
  { cat: 'other', title: 'Freedom Run: the Torch Song', sub: '1987 · Prasar Bharati Archives', credit: 'Prasar Bharati Archives', official: true, yt: 'rs2ymp_uIuk', year: 1987,
    desc: 'A 1987 song from Doordarshan’s own archive.' },
  { cat: 'other', title: 'Bharat Bharat Hum Iski Santan', sub: 'Patriotic song', credit: 'Prasar Bharati Archives', official: true, yt: 'HMbN8EEUL9k',
    desc: 'A patriotic song from Doordarshan’s own archive.' }
];

if (typeof window !== 'undefined') { window.CATEGORIES = CATEGORIES; window.NAV = NAV; window.TICKER = TICKER; window.CONTENT = CONTENT; window.SITE = SITE; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { CATEGORIES: CATEGORIES, NAV: NAV, TICKER: TICKER, CONTENT: CONTENT, SITE: SITE }; }
