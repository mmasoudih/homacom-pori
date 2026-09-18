export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

/** Convert every ASCII digit in a value to its Persian-Indic counterpart. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, d => PERSIAN_DIGITS[Number(d)]!)
}

/** `۷,۵۰۰,۰۰۰` — price grouped with commas, rendered in Persian digits. */
export function formatPriceFa(value: number): string {
  return toPersianDigits(formatPrice(value))
}

/** `۸۹,۰۰۰,۰۰۰ تومان` — currency-aware Persian price label. */
export function formatCurrencyFa(value: number): string {
  return `${formatPriceFa(value)} تومان`
}
