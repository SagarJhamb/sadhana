# Sadhana: setting it up (about 20 minutes, all free)

Sadhana is a web app. It saves everything on each device and syncs through a hidden folder in her own Google Drive. You put the app online once (GitHub), switch on Google sign-in once (Google Cloud), then she adds it to her Mac's Dock and her iPhone's Home Screen.

Her data never goes to GitHub or to Anthropic. GitHub only holds the app's code. Her planner sits on her devices and in her Google Drive.

---

## Part 1: Put the app online (GitHub Pages)

1. Go to **github.com** and create a free account. The username you pick becomes part of the web address. For example, the username `sagarp` gives `https://sagarp.github.io/sadhana/`.
2. Click **+** (top right), then **New repository**.
   - Repository name: `sadhana`
   - Choose **Public**. This only shares the app's code, never her data.
   - Click **Create repository**.
3. On the next page, click **uploading an existing file**. Drag in **every file from this folder** except this guide:
   `index.html`, `config.js`, `manifest.webmanifest`, `sw.js`, `icon-180.png`, `icon-192.png`, `icon-512.png`.
   Then click **Commit changes**.
4. Open **Settings** (top of the repository), then **Pages** in the left menu.
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)**, then **Save**.
5. Wait a minute and refresh. The page shows your address, for example `https://sagarp.github.io/sadhana/`. **Write it down: you need it in Part 2.**

## Part 2: Switch on "Sign in with Google" (Google Cloud)

1. Go to **console.cloud.google.com** and sign in with a Google account (yours is fine).
2. At the top, open the project picker, then **New project**. Name it `Sadhana`, then **Create**, and make sure it's selected.
3. Search for **Google Drive API** in the top search bar, open it, and click **Enable**.
4. Open the menu, then **Google Auth Platform** (it may be called **OAuth consent screen**), then **Get started**.
   - App name: `Sadhana`. Support email: your email.
   - Audience: **External**.
   - Contact email: your email. Agree to the policy, then **Create**.
5. **Data access**, then **Add or remove scopes**. Search for `drive.appdata`, tick
   **`.../auth/drive.appdata`** ("See, create and delete its own configuration data in your Google Drive"), then **Update**, then **Save**.
   This is the only permission the app asks for. It can't see any of her other Drive files.
6. **Audience**, then under **Test users**, click **Add users** and add **her Gmail address** (and yours if you want to try it). Save.
7. **Clients**, then **Create client**.
   - Application type: **Web application**. Name: `Sadhana`.
   - **Authorised JavaScript origins**: add `https://YOURNAME.github.io` (no slash at the end).
   - **Authorised redirect URIs**: add `https://YOURNAME.github.io/sadhana/` (with the slash at the end).
   - Click **Create**, then **copy the Client ID** (it ends in `.apps.googleusercontent.com`).

## Part 3: Give the app its Client ID

1. Back on GitHub, open your `sadhana` repository and click **config.js**.
2. Click the **pencil** icon to edit. Replace `PASTE-YOUR-CLIENT-ID-HERE.apps.googleusercontent.com` with the Client ID, keeping the quotes.
3. Click **Commit changes**. Wait about a minute for the site to update.

## Part 4: Install it

**On her Mac (Safari):** open `https://YOURNAME.github.io/sadhana/`, click **Sign in with Google**, then choose **File > Add to Dock**. Open it from the Dock from then on.

**On her iPhone (Safari):** open the same address, tap **Share**, then **Add to Home Screen**. **Open it from the Home Screen** and tap **Sign in with Google** there. The Home Screen app keeps its own sign-in, separate from Safari.

The first time, Google says **"Google hasn't verified this app"**. That's expected for a personal app: tap **Continue**. The app is yours, and it can only reach its own hidden folder.

---

## Part 5 (optional): Google Calendar and Apple Calendar

1. In **console.cloud.google.com**, with the **Sadhana** project selected, search for **Google Calendar API** and click **Enable**.
2. Under **Google Auth Platform > Data access > Add or remove scopes**, tick these three, then **Update** and **Save**:
   - `.../auth/calendar.app.created` (make its own calendar and manage events on it)
   - `.../auth/calendar.calendarlist.readonly` (see the list of her calendars)
   - `.../auth/calendar.events.readonly` (read her events so they show in Sadhana)
3. In Sadhana, go to **Settings > Calendar > Connect Google Calendar**, and tick the calendar boxes on Google's screen. Do this once on each device.
4. To see it in Apple Calendar:
   - **Mac:** System Settings > Internet Accounts > Add Account > Google, then turn on **Calendars**.
   - **iPhone:** Settings > Apps > Calendar > Calendar Accounts > Add Account > Google.
   A calendar called **Sadhana** appears with her events, birthdays, seva, trips and date nights. Change its colour in Apple Calendar if she likes.

---

## Day to day

- The status at the bottom of the sidebar (on iPhone, the small pill at the bottom right) shows **Synced**, **Syncing…** or **Offline: saved on this device**.
- She can use it offline. Changes sync when she's back online.
- If both devices changed things, they're merged item by item. If the **same** item was edited on both before syncing, the later sync wins.
- If it says **Tap to reconnect**, tap it. Google sign-ins last about an hour, and the app normally renews them by itself.
- **Settings > Download backup** saves everything, including photos and invoices, as one file. Worth doing monthly.

## If something goes wrong

- **"Error 400: redirect_uri_mismatch"**: the redirect URI in Part 2, step 7 must be exactly your address, ending in `/sadhana/`. Open the app at exactly that address.
- **"Access blocked" or "access_denied"**: add her Gmail under **Audience > Test users** (Part 2, step 6).
- **The sign-in button says to add the Client ID**: `config.js` still has the placeholder (Part 3).
- **Changes don't appear on the other device**: open the app there, or use **Settings > Sync now**.

## Where her data lives

- On each device, in the app's own browser storage.
- In her Google Drive, in a hidden app folder: one file called `sadhana.json`, plus her photos and uploaded invoices. She can see that it exists in **drive.google.com > Settings > Manage apps > Sadhana**, and delete it from there.
- Nothing is sent to GitHub, Anthropic or anyone else.
