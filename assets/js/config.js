/* =====================================================================
   HALAWA KIDA — EVERYTHING YOU EDIT LIVES IN THIS ONE FILE
   Change a price, add an item, update hours or the Zelle number here,
   save, and the website, menu and QR menu all update together.
   ===================================================================== */

window.HK_SETTINGS = {
  businessName: "Halawa Kida",
  owner: "Shireen Abourehab",
  town: "Middlesex, NJ",

  // Every order and catering request is emailed here.
  orderEmail: "shireen.abourehab@gmail.com",

  // How customers pay.
  zelle: { to: "732-277-6199", name: "Shireen Abourehab" },

  // Orders must be placed at least this many hours before pickup / delivery.
  leadHours: 24,

  // Pickup / delivery times offered (24-hour clock), every 30 minutes.
  hours: { open: "10:00", close: "19:00", stepMinutes: 30 },

  delivery: {
    radiusMiles: 10,
    note: "Free delivery within 10 miles of Middlesex, NJ. Further away? Ask us.",
    // ZIP codes roughly within 10 miles of Middlesex. Other ZIPs can still order; we confirm by email.
    zips: ["08846","08805","08812","08854","08855","07080","08807","08873","08875","08901","08902","08903","08904","08817","08818","08820","08837","08840","07060","07062","07063","07059","07069","08835","08869","08876","07076","07023","08823","08836","08853","08821","08896","08899","08906","08816","07090","07092","07083","07027","08824"]
  },

  social: {
    instagram: "https://www.instagram.com/halawakida/",
    tiktok: "https://www.tiktok.com/@halawakida",
    facebook: "https://www.facebook.com/halawakida"
  }
};

/* ---------------------------------------------------------------------
   MENU
   kind: "single" = shown under "Just for me"   |  "group" = shown under "For a group"
   price is in dollars. weight / serves are what customers see.
   To hide an item for now, set  hidden: true
   --------------------------------------------------------------------- */
window.HK_CATEGORIES = [
  { id: "baklava", name: "Baklava", note: "Buttered phyllo, nuts, light syrup" },
  { id: "cakes", name: "Kunafa, cakes & tres leches", note: "Keep refrigerated" },
  { id: "cheesecake", name: "Cheesecakes", note: "Keep refrigerated" },
  { id: "platters", name: "Platters & gift boxes", note: "Mixed by us, ready to serve" }
];

window.HK_MENU = [
  { id: "walnut-squares", category: "baklava", featured: false,
    name: "Classic walnut baklava", img: "squares.jpg",
    desc: "Layer after layer of buttered phyllo around spiced walnuts, finished with crushed pistachio.",
    allergens: ["Tree nuts", "Wheat", "Dairy"],
    options: [
      { id: "1", kind: "single", label: "1 piece", meta: "≈35 g", price: 1.75 },
      { id: "6", kind: "single", label: "Box of 6", meta: "≈210 g · serves 2–3", price: 10 },
      { id: "half", kind: "group", label: "Half tray", meta: "≈30 pieces · 1.05 kg · serves 10–15", price: 45 },
      { id: "full", kind: "group", label: "Full tray", meta: "≈60 pieces · 2.1 kg · serves 20–30", price: 85 }
    ] },
  { id: "fingers", category: "baklava", featured: true,
    name: "Baklava fingers", img: "fingers.jpg",
    desc: "Walnut filling rolled tight in buttered phyllo and finished with syrup.",
    allergens: ["Tree nuts", "Wheat", "Dairy"],
    options: [
      { id: "1", kind: "single", label: "1 finger", meta: "≈35 g", price: 2 },
      { id: "6", kind: "single", label: "Box of 6", meta: "≈210 g · serves 2–3", price: 11 },
      { id: "24", kind: "group", label: "Tray of 24", meta: "≈840 g · serves 8–12", price: 42 },
      { id: "48", kind: "group", label: "Tray of 48", meta: "≈1.7 kg · serves 16–24", price: 80 }
    ] },
  { id: "choc-rolls", category: "baklava", featured: true,
    name: "Chocolate baklava rolls", img: "choc-rolls.jpg",
    desc: "Our own twist: cocoa-brushed phyllo rolled around walnuts.",
    allergens: ["Tree nuts", "Wheat", "Dairy"],
    options: [
      { id: "1", kind: "single", label: "1 roll", meta: "≈38 g", price: 2.25 },
      { id: "6", kind: "single", label: "Box of 6", meta: "≈230 g · serves 2–3", price: 12.5 },
      { id: "24", kind: "group", label: "Tray of 24", meta: "≈910 g · serves 8–12", price: 48 }
    ] },
  { id: "baklava-sheet", category: "baklava", featured: false,
    name: "Pistachio baklava sheet", img: "baklava-tray.jpg",
    desc: "A full pan of golden baklava squares dusted with pistachio. Great for parties.",
    allergens: ["Tree nuts", "Wheat", "Dairy"],
    options: [
      { id: "box4", kind: "single", label: "Box of 4", meta: "≈160 g · serves 2", price: 8 },
      { id: "pan", kind: "group", label: "Full pan", meta: "≈56 pieces · 2 kg · serves 25–30", price: 90 }
    ] },
  { id: "kunafa-cake", category: "cakes", featured: true,
    name: "Pistachio kunafa chocolate cake", img: "cake-top.jpg",
    desc: "Chocolate sponge, a crisp pistachio kunafa layer, chocolate mousse and ganache, piped pistachio cream.",
    allergens: ["Tree nuts", "Wheat", "Dairy", "Eggs"],
    options: [
      { id: "slice", kind: "single", label: "1 slice", meta: "≈120 g", price: 7.5 },
      { id: "whole", kind: "group", label: "9-inch cake", meta: "≈1.4 kg · serves 12", price: 75 }
    ] },
  { id: "tres-leches", category: "cakes", featured: false,
    name: "Tres leches", img: "tres-leches-grid.jpg",
    desc: "Soft sponge soaked in three milks, whipped cream on top, caramel feathering.",
    allergens: ["Wheat", "Dairy", "Eggs"],
    options: [
      { id: "1", kind: "single", label: "1 square", meta: "≈150 g", price: 6 },
      { id: "half", kind: "group", label: "Half sheet", meta: "24 squares · 3.6 kg · serves 24", price: 110 }
    ] },
  { id: "kunafa", category: "cakes", featured: false,
    name: "Kunafa", img: "",
    desc: "Golden shredded kataifi over a creamy filling, soaked in syrup, topped with pistachio.",
    allergens: ["Wheat", "Dairy", "Tree nuts"],
    options: [
      { id: "1", kind: "single", label: "1 portion", meta: "≈150 g", price: 6 },
      { id: "tray", kind: "group", label: "Tray", meta: "≈1.2 kg · serves 8–12", price: 55 }
    ] },
  { id: "mango-cheesecake", category: "cheesecake", featured: false,
    name: "Mango cheesecake", img: "mango-cheesecake.jpg",
    desc: "Creamy no-bake cheesecake on a biscuit base, crowned with fresh mango.",
    allergens: ["Wheat", "Dairy"],
    options: [
      { id: "slice", kind: "single", label: "1 slice", meta: "≈130 g", price: 6.5 },
      { id: "whole", kind: "group", label: "9-inch cheesecake", meta: "≈1.5 kg · serves 12", price: 60 }
    ] },
  { id: "strawberry-cheesecake", category: "cheesecake", featured: false,
    name: "Strawberry cheesecake", img: "",
    desc: "Creamy cheesecake with a fresh strawberry topping.",
    allergens: ["Wheat", "Dairy", "Eggs"],
    options: [
      { id: "slice", kind: "single", label: "1 slice", meta: "≈130 g", price: 6.5 },
      { id: "whole", kind: "group", label: "9-inch cheesecake", meta: "≈1.5 kg · serves 12", price: 60 }
    ] },
  { id: "signature-platter", category: "platters", featured: true,
    name: "Signature platter", img: "platter-angle.jpg",
    desc: "Pistachio cream triangles around walnut squares, fingers and chocolate rolls, on a serving platter.",
    allergens: ["Tree nuts", "Wheat", "Dairy"],
    options: [
      { id: "box12", kind: "single", label: "Gift box of 12", meta: "≈450 g · serves 4–6", price: 26 },
      { id: "platter", kind: "group", label: "Platter", meta: "≈40 pieces · 1.6 kg · serves 15–20", price: 85 },
      { id: "large", kind: "group", label: "Large platter", meta: "≈70 pieces · 2.8 kg · serves 30–35", price: 145 }
    ] }
];
