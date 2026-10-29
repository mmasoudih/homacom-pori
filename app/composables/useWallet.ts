import type { WalletDirection, WalletTransaction } from '~/data/wallet'
import type { GatewayRedirect } from '~/utils/payment'
import { detectDevice } from '~/utils/payment'

/** `WalletTransactionResource` (2026-10-29). */
interface ApiWalletTransaction {
  id: number
  amount: number | string
  in_out?: string | null
  reason?: string | null
  reason_title?: string | null
  payment_method?: string | null
  tracking_number?: string | null
  description?: string | null
  relate_id?: string | number | null
  created_at?: string | null
}

export type WalletInOut = 'all' | WalletDirection
export type WalletPaymentMethod =
  | 'all'
  | 'online'
  | 'cash'
  | 'credit_to_income'
  | 'use_credit'
  | 'system'
  | 'manual'

export interface WalletFilters {
  /** Any reason code from the API, or `all`. */
  reason?: string
  inOut?: WalletInOut
  paymentMethod?: WalletPaymentMethod
}

export interface WalletChargeInput {
  amount: number
  paymentMethodId: string | number
  device?: 'web' | 'mobile' | 'desktop' | 'tablet' | 'pwa'
}

const IN_OUT_VALUES = new Set(['all', 'in', 'out', 'in_out'])
const PAYMENT_METHODS = new Set([
  'all',
  'online',
  'cash',
  'credit_to_income',
  'use_credit',
  'system',
  'manual',
])

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function mapDirection(value: unknown): WalletDirection {
  return value === 'out' || value === 'in_out' ? value : 'in'
}

function formatDateTime(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(date)
  const time = new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

  return `${time} - ${day}`
}

function mapTransaction(row: ApiWalletTransaction): WalletTransaction {
  const reason = text(row.reason)

  return {
    id: String(row.id),
    amount: Math.abs(num(row.amount)),
    direction: mapDirection(row.in_out),
    reason,
    // Never hard-code the Persian labels: the backend resolves them.
    reasonTitle: text(row.reason_title) || reason,
    paymentMethod: text(row.payment_method) || undefined,
    trackingNumber: text(row.tracking_number) || undefined,
    description: text(row.description) || undefined,
    relateId: row.relate_id != null ? String(row.relate_id) : undefined,
    date: formatDateTime(row.created_at),
  }
}

/**
 * Wallet ledger + top-up (`GET /shop/wallet/transactions`,
 * `POST /shop/wallet/charge`).
 *
 * The list is paginated without `meta`/`links`: `load()` fetches the first page
 * and `loadMore()` keeps appending until a page comes back short.
 */
export function useWallet() {
  const api = useApi()
  const transactions = ref<WalletTransaction[]>([])
  const pending = ref(false)
  const loaded = ref(false)
  const page = ref(1)
  const hasMore = ref(false)
  const filters = ref<WalletFilters>({ inOut: 'all', paymentMethod: 'all', reason: 'all' })

  const perPage = 15

  function params(): Record<string, string | number> {
    const query: Record<string, string | number> = {
      'filters[sort]': 'newest',
      'filters[per_page]': perPage,
      'filters[page]': page.value,
    }

    const { reason, inOut, paymentMethod } = filters.value
    if (reason && reason !== 'all') query['filters[reason]'] = reason
    if (inOut && inOut !== 'all' && IN_OUT_VALUES.has(inOut)) query['filters[in_out]'] = inOut
    if (paymentMethod && paymentMethod !== 'all' && PAYMENT_METHODS.has(paymentMethod))
      query['filters[payment_method]'] = paymentMethod

    return query
  }

  async function fetchPage(reset: boolean) {
    pending.value = true
    try {
      const res = await api.get<ApiWalletTransaction[]>('/shop/wallet/transactions', {
        query: params(),
      })
      const rows = (res.data ?? []).map(mapTransaction)

      transactions.value = reset ? rows : [...transactions.value, ...rows]
      hasMore.value = (res.data?.length ?? 0) >= perPage
      loaded.value = true
    }
    finally {
      pending.value = false
    }
  }

  /** (Re)load the ledger from the first page, optionally with new filters. */
  async function load(next: WalletFilters = {}) {
    filters.value = { ...filters.value, ...next }
    page.value = 1
    await fetchPage(true)
  }

  /** Append the next page (only when the last one was full). */
  async function loadMore() {
    if (pending.value || !hasMore.value) return
    page.value += 1
    await fetchPage(false)
  }

  /**
   * Start an online wallet top-up.
   *
   * `payment_method_id` must be an active `type: online` method — wallet methods
   * (`myCredit`) are rejected by the API. The balance only increases after the
   * gateway callback, so refresh the profile/ledger on return.
   */
  async function charge(input: WalletChargeInput): Promise<GatewayRedirect> {
    const res = await api.post<GatewayRedirect>('/shop/wallet/charge', {
      amount: Math.ceil(input.amount),
      payment_method_id: Number(input.paymentMethodId),
      device: input.device ?? detectDevice(),
    })

    if (!res.data) throw new Error(res.message || 'شارژ کیف پول انجام نشد.')
    return res.data
  }

  return {
    transactions,
    pending,
    loaded,
    hasMore,
    filters,
    load,
    loadMore,
    charge,
  }
}
