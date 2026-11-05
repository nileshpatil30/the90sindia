/* ==========================================================================
   90s REWIND TV — THE ARCADE CATALOGUE  (the one file to edit to add a game)
   ----------------------------------------------------------------------
   Only ACTUAL ORIGINAL classic games, played where their rights holder lets people play them.
   No clones, no remakes, no ROMs, no BIOS files, no copied game files, no ROM-site links.
   The pages (arcade.html, game.html) read this file and nothing else, so adding a game is one
   new entry in ARCADE_GAMES below. Nothing else needs changing.

   THREE PLAY MODES (the 'status' field)
     'website'  PLAY ON OUR WEBSITE   needs a real embedUrl AND embedding explicitly permitted by the rights holder.
     'official' PLAY ON OFFICIAL SITE a Play Now button opens the rights holder's own page in a new tab (sourceUrl).
     'soon'     COMING SOON           no authorised, working version found. No Play button, no substitute, no link-out.

   FIELDS
     id, title, year, yearLabel (optional text shown instead of the year), publisher, platform (ORIGINAL platform),
     genre (racing | platform | action | arcade | puzzle | sports), description, thumb, status,
     sourceName, sourceUrl, embedUrl (only if embedding is authorised), repoUrl (project repository, if any),
     licence (A: software licence), contentRights (B: who owns the game, art and music, and whether we may use them),
     embedding (C: embedding permission; start the text with "Permitted" only when the owner has said so, and name the evidence),
     commercialUse (D: commercial-use permission),
     aspect (optional, e.g. '4 / 3': the game screen shape, for games with status 'website'),
     rom (does it need a ROM or proprietary file?), mobile, controls, notes (what was checked),
     verified (date last checked), featured (1.. = order in Featured Classics), popular (1.. = order in Popular Games)

   FOUR PERMISSIONS ARE KEPT SEPARATE: software licence, game content rights, embedding permission,
   commercial-use permission. One does not imply the others. "Unknown" means we could not confirm it.

   NOTE ON FACTS: titles, years, publishers and platforms are the original release details from general
   knowledge, for orientation. The playability and permission fields are the ones that were checked, on
   the date in 'verified'. Thumbnails are our own neutral placeholder art (assets/arcade/), never
   publisher artwork, because we do not hold artwork rights.
   ========================================================================== */
var ARCADE_VERIFIED = '2026-11-06';

var ARCADE_GENRES = [
  { id: 'racing',   label: 'Racing',            section: 'Racing Legends',        thumb: 'assets/arcade/racing.svg',   c: '#f46a0c' },
  { id: 'platform', label: 'Platform',          section: 'Mario & Platform Games', thumb: 'assets/arcade/platform.svg', c: '#2f55b8' },
  { id: 'action',   label: 'Action & Fighting', section: 'Action & Fighting',     thumb: 'assets/arcade/action.svg',   c: '#7a2bd0' },
  { id: 'arcade',   label: 'Arcade',            section: 'Arcade Classics',       thumb: 'assets/arcade/arcade.svg',   c: '#4f1493' },
  { id: 'puzzle',   label: 'Puzzle',            section: 'Puzzle Games',          thumb: 'assets/arcade/puzzle.svg',   c: '#2f8a8a' },
  { id: 'sports',   label: 'Sports & Cricket',  section: 'Sports & Cricket',      thumb: 'assets/arcade/sports.svg',   c: '#2f8a2a' }
];

var ARCADE_STATUS = {
  website:  { label: 'Play on our site',      short: 'PLAY ON SITE',  filter: 'Playable Now' },
  official: { label: 'Play on official site', short: 'OFFICIAL SITE', filter: 'External Play' },
  soon:     { label: 'Coming soon',           short: 'COMING SOON',   filter: 'Coming Soon' }
};

/* What a "Coming soon" entry gets unless it says otherwise. */
var ARCADE_SOON = {
  status: 'soon', sourceName: '', sourceUrl: '', embedUrl: '', repoUrl: '',
  licence: 'Unknown (no authorised version found)', contentRights: 'Unknown: no authorised source found', commercialUse: 'Unknown', embedding: 'None (no authorised source)',
  rom: 'Not applicable: nothing is hosted here', mobile: 'Unknown', controls: '', verified: ARCADE_VERIFIED,
  notes: 'No authorised browser version found when searched on ' + ARCADE_VERIFIED + '. That is the result of a search, not a legal opinion. Unofficial copies exist elsewhere on the web; we do not link to them.'
};
var N_SEGA = 'Sega’s own mobile releases (Sega Forever) were Android and iOS only and were delisted in September 2023. No Sega browser version found on ' + ARCADE_VERIFIED + '.';
var N_ROADRASH = 'A fan-made browser port exists, but its own README says it uses Electronic Arts’ original art and sounds taken from the user’s own copy and is not endorsed by EA. No EA permission, so it is not used here.';
var N_MARIO = 'No Nintendo browser version found on ' + ARCADE_VERIFIED + '. The best-known HTML5 recreation of the first game was closed after a Nintendo copyright complaint in 2013 (news reports).';
var N_OFFICIAL = 'Official page of the rights holder (or its authorised partner). Opens on their site in a new tab: they do not permit embedding, so the game cannot be played inside 90s Rewind TV.';

var ARCADE_RAW = [
  /* ---------------------------------------------------------------- RACING */
  { id: 'road-rash', title: 'Road Rash', year: 1991, publisher: 'Electronic Arts', platform: 'Sega Genesis / Mega Drive', genre: 'racing', featured: 5, popular: 6,
    description: 'Race motorbikes down the highway, punching and kicking rival riders (and dodging the police) on the way to the finish.', notes: N_ROADRASH },
  { id: 'road-rash-2', title: 'Road Rash II', year: 1992, publisher: 'Electronic Arts', platform: 'Sega Genesis / Mega Drive', genre: 'racing',
    description: 'The bigger, faster follow-up: new tracks, tougher rivals and more ways to knock them off their bikes.', notes: N_ROADRASH },
  { id: 'road-rash-3', title: 'Road Rash 3', year: 1995, publisher: 'Electronic Arts', platform: 'Sega Genesis / Mega Drive', genre: 'racing',
    description: 'The third race-and-brawl outing, with new countries, new bikes and a bigger set of weapons.', notes: N_ROADRASH },
  { id: 'super-hang-on', title: 'Super Hang-On', year: 1987, publisher: 'Sega', platform: 'Arcade', genre: 'racing',
    description: 'Sega’s superbike racer: lean into the corners and race the clock around the world.', notes: N_SEGA },
  { id: 'excitebike', title: 'Excitebike', year: 1984, publisher: 'Nintendo', platform: 'NES / Famicom', genre: 'racing',
    description: 'Motocross on a side-on track: jump the ramps, watch the engine heat and beat the clock.', notes: 'No Nintendo browser version found on ' + ARCADE_VERIFIED + '.' },
  { id: 'outrun', title: 'OutRun', year: 1986, publisher: 'Sega', platform: 'Arcade', genre: 'racing',
    description: 'Drive a red convertible along the coast, pick your route at each fork and beat the timer.', notes: N_SEGA },
  { id: 'super-monaco-gp', title: 'Super Monaco GP', year: 1989, publisher: 'Sega', platform: 'Arcade', genre: 'racing',
    description: 'Formula One racing: qualify, race and climb the grid.', notes: N_SEGA },
  { id: 'road-fighter', title: 'Road Fighter', year: 1984, publisher: 'Konami', platform: 'Arcade', genre: 'racing',
    description: 'A top-down racer: weave through the traffic and keep an eye on the fuel gauge.' },

  /* ---------------------------------------------------------------- PLATFORM */
  { id: 'super-mario-bros', title: 'Super Mario Bros.', year: 1985, publisher: 'Nintendo', platform: 'NES / Famicom', genre: 'platform', featured: 6, popular: 2,
    description: 'The platformer that defined the genre: run, jump and stomp your way through the Mushroom Kingdom.', notes: N_MARIO },
  { id: 'super-mario-bros-3', title: 'Super Mario Bros. 3', year: 1988, publisher: 'Nintendo', platform: 'NES / Famicom', genre: 'platform',
    description: 'Bigger worlds, power-up suits and a map to explore: many fans’ favourite 8-bit Mario.', notes: N_MARIO },
  { id: 'sonic-the-hedgehog', title: 'Sonic the Hedgehog', year: 1991, publisher: 'Sega', platform: 'Sega Genesis / Mega Drive', genre: 'platform', featured: 7, popular: 4,
    description: 'Speed through loops and springs collecting rings in Sega’s answer to Mario.', notes: N_SEGA },
  { id: 'sonic-the-hedgehog-2', title: 'Sonic the Hedgehog 2', year: 1992, publisher: 'Sega', platform: 'Sega Genesis / Mega Drive', genre: 'platform',
    description: 'Sonic is joined by Tails, with new zones and the spin dash.', notes: N_SEGA },
  { id: 'aladdin', title: 'Aladdin', year: 1993, publisher: 'Virgin Interactive', platform: 'Sega Genesis / Mega Drive', genre: 'platform',
    description: 'Slash, jump and swing through Agrabah in the platformer based on Disney’s film.' },
  { id: 'the-lion-king', title: 'The Lion King', year: 1994, publisher: 'Virgin Interactive', platform: 'Sega Genesis / Mega Drive', genre: 'platform',
    description: 'Play Simba from cub to king in the platformer based on Disney’s film.' },
  { id: 'prince-of-persia', title: 'Prince of Persia', year: 1989, publisher: 'Brøderbund', platform: 'Apple II', genre: 'platform',
    description: 'A cinematic, hand-animated platformer: escape the dungeon and save the princess within the hour.',
    notes: 'A fan HTML5 reimplementation (PrinceJS) exists, but its page shows no licence and it uses assets from the MS-DOS version. Jordan Mechner published the Apple II source code, which is not a playable game. Nothing authorised found on ' + ARCADE_VERIFIED + '.' },
  { id: 'dangerous-dave', title: 'Dangerous Dave', year: 1988, publisher: 'Softdisk', platform: 'MS-DOS PC', genre: 'platform',
    description: 'John Romero’s early DOS platformer: grab the trophy, find the key, reach the door.' },
  { id: 'dangerous-dave-2', title: 'Dangerous Dave 2', year: 1991, publisher: 'Softdisk (Gamer’s Edge)', platform: 'MS-DOS PC', genre: 'platform',
    description: 'Dave returns in the Haunted Mansion, with a jetpack and a shotgun.' },
  { id: 'ducktales', title: 'DuckTales', year: 1989, publisher: 'Capcom', platform: 'NES / Famicom', genre: 'platform',
    description: 'Scrooge McDuck pogo-hops across the world hunting treasure in this NES hit.' },

  /* ---------------------------------------------------------------- ACTION & FIGHTING */
  { id: 'contra', title: 'Contra', year: 1987, publisher: 'Konami', platform: 'Arcade', genre: 'action', featured: 8, popular: 7,
    description: 'Two-player run-and-gun: grab the spread gun and fight through the alien base.' },
  { id: 'super-contra', title: 'Super Contra', year: 1988, publisher: 'Konami', platform: 'Arcade', genre: 'action',
    description: 'Konami’s arcade sequel: more shooting, bigger bosses.' },
  { id: 'double-dragon', title: 'Double Dragon', year: 1987, publisher: 'Technōs Japan', platform: 'Arcade', genre: 'action',
    description: 'The brawler that started the craze: fight through the streets, ideally with a friend.' },
  { id: 'streets-of-rage', title: 'Streets of Rage', year: 1991, publisher: 'Sega', platform: 'Sega Genesis / Mega Drive', genre: 'action',
    description: 'Three ex-cops clean up the city in Sega’s beat ’em up, famous for its soundtrack.', notes: N_SEGA },
  { id: 'street-fighter-ii', title: 'Street Fighter II: The World Warrior', year: 1991, publisher: 'Capcom', platform: 'Arcade', genre: 'action', featured: 4, popular: 5,
    description: 'The one-on-one fighter that launched the 90s arcade craze: pick a warrior and take on the world.',
    status: 'official', sourceName: 'Capcom Town (Capcom)', sourceUrl: 'https://captown.capcom.com/en/classic_games/23', embedUrl: '', repoUrl: '',
    licence: 'Proprietary, closed source (Capcom)', contentRights: 'Owned by Capcom. Played on Capcom Town under its Terms; we link to it and copy nothing.', embedding: 'Not permitted: the page sends X-Frame-Options SAMEORIGIN',
    commercialUse: 'No: Capcom Town’s Terms prohibit commercial acts without Capcom’s approval', rom: 'No ROM from us: Capcom runs its own licensed copy',
    mobile: 'On-screen controls offered by Capcom Town; not tested here', controls: 'Keyboard, controller or on-screen buttons. The official page lists them.',
    notes: N_OFFICIAL + ' This is the Super NES version (1992) of the 1991 arcade game. Capcom Town asks you to accept its Terms before playing: we did not accept them for you, so the game itself was not played during our check. Capcom’s playable line-up rotates monthly, so this page may change or disappear.' },
  { id: 'mortal-kombat', title: 'Mortal Kombat', year: 1992, publisher: 'Midway', platform: 'Arcade', genre: 'action',
    description: 'The bloody fighter with digitised warriors and its infamous finishing moves.' },
  { id: 'golden-axe', title: 'Golden Axe', year: 1989, publisher: 'Sega', platform: 'Arcade', genre: 'action',
    description: 'Fantasy beat ’em up: choose a barbarian, a dwarf or an amazon and fight your way to Death Adder.', notes: N_SEGA },
  { id: 'tmnt', title: 'Teenage Mutant Ninja Turtles', year: 1989, publisher: 'Konami', platform: 'Arcade', genre: 'action',
    description: 'Four turtles, four players and a lot of Foot Clan to beat up.' },

  /* ---------------------------------------------------------------- ARCADE */
  { id: 'pac-man', title: 'Pac-Man', year: 1980, publisher: 'Namco', platform: 'Arcade', genre: 'arcade', featured: 1, popular: 1,
    description: 'Eat the dots, dodge the ghosts and grab a power pellet to turn the tables.',
    status: 'official', sourceName: 'Google (Pac-Man 30th-anniversary Doodle)', sourceUrl: 'https://www.google.com/logos/2010/pacman10-i.html', embedUrl: '', repoUrl: '',
    licence: 'Proprietary, closed source (made and hosted by Google)', contentRights: 'Game and characters owned by Namco. Google hosts the Doodle; that Namco authorised it is widely reported but not confirmed by us.', embedding: 'Not permitted: frame-ancestors allows only Google’s own domains',
    commercialUse: 'Unknown', rom: 'No ROM: a Google-made version of the game', mobile: 'Not tested', controls: 'Shown on the Doodle page.',
    notes: N_OFFICIAL + ' This is Google’s 2010 Doodle, a faithful tribute made for the 30th anniversary, not the 1980 arcade code. That Namco authorised it is widely reported; we did not read it from a primary source. It loaded and ran when checked on ' + ARCADE_VERIFIED + '.' },
  { id: 'battle-city', title: 'Battle City', year: 1985, publisher: 'Namco', platform: 'NES / Famicom', genre: 'arcade',
    description: 'Tank defence for one or two players: protect the eagle base from waves of enemy tanks.' },
  { id: 'galaga', title: 'Galaga', year: 1981, publisher: 'Namco', platform: 'Arcade', genre: 'arcade',
    description: 'Shoot the alien swarm, let one capture your ship, then rescue it for double firepower.', notes: 'Bandai Namco’s official Pac-Man page offers console versions only. No Namco browser version of Galaga found on ' + ARCADE_VERIFIED + '.' },
  { id: 'space-invaders', title: 'Space Invaders', year: 1978, publisher: 'Taito', platform: 'Arcade', genre: 'arcade', featured: 3, popular: 8,
    description: 'The 1978 shooter that started it all: hold off the descending rows of aliens.',
    status: 'official', sourceName: 'Taito (404 page)', sourceUrl: 'https://www.taito.co.jp/Error/404', embedUrl: '', repoUrl: '',
    licence: 'Proprietary, closed source (Taito)', contentRights: 'Owned by Taito. We link to Taito\u2019s own page and copy nothing.', embedding: 'Not permitted: Taito pages send X-Frame-Options SAMEORIGIN',
    commercialUse: 'Unknown', rom: 'No ROM: Taito’s own page', mobile: 'Reported to work on mobile (press); not tested here', controls: 'Shown on the page.',
    notes: N_OFFICIAL + ' It is a mini Space Invaders on Taito’s own “page not found” page, so the address looks like an error page: that is how Taito built it. The aliens, bunkers and ship loaded when checked on ' + ARCADE_VERIFIED + '; we did not play to a game over.' },
  { id: 'donkey-kong', title: 'Donkey Kong', year: 1981, publisher: 'Nintendo', platform: 'Arcade', genre: 'arcade',
    description: 'Climb the girders and jump the barrels to rescue the lady from the giant ape.', notes: 'No Nintendo browser version found on ' + ARCADE_VERIFIED + '.' },
  { id: 'circus-charlie', title: 'Circus Charlie', year: 1984, publisher: 'Konami', platform: 'Arcade', genre: 'arcade',
    description: 'Konami’s circus-themed action game: lion jumps, tightropes and trampolines.' },

  /* ---------------------------------------------------------------- PUZZLE */
  { id: 'tetris', title: 'Tetris', year: 1984, publisher: 'Alexey Pajitnov (rights: Tetris Holding)', platform: 'Elektronika 60', genre: 'puzzle', featured: 2, popular: 3,
    description: 'Rotate and drop the falling blocks to clear lines: the puzzle game everyone has played.',
    status: 'official', sourceName: 'Tetris (official site)', sourceUrl: 'https://play.tetris.com/', embedUrl: '', repoUrl: '',
    licence: 'Proprietary, closed source (Tetris Holding)', contentRights: 'Owned by Tetris Holding. Played on its official site under its Terms of Use; we link to it and copy nothing.', embedding: 'Not granted: the Terms forbid republishing or publicly displaying the material',
    commercialUse: 'No: the Terms allow personal, non-commercial use only', rom: 'No ROM: the official modern game', mobile: 'Not tested', controls: 'Shown on the official page.',
    notes: N_OFFICIAL + ' This is the modern official Tetris, not the 1984 original or the Game Boy version. The menu and Play button loaded when checked on ' + ARCADE_VERIFIED + ', but we could not confirm a round started in our test browser, so test it yourself before relying on it.' },
  { id: 'bomberman', title: 'Bomberman', year: 1983, publisher: 'Hudson Soft', platform: 'Japanese home computers', genre: 'puzzle',
    description: 'Place bombs, blow up the blocks and trap your rivals in the maze.' },
  { id: 'arkanoid', title: 'Arkanoid', year: 1986, publisher: 'Taito', platform: 'Arcade', genre: 'puzzle',
    description: 'Bat-and-ball brick breaker with power-up capsules and a spinning dial.' },

  /* ---------------------------------------------------------------- SPORTS & CRICKET */
  { id: 'iss', title: 'International Superstar Soccer', year: 1994, publisher: 'Konami', platform: 'Super Nintendo (SNES)', genre: 'sports',
    description: 'Konami’s football classic: quick passing play and big-match atmosphere on the SNES.' },
  { id: 'tecmo-bowl', title: 'Tecmo Bowl', year: 1987, publisher: 'Tecmo', platform: 'Arcade', genre: 'sports',
    description: 'American football on a tiny screen: pick a team, call a play and chase the touchdown.' },
  { id: 'nba-jam', title: 'NBA Jam', year: 1993, publisher: 'Midway', platform: 'Arcade', genre: 'sports',
    description: 'Two-on-two basketball with impossible dunks, fire streaks and no fouls.' },
  { id: 'sensible-soccer', title: 'Sensible Soccer', year: 1992, publisher: 'Renegade', platform: 'Amiga', genre: 'sports',
    description: 'Tiny players, top-down view and quick matches: curl a free kick and celebrate.' },
  { id: 'classic-cricket-games', title: 'Classic Cricket Games', year: 1995, yearLabel: '1990s', publisher: 'Various', platform: 'Various', genre: 'sports',
    description: 'The 90s cricket video games. This entry stands for the whole group: specific titles will be chosen once an authorised source is found.',
    notes: 'Google’s 2017 cricket Doodle is an official, free game, but it is not a 90s game and was not tested here. Nothing authorised for the 90s titles was found on ' + ARCADE_VERIFIED + '.' }
];

/* Merge the defaults into every entry. */
var ARCADE_GAMES = ARCADE_RAW.map(function (g) {
  var out = {}, k;
  for (k in ARCADE_SOON) out[k] = ARCADE_SOON[k];
  for (k in g) out[k] = g[k];
  for (var i = 0; i < ARCADE_GENRES.length; i++) if (ARCADE_GENRES[i].id === out.genre) out.thumb = out.thumb || ARCADE_GENRES[i].thumb;
  out.yearLabel = out.yearLabel || String(out.year);
  return out;
});

if (typeof window !== 'undefined') { window.ARCADE_GAMES = ARCADE_GAMES; window.ARCADE_GENRES = ARCADE_GENRES; window.ARCADE_STATUS = ARCADE_STATUS; window.ARCADE_VERIFIED = ARCADE_VERIFIED; }
if (typeof module !== 'undefined' && module.exports) module.exports = { ARCADE_GAMES: ARCADE_GAMES, ARCADE_GENRES: ARCADE_GENRES, ARCADE_STATUS: ARCADE_STATUS, ARCADE_VERIFIED: ARCADE_VERIFIED };
