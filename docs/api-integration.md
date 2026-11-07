# Backend API integration checklist

Source of truth: `https://new.ahoma.ir/api/documentation` (OpenAPI 3.0, "Homacom CRM API",
server `https://new.ahoma.ir`, Sanctum bearer auth).
Machine-readable spec: `https://new.ahoma.ir/docs?api-docs.json`.

Work is done in phases. Each phase is committed separately so it can be reverted
independently.

**Backend asks / missing data:** see [`api-backend-gaps.md`](./api-backend-gaps.md)
(history + evidence) and [`api-backend-gaps-open.md`](./api-backend-gaps-open.md)
(open items only).
**Live endpoint status (2026-10-31 sweep + 2026-11-02 / 2026-11-03 deltas):**
[`api-endpoint-matrix.md`](./api-endpoint-matrix.md).
**Last updated:** 2026-11-03 (applied the `nov-3.pdf` round: public about/contact
CMS, contact form, dashboard recently-viewed and the `pid` order-id resolver).

## Current state (audit)

- [x] `NUXT_PUBLIC_API_BASE` configured (`https://new.ahoma.ir/api`).
- [x] Auth partially wired in `app/composables/useAuth.ts`: login, verify,
      login-with-password, forgot-password, reset-password.
- [x] `auth_token` cookie written on login.
- [x] Shared API client sends `Authorization` (with 401 refresh/retry).
- [x] Auth middleware, `X-Cart-Token` support, refresh and logout.
- [x] Every endpoint in the OpenAPI spec now has a client integration
      (catalog, product detail/comments, blog, brands/FAQ, banners/stories,
      header/footer, colours, cart, addresses, profile, orders, favorites,
      comments and tickets); the live sweep covers 73 method/path pairs — see
      [`api-endpoint-matrix.md`](./api-endpoint-matrix.md).
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
- [x] 2026-11-02 backend update applied (`api-changes-2.pdf`): order
      cancel/refer/refers/repay, `GET /user/dashboard`, restock notify,
      `data.items` + `data.pagination` envelopes, order `items[]`,
      `type=all` + status tab aliases, avatar delete, ticket-create `file`,
      `product_slug` fix, weekday validation and corrected ticket labels.
- [x] 2026-11-03 backend update applied (`nov-3.pdf`): public `about` +
      `contact` CMS content, `POST /shop/contact-us`, dashboard
      `last_visited_product`, product-detail visit tracking and the payment
      `pid` = plain order id resolver.
- [x] Wallet is real (2026-10-29 round 2): balance from `profile.credit`,
      ledger from `GET /shop/wallet/transactions`, top-up from
      `POST /shop/wallet/charge` → gateway (`/dashboard/wallet`).
- [ ] Still designed-mock: notifications feed, insurance/services after
      add-to-cart. Static pages are real where the backend publishes content
      (`about`, `contact` — 2026-11-03); terms/guarantee/installment/branch/
      collaboration remain static. Returns and paying an existing invoice are
      now real (2026-11-02).
- [x] No blocking backend bugs remain for the wired endpoints (the 2026-10-23
      order 500s, empty ticket departments and payment-method 404 are fixed).
- [ ] Still open: gateway checkout/callback (no gateway starts a session),
      cart line services, and the spec drift on list envelopes — see
      `api-backend-gaps-open.md`.

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
- [x] `POST /api/shop/products/{slug}/notify` `{channel, stock_id?}` →
      out-of-stock notify dialog (2026-11-02); contacts come from the profile,
      guests are sent to login, repeats are idempotent and the API `message` is
      the toast.

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
      `{ cart_item_id, cart_token }` only (one unit per request; min/max stock
      limits are enforced server-side — at `min_in_cart` the call 422s rather
      than deleting the line). Sending a `cart_token` that does not resolve to
      the user's cart also 422s with «قلم سفارش … یافت نشد».
- [x] `DELETE /api/shop/cart/item` (line remove + clear)
- [x] `POST /api/shop/cart/set-user-address` → checkout address selection
      (runtime also requires `cart_token`, although the OpenAPI body lists only
      `user_address_id`)
- [x] `POST /api/shop/cart/set-payment-method`: the slash alias is still **404**
      (regression since 2026-10-31); `useCart.setPaymentMethod()` now posts the
      working dash route (`/shop/cart/set-payment-method`). The OpenAPI spec
      still lists only the slash path.
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
      link to `/product/<slug>` and the meta rows render the real variant.
      `product_slug` is serialised again since 2026-11-02 (the id fallback is
      kept for old carts).
- [x] Checkout promo code applies through `applyCoupon()`; the real discount
      comes from the cart response
- [ ] Guest carts work with a client-generated `cart_token` (sent as
      `X-Cart-Token` + body); confirm login-time guest→user cart merge
- [x] Cart API totals confirmed to include services and the coupon
      (`payable_price = sub_total − discount_price`)

## Phase 7 — Checkout & orders (unblocked 2026-10-29)

- [x] `GET /api/shop/order` → `dashboard/orders/index.vue`: `status`, `type`
      (`all|sales|refer|purchase`), `payment_status`
      (`waiting_payment|slice_payment|done`), `per_page` 1…100 and `page`.
      Since 2026-11-02 the list returns `data.items` + `data.pagination`, so
      `useOrders.load()` follows `has_more_pages` (cap 10 × 100 rows) instead of
      the short-page heuristic. Tabs use the backend aliases
      `current`/`delivered`/`cancelled` and the page sends `type: 'all'`. The
      payment axis is exposed via `?payment=` and `load({ paymentStatus })`.
      Bad filters are rejected client-side and a 422 is surfaced as a toast.
- [x] Sort is fixed server-side (`created_at desc, id desc`) — the client no
      longer re-sorts by id.
- [x] Order rows/detail map `payment_status`, `gate`, `payment_method`,
      `payable_price`, `paid_price` and `shipping_title`; the order detail shows
      a **وضعیت پرداخت** and a **درگاه پرداخت** row. `gate` is displayed instead
      of `payment_method`, which the settlement step rewrites to `manual`.
- [x] `GET /api/shop/order/{invoice}` → order detail (`UserOrderResponse`:
      receiver/address, shipping/carrier, payment, **`items[]`** since
      2026-11-02). Each `UserOrderItemResource` carries id, product title,
      store, count, prices, status, stock and product; the detail and the return
      flow render real line items.
- [x] `status` is optional and accepts `all`/the tab aliases; `type` accepts
      `all`; `?page=` returns 15/page and `data.pagination` reports the totals.
- [x] `POST /api/shop/order/{invoice}/cancel` `{description?}` → cancel dialog +
      mobile sheet; the reason is optional and the API `message` is the toast.
      Only `completing`/`waiting`/`waiting_payment`/`paid` invoices may cancel;
      `invoice_cancel_invalid_status` is shown verbatim.
- [x] `POST /api/shop/order/{invoice}/refer` `{items:[{item_id,count,description?}]}`
      → return-request page (item selection + quantity + reason, no image
      upload). Guards: paid-only, one request per invoice, 24 h window
      (`invoice_refer_must_be_paid`, `invoice_refer_already_requested`,
      `invoice_refer_window_expired`, `invoice_refer_items_not_found`).
- [x] `GET /api/shop/order/refers` (`step` incl. `all`, `per_page` 1–100) →
      returned tab + return detail (`useRefers`/`useReferDetail`). Rows only
      expose `sub_invoice_id`, so the product title/store is enriched from the
      parent order’s `items[]`.
- [x] `POST /api/shop/order/{invoice}/repay` `{payment_method_id, device?}` →
      `dashboard/orders/[id]/pay` with the real payment options and
      `redirectToGateway()`; the full envelope keeps the API `message`.
- [x] `POST /api/shop/cart/checkout` replaces the mock `settlePayment()`:
      `{ payment_method_id, device?, cart_token? }` (device is detected, not
      hard-coded); 201 returns `{ invoice, payment }`, where `invoice` omits
      `status`/`payment_status`/`paid_price`
- [x] `payment.success === false` keeps the created invoice: the cart is
      cleared, the API message is shown, and the browser goes to the invoice so
      the gateway can be retried — no phantom success. **2026-10-31 caveat:**
      `success:true` does not prove a redirect exists — Saman returns
      `success:true, url:null, token:"-111", data.RedirectURL` (a 404 server
      route), and `myCredit` returns an admin-only URL.
- [x] Gateway redirect helper (`app/utils/payment.ts`): POST form when
      `payment.data` is an object with fields, otherwise
      `window.location.assign(payment.url)`; a redirect nested in
      `payment.data` (string / `data.url` / `data.data.url`) is honoured, and
      non-object `data` is never turned into form fields
- [x] `/payment-result?pid=<payment id>` is the gateway return page: it
      reads `pid`, fetches the newest invoice (`per_page=1`) and refreshes the
      profile, then renders success / partial / not-confirmed states with a
      receipt and links to the orders and the wallet. **2026-10-31:** `hash_id`
      is a plain integer (`14146`, `14199`, `14252`), `/shop/payment/{id}` is
      404, and `POST /wallet/charge` returns no id — the newest-invoice guess is
      still the only path (`api-backend-gaps.md`).
- [x] `/checkout` is gated behind login (the auth middleware now covers
      `/checkout` as well as `/dashboard`) — both `set-shipping` and `checkout`
      are auth-only
- [x] `GET /api/shop/user/dashboard` → dashboard cards (`useDashboard`):
      `in_progress_invoices` (current), `cancelled_invoices` (cancelled),
      `other_invoices` (returned) and `tickets_awaiting_reply`.
- [x] Checkout loads the user's saved addresses from the API
- [x] Checkout promo code applies via `POST /cart/set-discount` (real coupon
      amount now comes from `totals`), with the designed promo as visual fallback
- [x] Checkout shipping methods, delivery slots and gateways come from the
      public lookups; date chips are the next real dates whose weekday has a
      slot, and only `delivery` methods ask for the period
- [x] Wallet balance comes from `profile.credit`; installment providers include
      Azki and **Tara** (the live `/public/payment-methods` lists both with
      `type: "installment"` — the PDF/round-1 note calling Tara `online` is
      wrong); online gateways are Mellat, Melli and Saman (icons fall back /
      hide when `image` is `null`)

### Wallet (2026-10-29 round 2)

- [x] `GET /api/shop/wallet/transactions` → `app/pages/dashboard/wallet`
      (`useWallet`). Filters are nested under `filters[...]` (`in_out`,
      `reason`, `payment_method`, `sort`, `per_page`, `page`); validated
      client-side because unknown values return 422 keyed `filters.*`.
- [x] Ledger rows use `reason_title` (falling back to `reason` only when it is
      empty — labels are never hard-coded), keep `amount` unsigned and take the
      direction from `in_out`; amounts are coloured by direction
      (`in` green / `out` red / `in_out` amber).
- [x] Pagination follows the 2026-11-02 envelope: `data.items` +
      `data.pagination`, and `loadMore()` appends while
      `pagination.has_more_pages` is true (a bare array falls back to the
      full-page heuristic).
- [x] `POST /api/shop/wallet/charge` `{ amount, payment_method_id, device }` →
      same `payment` shape, browser redirected to the gateway. `AddFundsDialog`
      picks an online gateway (wallet methods such as `myCredit` are rejected by
      the API), no longer fakes a credit, and tells the user the balance lands
      after confirmation. The returned `/payment-result` page refreshes
      `profile.credit`. **2026-10-31:** validation confirmed (amount > 0,
      wallet/installment ids 422) but no gateway starts a session — Mellat/Melli
      `success:false` with `data:[]`, Saman `token:"-111"`; the ledger stays
      empty until a callback credits it.

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
- [x] `DELETE /api/shop/user/profile/avatar` (2026-11-02; idempotent) wired to
      the account page remove action.
- [x] `profile/me` returns `mobile`, `nickname`, `username`, `credit`,
      `currency`, `bank_card_number`, `bank_shaba_number`, `avatar` and
      `has_password`; the account page prefills them after reload and the
      dashboard wallet shows the real credit balance
- [x] Avatar delete was 405 until 2026-11-02; `DELETE /user/profile/avatar` now
      works and the remove action calls it.

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
- [x] Create-ticket accepts multipart `file` (max 5 MB) since 2026-11-02; both
      create dialogs upload the chosen attachment.
- [x] `TicketResource.status` / `.priority` are `{ value, label }` objects; the
      status chip displays the API label (flat-string payloads still accepted).

## Phase 12 — Static/CMS pages

- [x] `GET /api/shop/faqs` → `faq.vue` (mock content as fallback)
- [x] `GET /api/shop/brands` → `brands.vue`, `landing/BrandsSection`
- [x] `GET /api/shop/public/about` → `about-us.vue` (2026-11-03): the designed
      hero/sections stay, the API `about_us` HTML is appended below them as a
      rich-text article, with an optional `about_us_link` CTA; `seo_about`
      drives the page title/description. Structured per-block payload request:
      [`about-page-content-contract.md`](./about-page-content-contract.md).
- [x] `GET /api/shop/public/contact` → `contact-us.vue` (2026-11-03): phones,
      mobile, email, address and social links are live; `contact_popup` +
      `contact_popup_status` drive the floating support widget, which only
      mounts on the contact page. Static-copy contract request:
      [`contact-page-content-contract.md`](./contact-page-content-contract.md).
- [x] `POST /api/shop/contact-us` → `contact-us.vue` (2026-11-03): the single
      contact field is validated as email or 11-digit mobile, and 422 field
      errors are mapped back onto the input.
- [x] Header/footer/blog menu `link` values are resolved absolute URLs; the
      designed navigation is only a fallback for link-less rows (the footer's
      five group headers are dropdown parents by design).
- [ ] Blog category title still requires the extra
      `GET /shop/public/blog-category` call.
- [ ] Blog `filters[s]` is ignored by the backend.
- [ ] Terms, guarantee, installment, branch and collaboration still have no
      endpoint (about/contact resolved 2026-11-03 — see gaps doc).
- [ ] Notifications feed stays mock until an endpoint exists

## Known gaps / decisions

1. **CORS**: confirmed for local dev; production origin must be allowed.
2. **Checkout is wired** (2026-10-29 round 2): `POST /cart/checkout` takes
   `{ payment_method_id, device, cart_token? }` and returns the invoice plus the
   gateway hand-off; `payment.success=false` is handled without faking a
   receipt. Since 2026-11-02 an existing invoice can be retried with
   `POST /order/{invoice}/repay`, and cancel/refer exist — but no gateway
   currently starts a session (see `api-backend-gaps-open.md`).
3. **Orders paginate** (2026-11-02): `GET /order` returns
   `data.items` + `data.pagination`, so the dashboard follows `has_more_pages`
   (cap 10 × 100) and shows real counts. `payment_status` is the paid/unpaid
   axis; `type=all` + the `current`/`delivered`/`cancelled` aliases drive the
   tabs.
4. **Guest cart** works with a client-generated `cart_token`; the token is still
   sent on `checkout` so the server can move a guest cart to the account.
5. **Product list prices/stock no longer need an N+1** — `cheapest_stock` is
   used directly. Favorites also return the related `item`.
6. **Category filter is fixed**: `filters[categories][]` accepts real ids and
   each landing panel fetches its own pool.
7. **Display `gate`, not `payment_method`**: settlement rewrites
   `payment_method` to `manual`, so the order detail and the result page render
   `gate`. The gateway is still selected by `payment_method_id` at checkout, and
   `gate` is the field that records what actually ran.
8. **`/payment-result?pid=…`** (2026-11-03): the gateway return link is
   `/payment-result?pid=<order_id>` and `pid` is the plain order id, so the page
   resolves it through `fetchOrderById` (`GET /shop/order/{id}`) and uses the
   authoritative invoice. The newest-invoice fallback (`per_page=1`) only
   remains for a missing or unknown `pid`, and the profile is refreshed so the
   wallet balance is current. See `api-backend-gaps-open.md`.
9. **Wallet is real** (2026-10-29 round 2): `GET /wallet/transactions` drives
   `/dashboard/wallet` (filters under `filters[...]`, `reason_title` labels,
   colour by `in_out`) and `POST /wallet/charge` drives the top-up dialog. The
   balance only moves after the gateway callback, so the client refreshes the
   profile on return instead of crediting locally.
10. **Ticket departments are seeded** (ids 1–4) and ticket creation works.
11. **Cart quantity contract** (2026-10-29): `add-qty`/`sub-qty` are delta calls
    (`cart_item_id` only); min/max are enforced server-side.
12. **Ticket enums are objects** (`{ value, label }`) for `status` and
    `priority`; flat strings remain tolerated.
13. **Remaining blockers**: gateway checkout/callback (no gateway starts a
    session), wallet callback semantics, cart line service updates, ticket
    delete and the notifications feed — see `api-backend-gaps-open.md`. The
    `pid` resolver, order cancel, returns, repay, avatar delete, ticket-create
    attachments and the about/contact CMS endpoints are resolved (2026-11-02 /
    2026-11-03).
14. **OpenAPI codegen**: types are hand-written per feature; consider
    `openapi-typescript` once the payloads stabilise.
