# Sadhana

A calm, all-in-one life planner for a barrister who follows BAPS satsang. It runs in the browser and installs like an app on a Mac (Safari, Add to Dock) and an iPhone (Add to Home Screen).

**Live app:** https://sagarjhamb.github.io/sadhana/

## What's in it

| Area | What it does |
| --- | --- |
| Home | Today at a glance: three non-negotiables, to-dos, schedule, hearings, timer |
| Planning | Day plan in 30 or 60 minute slots, week and month views, calendar categories, events from her own calendars |
| Projects & to-dos | Projects, to-dos with priorities, planned and due dates |
| Personal growth | Habits, weekly audits, vision board |
| Health & fitness | Weekly workout and meal plan, workout and meal libraries |
| Shopping list | Grouped by aisle, fills from planned meals and recipes, "usuals", copy as text |
| Finance | Transactions, budget categories, monthly and yearly views |
| Organisation | Events, birthdays, trips, restaurants, outfits, date ideas |
| Barrister billing | Matters, court diary (hearings, papers and skeleton deadlines), work log, time-tracking timer, fee notes |
| Satsang | BAPS Hindu calendar (tithi, Ekadashi, festivals), sabha notes, ashirvad, seva |
| Settings | Google sign-in, calendar sync, categories, alerts, backups, import and export |

## How it works

- **No server and no account system.** The whole app is `index.html`, plain HTML, CSS and JavaScript with no framework or build step. GitHub Pages hosts it.
- **Her data stays hers.**
  - Everything is saved on the device first (IndexedDB), so the app opens instantly and works offline.
  - It then syncs to one file, `sadhana.json`, in the hidden app-data folder of her own Google Drive (scope `drive.appdata`). The app can see nothing else in her Drive.
  - Edits on two devices are merged item by item.
  - Photos and attachments are stored as separate files in the same hidden folder.
- **Backups.** A full copy goes to the same hidden folder every 14 days, and the newest 6 are kept. She can restore from Settings.
- **Google Calendar and Apple Calendar.**
  - Optionally, the app writes to a "Sadhana" calendar plus one calendar per category, such as "Sadhana · Work". These show up in Apple Calendar through her Google account.
  - It writes events, hearings, to-dos, non-negotiables, the day plan, and Ekadashi and festivals, with reminders, so her phone alerts her.
  - It reads events from calendars she chooses and shows them in the planner. It only ever changes events it created itself.
- **Staying signed in (optional).** Browser-only Google sign-in lasts an hour and then renews itself. The token helper in `token-helper/worker.js` lets the app hold a long-lasting sign-in instead.
  - It's a small Cloudflare Worker you deploy yourself. It only swaps sign-in codes for passes and stores nothing.
  - To turn it on, put its address in `config.js` as `tokenHelper`.

Nothing is ever sent to GitHub, Anthropic or anyone else. GitHub only holds the code.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The entire app: styles, markup and script |
| `config.js` | Google OAuth client ID, and optionally `tokenHelper`. The client ID is not a secret. |
| `sw.js` | Service worker that keeps the app shell available offline. It never touches her data. |
| `manifest.webmanifest`, `icon-*.png` | Home-screen and Dock install |
| `token-helper/worker.js` | Optional Cloudflare Worker for long-lasting sign-in |
| `SETUP.md` | Step-by-step setup: GitHub Pages, Google Cloud, installing on Mac and iPhone, calendar sync |
| `AGENTS.md` | Notes for AI coding agents working on this repo |

## Setting it up

Follow [SETUP.md](SETUP.md). It takes about 20 minutes and everything is free.

## Updating

1. Edit `index.html`.
2. Bump `CACHE` in `sw.js`, for example `sadhana-v2a` to `sadhana-v2b`, so installed copies pick up the change.
3. Commit and push to `main`. GitHub Pages redeploys in about a minute.
4. On the Mac press ⌘R. On the iPhone, close and reopen the app.

## Keep in mind

- The Hindu calendar data runs from October 2026 to December 2027 and needs refreshing before 2028. It's taken from baps.org/Calendar, and dates can differ slightly from her local mandir.
- Apple Calendar colours for the Sadhana calendars are set in Apple Calendar itself.
- On iPhone, new Sadhana calendars may need ticking at google.com/calendar/syncselect before they appear.
