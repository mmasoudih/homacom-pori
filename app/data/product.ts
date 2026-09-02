// ---------------------------------------------------------------------------
// Product detail page — data model + mock content (Figma node 685:970 family)
// ---------------------------------------------------------------------------

export type StockStatus = 'available' | 'out_of_stock'

export interface ProductDetailColor {
  name: string
  value: string
}

export type GalleryItemType = 'image' | 'video' | 'view360'

export interface GalleryItem {
  type: GalleryItemType
  src?: string
}

export interface WarrantyOption {
  id: string
  label: string
}

export interface StorageOption {
  id: string
  label: string
  price: number
}

export interface SpecChip {
  label: string
  value: string
}

export interface FeatureRow {
  icon: 'dimensions' | 'cpu' | 'memory' | 'camera' | 'battery' | 'display' | 'sim' | 'os'
  label: string
  value: string
}

export interface SpecTableRow {
  label: string
  value: string
}

export interface ProductQuestion {
  id: string
  question: string
  answer: string
}

export interface ServicePackage {
  id: string
  provider: string
  name: string
  description: string
  price: number
}

export interface ServiceCatalogItem {
  id: string
  label: string
  price: number
  /** When set, a «جزئیات بیمه» link opens the insurance-info dialog. */
  detailLink?: string
}

export interface ServiceCategory {
  id: string
  title: string
  icon: 'sim' | 'insurance' | 'invoice' | 'warranty' | 'charger' | 'accessory'
  items: ServiceCatalogItem[]
}

export interface StickyLink {
  icon: 'installment' | 'insurance' | 'delivery'
  title: string
  subtitle: string
}

export interface ExpertReview {
  title: string
  intro: string[]
  image: string
  imageAlt: string
  quickLookTitle: string
  quickLook: string[]
  strengthsTitle: string
  strengths: string[]
  weaknessesTitle: string
  weaknesses: string[]
}

export interface ProductComment {
  id: string
  author: string
  isBuyer: boolean
  date: string
  rating: number
  text: string
  recommends: boolean
  likes: number
  dislikes: number
  reply?: {
    author: string
    text: string
  }
}

export interface CommentsSummary {
  average: number
  total: number
  /** Index 0 => 5-star count … index 4 => 1-star count. */
  distribution: number[]
}

export type CommentSort = 'useful' | 'newest' | 'oldest' | 'lowest' | 'highest'

export interface ProductDetail {
  id: string
  title: string
  englishTitle: string
  breadcrumb: string[]
  images: GalleryItem[]
  rating: number
  ratingCount: number
  commentsCount: number
  stockStatus: StockStatus
  /** Shown in the info box on the available variant. */
  availabilityText?: string
  colors: ProductDetailColor[]
  warrantyOptions: WarrantyOption[]
  defaultWarrantyId: string
  storageOptions: StorageOption[]
  seller: { label: string, name: string }
  price: number
  oldPrice?: number
  specChips: SpecChip[]
  features: {
    rows: FeatureRow[]
    moreCount: number
  }
  questions: ProductQuestion[]
  servicePackages: ServicePackage[]
  serviceCatalog: ServiceCategory[]
  review: ExpertReview
  specsTable: SpecTableRow[]
  specsMoreCount: number
  comments: {
    summary: CommentsSummary
    items: ProductComment[]
  }
  stickyLinks: StickyLink[]
  insurance: {
    title: string
    paragraphs: string[]
  }
  /** Related carousel title: «در کنارش خریداری شده» vs «محصولات مشابه». */
  relatedTitle: string
  related: Array<{
    id: string
    image: string
    title: string
    price: number
    oldPrice?: number
    discount?: number
    colors?: string[]
  }>
}

// ---------------------------------------------------------------------------
// Shared content fragments
// ---------------------------------------------------------------------------

const TITLE = 'گوشی موبایل سامسونگ مدل Galaxy A05s دو سیم‌کارت با ظرفیت حافظه 128GB و رم 6GB'
const ENGLISH_TITLE = 'MOBILE SAMSUNG GALAXY A05S 4G 128GB 6GB'
const BREADCRUMB = ['هماکام', 'گوشی موبایل', 'گوشی موبایل سامسونگ']

const GALLERY: GalleryItem[] = [
  { type: 'image', src: '/figma/fill-e393cbb3afd42faa.png' },
  { type: 'image', src: '/figma/fill-eedc0bf76b5dc7cd.png' },
  { type: 'image', src: '/figma/fill-603959b7e3e05165.png' },
  { type: 'video' },
  { type: 'view360' },
]

const SPEC_CHIPS: SpecChip[] = [
  { label: 'حافظه RAM', value: '4 گیگابایت' },
  { label: 'صفحه‌ی نمایش', value: '1220 در 2712 پیکسل/AMOLED' },
  { label: 'دوربین اصلی', value: '50 مگا پیکسل' },
  { label: 'حافظه داخلی', value: '128 گیگابایت' },
  { label: 'باتری', value: '5000 میلی‌آمپر ساعت' },
  { label: 'اقلام همراه گوشی', value: 'شارژر - کابل USB' },
]

const FEATURES = {
  rows: [
    { icon: 'dimensions', label: 'ابعاد و وزن', value: '۱۶۸ × ۷۷.۸ × ۸.۸ میلی‌متر / ۱۹۴ گرم' },
    { icon: 'cpu', label: 'پردازنده', value: 'MediaTek Helio G85' },
    { icon: 'memory', label: 'حافظه', value: '۱۲۸ گیگابایت' },
    { icon: 'camera', label: 'کیفیت دوربین', value: '۵۰ مگاپیکسل' },
  ] as FeatureRow[],
  moreCount: 4,
}

const SPECS_TABLE: SpecTableRow[] = [
  { label: 'حافظه RAM', value: '4 گیگابایت' },
  { label: 'حافظه داخلی', value: '128 گیگابایت' },
  { label: 'دوربین اصلی', value: '50 مگا پیکسل' },
  { label: 'صفحه‌ی نمایش', value: '1220 در 2712 پیکسل/AMOLED' },
  { label: 'باتری', value: '5000 میلی‌آمپر ساعت' },
  { label: 'اقلام همراه گوشی', value: 'شارژر - کابل USB' },
]

const QUESTIONS: ProductQuestion[] = [
  { id: 'q1', question: 'آیا این گوشی ضد آب است؟', answer: 'خیر، این گوشی قابلیت مقاومت در برابر آب ندارد.' },
  { id: 'q2', question: 'این گوشی 5G را پشتیبانی می‌کند؟', answer: 'بله، این گوشی از شبکه 5G پشتیبانی می‌کند.' },
  { id: 'q3', question: 'حافظه جانبی برای این محصول وجود دارد؟', answer: 'بله، تا ۱ ترابایت کارت حافظه پشتیبانی می‌شود.' },
]

const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg-ins-3',
    provider: 'بیمه سامانی',
    name: 'بیمه تجهیزات دیجیتال سامانی - ۳ ماهه',
    description: 'پوشش آسیب‌های فیزیکی، شکستگی و نفوذ مایعات به همراه ۱۸ ماه گارانتی داده پرداز رایانه متین',
    price: 885000,
  },
  {
    id: 'pkg-ins-12',
    provider: 'بیمه سامانی',
    name: 'بیمه تجهیزات دیجیتال سامانی - ۱۲ ماهه',
    description: 'پوشش کامل آسیب‌های فیزیکی و نرم‌افزاری به همراه ۱۸ ماه گارانتی داده پرداز رایانه متین',
    price: 1396000,
  },
]

const SERVICE_CATALOG: ServiceCategory[] = [
  {
    id: 'cat-sim',
    title: 'دریافت سیم‌کارت',
    icon: 'sim',
    items: [
      { id: 'svc-sim-1', label: 'سیم‌کارت دائمی همراه اول به نام خریدار', price: 0 },
      { id: 'svc-sim-2', label: 'سیم‌کارت اعتباری به همراه کد فعال‌سازی', price: 0 },
    ],
  },
  {
    id: 'cat-insurance',
    title: 'بیمه',
    icon: 'insurance',
    items: [
      { id: 'svc-ins-3', label: 'بیمه ۳ ماهه تجهیزات دیجیتال', price: 885000 },
      { id: 'svc-ins-12', label: 'بیمه ۱۲ ماهه تجهیزات دیجیتال', price: 1396000, detailLink: 'saman' },
      { id: 'svc-ins-gta', label: 'بیمه ترک خوردن صفحه (GTA)', price: 1369000, detailLink: 'saman' },
    ],
  },
  {
    id: 'cat-invoice',
    title: 'فاکتور رسمی',
    icon: 'invoice',
    items: [
      { id: 'svc-inv-1', label: 'فاکتور رسمی با مهر و امضای شرکت', price: 0 },
    ],
  },
  {
    id: 'cat-warranty',
    title: 'گارانتی و ضمانت',
    icon: 'warranty',
    items: [
      { id: 'svc-war-1', label: 'گارانتی ۱۸ ماهه داده پرداز رایانه متین', price: 0 },
      { id: 'svc-war-2', label: 'گارانتی ۲۴ ماهه شاهین تک', price: 0 },
    ],
  },
  {
    id: 'cat-charger',
    title: 'شارژر و کابل',
    icon: 'charger',
    items: [
      { id: 'svc-chg-1', label: 'شارژر دیواری ۲۵ وات سامسونگ', price: 490000 },
      { id: 'svc-chg-2', label: 'کابل Type-C اصلی سامسونگ', price: 180000 },
    ],
  },
]

const INSURANCE_TEXT = {
  title: 'بیمه سامانی',
  paragraphs: [
    'هر گونه آسیب‌های فیزیکی، نرم‌افزاری، سیالات و نوسانات برق، صاعقه، انفجار و ترکیدگی گاز، دود، سقوط، تصادف، شکستگی و هر نوع آسیب‌دیدگی به‌صورت ناگهانی و پیش‌بینی نشده که منجر به از کار افتادگی وغیرقابل استفاده شدن وسیله بیمه‌شده گردد.',
    'بدنه و رطوبت و خوردگی ناشی از آن، تماس هریک از قطعات ماشین با هر نوع مایعات از قبیل آب، چای، نوشیدنی‌ها، اسید و غیره.',
    'درمان هزینه های تولید کنندگان کالا کند که کار از نوع تعویض پوشش‌های بیمه‌ای را دارد.',
    'هر گونه کسری و یا نقصی که در زمان تحویل گرفتن کالا از نمایندگی فروش کالا تشخیص داده شود.',
    'هرگونه تعمیرات و یا تعویض قطعات که بدون توافق کتبی بیمه‌گر انجام شود.',
  ],
}

const STICKY_LINKS: StickyLink[] = [
  { icon: 'installment', title: 'خرید اقساطی', subtitle: 'اعتباری و بدون ضامن، بازگشت وجه' },
  { icon: 'insurance', title: 'بیمه محصول', subtitle: 'بیمه‌ی تجهیزات دیجیتال' },
  { icon: 'delivery', title: 'تحویل حضوری', subtitle: 'تحویل درب منزل، ارسال امروز' },
]

const RELATED: ProductDetail['related'] = [
  { id: 'rel-1', image: '/figma/fill-e393cbb3afd42faa.png', title: 'گوشی موبایل سامسونگ مدل Galaxy A05s دو سیم‌کارت با ظرفیت 128GB', price: 8749000, oldPrice: 9225000, discount: 30, colors: ['#1D1D1F', '#C8CCD2'] },
  { id: 'rel-2', image: '/figma/fill-eedc0bf76b5dc7cd.png', title: 'گوشی موبایل سامسونگ مدل Galaxy A05s ظرفیت 128GB و رم 4GB', price: 8200000, oldPrice: 9200000, discount: 10, colors: ['#1D1D1F', '#6FA8DC'] },
  { id: 'rel-3', image: '/figma/fill-603959b7e3e05165.png', title: 'گوشی موبایل اپل مدل iPhone 15 Pro Max ظرفیت 256GB', price: 87000000, oldPrice: 92000000, discount: 30, colors: ['#1D1D1F', '#C8CCD2'] },
  { id: 'rel-4', image: '/figma/fill-ff65a9033ba49cd4.png', title: 'گوشی موبایل شیائومی مدل Redmi Note 13 Pro ظرفیت 256GB', price: 15900000, oldPrice: 18500000, discount: 14, colors: ['#1D1D1F', '#8E7CC3'] },
  { id: 'rel-5', image: '/figma/fill-a3b65327303691bb.png', title: 'گوشی موبایل شیائومی مدل Poco X6 Pro ظرفیت 512GB', price: 22000000, oldPrice: 26000000, discount: 15, colors: ['#1D1D1F', '#C8CCD2'] },
]

const REVIEW: ExpertReview = {
  title: 'نقد و بررسی تخصصی گوشی موبایل سامسونگ مدل Galaxy A05s',
  intro: [
    'گوشی موبایل سامسونگ Galaxy A05s در نامی شاخصی و ابزار محصول در میان اقتصادی سامسونگ به شمار می‌رود که برای رقابت در میان اقتصادی با دیگر گوشی‌های بازار عرضه شده است. گوشی موبایل سامسونگ مدل Galaxy A05s در دنیای اسمارت‌فون‌ها با ویژگی‌های برجسته‌ای که دارد، توانسته توجه کاربران را جلب کند و در بازار گوشی موبایل به عنوان گزینه‌ای هوشمند و اقتصادی در سطح خود بدرخشد. حال در ادامه نگاهی می‌اندازیم به ویژگی‌های کلیدی آن.',
  ],
  image: '/figma/fill-e393cbb3afd42faa.png',
  imageAlt: 'گوشی موبایل سامسونگ Galaxy A05s',
  quickLookTitle: 'در یک نگاه سریع به ویژگی‌ها:',
  quickLook: [
    'صفحه نمایش بزرگ و روشن',
    'دوربین اصلی ۵۰ مگاپیکسل',
    'پشتیبانی از کارت حافظه جانبی',
    'باتری ۵۰۰۰ میلی‌آمپر ساعت',
    'اندروید ۱۳',
    'قیمت اقتصادی',
  ],
  strengthsTitle: 'نقاط قوت',
  strengths: [
    'طراحی زیبا و ارگونومیک',
    'صفحه نمایش بزرگ و باکیفیت',
    'پشتیبانی از کارت حافظه جانبی',
    'اندروید ۱۳',
  ],
  weaknessesTitle: 'نقاط ضعف',
  weaknesses: [
    'دوربین سلفی معمولی',
    'عدم پشتیبانی از شارژ سریع',
    'عدم وجود حسگر اثر انگشت زیر نمایشگر',
  ],
}

// ---------------------------------------------------------------------------
// Mock products
// ---------------------------------------------------------------------------

export const mockProductDetail: ProductDetail = {
  id: 'a05s-128',
  title: TITLE,
  englishTitle: ENGLISH_TITLE,
  breadcrumb: BREADCRUMB,
  images: GALLERY,
  rating: 4.3,
  ratingCount: 225,
  commentsCount: 180,
  stockStatus: 'available',
  availabilityText: 'موجود در انبار هماکام',
  colors: [
    { name: 'مشکی', value: '#1D1D1F' },
    { name: 'نقره‌ای', value: '#C8CCD2' },
    { name: 'آبی تیره', value: '#1F3A93' },
    { name: 'بنفش', value: '#8E7CC3' },
  ],
  warrantyOptions: [
    { id: 'war-shahin', label: 'گارانتی ۲۴ ماهه شاهین تک' },
    { id: 'war-omran', label: 'گارانتی ۱۸ ماهه عمران تل' },
    { id: 'war-mehr', label: 'گارانتی ۱۸ ماهه مهر سرمستان' },
  ],
  defaultWarrantyId: 'war-mehr',
  storageOptions: [
    { id: 'sto-128', label: '۱۲۸ گیگابایت', price: 8749000 },
    { id: 'sto-256', label: '۲۵۶ گیگابایت', price: 9225000 },
  ],
  seller: { label: 'فروشنده', name: 'هماکام' },
  price: 8749000,
  oldPrice: 9225000,
  specChips: SPEC_CHIPS,
  features: FEATURES,
  questions: QUESTIONS,
  servicePackages: SERVICE_PACKAGES,
  serviceCatalog: SERVICE_CATALOG,
  review: REVIEW,
  specsTable: SPECS_TABLE,
  specsMoreCount: 8,
  comments: {
    summary: { average: 3.5, total: 180, distribution: [62, 45, 30, 25, 18] },
    items: [
      {
        id: 'c1',
        author: 'سارا محمدی',
        isBuyer: true,
        date: '۱۴۰۳/۰۲/۱۵',
        rating: 5,
        text: 'گوشی خیلی خوبی است. برای استفاده‌های روزمره کاملا مناسبه و قیمتش هم به‌صرفه است. باتری خیلی خوبی دارد و تا آخر روز شارژ نگه می‌دارد. دوربینش هم برای این رده قیمتی عالی کار می‌کند.',
        recommends: true,
        likes: 3,
        dislikes: 0,
      },
      {
        id: 'c2',
        author: 'حسین کریمی',
        isBuyer: true,
        date: '۱۴۰۳/۰۲/۰۹',
        rating: 4,
        text: 'به نسبت قیمتش ارزش خرید بالایی داره. صفحه‌نمایش روشن و باکیفیتی داره و برای کارهای اداری و شبکه‌های اجتماعی خیلی روان است. فقط کاش شارژر سریع‌تری در جعبه بود.',
        recommends: true,
        likes: 2,
        dislikes: 1,
        reply: {
          author: 'هماکام',
          text: 'سلام وقت بخیر؛ از همراهی شما سپاسگزاریم. شارژر ۲۵ وات به‌صورت جداگانه نیز در فروشگاه هماکام موجود است.',
        },
      },
      {
        id: 'c3',
        author: 'علی رضایی',
        isBuyer: true,
        date: '۱۴۰۳/۰۱/۲۸',
        rating: 3,
        text: 'گوشی در کل خوب بود ولی انتظار بیشتری از پردازنده داشتم. برای بازی‌های سنگین کمی کند است اما برای کارهای عادی جوابگو است.',
        recommends: false,
        likes: 2,
        dislikes: 4,
      },
    ],
  },
  stickyLinks: STICKY_LINKS,
  insurance: INSURANCE_TEXT,
  relatedTitle: 'در کنارش خریداری شده',
  related: RELATED,
}

export const mockOutOfStockProduct: ProductDetail = {
  ...mockProductDetail,
  id: 'a05s-128-oos',
  stockStatus: 'out_of_stock',
  availabilityText: 'ناموجود',
  relatedTitle: 'محصولات مشابه',
  comments: {
    summary: { average: 3.5, total: 180, distribution: [62, 45, 30, 25, 18] },
    items: [],
  },
}

const PRODUCTS: Record<string, ProductDetail> = {
  [mockProductDetail.id]: mockProductDetail,
  [mockOutOfStockProduct.id]: mockOutOfStockProduct,
}

/** A set of ids that resolve to the available product (used by landing cards). */
export const AVAILABLE_PRODUCT_IDS = [mockProductDetail.id]

export function getProductDetail(id: string): ProductDetail | undefined {
  return PRODUCTS[id]
}

/** Landing product cards link to a demo product. */
export const DEMO_PRODUCT_ID = mockProductDetail.id
export const DEMO_OOS_PRODUCT_ID = mockOutOfStockProduct.id
