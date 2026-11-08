# Contact Us page — content contract

Request for a **structured** payload for the static copy on `/contact-us`, so the
remaining hardcoded strings can be managed from admin. Live contact details
(`tel`, `mobile`, `email`, `address`, socials, `contact_popup`) already come from
the API and are **not** part of this request.

- **Endpoint:** `GET /api/shop/public/contact` (public) — proposed to gain a
  `content` object; existing keys stay unchanged.
- **Frontend page:** `app/pages/contact-us.vue`
- **Current static data:** `app/data/pages/contact.ts`
- **Form endpoint:** `POST /api/shop/contact-us` (already live, 2026-11-03)

The static data is the fallback for every field, so the page is complete until
admin content is filled in.

---

## 1. Visual blocks and their names

| # | Block name | What is on screen | Backend key (proposed) | Current source |
| --- | --- | --- | --- | --- |
| A | `pageHero` | Title + support-hours subtitle above the cards | `content.hero` | static |
| B | `guideCard` | “راهنمای آنلاین” card with two shortcut buttons | `content.guide` | static (targets hardcoded) |
| C | `phoneCard` | Title, availability line with bold times, note, phone/mobile buttons, social icons | `content.phone` + existing `tel`/`mobile`/socials | static + API |
| D | `emailCard` | Title, description with bold “۲۴ ساعت”, email button | `content.email` + existing `email` | static + API |
| E | `locationCard` | Map placeholder, store title, address, “نمایش در نقشه” button | `content.location` + existing `address` | static + API |
| F | `messageForm` | Form title/subtitle, labels, placeholders, subject list, submit label | `content.form` | static |
| G | `supportWidget` | Floating contact buttons | existing `contact_popup` + `contact_popup_status` | API |
| H | `storeDescriptionBand` | Bottom store description band | shared with landing (`ceoSection`) | static |

> Unused today: `contactPage.guideRows[].subtitle` is defined but not rendered
> (only `.title` is). Rename it to `caption` in the contract if you want it
> displayed as helper text.

---

## 2. Proposed response

Extend the existing payload without touching the live keys:

```json
{
  "success": true,
  "message": "",
  "data": {
    "tel": "02188907373",
    "mobile": "09124488898",
    "email": "farshid@homacom.com",
    "address": "تهران، خیابان ولیعصر، ...",
    "twitter": null,
    "telegram": null,
    "linkedin": null,
    "instagram": null,
    "watsapp": null,
    "contact_popup": [],
    "contact_popup_status": "enable",

    "content": {
      "breadcrumb": "تماس با ما",

      "hero": {
        "title": "تماس با ما",
        "subtitle": "تیم پشتیبانی هماکام ۲۴ ساعته آماده پاسخگویی به سوالات و درخواست‌های شماست"
      },

      "guide": {
        "title": "راهنمای آنلاین",
        "subtitle": "قبل از ارتباط با پشتیبانی، راهنمای آنلاین و سوالات متداول را مشاهده کنید؛\nجواب بیشتر سوال‌ها همان‌جاست.",
        "links": [
          {
            "title": "راهنمای آنلاین",
            "caption": "قبل از ارسال درخواست با پشتیبانی، راهنمای آنلاین و سوالات متداول را مطالعه کنید.",
            "url": "/guarantee",
            "icon": "guide"
          },
          {
            "title": "سوالات متداول",
            "caption": "پاسخ بیشتر سوالات شما درباره خرید، ارسال و گارانتی در صفحه سوالات متداول موجود است.",
            "url": "/faq",
            "icon": "faq"
          }
        ]
      },

      "phone": {
        "title": "تماس تلفنی و شبکه‌های اجتماعی",
        "description": [
          { "text": "پاسخگویی از " },
          { "text": "۸ صبح", "bold": true },
          { "text": " تا " },
          { "text": "۵ عصر", "bold": true },
          { "text": " در چت آنلاین، تلفن و شبکه‌های اجتماعی." }
        ],
        "note": "در صورت نیاز با پشتیبانی هما‌کام تماس بگیرید."
      },

      "email": {
        "title": "آدرس ایمیل",
        "description": [
          { "text": "برای امور همکاری، انتقاد و پیشنهاد یا پیگیری مکتوب، ایمیل بزنید؛ پاسخ در کمتر از " },
          { "text": "۲۴ ساعت", "bold": true },
          { "text": " در روزهای غیر تعطیل." }
        ]
      },

      "location": {
        "title": "آدرس فروشگاه",
        "map_url": "https://maps.google.com/?q=...",
        "map_label": "نمایش در نقشه",
        "map_image": "https://new.ahoma.ir/storage/.../map.png"
      },

      "form": {
        "title": "ارسال پیام",
        "subtitle": "فرم زیر را پر کنید؛ کارشناسان ما در اولین فرصت با شما تماس می‌گیرند.",
        "labels": {
          "name": "نام و نام خانوادگی",
          "contact": "شماره تماس یا ایمیل",
          "subject": "موضوع",
          "message": "متن پیام"
        },
        "placeholders": {
          "name": "مثال: علی رضایی",
          "contact": "۰۹۱۲۳۴۵۶۷۸۹ یا email@example.com",
          "subject": "انتخاب کنید",
          "message": "پیام خود را بنویسید"
        },
        "submit_label": "ارسال پیام",
        "subjects": [
          "سوال درباره سفارش",
          "پیگیری سفارش",
          "همکاری و فروش عمده",
          "انتقاد و پیشنهاد",
          "سایر موارد"
        ],
        "success_message": "پیام شما با موفقیت ثبت شد.",
        "error_message": "ارسال پیام انجام نشد. دوباره تلاش کنید."
      }
    }
  }
}
```

### Field rules

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `content.breadcrumb` | string \| null | no | Last breadcrumb crumb; default «تماس با ما» |
| `content.hero.title` | string \| null | no | Page `<h1>`; also used for the document title |
| `content.hero.subtitle` | string \| null | no | One or two lines under the title |
| `content.guide.title` | string \| null | no | Card heading |
| `content.guide.subtitle` | string \| null | no | `\n` is preserved (`whitespace-pre-line`) |
| `content.guide.links[].title` | string | yes (per link) | Button label |
| `content.guide.links[].caption` | string \| null | no | Helper text; currently unused by the design |
| `content.guide.links[].url` | string | yes (per link) | Internal path or absolute URL; **do not** hardcode `/guarantee` / `/faq` in the client |
| `content.guide.links[].icon` | `guide` \| `faq` \| null | no | Icon enum; unknown values fall back to the neutral icon |
| `content.phone.title` | string \| null | no | Card heading |
| `content.phone.description` | `{text, bold?}[]` | no | Segmented line so key times stay bold without HTML |
| `content.phone.note` | string \| null | no | Second line under the description |
| `content.email.title` | string \| null | no | Card heading |
| `content.email.description` | `{text, bold?}[]` | no | Same segmented format |
| `content.location.title` | string \| null | no | Card heading; the address itself stays in the top-level `address` |
| `content.location.map_url` | string \| null | no | Target of “نمایش در نقشه”; button hidden when empty |
| `content.location.map_label` | string \| null | no | Default «نمایش در نقشه» |
| `content.location.map_image` | string \| null | no | Map preview image (currently a designed placeholder) |
| `content.form.title` | string \| null | no | Card heading |
| `content.form.subtitle` | string \| null | no | One line under the heading |
| `content.form.labels.*` | string \| null | no | One entry per field: `name`, `contact`, `subject`, `message` |
| `content.form.placeholders.*` | string \| null | no | `subject` is the select’s disabled option |
| `content.form.submit_label` | string \| null | no | Default «ارسال پیام» |
| `content.form.subjects` | string[] | no | Options sent as `title` to `POST /shop/contact-us`; an empty list hides nothing (keeps the fallback) |
| `content.form.success_message` | string \| null | no | Toast body after a 201 |
| `content.form.error_message` | string \| null | no | Toast body for unexpected failures (422 field errors still come from the API) |

- Every key must be **present** and `null` when unset (`content` itself may be
  `null`); do not omit keys.
- Empty arrays/strings mean “keep the designed fallback” — the page never breaks.
- `{text, bold?}` segments replace HTML in the two description lines; `bold:
  true` renders the segment in the emphasis colour.
- The top-level `tel` / `mobile` / `email` / `address` stay the source of truth
  for the actual values; `content.*` only carries the surrounding copy.

---

## 3. Form contract (already live)

`POST /api/shop/contact-us` — public, no token.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `full_name` | string | yes | 3–150 chars |
| `mobile` | string | if no `email` | 11-digit numeric |
| `email` | string | if no `mobile` | valid email, max 198 |
| `title` | string | yes | 3–255 chars (one of `form.subjects`) |
| `message` | string | yes | 10–5000 chars |

The page has a single “شماره تماس یا ایمیل” input and splits it client-side: an
email goes to `email`, an 11-digit mobile (Persian digits accepted) goes to
`mobile`. 422 `errors` keys (`full_name`, `mobile`, `email`, `title`,
`message`) are mapped back onto the matching field.

---

## 4. Frontend mapping (for reference)

| API key | Rendered by |
| --- | --- |
| `content.breadcrumb` | `UiBreadcrumb` trail |
| `content.hero.title` / `.subtitle` | page hero |
| `content.guide.title` / `.subtitle` / `.links[]` | online-guide card |
| `content.phone.title` / `.description[]` / `.note` | phone & socials card |
| `tel` / `mobile` / socials | phone buttons + social row |
| `content.email.title` / `.description[]` | email card |
| `email` | email button |
| `content.location.title` / `.map_url` / `.map_label` / `.map_image` | map + address card |
| `address` | address line |
| `content.form.*` | message form |
| `contact_popup` / `contact_popup_status` | floating support widget |
