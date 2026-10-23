# Backend gaps — follow-up after the 2026-10-23 backend update

Companion to `docs/api-integration.md`. This version re-tests every item from
the previous gap list against the live API after the backend changes.

Base: `https://new.ahoma.ir/api` · OpenAPI: `/docs?api-docs.json`
Checked: **2026-10-23** with a real customer bearer token.

Legend: **Resolved** · **Partial** · **Open** · **Blocked**

---

## Resolved

| # | Change | Evidence |
| --- | --- | --- |
| 1 | Product list returns `cheapest_stock` (`id`, `customer_price`, `discount`, `quantity`, `min_in_cart`, `max_in_cart`, `is_default`), real `colors[]` with `id`/`code`/`title`, `rate`, `score`, `order_count`, `view_count`, `categories`, `brand` | `GET /shop/products?per_page=1` |
| 2 | Product list accepts `filters[sort]=more_invoice`, `more_view_count`, `cheapest`, `expensive`, `newest` | all return 200 |
| 3 | Product list returns `pagination` | `data.pagination` |
| 4 | Product list filters `colors[]`, `only_exists`, `price_more_than`, `price_less_than`, `brands[]`, `ids[]`, `vip`, `homa_off` work | 200 with filtered counts |
| 5 | Product detail exposes `is_favorite` for authenticated requests | `is_favorite: true` after favoriting |
| 6 | Product detail stocks expose `min_in_cart` / `max_in_cart`; the API enforces the minimum (422 below it) | `stock.min_in_cart`, `quantity نباید کوچکتر از N باشد` |
| 7 | `service_groups[]` now include `selection_mode`, `max_selections`; items include `off_price`, `off_price_ended_at`, `service_type` | `GET /shop/products/{slug}` |
| 8 | Product comments include `reaction_up` / `reaction_down`; the reaction endpoint toggles | `POST /shop/user/comments/{id}/reaction` → `{reaction_up, reaction_down, reaction}` |
| 9 | Favorites now return the full related `item` (including `cheapest_stock`) | `GET /shop/user/favorite?filters[relate_to]=product` |
| 10 | Favorite toggle no longer needs `action`; `POST` with `relate_to` + `relate_id` toggles | `data.added` true/false |
| 11 | Cart totals include services and coupon | `totals.payable_price = sub_total − discount_price` |
| 12 | Single ticket endpoint exists with messages and `is_support` | `GET /shop/user/ticket/{id}` (OpenAPI + 404 shape verified) |
| 13 | Ticket `priority` / `status` enums are documented (`low/medium/top`, `new/answer/waiting/closed`) | OpenAPI `TicketResource` |
| 14 | Ticket reply accepts an optional attachment (`file`, max 5 MB, multipart) | OpenAPI reply body |
| 15 | `GET/PUT /shop/user/profile/legal-information` replaces `company-information` and adds `company_state_id`, `company_city_id`, `company_address`, `company_establishment_date` | `GET` returns the full object |
| 16 | `PUT /shop/user/profile/bank-information` | 200, returns card/sheba/avatar |
| 17 | Authenticated password change: `POST reset-password/send-code` + `POST reset-password` (`active_code`, `password`, confirmation) | OpenAPI |
| 18 | Avatar upload: `POST /shop/user/profile/avatar` (multipart, jpg/png/webp/gif, max 2 MB) | OpenAPI |
| 19 | Blog comments endpoint: `GET /shop/blogs/{id}/comments` | 200 `data: []` / active comments |
| 20 | Blog comments create through `POST /shop/user/comments` with `relate_to: "post"` | 201 (`"blog"` is rejected with 422) |
| 21 | `GET /shop/public/blog-header` exists; frontend already prefers it | 200 |

### Notes on the resolved items

- `cheapest_stock` has **no `real_price`**. The frontend derives the
  struck-through price from `discount` (treated as a percentage).
- `color` objects in the list now carry real API ids, so the search colour
  facet (`/shop/public/colors`) matches. The colour *titles* are still dummy
  data (`"Dr."`, `"Mrs."`, `title_en: "LavenderBlush"`).
- The list payload still has no storage/`حافظه داخلی` label. `size` is physical
  dimensions (`length/width/height/weight`), and the cart `stock.size` is a
  variant size (`"XL"`, `"Mrs."`), not storage.
- `suggested` products still have `img: null` and no price (`GET
  /shop/products/{slug}`), so the «در کنارش خریداری شده» row still uses the
  designed mocks.
- `profile/me` still does **not** return bank/avatar/has-password, although the
  login response does. See the open items below.

---

## Still open

### 1. Category filter is still broken (high priority)

Every id is rejected, including ids that the product payload itself returns
and ids from `/shop/public/product-category`:

```http
GET /shop/products?filters[categories][]=1
GET /shop/products?filters[categories][]=2
GET /shop/products?filters[categories][]=8
GET /shop/products?filters[categories][]=103
GET /shop/products?filters[categories][]=104
GET /shop/products?filters[categories][]=105
```

All return:

```json
{ "message": "filters.categories.0 انتخاب شده، معتبر نیست." }
```

`filters[categories]=2` returns «باید آرایه باشد», while `filters[category]=2`
and `filters[category_id]=2` are silently ignored (unfiltered 200). The
landing «بهترین‌های هر دسته‌بندی» panels therefore still share one pool.

**Ask:** make the category rule accept existing category ids (including child
categories), or document the exact accepted ids/slugs and the expected
parameter name.

### 2. Cart item projection still does not match the OpenAPI schema

The live `CartItemResource` contains only:

```
id, title, image, customer_price, real_price, quantity,
services, services_total, line_total, stock
```

The schema documents top-level `product_id`, `stock_id`, `color`, `size`,
`warranty`, but the live response does not include them. There is no
`product_slug` anywhere, so cart line titles cannot link to the PDP and still
render `href="#"`. The nested `stock` does contain `id`, `color`, `size`,
`warranty`, `min_in_cart`, `max_in_cart`.

Example check:

```http
GET /shop/cart
# item keys: customer_price,id,image,line_total,quantity,real_price,services,services_total,stock,title
```

**Ask:** align the resource with the docs (at minimum `product_id` and
`product_slug`), or remove the fields from the schema.

### 3. Cart services / insurance cannot be changed after add-to-cart

`add-to-cart` accepts `services[]`, but there is still no endpoint to update or
remove services/insurance on an existing line. The cart's «افزودن خدمت» /
«افزودن بیمه» dialogs remain local-only.

**Ask:** provide a line-update endpoint, or confirm the intended flow.

### 4. `POST /shop/cart/set/payment-method` returns 404 for every value

Tested authenticated and as guest, with and without `cart_token` / `cart_id`,
for `online`, `wallet`, `installment`:

```json
{ "success": false, "message": "موردی یافت نشد", "data": null } // HTTP 404
```

The cart itself works and the auth token is valid, so this looks like a
backend lookup/config bug (possibly no payment-method rows). The enum still
only documents `online | pay_in_delivery | pay_in_person | mixed | manual`;
wallet/installment need a documented mapping.

### 5. Coupon error message is an untranslated key

```http
POST /shop/cart/set-discount {"coupon_code":"NOPE"}
```

returns HTTP 422 with:

```json
{ "success": false, "message": "shop::messages.coupon_not_found", "data": null }
```

**Ask:** return a user-facing Persian message and document the
invalid/expired/not-usable cases.

### 6. Orders API currently fails with HTTP 500

For the tested customer account, every order request returns
`500 {"message":"Server Error"}`:

```http
GET /shop/order?status=waiting&type=sales
GET /shop/order?status=paid&type=sales
GET /shop/order?status=delivery&type=sales
GET /shop/order?status=returned&type=sales
GET /shop/order?status=waiting&type=purchase
GET /shop/order?status=waiting&type=refer
GET /shop/order/1
```

`status=all` still returns 422 («وضعیت انتخاب شده، معتبر نیست»). The list still
requires both `status` and `type` and returns no pagination; the UI therefore
still fires one request per status and paginates client-side.

Still absent from the spec (unchanged):

- create order / submit checkout
- payment gateway init/callback/verify
- order cancel, invoice download
- return request create/list/detail/cancel
- shipping methods, delivery days/time slots and prices
- wallet balance / installment providers / credit providers

Order detail still lacks `invoice`/`code`, `delivery_date`, receiver
name/phone/full address, `shipping`, `transactions[]`, item
image/color/warranty/`product_slug`, and `status_fa`.

**Ask:** fix the 500s first, then add an `all`/group filter + pagination.

### 7. Profile read payload is missing bank/avatar/has-password

`GET /shop/user/profile/me` returns only:

```
id, fname, lname, email, code_melli, birthday, type,
company_name, company_register_id, company_national_code,
company_economic_code, company_ceo, company_tel
```

It does **not** return `bank_card_number`, `bank_shaba_number`, `avatar` or
`has_password`, even though the login response does. There is no `GET` for
bank info (only `PUT`). Consequences:

- after a page reload the account page cannot prefill card/sheba/avatar;
- `hasPassword` is unknown until the user changes the password;
- avatar removal has no endpoint (the upload response can only set it).

**Ask:** add those four fields to `profile/me`, add a `GET` for bank info (or
accept that it is write-only), and add avatar delete if the UI must support it.

### 8. Favorites list still has no `is_favorite` on products

`item` is now included (good), and product detail exposes `is_favorite`, but the
product list/detail response for list cards still has no `is_favorite`, so list
hearts cannot be pre-filled.

### 9. Ticket creation is blocked by empty departments

`GET /shop/user/ticket/departments` returns `data: []`, so
`POST /shop/user/ticket` fails:

```json
{ "message": "department id انتخاب شده، معتبر نیست" }
```

**Ask:** seed/expose active ticket departments. Also:

- no delete-ticket endpoint (the dashboard action still closes the ticket);
- create-ticket body does not accept a file (only reply does);
- `TicketResource` has `status`/`priority` but no `status_fa`/labels.

### 10. Blog and CMS

- **Blog category title:** `GET /shop/blogs/category/{category}` returns only
  `items` + `pagination`; the page still needs an extra
  `GET /shop/public/blog-category` for the title.
- **Blog search:** `GET /shop/blogs?filters[s]=…` is accepted but ignored
  (same 8 posts for every query); there is no dedicated search endpoint.
- **Blog rating:** `star` (e.g. 6) and `total_rating` (e.g. 131) still cannot
  produce a 0–5 score; the frontend hides the rating unless it is 1–5.
- **Blog header menu links:** `menus[]` items still have `link: null` and only
  `title`, so the designed navigation cannot be replaced.
- **Header/footer menus:** same problem — `link`, `target`, `class`, `icon`
  are null; footer `menu_1..4` are single title-only entries.
- **Static pages:** still no endpoints for about, terms, guarantee,
  installment, contact, branch, collaboration.
- **Notifications:** still no endpoint.
- **Compare:** still client-side only (no persistence endpoint).

### 11. Auth / transport

- Refresh-token behaviour is unchanged: `POST /auth/refresh` uses the current
  bearer token and returns `{ token }`; the client retries once on 401.
- `token_expire` is returned as `YYYY-MM-DD HH:mm:ss`. A token whose
  `token_expire` was already in the past still worked during this check, so
  either expiry is not enforced or the timezone/format needs documenting.
- CORS still needs the production origin allow-listed.
- The backend should confirm whether `success: false` can accompany HTTP 200;
  the client treats it as an error.

### 12. Assets

Still mixed: product galleries are absolute
(`https://new.ahoma.ir/storage/...`), while footer logos/store images are
relative (`uploads/...`). The client resolves relative paths against the API
origin; standardising or documenting the storage origin would remove the
guesswork.

---

## Suggested priority for the backend

1. Fix `GET /shop/order*` 500s and add `status=all` + pagination.
2. Fix `filters[categories][]` (landing panels depend on it).
3. Fix `POST /cart/set/payment-method` (checkout cannot persist payment).
4. Seed ticket departments.
5. Add `product_id` + `product_slug` to `CartItemResource`.
6. Add bank/avatar/has-password to `profile/me`.
7. Return user-facing coupon errors.
8. Add services/insurance update for an existing cart line.
9. Add `is_favorite` to product list items.
10. Populate menu links and blog category titles; add blog search and rating.

---

## Reproduce quickly

```bash
BASE=https://new.ahoma.ir/api
TOKEN='<customer bearer token>'

# category filter
curl -g "$BASE/shop/products?filters[categories][]=8&filters[per_page]=1"

# sorts
for s in more_invoice more_view_count cheapest expensive newest; do
  curl -s "$BASE/shop/products?filters[sort]=$s&filters[per_page]=1" >/dev/null
done

# cart item projection
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/cart"

# payment method
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"payment_method":"online"}' "$BASE/shop/cart/set/payment-method"

# coupon error
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"coupon_code":"NOPE"}' "$BASE/shop/cart/set-discount"

# orders
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/order?status=paid&type=sales"

# departments
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/user/ticket/departments"

# profile read
curl -s -H "Authorization: Bearer $TOKEN" "$BASE/shop/user/profile/me"

# blog comments create relation
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"t","content":"test comment body","relate_to":"post","relate_id":1,"score":5}' \
  "$BASE/shop/user/comments"
```
