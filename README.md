# 90s REWIND — the90sindia.com

A static, no-build nostalgia hub for 90s India: Doordarshan classics,
Bollywood, cricket, WWF, an original arcade game and a Hit Parade jukebox —
all in one Y2K-styled kids'-portal page.

Plain HTML/CSS/JS. No npm, no build step, no framework. Upload the folder
as-is to any static host.

## File structure

```
index.html        Page structure / markup for every section
css/style.css      All styling (colors, fonts, layout, responsive rules)
js/config.js       ALL CONTENT LIVES HERE — the only file you should need to edit
js/app.js          Rendering logic + the arcade game. Reads from config.js.
tv.html            The live TV page (weekly timetable player)
css/tv.css         TV page styling
js/tv-episodes.js  Official episode lists, in episode order (Ramayan, Hum Paanch)
js/tv-library.js   Show library: one row per show (title, playlist OR video IDs, minutes) feeds CH 90
js/tv-config.js    THE TIMETABLE: channels (eras), weekly slots, episode IDs, ads
js/tv-engine.js    Schedule maths (no DOM). Do not edit.
js/tv.js           Player: YouTube embeds, commercial cards, guide
README.md          This file
```

## Adding content — edit only `js/config.js`

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

## Live TV (`tv.html`) — edit only `js/tv-config.js`

Each channel is one **era** (e.g. DD National 1987-88) with a fixed **weekly
timetable**, India time (IST), the same instant for every viewer. A slot looks
like:

```js
{ day: 'Sun', time: '09:00', duration: 60, title: 'Mahabharat',
  episodes: [ { video: 'OFFICIAL_YT_ID' }, { video: 'ANOTHER_ID' } ],
  confidence: 'verified', source: 'where the time came from' }
```

- `day`: `Sun`..`Sat`, an array, or `daily` / `weekdays` / `weekend`.
- `playlist`: easiest. Paste ONE official playlist ID (`playlist: 'PLxxxx'`)
  and the page fills the episodes itself, one per week, in playlist order.
- `startDate: 'YYYY-MM-DD'`: the week of this date plays `episodes[0]`, the next
  week `episodes[1]`, and so on, **in list order (Episode 1, 2, 3...)**, then loops.
- `epNums`: optional real episode numbers when the list skips some.
- `episodes`: official YouTube IDs only. Week 1 plays the first, week 2 the
  second, and so on (one episode a week, like the real thing). Empty = title card.
- If an episode ends before its slot, the rest fills with commercial cards.
- Between slots: commercial breaks (`TV_ADS`) or, on DD channels, a
  closedown test card at night.
- `confidence` shows a badge: `verified` (time found in a source), `recalled`
  (widely remembered, confirm it), `approx` (placeholder time).

**Already filled in (checked 5 Nov 2026, all embeddable, in episode order):**
- Ramayan Ep 1-78 (Tilak, official), Hum Paanch Ep 1-183 minus 6 non-public (Zee TV, official),
  Rangoli Ep 1-46 minus gaps (Doordarshan National, official), Cartoon Network India
  30-min cartoons (official).
- Shaktimaan Ep 1-235 minus 23 gaps (Ultra TV Series, community upload), KBC season 1 (3 clips)
  and one Chitrahaar episode (community uploads). Community uploads can be removed by the
  uploader at any time: re-check now and then.
- Shri Krishna (Ramanand Sagar) Ep 1-221 minus 129 and 217 (Tilak, official), CH 04 Sundays.
  The day and time are a placeholder: it is known to have run on DD Metro from 18 Jul 1993.
- The Jungle Book (Hindi dub), 23 of 52 episodes (Sync, community upload), CH 03 Sundays 10 am.
- Comedy Circus Ep 1-19 minus 3 (SET India, official), CH 07: launched 16 Jun 2007, Saturdays 9:30 pm.
- Not scheduled with video: Mahabharat (Hindi uploads all block embedding; only a Tamil dub is
  embeddable), Kyunki (no 2000-era episodes found). They show title cards.
- Every episode slot starts at Episode 1 on 8 Nov 2026, one new episode a week.

**Rewind Mix (CH 90)** runs 9 am to 11 pm every day: a fixed weekly grid built
automatically from `js/tv-library.js` (47 shows now). Every show is on air 3 or 4
times a week and each airing plays the NEXT episode, so nothing repeats until the
whole list has been shown. To add a show, add one row there, nothing else:

```js
// a YouTube playlist
{ title: 'Nukkad', playlist: 'PLxxxx', min: 24, official: false },
// or single videos, in episode order, with their real episode numbers
{ title: 'Fauji', min: 24, official: false,
  nums: '1 2 3 4 5', episodes: 'id1 id2 id3 id4 id5' },
```

Playlist rows were auto-found and spot-checked (embeddable); their order was not
checked episode by episode, so they show no "Episode N". Single-video rows were
checked one by one on 5 Nov 2026: embeddable, and the video title names the show
and the episode number (wrong shows such as the Pakistani "Dastaan" and the 2021
Wagle Ki Duniya remake were removed). Slots sit on a quarter-hour grid
(episode length + 3 minutes of break). Single-video shows now in the library:
Fauji (13), Buniyaad (42), Hum Log (52), Shrimaan Shrimati (62), Zee Horror Show (63),
Swabhimaan (21), Tipu Sultan (40), Ek Tha Rusty (24), Surabhi (16), Office Office (61),
Kabhi Yeh Kabhi Woh (27), Ulta Pulta (8), Idhar Udhar (20), Wagle Ki Duniya 1988 (11),
Dekh Bhai Dekh (6), The Jungle Book (23), Shri Krishna (219), Comedy Circus (18),
Kahani Comedy Circus Ki (29).

**New timetable slots from nostalgia blogs** (Nov 2026): Malgudi Days Sat 10 am,
Vikram Aur Betaal Sunday evening (6 pm is a placeholder), The Jungle Book Sundays
10 am from 1 Nov 1992.

**Commercials**: add your own clips to `TV_ADS` (`video` = official ID,
`duration` in seconds, must match the clip). They play in their own slots
between shows. Nothing is ever drawn over a YouTube video or its ads.

**Still unconfirmed** (not scheduled until a listing is found): Hum Log,
Buniyaad, Malgudi Days, Nukkad, Fauji, Surabhi, Dekh Bhai Dekh, Superhit
Muqabla, Byomkesh Bakshi, Saturday Suspense, Antakshari, Banegi Apni Baat,
Vikram Aur Betaal, Alif Laila, WWF, cricket. They all play in the Rewind Mix
(CH 90) when they have videos, just not at a fixed weekly time. Old newspaper
TV listings are the best source. CH 00 is a working demo using open-licence
Blender films; delete it when real content is in.

**Videos that cannot be embedded** (the owner switched embedding off, YouTube
answers 401 / "Video unavailable"): the whole "Dekh Bhai Dekh Official" channel
(Ep 1-62), SRK's Circus on Prasar Bharati Archives, and the Hindi Mahabharat
uploads. Only 6 full Dekh Bhai Dekh episodes (Ep 9-14, a community upload) can
be embedded. Test any video: `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=VIDEO_ID`
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

## The Arcade game

The Arcade section is an **original HTML5 `<canvas>` dodge-the-obstacle
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
   `css/`, `js/`, `README.md` — so that `index.html` sits directly in
   `public_html`, not nested inside another folder.
4. Visit your domain. That's it — no install, no dependencies, no database.

To update the live site later: edit `js/config.js` locally, then re-upload
just that one file.

## Browser support

Plain HTML5/CSS3/ES6 — works in all current major browsers. The arcade game
uses `requestAnimationFrame` and `<canvas>`, both universally supported.
