# Tuntut — prototype

A clickable prototype of the Tuntut flow. No build step, no dependencies, no server.

**Run it:** double-click `index.html` (or `open app/index.html`). That's it.

For the narrative version of this flow, read [`../info/user-journey.md`](../info/user-journey.md).

## The flow

```
index.html ──IC──► (2s) ──► story.html ──"Claim RM 3,410"──► [sign-up modal] ──► dashboard.html
                             carousel                                              ▲     │
                                 ▲                                                 │     │
                                 └──────────────────── toggle ────────────────────┘◄───┘
```

| File | What it is |
|---|---|
| `index.html` | Landing. Takes an IC, fakes a 2s check, hands off to the carousel. Also **resets the session** — every run starts clean. |
| `story.html` | The carousel / "simple view". One scheme per card, one button forward. Ends on the claim CTA, which opens the sign-up modal — a `<dialog>` in this same page, so there is no auth page. |
| `dashboard.html` | The full dashboard, grouped into ready-to-use / we'll-file-it / needs-a-step. |
| `no-results.html` | The "nothing found" empty state. |

## Demo ICs

| Type this | You get |
|---|---|
| **Any 12 digits** | The full flow — carousel → claim → sign-up → dashboard |
| `000000000000` | The **"Nothing found"** empty state |

The landing page shows `XXXXXX-XX-XXXX` as the placeholder rather than an example number, and no real-looking
IC appears anywhere in the app or these docs. A plausible IC is somebody's actual IC, and printing one both
invites people to type a stranger's number and teaches the wrong habit for a product whose whole promise is
that it doesn't hoard your identifiers.

## The data

**`data/tuntut-data.js` is the single source of truth.** Edit it before you run the app; nothing writes to it
at runtime. It's deep-frozen on load, so a stray assignment throws in strict mode instead of quietly
corrupting a demo.

**Why `.js` and not `.json`:** browsers block `fetch()` of a local file from a `file://` page (null origin),
so a real `.json` only works behind a web server and breaks double-click-to-open. It's the same object, the
same single source of truth and the same read-only guarantee — just delivered as a global instead of fetched.
*(We built the `.json` version and it worked fine; it just wasn't worth needing a server to demo.)*

**The RM totals are not in it.** `assets/app.js` adds them up from the schemes, so the headline is the sum of
its parts *by construction* and can't drift out of step with the rows beneath it:

| field | meaning |
|---|---|
| `rm` + `claimKind: "tap"` | already on the MyKad — counts toward **readyToUse** |
| `rm` + `claimKind: "apply"` | needs a form — counts toward **needsApplying** |
| `worth` | **display only, never summed** — a value that isn't spendable cash |
| no `claimKind` | carries no ringgit (not eligible, or locked) — counted nowhere |

`found` = `readyToUse` + `needsApplying`. `schemeCount` = schemes worth more than zero.

**`worth` vs `rm` is the important distinction.** PeKa B40 has `worth: 60` — [ProtectHealth pays the clinic
RM 40 for the first visit + RM 20 for the follow-up](https://protecthealth.com.my/peka-b40/) — so the slide can
answer "what's this worth to me?". But it's a *service*, not money you can spend, so it has no `claimKind` and
never touches the totals. Putting it in a pile labelled "already yours" would be a lie.

**BUDI95 is the one computed scheme.** It stores `litres`, not ringgit, because a fuel quota is only worth
what the subsidy saves you — and that moves weekly:

```
rm = round(litres × (meta.ron95.unsubsidised − meta.ron95.subsidised))
```

`meta.ron95` is dated (`priceWeek`) on purpose. The subsidised price is fixed at RM 1.99; the unsubsidised
price floats under the Automatic Pricing Mechanism (RM 2.60 at BUDI95's launch, RM 3.42 in mid-July 2026).
Update those two numbers and the fuel's value, the "already yours" total and the headline all move together.

**eKasih deliberately has no `claimKind`** even though it shows RM 1,200 — that figure is unrevealed until
the user connects MyDigital ID. Counting money we can't see would be promising what we don't know.

## The status system

Our users are **B40 and elderly**, so every verdict is **glyph + colour + plain word** — never colour alone.
Set `status` (`good` / `warn` / `bad`) and `statusLabel` on a scheme; the carousel and dashboard both follow.
✓ good · ! warn · ✕ bad.

Two rules that are easy to break by accident:

- **Don't make everything positive.** mySalam is "Not eligible" and the empty state exists *on purpose* —
  a tick only means something because something else can be a cross.
- **Colours split in two.** `--pos` / `--gold` / `--bad` are decorative (bars, borders). Anything carrying
  **text** uses `--pos-deep` / `--gold-deep` / `--bad-deep`, which are measured ≥4.5:1. White on plain
  `--gold` is 3.45:1 and fails.

Full reasoning: [`../info/design-principles.md`](../info/design-principles.md).

## Layout

```
app/
├── data/tuntut-data.js   ← THE data. Read-only. Change numbers here.
└── assets/
    ├── theme.css         design system: tokens + shared components
    ├── entry.css         landing + no-results   ├── app.js       shared runtime
    ├── story.css         carousel               ├── landing.js   story.js
    └── dashboard.css     dashboard              └── dashboard.js no-results.js
```

Every page loads the same three scripts in order (`defer` preserves it):
`data/tuntut-data.js` → `assets/app.js` → `assets/<page>.js`.

## Notes & known limits

- **The data is Ahmad's regardless of the IC you type.** Any 12 digits pass; it's a prototype.
- **The 2s load is hardcoded** (`LOAD_MS` in `assets/landing.js` and `assets/story.js`).
- **The sign-up modal is mock.** Google and Facebook aren't wired to anything; no account is created and
  nothing is sent. The modal says so.
- **The claim button says `RM 3,410`** — `totals.needsApplying`, not the full total, because that's the only
  part the "5 minutes" actually buys. The already-yours money sits beside it, so nothing is hidden.
- **The carousel card is a fixed 560×600.** That's deliberate: the Next button must never move between
  slides. Below a 600px viewport it relaxes to fit.
- **Fraunces loads from Google Fonts**, so offline it falls back to Georgia — close, slightly less refined.
- Flow state (`tuntut.ic`, `tuntut.authed`) lives in `localStorage`, not `sessionStorage`, which is
  unreliable across some navigations. `index.html` clears it on load, so it still behaves like a session.

## Design

Paper Premium · Prussian Blue. All tokens live in `assets/theme.css` `:root` — every page reads them, so
changing the palette there re-skins the whole app at once. Rejected directions and the other palettes are
archived in [`../info/design-explorations/`](../info/design-explorations/README.md).
