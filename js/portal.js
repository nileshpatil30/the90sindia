/* ==========================================================================
   90s REWIND — PORTAL RENDERING LOGIC
   ==========================================================================
   Drives portal.html. Reads the SAME arrays as the main site (js/config.js),
   so adding a channel/show/track there updates both pages — you never edit
   this file to add content.
   ========================================================================== */

(function () {
  "use strict";

  /* Rotating swatch set used for every generated tile, so a given item keeps
     the same colour in the carousel, the cards and the bottom show strip. */
  const SWATCHES = [
    { bg: "#ee3d8f", fg: "#ffffff" },
    { bg: "#23b8d4", fg: "#08333c" },
    { bg: "#7a3ea8", fg: "#ffffff" },
    { bg: "#f47b20", fg: "#3a1600" },
    { bg: "#a9d425", fg: "#1d2a00" },
    { bg: "#ffcc00", fg: "#3a2c00" },
    { bg: "#a0329b", fg: "#ffffff" },
  ];

  function swatch(index) {
    return SWATCHES[index % SWATCHES.length];
  }

  /* Two-letter ident from a title — "DD RETRO" -> "DR", "Barood" -> "BA".
     Bare numbers and joining words are skipped so the initials land on the
     words a reader would actually say ("1983 World Cup Glory" -> "WC"). */
  const SKIP_WORDS = /^(a|an|the|of|on|in|at|to|and|or|for|from|with|vs)$/i;

  function monogram(title) {
    const words = String(title)
      .replace(/[^A-Za-z0-9\s]/g, " ")
      .trim()
      .split(/\s+/)
      .filter(function (w) { return w && !/^\d/.test(w) && !SKIP_WORDS.test(w); });

    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return String(title).slice(0, 2).toUpperCase();
  }

  function hasVideo(entry) {
    return Boolean((entry && entry.video) || (entry && entry.playlistId));
  }

  function buildEmbedUrl(entry, autoplay) {
    if (!hasVideo(entry)) return null;
    const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
    if (autoplay) params.set("autoplay", "1");
    if (entry.playlistId) {
      params.set("listType", "playlist");
      params.set("list", entry.playlistId);
      return "https://www.youtube.com/embed/videoseries?" + params.toString();
    }
    return "https://www.youtube.com/embed/" + entry.video + "?" + params.toString();
  }

  /* ------------------------------------------------------------------ */
  /* Stage (the big player panel)                                        */
  /* ------------------------------------------------------------------ */

  const stageFrame = document.getElementById("stage-frame");
  const stageEmpty = document.getElementById("stage-empty");

  function playEntry(entry, autoplay) {
    const url = buildEmbedUrl(entry, autoplay);
    if (!url) {
      stageFrame.removeAttribute("src");
      stageEmpty.classList.remove("hidden");
      return;
    }
    stageEmpty.classList.add("hidden");
    stageFrame.src = url;
  }

  /* ------------------------------------------------------------------ */
  /* Avatar carousel                                                     */
  /* ------------------------------------------------------------------ */

  const carouselItems = CHANNELS.concat(SHOWS);

  function buildCarousel() {
    const track = document.getElementById("carousel-track");
    if (!track) return;

    carouselItems.forEach(function (item, i) {
      const tone = swatch(i);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "avatar";
      btn.title = item.name || item.title;
      btn.setAttribute("aria-label", "Play " + (item.name || item.title));

      const face = document.createElement("span");
      face.className = "avatar-face";
      face.style.background = tone.bg;
      face.style.color = tone.fg;
      face.textContent = monogram(item.name || item.title);
      btn.appendChild(face);

      btn.addEventListener("click", function () {
        track.querySelectorAll(".avatar").forEach(function (el) {
          el.classList.remove("is-current");
        });
        btn.classList.add("is-current");
        playEntry(item, true);
      });

      track.appendChild(btn);
    });

    const first = track.querySelector(".avatar");
    if (first) first.classList.add("is-current");

    document.getElementById("carousel-prev").addEventListener("click", function () {
      track.scrollBy({ left: -192, behavior: "smooth" });
    });
    document.getElementById("carousel-next").addEventListener("click", function () {
      track.scrollBy({ left: 192, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Card grid                                                           */
  /* ------------------------------------------------------------------ */

  /* Cards are drawn from every content source so the grid mirrors the
     whole site, the way a portal front page always did. */
  function buildCardModel() {
    const cards = [];

    if (SHOWS[0]) {
      cards.push({
        section: "SHOWS", icon: "📺", more: "index.html#shows",
        title: SHOWS[0].title, blurb: SHOWS[0].desc, entry: SHOWS[0],
      });
    }
    if (CHANNELS[0]) {
      cards.push({
        section: "CHANNELS", icon: "📡", more: "index.html#channel-guide",
        title: CHANNELS[0].name, blurb: CHANNELS[0].desc, entry: CHANNELS[0],
      });
    }
    cards.push({
      section: "ARCADE", icon: "🕹️", more: "index.html#arcade",
      title: "Insert Coin — The Arcade",
      blurb: "Dodge the obstacles and set a hi-score. SPACE or tap to jump!",
      href: "index.html#arcade",
    });
    if (TRACKS[0]) {
      cards.push({
        section: "HIT PARADE", icon: "🎵", more: "index.html#hit-parade",
        title: TRACKS[0].title, blurb: "Spin it up now — " + TRACKS[0].artist + ".",
        entry: TRACKS[0],
      });
    }
    if (SHOWS[3]) {
      cards.push({
        section: "SHOWS", icon: "📺", more: "index.html#shows",
        title: SHOWS[3].title, blurb: SHOWS[3].desc, entry: SHOWS[3],
      });
    }
    SPORTS_CARDS.forEach(function (card) {
      cards.push({
        section: "VAULT", icon: card.label === "WWF" ? "🤼" : "🏏",
        more: "index.html#vault", title: card.title, blurb: card.note,
        href: "index.html#vault",
      });
    });
    cards.push({
      section: "PHOTOS", icon: "📸", more: "index.html#photo-wall",
      title: "Pins from the Photo Wall",
      blurb: "School photos, cricket cards and cassette covers from the community.",
      href: "index.html#photo-wall",
    });
    cards.push({
      section: "ADDA", icon: "💬", more: "index.html#adda",
      title: "Gupshup on the Message Boards",
      blurb: "Swap school-days stories with fellow 90s kids in the Adda.",
      href: "index.html#adda",
    });

    /* SHOWS and SPORTS_CARDS overlap (the 1997 cell match is in both), so
       keep the first card for a given title and drop the repeat. */
    const seen = Object.create(null);
    return cards.filter(function (c) {
      const key = c.title.toLowerCase();
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    }).slice(0, 8);
  }

  const CARDS = buildCardModel();

  function buildCards(filter) {
    const grid = document.getElementById("card-grid");
    if (!grid) return;

    const needle = (filter || "").trim().toLowerCase();
    const visible = needle
      ? CARDS.filter(function (c) {
          return (c.title + " " + c.blurb + " " + c.section).toLowerCase().indexOf(needle) > -1;
        })
      : CARDS;

    grid.innerHTML = "";

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.innerHTML =
        '<div class="card-bar"><b>SEARCH</b></div>' +
        '<div class="card-body"><div class="card-copy">' +
        '<p class="card-title">Nothing matched</p>' +
        '<p class="card-blurb">Try another word, or clear the box to see everything again.</p>' +
        "</div></div>";
      grid.appendChild(empty);
      return;
    }

    visible.forEach(function (card, i) {
      const tone = swatch(i);
      const cell = document.createElement("div");
      cell.className = "card";

      const bar = document.createElement("div");
      bar.className = "card-bar";
      const label = document.createElement("b");
      label.textContent = card.icon + " " + card.section;
      bar.appendChild(label);
      const more = document.createElement("a");
      more.href = card.more;
      more.textContent = "▶ more " + card.section;
      bar.appendChild(more);
      cell.appendChild(bar);

      const body = document.createElement(card.href ? "a" : "button");
      body.className = "card-body";
      if (card.href) {
        body.href = card.href;
      } else {
        body.type = "button";
      }

      const icon = document.createElement("span");
      icon.className = "card-icon";
      icon.style.background = tone.bg;
      icon.style.color = tone.fg;
      icon.textContent = monogram(card.title);
      body.appendChild(icon);

      const copy = document.createElement("span");
      copy.className = "card-copy";
      const title = document.createElement("span");
      title.className = "card-title";
      title.style.display = "block";
      title.textContent = card.title;
      const blurb = document.createElement("span");
      blurb.className = "card-blurb";
      blurb.style.display = "block";
      blurb.textContent = card.blurb;
      copy.appendChild(title);
      copy.appendChild(blurb);
      body.appendChild(copy);

      if (card.entry) {
        body.addEventListener("click", function () {
          playEntry(card.entry, true);
          document.getElementById("stage").scrollIntoView({ block: "center" });
        });
      }

      cell.appendChild(body);
      grid.appendChild(cell);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Bottom show strip                                                   */
  /* ------------------------------------------------------------------ */

  function buildShowStrip() {
    const row = document.getElementById("showstrip-row");
    if (!row) return;

    SHOWS.concat(CHANNELS).forEach(function (item, i) {
      const tone = swatch(i + 2);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "showstrip-tile";
      btn.title = item.title || item.name;
      btn.setAttribute("aria-label", "Play " + (item.title || item.name));

      const face = document.createElement("span");
      face.className = "showstrip-tile-face";
      face.style.background = tone.bg;
      face.style.color = tone.fg;
      face.textContent = monogram(item.title || item.name);
      btn.appendChild(face);

      btn.addEventListener("click", function () {
        playEntry(item, true);
        document.getElementById("stage").scrollIntoView({ block: "center" });
      });

      row.appendChild(btn);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Left rail — featured show, what's on next, promos                   */
  /* ------------------------------------------------------------------ */

  function buildRail() {
    const featured = CHANNELS[0];
    const next = SHOWS[1] || SHOWS[0];

    if (featured) {
      const name = document.getElementById("rail-featured-name");
      const blurb = document.getElementById("rail-featured-blurb");
      const thumb = document.getElementById("rail-featured-thumb");
      const tone = swatch(0);
      name.textContent = featured.name;
      blurb.textContent = "Channel " + featured.num + " — flip over and start watching.";
      thumb.style.background = tone.bg;
      thumb.style.color = tone.fg;
      thumb.textContent = monogram(featured.name);
      document.getElementById("rail-featured-go").addEventListener("click", function (ev) {
        ev.preventDefault();
        playEntry(featured, true);
      });
    }

    if (next) {
      document.getElementById("rail-next-title").textContent = next.title;
      document.getElementById("rail-next-meta").textContent = next.category + " • " + next.channel;
    }

    const promos = [
      { cap: "e-COLLECTIBLES", art: "PHOTO WALL", tone: swatch(2), href: "index.html#photo-wall" },
      { cap: "JUKEBOX", art: "HIT PARADE", tone: swatch(5), href: "index.html#hit-parade" },
    ];
    const holder = document.getElementById("rail-promos");
    promos.forEach(function (p) {
      const a = document.createElement("a");
      a.className = "promo";
      a.href = p.href;
      const art = document.createElement("span");
      art.className = "promo-art";
      art.style.background = p.tone.bg;
      art.style.color = p.tone.fg;
      art.textContent = p.art;
      const cap = document.createElement("span");
      cap.className = "promo-cap";
      cap.textContent = "▶ " + p.cap;
      a.appendChild(art);
      a.appendChild(cap);
      holder.appendChild(a);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Badge strip                                                         */
  /* ------------------------------------------------------------------ */

  function buildBadges() {
    const strip = document.getElementById("badge-strip");
    if (!strip) return;

    const badges = [
      { text: "PICK LIVE", href: "index.html#channel-guide", tone: swatch(3) },
      { text: "TEEN REWIND", href: "index.html#shows", tone: swatch(2) },
      { text: "LET'S PLAY", href: "index.html#arcade", tone: swatch(4) },
      { text: "THE VAULT", href: "index.html#vault", tone: swatch(1) },
    ];

    badges.forEach(function (b) {
      const a = document.createElement("a");
      a.className = "badge";
      a.href = b.href;
      a.style.background = b.tone.bg;
      a.style.color = b.tone.fg;
      a.textContent = b.text;
      strip.appendChild(a);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Search — filters the card grid in place                             */
  /* ------------------------------------------------------------------ */

  function wireSearch() {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    if (!form || !input) return;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      buildCards(input.value);
    });
    input.addEventListener("input", function () {
      if (!input.value.trim()) buildCards("");
    });
  }

  /* ------------------------------------------------------------------ */
  /* Login box — front-end only, mirrors the era's sign-in widget        */
  /* ------------------------------------------------------------------ */

  function wireLogin() {
    const form = document.getElementById("login-form");
    const note = document.getElementById("login-note");
    if (!form) return;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const nick = document.getElementById("login-nick").value.trim();
      note.textContent = nick
        ? "Welcome back, " + nick + "! Accounts aren't wired up yet — this is a demo sign-in."
        : "Enter a NickName first — accounts aren't wired up yet, this is a demo sign-in.";
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  function init() {
    buildCarousel();
    buildCards("");
    buildShowStrip();
    buildRail();
    buildBadges();
    wireSearch();
    wireLogin();

    document.getElementById("footer-year").textContent = new Date().getFullYear();

    const today = new Date();
    document.getElementById("login-date").textContent =
      today.getDate() + "/" + (today.getMonth() + 1);

    if (CHANNELS[0]) playEntry(CHANNELS[0], false);
  }

  document.addEventListener("DOMContentLoaded", init);
}());
