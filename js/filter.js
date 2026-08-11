/* ==========================================================================
   STACKLY — Used Bike Marketplace
   filter.js  |  Search, filtering, sorting & pagination on the listings page
   ========================================================================== */

(function () {
  "use strict";

  var isPage = /\/pages\//.test(window.location.pathname);
  var BASE = isPage ? "../" : "";
  var PER_PAGE = 9;

  var state = {
    keyword: "",
    brands: [],
    types: [],
    fuel: [],
    transmission: [],
    owners: [],
    condition: [],
    budget: "any",
    yearMin: 0,
    kmMax: 0,
    location: ""
  };
  var filtered = [];
  var page = 1;

  function $q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $qAll(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function uniqueVals(key) {
    var seen = {};
    window.STACKLY_BIKES.forEach(function (b) { seen[b[key]] = true; });
    return Object.keys(seen).sort();
  }

  /* ---------- 1. BUILD FILTER SIDEBAR ---------- */
  function buildFilterPanel() {
    var body = $q("#filterBody");
    if (!body) return;

    var html = "";

    // Keyword
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-magnifying-glass"></i> Keyword</h4>' +
      '<input class="form-control" type="search" id="fKeyword" placeholder="Search by name or model">' +
      "</div>";

    // Brand
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-tag"></i> Brand</h4><div class="filter-list">';
    window.STACKLY_BRANDS.forEach(function (b) {
      html += '<label class="filter-option"><input type="checkbox" class="f-brand" value="' + b.name + '">' +
        b.name + '<span class="count">' + b.count + "</span></label>";
    });
    html += "</div></div>";

    // Bike Type
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-bolt"></i> Bike Type</h4><div class="filter-list">';
    uniqueVals("type").forEach(function (t) {
      html += '<label class="filter-option"><input type="checkbox" class="f-type" value="' + t + '">' + t + "</label>";
    });
    html += "</div></div>";

    // Budget
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-indian-rupee-sign"></i> Budget</h4>' +
      '<select class="form-select" id="fBudget">' +
      '<option value="any">Any budget</option>' +
      '<option value="u50">Under ₹50,000</option>' +
      '<option value="50-100">₹50,000 – ₹1,00,000</option>' +
      '<option value="100-200">₹1,00,000 – ₹2,00,000</option>' +
      '<option value="200-500">₹2,00,000 – ₹5,00,000</option>' +
      '<option value="500+">Above ₹5,00,000</option>' +
      "</select></div>";

    // Year
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-calendar-days"></i> Model Year</h4>' +
      '<select class="form-select" id="fYear">' +
      "<option value='0'>Any year</option><option value='2024'>2024 & newer</option>" +
      "<option value='2022'>2022 & newer</option><option value='2020'>2020 & newer</option>" +
      "<option value='2018'>2018 & newer</option>" +
      "</select></div>";

    // Kilometers
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-gauge-high"></i> Max KM Driven</h4>' +
      '<select class="form-select" id="fKm">' +
      "<option value='0'>Any kilometers</option><option value='10000'>Under 10,000 km</option>" +
      "<option value='20000'>Under 20,000 km</option><option value='30000'>Under 30,000 km</option>" +
      "<option value='50000'>Under 50,000 km</option>" +
      "</select></div>";

    // Fuel
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-gas-pump"></i> Fuel Type</h4><div class="filter-list">';
    uniqueVals("fuel").forEach(function (f) {
      html += '<label class="filter-option"><input type="checkbox" class="f-fuel" value="' + f + '">' + f + "</label>";
    });
    html += "</div></div>";

    // Transmission
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-gears"></i> Transmission</h4><div class="filter-list">';
    uniqueVals("transmission").forEach(function (t) {
      html += '<label class="filter-option"><input type="checkbox" class="f-trans" value="' + t + '">' + t + "</label>";
    });
    html += "</div></div>";

    // Owner
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-user"></i> Number of Owners</h4><div class="filter-list">';
    uniqueVals("owners").forEach(function (o) {
      html += '<label class="filter-option"><input type="checkbox" class="f-owner" value="' + o + '">' + o + " owner" + (Number(o) > 1 ? "s" : "") + "</label>";
    });
    html += "</div></div>";

    // Condition
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-shield-heart"></i> Condition</h4><div class="filter-list">';
    uniqueVals("condition").forEach(function (c) {
      html += '<label class="filter-option"><input type="checkbox" class="f-cond" value="' + c + '">' + c + "</label>";
    });
    html += "</div></div>";

    // Location
    html += '<div class="filter-group"><h4 class="filter-group-title"><i class="fa-solid fa-location-dot"></i> Location</h4>' +
      '<select class="form-select" id="fLocation">' +
      "<option value=''>All locations</option>" +
      window.STACKLY_CITIES.map(function (c) { return "<option>" + c.name + "</option>"; }).join("") +
      "</select></div>";

    body.innerHTML = html;

    // Wire up
    $q("#fKeyword").addEventListener("input", function () { state.keyword = this.value.trim().toLowerCase(); refresh(); });
    $q("#fBudget").addEventListener("change", function () { state.budget = this.value; refresh(); });
    $q("#fYear").addEventListener("change", function () { state.yearMin = Number(this.value); refresh(); });
    $q("#fKm").addEventListener("change", function () { state.kmMax = Number(this.value); refresh(); });
    $q("#fLocation").addEventListener("change", function () { state.location = this.value; refresh(); });

    $qAll(".f-brand").forEach(function (c) { c.addEventListener("change", function () { state.brands = checked(".f-brand"); refresh(); }); });
    $qAll(".f-type").forEach(function (c) { c.addEventListener("change", function () { state.types = checked(".f-type"); refresh(); }); });
    $qAll(".f-fuel").forEach(function (c) { c.addEventListener("change", function () { state.fuel = checked(".f-fuel"); refresh(); }); });
    $qAll(".f-trans").forEach(function (c) { c.addEventListener("change", function () { state.transmission = checked(".f-trans"); refresh(); }); });
    $qAll(".f-owner").forEach(function (c) { c.addEventListener("change", function () { state.owners = checked(".f-owner").map(Number); refresh(); }); });
    $qAll(".f-cond").forEach(function (c) { c.addEventListener("change", function () { state.condition = checked(".f-cond"); refresh(); }); });

    function checked(sel) {
      return $qAll(sel).filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
    }
  }

  /* ---------- 2. URL PARAMS ---------- */
  function applyURLParams() {
    var params = new URLSearchParams(window.location.search);
    var brand = params.get("brand");
    var kw = params.get("keyword");
    var loc = params.get("location");
    var type = params.get("type");
    var budget = params.get("budget");

    if (brand) {
      state.brands = [brand];
      var cb = $q('.f-brand[value="' + brand.replace(/"/g, '\\"') + '"]');
      if (cb) cb.checked = true;
    }
    if (kw) {
      state.keyword = kw.toLowerCase();
      var ki = $q("#fKeyword");
      if (ki) ki.value = kw;
    }
    if (loc) {
      state.location = loc;
      var ls = $q("#fLocation");
      if (ls) ls.value = loc;
    }
    if (type) {
      state.types = [type];
      var tc = $q('.f-type[value="' + type.replace(/"/g, '\\"') + '"]');
      if (tc) tc.checked = true;
    }
    if (budget) {
      state.budget = budget;
      var bs = $q("#fBudget");
      if (bs) bs.value = budget;
    }

    var fuel = params.get("fuel");
    if (fuel) {
      state.fuel = [fuel];
      var fc = $q('.f-fuel[value="' + fuel.replace(/"/g, '\\"') + '"]');
      if (fc) fc.checked = true;
    }
    var trans = params.get("transmission");
    if (trans) {
      state.transmission = [trans];
      var tc2 = $q('.f-trans[value="' + trans.replace(/"/g, '\\"') + '"]');
      if (tc2) tc2.checked = true;
    }
    var year = params.get("year");
    if (year) {
      state.yearMin = Number(year);
      var ys = $q("#fYear");
      if (ys) ys.value = year;
    }
    var km = params.get("km");
    if (km) {
      state.kmMax = Number(km);
      var ks = $q("#fKm");
      if (ks) ks.value = km;
    }
  }

  /* ---------- 3. FILTER LOGIC ---------- */
  function matches(b) {
    if (state.keyword) {
      var hay = (b.name + " " + b.model + " " + b.brand + " " + b.variant).toLowerCase();
      if (hay.indexOf(state.keyword) === -1) return false;
    }
    if (state.brands.length && state.brands.indexOf(b.brand) === -1) return false;
    if (state.types.length && state.types.indexOf(b.type) === -1) return false;
    if (state.fuel.length && state.fuel.indexOf(b.fuel) === -1) return false;
    if (state.transmission.length && state.transmission.indexOf(b.transmission) === -1) return false;
    if (state.owners.length && state.owners.indexOf(b.owners) === -1) return false;
    if (state.condition.length && state.condition.indexOf(b.condition) === -1) return false;
    if (state.location && b.location !== state.location) return false;
    if (state.yearMin && b.year < state.yearMin) return false;
    if (state.kmMax && b.km > state.kmMax) return false;
    if (state.budget !== "any") {
      var r = state.budget.split("-");
      var min = r[0] === "u" ? 0 : (r[0] === "500" ? 500000 : Number(r[0]) * 1000);
      var max = r[0] === "u" ? 50000 : (r[1] === "+" ? Infinity : Number(r[1]) * 1000);
      if (b.price < min || b.price > max) return false;
    }
    return true;
  }

  /* ---------- 4. RENDER ---------- */
  function refresh() {
    page = 1;
    render();
  }

  function render() {
    filtered = window.STACKLY_BIKES.filter(matches);
    var mode = $q("#bikesSort") ? $q("#bikesSort").value : "newest";
    filtered = window.sortBikes(filtered, mode);

    var grid = $q("#bikesGrid");
    var countEl = $q("#resultsCount");
    var empty = $q("#emptyState");
    var loadWrap = $q("#loadMoreWrap");

    var total = filtered.length;
    if (countEl) countEl.innerHTML = "<b>" + total + "</b> bike" + (total === 1 ? "" : "s") + " found";
    if (empty) empty.classList.toggle("is-hidden", total !== 0);

    var slice = filtered.slice(0, page * PER_PAGE);
    if (grid) window.renderBikeGrid(grid, slice);

    if (loadWrap) {
      loadWrap.classList.toggle("is-hidden", total <= page * PER_PAGE);
      var btn = $q("#loadMoreBtn");
      if (btn) btn.textContent = "Show More Bikes (" + Math.min(PER_PAGE, total - page * PER_PAGE) + " more)";
    }

    // Update URL (keep sharable state)
    try {
      var params = new URLSearchParams();
      if (state.keyword) params.set("keyword", state.keyword);
      if (state.brands.length === 1) params.set("brand", state.brands[0]);
      if (state.types.length === 1) params.set("type", state.types[0]);
      if (state.location) params.set("location", state.location);
      if (state.budget !== "any") params.set("budget", state.budget);
      var qs = params.toString();
      var url = window.location.pathname + (qs ? "?" + qs : "");
      history.replaceState(null, "", url);
    } catch (e) { /* ignore */ }
  }

  /* ---------- 5. WIRE ACTIONS ---------- */
  function wireActions() {
    var sortSel = $q("#bikesSort");
    if (sortSel) sortSel.addEventListener("change", render);

    var loadBtn = $q("#loadMoreBtn");
    if (loadBtn) loadBtn.addEventListener("click", function () { page++; render(); });

    var resetBtn = $q("#resetFilters");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      state = { keyword: "", brands: [], types: [], fuel: [], transmission: [], owners: [], condition: [], budget: "any", yearMin: 0, kmMax: 0, location: "" };
      $qAll("#filterBody input, #filterBody select").forEach(function (el) {
        if (el.type === "checkbox") el.checked = false;
        else el.value = "";
      });
      var kw = $q("#fKeyword"); if (kw) kw.value = "";
      var bg = $q("#fBudget"); if (bg) bg.value = "any";
      var yr = $q("#fYear"); if (yr) yr.value = "0";
      var km = $q("#fKm"); if (km) km.value = "0";
      refresh();
      window.showToast("Filters reset", "Showing all bikes again.", "info");
    });

    var applyBtn = $q("#applyFilters");
    if (applyBtn) applyBtn.addEventListener("click", function () {
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Mobile filter toggle
    var toggle = $q("#filterToggle");
    var panel = $q("#filterPanel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("open");
        toggle.setAttribute("aria-expanded", panel.classList.contains("open"));
      });
    }
  }

  /* ---------- 6. HERO SEARCH (homepage) ---------- */
  function initHeroSearch() {
    var form = $q("#heroSearchForm");
    if (!form) return;

    var advBtn = $q("#advancedToggle");
    var advFields = $q("#advancedFields");
    if (advBtn && advFields) {
      advBtn.addEventListener("click", function () {
        var open = advFields.classList.toggle("open");
        advBtn.innerHTML = open
          ? '<i class="fa-solid fa-chevron-up"></i> Advanced Search'
          : '<i class="fa-solid fa-sliders"></i> Advanced Search';
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var params = new URLSearchParams();
      var kw = $q("#hKeyword", form).value.trim();
      var brand = $q("#hBrand", form).value;
      var budget = $q("#hBudget", form).value;
      var type = $q("#hType", form).value;
      var loc = $q("#hLocation", form).value;
      var hFuel = $q("#hFuel", form);
      var hTrans = $q("#hTrans", form);
      var hYear = $q("#hYear", form);
      var hKm = $q("#hKm", form);
      if (kw) params.set("keyword", kw);
      if (brand) params.set("brand", brand);
      if (budget) params.set("budget", budget);
      if (type) params.set("type", type);
      if (loc) params.set("location", loc);
      if (hFuel && hFuel.value) params.set("fuel", hFuel.value);
      if (hTrans && hTrans.value) params.set("transmission", hTrans.value);
      if (hYear && hYear.value) params.set("year", hYear.value);
      if (hKm && hKm.value) params.set("km", hKm.value);
      window.location.href = BASE + "pages/bikes.html" + (params.toString() ? "?" + params.toString() : "");
    });

    var searchBtn = $q("#heroSearchBtn");
    if (searchBtn) {
      searchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (form.requestSubmit) form.requestSubmit();
        else form.dispatchEvent(new Event("submit", { cancelable: true }));
      });
    }
  }

  /* ---------- 7. HOMEPAGE CATEGORY CARDS ---------- */
  function initCategories() {
    var grid = $q("#categoryGrid");
    if (!grid) return;
    grid.innerHTML = window.STACKLY_CATEGORIES.map(function (c) {
      return '<div class="cat-card reveal">' +
        '<div class="cat-img"><img src="' + BASE + "images/bikes/" + c.image + '" alt="' + c.name + '" loading="lazy"></div>' +
        '<div class="cat-icon"><i class="fa-solid ' + c.icon + '"></i></div>' +
        "<h3>" + c.name + "</h3>" +
        '<span class="cat-count">' + c.count.toLocaleString("en-IN") + " bikes</span>" +
        '<a class="cat-link" href="' + BASE + "pages/bikes.html?type=" + encodeURIComponent(c.name.replace(" Bikes", "").replace("s", "")) + '">View Bikes <i class="fa-solid fa-arrow-right"></i></a>' +
        "</div>";
    }).join("");
  }

  /* ---------- 8. HOMEPAGE CITY CARDS ---------- */
  function initCities() {
    var grid = $q("#cityGrid");
    if (!grid) return;
    grid.innerHTML = window.STACKLY_CITIES.map(function (c) {
      return '<a class="city-card reveal" href="' + BASE + "pages/bikes.html?location=" + encodeURIComponent(c.name) + '">' +
        '<div class="city-icon"><i class="fa-solid fa-location-dot"></i></div>' +
        "<div><h3>" + c.name + '</h3><span>' + c.count.toLocaleString("en-IN") + " bikes</span></div>" +
        '<i class="fa-solid fa-chevron-right chev"></i>' +
        "</a>";
    }).join("");
  }

  /* ---------- 9. INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    if ($q("#bikeListing")) {
      buildFilterPanel();
      applyURLParams();
      wireActions();
      render();
    }
    initHeroSearch();
    initCategories();
    initCities();
  });
})();
