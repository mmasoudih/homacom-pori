// ---------------------------------------------------------------------------
// Search — mock content.
//
// Placeholder catalog used by the header search demo and the search-results
// page. The shape mirrors what a real `/search` endpoint would return so
// `~/utils/search` (and the `useProductSearch` / `useSearchResults` composables
// on top of it) can be swapped for an API call without touching the UI.
// ---------------------------------------------------------------------------

/** Fingerprint facet value. */
export type SearchFingerprintValue = 'has' | 'none'

export interface SearchProduct {
  id: string
  /** Numeric backend id (the `id` above is the slug used in URLs). */
  apiId?: number
  title: string
  image: string
  price: number
  oldPrice?: number
  discount?: number
  /** Default buyable stock from the list payload (`cheapest_stock.id`). */
  stockId?: number
  /** Minimum quantity the backend accepts for that stock. */
  minQuantity?: number
  /** Per-stock purchase cap. */
  maxQuantity?: number
  /**
   * Category facet id — one of `searchCategoryOptions`. In this mock the
   * category tree is brand-based (آیفون / سامسونگ / آنر …), exactly like the
   * reference design, so a product's category equals its brand.
   */
  categoryId: string
  /** Brand facet id — one of `searchBrandOptions`. */
  brandId: string
  /** Id of one of the `searchCategoryTiles` entries (header search category row). */
  tileId: string
  /** Color facet ids — a subset of `searchColorOptions`. */
  colorIds: string[]
  /** Drives the «فقط کالاهای موجود» toggle. */
  inStock: boolean
  /** Favourite state from the list payload; absent for guest requests. */
  isFavorite?: boolean
  /** Drives the «اثر انگشت» facet. */
  hasFingerprint: boolean
  /**
   * Internal storage in GB — drives the mobile-only «حافظه داخلی» facet.
   * Left undefined for products where storage is not a meaningful spec
   * (watches, earbuds); those drop out of the results while the facet is set.
   */
  storageGb?: number
  /** Popularity — «پرفروشترین». */
  sales: number
  /** Views — «پربازدیدترین». */
  views: number
  /** Sortable release stamp — «جدیدترین». */
  addedAt: number
  /** Extra search terms (brand, OS, aliases) matched alongside the title. */
  keywords?: string[]
}

export interface SearchCategoryTile {
  id: string
  title: string
  image: string
}

export interface SearchFacetOption {
  id: string
  label: string
}

/** Brand facet option — carries the latin label shown on the trailing edge. */
export interface SearchBrandOption extends SearchFacetOption {
  latin: string
}

/** Color facet option — `swatch` is a CSS background for the chip. */
export interface SearchColorOption {
  id: string
  label: string
  swatch: string
  /** Solid representative colour, used by the `<Product>` card swatches. */
  dot: string
}

/** «محبوب‌ترین جستجوها» — plain suggestion chips (no remove button). */
export const popularSearches: string[] = [
  'لپ‌تاپ',
  'اندروید',
  'A 25',
  'Iphone 15',
  'mac os',
  'Iphone 17',
  'Galaxi',
  'سامسونگ',
]

/** Category tiles shown in «در دسته‌بندی‌های «…»» (design accepts a fixed row). */
export const searchCategoryTiles: SearchCategoryTile[] = [
  { id: 'mobile', title: 'گوشی موبایل', image: '/figma/fill-ff65a9033ba49cd4.png' },
  { id: 'headphones', title: 'هدفون و هندزفری', image: '/figma/fill-bcf7fdbe4840c6f2.png' },
  { id: 'accessories', title: 'لوازم جانبی', image: '/figma/fill-603959b7e3e05165.png' },
  { id: 'tablets', title: 'تبلت', image: '/figma/fill-eedc0bf76b5dc7cd.png' },
  { id: 'watches', title: 'ساعت هوشمند', image: '/figma/fill-c06409733faa2563.png' },
  { id: 'laptops', title: 'لپ‌تاپ', image: '/figma/fill-6df25cd971d272b0.png' },
  { id: 'audio', title: 'صوتی تصویری', image: '/figma/fill-a3b65327303691bb.png' },
  { id: 'consoles', title: 'کنسول بازی', image: '/figma/fill-faa4a8621953f105.png' },
]

/** «دسته‌بندی‌ها» facet — brand-based category tree, per the reference design. */
export const searchCategoryOptions: SearchFacetOption[] = [
  { id: 'iphone', label: 'آیفون' },
  { id: 'samsung', label: 'سامسونگ' },
  { id: 'honor', label: 'آنر' },
  { id: 'xiaomi', label: 'شیائومی' },
  { id: 'google', label: 'گوگل' },
  { id: 'nokia', label: 'نوکیا' },
  { id: 'oneplus', label: 'وان پلاس' },
]

/** «برندها» facet — same brands with their latin labels. */
export const searchBrandOptions: SearchBrandOption[] = [
  { id: 'iphone', label: 'آیفون', latin: 'Iphone' },
  { id: 'samsung', label: 'سامسونگ', latin: 'Samsung' },
  { id: 'honor', label: 'آنر', latin: 'Honor' },
  { id: 'xiaomi', label: 'شیائومی', latin: 'Xiaomi' },
  { id: 'google', label: 'گوگل', latin: 'Google' },
  { id: 'nokia', label: 'نوکیا', latin: 'Nokia' },
  { id: 'oneplus', label: 'وان پلاس', latin: 'One Plus' },
]

/** «رنگ» facet — glossy swatches approximated with gradients. */
export const searchColorOptions: SearchColorOption[] = [
  { id: 'black', label: 'مشکی', swatch: 'linear-gradient(135deg, #4b4b52 0%, #1d1d1f 55%, #3a3a40 100%)', dot: '#1d1d1f' },
  { id: 'silver', label: 'نقره‌ای', swatch: 'linear-gradient(135deg, #f4f5f7 0%, #b9bdc4 45%, #e9ebee 100%)', dot: '#c9ccd1' },
  { id: 'white', label: 'سفید', swatch: 'linear-gradient(135deg, #ffffff 0%, #f1f2f4 60%, #ffffff 100%)', dot: '#ffffff' },
  { id: 'green', label: 'سبز', swatch: 'linear-gradient(135deg, #7fe3d0 0%, #159a86 55%, #4fd0b8 100%)', dot: '#159a86' },
  { id: 'yellow', label: 'زرد', swatch: 'linear-gradient(135deg, #ffe680 0%, #ffc628 55%, #ffdd6b 100%)', dot: '#ffc628' },
  { id: 'red', label: 'قرمز', swatch: 'linear-gradient(135deg, #ff8a8a 0%, #e2254f 55%, #ff6d7f 100%)', dot: '#e2254f' },
  { id: 'purple', label: 'بنفش', swatch: 'linear-gradient(135deg, #c86bfa 0%, #7b2ff7 55%, #b455f2 100%)', dot: '#7b2ff7' },
  { id: 'pink', label: 'صورتی', swatch: 'linear-gradient(135deg, #ff9ad5 0%, #ff3ea5 55%, #ff7cc4 100%)', dot: '#ff3ea5' },
  { id: 'blue', label: 'آبی', swatch: 'linear-gradient(135deg, #8ec5ff 0%, #2f6bff 55%, #6aa8ff 100%)', dot: '#2f6bff' },
  { id: 'gray', label: 'خاکستری', swatch: 'linear-gradient(135deg, #e6e7e9 0%, #b0b3b8 55%, #d6d8db 100%)', dot: '#b0b3b8' },
  { id: 'brown', label: 'قهوه‌ای', swatch: 'linear-gradient(135deg, #b98b6b 0%, #6b4226 55%, #9a6a48 100%)', dot: '#6b4226' },
  { id: 'orange', label: 'نارنجی', swatch: 'linear-gradient(135deg, #ffcf9e 0%, #ff8a3d 55%, #ffb46e 100%)', dot: '#ff8a3d' },
]

export const searchFingerprintOptions: Array<{ value: SearchFingerprintValue, label: string }> = [
  { value: 'has', label: 'دارد' },
  { value: 'none', label: 'ندارد' },
]

/**
 * «حافظه داخلی» facet — mobile-only in the current design. Ids are the storage
 * capacity in gigabytes so they map straight onto `SearchProduct.storageGb`.
 */
export const searchStorageOptions: SearchFacetOption[] = [
  { id: '64', label: '۶۴ گیگابایت' },
  { id: '128', label: '۱۲۸ گیگابایت' },
  { id: '256', label: '۲۵۶ گیگابایت' },
  { id: '512', label: '۵۱۲ گیگابایت' },
]

const IMG = {
  samsung: '/figma/fill-ff65a9033ba49cd4.png',
  phone2: '/figma/fill-e393cbb3afd42faa.png',
  phone3: '/figma/fill-eedc0bf76b5dc7cd.png',
  apple: '/figma/fill-603959b7e3e05165.png',
  laptop: '/figma/fill-6df25cd971d272b0.png',
  laptop2: '/figma/fill-f9dec0064052dff9.png',
  laptop3: '/figma/fill-faa4a8621953f105.png',
  watch: '/figma/fill-c06409733faa2563.png',
  headset: '/figma/fill-bcf7fdbe4840c6f2.png',
  headset2: '/figma/fill-a3b65327303691bb.png',
}

/**
 * Flat mock catalog. Titles deliberately mix Persian + Latin brand tokens
 * (Galaxy / iPhone / MacBook …) so the header search has something to find.
 */
export const searchableProducts: SearchProduct[] = [
  // ---------------------------- آیفون / Apple ------------------------------
  {
    id: 'search-iphone-15',
    title: 'گوشی موبایل اپل مدل iPhone 15 Pro Max ظرفیت 256GB',
    image: IMG.apple,
    price: 87000000,
    oldPrice: 92000000,
    discount: 30,
    categoryId: 'iphone',
    brandId: 'iphone',
    tileId: 'mobile',
    colorIds: ['black', 'silver', 'blue'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 980,
    views: 12400,
    addedAt: 20240401,
    keywords: ['ios', 'اپل', 'apple', 'آیفون', 'iphone 15', 'iphone', 'موبایل'],
  },
  {
    id: 'search-iphone-17',
    title: 'گوشی موبایل اپل مدل iPhone 17 ظرفیت 256GB',
    image: IMG.phone3,
    price: 95000000,
    categoryId: 'iphone',
    brandId: 'iphone',
    tileId: 'mobile',
    colorIds: ['black', 'blue'],
    inStock: false,
    hasFingerprint: true,
    storageGb: 256,
    sales: 640,
    views: 15800,
    addedAt: 20250901,
    keywords: ['ios', 'اپل', 'apple', 'آیفون', 'iphone 17', 'iphone'],
  },
  {
    id: 'search-iphone-16',
    title: 'گوشی موبایل اپل مدل iPhone 16 Pro ظرفیت 128GB',
    image: IMG.apple,
    price: 78900000,
    oldPrice: 82000000,
    discount: 14,
    categoryId: 'iphone',
    brandId: 'iphone',
    tileId: 'mobile',
    colorIds: ['silver', 'white', 'green'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 128,
    sales: 720,
    views: 9800,
    addedAt: 20240910,
    keywords: ['ios', 'اپل', 'apple', 'آیفون', 'iphone 16', 'iphone'],
  },
  {
    id: 'search-iphone-se',
    title: 'گوشی موبایل اپل مدل iPhone SE ظرفیت 64GB',
    image: IMG.phone2,
    price: 27500000,
    oldPrice: 31000000,
    discount: 8,
    categoryId: 'iphone',
    brandId: 'iphone',
    tileId: 'mobile',
    colorIds: ['black', 'red', 'white'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 64,
    sales: 410,
    views: 5400,
    addedAt: 20230308,
    keywords: ['ios', 'اپل', 'apple', 'آیفون', 'iphone se', 'iphone'],
  },
  {
    id: 'search-macbook-air',
    title: 'لپ‌تاپ اپل مدل MacBook Air M3 ظرفیت 512GB و رم 16GB',
    image: IMG.laptop2,
    price: 78500000,
    categoryId: 'iphone',
    brandId: 'iphone',
    tileId: 'laptops',
    colorIds: ['silver', 'gray', 'black'],
    inStock: true,
    hasFingerprint: false,
    storageGb: 512,
    sales: 320,
    views: 7600,
    addedAt: 20240304,
    keywords: ['mac os', 'macos', 'mac', 'مک‌بوک', 'لپتاپ', 'apple', 'اپل'],
  },
  {
    id: 'search-ipad-air',
    title: 'تبلت اپل مدل iPad Air ظرفیت 128GB',
    image: IMG.laptop3,
    price: 46500000,
    oldPrice: 51000000,
    discount: 9,
    categoryId: 'iphone',
    brandId: 'iphone',
    tileId: 'tablets',
    colorIds: ['blue', 'purple', 'gray'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 128,
    sales: 260,
    views: 4300,
    addedAt: 20240201,
    keywords: ['ios', 'آیپد', 'تبلت', 'apple', 'اپل'],
  },
  {
    id: 'search-apple-watch',
    title: 'ساعت هوشمند اپل مدل Apple Watch Series 9 ظرفیت 45 میلی‌متر',
    image: IMG.watch,
    price: 24000000,
    categoryId: 'iphone',
    brandId: 'iphone',
    tileId: 'watches',
    colorIds: ['black', 'silver', 'pink'],
    inStock: true,
    hasFingerprint: false,
    sales: 350,
    views: 6100,
    addedAt: 20230922,
    keywords: ['اپل', 'apple', 'ساعت', 'watch'],
  },
  {
    id: 'search-airpods-pro',
    title: 'هندزفری بلوتوثی اپل مدل AirPods Pro 2',
    image: IMG.headset2,
    price: 8900000,
    oldPrice: 9900000,
    discount: 10,
    categoryId: 'iphone',
    brandId: 'iphone',
    tileId: 'headphones',
    colorIds: ['white'],
    inStock: true,
    hasFingerprint: false,
    sales: 1100,
    views: 14200,
    addedAt: 20230922,
    keywords: ['اپل', 'apple', 'هندزفری', 'هدفون', 'airpods'],
  },

  // ------------------------------ سامسونگ ---------------------------------
  {
    id: 'search-galaxy-s24',
    title: 'گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت 256GB و رم 12 گیگابایت',
    image: IMG.phone3,
    price: 62000000,
    oldPrice: 66000000,
    discount: 6,
    categoryId: 'samsung',
    brandId: 'samsung',
    tileId: 'mobile',
    colorIds: ['black', 'gray', 'yellow'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 890,
    views: 11200,
    addedAt: 20240117,
    keywords: ['اندروید', 'android', 'سامسونگ', 'گلکسی', 'galaxi', 'samsung'],
  },
  {
    id: 'search-galaxy-a05s',
    title: 'گوشی موبایل سامسونگ مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت',
    image: IMG.samsung,
    price: 8749000,
    oldPrice: 9225000,
    discount: 30,
    categoryId: 'samsung',
    brandId: 'samsung',
    tileId: 'mobile',
    colorIds: ['green', 'blue', 'gray'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 128,
    sales: 1450,
    views: 18400,
    addedAt: 20231101,
    keywords: ['اندروید', 'android', 'سامسونگ', 'a05s', 'galaxi', 'samsung'],
  },
  {
    id: 'search-galaxy-a25',
    title: 'گوشی موبایل سامسونگ مدل Galaxy A25 دو سیم‌کارت ظرفیت 128GB و رم 6 گیگابایت',
    image: IMG.phone2,
    price: 11200000,
    oldPrice: 12500000,
    discount: 10,
    categoryId: 'samsung',
    brandId: 'samsung',
    tileId: 'mobile',
    colorIds: ['black', 'blue', 'yellow'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 128,
    sales: 1230,
    views: 16100,
    addedAt: 20231215,
    keywords: ['اندروید', 'android', 'سامسونگ', 'a 25', 'a25', 'galaxi', 'samsung'],
  },
  {
    id: 'search-galaxy-z-flip',
    title: 'گوشی موبایل سامسونگ مدل Galaxy Z Flip 5 ظرفیت 256GB',
    image: IMG.phone3,
    price: 54800000,
    oldPrice: 59000000,
    discount: 7,
    categoryId: 'samsung',
    brandId: 'samsung',
    tileId: 'mobile',
    colorIds: ['purple', 'green', 'black'],
    inStock: false,
    hasFingerprint: true,
    storageGb: 256,
    sales: 300,
    views: 8200,
    addedAt: 20230811,
    keywords: ['اندروید', 'android', 'سامسونگ', 'گلکسی', 'galaxi', 'samsung'],
  },
  {
    id: 'search-galaxy-tab',
    title: 'تبلت سامسونگ مدل Galaxy Tab S9 ظرفیت 128GB',
    image: IMG.laptop3,
    price: 32000000,
    oldPrice: 35000000,
    discount: 9,
    categoryId: 'samsung',
    brandId: 'samsung',
    tileId: 'tablets',
    colorIds: ['gray', 'black'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 128,
    sales: 280,
    views: 4700,
    addedAt: 20230804,
    keywords: ['اندروید', 'android', 'سامسونگ', 'تبلت', 'galaxi', 'samsung'],
  },
  {
    id: 'search-galaxy-watch',
    title: 'ساعت هوشمند سامسونگ مدل Galaxy Watch 6 کلاسیک',
    image: IMG.watch,
    price: 12500000,
    oldPrice: 14000000,
    discount: 11,
    categoryId: 'samsung',
    brandId: 'samsung',
    tileId: 'watches',
    colorIds: ['black', 'silver'],
    inStock: true,
    hasFingerprint: false,
    sales: 340,
    views: 5900,
    addedAt: 20230804,
    keywords: ['سامسونگ', 'ساعت', 'galaxi', 'samsung'],
  },
  {
    id: 'search-galaxy-buds',
    title: 'هندزفری بلوتوثی سامسونگ مدل Galaxy Buds 2 Pro',
    image: IMG.headset,
    price: 6400000,
    oldPrice: 7200000,
    discount: 12,
    categoryId: 'samsung',
    brandId: 'samsung',
    tileId: 'headphones',
    colorIds: ['white', 'black', 'purple'],
    inStock: true,
    hasFingerprint: false,
    sales: 520,
    views: 7200,
    addedAt: 20230401,
    keywords: ['سامسونگ', 'هندزفری', 'هدفون', 'samsung'],
  },

  // -------------------------------- آنر -----------------------------------
  {
    id: 'search-honor-magic6',
    title: 'گوشی موبایل آنر مدل Magic 6 Pro ظرفیت 256GB و رم 12 گیگابایت',
    image: IMG.phone2,
    price: 41900000,
    oldPrice: 45500000,
    discount: 8,
    categoryId: 'honor',
    brandId: 'honor',
    tileId: 'mobile',
    colorIds: ['green', 'black'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 460,
    views: 6800,
    addedAt: 20240301,
    keywords: ['اندروید', 'android', 'آنر', 'honor'],
  },
  {
    id: 'search-honor-x9b',
    title: 'گوشی موبایل آنر مدل X9b دو سیم‌کارت ظرفیت 256GB',
    image: IMG.phone3,
    price: 15900000,
    oldPrice: 17900000,
    discount: 11,
    categoryId: 'honor',
    brandId: 'honor',
    tileId: 'mobile',
    colorIds: ['black', 'orange'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 610,
    views: 8100,
    addedAt: 20231120,
    keywords: ['اندروید', 'android', 'آنر', 'honor'],
  },
  {
    id: 'search-honor-pad',
    title: 'تبلت آنر مدل Pad 9 ظرفیت 128GB',
    image: IMG.laptop3,
    price: 18500000,
    categoryId: 'honor',
    brandId: 'honor',
    tileId: 'tablets',
    colorIds: ['gray', 'blue'],
    inStock: false,
    hasFingerprint: true,
    storageGb: 128,
    sales: 190,
    views: 3100,
    addedAt: 20240220,
    keywords: ['آنر', 'honor', 'تبلت'],
  },
  {
    id: 'search-honor-watch',
    title: 'ساعت هوشمند آنر مدل Watch 4',
    image: IMG.watch,
    price: 7900000,
    oldPrice: 8900000,
    discount: 11,
    categoryId: 'honor',
    brandId: 'honor',
    tileId: 'watches',
    colorIds: ['black', 'green'],
    inStock: true,
    hasFingerprint: false,
    sales: 240,
    views: 3600,
    addedAt: 20231015,
    keywords: ['آنر', 'honor', 'ساعت'],
  },

  // ------------------------------ شیائومی ---------------------------------
  {
    id: 'search-xiaomi-14',
    title: 'گوشی موبایل شیائومی مدل 14 Pro ظرفیت 256GB و رم 12 گیگابایت',
    image: IMG.phone2,
    price: 47500000,
    oldPrice: 51000000,
    discount: 7,
    categoryId: 'xiaomi',
    brandId: 'xiaomi',
    tileId: 'mobile',
    colorIds: ['black', 'white', 'green'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 520,
    views: 7400,
    addedAt: 20240225,
    keywords: ['اندروید', 'android', 'شیائومی', 'xiaomi'],
  },
  {
    id: 'search-redmi-note-13',
    title: 'گوشی موبایل شیائومی مدل Redmi Note 13 Pro ظرفیت 256GB و رم 8 گیگابایت',
    image: IMG.phone3,
    price: 15900000,
    oldPrice: 18500000,
    discount: 14,
    categoryId: 'xiaomi',
    brandId: 'xiaomi',
    tileId: 'mobile',
    colorIds: ['blue', 'black', 'purple'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 1320,
    views: 17300,
    addedAt: 20240110,
    keywords: ['اندروید', 'android', 'شیائومی', 'redmi', 'xiaomi'],
  },
  {
    id: 'search-poco-x6',
    title: 'گوشی موبایل شیائومی مدل POCO X6 Pro ظرفیت 256GB',
    image: IMG.phone2,
    price: 14900000,
    categoryId: 'xiaomi',
    brandId: 'xiaomi',
    tileId: 'mobile',
    colorIds: ['yellow', 'black'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 880,
    views: 10400,
    addedAt: 20240115,
    keywords: ['اندروید', 'android', 'شیائومی', 'poco', 'xiaomi'],
  },
  {
    id: 'search-redmi-pad',
    title: 'تبلت شیائومی مدل Redmi Pad SE ظرفیت 128GB',
    image: IMG.laptop3,
    price: 9800000,
    oldPrice: 10900000,
    discount: 10,
    categoryId: 'xiaomi',
    brandId: 'xiaomi',
    tileId: 'tablets',
    colorIds: ['gray', 'green'],
    inStock: true,
    hasFingerprint: false,
    storageGb: 128,
    sales: 430,
    views: 5600,
    addedAt: 20230915,
    keywords: ['شیائومی', 'تبلت', 'redmi', 'xiaomi'],
  },
  {
    id: 'search-mi-band',
    title: 'ساعت هوشمند شیائومی مدل Smart Band 8',
    image: IMG.watch,
    price: 2400000,
    oldPrice: 2800000,
    discount: 14,
    categoryId: 'xiaomi',
    brandId: 'xiaomi',
    tileId: 'watches',
    colorIds: ['black', 'orange', 'yellow'],
    inStock: true,
    hasFingerprint: false,
    sales: 1600,
    views: 19500,
    addedAt: 20230820,
    keywords: ['شیائومی', 'ساعت', 'mi band', 'xiaomi'],
  },

  // -------------------------------- گوگل ----------------------------------
  {
    id: 'search-pixel-8',
    title: 'گوشی موبایل گوگل مدل Pixel 8 Pro ظرفیت 256GB',
    image: IMG.phone3,
    price: 52000000,
    oldPrice: 56000000,
    discount: 7,
    categoryId: 'google',
    brandId: 'google',
    tileId: 'mobile',
    colorIds: ['blue', 'black', 'white'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 350,
    views: 6200,
    addedAt: 20231004,
    keywords: ['اندروید', 'android', 'گوگل', 'google', 'pixel'],
  },
  {
    id: 'search-pixel-8a',
    title: 'گوشی موبایل گوگل مدل Pixel 8a ظرفیت 128GB',
    image: IMG.phone2,
    price: 31500000,
    categoryId: 'google',
    brandId: 'google',
    tileId: 'mobile',
    colorIds: ['green', 'black', 'blue'],
    inStock: false,
    hasFingerprint: true,
    storageGb: 128,
    sales: 270,
    views: 4900,
    addedAt: 20240514,
    keywords: ['اندروید', 'android', 'گوگل', 'google', 'pixel'],
  },
  {
    id: 'search-pixel-buds',
    title: 'هندزفری بلوتوثی گوگل مدل Pixel Buds Pro',
    image: IMG.headset,
    price: 6800000,
    oldPrice: 7500000,
    discount: 9,
    categoryId: 'google',
    brandId: 'google',
    tileId: 'headphones',
    colorIds: ['black', 'orange', 'white'],
    inStock: true,
    hasFingerprint: false,
    sales: 410,
    views: 5200,
    addedAt: 20230715,
    keywords: ['گوگل', 'google', 'هندزفری', 'هدفون'],
  },
  {
    id: 'search-pixel-watch',
    title: 'ساعت هوشمند گوگل مدل Pixel Watch 2',
    image: IMG.watch,
    price: 17500000,
    categoryId: 'google',
    brandId: 'google',
    tileId: 'watches',
    colorIds: ['silver', 'black'],
    inStock: true,
    hasFingerprint: false,
    sales: 180,
    views: 2900,
    addedAt: 20231004,
    keywords: ['گوگل', 'google', 'ساعت'],
  },

  // -------------------------------- نوکیا ---------------------------------
  {
    id: 'search-nokia-g42',
    title: 'گوشی موبایل نوکیا مدل G42 5G دو سیم‌کارت ظرفیت 128GB',
    image: IMG.phone2,
    price: 7900000,
    oldPrice: 8900000,
    discount: 11,
    categoryId: 'nokia',
    brandId: 'nokia',
    tileId: 'mobile',
    colorIds: ['purple', 'gray'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 128,
    sales: 300,
    views: 3800,
    addedAt: 20230710,
    keywords: ['اندروید', 'android', 'نوکیا', 'nokia'],
  },
  {
    id: 'search-nokia-xr21',
    title: 'گوشی موبایل نوکیا مدل XR21 ظرفیت 256GB',
    image: IMG.phone3,
    price: 14200000,
    oldPrice: 15800000,
    discount: 10,
    categoryId: 'nokia',
    brandId: 'nokia',
    tileId: 'mobile',
    colorIds: ['black', 'green'],
    inStock: false,
    hasFingerprint: true,
    storageGb: 256,
    sales: 120,
    views: 2100,
    addedAt: 20230601,
    keywords: ['اندروید', 'android', 'نوکیا', 'nokia'],
  },

  // ------------------------------ وان پلاس --------------------------------
  {
    id: 'search-oneplus-12',
    title: 'گوشی موبایل وان پلاس مدل 12 ظرفیت 256GB و رم 12 گیگابایت',
    image: IMG.phone2,
    price: 49800000,
    oldPrice: 53900000,
    discount: 8,
    categoryId: 'oneplus',
    brandId: 'oneplus',
    tileId: 'mobile',
    colorIds: ['black', 'green', 'white'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 480,
    views: 6900,
    addedAt: 20240123,
    keywords: ['اندروید', 'android', 'وان پلاس', 'oneplus'],
  },
  {
    id: 'search-oneplus-nord',
    title: 'گوشی موبایل وان پلاس مدل Nord 3 ظرفیت 256GB',
    image: IMG.phone3,
    price: 19500000,
    oldPrice: 21900000,
    discount: 11,
    categoryId: 'oneplus',
    brandId: 'oneplus',
    tileId: 'mobile',
    colorIds: ['gray', 'green'],
    inStock: true,
    hasFingerprint: true,
    storageGb: 256,
    sales: 540,
    views: 6300,
    addedAt: 20230705,
    keywords: ['اندروید', 'android', 'وان پلاس', 'oneplus', 'nord'],
  },
  {
    id: 'search-oneplus-buds',
    title: 'هندزفری بلوتوثی وان پلاس مدل Buds Pro 2',
    image: IMG.headset2,
    price: 5200000,
    oldPrice: 5900000,
    discount: 12,
    categoryId: 'oneplus',
    brandId: 'oneplus',
    tileId: 'headphones',
    colorIds: ['black', 'white'],
    inStock: true,
    hasFingerprint: false,
    sales: 380,
    views: 4400,
    addedAt: 20230207,
    keywords: ['وان پلاس', 'oneplus', 'هندزفری', 'هدفون'],
  },
]
