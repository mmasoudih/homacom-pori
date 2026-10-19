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
- [ ] `GET /api/shop/banners?filters[position]=` → landing hero/offers
- [ ] `GET /api/shop/stories` → header story strip

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

- [ ] `GET /api/shop/blogs` → `blog/index.vue`
- [ ] `GET /api/shop/blogs/category/{category}` → `blog/[category]/index.vue`
- [ ] `GET /api/shop/blogs/{slug}` → `blog/[category]/[slug].vue`
- [ ] Search/filters → `blog/search.vue`

## Phase 5 — Addresses & locations

- [ ] `GET /api/address/states` → address forms
- [ ] `GET /api/address/cities?filters[parent_id]=` → address forms
- [ ] `GET/POST/PUT/DELETE /api/shop/user/address` → dashboard addresses and
      checkout address dialogs
- [ ] Map fields: `title, state, city, address, lat, lng, mobile, nickname,
      code_melli, zip_code, plaque, floor, unit`

## Phase 6 — Cart (8 endpoints)

- [ ] Rewrite `useCart.ts` from localStorage/mock to server cart
- [ ] `GET /api/shop/cart` (server + guest `X-Cart-Token`)
- [ ] `POST /api/shop/cart/add-to-cart` (`stock_id`, `quantity`, `services[]`)
- [ ] `POST /api/shop/cart/add-qty` / `sub-qty`
- [ ] `DELETE /api/shop/cart/item` (line remove + clear)
- [ ] `POST /api/shop/cart/set-user-address`
- [ ] `POST /api/shop/cart/set/payment-method`
      (`online | pay_in_delivery | pay_in_person | mixed | manual`)
- [ ] `POST /api/shop/cart/set-discount` (coupon apply/clear)
- [ ] Sync header badge + cart totals from `data.totals`
- [ ] Decide fate of mock-only insurance/service UI vs API `services[]`

## Phase 7 — Checkout & orders (partly blocked)

- [ ] `GET /api/shop/order?status=&type=` → `dashboard/orders/index.vue` tabs
- [ ] `GET /api/shop/order/{invoice}` → order detail, pay, return pages
- [ ] Wire checkout totals/coupon/shipping/payment to cart endpoints
- [ ] **Blocked:** no create-order / checkout-submit endpoint in spec.
- [ ] **Blocked:** no return-request endpoints in spec.
- [ ] **Blocked:** no payment gateway init/callback endpoint in spec.

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

- [ ] `GET /api/shop/user/favorite?filters[relate_to]=` → dashboard favorites
- [ ] `POST /api/shop/user/favorite` toggle → product cards + detail heart
- [ ] Reflect `is_favorite` from product responses

## Phase 10 — User comments

- [ ] `GET /api/shop/user/comments` → dashboard comments
- [ ] `POST /api/shop/user/comments` → product comment form
- [ ] `PUT/DELETE /api/shop/user/comments/{id}` → dashboard edit/delete

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
