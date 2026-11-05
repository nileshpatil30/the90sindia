/* ==========================================================================
   90s REWIND TV — THE GAMES
   The five games of the Games Hub. All are ORIGINAL games written for this site
   in the spirit of 90s arcade and handheld classics: no ROMs, no commercial
   games, no one else's characters or artwork.

     id      used in the address (games.html#snake) and in search
     title   what the card says
     desc    one line for the hub
     ready   true = playable now; false = the card says "Coming soon"
     href    optional: where "Play" goes if the game is not on games.html
     img     the card picture (a local file)
     c, dark card colour block, light text
     keys    how to play, shown under the game
   ========================================================================== */
var GAMES = [
  { id: 'rewind-runner', title: 'Rewind Runner', ready: true, featured: true, href: 'index.html#arcade', img: 'assets/games/pixel-runner.svg', c: '#2f55b8',
    desc: 'Jump the obstacles and run as far as you can.', keys: 'Space or tap to jump.' },
  { id: 'road-dash', title: 'Road Dash', ready: false, featured: true, img: 'assets/games/road-dash.svg', c: '#c98a12',
    desc: 'A top-down road racer: dodge the traffic.', keys: 'Arrow keys or tap left and right.' },
  { id: 'snake', title: 'Snake ’97', ready: false, featured: true, dark: true, img: 'assets/games/snake.svg', c: '#15101f',
    desc: 'The handheld classic: eat, grow, do not hit yourself.', keys: 'Arrow keys or swipe.' },
  { id: 'brick-smash', title: 'Brick Smash', ready: false, featured: true, dark: true, img: 'assets/games/bricks.svg', c: '#15101f',
    desc: 'Bounce the ball and clear every brick.', keys: 'Mouse, finger or arrow keys.' },
  { id: 'space-dodge', title: 'Space Dodge', ready: false, featured: true, dark: true, img: 'assets/games/space-dodge.svg', c: '#15101f',
    desc: 'Slip through the asteroid field.', keys: 'Arrow keys or drag.' }
];

if (typeof window !== 'undefined') window.GAMES = GAMES;
if (typeof module !== 'undefined' && module.exports) module.exports = { GAMES: GAMES };
