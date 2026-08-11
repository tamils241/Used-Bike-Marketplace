/* ==========================================================================
   STACKLY — Used Bike Marketplace
   favorites.js  |  Favorites page (localStorage backed)
   ========================================================================== */

(function () {
  "use strict";

  function $q(sel, ctx) { return (ctx || document).querySelector(sel); }

  function render() {
    var grid = $q("#favoritesGrid");
    if (!grid) return;

    var ids = window.getFavorites();
    var bikes = ids.map(window.getBike).filter(Boolean);

    var countEl = $q("#favCount");
    var empty = $q("#favEmpty");
    var toolbar = $q("#favToolbar");

    if (countEl) countEl.innerHTML = "You have <b>" + bikes.length + "</b> saved bike" + (bikes.length === 1 ? "" : "s");
    if (empty) empty.classList.toggle("is-hidden", bikes.length !== 0);
    if (toolbar) toolbar.classList.toggle("is-hidden", bikes.length === 0);

    window.renderBikeGrid(grid, bikes);
  }
  window.StacklyFav = { render: render };

  function init() {
    if (!$q("#favoritesGrid")) return;

    render();

    var clearBtn = $q("#clearFavorites");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (!window.getFavorites().length) return;
        localStorage.setItem("stackly_favorites", "[]");
        render();
        window.showToast("Favorites cleared", "All saved bikes have been removed.", "info");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
