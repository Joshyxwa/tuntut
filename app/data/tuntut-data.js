/* ============================================================
   THE DATA. Every screen reads from here; nothing writes to it.
   Deep-frozen by app.js on load, so a stray assignment fails loudly
   in strict mode instead of silently corrupting a demo.

   Why .js and not .json: browsers block fetch() of local files from
   a file:// page (null origin), so a real .json would break the
   double-click-to-open workflow. This is the same data, one object,
   one source of truth — just delivered as a global instead of fetched.
   (We tried .json; it works, but only behind a web server. Not worth it.)

   The RM totals are NOT stored here. app.js adds them up from the
   schemes below, so the headline can never drift out of step with
   its parts. See Tuntut.totals.

   Figures are illustrative pending live checks.
   ============================================================ */
window.TUNTUT_DATA = {
  meta: {
    currency: "RM",
    figuresNote: "Figures shown are illustrative pending live checks",
    brand: "Tuntut by Team Cai Fun",

    /* What BUDI95 is actually worth per litre.
       The subsidised price is fixed at RM1.99. The unsubsidised pump price
       is NOT — it floats weekly under the Automatic Pricing Mechanism, so it
       has to be dated. RM2.60 was only the launch price (30 Sep 2025); this
       is the current week. Update these two numbers and every figure that
       depends on the fuel moves with them. */
    ron95: { subsidised: 1.99, unsubsidised: 3.42, priceWeek: "16–22 Jul 2026" }
  },

  user: {
    name: "Ahmad",
    icMasked: "•••• 5432", // a mask, deliberately — never a full IC. Fabricated, not a real IC.
    lastChecked: "2m ago"
  },

  totals: {
    claimMinutes: 5 // how long we promise the guided claim takes
  },

  // Type this IC on the landing page to see the "nothing found" state.
  demo: { emptyIc: "000000000000" },

  // Copy for that empty state. Kind, never blaming — finding nothing isn't their fault.
  empty: {
    status: "bad",
    statusLabel: "Nothing found",
    title: "We didn't find anything for this IC",
    line: "That doesn't mean you're not owed anything. Some schemes only show up after you sign in with MyDigital ID, and new aid is added all the time.",
    foot: "Nothing was saved. You can try another IC.",
    cta: "Try another IC"
  },

  buckets: {
    use:  "01 · Ready to use — nothing to file",
    file: "02 · We'll file it for you",
    step: "03 · Needs one more step"
  },

  /* The two piles the whole app is built on:
       claimKind "tap"   — already yours, just spend it. No form, no wait.
       claimKind "apply" — real money, but it needs paperwork we do for you.
     A scheme with no claimKind carries no ringgit and stays out of the totals. */
  splitCopy: {
    tap:   { status: "good", label: "Already yours", line: "Just tap your MyKad." },
    apply: { status: "warn", label: "Needs a form", line: "We fill it in — 5 minutes." }
  },

  schemes: [
    {
      id: "egumis",
      name: "eGUMIS",
      bucket: "file",
      rm: 3410,
      claimKind: "apply",
      figure: "RM 3,410",
      title: "unclaimed money in your name",
      caption: "Held by KWSP & two former employers. It needs Form UMA-7 — Tuntut fills it in, you just sign. Full amount revealed after you connected your MyDigital ID.",
      status: "good", statusLabel: "Money found",
      source: "egumis.anm.gov.my",
      link: { label: "Prepare my UMA-7 →", href: "#" },
      mini: { label: "eGUMIS — unclaimed money", value: "RM 3,410", pos: true },
      simple: {
        kicker: "The big one",
        title: "RM 3,410 is sitting unclaimed",
        line: "Old money in your name, held by KWSP and two former employers. It's yours — it just needs a form.",
        foot: "We fill in Form UMA-7. You only sign."
      }
    },
    {
      id: "sara",
      name: "SARA",
      bucket: "use",
      rm: 38,
      claimKind: "tap",
      heading: "SARA grocery credit",
      figure: "RM 38",
      caption: "balance on your MyKad",
      status: "good", statusLabel: "Ready to use",
      bar: { pct: 34, kind: "warn", left: "Expires in 20 days", right: "30 Jun" },
      expiry: { inDays: 20, date: "30 Jun" },
      source: "mykasih.net",
      link: { label: "Find nearest kedai →", href: "#" },
      mini: { label: "SARA — grocery credit", value: "RM 38" },
      simple: {
        kicker: "Use it or lose it",
        title: "RM 38 of groceries, already yours",
        line: "It's loaded on your MyKad right now. Nothing to apply for — just tap at a participating kedai.",
        foot: "Expires in 20 days. We'll remind you."
      }
    },
    {
      /* The one computed scheme. It carries no `rm` and no `figure`: a fuel
         quota is litres, and what those litres are WORTH depends on this
         week's unsubsidised price. app.js derives the ringgit; dashboard.js
         derives the figure and the bar. All of it from these two numbers. */
      id: "budi95",
      name: "BUDI95",
      bucket: "use",
      claimKind: "tap",
      litres: 166,
      quota: 200,
      heading: "BUDI95 fuel quota",
      caption: "RON95 left this month",
      status: "good", statusLabel: "Active",
      resets: "1 Jul",
      source: "budirakyat",
      link: { label: "Auto-applied at the pump", href: "#" },
      mini: { label: "BUDI95 — fuel this month" },
      simple: {
        kicker: "Already switched on",
        title: "166 of your 200 litres left",
        line: "Subsidised RON95 for this month. You don't need to do anything — it comes off automatically at the pump.",
        // `worthFoot` follows the derived amount — litres alone don't tell you
        // what the quota is worth. See foot() in story.js.
        worthFoot: "saved if you use it all."
      }
    },
    {
      id: "mysalam",
      name: "mySalam",
      bucket: "use",
      heading: "mySalam cover",
      // The one genuine "no" in the set. Without it, every tick is decoration.
      figure: "Not eligible",
      figureBad: true,
      caption: "B40 medical & income takaful",
      status: "bad", statusLabel: "Not eligible",
      desc: "Your income record puts you outside the B40 band this scheme covers. Nothing you did wrong — it just isn't for you.",
      source: "mysalam",
      link: { label: "Why not? →", href: "#" },
      // Pill, not bare text: "Not eligible" in red is colour carrying meaning
      // alone. The pill adds the ✕ glyph + word, so it survives greyscale.
      mini: { label: "mySalam — B40 cover", pill: true },
      simple: {
        kicker: "One you don't have",
        title: "You're not covered by mySalam",
        line: "It's for B40 households, and your income record sits just outside it. This is the only thing on your list you can't get.",
        foot: "Nothing to do here. The rest is still yours."
      }
    },
    {
      /* `worth` is display-only and deliberately has no claimKind: it's a
         service, not ringgit you can spend, so it must never reach the totals.
         RM 60 = what ProtectHealth pays the clinic for you (RM 40 first visit
         + RM 20 follow-up) — the screening's real cost, which you don't pay. */
      id: "peka",
      name: "PeKa B40",
      bucket: "step",
      worth: 60,
      heading: "PeKa B40 screening",
      desc: "Free health screening for B40 aged 40+. You qualify — a clinic visit activates it.",
      status: "warn", statusLabel: "Action needed",
      source: "pekab40",
      link: { label: "We'll help you book →", href: "#" },
      mini: { label: "PeKa B40 — free screening", pill: true },
      simple: {
        kicker: "One visit away",
        title: "A free health screening",
        line: "You qualify for PeKa B40. It only switches on once you show up at a clinic.",
        worthFoot: "of screening, free to you — the clinic gets paid, not you."
      }
    },
    {
      /* Locked, so it deliberately carries no claimKind: the RM 1,200 is an
         estimate the government hasn't shown us yet. Counting unrevealed
         money in the headline would be promising what we can't see. */
      id: "ekasih",
      name: "eKasih",
      bucket: "step",
      heading: "eKasih status",
      locked: true,
      figure: "RM 1,200",
      caption: "hardship top-up estimate",
      status: "warn", statusLabel: "Locked",
      lock: { tag: "Connect to reveal", text: "One more MyDigital ID check unlocks your eKasih record.", cta: "Connect →" },
      mini: { label: "eKasih — hardship top-up", pill: true },
      simple: {
        kicker: "Still locked",
        title: "One more check to go",
        line: "Your eKasih record needs a second MyDigital ID login before we can show what's there.",
        foot: "Takes about 30 seconds."
      }
    }
  ],

  // Shown when a not-yet-built button is tapped. Every dead control in the
  // prototype is <a href="#">; app.js catches them all and opens this.
  notReady: {
    title: "Sabar ya",
    body: "Still building this one. Our team runs on kopi O and optimism. Coming very soon.",
    close: "OK lah"
  },

  // The sign-up modal at the end of the carousel. Mock — see `mock` below.
  auth: {
    title: "Sign in to keep this safe",
    lead: "Signing in keeps your money safe. It locks what we found to you, so only you can see it — and lets us remind you before anything expires.",
    // The "🧪 Prototype." label is added by the template — don't repeat it here.
    mock: "These buttons aren't really connected to Google or Facebook — nothing is sent anywhere and no account is created.",
    providers: [
      { id: "google", label: "Continue with Google" },
      { id: "facebook", label: "Continue with Facebook" }
    ],
    busy: "Signing you in…"
  },

  guardrail: {
    lead: "Tuntut guides, it never impersonates.",
    body: "We never ask for your password, OTP or PIN, and we don't store your IC. Your IC is a lookup key, not a login — you always sign in on the government's own MyDigital ID page. The Ministry of Finance appoints no paid “claim agents”."
  }
};
