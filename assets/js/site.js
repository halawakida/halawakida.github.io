/* Halawa Kida site logic. Content and prices live in config.js. */
(function () {
  "use strict";
  var S = window.HK_SETTINGS, MENU = window.HK_MENU, CATS = window.HK_CATEGORIES;
  var body = document.body, ROOT = body.getAttribute("data-root") || "./", PAGE = body.getAttribute("data-page") || "";
  var IMG = ROOT + "assets/img/";

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return "$" + (Math.round(n * 100) / 100).toFixed(n % 1 === 0 ? 0 : 2); }
  function $(sel, el) { return (el || document).querySelector(sel); }
  function visibleMenu() { return MENU.filter(function (m) { return !m.hidden; }); }

  /* ---------- logo ---------- */
  function scallop() {
    var d = "", n = 26, R = 136, r = 16, cx = 200, cy = 224;
    for (var i = 0; i < n; i++) {
      var t = i / n * Math.PI * 2, x = cx + R * Math.cos(t), y = cy + R * Math.sin(t);
      d += "M " + (x - r).toFixed(1) + " " + y.toFixed(1) + " a " + r + " " + r + " 0 1 0 " + 2 * r + " 0 a " + r + " " + r + " 0 1 0 " + -2 * r + " 0 ";
    }
    return d + "M " + (cx - R) + " " + cy + " a " + R + " " + R + " 0 1 0 " + 2 * R + " 0 a " + R + " " + R + " 0 1 0 " + -2 * R + " 0";
  }
  var arcId = 0;
  function logo(size) {
    arcId++;
    return '<span class="logo" style="width:' + size + "px;height:" + size + 'px" role="img" aria-label="Halawa Kida logo">' +
      '<svg viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="196" fill="#fff" stroke="#F2B3C2" stroke-width="4"/><path d="' + scallop() + '" fill="#F4BCCA"/><circle cx="200" cy="224" r="127" fill="#F7EDD6"/></svg>' +
      '<img src="' + IMG + 'logo-portrait.png" alt="">' +
      '<svg viewBox="0 0 400 400" aria-hidden="true" style="overflow:visible"><defs><path id="hkarc' + arcId + '" d="M 47 160 A 166 166 0 0 1 353 160"/></defs>' +
      '<text style="font-family:\'Kaushan Script\',cursive;font-size:54px;letter-spacing:1px" fill="#8E2B3E" stroke="#3A1520" stroke-width="1.6" paint-order="stroke"><textPath href="#hkarc' + arcId + '" startOffset="50%" text-anchor="middle">Halawa Kida</textPath></text>' +
      '<path d="M200 386 c-6 -6 -13 -10 -13 -17 a6.5 6.5 0 0 1 13 -2 a6.5 6.5 0 0 1 13 2 c0 7 -7 11 -13 17 z" fill="#F2B3C2"/></svg></span>';
  }

  /* ---------- cart ---------- */
  var CART_KEY = "hk_cart_v1";
  function loadCart() { try { var c = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); return Array.isArray(c) ? c : []; } catch (e) { return memCart || []; } }
  var memCart = null;
  function saveCart(c) { memCart = c; try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} updateCount(); }
  function find(itemId, optId) {
    var it = MENU.filter(function (m) { return m.id === itemId; })[0]; if (!it) return null;
    var op = it.options.filter(function (o) { return o.id === optId; })[0]; if (!op) return null;
    return { item: it, opt: op };
  }
  function cartLines() {
    return loadCart().map(function (l) { var f = find(l.item, l.opt); return f ? { item: f.item, opt: f.opt, qty: l.qty } : null; }).filter(Boolean);
  }
  function cartCount() { return loadCart().reduce(function (a, l) { return a + l.qty; }, 0); }
  function cartTotal() { return cartLines().reduce(function (a, l) { return a + l.opt.price * l.qty; }, 0); }
  function addToCart(itemId, optId) {
    var c = loadCart(), ex = c.filter(function (l) { return l.item === itemId && l.opt === optId; })[0];
    if (ex) ex.qty++; else c.push({ item: itemId, opt: optId, qty: 1 });
    saveCart(c);
  }
  function setQty(itemId, optId, q) {
    var c = loadCart().map(function (l) { if (l.item === itemId && l.opt === optId) l.qty = q; return l; }).filter(function (l) { return l.qty > 0; });
    saveCart(c);
  }
  function updateCount() {
    var n = cartCount();
    Array.prototype.forEach.call(document.querySelectorAll("[data-cart-count]"), function (el) { el.textContent = n; });
    var bar = $("#cartbar");
    if (bar) { bar.hidden = n === 0; var t = $("#cartbar-total"); if (t) t.textContent = n + (n === 1 ? " item · " : " items · ") + money(cartTotal()); }
  }
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 2200);
  }

  /* ---------- header / footer ---------- */
  function header() {
    var links = [["menu/", "Menu", "menu"], ["catering/", "Catering & events", "catering"], ["#story", "Our story", "story"]];
    var nav = links.map(function (l) {
      var href = l[0].charAt(0) === "#" ? ROOT + l[0] : ROOT + l[0];
      return '<a href="' + href + '"' + (PAGE === l[2] ? ' aria-current="page"' : "") + ">" + l[1] + "</a>";
    }).join("");
    return '<a class="skip" href="#main">Skip to content</a>' +
      '<div class="banner">Order at least ' + S.leadHours + " hours ahead · Pickup or free delivery within " + S.delivery.radiusMiles + " miles · Pay by Zelle</div>" +
      '<header class="site-header"><div class="wrap"><a class="brand" href="' + ROOT + '">' + logo(54) + '<span class="brand-name">Halawa Kida</span></a>' +
      '<nav class="nav" aria-label="Main">' + nav + '<a class="btn btn-pist" href="' + ROOT + 'order/">Your order <span class="cart-count" data-cart-count>0</span></a></nav></div></header>';
  }
  function footer() {
    return '<footer><div class="wrap"><div class="cols">' +
      '<div><span class="h" style="font-family:var(--script);font-size:28px;color:var(--rose)">Halawa Kida</span>Handmade desserts by ' + esc(S.owner) + "<br>" + esc(S.town) + "</div>" +
      '<div><span class="h">Order</span><a href="' + ROOT + 'menu/">Menu</a><br><a href="' + ROOT + 'catering/">Catering &amp; events</a><br>Pickup in ' + esc(S.town) + "<br>Delivery within " + S.delivery.radiusMiles + " miles</div>" +
      '<div><span class="h">Follow</span><a href="' + S.social.instagram + '" rel="noopener">Instagram @halawakida</a><br><a href="' + S.social.tiktok + '" rel="noopener">TikTok</a><br><a href="' + S.social.facebook + '" rel="noopener">Facebook</a></div>' +
      '<div><span class="h">Questions</span><a href="mailto:' + esc(S.orderEmail) + '">' + esc(S.orderEmail) + '</a><br><span class="small" style="color:#B8B0A2">Allergens: made in a home kitchen that uses tree nuts, peanuts, wheat, dairy and eggs.</span></div>' +
      '</div><div class="legal">© ' + new Date().getFullYear() + " Halawa Kida LLC</div></div></footer>";
  }

  /* ---------- menu rendering ---------- */
  function photo(it, cls) {
    return it.img ? '<img class="' + (cls || "") + '" src="' + IMG + esc(it.img) + '" alt="' + esc(it.name) + '" loading="lazy" decoding="async">'
      : '<div class="ph2 ' + (cls || "") + '" aria-hidden="true">' + esc(it.name) + "</div>";
  }
  function fromPrice(it) { return Math.min.apply(null, it.options.map(function (o) { return o.price; })); }
  function renderFeatured() {
    var box = $("#featured"); if (!box) return;
    box.innerHTML = visibleMenu().filter(function (m) { return m.featured; }).map(function (it) {
      return '<a class="card-link" href="' + ROOT + "menu/#" + it.id + '">' + (it.img ? '<img src="' + IMG + it.img + '" alt="' + esc(it.name) + '" loading="lazy">' : '<div class="ph"></div>') +
        '<span class="t"><span class="n">' + esc(it.name) + "</span><b>from " + money(fromPrice(it)) + '</b></span><span class="small">' + esc(it.desc) + "</span></a>";
    }).join("");
  }
  var mode = "single";
  function renderMenu() {
    var box = $("#menu-list"); if (!box) return;
    box.innerHTML = CATS.map(function (cat) {
      var items = visibleMenu().filter(function (m) { return m.category === cat.id; });
      if (!items.length) return "";
      return '<section class="cat" id="cat-' + cat.id + '" aria-labelledby="h-' + cat.id + '"><div class="cat-head"><h2 id="h-' + cat.id + '">' + esc(cat.name) + '</h2><span class="small">' + esc(cat.note) + '</span></div><div class="items">' +
        items.map(function (it) {
          var opts = it.options.filter(function (o) { return o.kind === mode; });
          if (!opts.length) opts = it.options;
          return '<article class="item" id="' + it.id + '">' + photo(it) + '<div class="item-body"><h3>' + esc(it.name) + '</h3><p class="small" style="margin:0">' + esc(it.desc) + '</p><div class="tags">' +
            it.allergens.map(function (a) { return '<span class="tag">' + esc(a) + "</span>"; }).join("") + '</div><div class="opts">' +
            opts.map(function (o) {
              var per = o.kind === "group" && /serves (\d+)(?:–(\d+))?/.test(o.meta) ? perPerson(o) : "";
              return '<div class="opt"><div><div class="l">' + esc(o.label) + '</div><div class="m">' + esc(o.meta) + '</div></div><div class="p">' + money(o.price) + (per ? '<div class="m">' + per + "</div>" : "") +
                '</div><button type="button" class="add" data-add="' + it.id + "|" + o.id + '" aria-label="Add ' + esc(it.name) + ", " + esc(o.label) + ' to your order">+</button></div>';
            }).join("") + "</div></div></article>";
        }).join("") + "</div></section>";
    }).join("");
  }
  function perPerson(o) {
    var m = o.meta.match(/serves (\d+)(?:–(\d+))?/); if (!m) return "";
    var lo = +m[1], hi = m[2] ? +m[2] : lo;
    return hi === lo ? money(o.price / lo) + " / person" : money(o.price / hi) + "–" + money(o.price / lo) + " / person";
  }
  function menuPage() {
    renderMenu();
    var t = $("#mode-toggle");
    if (t) t.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-mode]"); if (!b) return;
      mode = b.getAttribute("data-mode");
      Array.prototype.forEach.call(t.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      $("#mode-hint").textContent = mode === "single" ? "Single pieces and small boxes, with weights." : "Trays and cakes with servings, weight and price per person.";
      renderMenu();
    });
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-add]"); if (!b) return;
      var p = b.getAttribute("data-add").split("|"), f = find(p[0], p[1]);
      addToCart(p[0], p[1]); b.classList.add("added"); b.textContent = "✓";
      setTimeout(function () { b.classList.remove("added"); b.textContent = "+"; }, 1200);
      toast("Added: " + f.item.name + " · " + f.opt.label);
    });
  }

  /* ---------- dates: the lead-time rule ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function earliest() { return new Date(Date.now() + S.leadHours * 3600 * 1000); }
  function slotsFor(dateStr) {
    var p = dateStr.split("-"), out = [], o = S.hours.open.split(":"), c = S.hours.close.split(":");
    var d = new Date(+p[0], +p[1] - 1, +p[2], +o[0], +o[1]), end = new Date(+p[0], +p[1] - 1, +p[2], +c[0], +c[1]), min = earliest();
    for (; d <= end; d = new Date(d.getTime() + S.hours.stepMinutes * 60000)) if (d >= min) out.push(pad(d.getHours()) + ":" + pad(d.getMinutes()));
    return out;
  }
  function firstDate() { var d = earliest(); for (var i = 0; i < 4; i++) { var s = ymd(d); if (slotsFor(s).length) return s; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); } return ymd(d); }
  function label12(t) { var h = +t.split(":")[0], m = t.split(":")[1]; return (h % 12 || 12) + ":" + m + (h < 12 ? " AM" : " PM"); }
  function prettyDate(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); }
  function fillSlots(dateInput, timeSelect) {
    var v = dateInput.value, list = v ? slotsFor(v) : [];
    timeSelect.innerHTML = list.length ? list.map(function (t) { return '<option value="' + t + '">' + label12(t) + "</option>"; }).join("") : '<option value="">No times left that day</option>';
  }

  /* ---------- sending ---------- */
  function canSend() { return !!(S.web3formsKey && S.web3formsKey.trim()); }
  function send(payload) {
    if (!canSend()) return Promise.reject(new Error("not set up"));
    var body = { access_key: S.web3formsKey.trim(), subject: payload._subject, from_name: "Halawa Kida website", replyto: payload.email, botcheck: "" };
    Object.keys(payload).forEach(function (k) { if (k.charAt(0) !== "_") body[k] = payload[k]; });
    return fetch("https://api.web3forms.com/submit", {
      method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(body)
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) {
      if (!r.ok || !j.success) throw new Error(j.message || ("HTTP " + r.status));
      return j;
    }); });
  }
  /* ---------- "send it BOTH ways" steps (text AND email, never either/or) ---------- */
  var IS_PHONE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
  function digits(n) { return String(n || "").replace(/\D/g, ""); }
  function prettyPhone(n) { var d = digits(n); if (d.length === 11 && d.charAt(0) === "1") d = d.slice(1); return d.length === 10 ? "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6) : String(n || ""); }
  function smsHref(num, text) { var d = digits(num); if (d.length === 10) d = "1" + d; return "sms:+" + d + "?&body=" + encodeURIComponent(text); }
  function mailHref(to, subj, text) { return "mailto:" + to + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(text); }
  var memState = {};
  function loadState(k) { try { return JSON.parse(localStorage.getItem(k) || "null") || memState[k] || {}; } catch (e) { return memState[k] || {}; } }
  function saveState(k, s) { memState[k] = s; try { localStorage.setItem(k, JSON.stringify(s)); } catch (e) {} }
  function drawQR(box, text) {
    function go() { box.innerHTML = ""; try { new window.QRCode(box, { text: text, width: 220, height: 220, correctLevel: window.QRCode.CorrectLevel.L }); } catch (e) { box.textContent = "Couldn't draw the code. Please text the message below from your phone."; } }
    if (window.QRCode) return go();
    var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = go; s.onerror = function () { box.textContent = "Please text the message below from your phone."; }; document.head.appendChild(s);
  }
  // cfg: { key, el, title, intro, doneTitle, doneHtml, text, steps: [{ id, kind: "auto"|"sms"|"email", ok, label, to, button, href }] }
  function runSteps(cfg) {
    var st = loadState(cfg.key);
    cfg.steps.forEach(function (s) { if (s.kind === "auto") st[s.id] = true; });
    saveState(cfg.key, st);
    function draw() {
      var all = cfg.steps.every(function (s) { return st[s.id]; });
      var html = '<div class="panel" style="max-width:720px;margin:32px auto;display:flex;flex-direction:column;gap:16px">' +
        '<h1 style="font-size:32px">' + esc(all ? cfg.doneTitle : cfg.title) + "</h1>" + (all ? "" : '<p style="margin:0">' + cfg.intro + "</p>") + '<ol class="steps">';
      cfg.steps.forEach(function (s, i) {
        var ok = st[s.id];
        html += '<li class="step' + (ok ? " is-done" : "") + '"><div class="step-head"><span class="step-n" aria-hidden="true">' + (ok ? "✓" : i + 1) + "</span><span><b>" + esc(ok && s.doneLabel ? s.doneLabel : s.label) + "</b>" +
          (ok ? ' <span class="small">· done</span>' : "") + '<br><span class="small">' + esc(s.to) + "</span></span></div>";
        if (!ok) {
          html += '<div class="step-body">';
          if (s.kind === "sms" && !IS_PHONE) {
            html += '<p class="small" style="margin:0">On a computer? Point your phone camera at this code. It opens the text, already written. Just press send.</p><div class="qr" data-qr="' + esc(s.href) + '"></div>' +
              '<button type="button" class="btn btn-dark" data-done="' + s.id + '">I sent the text</button>';
          } else {
            html += '<a class="btn ' + (s.kind === "sms" ? "btn-pist" : "btn-dark") + '" href="' + esc(s.href) + '" data-go="' + s.id + '">' + esc(s.button) + "</a>" +
              '<button type="button" class="linkbtn" data-done="' + s.id + '">I already sent it</button>';
          }
          html += "</div>";
        }
        html += "</li>";
      });
      html += "</ol>" + (all ? cfg.doneHtml : "") +
        '<details><summary class="small" style="cursor:pointer">See the message</summary><pre style="white-space:pre-wrap;font:inherit;margin:8px 0 0">' + esc(cfg.text) + "</pre></details></div>";
      cfg.el.innerHTML = html;
      Array.prototype.forEach.call(cfg.el.querySelectorAll("[data-qr]"), function (b) { drawQR(b, b.getAttribute("data-qr")); });
    }
    cfg.el.onclick = function (e) {
      var g = e.target.closest("[data-go]"), d = e.target.closest("[data-done]"), r = e.target.closest("[data-reset]");
      if (r && cfg.onReset) return cfg.onReset();
      var id = (g && g.getAttribute("data-go")) || (d && d.getAttribute("data-done")); if (!id) return;
      setTimeout(function () { st[id] = true; saveState(cfg.key, st); draw(); }, g ? 900 : 0);
    };
    draw(); window.scrollTo(0, 0);
  }
  function orderNo() {
    var d = new Date(), a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", s = "";
    for (var i = 0; i < 4; i++) s += a.charAt(Math.floor(Math.random() * a.length));
    return "HK-" + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + s;
  }

  /* ---------- order page ---------- */
  function orderPage() {
    var root = $("#order-root"); if (!root) return;
    function draw() {
      var lines = cartLines();
      if (!lines.length) {
        root.innerHTML = '<div class="panel" style="text-align:center;padding:48px 24px;display:flex;flex-direction:column;gap:14px;align-items:center"><h1 style="font-size:36px">Your order is empty</h1><p class="small" style="margin:0">Pick a few favorites from the menu and they will show up here.</p><a class="btn btn-dark" href="' + ROOT + 'menu/">Browse the menu</a></div>';
        return;
      }
      var fd = firstDate();
      root.innerHTML =
        '<div class="order-grid"><form id="order-form" novalidate class="panel" style="display:flex;flex-direction:column;gap:22px">' +
        '<h1 style="font-size:36px">Checkout</h1>' +
        '<p class="notice" style="margin:0">All orders need at least <b>' + S.leadHours + ' hours</b> notice. Pay by <b>Zelle</b> after Shireen confirms your order.</p>' +
        '<div class="fields"><div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" autocomplete="name" required></div>' +
        '<div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" required placeholder="(732) 555-0123"></div>' +
        '<div class="field" style="grid-column:1/-1"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required><span class="hint">Your confirmation and Zelle details are sent here.</span></div></div>' +
        '<fieldset style="border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:8px"><legend class="legend" style="margin-bottom:8px">Pickup or delivery</legend><div class="radios">' +
        '<label><input type="radio" name="method" value="Pickup" checked> Pickup in ' + esc(S.town) + "</label>" +
        '<label><input type="radio" name="method" value="Delivery"> Delivery (within ' + S.delivery.radiusMiles + " miles)</label></div></fieldset>" +
        '<div id="addr-box" class="fields" hidden><div class="field" style="grid-column:1/-1"><label for="f-addr">Delivery address</label><input id="f-addr" name="address" autocomplete="street-address" placeholder="Street, town"></div>' +
        '<div class="field"><label for="f-zip">ZIP code</label><input id="f-zip" name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5"></div><div class="field"><span class="hint" id="zip-hint" style="padding-top:30px">' + esc(S.delivery.note) + "</span></div></div>" +
        '<div class="fields"><div class="field"><label for="f-date">Date</label><input id="f-date" name="date" type="date" min="' + fd + '" value="' + fd + '" required></div>' +
        '<div class="field"><label for="f-time">Time</label><select id="f-time" name="time" required></select></div></div>' +
        '<p class="hint" style="margin:-10px 0 0">Earliest available: ' + prettyDate(fd) + ". Times shown are " + label12(S.hours.open) + "–" + label12(S.hours.close) + ".</p>" +
        '<div class="field"><label for="f-notes">Notes (optional)</label><textarea id="f-notes" name="notes" placeholder="Allergies, a message for a gift, anything we should know"></textarea></div>' +
        '<input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<div id="form-error" class="error" role="alert"></div>' +
        '<button class="btn btn-dark" type="submit" id="place">Place order · ' + money(cartTotal()) + "</button>" +
        '<p class="hint" style="margin:0">Placing an order does not charge you. Next, you send your order to Shireen by email and text (one tap each). She confirms by text and email, then you pay by Zelle.</p></form>' +
        '<aside class="summary" aria-label="Order summary"><h2 style="font-size:26px;margin-bottom:8px">Your order</h2><div id="lines"></div><div class="total"><span>Total</span><span id="sum-total"></span></div>' +
        '<a href="' + ROOT + 'menu/" class="small" style="display:inline-block;margin-top:12px">+ Add more items</a></aside></div>';
      drawLines();
      var date = $("#f-date"), time = $("#f-time");
      fillSlots(date, time);
      date.addEventListener("change", function () { fillSlots(date, time); });
      Array.prototype.forEach.call(document.querySelectorAll('input[name="method"]'), function (r) {
        r.addEventListener("change", function () { $("#addr-box").hidden = $('input[name="method"]:checked').value !== "Delivery"; });
      });
      $("#f-zip").addEventListener("input", function () {
        var z = this.value.trim(), h = $("#zip-hint");
        if (z.length === 5) h.textContent = S.delivery.zips.indexOf(z) >= 0 ? "Great, you are in our delivery area." : "This ZIP may be outside our 10-mile area. Place the order and we will confirm delivery.";
        else h.textContent = S.delivery.note;
      });
      $("#order-form").addEventListener("submit", submit);
    }
    function drawLines() {
      var lines = cartLines(), box = $("#lines"); if (!box) return;
      box.innerHTML = lines.map(function (l) {
        return '<div class="line"><div><div style="font-weight:600">' + esc(l.item.name) + '</div><div class="small">' + esc(l.opt.label) + " · " + esc(l.opt.meta) + '</div>' +
          '<div class="qty"><button type="button" data-q="' + l.item.id + "|" + l.opt.id + "|" + (l.qty - 1) + '" aria-label="One fewer ' + esc(l.item.name) + '">−</button><span aria-live="polite">' + l.qty + '</span><button type="button" data-q="' + l.item.id + "|" + l.opt.id + "|" + (l.qty + 1) + '" aria-label="One more ' + esc(l.item.name) + '">+</button></div></div>' +
          '<b style="font-variant-numeric:tabular-nums">' + money(l.opt.price * l.qty) + "</b></div>";
      }).join("");
      $("#sum-total").textContent = money(cartTotal());
      var p = $("#place"); if (p) p.textContent = "Place order · " + money(cartTotal());
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-q]"); if (!b) return;
      var p = b.getAttribute("data-q").split("|"); setQty(p[0], p[1], +p[2]);
      if (!cartLines().length) draw(); else drawLines();
    });
    function submit(e) {
      e.preventDefault();
      var f = e.target, err = $("#form-error"), v = function (n) { return (f.elements[n] && f.elements[n].value || "").trim(); };
      var method = $('input[name="method"]:checked').value, problems = [];
      if (!v("name")) problems.push("your name");
      if (v("phone").replace(/\D/g, "").length < 10) problems.push("a phone number");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) problems.push("a valid email");
      if (method === "Delivery" && (!v("address") || v("zip").length !== 5)) problems.push("your delivery address and ZIP");
      if (!v("date") || !v("time")) problems.push("a date and time");
      if (problems.length) { err.textContent = "Please add " + problems.join(", ") + "."; return; }
      var p = v("date").split("-"), t = v("time").split(":"), when = new Date(+p[0], +p[1] - 1, +p[2], +t[0], +t[1]);
      if (when < earliest()) { err.textContent = "Orders need at least " + S.leadHours + " hours notice. Please pick a later time."; fillSlots($("#f-date"), $("#f-time")); return; }
      if (v("_honey")) return;
      err.textContent = "";
      var no = orderNo(), lines = cartLines(), total = cartTotal();
      var itemsText = lines.map(function (l) { return l.qty + " × " + l.item.name + " (" + l.opt.label + ") — " + money(l.opt.price * l.qty); }).join("\n");
      var whenText = prettyDate(v("date")) + " at " + label12(v("time"));
      var confirmUrl = new URL(ROOT + "confirm/", location.href).href + "#" + packOrder({
        n: no, c: v("name"), p: v("phone"), e: v("email"), m: method, w: whenText,
        a: method === "Delivery" ? v("address") + " " + v("zip") : "", i: itemsText, t: money(total), x: v("notes")
      });
      var manualText = "Hi Shireen! New Halawa Kida order " + no + "\n\nName: " + v("name") + "\nPhone: " + v("phone") + "\nEmail: " + v("email") +
        "\n" + method + ": " + whenText + (method === "Delivery" ? "\nAddress: " + v("address") + " " + v("zip") : "") +
        "\n\n" + itemsText + "\nTotal: " + money(total) + (v("notes") ? "\n\nNotes: " + v("notes") : "") + "\n\nI'll pay by Zelle once you confirm." +
        "\n\n(Shireen: confirm or decline here: " + confirmUrl + " )";
      var first = v("name").split(" ")[0];
      var doneHtml = '<div class="notice"><b>Order request sent. Not confirmed yet.</b> Shireen will confirm by text and email that she can make it. Please don\'t pay until then.</div>' +
        '<p style="margin:0">Order <b>' + no + "</b> · " + esc(method) + " · " + esc(whenText) + "</p>" +
        '<pre style="white-space:pre-wrap;font:inherit;background:var(--pist-tint);border-radius:12px;padding:14px;margin:0">' + esc(itemsText) + "\nTotal: " + money(total) + "</pre>" +
        '<div class="ok"><b>After Shireen confirms:</b> pay <b>' + money(total) + "</b> by Zelle to <b>" + esc(S.zelle.to) + "</b> (" + esc(S.zelle.name) + ") with <b>" + no + "</b> in the memo. Screenshot this page for your records.</div>" +
        '<a class="btn btn-pist" href="' + ROOT + '" style="align-self:flex-start">Back to home</a>';
      function finish(emailOk) {
        saveCart([]);
        var pending = { no: no, emailOk: emailOk, text: manualText, first: first, doneHtml: doneHtml, ts: Date.now() };
        try { localStorage.setItem("hk_pending_order", JSON.stringify(pending)); } catch (x) {}
        showOrderSteps(pending);
      }
      if (!canSend()) { finish(false); return; }
      var btn = $("#place"); btn.disabled = true; btn.textContent = "Sending your order…";
      send({
        _subject: "New order request " + no + " · " + v("name") + " · " + method + " " + whenText + " (tap to confirm)",
        "CONFIRM OR DECLINE THIS ORDER (tap the link)": confirmUrl,
        "Order number": no, Name: v("name"), Phone: v("phone"), email: v("email"),
        "Pickup or delivery": method, "Date & time": whenText,
        Address: method === "Delivery" ? v("address") + " " + v("zip") : "—",
        Items: itemsText, Total: money(total), Payment: "Zelle to " + S.zelle.to + " after you confirm", Notes: v("notes") || "—"
      }).then(function () { finish(true); }).catch(function () { finish(false); });
    }
    function showOrderSteps(p) {
      runSteps({
        key: "hk_steps_" + p.no, el: root,
        title: "Almost done: send your order to Shireen",
        intro: "Your order goes to Shireen by <b>email and by text</b>. Finish both steps below. Each message is already written, you just press send.",
        doneTitle: "Thank you, " + p.first + "!", doneHtml: p.doneHtml, text: p.text,
        steps: [
          p.emailOk ? { id: "email", kind: "auto", label: "Emailed to Shireen", to: "Sent automatically to " + S.orderEmail }
                    : { id: "email", kind: "email", label: "Email your order to Shireen", doneLabel: "Emailed to Shireen", to: S.orderEmail, button: "Email my order", href: mailHref(S.orderEmail, "Halawa Kida order " + p.no, p.text) },
          { id: "text", kind: "sms", label: "Text your order to Shireen", doneLabel: "Texted to Shireen", to: prettyPhone(S.textNumber), button: "Text my order to Shireen", href: smsHref(S.textNumber, p.text) }
        ]
      });
    }
    // Coming back from the Messages app: pick up where the customer left off.
    var pend = null; try { pend = JSON.parse(localStorage.getItem("hk_pending_order") || "null"); } catch (x) {}
    if (pend && !cartLines().length && Date.now() - pend.ts < 6 * 3600 * 1000) showOrderSteps(pend); else draw();
  }

  /* ---------- catering page ---------- */
  function cateringPage() {
    var f = $("#cater-form"); if (!f) return;
    var d = $("#c-date"); d.min = firstDate();
    var g = $("#c-guests"), pk = $("#c-pkg"), est = $("#c-est");
    function estimate() {
      var n = parseInt(g.value, 10), price = parseFloat(pk.value.split("|")[1]);
      est.textContent = n > 0 && price ? n + " guests × " + money(price) + " = " + money(n * price) + " (estimate)" : "Enter guests to see an estimate.";
    }
    g.addEventListener("input", estimate); pk.addEventListener("change", estimate); estimate();
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = $("#c-error"), v = function (n) { return (f.elements[n] && f.elements[n].value || "").trim(); };
      if (!v("name") || v("phone").replace(/\D/g, "").length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")) || !v("date") || !(parseInt(v("guests"), 10) > 0)) { err.textContent = "Please fill in your name, phone, email, event date and number of guests."; return; }
      if (v("date") < firstDate()) { err.textContent = "Events need at least " + S.leadHours + " hours notice."; return; }
      if (v("_honey")) return;
      err.textContent = "";
      var cText = "Hi Shireen! Catering request from the Halawa Kida website\n\nName: " + v("name") + "\nPhone: " + v("phone") + "\nEmail: " + v("email") +
        "\nEvent: " + v("type") + " on " + prettyDate(v("date")) + "\nGuests: " + v("guests") + "\nPackage: " + pk.value.split("|")[0] + "\n" + est.textContent +
        "\n" + v("method") + (v("notes") ? "\nNotes: " + v("notes") : "");
      function finishC(emailOk) {
        var box = document.createElement("div"); f.parentNode.replaceChild(box, f);
        runSteps({
          key: "hk_cater_" + Date.now(), el: box,
          title: "Almost done: send your request to Shireen",
          intro: "Your request goes to Shireen by <b>email and by text</b>. Finish both steps. Each message is already written.",
          doneTitle: "Request sent!", text: cText,
          doneHtml: '<div class="ok"><b>Thank you, ' + esc(v("name").split(" ")[0]) + '.</b> Shireen will reply by text and email with your quote.</div>',
          steps: [
            emailOk ? { id: "email", kind: "auto", label: "Emailed to Shireen", to: "Sent automatically to " + S.orderEmail }
                    : { id: "email", kind: "email", label: "Email your request to Shireen", doneLabel: "Emailed to Shireen", to: S.orderEmail, button: "Email my request", href: mailHref(S.orderEmail, "Catering request", cText) },
            { id: "text", kind: "sms", label: "Text your request to Shireen", doneLabel: "Texted to Shireen", to: prettyPhone(S.textNumber), button: "Text my request to Shireen", href: smsHref(S.textNumber, cText) }
          ]
        });
      }
      if (!canSend()) { finishC(false); return; }
      var btn = $("#c-send"); btn.disabled = true; btn.textContent = "Sending…";
      send({
        _subject: "Catering request · " + v("name") + " · " + prettyDate(v("date")) + " · " + v("guests") + " guests",
        _template: "table", _captcha: "false",
        _autoresponse: "Thank you for your catering request with Halawa Kida! Shireen will reply with a quote shortly.",
        Name: v("name"), Phone: v("phone"), email: v("email"), "Event type": v("type"), "Event date": prettyDate(v("date")),
        Guests: v("guests"), Package: pk.value.split("|")[0], Estimate: est.textContent, "Pickup or delivery": v("method"), Notes: v("notes") || "—"
      }).then(function () { finishC(true); }).catch(function () { finishC(false); });
    });
  }

  /* ---------- Shireen's confirm / decline page ---------- */
  function packOrder(o) {
    var s = btoa(unescape(encodeURIComponent(JSON.stringify(o))));
    return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function unpackOrder(h) {
    try {
      var s = h.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
      return JSON.parse(decodeURIComponent(escape(atob(s))));
    } catch (e) { return null; }
  }
  function confirmPage() {
    var root = $("#confirm-root"); if (!root) return;
    var o = unpackOrder(location.hash.slice(1));
    if (!o || !o.n) { root.innerHTML = '<div class="panel"><h1 style="font-size:30px">Order link not found</h1><p class="small">Open this page from the "Confirm or decline" link in a Halawa Kida order email.</p></div>'; return; }
    var first = String(o.c || "").split(" ")[0] || "there";
    var phone = String(o.p || "").replace(/\D/g, ""); if (phone.length === 10) phone = "1" + phone;
    var place = o.m === "Delivery" ? "Delivery to " + o.a + " on " + o.w : "Pickup on " + o.w;
    var yes = "Hi " + first + ", this is Shireen from Halawa Kida. Your order " + o.n + " is confirmed!\n\n" + o.i + "\nTotal: " + o.t + "\n" + place +
      "\n\nPlease send " + o.t + " by Zelle to " + S.zelle.to + " (" + S.zelle.name + ") and put " + o.n + " in the memo. Thank you so much!";
    var no = "Hi " + first + ", this is Shireen from Halawa Kida. Thank you for your order " + o.n + "! Unfortunately I can't make it for " + o.w +
      ". Would another day work for you? Just reply and I'll take care of you. Please don't send any payment for this order.";
    var ckey = "hk_conf_" + o.n, choice = loadState(ckey).choice;
    var summary = '<div class="panel" style="display:flex;flex-direction:column;gap:14px">' +
      '<div class="eyebrow" style="color:var(--pist-ink)">Order ' + esc(o.n) + "</div>" +
      '<h1 style="font-size:34px">' + esc(o.c) + "</h1>" +
      '<p style="margin:0"><b>' + esc(place) + "</b><br>" + esc(o.p) + " · " + esc(o.e) + "</p>" +
      '<pre style="white-space:pre-wrap;font:inherit;background:var(--pist-tint);border-radius:12px;padding:14px;margin:0">' + esc(o.i) + "\nTotal: " + esc(o.t) + "</pre>" +
      (o.x ? '<p class="notice" style="margin:0"><b>Customer notes:</b> ' + esc(o.x) + "</p>" : "") + "</div>";
    if (!choice) {
      root.innerHTML = summary + '<div class="panel" style="display:flex;flex-direction:column;gap:12px;margin-top:16px"><h2 style="font-size:24px;margin:0">Can you make it?</h2>' +
        '<p class="small" style="margin:0">Next you\'ll send the customer a text <b>and</b> an email. Both are already written for you.</p>' +
        '<div class="actions"><button type="button" class="btn btn-pist" data-choice="yes">Yes, I can make it</button><button type="button" class="btn btn-ghost" data-choice="no">I can\'t make it</button></div></div>';
      root.onclick = function (e) {
        var b = e.target.closest("[data-choice]"); if (!b) return;
        saveState(ckey, { choice: b.getAttribute("data-choice") }); confirmPage();
      };
      return;
    }
    var isYes = choice === "yes", msg = isYes ? yes : no;
    var subj = isYes ? "Your Halawa Kida order " + o.n + " is confirmed" : "About your Halawa Kida order " + o.n;
    var stepsBox = document.createElement("div");
    root.innerHTML = summary; root.appendChild(stepsBox);
    root.onclick = null;
    runSteps({
      key: ckey + "_" + choice, el: stepsBox,
      title: isYes ? "Confirm with " + first + ": text and email" : "Let " + first + " know: text and email",
      intro: "Send <b>both</b> so " + esc(first) + " is sure to see it. Each one opens already written. You can edit it before you press send.",
      doneTitle: isYes ? "Confirmed. " + first + " got a text and an email." : "Done. " + first + " got a text and an email.",
      doneHtml: '<div class="ok">' + (isYes ? "Watch for " + esc(o.t) + " by Zelle with " + esc(o.n) + " in the memo." : "No payment is due for this order.") + "</div>" +
        '<button type="button" class="linkbtn" data-reset="1">Change my answer</button>',
      text: msg,
      onReset: function () { saveState(ckey, {}); saveState(ckey + "_yes", {}); saveState(ckey + "_no", {}); confirmPage(); },
      steps: [
        { id: "text", kind: "sms", label: "Text " + first, doneLabel: "Texted " + first, to: prettyPhone(o.p), button: "Send the text to " + first, href: smsHref(o.p, msg) },
        { id: "email", kind: "email", label: "Email " + first, doneLabel: "Emailed " + first, to: o.e, button: "Send the email to " + first, href: mailHref(o.e, subj, msg) }
      ]
    });
  }

  /* ---------- boot ---------- */
  var h = $("#site-header"); if (h) h.outerHTML = header();
  var ft = $("#site-footer"); if (ft) ft.outerHTML = footer();
  Array.prototype.forEach.call(document.querySelectorAll("[data-logo]"), function (el) { el.outerHTML = logo(+el.getAttribute("data-logo")); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-set]"), function (el) {
    var k = el.getAttribute("data-set").split("."), val = S; k.forEach(function (x) { val = val && val[x]; }); if (val != null) el.textContent = val;
  });
  if (PAGE === "home") renderFeatured();
  if (PAGE === "menu") menuPage();
  if (PAGE === "order") orderPage();
  if (PAGE === "catering") cateringPage();
  if (PAGE === "confirm") { confirmPage(); window.addEventListener("hashchange", confirmPage); }
  updateCount();
  window.addEventListener("storage", updateCount);
})();
