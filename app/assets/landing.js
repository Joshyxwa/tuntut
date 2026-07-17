/* Landing: take an IC, fake a 2s check, hand off to the carousel. */
(function () {
  "use strict";

  var LOAD_MS = 2000; // hardcoded for the prototype

  // The front door is also the reset button — every demo run starts clean.
  Tuntut.reset();

  var entry = document.getElementById("entry");
  var form  = document.getElementById("ic-form");
  var input = document.getElementById("ic");
  var err   = document.getElementById("err");
  var ticks = document.getElementById("ticks");

  // The schemes we "check" during the wait — real names, from the data.
  var checking = Tuntut.data.schemes.slice(0, 5).map(function (s) { return s.name; });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var digits = input.value.replace(/\D/g, "");
    if (digits.length !== 12) {
      err.textContent = "Enter 12 digits — any number works to try it.";
      input.focus();
      return;
    }
    err.textContent = "";

    // Flow state only. The IC never leaves the tab, and the data file is untouched.
    Tuntut.ic = digits;

    run();
  });

  function run() {
    entry.classList.add("busy");
    document.getElementById("loading").classList.add("on");

    ticks.innerHTML = checking.map(function (n) {
      return "<li>" + Tuntut.esc(n) + "</li>";
    }).join("");

    // Tick the schemes off across the wait so the pause feels like work.
    var items = Array.prototype.slice.call(ticks.children);
    var step = LOAD_MS / (items.length + 1);
    items.forEach(function (li, i) {
      setTimeout(function () { li.classList.add("done"); }, step * (i + 1));
    });

    // The demo IC that turns up nothing — see README.
    var empty = Tuntut.ic === Tuntut.data.demo.emptyIc;
    setTimeout(function () {
      location.href = empty ? "/no-results" : "/story";
    }, LOAD_MS);
  }
})();
