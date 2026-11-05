/* ==========================================================================
   90s REWIND TV — PHOTO GALLERY CONTENT (gallery.html)
   One line per picture. To add a picture: put the file in assets/photos/ or assets/wallpapers/
   (any .svg, .png, .jpg or .webp) and add a line below. Nothing else to edit.

     id     a short unique word (no spaces)
     src    where the picture file is
     title  the name shown under it and in the big view
     cat    photos | wallpapers | things   (the categories are listed in GALLERY_CATS)
     alt    one plain sentence describing the picture, for people who cannot see it
     year   optional

   The pictures here are illustrations drawn for this site, not copied photographs.
   Only add pictures you made or have permission to use.
   ========================================================================== */
var GALLERY_CATS = [
  { id: 'photos',     label: 'Photos' },
  { id: 'wallpapers', label: 'Wallpapers' },
  { id: 'things',     label: 'Retro Things' }
];

var GALLERY = [
  { id: 'handheld', src: 'assets/photos/handheld.svg',     title: 'Handheld Game Console', cat: 'photos',     alt: 'A yellow handheld game console with a small green screen' },
  { id: 'marbles',  src: 'assets/photos/marbles.svg',      title: 'Glass Marbles',         cat: 'photos',     alt: 'A pile of colourful glass marbles' },
  { id: 'cap',      src: 'assets/photos/cap.svg',          title: 'Fizzy-Drink Bottle Cap', cat: 'photos',    alt: 'A red bottle cap that says Fizz Cola' },
  { id: 'cyclists', src: 'assets/photos/cyclists.svg',     title: 'Evening Cycle Ride',    cat: 'photos',     alt: 'Two kids cycling together' },

  { id: 'boombox',  src: 'assets/wallpapers/boombox.svg',  title: 'Boombox',               cat: 'wallpapers', alt: 'A two-speaker boombox with a cassette deck' },
  { id: 'can',      src: 'assets/wallpapers/can.svg',      title: 'Soda Can',              cat: 'wallpapers', alt: 'A tall soda can' },
  { id: 'sneaker',  src: 'assets/wallpapers/sneaker.svg',  title: 'Canvas Sneaker',        cat: 'wallpapers', alt: 'A canvas sports shoe' },
  { id: 'toycar',   src: 'assets/wallpapers/toycar.svg',   title: 'Toy Car',               cat: 'wallpapers', alt: 'A small toy car' },

  { id: 'cassette', src: 'assets/ui/cassette.svg',         title: 'Cassette Tape',         cat: 'things',     alt: 'A cassette tape' },
  { id: 'vhs',      src: 'assets/ui/vhs.svg',              title: 'VHS Tape',              cat: 'things',     alt: 'A video cassette' },
  { id: 'scooter',  src: 'assets/ui/scooter.svg',          title: 'Scooter',               cat: 'things',     alt: 'A small scooter' },
  { id: 'rubik',    src: 'assets/ui/rubik.svg',            title: 'Puzzle Cube',           cat: 'things',     alt: 'A six-colour puzzle cube' },
  { id: 'cola',     src: 'assets/ui/cola.svg',             title: 'Cola Bottle',           cat: 'things',     alt: 'A glass cola bottle' },
  { id: 'earbuds',  src: 'assets/ui/earbuds.svg',          title: 'Walkman Earphones',     cat: 'things',     alt: 'A pair of wired earphones' },
  { id: 'tv',       src: 'assets/ui/tv-mini.svg',          title: 'Little TV',             cat: 'things',     alt: 'A small television set' }
];
