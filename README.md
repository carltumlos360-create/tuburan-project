# T.U.B.U.R.A.N. — Tuburan sang Alam (Starter)
*"Your Source of Knowledge, Anytime, Anywhere."*


This is the working starter version of the Hub app described in the roadmap.
Everything currently runs on **sample data** — no real login, storage, or AI
calls yet. That's intentional: this lets you see and test the full app flow
(login → dashboard → module → download/AI buttons) before wiring up the
real services.

## How to try it right now

1. Unzip this folder.
2. Double-click `index.html` to open it in your browser
   (or right-click → Open with → Chrome/Edge).
3. Type anything into the login form and click **Log in** — it will accept
   any input for now.
4. Click a module card, then try the **Download**, **Generate review notes**,
   and **Generate quiz** buttons — they'll show placeholder results.

## What's inside

| File | Purpose |
|---|---|
| `index.html` | The three screens: login, dashboard, module detail |
| `styles.css` | All visual styling |
| `app.js` | App logic — view switching, sample data, button behavior |
| `manifest.json` | Makes the app installable on Android/Windows |
| `service-worker.js` | Enables offline loading once installed |
| `icons/` | App icons used for install/home screen |

## Next steps (in order)

1. **Push this to GitHub:**
   - Create a new repository (e.g., `hub-project`) on github.com
   - Open GitHub Desktop → "Add Local Repository" → select this folder
   - Commit and push

2. **Turn on GitHub Pages** (Settings → Pages → deploy from `main` branch)
   to get a live URL — this also lets you actually test "Install app" on
   your phone and Windows PC, since installability requires a real
   HTTPS URL (it won't offer to install from a local file).

3. **Connect Firebase** (Authentication, Firestore, Storage) — replace the
   `TODO` blocks in `app.js` with real Firebase calls. Ask Claude Code:
   > "Connect this app's login form to Firebase Authentication, and connect
   > the module grid to Firestore instead of the SAMPLE_MODULES array."

4. **Connect the Claude API** for real AI-generated notes/quizzes — this
   should go through a Firebase Cloud Function, never called directly from
   the browser, to keep your API key safe. Ask Claude Code:
   > "Set up a Firebase Cloud Function that safely calls the Claude API to
   > generate review notes and quizzes, and connect it to the two AI
   > buttons in app.js."

See `Hub_Project_Roadmap.md` for the full phase-by-phase plan.
