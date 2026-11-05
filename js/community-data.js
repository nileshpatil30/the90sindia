/* ==========================================================================
   90s REWIND TV — COMMUNITY PAGE CONTENT (community.html)
   Everything here is SAMPLE content so the pages have a real layout to show. None of it was written by visitors.
   The forum becomes real when a backend is added (see docs/backend-options.md); until then these topics are look-only.
   The polls come from js/poll-data.js and the trivia from js/trivia-data.js.
   ========================================================================== */
var COMMUNITY = {

  // Discussion Forum (sample). n = number of replies. when = how long ago, in words.
  forumCats: [
    { id: 'all',    label: 'All' },
    { id: 'tv',     label: 'TV' },
    { id: 'ads',    label: 'Ads' },
    { id: 'cricket', label: 'Cricket' },
    { id: 'games',  label: 'Games' },
    { id: 'life',   label: 'Growing up' }
  ],
  topics: [
    { cat: 'ads',     t: 'Which 90s ad still gives you nostalgia?',           by: 'retro_raj',    n: 438, when: '2 days ago',  hot: true },
    { cat: 'tv',      t: 'Best Sunday morning TV shows?',                      by: 'riya90s',      n: 326, when: '3 days ago',  hot: true },
    { cat: 'cricket', t: 'India vs Pakistan 90s matches!',                     by: 'sandy_bat',    n: 512, when: '1 week ago',  hot: true },
    { cat: 'games',   t: 'Your first video game?',                             by: 'gudgudee_fan', n: 297, when: '5 days ago',  hot: true },
    { cat: 'tv',      t: 'Remember the Doordarshan test card?',                by: 'retro_raj',    n: 12,  when: '2 hours ago' },
    { cat: 'tv',      t: 'Chitrahaar vs Rangoli: which one?',                  by: 'riya90s',      n: 31,  when: '5 hours ago' },
    { cat: 'tv',      t: 'Cartoon Network on a school day',                    by: 'sandy_bat',    n: 58,  when: 'Yesterday' },
    { cat: 'life',    t: 'Cassette tape pencil trick, who did it?',            by: 'gudgudee_fan', n: 74,  when: 'Yesterday' },
    { cat: 'life',    t: 'Summer holidays at the village: what did you do?',   by: 'retro_raj',    n: 44,  when: '4 days ago' },
    { cat: 'games',   t: 'Brick Game or Snake on the Nokia?',                  by: 'riya90s',      n: 66,  when: '6 days ago' },
    { cat: 'cricket', t: 'Where were you for the 1996 World Cup?',             by: 'sandy_bat',    n: 93,  when: '1 week ago' },
    { cat: 'ads',     t: 'Jingles you can still sing word for word',           by: 'gudgudee_fan', n: 120, when: '2 weeks ago' }
  ],

  // Share Your 90s Memories (sample entries, shown above the ones saved on this device)
  memories: [
    { name: 'Sample', year: '1996', text: 'Sunday mornings meant Rangoli on a black-and-white TV, and everyone on the floor with a plate of poha.' },
    { name: 'Sample', year: '1998', text: 'We pooled our pocket money to rent a VCR for the weekend and watched three films back to back.' },
    { name: 'Sample', year: '1993', text: 'The whole lane crowded into one house to watch the serial because only they had a TV.' }
  ],
  memoryPrompts: [
    'The first TV show you never missed',
    'A school-day snack you still crave',
    'The song that took over your street',
    'A toy or game everybody in class had'
  ]
};
