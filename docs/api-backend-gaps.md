# Backend gaps — data and endpoints needed

Companion to `docs/api-integration.md`. Everything here is something the
frontend currently works around, cannot render faithfully, or has no endpoint
for. Give this list to the backend developer.

Base: `https://new.ahoma.ir/api` · OpenAPI: `/docs?api-docs.json`

---

## 1. Product list (`GET /shop/products`)

**Needed in each list item**

| Field | Why |
| --- | --- |
| `price`, `old_price`, `discount` | Product cards, search results and carousels cannot render a price. The UI currently issues one `GET /shop/products/{slug}` per result to read the default stock price (N+1 requests). |
| `stock_id` (default buyable stock) | `add-to-cart` needs `stock_id`; list cards cannot add to cart directly. |
| `quantity` / `in_stock` | The «فقط کالاهای موجود» filter currently trusts `status: "active"`, which is not stock availability. |
| `color` objects with `code` + `title` | Colour swatches are missing/approximate. |
| `size` / storage label | The mobile «حافظه داخلی» facet cannot be populated. |
| `warranty` title/id (optional) | Card meta and quick add. |
| `is_favorite` (authenticated) | The product heart cannot show its true state. |

**Also needed**

- **Category filter is broken:** `filters[categories][]` returns
  `filters.categories.0 انتخاب شده، معتبر نیست` for every id (8, 12, 103, 105,
  …). Landing category panels therefore share a general product pool. Fix or
  document the accepted category ids/slugs.
- Document/implement the accepted `filters[sort]` values. Verified working:
  `newest`, `cheapest`, `expensive`. `best-selling`, `most-viewed`, `sales`,
  `views` return 422. The «پرفروش‌ترین» landing row currently falls back to the
  default order.
- Return `pagination` consistently on every list endpoint.

---

## 2. Product detail (`GET /shop/products/{slug}`)

Mostly sufficient. Remaining asks:

- `is_favorite` for authenticated requests (we cannot pre-fill the heart).
- Confirm `comments_count` is the total, and that `rate` is a 0–5 score.
- `service_groups` is good; confirm whether insurance is a service group or a
  separate concept. The cart expects insurance choices.
- `suggested` products have no `img` or price, so the «در کنارش خریداری شده»
  row still falls back to design mocks.
- Expert review, spec groups and in-person benefits are not in the API; the
  page keeps the designed mock content. Provide CMS fields if these must be
  dynamic.

---

## 3. Cart (`/shop/cart/*`)

- **Cart item payload:** add `product_id` and `product_slug`. The current
  `CartItemResource` only has `title`/`image`/`stock`, so cart line titles link
  to `#`.
- **Response shape:** the live response nests stock data under `item.stock`
  (`stock.id`, `stock.color`, `stock.warranty`, `stock.max_in_cart`), while the
  OpenAPI schema documents flat `stock_id`, `color`, `warranty`. Please align
  or document the real shape.
- **Update services on an existing line:** `add-to-cart` accepts `services[]`
  only when adding. There is no endpoint to change/remove services or insurance
  for an existing line, so the cart's «افزودن خدمت» / «افزودن بیمه» dialogs
  cannot persist.
- **Guest → user cart merge:** confirm that logging in with an
  `X-Cart-Token` merges the guest cart into the user cart and which cart is
  returned.
- **Min/max quantity:** the seeded stock has `min_in_cart: 9`; the UI only
  knows the max. Return a usable `min_in_cart` per stock and expose it in the
  product detail response so the stepper can enforce it.
- **Coupon:** confirm the error codes/messages for invalid/expired coupons.
- **Payment method:** the checkout UI offers `online`, `wallet` and
  `installment`; the cart endpoint accepts `online | pay_in_delivery |
  pay_in_person | mixed | manual`. Add wallet/installment values (or document the
  intended mapping).
- **Totals:** confirm that `totals.payable_price` already includes
  services/insurance/coupon so the UI can trust it instead of recomputing.

---

## 4. Checkout & orders

**Checkout frontend status:** addresses and coupon now use the cart API;
shipping/payment methods are still designed mocks. The submit step is blocked.

**Blocked — endpoints do not exist in the spec**

- Create order / submit checkout (`POST /shop/order` or similar).
- Payment gateway init + callback/verify.
- Order cancel.
- Invoice download.
- Return request create/list/detail/cancel.
- Shipping methods, delivery days, time slots and their prices.
- Wallet balance / installment providers / credit providers.

**Needed in order payloads**

- `invoice`/`code` (human-readable order code; UI currently shows the numeric id).
- `delivery_date`, `receiver` (name/phone), full address.
- `shipping` (method, cost, discount) and `transactions[]`.
- Item `image`, `color`, `warranty`, `product_slug` (currently only
  id/title/quantity/price).
- `created_at` is present; confirm timezone (UI formats in `fa-IR`).

**List endpoint**

- `status` is required on every request. Add an `all`/group filter or accept
  multiple statuses; today the «همه» tab fires one request per status.
- Add pagination; the UI currently paginates client-side.
- Document the full status enum and its Persian labels (`status_fa` exists on
  tickets but not on orders).

**Returns**

- The «مرجوع شده» tab still renders designed mock data — no API.

---

## 5. Profile

- `GET /shop/user/profile/me` lacks **card number**, **sheba number**, **avatar**
  and **has_password**. The account page shows these fields.
- No endpoint for **bank card / sheba** update (UI saves locally only).
- No **password change** endpoint (`forgot/reset` exists, but not an
  authenticated change).
- No **avatar upload** endpoint (the picker only previews locally).
- Company info: the legal dialog now collects `company_economic_code` and
  `company_ceo`, so the update endpoint is fully called. `city`, `province` and
  `postalAddress` remain UI-only — the API has no fields for them. Add them if
  the legal address must be stored.
- `birthday` is Gregorian (`YYYY-MM-DD`); the UI displays Jalali. We convert
  client-side — document the expected timezone/calendar.

---

## 6. Favorites

- `GET /shop/user/favorite` returns only `relate_id`. Rendering the favorites
  grid needs an extra `GET /shop/products?filters[ids][]` **plus one detail call
  per product** for price. Return product summaries (title/image/price/slug) or
  a `related` object per favorite.
- Confirm `POST` `action` values (`default | add | remove`) and the response
  `added` semantics.
- Expose `is_favorite` on product list/detail for authenticated requests.

---

## 7. Comments

- `UserCommentResource` has no `likes` / `dislikes` counts (dashboard shows 0/0).
- Confirm status values (`pending | active | rejected`?) and whether `active`
  means approved.
- **Blog comments:** no endpoint. `GET /shop/blogs/{slug}` returns `post`,
  `latest`, `most_viewer` — no comments. The article page renders no comments.
- **Blog rating:** `star` (e.g. 6) and `total_rating` (e.g. 176) are ambiguous;
  provide a 0–5 score if the star row must be real.
- Confirm `relate_to` accepted values (product, blog, …).

---

## 8. Tickets

- No **delete ticket** endpoint; the dashboard delete action currently closes
  the ticket. Add delete or remove the action.
- Add a **single ticket** endpoint (`GET /shop/user/ticket/{id}`); the detail
  page currently fetches the whole list to find the ticket, then the messages.
- `TicketMessageResource` has only `user_id`; add an explicit author role
  (`is_supporter` / `author_type`) so user vs support bubbles are reliable.
- No **attachment upload** endpoint; the form only records a filename.
- Priority is hard-coded to `medium`; expose a priority selector or document
  the allowed values (`low | medium | top`).
- Confirm status enum/labels (UI groups into open/waiting/closed).

---

## 9. Public content / CMS

- **Header/footer menus:** live `menus` / `menu_1..4` items have `link: null`
  and `title` only. Populate `link`, `target`, `icon`, `class`, and nested
  children, otherwise the designed navigation cannot be replaced.
- **Blog category title:** `GET /shop/blogs/category/{category}` returns only
  `items` + `pagination`, not the category itself; the page makes an extra
  `GET /shop/public/blog-category` request for the title.
- **Blog search:** no endpoint. The search page filters the `GET /shop/blogs`
  payload client-side. Add `filters[s]` to a blog list/search endpoint.
- **Blog header:** the frontend uses `/shop/public/blog-category`; confirm
  whether `/shop/public/blog-header` should replace it.
- **Colors:** `/shop/public/colors` is not used yet; the search colour facet is
  still the designed list. Confirm colour ids/codes and whether product colours
  reference these ids.
- **Static pages:** no endpoints for about, terms, guarantee, installment,
  contact, branch, collaboration. They remain hard-coded unless a CMS endpoint
  exists.
- **Notifications:** no endpoint; the dashboard bell is still mock.
- **Compare:** client-side only; no endpoint needed unless persistence is
  required.

---

## 10. Auth / transport

- Confirm refresh-token behaviour: `POST /auth/refresh` uses the current bearer
  token and returns `{ token }`; the client retries once on 401.
- Confirm `token_expire` timezone/format; the client does not pre-emptively
  refresh today.
- CORS is working for `http://localhost:4500` and reflects `Origin`; production
  origin still needs to be allowed.
- Confirm whether `success: false` can ever arrive with HTTP 200; the client
  treats it as an error.

---

## 11. Assets

- Some images come back relative (`uploads/...`), others absolute. The client
  resolves relative paths against the API origin. Please standardise on
  absolute URLs or document the storage origin.
