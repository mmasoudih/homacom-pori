# Terms page — content contract

Full structured payload request for `/terms` («شرایط و مقررات»).
The whole page is static today (`app/data/pages/terms.ts`); no backend endpoint
exists yet.

- **Proposed endpoint:** `GET /api/shop/public/terms` (public)
  — same pattern as `/shop/public/about` and `/shop/public/contact`.
- **Frontend page:** `app/pages/terms.vue`
- **Current static data:** `app/data/pages/terms.ts`
- **Reused components:** `PagesPageHeader`, `UiBreadcrumb`,
  `LandingCeoSection` at the bottom (shared with the landing page), site
  header/footer.

The static data is the fallback for every field, so the page is complete until
admin content is filled in.

---

## 1. Visual blocks and their names

| # | Block name | What is on screen | Backend key (proposed) | Current source |
| --- | --- | --- | --- | --- |
| A | `pageHeader` | Page title, optional subtitle, decorative icon | `header` | static (icon is inline SVG) |
| B | `documentBody` | Ordered list of legal sections | `sections[]` | static |
| B1…n | `legalSection` | Section heading + paragraphs + bullet clauses | `sections[].heading` / `.blocks[]` | static |
| C | `storeDescriptionBand` | Bottom store description band | shared with landing | static |

There is **no sidebar/table of contents** in the current design. Sections are
rendered top-to-bottom in the order returned.

---

## 2. Proposed response

```json
{
  "success": true,
  "message": "",
  "data": {
    "seo": {
      "title": "شرایط و مقررات | هماکام",
      "description": "آشنایی با قوانین، مقررات و تعهدات خرید از فروشگاه اینترنتی هماکام"
    },

    "breadcrumb": ["هماکام", "شرایط و مقررات"],

    "header": {
      "title": "شرایط و مقررات",
      "subtitle": "آشنایی با قوانین، مقررات و تعهدات خرید از فروشگاه اینترنتی هماکام",
      "icon": null
    },

    "sections": [
      {
        "id": "payment-guide",
        "heading": "راهنمای پرداخت",
        "blocks": [
          {
            "type": "paragraph",
            "text": "هماکام برای سهولت خرید مشتریان، روش‌های متنوعی برای پرداخت فراهم کرده است. ..."
          },
          {
            "type": "paragraph",
            "text": "توجه داشته باشید که سفارش‌هایی که در ساعات کاری ثبت شوند، ..."
          }
        ]
      },
      {
        "id": "pay-on-delivery",
        "heading": "پرداخت در محل",
        "blocks": [
          {
            "type": "paragraph",
            "text": "برای سفارش‌های شهر تهران امکان پرداخت وجه هنگام تحویل کالا ..."
          },
          {
            "type": "paragraph",
            "text": "پرداخت در محل فقط برای سفارش‌هایی امکان‌پذیر است که ..."
          }
        ]
      },
      {
        "id": "returns",
        "heading": "شرایط بازگشت کالا",
        "blocks": [
          {
            "type": "bullets",
            "items": [
              "در صورت عدم تطابق کالای ارسالی با مشخصات درج‌شده در فروشگاه، امکان بازگشت کالا تا ۷ روز پس از تحویل وجود دارد؛",
              "کالا باید در بسته‌بندی اولیه و بدون استفاده، همراه با فاکتور و تمامی لوازم جانبی آن بازگردانده شود؛",
              "در صورت بروز نقص فنی، پس از بررسی کارشناسان خدمات پس از فروش، کالا تعویض یا وجه آن بازگردانده می‌شود؛",
              "آسیب‌های ناشی از استفاده نادرست، ضربه، نفوذ مایعات یا هرگونه تغییر توسط کاربران، شامل شرایط بازگشت کالا نمی‌شود؛",
              "برای محصولات دارای گارانتی، تمامی امور تعمیر و تعویض مطابق شرایط مندرج در کارت گارانتی انجام می‌شود؛",
              "هزینه ارسال برای بازگشت کالا در صورت تأیید ایراد، بر عهده هماکام خواهد بود."
            ]
          }
        ]
      },
      {
        "id": "privacy",
        "heading": "حریم خصوصی و امنیت اطلاعات",
        "blocks": [
          {
            "type": "paragraph",
            "text": "هماکام متعهد است از اطلاعات شخصی کاربران خود محافظت کند. ..."
          },
          {
            "type": "paragraph",
            "text": "با ثبت سفارش در هماکام، شما ضمن مطالعه قوانین و مقررات، ..."
          }
        ]
      }
    ],

    "updated_at": "2026-11-03T00:00:00+03:30"
  }
}
```

### Why `blocks[]` instead of `paragraphs` + `clauses`

The current static model has two fixed arrays per section (`paragraphs`, then
`clauses`), so the frontend must always render **all paragraphs before all
bullets**. Real legal copy often needs a list in the middle of the paragraph
flow, a note/warning after a list, or a second list. A block array keeps the
author’s order and lets the backend add block types later without a client
change:

| `type` | Payload | Rendered as |
| --- | --- | --- |
| `paragraph` | `text` | `<p>` |
| `bullets` | `items: string[]` | bulleted `<ul>` with the dot marker |

If the backend prefers the legacy shape, `paragraphs[]` + `clauses[]` is still
accepted as a fallback (paragraphs first, clauses after), but `blocks[]` is the
preferred contract.

### Field rules

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `seo.title` | string \| null | no | Document title; default «شرایط و مقررات \| هماکام» |
| `seo.description` | string \| null | no | Meta description |
| `breadcrumb` | string[] | no | 2 crumbs: brand + page |
| `header.title` | string \| null | no | Page `<h1>`; default from static data |
| `header.subtitle` | string \| null | no | Intro line under the title; static `subtitle` exists but is **not rendered yet** |
| `header.icon` | string \| null | no | Absolute URL/storage path; empty keeps the bundled SVG |
| `sections[].id` | string \| null | no | Stable slug for anchors/deep links; not rendered |
| `sections[].heading` | string | yes (per section) | Section `<h2>` |
| `sections[].blocks` | block[] | yes (per section) | See block types above; empty array hides the section body |
| `updated_at` | ISO-8601 string \| null | no | Optional “last updated” line; hidden when null |

- Every key must be **present** and `null` when unset (`header` and `sections`
  may be `null`); do not omit keys.
- `sections` order is the reading order — the backend controls it.
- Text is **plain text**. Inline HTML/Markdown is not rendered, so `<b>` or
  links will show literally. If rich text is needed, add a `rich_text` block
  type with sanitised HTML and the client will render it with `v-html`.
- The page is a legal document: when copy changes materially, bump `updated_at`
  so the date line stays accurate.

---

## 3. Notes for the backend

- **No endpoint exists** for this page (tracked in
  `api-backend-gaps-open.md` under “Static”). `GET /shop/public/terms` matches
  the existing public-CMS pattern.
- `termsPage.subtitle` exists in the static data but `PagesPageHeader` is only
  given `:title`, so the subtitle is **not rendered** today. The contract keeps
  it so the design can show it.
- The header icon is an inline SVG in the template; returning `header.icon` as
  a URL makes it swappable without a deploy.
- The breadcrumb is hardcoded in the template (`['هماکام', 'شرایط و مقررات']`).
- There is no “last updated” UI today; `updated_at` is optional and can be
  skipped if the design does not add one.
- If the legal text must also power the mobile app or emails, keep this endpoint
  as the single source of truth and render the same `sections[].blocks[]`
  structure everywhere.

---

## 4. Frontend mapping (for reference)

| API key | Rendered by |
| --- | --- |
| `breadcrumb` | `UiBreadcrumb` (desktop only, hidden on mobile by design) |
| `header.title` | `PagesPageHeader` title |
| `header.subtitle` | `PagesPageHeader` slot (not wired yet) |
| `header.icon` | `PagesPageHeader` `#icon` slot |
| `sections[].heading` | `<h2>` |
| `blocks[type=paragraph]` | `<p>` |
| `blocks[type=bullets]` | `<ul>` with dot markers |
| `updated_at` | optional date line (not wired yet) |
