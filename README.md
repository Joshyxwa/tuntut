# Tuntut

**Find what you may be owed. Then finish the safest possible next step.**

Tuntut is a synthetic, cache-first demo of claim orchestration. It separates simulated balances from
estimates, explains one safe next action, and hands control back to the official service at every
identity, declaration, document, clinical, or physical-presence gate.

The companion follows OpenClicky's non-invasive pattern: the deterministic workflow remains authoritative,
while voice and pointer controls only explain what is already on screen.

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
| **Ahmad · synthetic household** | Carousel → demo identity → claim map → guided practice |
| **No-record demo** | The safe "nothing found" provider state |

## This is a prototype

Please read this before drawing conclusions from the demo:

- **Every amount and status is simulated.** No live provider or government portal is queried.
- **The identity is synthetic.** No account is created and no Malaysian ID is needed.
- **Guided practice is local and deterministic.** eGUMIS, SARA, and PeKa B40 flows keep working
  without the optional voice service.
- **No official credentials or sensitive documents belong here.** Never enter an IC, password,
  OTP, bank number, medical detail, or exact location in the demo.

## Layout

```
app/
├── index.html · story.html · dashboard.html · guide.html · no-results.html
├── api/elevenlabs-signed-url.js  ← server-only voice credential exchange
├── data/tuntut-data.js   ← the single source of truth. Change numbers here.
└── assets/               theme.css + per-page css/js
```

## Optional ElevenLabs voice guide

The visual guide and device speech fallback require no setup. For the realtime ElevenLabs agent,
deploy `app/` on Vercel and set `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID` from
`app/.env.example`. The API key is read only by the serverless function and is never shipped to the browser.

Configure the ElevenLabs agent as private with authentication enabled. Runtime prompt and first-message
overrides are intentionally not required, so a restricted agent works without weakening its security settings.
Use this agent prompt:

> You are the Tuntut voice guide for a non-technical Malaysian user. Use plain, calm, short sentences.
> Explain only the current synthetic practice workflow. Never request an IC, password, PIN, OTP, bank
> number, medical detail, or exact location. Never claim that an amount or eligibility is real. You cannot
> advance the workflow or skip a declaration, identity, document, clinical, or physical-presence gate. Call
> `getCurrentGuideStep` before step-specific advice. Call `highlightCurrentAction` when the user asks where
> to click.

Set a short first message such as “Hi, I’m your Tuntut guide. Which step would you like help with?” and add
these read-only client tools:

- `getCurrentGuideStep` — no parameters; returns the current deterministic step.
- `highlightCurrentAction` — no parameters; points at the current on-screen action.

The voice agent intentionally has no tool that advances a step, switches a platform, submits a form,
or bypasses a human gate. Use a scope-restricted API key with a low credit quota.

## TODO: integrate the guide into the latest UI

When another branch contains newer landing, story, or dashboard work, carry the guide as an isolated
feature instead of replacing those pages.

Required guide files:

- `app/guide.html`
- `app/assets/guide.css`
- `app/assets/guide.js`
- `app/api/elevenlabs-signed-url.js`
- `app/.env.example` (configuration reference only; never commit the real `.env`)

Keep the newer branch's `app/assets/app.js`, `app/assets/theme.css`, and
`app/data/tuntut-data.js`. The guide expects that shared runtime to expose `Tuntut.authed`,
`Tuntut.guard()`, `Tuntut.esc()`, and `Tuntut.topbar()`.

Add the appropriate links to the latest dashboard or navigation:

- `guide.html?platform=egumis`
- `guide.html?platform=sara`
- `guide.html?platform=peka`

For Vercel voice support, configure `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID`. Without them,
the deterministic pointer, form rules, written guidance, and device-speech fallback still work.
Direct guide access also follows the existing demo authentication guard and redirects to `index.html`
until `Tuntut.authed` is true.

`app/README.md` has the detail: the data model, why `worth` and `rm` are different, the status
system, and the accessibility rules behind the palette.

## A note on `info/`

The research, design explorations and team notes live in `info/`, which is intentionally **not**
published — it contains personal data gathered during live testing, and internal notes that were
never written for an audience. It stays local on purpose.
