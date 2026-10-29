# Backend gaps — follow-up after the 2026-10-29 backend update

Companion to `docs/api-integration.md`. Rounds:

- **2026-10-29 (round 2)** — shop/payment API changes (`api-changes-28.pdf`,
  2026-10-29): `payment_status` order filter, reduced checkout payload,
  `/payment-result?pid=`, wallet transactions + charge. Frontend applied the
  same day.
- **2026-10-29 (round 1)** — shop/payment API changes (`api-changes.pdf`,
  2026-10-29), frontend applied the same day. Also wires the previously blocked
  `POST /shop/cart/checkout`.
- **2026-10-25** — orders/tickets/cart quantity round (frontend 2026-10-26),
  kept below for history; the cart-quantity contract there is superseded.

Base: `https://new.ahoma.ir/api` · OpenAPI: `/docs?api-docs.json`

Legend: **Resolved** · **Partial** · **Open**

## Blockers at a glance

### Payment & orders (2026-10-29 round 2)

| # | Blocker | What it blocks | Current frontend behaviour | Ask (backend) |
| --- | --- | --- | --- | --- |
| 1 | No `pid` → invoice resolver | Trustworthy `/payment-result?pid=…` | Reads the newest invoice (`per_page=1`) + refreshes the profile | `GET /shop/payment/{pid}` → target (`invoice`/wallet charge) + final state, **or** add `invoice_id`/`hash_id` to the bank return URL |
| 2 | No “pay an existing invoice” endpoint | Retry after `payment.success=false`; unpaid invoices | Order detail links to a mock pay page | `POST /shop/order/{invoice}/pay` returning the same `payment` shape as checkout |
| 3 | Wallet-charge callback contract unverified | Confirming a top-up; failure handling | Dialog shows `payment.message`; balance only via profile refresh on return | Document the return link for `POST /wallet/charge` and the failure payload (and whether `payment.data`/`token` applies) |
| 4 | Gateway POST field names unverified | Non-Mellat gateways | POST form when `payment.data` is an object with scalars, else GET `payment.url` | Per-gateway field reference (`RefId`, …) and which gateways are GET-only |
| 5 | No `meta`/`links`/`total` on list endpoints | Real server-side pagination/counts | Short-page rule; orders fetch eagerly (cap 10 × 100), wallet load-more | Optional `meta` block or `X-Total-Count` (flat `data` can stay) |
| 6 | `type` rejects `all` (`422`) | A unified all-orders view | Dashboard always sends `type=sales`; other types need separate calls | Allow `type=all`, or one combined list endpoint |

### Other open items

| # | Area | Blocker | Impact | Ask |
| --- | --- | --- | --- | --- |
| 7 | Cart | No line update for `services[]`/insurance | «افزودن خدمت/بیمه» dialogs are local-only and reset on the next cart response | Line-update endpoint, or confirm the intended flow |
| 8 | Orders | No cancel / invoice download / return-request endpoints | Those actions stay mock (delete-ticket style workarounds) | Publish the remaining order-lifecycle endpoints |
| 9 | Tickets | No delete-ticket; create body takes no file | Dashboard “delete” closes the ticket; create attachment is UI-only | DELETE endpoint + `file` on create |
| 10 | Profile | Avatar `DELETE` returns 405 | Remove-avatar action is informational | Implement DELETE |
| 11 | Blog | `filters[s]` ignored; category response has no title | Search filters the loaded page client-side; extra category request | Apply the filter; include the category title |
| 12 | Comments | Order-answer / comment status enum undocumented | `pending`/`rejected` special-cased, everything else treated as approved | Document the status values |
| 13 | Static | No CMS endpoints; no notifications; compare not persisted | Pages use designed content; bell has no feed | Endpoints (or confirm CMS is out of scope) |
| 14 | Auth | `token_expire` format/timezone; `success:false` with HTTP 200; production CORS | Client retries once on 401 and treats `success:false` as an error | Confirm expiry enforcement + allow-list the production origin |
| 15 | Assets | Mixed absolute vs relative media URLs | Client resolves relative paths against the API origin | Standardise the storage origin |

---

## 2026-10-29 round 2 (`api-changes-28.pdf`)

### Resolved in this round

| # | Backend change | Evidence | Frontend change |
| --- | --- | --- | --- |
| 1 | `GET /shop/order`: new `payment_status` filter (`all`/`waiting_payment`/`slice_payment`/`done`), fixed newest-first sort, stricter validation (`status`/`type`/`payment_status`/`per_page` 1…100/`page` ≥1; bad values → 422), **no `meta`/`links`**. `type=all` is invalid. | PDF round 2 §2 · OpenAPI | `useOrders.load({ status, type, paymentStatus, page, perPage, allPages })` validates client-side, omits `all`, loops pages until one is short (cap 10 × 100), and no longer re-sorts. Dashboard passes `type: 'sales'` and an optional `?payment=`; 422 → toast. `payment_status`, `gate`, `payment_method`, `payable_price`, `paid_price`, `shipping_title` mapped. |
| 2 | `POST /shop/cart/checkout` payload reduced to `{ payment_method_id, device?, cart_token? }`; 201 `{ invoice, payment }`. `invoice` omits `status`/`payment_status`/`paid_price`/`created_at`. `payment.success=false` means the invoice exists but the gateway refused. | PDF round 2 §3 · OpenAPI | Checkout sends the detected device (`detectDevice()`); `payment.success=false` clears the cart, shows the API message and routes to the created invoice instead of a fake receipt. |
| 3 | After settlement: `paid_price` rises, `payment_status` → `done`/`slice_payment`, `status` → `processing`, `gate` set and `payment_method` becomes `manual`. | PDF round 2 §3.3 | Order detail shows **وضعیت پرداخت** (from `payment_status`) and **درگاه پرداخت** (from `gate`, labelled via `gatewayLabel`); `payment_method` is never displayed. |
| 4 | `GET /shop/wallet/transactions` added: flat array, filters nested under `filters[...]` (`in_out`, `reason`, `payment_method`, `sort`, `per_page`, `page`), `reason_title` resolved server-side, `amount` always positive. Unknown filter value → 422 keyed `filters.*`. | PDF round 2 §4 · OpenAPI | New `useWallet()` + `app/pages/dashboard/wallet` (linked from the dashboard profile card): ledger rows coloured by `in_out`, `reason_title` labels, `filters[in_out]` chips, `loadMore()` while a full page returns. |
| 5 | `POST /shop/wallet/charge` added: `{ amount, payment_method_id, device }` → `payment` (same gateway shape); wallet-type methods (`myCredit`) are rejected; balance credited only after the callback (`charge_credit` row). | PDF round 2 §5 · OpenAPI | `AddFundsDialog` picks an online gateway, calls the real endpoint and redirects; the fake `charged` emit and local balance bump are gone. |
| 6 | Gateway return page is the front link `/payment-result?pid=<hashed payment id>`. | PDF round 2 §6 | New `app/pages/payment-result.vue`: reads `pid`, refreshes the profile (wallet balance) and renders success / partial / not-confirmed with a receipt and links to orders + wallet. |

### Notes

- **`payment_status` is not a tab axis in this design.** The Figma tabs group
  by order status (`all/current/delivered/cancelled/returned`), so the API's
  advice to "build paid/unpaid/instalment tabs on `payment_status`" is only
  partially applied: the filter is wired through `load({ paymentStatus })` and
  an optional `?payment=` query param, while the designed tabs keep grouping
  client-side.
- **Eager order list.** The dashboard has numbered client-side pagination, so
  it fetches pages until a short one (max 1000 orders) instead of driving a
  load-more UI. Wallet, which is a natural load-more list, does use the
  short-page rule with `loadMore()`.
- **`per_page` range** is enforced client-side (clamped to 1…100) because the
  backend answers 422 rather than clamping.
- **Sign of amounts** comes from `in_out`, never from the number: `amount` is
  positive for both directions.

### Still open after this round

1. **`pid` has no resolver.** `/payment-result?pid=…` receives the hashed
   payment id, but no endpoint maps it to an invoice/wallet transaction.
   **Ask:** `GET /shop/payment/{pid}` returning the target (`invoice` or
   `wallet charge`) and its final state, **or** include
   `invoice_id`/`hash_id` (and a wallet marker) in the bank's return URL.
   Until then the page uses a newest-invoice heuristic and a profile refresh,
   which can show the wrong invoice (or a stale success after a wallet top-up).
2. **No endpoint pays an existing invoice.** After `payment.success=false`, or
   for an invoice left `waiting_payment`, the frontend can only link to the
   order detail; `dashboard/orders/[id]/pay` stays a mock. **Ask:**
   `POST /shop/order/{invoice}/pay` returning the same `payment` shape as
   checkout.
3. **Wallet callback semantics are unverified.** It is unclear which front link
   a `POST /wallet/charge` redirect returns to, and whether the same
   `payment.data`/`token` hand-off applies (the PDF only says "gateway
   redirect"). Confirm the return URL shape, plus the failure payload when the
   charge is not completed (currently the dialog only shows `payment.message`).
4. **No list metadata (`meta`/`links`/`total`).** The short-page rule means one
   extra request per list and no total/`last_page` for numbered pagination.
   **Ask:** keep the flat array but add `X-Total-Count` or a `meta` block
   (optional, backward compatible).
5. **`type` cannot be "all"** (`type=all` → 422). Fine for the shop, but a
   unified dashboard view would need a combined list request.

---

## 2026-10-29 round 1 (`api-changes.pdf`)

### Resolved in this round

| # | Backend change | Evidence | Frontend change |
| --- | --- | --- | --- |
| 1 | Three public lookups: `GET /shop/public/shipping-methods`, `/delivery-periods`, `/payment-methods` (`ShippingResource`, `DeliveryPeriodResource`, `PaymentMethodResource`). | PDF §1 · OpenAPI | New `useShopOptions()` (`useAsyncData('shop-options')`) feeds shipping methods, delivery slots and the three payment cards. Designed arrays in `data/checkout.ts` are only an offline fallback. |
| 2 | `POST /shop/cart/set-shipping` — `{ shipping_id, receive_date (yyyy-mm-dd), delivery_period_id? }`; the period is required only for `type: delivery`. Auth only. | PDF §2.1 · OpenAPI | `useCart.setShipping()` + a watcher in `useCheckout` persists the selection as soon as it is complete. |
| 3 | `add-qty` / `sub-qty` are **delta** calls: body is `{ cart_item_id, cart_token }` only; the line is deleted at zero and min/max are enforced server-side. | PDF §2.2 · OpenAPI request schema | `increment()` / `decrement()` send `cart_item_id` only. Supersedes the 2026-10-25 `stock_id` note. |
| 4 | `CartResource` returns `address`, `payment_method(_fa)`, `shipping`, `delivery_period`, `receive_date` and a `totals` block. | PDF §3 · OpenAPI `CartResource` | `ApiCart` extended; `useCart` exposes `totals` / `selection`. Cart and checkout rows read `totals.products_total` / `services_total` / `payable_price`, falling back to local math. |
| 5 | `POST /auth/refresh` rotates the token — the old one is revoked immediately. | PDF §4 · OpenAPI `/auth/refresh` | Already correct: `useApi.refreshToken()` overwrites `auth_token` in place and shares one in-flight refresh between concurrent 401s. Comment added. |
| 6 | Media fields are absolute URLs (`https://host/storage/...`) or `null`. | PDF §5 | `resolveMediaUrl` already passes absolute URLs through and resolves legacy `storage/…` / `uploads/…` against the API origin. Gateway logos hide when `image` is `null`. |
| 7 | Gateways grew: **Tara** (`type: online`) and **Azki** (`type: installment`). | PDF §6 | Both appear automatically from the public list; icons fall back to local marks when the backend has no `image`. |
| 8 | `POST /shop/cart/checkout` `{ payment_method_id, device?, cart_token? }` → 201 `{ invoice, payment{ success, gate, url, token, message, data } }`. | OpenAPI (not in the PDF) | Replaces the mock `settlePayment()`: real invoice, then a gateway hand-off (POST form when `payment.data` is non-empty, else GET `payment.url`). `/checkout` is now behind the auth middleware. |

### Notes

- **Siblings, not nested:** the PDF snippet nests `delivery_period` inside
  `shipping`; the OpenAPI `CartResource` puts `shipping`, `delivery_period` and
  `receive_date` beside each other. `applySelection()` reads both shapes.
- **`payment_method_id` is the gateway:** the checkout body takes the
  `PaymentMethodResource.id` (not `key`/`bank`), so the picked gateway **is**
  persisted on the invoice. The cart's five-value `payment_method` enum is
  still sent through `set/payment-method` for older surfaces (wallet→`online`,
  installment→`mixed`).
- **Date chips** are derived from the server slots: the next real dates whose
  weekday appears in `/public/delivery-periods`. Postal/in-person methods still
  pick a `receive_date` but no period.

### Still open after this round

1. **Gateway callback has no result payload.** The bank callback is
   server-to-server; the browser lands back on the site with nothing telling the
   app whether the payment succeeded (and for which invoice). **Ask:** redirect
   back to `/checkout/success?invoice=<hash_id>&status=…` (or expose a verify
   endpoint) so the result page can confirm the payment instead of guessing.
2. **Gateway POST field names are unverified.** `payment.data` + `token` are
   returned, but no live gateway has been exercised yet; confirm which key each
   gateway expects (`RefId` for Mellat, …) and whether any gateway is GET-only.
3. **Guest cart merge at login** — `checkout` accepts the guest `cart_token`,
   which suggests the merge happens at invoice time; confirm what happens to a
   guest cart after `POST /auth/verify`.
4. ~~**Wallet charge** (`POST /shop/wallet/charge`, `GET /shop/wallet/transactions`)
   exists in the spec but is not wired; the dashboard «افزایش موجودی» dialog is
   still a mock.~~ **Wired in round 2** — see the section above.

---

## 2026-10-25 round — resolved in this round

| # | Backend change | Evidence | Frontend change |
| --- | --- | --- | --- |
| 1 | `GET /shop/order` no longer 500s. `status` is optional and accepts `all`; `type` is optional; `?page=` returns 15/page with paginator metadata in headers. No params returns every order, newest first. | backend note §1 | `useOrders.load()` now makes **one** request (`status=all&type=sales`); tabs group client-side. The 20 parallel status requests are gone. |
| 2 | `GET /shop/order/{invoice}` returns the full `UserOrderResponse`: receiver/address block, shipping/carrier, payment fields and items. | backend note §2 | `useOrderDetail()` maps the full payload; the `findOrder()` demo fallback is removed. |
| 3 | `GET /shop/products?filters[categories][]=…` accepts every id from `/shop/public/product-category`, children included. | backend note §3 · OpenAPI `filters[categories][]` | `BestOfCategorySection` requests one 3-product pool per category panel. |
| 4 | `POST /shop/cart/set/payment-method` (slash) is now an alias of `set-payment-method`. All five values valid: `online`, `pay_in_delivery`, `pay_in_person`, `mixed`, `manual`; guest + authenticated. | backend note §4 · OpenAPI path present | Checkout already calls the slash URL; it now persists (still maps wallet→`online`, installment→`mixed`). |
| 5 | `ticket_departments` seeded with four active rows (ids 1–4: پشتیبانی، مالی، فنی، فروش). `POST /shop/user/ticket` with `department_id` 1–4 succeeds. | backend note §5 | The existing department select/create flow works; no code change needed. **Production must run the seeder once at deploy.** |
| 6 | `POST /shop/cart/add-qty` / `sub-qty` require `stock_id` (`exists:shop_stock`); `quantity` is validated against the stock min/max and the resulting line quantity is enforced. | backend note §6 | `increment()` sends `stock_id` + `quantity: max(1, min_in_cart)`; `decrement()` sends `stock_id`. The + button now works on `min_in_cart > 1` lines. |
| 7 | Invalid coupon returns user-facing text instead of the raw `shop::messages.coupon_not_found` key. EN: “The discount code is not valid”; FA: «کد تخفیف معتبر نمیباشد». | backend note §7 | No code change — `apiErrorMessage` already surfaces the API message. |
| 8 | `CartItemResource` grew from 10 to 19 keys: `cart_id`, `product_id`, `product_slug`, `stock_id`, `related_cart_item_id`, `color`, `size`, `warranty` (resolved from stock relations). | backend note §8 · OpenAPI `CartItemResource` | Cart lines link with `product_slug`; `color`/`size`/`warranty` are mapped and rendered in the item meta rows. |
| 9 | `GET /shop/user/profile/me` grew from 13 to 22 keys: `mobile`, `nickname`, `username`, `credit` (float), `bank_card_number`, `bank_shaba_number`, `has_password` (bool), `avatar` (absolute URL or null), `currency` (`IRT`). | backend note §9 | Account page prefills bank card/sheba/avatar/has-password without the separate bank GET. Dashboard profile card now uses `mobile`/`nickname` and the real `credit` balance. Avatar DELETE remains hidden (still 405). |
| 10 | `TicketResource.status` and `.priority` are enum **objects** `{ value, label }` (`new`/`answer`/`waiting`/`closed`, `low`/`medium`/`top`). | backend note §10 · OpenAPI `TicketResource` | `useTickets` reads `.value` for comparisons and `.label` for display; the status chip accepts the API label. Flat strings are still tolerated. |
| 11 | Product detail `suggested[]` entries are full product objects with `img` (absolute), `title`, `slug` and `cheapest_stock` (`customer_price`, `quantity`, `min_in_cart`, `max_in_cart`, or null when out of stock). | backend note §11 | `suggested[]` maps into the «در کنارش خریداری شده» row with real image, price and an out-of-stock badge. The designed mocks are only a fallback. |
| 12 | `GET /shop/public/site-header`, `/blog-header`, `/footer` expand menu `link` server-side to an absolute URL. | backend note §12 | Header/footer already prefer menus that carry links; no change needed. The five footer group headers intentionally keep an empty link (dropdown parents) — children carry the links. |
| 13 | Blog payload documents `star` (decorative, 0–9, not a score), `total_rating` (cached SUM, may be stale/null) and new `rate` (derived 0–5 mean, null when unrated). | backend note §13 · OpenAPI `BlogResource` | Article rating reads `rate`; the 1–5 heuristic and `star` fallback are removed. |
| 14 | `GET /shop/products` items include `is_favorite` when the request carries an `Authorization` header. Guests get no key. | backend note §14 · OpenAPI header note | `fetchList()` now sends the bearer token (401 → retry without auth); list cards render a real favourite heart only when the key is present. |
| 15 | `GET /shop/blogs/{id}/comments` and `/shop/products/{id}/comments` return published comments for everyone **plus the authenticated viewer's own pending comments**. | backend note §15 | Blog comments map `status: pending`, show a «دیدگاه شما در انتظار تایید است» banner and a pending badge on those rows. |

### Notes on the resolved items

- **Orders pagination:** the list uses `?page=` at 15/page and puts paginator
  metadata in response headers. The dashboard still paginates the already-loaded
  set at 10/page client-side; switching to server pages is possible without a
  contract change.
- **Order detail shape:** the OpenAPI `UserOrderResponse` schema is still the
  older minimal shape. The mapper reads both the documented blocks
  (`receiver`, `shipping`, `payment`, `transactions`) and flat aliases
  (`receiver_name`, `shipping_method`, `paid_amount`, …) so either serialization
  renders.
- **`add-qty` / `sub-qty`:** the OpenAPI request schema still lists only
  `cart_item_id`/`quantity`; `stock_id` is required at runtime per the change
  note. The spec should catch up.
- **Ticket enum objects:** `status_fa`/`priority_fa` are gone from the object
  shape; the client keeps reading them only as a legacy fallback.
- **Categories:** panel requests are not cached across panels; each panel now
  costs one list request (three on the landing page) instead of one shared pool.

---

## Still open

### 1. Cart services / insurance cannot be changed after add-to-cart

`add-to-cart` accepts `services[]`, but there is still no endpoint to update or
remove services/insurance on an existing line. The cart's «افزودن خدمت» /
«افزودن بیمه» dialogs remain local-only and are lost on the next cart response.

**Ask:** provide a line-update endpoint, or confirm the intended flow.

### 2. Orders — cancel / invoice / returns still absent

`POST /shop/cart/checkout` now creates the invoice (see the 2026-10-29 round),
but there is still no order cancel, invoice download, or return-request
endpoint (create/list/detail/cancel) in the spec.

**Ask:** publish the remaining order-lifecycle endpoints.

### 3. Blog search is still ignored

`GET /shop/blogs?filters[s]=…` is accepted but returns the same 8 posts for
every query. `/blog/search.vue` therefore filters the loaded home payload
client-side.

**Ask:** apply `filters[s]` or add a dedicated search endpoint.

### 4. Blog category title still needs the extra request

`GET /shop/blogs/category/{category}` returns only `items` + `pagination`; the
page still calls `GET /shop/public/blog-category` to resolve the title. The
category tree is small, so this is cosmetic, but the title belongs in the
category response.

### 5. Tickets — delete / create attachment

- No delete-ticket endpoint (the dashboard action still closes the ticket).
- The create-ticket body does not accept a file (only reply does); the create
  dialog's attachment picker remains UI-only.

### 6. Avatar delete still returns 405

`profile/me` now exposes `avatar`, but there is still no DELETE endpoint, so the
account page keeps the remove action informational.

### 7. Comment status values are still undocumented

The UI treats `pending` and `rejected` specially and everything else as
approved. The order answers / product-comment status enum should be documented
so the moderation states are not inferred.

### 8. Static / CMS pages and notifications

No endpoints for about, terms, guarantee, installment, contact, branch or
collaboration. Notifications have no endpoint either. Compare remains
client-side only (no persistence endpoint).

### 9. Auth / transport

- Refresh-token behaviour is unchanged: `POST /auth/refresh` uses the current
  bearer token and returns `{ token }`; the client retries once on 401.
- `token_expire` is returned as `YYYY-MM-DD HH:mm:ss`. A token whose
  `token_expire` was already in the past still worked during the 2026-10-23
  check, so either expiry is not enforced or the timezone/format needs
  documenting.
- CORS still needs the production origin allow-listed.
- Confirm whether `success: false` can accompany HTTP 200; the client treats it
  as an error.

### 10. Assets

Still mixed: product galleries are absolute
(`https://new.ahoma.ir/storage/...`), while footer logos/store images are
relative (`uploads/...`). The client resolves relative paths against the API
origin; standardising the storage origin would remove the guesswork.

### 11. Guest cart merge

Guest carts work with a client-generated `cart_token` sent as `X-Cart-Token`,
but login-time guest→user cart merge still needs confirmation.

---

## Suggested priority for the backend

1. Gateway callback result payload + gateway POST field reference (blocks a
   trustworthy payment result page).
2. Cart line update for services/insurance.
3. Order cancel, invoice download, return-request endpoints.
4. Blog `filters[s]` search + category title in the collection response.
5. Ticket delete + create-ticket attachment.
6. Avatar DELETE.
7. Document comment status values and the five payment-method meanings
   (`online`, `pay_in_delivery`, `pay_in_person`, `mixed`, `manual`).
8. Static pages / notifications / compare persistence.

---

## Reproduce quickly

```bash
BASE=https://new.ahoma.ir/api
TOKEN='<customer bearer token>'

# orders — one call, every order (no more 20 parallel requests)
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/order?status=all&type=sales"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/order?status=all&type=sales&page=2"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/order/1"

# category filter (ids from /shop/public/product-category)
curl -g "$BASE/shop/products?filters[categories][]=8&filters[per_page]=1"

# cart line quantity (delta: one unit per call)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"cart_item_id":1}' "$BASE/shop/cart/add-qty"

# public checkout lookups
curl -s "$BASE/shop/public/shipping-methods"
curl -s "$BASE/shop/public/delivery-periods"
curl -s "$BASE/shop/public/payment-methods"

# shipping + checkout (payment_method_id from the list above)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"shipping_id":1,"receive_date":"2026-11-02","delivery_period_id":3}' \
  "$BASE/shop/cart/set-shipping"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"payment_method_id":3,"device":"web"}' "$BASE/shop/cart/checkout"

# payment method (slash alias)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"payment_method":"online"}' "$BASE/shop/cart/set/payment-method"

# cart item projection (19 keys)
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/cart"

# coupon error (user-facing text)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"coupon_code":"NOPE"}' "$BASE/shop/cart/set-discount"

# ticket departments + create
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/user/ticket/departments"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"subject":"تست","department_id":1,"priority":"medium","content":"متن پیام تست"}' \
  "$BASE/shop/user/ticket"

# profile read (22 keys)
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/user/profile/me"

# list is_favorite (authenticated only)
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/products?filters[per_page]=1"

# blog rate + own pending comments
curl -s "$BASE/shop/blogs/1"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/blogs/1/comments"
```
