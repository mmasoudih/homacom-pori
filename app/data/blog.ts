/**
 * Blog section data.
 *
 * The blog is a self-contained content area: it has its own header navigation
 * (article categories instead of shop departments), its own landing page with
 * hero + per-category rows, a category listing page with pagination and an
 * article page (`/blog/[category]/[slug]`) with a sidebar and comments.
 *
 * Images are the design placeholders from `public/figma` — swap them for real
 * article covers once the CMS/API lands.
 */

export interface BlogNavChild {
  slug: string
  label: string
}

export interface BlogNavItem {
  slug: string
  label: string
  children: BlogNavChild[]
}

export interface BlogPost {
  slug: string
  title: string
  image: string
  /** Publication date as shown in the card meta row. */
  date: string
  /** Relative age shown on hero/overlay cards, e.g. «۲ ماه پیش». */
  age: string
  /** Chip label rendered on top of the cover. */
  category: string
  /** Slug of the owning category (used for links and breadcrumbs). */
  categorySlug: string
}

export interface BlogSection {
  title: string
  /** `null` for the «جدیدترین مقالات» row (no category to link to). */
  categorySlug: string | null
  posts: BlogPost[]
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Blog header navigation, in the design's DOM order (right → left when rendered
 * RTL). Labels are kept verbatim from the design.
 */
export const blogNav: BlogNavItem[] = [
  {
    slug: 'technology',
    label: 'تکنولوژی',
    children: [
      { slug: 'ai', label: 'هوش مصنوعی' },
      { slug: 'iot', label: 'اینترنت اشیا' },
      { slug: 'vr-ar', label: 'واقعیت مجازی و افزوده (VR/AR)' },
      { slug: 'cyber-security', label: 'امنیت سایبری' },
      { slug: 'robotics', label: 'رباتیک' },
    ],
  },
  {
    slug: 'entertainment',
    label: 'سرگرمی',
    children: [
      { slug: 'video-games', label: 'بازی‌های ویدیویی' },
      { slug: 'movies', label: 'فیلم و سریال' },
      { slug: 'vr-ar', label: 'واقعیت مجازی و افزوده (VR/AR)' },
      { slug: 'internet-culture', label: 'میم‌ها و فرهنگ اینترنتی' },
      { slug: 'tech-challenges', label: 'تست و چالش‌های تکنولوژی' },
      { slug: 'fun-gadgets', label: 'معرفی گجت‌های سرگرم‌کننده' },
    ],
  },
  {
    slug: 'console',
    label: 'کانسیت',
    children: [
      { slug: 'consoles', label: 'کنسول‌های بازی' },
      { slug: 'pc-games', label: 'بازی‌های رایانه‌ای' },
      { slug: 'online-services', label: 'سرویس‌های آنلاین' },
      { slug: 'mobile-gaming', label: 'موبایل گیمینگ' },
    ],
  },
  {
    slug: 'gaming',
    label: 'گیمینگ',
    children: [
      { slug: 'mobile-games', label: 'بازی‌های موبایل' },
      { slug: 'console-games', label: 'بازی‌های کنسولی' },
      { slug: 'pc-games', label: 'بازی‌های رایانه‌ای' },
      { slug: 'gaming-news', label: 'اخبار گیمینگ' },
    ],
  },
  {
    slug: 'product-review',
    label: 'بررسی محصولات',
    children: [
      { slug: 'mobile-review', label: 'بررسی گوشی موبایل' },
      { slug: 'laptop-review', label: 'بررسی لپ‌تاپ' },
      { slug: 'watch-review', label: 'بررسی ساعت هوشمند' },
      { slug: 'audio-review', label: 'بررسی هدفون و هندزفری' },
    ],
  },
  {
    slug: 'tips',
    label: 'آموزش و ترفند',
    children: [
      { slug: 'android', label: 'آموزش اندروید' },
      { slug: 'ios', label: 'آموزش آیفون' },
      { slug: 'windows', label: 'آموزش ویندوز' },
      { slug: 'handy-tips', label: 'ترفندهای کاربردی' },
    ],
  },
  {
    slug: 'laptop-pc',
    label: 'لپ‌تاپ و کامپیوتر',
    children: [
      { slug: 'gaming-laptop', label: 'لپ‌تاپ گیمینگ' },
      { slug: 'office-laptop', label: 'لپ‌تاپ اداری' },
      { slug: 'pc-parts', label: 'کامپیوتر و قطعات' },
      { slug: 'pc-accessories', label: 'لوازم جانبی کامپیوتر' },
    ],
  },
]

/** Maps a category slug back to its navigation entry (breadcrumbs, headings). */
export function findBlogCategory(slug: string): BlogNavItem | undefined {
  return blogNav.find(item => item.slug === slug)
}

/** `SHOP` — newsletter/shop call to action in the header and mobile drawer. */
export const blogShopCta = {
  label: 'فروشگاه',
  href: '/',
}

/* -------------------------------------------------------------------------- */
/* Posts                                                                       */
/* -------------------------------------------------------------------------- */

const COVERS = {
  watch: '/figma/fill-4d6a2b88b8435072.png',
  deepseek: '/figma/fill-d1bb52e8eb9b1170.png',
  spiderman: '/figma/fill-c57c00bcebcde686.png',
  voice: '/figma/fill-b124df30fa8cf547.png',
  illustration: '/figma/fill-bafa68ffb2491a41.png',
  smartHome: '/figma/fill-21f075633b75d651.png',
  phones: '/figma/fill-52d72a01d4f5052e.png',
  iphoneGreen: '/figma/fill-e393cbb3afd42faa.png',
} as const

export const blogCovers = COVERS

const PHONE_GUIDE_TITLE =
  'راهنمای کامل خرید گوشی موبایل در سال ۱۴۰۴: از چه نکاتی باید آگاه باشیم؟'

const CONTACTS_TITLE = 'انتقال مخاطبین به گوشی جدید؛ آموزش کامل اندروید و آیفون'

/** Pool every row on the blog landing page draws from. */
export const blogPosts: BlogPost[] = [
  {
    slug: 'rahnama-kharid-gooshi-mobile-1404',
    title: PHONE_GUIDE_TITLE,
    image: COVERS.phones,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'بررسی محصولات',
    categorySlug: 'product-review',
  },
  {
    slug: 'entegal-mokhatabin-gooshi-jadid',
    title: CONTACTS_TITLE,
    image: COVERS.illustration,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'آموزشی',
    categorySlug: 'tips',
  },
  {
    slug: 'gheimat-rangbandi-pixel-watch-5',
    title: 'قیمت و رنگ‌بندی ساعت پیکسل واچ ۵ گوگل لو رفت',
    image: COVERS.watch,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'گیمینگ',
    categorySlug: 'gaming',
  },
  {
    slug: 'modiran-hoosh-masnooei-chini-deepseek',
    title: 'مدیران هوش مصنوعی چینی دیپ‌سیک به تولید تراشه اختصاصی فکر می‌کنند',
    image: COVERS.deepseek,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'بررسی محصولات',
    categorySlug: 'product-review',
  },
  {
    slug: 'reghabat-grok-4-5-anthropic',
    title: 'رقابت گراک ۴٫۵ با قدرتمندترین هوش مصنوعی آنتروپیک از فردا آغاز می‌شود',
    image: COVERS.spiderman,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'گیمینگ',
    categorySlug: 'gaming',
  },
  {
    slug: 'spiderman-brand-new-day-trailer',
    title: 'نکات مخفی تریلر دوم Spider-Man: Brand New Day | به‌وقت درماندگی مرد عنکبوتی',
    image: COVERS.voice,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'امنیت و حریم خصوصی',
    categorySlug: 'technology',
  },
  {
    slug: 'poshtibani-sharzh-bisim',
    title: 'پشتیبانی از شارژ بی‌سیم (Wireless Charging) در نسل جدید گوشی‌ها',
    image: COVERS.iphoneGreen,
    date: '۲۷ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'تکنولوژی',
    categorySlug: 'technology',
  },
  {
    slug: 'tamame-nokat-zaroori-ghabl-az-kharid',
    title: 'تمام نکات ضروری که قبل از خرید گوشی موبایل باید بدانید',
    image: COVERS.watch,
    date: '۲۷ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'آموزشی',
    categorySlug: 'tips',
  },
  {
    slug: 'gadget-haye-ghabel-hamle',
    title: 'معرفی گجت‌های سرگرم‌کننده و قابل حملی که ارزش خرید دارند',
    image: COVERS.smartHome,
    date: '۲۶ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'سرگرمی',
    categorySlug: 'entertainment',
  },
  {
    slug: 'konsol-haye-nasl-jadid',
    title: 'مقایسه کنسول‌های نسل جدید؛ کدام یک برای شما مناسب‌تر است؟',
    image: COVERS.spiderman,
    date: '۲۶ تیر ۱۴۰۵',
    age: '۳ ماه پیش',
    category: 'کانسیت',
    categorySlug: 'console',
  },
  {
    slug: 'laptop-gaming-budget',
    title: 'بهترین لپ‌تاپ‌های گیمینگ اقتصادی در بازار ایران',
    image: COVERS.deepseek,
    date: '۲۵ تیر ۱۴۰۵',
    age: '۳ ماه پیش',
    category: 'لپ‌تاپ و کامپیوتر',
    categorySlug: 'laptop-pc',
  },
  {
    slug: 'amozesh-tanzimat-android',
    title: 'آموزش تنظیمات مخفی اندروید که کاربری گوشی را ساده‌تر می‌کند',
    image: COVERS.illustration,
    date: '۲۵ تیر ۱۴۰۵',
    age: '۳ ماه پیش',
    category: 'آموزشی',
    categorySlug: 'tips',
  },
]

/** Posts for one category page (all posts belonging to that category). */
export function postsByCategory(slug: string): BlogPost[] {
  const inCategory = blogPosts.filter(post => post.categorySlug === slug)
  return inCategory.length > 0 ? inCategory : blogPosts
}

/* -------------------------------------------------------------------------- */
/* Landing page composition                                                    */
/* -------------------------------------------------------------------------- */

/** Large slide of the blog hero. */
export const blogHeroSlides: BlogPost[] = [
  {
    slug: 'entegal-mokhatabin-gooshi-jadid',
    title: CONTACTS_TITLE,
    image: COVERS.smartHome,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'آموزشی',
    categorySlug: 'tips',
  },
  {
    slug: 'poshtibani-sharzh-bisim',
    title: 'پشتیبانی از شارژ بی‌سیم (Wireless Charging) در نسل جدید گوشی‌ها',
    image: COVERS.iphoneGreen,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'تکنولوژی',
    categorySlug: 'technology',
  },
  {
    slug: 'rahnama-kharid-gooshi-mobile-1404',
    title: PHONE_GUIDE_TITLE,
    image: COVERS.phones,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'بررسی محصولات',
    categorySlug: 'product-review',
  },
  {
    slug: 'modiran-hoosh-masnooei-chini-deepseek',
    title: 'مدیران هوش مصنوعی چینی دیپ‌سیک به تولید تراشه اختصاصی فکر می‌کنند',
    image: COVERS.deepseek,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'سرگرمی',
    categorySlug: 'entertainment',
  },
]

/** Featured card next to the hero slider. */
export const blogHeroFeatured: BlogPost = {
  slug: 'spiderman-brand-new-day-trailer',
  title: 'نکات مخفی تریلر دوم Spider-Man: Brand New Day | به‌وقت درماندگی مرد عنکبوتی',
  image: COVERS.voice,
  date: '۲۸ تیر ۱۴۰۵',
  age: '۲ ماه پیش',
  category: 'گیمینگ',
  categorySlug: 'gaming',
}

/** Three overlay cards under the hero. */
export const blogHeroRow: BlogPost[] = [
  {
    slug: 'gheimat-rangbandi-pixel-watch-5',
    title: CONTACTS_TITLE,
    image: COVERS.watch,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'گیمینگ',
    categorySlug: 'gaming',
  },
  {
    slug: 'modiran-hoosh-masnooei-chini-deepseek',
    title: CONTACTS_TITLE,
    image: COVERS.deepseek,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'سرگرمی',
    categorySlug: 'entertainment',
  },
  {
    slug: 'entegal-mokhatabin-gooshi-jadid',
    title: CONTACTS_TITLE,
    image: COVERS.illustration,
    date: '۲۸ تیر ۱۴۰۵',
    age: '۲ ماه پیش',
    category: 'آموزشی',
    categorySlug: 'tips',
  },
]

function pick(offset: number, count = 4): BlogPost[] {
  return Array.from({ length: count }, (_, i) => blogPosts[(offset + i) % blogPosts.length]!)
}

/** Rows rendered down the blog landing page. */
export const blogSections: BlogSection[] = [
  { title: 'جدیدترین مقالات', categorySlug: null, posts: pick(5) },
  { title: 'سرگرمی', categorySlug: 'entertainment', posts: pick(3) },
  { title: 'بررسی محصولات', categorySlug: 'product-review', posts: pick(1) },
  { title: 'آموزش و ترفند', categorySlug: 'tips', posts: pick(6) },
  { title: 'گیمینگ', categorySlug: 'gaming', posts: pick(0) },
]

/* -------------------------------------------------------------------------- */
/* Article                                                                     */
/* -------------------------------------------------------------------------- */

export interface BlogInlineSegment {
  text: string
  /** `strong` = bold dark, `accent` = bold brand red. */
  tone?: 'strong' | 'accent'
}

export type BlogBlock =
  | { kind: 'heading', text: string }
  | { kind: 'paragraph', segments: BlogInlineSegment[] }
  | { kind: 'list', items: BlogInlineSegment[][] }

export interface BlogComment {
  id: string
  author: string
  date: string
  text: string
  /** Star rating (1-5). Brand/admin entries have none. */
  rating?: number
  /** Brand or admin entry: renders the «ادمین» badge, logo avatar and no rating. */
  admin?: boolean
  /** Clamped posts expose a «مشاهده بیشتر» toggle. */
  clamp?: boolean
  /** Number rendered in the «پاسخ (n)» row. */
  replyCount?: number
  pros?: string[]
  cons?: string[]
}

export interface BlogArticle {
  slug: string
  categorySlug: string
  /** Chip label shown on the cover. */
  category: string
  title: string
  image: string
  author: string
  date: string
  views: string
  rating: number
  lead: string
  body: BlogBlock[]
  comments: BlogComment[]
}

export const blogArticle: BlogArticle = {
  slug: 'rahnama-kharid-gooshi-mobile-1404',
  categorySlug: 'product-review',
  category: 'بررسی محصولات',
  title: PHONE_GUIDE_TITLE,
  image: COVERS.phones,
  author: 'فرشید کریمی',
  date: 'شنبه ۱۱ بهمن ۱۴۰۴ - ۱۳:۳۰',
  views: '۳۷ نظر',
  rating: 4.5,
  lead: 'خرید گوشی موبایل یکی از مهم‌ترین تصمیمات ما در دنیای دیجیتال امروز است. با توجه به تنوع بسیار زیاد برندها و مدل‌های موجود در بازار، انتخاب یک گوشی موبایل می‌تواند چالش‌برانگیز باشد. در این مقاله، تمام نکات ضروری که قبل از خرید گوشی موبایل باید بدانید را بررسی خواهیم کرد.',
  body: [
    {
      kind: 'heading',
      text: 'بودجه: اولین و مهم‌ترین فاکتور',
    },
    {
      kind: 'paragraph',
      segments: [
        { text: 'قبل از هر چیز، باید بودجه خود را مشخص کنید. گوشی‌های موبایل در رده‌های قیمتی مختلفی عرضه می‌شوند:' },
      ],
    },
    {
      kind: 'list',
      items: [
        [
          { text: 'اقتصادی (زیر ۵ میلیون تومان):', tone: 'strong' },
          { text: ' خرید گوشی موبایل نیاز به تحقیق و بررسی دارد. با در نظر گرفتن بودجه، نیازهای شخصی و فاکتورهای مهم می‌توانید بهترین انتخاب را داشته باشید.' },
        ],
        [
          { text: 'میان‌رده (۵ تا ۱۰ میلیون تومان):', tone: 'strong' },
          { text: ' در این بازه قیمتی تنوع بسیار بالایی وجود دارد و می‌توانید گوشی‌ای با مشخصات قابل قبول تهیه کنید.' },
        ],
        [
          { text: 'پرچم‌دار (بالای ۱۰ میلیون تومان):', tone: 'strong' },
          { text: ' بهترین پردازنده‌ها، دوربین‌های حرفه‌ای و صفحه‌نمایش‌های باکیفیت در این رده قرار می‌گیرند.' },
        ],
      ],
    },
    {
      kind: 'heading',
      text: 'سیستم عامل: iOS یا Android',
    },
    {
      kind: 'paragraph',
      segments: [
        { text: 'انتخاب سیستم عامل به سبک استفاده شما بستگی دارد. هر کدام از این دو سیستم عامل مزایا و معایب خود را دارند:' },
      ],
    },
    {
      kind: 'paragraph',
      segments: [{ text: 'اندروید:', tone: 'strong' }],
    },
    {
      kind: 'list',
      items: [
        [{ text: 'تنوع بالای دستگاه‌ها در همه رده‌های قیمتی' }],
        [{ text: 'امکان شخصی‌سازی گسترده رابط کاربری' }],
        [{ text: 'پشتیبانی از کارت حافظه و باتری بزرگ‌تر' }],
      ],
    },
    {
      kind: 'paragraph',
      segments: [{ text: 'آیفون (iOS):', tone: 'strong' }],
    },
    {
      kind: 'list',
      items: [
        [{ text: 'رابط کاربری ساده و روان' }],
        [{ text: 'امنیت بالاتر' }],
        [{ text: 'پشتیبانی طولانی‌مدت' }],
        [{ text: 'اکوسیستم یکپارچه اپل' }],
        [{ text: 'قیمت بالاتر' }],
      ],
    },
    {
      kind: 'heading',
      text: 'پردازنده: مغز گوشی شما',
    },
    {
      kind: 'paragraph',
      segments: [
        { text: 'پردازنده (CPU) مهم‌ترین قطعه در تعیین عملکرد گوشی است. برای استفاده‌های مختلف:' },
      ],
    },
    {
      kind: 'list',
      items: [
        [
          { text: 'استفاده معمولی:', tone: 'strong' },
          { text: ' پردازنده‌های میان‌رده مانند Snapdragon 600 series کافی است.' },
        ],
        [
          { text: 'بازی و کارهای سنگین:', tone: 'strong' },
          { text: ' به پردازنده‌های پرچم‌دار مانند Snapdragon 8 Gen series نیاز دارید.' },
        ],
        [
          { text: 'آیفون:', tone: 'strong' },
          { text: ' تراشه‌های A-series اپل از بهترین‌ها هستند.' },
        ],
      ],
    },
  ],
  comments: [
    {
      id: 'c1',
      author: 'امیر حسین رحمانی',
      date: '۱۴۰۵/۰۳/۲۲',
      rating: 4,
      text: 'قیمت مناسبی داره . صداش هم مناسب و نگهداری شارژ ایرپاد و کیس خیلی خوبه . ولی سعی کنید کیس هفته‌ای تیپاکس قرار بود بیارن که به هفته طول کشید انتظار داشتم زودتر بیاد. اما با این حال، با صفحه نمایش روشن‌تر و هم ...',
      clamp: true,
    },
    {
      id: 'c2',
      author: 'محدثه رمضان پور',
      date: '۱۴۰۵/۰۳/۲۲',
      rating: 4,
      text: 'قیمت مناسبی داره . صداش هم مناسب و نگهداری شارژ ایرپاد و کیس خیلی خوبه . ولی سعی کنید کیس هفته‌ای تیپاکس قرار بود بیارن که به هفته طول کشید انتظار داشتم زودتر بیاد.',
    },
    {
      id: 'c3',
      author: 'میلاد قربانی',
      date: '۱۴۰۵/۰۳/۲۲',
      rating: 5,
      text: 'قیمت مناسبی داره . صداش هم مناسب و نگهداری شارژ ایرپاد و کیس خیلی خوبه .',
      pros: ['باتری مناسب'],
      cons: ['بدنه خیلی ضعیف'],
    },
    {
      id: 'c4',
      author: 'هماکام',
      date: '۱۴۰۵/۰۳/۲۲',
      admin: true,
      text: 'برام با تیپاکس قرار بود بیارن که به هفته طول کشید انتظار داشتم زودتر بیاد.',
    },
  ],
}

/** Sidebar rails on the article page. */
export const blogArticleSidebar: { title: string, posts: BlogPost[] }[] = [
  { title: 'تازترین‌ها', posts: pick(0, 6) },
  { title: 'پربازدیدترین‌ها', posts: pick(4, 6) },
]
