# 90s REWIND — WordPress theme

The same site as the static version, with the content moved into wp-admin so
you can add a channel or a show from a browser instead of editing a file and
pushing to git.

## What changed and what didn't

The **look and behaviour did not change**. The stylesheets are byte-identical
copies, `assets/js/app.js` is unchanged, and `assets/js/portal.js` differs by a
single line (a home-URL base so one file serves both the static site and
WordPress).

What changed is where the content comes from. `js/config.js` used to hold every
channel, show, track and vault card. Now WordPress holds them, and
`inc/config.php` prints the exact same JavaScript globals the scripts already
read (`CHANNELS`, `SHOWS`, `TRACKS`, `SPORTS_CARDS`, `POLL`, `TICKER_TEXT`).
The rendering layer never knew the difference.

```
js/config.js  ──►  Channels / Shows / Hit Parade / Vault  (wp-admin)
                              │
                   inc/config.php builds the same globals
                              │
                   assets/js/app.js + portal.js render them
```

## Install

1. Zip the theme folder:
   ```
   cd wordpress && zip -r the90sindia-theme.zip the90sindia
   ```
2. In wp-admin: **Appearance → Themes → Add New → Upload Theme**, choose the
   zip, then **Activate**.
3. An admin notice appears offering to import the starter content. Or go to
   **Tools → 90s REWIND import** and press the button. This creates the seven
   channels, seven shows, two tracks and two vault cards the static site
   shipped with, so you start from real content.
4. **Settings → Reading → Your homepage displays → A static page.** Create a
   page (call it Home) and set it as the homepage. The theme's `front-page.php`
   takes over automatically.
5. For the portal layout: create a second page (call it Portal), and under
   **Page Attributes → Template** pick **90s REWIND Portal**.

Requires WordPress 6.0+ and PHP 7.4+. No plugins needed.

## Where everything is edited

| What | Where in wp-admin |
|---|---|
| Channels | **Channels** |
| Shows in "Today on 90s REWIND" | **Shows** |
| Jukebox tracks | **Hit Parade** |
| Cricket & WWF vault cards | **Vault** |
| Ticker text, poll question and options, Pinterest board | **Appearance → Customize → 90s REWIND** |
| Tile artwork | The **Featured image** on any of the above |
| Running order | The **Order** field under Page Attributes — drag-sortable |

### Adding a show

**Shows → Add New.** Title is the show name, the body is the one-line blurb on
the card, and the Details box takes the channel, the category tag, its colour
and the video.

You can paste a **whole YouTube URL** into the video field — a watch link, a
`youtu.be` share link or an embed URL all work. It is reduced to the bare ID on
save. The same applies to playlist URLs. A value that isn't a YouTube link is
rejected rather than saved as a broken embed.

Use a video ID **or** a playlist ID, never both.

### Tile artwork

Set a **Featured image** and it fills every tile for that item at once — the
avatar carousel, the card icon, the sidebar thumbnail and the bottom show
strip. Without one, the tile draws a generated two-letter monogram, and an
image that fails to load falls back to the monogram too, so a missing file
never leaves a blank square.

Use only artwork you own or hold a licence for — the same rule as the video
embeds.

## Two pages, one content set

Both templates read the same content. Adding a channel updates the hub and the
portal together; there is no second place to edit.

## What this theme deliberately does not do

- **The poll is still front-end only.** Votes are tallied in the visitor's own
  browser via `localStorage`, exactly as before — there is no shared backend, so
  the count is per-visitor, not site-wide. Making it a real poll means storing
  votes server-side; that is a small addition, not something this conversion
  silently did.
- **The Adda is still a placeholder.** Wire up a comments plugin or a Discord
  widget when you want it live.
- **No caching or SEO plugin assumptions.** The theme is plain WordPress and
  works with whatever you add.

## Testing status

The PHP was syntax-checked on PHP 8.4 and the pure logic (YouTube URL parsing,
the config-bridge output) is covered by the checks described below, which pass.
Both templates were rendered in a browser against a WordPress-shaped payload —
including featured images, a playlist channel and a deliberately broken image
path — and produce the same output as the static site with no console errors.

**It has not been run against a live WordPress install**, because this build
environment has no MySQL. Install it on a staging site before pointing a domain
at it.
