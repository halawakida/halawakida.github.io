# Halawa Kida website

Live site for Halawa Kida, handmade desserts by Shireen Abourehab (Middlesex, NJ).

## Change the menu, prices, hours or Zelle number

Edit **one file**: `assets/js/config.js`, then commit. The site updates in about a minute.

- Prices, items, weights, servings: the `HK_MENU` list. Hide an item with `hidden: true`.
- Order email, Zelle number, the 24-hour rule (`leadHours`), pickup hours, delivery ZIPs: `HK_SETTINGS`.
- Photos live in `assets/img/`. Set an item's `img` to the file name.

On GitHub you can edit it in the browser: open the file, click the pencil, change, "Commit changes".

## How orders work

Checkout sends the order to `orderEmail` through FormSubmit (formsubmit.co). The customer gets an
automatic confirmation with Zelle instructions. Orders must be at least `leadHours` (24) hours ahead.

## Pages

- `/` home · `/menu/` menu (the QR code target) · `/order/` cart and checkout · `/catering/` quote form
- `/admin/` back office: recipe cost calculator (saved on the device) and QR code generator
