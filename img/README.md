# img/

Artwork for the portal tiles.

Drop a square-ish image here (around 200×200px, PNG or JPG), then point at it
from `js/config.js` with an `image` field on the entry:

```js
{
  num: "01",
  name: "DD RETRO",
  video: "Mg4h9Au7JpE",
  image: "img/dd-retro.png",
  desc: "…",
}
```

That single line fills every tile for that entry on `portal.html` — the avatar
carousel, the card icon, the sidebar thumbnail and the bottom show strip.

Entries with no `image` draw a generated two-letter monogram instead, and a
path that fails to load falls back to the monogram, so the page never breaks
on missing art.

## Use only artwork you can actually use

Your own photographs, artwork you commissioned or made, or images you hold a
licence for. Screenshots, promotional stills, channel logos and character art
belong to their rights holders — the same rule that applies to the video
embeds in `js/config.js`.
