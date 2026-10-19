# Backend API integration checklist

Source of truth: `https://new.ahoma.ir/api/documentation` (OpenAPI 3.0, "Homacom CRM API",
server `https://new.ahoma.ir`, Sanctum bearer auth).
Machine-readable spec: `https://new.ahoma.ir/docs?api-docs.json`.

Work is done in phases. Each phase is committed separately so it can be reverted
independently.

**Backend asks / missing data:** see [`api-backend-gaps.md`](./api-backend-gaps.md).

## Current state (audit)

- [x] `NUXT_PUBLIC_API_BASE` configured (`https://new.ahoma.ir/api`).
- [x] Auth partially wired in `app/composables/useAuth.ts`: login, verify,
      login-with-password, forgot-password, reset-password.
- [x] `auth_token` cookie written on login.
- [x] Shared API client sends `Authorization` (with 401 refresh/retry).
- [x] Auth middleware, `X-Cart-Token` support, refresh and logout.
- [x] Catalog search, product detail/comments, blog, brands/FAQ, banners/stories,
      cart, addresses (list/delete), profile, orders, favorites, comments and
      tickets now read from the API.
- [ ] Still designed-mock: checkout submit/payment/returns, notifications,
      insurance/services after add-to-cart, static CMS pages, landing product
      carousels, address add/edit forms.

## Phase 0 — Shared infrastructure

- [x] Typed API client (`useApi`) wrapping `$fetch` with `apiBase`.
- [x] Auto-attach `Authorization: Bearer <auth_token>` from cookie (client + SSR).
- [x] Central error normalizer for `{ success, message, data }` and
      401/403/422/429.
- [x] 401 → `POST /auth/refresh`, retry once; on failure clear token.
- [x] Persist `X-Cart-Token` for guest cart; send on cart endpoints.
- [x] Auth middleware for `/dashboard/**` with redirect-back support.
- [x] Shared API types (`ApiEnvelope`, `ApiPagination`, `ApiError`).
- [x] Normalize relative media URLs (`resolveMediaUrl`).
- [x] Direct browser calls confirmed working: API reflects `Origin` in CORS and
      allows `authorization,content-type`.

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
- [x] `GET /api/shop/public/product-category` → `categories/*` (mega + mobile,
      mock tree as fallback)
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
      (prices enriched with one detail call per result — see gaps doc)
- [x] Landing carousels (`جدیدترین`, `پرفروش‌ترین`) → API products
      (`filters[sort]=newest`; best-seller sort still unavailable, so both rows
      currently use the default order)
- [ ] Landing carousels pay for one detail request per card to get prices.
- [x] `GET /api/shop/products/{slug}` → `product/[id].vue` + `product-detail/*`
      (gallery, colors, stocks/price, warranties, services, questions, SEO;
      mock product kept as fallback)
- [x] `GET /api/shop/products/{id}/comments` → comments section/sheet
- [x] Replace `useProductSearch` / `useSearchResults` data with the API
- [x] Debounced header search suggestions
- [ ] `useSearchFilters` facets are still the designed brand/colour lists;
      API brand ids are mapped by title, unsupported brands fall out of facets

## Phase 4 — Blog

- [x] `GET /api/shop/blogs` → `blog/index.vue` (latest row + one section per
      category)
- [x] `GET /api/shop/blogs/category/{category}` → `blog/[category]/index.vue`
      (pagination)
- [x] `GET /api/shop/blogs/{slug}` → `blog/[category]/[slug].vue` (body, sidebar
      rails, related posts)
- [x] Search → `blog/search.vue` filters the loaded blog home payload
      client-side (no dedicated blog-search endpoint in the spec)
- [ ] Blog comments (API has no blog-comment endpoints; article shows none)
- [ ] Blog article rating (API exposes `star`/`total_rating` but no 0–5 score)

## Phase 5 — Addresses & locations

- [x] `GET /api/address/states` → `useStates()` (ready for address forms)
- [x] `GET /api/address/cities?filters[parent_id]=` → `useCities()`
- [x] `GET/DELETE /api/shop/user/address` → dashboard addresses list/delete
- [x] `POST/PUT /api/shop/user/address` → `useUserAddresses()` (forms not wired yet)
- [x] Dashboard add/edit dialog wired to the CRUD composable (state/city
      selects from the API)
- [x] Map fields: `title, state, city, address, lat, lng, mobile, nickname,
      code_melli, zip_code` (plaque/floor/unit are not in the dialog yet)
- [ ] Checkout's map-based add-address wizard still adds locally; it does not
      carry lat/lng or state/city ids, so it cannot POST yet.
- [ ] New addresses without a map pin use Tehran's default lat/lng.

## Phase 6 — Cart (8 endpoints)

- [x] Rewrite `useCart.ts` from localStorage/mock to server cart (mock products
      still use the local fallback)
- [x] `GET /api/shop/cart` (server + guest `X-Cart-Token`)
- [x] `POST /api/shop/cart/add-to-cart` (`stock_id`, `quantity`, `services[]`)
- [x] `POST /api/shop/cart/add-qty` / `sub-qty`
- [x] `DELETE /api/shop/cart/item` (line remove + clear)
- [x] `POST /api/shop/cart/set-user-address` → checkout address selection
- [x] `POST /api/shop/cart/set/payment-method` → checkout payment selection
      (`online` + wallet→`online`; installment→`mixed`, mapping needs confirmation)
- [x] `POST /api/shop/cart/set-discount` (coupon apply/clear)
- [x] Sync header badge + cart totals from API items
- [ ] Insurance / add-on services chosen **after** a line exists are local-only
      — the API only accepts `services[]` at `add-to-cart` time and has no
      update-services endpoint
- [ ] Cart item response has no product slug/id → cart line titles link to `#`
      (needs `slug`/`product_id` in `CartItemResource`)
- [ ] Checkout promo-code UI still uses the local demo amount; `applyCoupon()` /
      `clearCoupon()` are ready but not wired into `useCheckout`
- [ ] Guest carts work with a client-generated `cart_token` (sent as
      `X-Cart-Token` + body); confirm login-time guest→user cart merge

## Phase 7 — Checkout & orders (partly blocked)

- [x] `GET /api/shop/order?status=&type=` → `dashboard/orders/index.vue`
      (merges the tab statuses; `type=sales`)
- [x] `GET /api/shop/order/{invoice}` → order detail (mapped available fields;
      mock order kept as fallback for demo ids)
- [ ] **Needed:** list endpoint should allow an "all"/group filter and return
      pagination; today every tab costs one request per status.
- [ ] **Needed in order payload:** invoice code, delivery date, receiver
      name/phone/address, shipping method/cost, transactions, item image,
      colour, warranty, and product slug (currently only id/title/qty/price).
- [ ] **Blocked:** no create-order / checkout-submit endpoint in spec.
- [ ] **Blocked:** no order cancel, invoice, or return-request endpoints in spec.
- [ ] **Blocked:** no payment gateway init/callback endpoint in spec.
- [ ] Returns tab still renders the designed mock data.
- [x] Checkout loads the user's saved addresses from the API
- [x] Checkout promo code applies via `POST /cart/set-discount` (real coupon
      amount now comes from `totals`), with the designed promo as visual fallback
- [ ] Checkout shipping methods, delivery slots, gateways, wallets and
      installment providers are still designed mocks (no endpoints).
- [ ] Checkout totals/shipping/payment cannot be persisted before submit (no
      submit endpoint).

## Phase 8 — Profile

- [x] `GET /api/shop/user/profile/me` → dashboard profile/account
      (Jalali birthdate conversion + mock fallback)
- [x] `PUT /api/shop/user/profile/base-information`
- [x] `PUT /api/shop/user/profile/email`
- [x] `PUT /api/shop/user/profile/national-code`
- [x] `PUT /api/shop/user/profile/birthday`
- [x] `PUT /api/shop/user/profile/company-information` (legal dialog now collects
      economic code + CEO; city/province/postalAddress remain UI-only)

## Phase 9 — Favorites

- [x] `GET /api/shop/user/favorite?filters[relate_to]=` → dashboard favorites
      (favorite records → product list by `filters[ids][]` → per-product detail
      for price)
- [x] `POST /api/shop/user/favorite` toggle → dashboard remove/toggle composable
- [x] Wire the product-detail heart to `useFavorites().toggle()`
- [x] Reflect `is_favorite` from the product-detail response
- [ ] Favorites list returns only IDs, forcing an extra product-list + N detail
      requests to render cards; a favorites endpoint with product summaries
      (title/image/price) would remove the N+1.

## Phase 10 — User comments

- [x] `GET /api/shop/user/comments` → dashboard comments (mine + pending)
- [x] `POST /api/shop/user/comments` → product comment form
- [x] `DELETE /api/shop/user/comments/{id}` → dashboard delete
- [x] `PUT /api/shop/user/comments/{id}` → dashboard edit dialog
- [ ] Comment likes/dislikes are not present in `UserCommentResource`
      (dashboard shows 0/0).

## Phase 11 — Tickets

- [x] `GET /api/shop/user/ticket/departments` → new-ticket department select
- [x] `GET /api/shop/user/ticket` (status, department, q, sort, pagination)
- [x] `POST /api/shop/user/ticket`
- [x] `GET /api/shop/user/ticket/{ticket}/messages`
- [x] `POST /api/shop/user/ticket/{ticket}/reply`
- [x] `POST /api/shop/user/ticket/{ticket}/close`
- [ ] No delete-ticket endpoint: the list's delete action closes the ticket.
- [ ] Ticket create always sends `priority: medium` (no priority selector).
- [ ] Ticket attachments are UI-only (no upload endpoint in the spec).
- [ ] Message author is inferred from `supporter.id` vs `user_id`; there is no
      explicit author/role field in `TicketMessageResource`.

## Phase 12 — Static/CMS pages (no endpoints in spec)

- [x] `GET /api/shop/faqs` → `faq.vue` (mock content as fallback)
- [x] `GET /api/shop/brands` → `brands.vue`, `landing/BrandsSection`
- [ ] Confirm backend for: about, terms, guarantee, installment, contact, branch,
      collaboration, notifications (none in the spec — see gaps doc)
- [ ] Keep mock or move to CMS — decision needed

## Known gaps / decisions

1. **CORS**: confirmed for local dev; production origin must be allowed.
2. **Checkout/order creation, returns, payment, notifications** are absent from
   the spec — see `api-backend-gaps.md`.
3. **Order list requires both `status` and `type`** — the UI merges statuses
   (`type=sales`) and paginates client-side.
4. **Guest cart** works with a client-generated `cart_token`; login-time merge
   still needs confirmation.
5. **Product/favorite cards** pay for an N+1 detail request to get prices until
   the list endpoint returns price/stock.
6. **OpenAPI codegen**: types are hand-written per feature; consider
   `openapi-typescript` once the payloads stabilise.
