/* ==========================================================================
   STACKLY — Used Bike Marketplace
   bikes.js  |  Bike listing rendering, sorting & details page population
   ========================================================================== */

(function () {
  "use strict";

  var isPage = /\/pages\//.test(window.location.pathname);
  var BASE = isPage ? "../" : "";

  function $q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $qAll(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function sortBikes(list, mode) {
    var arr = list.slice();
    switch (mode) {
      case "price-low": arr.sort(function (a, b) { return a.price - b.price; }); break;
      case "price-high": arr.sort(function (a, b) { return b.price - a.price; }); break;
      case "views": arr.sort(function (a, b) { return b.views - a.views; }); break;
      default: arr.sort(function (a, b) { return b.added - a.added; });
    }
    return arr;
  }
  window.sortBikes = sortBikes;

  /* ---------- 1. HOMEPAGE: FEATURED BIKES ---------- */
  function initFeatured() {
    var el = $q("#featuredBikes");
    if (!el) return;
    var featured = STACKLY_BIKES.filter(function (b) { return b.featured; }).slice(0, 6);
    window.renderBikeGrid(el, featured);
  }

  /* ---------- 2. HOMEPAGE: RECENTLY ADDED + SORT ---------- */
  function initLatest() {
    var el = $q("#latestBikes");
    var sortSel = $q("#latestSort");
    if (!el) return;
    function render(mode) {
      window.renderBikeGrid(el, sortBikes(STACKLY_BIKES, mode).slice(0, 6));
    }
    if (sortSel) {
      sortSel.addEventListener("change", function () { render(sortSel.value); });
    }
    render(sortSel ? sortSel.value : "newest");
  }

  /* ---------- 3. DETAILS PAGE ---------- */
  function initDetailsPage() {
    var pageEl = $q("#bikeDetails");
    if (!pageEl) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var bike = window.getBike(id);
    var notFound = $q("#bikeNotFound");
    if (!bike) {
      if (pageEl) pageEl.classList.add("is-hidden");
      if (notFound) notFound.classList.remove("is-hidden");
      return;
    }

    document.title = bike.name + " (" + bike.year + ") | STACKLY";
    var set = function (sel, val) { var el = $q(sel); if (el && val !== undefined && val !== null) el.innerHTML = val; };
    var setText = function (sel, val) { var el = $q(sel); if (el) el.textContent = val; };

    set("#dBrand", bike.brand);
    set("#dName", bike.name);
    set("#dTagline", bike.year + " &middot; " + bike.brand + " &middot; " + bike.type);
    set("#dPrice", window.formatINR(bike.price));
    set("#dEmi", bike.emi + " EMI");
    setText("#dEmiLabel", "EMI available");
    set("#dLocation", bike.location);
    var mapFrame = $q("#dMapEmbed");
    if (mapFrame) mapFrame.src = "https://www.google.com/maps?q=" + encodeURIComponent(bike.location + ", India") + "&output=embed";
    set("#dYear", bike.year);
    set("#dKm", window.formatKm(bike.km));
    set("#dOwner", bike.owners + (bike.owners === 1 ? " Owner" : " Owners"));
    set("#dFuel", bike.fuel);
    set("#dTrans", bike.transmission);
    set("#dEngine", bike.engine);
    set("#dMileage", bike.mileage);
    set("#dPower", bike.power);
    set("#dRating", bike.rating.toFixed(1));
    setText("#dReviews", "(" + bike.reviews + " reviews)");
    setText("#dViews", bike.views.toLocaleString("en-IN") + " views this week");
    set("#dCondition", bike.condition);
    set("#dRegYear", bike.year);
    set("#dDesc", "<p class='lead'>" + bike.desc + "</p>");
    set("#dFeatures", bike.features.map(function (f) {
      return "<li><i class='fa-solid fa-circle-check'></i>" + f + "</li>";
    }).join(""));

    // Specification table
    var specRows = [
      ["Brand", bike.brand], ["Model", bike.model + " (" + bike.variant + ")"],
      ["Manufacturing Year", bike.year], ["Registration Year", bike.year],
      ["Kilometers Driven", window.formatKm(bike.km)], ["Fuel Type", bike.fuel],
      ["Transmission", bike.transmission], ["Engine", bike.engine],
      ["Mileage", bike.mileage], ["Max Power", bike.power],
      ["Number of Owners", bike.owners], ["Condition", bike.condition],
      ["Location", bike.location], ["Expected Price", window.formatINR(bike.price)]
    ];
    set("#dSpecs", specRows.map(function (r) {
      return "<tr><th>" + r[0] + '</th><td><i class="fa-solid fa-angle-right"></i>' + r[1] + "</td></tr>";
    }).join(""));

    // Similar bikes
    var similar = $q("#similarBikes");
    if (similar) {
      var sim = STACKLY_BIKES.filter(function (b) { return b.id !== bike.id && (b.type === bike.type || b.brand === bike.brand); });
      if (sim.length < 6) {
        sim = STACKLY_BIKES.filter(function (b) { return b.id !== bike.id; });
      }
      window.renderBikeGrid(similar, sim.slice(0, 6));
    }
  }

  /* ---------- 4. BRANDS PAGE ---------- */
  function initBrandsPage() {
    var grid = $q("#brandsGrid");
    if (!grid) return;
    grid.innerHTML = STACKLY_BRANDS.map(function (b) {
      return '<div class="brand-tile" data-brand="' + b.name + '" tabindex="0" role="link" aria-label="Browse ' + b.name + " bikes" + '">' +
        '<div class="brand-mark"><img src="' + BASE + "images/brands/" + b.img + '" alt="' + b.name + ' logo" loading="lazy"></div>' +
        "<h3>" + b.name + "</h3>" +
        "<span>" + b.count + " bikes listed</span>" +
        "</div>";
    }).join("");
    grid.addEventListener("click", function (e) {
      var tile = e.target.closest(".brand-tile");
      if (tile) window.location.href = BASE + "pages/bikes.html?brand=" + encodeURIComponent(tile.getAttribute("data-brand"));
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        var tile = e.target.closest(".brand-tile");
        if (tile) window.location.href = BASE + "pages/bikes.html?brand=" + encodeURIComponent(tile.getAttribute("data-brand"));
      }
    });
  }

  /* ---------- 5. HOMEPAGE BRAND STRIP ---------- */
  function initHomeBrands() {
    var grid = $q("#homeBrands");
    if (!grid) return;
    grid.innerHTML = STACKLY_BRANDS.map(function (b) {
      return '<div class="brand-card reveal" data-brand="' + b.name + '" role="link" tabindex="0" aria-label="Browse ' + b.name + " bikes" + '">' +
        '<div class="brand-icon"><img src="' + BASE + "images/brands/" + b.img + '" alt="' + b.name + ' logo" loading="lazy"></div>' +
        "<h3>" + b.name + "</h3>" +
        "<span>" + b.count + " bikes</span>" +
        "</div>";
    }).join("");
    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".brand-card");
      if (card) window.location.href = BASE + "pages/bikes.html?brand=" + encodeURIComponent(card.getAttribute("data-brand"));
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        var card = e.target.closest(".brand-card");
        if (card) window.location.href = BASE + "pages/bikes.html?brand=" + encodeURIComponent(card.getAttribute("data-brand"));
      }
    });
    observeBrandReveal(grid);
  }

  function observeBrandReveal(container) {
    var cards = $qAll(".reveal", container);
    if (!("IntersectionObserver" in window)) {
      cards.forEach(function (c) { c.classList.add("visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    cards.forEach(function (c) { obs.observe(c); });
  }

  /* ---------- 6. INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initFeatured();
    initLatest();
    initDetailsPage();
    initBrandsPage();
    initHomeBrands();
  });
})();
