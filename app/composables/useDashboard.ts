import type { Product } from '~/utils/product'
import { resolveMediaUrl } from '~/utils/media'

/** `CustomerDashboardResource` (2026-11-02). */
export interface DashboardAggregates {
  /** `cancel_customer` + `cancel_store` + `cancel_operator`. */
  cancelledInvoices: number
  /** Everything from `waiting` to `delivery`. */
  inProgressInvoices: number
  /** `returned` + every `refer_*` status. */
  otherInvoices: number
  /** Open tickets whose last message is from support. */
  ticketsAwaitingReply: number
}

/** One row of `data.last_visited_product` (2026-11-03). */
export interface RecentlyViewedProduct {
  product: Product
  /** Raw `last_visited_at` (`Y-m-d H:i:s`). */
  lastVisitedAt: string
}

interface ApiStockColor {
  id?: number
  title?: string | null
  code?: string | null
}

interface ApiStock {
  id?: number
  customer_price?: string | number | null
  discount?: string | number | null
  color?: ApiStockColor | null
}

interface ApiVisitedProduct {
  id: number
  slug?: string | null
  title: string
  title_en?: string | null
  img?: string | null
  cheapest_stock?: ApiStock | null
  stocks?: Array<{ color?: ApiStockColor | null }>
}

interface ApiVisited {
  product?: ApiVisitedProduct | null
  last_visited_at?: string | null
}

interface ApiDashboard {
  cancelled_invoices?: number | string | null
  in_progress_invoices?: number | string | null
  other_invoices?: number | string | null
  tickets_awaiting_reply?: number | string | null
  /**
   * Singular key, array value (≤3, newest first). `null` when the user has not
   * visited anything yet.
   */
  last_visited_product?: ApiVisited[] | null
}

interface DashboardData {
  aggregates: DashboardAggregates
  recentlyViewed: RecentlyViewedProduct[]
}

const EMPTY: DashboardAggregates = {
  cancelledInvoices: 0,
  inProgressInvoices: 0,
  otherInvoices: 0,
  ticketsAwaitingReply: 0,
}

const EMPTY_DATA: DashboardData = { aggregates: EMPTY, recentlyViewed: [] }

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * `last_visited_product[]` → the shared product card model.
 *
 * The row carries the full `ProductResource` plus a `cheapest_stock`; the
 * struck-through price is derived from the percentage discount, exactly like
 * the product list does. A product without a slug/stock is dropped rather than
 * rendering a dead card.
 */
function mapRecentlyViewed(row: ApiVisited, apiBase: string): RecentlyViewedProduct | null {
  const product = row.product
  if (!product?.slug) return null

  const price = num(product.cheapest_stock?.customer_price)
  const discount = num(product.cheapest_stock?.discount)
  const oldPrice = discount > 0 && discount < 100 && price > 0
    ? Math.round(price / (1 - discount / 100))
    : undefined

  const colors = [...new Set(
    (product.stocks ?? [])
      .map(stock => stock.color?.code)
      .filter((code): code is string => !!code),
  )].slice(0, 3)

  return {
    product: {
      id: product.slug,
      apiId: product.id,
      title: product.title,
      image: resolveMediaUrl(product.img, apiBase),
      price,
      oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
      discount: oldPrice && oldPrice > price ? discount : undefined,
      colors,
    },
    lastVisitedAt: row.last_visited_at ?? '',
  }
}

/**
 * Customer dashboard (`GET /shop/user/dashboard`).
 *
 * One shared, keyed request so the cards and the "recently viewed" row agree.
 * A failed request keeps the zeros/empty row instead of blocking the page.
 */
export function useDashboard() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { data, pending, refresh } = useAsyncData<DashboardData>(
    'user-dashboard',
    async () => {
      try {
        const res = await api.get<ApiDashboard>('/shop/user/dashboard')
        const row = res.data
        if (!row) return EMPTY_DATA

        return {
          aggregates: {
            cancelledInvoices: num(row.cancelled_invoices),
            inProgressInvoices: num(row.in_progress_invoices),
            otherInvoices: num(row.other_invoices),
            ticketsAwaitingReply: num(row.tickets_awaiting_reply),
          },
          recentlyViewed: (row.last_visited_product ?? [])
            .map(item => mapRecentlyViewed(item, apiBase))
            .filter((item): item is RecentlyViewedProduct => !!item)
            .slice(0, 3),
        }
      }
      catch {
        return EMPTY_DATA
      }
    },
    { default: () => EMPTY_DATA },
  )

  const aggregates = computed<DashboardAggregates>(() => data.value?.aggregates ?? EMPTY)
  const recentlyViewed = computed<RecentlyViewedProduct[]>(() => data.value?.recentlyViewed ?? [])
  const loaded = computed(() => !pending.value)

  return { aggregates, recentlyViewed, pending, loaded, refresh }
}
