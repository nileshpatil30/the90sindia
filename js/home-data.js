/* ==========================================================================
   90s REWIND TV — HOMEPAGE-ONLY CONTENT (home.html)
   The video rows, tabs and ticker are NOT here any more: they come from the
   central content file js/content.js (through js/catalogue.js), so one edit shows
   up on the homepage, the category pages and in search.
   What stays here is only what belongs to the homepage panels: the poll, the
   trivia (both move to their own data files in Phase E), the photo strip,
   the sample discussions, the browse tiles, the wallpapers and the goodies strip.
   ========================================================================== */
var HOME = {

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
    { label: 'TV Shows', href: 'browse.html?cat=tv', icon: 'tv',       c1: '#d9a6ff', c2: '#b980f0' },
    { label: 'Movies',   href: 'browse.html?cat=movies', icon: 'movies',   c1: '#e8f67a', c2: '#c9e83c' },
    { label: 'Ads',      href: 'browse.html?cat=ads', icon: 'ads',      c1: '#ffc2a8', c2: '#ff9d7d' },
    { label: 'Games',    href: 'games.html', icon: 'games',    c1: '#8fe3ff', c2: '#52c8f2' },
    { label: 'Songs',    href: 'browse.html?cat=songs', icon: 'songs',    c1: '#ffb0ea', c2: '#ff86d8' },
    { label: 'Cricket',  href: 'browse.html?cat=cricket', icon: 'cricket',  c1: '#e2f27e', c2: '#bfe040' },
    { label: 'WWF',      href: 'browse.html?cat=wwf', icon: 'wwf',      c1: '#ffc2a8', c2: '#ff9d7d' },
    { label: 'Photos',   href: 'gallery.html', icon: 'photos',   c1: '#ffb0ea', c2: '#ff86d8' }
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
    { label: 'Forum – Discuss 90s topics', icon: 'c-forum',  href: 'community.html#forum' },
    { label: 'Share Memories & Photos',    icon: 'c-share',  href: 'community.html#memories' },
    { label: 'Polls & Quizzes',            icon: 'c-polls',  href: 'community.html#polls' },
    { label: '90s Trivia Challenge',       icon: 'c-trophy', href: 'community.html#trivia' }
  ],

  goodies: [
    { label: 'Live TV',          sub: '(Random Play)',    icon: 'g-live',   href: 'tv.html' },
    { label: 'TV Schedule',      sub: '(Your Playlists)', icon: 'g-sched',  href: 'tv.html#guide' },
    { label: 'Featured',         sub: 'This Week',        icon: 'g-star',   href: 'browse.html?featured=1' },
    { label: '90s Quiz',         sub: '& Trivia',         icon: 'g-quiz',   href: 'community.html#trivia' },
    { label: '90s Scrapbook',    sub: '(User Uploads)',   icon: 'g-book',   href: 'community.html#memories' },
    { label: 'Memory Lane',      sub: '(By Year)',        icon: 'g-rewind', href: 'browse.html?memory=1' },
    { label: 'Nostalgia Store',  sub: '(Coming Soon)',    icon: 'g-gift',   href: '#', soon: true }
  ]
};

if (typeof window !== 'undefined') window.HOME = HOME;
