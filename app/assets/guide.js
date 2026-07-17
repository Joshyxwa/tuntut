/* Synthetic guided workflows. The browser owns state; voice only explains it. */
(function () {
  "use strict";

  if (Tuntut.guard(Tuntut.authed, "index.html")) return;

  var workflows = {
    egumis: {
      icon: "RM",
      tab: "Unclaimed money",
      name: "eGUMIS practice",
      kicker: "Document and human-review workflow",
      mode: "Simulated provider",
      source: "eGUMIS public guidance",
      version: "Demo rules · 17 Jul 2026",
      steps: [
        {
          label: "Understand the result",
          instruction: "This is a practice result. Check the amount and source, then choose Begin practice claim.",
          html: introScreen(
            "Synthetic unclaimed money result",
            "A demo provider found one ordinary-owner record. No official search was made.",
            '<div class="mock-alert warn">Practice record only · Amount is simulated and cannot be claimed from this screen.</div>' +
            '<div class="service-cards"><div class="service-card"><b>RM 3,410</b><span>Simulated confirmed balance</span></div>' +
            '<div class="service-card"><b>Ordinary owner</b><span>Claimant and payee are the same person</span></div></div>' +
            '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Begin practice claim →</button></div>'
          )
        },
        {
          label: "Create a demo profile",
          instruction: "Practise the fields from top to bottom using synthetic details only. The guide moves after each valid field is finished.",
          html: portalFrame("Registration", "User registration", '<div class="mock-alert">Use only synthetic details in this practice portal.</div>' +
            field("Full name *", "Ahmad Demo", "text", "Enter a synthetic full name", "3") +
            selectField("Identification type *", "Demo identity", "Choose Demo identity") +
            field("Email *", "ahmad.demo@example.test", "email", "Enter a synthetic email") +
            field("Username *", "ahmad-demo", "text", "Create a synthetic username", "3") +
            '<label class="mock-check"><input data-required data-guide-label="Tick the practice acknowledgement" type="checkbox"> <span>I understand this is practice and no account will be created.</span></label>' +
            action("Continue to search →", true))
        },
        {
          label: "Select the record",
          instruction: "Select only the record you recognise. This demo has one synthetic result worth RM 3,410.",
          html: portalFrame("Search", "Search result", '<div class="mock-alert">One synthetic record found. Search limits and official status do not apply here.</div>' +
            '<div class="mock-panel"><div class="mock-panel-title">Unclaimed money records</div><div class="mock-panel-body">' +
            '<table class="result-table"><thead><tr><th>Select</th><th>Entity</th><th>Year</th><th>Amount</th></tr></thead><tbody>' +
            '<tr><td><input data-required data-guide-target aria-label="Select synthetic record" type="checkbox"></td><td>Demo Former Employer</td><td>2022</td><td class="amount-cell">RM 3,410</td></tr>' +
            '</tbody></table>' + action("Add selected record →", true) + "</div></div>")
        },
        {
          label: "Confirm the payee",
          instruction: "For an ordinary-owner claim, the payee is the claimant. Practise each synthetic contact field in order, then continue.",
          html: portalFrame("Application", "Payee information", '<div class="mock-alert">Do not enter a real address, phone number, or identification number.</div>' +
            '<label class="mock-check"><input type="checkbox" checked disabled> <span>Personal information is the same as the claimant</span></label>' +
            field("Name *", "Ahmad Demo", "text", "Enter the synthetic payee name", "3") +
            field("City *", "Kajang", "text", "Enter a synthetic city", "2") +
            field("Postcode *", "43000", "text", "Enter a 5-digit postcode", "", "[0-9]{5}") +
            field("Mobile *", "010-000 0000", "tel", "Enter a synthetic mobile number", "9", "[0-9 -]{9,13}") +
            action("Confirm payee →", true))
        },
        {
          label: "Prepare the document",
          instruction: "A recent active bank statement is missing. In real life, prepare it outside Tuntut. Here, simulate adding one.",
          html: portalFrame("Application", "Supporting document", '<div class="mock-alert warn">Human gate · Tuntut cannot create or inspect an original bank document.</div>' +
            '<div class="document-slot" id="document-slot"><div><b>Active bank statement</b><br><span>Shows account holder and active account status</span></div>' +
            '<button class="portal-secondary" data-guide-target data-upload type="button">Simulate adding</button></div>' +
            '<div class="mock-actions"><button class="portal-action" data-next disabled type="button">Review claim →</button></div>')
        },
        {
          label: "Approve the handoff",
          instruction: "Read the declaration yourself. Tuntut must stop here until you approve the official handoff.",
          html: portalFrame("Review", "Ready for official handoff", '<div class="mock-alert warn">Official gate · You must sign in, review the declaration, and submit on the official service yourself.</div>' +
            '<div class="mock-panel"><div class="mock-panel-title">Prepared checklist</div><div class="mock-panel-body">' +
            checklist(["Synthetic owner record selected", "Payee details reviewed", "Bank statement category prepared"]) +
            '<label class="mock-check" data-guide-target><input data-required data-guide-label="Approve the official handoff acknowledgement" type="checkbox"> <span>I understand Tuntut will open the official service but will not submit for me.</span></label>' +
            action("Simulate official handoff →", true) + "</div></div>")
        },
        {
          label: "Handoff prepared",
          instruction: "Practice complete. In real life, the official service takes over and Tuntut remembers only your safe next step.",
          html: completeScreen("Practice complete", "No claim was submitted. Your next real action would be to sign in on the official eGUMIS service and review the prepared checklist.")
        }
      ]
    },

    sara: {
      icon: "🛒",
      tab: "Grocery credit",
      name: "SARA practice",
      kicker: "Location and in-person workflow",
      mode: "Simulated balance",
      source: "SARA public guidance",
      version: "Demo directory · 17 Jul 2026",
      steps: [
        {
          label: "Understand the credit",
          instruction: "This RM 38 is simulated grocery credit, not cash. It can only be used for accepted items at a participating shop.",
          html: introScreen("RM 38 demo grocery credit", "Practise finding a participating shop and preparing for an in-person purchase.",
            '<div class="service-cards"><div class="service-card"><b>RM 38</b><span>Simulated MyKad balance</span></div>' +
            '<div class="service-card"><b>20 days</b><span>Demo expiry window</span></div></div>' +
            '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Find a practice shop →</button></div>')
        },
        {
          label: "Use a coarse location",
          instruction: "Enter a 5-digit postcode, then show nearby shops. Tuntut does not save exact coordinates or send them to the voice guide.",
          html: portalFrame("Merchant finder", "Find a participating shop", '<div class="mock-alert">Privacy: this demo keeps the postcode in this screen only.</div>' +
            '<div class="search-line"><label for="sara-postcode">Postcode</label><input id="sara-postcode" data-required data-guide-label="Enter a 5-digit postcode" placeholder="43000" aria-describedby="sara-postcode-hint" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required><small id="sara-postcode-hint">Use a demo postcode only.</small></div>' +
            action("Show nearby shops →", true))
        },
        {
          label: "Choose a verified result",
          instruction: "Check the distance, hours, and freshness before travelling. This shop is synthetic.",
          html: portalFrame("Merchant finder", "Nearby practice result", '<div class="mock-alert success">Directory checked · Synthetic record · Verify again before travelling.</div>' +
            '<div class="location-card"><h4>Kedai Murni (Demo)</h4><p>1.4 km · Open 9:00am–8:00pm</p><p>Verified for demo on 17 Jul 2026 · Step-free entrance</p></div>' +
            '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Choose this shop →</button></div>')
        },
        {
          label: "Know what to bring",
          instruction: "Bring your physical MyKad and choose accepted grocery items. Never share a PIN or OTP with a shop assistant.",
          html: portalFrame("Visit checklist", "Before you go", '<div class="mock-panel"><div class="mock-panel-title">Your short checklist</div><div class="mock-panel-body">' +
            requiredChecklist(["I will bring my physical MyKad", "I will check that each item is accepted", "I know this credit cannot be withdrawn as cash"]) +
            action("I am ready →", true) + "</div></div>")
        },
        {
          label: "Ready to visit",
          instruction: "Practice complete. At the real shop, you stay in control and tap your own MyKad at checkout.",
          html: completeScreen("You are ready for the shop", "No balance was used and no location was retained. Verify the merchant and opening hours again before travelling.")
        }
      ]
    },

    peka: {
      icon: "✚",
      tab: "Health screening",
      name: "PeKa B40 practice",
      kicker: "Clinic and physical-presence workflow",
      mode: "Calculated eligibility",
      source: "PeKa B40 public guidance",
      version: "Demo rules · 17 Jul 2026",
      steps: [
        {
          label: "Understand the benefit",
          instruction: "This is a free health screening service, not money paid to you. A clinic must confirm eligibility in person.",
          html: introScreen("Free screening practice route", "The demo shows how to find a clinic and prepare for the physical visit.",
            '<div class="mock-alert warn">Calculated for a synthetic persona · A clinic must verify the real result.</div>' +
            '<div class="service-cards"><div class="service-card"><b>Likely eligible</b><span>Demo rule result</span></div>' +
            '<div class="service-card"><b>In person</b><span>Physical MyKad is required</span></div></div>' +
            '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Find a practice clinic →</button></div>')
        },
        {
          label: "Find a clinic",
          instruction: "Enter a 5-digit postcode rather than an exact address, then show nearby clinics.",
          html: portalFrame("Clinic finder", "Find a PeKa B40 clinic", '<div class="mock-alert">Exact coordinates stay in browser memory only and are not used in this demo.</div>' +
            '<div class="search-line"><label for="peka-postcode">Postcode</label><input id="peka-postcode" data-required data-guide-label="Enter a 5-digit postcode" placeholder="43000" aria-describedby="peka-postcode-hint" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required><small id="peka-postcode-hint">Use a demo postcode only.</small></div>' +
            action("Show nearby clinics →", true))
        },
        {
          label: "Check the clinic",
          instruction: "Check hours, accessibility, appointment rules, and freshness. Call before travelling when the directory may be stale.",
          html: portalFrame("Clinic finder", "Nearby practice clinic", '<div class="mock-alert success">Synthetic directory result · Last demo review: 17 Jul 2026.</div>' +
            '<div class="location-card"><h4>Klinik Harmoni (Demo)</h4><p>2.1 km · Mon–Sat, 8:30am–5:30pm</p><p>Call first · Step-free entrance · Appointment recommended</p></div>' +
            '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Prepare for this clinic →</button></div>')
        },
        {
          label: "Prepare for the visit",
          instruction: "Bring your physical MyKad, medication list if useful, and questions. Do not upload medical records to this demo.",
          html: portalFrame("Visit checklist", "What to bring", '<div class="mock-alert warn">Clinical gate · Only a healthcare professional can perform and record the screening.</div>' +
            requiredChecklist(["Physical MyKad", "Current medication list, if available", "Questions I want to ask the clinician"]) +
            action("Confirm practice visit →", true))
        },
        {
          label: "Clinic handoff ready",
          instruction: "Practice complete. The clinic handles eligibility and screening; Tuntut only keeps the safe next action.",
          html: completeScreen("Your clinic checklist is ready", "No appointment was booked and no health information was stored. Call the verified clinic before travelling.")
        }
      ]
    }
  };

  var platformTabs = document.getElementById("platform-tabs");
  var portalScreen = document.getElementById("portal-screen");
  var buddy = document.querySelector(".buddy");
  var pointer = document.getElementById("guide-pointer");
  var voiceButton = document.getElementById("start-voice");
  var voiceNote = document.getElementById("voice-note");
  var activePlatformId = initialPlatform();
  var activeStepIndex = savedStep(activePlatformId);
  var fallbackVoiceEnabled = false;
  var widgetElement = null;
  var currentGuideControl = null;
  var currentGuideTarget = null;
  var currentActionLabel = "";

  validateWorkflows();
  document.getElementById("topbar").innerHTML = Tuntut.topbar({ label: "Claim map →", href: "dashboard.html" });
  renderTabs();
  render();

  platformTabs.addEventListener("click", function (event) {
    var button = event.target.closest("[data-platform]");
    if (!button) return;
    setPlatform(button.dataset.platform);
  });

  portalScreen.addEventListener("click", function (event) {
    var uploadButton = event.target.closest("[data-upload]");
    if (uploadButton) {
      document.getElementById("document-slot").classList.add("uploaded");
      document.getElementById("document-slot").innerHTML = '<div><b>✓ Synthetic bank statement added</b><br><span>Practice file only · nothing uploaded</span></div>';
      portalScreen.querySelector("[data-next]").disabled = false;
      updateRequiredAction(true);
      return;
    }

    if (event.target.closest("[data-next]")) {
      goToStep(activeStepIndex + 1);
      return;
    }

    if (event.target.closest("[data-dashboard]")) location.href = "dashboard.html?done=" + activePlatformId;
  });

  portalScreen.addEventListener("input", updateRequiredState);
  portalScreen.addEventListener("change", function (event) {
    if (event.target.matches("[data-required]")) event.target.dataset.touched = "true";
    updateRequiredAction(true);
  });
  document.getElementById("reset-guide").addEventListener("click", function () { goToStep(0); });
  document.getElementById("read-step").addEventListener("click", function () {
    fallbackVoiceEnabled = true;
    speakCurrentInstruction();
  });
  voiceButton.addEventListener("click", startElevenLabsGuide);
  window.addEventListener("resize", updatePointer);
  window.addEventListener("scroll", updatePointer, true);

  function renderTabs() {
    platformTabs.innerHTML = Object.keys(workflows).map(function (id) {
      var workflow = workflows[id];
      return '<button class="platform-tab" type="button" role="tab" data-platform="' + id + '" aria-selected="' + (id === activePlatformId) + '">' +
        "<span>" + Tuntut.esc(workflow.icon) + "</span>" + Tuntut.esc(workflow.tab) + "</button>";
    }).join("");
  }

  function render() {
    var workflow = workflows[activePlatformId];
    var step = workflow.steps[activeStepIndex];
    document.getElementById("portal-kicker").textContent = workflow.kicker;
    document.getElementById("portal-title").textContent = workflow.name;
    document.getElementById("truth-row").innerHTML =
      '<span class="truth-pill">🧪 ' + Tuntut.esc(workflow.mode) + "</span>" +
      '<span class="truth-pill">Source: ' + Tuntut.esc(workflow.source) + "</span>" +
      '<span class="truth-pill">' + Tuntut.esc(workflow.version) + "</span>";
    document.getElementById("step-progress-bar").style.width = ((activeStepIndex + 1) / workflow.steps.length * 100) + "%";
    portalScreen.innerHTML = step.html;
    document.getElementById("buddy-step").textContent = "Step " + (activeStepIndex + 1) + " of " + workflow.steps.length;
    document.getElementById("buddy-copy").textContent = step.instruction;
    document.getElementById("mini-steps").innerHTML = workflow.steps.map(function (item, index) {
      var state = index < activeStepIndex ? "done" : index === activeStepIndex ? "current" : "";
      return '<li class="' + state + '"><i>' + (index < activeStepIndex ? "✓" : index + 1) + "</i><span>" + Tuntut.esc(item.label) + "</span></li>";
    }).join("");
    updateRequiredAction(false);
  }

  function setPlatform(platformId) {
    if (!workflows[platformId]) return false;
    activePlatformId = platformId;
    activeStepIndex = savedStep(platformId);
    history.replaceState(null, "", "guide.html?platform=" + encodeURIComponent(platformId));
    renderTabs();
    render();
    return true;
  }

  function goToStep(stepIndex) {
    var lastIndex = workflows[activePlatformId].steps.length - 1;
    activeStepIndex = Math.max(0, Math.min(Number(stepIndex) || 0, lastIndex));
    saveStep(activePlatformId, activeStepIndex);
    render();
    portalScreen.scrollIntoView({ behavior: "smooth", block: "start" });
    if (fallbackVoiceEnabled) speakCurrentInstruction();
  }

  function updateRequiredState() {
    var required = Array.prototype.slice.call(portalScreen.querySelectorAll("[data-required]"));
    var nextButton = portalScreen.querySelector("[data-next]");
    if (required.length && nextButton) nextButton.disabled = required.some(function (control) { return !isControlComplete(control); });
    required.forEach(function (control) {
      var row = control.closest(".mock-row,.mock-check,.search-line") || control;
      var complete = isControlComplete(control);
      row.classList.toggle("guide-complete", complete);
      if (control.dataset.touched && !complete) control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    });
  }

  function updateRequiredAction(shouldScroll) {
    updateRequiredState();
    setGuideTarget(findGuideControl(), shouldScroll);
  }

  function isControlComplete(control) {
    if (control.type === "checkbox" || control.type === "radio") return control.checked;
    var value = control.value.trim();
    if (!value || (control.minLength > 0 && value.length < control.minLength)) return false;
    if (control.pattern) {
      try { if (!new RegExp("^(?:" + control.pattern + ")$").test(value)) return false; } catch (error) { return false; }
    }
    return control.checkValidity();
  }

  function findGuideControl() {
    var required = Array.prototype.slice.call(portalScreen.querySelectorAll("[data-required]"));
    var incomplete = required.find(function (control) { return !isControlComplete(control); });
    if (incomplete) return incomplete;
    return portalScreen.querySelector("[data-next]:not(:disabled),[data-upload],[data-dashboard]") ||
      portalScreen.querySelector("[data-guide-target]:not([data-required])");
  }

  function setGuideTarget(control, shouldScroll) {
    if (currentGuideTarget) currentGuideTarget.classList.remove("guide-active", "guide-flash");
    currentGuideControl = control || null;
    currentGuideTarget = control ? (control.type === "checkbox" || control.type === "radio" ? control.closest("label") || control : control) : null;
    currentActionLabel = control ? guideLabel(control) : "";
    var invalid = control && control.getAttribute("aria-invalid") === "true";
    document.getElementById("buddy-next").textContent = currentActionLabel ? (invalid ? "Check this field: " : "Next: ") + currentActionLabel + "." : "";
    if (!currentGuideTarget) {
      pointer.classList.remove("on");
      updateWidgetContext();
      return;
    }
    currentGuideTarget.classList.add("guide-active");
    if (shouldScroll && !isTargetVisible(currentGuideTarget)) {
      currentGuideTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(updatePointer, 380);
    } else {
      setTimeout(updatePointer, 40);
    }
    updateWidgetContext();
  }

  function guideLabel(control) {
    var containingLabel = control.closest("label");
    var label = control.dataset.guideLabel || control.textContent || control.getAttribute("aria-label") || (containingLabel && containingLabel.textContent) || "Continue";
    return label.replace(/[→✓]/g, "").replace(/\s+/g, " ").trim();
  }

  function isTargetVisible(target) {
    var rect = target.getBoundingClientRect();
    return rect.top >= 90 && rect.bottom <= innerHeight - 24;
  }

  function updatePointer() {
    if (!currentGuideTarget || !currentGuideControl) { pointer.classList.remove("on"); return; }
    var rect = currentGuideControl.getBoundingClientRect();
    if (rect.bottom < 70 || rect.top > innerHeight) { pointer.classList.remove("on"); return; }
    var isField = /^(INPUT|SELECT|TEXTAREA)$/.test(currentGuideControl.tagName) && currentGuideControl.type !== "checkbox" && currentGuideControl.type !== "radio";
    var anchorX = isField ? rect.left + Math.min(34, rect.width / 2) : rect.left + rect.width / 2;
    var placeBelow = rect.top < 150;
    pointer.style.left = Math.min(innerWidth - 24, Math.max(24, anchorX)) + "px";
    pointer.style.top = (placeBelow ? rect.bottom : rect.top) + "px";
    pointer.classList.toggle("below", placeBelow);
    pointer.classList.toggle("flip", anchorX > innerWidth - 190);
    pointer.querySelector("b").textContent = currentActionLabel || "Do this next";
    pointer.classList.add("on");
  }

  function speakCurrentInstruction() {
    if (!("speechSynthesis" in window)) {
      voiceNote.textContent = "Device speech is unavailable. Follow the same instruction shown above.";
      return;
    }
    speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(workflows[activePlatformId].steps[activeStepIndex].instruction);
    utterance.lang = "en-MY";
    utterance.rate = 0.92;
    utterance.onstart = function () { buddy.classList.add("is-speaking"); document.getElementById("buddy-state").textContent = "Speaking"; };
    utterance.onend = function () { buddy.classList.remove("is-speaking"); document.getElementById("buddy-state").textContent = "Ready to guide"; };
    speechSynthesis.speak(utterance);
  }

  async function startElevenLabsGuide() {
    voiceButton.disabled = true;
    voiceButton.textContent = "Connecting…";
    voiceNote.textContent = "ElevenLabs will request microphone access. Audio is sent only after you choose to start talking.";
    try {
      var response = await fetch("api/elevenlabs-signed-url", { headers: { Accept: "application/json" }, cache: "no-store" });
      var result = await response.json();
      if (!response.ok || !result.signedUrl) throw new Error(result.error || "Voice guide is not configured");
      await loadElevenLabsWidget();
      widgetElement = document.createElement("elevenlabs-convai");
      widgetElement.setAttribute("signed-url", result.signedUrl);
      widgetElement.setAttribute("variant", "full");
      widgetElement.setAttribute("dismissible", "true");
      widgetElement.setAttribute("avatar-orb-color-1", "#56b5d5");
      widgetElement.setAttribute("avatar-orb-color-2", "#1d5080");
      widgetElement.addEventListener("elevenlabs-convai:call", attachClientTools);
      document.getElementById("elevenlabs-host").replaceChildren(widgetElement);
      updateWidgetContext();
      voiceButton.hidden = true;
      voiceNote.textContent = "ElevenLabs is ready. You choose when to allow the microphone; audio is then processed by ElevenLabs.";
      document.getElementById("buddy-state").textContent = "Voice ready";
    } catch (error) {
      fallbackVoiceEnabled = true;
      voiceButton.disabled = false;
      voiceButton.textContent = "Use device voice";
      voiceNote.textContent = "ElevenLabs is not configured yet. The private key stays server-side; device speech is available now.";
      speakCurrentInstruction();
    }
  }

  function loadElevenLabsWidget() {
    if (customElements.get("elevenlabs-convai")) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      script.onload = resolve;
      script.onerror = function () { reject(new Error("Could not load ElevenLabs")); };
      document.head.appendChild(script);
    });
  }

  function attachClientTools(event) {
    event.detail.config.clientTools = {
      getCurrentGuideStep: function () {
        var step = workflows[activePlatformId].steps[activeStepIndex];
        return JSON.stringify({ platform: activePlatformId, stepNumber: activeStepIndex + 1, stepLabel: step.label, instruction: step.instruction, currentAction: currentActionLabel });
      },
      highlightCurrentAction: function () {
        setGuideTarget(currentGuideControl || findGuideControl(), true);
        if (currentGuideTarget) {
          currentGuideTarget.classList.remove("guide-flash");
          void currentGuideTarget.offsetWidth;
          currentGuideTarget.classList.add("guide-flash");
        }
        return currentActionLabel ? "Highlighted: " + currentActionLabel : "There is no remaining action on this screen";
      }
    };
  }

  function updateWidgetContext() {
    if (!widgetElement) return;
    var workflow = workflows[activePlatformId];
    var step = workflow.steps[activeStepIndex];
    widgetElement.setAttribute("dynamic-variables", JSON.stringify({
      practice_platform: activePlatformId,
      practice_platform_name: workflow.tab,
      practice_step_number: String(activeStepIndex + 1),
      practice_step_label: step.label,
      practice_instruction: step.instruction,
      practice_current_action: currentActionLabel
    }));
  }

  function initialPlatform() {
    var requested = new URLSearchParams(location.search).get("platform");
    return workflows[requested] ? requested : "egumis";
  }

  function savedStep(platformId) {
    try {
      var value = Number(localStorage.getItem("tuntut.guide." + platformId));
      var last = workflows[platformId].steps.length - 1;
      return Number.isInteger(value) ? Math.max(0, Math.min(value, last)) : 0;
    } catch (error) { return 0; }
  }

  function saveStep(platformId, stepIndex) {
    try { localStorage.setItem("tuntut.guide." + platformId, String(stepIndex)); } catch (error) { /* Progress persistence is optional. */ }
  }

  function validateWorkflows() {
    Object.keys(workflows).forEach(function (id) {
      var workflow = workflows[id];
      if (!workflow.steps.length) throw new Error("Guide workflow has no steps: " + id);
      workflow.steps.forEach(function (step, index) {
        if (!step.label || !step.instruction || !step.html) throw new Error("Invalid guide step: " + id + " " + index);
        var screen = new DOMParser().parseFromString(step.html, "text/html");
        var required = Array.prototype.slice.call(screen.querySelectorAll("[data-required]"));
        var next = screen.querySelector("[data-next]");
        if (!screen.querySelector("[data-next],[data-upload],[data-dashboard]")) throw new Error("Guide step has no action: " + id + " " + index);
        if (required.length && next && !next.disabled) throw new Error("Required guide step must start locked: " + id + " " + index);
        required.forEach(function (control) {
          var label = control.dataset.guideLabel || control.getAttribute("aria-label") || (control.closest("label") && control.closest("label").textContent.trim());
          if (!label) throw new Error("Required guide control has no guidance label: " + id + " " + index);
        });
      });
    });
  }

  function portalFrame(section, title, body) {
    return '<div class="mock-portal"><div class="mock-nav"><span class="mock-logo">DEMO <b>SERVICE</b></span><small>' + Tuntut.esc(section) + '</small><span class="spacer"></span><small>Practice only</small></div>' +
      '<div class="mock-breadcrumb">Home › ' + Tuntut.esc(section) + '</div><div class="mock-content"><h3>' + Tuntut.esc(title) + "</h3>" + body + "</div></div>";
  }

  function introScreen(title, line, body) {
    return portalFrame("Overview", title, '<p class="intro">' + Tuntut.esc(line) + "</p>" + body);
  }

  function completeScreen(title, line) {
    return portalFrame("Complete", title, '<div class="mock-alert success">Practice state saved safely in this browser.</div><div class="complete-copy">' +
      '<div class="complete-mark">✓</div><h3>' + Tuntut.esc(title) + "</h3><p>" + Tuntut.esc(line) + '</p><div class="mock-actions" style="justify-content:center"><button class="portal-action" data-guide-target data-dashboard type="button">Return to claim map →</button></div></div>');
  }

  function field(label, placeholder, type, guideLabel, minlength, pattern) {
    return '<div class="mock-row"><label>' + Tuntut.esc(label) + '</label><input data-required data-guide-label="' + Tuntut.esc(guideLabel) +
      '" aria-label="' + Tuntut.esc(label) + '" type="' + Tuntut.esc(type || "text") + '" placeholder="' + Tuntut.esc(placeholder) +
      '" autocomplete="off" required' + (minlength ? ' minlength="' + Tuntut.esc(minlength) + '"' : "") +
      (pattern ? ' pattern="' + Tuntut.esc(pattern) + '"' : "") + "></div>";
  }

  function selectField(label, value, guideLabel) {
    return '<div class="mock-row"><label>' + Tuntut.esc(label) + '</label><select data-required data-guide-label="' + Tuntut.esc(guideLabel) +
      '" aria-label="' + Tuntut.esc(label) + '" required><option value="">Choose one</option><option>' + Tuntut.esc(value) + "</option></select></div>";
  }

  function action(label, requiresCheck) {
    return '<div class="mock-actions"><button class="portal-action" data-guide-label="' + Tuntut.esc(label.replace("→", "").trim()) +
      '" data-next type="button"' + (requiresCheck ? " disabled" : "") + ">" + Tuntut.esc(label) + "</button></div>";
  }

  function checklist(items) {
    return items.map(function (item) { return '<div class="mock-check"><span aria-hidden="true">✓</span><span>' + Tuntut.esc(item) + "</span></div>"; }).join("");
  }

  function requiredChecklist(items) {
    return items.map(function (item) {
      return '<label class="mock-check"><input data-required data-guide-label="Tick: ' + Tuntut.esc(item) + '" type="checkbox"><span>' + Tuntut.esc(item) + "</span></label>";
    }).join("");
  }
})();
