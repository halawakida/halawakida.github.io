# Halawa Kida website

Live site for Halawa Kida, handmade desserts by Shireen Abourehab (Middlesex, NJ).

## Change the menu, prices, hours or Zelle number

Edit **one file**: `assets/js/config.js`, then commit. The site updates in about a minute.

- Prices, items, weights, servings: the `HK_MENU` list. Hide an item with `hidden: true`.
- Order email, Zelle number, the 24-hour rule (`leadHours`), pickup hours, delivery ZIPs: `HK_SETTINGS`.
- Photos live in `assets/img/`. Set an item's `img` to the file name.

On GitHub you can edit it in the browser: open the file, click the pencil, change, "Commit changes".

## How orders work

Checkout emails the order through Web3Forms (key `web3formsKey` in config.js; account: adamseoudy42.business@gmail.com).
If sending ever fails, the customer gets one-tap "Text my order" / "Email my order" buttons instead, so no order is lost.
Orders must be at least `leadHours` (24) hours ahead. Live site: https://halawakida.github.io

## Pages

- `/` home · `/menu/` menu (the QR code target) · `/order/` cart and checkout · `/catering/` quote form
- `/admin/` back office: recipe cost calculator (saved on the device) and QR code generator

## After editing config.js

Bump the `?v=` number on the `config.js` script tags in each page (or ask Claude) so visitors get the new version right away instead of a cached copy.
