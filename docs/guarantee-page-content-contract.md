# Guarantee page — content contract

Full structured payload request for `/guarantee` («راهنمای گارانتی»).
The whole page is static today (`app/data/pages/guarantee.ts`); no backend
endpoint exists yet.

- **Proposed endpoint:** `GET /api/shop/public/guarantee` (public)
  — same pattern as `/shop/public/about` and `/shop/public/contact`.
- **Frontend page:** `app/pages/guarantee.vue`
- **Current static data:** `app/data/pages/guarantee.ts`
- **Reused components:** `PagesPageHeader`, `UiBreadcrumb`, `PagesPillTabs`,
  `PagesChipRow`, `LandingCeoSection` (desktop) / `PagesAboutBand` (mobile),
  site header/footer.

The static data is the fallback for every field, so the page is complete until
admin content is filled in.

---

## 1. Visual blocks and their names

| # | Block name | What is on screen | Backend key (proposed) | Current source |
| --- | --- | --- | --- | --- |
| A | `pageHeader` | Mobile title, desktop title, optional subtitle, icon | `header` | static (icon is inline SVG) |
| B | `tabBar` | Five pill tabs: warranty, buying, stores, returns, signup | `tabs[]` | static |
| C | `tabSection` | Heading + one paragraph for the selected tab | `sections[]` | static |
| C1 | `warrantyDevices` | Device chips + warranty copy that swaps per chip (warranty tab only) | `warranty` | static (keyed by icon) |
| D | `storeDescriptionBand` | Bottom band — CEO section desktop, about band mobile | shared with landing | static |

Tabs are **client-side filtering**: the page loads once, then shows the sections
whose `tab` matches the selected pill. No request per tab.

---

## 2. Proposed response

```json
{
  "success": true,
  "message": "",
  "data": {
    "seo": {
      "title": "راهنمای گارانتی | هماکام",
      "description": "پاسخ سوالات پرتکرار درباره گارانتی، خرید، فروشگاه‌های حضوری، مرجوعی کالا و ثبت‌نام در هماکام."
    },

    "breadcrumb": ["هماکام", "راهنمای گارانتی"],

    "header": {
      "title_mobile": "راهنمای آنلاین",
      "title_desktop": "راهنمای گارانتی",
      "subtitle": "مجموعه‌ای از پاسخ سوالات پرتکرار شما درباره‌ی محصولات و خدمات هماکام",
      "icon": null
    },

    "tabs": [
      { "key": "warranty", "label": "راهنمای گارانتی" },
      { "key": "buying", "label": "راهنمای خرید" },
      { "key": "stores", "label": "فروشگاه‌های حضوری هماکام" },
      { "key": "returns", "label": "مرجوعی کالا" },
      { "key": "signup", "label": "راهنمای ثبت‌نام" }
    ],

    "sections": [
      {
        "id": "warranty-main",
        "tab": "warranty",
        "heading": "راهنمای گارانتی",
        "body": "تمام محصولات ارائه‌شده در هماکام دارای گارانتی معتبر و رسمی از نمایندگی‌های مجاز برند هستند. ..."
      },
      {
        "id": "buying-main",
        "tab": "buying",
        "heading": "راهنمای خرید",
        "body": "برای خرید از هماکام ابتدا محصول مورد نظر خود را در دسته‌بندی‌ها جستجو کنید. ..."
      },
      {
        "id": "buying-pay-on-delivery",
        "tab": "buying",
        "heading": "پرداخت در محل",
        "body": "برای سفارش‌های شهر تهران امکان پرداخت وجه هنگام تحویل کالا فراهم است. ..."
      },
      {
        "id": "stores-main",
        "tab": "stores",
        "heading": "فروشگاه‌های حضوری هماکام",
        "body": "فروشگاه‌های حضوری هماکام در تهران و سایر شهرهای بزرگ ..."
      },
      {
        "id": "returns-main",
        "tab": "returns",
        "heading": "مرجوعی کالا",
        "body": "در صورت عدم تطابق کالا با مشخصات درج‌شده یا بروز ایراد فنی، ..."
      },
      {
        "id": "signup-main",
        "tab": "signup",
        "heading": "راهنمای ثبت‌نام",
        "body": "برای ساخت حساب کاربری در هماکام روی گزینه «ورود / ثبت‌نام» کلیک کنید ..."
      }
    ],

    "warranty": {
      "intro": "برای مشاهده جزئیات گارانتی، دسته‌بندی محصول خود را انتخاب کنید.",
      "chips": [
        { "key": "mobile", "label": "گوشی موبایل" },
        { "key": "laptop", "label": "لپ‌تاپ و تبلت" },
        { "key": "watch", "label": "ساعت هوشمند" },
        { "key": "headphones", "label": "هدفون و هندزفری" },
        { "key": "gamepad", "label": "کنسول بازی" },
        { "key": "display", "label": "کامپیوتر" },
        { "key": "speakers", "label": "صوتی و تصویری" }
      ],
      "items": [
        {
          "key": "mobile",
          "body": "گوشی‌های موبایل عرضه‌شده در هماکام دارای گارانتی رسمی و معتبر شرکتی هستند. ..."
        },
        {
          "key": "laptop",
          "body": "لپ‌تاپ و تبلت‌های هماکام با گارانتی رسمی برند ارائه می‌شوند ..."
        },
        {
          "key": "watch",
          "body": "ساعت‌های هوشمند دارای گارانتی معتبر هستند ..."
        },
        {
          "key": "headphones",
          "body": "هدفون و هندزفری‌ها بر اساس برند و مدل با گارانتی رسمی عرضه می‌شوند ..."
        },
        {
          "key": "gamepad",
          "body": "کنسول‌های بازی همراه با گارانتی رسمی واردکننده ارائه می‌شوند ..."
        },
        {
          "key": "display",
          "body": "کامپیوترهای رومیزی و همه‌کاره با گارانتی قطعات اصلی عرضه می‌شوند ..."
        },
        {
          "key": "speakers",
          "body": "سیستم‌های صوتی و تصویری با گارانتی رسمی و معتبر ارائه می‌شوند ..."
        }
      ]
    }
  }
}
```

### Field rules

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `seo.title` | string \| null | no | Document title; default «راهنمای گارانتی \| هماکام» |
| `seo.description` | string \| null | no | Meta description |
| `breadcrumb` | string[] | no | 2 crumbs: brand + page |
| `header.title_mobile` | string \| null | no | `< lg` title; default «راهنمای آنلاین» |
| `header.title_desktop` | string \| null | no | `lg:` title; default «راهنمای گارانتی» |
| `header.subtitle` | string \| null | no | Intro under the title; static `subtitle` exists but is **not rendered** (the template passes `subtitle=""`) |
| `header.icon` | string \| null | no | Absolute URL/storage path; empty keeps the bundled SVG |
| `tabs[].key` | string | yes (per tab) | Stable id referenced by `sections[].tab`; never shown |
| `tabs[].label` | string | yes (per tab) | Visible pill text |
| `sections[].id` | string \| null | no | Stable id for `v-for` keys; must be unique |
| `sections[].tab` | string | yes (per section) | Must equal one `tabs[].key` |
| `sections[].heading` | string | yes (per section) | Section `<h2>` |
| `sections[].body` | string | yes (per section) | Single paragraph (plain text) |
| `warranty.chips[].key` | string | yes (per chip) | Must equal one `warranty.items[].key` |
| `warranty.chips[].label` | string | yes (per chip) | Chip label |
| `warranty.items[].key` | string | yes (per item) | Device key |
| `warranty.items[].body` | string | yes (per item) | Warranty copy shown under the chips |

- Every key must be **present** and `null` when unset (`header`, `warranty` may
  be `null`); do not omit keys.
- `tabs` order defines pill order. The **first** tab is the default open tab and
  the only one that shows `warranty`.
- `sections` are grouped by `tab`; within a tab they render in returned order.
- A tab with no sections shows only the tab bar — the page does not break.
- Chips whose `key` has no matching `items[]` entry render nothing under the
  row; the backend should always ship a body for every chip.

---

## 3. Notes for the backend

- **No endpoint exists** for this page (tracked in
  `api-backend-gaps-open.md` under “Static”). `GET /shop/public/guarantee`
  matches the existing public-CMS pattern.
- **Tab ↔ section link is fragile today:** sections point at tabs by the
  Persian **label** (`section.tab === activeTabLabel`). Renaming a pill silently
  drops its sections. The contract uses `tabs[].key` / `sections[].tab`.
- The page has **two titles by design**: mobile shows «راهنمای آنلاین»
  (`guaranteePage.title`), desktop shows «راهنمای گارانتی» (hardcoded
  `title-desktop`). Both are now in `header`.
- `guaranteePage.subtitle` exists in the static data but the template passes
  `subtitle=""`, so it is **not rendered**; the contract keeps it for the design.
- The breadcrumb is hardcoded and currently contains a typo — `«همکام»`
  instead of `«هماکام»`. The contract returns the corrected trail.
- The warranty copy in `guaranteeWarrantyByDevice` is flagged in code as
  **placeholder**; it should be reviewed by the content team before launch.
- The warranty chips list has **7** categories (no «لوازم جانبی») while other
  pages use 8. This is intentional here only because the copy exists for 7;
  the backend list drives the UI, so adding an eighth chip just needs copy.
- The header icon is an inline SVG; `header.icon` as a URL makes it swappable
  without a deploy.
- Sections are plain text today. If legal/marketing copy needs bold or links,
  add a `blocks[]` array like the terms contract instead of sending HTML.

---

## 4. Frontend mapping (for reference)

| API key | Rendered by |
| --- | --- |
| `breadcrumb` | `UiBreadcrumb` (desktop only, hidden on mobile by design) |
| `header.title_mobile` / `header.title_desktop` | `PagesPageHeader` (`title` / `title-desktop`) |
| `header.subtitle` | `PagesPageHeader` (not wired yet) |
| `header.icon` | `PagesPageHeader` `#icon` slot |
| `tabs[]` | `PagesPillTabs` |
| `sections[]` filtered by `tab` | heading + paragraph blocks |
| `warranty.chips[]` | `PagesChipRow` |
| `warranty.items[]` matched by chip key | paragraph under the chips (warranty tab only) |
