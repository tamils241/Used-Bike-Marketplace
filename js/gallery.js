/* ==========================================================================
   STACKLY — Used Bike Marketplace
   gallery.js  |  Bike image gallery: main image, thumbs, prev/next, fullscreen
   ========================================================================== */

(function () {
  "use strict";

  var isPage = /\/pages\//.test(window.location.pathname);
  var BASE = isPage ? "../" : "";

  var images = [];
  var current = 0;
  var mainImg, mainWrap, thumbsEl, prevBtn, nextBtn, fsBtn;

  function setImage(i) {
    current = (i + images.length) % images.length;
    if (!mainImg || !images.length) return;

    mainWrap.classList.add("fading");
    setTimeout(function () {
      mainImg.src = BASE + "images/bikes/" + images[current];
      mainImg.alt = "Bike photo " + (current + 1);
      mainWrap.classList.remove("fading");
    }, 180);

    Array.prototype.forEach.call(thumbsEl.children, function (t, idx) {
      t.classList.toggle("active", idx === current);
    });
  }

  function buildThumbs() {
    thumbsEl.innerHTML = images.map(function (src, i) {
      return '<button class="gallery-thumb' + (i === 0 ? " active" : "") + '" data-index="' + i + '" aria-label="View image ' + (i + 1) + '">' +
        '<img src="' + BASE + "images/bikes/" + src + '" alt="Bike thumbnail ' + (i + 1) + '"></button>';
    }).join("");
    Array.prototype.forEach.call(thumbsEl.children, function (t) {
      t.addEventListener("click", function () {
        setImage(Number(t.getAttribute("data-index")));
      });
    });
  }

  function openFullscreen() {
    if (!images.length) return;
    window.openModal("Bike Gallery", '<img class="fs-image" src="' + BASE + "images/bikes/" + images[current] + '" alt="Bike photo enlarged">', true);
  }

  function init() {
    mainImg = document.getElementById("galleryMainImg");
    if (!mainImg) return;

    mainWrap = mainImg.closest(".gallery-main");
    thumbsEl = document.getElementById("galleryThumbs");
    prevBtn = document.getElementById("galleryPrev");
    nextBtn = document.getElementById("galleryNext");
    fsBtn = document.getElementById("galleryFullscreen");

    var params = new URLSearchParams(window.location.search);
    var bike = window.getBike(params.get("id"));
    if (!bike) return;
    images = bike.images || [bike.image];
    mainImg.src = BASE + "images/bikes/" + images[0];
    mainImg.alt = bike.name + " " + bike.year + " photo";

    if (thumbsEl) buildThumbs();
    if (prevBtn) prevBtn.addEventListener("click", function () { setImage(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { setImage(current + 1); });
    if (fsBtn) fsBtn.addEventListener("click", openFullscreen);

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") setImage(current - 1);
      if (e.key === "ArrowRight") setImage(current + 1);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
