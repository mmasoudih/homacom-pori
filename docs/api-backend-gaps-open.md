# Backend gaps — open items only (2026-11-03)

Filtered view of [`api-backend-gaps.md`](./api-backend-gaps.md): **only items
that are still open**. Resolved rounds (2026-10-25, 2026-10-29 round 1/round 2,
2026-11-02, 2026-11-03) are removed; the 2026-11-03 round was verified against
the PDF + OpenAPI document and unauthenticated live calls only (no test
credentials for authenticated checks).
Per-endpoint status is in [`api-endpoint-matrix.md`](./api-endpoint-matrix.md).

Base `https://new.ahoma.ir/api` · OpenAPI `https://new.ahoma.ir/docs?api-docs.json`

## Summary

| # | Area | Open gap | Severity | Blocks |
| --- | --- | --- | --- | --- |
| 1 | Payments | No gateway can start a session (Mellat/Melli config errors, Saman `-111`, `myCredit` admin URL) | **Critical** | Any card/wallet payment |
| 2 | Payments | `payment.success` / `url` / `data` contract unreliable | **Critical** | Correct checkout branching |
| 3 | Payments | `wallet/charge` returns no identifier, so top-up confirmation relies on the profile/ledger refresh | Medium | `dashboard/wallet` top-up result |
| 4 | Payments | Per-gateway POST field names unknown (return link is now documented) | Medium | Trustworthy result page |
| 5 | Cart | No line update for `services[]`/insurance | Medium | “Add service/insurance” dialogs |
| 6 | Cart | `set-user-address` requires undocumented `cart_token` | Low | Spec/consumers |
| 7 | Cart | Misleading 422 on cart-token mismatch; fresh cart has `cart_token:null` | Low | Debuggability |
| 8 | Catalog | Category filter misaligned with product category ids | **High** | Category browsing + landing panels |
| 9 | Catalog | `filters[s]` needs ≥2 chars (undocumented) | Medium | One-letter search |
| 10 | Blog | `filters[s]` ignored; category response has no title | Medium | Blog search / extra request |
| 11 | Content | `site-header` vs `blog-header` nearly identical | Low | Blog navigation |
| 12 | Content | `locates` (city scope) served but unused | Medium | City-scoped shipping methods |
| 13 | Content | `/shop/stories` links are external `http://` | Low | Story CTAs |
| 14 | Assets | Footer `logo`/`favicon` still relative `uploads/…` | Low | Media origin consistency |
| 15 | Profile | `base-information` rejects empty names while the profile stores `""` | Medium | Profile validation |
| 16 | Auth | `token_expire` equals issue time; not enforced; refresh returns no expiry | Medium | Client session handling |
| 17 | Cart/UI | Address `nickname` needs ≥3 chars (undocumented) | Low | Address form |
| 18 | Comments | Status enum values undocumented | Low | Moderation UI |
| 19 | Tickets | No delete-ticket endpoint | Medium | Dashboard delete |
| 20 | Payments | `max_online_payment_amount` only in `/public/footer` | Low | Correct limit guard |
| 21 | Static | Terms/guarantee/installment/branch/collaboration pages, notifications feed, compare persistence | Low | Those surfaces |
| 22 | Wallet | Ledger row shape unverified (zero rows on the test account) | Low | `reason_title`/`in_out` rendering |

---

## 0. Resolved in the 2026-11-03 round (for reference)

`nov-3.pdf` (2026-11-03) closed the payment-`pid` question and the about/contact
CMS gap:

| Gap (was open) | Now |
| --- | --- |
| No `pid` → invoice resolver | The gateway return link is `/payment-result?pid=<order_id>`; `pid` is the **plain order id**, resolved with `GET /shop/order/{id}` |
| Gateway return link unknown | Documented in the PDF; the page no longer guesses for a valid `pid` |
| No about/contact CMS | `GET /shop/public/about` (`about_us`, `about_us_link`, `seo_about`) and `GET /shop/public/contact` (phones, email, address, socials, `contact_popup`, `contact_popup_status`) |
| No contact form endpoint | `POST /shop/contact-us` (single `contact` field: email or 11-digit mobile; 422 field errors) |
| Dashboard had no recently-viewed | `GET /shop/user/dashboard` now returns `last_visited_product[]` (product + `last_visited_at`) |
| OpenAPI drift on list envelopes / `legal-information` | The 2026-11-02 payloads are now in the spec (was item 23) |

---

## 0.1 Resolved in the 2026-11-02 round (for reference)

The PDF round added every order-lifecycle endpoint the dashboard was missing and
fixed the 2026-10-31 regressions:

| Gap (was open) | Now |
| --- | --- |
| No cancel / return-request endpoints | `POST /order/{invoice}/cancel` (`{description?}`), `POST /order/{invoice}/refer` (`{items:[{item_id,count,description?}]}`) |
| No refers list/detail | `GET /order/refers` (`step` incl. `all`, 1–100/page) |
| No way to pay an existing invoice | `POST /order/{invoice}/repay` (`{payment_method_id, device?}`) |
| No dashboard aggregates | `GET /user/dashboard` |
| No restock notification | `POST /products/{slug}/notify` (`{channel, stock_id?}`) |
| `items[]` missing from orders | `UserOrderItemResource[]` on list rows and detail |
| `type=all` rejected, no tab aliases | `type=all` + `status=current|delivered|cancelled` |
| Lists were bare arrays | `data.items` + `data.pagination` (`has_more_pages`) |
| Avatar `DELETE` → 405 | `DELETE /user/profile/avatar` (idempotent 200, 401 unauthenticated) |
| Ticket create took no file | multipart `file` (max 5 MB) |
| Cart `product_slug` null | serialised again |
| Weekday/period mismatch accepted | 422 `cart_receive_date_wrong_weekday` |
| Ticket `medium` labelled «کم» | label corrected to «اولویت متوسط» |
| `legal-information` accepted empty company | `company_name` + `company_register_id` required |

OpenAPI drift from that round was resolved in the 2026-11-03 round.

---

## 1. Payments

### 1.1 No gateway can start a session — **Critical**

Live 2026-10-31, both on `POST /cart/checkout` and `POST /wallet/charge`:

- `mellat` → `payment.success:false`, message «خطا در اتصال به وب سرویس شاپرک :
  Unmarshalling Error: For input string: ""», `data:[]`.
- `melli` → `payment.success:false`, «عملیات ناموفق بود», `data:[]`.
- `saman` → `payment.success:true`, **`url:null`, `token:"-111"`,
  `data:{RedirectURL:"https://new.ahoma.ir/payment/verify/saman"}`**; that URL
  is a server route and answers **404** to a browser GET.
- `myCredit` → `success:true`,
  `url:"https://new.ahoma.ir/payment-from-credit?order_id=…"`, which answers
  **302 → `/admin/login`** for every id tried (3, 31, 14146). The invoice stays
  `waiting_payment`.

**Ask:** fix terminal/config for Mellat & Melli, return a real redirect URL for
Saman instead of the `-111` token, and point `myCredit` at a customer-facing
route that accepts the invoice id. Add a smoke test that asserts
`payment.success && payment.url` for each configured gateway.

### 1.2 `payment.success` is not a reliable signal — **Critical**

Because Saman returns `success:true` with `url:null` and a negative token, the
frontend's “success means redirect exists” assumption breaks; the current
handler follows a nested URL and dead-ends. Failure payloads are HTTP **200**
(inside a 201 checkout / 200 charge) with `data:[]`.

**Ask:** define and document the contract — `success` = gateway session created,
`url` always present when `success`, `data` only gateway form fields, failures as
`success:false` with a user-facing `message`. Publish it in the PDF/OpenAPI.

### 1.3 `wallet/charge` has no identifier — **Medium**

`POST /wallet/charge` returns no identifier at all
(`{success,gate,url,token,message,data}`), so the top-up result cannot be tied to
a charge row; `dashboard/wallet` refreshes the profile/ledger instead. The
invoice side is fixed (2026-11-03): the return link is
`/payment-result?pid=<order_id>` and `pid` is the plain order id.

**Ask:** include an `invoice_id`/charge id in the charge response and the bank
return URL so the wallet top-up can resolve its own row.

### 1.4 Gateway callback + form contract — **Medium**

The browser return link (`/payment-result?pid=<order_id>`) is documented as of
2026-11-03, but no successful payment has ever been observed, so the returned
payload and the per-gateway POST field names (`RefId`, …) are still unverified;
only `/payment/verify/{gate}` (POST-only) and the admin `payment-from-credit`
URL exist.

**Ask:** a per-gateway field table (which gateways POST which keys, which are
GET-only) and one observed successful round-trip.

---

## 2. Cart

### 2.1 No line update for services/insurance — **Medium**

`add-to-cart` accepts `services[]`, but there is no endpoint to add/remove them
on an existing line; the cart dialogs reset on the next response.

**Ask:** a line-update endpoint, or confirm the intended flow.

### 2.2 `set-user-address` requires `cart_token` — **Low (spec drift)**

Authenticated call without it → **422** `{"errors":{"cart_token":["…"]}}`; the
OpenAPI body lists only `user_address_id`. `set-shipping` and `checkout` accept
the same request without it.

**Ask:** align the spec and validation.

### 2.3 Cart-token errors are misleading — **Low**

`add-qty`/`sub-qty` answer **422** «قلم سفارش در سبد خرید یافت نشد» when the
request carries a `cart_token` that does not resolve to the user’s cart — the
same message as a genuinely missing line. After checkout the fresh cart is
returned with `cart_token:null` (cart ids increment per invoice), so a client
holding the old token can look “not found”. A guest `GET /shop/cart` returns
**422** «ارسال cart_token الزامی است» (not 401).

**Ask:** distinguish “token invalid” from “line missing”, and return/distribute
the fresh cart token after checkout.

---

## 3. Catalog & content

### 3.1 Category filter misaligned — **High**

Products reference category ids `2`, `5`, `8`, `12`. Filtering by `2/5/8` →
**422** «فیلتر انتخاب شده معتبر نیست»; every id in
`/shop/public/product-category` (`103`, `104`, `137`, `138`, …) → 200 with **0
products**; only `12` returns rows (`total:11`). The landing
`<BestOfCategorySection>` asks one pool per public category, so most panels are
empty and most products are unreachable by category.

**Ask:** accept any category attached to a product, decide whether parents
include descendants, and align the public tree with the product assignments
(seed data).

### 3.2 `filters[s]` minimum length — **Medium**

1 character → **422** «filters.s نباید کمتر از 2 کاراکتر باشد». The header search
sends the raw term and swallows the error, so a one-letter query silently shows
nothing.

**Ask:** accept 1 character (and document the limit if kept).

### 3.3 Blog search / category title — **Medium**

`GET /shop/blogs?filters[s]=…` is accepted but ignored (same posts for every
query); `GET /shop/blogs/category/{slug}` returns `items` + `pagination` without
the category title, so the page makes an extra `/public/blog-category` request.

**Ask:** apply `filters[s]` and include the category title.

### 3.4 `site-header` vs `blog-header` — **Low**

They differ only in one menu title («منوی اصلی سایت» vs «منوی وبلاگ»); logo,
`blog_title`, menus and the 8 product categories are identical.

**Ask:** confirm the blog header is meant to reuse the shop navigation.

### 3.5 `locates` unused — **Medium**

Shipping rows carry `locates:"760"` / `"760,1382"` (present/courier are
city-scoped), but the field is dropped by the client, so every customer sees
«حضوری»/«پیک».

**Ask:** filter by the cart address server-side, or document the id set so the
client can.

### 3.6 Story links — **Low**

`/shop/stories` returns 12 rows with external `http://…` links; the header strip
only exposes internal (`/`) links, so every story CTA is dropped.

**Ask:** confirm the intended link targets.

### 3.7 Media origin — **Low**

Cart/product/shipping media are absolute; `/shop/public/footer` still returns
`logo`, `logo_dark`, `favicon` as `uploads/setting/…`.

**Ask:** standardise the storage origin.

---

## 4. Profile & auth

### 4.1 `base-information` validation gap — **Medium**

`PUT /shop/user/profile/base-information` requires `fname`/`lname`, but this
account stores both as `""`, so the API can return a profile its own update
endpoint would reject.

**Ask:** allow clearing (or make the fields optional).

The 2026-11-02 round fixed the `legal-information` side: `company_name` and
`company_register_id` are now required.

### 4.2 `token_expire` unusable — **Medium**

At issuance the value equals the issue time in Tehran
(`token_expire:"2026-10-31 12:16:35"` for a login at `12:16:35`), with no
timezone marker; the token still worked ~12 minutes later. `POST /auth/refresh`
returns only `{token}` (no expiry).

**Ask:** return a real expiry with an explicit offset (ISO 8601) and enforce it;
document the refresh contract.

### 4.3 Address `nickname` rule — **Low**

`POST /shop/user/address` requires `nickname` ≥3 characters (2 chars → **422**
«نباید کمتر از 3 کاراکتر باشد»); the dialog only checks non-empty.

**Ask:** document the rule (the form will mirror it) or relax it.

---

## 5. Comments, tickets, wallet

### 5.1 Comment status values — **Low**

`pending` is returned on create; the full moderation enum (approved/rejected/…)
is undocumented, so the UI special-cases `pending`/`rejected` and treats the
rest as approved.

**Ask:** document the status values.

### 5.2 Ticket delete — **Medium**

`DELETE /shop/user/ticket/{id}` → **405** (no delete endpoint); the dashboard
“delete” closes the ticket instead. Create-ticket `file` was fixed in the
2026-11-02 round.

**Ask:** publish a DELETE endpoint.

### 5.3 Wallet ledger shape unverified — **Low**

The list contract works (now `data.items` + `data.pagination`,
`filters[...]` validated with 422 keyed `filters.*`), but the test account has
zero rows, so `in_out`, `amount` sign, `reason_title` and `relate_id` were never
observed.

**Ask:** seed a `charge_credit` + `use_credit` row on the test account, or
confirm the resource fields.

### 5.4 Online payment ceiling — **Low**

`/shop/public/footer` exposes `max_online_payment_amount:"195000000"`, but it
is the only place; the checkout hardcodes 395 000 000 (Figma).

**Ask:** expose it in a settings payload the checkout can read (or confirm the
footer is the source of truth).

---

## 6. Missing surfaces — **Low**

About and contact are now real (2026-11-03: `/shop/public/about`,
`/shop/public/contact`, `POST /shop/contact-us`). Still missing: terms,
guarantee, installment, branch and collaboration pages, a notifications feed and
compare persistence. The 2026-11-02 `POST /products/{slug}/notify` is a restock
reminder, not a notifications feed.

**Ask:** confirm these are out of scope for the backend, or publish endpoints.

---

## 7. Spec ↔ runtime drift

| # | OpenAPI says | Runtime / PDF |
| --- | --- | --- |
| 1 | `GET /shop/order` → `data: []` | `data.items` + `data.pagination` |
| 2 | `GET /shop/wallet/transactions` → `data: []` | `data.items` + `data.pagination` |
| 3 | `GET /shop/order/refers` → `data: []` + root `pagination` | `data.items` + `data.pagination` |
| 4 | `set-user-address` body = `{user_address_id}` | also requires `cart_token` (422 without) |
| 5 | `add-qty`/`sub-qty` body = `{cart_item_id}` | `cart_token` needed when the cart has one |
| 6 | `POST /shop/cart/set/payment-method` (slash) exists | 404; only `/set-payment-method` works (client now calls the dash route) |
| 7 | `wallet/charge` example `payment_method_id:1` | id 1 = `myCredit` (wallet) → 422 by design |
| 8 | checkout `payment.success` | true for Saman with `url:null`, `token:"-111"` |
| 9 | spec JSON at `https://new.ahoma.ir/docs?api-docs.json` | `/api/docs?api-docs.json` is **404** (the older note used that path) |

The 2026-11-02 list/`legal-information` drift and the whole 2026-11-03 round
(`about`, `contact`, `contact-us`, dashboard `last_visited_product`,
`payment/pay` + `payment/verify/{gate}`) are now in the spec.

---

## Still unverifiable (needs backend data or a working gateway)

- Successful card payment → callback → `/payment-result?pid=…` (no gateway
  starts).
- `POST /auth/login-with-password` success (test account has no password).
- Real wallet ledger rows (zero transactions).
- Authenticated behaviour of the 2026-11-02 endpoints (cancel/refer/repay/
  refers/dashboard/notify/avatar delete/ticket file): unauthenticated calls
  return **401**, which proves the routes exist, but no test credentials were
  available for an end-to-end check.
- Authenticated behaviour of the 2026-11-03 endpoints (`contact-us` submit,
  dashboard `last_visited_product`): the public about/contact payloads were
  checked unauthenticated; the form POST and the visit history need an account.
- Ownership 404s (`invoice_refer_must_be_paid` etc. are documented, not
  observed).

## Reproduce

See the command block at the end of
[`api-backend-gaps.md`](./api-backend-gaps.md#reproduce-quickly) and the
per-endpoint table in
[`api-endpoint-matrix.md`](./api-endpoint-matrix.md).
