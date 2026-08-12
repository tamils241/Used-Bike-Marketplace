/* ==========================================================================
   STACKLY — Used Bike Marketplace
   script.js  |  Shared data, UI components & global behaviors
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Path helper (index vs pages/) ---------- */
  var isPage = /\/pages\//.test(window.location.pathname);
  var BASE = isPage ? "../" : "";
  function img(p) {
    return BASE + "images/" + p;
  }
  function page(p) {
    return BASE + "pages/" + p;
  }

  /* ---------- 1. DATA ---------- */
  var BIKES = [
    {
      id: 1, brand: "Yamaha", name: "Yamaha MT-15", model: "MT-15", variant: "Standard",
      year: 2022, km: 18500, fuel: "Petrol", transmission: "Manual", type: "Sports",
      price: 135000, emi: "₹3,900/mo", location: "Chennai", owners: 1, condition: "Excellent",
      engine: "155 cc", mileage: "48 kmpl", power: "18.4 PS", rating: 4.7, reviews: 12,
      views: 1840, added: 16, featured: true, image: "Yamaha MT-15.webp",
      images: ["Yamaha MT-15.webp", "Yamaha MT-15-2.webp", "Yamaha MT-15-3.webp", "Yamaha MT-15-4.webp"],
      desc: "Single-owner MT-15 in showroom condition, regularly serviced at authorized Yamaha dealer. New tires, fresh brake pads and a recent full service. Ideal for city commutes with weekend highway runs.",
      features: ["Anti-lock Braking System", "LED Headlamp", "Digital Instrument Cluster", "Slipper Clutch", "Dual Channel ABS", "Upside-Down Front Fork"]
    },
    {
      id: 2, brand: "Honda", name: "Honda Activa 6G", model: "Activa 6G", variant: "DX",
      year: 2021, km: 12500, fuel: "Petrol", transmission: "Automatic", type: "Scooters",
      price: 62000, emi: "₹1,850/mo", location: "Bangalore", owners: 1, condition: "Very Good",
      engine: "110 cc", mileage: "45 kmpl", power: "7.9 PS", rating: 4.5, reviews: 9,
      views: 2210, added: 14, featured: false, image: "honda-activa-6g.webp",
      images: ["honda-activa-6g.webp", "honda-activa-6g-2.webp", "honda-activa-6g-3.webp", "honda-activa-6g-4.webp"],
      desc: "Well-maintained Activa 6G with silent start and LED headlamp. Serviced regularly, zero accidents, all papers clear with transfer assistance.",
      features: ["Silent Start", "LED Headlamp", "External Fuel Fill", "Mobile Charging Socket", "Tubeless Tires", "Combi Brake System"]
    },
    {
      id: 3, brand: "Royal Enfield", name: "Royal Enfield Classic 350", model: "Classic 350", variant: "Halcyon",
      year: 2020, km: 22000, fuel: "Petrol", transmission: "Manual", type: "Cruiser",
      price: 128000, emi: "₹3,700/mo", location: "Mumbai", owners: 2, condition: "Good",
      engine: "349 cc", mileage: "35 kmpl", power: "20.2 PS", rating: 4.6, reviews: 15,
      views: 1560, added: 12, featured: true, image: "Royal Enfield Classic 350.webp",
      images: ["Royal Enfield Classic 350.webp", "Royal Enfield Classic 350-2.webp", "Royal Enfield Classic 350-3.webp", "Royal Enfield Classic 350-4.webp"],
      desc: "Classic thumper with a smooth J-series engine. Recently serviced, new chain sprocket set and upgraded touring seat. Small cosmetic nicks on the tank, mechanically very sound.",
      features: ["Single Channel ABS", "Retro Round Headlamp", "Alloy Wheels", "Kick + Electric Start", "Tripper Navigation", "Dual Tone Seat"]
    },
    {
      id: 4, brand: "KTM", name: "KTM Duke 200", model: "Duke 200", variant: "BS6",
      year: 2021, km: 15000, fuel: "Petrol", transmission: "Manual", type: "Sports",
      price: 145000, emi: "₹4,200/mo", location: "Delhi", owners: 1, condition: "Excellent",
      engine: "199.5 cc", mileage: "35 kmpl", power: "25 PS", rating: 4.8, reviews: 11,
      views: 3020, added: 11, featured: true, image: "KTM Duke 200.webp",
      images: ["KTM Duke 200.webp", "KTM Duke 200-2.webp", "KTM Duke 200-3.webp", "KTM Duke 200-4.webp"],
      desc: "Track-inspired naked bike with superb handling. All services done at KTM dealer, performance filter installed, new rear tire. A head-turner in peak condition.",
      features: ["Dual Channel ABS", "TFT Display", "LED DRLs", "Fuel Tank 13.5L", "Slip-Assist Clutch", "Trellis Frame"]
    },
    {
      id: 5, brand: "TVS", name: "TVS Apache RTR 160", model: "Apache RTR 160 4V", variant: "4V Disc",
      year: 2022, km: 9800, fuel: "Petrol", transmission: "Manual", type: "Sports",
      price: 82000, emi: "₹2,450/mo", location: "Coimbatore", owners: 1, condition: "Excellent",
      engine: "159.7 cc", mileage: "45 kmpl", power: "17.4 PS", rating: 4.4, reviews: 7,
      views: 980, added: 9, featured: true, image: "TVS Apache RTR 160.webp",
      images: ["TVS Apache RTR 160.webp", "TVS Apache RTR 160-2.webp", "TVS Apache RTR 160-3.webp", "TVS Apache RTR 160-4.webp"],
      desc: "Low run, single-owner Apache with race-derived styling. Balanced city pocket-rocket, always serviced on time at authorized TVS showroom.",
      features: ["Dual Channel ABS", "Race-Tuned Exhaust", "Digital Display", "Slipper Clutch", "Sporty LED Lights", "Oil-Cooled Engine"]
    },
    {
      id: 6, brand: "Bajaj", name: "Bajaj Pulsar NS200", model: "Pulsar NS200", variant: "Single Disc",
      year: 2020, km: 26000, fuel: "Petrol", transmission: "Manual", type: "Sports",
      price: 88000, emi: "₹2,650/mo", location: "Hyderabad", owners: 2, condition: "Good",
      engine: "199.5 cc", mileage: "38 kmpl", power: "24.5 PS", rating: 4.3, reviews: 8,
      views: 1240, added: 8, featured: false, image: "Bajaj Pulsar NS200_11zon.webp",
      images: ["Bajaj Pulsar NS200_11zon.webp", "Bajaj Pulsar NS200-2_11zon.webp", "Bajaj Pulsar NS200-3.webp", "Bajaj Pulsar NS200-4.webp"],
      desc: "Aggressive street naked with excellent torque. Recently replaced battery and clutch plates. A few scratches on fairing, runs perfectly.",
      features: ["Projector Headlamp", "Digital Console", "Perimeter Frame", "Nitrox Monoshock", "Twin Disc Option", "Alpine Green" ]
    },
    {
      id: 7, brand: "Suzuki", name: "Suzuki Access 125", model: "Access 125", variant: "Bluetooth",
      year: 2022, km: 11000, fuel: "Petrol", transmission: "Automatic", type: "Scooters",
      price: 68000, emi: "₹2,050/mo", location: "Kochi", owners: 1, condition: "Very Good",
      engine: "124 cc", mileage: "50 kmpl", power: "8.7 PS", rating: 4.4, reviews: 6,
      views: 870, added: 7, featured: false, image: "Suzuki Access 125-2.webp",
      images: ["Suzuki Access 125-3.webp", "Suzuki Access 125-2.webp", "Suzuki Access 125-3.webp", "Suzuki Access 125-4.webp"],
      desc: "Spacious, comfortable scooter with Bluetooth console and silent start. First owner, genuine kms, full service history available.",
      features: ["Bluetooth Connectivity", "Silent Kick Start", "LED Headlamp", "USB Charger", "External Fuel Fill", "Big 21L Storage"]
    },
    {
      id: 8, brand: "Hero", name: "Hero Splendor Plus", model: "Splendor Plus", variant: "Self-Drum",
      year: 2021, km: 16000, fuel: "Petrol", transmission: "Manual", type: "Commuter",
      price: 52000, emi: "₹1,550/mo", location: "Madurai", owners: 1, condition: "Good",
      engine: "97.2 cc", mileage: "70 kmpl", power: "7.9 PS", rating: 4.6, reviews: 10,
      views: 1450, added: 6, featured: false, image: "Hero Splendor Plus.webp",
      images: ["Hero Splendor Plus.webp", "Hero Splendor Plus-2.webp", "Hero Splendor Plus-3.webp", "Hero Splendor Plus-4.webp"],
      desc: "India's most trusted commuter with unmatched fuel efficiency. Well maintained, no electrical issues, ideal first bike or daily workhorse.",
      features: ["i3S Start-Stop", "LED Headlamp", "Side Stand Indicator", "Low Maintenance", "Strong Mileage", "Comfortable Seat"]
    },
    {
      id: 9, brand: "Kawasaki", name: "Kawasaki Ninja 300", model: "Ninja 300", variant: "ABS",
      year: 2019, km: 28000, fuel: "Petrol", transmission: "Manual", type: "Sports",
      price: 220000, emi: "₹6,400/mo", location: "Pune", owners: 2, condition: "Good",
      engine: "296 cc", mileage: "28 kmpl", power: "39 PS", rating: 4.7, reviews: 5,
      views: 2650, added: 5, featured: false, image: "Kawasaki Ninja 300.webp",
      images: ["Kawasaki Ninja 300.webp", "Kawasaki Ninja 300-2.webp", "Kawasaki Ninja 300-3.webp", "Kawasaki Ninja 300-4.webp"],
      desc: "Iconic parallel-twin sports bike, fully faired. Recently overhauled radiator and renewed coolant, fresh chain set. Track-ready and street-friendly.",
      features: ["Twin-Cylinder Engine", "Dual Channel ABS", "Full Fairing", "Digital Console", "Clip-On Handlebars", "19L Tank"]
    },
    {
      id: 10, brand: "BMW", name: "BMW G 310 R", model: "G 310 R", variant: "Comfort",
      year: 2021, km: 14000, fuel: "Petrol", transmission: "Manual", type: "Sports",
      price: 260000, emi: "₹7,500/mo", location: "Delhi", owners: 1, condition: "Excellent",
      engine: "313 cc", mileage: "30 kmpl", power: "34 PS", rating: 4.8, reviews: 6,
      views: 2890, added: 4, featured: true, image: "BMW G 310 R.webp",
      images: ["BMW G 310 R.webp", "BMW G 310 R-2.webp", "BMW G 310 R-3.webp", "BMW G 310 R-4.webp"],
      desc: "Premium entry into the BMW family. Single owner, all scheduled services at BMW Motorrad dealership, both keys available. A premium ride at a smart price.",
      features: ["Dual Channel ABS", "TFT Optional", "LED Headlamp", "ByBre Brakes", "Premium Paint", "Sport Touring Ergonomics"]
    },
    {
      id: 11, brand: "Jawa", name: "Jawa 42", model: "Jawa 42", variant: "Starry Blue",
      year: 2020, km: 19000, fuel: "Petrol", transmission: "Manual", type: "Cruiser",
      price: 130000, emi: "₹3,800/mo", location: "Bangalore", owners: 1, condition: "Very Good",
      engine: "293 cc", mileage: "32 kmpl", power: "27.3 PS", rating: 4.5, reviews: 7,
      views: 1320, added: 3, featured: false, image: "Jawa 42.webp",
      images: ["Jawa 42.webp", "Jawa 42-2.webp", "Jawa 42-3.webp", "Jawa 42-4.webp"],
      desc: "Retro-cool 42 with twin exhausts and analog charm. New battery, recent servicing, cosmetic condition is superb with minor wear only.",
      features: ["Twin Chrome Exhausts", "Round Headlamp", "ABS", "Analog Cluster", "Blacked-Out Details", "Comfortable Cruiser Seat"]
    },
    {
      id: 12, brand: "Ola Electric", name: "Ola S1 Pro", model: "S1 Pro", variant: "Standard",
      year: 2022, km: 8000, fuel: "Electric", transmission: "Automatic", type: "Electric",
      price: 115000, emi: "₹3,400/mo", location: "Hyderabad", owners: 1, condition: "Excellent",
      engine: "4.5 kWh Battery", mileage: "195 km/charge", power: "8.5 kW", rating: 4.3, reviews: 9,
      views: 1980, added: 2, featured: true, image: "Ola S1 Pro.webp",
      images: ["Ola S1 Pro.webp", "Ola S1 Pro-2.webp", "Ola S1 Pro-3.webp", "Ola S1 Pro-4.webp"],
      desc: "Flagship electric scooter with hyperdrive mode and big touchscreen. Battery health excellent, comes with home charger. Zero running cost rides!",
      features: ["7-inch Touchscreen", "Cruise Control", "Reverse Mode", "OTA Updates", "Keyless Go", "Fast Charging"]
    },
    {
      id: 13, brand: "Royal Enfield", name: "Royal Enfield Himalayan 411", model: "Himalayan", variant: "Dual ABS",
      year: 2021, km: 24000, fuel: "Petrol", transmission: "Manual", type: "Adventure",
      price: 190000, emi: "₹5,500/mo", location: "Trichy", owners: 1, condition: "Very Good",
      engine: "411 cc", mileage: "30 kmpl", power: "24.3 PS", rating: 4.6, reviews: 8,
      views: 1760, added: 15, featured: false, image: "Royal Enfield Himalayan 411.webp",
      images: ["Royal Enfield Himalayan 411.webp", "Royal Enfield Himalayan 411-2.webp", "Royal Enfield Himalayan 411-3.webp", "Royal Enfield Himalayan 411-4.webp"],
      desc: "Go-anywhere adventure tourer with crash guards, auxiliary lights and touring accessories fitted. Spoked wheels, high ground clearance and genuine off-road pedigree.",
      features: ["Long Travel Suspension", "Dual Channel ABS", "Spoked Wheels", "21L Tank", "Tourer Ergonomics", "Riding Modes"]
    },
    {
      id: 14, brand: "Honda", name: "Honda CB Shine", model: "CB Shine", variant: "Drum",
      year: 2022, km: 12000, fuel: "Petrol", transmission: "Manual", type: "Commuter",
      price: 65000, emi: "₹1,950/mo", location: "Chennai", owners: 1, condition: "Excellent",
      engine: "123.9 cc", mileage: "55 kmpl", power: "10.7 PS", rating: 4.5, reviews: 9,
      views: 1120, added: 13, featured: false, image: "Honda CB Shine.webp",
      images: ["Honda CB Shine.webp", "Honda CB Shine-2.webp", "Honda CB Shine-3.webp", "Honda CB Shine-4.webp"],
      desc: "Trusted Honda commuter, smooth and reliable. Single owner, garage kept, all services up to date with stamped service book.",
      features: ["Silent Start", "ACGF Engine", "LED HSD", "Low Vibration", "Comfort Seat", "Excellent Mileage"]
    },
    {
      id: 15, brand: "Yamaha", name: "Yamaha R15 V4", model: "R15 V4", variant: "Racing Blue",
      year: 2023, km: 5200, fuel: "Petrol", transmission: "Manual", type: "Sports",
      price: 168000, emi: "₹4,900/mo", location: "Bangalore", owners: 1, condition: "Excellent",
      engine: "155 cc", mileage: "40 kmpl", power: "18.1 PS", rating: 4.9, reviews: 14,
      views: 4210, added: 18, featured: true, image: "Yamaha R15 V4.webp",
      images: ["Yamaha R15 V4.webp", "Yamaha R15 V4-2.webp", "Yamaha R15 V4-3.webp"],
      desc: "Almost-new R15 V4 with just 5,200 genuine kms. Full warranty intact, racing blue paint flawless, quick shifter for effortless track-style shifts. An absolute steal.",
      features: ["Quick Shifter", "TFT Display", "Dual Channel ABS", "Traction Control", "VVA Engine", "LED Lighting"]
    },
    {
      id: 16, brand: "TVS", name: "TVS Ntorq 125", model: "Ntorq 125", variant: "Race Edition",
      year: 2022, km: 9500, fuel: "Petrol", transmission: "Automatic", type: "Scooters",
      price: 78000, emi: "₹2,350/mo", location: "Mumbai", owners: 1, condition: "Very Good",
      engine: "124.8 cc", mileage: "43 kmpl", power: "9.4 PS", rating: 4.4, reviews: 6,
      views: 940, added: 10, featured: true, image: "TVS Ntorq 125.webp",
      images: ["TVS Ntorq 125.webp", "TVS Ntorq 125-2.webp", "TVS Ntorq 125-3.webp", "TVS Ntorq 125-4.webp"],
      desc: "Youthful, feature-loaded scooter with riding modes and race graphics. Single owner, regular servicing, all accessories intact.",
      features: ["Riding Modes", "SmartXonnect", "LED Headlamp", "Race Graphics", "12L Storage", "Digital Cluster"]
    },
    {
      id: 17, brand: "Bajaj", name: "Bajaj Dominar 400", model: "Dominar 400", variant: "Tourer",
      year: 2021, km: 18000, fuel: "Petrol", transmission: "Manual", type: "Cruiser",
      price: 175000, emi: "₹5,100/mo", location: "Pune", owners: 1, condition: "Excellent",
      engine: "373 cc", mileage: "27 kmpl", power: "39.4 PS", rating: 4.6, reviews: 10,
      views: 1680, added: 19, featured: true, image: "Bajaj Dominar 400.webp",
      images: ["Bajaj Dominar 400.webp", "Bajaj Dominar 400-2.webp", "Bajaj Dominar 400-3.webp", "Bajaj Dominar 400-4.webp"],
      desc: "Highway cruiser with touring accessories — panniers, crash guard and handlebar risers fitted. Single owner, full service history, torque-rich 373cc engine.",
      features: ["Dual Channel ABS", "Full-LED Lighting", "Liquid Cooling", "Slipper Clutch", "Touring Windscreen", "Tubeless Alloy Wheels"]
    },
    {
      id: 18, brand: "Royal Enfield", name: "Royal Enfield Interceptor 650", model: "Interceptor 650", variant: "Baker Express",
      year: 2020, km: 21000, fuel: "Petrol", transmission: "Manual", type: "Cruiser",
      price: 245000, emi: "₹7,100/mo", location: "Kochi", owners: 2, condition: "Very Good",
      engine: "648 cc", mileage: "25 kmpl", power: "47 PS", rating: 4.8, reviews: 12,
      views: 2340, added: 20, featured: true, image: "Royal Enfield Interceptor 650.webp",
      images: ["Royal Enfield Interceptor 650.webp", "Royal Enfield Interceptor 650-2.webp", "Royal Enfield Interceptor 650-3.webp", "Royal Enfield Interceptor 650-4.webp"],
      desc: "Twin-cylinder charmer with a thumping exhaust note. Recently serviced, new tires and upgraded seat. All paperwork clear with transfer assistance.",
      features: ["Parallel Twin Engine", "Dual Channel ABS", "Slip-Assist Clutch", "Retro Round Headlamp", "Twin Pod Instrument Cluster", "Comfortable Touring Ergonomics"]
    },
    {
      id: 19, brand: "Honda", name: "Honda Activa 6G", model: "Activa 6G", variant: "DLX",
      year: 2022, km: 9500, fuel: "Petrol", transmission: "Automatic", type: "Scooters",
      price: 66000, emi: "₹1,950/mo", location: "Bangalore", owners: 1, condition: "Excellent",
      engine: "110 cc", mileage: "46 kmpl", power: "7.9 PS", rating: 4.5, reviews: 8,
      views: 1050, added: 21, featured: false, image: "honda-activa-6g-4.webp",
      images: ["honda-activa-6g-4.webp", "honda-activa-6g.webp", "honda-activa-6g-2.webp", "honda-activa-6g-3.webp"],
      desc: "Low-run Activa 6G DLX with silent start and all original papers. Single owner, regularly serviced at Honda showroom, ideal family scooter.",
      features: ["Silent Start", "LED Headlamp", "External Fuel Fill", "Mobile Charging Socket", "Tubeless Tires", "Combi Brake System"]
    },
    {
      id: 20, brand: "Suzuki", name: "Suzuki Access 125", model: "Access 125", variant: "Bluetooth 2023",
      year: 2023, km: 7200, fuel: "Petrol", transmission: "Automatic", type: "Scooters",
      price: 72000, emi: "₹2,150/mo", location: "Chennai", owners: 1, condition: "Excellent",
      engine: "124 cc", mileage: "50 kmpl", power: "8.7 PS", rating: 4.5, reviews: 5,
      views: 760, added: 22, featured: false, image: "Suzuki Access 125-3.webp",
      images: ["Suzuki Access 125-3.webp", "Suzuki Access 125-4.webp", "Suzuki Access 125-2.webp"],
      desc: "Nearly-new Access 125 with Bluetooth console and 7,200 genuine kms. Warranty active, showroom condition, complete service history available.",
      features: ["Bluetooth Connectivity", "Silent Kick Start", "LED Headlamp", "USB Charger", "External Fuel Fill", "Big 21L Storage"]
    }
  ];

  var BRANDS = [
    { name: "Yamaha", mark: "YA", img: "Yamaha.webp", count: 0 },
    { name: "Honda", mark: "HO", img: "Honda.webp", count: 0 },
    { name: "Royal Enfield", mark: "RE", img: "Royal Enfield.webp", count: 0 },
    { name: "KTM", mark: "KT", img: "KTM.webp", count: 0 },
    { name: "TVS", mark: "TV", img: "TVS.webp", count: 0 },
    { name: "Bajaj", mark: "BJ", img: "Bajaj.webp", count: 0 },
    { name: "Suzuki", mark: "SZ", img: "Suzuki.webp", count: 0 },
    { name: "Hero", mark: "HR", img: "Hero.webp", count: 0 },
    { name: "Kawasaki", mark: "KW", img: "Kawasaki.webp", count: 0 },
    { name: "BMW", mark: "BM", img: "BMW.webp", count: 0 },
    { name: "Jawa", mark: "JW", img: "Jawa.webp", count: 0 },
    { name: "Ola Electric", mark: "OL", img: "Ola Electric.webp", count: 0 }
  ];
  BRANDS.forEach(function (b) {
    b.count = BIKES.filter(function (x) { return x.brand === b.name; }).length;
  });

  var CATEGORIES = [
    { name: "Commuter Bikes", icon: "fa-bicycle", count: 1240, image: "Commuter Bikes.webp" },
    { name: "Sports Bikes", icon: "fa-gauge-high", count: 860, image: "KTM Duke 200.webp" },
    { name: "Cruiser Bikes", icon: "fa-route", count: 420, image: "Royal Enfield Classic 350.webp" },
    { name: "Scooters", icon: "fa-bolt", count: 1150, image: "honda-activa-6g.webp" },
    { name: "Adventure Bikes", icon: "fa-mountain", count: 310, image: "Royal Enfield Himalayan 411.webp" },
    { name: "Electric Bikes", icon: "fa-charging-station", count: 280, image: "Ola S1 Pro.webp" },
    { name: "Touring Bikes", icon: "fa-road", count: 190, image: "Kawasaki Ninja 300.webp" },
    { name: "Off-Road Bikes", icon: "fa-flag-checkered", count: 150, image: "Royal Enfield Himalayan 411.webp" },
    { name: "Classic Bikes", icon: "fa-motorcycle", count: 130, image: "Jawa 42.webp" }
  ];

  var CITIES = [
    { name: "Chennai", count: 1240 }, { name: "Bangalore", count: 1180 },
    { name: "Coimbatore", count: 620 }, { name: "Madurai", count: 340 },
    { name: "Trichy", count: 290 }, { name: "Kochi", count: 430 },
    { name: "Hyderabad", count: 960 }, { name: "Bengaluru", count: 1180 },
    { name: "Mumbai", count: 1020 }, { name: "Delhi", count: 890 },
    { name: "Pune", count: 720 }, { name: "Ahmedabad", count: 540 }
  ];

  var REVIEWS = [
    { name: "Arun Kumar", city: "Chennai", rating: 5, avatar: "user-1.webp",
      text: "STACKLY made finding my used Yamaha incredibly easy. I compared multiple bikes and found the right one within a week." },
    { name: "Priya Sharma", city: "Bangalore", rating: 5, avatar: "user-2.webp",
      text: "The price estimator was spot on. I sold my Activa above my expected price and the entire process was smooth and transparent." },
    { name: "Rahul Nair", city: "Kochi", rating: 4, avatar: "user-3.webp",
      text: "Verified listings actually mean verified here. The seller was genuine, the bike matched the photos perfectly. Highly recommended." },
    { name: "Sneha Patel", city: "Mumbai", rating: 5, avatar: "user-4.webp",
      text: "As a first-time buyer, the comparison tool helped me choose the perfect commuter bike within my budget. Great support team too." },
    { name: "Vikram Singh", city: "Delhi", rating: 5, avatar: "user-5.webp",
      text: "Sold my KTM within 3 days of listing. The listing process was simple and the buyer was pre-verified. Fantastic experience." }
  ];

  /* ---------- 2. HELPERS ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function formatINR(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  function formatKm(n) {
    return Number(n).toLocaleString("en-IN") + " km";
  }

  function getBike(id) {
    id = Number(id);
    return BIKES.find(function (b) { return b.id === id; }) || null;
  }

  function countBy(list, key) {
    var map = {};
    list.forEach(function (x) { map[x[key]] = (map[x[key]] || 0) + 1; });
    return map;
  }

  /* ---------- 3. STORAGE (favorites & compare) ---------- */
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem("stackly_favorites") || "[]"); }
    catch (e) { return []; }
  }
  function saveFavorites(list) { localStorage.setItem("stackly_favorites", JSON.stringify(list)); }
  function isFavorite(id) { return getFavorites().indexOf(Number(id)) !== -1; }
  function toggleFavorite(id) {
    id = Number(id);
    var list = getFavorites();
    var idx = list.indexOf(id);
    var added = false;
    if (idx === -1) { list.push(id); added = true; }
    else { list.splice(idx, 1); }
    saveFavorites(list);
    return added;
  }

  function getCompare() {
    try { return JSON.parse(localStorage.getItem("stackly_compare") || "[]"); }
    catch (e) { return []; }
  }
  function saveCompare(list) { localStorage.setItem("stackly_compare", JSON.stringify(list)); }
  function isCompared(id) { return getCompare().indexOf(Number(id)) !== -1; }
  function toggleCompare(id) {
    id = Number(id);
    var list = getCompare();
    var idx = list.indexOf(id);
    var added = false;
    if (idx === -1) {
      if (list.length >= 3) { showToast("Compare limit reached", "Remove a bike before adding another (max 3).", "warn"); return null; }
      list.push(id); added = true;
    } else { list.splice(idx, 1); }
    saveCompare(list);
    updateCompareBar();
    return added;
  }

  /* ---------- 4. TOASTS ---------- */
  var toastWrap = null;
  function ensureToastWrap() {
    if (toastWrap) return toastWrap;
    toastWrap = document.createElement("div");
    toastWrap.className = "toast-wrap";
    toastWrap.setAttribute("aria-live", "polite");
    document.body.appendChild(toastWrap);
    return toastWrap;
  }
  function showToast(title, msg, type) {
    type = type || "success";
    var wrap = ensureToastWrap();
    var t = document.createElement("div");
    t.className = "toast " + type;
    var icons = { success: "fa-check", error: "fa-triangle-exclamation", info: "fa-circle-info", warn: "fa-bell" };
    t.innerHTML =
      '<span class="toast-icon"><i class="fa-solid ' + (icons[type] || icons.success) + '"></i></span>' +
      '<div class="toast-body"><b></b><span></span></div>' +
      '<div class="toast-bar"></div>';
    t.querySelector("b").textContent = title;
    t.querySelector("span").textContent = msg || "";
    wrap.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.remove(); }, 400);
    }, 3000);
  }
  window.showToast = showToast;
  window.STACKLY_BIKES = BIKES;
  window.STACKLY_BRANDS = BRANDS;
  window.STACKLY_CATEGORIES = CATEGORIES;
  window.STACKLY_CITIES = CITIES;
  window.STACKLY_REVIEWS = REVIEWS;
  window.getBike = getBike;
  window.formatINR = formatINR;
  window.formatKm = formatKm;
  window.toggleFavorite = toggleFavorite;
  window.toggleCompare = toggleCompare;
  window.getCompare = getCompare;
  window.saveCompare = saveCompare;
  window.updateCompareBar = updateCompareBar;
  window.isFavorite = isFavorite;
  window.isCompared = isCompared;
  window.countBy = countBy;
  window.BASE = BASE;
  window.asset = img;

  /* ---------- 5. MODALS ---------- */
  var modalOverlay = null;
  function buildModal() {
    if (modalOverlay) return modalOverlay;
    modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.setAttribute("role", "dialog");
    modalOverlay.setAttribute("aria-modal", "true");
    modalOverlay.innerHTML =
      '<div class="modal" role="document">' +
      '  <div class="modal-head"><h3></h3><button class="modal-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div>' +
      '  <div class="modal-body"></div>' +
      '</div>';
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
    modalOverlay.querySelector(".modal-close").addEventListener("click", closeModal);
    document.body.appendChild(modalOverlay);
    return modalOverlay;
  }
  function openModal(title, bodyHTML, isLarge) {
    var m = buildModal();
    m.querySelector(".modal h3").textContent = title;
    m.querySelector(".modal-body").innerHTML = bodyHTML;
    m.querySelector(".modal").classList.toggle("modal-lg", !!isLarge);
    m.classList.add("show");
    document.body.style.overflow = "hidden";
    var closeBtn = m.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }
  window.openModal = openModal;
  window.closeModal = closeModal;

  /* ---------- 6. BIKE CARD TEMPLATE ---------- */
  function bikeCardHTML(bike, opts) {
    opts = opts || {};
    var fav = isFavorite(bike.id) ? "active" : "";
    var favIcon = isFavorite(bike.id) ? "fa-solid" : "fa-regular";
    var cmp = isCompared(bike.id) ? "checked" : "";
    var badges = "";
    if (bike.featured) badges += '<span class="badge badge-featured"><i class="fa-solid fa-star"></i> Featured</span>';
    if (bike.added >= 15) badges += '<span class="badge badge-new">New</span>';
    if (opts.showSold && bike.sold) badges += '<span class="badge badge-sold">Sold</span>';

    return (
      '<article class="bike-card reveal-card" data-id="' + bike.id + '">' +
      '  <div class="bike-media">' +
      '    <div class="badges">' + badges + '</div>' +
      '    <div class="card-actions">' +
      '      <button class="icon-btn fav-btn ' + fav + '" data-id="' + bike.id + '" aria-label="' + (isFavorite(bike.id) ? "Remove from favorites" : "Add to favorites") + '" title="Save to favorites">' +
      '        <i class="' + favIcon + ' fa-heart"></i></button>' +
      '    </div>' +
      '    <label class="compare-check"><input type="checkbox" class="compare-toggle" data-id="' + bike.id + '" ' + cmp + '> Compare</label>' +
      '    <img src="' + img("bikes/" + bike.image) + '" alt="' + bike.name + ' ' + bike.year + ' used bike for sale" loading="lazy">' +
      '  </div>' +
      '  <div class="bike-body">' +
      '    <span class="bike-brand">' + bike.brand + '</span>' +
      '    <h3 class="bike-name"><a href="' + page("bike-details.html?id=" + bike.id) + '">' + bike.name + '</a></h3>' +
      '    <p class="bike-tagline">' + bike.year + " &middot; " + bike.variant + '</p>' +
      '    <div class="bike-specs">' +
      '      <span><i class="fa-solid fa-gauge-high"></i> ' + formatKm(bike.km) + '</span>' +
      '      <span><i class="fa-solid fa-gas-pump"></i> ' + bike.fuel + '</span>' +
      '      <span><i class="fa-solid fa-gears"></i> ' + bike.transmission + '</span>' +
      '    </div>' +
      '    <span class="bike-loc"><i class="fa-solid fa-location-dot"></i> ' + bike.location + '</span>' +
      '    <div class="bike-foot">' +
      '      <div class="bike-price">' + formatINR(bike.price) + '<small>' + bike.emi + ' EMI</small></div>' +
      '      <a class="btn btn-primary" href="' + page("bike-details.html?id=" + bike.id) + '">View Details</a>' +
      '    </div>' +
      '  </div>' +
      '</article>'
    );
  }
  function renderBikeGrid(container, bikes, opts) {
    opts = opts || {};
    var el = typeof container === "string" ? $(container) : container;
    if (!el) return;
    el.innerHTML = bikes.map(function (b) { return bikeCardHTML(b, opts); }).join("");
    observeCards(el);
  }
  window.renderBikeGrid = renderBikeGrid;
  window.bikeCardHTML = bikeCardHTML;

  /* ---------- 7. SCROLL REVEAL ---------- */
  var cardObserver = null;
  function getCardObserver() {
    if (cardObserver) return cardObserver;
    cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    return cardObserver;
  }
  function observeCards(container) {
    $$(".bike-card.reveal-card", container).forEach(function (card, i) {
      if (card.classList.contains("in-view")) return;
      card.style.transitionDelay = Math.min(i % 9, 8) * 0.06 + "s";
      getCardObserver().observe(card);
    });
  }
  function observeReveal() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- 8. ANIMATED COUNTERS ---------- */
  function animateCounters() {
    var counters = $$(".stat-count[data-count]");
    if (!counters.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var prefix = el.getAttribute("data-prefix") || "";
        var dur = 1800, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { obs.observe(c); });
  }

  /* ---------- 9. TESTIMONIAL SLIDER ---------- */
  function initTestiSlider() {
    var wrap = $(".testi-slider");
    if (!wrap) return;
    var track = $(".testi-track", wrap);
    if (!track) return;
    var slides = $$(".testi-slide", track);
    var dotsWrap = $(".testi-dots", wrap);
    var idx = 0, timer = null;
    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var d = document.createElement("button");
        d.className = "testi-dot" + (i === idx ? " active" : "");
        d.setAttribute("aria-label", "Go to review " + (i + 1));
        d.addEventListener("click", function () { go(i); restart(); });
        dotsWrap.appendChild(d);
      });
    }
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      $$(".testi-dot", dotsWrap).forEach(function (d, j) { d.classList.toggle("active", j === idx); });
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 6000);
    }
    var prev = $(".testi-prev", wrap);
    var next = $(".testi-next", wrap);
    if (prev) prev.addEventListener("click", function () { go(idx - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(idx + 1); restart(); });
    wrap.addEventListener("mouseenter", function () { clearInterval(timer); });
    wrap.addEventListener("mouseleave", restart);
    renderDots();
    restart();
  }

  /* ---------- 10. HEADER + MOBILE MENU ---------- */
  function initHeader() {
    var header = $("#siteHeader");
    var onScroll = function () {
      var y = window.scrollY;
      if (header) header.classList.toggle("scrolled", y > 40);
      var bt = $("#backTop");
      if (bt) bt.classList.toggle("show", y > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var toggle = $("#menuToggle");
    var closeBtn = $("#menuClose");
    var menu = $("#mobileMenu");
    var overlay = $("#menuOverlay");
    function openMenu() {
      if (!menu) return;
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
      if (toggle) toggle.setAttribute("aria-expanded", "true");
      if (overlay) overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      if (!menu) return;
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      if (overlay) overlay.classList.remove("show");
      document.body.style.overflow = "";
    }
    if (toggle) toggle.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);
    $$(".mobile-nav-link", menu).forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMenu(); closeModal(); }
    });
  }

  /* ---------- 11. BACK TO TOP ---------- */
  function initBackTop() {
    var el = document.createElement("button");
    el.className = "back-top";
    el.id = "backTop";
    el.setAttribute("aria-label", "Back to top");
    el.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    el.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(el);
  }

  /* ---------- 12. COMPARE BAR ---------- */
  function initCompareBar() {
    var bar = document.createElement("div");
    bar.className = "compare-bar";
    bar.innerHTML =
      '<span class="cmp-count"><b class="cmp-num">0</b> bikes in compare</span>' +
      '<a class="btn btn-primary btn-sm" href="' + page("compare.html") + '">Compare Now</a>' +
      '<button class="cmp-close" aria-label="Clear compare"><i class="fa-solid fa-xmark"></i></button>';
    document.body.appendChild(bar);
    window._compareBar = bar;
    bar.querySelector(".cmp-close").addEventListener("click", function () {
      saveCompare([]);
      showToast("Compare cleared", "Removed all bikes from comparison.", "info");
      updateCompareBar();
      syncCompareUI();
    });
    updateCompareBar();
  }
  function updateCompareBar() {
    var bar = window._compareBar;
    if (!bar) return;
    var n = getCompare().length;
    bar.querySelector(".cmp-num").textContent = n;
    bar.classList.toggle("show", n > 0);
  }
  function syncCompareUI() {
    $$(".compare-toggle").forEach(function (cb) {
      cb.checked = isCompared(cb.getAttribute("data-id"));
    });
  }

  /* ---------- 13. GLOBAL CLICK DELEGATION (favorites / compare) ---------- */
  function initDelegation() {
    document.addEventListener("click", function (e) {
      var fav = e.target.closest(".fav-btn");
      if (fav) {
        var id = fav.getAttribute("data-id");
        var added = toggleFavorite(id);
        var icon = fav.querySelector("i");
        if (added) {
          fav.classList.add("active");
          if (icon) icon.className = "fa-solid fa-heart";
          showToast("Added to favorites", "Bike saved to your favorites list.");
        } else {
          fav.classList.remove("active");
          if (icon) icon.className = "fa-regular fa-heart";
          showToast("Removed from favorites", "Bike removed from your favorites.", "info");
        }
        if (window.location.pathname.indexOf("favorites") !== -1 && window.StacklyFav) {
          window.StacklyFav.render();
        }
        return;
      }

      var cmp = e.target.closest(".compare-toggle");
      if (cmp) {
        var res = toggleCompare(cmp.getAttribute("data-id"));
        if (res === null) { cmp.checked = false; return; }
        if (res) showToast("Added to compare", "Bike added to comparison (max 3).");
        else showToast("Removed from compare", "Bike removed from comparison.", "info");
        return;
      }

      var wa = e.target.closest("[data-whatsapp]");
      if (wa) {
        var number = wa.getAttribute("data-whatsapp").replace(/[^0-9]/g, "");
        var msg = encodeURIComponent(wa.getAttribute("data-msg") || "Hi STACKLY, I am interested in a bike.");
        window.open("https://wa.me/" + number + "?text=" + msg, "_blank");
      }
    });

    document.addEventListener("change", function (e) {
      var cmp = e.target.closest(".compare-toggle");
      if (cmp && !cmp.checked) {
        toggleCompare(cmp.getAttribute("data-id"));
      }
    });
  }

  /* ---------- 14. CONTACT SELLER MODAL ---------- */
  function openContactModal(bike) {
    var phone = "91" + (9000 + bike.id * 111) + "221" + (bike.id * 3);
    var body =
      '<div class="seller-info-box" style="margin-bottom:18px">' +
      '  <img src="' + img("users/user-" + ((bike.id % 5) + 1) + ".webp") + '" alt="' + bike.brand + ' seller avatar">' +
      '  <div class="info"><b>' + bike.brand + " Verified Seller" + '</b><span>Member since 2021 &middot; ' + bike.location + '</span></div>' +
      '  <a class="btn btn-whatsapp btn-sm" data-whatsapp="' + phone + '" data-msg="Hi, I am interested in your ' + bike.name + " listed on STACKLY" + '" target="_blank"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>' +
      '</div>' +
      '<div class="form-group"><label for="cmName">Your Name</label>' +
      '  <input class="form-control" id="cmName" placeholder="Enter your full name" autocomplete="name"></div>' +
      '<div class="form-group"><label for="cmPhone">Mobile Number</label>' +
      '  <input class="form-control" id="cmPhone" type="tel" placeholder="10-digit mobile number" autocomplete="tel"></div>' +
      '<div class="form-group"><label for="cmMsg">Message</label>' +
      '  <textarea class="form-control" id="cmMsg" placeholder="Hi, I would like to know more about this bike. Is it available for a test ride?">I am interested in ' + bike.name + " (" + bike.year + ") listed at " + formatINR(bike.price) + '.</textarea></div>' +
      '<button class="btn btn-primary btn-block" id="cmSubmit">Send Enquiry</button>';
    openModal("Contact Seller — " + bike.name, body);
    var submit = $("#cmSubmit");
    if (submit) {
      submit.addEventListener("click", function () {
        var name = $("#cmName").value.trim();
        var phoneV = $("#cmPhone").value.trim();
        var msg = $("#cmMsg").value.trim();
        if (!name || !/^[0-9]{10}$/.test(phoneV)) {
          showToast("Check your details", "Please enter your name and a valid 10-digit mobile number.", "error");
          return;
        }
        closeModal();
        showToast("Enquiry sent!", "The seller will contact you shortly on " + phoneV + ".");
      });
    }
  }
  window.openContactModal = openContactModal;

  /* ---------- 15. PRICE ESTIMATOR ---------- */
  var MODELS_BY_BRAND = {
    "Yamaha": ["MT-15", "R15 V4", "R15 V3", "FZ-S V3", "FZ-X", "FZ 25", "MT-03", "YZF-R3"],
    "Honda": ["Activa 6G", "Activa 5G", "CB Shine", "Hornet 2.0", "SP 125", "Unicorn", "CB350RS", "Dio", "Shine SP"],
    "Royal Enfield": ["Classic 350", "Bullet 350", "Hunter 350", "Meteor 350", "Himalayan 411", "Himalayan 450", "Continental GT 650", "Interceptor 650", "Thunderbird 350"],
    "KTM": ["Duke 200", "Duke 250", "Duke 390", "RC 200", "RC 390", "Adventure 390"],
    "TVS": ["Apache RTR 160", "Apache RTR 200", "Ntorq 125", "Raider 125", "Jupiter 110", "Ronin 225"],
    "Bajaj": ["Pulsar NS200", "Pulsar N250", "Pulsar 150", "Pulsar 220", "Dominar 400", "Avenger 220", "CT 100", "Platina 110"],
    "Suzuki": ["Access 125", "Gixxer 155", "Burgman Street", "V-Strom 250", "GSX-S750"],
    "Hero": ["Splendor Plus", "HF Deluxe", "Passion Pro", "Glamour 125", "Xtreme 160R", "Karizma XMR"],
    "Kawasaki": ["Ninja 300", "Ninja 400", "Ninja 650", "Z650", "Z900", "Versys 650"],
    "BMW": ["G 310 R", "G 310 GS", "S 1000 RR", "R 1250 GS"],
    "Jawa": ["Jawa 42", "Jawa Classic", "Jawa 350", "42 Bobber", "Perak"],
    "Ola Electric": ["S1 Pro", "S1 Pro Plus", "S1 Air", "S1 X"]
  };
  window.MODELS_BY_BRAND = MODELS_BY_BRAND;
  var BASE_PRICE = {
    "Yamaha": 120000, "Honda": 75000, "Royal Enfield": 135000, "KTM": 150000,
    "TVS": 80000, "Bajaj": 85000, "Suzuki": 70000, "Hero": 60000,
    "Kawasaki": 240000, "BMW": 250000, "Jawa": 125000, "Ola Electric": 100000
  };
  function yearFactor(year) {
    var age = 2026 - Number(year);
    if (age <= 0) return 1;
    return Math.max(0.35, Math.pow(0.925, age));
  }
  function kmFactor(km) {
    km = Number(km);
    if (km <= 5000) return 1;
    if (km <= 10000) return 0.95;
    if (km <= 15000) return 0.9;
    if (km <= 25000) return 0.84;
    if (km <= 40000) return 0.76;
    return 0.68;
  }
  var COND_FACTOR = { "Excellent": 1, "Very Good": 0.94, "Good": 0.88, "Fair": 0.8 };
  function ownerFactor(n) {
    n = Number(n);
    if (n === 1) return 1;
    if (n === 2) return 0.93;
    if (n === 3) return 0.86;
    return 0.8;
  }
  function initEstimator() {
    var form = $("#estimatorForm");
    if (!form) return;
    var brandSel = $("#estBrand");
    var modelSel = $("#estModel");
    var yearSel = $("#estYear");
    if (yearSel) {
      var years = "";
      for (var y = 2026; y >= 2005; y--) years += "<option>" + y + "</option>";
      yearSel.innerHTML = '<option value="">Select year</option>' + years;
    }
    if (brandSel && modelSel) {
      brandSel.addEventListener("change", function () {
        var models = MODELS_BY_BRAND[brandSel.value] || [];
        modelSel.innerHTML = '<option value="">Select model</option>' +
          models.map(function (m) { return '<option>' + m + "</option>"; }).join("");
      });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var brand = brandSel.value;
      var year = Number($("#estYear").value);
      var km = Number($("#estKm").value);
      var cond = $("#estCond").value;
      var owners = Number($("#estOwners").value);
      if (!brand || !year || !km || !cond || !owners) {
        showToast("Missing details", "Please fill all fields to estimate your bike's value.", "error");
        return;
      }
      var base = BASE_PRICE[brand] || 80000;
      var value = base * yearFactor(year) * kmFactor(km) * (COND_FACTOR[cond] || 0.9) * ownerFactor(owners);
      var low = Math.round((value * 0.92) / 500) * 500;
      var high = Math.round((value * 1.08) / 500) * 500;
      var result = $("#estResult");
      if (!result) return;
      result.querySelector(".est-range").textContent = formatINR(low) + " – " + formatINR(high);
      result.querySelector(".est-note").innerHTML =
        '<i class="fa-solid fa-thumbs-up"></i> Your ' + brand + " is in <b>" + (value > base * 0.8 ? "good demand" : "stable demand") + "</b> on STACKLY.";
      result.classList.add("show");
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ---------- 16. GENERIC MODAL OPENER (data-modal) ---------- */
  function initModalButtons() {
    $$("[data-modal]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = $(btn.getAttribute("data-modal"));
        if (target) {
          target.classList.add("show");
          document.body.style.overflow = "hidden";
          $$("[data-modal-close]").forEach(function (x) {
            x.addEventListener("click", function () {
              target.classList.remove("show");
              document.body.style.overflow = "";
            });
          });
          target.addEventListener("click", function (e) {
            if (e.target === target) {
              target.classList.remove("show");
              document.body.style.overflow = "";
            }
          });
        }
      });
    });
  }

  /* ---------- 17. FORMS (app-form) ---------- */
  function initForms() {
    $$(".app-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var pw = form.querySelector('input[type="password"]');
        if (pw && pw.value && !pw.checkValidity()) {
          showToast("Weak password", "Use 8+ characters with upper & lower case, a number and a symbol.", "error");
          pw.focus();
          return;
        }
        if (!form.checkValidity()) {
          var bad = form.querySelector(":invalid");
          if (bad) bad.focus();
          showToast("Please fix the errors", "Check the highlighted fields and try again.", "error");
          return;
        }
        var remember = form.querySelector('input[name="remember"]');
        if (remember && !remember.checked) {
          showToast("Please confirm", "Tick the “Remember me” checkbox to continue.", "error");
          remember.focus();
          return;
        }
        var terms = form.querySelector('input[name="terms"]');
        if (terms && !terms.checked) {
          showToast("Please accept the Terms", "You must agree to the Terms of Service and Privacy Policy to continue.", "error");
          terms.focus();
          return;
        }
        var btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          setTimeout(function () { btn.disabled = false; }, 2500);
        }
        var success = $(".form-success", form);
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        form.reset();
        $$(".pw-meter", form).forEach(function (m) {
          m.setAttribute("data-score", "0");
          m.querySelectorAll("i").forEach(function (s) { s.classList.remove("fill"); });
        });
        $$(".pw-hint", form).forEach(function (h) { h.classList.remove("show", "weak", "strong"); });
        var role = form.querySelector('input[name$="Role"]:checked');
        if (role) localStorage.setItem("stackly_role", role.value);
        showToast("Message sent", "Thanks for reaching out — we'll get back to you soon.", "success");
        if (form.id === "loginForm") {
          var dash = localStorage.getItem("stackly_role") === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
          setTimeout(function () { window.location.href = page(dash); }, 900);
        }
        if (form.id === "registerForm") {
          setTimeout(function () { window.location.href = page("login.html"); }, 900);
        }
      });
    });
    ["cfName", "sellName", "rgFname", "rgLname"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", function () {
        var v = el.value.replace(/[^A-Za-z\s]/g, "").replace(/\s{2,}/g, " ").slice(0, 16);
        if (el.value !== v) el.value = v;
      });
    });
    ["cfPhone", "sellPhone", "rgPhone"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", function () {
        var v = el.value.replace(/[^0-9]/g, "").slice(0, 10);
        if (el.value !== v) el.value = v;
      });
    });
    $$(".input-toggle[data-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = document.getElementById(btn.getAttribute("data-toggle"));
        if (!input) return;
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.querySelector("i").className = show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });
    var pwInput = document.getElementById("rgPass");
    if (pwInput) {
      pwInput.addEventListener("input", function () {
        var v = pwInput.value;
        var score = 0;
        if (v.length >= 8) score++;
        if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
        if (/\d/.test(v)) score++;
        if (/[^A-Za-z0-9]/.test(v)) score++;
        var group = pwInput.closest(".form-group");
        var meter = group ? group.querySelector(".pw-meter") : null;
        var hint = group ? group.querySelector(".pw-hint") : null;
        if (meter) {
          meter.setAttribute("data-score", String(score));
          meter.querySelectorAll("i").forEach(function (s, i) {
            s.classList.toggle("fill", i < score);
          });
        }
        if (hint) {
          hint.classList.toggle("show", v.length > 0);
          hint.classList.toggle("strong", score === 4);
          hint.classList.toggle("weak", score > 0 && score < 4);
        }
      });
    }
  }

  /* ---------- 18. PAGE LOADER ---------- */
  function initPageLoader() {
    var loader = document.getElementById("pageLoader");
    if (!loader) return;
    function hide() {
      loader.classList.add("hidden");
      setTimeout(function () { loader.style.display = "none"; }, 500);
    }
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide);
    setTimeout(hide, 3000);
  }

  /* ---------- 19. FAQ ACCORDION ---------- */
  function initFaq() {    $$(".faq-item").forEach(function (item) {
      var q = $(".faq-question", item);
      if (!q) return;
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("active");
        $$(".faq-item.active").forEach(function (x) { x.classList.remove("active"); });
        if (!isOpen) item.classList.add("active");
      });
    });
  }

  /* ---------- 20. INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initPageLoader();
    initHeader();
    initBackTop();
    initCompareBar();
    initDelegation();
    initEstimator();
    initModalButtons();
    initForms();
    initFaq();
    observeReveal();
    animateCounters();
    initTestiSlider();

    document.body.addEventListener("submit", function (e) {
      var form = e.target;
      if (form.classList.contains("js-prevent")) e.preventDefault();
    });
  });
})();
