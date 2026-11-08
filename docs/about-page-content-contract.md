# About Us page — content contract

Request for a **structured** payload for `/about-us`, replacing the single
`about_us` HTML blob with one field per visual block so the page can be managed
from admin instead of hardcoded copy.

- **Endpoint:** `GET /api/shop/public/about` (public)
- **Current shape:** `{ about_us: string|null, about_us_link: string|null, seo_about: string|null }`
- **Frontend page:** `app/pages/about-us.vue`
- **Current static data:** `app/data/pages/about.ts`

Keep the existing keys during the transition; the page renders `about_us` below
the designed blocks when the new structured keys are absent.

---

## 1. Visual blocks and their names

| # | Block name | What is on screen | Backend key (proposed) | Current source |
| --- | --- | --- | --- | --- |
| A | `heroCard` | Large two-column card at the top | `hero` | static |
| A1 | `brandBadge` | Logo/icon + short subtitle in the right panel | `hero.badge` | static |
| A2 | `intro` | Two intro paragraphs in the left panel | `hero.paragraphs[]` | static |
| B | `articleCard` | Article card with heading + paragraphs per topic | `sections[]` | static |
| B1…n | `section` | One topic: heading, optional sub-heading, paragraphs | `sections[]` | static |
| C | `richTextBlock` | Free rich-text article below the divider | `about_us` (existing) | API |
| D | `ctaButton` | “اطلاعات بیشتر” button | `about_us_link` (existing) + label | API |
| E | `storeDescriptionBand` | Store description band at the bottom, expandable (“بیشتر”) | `store_description` (optional) | static, shared with landing (`ceoSection`) |

`seo_about` (existing) stays the page `<title>`. If you add a meta description,
return it as `seo_description`.

> Note: `aboutPage.titleLines` (“درباره / هما / کام”) and every
> `sections[].subHeading` are defined in the static data but **not rendered**
> today. If `sub_heading` is returned, the page will render it.

---

## 2. Proposed response

```json
{
  "success": true,
  "message": "",
  "data": {
    "seo_about": "درباره ما | هماکام",
    "seo_description": "هماکام؛ فروشگاه اینترنتی تخصصی محصولات دیجیتال.",

    "hero": {
      "badge": {
        "logo": "https://new.ahoma.ir/storage/.../about-badge.svg",
        "logo_alt": "هماکام",
        "subtitle": "فروشگاه اینترنتی هماکام"
      },
      "paragraphs": [
        "هماکام یک فروشگاه اینترنتی تخصصی ...",
        "از همان روزهای نخست، تمرکز ما بر شفافیت ..."
      ]
    },

    "sections": [
      {
        "heading": "ما چه کاری انجام می‌دهیم؟",
        "sub_heading": "علت موفقیت ما",
        "paragraphs": [
          "هماکام مرجعی معتبر برای خرید انواع کالاهای دیجیتال ..."
        ]
      },
      {
        "heading": "تعهد ما به شما",
        "sub_heading": "سفارشی‌سازی",
        "paragraphs": [
          "تیم هماکام با تکیه بر دانش فنی ...",
          "در هماکام باور داریم که موفقیت هر کسب‌وکاری ..."
        ]
      },
      {
        "heading": "چشم‌انداز ما",
        "sub_heading": "تحلیل و بهبود",
        "paragraphs": [
          "ما به صورت مداوم در حال بهبود فرآیندهای خود هستیم ..."
        ]
      }
    ],

    "about_us": "<p>متن آزاد (HTML) — همچنان پشتیبانی می‌شود</p>",
    "about_us_link": "https://example.com/page",
    "about_us_link_label": "اطلاعات بیشتر"
  }
}
```

### Field rules

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `seo_about` | string \| null | no | Page `<title>`; falls back to «درباره ما \| هماکام» |
| `seo_description` | string \| null | no | Meta description if it should be managed |
| `hero.badge.logo` | string \| null | no | Absolute URL or storage path |
| `hero.badge.logo_alt` | string \| null | no | Accessible alt text |
| `hero.badge.subtitle` | string \| null | no | One short line under the logo |
| `hero.paragraphs` | string[] | no | 1–3 paragraphs; each is plain text (HTML allowed) |
| `sections[].heading` | string | yes (per section) | Section title |
| `sections[].sub_heading` | string \| null | no | Rendered under the heading when present |
| `sections[].paragraphs` | string[] | yes (per section) | 1–n paragraphs |
| `about_us` | string \| null | no | Free rich text; keeps the current behaviour |
| `about_us_link` | string \| null | no | CTA target; button hidden when empty |
| `about_us_link_label` | string \| null | no | CTA label; default «اطلاعات بیشتر» |

- Every key must be **present** and `null` when unset (`hero` may be `null`);
  do not omit keys.
- Empty arrays (`[]`) mean “nothing to render” — the block is hidden, the page
  never breaks.
- Plain-text paragraphs are enough; the frontend currently renders them as
  `<p>` and only `about_us` goes through `v-html`.

---

## 3. Frontend mapping (for reference)

| API key | Rendered by |
| --- | --- |
| `seo_about` | `useHead` title in `app/pages/about-us.vue` |
| `hero.badge.logo` / `.logo_alt` / `.subtitle` | right panel of the hero card |
| `hero.paragraphs[]` | left panel of the hero card |
| `sections[].heading` / `.sub_heading` / `.paragraphs[]` | article card |
| `about_us` | rich-text block under the article divider |
| `about_us_link` + `about_us_link_label` | CTA button |
| `store_description` (optional) | bottom band (currently `LandingCeoSection`) |

The static copy in `app/data/pages/about.ts` is the fallback for every block,
so the page looks complete before the admin content is filled in.
