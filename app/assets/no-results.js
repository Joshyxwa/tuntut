/* The empty state. Same status vocabulary as everything else:
   glyph + colour + plain words. Copy stays kind — finding nothing
   isn't the user's fault, and it isn't necessarily final. */
(function () {
  "use strict";

  if (Tuntut.guard(Tuntut.ic, "/")) return;

  var e = Tuntut.data.empty;

  document.getElementById("slide").innerHTML =
    '<div class="band ' + e.status + '">' +
      Tuntut.glyph(e.status, "lg") +
      '<span class="label">' + Tuntut.esc(e.statusLabel) + "</span>" +
    "</div>" +
    '<div class="slide-body">' +
      "<h2>" + Tuntut.esc(e.title) + "</h2>" +
      "<p>" + Tuntut.esc(e.line) + "</p>" +
      '<p class="foot-line">' + Tuntut.esc(e.foot) + "</p>" +
      '<a class="btn btn-primary" href="/" style="margin-top:20px">' + Tuntut.esc(e.cta) + "</a>" +
    "</div>";
})();
