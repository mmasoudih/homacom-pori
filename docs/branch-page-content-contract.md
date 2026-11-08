# Branch (stores) page — content contract

Full structured payload request for `/branch` («فروشگاه‌های حضوری هماکام»).
The whole page is static today (`app/data/pages/branch.ts`); no backend endpoint
exists yet.

- **Proposed endpoint:** `GET /api/shop/public/branch` (public)
  — same pattern as `/shop/public/about` and `/shop/public/contact`.
- **Frontend page:** `app/pages/branch.vue`
- **Current static data:** `app/data/pages/branch.ts`
- **Reused component:** `LandingCeoSection` at the bottom (shared with the
  landing page, not part of this contract).

The static data is the fallback for every field, so the page is complete until
admin content is filled in.

---

## 1. Visual blocks and their names

| # | Block name | What is on screen | Backend key (proposed) | Current source |
| --- | --- | --- | --- | --- |
| A | `pageHero` | Store icon + page title above the tab bar | `hero` | static (icon is a bundled SVG) |
| B | `tabBar` | Five pill tabs (warranty, buying, stores, returns, signup); the “stores” pill is selected | `tabs[]` + `active_tab_key` | static (non-navigating today) |
| C | `sectionIntro` | Section heading + intro paragraph (desktop only) | `section` | static |
| D | `branchList` | One card per physical store | `branches[]` | static |
| D1 | `branchHeading` | Accent bar + store name + working hours | `branches[].name` / `.hours` | static |
| D2 | `branchMap` | Map image (desktop + mobile crops) with a centered pin | `branches[].map` / `.map_mobile` | static |
| D3 | `branchAddress` | Address label + address + “نمایش در نقشه” / phone buttons | `branches[].address_*` / `.phone` / `.map_url` + `labels` | static (Google Maps URL is built from the address) |
| D4 | `branchGallery` | «تصاویر شعبه:» heading + image grid | `labels.gallery` + `branches[].images[]` | static |
| E | `storeDescriptionBand` | Bottom store description band | shared with landing | static |

---

## 2. Proposed response

```json
{
  "success": true,
  "message": "",
  "data": {
    "seo": {
      "title": "فروشگاه‌های حضوری هماکام | هماکام",
      "description": "آدرس، شماره تماس، ساعات کاری و تصاویر فروشگاه‌های حضوری هماکام در تهران."
    },

    "breadcrumb": ["هماکام", "فروشگاه‌های حضوری"],

    "hero": {
      "icon": "https://new.ahoma.ir/storage/.../branch-hero.svg",
      "title": "فروشگاه‌های حضوری هماکام",
      "subtitle": "فروشگاه‌های حضوری هماکام در سراسر تهران آماده پذیرایی از شما هستند"
    },

    "tabs": [
      { "key": "warranty", "label": "راهنمای گارانتی", "url": null },
      { "key": "buying", "label": "راهنمای خرید", "url": null },
      { "key": "stores", "label": "فروشگاه‌های حضوری هماکام", "url": "/branch" },
      { "key": "returns", "label": "مرجوعی کالا", "url": null },
      { "key": "signup", "label": "راهنمای ثبت نام", "url": null }
    ],
    "active_tab_key": "stores",

    "section": {
      "title": "فروشگاه‌های حضوری هماکام",
      "intro": "برای تجربه‌ای نزدیک‌تر و آشنایی با محصولات، به فروشگاه‌های حضوری هماکام مراجعه کنید. کارشناسان ما در محل، شما را در انتخاب بهترین محصول راهنمایی می‌کنند."
    },

    "labels": {
      "show_on_map": "نمایش در نقشه",
      "gallery": "تصاویر شعبه:"
    },

    "branches": [
      {
        "id": "branch-1",
        "name": "شعبه اول",
        "hours": "ساعت کاری شعبه: یکشنبه تا چهارشنبه از ۹:۰۰ الی ۲۳:۰۰",
        "address_label": "آدرس شعبه اول:",
        "address": "تهران، خیابان وحدت اسلامی، نبش کوچه چیت‌سازی، پلاک ۳۶۵",
        "phone": "۰۲۱-۳۲۵۰۷۸۹",
        "map": "https://new.ahoma.ir/storage/.../branch-1-map.png",
        "map_mobile": "https://new.ahoma.ir/storage/.../branch-1-map-mobile.png",
        "map_url": "https://maps.google.com/?q=...",
        "images": [
          "https://new.ahoma.ir/storage/.../branch-1-gallery-1.jpg",
          "https://new.ahoma.ir/storage/.../branch-1-gallery-2.jpg",
          "https://new.ahoma.ir/storage/.../branch-1-gallery-3.jpg",
          "https://new.ahoma.ir/storage/.../branch-1-gallery-4.jpg"
        ]
      },
      {
        "id": "branch-2",
        "name": "شعبه دوم",
        "hours": "ساعت کاری شعبه: شنبه تا چهارشنبه از ۱۰:۰۰ الی ۲۱:۰۰",
        "address_label": "آدرس شعبه دوم:",
        "address": "تهران، خیابان ولیعصر، بالاتر از میدان ونک، کوچه یاس، پلاک ۲۴، واحد ۵",
        "phone": "۰۲۱-۳۳۵۰۷۲۹۸",
        "map": "https://new.ahoma.ir/storage/.../branch-2-map.png",
        "map_mobile": "https://new.ahoma.ir/storage/.../branch-2-map-mobile.png",
        "map_url": "https://maps.google.com/?q=...",
        "images": [
          "https://new.ahoma.ir/storage/.../branch-2-gallery-1.jpg",
          "https://new.ahoma.ir/storage/.../branch-2-gallery-2.jpg",
          "https://new.ahoma.ir/storage/.../branch-2-gallery-3.jpg",
          "https://new.ahoma.ir/storage/.../branch-2-gallery-4.jpg"
        ]
      }
    ]
  }
}
```

### Field rules

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `seo.title` | string \| null | no | Document title; default «فروشگاه‌های حضوری هماکام \| هماکام» |
| `seo.description` | string \| null | no | Meta description |
| `breadcrumb` | string[] | no | 2 crumbs: brand + page |
| `hero.icon` | string \| null | no | Absolute URL/storage path; empty keeps the bundled `hero.svg` |
| `hero.title` | string \| null | no | Page `<h1>`; also used as the document title fallback |
| `hero.subtitle` | string \| null | no | One line under the title; defined in the static data but **not rendered** today |
| `tabs[].key` | string | yes (per tab) | Stable id; never shown |
| `tabs[].label` | string | yes (per tab) | Visible pill text |
| `tabs[].url` | string \| null | no | Navigation target; `null` keeps the pill non-navigating (current behaviour) |
| `active_tab_key` | string \| null | no | Must equal one `tabs[].key`; default `stores` |
| `section.title` | string \| null | no | Desktop section heading |
| `section.intro` | string \| null | no | Desktop intro paragraph |
| `labels.show_on_map` | string \| null | no | Map button label; default «نمایش در نقشه» |
| `labels.gallery` | string \| null | no | Gallery heading; default «تصاویر شعبه:» |
| `branches[].id` | string | yes (per branch) | Stable id for `v-for` keys; must be unique |
| `branches[].name` | string | yes (per branch) | Store name (`<h3>`) |
| `branches[].hours` | string \| null | no | Working-hours line under the name |
| `branches[].address_label` | string \| null | no | Bold label above the address; default «آدرس …:» |
| `branches[].address` | string | yes (per branch) | Full address (`<p>`), also the map-link fallback |
| `branches[].phone` | string \| null | no | Displayed as-is and used for `tel:`; the phone button is hidden when empty |
| `branches[].map` | string \| null | no | Desktop map image (`min-width: 64rem`); empty keeps the bundled map |
| `branches[].map_mobile` | string \| null | no | Mobile map crop; empty keeps the bundled map |
| `branches[].map_url` | string \| null | no | “نمایش در نقشه” target; when empty the client builds a Google Maps query from `address` |
| `branches[].images` | string[] | no | Gallery URLs; empty hides the gallery grid |

- Every key must be **present** and `null` when unset (`hero`, `section`,
  `labels` may each be `null`); do not omit keys.
- Empty arrays (`branches: []`, `images: []`) mean “nothing to render” — the
  block is hidden, the page never breaks. At least one branch is expected in
  production.
- Branch order is the reading order — the backend controls it.
- Gallery images are plain URLs; the client generates alt text
  (`تصویر {branch.name} {n}`). If per-image alt/caption is needed, switch the
  array to `{url, alt}` objects.
- All image paths must be absolute URLs or `/storage/...` paths; they are
  rendered as `<img>`/`<picture>` sources.

---

## 3. Notes for the backend

- **No endpoint exists** for this page (tracked in
  `api-backend-gaps-open.md` under “Static”). `GET /shop/public/branch` matches
  the existing public-CMS pattern.
- `branchPage.title` in the static data is «راهنمای آنلاین» — a copy/paste
  leftover from the guarantee page. The document title, breadcrumb and section
  heading all say «فروشگاه‌های حضوری هماکام», so `hero.title` should return the
  corrected value; the page fixes it in this contract.
- `branchPage.subtitle` exists in the static data but the template never renders
  it; `hero.subtitle` keeps it so the design can show it.
- The tab bar is **visual only** today: `activeTab` (hardcoded `2`) only changes
  the pill styling, and the branch list is always shown. `tabs[].url` +
  `active_tab_key` let the same pills become real navigation without a client
  change once the guide pages exist.
- The map button currently builds `https://maps.google.com/?q=<address>` in the
  template. `map_url` makes the exact pin/link admin-controlled; the address
  fallback is kept so existing behaviour never breaks.
- The map image is a static snapshot exported from Figma and the pin is an
  overlay (`map-pin.svg`), not a live map. Keep desktop/mobile crops separate so
  the `<picture>` swap keeps working.
- `section.*` is rendered **only on desktop** (`hidden lg:flex`); mobile users
  go straight from the tabs to the first branch card. That is intentional in the
  design, so do not add a mobile copy of it.
- The phone is displayed in Persian digits exactly as returned; `tel:` uses the
  same string (browsers normalise it). Return a dialable value if the admin
  panel cannot preserve Persian digits.

---

## 4. Frontend mapping (for reference)

| API key | Rendered by |
| --- | --- |
| `seo.title` | `useHead` title in `app/pages/branch.vue` |
| `breadcrumb` | `UiBreadcrumb` (desktop only, hidden on mobile by design) |
| `hero.icon` | `<img>` above the title |
| `hero.title` | `<h1>` |
| `hero.subtitle` | not wired yet (would sit under the title) |
| `tabs[]` + `active_tab_key` | pill button row |
| `section.title` / `.intro` | desktop intro block above the list |
| `labels.show_on_map` / `.gallery` | map button label / gallery heading |
| `branches[]` | one `<article>` per store |
| `branches[].name` / `.hours` | branch heading |
| `branches[].map` / `.map_mobile` | `<picture>` inside the card |
| `branches[].address_label` / `.address` | address block |
| `branches[].map_url` / `.phone` | action buttons (`href` of map link / `tel:`) |
| `branches[].images[]` | gallery grid (1-col mobile, 2-col desktop) |
