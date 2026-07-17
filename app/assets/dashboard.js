/* Dashboard: renders the full picture from the data file. */
(function () {
  "use strict";

  // Sign-up is a modal on the last carousel slide now, so there's no auth page
  // to bounce to — send them back to the front door for a clean run.
  if (Tuntut.guard(Tuntut.authed, "/")) return;

  var d = Tuntut.data;
  var t = Tuntut.totals;
  var esc = Tuntut.esc;

  // ---- topbar, with the toggle back to the simple view ----
  document.getElementById("topbar").innerHTML =
    Tuntut.topbar({ label: "Simple view →", href: "/story" });

  // ---- hero ----
  var minis = d.schemes.filter(function (s) { return s.mini; });
  document.getElementById("hero").innerHTML =
    "<div>" +
      '<p class="hero-lede">Selamat datang, ' + esc(d.user.name) + " — here is what the government owes you.</p>" +
      '<div class="big"><small>' + d.meta.currency + "</small>" + n(t.found) + "</div>" +
      '<p class="sub">Across <b>' + t.schemeCount + " schemes</b>, in two kinds:</p>" +
      Tuntut.split() +
      '<div class="cta-row">' +
        '<a class="btn btn-primary" href="guide.html?platform=egumis">Claim ' + Tuntut.rm(t.needsApplying) + " →</a>" +
      "</div>" +
    "</div>" +
    '<div class="mini">' +
      minis.map(function (s) {
        // A ringgit figure shows the figure; anything else shows a status pill
        // (glyph + word) so the row never leans on colour alone.
        var right = s.mini.pill
          ? tag(s)
          : '<span class="v num' + (s.mini.pos ? " pos" : "") + '">' +
              esc(s.mini.value || miniValue(s)) + "</span>";
        return '<div class="row"><span class="k">' + esc(s.mini.label) + "</span>" + right + "</div>";
      }).join("") +
    "</div>";

  // ---- buckets ----
  var out = "";

  // 01 · ready to use
  out += section(d.buckets.use, ".08s",
    '<div class="grid">' + Tuntut.schemesIn("use").map(card).join("") + "</div>");

  // 02 · we'll file it — the eGUMIS claim panel + the expiry reminder
  var egumis = Tuntut.scheme("egumis");
  var sara = Tuntut.scheme("sara");
  out += section(d.buckets.file, ".16s",
    '<div class="claim">' +
      "<div>" +
        '<div class="claim-tag">' + tag(egumis) + "</div>" +
        "<h3>" + esc(egumis.name) + ' — <span class="amt">' + esc(egumis.figure) + "</span> " + esc(egumis.title) + "</h3>" +
        "<p>" + esc(egumis.caption) + "</p>" +
      "</div>" +
      '<a class="btn btn-primary" href="' + egumis.link.href + '">' + esc(egumis.link.label) + "</a>" +
    "</div>" +
    '<div class="remind"><span>🔔</span><span><span class="num">' + esc(sara.name) + " " + esc(sara.figure) +
      '</span> expires in <span class="num">' + sara.expiry.inDays +
      " days</span> — we'll remind you before it's gone.</span></div>");

  // 03 · needs one more step
  out += section(d.buckets.step, ".24s",
    '<div class="grid">' + Tuntut.schemesIn("step").map(card).join("") + "</div>");

  document.getElementById("buckets").innerHTML = out;

  // ---- guardrail + footnote ----
  document.getElementById("guard").innerHTML =
    '<span class="shield">🛡️</span><div><b>' + esc(d.guardrail.lead) + "</b> " + esc(d.guardrail.body) + "</div>";
  document.getElementById("foot").textContent = d.meta.figuresNote + " · " + d.meta.brand;

  // ---- "claim lined up" celebration ----
  // The guide sends us back with ?done=<platform> when a flow finishes. Pop a
  // green-tick card over the blurred page (same <dialog> chrome as the "Sabar ya"
  // popup in app.js), then strip the param so a refresh never re-pops it.
  claimDone();

  function claimDone() {
    var copy = {
      egumis: "Your eGUMIS claim is all lined up. One sign-in on the official service and the money's on its way home.",
      sara: "Your SARA groceries are sorted. Tap your MyKad at the verified kedai and RM 38 is as good as in the basket.",
      peka: "Your PeKa B40 screening is lined up. Bring your MyKad to the clinic and you're all set — senang."
    };
    var done = new URLSearchParams(location.search).get("done");
    if (!copy[done]) return;
    history.replaceState(null, "", "dashboard.html");

    var dlg = document.createElement("dialog");
    dlg.className = "notready claim-done";
    dlg.innerHTML =
      '<div class="notready-inner">' +
        '<div class="claim-done-mark" aria-hidden="true">✓</div>' +
        "<h2>Nice one, " + esc(d.user.name) + " ✓</h2>" +
        "<p>" + esc(copy[done]) + "</p>" +
        '<button class="btn btn-primary" type="button" data-close>Back to my claims</button>' +
      "</div>";
    document.body.appendChild(dlg);
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
    });
    dlg.showModal();
  }

  // ---- helpers ----
  function n(v) { return Number(v).toLocaleString("en-MY"); }

  /* A fuel quota is litres, but litres don't tell you whether it's worth
     driving to the pump. So show both: the quota as the figure, the ringgit
     it saves as a quiet second line. Both come from `litres` — nothing here
     is retyped, so nothing here can disagree. */
  function fuel(s) {
    var pct = Math.round((s.litres / s.quota) * 100);
    return {
      figure: String(s.litres),
      figureSmall: " / " + s.quota + " L",
      note: "≈ " + Tuntut.rm(Tuntut.schemeRm(s)) + " saved if you use it all",
      bar: { pct: pct, left: pct + "% remaining", right: "Resets " + s.resets }
    };
  }

  function miniValue(s) {
    return s.litres ? s.litres + " L · ≈ " + Tuntut.rm(Tuntut.schemeRm(s)) : "";
  }

  function section(eyebrow, delay, body) {
    return '<section class="sec anim" style="animation-delay:' + delay + '">' +
      '<p class="eyebrow">' + esc(eyebrow) + "</p>" + body + "</section>";
  }

  function tag(s) { return Tuntut.tag(s.status, s.statusLabel); }

  function card(s) {
    if (s.locked) {
      return '<div class="card locked">' +
        '<div class="blurred">' +
          '<div class="ct"><h3>' + esc(s.heading) + "</h3>" + tag(s) + "</div>" +
          '<div class="figure num">' + esc(s.figure) + "</div>" +
          '<p class="caption">' + esc(s.caption) + "</p>" +
        "</div>" +
        '<div class="lockmask">' +
          Tuntut.tag("warn", s.lock.tag) +
          "<p>" + esc(s.lock.text) + "</p>" +
          '<a class="btn btn-primary" href="#" style="padding:9px 16px">' + esc(s.lock.cta) + "</a>" +
        "</div>" +
      "</div>";
    }

    var v = s.litres ? fuel(s) : s;
    var body = "";
    if (v.figure) {
      body += '<div class="figure num' + (s.figurePos ? " pos" : "") + (s.figureBad ? " bad" : "") + '">' +
        esc(v.figure) + (v.figureSmall ? "<small>" + esc(v.figureSmall) + "</small>" : "") + "</div>";
      body += '<p class="caption">' + esc(s.caption) + "</p>";
    }
    if (v.note) body += '<p class="note num">' + esc(v.note) + "</p>";
    if (s.desc) body += '<p class="desc">' + esc(s.desc) + "</p>";
    if (v.bar) {
      body += '<div class="barlbl"><span>' + esc(v.bar.left) + "</span><span>" + esc(v.bar.right) + "</span></div>";
      body += '<div class="bar' + (v.bar.kind === "warn" ? " warn" : "") + '"><i style="width:' + v.bar.pct + '%"></i></div>';
    }

    return '<div class="card">' +
      '<div class="ct"><h3>' + esc(s.heading) + "</h3>" + tag(s) + "</div>" +
      body +
      '<div class="foot"><a href="' + s.link.href + '">' + esc(s.link.label) + "</a>" +
        '<span class="src">' + esc(s.source) + "</span></div>" +
    "</div>";
  }
})();
