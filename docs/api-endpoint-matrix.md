# Frontend API endpoint matrix — live sweep 2026-10-31 + 2026-11-02 / 2026-11-03 deltas

Every backend endpoint the Nuxt app calls, exercised in production through the
same request shape the app uses. Companion to
[`api-backend-gaps.md`](./api-backend-gaps.md) (full history + evidence),
[`api-backend-gaps-open.md`](./api-backend-gaps-open.md) (open items only) and
[`api-integration.md`](./api-integration.md) (wiring).

- **Base** `https://new.ahoma.ir/api` (OpenAPI: `https://new.ahoma.ir/docs?api-docs.json`)
- **Auth** customer OTP login (mobile + 5-digit code); one bearer token for the
  authenticated calls; `POST /auth/refresh` rotated it mid-sweep and
  `POST /auth/logout` revoked it at the end.
- **Limiter** `60 req/min` per IP (`x-ratelimit-*`); the sweep was paced at
  ~1 req/s and never hit `429`.
- **Inventory source** every `api.get/post/put/del/request` in
  `app/**` plus the `useFetch` in `HeaderCircleStrip.vue`.
- **Legend** ✅ works · ⚠️ validation/edge behaviour only (mutation avoided) ·
  ❌ endpoint missing or broken.

Result: **73 endpoint/method pairs in the 2026-10-31 sweep** (+7 new route
checks in the 2026-11-02 delta below), **0 unexpected 5xx**, **1 dead route**
(`set/payment-method` slash), **1 missing route** (ticket DELETE), and a
category-filter data mismatch (below). Every path in the OpenAPI spec (71
method/path entries) is called by the app; the only app path the spec omits is
the working `POST /shop/cart/set-payment-method`.

> **2026-11-02 delta:** the tables below are the 2026-10-31 authenticated sweep,
> kept as history. The newer round added seven route checks and changed several
> payloads — see [§10](#10-2026-11-02-delta-api-changes-2pdf). It was verified
> unauthenticated plus against the OpenAPI document (no test credentials).
>
> **2026-11-03 delta:** three public CMS/form routes plus a dashboard field and
> the payment `pid` contract — see
> [§11](#11-2026-11-03-delta-nov-3pdf).

---

## 1. Auth (7)

| Endpoint | Auth | Status | Observed | Verdict |
| --- | --- | --- | --- | --- |
| `POST /auth/login` | guest | 200 | `{success:true, message:"کد فعال سازی با موفقیت ارسال شد", data:[]}` (≈6.3 s) | ✅ |
| `POST /auth/verify` | guest | 200 | `{token:"4\|…", token_expire:"2026-10-31 12:16:35", user:{id:430,…}}`; 4-digit code → 422 «باید ۵ رقم باشد»; `token_expire` equals the issue time (Tehran), not an expiry | ✅ |
| `POST /auth/login-with-password` | guest | 422 | «رمز عبور باید حداقل یک کاراکتر خاص داشته باشد.» — account has `has_password:false`; success path untested | ⚠️ |
| `POST /auth/forgot-password` | guest | 200 | same envelope as `/auth/login` | ✅ |
| `POST /auth/reset-password` | guest | 422 | wrong `active_code` → `errors.active_code` | ✅ |
| `POST /auth/refresh` | bearer | 200 | `{token:"5\|…"}`; old token → **401** afterwards (rotation) | ✅ |
| `POST /auth/logout` | bearer | 200 | «خروج موفقیت آمیز.»; the token → **401** on the next call | ✅ |

## 2. Catalog & content (16 endpoints, 19 requests)

| Endpoint | Auth | Status | Observed | Verdict |
| --- | --- | --- | --- | --- |
| `GET /shop/products` | optional | 200 | `data:{items[3], pagination:{total,count,per_page,current_page,last_page,has_more_pages}}`; `is_favorite` present when signed in | ✅ |
| `GET /shop/products?filters[s]=…` | optional | 200 / 422 | 1-char term → **422** «filters.s نباید کمتر از 2 کاراکتر باشد»; `qui` → 3 hits | ⚠️ |
| `GET /shop/products?filters[homa_off]=1` | optional | 200 | 3 rows | ✅ |
| `GET /shop/products?filters[categories][]=…` | optional | 200 / 422 | `12` → 11 products; `103/104/137/138` → 0; `2/5/8` → **422** (product-attached legacy ids) — see A1 | ⚠️ |
| `GET /shop/products/{slug}` | optional | 200 | full detail (`stocks`, `service_groups`, `suggested`, `rate`, `galleries`, `is_favorite`) | ✅ |
| `GET /shop/products/{id}/comments` | optional | 200 | 5 published comments (array) | ✅ |
| `GET /shop/banners` | public | 200 | 26 rows (`image`,`link`,`position`,`target`) | ✅ |
| `GET /shop/brands` | public | 200 | 22 rows | ✅ |
| `GET /shop/faqs` | public | 200 | 10 subjects with `items[]` | ✅ |
| `GET /shop/stories` | public | 200 | 12 rows (`image`,`thumbnail`,`link`,`target`,`text`) — links are external `http://…` | ✅ |
| `GET /shop/public/colors` | public | 200 | 5 rows (`id,title,title_en,code`) | ✅ |
| `GET /shop/public/product-category` | public | 200 | 8 roots with nested `children` | ✅ |
| `GET /shop/public/blog-category` | public | 200 | 8 roots, same shape | ✅ |
| `GET /shop/public/site-header` | public | 200 | `blog_title`, `menus`, `categories`, `logo`… | ✅ |
| `GET /shop/public/blog-header` | public | 200 | identical to `site-header` except one menu title («منوی وبلاگ» vs «منوی اصلی سایت») — same title/logo/categories (A2) | ⚠️ |
| `GET /shop/public/footer` | public | 200 | menus, `max_online_payment_amount:"195000000"`, `currency:"تومان"`; `logo`/`favicon` relative `uploads/…` | ⚠️ |
| `GET /shop/public/shipping-methods` | public | 200 | 6 rows (`type` postal×4/present/delivery) | ✅ |
| `GET /shop/public/delivery-periods` | public | 200 | all 7 weekdays `{id,day,start_time,end_time}` | ✅ |
| `GET /shop/public/payment-methods` | public | 200 | 6 rows: wallet `myCredit`, installment `azki`/`tara`, online `mellat`/`melli`/`saman`; all `image:null` | ✅ |

## 3. Blog (4)

| Endpoint | Auth | Status | Observed | Verdict |
| --- | --- | --- | --- | --- |
| `GET /shop/blogs` | public | 200 | home payload `{categories[8] (4 posts each), lastPosts[8]}` — not a paginated list | ✅ |
| `GET /shop/blogs/{slug}` | public | 200 | `{post, latest, most_viewer}` | ✅ |
| `GET /shop/blogs/category/{slug}` | public | 200 | `{items[13], pagination}`; `filters[page]`/`filters[per_page]` honoured | ✅ |
| `GET /shop/blogs/{id}/comments` | optional | 200 | `[]` for post 1 (no comments seeded) | ✅ |

## 4. Address book (6)

| Endpoint | Auth | Status | Observed | Verdict |
| --- | --- | --- | --- | --- |
| `GET /address/states` | public | 200 | 31 provinces `{id,name,slug}` | ✅ |
| `GET /address/cities?filters[parent_id]=27` | public | 200 | 61 cities | ✅ |
| `GET /shop/user/address` | bearer | 200 | 1 row (full state/city objects) | ✅ |
| `POST /shop/user/address` | bearer | 201 | created id 2; **`nickname` must be ≥3 chars** (2-char → 422) — see A4 | ✅ |
| `PUT /shop/user/address/{id}` | bearer | 200 | updated title/fields | ✅ |
| `DELETE /shop/user/address/{id}` | bearer | 200 | `data:[]`; list back to 1 row | ✅ |

## 5. Profile (11)

| Endpoint | Auth | Status | Observed | Verdict |
| --- | --- | --- | --- | --- |
| `GET /shop/user/profile/me` | bearer | 200 | 22 keys (`credit`,`has_password`,`bank_*`,`avatar`,`currency`) | ✅ |
| `GET /shop/user/profile/legal-information` | bearer | 200 | 10 company fields (all `null` on this account) | ✅ |
| `PUT /shop/user/profile/base-information` | bearer | 422 | `fname`/`lname` required — stored profile is empty, so a no-op PUT is rejected (A5) | ⚠️ |
| `PUT /shop/user/profile/email` | bearer | 422 | «ایمیل باید یک ایمیل معتبر باشد»; valid write avoided | ⚠️ |
| `PUT /shop/user/profile/national-code` | bearer | 200 | same value → full profile returned, `code_melli` unchanged | ✅ |
| `PUT /shop/user/profile/birthday` | bearer | 422 | «birthday یک تاریخ معتبر نیست» | ⚠️ |
| `PUT /shop/user/profile/legal-information` | bearer | 200 | **empty `company_name` accepted**; all fields stayed `null` (A6) | ⚠️ |
| `PUT /shop/user/profile/bank-information` | bearer | 200 / 422 | `null,null` → 200 (no change); short card → 422 «باید 16 رقم باشد» | ✅ |
| `POST /shop/user/profile/avatar` | bearer | 422 | no file → «فیلد avatar الزامی است»; upload not exercised (avatar DELETE is 405) | ⚠️ |
| `POST /shop/user/profile/reset-password/send-code` | bearer | 200 | «کد فعال سازی با موفقیت ارسال شد» | ✅ |
| `POST /shop/user/profile/reset-password` | bearer | 422 | wrong code → «کد تایید درست نمی باشد» | ✅ |

## 6. Tickets (7)

| Endpoint | Auth | Status | Observed | Verdict |
| --- | --- | --- | --- | --- |
| `GET /shop/user/ticket/departments` | bearer | 200 | 4 rows `{id,title}` | ✅ |
| `GET /shop/user/ticket?filters[per_page]=100` | bearer | 200 | array; `status`/`priority` are `{value,label}` objects | ✅ |
| `POST /shop/user/ticket` | bearer | 201 | created id 1; `priority` `medium` → label «اولویت کم» — see A7 | ✅ |
| `GET /shop/user/ticket/{id}` | bearer | 200 | ticket + `messages[]` | ✅ |
| `POST /shop/user/ticket/{id}/reply` | bearer | 200 | multipart `content`; returns the new message (`file_url`, `is_support`) | ✅ |
| `POST /shop/user/ticket/{id}/close` | bearer | 200 | `status:{value:"closed",label:"بسته شده"}`; messages 2 | ✅ |
| `DELETE /shop/user/ticket/{id}` | bearer | **405** | Laravel text «The DELETE method is not supported for route api/shop/user/ticket/1» | ❌ missing |

## 7. Comments & favorites (7)

| Endpoint | Auth | Status | Observed | Verdict |
| --- | --- | --- | --- | --- |
| `GET /shop/user/comments?filters[per_page]=100` | bearer | 200 | own comments; created one shows `status:"pending"` | ✅ |
| `POST /shop/user/comments` | bearer | 201 | `{relate_to:"product", relate_id:1, score, strength, weakness}` → id 45, `status:"pending"` | ✅ |
| `PUT /shop/user/comments/{id}` | bearer | 200 | title/content/score updated | ✅ |
| `POST /shop/user/comments/{id}/reaction` | bearer | 200 | `{type:"up"}` → `reaction:"up", reaction_up:1`; same call again → `reaction:null` (toggle) | ✅ |
| `DELETE /shop/user/comments/{id}` | bearer | 200 | comment removed | ✅ |
| `GET /shop/user/favorite?filters[relate_to]=product` | bearer | 200 | array of favorites with embedded product | ✅ |
| `POST /shop/user/favorite` | bearer | 200 | `{relate_to, relate_id}` → `added:true`, second call → `added:false` (toggle) | ✅ |

## 8. Cart (11)

| Endpoint | Auth | Status | Observed | Verdict |
| --- | --- | --- | --- | --- |
| `GET /shop/cart` | bearer | 200 | address/shipping/period/payment + `totals` | ✅ |
| `POST /shop/cart/add-to-cart` | bearer | 200 | `{stock_id, quantity, services[], cart_token}` → line created | ✅ |
| `POST /shop/cart/add-qty` | bearer | 200 | `{cart_item_id, cart_token}` → +1 only | ✅ |
| `POST /shop/cart/sub-qty` | bearer | 200 | −1; at `min_in_cart` → 422 (line kept) | ✅ |
| `DELETE /shop/cart/item` | bearer | 200 | line removed, `items:[]` | ✅ |
| `POST /shop/cart/set-discount` | bearer | 422 | invalid coupon → «کد تخفیف معتبر نمیباشد» (user-facing) | ✅ |
| `POST /shop/cart/set-user-address` | bearer | 200 | «آدرس تحویل انتخاب شد»; **`cart_token` required** though absent from the spec | ⚠️ |
| `POST /shop/cart/set-shipping` | bearer | 200 | postal without period; courier without period → 422 | ✅ |
| `POST /shop/cart/set/payment-method` | bearer | **404** | «موردی یافت نشد» — the app calls this path, and it is the only one in the OpenAPI spec | ❌ regression |
| `POST /shop/cart/set-payment-method` | bearer | 200 | «روش پرداخت انتخاب شد» — the working route is **not** in the spec | ✅ |
| `POST /shop/cart/checkout` | bearer | 201 / 422 | **201** `{invoice(id 31–33), payment{…}}` on a full cart; empty cart → 422 «سبد خرید شما خالی میباشد» | ✅ |

## 9. Orders & wallet (4)

| Endpoint | Auth | Status | Observed | Verdict |
| --- | --- | --- | --- | --- |
| `GET /shop/order` | bearer | 200 | flat array, newest first; `status`/`type`/`payment_status`/`per_page`/`page`; no `meta`/headers; **no `items`** | ⚠️ |
| `GET /shop/order/{invoice}` | bearer | 200 | 81-key order (address/shipping/totals) but **no `items`** | ⚠️ |
| `GET /shop/wallet/transactions` | bearer | 200 | flat array (0 rows); `filters[...]` validated, 422 keyed `filters.*` | ✅ |
| `POST /shop/wallet/charge` | bearer | 200 / 422 | `amount:0` → 422; `myCredit`/installment → 422; `mellat`/`melli` → `payment.success:false`; `saman` → `success:true, token:"-111", url:null` | ⚠️ gateway |

---

## Anomalies found by the sweep

| # | Area | Finding | Impact / Ask |
| --- | --- | --- | --- |
| A1 | Catalog | `filters[categories][]` rejects **2, 5, 8** — ids that products actually reference (`product 1 → [2,5,12]`) — with 422 «فیلتر انتخاب شده معتبر نیست», while every id in `/shop/public/product-category` (103+, 104, 137, 138) answers 200 with **0 products**. Only `12` returned products (11). | Category panels and category browsing are effectively empty; align product↔category ids, allow any category attached to a product, and decide whether a parent filter includes descendants. |
| A2 | Content | `/shop/public/site-header` and `/shop/public/blog-header` return the same payload except for one menu title («منوی اصلی سایت» vs «منوی وبلاگ»): same `blog_title`, `logo`, menus and the same 8 product categories. | Confirm the blog header should reuse the shop menus/categories (the wording suggests it may be a copy). |
| A3 | Search | `filters[s]` needs **≥2 characters** (1 char → 422). `useProductSearch` sends whatever was typed (1 char) and swallows the 422, so a one-letter search shows nothing with no message. | Enforce min 2 chars in the UI or accept 1 char server-side. |
| A4 | Address | `POST /shop/user/address` requires `nickname` **≥3 chars**; the dialog only checks non-empty, so a 2-char recipient name produces a raw 422 toast. | Mirror the rule in the form (or relax it). |
| A5 | Profile | `PUT base-information` requires `fname`/`lname`, yet this account stores both as `""` — the API can return a profile its own update endpoint would reject. | Allow empty strings or make the fields optional. |
| A6 | Profile | `PUT legal-information` accepted `{"company_name":""}` with 200 (all fields stayed `null`). No required-field validation, unlike `base-information`. | Add the same validation as the base profile. |
| A7 | Tickets | `priority.value = "medium"` is labelled «اولویت کم» (low) — the OpenAPI example says the same. | Verify the enum labels; the dashboard shows the API label. |
| A8 | Orders | List and detail payloads have **no `items`** (see gaps #16) and no `meta`/`X-Total-Count`; a list row is the full 81-key order. | Add line items + a list projection/count. |
| A9 | Payments | `POST /cart/set/payment-method` (slash) 404; `GET /shop/cart` as a guest returns **422** «ارسال cart_token الزامی است» (not 401); checkout returns `hash_id` small integers with no resolver. | Restore the alias; document guest-cart behaviour; add the `pid` resolver. |
| A10 | Wallet | `POST /wallet/charge` returns **no id**, and Saman reports `success:true` with `token:"-111"`/`url:null`. | Return the charge id + a redirectable URL; make `success` meaningful. |
| A11 | Content | `/shop/stories` links are external `http://` URLs; `HeaderCircleStrip` only exposes internal (`/`) links. | Confirm stories link to internal campaigns, or normalise. |
| A12 | Catalog | Products list returns `{items, pagination}` with totals, while orders/wallet are flat arrays without metadata. | Consider one pagination convention. |

## What could not be exercised

- **Successful card payment / gateway callback** — no gateway starts a session
  (Mellat/Melli refuse, Saman `-111`), so `/payment-result?pid=…` never received
  a real `pid`.
- **`POST /auth/login-with-password` success** — the account has no password
  (`has_password:false`); only the 422 policy response was observed.
- **Avatar upload** — avoiding a permanent profile change; only the missing-file
  422 was checked (and `DELETE` is 405).
- **Email / birthday / legal / bank writes with real values** — avoided to leave
  the account untouched; validation paths confirmed instead.
- **Wallet ledger rows** — the account has zero transactions, so `in_out`,
  `reason_title` and amount signs remain unobserved.

## Side effects of the sweep (all reversible / expected)

- One temporary address (id 2) created, updated, deleted.
- One comment (id 45) created, edited, reacted to, deleted.
- One ticket (id 1) created, replied to, closed (no DELETE endpoint exists).
- Favorites toggled on product 1 and toggled back off.
- Cart built and emptied; `checkout` on an empty cart rejected.
- `reset-password/send-code` sent one SMS; no password was changed.
- Token refreshed once and logged out at the end.
- Three invoices (31–33) remain from the earlier payment-path probe; all
  `waiting_payment`, `paid_price: 0`.

---

## 10. 2026-11-02 delta (`api-changes-2.pdf`)

The authenticated sweep above still dates from 2026-10-31. For the 2026-11-02
round the checks were **unauthenticated reachability + OpenAPI inspection**
(no test credentials were available), so the verdicts below mean “the route
exists and the spec matches the PDF”, not “the happy path was exercised”.

### New endpoints

| Endpoint | Auth | Status | Contract (PDF + spec) | Verdict |
| --- | --- | --- | --- | --- |
| `POST /shop/order/{invoice}/cancel` | bearer | **401** | `{description?}`; allowed `completing`/`waiting`/`waiting_payment`/`paid`; 422 `invoice_cancel_invalid_status` | ✅ route |
| `POST /shop/order/{invoice}/refer` | bearer | **401** | `{items:[{item_id,count,description?}]}` → 201; paid-only, one request per invoice, 24 h window | ✅ route |
| `GET /shop/order/refers` | bearer | **401** | `step` incl. `all`, `per_page` 1–100 (default 15), `page` | ✅ route |
| `POST /shop/order/{invoice}/repay` | bearer | **401** | `{payment_method_id, device?}` → `CheckoutResource` | ✅ route |
| `GET /shop/user/dashboard` | bearer | **401** | `cancelled_invoices`, `in_progress_invoices`, `other_invoices`, `tickets_awaiting_reply` | ✅ route |
| `POST /shop/products/{slug}/notify` | bearer | **401** | `{channel: sms / email / both, stock_id?}`; contacts from profile; idempotent | ✅ route |
| `DELETE /shop/user/profile/avatar` | bearer | **401** | idempotent 200; **was 405** on 2026-10-31 | ✅ fixed |

### Changed endpoints / payloads

| Endpoint | 2026-11-02 change | Frontend |
| --- | --- | --- |
| `GET /shop/order` | `data.items` + `data.pagination`; `type=all`; `status=current/delivered/cancelled` aliases | `listPayload()`; page sends `type: 'all'` |
| `GET /shop/order/{invoice}` | `items[]` (`UserOrderItemResource`: id, title, store, count, prices, status, stock, product) | detail + return item selection |
| `GET /shop/wallet/transactions` | `data.items` + `data.pagination` | `listPayload()` + `has_more_pages` |
| `POST /shop/user/ticket` | multipart `file` (max 5 MB) | create dialog/sheet upload |
| `PUT /shop/user/profile/legal-information` | `company_name` + `company_register_id` required | dialog already enforces |
| `CartItemResource` | `product_slug` serialised again | cart line links to `/product/<slug>` |
| `POST /shop/cart/set-shipping` | 422 `cart_receive_date_wrong_weekday` | API message surfaced; date chips already weekday-matched |
| `TicketResource.priority` | `medium` label «اولویت متوسط» | API label preferred |
| Public product lists | `data.items` + `data.pagination` (live 2026-11-02) | `listPayload()` |

### Spec drift still present

`/shop/order`, `/shop/wallet/transactions` and `/shop/order/refers` still
document a bare `data: []` (refers adds a root `pagination`); `legal-information`
still has no `required` array in the snapshot used for the 2026-11-02 sweep.
Everything else from the PDF (`cancel`, `refer`, `refers`, `repay`, `dashboard`,
`notify`, order `items`, `type=all`/aliases, ticket-create `file`) is in the
OpenAPI document. The drift on the list envelopes / `legal-information` was
re-checked in the 2026-11-03 round and is no longer tracked as a separate gap —
see §11.

---

## 11. 2026-11-03 delta (`nov-3.pdf`)

Like the previous round, this was verified against the PDF + OpenAPI document and
unauthenticated live calls; authenticated write paths were not exercised.

### New / changed endpoints

| Endpoint | Auth | Status | Contract | Frontend |
| --- | --- | --- | --- | --- |
| `GET /shop/public/about` | public | 200 | `about_us` (HTML), `about_us_link?`, `seo_about` | `useAboutPage()`; appended below the designed about page |
| `GET /shop/public/contact` | public | 200 | phones, mobile, email, address, socials, `contact_popup`, `contact_popup_status` | `useContactPage()`; contact page + floating widget |
| `POST /shop/contact-us` | public | route exists | `{name?, title, contact, description}`; `contact` = email or 11-digit mobile; 422 field errors | `contact-us.vue` form |
| `GET /shop/user/dashboard` | bearer | **401** | adds `last_visited_product[]` (product + `last_visited_at`) | `useDashboard().recentlyViewed` (≤3) |
| `GET /shop/products/{slug}` | public | 200 | records the visit server-side (no client change) | — |
| `POST /shop/payment/pay` | bearer | **401** | starts a payment for an invoice | gateway hand-off |
| `GET\|POST /shop/payment/verify/{gate}` | public | route exists | gateway callback; the browser return is `/payment-result?pid=<order_id>` | `payment-result.vue` resolves `pid` via `GET /shop/order/{id}` |

### Notes

- `pid` in `/payment-result?pid=…` is the **plain order id**, not a hash — the
  newest-invoice heuristic is now only a fallback for a missing/unknown `pid`.
- The about page keeps its designed hero and sections; only the API article is
  appended, so a missing `about_us` leaves the page unchanged.
- `contact_popup` is a JSON-encoded array; malformed rows are dropped and the
  widget requires `contact_popup_status === 'enable'`.
- Products now gain visit history implicitly through the detail endpoint, so the
  dashboard cards work without any extra client call.

Open items after this round (gateway sessions, per-gateway fields,
`wallet/charge` identifier, remaining static pages) are in
[`api-backend-gaps-open.md`](./api-backend-gaps-open.md#summary).
