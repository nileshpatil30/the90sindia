/* ==========================================================================
   MAHABHARAT (B.R. Chopra, 1988-90): the episodes that can be played.
   No official upload exists, so these are community uploads on Dailymotion
   (the YouTube copies are not embeddable). Checked 5 Nov 2026 with
   Dailymotion's own API: published, embedding allowed, title names the
   episode. 56 of the 94 episodes are available; the missing numbers stay
   missing on screen ("Episode 14" is followed by "Episode 18").

   dm  = Dailymotion video ID      dur = length in seconds
   Several uploaders are mixed (Rajvardhan 1-8, DESI VIDEOS HUB 10-14,
   EIEST 18-94, MakeEasy 70-79). Where two uploads of the same episode
   existed, the longer (more complete) one is used.
   ========================================================================== */
var MAHABHARAT_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 18, 20, 21, 30, 35, 36, 37, 41, 43, 44, 45, 46, 47, 48, 51, 53, 55, 57, 59, 63, 64, 66, 68, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 84, 87, 88, 89, 91, 93, 94];
var MAHABHARAT_DM = (function () {
  var ids = 'x50nb80 x3w9eui x3wk4d1 x50vq1s x51at5x x51mn9s x3xm1jp x3xm1lp x7rqx9v x7rsdrz x7rw6mx x7vbesj x7vbesh x8h7s70 x8h7s72 x8h7s73 x8h3797 x8h2tbu x8h2tbv x8h2tbw x8g434q x8g434t x8g2y43 x8g2wlv x8g2p1z x8g2p20 x8g2p21 x8fwc58 x8fwc5c x8fwc5f x8fvdwn x8fv77z x8fsx3o x8fsx3q x8fre5a x8fre5c x7tv2h0 x8fre5f x8fr9h1 x7tqw3b x7tqovr x8fr9h4 x8fps68 x7tsfbo x8fps6a x7tsr6f x8fpr0v x8fpr0w x8fpr0x x8fpr0z x8foiak x8foian x8fohbv x8fohby x8fohc2 x8fohc1'.split(' ');
  var durs = [2785, 2750, 2606, 2514, 2709, 2343, 2571, 2765, 2519, 2394, 2464, 2671, 2576, 2409, 2549, 2594, 2408, 2392, 2515, 2531, 2251, 2353, 2684, 2387, 2401, 2281, 2262, 2611, 2546, 2490, 2398, 2344, 2314, 2648, 2638, 2344, 2549, 2483, 2497, 2523, 2528, 2314, 2429, 2476, 2588, 2577, 2640, 2349, 2603, 2367, 2696, 2466, 2614, 2562, 1908, 2365];
  return ids.map(function (id, i) { return { dm: id, dur: durs[i] }; });
})();
if (typeof window !== 'undefined') { window.MAHABHARAT_DM = MAHABHARAT_DM; window.MAHABHARAT_NUMS = MAHABHARAT_NUMS; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { MAHABHARAT_DM: MAHABHARAT_DM, MAHABHARAT_NUMS: MAHABHARAT_NUMS }; }
