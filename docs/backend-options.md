# Backend options for 90s Rewind TV

**Today the site has no backend and needs none.** Polls, trivia scores and shared "memories" live in each visitor's own browser, and no API key is used anywhere. A backend is only needed for things that must be shared between visitors or tied to a person:

| Feature | Works today (no backend) | Needs a backend for |
|---|---|---|
| Daily poll and poll archive | one vote per browser, sample starting numbers | real totals from all visitors |
| Trivia and Trivia Challenge | full game, best score on this device | a shared leaderboard |
| Share Your Memories | saved on this device only | memories visible to everyone |
| Discussion Forum | look-only preview with sample topics | real topics, replies, members |
| Login / Join | interface only, nothing is sent | real accounts |
| Submit a playlist | opens a pre-filled GitHub issue | nothing (it already works) |

Prices and free-tier limits change often. **Check each provider's current pricing page before you commit.** I could not re-verify them when writing this, so no figures are quoted here.

## What "secure login" means

Passwords must be handled by a service built for it. The service stores each password as a salted hash and never the password itself, sends the confirmation email, limits repeated guesses, and serves everything over HTTPS. This site must not store passwords anywhere (not in the browser, not in a file, not in a spreadsheet). The Join page is therefore deliberately UI-only.

## Options, ranked for this project

### 1. Supabase (recommended for accounts, shared polls and memories)
Hosted Postgres database, ready-made sign-up/login (email confirmation, password reset), and row-level rules that say who may read or write what. It works from a plain static site with a **public "anon" key**, which is designed to sit in the page; the database rules, not the key, protect the data. The service-role (secret) key must never be put in the website.
- Fits: accounts, polls with real totals, memories, a simple forum, a trivia leaderboard.
- Cost: has a free tier suitable for starting; check the limits (including whether idle free projects pause).
- Work: about a day for accounts and polls, two to three for a basic forum with moderation.

### 2. Firebase (Authentication + Firestore)
Similar to Supabase and also usable from a static site. Good sign-in options (email, Google). Data is stored as documents instead of tables, which suits simple posts and counters. Security is again set by rules, so write them carefully.
- Choose this if you prefer Google's tooling or want "Sign in with Google" first.

### 3. Giscus (zero-cost forum only, no accounts of your own)
Turns **GitHub Discussions** into a comment area you embed in a page. Visitors sign in with GitHub, so you build no login at all, and moderation happens in GitHub. It needs a public repository with Discussions switched on.
- Fits: the Discussion Forum, soonest and cheapest.
- Limit: every poster needs a GitHub account, which suits a developer audience more than a nostalgia audience.

### 4. Cloudflare Workers + D1 (a small API you write yourself)
A tiny serverless function plus a small SQL database. Cheap and fast, but you write the API, the validation and the abuse protection yourself, and you still need a sign-in service for accounts.
- Fits: only the shared poll counter, if you want to avoid a full backend. Rate-limit by IP and accept that without accounts a determined person can vote repeatedly.

### 5. Do not
- Do not build your own password storage.
- Do not paste a secret API key into any file in this repository.
- Do not use a spreadsheet or a form tool as a login database.

## Recommended path
1. **Now:** keep everything as it is. It works and costs nothing.
2. **Forum first, cheaply:** add Giscus to the forum section if a GitHub audience is acceptable.
3. **Accounts, shared polls, memories:** Supabase. Switch the three functions in `js/engage.js` (`backend.mine`, `backend.vote`, `backend.counts`) to call it. They already return promises, so no page code changes. Move memories from `localStorage` to a table in `js/community.js`, and replace `submitJoin` / `submitLogin` in `js/join.js` with the service's sign-up and sign-in calls.
4. **Before you open sign-up:** write a short privacy policy, add a way to report and remove posts, and decide who moderates.

## Not an API-key question
Nothing in the current site calls a paid or keyed service. YouTube videos play through YouTube's own embedded player with no key. A YouTube Data API key would only be needed to fetch titles and thumbnails automatically, and if you add one it must live on a server (for example a Cloudflare Worker), never in the page.
