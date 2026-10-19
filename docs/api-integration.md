# Backend API integration checklist

Source of truth: `https://new.ahoma.ir/api/documentation` (OpenAPI 3.0, "Homacom CRM API",
server `https://new.ahoma.ir`, Sanctum bearer auth).
Machine-readable spec: `https://new.ahoma.ir/docs?api-docs.json`.

Work is done in phases. Each phase is committed separately so it can be reverted
independently.

## Current state (audit)

- [x] `NUXT_PUBLIC_API_BASE` configured (`https://new.ahoma.ir/api`).
- [x] Auth partially wired in `app/composables/useAuth.ts`: login, verify,
      login-with-password, forgot-password, reset-password.
- [x] `auth_token` cookie written on login.
- [x] Shared API client sends `Authorization` (with 401 refresh/retry).
- [x] Auth middleware, `X-Cart-Token` support, refresh and logout.
- [ ] Everything else is mock data under `app/data/*` and `app/composables/use*.ts`.

## Phase 0 — Shared infrastructure

- [x] Typed API client (`useApi`) wrapping `$fetch` with `apiBase`.
- [x] Auto-attach `Authorization: Bearer <auth_token>` from cookie (client + SSR).
- [x] Central error normalizer for `{ success, message, data }` and
      401/403/422/429.
- [x] 401 → `POST /auth/refresh`, retry once; on failure clear token.
- [x] Persist `X-Cart-Token` for guest cart; send on cart endpoints.
- [x] Auth middleware for `/dashboard/**` with redirect-back support.
- [x] Shared API types (`ApiEnvelope`, `ApiPagination`, `ApiError`).
- [ ] Normalize media URLs and pagination per page (Phase 2+).
- [ ] Decide direct browser calls vs Nitro proxy (CORS/token safety).

## Phase 1 — Auth (7 endpoints)

- [x] `POST /api/auth/login` → `app/pages/auth/login.vue`
- [x] `POST /api/auth/verify` → `app/pages/auth/verify.vue`
- [x] `POST /api/auth/login-with-password` → `app/pages/auth/login-with-password.vue`
- [x] `POST /api/auth/forgot-password` → `app/pages/auth/forgot-password.vue`
- [x] `POST /api/auth/reset-password` → `app/pages/auth/reset-password.vue`
- [x] `POST /api/auth/logout` → `app/components/dashboard/LogoutDialog.vue`
- [x] `POST /api/auth/refresh` → API client interceptor
- [ ] Verify token expiry (`token_expire`) and hydrate user via
      `GET /api/shop/user/profile/me`

## Phase 2 — Global shell / CMS (6 Public + Banner + Story)

- [ ] `GET /api/shop/public/site-header` → `landing/SiteHeader.vue`
- [x] `GET /api/shop/public/product-category` → `categories/*` (mega + mobile,
      mock tree as fallback)
- [x] `GET /api/shop/public/footer` → `landing/SiteFooter.vue` (contact block;
      menu columns stay designed until the API returns links)
- [ ] `GET /api/shop/public/blog-header` → `blog/BlogSiteHeader.vue`
- [x] `GET /api/shop/public/blog-category` → blog nav/drawer (mock tree as
      fallback)
- [ ] `GET /api/shop/public/colors` → color filters (`SearchColorFilter`)
- [x] `GET /api/shop/banners?filters[position]=` → landing hero + banner rows
      (mock banners per slot as fallback)
- [x] `GET /api/shop/stories` → header story strip (`HeaderCircleStrip`)

## Phase 3 — Catalog, search, product detail

- [ ] `GET /api/shop/products` (q, categories, colors, brands, ids, price range,
      only_exists, vip, homa_off, sort, page, per_page) → landing carousels,
      `search.vue`, category pages
- [x] `GET /api/shop/products/{slug}` → `product/[id].vue` + `product-detail/*`
      (gallery, colors, stocks/price, warranties, services, questions, SEO;
      mock product kept as fallback)
- [x] `GET /api/shop/products/{id}/comments` → comments section/sheet
- [ ] Replace `useProductSearch` / `useSearchResults` / `useSearchFilters` mocks
- [ ] Debounced header search suggestions

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
- [ ] Wire the checkout address dialog + dashboard add/edit buttons to the CRUD
      composable
- [ ] Map fields: `title, state, city, address, lat, lng, mobile, nickname,
      code_melli, zip_code, plaque, floor, unit`

## Phase 6 — Cart (8 endpoints)

- [x] Rewrite `useCart.ts` from localStorage/mock to server cart (mock products
      still use the local fallback)
- [x] `GET /api/shop/cart` (server + guest `X-Cart-Token`)
- [x] `POST /api/shop/cart/add-to-cart` (`stock_id`, `quantity`, `services[]`)
- [x] `POST /api/shop/cart/add-qty` / `sub-qty`
- [x] `DELETE /api/shop/cart/item` (line remove + clear)
- [x] `POST /api/shop/cart/set-user-address`
- [x] `POST /api/shop/cart/set/payment-method`
      (`online | pay_in_delivery | pay_in_person | mixed | manual`)
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
- [ ] Checkout totals/coupon/shipping/payment are not yet persisted to the cart
      before submit (no submit endpoint to attach them to).

## Phase 8 — Profile

- [x] `GET /api/shop/user/profile/me` → dashboard profile/account
      (Jalali birthdate conversion + mock fallback)
- [x] `PUT /api/shop/user/profile/base-information`
- [x] `PUT /api/shop/user/profile/email`
- [x] `PUT /api/shop/user/profile/national-code`
- [x] `PUT /api/shop/user/profile/birthday`
- [ ] `PUT /api/shop/user/profile/company-information` (read-only mapping for now;
      the legal form has fields the API does not accept)

## Phase 9 — Favorites

- [x] `GET /api/shop/user/favorite?filters[relate_to]=` → dashboard favorites
      (favorite records → product list by `filters[ids][]` → per-product detail
      for price)
- [x] `POST /api/shop/user/favorite` toggle → dashboard remove/toggle composable
- [ ] Wire the product-detail heart to `useFavorites().toggle()`
- [ ] Reflect `is_favorite` from product responses (detail resource exposes it)
- [ ] Favorites list returns only IDs, forcing an extra product-list + N detail
      requests to render cards; a favorites endpoint with product summaries
      (title/image/price) would remove the N+1.

## Phase 10 — User comments

- [x] `GET /api/shop/user/comments` → dashboard comments (mine + pending)
- [x] `POST /api/shop/user/comments` → product comment form
- [x] `DELETE /api/shop/user/comments/{id}` → dashboard delete
- [ ] `PUT /api/shop/user/comments/{id}` → dashboard edit dialog (still local)
- [ ] Comment likes/dislikes are not present in `UserCommentResource`
      (dashboard shows 0/0).

## Phase 11 — Tickets

- [ ] `GET /api/shop/user/ticket/departments` → new ticket dialog
- [ ] `GET /api/shop/user/ticket` (status, department, q, sort, pagination)
- [ ] `POST /api/shop/user/ticket`
- [ ] `GET /api/shop/user/ticket/{ticket}/messages`
- [ ] `POST /api/shop/user/ticket/{ticket}/reply`
- [ ] `POST /api/shop/user/ticket/{ticket}/close`

## Phase 12 — Static/CMS pages (no endpoints in spec)

- [x] `GET /api/shop/faqs` → `faq.vue` (mock content as fallback)
- [x] `GET /api/shop/brands` → `brands.vue`, `landing/BrandsSection`
- [ ] Confirm backend for: about, terms, guarantee, installment, contact, branch,
      collaboration, notifications
- [ ] Keep mock or move to CMS — decision needed

## Known gaps / decisions

1. **CORS & auth transport**: direct browser `$fetch` to `new.ahoma.ir` or Nitro
   proxy? Affects cookie/SSR strategy.
2. **Checkout/order creation, returns, payment, notifications** are absent from
   the spec.
3. **Order list requires both `status` and `type`** — needs a default tab
   mapping (`type=sales`).
4. **Guest cart** uses `X-Cart-Token`; confirm it survives login/merge.
5. **OpenAPI codegen**: add `openapi-typescript` or hand-write types?
