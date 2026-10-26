# Backend gaps — follow-up after the 2026-10-25 backend update

Companion to `docs/api-integration.md`. This version replaces the 2026-10-23
gap list with the backend changes delivered on **2026-10-25** and the frontend
work applied on **2026-10-26**.

Base: `https://new.ahoma.ir/api` · OpenAPI: `/docs?api-docs.json`
Sources:

- backend change note **2026-10-25** (`API-CHANGES-2026-10-25.pdf`);
- the refreshed OpenAPI document (fetched 2026-10-26);
- the 2026-10-23 live probe results for the remaining open items.

Legend: **Resolved** · **Partial** · **Open**

---

## Resolved in this round

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

### 2. Checkout / orders — endpoints still absent

No create-order / checkout-submit endpoint, no payment gateway
init/callback/verify, no order cancel or invoice download, and no
return-request endpoints (create/list/detail/cancel) in the spec. Shipping
methods, delivery days/time slots and their prices are also absent, as are
wallet balance / installment providers / credit providers.

**Ask:** confirm the intended checkout sequence and publish the endpoints.

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

1. Checkout submit + payment gateway init/callback/verify (blocks the whole
   checkout flow).
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

# cart line quantity (stock_id is required)
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"cart_item_id":1,"stock_id":45,"quantity":10}' "$BASE/shop/cart/add-qty"

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
