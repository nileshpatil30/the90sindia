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

## Copyright rule — official sources only

**Every embedded video must come from an official rights-holder YouTube
channel. Never use fan reuploads, "clips" channels, or compilation
channels** — even when the content looks identical to the original. Fan
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
