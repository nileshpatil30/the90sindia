/* ==========================================================================
   90s REWIND TV — THE POLLS  (add a poll: add one block)
   The homepage shows one poll a day (they take turns, by Indian date). The community page lists all of them.

     id       short unique id. Votes are kept per id, so never reuse an id for a different question.
     q        the question: 30 characters or fewer, so it stays on one line in the small homepage panel
     options  2 to 6 answers, each 16 characters or fewer (they sit in a narrow box)
     seed     SAMPLE vote counts to show next to your vote, one per option, so the bars are not empty.
              They are made-up demo numbers. They are labelled as sample numbers on the page.

   VOTES TODAY ARE KEPT IN THIS BROWSER ONLY (localStorage), one vote per poll per browser.
   Shared, real totals need a small server: see docs/backend-options.md. The code that stores and
   counts votes is the "backend" object in js/engage.js, so it can be swapped without touching the pages.
   ========================================================================== */
var POLLS = [
  { id: 'fav-90s-show-1', q: 'Your favourite 90s TV show?', options: ['Shaktimaan', 'Ramayan', 'Malgudi Days', 'Chandrakanta', 'Byomkesh Bakshi'], seed: [412, 388, 301, 274, 236] },
  { id: 'sunday-morning', q: 'Your 90s Sunday morning?', options: ['Mahabharat', 'Rangoli', 'Jungle Book', 'Lane cricket', 'Sleeping in'], seed: [455, 301, 288, 262, 140] },
  { id: 'fav-cartoon', q: 'Fave after-school cartoon?', options: ['Jungle Book', 'DuckTales', 'Tom & Jerry', 'Dexter’s Lab', 'Johnny Quest'], seed: [390, 342, 318, 205, 118] },
  { id: 'fav-ad', q: 'Best-remembered 90s ad?', options: ['Hamara Bajaj', 'Nirma', 'Cadbury', 'Lijjat Papad', 'Rasna'], seed: [333, 361, 349, 190, 176] },
  { id: 'fav-cricketer', q: 'Your 90s cricket hero?', options: ['Sachin Tendulkar', 'Azharuddin', 'Anil Kumble', 'Sourav Ganguly', 'Kapil Dev'], seed: [655, 214, 187, 243, 121] },
  { id: 'first-game', q: 'Your first video game?', options: ['Mario', 'Contra', 'Road Rash', 'Brick game', 'Snake'], seed: [420, 280, 190, 335, 260] },
  { id: 'fav-channel', q: 'Your favourite 90s channel?', options: ['DD National', 'Zee TV', 'Star Plus', 'Sony', 'Cartoon Network'], seed: [510, 295, 260, 150, 330] },
  { id: 'fav-sunday-treat', q: 'Best Sunday-afternoon plan?', options: ['A film on DD', 'Cricket match', 'Playing outside', 'Video game', 'Sleeping'], seed: [305, 330, 290, 215, 120] }
];

if (typeof window !== 'undefined') window.POLLS = POLLS;
if (typeof module !== 'undefined' && module.exports) module.exports = { POLLS: POLLS };
