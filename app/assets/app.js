/* Shared runtime: data access, formatting, session, route guards.
   Loaded after data/tuntut-data.js and before every page script. */
(function () {
  "use strict";

  // Freeze the data all the way down — the app reads, never writes.
  function deepFreeze(o) {
    Object.getOwnPropertyNames(o).forEach(function (k) {
      var v = o[k];
      if (v && typeof v === "object" && !Object.isFrozen(v)) deepFreeze(v);
    });
    return Object.freeze(o);
  }

  var data = deepFreeze(window.TUNTUT_DATA);

  /* What a scheme is worth in ringgit, today.
     Most schemes just state it. BUDI95 can't: it holds a fuel quota, and
     litres are only worth what the subsidy saves you, which moves weekly. */
  function schemeRm(s) {
    if (s.litres) {
      var save = data.meta.ron95.unsubsidised - data.meta.ron95.subsidised;
      return Math.round(s.litres * save);
    }
    return s.rm || 0;
  }

  function sumWhere(kind) {
    return data.schemes.reduce(function (t, s) {
      return t + (s.claimKind === kind ? schemeRm(s) : 0);
    }, 0);
  }

  /* The totals are derived, never stored. The headline is the sum of its
     parts by construction, so it cannot contradict the rows beneath it —
     change a scheme (or this week's fuel price) and everything moves. */
  var readyToUse = sumWhere("tap");
  var needsApplying = sumWhere("apply");
  var totals = Object.freeze({
    readyToUse: readyToUse,       // already yours — just tap
    needsApplying: needsApplying, // real money, needs a form we fill in
    found: readyToUse + needsApplying,
    schemeCount: data.schemes.filter(function (s) { return schemeRm(s) > 0; }).length,
    claimMinutes: data.totals.claimMinutes
  });

  var KEY_IC = "tuntut.ic";
  var KEY_AUTH = "tuntut.authed";

  /* Flow state lives in localStorage, not sessionStorage, on purpose.
     This prototype is opened by double-clicking (file://), and sessionStorage
     is unreliable across file:// page navigations — if it drops, every guard
     bounces you home mid-demo. localStorage is shared across file:// documents.
     index.html calls reset() on load, so each run still starts clean.
     Falls back to memory if storage is disabled entirely (private mode). */
  var store = (function () {
    try {
      var k = "__t";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return localStorage;
    } catch (e) {
      var mem = {};
      return {
        getItem: function (k) { return k in mem ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; }
      };
    }
  })();

  var Tuntut = {
    data: data,
    totals: totals,
    schemeRm: schemeRm,

    /** 3877 -> "RM 3,877" */
    rm: function (n) {
      return data.meta.currency + " " + Number(n).toLocaleString("en-MY");
    },

    scheme: function (id) {
      return data.schemes.find(function (s) { return s.id === id; });
    },

    schemesIn: function (bucket) {
      return data.schemes.filter(function (s) { return s.bucket === bucket; });
    },

    // ---- session (flow state only; never touches the data) ----
    get ic() { return store.getItem(KEY_IC); },
    set ic(v) { store.setItem(KEY_IC, v); },
    get authed() { return store.getItem(KEY_AUTH) === "1"; },
    set authed(v) { v ? store.setItem(KEY_AUTH, "1") : store.removeItem(KEY_AUTH); },
    reset: function () { store.removeItem(KEY_IC); store.removeItem(KEY_AUTH); },

    /** Bounce to `to` unless `ok`. Returns true if we redirected. */
    guard: function (ok, to) {
      if (!ok) { location.replace(to); return true; }
      return false;
    },

    /** A status glyph. size: "sm" (tags) | "md" (split rows) | "lg" (carousel band).
        Decorative to the DOM on purpose — the word beside it carries the meaning. */
    glyph: function (status, size) {
      return '<span class="glyph ' + status + " " + (size || "sm") + '" aria-hidden="true"></span>';
    },

    /** The full status pill: glyph + plain-language word. Never colour alone. */
    tag: function (status, label) {
      return '<span class="tag ' + status + '">' + Tuntut.glyph(status, "sm") +
        Tuntut.esc(label) + "</span>";
    },

    /** The two piles, as one block: tap-money and apply-money.
        One total tells you how much; this tells you what to DO, which is the
        only question the user actually has. Each row is glyph + colour + plain
        words — never a bare number, and never colour alone. */
    split: function () {
      var c = data.splitCopy;
      return '<div class="split">' +
        splitRow(c.tap, totals.readyToUse) +
        splitRow(c.apply, totals.needsApplying) +
        "</div>";
    },

    /** Minimal escaping — data is ours, but templates shouldn't be injectable by habit. */
    esc: function (s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    },

    /** Shared topbar chips + optional view-toggle. */
    topbar: function (toggle) {
      var u = data.user;
      return '<span class="wordmark">Tun<b>tut</b></span>' +
        '<span class="chip"><span class="dot"></span> IC <span class="num">' + Tuntut.esc(u.icMasked) + "</span></span>" +
        '<span class="chip hide-sm">Last checked <span class="num">' + Tuntut.esc(u.lastChecked) + "</span></span>" +
        '<span class="spacer"></span>' +
        (toggle ? '<a class="btn btn-ghost btn-sm" href="' + toggle.href + '">' + Tuntut.esc(toggle.label) + "</a>" : "");
    }
  };

  function splitRow(copy, amount) {
    return '<div class="row ' + copy.status + '">' +
      Tuntut.glyph(copy.status, "md") +
      '<div class="txt"><span class="amt num">' + Tuntut.rm(amount) + "</span>" +
        "<b>" + Tuntut.esc(copy.label) + "</b> " + Tuntut.esc(copy.line) +
      "</div>" +
    "</div>";
  }

  window.Tuntut = Tuntut;
})();
