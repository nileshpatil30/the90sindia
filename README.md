# 90s REWIND — the90sindia.com

A static, no-build nostalgia hub for 90s India: Doordarshan classics,
Bollywood, cricket, WWF, an original arcade game and a Hit Parade jukebox —
all in one Y2K-styled kids'-portal page.

Plain HTML/CSS/JS. No npm, no build step, no framework. Upload the folder
as-is to any static host.

## Run it

No install, no build. From this folder:

```
python3 -m http.server 8123
```

then open one of these in a browser:

| URL | What it is |
|---|---|
| `http://localhost:8123/home.html` | **90s Rewind TV homepage** (the new portal, Phase 1) |
| `http://localhost:8123/tv.html` | Live TV: 11 networks, 1984 to 2007, weekly timetables, ALL SHOWS |
| `http://localhost:8123/index.html` | The original single-page site (unchanged) |

Needs internet only for YouTube (the TV player and card thumbnails). Fonts and
all artwork are local files in `assets/`, so the page loads nothing else from outside.

Tests (Node; the browser one needs Playwright):

```
node tests/schedule-test.js                      # 1270 checks on the timetable data, no browser
node tests/content-test.js                       # the content file, catalogue, search and add-content tool, no browser
node tests/tv-smoke.js                           # Live TV in a headless browser, YouTube stubbed
node tests/site-smoke.js                         # homepage shell: tabs, pop-up, picture zoom, search drop-down
node tests/arcade-test.js                        # the Arcade catalogue rules (all 40 games, honest statuses, no suspicious links), no browser
node tests/arcade-smoke.js                       # the Arcade in a headless browser: sections, search, every filter, game pages, embedded player
```

## File structure

```
home.html            Homepage (markup only; the rows are filled in from js/content.js via js/catalogue.js)
css/home.css         Homepage styling (desktop-first at 1440; breakpoints 1260 / 1100 / 760)
js/content.js        THE CONTENT FILE: categories, tabs, ticker and every video (see below)
js/catalogue.js      Merges content.js + the TV shows + games into one searchable catalogue
js/site.js           Shared shell: header, tabs, ticker, search drop-down, pop-up player, footer
js/tv-thumbs.js      Picture (first video id) for each playlist show
arcade.html          The 90s Rewind Arcade (sections, search, filters)
game.html            One reusable game page (play on our site / official site / coming soon)
css/arcade.css       Arcade and game page styling (after css/home.css)
js/arcade-data.js    THE ARCADE CATALOGUE: every game and what was checked (see "The Arcade" below)
js/arcade-ui.js      Game card, Recently Played (browser only), shared by both Arcade pages
js/arcade.js         Arcade page: sections, search, filters, address state
js/game.js           Game page: the three play modes, embedded player, "What we checked"
assets/arcade/       Neutral placeholder art for the game cards (our own, one per genre)
docs/arcade-research.md  The audit and the research behind each status
js/home-data.js      Homepage-only panels: poll, trivia, photo strip, discussions, tiles, goodies
tools/add-content.js Adds a video or playlist to content.js after checking it can be embedded
js/home.js           Homepage rows, poll, trivia, discussions tabs, login note
js/home-live.js      The homepage TV: real on-air show for the current moment, knobs, UP NEXT
assets/fonts/        Self-hosted fonts (woff2 + licences)
assets/ui/           Logo, CRT frame (crt.svg), tab and section icons (ui/icons), decor, mascot
assets/photos|wallpapers|games/   Original artwork for the gallery, wallpapers and the old prototype

tv.html              Live TV page
css/tv.css           TV page styling
js/tv-schedule.js    THE TIMETABLE: one row per show per network (years, day, time, confidence, source)
js/tv-library.js     Show library: one row per show (playlist OR single video IDs, real episode numbers)
js/tv-episodes.js    Long hand-checked episode lists (Ramayan, Hum Paanch, Shaktimaan, Rangoli, ...)
js/tv-mahabharat.js  Mahabharat episodes (Dailymotion IDs; 56 of 94 are embeddable)
js/tv-ads.js         Ad breaks, idents and continuity recordings, per network
js/tv-config.js      Builds every channel (network x year) from the files above. Rarely edited.
js/tv-engine.js      Schedule maths (no DOM, IST). Do not edit.
js/tv.js             Live TV player and guide
js/tv-shows.js       ALL SHOWS: on-demand player, filters, deep links
tests/               schedule-test.js, tv-smoke.js

index.html           The original page (css/style.css, js/config.js, js/app.js)
README.md            This file
```

## The homepage (`home.html`)

A dense 1999 to 2003 style portal: cream page, purple section headers, lime ticker
bar, orange CRT with ON AIR and UP NEXT, Browse tiles, and rows of cards. Plain
HTML, CSS and vanilla JS. Content is kept apart from presentation.

- **Edit content in `js/content.js`** (see "The content system" below): the video rows
  on the homepage, the tabs along the top and the What's New ticker all come from it.
  `js/home-data.js` now only holds what belongs to the homepage panels (poll, trivia,
  photo strip, sample discussions, Browse tiles, wallpapers, goodies strip).
- **The CRT** is a separate frame image (`assets/ui/crt.svg`) laid over a transparent
  screen opening, with the real YouTube player behind it. The top knob changes channel,
  the lower knob turns sound on (video starts muted because browsers block autoplay with
  sound). Nothing is ever drawn over the player. It runs the same IST timetable engine as
  Live TV and tunes to a channel that has a real show on air right now (or, late at night
  when nothing is, the channel that comes back soonest).
- **Cards open a popup player** (nocookie YouTube embed, or a large image). The TV pauses
  while it is open and resumes on close.
- **Links into Live TV and ALL SHOWS** use the URL hash: `tv.html#show=Malgudi Days`,
  `tv.html#kind=ads`, `tv.html#q=cricket`, `tv.html#guide`, `tv.html#all-shows`.
- **Look-only parts, labelled on the page:** login, Top Discussions and the chat preview are
  samples (no accounts, database or admin yet; that is a later phase). The poll and trivia
  work in the visitor's own browser.
- Movies play official clips (trailers, songs) from rights-holder channels; community
  uploads are labelled as such. Only Rewind Runner is playable from the Games row; the other
  game cards are marked "soon".
- The page follows the mockup, which is a light cream page. A deep-purple page background
  was also asked for; it is a small CSS variable change if you want it.

## The content system (`js/content.js`)

One file lists everything you can watch, apart from the TV timetable (which has its own
two files and is not touched by this). Add a line, reload: it appears on its category page,
in search, and on the homepage row if it has `featured: true`.

```js
{ cat: 'songs', title: 'Pehla Nasha', sub: 'Jo Jeeta Wohi Sikandar', credit: 'Saregama', official: true,
  yt: 'iSUK1QoK9-E', year: 1992, featured: true }
```

- **Categories:** `tv movies ads songs cricket wwf cartoons other`.
- **What it can open:** `yt` (one video), `playlist` (a whole playlist, YouTube plays the next
  video itself), `show` (a show from the TV library), `href` (a page), `img` (a picture).
- **Fields:** title, thumbnail (`thumb` = a video id; defaults to the video itself), video id,
  playlist id, category, description (`desc`), year, featured.
- **TV shows and cartoons** are not listed in content.js: they are the 163 shows of the ALL SHOWS
  player, picked up automatically. Entries with `show:` only choose which are featured.
- **`js/catalogue.js`** merges content.js, the TV shows and the games into one searchable list.
  Pages read that, never the data files directly.
- **`js/site.js`** is the shared shell: header, tabs, ticker, footer, search box with its drop-down,
  the pop-up player and the card builders. A page opts in with `<body data-page="...">`.

### Adding a video or playlist the easy way

```
node tools/add-content.js "https://www.youtube.com/watch?v=VIDEO_ID" --cat songs --write
node tools/add-content.js PLAYLIST_ID --cat tv --featured
```

It asks YouTube whether the video may be embedded (oEmbed), reads the title and channel, and
prints the line (or, with `--write`, inserts it in the right place in content.js). It refuses
videos that cannot be embedded. **No API key is needed.** If you want descriptions too, set
`YT_API_KEY` in your own terminal when you run it. The key is never put in the website.

If a video is taken down, the card still shows with a plain colour block, and YouTube's
own player shows its own "unavailable" message. Nothing breaks.

## The original page (`index.html`): add content in `js/config.js`

Every card, row and tab on the page is generated from arrays at the top of
[`js/config.js`](js/config.js). You never need to touch `index.html` or
`css/style.css` to add a channel, show, track, or sports card.

### Add a channel

Add an entry to the `CHANNELS` array:

```js
{
  num: "08",
  name: "MY NEW CHANNEL",
  video: "dQw4w9WgXcQ",   // YouTube video ID — see below
  desc: "One or two sentences describing this channel.",
}
```

Use `playlistId` instead of `video` if you want the console to play a whole
official playlist:

```js
{
  num: "09",
  name: "ANOTHER CHANNEL",
  playlistId: "PL0CaUqi81mPnxS08v67qqzJawvLRakSud",
  desc: "…",
}
```

It automatically appears in the Channel Guide grid and as a tab under the
hero console.

### Add a show (the "Today on 90s REWIND!" module)

Add an entry to the `SHOWS` array:

```js
{
  title: "Chandrakanta",
  channel: "DD RETRO",                // just a label, doesn't have to match CHANNELS exactly
  category: "CLASSIC",                // short word shown in the colored tag
  tagColor: "purple",                 // lime | pink | purple | orange | cyan | yellow
  desc: "One-line description of the show.",
  video: "VIDEO_ID_HERE",
}
```

### Add a track (Hit Parade jukebox)

Add an entry to the `TRACKS` array:

```js
{
  title: "Song title",
  artist: "Artist / official channel name",
  video: "VIDEO_ID_HERE",
}
```

### Add a sports card (Cricket & WWF Vault)

Add an entry to the `SPORTS_CARDS` array (the section is designed for two
cards side by side, but you can add more):

```js
{
  title: "Match / moment title",
  label: "CRICKET",                   // or "WWF"
  note: "One or two sentences of context.",
  theme: "cyan",                      // lime | pink | purple | orange | cyan | yellow
}
```

### Other editable bits in `js/config.js`

- `TICKER_TEXT` — the scrolling text in the black top bar.
- `POLL` — the sidebar Daily Poll question + options.
- `PINTEREST_BOARD_URL` — see "Photo Wall" below.

### If you leave a `video`/`playlistId` blank

The console shows a friendly "add a video ID" placeholder instead of a
broken embed. That's intentional — better than shipping a dead or wrong
video. Several entries ship this way on purpose (see the copyright section
below for why).

## Live TV (`tv.html`)

**11 networks, 1984 to 2007** (DD National, DD Metro, Zee TV, Home TV, Star Plus, Sony/SET, MTV India,
SAB, Cartoon Network, Star Sports, ESPN). Every network and year is its own channel, such
as "DD National 1992" or "Zee TV 1997", with a fixed weekly timetable in India time (IST),
the same instant for every viewer. Pick a network and a year in the guide; what is on air
now plays from the right episode, one new episode a week, with ad breaks between shows.

### The timetable: edit `js/tv-schedule.js`

One row per show per network:

```js
{ net: 'ddn', from: 1987, to: 1988, show: 'Ramayan', day: 'Sun', time: '09:30', dur: 40,
  conf: 'verified', src: 'where the time came from', eps: 'RAMAYAN' }
```

`day` is `Sun`..`Sat`, an array, or `daily` / `weekdays` / `weekend`. A show on two days
a week plays consecutive episodes. Every show starts at Episode 1 in the week of `TV_EPOCH`.

**Confidence tiers** (a badge on every slot in the guide):

| Tier | Meaning | Count now |
|---|---|---|
| `verified` | a source states the day AND the time | 9 |
| `recalled` | day and time are widely remembered, no printed source found | 11 |
| `approx` | the show really ran on this network in these years; the day or clock time is a placeholder, shown as `~` | 83 |

Old newspaper TV listings settle every `approx` at once: a phone photo of any week's
listing is enough to fix the slots. Sources are listed at the top of `js/tv-schedule.js`.

### Where the videos come from: `js/tv-library.js`

One row per show, two kinds:

```js
{ title: 'Nukkad', playlist: 'PLxxxx', min: 24, official: false, kind: 'drama' },   // a playlist
{ title: 'Fauji', min: 24, official: false, kind: 'drama',                          // single videos
  nums: '1 2 3 4 5', episodes: 'id1 id2 id3 id4 id5' },
```

`min` is the episode length in minutes, `official` is true only for the rights-holder's own
channel, `kind` is the filter chip in ALL SHOWS, `net` and `years` list a show in ALL SHOWS
before it has a timetable slot. `nums` are the real episode numbers, so skipped numbers stay
skipped on screen. A playlist's IDs are read lazily by a hidden YouTube player and cached in
the visitor's browser for 24 hours. Longer hand-checked lists live in `js/tv-episodes.js`.

### Ad breaks and idents: `js/tv-ads.js`

`TV_AD_PACKS` has one list per network: `{ title, sponsor, duration (seconds), video }`.
They are recordings of real 90s breaks and idents, and only ever play in OUR gaps between
shows, never over a show or over YouTube's own ads. A network with no pack shows a plain
"commercial break" card.

### ALL SHOWS (on demand)

Under the guide, every show we have (160 now), with filters by network and kind and a search
box. A click opens it on its own player; Live TV pauses until it is closed. Episodes can be
picked one by one. Ad recordings and idents are listed too.

### Dailymotion

Mahabharat (B.R. Chopra) has no official upload and the YouTube copies cannot be embedded, so
its episodes play from Dailymotion (`js/tv-mahabharat.js`): 56 of the 94 episodes, checked
with Dailymotion's own API. Missing numbers stay missing on screen.

### What is not finished

- Many Zee, Home TV and sports slots are `approx` (the `~` times).
- Community uploads can be removed by the uploader at any time: if a show says "cannot play",
  swap in another upload.
- Videos whose owner switched embedding off (YouTube answers 401 / "Video unavailable")
  cannot be used: the whole "Dekh Bhai Dekh Official" channel, SRK's Circus on Prasar Bharati
  Archives, and the Hindi Mahabharat uploads. Test any video:
  `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=VIDEO_ID`
  must answer 200, not 401.

## Getting a YouTube video ID or playlist ID

**Video ID** — from the URL after `watch?v=`, or after `youtu.be/`:

```
https://www.youtube.com/watch?v=BvZ2KQuCTds
                                ^^^^^^^^^^^ this is the video ID

https://youtu.be/BvZ2KQuCTds
                  ^^^^^^^^^^^ same ID
```

**Playlist ID** — from the URL after `list=`:

```
https://www.youtube.com/playlist?list=PL0CaUqi81mPnxS08v67qqzJawvLRakSud
                                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                       this is the playlist ID
```

Copy just that ID string (no `v=`, no `&` params) into `video` or
`playlistId` in `js/config.js`.

## Copyright rule — official sources first

**Prefer videos from the official rights-holder YouTube channel. Use a fan
reupload only when no official, embeddable copy exists** (agreed Nov 2026).
The TV page's source notes and the Rewind Mix label every community upload.
Never use "clips" channels or compilations — even when the content looks
identical to the original. Fan
reuploads get DMCA-claimed or taken down without warning, which silently
breaks your embed, and mixing them in is also what gets nostalgia/clip
sites rejected from AdSense.

Pull content only from:

| Content         | Official sources                                    |
|------------------|-------------------------------------------------------|
| TV shows / movies | DD National (Doordarshan), Shemaroo, Rajshri, Ultra  |
| Cricket           | ICC, BCCI official channels                          |
| Wrestling         | WWE's official YouTube channel                       |
| Music             | Official record label channels (T-Series, Saregama, Tips Official, Zee Music, Venus, etc.) |

### Verifying a channel is really official

Search results and video titles lie ("official," "HD," a label's name in
the title) far more often than you'd expect — reupload and compilation
channels routinely borrow official-sounding titles. Before you trust an ID:

1. Open the video **on youtube.com** (not just a search snippet) and check
   the channel name under the title, not just the video title.
2. Look for the verification checkmark next to the channel name, and check
   the channel's "About" page for a link to the studio/network/label's own
   website.
3. If in doubt, go to the rights holder's official site first and follow
   their own link to their YouTube channel, rather than searching YouTube
   directly.
4. When still unsure, leave the field blank (`video: ""`) rather than
   guessing — the site will show the "add a video ID" placeholder instead
   of risking a bad embed.

**The reliable trick: check a channel's own RSS feed.** Search results and
even a channel's `/videos` page are easy to get fooled by (reupload channels
borrow the real name, and video titles claim "official" freely). A channel's
own YouTube RSS feed only ever lists videos *that channel itself* uploaded —
there's no way for another channel's video to show up in it, so it's a much
stronger check than eyeballing a title:

```
https://www.youtube.com/feeds/videos.xml?channel_id=UCxxxxxxxxxxxxxxxxxxxxxx
```

or, for older `/user/name` style channels:

```
https://www.youtube.com/feeds/videos.xml?user=channelusername
```

1. Get the channel ID: open the channel's page → "..." / Share → Copy
   channel ID (or view page source and search for `"channelId"`).
2. Open the feed URL above in a browser — it's plain XML, readable without
   any tooling.
3. Every `<entry>` has a `<yt:videoId>` — those IDs are guaranteed to be
   genuine uploads from that exact channel. Pick one that fits and paste its
   ID into `js/config.js`.
4. Feeds only show a channel's ~15 most recent uploads, not its full
   back-catalog — so this is great for confirming a channel is legit, but
   won't necessarily surface an old specific episode. For that, browse the
   channel manually and cross-check the channel name once you find a
   candidate.

This is exactly how the video IDs already in `js/config.js` were sourced —
several channels this project wanted to use (DD National, Shemaroo, Ultra,
ICC) turned out, on the first search pass, to mostly return reupload or
unrelated channels. Their real RSS feeds are what turned up the entries that
actually ship in this repo.

## The Arcade (`arcade.html`, `game.html`)

The 90s Rewind Arcade lists 40 classic games and says honestly where each can be played.
It hosts no game files: no ROMs, BIOS files, clones or remakes, and no links to ROM sites.

**Three play modes** (the `status` of a game in `js/arcade-data.js`):

| status | what the visitor sees | needs |
|---|---|---|
| `website` | the game inside our game page (lazy-loaded, sandboxed iframe, Fullscreen, Restart) | an https `embedUrl` AND the owner's explicit embedding permission, with evidence in `embedding` |
| `official` | a Play Now button that opens the owner's own page in a new tab, with the source named | an https `sourceUrl` on a verified host |
| `soon` | "Coming soon". No Play button, no link | nothing |

Today 4 games are `official` (Tetris, Pac-Man via Google's Doodle, Space Invaders via Taito, Street Fighter II via Capcom Town),
none is `website`, and 36 are `soon`. The research is in `docs/arcade-research.md`.

**Add a game:** add one object to `ARCADE_RAW` in `js/arcade-data.js` (copy a neighbour). Only the fields that differ from the
"Coming soon" defaults are needed. Nothing else changes: the cards, search, filters, game page and homepage row all read that file.

**Move a game to a better status:** verify it first (open the page, read its Terms, read its `X-Frame-Options` and
`frame-ancestors` headers), then fill `sourceUrl`/`embedUrl`, the four permission fields, `notes` and `verified`.
`tests/arcade-test.js` refuses an `official` or `website` game whose host is not in its `VERIFIED_HOSTS` list: add the host
there as part of the same change, so the check is a deliberate step. It also refuses a Coming Soon game that has any link.

The four permissions are kept apart on every game page: **A** software licence, **B** game content rights,
**C** embedding permission, **D** commercial use. One does not imply another. "Unknown" means "could not confirm", not "allowed".

Thumbnails are our own neutral art (`assets/arcade/`, one per genre), not publisher artwork, because we hold no artwork rights.
Recently Played is kept in this browser's `localStorage` only. "Popular Games" is an editorial list (`popular` rank), not visit counts.

## The old prototype's game (`index.html`)

The old prototype page has an **original HTML5 `<canvas>` dodge-the-obstacle
runner**, written from scratch in `js/app.js` (see `initArcade()`). It uses
no game assets, ROMs, or emulator — just canvas shapes — so it carries zero
third-party IP risk. Deliberately, this project does **not** build or embed
any ROM/emulator-based games.

## Photo Wall

The Photo Wall currently renders color-block placeholders (see
`renderPhotoWall()` in `js/app.js`). To go live with a real Pinterest board:

1. In Pinterest, open your board → **"..."** menu → **Embed** → **Board
   widget** → copy the snippet it gives you.
2. In `index.html`, find the `#photo-wall` section — there's an HTML
   comment there with the exact snippet shape and where to put it.
3. Update `PINTEREST_BOARD_URL` in `js/config.js` to your real board URL.

## The Daily Poll

The sidebar poll is a **front-end-only demo** — votes are tallied in each
visitor's own browser via `localStorage`, so counts aren't shared between
visitors. To make it a real, shared poll, swap `renderPoll()`/`renderPollResults()`
in `js/app.js` for calls to a small backend or a service like Formspree /
a Google Form embed / a simple serverless function that stores counts.

## Adda (chat)

The Adda section is a placeholder card explaining how to wire in a real
chat, with no custom backend required:

- **Discord**: create a server, then Server Settings → Widget → enable it
  and copy the given `<iframe src="https://discord.com/widget?id=...">`.
- **Disqus**: create a site at disqus.com and paste their universal embed
  `<script>` snippet.

Swap the `.adda-card` in the `#adda` section of `index.html` for whichever
you pick.

## Deploying to Hostinger (or any static host)

No build step — just upload the files:

1. Log in to Hostinger → **File Manager** (or connect via FTP/SFTP).
2. Open **`public_html`** (or the subfolder for your domain, if this site
   lives on a subdomain/addon domain).
3. Upload everything **inside** the `the90sindia` folder — `index.html`,
   `home.html`, `tv.html`, `css/`, `js/`, `assets/` — so that `index.html` sits
   directly in `public_html`, not nested inside another folder.
4. Visit your domain. That's it — no install, no dependencies, no database.

To update the live site later: edit the data file you changed (`js/config.js`,
`js/home-data.js`, `js/tv-schedule.js` ...) locally, then re-upload just that file.

## Browser support

Plain HTML5/CSS3/ES6 — works in all current major browsers. The arcade game
uses `requestAnimationFrame` and `<canvas>`, both universally supported.
