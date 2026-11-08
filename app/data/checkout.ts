// ---------------------------------------------------------------------------
// Checkout — data model + mock content
// (Figma: desktop «checkout» 26708 / 25074 (step 1) and 26867 · 27704 · 27053 ·
//  27258 (step 2); mobile 88967 / 89045 (+ sheets 89130 · 89292) and 94745 ·
//  94933 · 95187 · 88227 · 95847)
// ---------------------------------------------------------------------------

export interface CheckoutAddress {
  id: string
  /** Short label shown first, e.g. «مازندران، آمل». */
  city: string
  address: string
  postalCode: string
  recipient: string
  phone: string
  isDefault?: boolean
  /** Raw parts carried by the map wizard so the address can be POSTed. */
  province?: string
  cityName?: string
  street?: string
  plaque?: string
  unit?: string
  lat?: number
  lng?: number
}

export type ShippingMethodType = 'postal' | 'present' | 'delivery' | 'in-person'

export interface ShippingMethod {
  /** Backend `shop_shipping.id` (kept as a string for the UI). */
  id: string
  name: string
  price: number
  /** Small provider mark rendered next to the name. */
  provider: string
  /** Backend `type`; a `delivery` method also needs a delivery period. */
  type?: ShippingMethodType
  /** Absolute logo URL, or a local fallback icon. */
  logo?: string
  description?: string
  /** Free above this cart subtotal (`up_to_free`; 0/undefined = never free). */
  freeAbove?: number
}

export interface DeliveryDay {
  id: string
  weekday: string
  day: string
  month: string
  /** English weekday (`Saturday`…) used to match `GET /public/delivery-periods`. */
  weekdayEn: string
}

/** A 30-minute delivery slot from `GET /api/shop/public/delivery-periods`. */
export interface DeliveryPeriod {
  id: string
  /** English weekday name, or `''` for the designed fallback slots. */
  day: string
  /** `HH:MM` (already stripped of the API's seconds). */
  start: string
  end: string
}

export interface PaymentGateway {
  id: string
  /** Short bank name shown first (e.g. «سپ»). */
  title: string
  subtitle: string
  logo: string
}

export interface InstallmentProvider {
  id: string
  name: string
  badge: 'اعتباری' | 'اقساطی'
  monthly: string
  terms: string
  logo: string
}

export interface CreditProvider {
  id: string
  name: string
  /** e.g. «کیف پول بالون» */
  label: string
  /** Wallet balance shown under the name, in Tomans (Figma 2984). */
  balance: number
}

/** Mock signed-in user (used when the order is delivered to «خودم»). */
export const checkoutCurrentUser = {
  name: 'سارا محمدی',
  phone: '۰۹۱۲ ۱۲۳ ۴۵۶۷',
}

export const checkoutAddresses: CheckoutAddress[] = [
  {
    id: 'addr-amol',
    city: 'مازندران، آمل',
    address: 'مازندران، آمل، خیابان امام رضا',
    postalCode: '2130426786',
    recipient: 'سارا محمدی',
    phone: '۰۹۱۲ ۱۲۳ ۴۵۶۷',
    isDefault: true,
  },
  {
    id: 'addr-tehran',
    city: 'تهران، ونک',
    address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، کوچه یاس، پلاک ۲۴، واحد ۵',
    postalCode: '1968734112',
    recipient: 'سارا محمدی',
    phone: '۰۹۳۹ ۳۲۰ ۶۰۶۶',
  },
]

export const shippingMethods: ShippingMethod[] = [
  { id: 'tipax', name: 'تیپاکس', price: 300_000, provider: 'تیپاکس', type: 'postal', logo: '/icons/cart/ship-tipax.svg' },
  { id: 'pishtaz-bike', name: 'پیک موتوری', price: 200_000, provider: 'پیشتاز', type: 'delivery', logo: '/icons/cart/ship-pishtaz.svg' },
  { id: 'bike', name: 'پیک موتوری', price: 150_000, provider: 'پیک', type: 'delivery', logo: '/icons/cart/ship-bike.svg' },
]

/**
 * Designed fallback slots, used only when the public delivery-period endpoint
 * returns nothing. An empty `day` matches every weekday.
 */
export const fallbackDeliveryPeriods: DeliveryPeriod[] = [
  { id: 'slot-18-16', day: '', start: '16:00', end: '18:00' },
  { id: 'slot-12-14', day: '', start: '12:00', end: '14:00' },
  { id: 'slot-08-10', day: '', start: '08:00', end: '10:00' },
]

/** English weekday names, indexed like `Date.getDay()` (0 = Sunday). */
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

/** `yyyy-mm-dd` in the browser's local calendar (the API's date format). */
function localDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * The next delivery dates that actually have a slot.
 *
 * `GET /public/delivery-periods` only knows weekdays, so the chips are the next
 * real dates whose weekday is offered. When `periods` carries no weekday
 * (designed fallback) every upcoming day is offered.
 */
export function getDeliveryDays(
  periods: DeliveryPeriod[] = [],
  count = 7,
  from = new Date(),
): DeliveryDay[] {
  const weekday = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' })
  const day = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' })
  const month = new Intl.DateTimeFormat('fa-IR', { month: 'long' })

  const offered = new Set(periods.map(period => period.day).filter(Boolean))
  const everyDay = offered.size === 0
  const days: DeliveryDay[] = []

  for (let offset = 1; offset <= (everyDay ? count : 21) && days.length < count; offset += 1) {
    const date = new Date(from)
    date.setDate(from.getDate() + offset)
    const weekdayEn = WEEKDAYS_EN[date.getDay()] ?? ''

    if (!everyDay && !offered.has(weekdayEn)) continue

    days.push({
      // Local calendar date — `toISOString()` would shift a day in Tehran
      // before 03:30 and send the wrong `receive_date` to the backend.
      id: localDateKey(date),
      weekday: weekday.format(date),
      day: day.format(date),
      month: month.format(date),
      weekdayEn,
    })
  }

  return days
}

export const paymentGateways: PaymentGateway[] = [
  { id: 'sepah', title: 'سپ', subtitle: 'درگاه بانک سپه', logo: '/icons/cart/gw-sepah.svg' },
  { id: 'mellat', title: 'تاپ', subtitle: 'درگاه بانک ملت', logo: '/icons/cart/gw-mellat.svg' },
  { id: 'tara', title: 'تارا', subtitle: 'درگاه پرداخت تارا', logo: '' },
]

/** Installment services shown when «پرداخت اقساطی» is selected (Figma 27704). */
export const installmentProviders: InstallmentProvider[] = [
  {
    id: 'technopy',
    name: 'تکنوپی',
    badge: 'اعتباری',
    monthly: '۲,۰۰۰,۰۰۰ تومان ماهیانه',
    terms: '۴ قسطه بدون کارمزد',
    logo: '/icons/cart/inst-technopy.svg',
  },
  {
    id: 'tapp',
    name: 'تاپ',
    badge: 'اقساطی',
    monthly: '۲,۰۰۰,۰۰۰ تومان ماهیانه',
    terms: '۴ قسطه بدون کارمزد',
    logo: '/icons/cart/inst-snappay.svg',
  },
  {
    id: 'lendo',
    name: 'لندو',
    badge: 'اقساطی',
    monthly: '۲,۰۰۰,۰۰۰ تومان ماهیانه',
    terms: '۴ قسطه بدون کارمزد',
    logo: '/icons/cart/inst-lendo.svg',
  },
  {
    id: 'digipay',
    name: 'دیجی‌پی',
    badge: 'اقساطی',
    monthly: '۲,۰۰۰,۰۰۰ تومان ماهیانه',
    terms: '۴ قسطه بدون کارمزد',
    logo: '/icons/cart/inst-digipay.svg',
  },
  {
    id: 'azki',
    name: 'آزکی',
    badge: 'اقساطی',
    monthly: '',
    terms: 'خرید اعتباری و پرداخت اقساطی',
    logo: '',
  },
]

export const creditProviders: CreditProvider[] = [
  {
    id: 'balon',
    name: 'بالون',
    label: 'کیف پول بالون',
    balance: 100_500_000,
  },
  {
    id: 'ewano',
    name: 'اِوانو',
    label: 'کیف پول اِوانو',
    balance: 0,
  },
]

/** Mock wallet balance shown in the payment methods (Figma 8,500,000). */
export const walletBalance = 8_500_000

/** Per-transaction cap for online payments (Figma note: ۳۹۵ میلیون). */
export const onlineTransactionLimit = 395_000_000

export const discountCodePlaceholder = 'کد تخفیف را وارد کنید'

// ---------------------------------------------------------------------------
// Payment result (Figma: desktop 27440 «checkout-seccussfull» /
// 27473 «checkout-un seccussfull»; mobile 95779 / 95812)
// ---------------------------------------------------------------------------

export interface CheckoutResult {
  /** e.g. «AXM-24578». */
  orderNumber: string
  /** e.g. «۱۴۰۴/۱۱/۱۳ - ۲۰:۴۵». */
  paidAt: string
  /** e.g. «۱۲۵۸۴۷۴۰۲». */
  trackingNumber: string
  amount: number
}

/** Shown when a result page is opened directly, so it still matches the design. */
export const fallbackCheckoutResult: CheckoutResult = {
  orderNumber: 'AXM-24578',
  paidAt: '۱۴۰۴/۱۱/۱۳ - ۲۰:۴۵',
  trackingNumber: '۱۲۵۸۴۷۴۰۲',
  amount: 8_500_000,
}
