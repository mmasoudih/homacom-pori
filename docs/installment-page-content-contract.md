# Installment page — content contract

Full structured payload request for `/installment` («خرید اقساطی»).
The whole page is static today (`app/data/pages/installment.ts`); no backend
endpoint exists yet.

- **Proposed endpoint:** `GET /api/shop/public/installment` (public)
  — same pattern as `/shop/public/about` and `/shop/public/contact`.
- **Frontend page:** `app/pages/installment.vue`
- **Current static data:** `app/data/pages/installment.ts`
- **Reused component:** `LandingCeoSection` at the bottom (shared with the
  landing page, not part of this contract).

The static data is the fallback for every field, so the page is complete until
admin content is filled in.

---

## 1. Visual blocks and their names

| # | Block name | What is on screen | Backend key (proposed) | Current source |
| --- | --- | --- | --- | --- |
| A | `pageHero` | Background image, breadcrumb, headline, intro, two CTAs, trust row, branded credit card | `hero` + `breadcrumb` | static (asset + copy) |
| A1 | `creditCard` | Stacked “24 ماه اقساط” card with brand logo and progress bar | `hero.credit_card` | hardcoded in the template |
| B | `stepsSection` | «مراحل خرید اقساطی» title + 5 step cards | `steps` | static (icons by name) |
| C | `partnersSection` | Title, intro, partner tabs/carousel | `partners` | static |
| C1 | `planPanel` | Selected partner: logo, name, tagline, 4 detail cells, CTA | `partners` + `plan` labels | static (labels hardcoded) |
| D | `benefitsSection` | Title, intro, 4 benefit cards (desktop only) | `benefits` | static (icons by name) |
| E | `categoriesSection` | Title + 8 category tiles | `categories` | static (icons by name) |
| F | `faqSection` | Title, subtitle, accordion | `faq` | static |
| G | `storeDescriptionBand` | Bottom store description band | shared with landing | static |

---

## 2. Proposed response

```json
{
  "success": true,
  "message": "",
  "data": {
    "seo": {
      "title": "خرید اقساطی | هماکام",
      "description": "خرید اقساطی کالای دیجیتال از هماکام با اعتبارسنجی آنی و اقساط تا ۲۴ ماه."
    },

    "breadcrumb": ["هماکام", "خرید اقساطی"],

    "hero": {
      "background_image": "https://new.ahoma.ir/storage/.../installment-bg-hero.png",
      "headline": {
        "before": "خرید اقساطی از",
        "highlight": "هماکام",
        "after": ""
      },
      "intro": "امروز بخر، ماهانه پرداخت کن؛ با اعتبارسنجی آنی ...",
      "ctas": {
        "primary": { "label": "درخواست خرید اقساطی", "url": "/installment/request" },
        "secondary": { "label": "شکایات اعتباری", "url": "/installment/complaints" }
      },
      "trust": ["تایید در چند دقیقه", "اقساط تا ۲۴ ماه"],
      "credit_card": {
        "brand": "هماکام",
        "logo": "https://new.ahoma.ir/storage/.../logo-white.svg",
        "months_prefix": "تا",
        "months": "24",
        "months_label": "ماه اقساط",
        "installment_label": "قسط اول",
        "progress_percent": 55
      }
    },

    "steps": {
      "title": "مراحل خرید اقساطی:",
      "items": [
        { "icon": "verify", "label": "ثبت‌نام و دریافت اعتبار", "subtitle": "در یکی از سایت‌های طرف قرارداد ثبت‌نام و اعتبار دریافت کنید." },
        { "icon": "account", "label": "ورود به حساب هماکام", "subtitle": "با همان شماره تلفن وارد حساب کاربری هماکام شوید." },
        { "icon": "cart", "label": "انتخاب کالا و سبد خرید", "subtitle": "کالای موردنظر را انتخاب و به سبد خرید اضافه کنید." },
        { "icon": "order", "label": "نهایی کردن خرید", "subtitle": "تایید جزئیات خرید و ثبت سفارش در فروشگاه" },
        { "icon": "payment", "label": "پرداخت با اعتبار", "subtitle": "در بخش «روش پرداخت»، گزینه «پرداخت اقساطی» را انتخاب کنید." }
      ]
    },

    "partners": {
      "title": "شرکای اعتباری هماکام",
      "intro": "هر شریک اعتباری شرایط پرداخت متفاوتی داره؛ قبل از ثبت درخواست ...",
      "detail_labels": {
        "guarantee": "نوع ضمانت",
        "settlement": "بازه تسویه",
        "ceiling": "سقف وام",
        "credit": "اعتبار / وام"
      },
      "cta_template": "ثبت درخواست از {partner}",
      "items": [
        {
          "name": "اسنپ‌پی",
          "logo": "https://new.ahoma.ir/storage/.../snapp-pay.svg",
          "brand_color": "#007DFA",
          "description": "اعتبار خرید آنلاین اسنپ‌پی",
          "guarantee": "چک صیادی بنفش",
          "settlement": "۴ ماه، ۱۸ ماه",
          "ceiling": "۲۰ و ۱۰۰ میلیون تومان",
          "credit": "وام",
          "url": "https://..."
        },
        {
          "name": "تکنوپی",
          "logo": "https://new.ahoma.ir/storage/.../techno-pay.svg",
          "brand_color": "#00B7CE",
          "description": "اعتبار خرید اقساطی تکنوپی",
          "guarantee": "چک صیادی",
          "settlement": "۶ ماه، ۱۲ ماه",
          "ceiling": "۱۰ و ۵۰ میلیون تومان",
          "credit": "وام",
          "url": "https://..."
        },
        {
          "name": "دیجی‌پی",
          "logo": "https://new.ahoma.ir/storage/.../digipay.svg",
          "brand_color": "#003EFF",
          "description": "اعتبار خرید آنلاین دیجی‌پی",
          "guarantee": "چک صیادی",
          "settlement": "۴ ماه، ۱۲ ماه",
          "ceiling": "۱۵ و ۸۰ میلیون تومان",
          "credit": "اعتبار",
          "url": "https://..."
        },
        {
          "name": "ازکی وام",
          "logo": "https://new.ahoma.ir/storage/.../azki-vam.svg",
          "brand_color": "#364FD9",
          "description": "وام و اعتبار خرید ازکی وام",
          "guarantee": "چک صیادی",
          "settlement": "۱۲ ماه، ۲۴ ماه",
          "ceiling": "۵۰ و ۲۰۰ میلیون تومان",
          "credit": "وام",
          "url": "https://..."
        },
        {
          "name": "لندو",
          "logo": "https://new.ahoma.ir/storage/.../lendo.svg",
          "brand_color": "#0AC974",
          "description": "اعتبار خرید آنلاین لندو",
          "guarantee": "چک صیادی",
          "settlement": "۴ ماه، ۱۸ ماه",
          "ceiling": "۲۰ و ۱۰۰ میلیون تومان",
          "credit": "وام",
          "url": "https://..."
        }
      ]
    },

    "benefits": {
      "title": "مزایای خرید اقساطی هماکام",
      "intro": "چهار دلیل که خرید قسطی از هماکام را متفاوت می‌کند",
      "items": [
        { "icon": "package", "title": "خرید آسان و اقساطی", "body": "کالای دلخواه خود را امروز بخرید ..." },
        { "icon": "bolt", "title": "تأیید آنلاین سریع", "body": "درخواست شما به صورت آنلاین بررسی ..." },
        { "icon": "user", "title": "بدون نیاز به ضامن", "body": "برای خرید اقساطی تا سقف اعتبار شما ..." },
        { "icon": "wallet", "title": "پرداخت اقساط آسان", "body": "پرداخت اقساط از طریق درگاه امن بانکی ..." }
      ]
    },

    "categories": {
      "title": "دسته‌بندی محصولات",
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
      "title": "سوالات متداول خرید اقساطی",
      "subtitle": "پاسخ سوالات رایج شما درباره خرید اقساطی از هماکام",
      "items": [
        { "question": "چگونه می‌توانم خرید اقساطی را ثبت کنم؟", "answer": "برای شروع کافی است در هماکام ثبت‌نام کرده ..." }
      ]
    }
  }
}
```

### Field rules

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `seo.title` | string \| null | no | Document title; default «خرید اقساطی \| هماکام» |
| `seo.description` | string \| null | no | Meta description |
| `breadcrumb` | string[] | no | 2 crumbs: brand + page |
| `hero.background_image` | string \| null | no | Hero backdrop; empty keeps the bundled image |
| `hero.headline.before` | string \| null | no | Text before the highlighted word |
| `hero.headline.highlight` | string \| null | no | Rendered in `R-300` |
| `hero.headline.after` | string \| null | no | Text after the highlighted word |
| `hero.intro` | string \| null | no | One paragraph |
| `hero.ctas.primary` | `{label, url}` \| null | no | Filled button |
| `hero.ctas.secondary` | `{label, url}` \| null | no | Outline button |
| `hero.trust` | string[] | no | Checkmark row (currently hardcoded in the template) |
| `hero.credit_card.brand` | string \| null | no | Card brand text, e.g. «هماکام» |
| `hero.credit_card.logo` | string \| null | no | Absolute URL or storage path (white logo) |
| `hero.credit_card.months_prefix` | string \| null | no | Small text above the number, e.g. «تا» |
| `hero.credit_card.months` | string \| null | no | Big number, e.g. `24` |
| `hero.credit_card.months_label` | string \| null | no | e.g. «ماه اقساط» |
| `hero.credit_card.installment_label` | string \| null | no | e.g. «قسط اول» |
| `hero.credit_card.progress_percent` | integer 0–100 \| null | no | Width of the progress bar; default 55 |
| `steps.title` | string \| null | no | Section heading |
| `steps.items[].icon` | enum \| null | no | `verify`, `account`, `cart`, `order`, `payment`; unknown → no icon |
| `steps.items[].label` | string | yes (per item) | Step title |
| `steps.items[].subtitle` | string | yes (per item) | Step description |
| `partners.title` | string \| null | no | Section heading |
| `partners.intro` | string \| null | no | Paragraph |
| `partners.detail_labels.*` | string \| null | no | Plan-panel cell labels: `guarantee`, `settlement`, `ceiling`, `credit` |
| `partners.cta_template` | string \| null | no | `{partner}` placeholder; default «ثبت درخواست از {partner}» |
| `partners.items[].name` | string | yes (per item) | Tab + panel title |
| `partners.items[].logo` | string | yes (per item) | Logo URL/storage path |
| `partners.items[].brand_color` | `#RRGGBB` \| null | no | Tab text tint when unselected |
| `partners.items[].description` | string \| null | no | Tagline beside the logo |
| `partners.items[].guarantee` | string \| null | no | Plan cell 1 |
| `partners.items[].settlement` | string \| null | no | Plan cell 2 |
| `partners.items[].ceiling` | string \| null | no | Plan cell 3 |
| `partners.items[].credit` | string \| null | no | Plan cell 4 («وام» / «اعتبار») |
| `partners.items[].url` | string \| null | no | Partner request target; button hidden when empty |
| `benefits.title` | string \| null | no | Section heading |
| `benefits.intro` | string \| null | no | Paragraph |
| `benefits.items[].icon` | enum \| null | no | `package`, `bolt`, `user`, `wallet` |
| `benefits.items[].title` | string | yes (per item) | Card title |
| `benefits.items[].body` | string | yes (per item) | Card body |
| `categories.title` | string \| null | no | Section heading |
| `categories.items[].title` | string | yes (per item) | Category label |
| `categories.items[].icon` | enum \| null | no | `mobile`, `laptop`, `watch`, `headphones`, `gamepad`, `display`, `usb`, `speakers` |
| `categories.items[].url` | string \| null | no | Optional; tiles are non-navigating today |
| `faq.title` | string \| null | no | Section heading |
| `faq.subtitle` | string \| null | no | Paragraph |
| `faq.items[]` | `{question, answer}[]` | no | Same shape as `FaqItem` used by `/shop/faqs` |

- Every key must be **present** and `null` when unset (`hero`, `steps`,
  `partners`, `benefits`, `categories`, `faq` may each be `null`); do not omit
  keys.
- Empty arrays mean “nothing to render” — the block is hidden, the page never
  breaks.
- Partner order is meaningful: the first item opens the plan panel by default.

---

## 3. Notes for the backend

- **No endpoint exists** for this page (tracked in
  `api-backend-gaps-open.md` under “Static”). `GET /shop/public/installment`
  matches the existing public-CMS pattern.
- The hero **credit card** copy (`24`, «ماه اقساط», «قسط اول», progress 55%) is
  hardcoded in the template, and `cardBadge` («۲۴ ساعته») exists in the static
  data but is **not rendered** — the contract above replaces both.
- The trust row («تایید در چند دقیقه»، «اقساط تا ۲۴ ماه») is hardcoded in the
  template; `hero.trust[]` makes it editable.
- The plan-panel labels («نوع ضمانت»، «بازه تسویه»، «سقف وام»، «اعتبار / وام»)
  and the CTA «ثبت درخواست از {partner}» are hardcoded; both are now in the
  contract so a renamed partner or a new credit type does not need a deploy.
- The current headline render does `title.replace(titleAccent, '')`, which moves
  the accent word to the end. `headline.before/highlight/after` removes that
  fragility.
- Benefits are hidden on mobile (`max-lg:hidden`) by design; the data is still
  returned once.
- Icons are an enum because the page renders local SVGs by name; if admin should
  upload icons, return an absolute URL and the client will not use the map.

---

## 4. Frontend mapping (for reference)

| API key | Rendered by |
| --- | --- |
| `breadcrumb` | `UiBreadcrumb` |
| `hero.background_image` | hero section background |
| `hero.headline.*` | `<h1>` with the red highlighted word |
| `hero.intro` | hero paragraph |
| `hero.ctas.*` | primary/secondary buttons |
| `hero.trust[]` | checkmark row |
| `hero.credit_card.*` | stacked credit-card graphic |
| `steps.title` / `.items[]` | step cards (5-col desktop, 2-col mobile) |
| `partners.title` / `.intro` | section heading + paragraph |
| `partners.items[]` | partner tabs / carousel |
| `partners.detail_labels.*` + `items[].guarantee/settlement/ceiling/credit` | plan panel cells |
| `partners.cta_template` + `items[].url` | plan panel CTA |
| `benefits.*` | benefits grid (desktop only) |
| `categories.title` / `.items[]` | category icon grid |
| `faq.*` | `PagesFaqAccordion` |
