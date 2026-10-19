// ---------------------------------------------------------------------------
// Cart page — data model + mock content
// (Figma: «Cart» desktop 31431, «Cart - Empty» 30781, «Cart» mobile 81565)
// ---------------------------------------------------------------------------
import type { Product } from '~/utils/product'

export interface CartInsurance {
  id: string
  name: string
  price: number
  oldPrice?: number
  discount?: number
}

export interface CartService {
  id: string
  label: string
  price: number
}

/** A category of add-on services offered by the «افزودن خدمت» dialog. */
export interface CartServiceGroup {
  id: string
  title: string
  icon: string
  items: CartService[]
}

export interface CartItem {
  id: string
  /** Backend cart-item id (needed for add/sub/remove calls). */
  apiId?: number
  /** Backend stock id for the line. */
  stockId?: number
  title: string
  href: string
  image: string
  color: {
    name: string
    value: string
  }
  warranty: string
  /** Shown as «اقساط:» in the item meta rows. */
  installment?: string
  price: number
  oldPrice?: number
  /** Explicit badge percentage (the design keeps 30% on a 92→89M price). */
  discount?: number
  quantity: number
  /** Quantity cap — the design shows «حداکثر» once the cap is reached. */
  maxQuantity?: number
  /** Set when the line is a specific seller offer (its own price/terms). */
  sellerName?: string
  insurance: CartInsurance | null
  /** Policies offered when picking insurance for this line. */
  insuranceOptions?: CartInsurance[]
  /** Everything selectable from the «افزودن خدمت» dialog. */
  serviceGroups?: CartServiceGroup[]
  services: CartService[]
}

const IPHONE_TITLE =
  'گوشی موبایل اپل مدل iPhone 17 CH دو سیم کارت ظرفیت 256 گیگابایت و رم 8 گیگابایت - رجیستر شده و اکتیو'

const LAPTOP_TITLE =
  'لپ‌تاپ لنوو مدل IdeaPad Slim 3 15IRU8 با پردازنده Core i3-1315U، رم LPDDR5 8GB با فرکانس بالا'

const SAMSUNG_TITLE =
  'گوشی موبایل سامسونگ مدل Galaxy A05s دو سیم‌کارت ظرفیت 128GB و رم 4 گیگابایت'

const cartImage = {
  iphone: '/figma/fill-e393cbb3afd42faa.png',
  laptop: '/figma/fill-f9dec0064052dff9.png',
  samsung: '/figma/fill-eedc0bf76b5dc7cd.png',
}

/** Selectable policies in the insurance dialog (Figma «انتخاب بیمه»). */
export const cartInsuranceOptions: CartInsurance[] = [
  {
    id: 'digital-equipment-saman',
    name: 'بیمه تجهیزات دیجیتال - بیمه سامان',
    price: 3_500_000,
    oldPrice: 4_000_000,
    discount: 12,
  },
  { id: 'digital-equipment-sina', name: 'بیمه سینا', price: 1_200_000 },
  { id: 'digital-equipment-matin', name: 'بیمه متین', price: 690_000 },
]

const DIGITAL_INSURANCE: CartInsurance = cartInsuranceOptions[0]!

const ACCESSORY_SERVICES: CartService[] = [
  { id: 'android-games', label: 'بازی‌های اندروید', price: 1_200_000 },
  { id: 'protective-case', label: 'کاور محافظتی', price: 2_180_000 },
]

/** Groups shown in the cart's «افزودن خدمات و لوازم جانبی» dialog. */
export const cartServiceGroups: CartServiceGroup[] = [
  {
    id: 'cat-apps',
    title: 'نرم‌افزارهای کاربردی',
    icon: 'package',
    items: [
      { id: 'android-games', label: 'بازی‌های اندروید', price: 1_200_000 },
      { id: 'offline-map', label: 'نصب نقشه آفلاین', price: 350_000 },
      { id: 'office-suite', label: 'نصب بسته اداری', price: 480_000 },
    ],
  },
  {
    id: 'cat-protection',
    title: 'گارد و محافظ',
    icon: 'shield',
    items: [
      { id: 'protective-case', label: 'کاور محافظتی', price: 2_180_000 },
      { id: 'screen-glass', label: 'گلس محافظ صفحه', price: 590_000 },
    ],
  },
  {
    id: 'cat-charger',
    title: 'شارژ و کابل',
    icon: 'bolt',
    items: [
      { id: 'wall-charger', label: 'شارژر دیواری ۲۵ وات سامسونگ', price: 490_000 },
      { id: 'cable-c', label: 'کابل Type-C اصلی سامسونگ', price: 180_000 },
    ],
  },
  {
    id: 'cat-accessory',
    title: 'لوازم جانبی',
    icon: 'usb',
    items: [
      { id: 'usb-64', label: 'فلش مموری ۶۴ گیگابایت', price: 850_000 },
      { id: 'memory-card', label: 'میکرو اس‌دی ۱۲۸ گیگابایت', price: 1_150_000 },
    ],
  },
]

export const cartItems: CartItem[] = [
  {
    id: 'iphone-17-256-blue',
    title: IPHONE_TITLE,
    href: '/product/iphone-17',
    image: cartImage.iphone,
    color: { name: 'آبی', value: '#68a1d5' },
    warranty: 'گارانتی 18 ماهه مهر سرمستان',
    price: 89_000_000,
    oldPrice: 92_000_000,
    discount: 30,
    quantity: 1,
    insurance: DIGITAL_INSURANCE,
    insuranceOptions: cartInsuranceOptions,
    serviceGroups: cartServiceGroups,
    services: ACCESSORY_SERVICES,
  },
  {
    id: 'ideapad-slim-3',
    title: LAPTOP_TITLE,
    href: '/product/ideapad-slim-3',
    image: cartImage.laptop,
    color: { name: 'آبی', value: '#68a1d5' },
    warranty: 'گارانتی 18 ماهه مهر سرمستان',
    installment: 'اسنپ‌پی',
    price: 89_000_000,
    quantity: 3,
    maxQuantity: 5,
    insurance: null,
    insuranceOptions: cartInsuranceOptions,
    serviceGroups: cartServiceGroups,
    services: [],
  },
  {
    id: 'iphone-17-256-blue-2',
    title: IPHONE_TITLE,
    href: '/product/iphone-17',
    image: cartImage.iphone,
    color: { name: 'آبی', value: '#68a1d5' },
    warranty: 'گارانتی 18 ماهه مهر سرمستان',
    price: 89_000_000,
    oldPrice: 92_000_000,
    discount: 30,
    quantity: 8,
    maxQuantity: 8,
    insurance: null,
    insuranceOptions: cartInsuranceOptions,
    serviceGroups: cartServiceGroups,
    services: [],
  },
  {
    id: 'iphone-17-256-blue-3',
    title: IPHONE_TITLE,
    href: '/product/iphone-17',
    image: cartImage.iphone,
    color: { name: 'آبی', value: '#68a1d5' },
    warranty: 'گارانتی 18 ماهه مهر سرمستان',
    price: 89_000_000,
    oldPrice: 92_000_000,
    discount: 30,
    quantity: 1,
    insurance: DIGITAL_INSURANCE,
    insuranceOptions: cartInsuranceOptions,
    serviceGroups: cartServiceGroups,
    services: ACCESSORY_SERVICES,
  },
]

/** «بازدیدهای اخیر شما» — the carousel under the cart. */
export const cartRecentlyViewed: Product[] = [
  {
    id: 'samsung-a05s-1',
    title: SAMSUNG_TITLE,
    image: cartImage.samsung,
    price: 87_000_000,
    oldPrice: 92_000_000,
    discount: 30,
    colors: ['#56dd1c', '#68a1d5', '#ffffff'],
  },
  {
    id: 'samsung-a05s-2',
    title: SAMSUNG_TITLE,
    image: '/figma/fill-c06409733faa2563.png',
    price: 87_000_000,
    colors: ['#1d1d1f', '#ffffff'],
  },
  {
    id: 'samsung-a05s-3',
    title: SAMSUNG_TITLE,
    image: '/figma/fill-6df25cd971d272b0.png',
    price: 92_000_000,
    colors: ['#a4b7c8', '#ff8800'],
  },
  {
    id: 'samsung-a05s-4',
    title: SAMSUNG_TITLE,
    image: '/figma/fill-a3b65327303691bb.png',
    price: 87_000_000,
    oldPrice: 92_000_000,
    discount: 30,
    colors: ['#ef233c', '#5d5dff'],
  },
  {
    id: 'samsung-a05s-5',
    title: SAMSUNG_TITLE,
    image: '/figma/fill-bcf7fdbe4840c6f2.png',
    price: 91_000_000,
    colors: ['#ff8800', '#5d5dff', '#ebc8cb'],
  },
]
