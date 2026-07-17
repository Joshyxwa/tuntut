# Tuntut

**Find the money the government already owes you.**

Millions of ringgit in Malaysian government aid goes unclaimed because people don't know it exists.
Tuntut takes an IC number, checks every scheme in that name, and shows what's there — *before* you
sign in to anything. Your IC is a lookup key, not a login.

**Live:** https://tuntut-blush.vercel.app

Built for CodexMY · Team Cai Fun · Public Systems track.

## Run it

```
open app/index.html
```

No build step, no dependencies, no server. That's the whole thing.

## Try it

| Type this | You get |
|---|---|
| **Any 12 digits** | The full flow — carousel → claim → sign-up → dashboard |
| `000000000000` | The "nothing found" empty state |

## This is a prototype

Please read this before drawing conclusions from the demo:

- **The figures are illustrative**, pending live checks. The schemes, portals and claim flows are
  real and researched; the amounts shown are not a real person's.
- **The sign-up is mock.** Google and Facebook aren't wired to anything — no account is created and
  nothing is sent anywhere. The modal says so.
- **No IC is stored.** Everything runs in your browser against a local data file. There is no
  backend.
- **Every IC in this repo is fabricated.** Real ICs were used during research and are deliberately
  not published — a plausible IC is somebody's actual IC.

## Layout

```
app/
├── index.html · story.html · dashboard.html · no-results.html
├── data/tuntut-data.js   ← the single source of truth. Change numbers here.
└── assets/               theme.css + per-page css/js
```

`app/README.md` has the detail: the data model, why `worth` and `rm` are different, the status
system, and the accessibility rules behind the palette.

## A note on `info/`

The research, design explorations and team notes live in `info/`, which is intentionally **not**
published — it contains personal data gathered during live testing, and internal notes that were
never written for an audience. It stays local on purpose.
