# 90s Rewind Arcade: audit and research (verified 6 Nov 2026)

## Phase A: project audit (nothing was changed)

- **Stack:** static HTML, CSS and vanilla JS. No framework, no build step, no backend, no API keys.
- **Existing Games section:** a row of 5 cards on `home.html` (Rewind Runner, Road Dash, Snake '97, Brick Smash, Space Dodge). Only Rewind Runner is playable (our own canvas game on `index.html#arcade`). The other four say "soon". The top nav "Games" tab points to `games.html`, which does not exist yet.
- **Reusable parts:** `js/site.js` (header, search drop-down, pop-up, cards), `js/catalogue.js` (search across everything), `css/home.css` (the whole look). The Arcade can reuse all of them.
- **Live TV boundary (frozen):** `tv.html`, `css/tv.css`, `js/tv.js`, `js/tv-shows.js`, `js/tv-schedule.js`, `js/tv-library.js`, `js/tv-engine.js`, `js/tv-config.js`, `js/tv-episodes.js`, `js/tv-mahabharat.js`, `js/tv-ads.js`. The Arcade will not edit any of them. The 1,270 timetable checks still pass.

## Phase B: how each source was tested

Opened in a real browser pane. For each I checked: does it load and show the game; who runs it; the page's own headers (`X-Frame-Options`, `Content-Security-Policy frame-ancestors`) to see whether it may be embedded; and the Terms of Use text for embedding and commercial use. I did NOT accept any site's terms on your behalf, so a game behind a terms gate was not played.

## Games with a verified official page (4, plus 2 bonus Capcom titles)

| Game | Source | Loads / plays | Embedding | Commercial | Mobile |
|---|---|---|---|---|---|
| **Tetris** | https://play.tetris.com/ (official, Tetris Holding; `tetris.com/play-tetris` redirects here) | Loads, shows the Tetris menu with a PLAY button. Starting a round could not be confirmed in my test browser (screen went black after PLAY). | **No.** Page sends no frame block, but the Terms say personal, non-commercial use only and forbid republishing or publicly displaying the material. No embed permission is granted. | **No** (Terms) | Game package is named "target-mobile"; not tested on a phone |
| **Pac-Man** (Google's 30th-anniversary Doodle) | https://www.google.com/logos/2010/pacman10-i.html | Loads and runs (maze, ghosts, score, sound icon) | **No.** `frame-ancestors` allows only Google's own domains. | Unknown | Not tested |
| **Space Invaders** (Taito's own 404 page) | https://www.taito.co.jp/Error/404 | Loads; aliens form "404", bunkers, player ship (canvas present). Not tested to a game over. | **No.** Taito pages send `X-Frame-Options: SAMEORIGIN`. | Unknown | Reported to work on mobile (press article); not tested |
| **Street Fighter II: The World Warrior** (Capcom Town, SNES version) | https://captown.capcom.com/en/classic_games/23 | Official game page exists with controls (keyboard, controller, on-screen controls). **Not played:** it needs the visitor to accept Capcom Town's Terms first, and I will not accept terms for you. | **No.** `X-Frame-Options: SAMEORIGIN`. | **No.** Terms prohibit commercial acts without Capcom's approval. | On-screen controls offered |
| *Bonus:* Super Street Fighter II: The New Challengers | https://captown.capcom.com/en/classic_games/31 | same as above | No | No | same |
| *Bonus:* Street Fighter Alpha 2 | https://captown.capcom.com/en/classic_games/41 | same as above | No | No | same |

Notes:
- Capcom Town's playable lineup **rotates monthly**. The November batch is stated as available until 1:00 PM JST, 1 December 2026. A game can disappear from the official page without warning.
- Pac-Man (Google) and Space Invaders (Taito) are rights-holder-approved or rights-holder-made versions, but they are not the original arcade code. Tetris here is the modern official game, not the 1984 or Game Boy original. Capcom's SF II is the SNES version.
- That Namco authorised Google's Pac-Man Doodle is widely reported but I did not read it from a primary source.

## Everything else: no authorised browser version found

"Found" only means my searches and page checks. Where I name a specific fact, it was read from the cited page.

| Game(s) | What I found | Final status |
|---|---|---|
| Road Rash, II, 3 | A fan-made browser port exists (GitHub `X-eyn/road_rash_browser`, and a Show HN demo). Its own README says it uses EA's original art, sprites and sounds extracted from the user's own copy, is "not affiliated with or endorsed by Electronic Arts", and asks people not to redistribute the extracted assets. No EA permission, so we cannot use it. | Coming soon |
| Super Mario Bros., Super Mario Bros. 3 | No Nintendo browser version found. The best-known HTML5 recreation (FullScreenMario) was closed after a Nintendo copyright complaint in 2013 (news reports). | Coming soon |
| Sonic 1 and 2, Streets of Rage, Golden Axe, Super Monaco GP, Super Hang-On, OutRun | Sega Forever was Android and iOS only and was delisted in September 2023 (Wikipedia). No Sega browser version found. | Coming soon |
| Prince of Persia | PrinceJS is a HTML5 reimplementation. Its page shows no licence, and says it uses assets from the MS-DOS version. Jordan Mechner published the Apple II source code, which is not a playable game. | Coming soon |
| Dangerous Dave, Dangerous Dave 2 | No authorised browser version found. | Coming soon |
| Pac-Man (original arcade), Galaga | Bandai Namco's official Pac-Man page offers consoles only, no browser game. | (Pac-Man: see Google Doodle above) Galaga: coming soon |
| Contra, Super Contra, TMNT, Circus Charlie, Road Fighter, ISS, Bomberman | No Konami (or Hudson) browser version found. | Coming soon |
| Excitebike, Donkey Kong | No Nintendo browser version found. | Coming soon |
| DuckTales, Double Dragon, Mortal Kombat, Battle City, Arkanoid, Aladdin, The Lion King, Tecmo Bowl, NBA Jam, Sensible Soccer, classic cricket games | No authorised browser version found. | Coming soon |

## The Internet Archive option (your decision)

The Internet Archive's MS-DOS library has playable in-browser copies of many titles on the list: Prince of Persia, Dangerous Dave (three games), Super Hang-On, OutRun, TMNT, Double Dragon, Pac-Man, Tetris, Space Invaders, Arkanoid, Bomberman, Sensible Soccer, Mortal Kombat, Street Fighter II, Contra, Aladdin, The Lion King, Galaga and Donkey Kong. It offers an embed feature.

I did NOT use it, because:
- Nothing shows the rights holders authorised these copies.
- The licence field on each item is typed by whoever uploaded it. For example, one item claims "public domain" and another "CC BY-ND" for a commercial game, which cannot be relied on.
- Your brief says not to assume abandonware is public domain.

If you want to use it, that is a legal-risk decision for you, not something I can verify. The catalogue is built so that adding it later is one data field per game.

## Ways to get more playable games without legal risk

1. More official Capcom Town titles (Ghosts 'n Goblins, 1942, Mega Man 2, Super Ghouls 'n Ghosts, Demon's Crest and others): official, free, rotating, link-out only.
2. Google's 2017 cricket Doodle for the cricket bucket (official; not a 90s game). Not yet tested.
3. Email the rights holders for embed permission, or look into licensing portals. This may cost money, so I will not do it without asking you.
