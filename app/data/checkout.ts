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
}

export interface ShippingMethod {
  id: string
  name: string
  price: number
  /** Small provider mark rendered next to the name. */
  provider: string
}

export interface DeliveryDay {
  id: string
  weekday: string
  day: string
  month: string
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
  { id: 'tipax', name: 'تیپاکس', price: 300_000, provider: 'تیپاکس' },
  { id: 'pishtaz-bike', name: 'پیک موتوری', price: 200_000, provider: 'پیشتاز' },
  { id: 'bike', name: 'پیک موتوری', price: 150_000, provider: 'پیک' },
]

export const deliveryTimeSlots = ['۱۸ الی ۱۶', '۱۴ الی ۱۲', '۱۰ الی ۰۸'] as const

/**
 * The next five delivery days in the Persian calendar (same shape as the
 * frame's date chips: weekday / day / month).
 */
export function getDeliveryDays(count = 5, from = new Date()): DeliveryDay[] {
  const weekday = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' })
  const day = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' })
  const month = new Intl.DateTimeFormat('fa-IR', { month: 'long' })

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from)
    date.setDate(from.getDate() + index + 1)
    return {
      id: date.toISOString().slice(0, 10),
      weekday: weekday.format(date),
      day: day.format(date),
      month: month.format(date),
    }
  })
}

export const paymentGateways: PaymentGateway[] = [
  { id: 'sepah', title: 'سپ', subtitle: 'درگاه بانک سپه', logo: '/icons/cart/gw-sepah.svg' },
  { id: 'mellat', title: 'تاپ', subtitle: 'درگاه بانک ملت', logo: '/icons/cart/gw-mellat.svg' },
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
