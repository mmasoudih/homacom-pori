# Backend API integration checklist

Source of truth: `https://new.ahoma.ir/api/documentation` (OpenAPI 3.0, "Homacom CRM API",
server `https://new.ahoma.ir`, Sanctum bearer auth).
Machine-readable spec: `https://new.ahoma.ir/docs?api-docs.json`.

Work is done in phases. Each phase is committed separately so it can be reverted
independently.

**Backend asks / missing data:** see [`api-backend-gaps.md`](./api-backend-gaps.md).
**Last updated:** 2026-10-26 (backend changes of 2026-10-25 applied).

## Current state (audit)

- [x] `NUXT_PUBLIC_API_BASE` configured (`https://new.ahoma.ir/api`).
- [x] Auth partially wired in `app/composables/useAuth.ts`: login, verify,
      login-with-password, forgot-password, reset-password.
- [x] `auth_token` cookie written on login.
- [x] Shared API client sends `Authorization` (with 401 refresh/retry).
- [x] Auth middleware, `X-Cart-Token` support, refresh and logout.
- [x] Every one of the 57 endpoints in the spec now has a client integration
      (catalog, product detail/comments, blog, brands/FAQ, banners/stories,
      header/footer, colours, cart, addresses, profile, orders, favorites,
      comments and tickets).
- [x] 2026-10-23 backend update applied: product-list prices/stock, cart
      min/max, favorites `item`, comment reactions, blog comments, single
      ticket, legal/bank/password/avatar profile endpoints.
- [x] 2026-10-25 backend update applied: orders list/detail, category filter,
      payment method, ticket departments, cart quantity contract, coupon
      message, cart item projection, `profile/me`, ticket enum objects,
      product `suggested[]`, menu links, blog `rate`, list `is_favorite`, own
      pending comments.
- [x] 2026-10-29 backend update applied: public shipping/delivery-period/
      payment-method lookups, `cart/set-shipping`, delta `add-qty`/`sub-qty`,
      cart `totals` + selection, rotating refresh tokens, absolute media URLs,
      new gateways (Tara/Azki) — and `POST /cart/checkout` unblocked the whole
      checkout flow.
- [ ] Still designed-mock: returns tab, wallet charge/transactions,
      notifications, insurance/services after add-to-cart, static CMS pages.
- [x] No blocking backend bugs remain for the wired endpoints (the 2026-10-23
      order 500s, empty ticket departments and payment-method 404 are fixed).
- [ ] Still open: gateway callback result payload, order cancel/invoice,
      return requests — see `api-backend-gaps.md`.

## Phase 0 — Shared infrastructure

- [x] Typed API client (`useApi`) wrapping `$fetch` with `apiBase`.
- [x] Auto-attach `Authorization: Bearer <auth_token>` from cookie (client + SSR).
- [x] Central error normalizer for `{ success, message, data }` and
      401/403/422/429.
- [x] 401 → `POST /auth/refresh`, retry once; on failure clear token.
- [x] Persist `X-Cart-Token` for guest cart; send on cart endpoints.
- [x] Auth middleware for `/dashboard/**` and `/checkout` with redirect-back
      support.
- [x] Shared API types (`ApiEnvelope`, `ApiPagination`, `ApiError`).
- [x] Normalize relative media URLs (`resolveMediaUrl`).
- [x] Direct browser calls confirmed working: API reflects `Origin` in CORS and
      allows `authorization,content-type`.
- [x] Data reads are SSR (`useAsyncData` / top-level `await`), so the first
      paint contains API data instead of designed mocks. Public endpoints skip
      the bearer token; product detail retries without auth on a stale 401.

## Phase 1 — Auth (7 endpoints)

- [x] `POST /api/auth/login` → `app/pages/auth/login.vue`
- [x] `POST /api/auth/verify` → `app/pages/auth/verify.vue`
- [x] `POST /api/auth/login-with-password` → `app/pages/auth/login-with-password.vue`
- [x] `POST /api/auth/forgot-password` → `app/pages/auth/forgot-password.vue`
- [x] `POST /api/auth/reset-password` → `app/pages/auth/reset-password.vue`
- [x] `POST /api/auth/logout` → `app/components/dashboard/LogoutDialog.vue`
- [x] `POST /api/auth/refresh` → API client interceptor
- [x] Hydrate user via `GET /api/shop/user/profile/me`.
- [ ] Pre-emptive refresh from `token_expire` (currently refresh only on a 401).

## Phase 2 — Global shell / CMS (6 Public + Banner + Story)

- [x] `GET /api/shop/public/site-header` → header logo/phone/menus
      (menus with links replace the designed nav; all-null live data falls back)
- [x] `GET /api/shop/public/product-category` → `categories/*` (mega + mobile)
      and the landing category tiles; mock tree as fallback
- [x] `GET /api/shop/public/footer` → footer logo/contact/menus/about/copyright
      (designed columns kept per column when the API menu has no links)
- [x] Blog header nav prefers `/shop/public/blog-header`, falling back to
      `/shop/public/blog-category`
- [x] `GET /api/shop/public/blog-category` → blog nav/drawer (mock tree as
      fallback)
- [x] `GET /api/shop/public/colors` → search colour facet (designed swatches as
      fallback; live colour titles are still placeholder data)
- [x] `GET /api/shop/banners?filters[position]=` → landing hero + banner rows
      (mock banners per slot as fallback)
- [x] `GET /api/shop/stories` → header story strip (`HeaderCircleStrip`)

## Phase 3 — Catalog, search, product detail

- [x] `GET /api/shop/products` (q, ids, pagination) → header search + `search.vue`
      (prices, stock, colours and `order_count` now come from the list payload —
      no per-result detail call)
- [x] Landing carousels (`جدیدترین`, `پرفروش‌ترین`) → API products
      (`filters[sort]=newest` / `more_invoice`)
- [x] Landing carousels no longer pay for one detail request per card.
- [x] `GET /api/shop/products/{slug}` → `product/[id].vue` + `product-detail/*`
      (gallery, colors, stocks/price, warranties, services, questions, SEO;
      mock product kept as fallback)
- [x] Product detail honours `min_in_cart` and picks the stock matching the
      selected colour + warranty.
- [x] `suggested[]` entries carry real `img`, `title`, `slug` and
      `cheapest_stock`; the «در کنارش خریداری شده» row shows price and
      availability instead of the designed mocks.
- [x] `GET /api/shop/products/{id}/comments` → comments section/sheet
      (likes/dislikes come from `reaction_up` / `reaction_down`)
- [x] `POST /api/shop/user/comments/{id}/reaction` → comment thumbs
- [x] Replace `useProductSearch` / `useSearchResults` data with the API
- [x] Debounced header search suggestions
- [ ] `useSearchFilters` facets are still applied client-side; API brand ids
      are mapped by title, unsupported brands fall out of facets
- [x] `filters[categories][]` accepts real category ids (children included) —
      the landing category panels each fetch their own product pool

## Phase 4 — Blog

- [x] `GET /api/shop/blogs` → `blog/index.vue` (latest row + one section per
      category)
- [x] `GET /api/shop/blogs/category/{category}` → `blog/[category]/index.vue`
      (pagination)
- [x] `GET /api/shop/blogs/{slug}` → `blog/[category]/[slug].vue` (body, sidebar
      rails, related posts)
- [x] Search → `blog/search.vue` filters the loaded blog home payload
      client-side (the backend accepts `filters[s]` but ignores it)
- [x] Blog comments → `GET /api/shop/blogs/{id}/comments`; new comments post to
      `/shop/user/comments` with `relate_to: "post"`
- [x] Blog article rating reads the new 0–5 `rate` field; `star`/`total_rating`
      are documented as decorative/cached and no longer drive the UI
- [x] Own pending comments appear in the blog comment thread with a
      «دیدگاه شما در انتظار تایید است» banner and per-comment badge
- [ ] Blog category title still needs the extra `/shop/public/blog-category`
      request

## Phase 5 — Addresses & locations

- [x] `GET /api/address/states` → `useStates()` (ready for address forms)
- [x] `GET /api/address/cities?filters[parent_id]=` → `useCities()`
- [x] `GET/DELETE /api/shop/user/address` → dashboard addresses list/delete
- [x] `POST/PUT /api/shop/user/address` → `useUserAddresses()` (forms not wired yet)
- [x] Dashboard add/edit dialog wired to the CRUD composable (state/city
      selects from the API)
- [x] Map fields: `title, state, city, address, lat, lng, mobile, nickname,
      code_melli, zip_code` (plaque/floor/unit are not in the dialog yet)
- [x] Checkout's map-based add-address wizard now POSTs the address (resolves
      province/city names to API ids; uses the profile national code)
- [ ] New addresses without a map pin use Tehran's default lat/lng.

## Phase 6 — Cart (8 endpoints)

- [x] Rewrite `useCart.ts` from localStorage/mock to server cart (mock products
      still use the local fallback)
- [x] `GET /api/shop/cart` (server + guest `X-Cart-Token`)
- [x] `POST /api/shop/cart/add-to-cart` (`stock_id`, `quantity`, `services[]`)
- [x] `POST /api/shop/cart/add-qty` / `sub-qty` are **delta** calls: body is
      `{ cart_item_id, cart_token }` only (one unit per request; the line is
      removed server-side at zero and min/max stock limits are enforced there)
- [x] `DELETE /api/shop/cart/item` (line remove + clear)
- [x] `POST /api/shop/cart/set-user-address` → checkout address selection
- [x] `POST /api/shop/cart/set/payment-method` persists the selection (slash
      alias of `set-payment-method`; all five enum values valid)
- [x] `POST /api/shop/cart/set-discount` (coupon apply/clear; invalid coupon
      now returns the user-facing Persian message)
- [x] Sync header badge + cart totals from API items (the cart itself is
      SSR-hydrated when an auth/cart cookie exists)
- [x] Cart stepper enforces `stock.min_in_cart` / `max_in_cart`; adding a
      product starts at the minimum quantity
- [x] `POST /api/shop/cart/set-shipping` persists the picked method, receive
      date and (only for `type: delivery`) the 30-minute period
- [x] `CartResource` now returns `address`, `payment_method(_fa)`, `shipping`,
      `delivery_period`, `receive_date` and the `totals` block; `useCart`
      exposes them as `selection` / `totals`
- [x] Cart totals prefer `totals.products_total` / `services_total` /
      `payable_price`, falling back to the local math for mock lines
- [x] Public lookups drive the checkout options: `/shop/public/shipping-methods`,
      `/shop/public/delivery-periods`, `/shop/public/payment-methods`
      (`useShopOptions()`, designed arrays only as an offline fallback)
- [ ] Insurance / add-on services chosen **after** a line exists are local-only
      — the API only accepts `services[]` at `add-to-cart` time and has no
      update-services endpoint
- [x] Cart item response carries `product_id`, `product_slug`, `stock_id`,
      `related_cart_item_id`, `color`, `size` and `warranty`; cart line titles
      link to `/product/<slug>` and the meta rows render the real variant
- [x] Checkout promo code applies through `applyCoupon()`; the real discount
      comes from the cart response
- [ ] Guest carts work with a client-generated `cart_token` (sent as
      `X-Cart-Token` + body); confirm login-time guest→user cart merge
- [x] Cart API totals confirmed to include services and the coupon
      (`payable_price = sub_total − discount_price`)

## Phase 7 — Checkout & orders (unblocked 2026-10-29)

- [x] `GET /api/shop/order?status=all&type=sales` → `dashboard/orders/index.vue`
      (one request; tabs group client-side)
- [x] `GET /api/shop/order/{invoice}` → order detail (full `UserOrderResponse`:
      receiver/address, shipping/carrier, payment, transactions, items; demo
      fallback removed)
- [x] `status` is optional and accepts `all`; `type` is optional; `?page=`
      returns 15/page with paginator metadata in headers
- [x] Order items carry image, colour, warranty and product slug; the detail
      payload includes invoice/code, delivery date, receiver and shipping cost
- [x] `POST /api/shop/cart/checkout` replaces the mock `settlePayment()`:
      `payment_method_id` from the public payment-methods list (+ `device`,
      `cart_token`); the response carries the invoice and the gateway hand-off
- [x] Gateway redirect helper (`app/utils/payment.ts`): POST form when
      `payment.data` has fields, otherwise `window.location.assign(payment.url)`;
      wallet/credit methods settle without a redirect
- [x] `/checkout` is gated behind login (the auth middleware now covers
      `/checkout` as well as `/dashboard`) — both `set-shipping` and `checkout`
      are auth-only
- [ ] **Blocked:** no order cancel, invoice, or return-request endpoints in spec.
- [ ] **Blocked:** gateway callback/verify is server-to-server; the browser lands
      back on the site with no result payload, so only the invoice id returned by
      `checkout` links a payment to its order.
- [ ] Returns tab still renders the designed mock data.
- [x] Checkout loads the user's saved addresses from the API
- [x] Checkout promo code applies via `POST /cart/set-discount` (real coupon
      amount now comes from `totals`), with the designed promo as visual fallback
- [x] Checkout shipping methods, delivery slots and gateways come from the
      public lookups; date chips are the next real dates whose weekday has a
      slot, and only `delivery` methods ask for the period
- [x] Wallet balance comes from `profile.credit`; installment providers include
      Azki, online gateways include Tara (icons fall back / hide when `image` is
      `null`)

## Phase 8 — Profile

- [x] `GET /api/shop/user/profile/me` → dashboard profile/account
      (Jalali birthdate conversion + mock fallback)
- [x] `PUT /api/shop/user/profile/base-information`
- [x] `PUT /api/shop/user/profile/email`
- [x] `PUT /api/shop/user/profile/national-code`
- [x] `PUT /api/shop/user/profile/birthday`
- [x] `GET/PUT /api/shop/user/profile/legal-information` (replaces
      `company-information`; includes state/city ids and address)
- [x] `PUT /api/shop/user/profile/bank-information`
- [x] `POST /api/shop/user/profile/reset-password/send-code` +
      `POST /api/shop/user/profile/reset-password` (two-step password dialog)
- [x] `POST /api/shop/user/profile/avatar` (multipart upload + preview)
- [x] `profile/me` returns `mobile`, `nickname`, `username`, `credit`,
      `currency`, `bank_card_number`, `bank_shaba_number`, `avatar` and
      `has_password`; the account page prefills them after reload and the
      dashboard wallet shows the real credit balance
- [ ] Avatar delete still returns 405 (the remove action stays informational)

## Phase 9 — Favorites

- [x] `GET /api/shop/user/favorite?filters[relate_to]=` → dashboard favorites
      (the response now includes the related `item`, including
      `cheapest_stock`; no extra product/detail requests)
- [x] `POST /api/shop/user/favorite` toggle → dashboard remove/toggle composable
      (`relate_to` + `relate_id` only)
- [x] Wire the product-detail heart to `useFavorites().toggle()`
- [x] Reflect `is_favorite` from the product-detail response
- [x] Product **list** items carry `is_favorite` for authenticated requests;
      search cards render a real heart and guests get no key

## Phase 10 — User comments

- [x] `GET /api/shop/user/comments` → dashboard comments (mine + pending)
- [x] `POST /api/shop/user/comments` → product and blog comment form
- [x] `DELETE /api/shop/user/comments/{id}` → dashboard delete
- [x] `PUT /api/shop/user/comments/{id}` → dashboard edit dialog
- [x] `POST /api/shop/user/comments/{id}/reaction` → product comment thumbs
      (`reaction_up` / `reaction_down` now mapped; same type removes)
- [x] `GET /api/shop/blogs/{id}/comments` → article comments
      (create uses `relate_to: "post"`; approved comments plus the viewer's own
      pending ones)
- [ ] Comment status values are still undocumented (the UI treats `pending`
      and `rejected` specially; everything else as approved)

## Phase 11 — Tickets

- [x] `GET /api/shop/user/ticket/departments` → new-ticket department select
      (four seeded departments, ids 1–4; production must run the seeder once)
- [x] `GET /api/shop/user/ticket` (status, department, q, sort, pagination)
- [x] `GET /api/shop/user/ticket/{ticket}` → single ticket + messages
- [x] `POST /api/shop/user/ticket`
- [x] `GET /api/shop/user/ticket/{ticket}/messages` (kept for the reply flow)
- [x] `POST /api/shop/user/ticket/{ticket}/reply` (multipart attachment via
      `file`, max 5 MB; rendered from `file_url`)
- [x] `POST /api/shop/user/ticket/{ticket}/close`
- [x] Message author comes from `is_support`; `new`/`answer`/`waiting`/`closed`
      statuses are mapped
- [x] New-ticket form has a `low/medium/top` priority selector
- [ ] No delete-ticket endpoint: the list's delete action closes the ticket.
- [x] `ticket/departments` is seeded, so ticket creation succeeds again.
- [ ] Create-ticket body does not accept a file (only reply does); the create
      dialog's attachment picker remains UI-only.
- [x] `TicketResource.status` / `.priority` are `{ value, label }` objects; the
      status chip displays the API label (flat-string payloads still accepted).

## Phase 12 — Static/CMS pages (no endpoints in spec)

- [x] `GET /api/shop/faqs` → `faq.vue` (mock content as fallback)
- [x] `GET /api/shop/brands` → `brands.vue`, `landing/BrandsSection`
- [x] Header/footer/blog menu `link` values are resolved absolute URLs; the
      designed navigation is only a fallback for link-less rows (the footer's
      five group headers are dropdown parents by design).
- [ ] Blog category title still requires the extra
      `GET /shop/public/blog-category` call.
- [ ] Blog `filters[s]` is ignored by the backend.
- [ ] Confirm backend for: about, terms, guarantee, installment, contact, branch,
      collaboration, notifications (none in the spec — see gaps doc)
- [ ] Keep mock or move to CMS — decision needed

## Known gaps / decisions

1. **CORS**: confirmed for local dev; production origin must be allowed.
2. **Checkout is wired** (2026-10-29): `POST /cart/checkout` creates the invoice
   and returns the gateway redirect. Returns, order cancel/refund and
   notifications are still absent from the spec — see `api-backend-gaps.md`.
3. **Orders are fixed** (2026-10-25): one `status=all` request returns every
   order; detail returns the full `UserOrderResponse`.
4. **Guest cart** works with a client-generated `cart_token`; the token is still
   sent on `checkout` so the server can move a guest cart to the account.
5. **Product list prices/stock no longer need an N+1** — `cheapest_stock` is
   used directly. Favorites also return the related `item`.
6. **Category filter is fixed**: `filters[categories][]` accepts real ids and
   each landing panel fetches its own pool.
7. **Payment method selection is fixed**: the slash alias persists all five
   enum values; the invoice's actual gateway is chosen by `payment_method_id`
   at checkout.
8. **Ticket departments are seeded** (ids 1–4) and ticket creation works.
9. **Cart quantity contract** (2026-10-29): `add-qty`/`sub-qty` are delta calls
   (`cart_item_id` only); min/max are enforced server-side.
10. **Ticket enums are objects** (`{ value, label }`) for `status` and
    `priority`; flat strings remain tolerated.
11. **Remaining blockers**: gateway callback/result payload, returns, cart line
    service updates, ticket delete/attachment, static pages and notifications —
    all absent from the spec.
12. **OpenAPI codegen**: types are hand-written per feature; consider
    `openapi-typescript` once the payloads stabilise.
