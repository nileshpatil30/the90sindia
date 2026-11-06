# On This Day: editorial guide

How to add an event to **On This Day** (`timeline.html`), how to rate it, and how it gets approved.
The page and its rules are built. The data files are **empty on purpose**: no event is published until the owner has reviewed it.

## Where events live

One file per decade, in `js/`:

| File | Years |
|---|---|
| `js/timeline-data-1980s.js` | 1980 to 1989 |
| `js/timeline-data-1990s.js` | 1990 to 1999 (the launch collection) |
| `js/timeline-data-2000s.js` | 2000 to 2010 |

Add a record inside the `push( … )` call, separated by commas. Then run:

```
node tests/timeline-test.js --no-browser
```

The test names the record and the rule for every problem. The page runs the same rules, so a record that breaks one is simply not shown.

## One record

```js
{
  id: '1991-07-24-union-budget',
  date: { y: 1991, m: 7, d: 24, precision: 'day' },
  title: 'Union Budget 1991-92 presented',
  summary: 'Finance Minister Manmohan Singh presented the 1991-92 Union Budget. …',
  category: 'news',
  confidence: 'verified',
  sources: [
    { publisher: 'Ministry of Finance', label: 'Budget speech 1991-92', url: 'https://…', type: 'primary', publishedOn: '1991-07-24', opened: '2026-11-06' },
    { publisher: 'Business Today', label: '35 years of liberalisation', url: 'https://…', type: 'press', publishedOn: '2026-07-24', opened: '2026-11-06' }
  ],
  sensitivity: 'standard',
  ticker: false,
  reviewedBy: '', reviewedOn: '', reviewMode: '',
  published: false
}
```

A new record always starts with `published: false` and empty review fields. **Only the owner's review fills those in.**

### Fields

| Field | Rule |
|---|---|
| `id` | Day: `YYYY-MM-DD-slug`. Month: `YYYY-MM-slug`. Year: `YYYY-slug`. The slug is lower case and starts with a letter. Unique. |
| `date` | `{ y, m, d, precision }`. `precision` is `day`, `month` or `year`. `y` is 1980 to 2010. Give `m` and `d` only as far as the precision goes. |
| `title` | Our words, 80 characters or fewer. |
| `summary` | Our words, 280 characters or fewer. Never copy a sentence from a source. |
| `category` | What the event is: `tv`, `music`, `film`, `cricket`, `news`, `tech`, `ads`, `prices`, `society`. It says nothing about sensitivity. |
| `confidence` | `verified`, `probable` or `disputed` (see below). |
| `confidenceNote` | One line on why. Required for `disputed`. Shown to readers for `probable` and `disputed`. |
| `sources` | At least one (see below). |
| `sensitivity` | `standard` or `review` (see below). |
| `related` | Optional. Ids from the existing catalogue, so the card gets a "Watch the clip" button. |
| `ticker` | `true` only for Verified, exact-day, standard, published events. Nothing reads it in Phase 1. |
| `reviewedBy`, `reviewedOn`, `reviewMode`, `reviewBatch` | The owner's review. Leave empty. |
| `published` | `false` until the owner approves. |

### Sources

Every source has all of these:

| Field | Rule |
|---|---|
| `publisher` | The outlet or body, such as ESPNcricinfo. Two sources with the same publisher count as one. |
| `label` | The title of the page or document. |
| `url` | An `https` link. |
| `type` | `primary` (a government record, a company's own statement), `authoritative` (a statistical record such as a scorecard archive), `reference` (an encyclopaedia) or `press`. Readers see the word. |
| `publishedOn` | When the source itself was published: `YYYY-MM-DD`, `YYYY-MM` or `YYYY`. Use `undated` **only** when the page truly carries no date. Required to publish. |
| `opened` | The date a person opened the page (`YYYY-MM-DD`). |
| `basedOn` | Optional. The link of another listed source that this one repeats. A source based on another does not count as independent. Set it whenever you notice one outlet is repeating another. |

### Confidence

- **Verified**: two or more independent sources (different publishers, none based on another), and at least one of them `primary` or `authoritative`. Two press reports are never Verified.
- **Probable**: one or more sources, but not enough for Verified. Never in the ticker.
- **Disputed**: sources disagree on the date. Needs a `confidenceNote`. Use `month` or `year` precision, never `day`. State both claims in the summary. Never in the ticker.
- Words such as **first**, **biggest**, **only** and **largest** need a source that says so. Otherwise leave them out. The test prints a warning for each one.
- If sources disagree on a detail that is not the date, leave the detail out instead of choosing.

### Sensitivity

Category says what an event is. Sensitivity says how it must be handled. A news event is `standard` unless one of these applies. When one does, set `sensitivity: 'review'` and give the reason in `sensitivityReason`:

| Reason | Use it for |
|---|---|
| `political` | A result, policy or act still contested between parties. |
| `communal` | Communal, caste or religious violence, or its aftermath. |
| `violence` | Terror attacks, riots, assassinations and killings. |
| `tragedy` | Disasters and accidents with deaths. |
| `military` | Wars, and military or nuclear operations. |
| `legal` | Court cases or allegations involving a named living person. |
| `privacy` | Anything that could identify a private individual. |
| `other` | Anything else you are unsure about. When in doubt, mark it `review`. |

These reasons **flag and hold** an event for review. They do not approve anything. A `review` event stays unpublished until the owner approves it **individually**, and the approval is recorded in `sensitivityApprovedBy` and `sensitivityApprovedOn`. It always needs `reviewMode: 'individual'`.

## How an event gets published

1. **Draft.** Write the record: our own words, sources with publisher and type, confidence and sensitivity. `published: false`.
2. **First 20 events.** The owner approves each one **individually** (`reviewMode: 'individual'`).
3. **After that, in batches.** Each batch arrives with source links and confidence labels. The owner checks a sample of the batch: **the greater of 3 entries or 20% of the batch, rounded up** (a batch of 10 has 3 checked, a batch of 21 has 5). If any sampled entry has an error, the **whole batch is rechecked** before anything is published. Published batch entries carry `reviewMode: 'sampled'` and a `reviewBatch` such as `B001`. A sampled entry is allowed only once 20 events are published with `reviewMode: 'individual'`.
4. **Always individually.** Every Disputed event and every `review` event.
5. **Nothing is published** until `reviewedBy`, `reviewedOn` and `reviewMode` are filled by the owner's decision. The tests enforce this, and so does the page.

## Where an event can appear

This is worked out from the fields, never stored:

| Confidence and precision | By year | Today | Ticker |
|---|---|---|---|
| Verified, exact day | Yes | Yes | Only if `ticker: true` (not wired in Phase 1) |
| Verified, month or year only | Yes | No | No |
| Probable, exact day | Yes, labelled | Yes, labelled | No |
| Probable, month or year only | Yes, labelled | No | No |
| Disputed | Yes, with both claims | No | No |
| `review`, not approved | No | No | No |
| Not published | No | No | No |

Dates: "today" is the date in India (IST). On a day with no event the page says so, then shows the next seven days, then the rest of the month, then the next event in the archive. Each of those cards shows its real date and how many days away it is. A 29 February event appears only on a real 29 February.

## Tests

```
node tests/timeline-test.js --no-browser   # rules and data files only
python3 -m http.server 8123                # then, in another window:
node tests/timeline-test.js                # rules, plus the page in a headless browser
```

`tests/timeline-fixtures.js` holds test-only sample events. They are never loaded by the site, and their reviewer is "TEST FIXTURE".
