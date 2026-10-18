import type { CheckoutResult } from '~/data/checkout'

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

function toPersianDigits(value: string): string {
  return value.replace(/\d/g, digit => PERSIAN_DIGITS[Number(digit)] ?? digit)
}

/** Builds the receipt shown on the payment result pages. */
export function createCheckoutResult(amount: number): CheckoutResult {
  const now = new Date()

  const date = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  const time = new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)

  const order = Math.floor(10_000 + Math.random() * 89_999)
  const tracking = Math.floor(100_000_000 + Math.random() * 899_999_999)

  return {
    orderNumber: `AXM-${order}`,
    paidAt: `${date} - ${time}`,
    trackingNumber: toPersianDigits(String(tracking)),
    amount,
  }
}

/**
 * Last payment receipt, shared between the checkout page (which writes it
 * before navigating) and the result pages (which read it).
 */
export function useCheckoutResult() {
  const result = useState<CheckoutResult | null>('checkout-result', () => null)

  function setResult(value: CheckoutResult) {
    result.value = value
  }

  return { result, setResult }
}
