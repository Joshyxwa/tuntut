/* Carousel: [intro, ...schemes, claim]. One idea per slide, one way forward. */
(function () {
  "use strict";

  // No IC means you skipped the front door.
  if (Tuntut.guard(Tuntut.ic, "index.html")) return;

  var d = Tuntut.data;
  var t = Tuntut.totals;

  document.getElementById("topbar").innerHTML =
    Tuntut.topbar(Tuntut.authed ? { label: "Dashboard →", href: "dashboard.html" } : null);

  // ---- build the slides ----
  var slides = [];

  slides.push({
    band: { status: "good", label: "Good news, " + d.user.name },
    render: function () {
      return '<div class="mega"><small>' + d.meta.currency + "</small>" + fmt(t.found) + "</div>" +
        "<h2>is sitting in your name</h2>" +
        "<p>Across " + t.schemeCount + " government schemes — and it comes in two kinds.</p>" +
        Tuntut.split();
    }
  });

  d.schemes.forEach(function (s) {
    slides.push({
      band: { status: s.status, label: s.statusLabel },
      render: function () {
        return '<p class="kicker">' + Tuntut.esc(s.simple.kicker) + "</p>" +
          "<h2>" + Tuntut.esc(s.simple.title) + "</h2>" +
          "<p>" + Tuntut.esc(s.simple.line) + "</p>" +
          '<p class="foot-line">' + foot(s) + "</p>";
      }
    });
  });

  /* Litres and "a free screening" don't answer the only question the user has:
     what is this worth to me? So schemes that aren't already a ringgit figure
     put their value here. BUDI95's is derived from the same place the dashboard
     and the totals read it — stating it again would be a copy of a number that
     moves weekly. Returns HTML; the prose halves are escaped. */
  function foot(s) {
    var worth = s.litres ? Tuntut.schemeRm(s) : s.worth;
    if (worth) {
      return '<b class="worth">≈ ' + Tuntut.esc(Tuntut.rm(worth)) + "</b> " +
        Tuntut.esc(s.simple.worthFoot);
    }
    return Tuntut.esc(s.simple.foot || "");
  }

  slides.push({
    band: { status: "warn", label: "That's everything" },
    render: function () {
      return "<h2>Ready to get it?</h2>" +
        Tuntut.split() +
        '<div class="total"><span>Total</span><b>' + Tuntut.rm(t.found) + "</b></div>" +
        '<p class="claim-note">' + d.meta.figuresNote + ".</p>";
    },
    /* The button promises only the money the 5 minutes actually buys. The
       RM the user can just tap is on the same screen, so nothing is hidden —
       but padding the button with it would be a promise we don't keep. */
    cta: { label: "Claim " + Tuntut.rm(t.needsApplying) + " (takes " + t.claimMinutes + " minutes)" }
  });

  // ---- wiring ----
  var slideEl = document.getElementById("slide");
  var dotsEl  = document.getElementById("dots");
  var backEl  = document.getElementById("back");
  var nextEl  = document.getElementById("next");
  var sheetEl = document.getElementById("signup");
  var i = 0;

  var LOAD_MS = 2000; // matches the landing check, so the demo has one rhythm

  dotsEl.innerHTML = slides.map(function () { return "<i></i>"; }).join("");
  var dots = Array.prototype.slice.call(dotsEl.children);

  function fmt(n) { return Number(n).toLocaleString("en-MY"); }

  function draw() {
    var s = slides[i];
    var b = s.band;
    slideEl.innerHTML = '<section class="slide anim">' +
        '<div class="band ' + b.status + '">' +
          Tuntut.glyph(b.status, "lg") +
          '<span class="label">' + Tuntut.esc(b.label) + "</span>" +
        "</div>" +
        '<div class="slide-body">' + s.render() + "</div>" +
      "</section>";

    dots.forEach(function (dot, n) {
      dot.classList.toggle("on", n === i);
      dot.classList.toggle("seen", n < i);
    });

    backEl.disabled = i === 0;
    nextEl.textContent = s.cta ? s.cta.label : "Next →";
    nextEl.classList.toggle("btn-sm", !!s.cta);
  }

  function go(n) {
    if (n < 0 || n >= slides.length) return;
    i = n;
    draw();
  }

  nextEl.addEventListener("click", function () {
    if (slides[i].cta) { openSheet(); return; }
    go(i + 1);
  });
  backEl.addEventListener("click", function () { go(i - 1); });

  document.addEventListener("keydown", function (e) {
    /* The last slide is a wall: only a deliberate click on the claim button
       gets past it. Letting a held-down arrow key open the sign-up would be
       claiming on the user's behalf, which is the one thing we don't do. */
    if (e.key === "ArrowRight" && !slides[i].cta) go(i + 1);
    if (e.key === "ArrowLeft" && !backEl.disabled) go(i - 1);
  });

  // ---- the sign-up modal ----
  /* Inline SVG marks. Self-contained on purpose: this prototype has to run by
     double-click from file://, where a CDN or a remote logo is a broken image. */
  var ICONS = {
    google: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true">' +
      '<path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.500h7.1c4.2-3.8 6.6-9.5 6.6-16.1z"/>' +
      '<path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.6-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z"/>' +
      '<path fill="#FBBC05" d="M11.6 28.1c-.5-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1V14H4.3C2.8 17 2 20.4 2 24s.8 7 2.3 10l7.3-5.9z"/>' +
      '<path fill="#EA4335" d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.3 30 2 24 2 15.4 2 7.9 6.9 4.3 14l7.3 5.7c1.8-5.2 6.6-8.9 12.4-8.9z"/></svg>',
    facebook: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true">' +
      '<path fill="#1877F2" d="M46 24C46 11.8 36.2 2 24 2S2 11.8 2 24c0 11 7.9 20.1 18.4 21.7V30.4h-5.5V24h5.5v-4.8c0-5.5 3.3-8.5 8.3-8.5 2.4 0 4.9.4 4.9.4v5.4h-2.8c-2.7 0-3.6 1.7-3.6 3.4V24h6.1l-1 6.4h-5.1v15.3C38.1 44.1 46 35 46 24z"/></svg>'
  };

  var a = d.auth;
  document.getElementById("sheet-title").textContent = a.title;
  document.getElementById("sheet-mock").innerHTML = "🧪 <b>Prototype.</b> " + Tuntut.esc(a.mock);
  document.getElementById("sheet-busy").textContent = a.busy;
  document.getElementById("sheet-lead").innerHTML =
    "<b>" + Tuntut.esc(a.lead.split(".")[0]) + ".</b>" + Tuntut.esc(a.lead.slice(a.lead.indexOf(".") + 1));
  document.getElementById("sheet-guard").innerHTML =
    '<span class="shield">🛡️</span><div>' + Tuntut.esc(d.guardrail.body.split(".")[0]) + ".</div>";
  document.getElementById("sheet-providers").innerHTML = a.providers.map(function (p) {
    return '<button class="btn btn-ghost prov" type="button" data-provider="' + p.id + '">' +
      (ICONS[p.id] || "") + Tuntut.esc(p.label) + "</button>";
  }).join("");

  function openSheet() {
    sheetEl.classList.remove("working");
    sheetEl.showModal();
  }

  /* Mock: no provider is contacted, nothing is sent, no account exists.
     We spin only so the demo feels like the real thing it stands in for. */
  function signIn() {
    sheetEl.classList.add("working");
    setTimeout(function () {
      Tuntut.authed = true;
      location.href = "dashboard.html";
    }, LOAD_MS);
  }

  Array.prototype.forEach.call(sheetEl.querySelectorAll("[data-provider]"), function (b) {
    b.addEventListener("click", signIn);
  });
  document.getElementById("sheet-close").addEventListener("click", function () { sheetEl.close(); });

  draw();
})();
