# Resurface

A private, offline, mobile-first self-improvement tracker for iPhone Safari.
No backend, no database, no login. Everything lives in your browser's LocalStorage.

## Stack
React 18 + Vite, Tailwind CSS, Framer Motion, lucide-react icons.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173 (also exposed on your Wi-Fi network)
```

### Open it on your iPhone
1. Keep the Mac/PC and iPhone on the same Wi-Fi.
2. `npm run dev` prints a **Network** URL, e.g. `http://192.168.0.12:5173`.
3. Open that URL in Safari.
4. Tap **Share → Add to Home Screen**. It now launches full screen like a native app.

### Production build (recommended for daily use)
```bash
npm run build      # outputs /dist (static files only)
npm run preview    # test the build locally
```
`/dist` is plain static HTML/CSS/JS. Host it on any static host (Netlify, Vercel,
GitHub Pages, Cloudflare Pages) so the URL never changes, then Add to Home Screen.

> LocalStorage belongs to one exact address. `http://192.168.0.12:5173` and your
> hosted URL keep separate data. Pick one permanent address for daily use, and use
> Profile → Export / Import backup to move data between them.

## Keep your data safe
- Safari can clear website storage for sites you haven't opened in 7 days.
  Apps added to the Home Screen are exempt, so **add it to your Home Screen**.
- Profile → **Export backup** saves a `.json` file (share sheet → Save to Files).
- Profile → **Import backup** restores it.

## LocalStorage structure
| Key | Shape |
| --- | --- |
| `resurface.v1.tasks` | `[{ id, minutes, label, category, name, description, rule }]` |
| `resurface.v1.dailyTasks` | `{ "YYYY-MM-DD": { date, completedTasks: [id], totalTasks, percentage, categories: { Faith: { done, total } }, updatedAt } }` |
| `resurface.v1.journal` | `{ "YYYY-MM-DD": { date, mood, morningReflection, nightReflection: { learned, improve, grateful }, updatedAt } }` |
| `resurface.v1.meta` | `{ version, name, mission, startDate }` |

- `minutes` = minutes after midnight; it orders the timeline and decides "missed".
- `label` (optional) replaces the clock time on screen, e.g. "After Lunch".
- Each day stores a category snapshot, so editing the routine never rewrites history.
- Dates are local calendar days (Bangladesh time on your phone), never UTC.

## Rules the stats use
- **Streak**: consecutive days at 60% or more. Today counts once it reaches 60%;
  until then the streak continues from yesterday. Change `STREAK_THRESHOLD`
  in `src/lib/constants.js`.
- **Missed**: a task not done one hour after its time.
- **Consistency**: share of tracked days in the week at or above the threshold.
- Days before your first launch are not counted against you.

## Project structure
```
src/
  App.jsx                 tab shell + page transition
  main.jsx                entry, MotionConfig (respects Reduce Motion)
  index.css               Tailwind + iOS safe-area utilities
  lib/
    constants.js          storage keys, categories, moods, threshold
    defaults.js           default daily routine
    storage.js            safe LocalStorage helpers
    date.js               local-date helpers and formatting
    stats.js              day records, streaks, weekly/monthly math
    store.jsx             React context: state + persistence
  components/             ProgressRing, TaskItem, Check, BarChart, Sheet, ...
  screens/                Today, Progress, Routine, Journal, Profile
public/                   icons + web manifest
```
