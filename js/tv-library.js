/* ==========================================================================
   SHOW LIBRARY: one row per show. Used by the "Rewind Mix" channel (CH 90),
   which fills a fixed weekly timetable from these shows automatically
   (a show that appears several times a week plays the next episodes in order).

   TWO KINDS OF ROW. Add a show = add one row.

   1) PLAYLIST   { title: 'Name', playlist: 'PLxxxx', min: 22, official: false }
      Paste a YouTube playlist ID. Episodes play in playlist order.

   2) SINGLE VIDEOS   { title: 'Name', min: 22, official: false,
                        episodes: 'id1 id2 id3 ...', nums: '1 2 3 ...' }
      For shows that exist only as separate videos. "episodes" = video IDs
      separated by spaces, in episode order. "nums" (optional) = the real
      episode number of each video, so the screen says "Episode 114" and
      skipped numbers stay skipped. Leave nums out to hide episode numbers.

   min = typical episode length in minutes (a slot is min + 3 minutes of break,
   rounded up to a quarter hour). official = true if the video comes from the
   rights-holder's own channel, false for a fan / community upload.

   Every video below was checked on 5 Nov 2026: it is on YouTube, allows
   embedding, and its title names the show and the episode number. Community
   uploads can disappear; if a show shows "cannot play", swap in another upload.
   ========================================================================== */
const TV_LIBRARY = [
  // ---- Playlist shows (order = playlist order, not verified episode by episode)
  { title: 'Nukkad', playlist: 'PLo7WLtfSrhdbqP7BRV6NvEqdlC5GotLBv', min: 24, official: false },
  { title: 'Malgudi Days', playlist: 'PLJHHPzufWhuqBnKn6h_kjtMzjjE3YjLWZ', min: 25, official: false },
  { title: 'Byomkesh Bakshi', playlist: 'PL67ThKC0yYUeZF9exHx3b4pgfVAiUaT6e', min: 40, official: true },
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

  // ---- Single-video shows (episode order and numbers read from the video titles)
  { title: 'Fauji', min: 24, official: false,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 13',
    episodes: 'eg2DWR-D5d0 xhYeC0g041c u0wjf5N_TzI yJtZKtcBkbQ UuAWjXPPukU h0XFoiPG3hE 2sN39X3sE8k W3jyAO_hJwM H8PJC1g-4eI Ta5ZbS0o25Q uKfbMjpdYfE L_WWTImOq74 fcdvEtSvgDg' },
  { title: 'Buniyaad', min: 23, official: false,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 30 31 32 33 34 59 68 70 71 78 79 80 92 100',
    episodes: '1_Go1Vzz_CU fXiTjj75q3o VAAdp94-guY MuA9ReSRLbI HSwt--o-080 W4e9O29wgWc ES-RPDryScI w5Nm0Qq8_v4 ETuRahVAXWc nao7Bd_tp68 tHxrXLXRP-g cQi0dddvrHM H5Fng9q9o5Y uUgEcXn-4Pw OfRldead8cI y0-TLIUdaoM F42gUbtFOGY mMiwg79-Q1k QUpQwUalK58 I_j7X59PrNU pol2rnIW8CY VHPpo7KReOo 8Lokm4mlBr0 G6yQqNcxrHQ FfuRIvUQQS8 OoQLSrnONnQ yVxcdza1CNg vyBeGYXHqnE 5jiXlKzJWEI E9bK72-XpSc JHjexmSyFnA J0YxBNRSOz8 S3Z6c2XmgKE P954GctP8aI I869O2wVHKY zkvyEsFLBC4 _niy9VbFzj8 NKFxEoDgMIg ULRpO4zpCFc DEruBZ9Gd3w IUHN1KhOG6g xJkj8LbkpkA' },
  { title: 'The Jungle Book (Mowgli)', min: 22, official: false,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 19 23 26 27 30 36 41 51',
    episodes: 'pOHDWCt8z40 agHoNRTL_Ks ymOWIo3BRsQ vumSKwmyMwA D1IpMgi_AdY tvbITfFc1JY IjVRuVi2OpE noE4RYrZlWE -oRcXfOhQBg kcV5qCOIFd4 oCFEuHw0bY0 i2CRc_lvP9c EPHmjbnfI4w 7amONlt3ico E4G3mQWD_bk WaWzavX8ER4 d8hrc6c0Xcg C-N-6djzTPw 8VOlZ5rsUJU GJz3uUH-JAk A8D5zPrDRo4 RPEihuRlYUU OgN44L48eeM' },
  { title: 'Swabhimaan', min: 23, official: false,
    nums: '1 2 3 4 5 7 8 9 10 13 14 15 114 321 446 500 507 508 509 566 588',
    episodes: 'hpV_4Gz0Ueg QncoUJ33AtM rdaM5BhDVg4 vU2jyuQN-1E wC0JXuTjP20 RSxw7Ub0APo 6DF-pRu-duc 2chq3qA4PxM P9SN7RmoQCc 5t9RgiXj-B8 o2MxZ9A3a1Y p6MXSZcCEvE Km9FHxUFMSY 6wDwxX612sc 7CowNuhGZDo Hv4oS28VnYQ e5efCUTHAiw 7Y3UDoRNRpY LXKSHQ_SCms TyymqDaTdw4 r9N18XMJUAc' },
  { title: 'The Sword of Tipu Sultan', min: 41, official: false,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 27 28 29 30 31 34 37 38 40 41 45 47 48 50 51 52',
    episodes: 'sUhlaX4xGd0 ruYMJferMSk ow7axlAEH-k J8twlJ2LLKQ mppZyII1zR8 g0NzXpPzfcM d5Qgiz8K1As EFRV90qpXdM f71WcmkQ4_A TTeFH2NeTio aTuKA_5S2VE pAoCqYE5LPs L1h3VPoAvhE 8_KPjbqkcbM LJctsmdVs6c a87P75VvPL8 kxFSLVyTBa0 j4kobstTrOU LDxmkzHJLGc 60KANxFFOw8 JN4L8IlyipE 8NnVCb3Skss qnseYNzINHc JVsjR5PwUqs K_opD9EvPtE D4QFLUTgnHk O-SIJ2kyohw yW15mFsocoU UHGhVkMJapM bA0IV9oTw1I HkMu5SW_qRI ltaXDTScisk 7FDk_ifsAwA 2m6m5pCGtck T9XYZcbEEXs 8NPqltuCYN4 vrbzwNQ8sR0 maaGdNYzay4 aPlsixQHruQ vfRMgBPQf4o' },
  { title: 'Ek Tha Rusty', min: 23, official: false,
    nums: '1 2 3 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 23 24 25 26',
    episodes: 'ljSUHmWcsXE 288oZQjDUJs G2CLSOFORPA yHWt5BQM8T4 lgqricW7XWE 2oJ2iIzxb-4 1LuAqaN80go 4wsPp6RmOHA 0eKgEibAFzE MoYMKuBkU34 ZsPrKP9Agx4 bZDwxb62d34 J_dmxyKGzec amrR4ET8a7k TQhRN3HZxeQ Rf_MWM2rjjQ iCLLmPKuAHU o1_BbAWWckc 3vQWiiNVWQw ld8igGj--MY 2W5zXqybOTg gHEvrHYeyvI Gt2EOPAwE-Q 4McTw_BochY' },
  { title: 'Zee Horror Show', min: 20, official: true,
    nums: '1 2 3 4 5 6 7 8 9 10 12 13 14 15 17 18 23 24 29 32 33 34 35 37 46 50 55 58 59 60 61 67 68 69 71 80 89 90 95 96 97 98 104 105 106 107 108 110 116 117 118 119 122 123 125 140 141 144 148 151 153 154 156',
    episodes: 'HJCkRjL4mYo NUemCIxFTAg s_66zjc_pP0 -lftCo3Dh3Q 5_ZdJ3bLVB8 B9yFjNfoWjU 90f6bICNLoI URsxP6LO2-I ef_BQnB88Ws WllgFnjzFCY E_Trgzxal3U 84CLYPyMq1o GnYIrIBPMjE n4j3P9GrjtM 7eIMClKfzq0 rkcOcx-Faq4 qIPm0brsWLc MaHrbaYkrUk 2YzxEpcmFVU Sk30N8XMPaQ oS4hfJtNhF4 ZLZrruBlVOU ov6lJFmAhhg BscfIyaQ9KM SHa0AyXcu-c l_Gd8hNJQpk N9pBs5U5Uu8 sEUPt2S_2cc ywUW4XP760U z3cFnWKJSNI 3TLnyAklyxU Oz5WU28W7pM VubRdlLfqrI Cr2TOl5VrSo BLRXNITyE4w prWyYxqHd30 nzIEbmTFWno HrIkgjUmVZI 9Y5kTl8QpJ0 ft7pL7OPA24 4SKrDiypvAA YD9m8dQLsZo 3XJjeFDk5V4 nv2-13X2Gp4 Rrenu2mcGEI Gj3mgd4Apus TV2j-DQcaBc 22tojopXVdI csOLBkUBBnE Kc9L_f8yTGU QLrFvvK0Sn4 e5YGt0f9JtE 2QcqiA7CBM0 JC_3xENe4I4 Qr0U-KmEvM8 82arT7hztQY FDJzhpnw0zg 7tFqASXAL74 qUwRRpwv2C4 LwcVDZZFwI0 RL2FGhrPcvc 8xR-WkcfOIE P-RKs8nf0ck' },
  { title: 'Hum Log', min: 22, official: false,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 17 18 19 20 21 22 25 26 27 28 32 33 35 37 39 41 42 43 45 46 47 48 49 51 52 53 54 55 56 57 58 59 60 61 62 63 65',
    episodes: 'Sxn-lSJiW7o Ig8ucMaB5Nw tFvfLxcG6F0 JNRXakPc_CQ BUl5YLZvZUs LNoaJrcbr8s 8hVirVpKfj8 X1__OKCysCA Jg1hZvaWTNo 4qoftwfTBVg WExOHOeX0J4 wv5cRNFnNkc pXSEPiwyrKo FjOPFt56SsM GXutiQDAhE8 q5oTNmKRG9s itwE_sVoEN4 G2_GTxoTDqM lsPJWv1TDfI qyuY1F8UQpk TNMVIyQYSm0 jW2dtDvBg4I HISwSFoUgws AscKAO6EC5c 50cFIlr10Wc xKQdtmdUAKA 9vik9v33Sco XMPnqc3x6SM gTol4Ja-FpU pmjP_7a1_eI PJnUZVyMO7g hR3E2UoDZuc 2qByh-qy-FM 3SuCwy6Wobo wGXmxC_neAg 9Y8mvDSWodo Lt3KWRvVIWY c0MZycjctts QpLFajHf8Rw _SLFiAAl3wg na8Ibz_fNj8 ijQrMWrecSk IJ44AcxFevU HU7GxvDZ564 C1sQGOwdlOI hS-KCOrWh1I FvPn99gT-pM 4_aFY5sOpuU ku_uPHqPKgg ArGZ2T4EyF8 3l4O9YaBvuU nKybSYjWJ3w' },
  { title: 'Shrimaan Shrimati', min: 22, official: false,
    nums: '13 18 37 56 58 66 67 77 84 86 88 90 92 96 98 99 102 106 117 119 120 124 127 130 139 140 146 155 158 163 176 178 188 189 195 212 215 217 218 219 232 234 236 242 246 248 253 266 274 275 277 293 297 305 311 318 320 329 330 340 357 359',
    episodes: 'F14_-wVARNo 8VFX5AZ1FQg fxjdFDxAVQA kllJaR4gzdU b6fnXerUfCo 32CYlmW0o1I k2EWtfhESfQ _-Uxv_mFi3Q mv_OtR5AzOA 6YgQxK0jmGU rw666ASEDWU hrhS-ZLL60g AYIsKKBjoOw 9DmNHS5n46U J3SrS1aOtaM 3gEnxG9yUT8 bRlwJRUCw1w U3am4mlLP4I FFVQRf4mtnc E8jPAKFp2Wc xcJyxO-lJs8 3yDQkPvVFu4 ve2uc0vwHUg -O7zKMzuZJc qc9zNh2TKJU OFDXliGIdT0 ujfRK4Qzw2o aY3_V4ck_HU s9EtcQT-zy4 BBJfoUHslK8 dSCP_rxvYFQ kLtAPt4vJRs u4hrbVbd5Hs gMFhlEyxWak 7xmfV2pIgpQ -v-LNeFEuQI waLrQPaMbVI -SwMesCGCv0 mDd-3d3TNQ0 Qtw5zRM4E_A VTbfS6mDWQo UzfwUnkl5LM LtFv3xmTdVQ f91BsY_7i2A I_7y4A05G9w N0KU6A9wMjI so3ZA5CQSjw 2g2b00g829s hXA3gE9UK5U d16qTPXZCWQ QBBHr30r3Fg FvFuN-kC_kE Xs91oYyBmXU FtydCJm1QpQ dk1b9dXHYR4 vCx-U08KuDE U6houTffLIY BOrNknCN8Vw 8Jxibp_Xv_w oBLnZKBkmKU -WSzPds1-cE yzlAkNL7mBQ' },
  { title: 'Surabhi', min: 25, official: false,
    nums: '2 3 4 5 6 7 8 9 10 11 247 268 320 322 326 329',
    episodes: '_TtEKteFaME HTIgdw5VuoA jgFEZ98ChPk 6d1FHkGVFBk FWdfKMQFOZs 4QHwAAk5geE YxqtKD6hIms yrwRd1Jf6yU vtm2AT8U_3k cjpjMjxHWp0 LhayM3jBcyM cP4ighCLqDA dfW8PTShg5g n2kotPxzSFU yG30aHS7fZw TKDD1Lxv-Nw' },
  { title: 'Office Office', min: 20, official: false,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 17 19 22 27 28 29 30 32 35 37 39 40 41 42 44 45 46 47 48 49 50 51 52 55 57 59 60 62 63 64 65 67 68 70 71 72 74 75 77 78 79 85 86 87 88 98',
    episodes: 'm73S4uGbQvs IR5ws6BvIgg iA8M5Yz-eDU uHRuiOCcsuQ TR9i3Rg2yWw lQV8C_tgjDE uXyQ6wUQaHU Mp0EWUJbzC0 3z_mTqlvmfM D-Fp5lfaAs0 TBRLu7JEjQw hPWCbr4-lSA FkGwhUzruqo qplQqhdqfYA Q5ByZAJTjOE fWkLTNZnB4s b4tmtA_sOTc Dh06sKJ7Sxk dzjAcQiz-Ks gpNFkG8Zbkc _XChP_K5HuM RkYbDnJKP6o aam3gWmfqHs Xy0ZovsetYQ 0ySCbtRv8dU RiuqU5sTVFU iC5Y5er4BDM ZBE96aHNEwQ 13sYftwRG8U v2jr-oTg4ZM ftczPVG0D-M i0wkqdrgyTs WQX13x1DY5U 6_SkRJOtXTc 0X4t_zV5BoM 8Eit0PFqVvY dRoZi97kpqU oSw1xsNdSC8 rq5WzpoPtCI usRvj6-t4E8 pTwAhb-kW3o dK4FOcZwU68 TmnURG1BB1Y dW6dJ_8xVaY uIJaiAtx5io -9J1DT4dXFU 0KjKOtdzUOM PwdxThXnow4 3XtQxPkDSkI ZWwFV-Q2V_k HWtKm3_-YAU gCI-j1MjDqk brGwFSvc89E jo1R_CVEI5s E_V1WmOfw5c Z7-0KJnWy8I 85oGrQxYHkU NiqIZBddt1I ZUx2TTe7zo8 J2sjQ4Xe9tM Pb7TNruT1wA' },
  { title: 'Kabhi Yeh Kabhi Woh', min: 11, official: false,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 14 15 16 17 18 20 21 24 25 26 27 28 29 30 31',
    episodes: 'z1Am5clG2io lSvbc3PhxjU Juc-dAGM4KI vXN9BTdXPIA -Xa2OJ5-ALk g7STYLtPMNQ yoFLQ6Reh5k Qn795FZBVes AomjbrJ8l1E crVDBB_Wu0Y I3q9xy9L-5I BPZqD0H8ug0 6Gowz59ib9M 658FetlUEUU Vm0qZivsImA mfYTHAM-qiA BZcGCvIdxW0 5kfaE2Wfy28 dJCZ232LYw4 kgzksbX2QxA 4qatzPLloYg WASqsbyAXsg G31S35PFSKU k8i1A7poLG4 O26Wxo7dIS0 SibNL2U0QxY HVc6TzSdxEY' },
  { title: 'Ulta Pulta', min: 10, official: true,
    nums: '1 2 3 4 6 9 10 12',
    episodes: 'ZLoTJ52ohr0 ngV_T6SCzos tXOYOYCggQ4 q9B2WJTTXag ZsAVvD3Hp_E pywc3-Z_se8 HupSB7SCSAE 5bunYpV2QJE' },
  { title: 'Idhar Udhar', min: 23, official: false,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 17 18 19 20 22',
    episodes: 'PVEToyo8220 9i2lL2l_X3U -WhrvbFT6GQ zwidLnJdYmc _N1JVHY4kQ4 SiqGyvCwFh4 Oucf0nL1VqY TRSpT6nRx5Q S3L8-pC6Je0 OkPq86kkTik 8OKWb8IRLvQ ByD4PNPdG_Q B2UVvoBumd8 ZQRpVkUD140 NmZt5Mkn_d8 WORj267ouSM IIlx2ekDUTQ uc3dymcxVGY 4CTY9UInw88 HzVFKEzvvj8' },
  { title: 'Dekh Bhai Dekh', min: 24, official: false,
    nums: '9 10 11 12 13 14',
    episodes: '4hE_8EoIMFw KHKmVQSYvCU MX0SOi-V1c8 arpGQ30NWPg ckB5CtIKfqA -4tnC--PDTs' },
  { title: 'Wagle Ki Duniya', min: 24, official: false,
    nums: '1 2 3 4 5 6 7 8 9 11 13',
    episodes: 'Sn-epjpzqt8 8pBW_wCW86U FqDK3DFqjuA MF8AppEaVYM _DM6LVzPjNU BLNfmqdhQcw _9zB1jGS9H8 2rUNNa1BTjA sv7HQcUDg78 gfaP1BSs8IA vdPM2B5biUU' },
  { title: 'Shri Krishna', min: 46, official: true,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 146 147 148 149 150 151 152 153 154 155 156 157 158 159 160 161 162 163 164 165 166 167 168 169 170 171 172 173 174 175 176 177 178 179 180 181 182 183 184 185 186 187 188 189 190 191 192 193 194 195 196 197 198 199 200 201 202 203 204 205 206 207 208 209 210 211 212 213 214 215 216 218 219 220 221',
    episodes: 'oOgw-okvBMA PspXPHXMA6I ufCDB2RSBsM VgyAmU8gjqU UXa03zHvkqQ VNUx0CHyiYA HopI3jMNUKE NP-7WpdyNs4 egwTXeD9OBQ YggEifmXccA j8CGaxEXH1o 4D40gVVkiis l69jeCUhX5w eU55yO3RRj0 y2fT3VkmlLo f9Ab8MxVECQ rW0jrrYsAig sD8R87-Rjto C5sVE-GQmas Z0vc-ILTPb4 2ePyEuKN3Y0 NU4vU4cfcjY DU83wp5XS-0 0MEbwku6eeQ _qNMQ63Zvec easCqVrQTjQ 1kUlrSzZXeg eSfnlssGwbk _OlQtDQ3PXk GM9xvOiaxIw 1vd_g_EGyu8 CCDJ0n3y5GU ouWHqqNLnuo 8bnG2dtYA5E -jMy5u8j7Zk LVkiSONVn1U YJm0aK6K7m0 Ehd3ASSCc_4 PXC88up-u3M Cbc-3ZNbvmg 8n4QZEubzvA qGGRldMRH7A zVcblp2zILc 1nNAnSvI-2A HPVDncnP4eY MLu3mPbFLTg SP1LCJB_3yg q5ijepeSI6U DVAH8bboNmo SESfRQGfG5Y GvmWHxriDEc JAmY7Y87Q88 Arl9a2XhIzs pa8_45uqu-0 yqfdmbVmpoA QTICP69jjYI LZfGULI12aE qX5JVpcqw1I eYnrn8IIWZI PPgIUuaf5cA _AO38t8Is90 3XI3_-D7FT8 rkv-SDY8_-U W-kKO0s-EV0 EcHFsJkpKRI YWjU0MXcPa8 Qt__sefpYz8 xbhF6lEDhKQ 1FZUH7DFfv0 1EuMe4b3tDk uD1I-lI7ins YVQ7LI__OX8 HdtFjRbYODo 0owA6f0k-AA kvfH8kh1OUI 5NeckXjqMqQ cu54hl9WZA8 VSHrjt51Tzw zgKc0W6HE5Y u_c4c98lwDU yYGoPtm7jzM U44JozK9UnE FoL_rGFIn1I rU6v2egs9uA Bzu-e2D3orQ msn7qLNXFI4 AKUmmIm-VnA PmSnjTTx1yo cctbSWQbwAE VZ4jA2TOnKU TgNl4mQxJVA CTP8MAMpzlg WEnvGYADnho cO0kdlrrMsQ nk-N-m3viGQ x4KRJ3evl7E mIX_tWUwARY H4pxAw3Q3kU S8fn-1-iQV8 LaPhDKamRY8 maruTg3jd_A dto8ve-lIN4 J1IVboDUdZ8 Wi_JUzTKLvc 1EVYk2Xwt1U JjZ2ey7R4GQ zuWb4e6oJY0 MXkkDRsc01o 0dFyt9DzVLg hTswMYjMyok bTt6CvmKZl0 6RdfOU14PeM vK5k01iTByg cDM6bwPpKuw Mc2vFKtoUvM JbtHkP-M6Cw 0OTayT-c5CQ -vTG6TFXtCc Pw8lcQiWP9M GtLEkohX-Ls NF42rjo5Lkk xhp99AGEQmo WJ0nXUjfTSc 3e9R20PRqUo KzQ_58ZAhSM KQJr4XC9zGI eBKIezeMfFE qemEtXp8gy0 Gspy7f4aIkA 7mD0sW-NMug xqQ32-ciIE4 gWgtiXmTbVA DI-KE7raSZc iDL_SrB_Bx8 vm6-MYN7twY EGzN5j1ASNk vZmKFLn8tVc 7mDRfSmzIHU 9zrmujAjx2M Reh45PPpFCY Y73pmup879U aCW5Cweh7Us LDT0L6Kp_uQ eRSJ4PgFI9w YfYT1U414Bk LGP_-Bh_pNQ IpFTpdsZ8Uc vhZKMebmc6A JrhHOMRQVmM 03xH2xNZE14 CJ53RIhduII gUqM7tDgfyY WBNTYrXboOQ 5GLD-8ezFLw 6u2Ii4UCEW4 oE5g1tz1XuE my-97EG25yI pL_bqZ1xXLM l1vZlIbF_2U -O25N633N0E EMreeIb-KNI BVZzNCDiifk zbozRP5pW9g QXPZUHgkdlI vMwJQgwP8aI oKU_jv7wm1g Zv1FvEU6tvI -Voq9Mz2KEM R58h8MSburA Qwag-uXxxic EgAGZq5ZZn8 2y-oBg-rxw8 GVNEFMqanZw AOhPSWMlgPc n_8qPISS-nQ PveUBZW_hg4 7ULJSc9Wy50 O0DvTN55G9Y 0qpaKb_bgIE qShOVxgktB8 zsKR0XxMRuI Vqms-8_abdw hdUcVCkp8H0 E5SJw5kxuaA nMIWhvXR0Mg 2BaQcrcsMRQ o2_KB3hZsow 4YRbpsPSQx4 zLE2skrH1vo HLrvpxDE_lQ iBJoGjUyNg0 mfccA4_iU24 VsSLSrbGg50 nnPsxfsr1lE H4mJV_ys7qQ 95HbuSkIjpw B1CZtvzmknY ih0zLgVYqqE Dm1jBaLO9mM IGkZ-nZKQvA TlZQaUqtXts pw3cFgGa0-c 5LSxxmelF4E VhFzhgudkYE v0JMVJLPnGY tLx9PySvkjo -QiPBUpaVEs 8J3_RLaMo3U KQ41U5zDqhw GjUwZ6XlwGU hBv3nhtw41I 0QKi1kzlo6g c-AvUkr1NK8 BmAyJPGtksc WQE4BmKKBz8 2bkhMC94o1c 3aveUQj9030 yGVq5-UiYXg Wmo6WW9IF5Y' },
  { title: 'Comedy Circus', min: 56, official: true,
    nums: '1 2 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19',
    episodes: 'I7GcmW4LS0U PolyeeIuiwE AiB5OjV86ws 9tWwpCeVVGg bUsItAAgO0E vvIWYhGY8GU F2D_uJUcRUU qFta__ldPNo TAvRn6gZays ikWFf0B7-s4 TWcTPu2pkXk A-P_dwnQkCk b2TnaxsTL44 7uwB8GHQItc EUjYooXL5JA ob7OWI3a4ak Fu0rtuoicT4 z07LtqzGMVA' },
  { title: 'Kahani Comedy Circus Ki', min: 47, official: true,
    nums: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29',
    episodes: 'qGuj46ewihc cmhDdontHoE 9-WfIqqMCAc xR2yqd2Wf6c M1RiQr-sZ_k jfBMtrm1HdA iHeqM-ZLygY tWhma80IBgI WJ8CqY0Fb8g Z7EfQXizv-w uCl4r2Ui_BY ZkMb4uoF_Fo guKU5nFreSA RvGEV8N3Hro haVqMQg0GFE HZTLGvbrhnY _z0UePzjc9k yGYmuIa2zWg B2qdGnjnLcM aTaGP2hmywM tNFQ2_1PIeM 2SCXOMqwWhI Mi7mFvrjeXY 4sDtSZkyufU HVd2o4X93jA DzF6sPc_yn4 riHK8Y4s5Zg erghRmTZ7-E FbQ_-eJv71o' },
];
if (typeof window !== 'undefined') { window.TV_LIBRARY = TV_LIBRARY; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { TV_LIBRARY: TV_LIBRARY }; }
