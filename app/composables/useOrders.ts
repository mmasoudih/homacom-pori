import type { Order, OrderItem, OrderPaymentStatus, OrderStatus, OrderTransaction } from '~/data/orders'
import { toPersianDigits } from '~/utils/format'
import { resolveMediaUrl } from '~/utils/media'

interface ApiOrderItem {
  id: number
  product_id?: number | null
  product_slug?: string | null
  title: string
  image?: string | null
  img?: string | null
  color?: { title?: string | null, code?: string | null } | string | null
  warranty?: { title?: string | null } | string | null
  quantity: number
  price: number | string
}

interface ApiAddress {
  name?: string | null
  full_name?: string | null
  nickname?: string | null
  mobile?: string | null
  phone?: string | null
  tel?: string | null
  address?: string | null
  full_address?: string | null
  plaque?: string | null
  floor?: string | null
  unit?: string | null
  state?: { name?: string | null } | null
  city?: { name?: string | null } | null
}

type ApiReceiver = ApiAddress

interface ApiShipping {
  method?: string | null
  title?: string | null
  name?: string | null
  carrier?: string | null
  cost?: number | string | null
  price?: number | string | null
  discount?: number | string | null
  delivery_date?: string | null
}

interface ApiPayment {
  total?: number | string | null
  total_amount?: number | string | null
  paid?: number | string | null
  paid_amount?: number | string | null
  percent?: number | string | null
}

interface ApiOrderTransaction {
  id?: number | null
  status?: string | null
  bank?: string | null
  bank_name?: string | null
  gateway?: string | null
  tracking_code?: string | null
  reference_id?: string | null
  transaction_id?: string | null
  amount?: number | string | null
  price?: number | string | null
  method?: string | null
  payment_method?: string | null
  datetime?: string | null
  created_at?: string | null
}

/** Full `UserOrderResponse` (see the 2026-10-25 backend changes). */
interface ApiOrder {
  id: number
  invoice?: string | number | null
  code?: string | number | null
  user_id?: number | null
  total_amount?: number | string | null
  payable_amount?: number | string | null
  status: string
  type: string
  created_at?: string | null
  delivery_date?: string | null
  delivery_code?: string | null
  postal_tracking?: string | null
  tracking_code?: string | null
  items?: ApiOrderItem[]
  receiver?: ApiReceiver | null
  receiver_name?: string | null
  receiver_mobile?: string | null
  receiver_phone?: string | null
  receiver_address?: string | null
  /** Full address block or the flat string; both serializations are seen. */
  address?: ApiAddress | string | null
  user_address?: ApiAddress | null
  shipping?: ApiShipping | null
  shipping_method?: string | null
  shipping_cost?: number | string | null
  shipping_discount?: number | string | null
  payment?: ApiPayment | null
  paid_amount?: number | string | null
  transactions?: ApiOrderTransaction[]
  /** Invoice payment state (`waiting_payment` | `slice_payment` | `done`). */
  payment_status?: string | null
  /** Always `manual` after a gateway settlement — display `gate` instead. */
  payment_method?: string | null
  /** Gateway that actually handled the payment (`mellat`, `saman`, …). */
  gate?: string | null
  payable_price?: number | string | null
  paid_price?: number | string | null
  shipping_title?: string | null
  invoice_date?: string | null
}

const FALLBACK_IMAGE = '/figma/fill-e393cbb3afd42faa.png'

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function titleOf(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object')
    return text((value as { title?: string | null }).title)
  return ''
}

function mapStatus(status: string): OrderStatus {
  if (status === 'waiting_payment' || status === 'pending') return 'awaiting_payment'
  if (status.startsWith('cancel_') || status === 'returned') return 'cancelled'
  if (status === 'delivery' || status === 'delivered') return 'delivered'
  return 'processing'
}

/** Invoice payment state (`payment_status`); `null` when the API omits it. */
function mapPaymentStatus(value: unknown): OrderPaymentStatus | undefined {
  return value === 'waiting_payment' || value === 'slice_payment' || value === 'done'
    ? value
    : undefined
}

function formatDate(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(date)
}

function mapItem(item: ApiOrderItem, apiBase: string): OrderItem {
  const color = item.color

  return {
    id: String(item.id),
    title: item.title,
    image: resolveMediaUrl(item.image ?? item.img, apiBase) || FALLBACK_IMAGE,
    color: titleOf(color),
    colorHex: color && typeof color === 'object' ? color.code ?? '#d4d4d8' : '#d4d4d8',
    warranty: titleOf(item.warranty),
    productCode: item.product_slug || (item.product_id ? String(item.product_id) : ''),
    quantity: num(item.quantity),
    price: num(item.price),
  }
}

function mapTransactions(transactions: ApiOrderTransaction[] | undefined): OrderTransaction[] {
  return (transactions ?? []).map((transaction, index) => ({
    id: String(transaction.id ?? index + 1),
    status: transaction.status === 'failed' ? 'failed' : 'success',
    bank: text(transaction.bank ?? transaction.bank_name ?? transaction.gateway),
    trackingCode: text(
      transaction.tracking_code ?? transaction.reference_id ?? transaction.transaction_id,
    ),
    amount: num(transaction.amount ?? transaction.price),
    method: text(transaction.method ?? transaction.payment_method) || undefined,
    datetime: transaction.created_at
      ? formatDate(transaction.created_at)
      : text(transaction.datetime) || undefined,
  }))
}

function joinAddress(block: ApiAddress | null | undefined, fallback: string): string {
  if (!block) return fallback

  const parts = [
    block.state?.name,
    block.city?.name,
    block.address ?? block.full_address,
    block.plaque ? `پلاک ${block.plaque}` : null,
    block.floor ? `طبقه ${block.floor}` : null,
    block.unit ? `واحد ${block.unit}` : null,
  ]

  return parts.filter((part): part is string => !!part).join('، ') || fallback
}

function mapOrder(order: ApiOrder, apiBase: string): Order {
  const status = mapStatus(order.status)
  const amount = num(order.total_amount ?? order.payable_amount)
  const receiver = order.receiver
  const addressBlock = order.user_address
    ?? (order.address && typeof order.address === 'object' ? order.address : null)
  const addressText = typeof order.address === 'string' ? order.address : ''
  const shipping = order.shipping
  const payment = order.payment
  const paid = num(
    payment?.paid ?? payment?.paid_amount ?? order.paid_amount,
  )

  let paymentInfo: Order['payment']
  if (payment || status === 'awaiting_payment') {
    const total = num(payment?.total ?? payment?.total_amount) || amount
    paymentInfo = {
      total,
      paid,
      percent: payment?.percent != null
        ? num(payment.percent)
        : total > 0
          ? Math.round((paid / total) * 100)
          : 0,
    }
  }

  return {
    id: String(order.id),
    code: String(order.invoice ?? order.code ?? order.id),
    status,
    amount,
    date: formatDate(order.created_at),
    deliveredAt: formatDate(order.delivery_date),
    paymentStatus: mapPaymentStatus(order.payment_status),
    gate: text(order.gate) || undefined,
    paymentMethod: text(order.payment_method) || undefined,
    payablePrice: num(order.payable_price) || amount,
    paidPrice: num(order.paid_price ?? order.paid_amount ?? paid),
    items: (order.items ?? []).map(item => mapItem(item, apiBase)),
    transactions: mapTransactions(order.transactions),
    receiver: {
      name: text(
        receiver?.name
        ?? receiver?.full_name
        ?? receiver?.nickname
        ?? addressBlock?.nickname
        ?? order.receiver_name,
      ),
      phone: text(
        receiver?.mobile
        ?? receiver?.phone
        ?? addressBlock?.mobile
        ?? addressBlock?.phone
        ?? order.receiver_mobile
        ?? order.receiver_phone,
      ),
      address: joinAddress(
        addressBlock ?? receiver,
        text(order.receiver_address ?? addressText),
      ),
    },
    shipping: {
      method: text(
        shipping?.method
        ?? shipping?.title
        ?? shipping?.name
        ?? shipping?.carrier
        ?? order.shipping_title
        ?? order.shipping_method,
      ),
      discount: num(shipping?.discount ?? order.shipping_discount),
      cost: num(shipping?.cost ?? shipping?.price ?? order.shipping_cost),
      deliveryDate: formatDate(order.delivery_date ?? shipping?.delivery_date),
    },
    payment: paymentInfo,
    deliveryCode: text(order.delivery_code) || undefined,
    postalTracking: text(order.postal_tracking ?? order.tracking_code) || undefined,
  }
}

/** `GET /shop/order` filters (2026-10-29 contract). */
export type OrderType = 'sales' | 'refer' | 'purchase'

export interface OrdersQuery {
  /** Order status filter ('all' or omitting it disables the filter). */
  status?: string
  /** `type=all` is not a valid value — omit the key for every type. */
  type?: OrderType
  /** Invoice payment state — the "paid / unpaid / instalment" axis. */
  paymentStatus?: OrderPaymentStatus | 'all'
  /** 1-based page. */
  page?: number
  /** 1…100 (the backend rejects anything outside that range). */
  perPage?: number
  /**
   * Keep requesting pages until one returns fewer rows than `per_page`
   * (the endpoint has no `meta`/`links`, so this is the only end signal).
   * Defaults to `true` for the dashboard list, which paginates client-side.
   */
  allPages?: boolean
}

/** Hard stop for the page loop (10 × 100 rows). */
const MAX_PAGES = 10

const ORDER_STATUSES = new Set([
  'all',
  'completing',
  'waiting',
  'waiting_payment',
  'paid',
  'cancel_customer',
  'cancel_store',
  'cancel_operator',
  'processing',
  'preparing',
  'stock',
  'packaging',
  'ready_for_send',
  'send_to_center',
  'sending',
  'delivery',
  'returned',
  'refer_request',
  'refer_accept',
  'refer_reject',
  'refer_done',
])

/**
 * Orders list for the dashboard.
 *
 * Filters follow the 2026-10-29 contract: `status`, `type`, `payment_status`,
 * `per_page` (1…100) and `page`. The endpoint is always newest-first and has no
 * pagination metadata, so the list is assembled by requesting pages until one
 * comes back short. Every value is validated client-side first, because the
 * backend answers a bad filter with a 422 instead of ignoring it.
 */
export function useOrders() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')
  const orders = ref<Order[]>([])
  const pending = ref(false)
  const loaded = ref(false)

  async function load(query: OrdersQuery = {}) {
    const perPage = Math.min(100, Math.max(1, Math.trunc(query.perPage ?? 100)))
    const startPage = Math.max(1, Math.trunc(query.page ?? 1))
    const allPages = query.allPages ?? true

    const params: Record<string, string | number> = {
      per_page: perPage,
      page: startPage,
    }
    if (query.status && query.status !== 'all' && ORDER_STATUSES.has(query.status))
      params.status = query.status
    if (query.type) params.type = query.type
    if (query.paymentStatus && query.paymentStatus !== 'all')
      params.payment_status = query.paymentStatus

    pending.value = true
    try {
      const rows: ApiOrder[] = []
      let page = startPage
      let fetched = 0

      while (true) {
        const res = await api.get<ApiOrder[]>('/shop/order', {
          query: { ...params, page },
        })
        const chunk = res.data ?? []
        rows.push(...chunk)
        fetched += 1

        // Short page (or an empty array) means this was the last one.
        if (!allPages || chunk.length < perPage || fetched >= MAX_PAGES) break
        page += 1
      }

      orders.value = rows.map(order => mapOrder(order, apiBase))
      loaded.value = true
    }
    finally {
      pending.value = false
    }
  }

  return { orders, pending, loaded, load }
}

/** One order by its invoice/id — the full `UserOrderResponse`, no mock fallback. */
export function useOrderDetail(invoice: Ref<string>) {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { data, pending, error, refresh } = useAsyncData<Order | undefined>(
    () => `shop-order-${invoice.value}`,
    async () => {
      try {
        const res = await api.get<ApiOrder>(`/shop/order/${encodeURIComponent(invoice.value)}`)
        return res.data ? mapOrder(res.data, apiBase) : undefined
      }
      catch {
        return undefined
      }
    },
    {
      watch: [invoice],
      default: () => undefined,
    },
  )

  const notFound = computed(() => !pending.value && !data.value)
  return { order: data, pending, error, refresh, notFound }
}

/** `send_to_center`-style API labels → Persian, for debug/detail badges. */
export function orderStatusLabel(status: string): string {
  return toPersianDigits(status)
}
