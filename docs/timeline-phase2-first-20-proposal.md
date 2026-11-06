# On This Day: Phase 2 research proposal (first 20 events)

**Status: proposal only.** Nothing here is in production data. All 20 records are `published: false`, none has a review record, and the three decade data files are unchanged. Each event waits for the owner’s individual approval.

- Prepared: 7 November 2026, on branch `event-research-first-20`.
- Every source was opened on **6 November 2026** (`opened: '2026-11-06'`), and every `label` was checked against the live page that day.
- Written against `docs/timeline-editorial-guide.md` and the Phase 1 schema. All 20 records pass the real validator (see section 7).

## 1. Summary

| | Count |
|---|---|
| Verified | 12 |
| Probable | 7 |
| Disputed | 1 |
| Needs individual sensitivity approval | 1 (Pokhran) |
| Would show under Today (exact day) | 16 |
| Would show under By year only | 4 (Channel V, VSNL, Alisha Chinai, Pepsi) |
| Would go in the ticker | 0 (Phase 1 does not read it, and every record has `ticker: false`) |

Category mix: cricket 5, film 3, news 3, tech 3, society 2, tv 2, ads 1, music 1. Years covered: 1991 to 1999, with the most in 1994 (7).

**Thin spots, said plainly.** Indian television, Indipop and advertising are the weakest categories. Primary-grade sources for them are hard to find online, so those events come out Probable and several are year-only. I did not stretch a rating to fill the list. Cricket and film, where scorecard archives and studio pages exist, are the strongest.

## 2. The proposed 20

| # | Date | Event | Category | Confidence | Flag |
|---|---|---|---|---|---|
| 1 | 24 July 1991 | Union Budget 1991-92 presented | news | Verified |  |
| 2 | 2 October 1992 | Zee TV is launched | tv | Probable | More verification |
| 3 | 21 May 1994 | Sushmita Sen is crowned Miss Universe | society | Probable | More verification |
| 4 | 5 August 1994 | Hum Aapke Hain Koun..! is released | film | Verified |  |
| 5 | 9 September 1994 | Tendulkar makes his first ODI century in Colombo | cricket | Verified |  |
| 6 | 15 October 1994 | PSLV-D2 launches the IRS-P2 satellite | tech | Verified |  |
| 7 | 3 November 1994 | NSE begins trading in equities | news | Verified |  |
| 8 | 19 November 1994 | Aishwarya Rai is named Miss World | society | Probable | More verification |
| 9 | 1994 | Channel V launches | tv | Probable | More verification |
| 10 | 31 July 1995 | A mobile call is placed between Kolkata and Delhi | tech | Probable | More verification |
| 11 | August 1995 | VSNL begins public internet access | tech | Disputed | More verification |
| 12 | 20 October 1995 | Dilwale Dulhania Le Jayenge is released | film | Verified |  |
| 13 | 1995 | Alisha Chinai releases Made in India | music | Probable | More verification |
| 14 | 17 March 1996 | Sri Lanka win the 1996 World Cup final in Lahore | cricket | Verified |  |
| 15 | 1996 | Pepsi’s "Nothing Official About It" ads run through the 1996 World Cup | ads | Probable | More verification |
| 16 | 20 June 1996 | Ganguly and Dravid make their Test debuts at Lord’s | cricket | Verified |  |
| 17 | 30 October 1997 | Dil To Pagal Hai is released | film | Verified |  |
| 18 | 24 April 1998 | Tendulkar’s 134 wins the Sharjah Coca-Cola Cup final | cricket | Verified |  |
| 19 | 11 May 1998 | India carries out nuclear tests at Pokhran | news | Verified | Sensitivity approval |
| 20 | 7 February 1999 | Anil Kumble takes all ten wickets against Pakistan in Delhi | cricket | Verified |  |

## 3. What needs your attention

### 3.1 Needs additional verification (8 entries)

These are kept honestly at Probable or Disputed. Each is publishable as it stands if you accept the label, since the site shows the confidence chip. They are listed so you can decide whether to wait for better evidence.

- **Zee TV is launched** (Probable, 2 October 1992): Needs one independent source that states 2 October 1992. At present only Zee and its sister outlet give the day.
- **Sushmita Sen is crowned Miss Universe** (Probable, 21 May 1994): Needs the Miss Universe organisation’s own record, or a newspaper from the time.
- **Aishwarya Rai is named Miss World** (Probable, 19 November 1994): Needs the Miss World organisation’s own record. The date is one explicit statement plus a weekday inference.
- **Channel V launches** (Probable, 1994): Needs a month and day from a dated source. Check the date on the Indiantelevision.com page in a browser.
- **A mobile call is placed between Kolkata and Delhi** (Probable, 31 July 1995): Needs a primary record (Department of Telecommunications or the operator). Both sources are press.
- **VSNL begins public internet access** (Disputed, August 1995): The two sources point to different days. A VSNL, DoT or Tata Communications record would settle 14 versus 15 August.
- **Alisha Chinai releases Made in India** (Probable, 1995): Needs a label record or a period magazine for the release month.
- **Pepsi’s "Nothing Official About It" ads run through the 1996 World Cup** (Probable, 1996): Needs a 1996 source for the "Nothing Official About It" line. Both reports are years later.

### 3.2 Needs individual sensitivity approval (1 entry)

- **India carries out nuclear tests at Pokhran** (`sensitivity: 'review'`, reason `military`). Under the policy it stays unpublished until you approve it yourself and the record carries `sensitivityApprovedBy`, `sensitivityApprovedOn` and `reviewMode: 'individual'`. The facts are Verified. The wording is limited to the dates and the number of tests.

### 3.3 Judgement calls for you

- **Union Budget 1991-92** is marked `standard`, as in the approved Phase 1 candidate list. The reforms it launched are still debated, so you may prefer `review` with reason `political`. The summary states only who presented it and when.
- **Zee TV** is stated at day precision, as Probable. If you would rather not show a day that rests on Zee’s own statement, I can change it to October 1992 (month precision), which the independent source does support.
- **Source types.** Calls that are mine, not the guide’s: Jonathan’s Space Report as `authoritative` (a launch log), Wisden and the Federation of American Scientists as `reference`, studio and company film pages as `primary`, the BCCI’s own article as `primary`. Say if you class any differently.
- **The word "first"** appears in two records (Tendulkar’s first ODI century; the first mobile call). The validator prints a rule 9 warning for each, as designed. Each is backed by the sources named in its section.

## 4. The 20 records

Each section has the complete record in the data-file format, the date evidence, the reason for the rating and the open points. On approval, a record is added to `js/timeline-data-1990s.js`; none has been added.

### 1. Union Budget 1991-92 presented

**24 July 1991** (day precision) · news · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1991-07-24-union-budget',
  date: { y: 1991, m: 7, d: 24, precision: 'day' },
  title: 'Union Budget 1991-92 presented',
  summary: 'Finance Minister Manmohan Singh presented the Union Budget for 1991-92 on 24 July 1991.',
  category: 'news',
  confidence: 'verified',
  sources: [
    { publisher: 'Ministry of Finance', label: 'Budget 1991-92', url: 'https://www.indiabudget.gov.in/doc/bspeech/bs199192.pdf', type: 'primary', publishedOn: '1991-07-24', opened: '2026-11-06' },
    { publisher: 'Business Today', label: '35 years of liberalisation: How a Budget speech on this day in 1991 changed India’s economic trajectory', url: 'https://www.businesstoday.in/latest/economy/story/35-years-of-liberalisation-how-a-budget-speech-on-this-day-in-1991-changed-indias-economic-trajectory-545008-2026-07-24', type: 'press', publishedOn: '2026-07-24', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Ministry of Finance | primary | 1991-07-24 | [Budget 1991-92](https://www.indiabudget.gov.in/doc/bspeech/bs199192.pdf) |
| Business Today | press | 2026-07-24 | [35 years of liberalisation: How a Budget speech on this day in 1991 changed India’s economic trajectory](https://www.businesstoday.in/latest/economy/story/35-years-of-liberalisation-how-a-budget-speech-on-this-day-in-1991-changed-indias-economic-trajectory-545008-2026-07-24) |

**Evidence for the date**

- Ministry of Finance (primary): the document is titled "Budget 1991-92" and gives the speech date as 24 July 1991. It carries no separate publication date, so the speech date is used.
- Business Today (press, 24 Jul 2026, by Surabhi): says the Budget speech was on 24 July 1991.

**Why Verified:** Two independent publishers; one is the government’s own record of the speech.

**Open points:** Kept `standard`, as in the approved Phase 1 candidate list. The budget launched policies that are still debated, so you may prefer `review` (political). Your call at approval.

### 2. Zee TV is launched

**2 October 1992** (day precision) · tv · **Probable** · sensitivity standard · shows under Today and By year

```js
{
  id: '1992-10-02-zee-tv-launch',
  date: { y: 1992, m: 10, d: 2, precision: 'day' },
  title: 'Zee TV is launched',
  summary: 'Zee TV began broadcasting in India on 2 October 1992.',
  category: 'tv',
  confidence: 'probable',
  confidenceNote: 'The 2 October date comes from Zee’s own statement and from a news outlet in the same group. An independent outlet places the start in October 1992 only.',
  sources: [
    { publisher: 'Zee Entertainment', label: 'Global Media & Entertainment conglomerate, ZEE Entertainment completes 25 glorious years', url: 'https://www.zee.com/?p=4691', type: 'primary', publishedOn: '2017-10-26', opened: '2026-11-06' },
    { publisher: 'WION', label: 'October 2, 1992: Dr Subhash Chandra launched India’s first private satellite channel ‘Zee TV’', url: 'https://www.wionews.com/india-news/october-2-1992-dr-subhash-chandra-launched-indias-first-private-satellite-channel-zee-tv-417589/amp', type: 'press', publishedOn: '2021-10-01', opened: '2026-11-06', basedOn: 'https://www.zee.com/?p=4691' },
    { publisher: 'Outlook Business', label: 'The dream merchant', url: 'https://www.outlookbusiness.com/specials/super-seven/the-dream-merchant-1119', type: 'press', publishedOn: '2013-07-06', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Zee Entertainment | primary | 2017-10-26 | [Global Media & Entertainment conglomerate, ZEE Entertainment completes 25 glorious years](https://www.zee.com/?p=4691) |
| WION | press | 2021-10-01 | [October 2, 1992: Dr Subhash Chandra launched India’s first private satellite channel ‘Zee TV’](https://www.wionews.com/india-news/october-2-1992-dr-subhash-chandra-launched-indias-first-private-satellite-channel-zee-tv-417589/amp) |
| Outlook Business | press | 2013-07-06 | [The dream merchant](https://www.outlookbusiness.com/specials/super-seven/the-dream-merchant-1119) |

**Evidence for the date**

- Zee Entertainment (primary, page dated 26 Oct 2017): the company’s own 25-years announcement places the start of Zee TV on 2 October 1992.
- WION (press, 1 Oct 2021, by Akanksha Arora): the headline gives 2 October 1992. It cites no outside source. WION belongs to the same corporate group as Zee, so it is marked `basedOn` the company statement and does not count as independent.
- Outlook Business (press, 6 Jul 2013, by Krishna Gopalan): independent, but says only that Zee TV was set up in October 1992, after a satellite transponder was leased in early 1992. No day, and "set up" is not quite "launched".

**Why Probable:** Only the company and its sister outlet give the day. One independent source places the start in October 1992. That is not enough for Verified at day precision.

**Open points:** Needs one independent source that states 2 October 1992 (a newspaper from the time would be ideal). Without it, the owner may choose to show this at month precision instead.

### 3. Sushmita Sen is crowned Miss Universe

**21 May 1994** (day precision) · society · **Probable** · sensitivity standard · shows under Today and By year

```js
{
  id: '1994-05-21-sushmita-sen-miss-universe',
  date: { y: 1994, m: 5, d: 21, precision: 'day' },
  title: 'Sushmita Sen is crowned Miss Universe',
  summary: 'Sushmita Sen of India was crowned Miss Universe 1994 at the pageant held in Manila on 21 May 1994.',
  category: 'society',
  confidence: 'probable',
  confidenceNote: 'Two press reports agree. We have not found the Miss Universe organisation’s own record.',
  sources: [
    { publisher: 'The Philippine Star', label: 'The 1994 Miss U Pageant', url: 'https://philstar.com/entertainment/2014/05/23/1326081/1994-miss-u-pageant', type: 'press', publishedOn: '2014-05-23', opened: '2026-11-06' },
    { publisher: 'GMA Network', label: 'Sushmita Sen recalls the moment 31 years ago that changed her universe forever', url: 'https://www.gmanetwork.com/entertainment/showbiznews/sushmita-sen-recalls-the-moment-31-years-ago-that-changed-her-universe-forever/122768', type: 'press', publishedOn: '2025-05-23', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| The Philippine Star | press | 2014-05-23 | [The 1994 Miss U Pageant](https://philstar.com/entertainment/2014/05/23/1326081/1994-miss-u-pageant) |
| GMA Network | press | 2025-05-23 | [Sushmita Sen recalls the moment 31 years ago that changed her universe forever](https://www.gmanetwork.com/entertainment/showbiznews/sushmita-sen-recalls-the-moment-31-years-ago-that-changed-her-universe-forever/122768) |

**Evidence for the date**

- The Philippine Star (press, 23 May 2014, by Ricky Lo): says the pageant was held on 21 May at the PICC, with the start time given in Manila time, and that the winner was Sushmita Sen of India.
- GMA Network (press, 23 May 2025): gives 21 May 1994 and says the pageant was held in Manila.

**Why Probable:** Two independent publishers agree on the day, but both are press and neither is a primary record.

**Open points:** Needs the Miss Universe organisation’s own record (or a contemporary newspaper) to reach Verified.

### 4. Hum Aapke Hain Koun..! is released

**5 August 1994** (day precision) · film · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1994-08-05-hum-aapke-hain-koun-release',
  date: { y: 1994, m: 8, d: 5, precision: 'day' },
  title: 'Hum Aapke Hain Koun..! is released',
  summary: 'Hum Aapke Hain Koun..! was released in cinemas on 5 August 1994.',
  category: 'film',
  confidence: 'verified',
  sources: [
    { publisher: 'Rajshri Entertainment', label: 'Hum Aapke Hain Koun..! (1994)', url: 'https://rajshri.com/?p=90506', type: 'primary', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'India TV News', label: 'Renuka Shahane shares Hum Aapke Hain Koun memories as Salman-Madhuri starrer completes 27 years', url: 'https://www.indiatvnews.com/entertainment/celebrities/renuka-shahane-shares-hum-aapke-hain-koun-memories-as-salman-madhuri-starrer-completes-27-years-724502', type: 'press', publishedOn: '2021-08-05', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Rajshri Entertainment | primary | undated | [Hum Aapke Hain Koun..! (1994)](https://rajshri.com/?p=90506) |
| India TV News | press | 2021-08-05 | [Renuka Shahane shares Hum Aapke Hain Koun memories as Salman-Madhuri starrer completes 27 years](https://www.indiatvnews.com/entertainment/celebrities/renuka-shahane-shares-hum-aapke-hain-koun-memories-as-salman-madhuri-starrer-completes-27-years-724502) |

**Evidence for the date**

- Rajshri Entertainment (primary): the company’s film page lists the release date as 5 August 1994. The page shows no publication date (only a 2021 copyright line), so it is recorded as `undated`.
- India TV News (press, 5 Aug 2021): says the film was released on 5 August 1994.

**Why Verified:** The rights holder’s own page plus an independent press report.

**Open points:** Cinestaan (5 Aug 2019 by its URL) also gives 5 August 1994, but its page shows no publisher or date, so it is not cited.

### 5. Tendulkar makes his first ODI century in Colombo

**9 September 1994** (day precision) · cricket · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1994-09-09-tendulkar-first-odi-century',
  date: { y: 1994, m: 9, d: 9, precision: 'day' },
  title: 'Tendulkar makes his first ODI century in Colombo',
  summary: 'Sachin Tendulkar scored 110 off 130 balls against Australia in Colombo, his first century in one-day internationals. India won by 31 runs.',
  category: 'cricket',
  confidence: 'verified',
  sources: [
    { publisher: 'CricketArchive', label: 'India v Australia, R Premadasa Stadium, Colombo, 9 September 1994 (scorecard)', url: 'https://cricketarchive.com/Archive/Scorecards/59/59465.html', type: 'authoritative', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'Scroll.in', label: 'Pause, rewind, play: When Tendulkar ended a long wait for first ODI ton, fittingly against Australia', url: 'https://scroll.in/field/972617/pause-rewind-play-when-tendulkar-ended-a-long-wait-for-first-odi-ton-fittingly-against-australia', type: 'press', publishedOn: '2020-09-09', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| CricketArchive | authoritative | undated | [India v Australia, R Premadasa Stadium, Colombo, 9 September 1994 (scorecard)](https://cricketarchive.com/Archive/Scorecards/59/59465.html) |
| Scroll.in | press | 2020-09-09 | [Pause, rewind, play: When Tendulkar ended a long wait for first ODI ton, fittingly against Australia](https://scroll.in/field/972617/pause-rewind-play-when-tendulkar-ended-a-long-wait-for-first-odi-ton-fittingly-against-australia) |

**Evidence for the date**

- CricketArchive (scorecard archive): a 50-over day/night match at R Premadasa Stadium, Colombo, on 9 September 1994. India won by 31 runs. The page has no usable title and no publication date; the label describes the scorecard.
- Scroll.in (press, 9 Sep 2020, Scroll Staff): the headline calls it his first ODI ton, against Australia, and the piece dates it to 9 September 1994 in Colombo.

**Why Verified:** A scorecard archive and an independent press report agree on the day.

**Open points:** The word "first" is supported by Scroll.in. The validator prints a warning for it by design. The 110 off 130 balls is from the CricketArchive scorecard as read in my first research pass.

### 6. PSLV-D2 launches the IRS-P2 satellite

**15 October 1994** (day precision) · tech · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1994-10-15-pslv-d2-launch',
  date: { y: 1994, m: 10, d: 15, precision: 'day' },
  title: 'PSLV-D2 launches the IRS-P2 satellite',
  summary: 'ISRO’s second development flight of the Polar Satellite Launch Vehicle, PSLV-D2, lifted off from Sriharikota on 15 October 1994 carrying the IRS-P2 satellite.',
  category: 'tech',
  confidence: 'verified',
  sources: [
    { publisher: 'ISRO', label: 'IRS-P2', url: 'https://www.isro.gov.in/ISRO_EN/IRS_P2.html', type: 'primary', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'Jonathan’s Space Report', label: 'Jonathan’s Space Report No. 215', url: 'https://planet4589.org/space/jsr/back/news.215.txt', type: 'authoritative', publishedOn: '1994-10-18', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| ISRO | primary | undated | [IRS-P2](https://www.isro.gov.in/ISRO_EN/IRS_P2.html) |
| Jonathan’s Space Report | authoritative | 1994-10-18 | [Jonathan’s Space Report No. 215](https://planet4589.org/space/jsr/back/news.215.txt) |

**Evidence for the date**

- ISRO (primary): the mission page gives 15 October 1994 and the vehicle PSLV-D2. No publication date on the page.
- Jonathan’s Space Report No. 215 (a space-launch newsletter, issue dated 18 Oct 1994, three days after the launch): reports that ISRO scored a success on 15 October.

**Why Verified:** The space agency’s own record plus an independent, contemporary launch log.

**Open points:** The type `authoritative` for Jonathan’s Space Report is my judgement (a launch log rather than a news report). Say if you would class it differently. "Second development flight" and "Sriharikota" come from my first research pass of the ISRO page.

### 7. NSE begins trading in equities

**3 November 1994** (day precision) · news · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1994-11-03-nse-equity-trading-begins',
  date: { y: 1994, m: 11, d: 3, precision: 'day' },
  title: 'NSE begins trading in equities',
  summary: 'The National Stock Exchange started trading in its capital market (equities) segment on 3 November 1994.',
  category: 'news',
  confidence: 'verified',
  sources: [
    { publisher: 'National Stock Exchange of India', label: 'About Equities', url: 'https://www.nseindia.com/static/products-services/about-equity-market', type: 'primary', publishedOn: '2025-05-06', opened: '2026-11-06' },
    { publisher: 'Business Standard', label: 'NSE’s capital market segment turns 21', url: 'https://www.business-standard.com/amp/article/markets/nse-s-capital-market-segment-turns-21-115110300947_1.html', type: 'press', publishedOn: '2015-11-03', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| National Stock Exchange of India | primary | 2025-05-06 | [About Equities](https://www.nseindia.com/static/products-services/about-equity-market) |
| Business Standard | press | 2015-11-03 | [NSE’s capital market segment turns 21](https://www.business-standard.com/amp/article/markets/nse-s-capital-market-segment-turns-21-115110300947_1.html) |

**Evidence for the date**

- NSE (primary): says trading in the equities (capital market) segment began on 3 November 1994. The page shows "Updated on 06/05/2025" and no original publication date; that update date is recorded as `publishedOn`.
- Business Standard (press, 3 Nov 2015, by Puneet Wadhwa): the headline marks the 21st anniversary of the capital market segment, which fits a 3 November 1994 start.

**Why Verified:** The exchange’s own page plus an independent press report.

**Open points:** Convention to confirm: for a page that shows only an "updated on" stamp, I used that stamp as `publishedOn`. The Business Standard article is dated on the anniversary itself; I read the start date from it in my first research pass.

### 8. Aishwarya Rai is named Miss World

**19 November 1994** (day precision) · society · **Probable** · sensitivity standard · shows under Today and By year

```js
{
  id: '1994-11-19-aishwarya-rai-miss-world',
  date: { y: 1994, m: 11, d: 19, precision: 'day' },
  title: 'Aishwarya Rai is named Miss World',
  summary: 'Aishwarya Rai of India was named Miss World 1994 at the pageant held in Sun City, South Africa, on 19 November 1994.',
  category: 'society',
  confidence: 'probable',
  confidenceNote: 'Two press reports agree. One gives the date outright, the other gives only "Saturday". We have not found the Miss World organisation’s own record.',
  sources: [
    { publisher: 'Deseret News', label: 'Miss India takes world title', url: 'https://www.deseret.com/1994/11/20/19143521/miss-india-takes-world-title/', type: 'press', publishedOn: '1994-11-20', opened: '2026-11-06' },
    { publisher: 'India TV News', label: 'This day, that year: Aishwarya Rai brought home the Miss World crown in 1994', url: 'https://indiatvnews.com/amp/entertainment/celebrities/aishwarya-rai-miss-world-crown-november-19-1994-564950', type: 'press', publishedOn: '2019-11-19', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Deseret News | press | 1994-11-20 | [Miss India takes world title](https://www.deseret.com/1994/11/20/19143521/miss-india-takes-world-title/) |
| India TV News | press | 2019-11-19 | [This day, that year: Aishwarya Rai brought home the Miss World crown in 1994](https://indiatvnews.com/amp/entertainment/celebrities/aishwarya-rai-miss-world-crown-november-19-1994-564950) |

**Evidence for the date**

- Deseret News (press, 20 Nov 1994, a contemporary report; the headline is printed in capitals): names Aishwarya Rai as the Miss World 1994 winner, named on Saturday, at Sun City, a resort in the former Bophuthatswana homeland. It gives the day as a Saturday but not the date; the Saturday before 20 November 1994 is 19 November.
- India TV News (press, 19 Nov 2019): gives 19 November 1994 as the day she won. It does not name the venue.

**Why Probable:** Two independent publishers, one of them contemporary, but neither is a primary record.

**Open points:** Needs the Miss World organisation’s own record to reach Verified. The 19 November date rests on one explicit statement plus a weekday inference.

### 9. Channel V launches

**1994** (year precision) · tv · **Probable** · sensitivity standard · shows under By year only

```js
{
  id: '1994-channel-v-launch',
  date: { y: 1994, precision: 'year' },
  title: 'Channel V launches',
  summary: 'The music channel Channel V launched in 1994. The two sources we opened give the year, not the month or day.',
  category: 'tv',
  confidence: 'probable',
  confidenceNote: 'Two sources give the year only. No month or day found.',
  sources: [
    { publisher: 'Business Standard', label: 'The rise and fall of Brand [V]', url: 'https://www.business-standard.com/amp/article/current-affairs/the-rise-and-fall-of-channel-v-117120300770_1.html', type: 'press', publishedOn: '2017-12-03', opened: '2026-11-06' },
    { publisher: 'Indiantelevision.com', label: 'Channel V: A walk down memory lane', url: 'https://wordpress.indiantelevision.com/?p=86283', type: 'press', publishedOn: 'undated', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Business Standard | press | 2017-12-03 | [The rise and fall of Brand \[V\]](https://www.business-standard.com/amp/article/current-affairs/the-rise-and-fall-of-channel-v-117120300770_1.html) |
| Indiantelevision.com | press | undated | [Channel V: A walk down memory lane](https://wordpress.indiantelevision.com/?p=86283) |

**Evidence for the date**

- Business Standard (press, 3 Dec 2017, by Urvi Malvania): says Channel V launched in 1994, after Star and Viacom fell out over how to adapt MTV for India. No month or day.
- Indiantelevision.com (trade press): also says 1994, no month or day. The page shows no publication date, author or other date; the only dates are years in the text. Recorded as `undated`.

**Why Probable:** Two independent publishers agree on the year. Year precision only, so it appears under By year and never under Today.

**Open points:** Needs a month and day from a dated source. The Indiantelevision.com page may carry a date that a browser shows but my page reader did not.

### 10. A mobile call is placed between Kolkata and Delhi

**31 July 1995** (day precision) · tech · **Probable** · sensitivity standard · shows under Today and By year

```js
{
  id: '1995-07-31-mobile-call-kolkata-delhi',
  date: { y: 1995, m: 7, d: 31, precision: 'day' },
  title: 'A mobile call is placed between Kolkata and Delhi',
  summary: 'On 31 July 1995 West Bengal Chief Minister Jyoti Basu in Kolkata and Union Communications Minister Sukh Ram in Delhi spoke on the Modi Telstra mobile network. Both sources call it India’s first mobile call.',
  category: 'tech',
  confidence: 'probable',
  confidenceNote: 'Two press reports agree on the date. No primary record found yet.',
  sources: [
    { publisher: 'Voice&Data', label: 'Dialling into the past: Celebrating 30 years of mobile connectivity in India', url: 'https://www.voicendata.com/mobile-phones/dialling-into-the-past-celebrating-29-years-of-mobile-connectivity-in-india-9608829', type: 'press', publishedOn: '2025-07-31', opened: '2026-11-06' },
    { publisher: 'Business Standard', label: 'ATC India’s Umang Das recalls the day India’s mobile revolution began', url: 'https://business-standard.com/article/opinion/atc-india-s-umang-das-recalls-the-day-india-s-mobile-revolution-began-120072301938_1.html', type: 'press', publishedOn: '2020-07-24', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Voice&Data | press | 2025-07-31 | [Dialling into the past: Celebrating 30 years of mobile connectivity in India](https://www.voicendata.com/mobile-phones/dialling-into-the-past-celebrating-29-years-of-mobile-connectivity-in-india-9608829) |
| Business Standard | press | 2020-07-24 | [ATC India’s Umang Das recalls the day India’s mobile revolution began](https://business-standard.com/article/opinion/atc-india-s-umang-das-recalls-the-day-india-s-mobile-revolution-began-120072301938_1.html) |

**Evidence for the date**

- Voice&Data (press, 31 Jul 2025, by Ayushi Singh): dates the call to 31 July 1995, made in Calcutta (now Kolkata), a conversation between Sukh Ram and Jyoti Basu on the Modi Telstra network, with a Nokia phone. Calls it India’s first mobile call. It does not say who placed it or where Sukh Ram was.
- Business Standard (opinion piece, 24 Jul 2020, by Umang Das): says Basu called Sukh Ram on 31 July 1995, with Basu in a Kolkata hotel and Sukh Ram in Delhi; names Modi Telstra (later Spice) as the operator, with Nokia equipment. Calls it the first mobile call.

**Why Probable:** Two independent press reports agree. This matches the rating in the approved Phase 1 candidate list.

**Open points:** Needs a primary record (Department of Telecommunications or the operator). The Business Standard piece is an opinion column by an industry figure. Only Business Standard says who called whom and where Sukh Ram was, so the summary leaves out who placed the call. "First" is supported by both sources; the validator will print a warning for it.

### 11. VSNL begins public internet access

**August 1995** (month precision) · tech · **Disputed** · sensitivity standard · shows under By year only

```js
{
  id: '1995-08-vsnl-public-internet',
  date: { y: 1995, m: 8, precision: 'month' },
  title: 'VSNL begins public internet access',
  summary: 'VSNL opened its Gateway Internet Access Service to the public in several Indian cities in August 1995. One source reads as 14 August, another gives 15 August, so no day is shown.',
  category: 'tech',
  confidence: 'disputed',
  confidenceNote: 'Voice&Data, quoting the memoir of the VSNL chief at the time, says the launch was set for 15 August but was "actually the day before", which reads as 14 August though it never states that date. The Better India says 15 August and cites interviews, no document.',
  sources: [
    { publisher: 'Voice&Data', label: 'The internet comes to India', url: 'https://www.voicendata.com/internet-comes-india', type: 'press', publishedOn: '2020-09-29', opened: '2026-11-06' },
    { publisher: 'The Better India', label: 'From One Internet Launch to 900 Million Users: How Independence Day 1995 Connected India', url: 'https://thebetterindia.com/485523/internet-india-launch-independence-day-vsnl-1995', type: 'press', publishedOn: '2025-08-13', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Voice&Data | press | 2020-09-29 | [The internet comes to India](https://www.voicendata.com/internet-comes-india) |
| The Better India | press | 2025-08-13 | [From One Internet Launch to 900 Million Users: How Independence Day 1995 Connected India](https://thebetterindia.com/485523/internet-india-launch-independence-day-vsnl-1995) |

**Evidence for the date**

- Voice&Data (press, 29 Sep 2020): an excerpt from Brijendra K. Syngal’s book Telecom Man: Leading from the Front in India’s Digital Revolution (with Sandipan Deb). It says the launch was set as 15 August 1995, "actually the day before", so the announcement could fall on Independence Day, and that the service was launched together from five cities. Read literally that is 14 August; the text never states the date.
- The Better India (press, 13 Aug 2025, by Hiren Kumar Bose): dates the launch to 15 August 1995, Independence Day. It rests on interviews and a LinkedIn post by Neeraj Sonker (then VSNL general manager, Internet Services) and on Suchit Nanda’s account. It cites no official record or 1995 press report.

**Why Disputed:** The two sources point to different days, so the day is not shown. Month precision, Disputed, as in the approved candidate list.

**Open points:** A VSNL, Department of Telecommunications or Tata Communications record would settle 14 versus 15 August. Voice&Data is a first-hand account but its wording is ambiguous, so please read the page yourself.

### 12. Dilwale Dulhania Le Jayenge is released

**20 October 1995** (day precision) · film · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1995-10-20-ddlj-release',
  date: { y: 1995, m: 10, d: 20, precision: 'day' },
  title: 'Dilwale Dulhania Le Jayenge is released',
  summary: 'Yash Raj Films released Dilwale Dulhania Le Jayenge in cinemas on 20 October 1995.',
  category: 'film',
  confidence: 'verified',
  sources: [
    { publisher: 'Yash Raj Films', label: 'Dilwale Dulhania Le Jayenge Movie - Video Songs, Movie Trailer, Cast & Crew Details', url: 'https://www.yashrajfilms.com/movies/dilwale-dulhania-le-jayenge', type: 'primary', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'Business Insider India', label: 'As DDLJ turns 20, here are 20 facts that you probably never knew about this classic', url: 'https://www.businessinsider.in/as-ddlj-turns-20-here-are-20-facts-that-you-probably-never-knew-about-this-classic/amp_articleshow/49466599.cms', type: 'press', publishedOn: '2015-10-20', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Yash Raj Films | primary | undated | [Dilwale Dulhania Le Jayenge Movie - Video Songs, Movie Trailer, Cast & Crew Details](https://www.yashrajfilms.com/movies/dilwale-dulhania-le-jayenge) |
| Business Insider India | press | 2015-10-20 | [As DDLJ turns 20, here are 20 facts that you probably never knew about this classic](https://www.businessinsider.in/as-ddlj-turns-20-here-are-20-facts-that-you-probably-never-knew-about-this-classic/amp_articleshow/49466599.cms) |

**Evidence for the date**

- Yash Raj Films (primary): the studio’s film page lists the release date as 20 October 1995. The page shows no publication date of its own (the one date near the top belongs to an unrelated news item), so it is recorded as `undated`.
- Business Insider India (press, 20 Oct 2015): gives 20 October 1995 as the release date. No author shown.

**Why Verified:** The producer’s own page plus an independent press report.

**Open points:** None.

### 13. Alisha Chinai releases Made in India

**1995** (year precision) · music · **Probable** · sensitivity standard · shows under By year only

```js
{
  id: '1995-alisha-chinai-made-in-india',
  date: { y: 1995, precision: 'year' },
  title: 'Alisha Chinai releases Made in India',
  summary: 'Alisha Chinai’s album Made in India came out in 1995. Two sources give the year. We do not have the month or day.',
  category: 'music',
  confidence: 'probable',
  confidenceNote: 'Two sources give the year only.',
  sources: [
    { publisher: 'Highonscore', label: 'Made In India, The Album That Made Alisha Chinai The ‘Queen Of Indipop’: Score Indie Classics – Score Short Reads', url: 'https://highonscore.com/?p=14175', type: 'press', publishedOn: '2021-03-22', opened: '2026-11-06' },
    { publisher: 'South Asian Herald', label: 'Alisha Chinoy: 6 Anthems of An Unforgettable Diva', url: 'https://southasianherald.com/alisha-chinoy-6-anthems-of-an-unforgettable-diva/', type: 'press', publishedOn: '2026-03-17', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Highonscore | press | 2021-03-22 | [Made In India, The Album That Made Alisha Chinai The ‘Queen Of Indipop’: Score Indie Classics – Score Short Reads](https://highonscore.com/?p=14175) |
| South Asian Herald | press | 2026-03-17 | [Alisha Chinoy: 6 Anthems of An Unforgettable Diva](https://southasianherald.com/alisha-chinoy-6-anthems-of-an-unforgettable-diva/) |

**Evidence for the date**

- Highonscore (press, 22 Mar 2021, by Shaurya Singh Thapa): places the album’s release in 1995, no month.
- South Asian Herald (press, 17 Mar 2026, by Rajiv Vijayakar): lists the album as a 1995 release.

**Why Probable:** Two independent publishers agree on the year. Year precision only.

**Open points:** A Wikipedia page for the album lists a cassette release on 26 April 1995 and a CD on 8 May 1995, but I found no second source, so no month is claimed. A label record (Magnasound) or a period magazine would settle it. The artist’s name is spelled Chinai and Chinoy in the two sources.

### 14. Sri Lanka win the 1996 World Cup final in Lahore

**17 March 1996** (day precision) · cricket · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1996-03-17-sri-lanka-win-world-cup-final',
  date: { y: 1996, m: 3, d: 17, precision: 'day' },
  title: 'Sri Lanka win the 1996 World Cup final in Lahore',
  summary: 'Sri Lanka beat Australia by seven wickets in the final of the 1996 cricket World Cup at the Gaddafi Stadium in Lahore on 17 March 1996.',
  category: 'cricket',
  confidence: 'verified',
  sources: [
    { publisher: 'ESPNcricinfo', label: 'Australia vs Sri Lanka, Final at Lahore, Mar 17 1996 - Match Result', url: 'https://www.espncricinfo.com/series/8039/game/65192', type: 'authoritative', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'CricketArchive', label: 'Australia v Sri Lanka, Wills World Cup 1995/96 (Final), Lahore, 17 March 1996 (scorecard)', url: 'https://cricketarchive.com/Archive/Scorecards/61/61955.html', type: 'authoritative', publishedOn: 'undated', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| ESPNcricinfo | authoritative | undated | [Australia vs Sri Lanka, Final at Lahore, Mar 17 1996 - Match Result](https://www.espncricinfo.com/series/8039/game/65192) |
| CricketArchive | authoritative | undated | [Australia v Sri Lanka, Wills World Cup 1995/96 (Final), Lahore, 17 March 1996 (scorecard)](https://cricketarchive.com/Archive/Scorecards/61/61955.html) |

**Evidence for the date**

- ESPNcricinfo (scorecard archive): Australia v Sri Lanka, the final, at Lahore on 17 March 1996. Sri Lanka won by 7 wickets with 22 balls remaining. No publication date on the page.
- CricketArchive (scorecard archive): the Wills World Cup 1995/96 final at Gaddafi Stadium, Lahore, on 17 March 1996. Australia 241/7 in 50 overs, Sri Lanka 245/3 in 46.2. The page has no usable title and no publication date; the label describes the scorecard.

**Why Verified:** Two independent scorecard archives agree.

**Open points:** An earlier draft cited cricketarchive.co.uk. That domain now returns a page titled "Pakistan Cricket - our cricket website", so I switched to cricketarchive.com.

### 15. Pepsi’s "Nothing Official About It" ads run through the 1996 World Cup

**1996** (year precision) · ads · **Probable** · sensitivity standard · shows under By year only

```js
{
  id: '1996-pepsi-nothing-official-about-it',
  date: { y: 1996, precision: 'year' },
  title: 'Pepsi’s "Nothing Official About It" ads run through the 1996 World Cup',
  summary: 'Coca-Cola was the official sponsor of the 1996 cricket World Cup. Pepsi ran its own "Nothing Official About It" ads with Indian cricketers through the tournament.',
  category: 'ads',
  confidence: 'probable',
  confidenceNote: 'Two press reports, both written years later. Only one of them names the "Nothing Official About It" line. No month found.',
  sources: [
    { publisher: 'Storyboard18', label: 'How Pepsi’s ‘Nothing Official About It’ campaign stole the ‘thanda’ from Coca-Cola', url: 'https://www.storyboard18.com/advertising/how-pepsis-nothing-official-about-it-campaign-stole-the-cool-factor-from-coca-cola-51236.htm', type: 'press', publishedOn: '2024-12-22', opened: '2026-11-06' },
    { publisher: 'Hindustan Times', label: 'Cup storm in tag lines and jingles', url: 'https://magzter.com/stories/newspaper/Hindustan-Times/CUP-STORM-IN-TAG-LINES-AND-JINGLES', type: 'press', publishedOn: '2023-10-18', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Storyboard18 | press | 2024-12-22 | [How Pepsi’s ‘Nothing Official About It’ campaign stole the ‘thanda’ from Coca-Cola](https://www.storyboard18.com/advertising/how-pepsis-nothing-official-about-it-campaign-stole-the-cool-factor-from-coca-cola-51236.htm) |
| Hindustan Times | press | 2023-10-18 | [Cup storm in tag lines and jingles](https://magzter.com/stories/newspaper/Hindustan-Times/CUP-STORM-IN-TAG-LINES-AND-JINGLES) |

**Evidence for the date**

- Storyboard18 (press, 22 Dec 2024, by Kashmeera Sambamurthy): Coca-Cola outbid Pepsi for the drinks sponsorship of the 1996 World Cup, and Pepsi answered with the 1996 "Nothing Official About It" campaign featuring cricketers including Sachin Tendulkar, Vinod Kambli and Mohammed Azharuddin. A second Storyboard18 article says the same; both are from one publisher, so they count as one source and only the dated one is cited.
- Hindustan Times (press, 18 Oct 2023, by Dhiman Sarkar; the link is the Magzter reprint): says Pepsi ran television ads throughout the tournament in India, Pakistan and Sri Lanka, with cricketers and umpire Dickie Bird, though Coca-Cola was the official partner. It does not quote the tag line.

**Why Probable:** The year is solid. The campaign name rests on one publisher, and both reports are retrospective.

**Open points:** Needs a contemporary 1996 source (a newspaper, trade magazine or the agency’s own record) for the tag line and ideally a month. Advertising dates are rarely documented to the day.

### 16. Ganguly and Dravid make their Test debuts at Lord’s

**20 June 1996** (day precision) · cricket · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1996-06-20-ganguly-dravid-test-debuts',
  date: { y: 1996, m: 6, d: 20, precision: 'day' },
  title: 'Ganguly and Dravid make their Test debuts at Lord’s',
  summary: 'Sourav Ganguly and Rahul Dravid both made their Test debuts in the Lord’s Test against England, which began on 20 June 1996. Ganguly scored 131.',
  category: 'cricket',
  confidence: 'verified',
  sources: [
    { publisher: 'ACS Cricket Archive', label: 'England v India, India in England 1996 (2nd Test)', url: 'https://stats.acscricket.com/Archive/Scorecards/62/62352.html', type: 'authoritative', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'Wisden', label: 'England v India, Lord’s Test match of 1996 – Almanack report', url: 'https://www.wisden.com/wisden-cricketers-almanack/england-v-india-lords-test-match-of-1996-almanack-report', type: 'reference', publishedOn: '2025-04-16', opened: '2026-11-06' },
    { publisher: 'The Week', label: '#OnThisDay: Sourav Ganguly registers a century on Test debut at Lord’s in 1996', url: 'https://www.theweek.in/news/sports/2025/06/22/on-this-day-sourav-ganguly-registers-a-century-on-test-debut-at-lord-s-in-1996.html', type: 'press', publishedOn: '2025-06-22', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| ACS Cricket Archive | authoritative | undated | [England v India, India in England 1996 (2nd Test)](https://stats.acscricket.com/Archive/Scorecards/62/62352.html) |
| Wisden | reference | 2025-04-16 | [England v India, Lord’s Test match of 1996 – Almanack report](https://www.wisden.com/wisden-cricketers-almanack/england-v-india-lords-test-match-of-1996-almanack-report) |
| The Week | press | 2025-06-22 | [#OnThisDay: Sourav Ganguly registers a century on Test debut at Lord’s in 1996](https://www.theweek.in/news/sports/2025/06/22/on-this-day-sourav-ganguly-registers-a-century-on-test-debut-at-lord-s-in-1996.html) |

**Evidence for the date**

- ACS Cricket Archive (scorecard archive): the 2nd Test, England v India, at Lord’s, 20 to 24 June 1996, drawn. The notes say both Ganguly and Dravid made their Test debuts in this match. No publication date on the page.
- Wisden (reference; the almanack report first appeared in the 1997 edition, this web page is dated 16 Apr 2025): same dates, says both made their Test debuts, and that Ganguly scored 131.
- The Week (press, 22 Jun 2025, by Hariprasad Sadanandan): says Ganguly scored 131 on debut at Lord’s on the third day of the Test, and that Dravid also debuted in the match.

**Why Verified:** A scorecard archive, an almanack and a press report agree.

**Open points:** ESPNcricinfo’s scorecard for the match did not mark the debuts and its day summaries disagreed with its own scorecard on Ganguly’s and Dravid’s runs, so it is not cited. The event date is the first day of the match, when both debuted.

### 17. Dil To Pagal Hai is released

**30 October 1997** (day precision) · film · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1997-10-30-dil-to-pagal-hai-release',
  date: { y: 1997, m: 10, d: 30, precision: 'day' },
  title: 'Dil To Pagal Hai is released',
  summary: 'Yash Raj Films released Dil To Pagal Hai in cinemas on 30 October 1997.',
  category: 'film',
  confidence: 'verified',
  sources: [
    { publisher: 'Yash Raj Films', label: 'Dil to Pagal Hai Movie - Video Songs, Movie Trailer, Cast & Crew Details', url: 'https://www.yashrajfilms.com/movies/dil-to-pagal-hai', type: 'primary', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'The Free Press Journal', label: '25 Years Of Dil To Pagal Hai: Six reasons why Yash Chopra’s epic blockbuster starring Shah Rukh Khan, Madhuri Dixit and Karisma Kapoor is one of Bollywood’s biggest trendsetters', url: 'https://www.freepressjournal.in/amp/entertainment/25-years-of-dil-to-pagal-hai-six-reasons-why-yash-chopras-epic-blockbuster-starring-shah-rukh-khan-madhuri-dixit-and-karisma-kapoor-is-one-of-bollywoods-biggest-trendsetters', type: 'press', publishedOn: '2022-10-30', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Yash Raj Films | primary | undated | [Dil to Pagal Hai Movie - Video Songs, Movie Trailer, Cast & Crew Details](https://www.yashrajfilms.com/movies/dil-to-pagal-hai) |
| The Free Press Journal | press | 2022-10-30 | [25 Years Of Dil To Pagal Hai: Six reasons why Yash Chopra’s epic blockbuster starring Shah Rukh Khan, Madhuri Dixit and Karisma Kapoor is one of Bollywood’s biggest trendsetters](https://www.freepressjournal.in/amp/entertainment/25-years-of-dil-to-pagal-hai-six-reasons-why-yash-chopras-epic-blockbuster-starring-shah-rukh-khan-madhuri-dixit-and-karisma-kapoor-is-one-of-bollywoods-biggest-trendsetters) |

**Evidence for the date**

- Yash Raj Films (primary): the studio’s film page lists the release date as 30 October 1997. No publication date of its own on the page (the one date shown belongs to an unrelated news item), so it is recorded as `undated`.
- The Free Press Journal (press, 30 Oct 2022, by Noorulain Sayed, the 25th anniversary): gives 30 October 1997 as the release date.

**Why Verified:** The producer’s own page plus an independent press report.

**Open points:** None. The Free Press Journal headline is reproduced as the URL spells it; the page’s own capitalisation may differ slightly.

### 18. Tendulkar’s 134 wins the Sharjah Coca-Cola Cup final

**24 April 1998** (day precision) · cricket · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1998-04-24-tendulkar-sharjah-final-134',
  date: { y: 1998, m: 4, d: 24, precision: 'day' },
  title: 'Tendulkar’s 134 wins the Sharjah Coca-Cola Cup final',
  summary: 'Sachin Tendulkar scored 134 off 131 balls as India beat Australia by six wickets in the Coca-Cola Cup final at Sharjah, on his 25th birthday.',
  category: 'cricket',
  confidence: 'verified',
  sources: [
    { publisher: 'ESPNcricinfo', label: 'Australia vs India, Final at Sharjah, Apr 24 1998 - Match Result', url: 'https://www.espncricinfo.com/series/61026/game/65774', type: 'authoritative', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'CricketArchive', label: 'Australia v India, Sharjah Cricket Association Stadium, 24 April 1998 (scorecard)', url: 'https://www.cricketarchive.com/Archive/Scorecards/65/65635.html', type: 'authoritative', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'Khaleej Times', label: 'This day, that year: When Tendulkar’s ‘Desert Storm’ destroyed Australia in Sharjah', url: 'https://www.khaleejtimes.com/sports/cricket/this-day-that-year-when-tendulkars-desert-storm-destroyed-australia-in-sharjah', type: 'press', publishedOn: '2022-04-22', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| ESPNcricinfo | authoritative | undated | [Australia vs India, Final at Sharjah, Apr 24 1998 - Match Result](https://www.espncricinfo.com/series/61026/game/65774) |
| CricketArchive | authoritative | undated | [Australia v India, Sharjah Cricket Association Stadium, 24 April 1998 (scorecard)](https://www.cricketarchive.com/Archive/Scorecards/65/65635.html) |
| Khaleej Times | press | 2022-04-22 | [This day, that year: When Tendulkar’s ‘Desert Storm’ destroyed Australia in Sharjah](https://www.khaleejtimes.com/sports/cricket/this-day-that-year-when-tendulkars-desert-storm-destroyed-australia-in-sharjah) |

**Evidence for the date**

- ESPNcricinfo (scorecard archive): the final, Australia v India, at Sharjah Cricket Association Stadium on 24 April 1998. India won by 6 wickets with 9 balls remaining. Tendulkar 134 (131 balls). No publication date.
- CricketArchive (scorecard archive): the same match, venue, date and result, Tendulkar 134 (131 balls). The page has no usable title and no publication date; the label describes the scorecard.
- Khaleej Times (press, 22 Apr 2022, ANI): says the final was played on 24 April, Tendulkar’s 25th birthday, and that he scored 134 off 131 balls in India’s chase of Australia’s 272/9.

**Why Verified:** Two scorecard archives and an independent press report agree.

**Open points:** The "25th birthday" and the name "Coca-Cola Cup" rest on the Khaleej Times piece. That piece also describes an earlier Tendulkar innings in the same tournament and mixes the scores in one passage, so I used it only for the final’s date, the 134 and the birthday.

### 19. India carries out nuclear tests at Pokhran

**11 May 1998** (day precision) · news · **Verified** · sensitivity review (military) · shows under Today and By year

```js
{
  id: '1998-05-11-pokhran-nuclear-tests',
  date: { y: 1998, m: 5, d: 11, precision: 'day' },
  title: 'India carries out nuclear tests at Pokhran',
  summary: 'India carried out three underground nuclear tests at Pokhran on 11 May 1998. Two more followed on 13 May.',
  category: 'news',
  confidence: 'verified',
  sources: [
    { publisher: 'Lok Sabha', label: 'Statement by Prime Minister: Recent Nuclear Tests in Pokhran', url: 'https://eparlib.nic.in/bitstream/123456789/800809/1/pms_12_02_27-05-1998.pdf', type: 'primary', publishedOn: '1998-05-27', opened: '2026-11-06' },
    { publisher: 'Federation of American Scientists', label: 'Shakti Nuclear Weapons Tests - India Nuclear Forces', url: 'https://nuke.fas.org/guide/india/nuke/shakti-pix.htm', type: 'reference', publishedOn: '2000-07-04', opened: '2026-11-06' }
  ],
  sensitivity: 'review',
  sensitivityReason: 'military',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| Lok Sabha | primary | 1998-05-27 | [Statement by Prime Minister: Recent Nuclear Tests in Pokhran](https://eparlib.nic.in/bitstream/123456789/800809/1/pms_12_02_27-05-1998.pdf) |
| Federation of American Scientists | reference | 2000-07-04 | [Shakti Nuclear Weapons Tests - India Nuclear Forces](https://nuke.fas.org/guide/india/nuke/shakti-pix.htm) |

**Evidence for the date**

- Lok Sabha (primary): Prime Minister Atal Bihari Vajpayee’s statement of 27 May 1998 says India carried out three underground nuclear tests at the Pokhran range on 11 May and two more on 13 May.
- Federation of American Scientists (reference): the page "Shakti Nuclear Weapons Tests May 11-13, 1998" lists three devices on 11 May and two on 13 May, each "per India’s claim". Last update shown: 4 Jul 2000, with no original publication date; that stamp is recorded.

**Why Verified:** A primary parliamentary record plus an independent reference page.

**Open points:** HELD FOR INDIVIDUAL SENSITIVITY APPROVAL (military). Stays unpublished until you approve it yourself; the record has no approval fields filled in.

### 20. Anil Kumble takes all ten wickets against Pakistan in Delhi

**7 February 1999** (day precision) · cricket · **Verified** · sensitivity standard · shows under Today and By year

```js
{
  id: '1999-02-07-kumble-ten-wickets',
  date: { y: 1999, m: 2, d: 7, precision: 'day' },
  title: 'Anil Kumble takes all ten wickets against Pakistan in Delhi',
  summary: 'Anil Kumble took all ten Pakistan wickets in the second innings of the Delhi Test, finishing with 10 for 74 from 26.3 overs. India won by 212 runs.',
  category: 'cricket',
  confidence: 'verified',
  sources: [
    { publisher: 'The Tribune', label: 'It’s like a dream; says Kumble', url: 'https://www.tribuneindia.com/1999/99feb08/sports.htm', type: 'press', publishedOn: '1999-02-08', opened: '2026-11-06' },
    { publisher: 'ESPNcricinfo', label: 'India vs Pakistan, 2nd Test at Delhi, Feb 04 1999 - Match Result', url: 'https://www.espncricinfo.com/series/15865/game/63829', type: 'authoritative', publishedOn: 'undated', opened: '2026-11-06' },
    { publisher: 'BCCI', label: 'Anil’s Perfect Ten', url: 'https://www.bcci.tv/news/article/anils-perfect-ten', type: 'primary', publishedOn: '2010-10-27', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '',
  reviewedOn: '',
  reviewMode: '',
  published: false
}
```

| Source | Type | Published | Page |
|---|---|---|---|
| The Tribune | press | 1999-02-08 | [It’s like a dream; says Kumble](https://www.tribuneindia.com/1999/99feb08/sports.htm) |
| ESPNcricinfo | authoritative | undated | [India vs Pakistan, 2nd Test at Delhi, Feb 04 1999 - Match Result](https://www.espncricinfo.com/series/15865/game/63829) |
| BCCI | primary | 2010-10-27 | [Anil’s Perfect Ten](https://www.bcci.tv/news/article/anils-perfect-ten) |

**Evidence for the date**

- The Tribune (press, 8 Feb 1999, a contemporary report; the link is the day’s sports page): a story headlined "It’s like a dream; says Kumble", datelined New Delhi, 7 February.
- ESPNcricinfo (scorecard archive): the 2nd Test, India v Pakistan, Delhi, 4 to 7 February 1999. India won by 212 runs. Kumble 4/75 and 10/74. No publication date on the page.
- BCCI (primary, the board’s own article, 27 Oct 2010): says Kumble took all ten on 7 February 1999 at Ferozeshah Kotla, New Delhi, figures 26.3-9-74-10.

**Why Verified:** A contemporary newspaper, a scorecard archive and the board’s own article agree.

**Open points:** None. The Test ran 4 to 7 February; the ten-wicket haul was completed on the last day. The Tribune link is a whole sports page, not a single article page.

## 5. Looked at, not included

These were researched and left out. They can come in a later batch if a better source turns up.

- **Shaktimaan (13 September 1997).** The date appears on Wikipedia, which cites a 2017 Indian Express article I could not open. No source I could open confirms it.
- **Kuch Kuch Hota Hai (16 October 1998).** Only press and reference pages found; no studio page that I could open. A good candidate once a Dharma Productions page is located.
- **MTV India launch.** The year is widely stated but the month was not confirmed in any source I could open.
- **Sun TV.** No source opened for a launch date.

## 6. Method and conventions

- **Evidence.** Dates are taken from the page itself. Each Verified entry has two or more independent publishers, at least one `primary` or `authoritative`. Where that was not possible the entry is Probable or Disputed, with a `confidenceNote`.
- **Own words.** Titles and summaries are written fresh and kept within the limits (titles up to 80 characters, summaries up to 280). Nothing is copied from a source.
- **Independence.** WION is part of the same group as Zee and gives no other source, so it is marked `basedOn` the Zee statement and does not count toward independence. A second Storyboard18 article was not cited, because one publisher counts once.
- **Labels.** Each `label` is the page’s real title. Three CricketArchive scorecards (Tendulkar’s first ODI century, the 1996 final, the Sharjah final) have no usable title, so their labels describe the scorecard. The Hindustan Times piece is linked through its Magzter reprint, and The Tribune link is the day’s sports page with the Kumble story on it.
- **`publishedOn`.** Pages with no date at all are `undated`: ISRO, company and studio film pages, and scorecard archives. Where a page shows only an "updated" stamp (NSE, Federation of American Scientists), that stamp is used. The Ministry of Finance speech has no publication date, so its speech date is used. The Wisden page is dated 16 April 2025, though the report first appeared in the 1997 almanack.
- **A source I dropped.** An earlier draft cited cricketarchive.co.uk for the 1996 final. That domain now returns a page called "Pakistan Cricket - our cricket website", so the entry cites cricketarchive.com instead.
- **Not done.** No browser check of the live site, no change to the homepage, navigation, ticker, Live TV, Arcade or timeline code, and no data added.

## 7. Validation result

All 20 records were run through `TimelineCore.validateEvent` and `validateSet` from `js/timeline-core.js`, the same code the site and tests use.

- Errors: **0** (per record and for the set).
- Warnings: **3**, all rule 9 (see 3.3): "first" in the Tendulkar title and summary, and "first" in the mobile-call summary. Each word is backed by the sources listed in its section.
- `liveEvents()` returns 0, because every record is `published: false`.
- The code blocks in this document were parsed back and compared with the validated records. They are identical.
- `js/timeline-data-1980s.js`, `-1990s.js` and `-2000s.js` are unchanged; each still holds 0 events.

## 8. Next step

Review the 20 one by one. For each, tell me approve, change or drop. On approval I fill `reviewedBy`, `reviewedOn` and `reviewMode: 'individual'`, set `published: true`, and add it to `js/timeline-data-1990s.js` in a separate pull request, with the tests re-run. The Pokhran record additionally needs your sensitivity approval. Sampled review stays locked until 20 events are published individually.

Separately, before calling the feature launched: deploy `main` to Hostinger and do a real NVDA or VoiceOver check of the Sources dialog.
