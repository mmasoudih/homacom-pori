// ---------------------------------------------------------------------------
// Search — mock content.
//
// Placeholder catalog used by the header search demo. The shape mirrors what a
// real `/search` endpoint would return so `~/utils/search` (and the
// `useProductSearch` composable on top of it) can be swapped for an API call
// without touching the UI.
// ---------------------------------------------------------------------------

export interface SearchProduct {
  id: string
  title: string
  image: string
  price: number
  oldPrice?: number
  discount?: number
  /** Id of one of the `searchCategoryTiles` entries. */
  categoryId: string
  /** Extra search terms (brand, OS, aliases) matched alongside the title. */
  keywords?: string[]
}

export interface SearchCategoryTile {
  id: string
  title: string
  image: string
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
  {
    id: 'search-galaxy-a05s',
    title: 'گوشی موبایل سامسونگ مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت',
    image: IMG.samsung,
    price: 8749000,
    oldPrice: 9225000,
    discount: 30,
    categoryId: 'mobile',
    keywords: ['اندروید', 'android', 'سامسونگ', 'گلکسی', 'galaxi'],
  },
  {
    id: 'search-galaxy-a25',
    title: 'گوشی موبایل سامسونگ مدل Galaxy A25 دو سیم‌کارت ظرفیت 128GB و رم 6 گیگابایت',
    image: IMG.phone2,
    price: 11200000,
    oldPrice: 12500000,
    discount: 10,
    categoryId: 'mobile',
    keywords: ['اندروید', 'android', 'سامسونگ', 'گلکسی', 'a25', 'galaxi'],
  },
  {
    id: 'search-galaxy-s24',
    title: 'گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت 256GB و رم 12 گیگابایت',
    image: IMG.phone3,
    price: 62000000,
    oldPrice: 66000000,
    discount: 6,
    categoryId: 'mobile',
    keywords: ['اندروید', 'android', 'سامسونگ', 'گلکسی', 'galaxi'],
  },
  {
    id: 'search-iphone-15',
    title: 'گوشی موبایل اپل مدل iPhone 15 Pro Max ظرفیت 256GB',
    image: IMG.apple,
    price: 87000000,
    oldPrice: 92000000,
    discount: 30,
    categoryId: 'mobile',
    keywords: ['ios', 'اپل', 'apple', 'آیفون'],
  },
  {
    id: 'search-iphone-17',
    title: 'گوشی موبایل اپل مدل iPhone 17 ظرفیت 256GB',
    image: IMG.phone3,
    price: 95000000,
    categoryId: 'mobile',
    keywords: ['ios', 'اپل', 'apple', 'آیفون'],
  },
  {
    id: 'search-redmi-note-13',
    title: 'گوشی موبایل شیائومی مدل Redmi Note 13 Pro ظرفیت 256GB و رم 8 گیگابایت',
    image: IMG.phone2,
    price: 15900000,
    oldPrice: 18500000,
    discount: 14,
    categoryId: 'mobile',
    keywords: ['اندروید', 'android', 'شیائومی', 'xiaomi'],
  },
  {
    id: 'search-ideapad',
    title: 'لپ‌تاپ لنوو مدل IdeaPad Slim 3 با پردازنده Core i3-1315U و رم 8GB',
    image: IMG.laptop,
    price: 28500000,
    oldPrice: 31000000,
    discount: 8,
    categoryId: 'laptops',
    keywords: ['ویندوز', 'windows', 'لپتاپ', 'lenovo', 'لنوو'],
  },
  {
    id: 'search-macbook-air',
    title: 'لپ‌تاپ اپل مدل MacBook Air M3 ظرفیت 512GB و رم 16GB',
    image: IMG.laptop2,
    price: 78500000,
    categoryId: 'laptops',
    keywords: ['mac os', 'macos', 'mac', 'لپتاپ', 'apple', 'اپل'],
  },
  {
    id: 'search-galaxy-tab',
    title: 'تبلت سامسونگ مدل Galaxy Tab S9 ظرفیت 128GB',
    image: IMG.laptop3,
    price: 32000000,
    oldPrice: 35000000,
    discount: 9,
    categoryId: 'tablets',
    keywords: ['اندروید', 'android', 'سامسونگ', 'تبلت', 'galaxi'],
  },
  {
    id: 'search-galaxy-watch',
    title: 'ساعت هوشمند سامسونگ مدل Galaxy Watch 6 کلاسیک',
    image: IMG.watch,
    price: 12500000,
    oldPrice: 14000000,
    discount: 11,
    categoryId: 'watches',
    keywords: ['سامسونگ', 'ساعت', 'galaxi'],
  },
  {
    id: 'search-apple-watch',
    title: 'ساعت هوشمند اپل مدل Apple Watch Series 9 ظرفیت 45 میلی‌متر',
    image: IMG.watch,
    price: 24000000,
    categoryId: 'watches',
    keywords: ['اپل', 'apple', 'ساعت'],
  },
  {
    id: 'search-sony-headphone',
    title: 'هدفون بی‌سیم سونی مدل WH-1000XM5 با نویز کنسلینگ',
    image: IMG.headset,
    price: 18500000,
    oldPrice: 19900000,
    discount: 7,
    categoryId: 'headphones',
    keywords: ['سونی', 'sony', 'هدفون', 'هندزفری'],
  },
  {
    id: 'search-airpods-pro',
    title: 'هندزفری بلوتوثی اپل مدل AirPods Pro 2',
    image: IMG.headset2,
    price: 8900000,
    oldPrice: 9900000,
    discount: 10,
    categoryId: 'headphones',
    keywords: ['اپل', 'apple', 'هندزفری', 'هدفون'],
  },
  {
    id: 'search-playstation-5',
    title: 'کنسول بازی سونی مدل PlayStation 5 اسلیم ظرفیت 1TB',
    image: IMG.laptop3,
    price: 42000000,
    oldPrice: 46000000,
    discount: 9,
    categoryId: 'consoles',
    keywords: ['سونی', 'sony', 'کنسول', 'ps5'],
  },
]
