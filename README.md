# Tuntut

**You've got unclaimed money sitting somewhere. Time to bring it home.**

Tuntut is a synthetic demonstration of a simpler way to navigate Malaysian assistance, benefits, and unclaimed-money services. It brings several programme results into one claim map, explains what each result means in plain language, and lets the user practise the next step before visiting an official service.

**Live:** https://tuntut-blush.vercel.app

Built for CodexMY · Team Cai Fun · Public Systems track.

## How the demo works

```text
Choose a demo scenario
        ↓
Load simulated programme records
        ↓
Review the results as a short story
        ↓
Continue with a local demo session
        ↓
See the complete claim map
        ↓
Practise an eGUMIS, SARA, or PeKa B40 journey
```

### 1. Choose a demo scenario

The landing page never asks for a Malaysian identity number. The user chooses one of two safe scenarios:

| Scenario | Result |
|---|---|
| **Complete demo** | Opens the complete story, claim map, and practice journeys |
| **No-record demo** | Shows how the product explains an empty provider result without blaming the user |

The short loading sequence represents checking multiple programmes. It reads only the fixtures stored with the demo; no government service is contacted.

### 2. Understand the results

The story view introduces one result at a time. It distinguishes between:

- Support that is already available to use.
- Money that would require an application or document.
- Services that require an in-person or official next step.
- Programmes where the selected demo scenario is not eligible.

Amounts, eligibility decisions, provider responses, locations, and dates are all simulated. Status is communicated with a symbol, colour, and plain-language label rather than colour alone.

### 3. Continue with a local demo session

At the end of the story, the user starts a local demo session. This allows the claim map and practice progress to work without creating an account or contacting an identity provider.

### 4. Review the claim map

The dashboard groups results by what the user should do next:

- **Ready to use** — support that would not need a new application.
- **Needs a form** — a result that would require paperwork and an official submission.
- **Needs one more step** — a clinic visit, identity check, or another action outside Tuntut.

The total is derived from the individual eligible fixtures. Service values and unrevealed estimates are kept separate so they are not presented as spendable cash.

### 5. Practise the next step

The practice page contains three simulated service journeys. Each screen explains the current task and highlights the first incomplete required action. On forms with multiple fields, guidance moves in order only after the current field is valid. Continue buttons remain locked until the required fields or acknowledgements are complete.

#### eGUMIS practice

The user practises how to:

1. Read a synthetic unclaimed-money result.
2. Create a demo profile using synthetic details.
3. Select the relevant record.
4. Confirm synthetic payee information.
5. Simulate preparing a supporting bank document.
6. Review the declaration and approve the handoff.
7. Stop before the official login and submission.

No claim is submitted and no document is uploaded.

#### SARA practice

The user practises how to:

1. Understand that the simulated balance is grocery credit rather than cash.
2. Search with a coarse demo postcode.
3. Review a synthetic participating shop.
4. Prepare a short in-person shopping checklist.
5. Stop before using a physical MyKad at a real checkout.

No balance is used and no location is retained.

#### PeKa B40 practice

The user practises how to:

1. Understand the simulated screening eligibility result.
2. Search with a coarse demo postcode.
3. Review a synthetic clinic result and its practical details.
4. Prepare an in-person visit checklist.
5. Stop before clinical verification and screening.

No appointment is booked and no health information is stored.

## Safety boundaries

Tuntut explains and prepares; the user remains responsible for every official action.

- Never enter a real identity number, password, PIN, OTP, bank number, medical detail, or exact location.
- No fixture represents a real person, provider response, balance, eligibility decision, shop, or clinic.
- No official form, declaration, appointment, purchase, or claim is submitted by this demo.
- Identity checks, declarations, original documents, clinical decisions, and physical visits always remain human-controlled handoff points.
- Completing a practice journey means the user understands the next action; it does not mean the real-world task is complete.

## Run locally

The app uses Vercel clean URLs (`/dashboard`, `/story`), so it needs a server that resolves extensionless paths. Opening the files directly (`open app/index.html`, i.e. `file://`) or serving with a bare `python -m http.server` will 404 on the first navigation. Use `serve`, whose static routing matches Vercel's:

```bash
npx serve app
```

Then open the printed `http://localhost:3000`. There's no build step — this only mirrors the deployment's `cleanUrls` behaviour locally; nothing about the Vercel setup changes.

## State and data

The demo uses local browser storage for its temporary flow state:

- Selected demo scenario.
- Local demo-session status.
- Progress within each practice journey.

Returning to the landing page resets the current run.

All fixtures live in `app/data/tuntut-data.js`. The shared runtime reads and freezes that object, derives totals from the scheme records, and exposes the same result data to the story and dashboard. Nothing in the browser writes back to the fixture file.

## Project layout

```text
app/
├── index.html          demo-scenario selection
├── story.html          plain-language result walkthrough
├── dashboard.html      complete claim map
├── guide.html          simulated service practice
├── no-results.html     empty provider-result state
├── data/
│   └── tuntut-data.js  shared synthetic fixtures
└── assets/
    ├── theme.css       shared design system
    ├── app.js          state, calculations, and route guards
    └── page files      page-specific styles and behaviour
```

## Prototype limits

- Programme records are cached fixtures rather than live provider data.
- Amounts, dates, opening hours, distances, and eligibility results are illustrative.
- The demo session is local and does not create an account.
- Search results do not use live geolocation.
- Supporting-document actions are simulations.
- Official services may change their fields, rules, or order independently of this demo.
