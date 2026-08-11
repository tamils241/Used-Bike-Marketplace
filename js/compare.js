/* ==========================================================================
   STACKLY — Used Bike Marketplace
   compare.js  |  Bike comparison (select up to 3, best-value highlighting)
   ========================================================================== */

(function () {
  "use strict";

  var isPage = /\/pages\//.test(window.location.pathname);
  var BASE = isPage ? "../" : "";

  function $q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $qAll(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var NUMERIC_ROWS = [
    { key: "price", label: "Price", best: "min", fmt: function (b) { return window.formatINR(b.price); } },
    { key: "year", label: "Model Year", best: "max", fmt: function (b) { return b.year; } },
    { key: "km", label: "Kilometers", best: "min", fmt: function (b) { return window.formatKm(b.km); } },
    { key: "engine", label: "Engine", best: null, fmt: function (b) { return b.engine; } },
    { key: "mileage", label: "Mileage", best: "max", fmt: function (b) { return b.mileage; } },
    { key: "fuel", label: "Fuel Type", best: null, fmt: function (b) { return b.fuel; } },
    { key: "transmission", label: "Transmission", best: null, fmt: function (b) { return b.transmission; } },
    { key: "power", label: "Power", best: "max", fmt: function (b) { return b.power; } },
    { key: "owners", label: "Owners", best: "min", fmt: function (b) { return b.owners; } }
  ];

  function renderPicker() {
    var grid = $q("#comparePickerGrid");
    if (!grid) return;
    var selected = window.getCompare();
    grid.innerHTML = window.STACKLY_BIKES.map(function (b) {
      var added = selected.indexOf(b.id) !== -1;
      return '<div class="compare-picker' + (added ? " added" : "") + '" data-id="' + b.id + '">' +
        '<img src="' + BASE + "images/bikes/" + b.image + '" alt="' + b.name + ' used bike">' +
        '<div class="body">' +
        "<b>" + b.name + "</b>" +
        "<span>" + b.year + " &middot; " + b.location + "</span>" +
        '<button class="btn ' + (added ? "btn-dark" : "btn-primary") + " btn-sm add-btn\">" +
        (added ? '<i class="fa-solid fa-check"></i> Added' : '<i class="fa-solid fa-plus"></i> Compare') +
        "</button>" +
        "</div></div>";
    }).join("");
    grid.onclick = function (e) {
      var tile = e.target.closest(".compare-picker");
      if (!tile) return;
      var id = tile.getAttribute("data-id");
      var res = window.toggleCompare(id);
      if (res === null) return;
      renderPicker();
      renderTable();
    };
  }

  function renderTable() {
    var selected = window.getCompare();
    var tableWrap = $q("#compareTableWrap");
    var empty = $q("#compareEmpty");
    var hint = $q("#compareHint");

    if (!tableWrap) return;
    if (empty) empty.classList.toggle("is-hidden", selected.length !== 0);
    if (hint) hint.classList.toggle("is-hidden", selected.length !== 0);
    tableWrap.classList.toggle("is-hidden", selected.length === 0);
    if (!selected.length) return;

    var bikes = selected.map(window.getBike).filter(Boolean);

    // compute best values
    var best = {};
    NUMERIC_ROWS.forEach(function (row) {
      if (!row.best) return;
      var vals = bikes.map(function (b) { return Number(b[row.key]); });
      best[row.key] = row.best === "min" ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
    });

    var html = '<table class="compare-table">';

    // header row (bike cells)
    html += "<tr><th></th>";
    bikes.forEach(function (b) {
      html += '<td class="bike-cell">' +
        '<div class="compare-bike-thumb"><img src="' + BASE + "images/bikes/" + b.image + '" alt="' + b.name + '"></div>' +
        '<span class="compare-bike-name">' + b.name + "</span>" +
        '<span class="compare-bike-price">' + window.formatINR(b.price) + "</span>" +
        '<div class="mt-10"><a class="btn btn-outline-dark btn-sm" href="' + BASE + "pages/bike-details.html?id=" + b.id + '">View Details</a></div>' +
        '<button class="compare-remove" data-remove="' + b.id + '" aria-label="Remove ' + b.name + '"><i class="fa-solid fa-xmark"></i></button>' +
        "</td>";
    });
    html += "</tr>";

    // data rows
    NUMERIC_ROWS.forEach(function (row) {
      html += "<tr" + (row.best ? " class='compare-row-best'" : "") + ">";
      html += "<th>" + row.label + "</th>";
      bikes.forEach(function (b) {
        var isBest = row.best && Number(b[row.key]) === best[row.key];
        html += "<td" + (isBest ? " class='cell-best'" : "") + ">" + row.fmt(b) + "</td>";
      });
      html += "</tr>";
    });
    html += "</table>";
    tableWrap.innerHTML = html;

    // wire remove
    $qAll(".compare-remove", tableWrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = Number(btn.getAttribute("data-remove"));
        var list = window.getCompare().filter(function (x) { return x !== id; });
        window.saveCompare(list);
        window.showToast("Bike removed", "Removed from comparison.", "info");
        renderPicker();
        renderTable();
        if (window._compareBar) window.updateCompareBar();
      });
    });
  }

  function init() {
    if (!$q("#comparePage")) return;
    renderPicker();
    renderTable();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
