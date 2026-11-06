/* ==========================================================================
   90s REWIND TV — AD BREAKS, IDENTS AND CONTINUITY
   ==========================================================================
   What plays in the gaps between shows on each channel. These are recordings
   of the real thing: 90s ad breaks, channel idents and continuity announcements,
   uploaded to YouTube by TV-archive collectors. They only ever run in OUR gap
   slots, never over a show and never over YouTube's own ads.

   One list per channel:  { title, sponsor, duration (SECONDS), video }
     title     what the card says while it plays
     sponsor   a short credit line (what the recording is)
     duration  how long to let it play before moving to the next one. The
               videos are recordings of up to an hour; a duration shorter than
               the video just plays the first part of it.
     video     YouTube video ID (all of these were checked on 5 Nov 2026:
               on YouTube, embedding allowed)

   Leave a channel out (or its list empty) and the gap shows a plain
   "commercial break" card. The ALL SHOWS page also lists these as watchable
   "Ads, idents and continuity" entries.
   ========================================================================== */

var TV_AD_PACKS = {
  ddn: [
    { title: 'Doordarshan ad break', sponsor: '90s Indian ads (archive recording)', duration: 300, video: '2NJ3G1Hp6TE' },
    { title: 'Doordarshan ad break', sponsor: '90s Doordarshan ads (archive recording)', duration: 300, video: 'r2FFTZ6ltwQ' },
    { title: 'Doordarshan ad break', sponsor: '90s Doordarshan ads (archive recording)', duration: 300, video: 'kW_V5upL8z4' }
  ],
  ddm: [
    { title: 'Doordarshan ad break', sponsor: '90s Doordarshan ads (archive recording)', duration: 300, video: 'r2FFTZ6ltwQ' },
    { title: 'Doordarshan ad break', sponsor: '90s Doordarshan ads (archive recording)', duration: 300, video: 'kW_V5upL8z4' },
    { title: 'Doordarshan ad break', sponsor: '90s Indian ads (archive recording)', duration: 300, video: '2NJ3G1Hp6TE' }
  ],
  zee: [
    { title: 'Zee TV ad pack', sponsor: 'Zee TV, 1997 (BR Play archive)', duration: 138, video: 'osyAVLbzrBE' },
    { title: 'Zee TV ad', sponsor: 'Old Zee TV commercial', duration: 25, video: '3h7wW3QJjxQ' },
    { title: 'Zee TV ad break', sponsor: 'Zee TV adverts during Shapath, 1998 (UK feed)', duration: 251, video: 'gzvvLOE2dOU' }
  ],
  home: [
    { title: 'Home TV ident', sponsor: 'Home TV opening ident, 1998', duration: 26, video: 'UNCvcxj_d_I' },
    { title: 'Home TV', sponsor: 'Home TV India, 1996-1999', duration: 61, video: 'nArTR4vxkJo' },
    { title: 'Ad break', sponsor: '90s Doordarshan ads (archive recording)', duration: 300, video: 'r2FFTZ6ltwQ' }
  ],
  star: [
    { title: 'Star Plus ad break', sponsor: 'Star Plus India, April 1999', duration: 300, video: '4G8w6OBIVbQ' },
    { title: 'Star Plus ident', sponsor: 'Star Plus ident, 1998-99', duration: 11, video: 'COZogoX0fPM' },
    { title: 'Star Plus ads', sponsor: 'Star Plus commercial break', duration: 152, video: 'peQWq-j0M0Y' },
    { title: 'Star Plus promos', sponsor: 'Star Plus promos, 1998', duration: 103, video: 'E7kRaMFCPsI' }
  ],
  sony: [
    { title: 'Sony / SET ident and ads', sponsor: 'SET India, 1997 ident and 2000 ad breaks', duration: 137, video: 'aXRJBnl2dK8' },
    { title: 'Sony / SET continuity', sponsor: 'SET India continuity, 2000', duration: 200, video: 'd896nWQroUI' },
    { title: 'Sony ads', sponsor: 'Old Sony TV commercials', duration: 170, video: 'lc4ASmjbH4g' },
    { title: 'Sony / SET continuity', sponsor: 'SET India continuity, 1995-97', duration: 300, video: 'eyGMOrh5UBo' }
  ],
  sab: [
    { title: 'Ad break', sponsor: '90s Indian ads (archive recording)', duration: 300, video: 'v3vHMf21INU' },
    { title: 'Ad break', sponsor: '90s Doordarshan ads (archive recording)', duration: 300, video: 'r2FFTZ6ltwQ' }
  ],
  cn: [
    { title: 'Cartoon Network India promos', sponsor: 'Promos and bumpers, 1999-2000 (archive recording)', duration: 300, video: 'gPXXDhP-lGE' },
    { title: 'Cartoon Network ad break', sponsor: 'Cartoon Network commercial break (archive recording)', duration: 300, video: 'fi2mgeUxkaE' }
  ],
  sstar: [
    { title: 'Star Sports ad break', sponsor: 'Star Sports India, 1996 (archive recording)', duration: 170, video: 'NjkXZ1FAgKE' },
    { title: 'Star Sports ident', sponsor: 'Star Sports India ident, 1997-99', duration: 15, video: 'I4vubPParEg' },
    { title: 'ESPN Star Sports cricket intros', sponsor: 'Classic 90s cricket intros', duration: 191, video: 'wvbhbJgqesQ' },
    { title: 'Star Sports ad break', sponsor: 'Star Sports India, 1998 long ad break and continuity', duration: 300, video: 'nGmRorG95c4' }
  ],
  espn: [
    { title: 'ESPN Star Sports cricket intros', sponsor: 'Classic 90s cricket intros', duration: 191, video: 'wvbhbJgqesQ' },
    { title: 'Star Sports ad break', sponsor: 'Star Sports India, 1998 long ad break and continuity', duration: 300, video: 'nGmRorG95c4' },
    { title: 'Cricket theme', sponsor: 'ESPN Star Sports cricket theme, 2001-2008', duration: 22, video: '6PdnPnbsokE' },
    { title: 'Star Sports ad break', sponsor: 'Star Sports India, 1996 (archive recording)', duration: 170, video: 'NjkXZ1FAgKE' }
  ]
};

if (typeof window !== 'undefined') { window.TV_AD_PACKS = TV_AD_PACKS; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { TV_AD_PACKS: TV_AD_PACKS }; }
