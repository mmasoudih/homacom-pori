import { ApiError } from '~/composables/useApi'

/** Channels accepted by `POST /shop/products/{slug}/notify`. */
export type NotifyChannel = 'sms' | 'email' | 'both'

export interface NotifyProductInput {
  slug: string
  channel: NotifyChannel
  /** Restrict the reminder to a single variant (`stock_id`); omit for the product. */
  stockId?: number | null
}

/** `ProductNotifyResource` (2026-11-02). */
export interface ProductNotifyRecord {
  id: number
  channel: NotifyChannel
  mobile?: string | null
  email?: string | null
  status?: string | null
  created_at?: string | null
}

/**
 * "Notify me when back in stock" (`POST /shop/products/{slug}/notify`).
 *
 * Contacts always come from the user profile — the request only picks the
 * channel. The endpoint is idempotent: repeating it updates the pending row.
 */
export function useProductNotify() {
  const api = useApi()

  async function notify(input: NotifyProductInput) {
    const body: Record<string, string | number> = { channel: input.channel }
    if (input.stockId) body.stock_id = input.stockId

    const res = await api.post<ProductNotifyRecord>(
      `/shop/products/${encodeURIComponent(input.slug)}/notify`,
      body,
    )

    if (res.success === false) throw new ApiError(res.message || '', 200)
    return res
  }

  return { notify }
}
