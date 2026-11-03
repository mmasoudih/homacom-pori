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

interface ApiDashboard {
  cancelled_invoices?: number | string | null
  in_progress_invoices?: number | string | null
  other_invoices?: number | string | null
  tickets_awaiting_reply?: number | string | null
}

const EMPTY: DashboardAggregates = {
  cancelledInvoices: 0,
  inProgressInvoices: 0,
  otherInvoices: 0,
  ticketsAwaitingReply: 0,
}

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * Customer dashboard aggregates (`GET /shop/user/dashboard`).
 *
 * One shared, keyed request so the dashboard cards and the nav badges agree.
 * A failed request keeps the zeros instead of blocking the dashboard.
 */
export function useDashboard() {
  const api = useApi()

  const { data, pending, refresh } = useAsyncData<DashboardAggregates>(
    'user-dashboard',
    async () => {
      try {
        const res = await api.get<ApiDashboard>('/shop/user/dashboard')
        const row = res.data
        if (!row) return EMPTY

        return {
          cancelledInvoices: num(row.cancelled_invoices),
          inProgressInvoices: num(row.in_progress_invoices),
          otherInvoices: num(row.other_invoices),
          ticketsAwaitingReply: num(row.tickets_awaiting_reply),
        }
      }
      catch {
        return EMPTY
      }
    },
    { default: () => EMPTY },
  )

  const aggregates = computed<DashboardAggregates>(() => data.value ?? EMPTY)
  const loaded = computed(() => !pending.value)

  return { aggregates, pending, loaded, refresh }
}
