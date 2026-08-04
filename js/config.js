/* ==========================================================================
   90s REWIND — CONTENT CONFIG
   ==========================================================================
   THIS IS THE ONLY FILE YOU SHOULD NEED TO EDIT TO ADD OR CHANGE CONTENT.
   Channels, shows, tracks, sports cards, the poll and the ticker text all
   live in the arrays/objects below. index.html, css/style.css and js/app.js
   read from this file and render the page automatically — you never need
   to touch HTML or CSS to add a new channel, show, song, or sports card.

   ------------------------------------------------------------------------
   HOW TO GET A YOUTUBE VIDEO ID
   ------------------------------------------------------------------------
   Open the video on YouTube. The URL looks like:

       https://www.youtube.com/watch?v=BvZ2KQuCTds
                                       ^^^^^^^^^^^
                                       this part is the video ID

   Or from a share link:

       https://youtu.be/BvZ2KQuCTds
                         ^^^^^^^^^^^
                         same ID, different URL shape

   Copy just that ID (no "v=", no extra "&" params after it) into a
   channel/show/track's `video` field below, as a plain string:
       video: "BvZ2KQuCTds"

   ------------------------------------------------------------------------
   HOW TO GET A YOUTUBE PLAYLIST ID
   ------------------------------------------------------------------------
   Open the playlist on YouTube. The URL looks like:

       https://www.youtube.com/playlist?list=PL0CaUqi81mPnxS08v67qqzJawvLRakSud
                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                              this part is the playlist ID

   Copy it into a channel's `playlistId` field instead of `video`:
       playlistId: "PL0CaUqi81mPnxS08v67qqzJawvLRakSud"

   A channel/show needs EITHER `video` OR `playlistId` — never both. If you
   leave both blank (video: "" and no playlistId), the site shows a friendly
   "add a video ID" placeholder instead of a broken embed. That's on purpose:
   it's safer than guessing an ID and shipping a dead/wrong embed.

   ------------------------------------------------------------------------
   COPYRIGHT RULE — READ BEFORE ADDING CONTENT
   ------------------------------------------------------------------------
   Only ever use video/playlist IDs from OFFICIAL rights-holder YouTube
   channels. Never use fan reuploads, compilation channels, or "clips"
   channels — even if the video looks identical. Fan reuploads get DMCA
   claimed/taken down without warning, which breaks your embed, and mixing
   them in is also what gets nostalgia/clip sites rejected from AdSense.

   Verified-official sources to pull from (see README.md for the full list
   and for how to double-check a channel before you trust it):
     - Shows/movies : DD National (Doordarshan), Shemaroo, Rajshri, Ultra
     - Cricket       : ICC, BCCI official channels
     - Wrestling     : WWE's official YouTube channel
     - Music         : official record label channels (T-Series, Saregama,
                        Tips Official, Zee Music, Venus, etc.)

   Before you paste an ID, open the video on YouTube and check the channel
   name matches one of the above — don't trust a search result's title
   alone. See README.md → "Verifying a channel is really official".
   ========================================================================== */


/* Scrolling ticker text in the black top bar. Keep each line short. */
const TICKER_TEXT =
  "📼 NOW STREAMING: 90s REWIND is LIVE!  •  🏏 Relive India's greatest World Cup moments in the Vault  •  " +
  "🎵 New tracks added to the Hit Parade jukebox  •  🕹️ High score in the Arcade — can you beat it?  •  " +
  "📺 Flip channels above to time-travel through 90s India  •  ";


/* ------------------------------------------------------------------------
   CHANNELS
   Each entry is one "channel" in the console + the Channel Guide grid.
   Fields:
     num             - channel number shown on its card (string or number)
     name            - channel name
     video           - YouTube VIDEO id (leave "" if using playlistId)
     playlistId      - YouTube PLAYLIST id (leave unset if using video)
     desc            - one or two sentences for the guide card
   ------------------------------------------------------------------------ */
const CHANNELS = [
  {
    num: "01",
    name: "DD RETRO",
    video: "Mg4h9Au7JpE", // Doordarshan National (official) — "Office Office Chali Mussaddi Ki Beti"
    desc: "Doordarshan's own channel, reviving classics like Office Office. Dig into their archive for more DD-era gems.",
  },
  {
    num: "02",
    name: "SHEMAROO CLASSICS",
    video: "74FQYh2j0cE", // Shemaroo Indian TV Classics (official) — "Waah Bhai Waah", Full Episode 200
    desc: "Hasya Kavi Sammelans, comedy specials and DD-era classics from Shemaroo's official Indian TV Classics channel.",
  },
  {
    num: "03",
    name: "RAJSHRI TALKIES",
    playlistId: "PL0CaUqi81mPnxS08v67qqzJawvLRakSud", // Rajshri's official "Hum Aapke Hain Koun" playlist
    desc: "Family blockbusters from the studio that gave us Hum Aapke Hain Koun — straight from Rajshri's own channel.",
  },
  {
    num: "04",
    name: "ULTRA BLOCKBUSTERS",
    video: "G9jk_mk-s7w", // Ultra Bollywood (official) — "Barood" (1998), full movie
    desc: "90s Bollywood masala, full movies, from Ultra's official film library.",
  },
  {
    num: "05",
    name: "WWF ARENA",
    video: "BvZ2KQuCTds", // WWE Vault (official) — Undertaker vs Shawn Michaels, Hell in a Cell, 1997
    desc: "Hulk Hogan, The Undertaker, Shawn Michaels — classic 90s slams from WWE's own channel.",
  },
  {
    num: "06",
    name: "HIT MUSIC",
    video: "1YddSDFIsk4", // Tips Official (official label channel) — 90s Bollywood hits
    desc: "Chartbusters and remixes, sourced only from official record label channels.",
  },
  {
    num: "07",
    name: "CRICKET CORNER",
    video: "KrAN51nZ1HM", // ICC (official) — Virat Kohli / India vs Pakistan highlight package
    desc: "Cricket highlights and India matches, official uploads straight from ICC's own channel.",
  },
];


/* ------------------------------------------------------------------------
   SHOWS — powers the "Today on 90s REWIND!" module.
   Fields:
     title           - show/movie/match title
     channel         - must match a `name` from CHANNELS (used for the tag)
     category        - short label shown in the colored tag (e.g. "SITCOM")
     tagColor        - one of: lime, pink, purple, orange, cyan, yellow
     desc            - one-line description
     video           - YouTube VIDEO id (leave "" if using playlistId)
     playlistId      - YouTube PLAYLIST id (leave unset if using video)
   ------------------------------------------------------------------------ */
const SHOWS = [
  {
    title: "Office Office: Chali Mussaddi Ki Beti",
    channel: "DD RETRO",
    category: "CLASSIC",
    tagColor: "lime",
    desc: "Musaddi Lal is back — Pankaj Kapur's classic babu battles the system all over again, straight from DD National.",
    video: "Mg4h9Au7JpE",
  },
  {
    title: "Waah Bhai Waah",
    channel: "SHEMAROO CLASSICS",
    category: "COMEDY",
    tagColor: "pink",
    desc: "A hasya kavi sammelan special — the kind of comic-poetry night that ruled Doordarshan Sundays.",
    video: "74FQYh2j0cE",
  },
  {
    title: "Hum Aapke Hain Koun",
    channel: "RAJSHRI TALKIES",
    category: "MOVIE",
    tagColor: "purple",
    desc: "Weddings, songs and Tuffy the dog — the family blockbuster that broke records.",
    playlistId: "PL0CaUqi81mPnxS08v67qqzJawvLRakSud",
  },
  {
    title: "Hell in a Cell, 1997",
    channel: "WWF ARENA",
    category: "WWF",
    tagColor: "orange",
    desc: "Undertaker vs Shawn Michaels — the match that invented a whole new kind of brutal.",
    video: "BvZ2KQuCTds",
  },
  {
    title: "90s Bollywood Hit Mix",
    channel: "HIT MUSIC",
    category: "MUSIC",
    tagColor: "cyan",
    desc: "Non-stop chartbusters to take you straight back to the golden decade.",
    video: "1YddSDFIsk4",
  },
  {
    title: "Barood",
    channel: "ULTRA BLOCKBUSTERS",
    category: "MOVIE",
    tagColor: "orange",
    desc: "Akshay Kumar and Raveena Tandon in a 1998 full-throttle actioner, straight from Ultra's own vault.",
    video: "G9jk_mk-s7w",
  },
  {
    title: "India vs Pakistan Thriller",
    channel: "CRICKET CORNER",
    category: "SPORTS",
    tagColor: "yellow",
    desc: "Kohli's heroics in front of a packed house — an official ICC highlight package. (Not 90s footage — swap in a verified World Cup 1983/'96 clip here once you find one; see README.)",
    video: "KrAN51nZ1HM",
  },
];


/* ------------------------------------------------------------------------
   TRACKS — powers the Hit Parade jukebox. Click a row to play it in the
   hero console. Fields: title, artist, video (YouTube VIDEO id).
   ------------------------------------------------------------------------ */
const TRACKS = [
  {
    title: "90s Bollywood Hit Mix",
    artist: "Tips Official (official label channel)",
    video: "1YddSDFIsk4",
  },
  {
    title: "Taare Hain Baraati",
    artist: "Virasat (1997) — Saregama Carvaan (official label channel)",
    video: "AJObEYtVGvA",
  },
  {
    title: "Add another track",
    artist: "T-Series / Saregama / Zee Music / Venus, etc.",
    video: "",
  },
  {
    title: "Add another track",
    artist: "See README.md → Adding a track",
    video: "",
  },
];


/* ------------------------------------------------------------------------
   SPORTS_CARDS — the two highlight cards in the Cricket & WWF Vault.
   Fields: title, label, note, theme (lime, pink, purple, orange, cyan, yellow)
   ------------------------------------------------------------------------ */
const SPORTS_CARDS = [
  {
    title: "1983 World Cup Glory",
    label: "CRICKET",
    note: "Kapil's Devils lifted India's first World Cup at Lord's — find the highlights on ICC's official channel.",
    theme: "cyan",
  },
  {
    title: "Hell in a Cell, 1997",
    label: "WWF",
    note: "The cell match that changed wrestling forever, from WWE's own Vault.",
    theme: "orange",
  },
];


/* ------------------------------------------------------------------------
   DAILY POLL — sidebar widget. This is a front-end-only demo poll (votes
   are just tallied in the visitor's own browser via localStorage, there's
   no shared backend). See README.md if you want to wire it to a real one.
   ------------------------------------------------------------------------ */
const POLL = {
  question: "Which channel do you flip to first?",
  options: ["DD RETRO", "WWF ARENA", "HIT MUSIC", "CRICKET CORNER"],
};


/* ------------------------------------------------------------------------
   PHOTO WALL — Pinterest board embed URL. Replace with your real board.
   Get it from: your Pinterest board → "..." menu → Copy link.
   See the HTML comment inside the #photo-wall section in index.html for
   the official Pinterest widget embed snippet to drop in once you have one.
   ------------------------------------------------------------------------ */
const PINTEREST_BOARD_URL = "https://www.pinterest.com/your-username/90s-india/";
