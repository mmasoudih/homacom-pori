import { dashboardUser } from './dashboard'

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type OrderStatus =
  | 'awaiting_payment'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'

export type ReturnStatus = 'review' | 'approved' | 'rejected' | 'completed'
export type ReturnItemStatus = 'review' | 'approved' | 'rejected'

export type StatusTone = 'amber' | 'sky' | 'emerald' | 'red'

export type StatusIcon = 'hourglass' | 'wallet' | 'truck' | 'check' | 'x'

export interface StatusMeta {
  label: string
  tone: StatusTone
  icon: StatusIcon
  /** Progress fill (0-100) for the status bar. */
  progress: number
  /** Terminal states don't render a progress bar. */
  hideProgress: boolean
}

export interface OrderItem {
  id: string
  title: string
  image: string
  color: string
  colorHex: string
  warranty: string
  productCode: string
  quantity: number
  price: number
  rating?: 'angry' | 'sad' | 'neutral' | 'happy' | 'love'
  commented?: boolean
}

export interface OrderTransaction {
  id: string
  status: 'success' | 'failed'
  bank: string
  trackingCode: string
  amount: number
  /** Mobile transaction row: payment method label. */
  method?: string
  /** Mobile transaction row: date + time label. */
  datetime?: string
}

export interface Order {
  id: string
  code: string
  status: OrderStatus
  /** Amount shown on the list card + detail "مبلغ سفارش". */
  amount: number
  date: string
  deliveredAt: string
  items: OrderItem[]
  transactions: OrderTransaction[]
  receiver: { name: string; phone: string; address: string }
  shipping: {
    method: string
    discount: number
    cost: number
    deliveryDate: string
  }
  /** Awaiting-payment ring data. */
  payment?: { total: number; paid: number; percent: number }
  /** Shipping-only tracking data. */
  deliveryCode?: string
  postalTracking?: string
}

export interface ReturnItem {
  id: string
  title: string
  image: string
  color: string
  colorHex: string
  warranty: string
  quantity: number
  amount: number
  status: ReturnItemStatus
  reason: string
}

export interface ReturnRequest {
  id: string
  orderCode: string
  trackingCode: string
  status: ReturnStatus
  date: string
  amount: number
  items: ReturnItem[]
  postalCode: string
}

export interface PaymentMethod {
  id: 'internet' | 'wallet' | 'installment'
  title: string
  description?: string
  icon: 'card' | 'wallet' | 'coins'
  disabled?: boolean
  note?: string
}

export interface CreditWallet {
  id: string
  name: string
  balance: number
}

/* ------------------------------------------------------------------ *
 * Status metadata
 * ------------------------------------------------------------------ */

export const orderStatusMeta: Record<OrderStatus, StatusMeta> = {
  awaiting_payment: { label: 'در انتظار پرداخت', tone: 'amber', icon: 'wallet', progress: 15, hideProgress: false },
  processing: { label: 'در حال بررسی سفارش', tone: 'amber', icon: 'hourglass', progress: 20, hideProgress: false },
  shipping: { label: 'در حال ارسال', tone: 'sky', icon: 'truck', progress: 55, hideProgress: false },
  delivered: { label: 'تحویل داده شده', tone: 'emerald', icon: 'check', progress: 100, hideProgress: true },
  cancelled: { label: 'لغو شده', tone: 'red', icon: 'x', progress: 100, hideProgress: true },
}

export const returnStatusMeta: Record<ReturnStatus, StatusMeta> = {
  review: { label: 'در حال بررسی درخواست مرجوعی', tone: 'amber', icon: 'hourglass', progress: 20, hideProgress: false },
  approved: { label: 'موافقت با مرجوعی', tone: 'sky', icon: 'check', progress: 60, hideProgress: false },
  rejected: { label: 'با درخواست مرجوعی موافقت نشد', tone: 'red', icon: 'x', progress: 100, hideProgress: true },
  completed: { label: 'مرجوعی با موفقیت انجام شد', tone: 'emerald', icon: 'check', progress: 100, hideProgress: false },
}

export const returnItemStatusMeta: Record<ReturnItemStatus, { label: string; tone: StatusTone; icon: StatusIcon }> = {
  review: { label: 'در حال بررسی درخواست مرجوعی', tone: 'amber', icon: 'hourglass' },
  approved: { label: 'با درخواست مرجوعی این کالا موافقت شد', tone: 'emerald', icon: 'check' },
  rejected: { label: 'با درخواست مرجوعی این کالا موافقت نشد', tone: 'red', icon: 'x' },
}

/* ------------------------------------------------------------------ *
 * Tabs
 * ------------------------------------------------------------------ */

export interface OrderTab {
  key: 'all' | 'current' | 'delivered' | 'cancelled' | 'returned'
  label: string
  count: number
  /** Mobile-only count (screenshots show a different number than desktop). */
  mobileCount?: number
}

export const orderTabs: OrderTab[] = [
  { key: 'all', label: 'همه', count: 116, mobileCount: 116 },
  { key: 'current', label: 'جاری', count: 4, mobileCount: 4 },
  { key: 'delivered', label: 'تحویل داده شده', count: 90, mobileCount: 90 },
  { key: 'cancelled', label: 'لغو شده', count: 2, mobileCount: 20 },
  { key: 'returned', label: 'مرجوع شده', count: 2, mobileCount: 20 },
]

/* ------------------------------------------------------------------ *
 * Product helpers
 * ------------------------------------------------------------------ */

const IPHONE_TITLE =
  'گوشی موبایل اپل مدل iPhone 17 CH دو سیم کارت ظرفیت 256 گیگابایت و رم 8 گیگابایت - ریجستر شده و اکتیو'

const IMG = {
  headset: '/figma/fill-bcf7fdbe4840c6f2.png',
  phone: '/figma/fill-e393cbb3afd42faa.png',
  laptop: '/figma/fill-f9dec0064052dff9.png',
}

function baseItem(id: string, image: string): OrderItem {
  return {
    id,
    title: IPHONE_TITLE,
    image,
    color: 'آبی',
    colorHex: '#5d5dff',
    warranty: 'گارانتی ۱۸ ماهه مهرسرستان',
    productCode: '۲۷۳۰',
    quantity: 1,
    price: 89_000_000,
  }
}

const REASON_MISMATCH = 'مغایرت با اطلاعات درج شده در سایت با کالای انتخابی من'

/* ------------------------------------------------------------------ *
 * Demo orders — one per status
 * ------------------------------------------------------------------ */

const sharedTransactions: OrderTransaction[] = [
  { id: 'txn-1', status: 'success', bank: 'بانک ملت - ۱۰۸۲/۰۸/۱۴', trackingCode: '125847369', amount: 1_700_000, method: 'اقساطی - اسنپیاد', datetime: '۱۴۰۳/۰۸/۱۵ - ۱۳:۳۵' },
  { id: 'txn-2', status: 'failed', bank: 'بانک ملت - ۱۰۸۲/۰۸/۱۴', trackingCode: '125847369', amount: 1_700_000, method: 'اقساطی - اسنپیاد', datetime: '۱۴۰۳/۰۸/۱۵ - ۱۳:۳۵' },
  { id: 'txn-3', status: 'success', bank: 'بانک ملت - ۱۰۸۲/۰۸/۱۴', trackingCode: '125847369', amount: 800_000, method: 'اقساطی - اسنپیاد', datetime: '۱۴۰۳/۰۸/۱۵ - ۱۳:۳۵' },
]

const sharedReceiver = {
  name: dashboardUser.name,
  phone: '09333935256',
  address: 'بلوار آزادی، ایستگاه ۵، ارشاد، ما انتهای کوچه واحد ۱۲',
}

function makeOrder(
  id: string,
  status: OrderStatus,
  code: string,
  extra: Partial<Order> = {},
): Order {
  return {
    id,
    code,
    status,
    amount: 7_500_000,
    date: '۱۴۰۵/۰۵/۰۶',
    deliveredAt: 'چهارشنبه ۲۹ مرداد',
    items: [
      { ...baseItem(`${id}-1`, IMG.headset), rating: 'happy' },
      { ...baseItem(`${id}-2`, IMG.phone), commented: true },
      { ...baseItem(`${id}-3`, IMG.laptop), rating: 'sad' },
    ],
    transactions: sharedTransactions,
    receiver: sharedReceiver,
    shipping: { method: 'تیپاکس', discount: 950_000, cost: 950_000, deliveryDate: '۱۴۰۵/۰۵/۰۶' },
    ...extra,
  }
}

export const orders: Order[] = [
  makeOrder('ord-processing', 'processing', '9240052789'),
  makeOrder('ord-awaiting', 'awaiting_payment', '9630062789', {
    payment: { total: 350_000_000, paid: 100_000_000, percent: 35 },
  }),
  makeOrder('ord-shipping', 'shipping', '9240052789', {
    deliveryCode: '52462',
    postalTracking: '98273578956',
  }),
  makeOrder('ord-delivered', 'delivered', '9240052789'),
  makeOrder('ord-cancelled', 'cancelled', '9630062789'),
]

export function findOrder(id: string): Order | undefined {
  return orders.find(o => o.id === id)
}

/* ------------------------------------------------------------------ *
 * Demo returns — one per status
 * ------------------------------------------------------------------ */

function makeReturnItem(id: string, image: string, status: ReturnItemStatus): ReturnItem {
  return {
    id,
    title: 'لپ تاپ 15.6 اینچی لنوو مدل N4500 8GB 256GB',
    image,
    color: 'آبی',
    colorHex: '#5d5dff',
    warranty: 'گارانتی ۱۸ ماهه مهرسرستان',
    quantity: 1,
    amount: 89_000_000,
    status,
    reason: REASON_MISMATCH,
  }
}

function makeReturn(
  id: string,
  status: ReturnStatus,
  itemStatuses: ReturnItemStatus[],
  code: string,
  extra: Partial<ReturnRequest> = {},
): ReturnRequest {
  const images = [IMG.headset, IMG.phone, IMG.headset]
  return {
    id,
    orderCode: code,
    trackingCode: code,
    status,
    date: '۱۴۰۵/۰۵/۰۶',
    amount: 7_500_000,
    postalCode: '1874553322',
    items: itemStatuses.map((s, i) => makeReturnItem(`${id}-${i}`, images[i]!, s)),
    ...extra,
  }
}

export const returns: ReturnRequest[] = [
  makeReturn('ret-review', 'review', ['review', 'review', 'review'], '9240052789'),
  makeReturn('ret-approved', 'approved', ['approved', 'approved', 'rejected'], '9240052789'),
  makeReturn('ret-rejected', 'rejected', ['rejected', 'rejected', 'rejected'], '4835002789'),
  makeReturn('ret-completed', 'completed', ['approved', 'approved', 'rejected'], '9240052789'),
]

/** Returns shown in the "مرجوع شده" tab (completed requests are historical). */
export const returnRequests = returns.filter(r => r.status !== 'completed')

export function findReturn(id: string): ReturnRequest | undefined {
  return returns.find(r => r.id === id)
}

/* ------------------------------------------------------------------ *
 * Payment
 * ------------------------------------------------------------------ */

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'internet',
    title: 'پرداخت اینترنتی',
    description: 'پرداخت آنلاین از طریق درگاه‌های بانکی',
    icon: 'card',
    note: 'به دلیل سقف ۳۵ میلیون تومانی هر تراکنش اینترنتی، مابقی مبلغ سفارش را می‌توانید از «جزئیات سفارش» در داشبورد پرداخت کنید؛ سفارش با تکمیل پرداخت نهایی می‌شود.',
  },
  {
    id: 'wallet',
    title: 'کیف پول',
    description: 'موجودی: ۸,۵۰۰,۰۰۰ تومان',
    icon: 'wallet',
    note: 'اعتبار شما کافی نیست. برای ادامه، می‌توانید موجودی کیف‌پول را شارژ کنید یا روش پرداخت اینترنتی را انتخاب کنید.',
  },
  {
    id: 'installment',
    title: 'پرداخت اقساطی',
    description: 'پرداخت از طریق سرویس‌های مختلف',
    icon: 'coins',
  },
]

export const creditWallets: CreditWallet[] = [
  { id: 'baloon', name: 'کیف پول بالون', balance: 10_500_000 },
  { id: 'avazo', name: 'کیف پول آواژو', balance: 0 },
]

export interface InvoiceLine {
  label: string
  value: number
  icon: 'bag' | 'tag' | 'shield' | 'tools' | 'truck' | 'wallet'
}

/** Mobile checkout "صورت‌حساب" breakdown. */
export const checkoutInvoice: InvoiceLine[] = [
  { label: 'مجموع قیمت کالاها', value: 87_000_000, icon: 'bag' },
  { label: 'تخفیف', value: 3_000_000, icon: 'tag' },
  { label: 'مبلغ بیمه‌ها', value: 5_000_000, icon: 'shield' },
  { label: 'خدمات', value: 3_000_000, icon: 'tools' },
  { label: 'هزینه ارسال', value: 400_000, icon: 'truck' },
  { label: 'تخفیف', value: 3_000_000, icon: 'tag' },
  { label: 'مبلغ قابل پرداخت', value: 87_000_000, icon: 'wallet' },
]

export const returnReasons = [
  'آسیب دیده / معیوب',
  'مغایرت با اطلاعات درج شده در سایت',
  'سایز یا رنگ متفاوت',
  'کالای اشتباه ارسال شده',
  'انصراف از خرید',
]
