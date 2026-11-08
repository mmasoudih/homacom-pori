# Collaboration page — content contract

Full structured payload request for `/collaboration` («پنل همکار و سازمانی»).
The whole page is static today (`app/data/pages/collaboration.ts`); no backend
endpoint exists yet.

- **Proposed endpoint:** `GET /api/shop/public/collaboration` (public)
  — same pattern as `/shop/public/about` and `/shop/public/contact`.
- **Frontend page:** `app/pages/collaboration.vue`
- **Current static data:** `app/data/pages/collaboration.ts`
- **Reused component:** `LandingCeoSection` at the bottom (shared with the
  landing page, not part of this contract).

The static data is the fallback for every field, so the page is complete until
admin content is filled in.

---

## 1. Visual blocks and their names

| # | Block name | What is on screen | Backend key (proposed) | Current source |
| --- | --- | --- | --- | --- |
| A | `pageHero` | Breadcrumb, headline, intro, two CTAs, trust row | `hero` + `breadcrumb` | static |
| A1 | `growthCard` | Chart title, static SVG chart, floating `30%+` badge, 3 stats | `hero.chart` | static |
| A2 | `heroCopy` | Headline with highlighted word, intro, CTAs, trust row | `hero.headline` / `.intro` / `.ctas` / `.trust` | static (headline hardcoded) |
| B | `audiencesSection` | Centered title with accent word, intro, 6 audience cards | `audiences` | static |
| B1…n | `audienceCard` | Icon, title, body, tag chips | `audiences.items[]` | static (icon by name) |
| C | `comparisonSection` | Two cards: “همکاری با ما” vs “خرید معمولی” | `comparison` | static |
| D | `productsSection` | Title, 8 product categories with icons | `products` | static (icon by name) |
| E | `faqSection` | Title, subtitle, accordion | `faq` | static |
| F | `storeDescriptionBand` | Bottom store description band | shared with landing | static |

---

## 2. Proposed response

```json
{
  "success": true,
  "message": "",
  "data": {
    "seo": {
      "title": "پنل همکار و سازمانی | هماکام",
      "description": "خرید عمده کالای دیجیتال برای مغازه‌داران، شرکت‌ها و سازمان‌ها."
    },

    "breadcrumb": ["هماکام", "پنل همکار و سازمانی"],

    "hero": {
      "chart": {
        "title": "روند رشد فروش شرکای هماکام",
        "badge": { "value": "30%+", "label": "حاشیه سود فروش" },
        "stats": [
          { "value": "42%", "label": "صرفه‌جویی در خرید" },
          { "value": "99%", "label": "رضایت همکاران" },
          { "value": "30%", "label": "سود فروش" }
        ]
      },
      "headline": {
        "before": "کالای دیجیتال با قیمت",
        "highlight": "عمده",
        "after": "؛ سود بیشتر برای کسب‌وکار شما"
      },
      "intro": "پنل همکار هماکام برای مغازه‌داران شهرستان، شرکت‌ها ...",
      "ctas": {
        "primary": { "label": "درخواست همکاری", "url": "/collaboration/request" },
        "secondary": { "label": "مشاهده مزایای همکاری", "url": "#benefits" }
      },
      "trust": ["قرارداد رسمی", "ارسال به سراسر کشور", "پشتیبانی شرکتی"]
    },

    "audiences": {
      "title": "پنل همابیزنس برای چه کسانی است؟",
      "accent": "همابیزنس",
      "intro": "اگر در یکی از این گروه‌ها هستید، همکاری عمده با هماکام برای شماست",
      "items": [
        {
          "icon": "store",
          "title": "مغازه‌داران شهرستان",
          "body": "خارج از تهران؛ بدون سفر به پایتخت ...",
          "tags": ["موبایل", "لپ‌تاپ", "لوازم صوتی"]
        },
        {
          "icon": "building",
          "title": "شرکت‌های خصوصی",
          "body": "تأمین لپ‌تاپ، موبایل و تجهیزات اداری ...",
          "tags": ["لپ‌تاپ", "موبایل", "مانیتور"]
        },
        {
          "icon": "bank",
          "title": "سازمان‌ها و نهادهای دولتی",
          "body": "خرید سازمانی با قرارداد رسمی ...",
          "tags": ["تجهیزات شبکه", "مانیتور", "لپ‌تاپ"]
        },
        {
          "icon": "package",
          "title": "فروشگاه‌های اینترنتی",
          "body": "تأمین پایدار کالای دیجیتال با قیمت عمده ...",
          "tags": ["موبایل", "ساعت هوشمند", "جانبی"]
        },
        {
          "icon": "server",
          "title": "پیمانکاران پروژه و شبکه",
          "body": "تأمین سرور، رم، هارد و تجهیزات شبکه ...",
          "tags": ["سرور", "رم و هارد", "شبکه"]
        },
        {
          "icon": "school",
          "title": "مراکز آموزشی و آموزشگاه‌ها",
          "body": "تجهیز سایت‌های کامپیوتر ...",
          "tags": ["کامپیوتر", "مانیتور", "تجهیزات صوتی"]
        }
      ]
    },

    "comparison": {
      "us": {
        "title": "همکاری با ما",
        "items": [
          "امکان خرید اعتباری و اقساطی",
          "فاکتور معتبر و قرارداد سازمانی برای نهادها",
          "ارسال بیمه‌شده به تمام نقاط کشور",
          "پشتیبانی شرکتی و مشاور اختصاصی",
          "کالا با ضمانت اصالت و گارانتی معتبر"
        ]
      },
      "them": {
        "title": "خرید معمولی",
        "items": [
          "محدودیت در خرید اعتباری و اقساطی",
          "قیمت خرده‌فروشی ناپایدار و بدون حاشیه سود",
          "بدون فاکتور و قرارداد رسمی برای سازمان‌ها",
          "هزینه و زمان سفر به تهران برای تأمین جنس",
          "گارانتی و اصالت کالا نامشخص"
        ]
      }
    },

    "products": {
      "title": "چه محصولاتی را عمده تأمین می‌کنیم؟",
      "intro": "تأمین عمده انواع کالای دیجیتال برای شرکای هماکام",
      "items": [
        { "title": "گوشی موبایل", "icon": "mobile" },
        { "title": "لپ‌تاپ و تبلت", "icon": "laptop" },
        { "title": "ساعت هوشمند", "icon": "watch" },
        { "title": "هدفون و هندزفری", "icon": "headphones" },
        { "title": "کنسول بازی", "icon": "gamepad" },
        { "title": "کامپیوتر", "icon": "display" },
        { "title": "لوازم جانبی", "icon": "usb" },
        { "title": "صوتی و تصویری", "icon": "speakers" }
      ]
    },

    "faq": {
      "title": "سوالات متداول همکاری با ما",
      "subtitle": "پاسخ همه سوال‌های رایج درباره همکاری با هماکام",
      "items": [
        {
          "question": "چگونه می‌توانم درخواست همکاری ثبت کنم؟",
          "answer": "کافی است از طریق دکمه «درخواست همکاری» ..."
        }
      ]
    }
  }
}
```

### Field rules

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `seo.title` | string \| null | no | Document title; default «پنل همکار و سازمانی \| هماکام» |
| `seo.description` | string \| null | no | Meta description |
| `breadcrumb` | string[] | no | 2 crumbs: brand + page |
| `hero.chart.title` | string \| null | no | Growth card heading |
| `hero.chart.badge.value` | string \| null | no | Floating badge number, e.g. `30%+` |
| `hero.chart.badge.label` | string \| null | no | Floating badge caption |
| `hero.chart.stats[]` | `{value, label}[]` | no | Exactly 3 in the design; extra rows wrap |
| `hero.headline.before` | string \| null | no | Text before the highlighted word |
| `hero.headline.highlight` | string \| null | no | Rendered in brand red |
| `hero.headline.after` | string \| null | no | Text after the highlighted word |
| `hero.intro` | string \| null | no | One paragraph |
| `hero.ctas.primary` | `{label, url}` \| null | no | Filled button; hidden when `url` is empty |
| `hero.ctas.secondary` | `{label, url}` \| null | no | Text link; hidden when `url` is empty |
| `hero.trust` | string[] | no | Checkmark row under the CTAs |
| `audiences.title` | string \| null | no | Full heading text |
| `audiences.accent` | string \| null | no | Word inside `title` to colour; currently hardcoded «همابیزنس» |
| `audiences.intro` | string \| null | no | Centered paragraph |
| `audiences.items[].icon` | enum \| null | no | `store`, `building`, `bank`, `package`, `server`, `school`; unknown → no icon |
| `audiences.items[].title` | string | yes (per item) | Card heading |
| `audiences.items[].body` | string | yes (per item) | Card paragraph |
| `audiences.items[].tags` | string[] | no | Chip row; empty hides the row |
| `comparison.us.title` | string \| null | no | «همکاری با ما» |
| `comparison.us.items` | string[] | no | Checkmark list |
| `comparison.them.title` | string \| null | no | «خرید معمولی» |
| `comparison.them.items` | string[] | no | Cross list |
| `products.title` | string \| null | no | Section heading |
| `products.intro` | string \| null | no | Sub-line (defined in the static data but **not rendered yet**) |
| `products.items[].title` | string | yes (per item) | Category label |
| `products.items[].icon` | enum \| null | no | `mobile`, `laptop`, `watch`, `headphones`, `gamepad`, `display`, `usb`, `speakers`; or an absolute icon URL |
| `products.items[].url` | string \| null | no | Optional; the tiles are non-navigating today |
| `faq.title` | string \| null | no | Section heading |
| `faq.subtitle` | string \| null | no | Centered paragraph |
| `faq.items[]` | `{question, answer}[]` | no | Same shape as `FaqItem` used by `/shop/faqs` |

- Every key must be **present** and `null` when unset (`hero`, `audiences`,
  `comparison`, `products`, `faq` may each be `null`); do not omit keys.
- Empty arrays mean “nothing to render” — the block is hidden, the page never
  breaks.
- Icons are an **enum** today because the page imports local SVGs by name
  (`app/assets`/`public/icons`). If admin should upload icons, return an
  absolute URL instead and the client will render it as `<img>`.

---

## 3. Notes for the backend

- **No endpoint exists** for this page (tracked in
  `api-backend-gaps-open.md` under “Static”). A new
  `GET /shop/public/collaboration` matches the existing public-CMS pattern.
- `headline` and `headlineHighlight` already exist in the static data but the
  template **hardcodes** the headline — the structured `headline` object above
  is what lets admin edit it.
- `compareTitle` and `productsIntro` exist in the static data but are **not
  rendered**; they are kept in the contract so the design can use them.
- If collaboration FAQs should share the main FAQ pool, return them from
  `/shop/faqs` with a `category` and skip `faq.items` here; the current design
  wants its own subset.
- CTAs currently point at `#`; the real targets (a request form / an anchor)
  should come from `hero.ctas.*.url`.

---

## 4. Frontend mapping (for reference)

| API key | Rendered by |
| --- | --- |
| `breadcrumb` | `UiBreadcrumb` |
| `hero.chart.*` | growth card (title, badge, stats; the SVG line is decorative) |
| `hero.headline.*` | `<h1>` with the highlighted word |
| `hero.intro` | hero paragraph |
| `hero.ctas.*` | primary/secondary buttons |
| `hero.trust[]` | checkmark row |
| `audiences.title` + `.accent` | `LandingSectionTitle` |
| `audiences.intro` | centered paragraph |
| `audiences.items[]` | audience cards (icon + title + body + tags) |
| `comparison.us` / `.them` | the two comparison cards |
| `products.title` / `.items[]` | product icon grid (mobile 4-col, desktop 8-col) |
| `faq.*` | `PagesFaqAccordion` |
