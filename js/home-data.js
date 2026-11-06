/* ==========================================================================
   90s REWIND TV — HOMEPAGE CONTENT (home.html)
   All the words, links and video IDs on the homepage live here, apart from the
   page design (css/home.css) and behaviour (js/home.js). Edit this file to
   change what the cards show.

   A CARD:   { title, sub?, credit?, yt: 'VIDEO_ID', show: 'Show title' }
     yt      a YouTube video ID. The card's picture is YouTube's own thumbnail of it.
             Clicking opens it in a pop-up player (YouTube's own player, nothing drawn
             over it). Checked 5 Nov 2026: all of these allow embedding.
     show    instead of yt: opens that show on tv.html (the ALL SHOWS player)
     img     a local picture, if the card has no video
     href    a plain link
   Pictures: YouTube thumbnails load from i.ytimg.com. If one fails, the card shows
   a plain colour block with the title.

   Official uploads are preferred (marked official: true). Community uploads are
   labelled. Movies are NOT shown as full films from random re-upload channels:
   each movie card plays an official clip (song, trailer or part 1) from the
   rights-holder's own channel.
   ========================================================================== */
var HOME = {

  nav: [
    { label: 'Home',      href: 'home.html',         icon: 'home',      color: '#f6ee26', current: true },
    { label: 'Live TV',   href: '#live',             icon: 'livetv',    color: '#ff8a5c' },
    { label: 'TV Shows',  href: '#tv-shows',         icon: 'tv',        color: '#4fd2ff' },
    { label: 'Movies',    href: '#movies',           icon: 'movies',    color: '#ff6fd0' },
    { label: 'Ads',       href: '#ads',              icon: 'ads',       color: '#ffb21f' },
    { label: 'Games',     href: '#games',            icon: 'games',     color: '#8ee33a' },
    { label: 'Songs',     href: '#songs',            icon: 'songs',     color: '#a878f0' },
    { label: 'Cricket',   href: '#cricket',          icon: 'cricket',   color: '#ffa31a' },
    { label: 'WWF',       href: '#wwf',              icon: 'wwf',       color: '#ff74cf' },
    { label: 'Photos',    href: '#photos',           icon: 'photos',    color: '#6fd8ff' },
    { label: 'Community', href: '#community',        icon: 'community', color: '#ff7ed3' }
  ],

  // What's New ticker: { text, href }
  ticker: [
    { text: 'Added: Malgudi Days (Full Playlist)', href: 'tv.html#show=Malgudi Days' },
    { text: 'Shaktimaan Episodes', href: 'tv.html#show=Shaktimaan' },
    { text: 'Classic Ads Collection', href: '#ads' },
    { text: 'WWF 90s Matches', href: '#wwf' },
    { text: 'Home TV, Star Sports and ESPN channels on Live TV', href: 'tv.html' },
    { text: 'Zee TV classics: Tara, Gudgudee, V3, Filmi Chakkar', href: 'tv.html#show=Tara' },
    { text: 'Mahabharat: 56 episodes', href: 'tv.html#show=Mahabharat' }
  ],

  // Daily poll. Front-end demo: your vote is kept in this browser, the other bars are sample numbers.
  poll: {
    id: 'fav-90s-show-1',
    q: 'Your favourite 90s TV show?',
    options: ['Shaktimaan', 'Ramayan', 'Malgudi Days', 'Chandrakanta', 'Byomkesh Bakshi'],
    seed: [412, 388, 301, 274, 236]
  },

  // 90s trivia, one at a time ("Check Answer" then "Next")
  trivia: [
    { q: 'Which company gave us the “Hamara Bajaj” ad?', a: 'Bajaj Auto, for its Chetak scooter. “Buland Bharat ki buland tasveer, Hamara Bajaj.”' },
    { q: 'Who played Shaktimaan on Doordarshan?', a: 'Mukesh Khanna. The show began on DD National in 1997.' },
    { q: 'Which channel first aired B. R. Chopra’s Mahabharat?', a: 'Doordarshan (DD National), from 1988 to 1990.' },
    { q: 'Which was India’s first private Hindi satellite channel?', a: 'Zee TV, launched in October 1992.' },
    { q: 'Who hosted the first Kaun Banega Crorepati in 2000?', a: 'Amitabh Bachchan, on Star Plus.' },
    { q: 'When did Doordarshan start colour broadcasts?', a: 'In 1982, in time for the Delhi Asian Games.' }
  ],

  gallery: [
    { src: 'assets/photos/handheld.svg', alt: 'A yellow handheld game console' },
    { src: 'assets/photos/marbles.svg',  alt: 'Glass marbles' },
    { src: 'assets/photos/cap.svg',      alt: 'A fizzy-drink bottle cap' },
    { src: 'assets/photos/cyclists.svg', alt: 'Two kids cycling' }
  ],

  // Right-hand panel. Sample topics: the forum opens in a later phase.
  discussions: {
    top: [
      { t: 'Which 90s ad still gives you nostalgia?', n: 438 },
      { t: 'Best Sunday morning TV shows?', n: 326 },
      { t: 'India vs Pakistan 90s matches!', n: 512 },
      { t: 'Your first video game?', n: 297 }
    ],
    'new': [
      { t: 'Remember the Doordarshan test card?', n: 12 },
      { t: 'Chitrahaar vs Rangoli: which one?', n: 31 },
      { t: 'Cartoon Network on a school day', n: 58 },
      { t: 'Cassette tape pencil trick, who did it?', n: 74 }
    ],
    chat: [
      { u: 'riya90s', m: 'Shaktimaan at 12 baje, no one calls!' },
      { u: 'sandy_bat', m: 'Sharjah 1998. Still gives me goosebumps' },
      { u: 'retro_raj', m: 'Anyone else waiting for Chitrahaar?' },
      { u: 'gudgudee_fan', m: 'Tara on Zee, Monday nights' }
    ],
    note: 'Sample topics and chat. The forum and live chat come in a later phase.'
  },

  tiles: [
    { label: 'TV Shows', href: '#tv-shows', icon: 'tv',       c1: '#d9a6ff', c2: '#b980f0' },
    { label: 'Movies',   href: '#movies',   icon: 'movies',   c1: '#e8f67a', c2: '#c9e83c' },
    { label: 'Ads',      href: '#ads',      icon: 'ads',      c1: '#ffc2a8', c2: '#ff9d7d' },
    { label: 'Games',    href: '#games',    icon: 'games',    c1: '#8fe3ff', c2: '#52c8f2' },
    { label: 'Songs',    href: '#songs',    icon: 'songs',    c1: '#ffb0ea', c2: '#ff86d8' },
    { label: 'Cricket',  href: '#cricket',  icon: 'cricket',  c1: '#e2f27e', c2: '#bfe040' },
    { label: 'WWF',      href: '#wwf',      icon: 'wwf',      c1: '#ffc2a8', c2: '#ff9d7d' },
    { label: 'Photos',   href: '#photos',   icon: 'photos',   c1: '#ffb0ea', c2: '#ff86d8' }
  ],

  // ---- rows of cards ----
  tv: [
    { title: 'Shaktimaan',     yt: 'YHFpFe-itLE', show: 'Shaktimaan',     c: '#7a1020' },
    { title: 'Ramayan',        yt: 'RG3Hqth0Eus', show: 'Ramayan',        c: '#8a5a12' },
    { title: 'Chandrakanta',   yt: '4-bRopmzlms', show: 'Chandrakanta',   c: '#5a3a2a' },
    { title: 'Malgudi Days',   yt: 'mIYA5qANs_A', show: 'Malgudi Days',   c: '#3a5a2a' },
    { title: 'Byomkesh Bakshi', yt: 'dpdo8t2F8cQ', show: 'Byomkesh Bakshi', c: '#1a1a22', dark: true }
  ],

  movies: [
    { title: 'Dilwale Dulhania Le Jayenge', short: 'Dilwale Dulhania…', sub: 'Song · YRF',       yt: 'cNV5hLSa9H8', c: '#2f55b8' },
    { title: 'Andaz Apna Apna',             sub: 'Trailer · Tips',   yt: 'ggGMb7oVEHc', c: '#8a3fe0' },
    { title: 'Hum Aapke Hain Koun..!',      sub: 'Part 1 of 17 · Rajshri', yt: 'KySzjuXUjcY', c: '#a0305a' },
    { title: 'Karan Arjun',                 sub: 'Song · Tips',      yt: 'OPHZKBRI5oc', c: '#2a2a3a' },
    { title: 'Border',                      sub: 'Song · Ishtar',    yt: 'YczkDMTaek4', c: '#3a4a2a' }
  ],

  ads: [
    { title: 'Hamara Bajaj',  sub: '1989 · DD ad',      yt: 'scltYH13uEY', c: '#2f55b8' },
    { title: 'Boost',         sub: 'Sachin Tendulkar',  yt: 'fA-ycugvzno', c: '#a0305a' },
    { title: 'Nirma',         sub: 'Washing powder',    yt: 'A28vF1aGjGY', c: '#2f8a8a' },
    { title: 'Lijjat Papad',  sub: 'TV ad',             yt: 'CFDkFq8yHEQ', c: '#c98a12' },
    { title: 'Cadbury',       sub: '1994 cricket ad',   yt: 'ZwrS0UkGrPw', c: '#5a1a7a' }
  ],

  // Only Rewind Runner is playable today (the arcade on index.html). The rest are marked "soon".
  games: [
    { title: 'Rewind Runner', sub: 'Play now', img: 'assets/games/pixel-runner.svg', href: 'index.html#arcade' },
    { title: 'Road Dash',     img: 'assets/games/road-dash.svg',   soon: true },
    { title: 'Snake ’97',     img: 'assets/games/snake.svg',       soon: true, dark: true },
    { title: 'Brick Smash',   img: 'assets/games/bricks.svg',      soon: true, dark: true },
    { title: 'Space Dodge',   img: 'assets/games/space-dodge.svg', soon: true, dark: true }
  ],

  songs: [
    { title: 'Dheere Dheere Se',  sub: 'Aashiqui (1990)',        credit: 'T-Series',  yt: 'KeyfUuXPOcY' },
    { title: 'Pehla Nasha',       sub: 'Jo Jeeta Wohi Sikandar', credit: 'Saregama',  yt: 'iSUK1QoK9-E' },
    { title: 'Chura Ke Dil Mera', sub: 'Main Khiladi Tu Anari',  credit: 'Ishtar Music', yt: 'Yqj1_V90KJo' }
  ],

  cricket: [
    { title: 'India vs Australia', sub: 'Sharjah Cup (1998)',   credit: 'Desert Storm highlights, community upload', yt: 'fZqa4OtUlGY' },
    { title: '1996 World Cup',     sub: 'India vs Pakistan QF', credit: 'Highlights, community upload',              yt: '5XBuSRKFM1k' }
  ],

  wwf: [
    { title: 'The Undertaker',  sub: 'vs Hulk Hogan, 1991', credit: 'WWE', yt: 'DHK2d6WFdk8', official: true },
    { title: 'The Rock',        sub: 'Funniest moments',    credit: 'WWE', yt: 'BwjACCd3k6k', official: true },
    { title: 'Stone Cold',      sub: 'His rise',            credit: 'WWE Vault', yt: 'SCHuOf12S4o', official: true }
  ],

  walls: [
    { src: 'assets/ui/cassette.svg',       alt: 'Cassette tape' },
    { src: 'assets/ui/scooter.svg',        alt: 'Scooter' },
    { src: 'assets/wallpapers/boombox.svg', alt: 'Boombox' },
    { src: 'assets/ui/rubik.svg',          alt: 'Puzzle cube' },
    { src: 'assets/wallpapers/can.svg',    alt: 'Soda can' },
    { src: 'assets/wallpapers/sneaker.svg', alt: 'Sneaker' }
  ],

  community: [
    { label: 'Forum – Discuss 90s topics', icon: 'c-forum',  href: '#community' },
    { label: 'Share Memories & Photos',    icon: 'c-share',  href: '#community' },
    { label: 'Polls & Quizzes',            icon: 'c-polls',  href: '#h-poll' },
    { label: '90s Trivia Challenge',       icon: 'c-trophy', href: '#h-trivia' }
  ],

  goodies: [
    { label: 'Live TV',          sub: '(Random Play)',    icon: 'g-live',   href: 'tv.html' },
    { label: 'TV Schedule',      sub: '(Your Playlists)', icon: 'g-sched',  href: 'tv.html#guide' },
    { label: 'Featured',         sub: 'This Week',        icon: 'g-star',   href: '#tv-shows' },
    { label: '90s Quiz',         sub: '& Trivia',         icon: 'g-quiz',   href: '#h-trivia' },
    { label: '90s Scrapbook',    sub: '(User Uploads)',   icon: 'g-book',   href: '#photos' },
    { label: 'Memory Lane',      sub: '(By Year)',        icon: 'g-rewind', href: 'tv.html' },
    { label: 'Nostalgia Store',  sub: '(Coming Soon)',    icon: 'g-gift',   href: '#', soon: true }
  ]
};

if (typeof window !== 'undefined') window.HOME = HOME;
