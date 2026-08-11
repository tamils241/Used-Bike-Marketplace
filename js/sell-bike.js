/* ==========================================================================
   STACKLY — Used Bike Marketplace
   sell-bike.js  |  Sell form validation, image upload, preview & publish
   ========================================================================== */

(function () {
  "use strict";

  var isPage = /\/pages\//.test(window.location.pathname);
  var BASE = isPage ? "../" : "";

  var uploadedFiles = [];

  function $q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $qAll(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- 1. POPULATE BRAND → MODEL & YEAR ---------- */
  function initModelSelect() {
    var brandSel = $q("#sellBrand");
    var modelSel = $q("#sellModel");
    var yearSel = $q("#sellYear");
    if (yearSel) {
      var opts = "";
      for (var y = 2026; y >= 2005; y--) opts += "<option>" + y + "</option>";
      yearSel.innerHTML = '<option value="">Select year</option>' + opts;
    }
    if (!brandSel || !modelSel) return;
    brandSel.addEventListener("change", function () {
      var models = window.MODELS_BY_BRAND ? window.MODELS_BY_BRAND[brandSel.value] : [];
      modelSel.innerHTML = '<option value="">Select model</option>' +
        models.map(function (m) { return "<option>" + m + "</option>"; }).join("");
    });
  }

  /* ---------- 2. IMAGE UPLOAD ---------- */
  function initUpload() {
    var area = $q("#uploadArea");
    var input = $q("#bikeImages");
    var preview = $q("#uploadPreview");
    if (!area || !input) return;

    function addFiles(files) {
      var list = Array.prototype.slice.call(files);
      list.forEach(function (f) {
        if (!f.type.match(/^image\//)) return;
        if (uploadedFiles.length >= 6) {
          window.showToast("Maximum 6 images", "You can upload up to 6 photos.", "warn");
          return;
        }
        uploadedFiles.push(f);
      });
      renderPreview();
    }

    function renderPreview() {
      preview.innerHTML = "";
      uploadedFiles.forEach(function (f, idx) {
        var url = URL.createObjectURL(f);
        var t = document.createElement("div");
        t.className = "thumb";
        t.innerHTML = '<img src="' + url + '" alt="Uploaded bike photo ' + (idx + 1) + '">' +
          '<button type="button" class="remove" aria-label="Remove image"><i class="fa-solid fa-xmark"></i></button>';
        t.querySelector(".remove").addEventListener("click", function () {
          uploadedFiles.splice(idx, 1);
          renderPreview();
        });
        preview.appendChild(t);
      });
    }

    area.addEventListener("click", function () { input.click(); });
    input.addEventListener("change", function () { addFiles(input.files); input.value = ""; });
    ["dragover", "dragenter"].forEach(function (ev) {
      area.addEventListener(ev, function (e) { e.preventDefault(); area.classList.add("dragover"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      area.addEventListener(ev, function (e) { e.preventDefault(); area.classList.remove("dragover"); });
    });
    area.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });
  }

  /* ---------- 3. VALIDATION ---------- */
  function validate(form) {
    var valid = true;
    var firstInvalid = null;

    function check(sel, rule, msg) {
      var el = $q(sel, form);
      if (!el) return;
      var value = el.value.trim();
      var ok = rule(value);
      var group = el.closest(".form-group");
      if (!ok) {
        valid = false;
        if (group) group.classList.add("invalid");
        var err = group ? $q(".form-error", group) : null;
        if (err) err.textContent = msg;
        if (!firstInvalid) firstInvalid = el;
      } else if (group) {
        group.classList.remove("invalid");
      }
    }

    check("#sellName", function (v) { return /^[A-Za-z][A-Za-z\s]*$/.test(v) && v.length >= 3 && v.length <= 16; }, "Name should contain only letters, 3 – 16 characters.");
    check("#sellPhone", function (v) { return /^[0-9]{10}$/.test(v); }, "Enter a valid 10-digit mobile number.");
    check("#sellEmail", function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, "Enter a valid email address.");
    check("#sellBrand", function (v) { return v !== ""; }, "Please select the bike brand.");
    check("#sellModel", function (v) { return v !== ""; }, "Please select the bike model.");
    check("#sellYear", function (v) { var n = Number(v); return n >= 2005 && n <= 2026; }, "Year must be between 2005 and 2026.");
    check("#sellKm", function (v) { var n = Number(v); return n > 0 && n <= 200000; }, "Enter kilometers driven (1 – 2,00,000).");
    check("#sellFuel", function (v) { return v !== ""; }, "Please select fuel type.");
    check("#sellTrans", function (v) { return v !== ""; }, "Please select transmission.");
    check("#sellOwners", function (v) { return v !== ""; }, "Please select number of owners.");
    check("#sellCond", function (v) { return v !== ""; }, "Please select the bike condition.");
    check("#sellPrice", function (v) { var n = Number(v); return n >= 10000 && n <= 2000000; }, "Expected price should be between ₹10,000 and ₹20,00,000.");
    check("#sellLocation", function (v) { return v !== ""; }, "Please select your city.");
    check("#sellDesc", function (v) { return v.length >= 20; }, "Description should be at least 20 characters.");

    if (!uploadedFiles.length) {
      valid = false;
      var up = $q(".upload-area");
      if (up) up.style.borderColor = "var(--c-red)";
    } else if ($q(".upload-area")) {
      $q(".upload-area").style.borderColor = "";
    }

    if (firstInvalid) { firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" }); firstInvalid.focus(); }
    return valid;
  }

  function collect(form) {
    function v(id) { var el = $q("#" + id, form); return el ? el.value.trim() : ""; }
    return {
      name: v("sellName"), phone: v("sellPhone"), brand: v("sellBrand"), model: v("sellModel"),
      variant: v("sellVariant"), year: v("sellYear"), km: v("sellKm"), fuel: v("sellFuel"),
      trans: v("sellTrans"), owners: v("sellOwners"), cond: v("sellCond"),
      price: Number(v("sellPrice")), location: v("sellLocation"), desc: v("sellDesc")
    };
  }

  /* ---------- 4. PREVIEW MODAL ---------- */
  function initPreview() {
    var btn = $q("#previewListing");
    var form = $q("#sellForm");
    if (!btn || !form) return;
    btn.addEventListener("click", function () {
      if (!validate(form)) {
        window.showToast("Please fix the errors", "Some fields need your attention before previewing.", "error");
        return;
      }
      var d = collect(form);
      var emi = Math.round(d.price * 0.02);
      var body =
        '<div class="bike-card" style="max-width:420px;margin:0 auto">' +
        '  <div class="bike-media" style="height:200px">' +
        '    <div class="badges"><span class="badge badge-new">New Listing</span></div>' +
        '    <img src="' + BASE + "images/bikes/bike-" + ((Math.abs(d.brand.length) % 6) + 1) + '.webp" alt="Preview of ' + d.brand + " " + d.model + '">' +
        "  </div>" +
        '  <div class="bike-body">' +
        '    <span class="bike-brand">' + d.brand + "</span>" +
        '    <h3 class="bike-name">' + d.brand + " " + d.model + "</h3>" +
        '    <p class="bike-tagline">' + d.year + " &middot; " + d.variant + "</p>" +
        '    <div class="bike-specs">' +
        '      <span><i class="fa-solid fa-gauge-high"></i> ' + Number(d.km).toLocaleString("en-IN") + " km</span>" +
        '      <span><i class="fa-solid fa-gas-pump"></i> ' + d.fuel + "</span>" +
        '      <span><i class="fa-solid fa-gears"></i> ' + d.trans + "</span>" +
        "    </div>" +
        '    <span class="bike-loc"><i class="fa-solid fa-location-dot"></i> ' + d.location + "</span>" +
        '    <div class="bike-foot">' +
        '      <div class="bike-price">' + window.formatINR(d.price) + "<small>₹" + emi.toLocaleString("en-IN") + "/mo EMI</small></div>" +
        "    </div>" +
        "  </div>" +
        "</div>" +
        "<p style='margin-top:16px;font-size:.85rem;color:var(--c-text-2)'>This is how your listing will appear to buyers. You can still edit before publishing.</p>";
      window.openModal("Listing Preview", body);
    });
  }

  /* ---------- 5. PUBLISH ---------- */
  function initPublish() {
    var btn = $q("#publishBike");
    var form = $q("#sellForm");
    var success = $q("#sellSuccess");
    if (!btn || !form) return;
    btn.addEventListener("click", function () {
      if (!validate(form)) {
        window.showToast("Please fix the errors", "Your listing has a few issues to correct first.", "error");
        return;
      }
      var d = collect(form);
      if (success) success.classList.remove("is-hidden");
      if (success) success.scrollIntoView({ behavior: "smooth", block: "center" });
      form.reset();
      uploadedFiles = [];
      var preview = $q("#uploadPreview");
      if (preview) preview.innerHTML = "";
      $qAll(".form-group", form).forEach(function (g) { g.classList.remove("invalid"); });
      var modelSel = $q("#sellModel");
      if (modelSel) modelSel.innerHTML = '<option value="">Select model</option>';
      window.showToast("Listing published! 🎉", d.brand + " " + d.model + " is now live on STACKLY.");
    });
  }

  function initNameInput() {
    var el = $q("#sellName");
    if (!el) return;
    el.addEventListener("input", function () {
      var v = el.value.replace(/[^A-Za-z\s]/g, "").replace(/\s{2,}/g, " ").slice(0, 16);
      if (el.value !== v) el.value = v;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNameInput();
    initModelSelect();
    initUpload();
    initPreview();
    initPublish();
  });
})();
