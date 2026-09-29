import type { SearchProduct } from '~/data/search'
import { searchableProducts } from '~/data/search'

// ---------------------------------------------------------------------------
// Compare page — mock content.
//
// The product picker reuses the shared `searchableProducts` catalog so the
// «۱۴ کالا» count and search behaviour match the header search. Spec values
// are generated deterministically per product (seeded by category) so every
// catalog entry can be compared without hand-authoring 14 × N rows.
// ---------------------------------------------------------------------------

export interface CompareSpecRow {
  key: string
  label: string
}

export interface CompareSpecGroup {
  title: string
  rows: CompareSpecRow[]
}

/** Sectioned spec table, mirroring the design's «مشخصات کلیدی» / «مشخصات دوربین». */
export const compareSpecGroups: CompareSpecGroup[] = [
  {
    title: 'مشخصات کلیدی',
    rows: [
      { key: 'ram', label: 'حافظه RAM' },
      { key: 'storage', label: 'حافظه داخلی' },
      { key: 'mainCamera', label: 'دوربین اصلی' },
      { key: 'display', label: 'صفحه‌ی نمایش' },
      { key: 'battery', label: 'باتری' },
      { key: 'os', label: 'سیستم‌عامل' },
    ],
  },
  {
    title: 'مشخصات دوربین',
    rows: [
      { key: 'selfieCamera', label: 'دوربین سلفی' },
      { key: 'video', label: 'قابلیت فیلم‌برداری' },
      { key: 'cameraCount', label: 'تعداد دوربین' },
      { key: 'flash', label: 'فلش' },
    ],
  },
]

/** Flattened spec keys used to seed values. */
const SPEC_KEYS = compareSpecGroups.flatMap(group => group.rows.map(row => row.key))

interface SpecProfile {
  ram: string
  storage: string
  mainCamera: string
  selfieCamera: string
  battery: string
  display: string
  os: string
  video: string
  cameraCount: string
  flash: string
}

/** Deterministic per-category spec profile (mock — swap for real product specs). */
const SPEC_PROFILES: Record<string, SpecProfile> = {
  mobile: {
    ram: '۱۲ گیگابایت',
    storage: '۲۵۶ گیگابایت',
    mainCamera: '۶۴ مگاپیکسل',
    selfieCamera: '۱۳ مگاپیکسل',
    battery: '۵۰۰۰ میلی‌آمپر ساعت',
    display: '۶.۷ اینچ AMOLED',
    os: 'اندروید ۱۴',
    video: '۴K@30fps',
    cameraCount: '۳ عدد',
    flash: 'دارد',
  },
  laptops: {
    ram: '۱۶ گیگابایت',
    storage: '۵۱۲ گیگابایت SSD',
    mainCamera: 'دارد',
    selfieCamera: 'HD 720p',
    battery: '۵۶ وات‌ساعت',
    display: '۱۵.۶ اینچ IPS',
    os: 'ویندوز ۱۱',
    video: 'Full HD',
    cameraCount: '۱ عدد',
    flash: 'ندارد',
  },
  tablets: {
    ram: '۸ گیگابایت',
    storage: '۱۲۸ گیگابایت',
    mainCamera: '۱۳ مگاپیکسل',
    selfieCamera: '۸ مگاپیکسل',
    battery: '۸۰۰۰ میلی‌آمپر ساعت',
    display: '۱۱ اینچ TFT',
    os: 'اندروید ۱۴',
    video: '1080p@30fps',
    cameraCount: '۱ عدد',
    flash: 'دارد',
  },
  watches: {
    ram: '۲ گیگابایت',
    storage: '۱۶ گیگابایت',
    mainCamera: 'ندارد',
    selfieCamera: 'ندارد',
    battery: '۳۰۰ میلی‌آمپر ساعت',
    display: '۱.۴ اینچ AMOLED',
    os: 'Wear OS',
    video: 'ندارد',
    cameraCount: '۰ عدد',
    flash: 'ندارد',
  },
  headphones: {
    ram: '—',
    storage: '—',
    mainCamera: 'ندارد',
    selfieCamera: 'ندارد',
    battery: '۳۰ ساعت',
    display: '—',
    os: '—',
    video: 'ندارد',
    cameraCount: '۰ عدد',
    flash: 'ندارد',
  },
  consoles: {
    ram: '۱۶ گیگابایت',
    storage: '۱ ترابایت SSD',
    mainCamera: 'ندارد',
    selfieCamera: 'ندارد',
    battery: '—',
    display: '—',
    os: 'PlayStation OS',
    video: '8K',
    cameraCount: '۰ عدد',
    flash: 'ندارد',
  },
}

const DEFAULT_PROFILE: SpecProfile = {
  ram: '۸ گیگابایت',
  storage: '۱۲۸ گیگابایت',
  mainCamera: '۴۸ مگاپیکسل',
  selfieCamera: '۱۲ مگاپیکسل',
  battery: '۴۵۰۰ میلی‌آمپر ساعت',
  display: '۶.۴ اینچ',
  os: 'اندروید ۱۴',
  video: '1080p',
  cameraCount: '۲ عدد',
  flash: 'دارد',
}

function profileFor(product: SearchProduct): SpecProfile {
  return SPEC_PROFILES[product.categoryId] ?? DEFAULT_PROFILE
}

/** Resolve a spec value for a product + spec key. */
export function specValue(product: SearchProduct, key: string): string {
  if (!SPEC_KEYS.includes(key)) return '—'
  const profile = profileFor(product) as unknown as Record<string, string>
  return profile[key] ?? '—'
}

/**
 * Products seeded into the compare page on first visit. Three items match the
 * desktop design (3 filled slots + 1 «افزودن کالا» slot). Kept distinct from
 * `DEMO_COMPARE_PRODUCT_ID` so the product-detail «مقایسه» action adds rather
 * than toggles off an item that is already on the list.
 */
export const initialCompareIds: string[] = [
  'search-ideapad',
  'search-galaxy-a25',
  'search-sony-headphone',
]

/** Marketing band copy («فروشگاه اینترنتی هماکام»). */
export const compareSeo = {
  title: 'فروشگاه اینترنتی هماکام',
  body: 'کلیه لوازم مورد نیاز خود نظیر گجت‌ها، موبایل و لپ‌تاپ، لوازم خانگی برقی و غیربرقی، سکه و طلا، زیبایی و سلامت، اسباب‌بازی و شیرینی، صنایع دستی و … را با ورود به فروشگاه آنلاین هماکام به سادگی و با خیال راحت تهیه کنید.',
  moreLabel: 'نمایش بیشتر',
  lessLabel: 'نمایش کمتر',
}

/** Maximum number of products that can be compared at once. */
export const COMPARE_MAX = 4

/** Catalog id used when adding the (mock) product-detail page item to compare. */
export const DEMO_COMPARE_PRODUCT_ID = 'search-galaxy-a05s'

/** Resolve a catalog product by id. */
export function getCompareProduct(id: string): SearchProduct | undefined {
  return searchableProducts.find(product => product.id === id)
}

/** Mock color swatches per category (the picker catalog has no color data). */
const CATEGORY_SWATCHES: Record<string, string[]> = {
  mobile: ['#1d1d1f', '#ffffff', '#6fa8dc'],
  laptops: ['#1d1d1f', '#c8ccd2'],
  tablets: ['#1d1d1f', '#ffffff'],
  watches: ['#a4b7c8', '#ff8800'],
  headphones: ['#ff8800', '#5d5dff', '#ebc8cb'],
  consoles: ['#1d1d1f', '#ffffff'],
}

/** Swatch palette used by the picker rows for a given product. */
export function compareColors(product: SearchProduct): string[] {
  return CATEGORY_SWATCHES[product.categoryId] ?? []
}
