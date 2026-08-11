/* ==========================================================================
   STACKLY — dashboard.js
   Role-aware (user / admin) dashboard with responsive sidebar & panels
   ========================================================================== */

(function () {
  "use strict";

  var BIKES = window.STACKLY_BIKES || [];
  var fmt = window.formatINR || function (n) { return "₹" + n; };
  var asset = window.asset || function (p) { return "../images/" + p; };

  var SELLERS = ["Ravi Kumar", "Priya Menon", "Amit Verma", "Sneha Rao", "Karthik N", "Divya Pillai", "Vikram Singh", "Anjali Das"];
  var MSGS = [
    { img: "user-2.webp", name: "Priya Menon", type: "buyer", bike: "Yamaha MT-15", text: "Is the MT-15 still available? Can I take a test ride this weekend?", time: "2h ago", ts: 5, unread: true, replied: false, sent: false },
    { img: "user-3.webp", name: "Amit Verma", type: "buyer", bike: "Royal Enfield Classic 350", text: "Would you accept ₹1,20,000 for the Classic 350?", time: "Yesterday", ts: 4, unread: true, replied: false, sent: false },
    { img: "user-4.webp", name: "Sneha Rao", type: "buyer", bike: "Honda Activa 6G", text: "Hi, interested in the Activa. What is the final price?", time: "2 days ago", ts: 3, unread: false, replied: true, sent: false },
    { img: "user-5.webp", name: "Karthik N", type: "buyer", bike: "Bajaj Pulsar NS200", text: "Thanks for the test ride! I will confirm by Friday.", time: "3 days ago", ts: 2, unread: false, replied: false, sent: false },
    { img: "user-1.webp", name: "Vikram Singh", type: "seller", bike: "TVS Apache RTR 160", text: "Your listing looks great. I have a buyer interested in it.", time: "5 days ago", ts: 1, unread: false, replied: true, sent: false },
    { img: "user-1.webp", name: "You", type: "buyer", bike: "Royal Enfield Classic 350", text: "I can consider ₹1,25,000 for the Classic 350. Let me know if that works.", time: "Yesterday", ts: 4, unread: false, replied: false, sent: true }
  ];
  var FEED = [
    { icon: "fa-motorcycle", text: "You listed <b>Yamaha MT-15</b> for sale", time: "Today, 10:24 AM" },
    { icon: "fa-heart", text: "<b>Royal Enfield Classic 350</b> added to favorites", time: "Yesterday, 6:02 PM" },
    { icon: "fa-envelope", text: "New message from <b>Priya Menon</b>", time: "Yesterday, 4:40 PM" },
    { icon: "fa-eye", text: "Your listing <b>Honda Activa 6G</b> got 18 views", time: "2 days ago" },
    { icon: "fa-shield-halved", text: "Account verified as a trusted seller", time: "4 days ago" }
  ];

  var role = document.body.getAttribute("data-role") || localStorage.getItem("stackly_role") || "user";
  var currentPanel = "overview";

  function getFavIds() {
    try { return JSON.parse(localStorage.getItem("stackly_favorites") || "[]"); } catch (e) { return []; }
  }

  function sellerName(bike) {
    return SELLERS[(bike.id * 3) % SELLERS.length];
  }

  function statCard(icon, iconClass, num, label) {
    return '<div class="stat-card"><div class="stat-icon ' + iconClass + '"><i class="fa-solid ' + icon + '"></i></div>' +
      '<div><b class="stat-num">' + num + '</b><span>' + label + '</span></div></div>';
  }

  function miniBikeRow(bike) {
    return '<div class="mini-bike"><img src="' + asset("bikes/" + bike.image) + '" alt="' + bike.name + '" loading="lazy">' +
      '<div><b>' + bike.name + '</b><span>' + bike.year + ' · ' + bike.km.toLocaleString("en-IN") + ' km · ' + bike.location + '</span></div>' +
      '<span class="price">' + fmt(bike.price) + '</span></div>';
  }

  function bikeCard(bike, statusPill) {
    return '<div class="dash-bike-card"><img src="' + asset("bikes/" + bike.image) + '" alt="' + bike.name + '" loading="lazy">' +
      '<div class="dash-bike-info"><b>' + bike.name + '</b><div class="meta">' + bike.year + ' · ' + bike.km.toLocaleString("en-IN") + ' km · ' + bike.location + '</div>' +
      '<span class="price">' + fmt(bike.price) + '</span>' + (statusPill || "") +
      '<div class="dash-bike-foot">' +
      '<a class="btn btn-outline-dark btn-sm" href="bike-details.html?id=' + bike.id + '">View</a>' +
      '<button type="button" class="btn btn-outline-dark btn-sm" data-remove="' + bike.id + '"><i class="fa-regular fa-heart"></i></button>' +
      '</div></div></div>';
  }

  /* ---------- RENDER: overview ---------- */
  function renderOverview() {
    var statsEl = document.getElementById("overviewStats");
    var cards = role === "admin"
      ? statCard("fa-motorcycle", "icon-orange", BIKES.length, "Total Listings") +
        statCard("fa-users", "icon-blue", "1,284", "Active Users") +
        statCard("fa-clock-rotate-left", "icon-gold", 5, "Pending Approvals") +
        statCard("fa-indian-rupee-sign", "icon-green", "₹42.5L", "Monthly Revenue")
      : statCard("fa-motorcycle", "icon-orange", 3, "My Listings") +
        statCard("fa-heart", "icon-gold", getFavIds().length, "Favorites") +
        statCard("fa-envelope", "icon-blue", MSGS.length, "Messages") +
        statCard("fa-road", "icon-green", 2, "Test Rides");
    statsEl.innerHTML = cards;

    var recent = document.getElementById("recentListings");
    recent.innerHTML = BIKES.slice(0, 5).map(miniBikeRow).join("");

    var feed = document.getElementById("activityFeed");
    feed.innerHTML = FEED.map(function (a) {
      return '<div class="activity-item"><div class="activity-ico"><i class="fa-solid ' + a.icon + '"></i></div>' +
        '<div><b>' + a.text + '</b><span>' + a.time + '</span></div></div>';
    }).join("");
  }

  /* ---------- RENDER: my bikes (user) ---------- */
  function renderMyBikes() {
    var el = document.getElementById("myBikesList");
    var pills = ['<span class="status-pill live" style="margin-left:8px">Live</span>',
      '<span class="status-pill pending" style="margin-left:8px">Pending</span>',
      '<span class="status-pill sold" style="margin-left:8px">Sold</span>'];
    el.innerHTML = BIKES.slice(0, 6).map(function (b, i) {
      return bikeCard(b, pills[i % 3]);
    }).join("");
  }

  /* ---------- RENDER: favorites (user) ---------- */
  function favoriteBikes() {
    return getFavIds().map(function (id) {
      return BIKES.filter(function (b) { return b.id === id; })[0];
    }).filter(function (b) { return !!b; });
  }

  function renderFavorites() {
    var list = favoriteBikes();
    setText("favoriteCount", list.length);

    var prices = list.map(function (b) { return b.price; });
    setText("favoritePriceRange", prices.length
      ? fmt(Math.min.apply(null, prices)) + " – " + fmt(Math.max.apply(null, prices))
      : "—");
    setText("favoriteLocations", new Set(list.map(function (b) { return b.location; })).size);
    setText("favoriteAlerts", list.length);

    var searchEl = document.getElementById("favoriteSearch");
    var sortEl = document.getElementById("favoriteSort");
    var q = (searchEl && searchEl.value || "").toLowerCase().trim();
    var sort = (sortEl && sortEl.value) || "newest";

    var favIds = getFavIds();
    var view = list.filter(function (b) {
      if (!q) return true;
      var hay = (b.name + " " + b.brand + " " + b.year + " " + b.location).toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    view.sort(function (a, b) {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "year-new") return b.year - a.year;
      if (sort === "year-old") return a.year - b.year;
      return favIds.indexOf(b.id) - favIds.indexOf(a.id);
    });

    var el = document.getElementById("favBikesList");
    if (el) el.innerHTML = view.map(function (b) { return bikeCard(b); }).join("");

    var empty = document.getElementById("favoritesEmpty");
    if (empty) empty.classList.toggle("is-hidden", list.length !== 0);
    var noRes = document.getElementById("favoritesNoResults");
    if (noRes) noRes.classList.toggle("is-hidden", !(list.length && !view.length));

    setText("favoriteBadge", view.length);
    var resultText = document.getElementById("favoriteResultText");
    if (resultText) {
      if (!list.length) resultText.textContent = "Your favorite bikes will appear here.";
      else if (!view.length) resultText.textContent = "No favorites match your search.";
      else resultText.textContent = "Showing " + view.length + " of " + list.length + " saved bikes.";
    }
  }

  function initFavoritesControls() {
    var search = document.getElementById("favoriteSearch");
    if (search) search.addEventListener("input", renderFavorites);
    var sort = document.getElementById("favoriteSort");
    if (sort) sort.addEventListener("change", renderFavorites);

    var clearSearch = document.getElementById("clearFavoriteSearch");
    if (clearSearch) clearSearch.addEventListener("click", function (e) {
      e.preventDefault();
      if (search) search.value = "";
      renderFavorites();
    });

    var clearAll = document.getElementById("clearFavorites");
    if (clearAll) clearAll.addEventListener("click", function (e) {
      e.preventDefault();
      var list = getFavIds();
      if (!list.length) {
        showToast("Nothing to clear", "Your favorites list is already empty.", "info");
        return;
      }
      if (!window.confirm("Remove all bikes from your favorites?")) return;
      localStorage.setItem("stackly_favorites", "[]");
      renderFavorites();
      showToast("Favorites cleared", "All saved bikes were removed from your favorites.", "success");
    });
  }

  /* ---------- RENDER: messages (user) ---------- */
  function messageTab() {
    var tab = document.querySelector(".message-tab.active");
    return tab ? (tab.getAttribute("data-message-tab") || "all") : "all";
  }

  function filteredMessages() {
    var searchEl = document.getElementById("messageSearch");
    var filterEl = document.getElementById("messageFilter");
    var sortEl = document.getElementById("messageSort");
    var q = (searchEl && searchEl.value || "").toLowerCase().trim();
    var filter = (filterEl && filterEl.value) || "all";
    var sort = (sortEl && sortEl.value) || "newest";
    var tab = messageTab();

    var list = MSGS.filter(function (m) {
      if (tab === "unread" && !m.unread) return false;
      if (tab === "sent" && !m.sent) return false;
      if (filter === "unread" && !m.unread) return false;
      if (filter === "read" && m.unread) return false;
      if (filter === "buyer" && m.type !== "buyer") return false;
      if (filter === "seller" && m.type !== "seller") return false;
      if (q) {
        var hay = (m.name + " " + m.bike + " " + m.text).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    list.sort(function (a, b) {
      return sort === "oldest" ? a.ts - b.ts : b.ts - a.ts;
    });
    return list;
  }

  function messageItem(m) {
    var idx = MSGS.indexOf(m);
    return '<div class="message-item' + (m.unread ? " unread" : "") + '">' +
      (m.unread ? '<span class="unread-dot"></span>' : "") +
      '<img class="message-avatar" src="' + asset("users/" + m.img) + '" alt="' + m.name + '" loading="lazy">' +
      '<div class="message-content">' +
      '<div class="message-top"><p class="message-user">' + m.name + '</p><span class="message-time">' + m.time + '</span></div>' +
      '<span class="message-bike">' + m.bike + '</span>' +
      '<span class="message-preview">' + m.text + '</span>' +
      '</div>' +
      '<div class="message-actions">' +
      '<button type="button" class="message-action-btn" data-reply="' + idx + '" title="Reply"><i class="fa-solid fa-reply"></i></button>' +
      '<button type="button" class="message-action-btn" data-delete="' + idx + '" title="Delete"><i class="fa-regular fa-trash-can"></i></button>' +
      '</div></div>';
  }

  function renderMessages() {
    var list = filteredMessages();
    var el = document.getElementById("msgList");
    if (el) el.innerHTML = list.map(messageItem).join("");

    setText("totalMessages", MSGS.length);
    setText("readMessages", MSGS.filter(function (m) { return !m.unread; }).length);
    setText("unreadMessages", MSGS.filter(function (m) { return m.unread; }).length);
    setText("repliedMessages", MSGS.filter(function (m) { return m.replied; }).length);

    setText("allMessageCount", MSGS.length);
    setText("unreadMessageCount", MSGS.filter(function (m) { return m.unread; }).length);
    setText("sentMessageCount", MSGS.filter(function (m) { return m.sent; }).length);

    var empty = document.getElementById("messagesEmpty");
    if (empty) empty.classList.toggle("is-hidden", MSGS.length !== 0);
    var noRes = document.getElementById("messagesNoResults");
    if (noRes) noRes.classList.toggle("is-hidden", !(MSGS.length && !list.length));

    setText("messageBadge", list.length);
    var resultText = document.getElementById("messageResultText");
    if (resultText) {
      if (!MSGS.length) resultText.textContent = "Your conversations will appear here.";
      else if (!list.length) resultText.textContent = "No conversations match your current search or filter.";
      else resultText.textContent = "Showing " + list.length + " of " + MSGS.length + " conversations.";
    }
  }

  function initMessagesControls() {
    var search = document.getElementById("messageSearch");
    if (search) search.addEventListener("input", renderMessages);
    ["messageFilter", "messageSort"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("change", renderMessages);
    });
    document.querySelectorAll(".message-tab").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll(".message-tab").forEach(function (t) { t.classList.remove("active"); });
        btn.classList.add("active");
        renderMessages();
      });
    });
    var markAll = document.getElementById("markAllRead");
    if (markAll) markAll.addEventListener("click", function () {
      var unread = MSGS.filter(function (m) { return m.unread; }).length;
      if (!unread) {
        showToast("Nothing to mark", "All messages are already read.", "info");
        return;
      }
      MSGS.forEach(function (m) { m.unread = false; });
      renderMessages();
      showToast("Marked as read", "All messages are now marked as read.", "success");
    });
    var clearSearch = document.getElementById("clearMessageSearch");
    if (clearSearch) clearSearch.addEventListener("click", function (e) {
      e.preventDefault();
      if (search) search.value = "";
      renderMessages();
    });
    var compose = document.getElementById("composeMessageBtn");
    if (compose) compose.addEventListener("click", function () {
      showToast("New Message", "Compose a message to any buyer or seller.", "info");
    });
  }

  /* =========================================================
     MANAGE LISTINGS (admin)
     ========================================================= */
  var LIST_STATUSES = ["approved", "pending", "rejected"];
  var LIST_VIEWS = [124, 58, 310, 96, 205, 143, 77, 260, 88, 172, 49, 331, 118, 92, 240, 135, 186, 71, 264, 105];
  var LIST_PAGE = 1;
  var LIST_PER_PAGE = 8;

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function listingStatus(i) { return LIST_STATUSES[i % 3]; }

  function viewsFor(i) { return LIST_VIEWS[i % LIST_VIEWS.length]; }

  function listedOn(i) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function statusPill(st) {
    var cls = { approved: "live", pending: "pending", rejected: "banned" }[st] || "live";
    return '<span class="status-pill ' + cls + '">' + st.charAt(0).toUpperCase() + st.slice(1) + '</span>';
  }

  function filteredListings() {
    var q = (document.getElementById("listingSearch").value || "").toLowerCase().trim();
    var brand = document.getElementById("listingBrand").value;
    var status = document.getElementById("listingStatus").value;
    var price = document.getElementById("listingPrice").value;
    return BIKES.filter(function (b, i) {
      if (q) {
        var hay = (b.name + " " + b.brand + " " + sellerName(b) + " " + b.location).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      if (brand && b.brand !== brand) return false;
      if (status && listingStatus(i) !== status) return false;
      if (price) {
        if (price === "under50000" && b.price >= 50000) return false;
        if (price === "50000-100000" && (b.price < 50000 || b.price >= 100000)) return false;
        if (price === "100000-200000" && (b.price < 100000 || b.price >= 200000)) return false;
        if (price === "above200000" && b.price < 200000) return false;
      }
      return true;
    });
  }

  function renderListingStats() {
    var pending = 0, approved = 0, rejected = 0;
    BIKES.forEach(function (_, i) {
      var st = listingStatus(i);
      if (st === "pending") pending++;
      else if (st === "approved") approved++;
      else rejected++;
    });
    setText("totalListings", BIKES.length);
    setText("totalPending", pending);
    setText("totalApproved", approved);
    setText("totalRejected", rejected);
  }

  /* ---------- RENDER: admin listings ---------- */
  function renderAdminListings() {
    var body = document.getElementById("adminListingsBody");
    if (!body) return;
    var list = filteredListings();
    var totalPages = Math.max(1, Math.ceil(list.length / LIST_PER_PAGE));
    if (LIST_PAGE > totalPages) LIST_PAGE = totalPages;
    var pageItems = list.slice((LIST_PAGE - 1) * LIST_PER_PAGE, LIST_PAGE * LIST_PER_PAGE);

    body.innerHTML = pageItems.map(function (b) {
      var idx = BIKES.indexOf(b);
      var st = listingStatus(idx);
      return '<tr>' +
        '<td><input type="checkbox" class="listing-check" data-id="' + b.id + '"></td>' +
        '<td class="cell-strong bike-cell"><img src="' + asset("bikes/" + b.image) + '" alt="' + b.name + '">' +
        '<div><b>' + b.name + '</b><span class="cell-sub">' + b.year + ' · ' + b.km.toLocaleString("en-IN") + ' km · ' + b.brand + '</span></div></td>' +
        '<td><div class="dash-cell-user"><img src="' + asset("users/user-" + ((b.id % 5) + 1) + ".webp") + '" alt="' + sellerName(b) + '">' +
        '<div><b>' + sellerName(b) + '</b><span class="cell-sub">Seller</span></div></div></td>' +
        '<td class="cell-price">' + fmt(b.price) + '</td>' +
        '<td>' + b.year + '</td>' +
        '<td>' + b.location + '</td>' +
        '<td>' + viewsFor(idx) + '</td>' +
        '<td>' + statusPill(st) + '</td>' +
        '<td>' + listedOn(idx) + '</td>' +
        '<td><button type="button" class="btn btn-primary btn-sm admin-action" data-id="' + b.id + '" data-name="' + b.name + '">Approve</button></td></tr>';
    }).join("");

    var empty = document.getElementById("listingEmpty");
    if (empty) empty.style.display = list.length ? "none" : "block";
    setText("listingResultCount", "Showing " + pageItems.length + " of " + list.length + " listings");

    var pages = document.querySelectorAll(".page-number");
    pages.forEach(function (btn, i) {
      var pg = i + 1;
      btn.classList.toggle("active", pg === LIST_PAGE);
      btn.style.display = pg <= totalPages ? "" : "none";
    });
    var prev = document.getElementById("listingPrev");
    var next = document.getElementById("listingNext");
    if (prev) prev.disabled = LIST_PAGE <= 1;
    if (next) next.disabled = LIST_PAGE >= totalPages;
    var sel = document.getElementById("selectAllListings");
    if (sel) sel.checked = false;
  }

  function goListingPage(pg) {
    var total = Math.max(1, Math.ceil(filteredListings().length / LIST_PER_PAGE));
    LIST_PAGE = Math.min(total, Math.max(1, pg));
    renderAdminListings();
  }

  function selectedListingIds() {
    var ids = [];
    document.querySelectorAll(".listing-check:checked").forEach(function (c) {
      ids.push(Number(c.getAttribute("data-id")));
    });
    return ids;
  }

  function exportListingsCSV() {
    var list = filteredListings();
    if (!list.length) {
      showToast("Nothing to export", "No listings match the current filters.", "info");
      return;
    }
    var rows = [["Bike", "Brand", "Seller", "Price", "Year", "Location", "Views", "Status"]];
    list.forEach(function (b) {
      var idx = BIKES.indexOf(b);
      rows.push([b.name, b.brand, sellerName(b), b.price, b.year, b.location, viewsFor(idx), listingStatus(idx)]);
    });
    var csv = rows.map(function (r) { return r.join(","); }).join("\n");
    var blob = new Blob([csv], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stackly-listings.csv";
    a.click();
    showToast("Export started", list.length + " listings exported to CSV.", "success");
  }

  function resetListingFilters() {
    ["listingSearch", "listingBrand", "listingStatus", "listingPrice"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
    LIST_PAGE = 1;
    renderAdminListings();
  }

  function initListingControls() {
    var search = document.getElementById("listingSearch");
    if (search) search.addEventListener("input", function () { LIST_PAGE = 1; renderAdminListings(); });
    ["listingBrand", "listingStatus", "listingPrice"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("change", function () { LIST_PAGE = 1; renderAdminListings(); });
    });
    var reset = document.getElementById("resetListingFilters");
    if (reset) reset.addEventListener("click", function (e) {
      e.preventDefault();
      resetListingFilters();
    });
    var clear = document.getElementById("clearListingSearch");
    if (clear) clear.addEventListener("click", resetListingFilters);
    var refresh = document.getElementById("refreshListings");
    if (refresh) refresh.addEventListener("click", function (e) {
      e.preventDefault();
      renderListingStats();
      renderAdminListings();
      renderPendingApprovals();
      showToast("Listings refreshed", "All listing data is up to date.", "success");
    });
    var exportBtn = document.getElementById("exportListings");
    if (exportBtn) exportBtn.addEventListener("click", function (e) {
      e.preventDefault();
      exportListingsCSV();
    });
    var addBtn = document.getElementById("addListingBtn");
    if (addBtn) addBtn.addEventListener("click", function () {
      showToast("Add New Listing", "Opening the seller listing form…", "info");
      setTimeout(function () { window.location.href = page("sell-bike.html"); }, 900);
    });
    var prev = document.getElementById("listingPrev");
    if (prev) prev.addEventListener("click", function (e) {
      e.preventDefault();
      goListingPage(LIST_PAGE - 1);
    });
    var next = document.getElementById("listingNext");
    if (next) next.addEventListener("click", function (e) {
      e.preventDefault();
      goListingPage(LIST_PAGE + 1);
    });
    document.querySelectorAll(".page-number").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        goListingPage(Number(btn.textContent));
      });
    });
    var selectAll = document.getElementById("selectAllListings");
    if (selectAll) selectAll.addEventListener("change", function () {
      document.querySelectorAll(".listing-check").forEach(function (c) {
        c.checked = selectAll.checked;
      });
    });
    [["bulkApprove", "approved", "Approved"], ["bulkPending", "pending", "Marked pending"], ["bulkDelete", "rejected", "Deleted"]].forEach(function (cfg) {
      var btn = document.getElementById(cfg[0]);
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var ids = selectedListingIds();
        if (!ids.length) {
          showToast("No listings selected", "Tick at least one listing first.", "error");
          return;
        }
        showToast("Bulk action complete", ids.length + " listings " + cfg[2].toLowerCase() + ".", cfg[0] === "bulkDelete" ? "error" : "success");
        renderAdminListings();
      });
    });
  }

  /* ---------- RENDER: pending approvals (admin) ---------- */
  function renderPendingApprovals() {
    var el = document.getElementById("pendingApprovals");
    if (!el) return;
    var pending = BIKES.filter(function (_, i) { return listingStatus(i) === "pending"; });
    setText("pendingCount", pending.length);
    var empty = document.getElementById("pendingEmpty");
    if (empty) empty.style.display = pending.length ? "none" : "block";
    el.innerHTML = pending.map(function (b) {
      return '<div class="pending-item">' +
        '<img src="' + asset("bikes/" + b.image) + '" alt="' + b.name + '">' +
        '<div class="pending-info"><b>' + b.name + '</b>' +
        '<span>' + sellerName(b) + ' · ' + b.location + ' · submitted ' + listedOn(b.id % 7) + '</span></div>' +
        '<span class="price">' + fmt(b.price) + '</span>' +
        '<div class="pending-actions">' +
        '<button type="button" class="btn btn-primary btn-sm pending-approve" data-name="' + b.name + '"><i class="fa-solid fa-check"></i> Approve</button>' +
        '<button type="button" class="btn btn-outline-dark btn-sm pending-reject" data-name="' + b.name + '"><i class="fa-solid fa-xmark"></i> Reject</button>' +
        '</div></div>';
    }).join("");
  }

  /* =========================================================
     MANAGE USERS (admin)
     ========================================================= */
  var USER_STATUS_LABEL = { "active-u": "Active", pending: "Pending", banned: "Blocked" };
  var USERS = [
    { img: "user-1.webp", name: "Rahul Sharma", handle: "rahulsharma", email: "rahul@stackly.com", phone: "98765 43210", role: "Admin", loc: "Bangalore", lists: 12, joined: "12 Jan 2024", st: "active-u" },
    { img: "user-2.webp", name: "Priya Menon", handle: "priyamenon", email: "priya@stackly.com", phone: "98765 43211", role: "Buyer", loc: "Chennai", lists: 3, joined: "02 Mar 2024", st: "active-u" },
    { img: "user-3.webp", name: "Amit Verma", handle: "amitverma", email: "amit@stackly.com", phone: "98765 43212", role: "Buyer", loc: "Mumbai", lists: 1, joined: "18 Apr 2024", st: "active-u" },
    { img: "user-4.webp", name: "Sneha Rao", handle: "sneharao", email: "sneha@stackly.com", phone: "98765 43213", role: "Buyer", loc: "Hyderabad", lists: 0, joined: "25 Jun 2024", st: "banned" },
    { img: "user-5.webp", name: "Karthik N", handle: "karthikn", email: "karthik@stackly.com", phone: "98765 43214", role: "Buyer", loc: "Pune", lists: 5, joined: "09 Aug 2024", st: "active-u" },
    { img: "user-1.webp", name: "Divya Pillai", handle: "divyapillai", email: "divya@stackly.com", phone: "98765 43215", role: "Buyer", loc: "Kochi", lists: 2, joined: "14 Sep 2024", st: "active-u" },
    { img: "user-2.webp", name: "Vikram Singh", handle: "vikramsingh", email: "vikram@stackly.com", phone: "98765 43216", role: "Seller", loc: "Delhi", lists: 7, joined: "21 Oct 2024", st: "active-u" },
    { img: "user-3.webp", name: "Anjali Das", handle: "anjalidas", email: "anjali@stackly.com", phone: "98765 43217", role: "Seller", loc: "Kolkata", lists: 4, joined: "05 Nov 2024", st: "pending" },
    { img: "user-4.webp", name: "Rohit Malhotra", handle: "rohitm", email: "rohit@stackly.com", phone: "98765 43218", role: "Buyer", loc: "Jaipur", lists: 0, joined: "17 Dec 2024", st: "banned" },
    { img: "user-5.webp", name: "Meera Nair", handle: "meeranair", email: "meera@stackly.com", phone: "98765 43219", role: "Seller", loc: "Thiruvananthapuram", lists: 6, joined: "08 Jan 2025", st: "active-u" },
    { img: "user-1.webp", name: "Arjun Reddy", handle: "arjunreddy", email: "arjun@stackly.com", phone: "98765 43220", role: "Buyer", loc: "Vijayawada", lists: 1, joined: "19 Feb 2025", st: "active-u" },
    { img: "user-2.webp", name: "Sana Khan", handle: "sanakhan", email: "sana@stackly.com", phone: "98765 43221", role: "Seller", loc: "Lucknow", lists: 9, joined: "27 Mar 2025", st: "active-u" },
    { img: "user-3.webp", name: "Deepak Joshi", handle: "deepakjoshi", email: "deepak@stackly.com", phone: "98765 43222", role: "Buyer", loc: "Indore", lists: 0, joined: "11 Apr 2025", st: "pending" },
    { img: "user-4.webp", name: "Pooja Patil", handle: "poojapatil", email: "pooja@stackly.com", phone: "98765 43223", role: "Seller", loc: "Nagpur", lists: 3, joined: "23 May 2025", st: "active-u" },
    { img: "user-5.webp", name: "Farhan Ali", handle: "farhanali", email: "farhan@stackly.com", phone: "98765 43224", role: "Buyer", loc: "Bhopal", lists: 0, joined: "06 Jul 2025", st: "banned" }
  ];

  function filteredUsers() {
    var q = (document.getElementById("userSearch").value || "").toLowerCase().trim();
    var role = document.getElementById("userRoleFilter").value;
    var status = document.getElementById("userStatusFilter").value;
    return USERS.filter(function (u) {
      if (q) {
        var hay = (u.name + " " + u.email + " " + u.phone + " " + u.handle).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      if (role && u.role !== role) return false;
      if (status && USER_STATUS_LABEL[u.st] !== status) return false;
      return true;
    });
  }

  function renderUserStats() {
    setText("totalUsersCount", USERS.length);
    setText("activeUsersCount", USERS.filter(function (u) { return u.st === "active-u"; }).length);
    setText("sellerUsersCount", USERS.filter(function (u) { return u.role === "Seller"; }).length);
    setText("buyerUsersCount", USERS.filter(function (u) { return u.role === "Buyer"; }).length);
  }

  /* ---------- RENDER: admin users ---------- */
  function renderAdminUsers() {
    var body = document.getElementById("adminUsersBody");
    if (!body) return;
    var list = filteredUsers();
    setText("usersTableCount", list.length + " Users");
    var empty = document.getElementById("usersEmptyState");
    if (empty) empty.style.display = list.length ? "none" : "block";
    body.innerHTML = list.map(function (u) {
      var banned = u.st === "banned";
      return '<tr><td><div class="dash-cell-user"><img src="' + asset("users/" + u.img) + '" alt="' + u.name + '">' +
        '<div><span class="cell-strong">' + u.name + '</span><span class="cell-sub">@' + u.handle + '</span></div></div></td>' +
        '<td><span class="cell-sub">' + u.email + '</span><span class="cell-sub">' + u.phone + '</span></td>' +
        '<td>' + u.role + '</td><td>' + u.loc + '</td><td>' + u.lists + '</td>' +
        '<td class="cell-sub">' + u.joined + '</td>' +
        '<td><span class="status-pill ' + u.st + '">' + USER_STATUS_LABEL[u.st] + '</span></td>' +
        '<td><button type="button" class="btn ' + (banned ? "btn-primary" : "btn-outline-dark") + ' btn-sm user-action" data-user="' + u.name + '" data-status="' + u.st + '">' +
        (banned ? "Unban" : "Ban") + '</button></td></tr>';
    }).join("");
  }

  function resetUserFilters() {
    ["userSearch", "userRoleFilter", "userStatusFilter"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
    renderAdminUsers();
  }

  function initUserControls() {
    var search = document.getElementById("userSearch");
    if (search) search.addEventListener("input", renderAdminUsers);
    ["userRoleFilter", "userStatusFilter"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("change", renderAdminUsers);
    });
    ["clearUserFilters", "resetUserSearch"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", function (e) {
        e.preventDefault();
        resetUserFilters();
      });
    });
    var addBtn = document.getElementById("addUserBtn");
    if (addBtn) addBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showToast("Add User", "User creation form coming soon.", "info");
    });
    var viewAll = document.getElementById("viewAllUserActivity");
    if (viewAll) viewAll.addEventListener("click", function (e) {
      e.preventDefault();
      showToast("Activity", "Showing all user activity.", "info");
    });
    var pwSubmit = document.getElementById("dashPwSubmit");
    if (pwSubmit) pwSubmit.addEventListener("click", function (e) {
      e.preventDefault();
      var form = document.getElementById("dashPwForm");
      if (form && form.requestSubmit) form.requestSubmit();
    });
  }

  /* ---------- ROLE SWITCHING ---------- */
  function applyRole() {
    document.querySelectorAll(".role-switch-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-role") === role);
    });
    var badge = document.getElementById("roleBadge");
    badge.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    badge.classList.toggle("admin", role === "admin");

    document.querySelectorAll(".user-only").forEach(function (el) {
      el.classList.toggle("hidden", role !== "user");
    });
    document.querySelectorAll(".admin-only").forEach(function (el) {
      el.classList.toggle("hidden", role !== "admin");
    });

    var greeting = document.getElementById("dashGreeting");
    if (role === "admin") {
      greeting.textContent = "Welcome back, Administrator";
    } else {
      var name = localStorage.getItem("stackly_name");
      greeting.textContent = name ? "Welcome back, " + name : "Welcome back, Rider";
    }

    renderOverview();
    if (role === "admin") {
      renderListingStats();
      initListingControls();
      renderAdminListings();
      renderUserStats();
      initUserControls();
      renderAdminUsers();
      renderPendingApprovals();
    } else {
      renderMyBikes();
      renderFavorites();
      initFavoritesControls();
      renderMessages();
      initMessagesControls();
    }

    showPanel(currentPanel);
  }

  /* ---------- PANEL SWITCHING ---------- */
  function showPanel(name) {
    var panel = document.getElementById("panel-" + name);
    var validUser = ["overview", "my-bikes", "favorites", "messages", "settings"].indexOf(name) !== -1;
    var validAdmin = ["overview", "listings", "users", "settings"].indexOf(name) !== -1;
    var valid = role === "admin" ? validAdmin : validUser;
    if (!valid) name = "overview";

    currentPanel = name;
    document.querySelectorAll(".dash-panel").forEach(function (p) {
      p.classList.toggle("active", p.id === "panel-" + name);
    });
    document.querySelectorAll(".dash-link").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-panel") === name);
    });
    closeSidebar();
  }

  function openSidebar() {
    document.getElementById("dashSidebar").classList.add("open");
    document.getElementById("dashOverlay").classList.add("show");
  }
  function closeSidebar() {
    document.getElementById("dashSidebar").classList.remove("open");
    document.getElementById("dashOverlay").classList.remove("show");
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".role-switch-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        role = btn.getAttribute("data-role");
        localStorage.setItem("stackly_role", role);
        applyRole();
      });
    });

    document.querySelectorAll(".dash-link").forEach(function (a) {
      a.addEventListener("click", function () { showPanel(a.getAttribute("data-panel")); });
    });

    var menuBtn = document.getElementById("dashMenuBtn");
    if (menuBtn) menuBtn.addEventListener("click", openSidebar);
    var overlay = document.getElementById("dashOverlay");
    if (overlay) overlay.addEventListener("click", closeSidebar);
    var closeBtn = document.getElementById("dashSidebarClose");
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSidebar();
    });

    document.addEventListener("click", function (e) {
      var act = e.target.closest(".admin-action");
      if (act) {
        showToast("Listing approved", act.getAttribute("data-name") + " is now live on STACKLY.", "success");
        return;
      }
      var ua = e.target.closest(".user-action");
      if (ua) {
        var banned = ua.getAttribute("data-status") === "banned";
        showToast(banned ? "User unbanned" : "User banned", ua.getAttribute("data-user") + (banned ? " can access STACKLY again." : " has been banned from STACKLY."), banned ? "success" : "error");
        return;
      }
      var pa = e.target.closest(".pending-approve");
      if (pa) {
        showToast("Listing approved", pa.getAttribute("data-name") + " is now live on STACKLY.", "success");
        pa.closest(".pending-item").remove();
        var cEl = document.getElementById("pendingCount");
        if (cEl) cEl.textContent = Math.max(0, Number(cEl.textContent) - 1);
        if (document.getElementById("pendingEmpty") && !document.querySelector(".pending-item")) {
          document.getElementById("pendingEmpty").style.display = "block";
        }
        return;
      }
      var pr = e.target.closest(".pending-reject");
      if (pr) {
        showToast("Listing rejected", pr.getAttribute("data-name") + " was rejected and the seller notified.", "error");
        pr.closest(".pending-item").remove();
        var cEl2 = document.getElementById("pendingCount");
        if (cEl2) cEl2.textContent = Math.max(0, Number(cEl2.textContent) - 1);
        if (document.getElementById("pendingEmpty") && !document.querySelector(".pending-item")) {
          document.getElementById("pendingEmpty").style.display = "block";
        }
        return;
      }
      var replyBtn = e.target.closest("[data-reply]");
      if (replyBtn) {
        var rIdx = Number(replyBtn.getAttribute("data-reply"));
        var rMsg = MSGS[rIdx];
        if (rMsg && rMsg.unread) {
          rMsg.unread = false;
          renderMessages();
        }
        showToast("Reply", "Compose a reply to " + (rMsg ? rMsg.name : "this conversation") + ".", "info");
        return;
      }
      var delBtn = e.target.closest("[data-delete]");
      if (delBtn) {
        var dIdx = Number(delBtn.getAttribute("data-delete"));
        var dMsg = MSGS[dIdx];
        MSGS.splice(dIdx, 1);
        renderMessages();
        showToast("Message deleted", dMsg ? "The conversation with " + dMsg.name + " was deleted." : "The message was deleted.", "success");
        return;
      }
      var rm = e.target.closest("[data-remove]");
      if (rm) {
        var id = Number(rm.getAttribute("data-remove"));
        if (window.toggleFavorite) window.toggleFavorite(id);
        showToast("Favorite updated", "Your favorites list has been updated.", "info");
        renderFavorites();
      }
    });

    applyRole();
  });
})();
