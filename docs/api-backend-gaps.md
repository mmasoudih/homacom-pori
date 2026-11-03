# Backend gaps — follow-up after the 2026-11-02 backend update

Companion to `docs/api-integration.md` and
[`api-endpoint-matrix.md`](./api-endpoint-matrix.md) (all 73 endpoint/method
pairs the frontend calls, with live status + shape). **Open items only:**
[`api-backend-gaps-open.md`](./api-backend-gaps-open.md). Rounds:

- **2026-11-02** — orders/wallet/profile round (`api-changes-2.pdf`,
  2026-11-02): `POST /order/{invoice}/cancel`, `POST /order/{invoice}/refer`,
  `GET /order/refers`, `POST /order/{invoice}/repay`, `GET /user/dashboard`,
  `POST /products/{slug}/notify`, `data.items` + `data.pagination` list
  envelopes, order `items[]`, `type=all` + status tab aliases, avatar `DELETE`,
  ticket-create `file`, `product_slug` fix. Frontend applied the same day;
  verification was **unauthenticated + spec-only** (no test credentials), so
  authenticated behaviours are taken from the PDF/OpenAPI.
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
(the Scribe JSON is served from the site root — `/api/docs?api-docs.json` is 404)

Legend: **Resolved** · **Partial** · **Open**

## 2026-11-02 round (`api-changes-2.pdf`)

Frontend applied the full round on 2026-11-02. Verification was **spec + unauthenticated
live checks only** — there were no test credentials for this round, so every authenticated
answer below comes from the PDF/OpenAPI, not from a logged-in sweep.

### Frontend applied

| # | Contract | Frontend change |
| --- | --- | --- |
| 1 | `POST /shop/order/{invoice}/cancel` `{description?}`; only `completing`/`waiting`/`waiting_payment`/`paid` may cancel | `useOrderActions().cancel()`; desktop dialog + mobile sheet emit the reason and leave the API call/toast/closing to the detail page; `invoice_cancel_invalid_status` is shown verbatim |
| 2 | `POST /shop/order/{invoice}/refer` `{items:[{item_id,count,description?}]}` → 201; guards `invoice_refer_must_be_paid`, `invoice_refer_already_requested`, `invoice_refer_window_expired` (24 h), `invoice_refer_items_not_found` | Return-request page posts real `item_id` + `count` (capped to the ordered quantity); the reason is folded into `description`; no image upload because the API accepts none |
| 3 | `GET /shop/order/refers` (`step` incl. `all`, `per_page` 1–100, default 15, `page`) | Returned tab and return detail use `useRefers()` / `useReferDetail()`; rows only carry `sub_invoice_id`, so product info is resolved from `GET /shop/order/{invoice_id}` and matched to `items[].id` |
| 4 | `POST /shop/order/{invoice}/repay` `{payment_method_id, device?}` → `CheckoutResource` | `dashboard/orders/[id]/pay` rewritten with real `useShopOptions().paymentOptions`, the invoice totals and `redirectToGateway()` |
| 5 | `GET /shop/user/dashboard` (`cancelled_invoices`, `in_progress_invoices`, `other_invoices`, `tickets_awaiting_reply`) | `useDashboard()`; cards map `current`/`cancelled`/`returned`; the mock `delivered` card was dropped |
| 6 | `POST /shop/products/{slug}/notify` `{channel: sms / email / both, stock_id?}`; contacts always from the profile | Notify dialog reads `/shop/user/profile/me` on open, posts the picked channel, redirects guests to login (`?redirect=`), repeats are idempotent and the API `message` is the toast |
| 7 | Paginated lists return `data.items` + `data.pagination` | `listPayload()` in `useApi` is shared by orders, refers, wallet, tickets and products; `has_more_pages` drives load-more |
| 8 | Order rows/detail carry `items[]` (`UserOrderItemResource`) | Order detail renders real line items; the return flow selects from them |
| 9 | `type=all` and status aliases `current`/`delivered`/`cancelled` | Orders page sends `type: all`; aliases replace the hand-built status groups |
| 10 | `DELETE /shop/user/profile/avatar` (idempotent, 200) | `useUserProfile().removeAvatar()` wired to the account page remove action |
| 11 | Ticket create accepts multipart `file` (max 5 MB) | Both create dialogs hold a real `File`; `useTickets.create()` switches to `FormData` when one is attached |
| 12 | Cart `product_slug` is serialised again | Cart lines link to `/product/<slug>` (id fallback kept) |
| 13 | `set-shipping` rejects a `receive_date` whose weekday ≠ `delivery_period.day` (`cart_receive_date_wrong_weekday`) | Date chips are already derived from slot weekdays; the new 422 is surfaced verbatim |
| 14 | Ticket `medium` label corrected to «اولویت متوسط» | Labels prefer the API `priority.label`; the static fallback already read کم/متوسط/زیاد |
| 15 | `legal-information` now requires `company_name` + `company_register_id` | The dialog already blocks submit without them; the API 422 is displayed |

### Verified live (unauthenticated, 2026-11-02)

| Check | Result |
| --- | --- |
| `GET /shop/order/refers` | **401** (route exists; previously absent from the app) |
| `GET /shop/user/dashboard` | **401** (exists) |
| `POST /shop/order/{invoice}/cancel` / `refer` / `repay` | **401** each (exist) |
| `POST /shop/products/{slug}/notify` | **401** (exists) |
| `DELETE /shop/user/profile/avatar` | **401**, no longer **405** → the endpoint now exists |
| Public product lists | `data.items` + `data.pagination` (envelope live) |

Ownership rule from the PDF: another user's invoice/refer/ticket returns **404**, not 403.
The client already treats 404 as “missing or not yours”.

### Spec ↔ PDF drift (OpenAPI still stale, 2026-11-02)

| # | PDF / live runtime | OpenAPI (`docs?api-docs.json`) |
| --- | --- | --- |
| 1 | `GET /shop/order` returns `data.items` + `data.pagination` | documents bare `data: []` |
| 2 | `GET /shop/wallet/transactions` returns `data.items` + `data.pagination` | documents bare `data: []` |
| 3 | `GET /shop/order/refers` returns `data.items` + `data.pagination` | documents bare `data: []` plus a **root** `pagination` |
| 4 | `legal-information` requires `company_name` and `company_register_id` | request schema has **no `required` array** (all fields nullable) |
| 5 | Ticket list may paginate | documents bare `data: []` (client tolerates both) |

Everything else in the 2026-11-02 PDF is present in the spec: `cancel`/`refer`/`repay`,
`refers`, `dashboard`, `notify`, `UserOrderResponse.items`, the order `type=all`/status
aliases and the ticket-create `file` field.

### Resolved by this round

- Order cancel, return request, refers list/detail and repay are no longer missing —
  the mock pay page and the mock returns tab are gone.
- `items[]` is back on orders (was the top dashboard blocker on 2026-10-31).
- `type=all` + tab aliases remove the “one call per tab” workaround.
- List envelopes now match the product-list convention (`items` + `pagination`).
- Avatar delete exists (was 405), ticket create accepts a file, `product_slug` is
  serialised and the ticket `medium` label is fixed.
- `set-shipping` validates the weekday/period pair.

---

## Live verification — 2026-10-31 (real frontend flow)

Both 2026-10-29 rounds were exercised against production with the app's own
calls, in app order:

`POST /auth/login` → `POST /auth/verify` → `GET /shop/cart` → `add-to-cart` →
`add-qty` / `sub-qty` → `set-user-address` → `set-shipping` →
`POST /cart/checkout` (wallet, Mellat, Saman) → `GET /shop/order` /
`/shop/order/{id}` → `GET /shop/wallet/transactions` → `POST /shop/wallet/charge`
→ `POST /auth/refresh`. OpenAPI compared against
`https://new.ahoma.ir/docs?api-docs.json` (394 KB, paths under `/api`).

**Verdict:** the round-1/round-2 contracts are live and behave as the PDFs
describe, with **3 regressions** (`set/payment-method` 404, order payload lost
`items`, `product_slug` null) and several contract drifts listed below.
Invoices **31–33** were created while probing the payment failure paths; all
are `waiting_payment` / `paid_price: 0` (no money moved, no wallet credit).

### Verified against the live API

| Contract | Evidence (2026-10-31) | Verdict |
| --- | --- | --- |
| Public lookups (round 1 §1) | `GET /shop/public/shipping-methods` → 6 rows, `type` = `postal`×4 / `present` / `delivery`, `cost_price` as strings, `up_to_free:"0"`, absolute `img`. `/delivery-periods` → 7 weekdays, `{id, day, start_time, end_time}`. `/payment-methods` → 6 rows: `myCredit`(wallet), `azki`+`tara`(installment), `mellat`/`melli`/`saman`(online), every `image: null`. | **Resolved** |
| `set-shipping` (round 1 §2) | postal `{shipping_id:2, receive_date:"2026-11-03"}` → 200, `delivery_period:null`; courier `{shipping_id:5}` without period → **422** `delivery_period_id` required; `{shipping_id:5, delivery_period_id:1, receive_date:"2026-11-07"}` → 200 with the period echoed; guest → **401**. | **Resolved** |
| `add-qty`/`sub-qty` delta (round 1 §2.2) | `{cart_item_id:1}` on qty 1 → qty **2**; `{cart_item_id:1, stock_id:7, quantity:5}` → qty **+1 only** (3→4), `quantity`/`stock_id` ignored; old body `{stock_id:7}` → **422** `cart_item_id` required. At `max_in_cart:4` → 422 `success:false` «حداکثر تعداد قابل سفارش از این محصول 4 عدد میباشد»; at `min_in_cart:2` → 422 «حداقل … 2 عدد». Spec only requires `cart_item_id`. | **Resolved** |
| `CartResource` selection + totals (round 1 §3) | `GET /shop/cart` → `address`, `shipping`, `delivery_period`, `receive_date`, `payment_method(_fa)`, `status`, and `totals` `{products_total:273375, services_total:948307, sub_total:1221682, payable_price:1221682, rows_count:2, quantity:7}` — the row sums match exactly. | **Resolved** |
| `POST /cart/checkout` (round 1 §8, round 2 §3) | Missing `payment_method_id` → 422 «روش پرداخت را انتخاب کنید»; `999` → 422 invalid; `device:"toaster"` → 422 (`enum` web/mobile/desktop/tablet/pwa confirmed); empty cart → 422 «سبد خرید شما خالی میباشد»; no address → 422 «آدرس انتخاب شده یافت نشد». Success: **201** `{invoice:{id:32, hash_id:14199, payment_method:"online", total_customer_price:66948, total_shipping_price:150000, payable_price:216948, rows_count:1, quantity:4}, payment:{…}}` — no `status`/`payment_status`/`paid_price`/`created_at`, as documented. Shipping **is** included in `payable_price` (66 948 + 150 000). | **Resolved** |
| Invoice survives a refused gateway (round 2 §3) | Mellat checkout → **201** with `invoice.id 32` and `payment.{success:false, gate:"mellat", url:null, token:null, data:[]}` + message «خطا در اتصال به وب سرویس شاپرک : Unmarshalling Error»; `GET /shop/order/32` → `status:"waiting"`, `payment_status:"waiting_payment"`, `paid_price:0`. | **Resolved** |
| Orders filters (round 2 §2) | `status=all&type=sales` → flat array, newest first `[33,32,31]`; `payment_status=waiting_payment` → 3, `done`/`slice_payment` → 0, `all` → 3; `per_page=100` ok, `101` → 422; `type=all` → 422; `status=bogus` → 422; `page=2` → `[]`. No `meta`/`links`/`X-Total-Count` (only `vary`, `x-request-id`). `payment_status`, `gate` (null pre-payment), `payment_method:"online"`, `payable_price`, `paid_price`, `shipping_title` all present. | **Resolved** |
| Wallet transactions (round 2 §4) | `GET /shop/wallet/transactions` → `[]` (flat); `filters[in_out]` accepts `all/in/out/in_out` ( `credit` → **422** `filters.in_out`), `filters[payment_method]` enum enforced, `filters[reason]=charge_credit` ok / `bogus_reason` → 422 `filters.reason`, `filters[sort]` only `newest` (`oldest` → 422), `filters[per_page]=101` → 422. Errors are keyed `filters.*`. | **Resolved** (list) |
| Wallet charge (round 2 §5) | Missing amount → 422; `amount:0` → 422; `payment_method_id:1` (wallet) → 422 «روش پرداخت انتخابشده معتبر یا فعال نیست»; `azki`/`tara` → 422; `device` optional. `mellat` → 200 with `payment.success:false` (Shaparak error); `melli` → `payment.success:false` «عملیات ناموفق بود»; `saman` → see below. Ledger stays `[]` after every attempt (credit only after the callback). | **Partial** |
| Refresh rotation (round 1 §5) | `POST /auth/refresh` → `{token:"3…"}`; the old token then returns **401**, the new one 200. Response has no `token_expire`. | **Resolved** |
| Media (round 1 §6, §5) | Absolute: product `img`, cart item `image`, shipping-method `img`. `null`: every payment-method `image` (frontend falls back / hides). Still relative: footer `logo`, `logo_dark`, `favicon` = `uploads/setting/…`. | **Partial** |
| Auth transport (2026-10-25 §9) | Preflight from `Origin: https://homacom.ir` → **204** with `access-control-allow-origin: https://homacom.ir`, `allow-credentials: true`. `token_expire` at issue = `2026-10-31 11:59:39` while the login was `11:59:37` **Tehran**; requests at `12:04` Tehran still returned 200 → the value is the issue time (no offset), not an enforceable expiry. | **Partial** |
| Coupon error text | `set-discount {coupon_code:"NOPE"}` → 422 «کد تخفیف معتبر نمیباشد» (user-facing, not a translation key). | **Resolved** |
| Avatar DELETE | `DELETE /shop/user/profile/avatar` → **405** HTML `Method Not Allowed`. | **Open** |

### Regressions found in this verification

1. **`POST /shop/cart/set/payment-method` (slash alias) is gone → 404.**
   The 2026-10-25 round added it as an alias; today the dash form
   (`/shop/cart/set-payment-method`) answers 200 «روش پرداخت انتخاب شد» while
   the slash form answers **404** `{"success":false,"message":"موردی یافت نشد"}`
   — even with a valid `cart_token`. The OpenAPI spec documents **only** the
   slash path and omits the working dash route, and
   `app/composables/useCart.ts` still posts the slash path inside a watcher that
   swallows errors, so the cart's `payment_method` silently stops being
   persisted. **Fix: restore the alias (spec already lists it), or document the
   dash path and we switch the client.**
2. **Order payload no longer contains `items`.**
   `GET /shop/order/31|32|33` and every row of `GET /shop/order` return the full
   81-key order object (address, shipping, totals …) but **no `items` key**
   (`has("items") === false`; `?with=items` changes nothing). `useOrders` maps
   `(order.items ?? [])`, so the dashboard order detail renders an empty product
   list. The 2026-10-25 round claimed `UserOrderResponse` carries the items —
   that is no longer true. **Fix: include the line items (or document the
   endpoint that returns them).**
3. **`product_slug` is `null` in cart items.**
   `CartItemResource` documents `product_slug`, but every line returned
   `"product_slug": null` (products 1 and 4 both have a `slug` on
   `/shop/products/{slug}`). `useCart` builds the cart line link as
   `/product/${product_slug}` → falls back to `#`, so cart rows are not
   clickable. **Fix: serialise the relation.**

### New contract gaps found in this verification

1. **No gateway can actually start a card payment.**
   - `mellat` → `payment.success:false`, «خطا در اتصال به وب سرویس شاپرک :
     Unmarshalling Error: For input string: ""» (`data: []`).
   - `melli` → `payment.success:false`, «عملیات ناموفق بود» (`data: []`).
   - `saman` → **`payment.success:true` but `url:null`, `token:"-111"`,
     `data:{RedirectURL:"https://new.ahoma.ir/payment/verify/saman"}`.**
     `GET` on that URL is **404** (it is a server-to-server route), and `-111`
     is a failed-init token. Because `success` is true the checkout page does
     not show the error branch; it follows the nested URL and dead-ends.
     **`payment.success` is therefore not trustworthy** — see the ask below.
   - `myCredit` (wallet) → `success:true, url:"https://new.ahoma.ir/payment-from-credit?order_id=3"`,
     `data:{callback_url:"https://new.ahoma.ir/payment/verify/myCredit"}`.
     That URL answers **302 → `/admin/login`** for `order_id` 3, 31 and 14146,
     i.e. it is an admin-panel route, not a customer page. The invoice stays
     `waiting_payment`, so the "wallet settles server-side" fast path in
     `checkout/index.vue` never applies.
   **Ask:** make `payment.success` mean “the gateway session was created” (and
   supply a redirectable `url`), return the gateway terminal/config errors as
   `success:false`, and point `myCredit` at a customer route that accepts the
   invoice id.
2. **`hash_id` is a small integer, not a hash, and nothing resolves it.**
   Checkout returned `hash_id` 14146 / 14199 / 14252. `GET /shop/payment/{id}`
   with 14146, 14199, 32 or 3 → **404** `{"success":false,"message":"موردی یافت نشد"}`
   (same for `/shop/order/payment/…`, `/shop/payments/…`, `/payment/…`).
   `POST /wallet/charge` returns **no id at all** (`{success,gate,url,token,message,data}`),
   so a top-up cannot be resolved either. `/payment-result?pid=…` can only keep
   guessing the newest invoice.
3. **The order list object is heavy and incomplete at the same time.** Each row
   is the full 81-key order (address, coupon, courier, invoice dates, audit
   users …) yet carries no line items; with no `meta`/`total` the client must
   loop pages and cannot show a count. Ask: a list projection + `X-Total-Count`.
4. **`set-shipping` does not validate the weekday.** Sending
   `receive_date:"2026-11-08"` (Sunday) with `delivery_period_id:1`
   (`day:"Saturday"`) → **200** and the mismatch is stored. Invalid ids are
   rejected (999 → 422), so only the day/date cross-check is missing. The
   frontend derives dates from the slots, but a stale cart can still end up
   with an impossible pair.
5. **`POST /shop/cart/set-user-address` requires `cart_token` at runtime but
   not in the spec.** Authenticated call without it → **422**
   `{"errors":{"cart_token":["فیلد cart token الزامی است."]}}`; the OpenAPI
   request body lists only `user_address_id`. The client always sends the token,
   so this is documentation drift — but it contradicts `set-shipping`/`checkout`,
   which accept the same request without it.
6. **`cart_token` errors are misleading.** `add-qty`/`sub-qty` are documented as
   `{cart_item_id}` only, but when the request carries a `cart_token` that does
   not resolve to the user's cart the API answers **422**
   `{"errors":{"cart_item_id":["قلم سفارش در سبد خرید یافت نشد"]}}` — the same
   message as a genuinely missing line. Also, after checkout the fresh cart is
   returned with `cart_token: null` (`cart.id` 1→2→3→4 per invoice), so any
   client that keeps its old token can look “not found”.
7. **Online payment ceiling is available but unused.** `GET /shop/public/footer`
   exposes `max_online_payment_amount: "195000000"` (and the bank-limit
   description); `app/data/checkout.ts` hardcodes `395_000_000` from the Figma
   note, so the «limit exceeded» guard lets orders through that the gateway will
   refuse. Frontend follow-up: read the footer value (needs a cached global
   `/public/footer` fetch or a dedicated `settings` endpoint).
8. **`locates` is served but not consumed.** Shipping rows carry
   `locates:"760"` / `"760,1382"` (present/courier are city-scoped), but
   `useShopOptions` drops the field, so every customer sees «حضوری»/«پیک».
   Either the frontend filters by the selected city or the backend should
   filter by the cart address.
9. **Wallet ledger row shape is still unverified.** The list is correct but the
   account had zero rows, so `in_out`, `amount` sign, `reason_title` and
   `relate_id` could not be observed. A `wallet/transactions` fixture (or a
   completed `charge_credit`) would close the last unknown of round 2 §4.
10. **Gateway return link still untested.** No payment completed, so
    `/payment-result?pid=…` never received a real `pid`; the page's
    “newest invoice” heuristic remains the only path (and it is wrong for a
    wallet top-up, which has no invoice).

### Frontend follow-ups exposed by the run

- `useCart.setPaymentMethod()` posts `/shop/cart/set/payment-method` → **404**;
  switch to `/shop/cart/set-payment-method` (or wait for the alias).
- `onlineTransactionLimit` is hardcoded to `395_000_000`; the API says
  `max_online_payment_amount: "195000000"` in `/shop/public/footer`.
- `useCheckout` treats `payment.success !== false` as “gateway ready”; Saman
  proves `success:true` can still mean “no redirect”. Gate the success path on
  `payment.url || nested redirect`, not on `success`.
- Cart rows link with `product_slug`, which is `null`; fall back to
  `product_id`/`/product/{id}` until the backend serialises it.
- `locates` (city ids) from shipping methods is dropped, so «حضوری»/«پیک» show
  for every city.

### Full endpoint sweep (2026-10-31)

A second pass exercised **every** backend endpoint the app calls — 73
method/path pairs across auth, catalog, blog, address, profile, tickets,
comments/favorites, cart, orders and wallet. The complete table (status, shape,
verdict) is in [`api-endpoint-matrix.md`](./api-endpoint-matrix.md); no endpoint
returned an unexpected 5xx. Beyond the regressions above, the sweep surfaced:

1. **Category filtering is misaligned with the catalog.** Products reference
   category ids `2`, `5`, `8`, `12`; the filter rejects `2`/`5`/`8` with
   **422** «فیلتر انتخاب شده معتبر نیست» while every id from
   `/shop/public/product-category` (`103`, `104`, `137`, `138`, …) returns
   **0 products**. Only `12` returned rows (`total:11`). The landing
   `<BestOfCategorySection>` asks for one pool per public category, so most
   panels are empty. **Ask:** allow any category attached to a product, and
   decide whether parent ids include descendants (or seed products onto the
   public tree).
2. **Search has an undocumented minimum.** `filters[s]` needs ≥2 characters
   (1 char → 422). `useProductSearch` sends the raw term and swallows the error,
   so a one-letter search silently shows nothing. **Ask:** accept 1 character,
   or document the limit so the UI can enforce it.
3. **`/shop/public/site-header` and `/shop/public/blog-header` differ only in one
   menu title** («منوی اصلی سایت» vs «منوی وبلاگ») — the logo, `blog_title`,
   menus and the 8 product categories are the same. Confirm whether the blog
   header is meant to reuse the shop navigation.
4. **`PUT profile/legal-information` has no required-field validation** —
   `{"company_name":""}` returned **200**; `PUT base-information` correctly
   rejects empty `fname`/`lname`. Yet this account stores both names as `""`,
   so the API can return a profile its own update endpoint would refuse.
   **Ask:** align the two validators (and allow clearing or make the fields
   optional).
5. **Address `nickname` requires ≥3 characters** (2-char → 422), but the dialog
   only checks non-empty; the user sees a raw 422 toast. **Ask:** document the
   rule (the form will mirror it).
6. **Ticket priority label is wrong:** `value:"medium"` is labelled
   «اولویت کم» (low) — the OpenAPI example repeats the same pairing, so it is
   not just a serialization slip. Verify the `low/medium/top` labels.
7. **Guest cart read returns 422, not 401.** `GET /shop/cart` without a bearer
   token answers «برای سبد خرید مهمان ارسال cart_token الزامی است»; the app
   always sends `X-Cart-Token`, so this is documentation only.
8. **Products paginate, orders/wallet don't.** `/shop/products` returns
   `{items, pagination:{total,last_page,…}}` while `/shop/order` and
   `/wallet/transactions` are flat arrays with no metadata — one convention
   would simplify both clients.
9. **`/shop/stories` links are external `http://…`**, and the header strip only
   exposes internal (`/`) links, so every story CTA is dropped. Confirm the
   intended link target.

---

## Blockers at a glance

> Snapshot **2026-10-31**, kept as history. The 2026-11-02 round above resolved
> rows 2, 5 and 6 in the payments/orders table and rows 8, 9 (create half), 10,
> 16, 17, 18 and 21 in the other-items table; the current authoritative list is
> [`api-backend-gaps-open.md`](./api-backend-gaps-open.md).

### Payment & orders (2026-10-29 round 2)

| # | Blocker | What it blocks | Current frontend behaviour | Ask (backend) |
| --- | --- | --- | --- | --- |
| 1 | No `pid` → invoice resolver | Trustworthy `/payment-result?pid=…` | Reads the newest invoice (`per_page=1`) + refreshes the profile | `GET /shop/payment/{pid}` → target (`invoice`/wallet charge) + final state, **or** add `invoice_id`/`hash_id` to the bank return URL |
| 2 | No “pay an existing invoice” endpoint | Retry after `payment.success=false`; unpaid invoices | Order detail links to a mock pay page | `POST /shop/order/{invoice}/pay` returning the same `payment` shape as checkout |
| 3 | Wallet-charge callback contract unverified | Confirming a top-up; failure handling | Dialog shows `payment.message`; balance only via profile refresh on return | Document the return link for `POST /wallet/charge` and the failure payload (and whether `payment.data`/`token` applies) |
| 4 | Gateway POST field names unverified | Non-Mellat gateways | POST form when `payment.data` is an object with scalars, else GET `payment.url` | Per-gateway field reference (`RefId`, …) and which gateways are GET-only |
| 5 | No `meta`/`links`/`total` on list endpoints | Real server-side pagination/counts | Short-page rule; orders fetch eagerly (cap 10 × 100), wallet load-more | Optional `meta` block or `X-Total-Count` (flat `data` can stay) |
| 6 | `type` rejects `all` (`422`) | A unified all-orders view | Dashboard always sends `type=sales`; other types need separate calls | Allow `type=all`, or one combined list endpoint |

**Status 2026-10-31 (live):** rows 1, 3, 5 and 6 reproduce exactly (row 1:
`/shop/payment/{id}` → 404 and `/wallet/charge` returns no id; row 3: failures
are HTTP 200 + `payment.success:false` + `data:[]`). Rows 2 and 4 are still open
and now **untestable end-to-end**, because no gateway creates a session (Mellat
and Melli refuse, Saman returns `success:true` with `token:"-111"` and
`url:null`). The gateway itself is now the top blocker — see
[Regressions](#regressions-found-in-this-verification) and
[New contract gaps](#new-contract-gaps-found-in-this-verification).

### Other open items

| # | Area | Blocker | Impact | Ask |
| --- | --- | --- | --- | --- |
| 7 | Cart | No line update for `services[]`/insurance | «افزودن خدمت/بیمه» dialogs are local-only and reset on the next cart response | Line-update endpoint, or confirm the intended flow |
| 8 | Orders | No cancel / invoice download / return-request endpoints | Those actions stay mock (delete-ticket style workarounds) | Publish the remaining order-lifecycle endpoints |
| 9 | Tickets | No delete-ticket; create body takes no file | Dashboard “delete” closes the ticket; create attachment is UI-only | DELETE endpoint + `file` on create |
| 10 | Profile | Avatar `DELETE` returns 405 (re-verified 2026-10-31) | Remove-avatar action is informational | Implement DELETE |
| 11 | Blog | `filters[s]` ignored; category response has no title | Search filters the loaded page client-side; extra category request | Apply the filter; include the category title |
| 12 | Comments | Order-answer / comment status enum undocumented | `pending`/`rejected` special-cased, everything else treated as approved | Document the status values |
| 13 | Static | No CMS endpoints; no notifications; compare not persisted | Pages use designed content; bell has no feed | Endpoints (or confirm CMS is out of scope) |
| 14 | Auth | `token_expire` unusable; `success:false` with HTTP 200; production CORS | Client retries once on 401 and treats `success:false` as an error | **CORS is now fine** (preflight echoes `https://homacom.ir`). `token_expire` equals the issue time in Tehran (`11:59:39` for a `11:59:37` login) and the token still worked at `12:04` → document/repair expiry. Outer HTTP 200 with inner `payment.success:false` is confirmed. |
| 15 | Assets | Mixed absolute vs relative media URLs | Client resolves relative paths against the API origin | Product/cart/shipping are absolute; **footer `logo`/`logo_dark`/`favicon` are still `uploads/setting/…`**. Standardise. |
| 16 | Orders | **`items` missing from list and detail** (2026-10-31) | Order detail renders no products | Add the line items to `GET /shop/order/{invoice}` (and ideally the list projection) |
| 17 | Cart | **`product_slug` null in `CartItemResource`** (2026-10-31) | Cart line links fall back to `#` | Serialise the product slug (schema already documents it) |
| 18 | Cart | **`set/payment-method` slash alias 404** (2026-10-31, regression) | Cart `payment_method` silently not persisted from checkout | Restore the alias or confirm the dash path is the only one |
| 19 | Payments | **`payment.success` not trustworthy / `myCredit` URL is admin-only** (2026-10-31) | Saman dead-ends via `data.RedirectURL`; wallet “fast path” never settles | Make `success` mean “gateway session created”, return a customer-facing `url`, surface config errors |
| 20 | Cart | **`set-user-address` requires `cart_token` but the spec doesn't list it** (2026-10-31) | Spec drift; guests/scripts get `422 cart_token` | Align spec and validation |
| 21 | Cart | **`receive_date` weekday not checked against `delivery_period.day`** (2026-10-31) | Impossible date/slot pairs can be stored | Validate the pair |
| 22 | Payments | **`max_online_payment_amount` only in `/public/footer`** (2026-10-31) | Frontend hardcodes 395 M vs the real 195 M cap | Keep it, but expose it in a settings payload the checkout reads |

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

**Live check 2026-10-31:** rows 1, 2, 4, 5 and 6 reproduce (see the
[verification section](#live-verification--2026-10-31-real-frontend-flow)).
Row 2's happy path is untested because no gateway starts a payment (Mellat/Melli
refuse, Saman returns `token:"-111"` with `success:true`). Row 1's payload is
complete but still has **no `items`**, and the list rows are the full 81-key
order object (heavy) with no count. Row 6's `pid` still has no resolver and
`hash_id` is a small integer (`14146`, `14199`, `14252`).

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
- **Order `status` enum vs the designed tabs.** The live/spec enum is
  `all, completing, waiting, waiting_payment, paid, cancel_customer,
  cancel_store, cancel_operator, processing, preparing, stock, packaging,
  ready_for_send, send_to_center, sending, delivery, returned, refer_request,
  refer_accept, refer_reject, refer_done`. The Figma tab names
  `current`/`delivered`/`cancelled` are **not** accepted (`422`), so those tabs
  must stay client-side groups (they already are). A future server-side tab
  filter needs the mapping `delivered → delivery`, `cancelled → cancel_*`.
  Verified 2026-10-31: `status=waiting` → 3, `processing`/`returned` → 0,
  `delivered`/`cancelled`/`current` → 422.
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
   **2026-10-31:** confirmed — `/shop/payment/14146|14199|32|3` all return
   `404 "موردی یافت نشد"`, and `POST /wallet/charge` returns no id at all
   (`{success,gate,url,token,message,data}`), so a top-up cannot be resolved
   even with a resolver for invoices.
2. **No endpoint pays an existing invoice.** After `payment.success=false`, or
   for an invoice left `waiting_payment`, the frontend can only link to the
   order detail; `dashboard/orders/[id]/pay` stays a mock. **Ask:**
   `POST /shop/order/{invoice}/pay` returning the same `payment` shape as
   checkout. **2026-10-31:** still absent from the OpenAPI spec and the runtime.
3. **Wallet callback semantics are unverified.** It is unclear which front link
   a `POST /wallet/charge` redirect returns to, and whether the same
   `payment.data`/`token` hand-off applies (the PDF only says "gateway
   redirect"). Confirm the return URL shape, plus the failure payload when the
   charge is not completed (currently the dialog only shows `payment.message`).
   **2026-10-31:** the failure payload is `payment.success:false` +
   `data:[]` + a Persian `message` (HTTP 200), and the only “success” shape seen
   is Saman's `token:"-111"` + `data.RedirectURL` (a 404 server route).
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
| 7 | Gateways grew: **Tara** and **Azki** (`type: installment` for both — live 2026-10-31; the PDF says “online” for Tara). | PDF §6 · live check | Both appear automatically from the public list; icons fall back to local marks when the backend has no `image`. |
| 8 | `POST /shop/cart/checkout` `{ payment_method_id, device?, cart_token? }` → 201 `{ invoice, payment{ success, gate, url, token, message, data } }`. | OpenAPI (not in the PDF) | Replaces the mock `settlePayment()`: real invoice, then a gateway hand-off (POST form when `payment.data` is non-empty, else GET `payment.url`). `/checkout` is now behind the auth middleware. |

**Live check 2026-10-31:** rows 1, 2, 4, 5 and 8 reproduce. Three corrections:

- **Row 3:** “deleted at zero” only happens when `min_in_cart = 1`. On a line
  with `min_in_cart: 2`, `sub-qty` at 2 returns **422** «حداقل تعداد قابل سفارش
  از این محصول 2 عدد میباشد» and the line stays at 2. `quantity` in the body is
  ignored (`quantity:5` still moves the line by +1). The delta counts *units*,
  not `min_in_cart`, which is the correct behaviour — just not “delete at zero”.
- **Row 4:** the `CartItemResource` **`product_slug` is `null`** for every line,
  although the OpenAPI schema lists it (products 1 and 4 have a slug on
  `/shop/products/{slug}`). `useCart` builds the line link from it, so cart rows
  fall back to `href="#"`.
- **Row 6:** still mixed — cart/product/shipping media are absolute, but
  `/shop/public/footer` returns `logo`, `logo_dark` and `favicon` as
  `uploads/setting/…`.
- **Row 7:** live `type` is **`installment` for both Tara and Azki** (not
  `online` for Tara), so the checkout lists Tara under «خرید اقساطی». Every
  payment method has `image: null`.
- **Row 8:** `payment.success` is **not a reliable “gateway started” signal**:
  Saman returns `success:true` with `url:null` and `token:"-111"`, Mellat/Melli
  return `success:false` (Shaparak/config error, `data:[]`), and `myCredit`
  redirects to `https://new.ahoma.ir/payment-from-credit?order_id=…` which
  answers **302 → `/admin/login`**.

### Notes

- **Siblings, not nested:** the PDF snippet nests `delivery_period` inside
  `shipping`; the OpenAPI `CartResource` puts `shipping`, `delivery_period` and
  `receive_date` beside each other. `applySelection()` reads both shapes.
- **`payment_method_id` is the gateway:** the checkout body takes the
  `PaymentMethodResource.id` (not `key`/`bank`), so the picked gateway **is**
  persisted on the invoice. The cart's five-value `payment_method` enum is
  still sent through `set/payment-method` for older surfaces (wallet→`online`,
  installment→`mixed`). **2026-10-31:** only `POST /shop/cart/set-payment-method`
  (dash) works; the documented slash alias
  `POST /shop/cart/set/payment-method` now returns **404 “موردی یافت نشد”**
  even with a valid token, so `useCart.setPaymentMethod()` fails silently
  (its watcher swallows the error).
- **Date chips** are derived from the server slots: the next real dates whose
  weekday appears in `/public/delivery-periods`. Postal/in-person methods still
  pick a `receive_date` but no period.

### Still open after this round

1. **Gateway callback has no result payload.** The bank callback is
   server-to-server; the browser lands back on the site with nothing telling the
   app whether the payment succeeded (and for which invoice). **Ask:** redirect
   back to `/checkout/success?invoice=<hash_id>&status=…` (or expose a verify
   endpoint) so the result page can confirm the payment instead of guessing.
   **2026-10-31:** the only return links observed are
   `/payment/verify/{gate}` (server route, GET → 404) and
   `/payment-from-credit?order_id=…` (302 → `/admin/login`).
2. **Gateway POST field names are unverified.** `payment.data` + `token` are
   returned, but no live gateway has been exercised yet; confirm which key each
   gateway expects (`RefId` for Mellat, …) and whether any gateway is GET-only.
   **2026-10-31:** still unverified, because no gateway produced a usable
   session: Mellat/Melli `success:false` (`data:[]`), Saman `success:true` with
   `token:"-111"` and `url:null`, `myCredit` an admin URL.
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
| 4 | `POST /shop/cart/set/payment-method` (slash) is now an alias of `set-payment-method`. All five values valid: `online`, `pay_in_delivery`, `pay_in_person`, `mixed`, `manual`; guest + authenticated. **2026-10-31: REGRESSED** — the slash path returns 404 again; only the dash form persists. | backend note §4 · OpenAPI path present | Checkout already calls the slash URL; it now persists (still maps wallet→`online`, installment→`mixed`). **Needs switching back to the dash path until the alias is restored.** |
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

> **Status 2026-11-02:** item 2 (cancel/refer/repay) and item 6 (avatar delete)
> are resolved, and the create half of item 5 (ticket `file`) is resolved. The
> items below are kept as history; the authoritative open list is
> [`api-backend-gaps-open.md`](./api-backend-gaps-open.md).

### 1. Cart services / insurance cannot be changed after add-to-cart

`add-to-cart` accepts `services[]`, but there is still no endpoint to update or
remove services/insurance on an existing line. The cart's «افزودن خدمت» /
«افزودن بیمه» dialogs remain local-only and are lost on the next cart response.

**Ask:** provide a line-update endpoint, or confirm the intended flow.

### 2. Orders — cancel / refer / repay — **resolved 2026-11-02**

The 2026-11-02 round added `POST /shop/order/{invoice}/cancel`,
`POST /shop/order/{invoice}/refer`, `GET /shop/order/refers` and
`POST /shop/order/{invoice}/repay`; the dashboard now uses all of them. Invoice
download is still absent from the spec.

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

### 5. Tickets — delete still absent; create attachment **resolved 2026-11-02**

- No delete-ticket endpoint (the dashboard action still closes the ticket).
- `POST /shop/user/ticket` now accepts multipart `file` (max 5 MB) and the create
  dialog uploads it (2026-11-02).

### 6. Avatar delete — **resolved 2026-11-02**

`DELETE /shop/user/profile/avatar` now exists (idempotent 200; unauthenticated
**401** instead of the old **405**) and the account page remove action calls it.

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

1. **Make a card payment start.** Today no gateway returns a usable redirect
   (Mellat/Melli config errors; Saman `token:"-111"` with `success:true`;
   `myCredit` → admin login). Everything else in checkout is correct, but the
   funnel ends here.
2. Gateway callback result payload + per-gateway POST field reference (blocks a
   trustworthy `/payment-result`).
3. `pid` resolver for `/payment-result?pid=…` (and an id on
   `POST /wallet/charge`), or `invoice_id`/`hash_id` in the return URL.
4. Align the category filter with the catalog (product ids `2/5/8` are rejected;
   public-tree ids return no products) and document the `filters[s]` ≥2-char
   minimum. Both break discovery on the landing/search pages.
5. Cart line update for services/insurance.
6. Blog `filters[s]` search + category title in the collection response.
7. Ticket delete endpoint.
8. Document comment status values and the five payment-method meanings
   (`online`, `pay_in_delivery`, `pay_in_person`, `mixed`, `manual`),
   `token_expire`, and the `locates` city scope.
9. Static pages / notifications feed / compare persistence.
10. Standardise media origins and confirm the guest→user cart merge.
11. **Docs:** fix the OpenAPI response envelopes for `/order`, `/wallet/transactions`
    and `/order/refers` (`data.items` + `data.pagination`) and add the required
    `company_name`/`company_register_id` to the `legal-information` schema.

---

## Reproduce quickly

The per-endpoint results (all 73 method/path pairs, shapes and statuses) are in
[`api-endpoint-matrix.md`](./api-endpoint-matrix.md). The commands below replay
the contract checks; `curl -g` is required for the `filters[...]` query strings.
The checkout calls **create a real invoice** (they do not move money) — expect a
new `waiting_payment` order per run.

```bash
BASE=https://new.ahoma.ir/api
MOBILE='<test customer mobile>'

# 1) login (OTP "11111" in this test environment)
curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' \
  -d "{\"mobile\":\"$MOBILE\"}"
TOKEN=$(curl -s -X POST "$BASE/auth/verify" -H 'Content-Type: application/json' \
  -d "{\"mobile\":\"$MOBILE\",\"active_code\":\"11111\"}" | jq -r '.data.token')

# 2) public lookups — 6 shipping / 7-weekday slots / 6 payment methods
curl -s "$BASE/shop/public/shipping-methods"
curl -s "$BASE/shop/public/delivery-periods"
curl -s "$BASE/shop/public/payment-methods"

# 3) cart: add, then delta quantity (cart_token must match the cart)
CT=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/cart" | jq -r '.data.cart_token')
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"stock_id\":1,\"quantity\":2,\"cart_token\":\"$CT\"}" "$BASE/shop/cart/add-to-cart"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"cart_item_id":1}' "$BASE/shop/cart/add-qty"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"cart_item_id":1}' "$BASE/shop/cart/sub-qty"
# 422 proofs
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"stock_id":1}' "$BASE/shop/cart/add-qty"            # cart_item_id required

# 4) address + shipping selection (address needs cart_token at runtime)
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/user/address"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"user_address_id\":1,\"cart_token\":\"$CT\"}" "$BASE/shop/cart/set-user-address"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"shipping_id":2,"receive_date":"2026-11-03"}' "$BASE/shop/cart/set-shipping"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"shipping_id":5,"receive_date":"2026-11-07"}' "$BASE/shop/cart/set-shipping"  # 422: period required

# 5) checkout — invoice + gateway hand-off (ids: 1 wallet, 2 azki, 3 mellat, 4 melli, 5 saman, 6 tara)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"payment_method_id":3,"device":"desktop"}' "$BASE/shop/cart/checkout"
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"payment_method_id":5,"device":"web"}' "$BASE/shop/cart/checkout"   # saman: success:true, url:null, token:-111

# 6) payment result has no resolver (all 404)
for p in "shop/payment/14199" "shop/payment/32" "shop/payment/3"; do curl -s "$BASE/$p"; done
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  "https://new.ahoma.ir/payment-from-credit?order_id=31"   # 302 -> /admin/login

# 7) orders — filters, sort, no meta/links, no items
curl -sg -H "Authorization: Bearer $TOKEN" "$BASE/shop/order?status=all&type=sales"
curl -sg -H "Authorization: Bearer $TOKEN" "$BASE/shop/order?payment_status=waiting_payment&per_page=100"
curl -s  -H "Authorization: Bearer $TOKEN" "$BASE/shop/order/31" | jq '.data|has("items")'  # false
curl -sg -H "Authorization: Bearer $TOKEN" "$BASE/shop/order?type=all"        # 422
curl -sg -H "Authorization: Bearer $TOKEN" "$BASE/shop/order?per_page=101"    # 422
curl -sD - -o /dev/null -H "Authorization: Bearer $TOKEN" \
  "$BASE/shop/order?status=all&type=sales&page=2" | grep -i 'x-total\|link'   # nothing

# 8) wallet — ledger filters + real top-up attempt
curl -sg -H "Authorization: Bearer $TOKEN" "$BASE/shop/wallet/transactions?filters[in_out]=all"
curl -sg -H "Authorization: Bearer $TOKEN" "$BASE/shop/wallet/transactions?filters[in_out]=credit"  # 422 filters.in_out
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"amount":10000,"payment_method_id":1}' "$BASE/shop/wallet/charge"   # 422: wallet method rejected
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"amount":10000,"payment_method_id":5}' "$BASE/shop/wallet/charge"   # saman: token -111

# 9) auth rotation (old token dies)
curl -s -X POST -H "Authorization: Bearer $TOKEN" "$BASE/auth/refresh" | jq -r '.data.token'

# 10) cart/order regressions
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"payment_method\":\"online\",\"cart_token\":\"$CT\"}" "$BASE/shop/cart/set/payment-method"  # dash: 200
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"payment_method\":\"online\",\"cart_token\":\"$CT\"}" "$BASE/shop/cart/set/payment-method"  # slash: 404
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/cart" | jq '.data.items[].product_slug'      # null

# 11) media / CORS / expiry
curl -s "$BASE/shop/public/footer" | jq '.data|{logo,logo_dark,favicon,max_online_payment_amount}'
curl -s -o /dev/null -D - -X OPTIONS "$BASE/shop/cart" \
  -H 'Origin: https://homacom.ir' -H 'Access-Control-Request-Method: POST' | grep -i access-control
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/user/profile/me"   # works after token_expire

# 12) still-open items
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"coupon_code":"NOPE"}' "$BASE/shop/cart/set-discount"
curl -s -X DELETE "$BASE/shop/user/profile/avatar" -H "Authorization: Bearer $TOKEN"  # 405 HTML
```
