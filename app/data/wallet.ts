/* ------------------------------------------------------------------ *
 * Wallet ledger (`GET /shop/wallet/transactions`)
 * ------------------------------------------------------------------ */

export type WalletDirection = 'in' | 'out' | 'in_out'

/**
 * One row of the customer's wallet ledger.
 *
 * `amount` is always positive — the direction lives in `direction` (`in_out`),
 * and the label must come from `reasonTitle` (server-resolved), never from a
 * hard-coded map of reason codes.
 */
export interface WalletTransaction {
  id: string
  amount: number
  direction: WalletDirection
  /** Raw reason code (`charge_credit`, `invoice_payment`, …). */
  reason: string
  /** Server-resolved Persian label; falls back to `reason` when empty. */
  reasonTitle: string
  paymentMethod?: string
  trackingNumber?: string
  description?: string
  relateId?: string
  /** Persian date + time for display. */
  date: string
}

export const walletDirectionMeta: Record<WalletDirection, { label: string, tone: 'emerald' | 'red' | 'amber' }> = {
  in: { label: 'واریز', tone: 'emerald' },
  out: { label: 'برداشت', tone: 'red' },
  in_out: { label: 'واریز و برداشت', tone: 'amber' },
}
