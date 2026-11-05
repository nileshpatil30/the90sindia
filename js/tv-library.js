/* ==========================================================================
   SHOW LIBRARY: one row per show. Used by the "Rewind Mix" channel (CH 90),
   which fills a fixed weekly timetable from these shows automatically.
   ADD A SHOW = add one line:  { title, playlist: 'PLxxxx', min: typical episode
   length in minutes, official: true if it is the rights-holder's channel }.
   Each playlist was found on YouTube on 5 Nov 2026 and its first videos were
   checked to be embeddable. Playlist order is used as episode order, but it was
   not verified episode-by-episode (unlike js/tv-episodes.js). Community
   uploads can disappear: if a show shows "cannot play", swap in another playlist.
   ========================================================================== */
const TV_LIBRARY = [
  { title: 'Hum Log', playlist: 'PL9y5ovxCp1HgEcYIKu_4rG3EE75EQJngT', min: 21, official: false },
  { title: 'Nukkad', playlist: 'PLo7WLtfSrhdbqP7BRV6NvEqdlC5GotLBv', min: 24, official: false },
  { title: 'Malgudi Days', playlist: 'PLJHHPzufWhuqBnKn6h_kjtMzjjE3YjLWZ', min: 25, official: false },
  { title: 'Byomkesh Bakshi', playlist: 'PL67ThKC0yYUeZF9exHx3b4pgfVAiUaT6e', min: 40, official: true },
  { title: 'Surabhi', playlist: 'PLUiMfS6qzIMzE8lgWFaQ3qvVFCCONXALQ', min: 24, official: true },
  { title: 'Chandrakanta', playlist: 'PLwU_LhgdGBizAwYTqIyeg_6mKdJa6OTej', min: 19, official: false },
  { title: 'Alif Laila', playlist: 'PLqmdsOwstpJfOtjWGMFTGMruqQV7C5XoL', min: 22, official: true },
  { title: 'Vikram Aur Betaal', playlist: 'PLFr_jkwUp0hjTXfIElDpIfgBYUwWhKnSn', min: 23, official: false },
  { title: 'Mr. Yogi', playlist: 'PLDXzvDkBVqqRd2w_EQN6ErdYCCG06hAVQ', min: 22, official: false },
  { title: 'Karamchand', playlist: 'PL5TZ-0sMyEgUKMFFl1aGdkSccYpb_DZKW', min: 38, official: true },
  { title: 'Flop Show', playlist: 'PL4z1IVrk5xPOtKT2v9Iz2EmrrZXiLrXs-', min: 25, official: false },
  { title: 'Zabaan Sambhalke', playlist: 'PLDhFhGa9fs_Wa-5kQ4hXjXW4OdAwwM0iL', min: 24, official: true },
  { title: 'Tu Tu Main Main', playlist: 'PLF9B3NWh9MFA_tC1QPC0Ln9glvSAgQSvV', min: 21, official: false },
  { title: 'Hasratein', playlist: 'PLkb22y4iX2hA5hlACopgUqm_x_5am4WF_', min: 15, official: false },
  { title: 'Captain Vyom', playlist: 'PL9GHQvxUY4GJXVz-dJjbf3dskCSonTISs', min: 22, official: false },
  { title: 'Zee Horror Show', playlist: 'PL844RnqN8gR56H09mnUadAoojEDI1M1i6', min: 20, official: true },
  { title: 'Aap Beeti', playlist: 'PLNKJJImmGYIRkYddI3jMG4-Bs1G2r5Dtc', min: 41, official: false },
  { title: 'Tehkikaat', playlist: 'PL2x4R25_L7IwhMvgGt4MSNiY5BTjUU7o7', min: 45, official: false },
  { title: 'Gul Gulshan Gulfaam', playlist: 'PLRJQhRpHRSbt1l6oAFCAA1VjcyrvYeQrB', min: 12, official: false },
  { title: 'Kahkashan', playlist: 'PLecbguowo30kbQ9Len7JDpjjkUaa1iU56', min: 10, official: false },
  { title: 'Mirza Ghalib', playlist: 'PLr_ncX3ujahZnvehufZb47a1-wDQyYHEu', min: 23, official: false },
  { title: 'Bharat Ek Khoj', playlist: 'PLqtVCj5iilH4w0Y8KBB4fqBu25T0sGhXG', min: 49, official: true },
  { title: 'Dada Dadi Ki Kahaniyan', playlist: 'PLVkaGZKVjEqStJ_tpPM-DyEO5wsKSuOV_', min: 23, official: true },
  { title: 'Akbar Birbal', playlist: 'PLVqBLRhC9UzF4JeQVPh7tNVtN3PWqW72s', min: 21, official: true },
  { title: "Chip 'n Dale Rescue Rangers", playlist: 'PLzovi87vDfzIhEgJBZIea8HCGps4UIzlb', min: 21, official: true },
  { title: 'Street Sharks', playlist: 'PLV4Ztn9euy7Qd_rOblp0rD01Cw32ONEor', min: 22, official: false },
  { title: 'Dennis the Menace', playlist: 'PL5NztToIINcPciDVG0lF5-Tekbm-eeqDb', min: 26, official: false },
  { title: 'Kyunki Saas Bhi Kabhi Bahu Thi', playlist: 'PLuoC-UlfJhaccqey8VPVbbb1s8gTBw5zG', min: 49, official: false },
  { title: 'Aryamaan', playlist: 'PLFRC0bW5_cQQdmafUd3rJ6fyc3LHSLgaK', min: 26, official: false },
  { title: 'Hip Hip Hurray', playlist: 'PLdm-a5hgPQ_6sX9Ka67k_BGzMeFEYd5r1', min: 21, official: true },
  { title: 'Just Mohabbat', playlist: 'PLzufeTFnhupw33zlBP1j5_E5gwAKUI1nY', min: 21, official: true },
];
if (typeof window !== 'undefined') { window.TV_LIBRARY = TV_LIBRARY; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { TV_LIBRARY: TV_LIBRARY }; }
