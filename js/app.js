/* ==========================================================================
   90s REWIND — RENDERING LOGIC
   ==========================================================================
   Reads the arrays/objects defined in js/config.js and builds the page.
   Nothing in here should need editing just to add content — change
   js/config.js instead.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Embed URL helpers                                                   */
  /* ------------------------------------------------------------------ */

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
  /* Hero console                                                        */
  /* ------------------------------------------------------------------ */

  const heroFrame = document.getElementById("hero-frame");
  const videoPlaceholder = document.getElementById("video-placeholder");
  const staticFlash = document.getElementById("static-flash");
  const heroNum = document.getElementById("hero-channel-num");
  const heroName = document.getElementById("hero-channel-name");
  const heroDesc = document.getElementById("hero-channel-desc");

  let currentChannelIndex = 0;
  let currentTrackIndex = null;

  function updateHeroInfo(num, name, desc) {
    heroNum.textContent = num || "";
    heroName.textContent = name || "";
    heroDesc.textContent = desc || "";
  }

  function flashAndLoad(entry, autoplay) {
    staticFlash.classList.add("active");
    window.setTimeout(function () {
      if (hasVideo(entry)) {
        heroFrame.src = buildEmbedUrl(entry, autoplay);
        heroFrame.classList.remove("hidden");
        videoPlaceholder.classList.add("hidden");
      } else {
        heroFrame.src = "";
        heroFrame.classList.add("hidden");
        videoPlaceholder.classList.remove("hidden");
      }
    }, 150);
    window.setTimeout(function () {
      staticFlash.classList.remove("active");
    }, 450);
  }

  function setActiveTab(index) {
    document.querySelectorAll(".channel-tab").forEach(function (tab, i) {
      tab.classList.toggle("active", i === index);
    });
  }

  function clearTrackHighlight() {
    document.querySelectorAll(".track-row").forEach(function (row) {
      row.classList.remove("playing");
    });
  }

  function switchToChannel(index, autoplay) {
    currentChannelIndex = index;
    currentTrackIndex = null;
    const ch = CHANNELS[index];
    flashAndLoad(ch, autoplay);
    updateHeroInfo(ch.num, ch.name, ch.desc);
    setActiveTab(index);
    clearTrackHighlight();
  }

  function playEntry(entry, num, name, desc) {
    flashAndLoad(entry, true);
    updateHeroInfo(num, name, desc);
    setActiveTab(-1);
  }

  function playTrack(index) {
    currentTrackIndex = index;
    const t = TRACKS[index];
    flashAndLoad(t, true);
    updateHeroInfo("♪", t.title, "by " + t.artist);
    setActiveTab(-1);
    document.querySelectorAll(".track-row").forEach(function (row, i) {
      row.classList.toggle("playing", i === index);
    });
  }

  function renderChannelTabs() {
    const wrap = document.getElementById("channel-tabs");
    wrap.innerHTML = "";
    CHANNELS.forEach(function (ch, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "channel-tab";
      btn.textContent = ch.num + " " + ch.name;
      btn.addEventListener("click", function () {
        switchToChannel(i, true);
      });
      wrap.appendChild(btn);
    });
  }

  document.getElementById("prev-btn").addEventListener("click", function () {
    const next = (currentChannelIndex - 1 + CHANNELS.length) % CHANNELS.length;
    switchToChannel(next, true);
  });
  document.getElementById("next-btn").addEventListener("click", function () {
    const next = (currentChannelIndex + 1) % CHANNELS.length;
    switchToChannel(next, true);
  });
  document.getElementById("play-btn").addEventListener("click", function () {
    const entry = currentTrackIndex !== null ? TRACKS[currentTrackIndex] : CHANNELS[currentChannelIndex];
    flashAndLoad(entry, true);
  });

  /* ------------------------------------------------------------------ */
  /* Channel Guide                                                       */
  /* ------------------------------------------------------------------ */

  function renderChannelGuide() {
    const grid = document.getElementById("channel-grid");
    grid.innerHTML = "";
    CHANNELS.forEach(function (ch, i) {
      const card = document.createElement("article");
      card.className = "channel-card";
      card.innerHTML =
        '<span class="channel-card-num">' + ch.num + '</span>' +
        '<h3>' + ch.name + '</h3>' +
        '<p>' + ch.desc + '</p>' +
        '<button type="button" class="btn-chunky btn-block">WATCH →</button>';
      card.querySelector("button").addEventListener("click", function () {
        switchToChannel(i, true);
        document.getElementById("hero").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      grid.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Today on 90s REWIND! (Shows)                                        */
  /* ------------------------------------------------------------------ */

  function renderShows() {
    const list = document.getElementById("shows-list");
    list.innerHTML = "";
    SHOWS.forEach(function (show) {
      const row = document.createElement("div");
      row.className = "show-row";
      row.innerHTML =
        '<span class="show-tag" style="--tag-color: var(--' + show.tagColor + ')">' + show.category + '</span>' +
        '<div class="show-body">' +
          '<h3>' + show.title + '</h3>' +
          '<p>' + show.desc + ' <span class="show-channel">— ' + show.channel + '</span></p>' +
        '</div>' +
        '<button type="button" class="btn-chunky btn-go">GO! &gt;&gt;</button>';
      row.querySelector("button").addEventListener("click", function () {
        playEntry(show, show.category, show.title, show.desc + " — " + show.channel);
        document.getElementById("hero").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      list.appendChild(row);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Hit Parade (Tracks)                                                 */
  /* ------------------------------------------------------------------ */

  function renderTracks() {
    const list = document.getElementById("track-list");
    list.innerHTML = "";
    TRACKS.forEach(function (t, i) {
      const row = document.createElement("li");
      row.className = "track-row";
      row.innerHTML =
        '<span class="track-index">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<span class="track-info"><strong>' + t.title + '</strong><small>' + t.artist + '</small></span>' +
        '<span class="track-play">▶</span>';
      row.addEventListener("click", function () {
        playTrack(i);
        document.getElementById("hero").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      list.appendChild(row);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Cricket & WWF Vault (Sports cards)                                  */
  /* ------------------------------------------------------------------ */

  function renderSportsCards() {
    const wrap = document.getElementById("sports-cards");
    wrap.innerHTML = "";
    SPORTS_CARDS.forEach(function (card) {
      const el = document.createElement("article");
      el.className = "sports-card";
      el.style.setProperty("--card-theme", "var(--" + card.theme + ")");
      el.innerHTML =
        '<span class="sports-card-label">' + card.label + '</span>' +
        '<h3>' + card.title + '</h3>' +
        '<p>' + card.note + '</p>';
      wrap.appendChild(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Photo Wall (placeholder masonry)                                    */
  /* ------------------------------------------------------------------ */

  function renderPhotoWall() {
    const grid = document.getElementById("photo-grid");
    grid.innerHTML = "";
    const colors = ["lime", "pink", "purple", "orange", "cyan", "yellow"];
    const sizes = ["short", "tall", "medium", "medium", "tall", "short", "medium", "tall", "short", "medium"];
    sizes.forEach(function (size, i) {
      const block = document.createElement("div");
      block.className = "photo-block photo-block--" + size;
      block.style.setProperty("--block-color", "var(--" + colors[i % colors.length] + ")");
      block.innerHTML = "<span>📌</span>";
      grid.appendChild(block);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Daily Poll (front-end only, tallied via localStorage)               */
  /* ------------------------------------------------------------------ */

  const POLL_VOTES_KEY = "rewind_poll_votes";
  const POLL_VOTED_KEY = "rewind_poll_voted";

  function getPollVotes() {
    try {
      return JSON.parse(window.localStorage.getItem(POLL_VOTES_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function renderPollResults() {
    const votes = getPollVotes();
    const total = Object.values(votes).reduce(function (a, b) { return a + b; }, 0) || 1;
    const resultEl = document.getElementById("poll-result");
    resultEl.innerHTML = POLL.options
      .map(function (opt) {
        const count = votes[opt] || 0;
        const pct = Math.round((count / total) * 100);
        return (
          '<div class="poll-bar-row">' +
            '<div class="poll-bar-label">' + opt + ' <strong>' + pct + '%</strong></div>' +
            '<div class="poll-bar-track"><div class="poll-bar-fill" style="width:' + pct + '%"></div></div>' +
          '</div>'
        );
      })
      .join("");
    resultEl.classList.remove("hidden");
    document.getElementById("poll-form").classList.add("hidden");
  }

  function renderPoll() {
    document.getElementById("poll-question").textContent = POLL.question;
    const optionsWrap = document.getElementById("poll-options");
    optionsWrap.innerHTML = POLL.options
      .map(function (opt, i) {
        const id = "poll-opt-" + i;
        return (
          '<label class="poll-option" for="' + id + '">' +
            '<input type="radio" name="poll" id="' + id + '" value="' + opt + '">' +
            '<span>' + opt + '</span>' +
          '</label>'
        );
      })
      .join("");

    if (window.localStorage.getItem(POLL_VOTED_KEY)) {
      renderPollResults();
      return;
    }

    document.getElementById("poll-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const selected = optionsWrap.querySelector('input[name="poll"]:checked');
      if (!selected) return;
      const votes = getPollVotes();
      votes[selected.value] = (votes[selected.value] || 0) + 1;
      window.localStorage.setItem(POLL_VOTES_KEY, JSON.stringify(votes));
      window.localStorage.setItem(POLL_VOTED_KEY, selected.value);
      renderPollResults();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Ticker                                                               */
  /* ------------------------------------------------------------------ */

  function renderTicker() {
    const track = document.getElementById("ticker-track");
    track.innerHTML =
      '<span class="ticker-copy">' + TICKER_TEXT + '</span>' +
      '<span class="ticker-copy" aria-hidden="true">' + TICKER_TEXT + '</span>';
  }

  /* ------------------------------------------------------------------ */
  /* Arcade — original HTML5 canvas dodge-the-obstacle runner            */
  /* ------------------------------------------------------------------ */

  function initArcade() {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("game-score");
    const hiScoreEl = document.getElementById("game-hiscore");
    const coinBtn = document.getElementById("coin-btn");

    const style = getComputedStyle(document.documentElement);
    const colors = {
      lime: style.getPropertyValue("--lime").trim(),
      pink: style.getPropertyValue("--pink").trim(),
      cyan: style.getPropertyValue("--cyan").trim(),
      orange: style.getPropertyValue("--orange").trim(),
      yellow: style.getPropertyValue("--yellow").trim(),
      ink: style.getPropertyValue("--ink").trim(),
    };

    const GROUND_Y = canvas.height - 36;
    const GRAVITY = 0.9;
    const JUMP_VELOCITY = -14;
    const HI_SCORE_KEY = "rewind_arcade_hiscore";

    let hiScore = Number(window.localStorage.getItem(HI_SCORE_KEY)) || 0;
    hiScoreEl.textContent = hiScore;

    let running = false;
    let player, obstacles, speed, score, frame, spawnTimer, rafId;

    function resetState() {
      player = { x: 50, y: GROUND_Y - 28, w: 28, h: 28, vy: 0, onGround: true };
      obstacles = [];
      speed = 6;
      score = 0;
      frame = 0;
      spawnTimer = 60;
    }

    function jump() {
      if (!running) {
        startGame();
        return;
      }
      if (player.onGround) {
        player.vy = JUMP_VELOCITY;
        player.onGround = false;
      }
    }

    function spawnObstacle() {
      const h = 24 + Math.random() * 26;
      obstacles.push({ x: canvas.width + 10, y: GROUND_Y - h, w: 20 + Math.random() * 12, h: h });
    }

    function drawBackground() {
      ctx.fillStyle = "#170a29";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < canvas.width; gx += 30) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, canvas.height);
        ctx.stroke();
      }
      ctx.strokeStyle = colors.cyan;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + player.h);
      ctx.lineTo(canvas.width, GROUND_Y + player.h);
      ctx.stroke();
    }

    function drawPlayer() {
      ctx.fillStyle = colors.lime;
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 3;
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.strokeRect(player.x, player.y, player.w, player.h);
    }

    function drawObstacles() {
      ctx.fillStyle = colors.pink;
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 3;
      obstacles.forEach(function (o) {
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeRect(o.x, o.y, o.w, o.h);
      });
    }

    function drawCenteredMessage(lines) {
      ctx.fillStyle = "rgba(10,10,10,0.72)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colors.yellow;
      ctx.textAlign = "center";
      ctx.font = "bold 22px 'Baloo 2', sans-serif";
      lines.forEach(function (line, i) {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 10 + i * 28);
      });
    }

    function collide(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function endGame() {
      running = false;
      cancelAnimationFrame(rafId);
      if (score > hiScore) {
        hiScore = score;
        window.localStorage.setItem(HI_SCORE_KEY, String(hiScore));
        hiScoreEl.textContent = hiScore;
      }
      drawBackground();
      drawObstacles();
      drawPlayer();
      drawCenteredMessage(["GAME OVER — SCORE " + score, "INSERT COIN TO TRY AGAIN"]);
      coinBtn.textContent = "🪙 INSERT COIN";
    }

    function tick() {
      frame++;
      spawnTimer--;
      if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = Math.max(35, 70 - Math.floor(speed * 3));
      }

      player.vy += GRAVITY;
      player.y += player.vy;
      if (player.y >= GROUND_Y - player.h) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.onGround = true;
      }

      obstacles.forEach(function (o) { o.x -= speed; });
      obstacles = obstacles.filter(function (o) { return o.x + o.w > -5; });

      for (const o of obstacles) {
        if (collide(player, o)) {
          endGame();
          return;
        }
      }

      if (frame % 6 === 0) {
        score += 1;
        scoreEl.textContent = score;
      }
      if (frame % 300 === 0) speed += 0.6;

      drawBackground();
      drawObstacles();
      drawPlayer();

      rafId = requestAnimationFrame(tick);
    }

    function startGame() {
      resetState();
      running = true;
      scoreEl.textContent = "0";
      coinBtn.textContent = "🪙 RESTART";
      rafId = requestAnimationFrame(tick);
    }

    resetState();
    drawBackground();
    drawPlayer();
    drawCenteredMessage(["90s REWIND ARCADE", "INSERT COIN TO PLAY"]);

    coinBtn.addEventListener("click", startGame);
    canvas.addEventListener("click", jump);
    canvas.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault();
        jump();
      },
      { passive: false }
    );
    window.addEventListener("keydown", function (e) {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                 */
  /* ------------------------------------------------------------------ */

  function init() {
    renderTicker();
    renderChannelTabs();
    renderChannelGuide();
    renderShows();
    renderTracks();
    renderSportsCards();
    renderPhotoWall();
    renderPoll();
    initArcade();

    switchToChannel(0, false);
    document.getElementById("footer-year").textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
