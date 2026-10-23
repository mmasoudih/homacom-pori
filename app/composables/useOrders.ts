import type { Order, OrderItem, OrderStatus } from '~/data/orders'
import { findOrder } from '~/data/orders'
import { toPersianDigits } from '~/utils/format'

interface ApiOrderItem {
  id: number
  product_id?: number | null
  title: string
  quantity: number
  price: number
}

interface ApiOrder {
  id: number
  user_id?: number | null
  total_amount: number
  status: string
  type: string
  created_at?: string | null
  items?: ApiOrderItem[]
}

const ORDER_STATUSES = [
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
] as const

const FALLBACK_IMAGE = '/figma/fill-e393cbb3afd42faa.png'

function mapStatus(status: string): OrderStatus {
  if (status === 'waiting_payment') return 'awaiting_payment'
  if (status.startsWith('cancel_') || status === 'returned') return 'cancelled'
  if (status === 'delivery') return 'delivered'
  return 'processing'
}

function formatDate(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(date)
}

function mapItem(item: ApiOrderItem): OrderItem {
  return {
    id: String(item.id),
    title: item.title,
    image: FALLBACK_IMAGE,
    color: '',
    colorHex: '#d4d4d8',
    warranty: '',
    productCode: item.product_id ? String(item.product_id) : '',
    quantity: item.quantity,
    price: Number(item.price) || 0,
  }
}

function mapOrder(order: ApiOrder): Order {
  const status = mapStatus(order.status)
  const amount = Number(order.total_amount) || 0

  return {
    id: String(order.id),
    code: String(order.id),
    status,
    amount,
    date: formatDate(order.created_at),
    deliveredAt: '',
    items: (order.items ?? []).map(mapItem),
    transactions: [],
    receiver: { name: '', phone: '', address: '' },
    shipping: { method: '', discount: 0, cost: 0, deliveryDate: '' },
    payment: status === 'awaiting_payment'
      ? { total: amount, paid: 0, percent: 0 }
      : undefined,
  }
}

/**
 * Orders list for the dashboard.
 *
 * The API requires a single `status` per request, so the "all" view merges the
 * statuses that the design's tabs care about. This is documented as a backend
 * gap (a group/all filter or pagination-aware list would be cheaper).
 */
export function useOrders() {
  const api = useApi()
  const orders = ref<Order[]>([])
  const pending = ref(false)
  const loaded = ref(false)

  async function load() {
    pending.value = true
    try {
      const responses = await Promise.allSettled(
        ORDER_STATUSES.map(status =>
          api.get<ApiOrder[]>('/shop/order', { query: { status, type: 'sales' } }),
        ),
      )

      const merged = new Map<string, Order>()
      for (const response of responses) {
        if (response.status !== 'fulfilled') continue
        for (const order of response.value.data ?? [])
          merged.set(String(order.id), mapOrder(order))
      }

      orders.value = [...merged.values()].sort((a, b) => Number(b.id) - Number(a.id))
      loaded.value = true
    }
    finally {
      pending.value = false
    }
  }

  return { orders, pending, loaded, load }
}

/** One order by its invoice/id, with the designed mock order as fallback. */
export function useOrderDetail(invoice: Ref<string>) {
  const api = useApi()

  const { data, pending, error, refresh } = useAsyncData<Order | undefined>(
    () => `shop-order-${invoice.value}`,
    async () => {
      try {
        const res = await api.get<ApiOrder>(`/shop/order/${encodeURIComponent(invoice.value)}`)
        return res.data ? mapOrder(res.data) : findOrder(invoice.value)
      }
      catch {
        return findOrder(invoice.value)
      }
    },
    {
      watch: [invoice],
      default: () => findOrder(invoice.value),
    },
  )

  const notFound = computed(() => !pending.value && !data.value)
  return { order: data, pending, error, refresh, notFound }
}

/** `send_to_center`-style API labels → Persian, for debug/detail badges. */
export function orderStatusLabel(status: string): string {
  return toPersianDigits(status)
}
