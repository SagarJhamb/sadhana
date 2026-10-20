# AGENTS.md

Guidance for AI coding agents working on Sadhana. Read README.md first for what the app is.

## Who it's for

The app is for one person: a barrister in London who follows BAPS satsang. She uses it daily on a Mac (Safari, Dock) and an iPhone (Home Screen). The repo owner, Sagar, is building it for her.

- **Tone:** calm, warm and plain. Use UK English (organise, colour, diary).
- **No em dashes** anywhere: not in UI text, code comments or commit messages. Use a colon, a comma or a new sentence.
- Example data is clearly marked: seed items carry `ex:true`, and the UI shows "Example entry".

## Non-negotiable rules

1. **Her data never leaves her devices and her Google Drive.**
   - No analytics, trackers or third-party scripts. Google Fonts is the only external resource besides Google's own APIs.
   - No server that stores or sees planner content. The optional token helper only exchanges OAuth codes and tokens.
2. **No secrets in the repo.**
   - `config.js` holds the real OAuth client ID. That's fine because it isn't secret, but never overwrite or blank it.
   - The client secret lives only in Cloudflare Worker settings.
3. **Single file, no build step.**
   - The app is `index.html`: one `<style>` block and one main `<script>` block.
   - Don't add a framework, bundler, npm dependencies or extra JS files.
   - Edit `index.html` in place.
4. **Bump `CACHE` in `sw.js` on every change you push**, so installed apps update.
5. **Never break sync or existing data.**
   - Data written by older versions must still load.
   - New fields must be optional.
   - Never rename or repurpose an existing `db` key.
6. **Calendar safety.** Only create, change or delete Google Calendar events that carry `extendedProperties.private.sadhana === '1'`. Events she adds herself must never be touched.

## Code map (index.html)

Sections are marked with `/* ---------- name ---------- */` comments. In order:

| Section | Contents |
| --- | --- |
| utilities, icons | `esc`, `uid`, `iso`, `today`, date helpers; `P` is the SVG path map and `ic(name)` renders an icon |
| schema | `SCHEMA[collection] = {name, f:[fields]}` drives every add/edit form (`openForm(col,id,preset)`) |
| storage | Google sign-in (OAuth redirect, optional refresh via the token helper), `api()`, Drive sync, 3-way merge (`mergeArr` by `id`), backups, `boot()` |
| Google Calendar | `wanted()` builds the events the app should have; `pushCalendar()` diffs them against Google using deterministic ids (`hexId('ev:'+id)`, which starts with `sd`) and a content hash; reading her calendars (`loadMonth`, `extOn`); alerts (`calAlerts`) |
| calendar categories | `cats()`, `catMap()` (built-in item types to categories), the filter chips (`settings.catOnly`), one Google calendar per category |
| time tracking timer | `db.timer`, stores timestamps rather than counting so it survives closing the app; logs to `db.work` in 6-minute units |
| add a matter | `quickOpt(ref)` and `quickAdd(sel)`: a "+ Add a new matter…" option in any matter dropdown |
| Hindu calendar | `HINDU` data (date to `[tithi, observances, flags]`; flags: 1 Ekadashi, 2 major festival, 4 nirjala) plus helpers |
| shopping list | `db.shopping`, `db.usuals`, aisle guessing, `addShop`, `vShop` |
| seed | `seed()`: the default `db` shape and example data. `ensure()` fills missing keys from it on load. |
| views | `vHome`, `vPlanning`, `vProjects`, `vGrowth`, `vHealth`, `vShop`, `vFinance`, `vOrg`, `vBar`, `vSat`, `vSettings` |
| render | `NAV`, `NICON`, `VIEWS`; `render()` rebuilds the current view from state and keeps focus and cursor position |
| actions | `A` (click handlers) and `ADD` (quick-add inputs) |
| boot | starts storage, then renders |

## State and UI conventions

- **State:**
  - The global `db` is the whole planner.
  - Collections are arrays of objects, each with a unique `id` from `uid()`.
  - `db.settings` holds preferences.
  - `S` holds UI-only state that isn't synced: current view, sub-tabs and filters.
- **Saving.** After any change, call `save()` (it saves locally, then syncs after a short pause), then `render()`.
- **Event delegation**, with no per-element listeners:
  - `data-act="name"`: click runs `A.name(el)`. Pass extra values as `data-id`, `data-v` and so on.
  - `data-bind="path.to.value"`: inputs write into `db` through `setPath`. Checkboxes and selects re-render; text inputs don't.
  - `data-add="name"` on an input: Enter runs `ADD.name(value)`.
- **Adding a new collection.** Add it to `seed()` (so `ensure()` creates it on old data) and to `SCHEMA` if it needs a form. Sync merges it automatically if it's an array of `{id}` objects.
- **Adding a new page:**
  - add it to `NAV`;
  - give it an icon in `NICON`, with a path in `P` if it's new;
  - write its view function and register it in `VIEWS`.
- **Styling:**
  - Use the CSS variables in `:root` (`--bg`, `--paper`, `--ink`, `--muted`, `--sage*`, `--clay*`, `--rust*`, `--line`), never raw colours, so dark mode keeps working.
  - Fonts: serif `--serif` for headings, `--sans` for body text.
  - Reuse the existing classes: `card`, `btn`, `btn primary`, `chip`, `pill`, `row`, `stack`, `grid2`, `sec`, `muted`, `small`, `empty`.
- **Layout.** Every page must work at 390px wide with no horizontal scroll, as well as on desktop.

## Checking your work

There's no test suite in the repo. Before pushing:

1. Syntax-check the main script by extracting it from `index.html` and running `node --check` on it.
2. Load the app in a browser at desktop width and at 390px. Try the feature, reload, and confirm the data persisted.
3. For anything touching sign-in, Drive or Calendar, test against mocked Google endpoints (for example with Playwright routes). Don't use her real account.
4. Check the browser console has no errors.

## Commits

- Write short, plain commit messages that describe the change from her point of view.
- Push to `main`. GitHub Pages deploys from the root of `main`.
