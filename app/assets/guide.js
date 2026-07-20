/* Guided workflows. The browser owns state; voice only explains it. */
(function () {
  "use strict";

  if (Tuntut.guard(Tuntut.authed, "index.html")) return;

  var workflows = {
    egumis: {
      icon: "RM",
      tab: "Unclaimed money",
      name: "eGUMIS guide",
      kicker: "Document and human-review workflow",
      mode: "Guided walkthrough",
      source: "eGUMIS public guidance",
      version: "Public rules · 17 Jul 2026",
      steps: [
        {
          label: "Understand the result",
          instruction:
            "Check the amount and source, then choose Begin claim.",
          html: introScreen(
            "Unclaimed money result",
            "One unclaimed money record was found for an ordinary owner.",
            '<div class="mock-alert warn">Guided walkthrough only · This amount cannot be claimed from this screen.</div>' +
              '<div class="service-cards"><div class="service-card"><b>RM 3,410</b><span>Example balance</span></div>' +
              '<div class="service-card"><b>Ordinary owner</b><span>Claimant and payee are the same person</span></div></div>' +
              '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Begin claim →</button></div>',
          ),
        },
        {
          label: "Create your profile",
          instruction:
            "Fill in the fields from top to bottom using example details only. The guide moves after each valid field is finished.",
          html: portalFrame(
            "Registration",
            "User registration",
            '<div class="mock-alert">Use only example details in this walkthrough.</div>' +
              field(
                "Full name *",
                "Ahmad Demo",
                "text",
                "Enter an example full name",
                "3",
              ) +
              selectField(
                "Identification type *",
                "Example identity",
                "Choose Example identity",
              ) +
              field(
                "Email *",
                "ahmad.demo@example.test",
                "email",
                "Enter an example email",
              ) +
              field(
                "Username *",
                "ahmad-demo",
                "text",
                "Create an example username",
                "3",
              ) +
              '<label class="mock-check"><input data-required data-guide-label="Tick the acknowledgement" type="checkbox"> <span>I understand this is a guided walkthrough and no account will be created.</span></label>' +
              action("Continue to search →", true),
          ),
        },
        {
          label: "Select the record",
          instruction:
            "Select only the record you recognise. This example has one result worth RM 3,410.",
          html: portalFrame(
            "Search",
            "Search result",
            '<div class="mock-alert">One record found. This is a guided walkthrough—no official search was made.</div>' +
              '<div class="mock-panel"><div class="mock-panel-title">Unclaimed money records</div><div class="mock-panel-body">' +
              '<table class="result-table"><thead><tr><th>Select</th><th>Entity</th><th>Year</th><th>Amount</th></tr></thead><tbody>' +
              '<tr><td><input data-required data-guide-target aria-label="Select record" type="checkbox"></td><td>Demo Former Employer</td><td>2022</td><td class="amount-cell">RM 3,410</td></tr>' +
              "</tbody></table>" +
              action("Add selected record →", true) +
              "</div></div>",
          ),
        },
        {
          label: "Confirm the payee",
          instruction:
            "For an ordinary-owner claim, the payee is the claimant. Fill in each contact field in order, then continue.",
          html: portalFrame(
            "Application",
            "Payee information",
            '<div class="mock-alert">Do not enter a real address, phone number, or identification number.</div>' +
              '<label class="mock-check"><input type="checkbox" checked disabled> <span>Personal information is the same as the claimant</span></label>' +
              field(
                "Name *",
                "Ahmad Demo",
                "text",
                "Enter the payee name",
                "3",
              ) +
              field("City *", "Kajang", "text", "Enter a city", "2") +
              field(
                "Postcode *",
                "43000",
                "text",
                "Enter a 5-digit postcode",
                "",
                "[0-9]{5}",
              ) +
              field(
                "Mobile *",
                "010-000 0000",
                "tel",
                "Enter a mobile number",
                "9",
                "[0-9 -]{9,13}",
              ) +
              action("Confirm payee →", true),
          ),
        },
        {
          label: "Prepare the document",
          instruction:
            "A recent active bank statement is missing. In real life, prepare it outside Tuntut. Here, simulate adding one.",
          html: portalFrame(
            "Application",
            "Supporting document",
            '<div class="mock-alert warn">Human gate · Tuntut cannot create or inspect an original bank document.</div>' +
              '<div class="document-slot" id="document-slot"><div><b>Active bank statement</b><br><span>Shows account holder and active account status</span></div>' +
              '<button class="portal-secondary" data-guide-target data-upload type="button">Simulate adding</button></div>' +
              '<div class="mock-actions"><button class="portal-action" data-next disabled type="button">Review claim →</button></div>',
          ),
        },
        {
          label: "Approve the handoff",
          instruction:
            "Read the declaration yourself. Tuntut must stop here until you approve the official handoff.",
          html: portalFrame(
            "Review",
            "Ready for official handoff",
            '<div class="mock-alert warn">Official gate · You must sign in, review the declaration, and submit on the official service yourself.</div>' +
              '<div class="mock-panel"><div class="mock-panel-title">Prepared checklist</div><div class="mock-panel-body">' +
              checklist([
                "Owner record selected",
                "Payee details reviewed",
                "Bank statement category prepared",
              ]) +
              '<label class="mock-check" data-guide-target><input data-required data-guide-label="Approve the official handoff acknowledgement" type="checkbox"> <span>I understand Tuntut will open the official service but will not submit for me.</span></label>' +
              action("Simulate official handoff →", true) +
              "</div></div>",
          ),
        },
        {
          label: "Handoff prepared",
          instruction:
            "Claim complete. In real life, the official service takes over and Tuntut remembers only your safe next step.",
          html: completeScreen(
            "Claim complete",
            "No claim was submitted. Your next real action would be to sign in on the official eGUMIS service and review the prepared checklist.",
          ),
        },
      ],
    },

    sara: {
      icon: "🛒",
      tab: "Grocery credit",
      name: "SARA guide",
      kicker: "Location and in-person workflow",
      mode: "Guided walkthrough",
      source: "SARA public guidance",
      version: "Public directory · 17 Jul 2026",
      steps: [
        {
          label: "Understand the credit",
          instruction:
            "This RM 38 is grocery credit loaded on your MyKad, not cash. It can only be used for accepted items at a participating shop.",
          html: introScreen(
            "RM 38 grocery credit",
            "Find a participating shop and prepare for an in-person purchase.",
            '<div class="service-cards"><div class="service-card"><b>RM 38</b><span>MyKad balance</span></div>' +
              '<div class="service-card"><b>20 days</b><span>Expiry window</span></div></div>' +
              '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Find a shop →</button></div>',
          ),
        },
        {
          label: "Use a coarse location",
          instruction:
            "Enter a 5-digit postcode, then show nearby shops. Tuntut does not save exact coordinates or send them to the voice guide.",
          html: portalFrame(
            "Merchant finder",
            "Find a participating shop",
            '<div class="mock-alert">Privacy: the postcode stays in this screen only.</div>' +
              '<div class="search-line"><label for="sara-postcode">Postcode</label><input id="sara-postcode" data-required data-guide-label="Enter a 5-digit postcode" placeholder="43000" aria-describedby="sara-postcode-hint" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required><small id="sara-postcode-hint">Use an example postcode only.</small></div>' +
              action("Show nearby shops →", true),
          ),
        },
        {
          label: "Choose a verified result",
          instruction:
            "Check the distance, hours, and freshness before travelling.",
          html: portalFrame(
            "Merchant finder",
            "Nearby result",
            '<div class="mock-alert success">Directory checked · Verify again before travelling.</div>' +
              '<div class="location-card"><h4>Kedai Murni</h4><p>1.4 km · Open 9:00am–8:00pm</p><p>Verified 17 Jul 2026 · Step-free entrance</p></div>' +
              '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Choose this shop →</button></div>',
          ),
        },
        {
          label: "Know what to bring",
          instruction:
            "Bring your physical MyKad and choose accepted grocery items. Never share a PIN or OTP with a shop assistant.",
          html: portalFrame(
            "Visit checklist",
            "Before you go",
            '<div class="mock-panel"><div class="mock-panel-title">Your short checklist</div><div class="mock-panel-body">' +
              requiredChecklist([
                "I will bring my physical MyKad",
                "I will check that each item is accepted",
                "I know this credit cannot be withdrawn as cash",
              ]) +
              action("I am ready →", true) +
              "</div></div>",
          ),
        },
        {
          label: "Ready to visit",
          instruction:
            "Claim complete. At the real shop, you stay in control and tap your own MyKad at checkout.",
          html: completeScreen(
            "You are ready for the shop",
            "No balance was used and no location was retained. Verify the merchant and opening hours again before travelling.",
          ),
        },
      ],
    },

    peka: {
      icon: "✚",
      tab: "Health screening",
      name: "PeKa B40 guide",
      kicker: "Clinic and physical-presence workflow",
      mode: "Calculated eligibility",
      source: "PeKa B40 public guidance",
      version: "Public rules · 17 Jul 2026",
      steps: [
        {
          label: "Understand the benefit",
          instruction:
            "This is a free health screening service, not money paid to you. A clinic must confirm eligibility in person.",
          html: introScreen(
            "Free health screening",
            "This guide shows how to find a clinic and prepare for the physical visit.",
            '<div class="mock-alert warn">This is a guided walkthrough · A clinic must verify eligibility in person.</div>' +
              '<div class="service-cards"><div class="service-card"><b>Likely eligible</b><span>Based on public eligibility rules</span></div>' +
              '<div class="service-card"><b>In person</b><span>Physical MyKad is required</span></div></div>' +
              '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Find a clinic →</button></div>',
          ),
        },
        {
          label: "Find a clinic",
          instruction:
            "Enter a 5-digit postcode rather than an exact address, then show nearby clinics.",
          html: portalFrame(
            "Clinic finder",
            "Find a PeKa B40 clinic",
            '<div class="mock-alert">Exact coordinates stay in browser memory only.</div>' +
              '<div class="search-line"><label for="peka-postcode">Postcode</label><input id="peka-postcode" data-required data-guide-label="Enter a 5-digit postcode" placeholder="43000" aria-describedby="peka-postcode-hint" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required><small id="peka-postcode-hint">Use an example postcode only.</small></div>' +
              action("Show nearby clinics →", true),
          ),
        },
        {
          label: "Check the clinic",
          instruction:
            "Check hours, accessibility, appointment rules, and freshness. Call before travelling when the directory may be stale.",
          html: portalFrame(
            "Clinic finder",
            "Nearby clinic",
            '<div class="mock-alert success">Directory result · Last reviewed: 17 Jul 2026.</div>' +
              '<div class="location-card"><h4>Klinik Harmoni</h4><p>2.1 km · Mon–Sat, 8:30am–5:30pm</p><p>Call first · Step-free entrance · Appointment recommended</p></div>' +
              '<div class="mock-actions"><button class="portal-action" data-guide-target data-next type="button">Prepare for this clinic →</button></div>',
          ),
        },
        {
          label: "Prepare for the visit",
          instruction:
            "Bring your physical MyKad, medication list if useful, and questions. Do not upload actual medical records.",
          html: portalFrame(
            "Visit checklist",
            "What to bring",
            '<div class="mock-alert warn">Clinical gate · Only a healthcare professional can perform and record the screening.</div>' +
              requiredChecklist([
                "Physical MyKad",
                "Current medication list, if available",
                "Questions I want to ask the clinician",
              ]) +
              action("Confirm visit →", true),
          ),
        },
        {
          label: "Clinic handoff ready",
          instruction:
            "Claim complete. The clinic handles eligibility and screening; Tuntut only keeps the safe next action.",
          html: completeScreen(
            "Your clinic checklist is ready",
            "No appointment was booked and no health information was stored. Call the verified clinic before travelling.",
          ),
        },
      ],
    },
  };

  var platformTabs = document.getElementById("platform-tabs");
  var portalScreen = document.getElementById("portal-screen");
  var buddy = document.querySelector(".buddy");
  var pointer = document.getElementById("guide-pointer");
  var voiceButton = document.getElementById("start-voice");
  var voiceLanguage = document.getElementById("voice-language");
  var voiceNote = document.getElementById("voice-note");
  var activePlatformId = initialPlatform();
  var activeStepIndex = savedStep(activePlatformId);
  var fallbackVoiceEnabled = false;
  var elevenLabsUnavailable = false;
  var widgetElement = null;
  var currentGuideControl = null;
  var currentGuideTarget = null;
  var currentActionLabel = "";
  var voiceLocale = /^ms\b/i.test(navigator.language)
    ? "ms-MY"
    : /^zh\b/i.test(navigator.language)
      ? "zh-CN"
      : "en-MY";
  var guideStateVersion = 0;
  var voicePresets = {
    "en-MY": { language: "en" },
    "ms-MY": { language: "ms" },
    "zh-CN": { language: "zh" }
  };

  var malayInstructions = {
    egumis: [
      "Semak jumlah dan sumber, kemudian pilih Mulakan tuntutan.",
      "Isi medan dari atas ke bawah menggunakan maklumat contoh sahaja. Panduan bergerak selepas setiap medan yang sah disiapkan.",
      "Pilih hanya rekod yang anda kenali. Panduan ini mempunyai satu keputusan bernilai RM 3,410.",
      "Untuk tuntutan pemilik biasa, penerima bayaran ialah pihak yang menuntut. Lengkapkan setiap medan hubungan mengikut turutan, kemudian teruskan.",
      "Penyata bank aktif yang terkini masih tiada. Dalam keadaan sebenar, sediakannya di luar Tuntut. Di sini, simulasikan penambahannya.",
      "Baca pengakuan itu sendiri. Tuntut mesti berhenti di sini sehingga anda meluluskan penyerahan kepada perkhidmatan rasmi.",
      "Panduan selesai. Dalam keadaan sebenar, perkhidmatan rasmi mengambil alih dan Tuntut hanya mengingati langkah seterusnya yang selamat.",
    ],
    sara: [
      "Kredit barangan runcit RM 38 ini bukan wang tunai. Ia hanya boleh digunakan untuk barangan yang diterima di kedai yang mengambil bahagian.",
      "Masukkan poskod lima digit, kemudian tunjukkan kedai berdekatan. Tuntut tidak menyimpan koordinat tepat atau menghantarnya kepada panduan suara.",
      "Semak jarak, waktu operasi dan tarikh maklumat sebelum pergi.",
      "Bawa MyKad fizikal dan pilih barangan runcit yang diterima. Jangan sekali-kali berkongsi PIN atau OTP dengan pembantu kedai.",
      "Panduan selesai. Di kedai sebenar, anda kekal mengawal proses dan menggunakan MyKad anda sendiri di kaunter.",
    ],
    peka: [
      "Ini ialah perkhidmatan saringan kesihatan percuma, bukan wang yang dibayar kepada anda. Klinik mesti mengesahkan kelayakan secara bersemuka.",
      "Masukkan poskod lima digit dan bukan alamat tepat, kemudian tunjukkan klinik berdekatan.",
      "Semak waktu operasi, aksesibiliti, peraturan janji temu dan tarikh maklumat. Telefon sebelum pergi jika direktori mungkin sudah lama.",
      "Bawa MyKad fizikal, senarai ubat jika berguna dan soalan anda. Jangan muat naik rekod perubatan sebenar.",
      "Panduan selesai. Klinik mengurus kelayakan dan saringan; Tuntut hanya menyimpan tindakan seterusnya yang selamat.",
    ],
  };

  var chineseInstructions = {
    egumis: [
      "请检查金额和来源，然后选择开始申领。",
      "请只使用示例资料，从上到下填写。每完成一个有效的项目，指南就会继续。",
      "只选择您认识的记录。这里有一项价值三千四百一十令吉的记录。",
      "普通持有人申领时，收款人就是申领人。请依次填写联系资料，然后继续。",
      "目前缺少近期的有效银行月结单。真实申领时，请在 Tuntut 以外准备文件；这里仅模拟添加文件。",
      "请亲自阅读声明。在您同意转到官方服务前，Tuntut 必须停在这里。",
      "向导完成。真实申领时将由官方服务接手，Tuntut 只会记住安全的下一步。",
    ],
    sara: [
      "这三十八令吉是食品援助余额，不是现金。它只能在参与商店购买符合条件的商品。",
      "请输入五位数邮政编码，然后查看附近商店。Tuntut 不会保存精确坐标，也不会把坐标发送给语音指南。",
      "出发前请检查距离、营业时间和资料日期。",
      "请携带实体 MyKad，并选择符合条件的食品。绝对不要把密码或一次性验证码告诉店员。",
      "向导完成。在真实商店里，您始终掌握操作，并在结账时亲自使用 MyKad。",
    ],
    peka: [
      "这是免费的健康检查服务，不是发给您的现金。诊所必须当面确认资格。",
      "请输入五位数邮政编码，不要输入详细地址，然后查看附近诊所。",
      "请检查营业时间、无障碍设施、预约规定和资料日期。如果目录可能过期，请在出发前致电确认。",
      "请携带实体 MyKad、需要时携带药物清单，并准备好问题。不要上传实际医疗记录。",
      "向导完成。诊所负责资格确认和健康检查；Tuntut 只会保存安全的下一步行动。",
    ],
  };

  validateWorkflows();
  document.getElementById("topbar").innerHTML = Tuntut.topbar({
    label: "Claim map →",
    href: "dashboard.html",
  });
  renderTabs();
  voiceLanguage.value = voiceLocale;
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
      document.getElementById("document-slot").innerHTML =
        "<div><b>✓ Bank statement category added</b><br><span>Guided walkthrough · nothing uploaded</span></div>";
      portalScreen.querySelector("[data-next]").disabled = false;
      updateRequiredAction(true);
      return;
    }

    if (event.target.closest("[data-next]")) {
      goToStep(activeStepIndex + 1);
      return;
    }

    if (event.target.closest("[data-dashboard]"))
      location.href = "dashboard.html?done=" + activePlatformId;
  });

  portalScreen.addEventListener("input", function () {
    updateRequiredAction(false);
  });
  portalScreen.addEventListener("change", function (event) {
    if (event.target.matches("[data-required]"))
      event.target.dataset.touched = "true";
    updateRequiredAction(true);
  });
  document.getElementById("reset-guide").addEventListener("click", function () {
    goToStep(0);
  });
  document.getElementById("read-step").addEventListener("click", function () {
    fallbackVoiceEnabled = true;
    speakCurrentInstruction();
  });
  voiceButton.addEventListener("click", startElevenLabsGuide);
  voiceLanguage.addEventListener("change", function () {
    voiceLocale = voiceLanguage.value;
    updateWidgetContext();
    if (fallbackVoiceEnabled) speakCurrentInstruction();
  });
  window.addEventListener("resize", updatePointer);
  window.addEventListener("scroll", updatePointer, true);

  function renderTabs() {
    platformTabs.innerHTML = Object.keys(workflows)
      .map(function (id) {
        var workflow = workflows[id];
        return (
          '<button class="platform-tab" type="button" role="tab" data-platform="' +
          id +
          '" aria-selected="' +
          (id === activePlatformId) +
          '">' +
          "<span>" +
          Tuntut.esc(workflow.icon) +
          "</span>" +
          Tuntut.esc(workflow.tab) +
          "</button>"
        );
      })
      .join("");
  }

  function render() {
    var workflow = workflows[activePlatformId];
    var step = workflow.steps[activeStepIndex];
    document.getElementById("portal-kicker").textContent = workflow.kicker;
    document.getElementById("portal-title").textContent = workflow.name;
    document.getElementById("truth-row").innerHTML =
      '<span class="truth-pill">🧪 ' +
      Tuntut.esc(workflow.mode) +
      "</span>" +
      '<span class="truth-pill">Source: ' +
      Tuntut.esc(workflow.source) +
      "</span>" +
      '<span class="truth-pill">' +
      Tuntut.esc(workflow.version) +
      "</span>";
    document.getElementById("step-progress-bar").style.width =
      ((activeStepIndex + 1) / workflow.steps.length) * 100 + "%";
    portalScreen.innerHTML = step.html;
    document.getElementById("buddy-step").textContent =
      "Step " + (activeStepIndex + 1) + " of " + workflow.steps.length;
    document.getElementById("buddy-copy").textContent = step.instruction;
    document.getElementById("mini-steps").innerHTML = workflow.steps
      .map(function (item, index) {
        var state =
          index < activeStepIndex
            ? "done"
            : index === activeStepIndex
              ? "current"
              : "";
        return (
          '<li class="' +
          state +
          '"><i>' +
          (index < activeStepIndex ? "✓" : index + 1) +
          "</i><span>" +
          Tuntut.esc(item.label) +
          "</span></li>"
        );
      })
      .join("");
    updateRequiredAction(false);
  }

  function setPlatform(platformId) {
    if (!workflows[platformId]) return false;
    activePlatformId = platformId;
    activeStepIndex = savedStep(platformId);
    history.replaceState(
      null,
      "",
      "guide.html?platform=" + encodeURIComponent(platformId),
    );
    renderTabs();
    render();
    if (fallbackVoiceEnabled) speakCurrentInstruction();
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
    var required = Array.prototype.slice.call(
      portalScreen.querySelectorAll("[data-required]"),
    );
    var nextButton = portalScreen.querySelector("[data-next]");
    if (required.length && nextButton)
      nextButton.disabled = required.some(function (control) {
        return !isControlComplete(control);
      });
    required.forEach(function (control) {
      var row =
        control.closest(".mock-row,.mock-check,.search-line") || control;
      var complete = isControlComplete(control);
      row.classList.toggle("guide-complete", complete);
      if (control.dataset.touched && !complete)
        control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    });
  }

  function updateRequiredAction(shouldScroll) {
    updateRequiredState();
    setGuideTarget(findGuideControl(), shouldScroll);
  }

  function isControlComplete(control) {
    if (control.type === "checkbox" || control.type === "radio")
      return control.checked;
    var value = control.value.trim();
    if (!value || (control.minLength > 0 && value.length < control.minLength))
      return false;
    if (control.pattern) {
      try {
        if (!new RegExp("^(?:" + control.pattern + ")$").test(value))
          return false;
      } catch (error) {
        return false;
      }
    }
    return control.checkValidity();
  }

  function findGuideControl() {
    var required = Array.prototype.slice.call(
      portalScreen.querySelectorAll("[data-required]"),
    );
    var incomplete = required.find(function (control) {
      return !isControlComplete(control);
    });
    if (incomplete) return incomplete;
    return (
      portalScreen.querySelector(
        "[data-next]:not(:disabled),[data-upload],[data-dashboard]",
      ) ||
      portalScreen.querySelector("[data-guide-target]:not([data-required])")
    );
  }

  function setGuideTarget(control, shouldScroll) {
    if (currentGuideTarget)
      currentGuideTarget.classList.remove("guide-active", "guide-flash");
    currentGuideControl = control || null;
    currentGuideTarget = control
      ? control.type === "checkbox" || control.type === "radio"
        ? control.closest("label") || control
        : control
      : null;
    currentActionLabel = control ? guideLabel(control) : "";
    var invalid = control && control.getAttribute("aria-invalid") === "true";
    document.getElementById("buddy-next").textContent = currentActionLabel
      ? (invalid ? "Check this field: " : "Next: ") + currentActionLabel + "."
      : "";
    if (!currentGuideTarget) {
      pointer.classList.remove("on");
      updateWidgetContext();
      return;
    }
    currentGuideTarget.classList.add("guide-active");
    if (shouldScroll && !isTargetVisible(currentGuideTarget)) {
      currentGuideTarget.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(updatePointer, 380);
    } else {
      setTimeout(updatePointer, 40);
    }
    updateWidgetContext();
  }

  function guideLabel(control) {
    var containingLabel = control.closest("label");
    var label =
      control.dataset.guideLabel ||
      control.textContent ||
      control.getAttribute("aria-label") ||
      (containingLabel && containingLabel.textContent) ||
      "Continue";
    return label.replace(/[→✓]/g, "").replace(/\s+/g, " ").trim();
  }

  function isTargetVisible(target) {
    var rect = target.getBoundingClientRect();
    return rect.top >= 90 && rect.bottom <= innerHeight - 24;
  }

  function updatePointer() {
    if (!currentGuideTarget || !currentGuideControl) {
      pointer.classList.remove("on");
      return;
    }
    var rect = currentGuideControl.getBoundingClientRect();
    if (rect.bottom < 70 || rect.top > innerHeight) {
      pointer.classList.remove("on");
      return;
    }
    var isField =
      /^(INPUT|SELECT|TEXTAREA)$/.test(currentGuideControl.tagName) &&
      currentGuideControl.type !== "checkbox" &&
      currentGuideControl.type !== "radio";
    var anchorX = isField
      ? rect.left + Math.min(34, rect.width / 2)
      : rect.left + rect.width / 2;
    var placeBelow = rect.top < 150;
    pointer.style.left =
      Math.min(innerWidth - 24, Math.max(24, anchorX)) + "px";
    pointer.style.top = (placeBelow ? rect.bottom : rect.top) + "px";
    pointer.classList.toggle("below", placeBelow);
    pointer.classList.toggle("flip", anchorX > innerWidth - 190);
    pointer.querySelector("b").textContent =
      currentActionLabel || "Do this next";
    pointer.classList.add("on");
  }

  function speakCurrentInstruction() {
    if (!("speechSynthesis" in window)) {
      voiceNote.textContent =
        "Device speech is unavailable. Follow the same instruction shown above.";
      return;
    }
    speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(spokenInstruction());
    utterance.lang = voiceLocale;
    utterance.rate = 0.92;
    utterance.onstart = function () {
      buddy.classList.add("is-speaking");
      document.getElementById("buddy-state").textContent = "Speaking";
    };
    utterance.onend = function () {
      buddy.classList.remove("is-speaking");
      document.getElementById("buddy-state").textContent = "Ready to guide";
    };
    utterance.onerror = utterance.onend;
    speechSynthesis.speak(utterance);
  }

  async function startElevenLabsGuide() {
    if (elevenLabsUnavailable) {
      fallbackVoiceEnabled = true;
      speakCurrentInstruction();
      return;
    }
    voiceButton.disabled = true;
    voiceButton.textContent = "Connecting…";
    voiceNote.textContent =
      "ElevenLabs will request microphone access. Audio is sent only after you choose to start talking.";
    try {
      var response = await fetch("api/elevenlabs-signed-url?t=" + Date.now(), {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      var result = await response.json();
      if (!response.ok || !result.signedUrl)
        throw new Error(result.error || "Voice guide is not configured");
      await loadElevenLabsWidget();
      var voicePreset = voicePresets[voiceLocale];
      widgetElement = document.createElement("elevenlabs-convai");
      widgetElement.setAttribute("signed-url", result.signedUrl);
      widgetElement.setAttribute("variant", "expanded");
      widgetElement.setAttribute("dismissible", "true");
      widgetElement.setAttribute("language", voicePreset.language);
      widgetElement.setAttribute("override-language", voicePreset.language);
      widgetElement.setAttribute("avatar-orb-color-1", "#56b5d5");
      widgetElement.setAttribute("avatar-orb-color-2", "#1d5080");
      widgetElement.addEventListener(
        "elevenlabs-convai:call",
        attachClientTools,
      );
      widgetElement.addEventListener("conversationStarted", function () {
        document.getElementById("buddy-state").textContent = "Voice connected";
      });
      widgetElement.addEventListener("conversationEnded", resetElevenLabsGuide);
      updateWidgetContext();
      document.getElementById("elevenlabs-host").replaceChildren(widgetElement);
      voiceLanguage.disabled = true;
      voiceLanguage.title =
        "End the voice guide and reload the page to change language";
      voiceButton.hidden = true;
      voiceNote.textContent =
        "ElevenLabs is ready. You choose when to allow the microphone; audio is then processed by ElevenLabs.";
      document.getElementById("buddy-state").textContent = "Voice ready";
    } catch (error) {
      elevenLabsUnavailable = true;
      fallbackVoiceEnabled = true;
      voiceButton.disabled = false;
      voiceButton.textContent = "Use device voice";
      voiceNote.textContent =
        "ElevenLabs is not configured yet. The private key stays server-side; device speech is available now.";
      speakCurrentInstruction();
    }
  }

  function loadElevenLabsWidget() {
    if (customElements.get("elevenlabs-convai")) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src =
        "https://unpkg.com/@elevenlabs/convai-widget-embed@0.14.10";
      script.async = true;
      script.type = "text/javascript";
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Could not load ElevenLabs"));
      };
      document.head.appendChild(script);
    });
  }

  function attachClientTools(event) {
    event.detail.config.clientTools = {
      getCurrentGuideStep: function () {
        var step = workflows[activePlatformId].steps[activeStepIndex];
        var liveControl = findGuideControl();
        return JSON.stringify({
          stateVersion: guideStateVersion,
          platform: activePlatformId,
          platformName: workflows[activePlatformId].tab,
          stepNumber: activeStepIndex + 1,
          totalSteps: workflows[activePlatformId].steps.length,
          stepLabel: step.label,
          instruction: spokenInstruction(),
          currentAction: liveControl ? guideLabel(liveControl) : "",
          currentControl: guideControlContext(liveControl),
          visibleScreenText: portalScreen.innerText
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 1800),
          language: voiceLocale,
          safety:
            "Read-only screen context. Never request sensitive information or claim an action was completed.",
        });
      },
    };
  }

  function resetElevenLabsGuide() {
    if (!widgetElement) return;
    widgetElement.remove();
    widgetElement = null;
    voiceButton.hidden = false;
    voiceButton.disabled = false;
    voiceButton.textContent = "🎙 Start voice guide";
    voiceLanguage.disabled = false;
    voiceLanguage.removeAttribute("title");
    voiceNote.textContent =
      "Conversation ended. Start again whenever you are ready.";
    document.getElementById("buddy-state").textContent = "Ready to guide";
  }

  function guideControlContext(control) {
    if (!control) return null;
    var context = {
      label: guideLabel(control),
      kind:
        control.tagName === "SELECT"
          ? "selection"
          : control.type === "checkbox"
            ? "checkbox"
            : control.type || "button",
    };
    if (control.inputMode) context.inputMode = control.inputMode;
    if (control.minLength > 0) context.minimumCharacters = control.minLength;
    if (control.maxLength > 0) context.maximumCharacters = control.maxLength;
    if (control.pattern === "[0-9]{5}")
      context.requiredFormat = "exactly 5 digits";
    if (control.pattern === "[0-9 -]{9,13}")
      context.requiredFormat = "9 to 13 digits, spaces, or hyphens";
    if (control.tagName === "SELECT")
      context.visibleChoices = Array.prototype.slice
        .call(control.options)
        .map(function (option) {
          return option.textContent.trim();
        })
        .filter(Boolean);
    return context;
  }

  function updateWidgetContext() {
    guideStateVersion += 1;
    if (!widgetElement) return;
    var workflow = workflows[activePlatformId];
    var step = workflow.steps[activeStepIndex];
    widgetElement.setAttribute("language", voicePresets[voiceLocale].language);
    widgetElement.setAttribute(
      "dynamic-variables",
      JSON.stringify({
        guide_platform: activePlatformId,
        guide_platform_name: workflow.tab,
        guide_step_number: String(activeStepIndex + 1),
        guide_step_label: step.label,
        guide_instruction: spokenInstruction(),
        guide_current_action: currentActionLabel,
        guide_language: voiceLocale,
        guide_state_version: String(guideStateVersion),
        safety_policy:
          "Read-only. Explain only the current on-screen step. Never advance, submit, navigate, switch service, or bypass a human gate. Never request an IC, password, OTP, PIN, bank number, medical detail, or location.",
      }),
    );
  }

  function spokenInstruction() {
    if (voiceLocale === "ms-MY")
      return malayInstructions[activePlatformId][activeStepIndex];
    if (voiceLocale === "zh-CN")
      return chineseInstructions[activePlatformId][activeStepIndex];
    return workflows[activePlatformId].steps[activeStepIndex].instruction;
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
    } catch (error) {
      return 0;
    }
  }

  function saveStep(platformId, stepIndex) {
    try {
      localStorage.setItem("tuntut.guide." + platformId, String(stepIndex));
    } catch (error) {
      /* Progress persistence is optional. */
    }
  }

  function validateWorkflows() {
    Object.keys(workflows).forEach(function (id) {
      var workflow = workflows[id];
      if (!workflow.steps.length)
        throw new Error("Guide workflow has no steps: " + id);
      if (
        !malayInstructions[id] ||
        malayInstructions[id].length !== workflow.steps.length
      )
        throw new Error("Malay guide steps do not match: " + id);
      if (
        !chineseInstructions[id] ||
        chineseInstructions[id].length !== workflow.steps.length
      )
        throw new Error("Chinese guide steps do not match: " + id);
      workflow.steps.forEach(function (step, index) {
        if (!step.label || !step.instruction || !step.html)
          throw new Error("Invalid guide step: " + id + " " + index);
        var screen = new DOMParser().parseFromString(step.html, "text/html");
        var required = Array.prototype.slice.call(
          screen.querySelectorAll("[data-required]"),
        );
        var next = screen.querySelector("[data-next]");
        if (!screen.querySelector("[data-next],[data-upload],[data-dashboard]"))
          throw new Error("Guide step has no action: " + id + " " + index);
        if (required.length && next && !next.disabled)
          throw new Error(
            "Required guide step must start locked: " + id + " " + index,
          );
        required.forEach(function (control) {
          var label =
            control.dataset.guideLabel ||
            control.getAttribute("aria-label") ||
            (control.closest("label") &&
              control.closest("label").textContent.trim());
          if (!label)
            throw new Error(
              "Required guide control has no guidance label: " +
                id +
                " " +
                index,
            );
        });
      });
    });
  }

  function portalFrame(section, title, body) {
    return (
      '<div class="mock-portal"><div class="mock-nav"><span class="mock-logo">DEMO <b>SERVICE</b></span><small>' +
      Tuntut.esc(section) +
      '</small><span class="spacer"></span><small>Guided walkthrough</small></div>' +
      '<div class="mock-breadcrumb">Home › ' +
      Tuntut.esc(section) +
      '</div><div class="mock-content"><h3>' +
      Tuntut.esc(title) +
      "</h3>" +
      body +
      "</div></div>"
    );
  }

  function introScreen(title, line, body) {
    return portalFrame(
      "Overview",
      title,
      '<p class="intro">' + Tuntut.esc(line) + "</p>" + body,
    );
  }

  function completeScreen(title, line) {
    return portalFrame(
      "Complete",
      title,
      '<div class="mock-alert success">Your progress is saved in this browser.</div><div class="complete-copy">' +
        '<div class="complete-mark">✓</div><h3>' +
        Tuntut.esc(title) +
        "</h3><p>" +
        Tuntut.esc(line) +
        '</p><div class="mock-actions" style="justify-content:center"><button class="portal-action" data-guide-target data-dashboard type="button">Return to claim map →</button></div></div>',
    );
  }

  function field(label, placeholder, type, guideLabel, minlength, pattern) {
    return (
      '<div class="mock-row"><label>' +
      Tuntut.esc(label) +
      '</label><input data-required data-guide-label="' +
      Tuntut.esc(guideLabel) +
      '" aria-label="' +
      Tuntut.esc(label) +
      '" type="' +
      Tuntut.esc(type || "text") +
      '" placeholder="' +
      Tuntut.esc(placeholder) +
      '" autocomplete="off" required' +
      (minlength ? ' minlength="' + Tuntut.esc(minlength) + '"' : "") +
      (pattern ? ' pattern="' + Tuntut.esc(pattern) + '"' : "") +
      "></div>"
    );
  }

  function selectField(label, value, guideLabel) {
    return (
      '<div class="mock-row"><label>' +
      Tuntut.esc(label) +
      '</label><select data-required data-guide-label="' +
      Tuntut.esc(guideLabel) +
      '" aria-label="' +
      Tuntut.esc(label) +
      '" required><option value="">Choose one</option><option>' +
      Tuntut.esc(value) +
      "</option></select></div>"
    );
  }

  function action(label, requiresCheck) {
    return (
      '<div class="mock-actions"><button class="portal-action" data-guide-label="' +
      Tuntut.esc(label.replace("→", "").trim()) +
      '" data-next type="button"' +
      (requiresCheck ? " disabled" : "") +
      ">" +
      Tuntut.esc(label) +
      "</button></div>"
    );
  }

  function checklist(items) {
    return items
      .map(function (item) {
        return (
          '<div class="mock-check"><span aria-hidden="true">✓</span><span>' +
          Tuntut.esc(item) +
          "</span></div>"
        );
      })
      .join("");
  }

  function requiredChecklist(items) {
    return items
      .map(function (item) {
        return (
          '<label class="mock-check"><input data-required data-guide-label="Tick: ' +
          Tuntut.esc(item) +
          '" type="checkbox"><span>' +
          Tuntut.esc(item) +
          "</span></label>"
        );
      })
      .join("");
  }
})();
