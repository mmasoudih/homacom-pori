import { formatPrice } from '~/utils/format'

export interface ProductColor {
  name?: string
  value: string
  image?: string
}

/**
 * Generic product shape used by the <Product> component.
 * Backwards-compatible with the string-based shape in `~/data/landing`
 * (string prices, `%30`-style discounts, hex-string color arrays) while also
 * accepting the numeric model (number price, object colors, expiry timestamp).
 */
export interface Product {
  id?: string | number
  title: string
  image?: string
  price: string | number
  oldPrice?: string | number
  discount?: string | number
  colors?: Array<string | ProductColor>
  discountExpiresAt?: string | Date
}

export type ProductVariant = 'vertical' | 'horizontal' | 'minimal'
export type ProductTone = 'default' | 'inverted'

/** Parse `'87,000,000'`, `'87000000'` or `87000000` into a finite number. */
export function toNumber(value: string | number): number {
  const n = typeof value === 'number' ? value : Number(String(value).replace(/[,\s]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/** Parse `'%30'`, `'30%'`, `'30'` or `30` into a percentage. */
export function parseDiscount(value?: string | number): number | null {
  if (value == null || value === '') return null
  const n = typeof value === 'number' ? value : Number(String(value).replace('%', '').trim())
  return Number.isFinite(n) ? n : null
}

/** Derive a discount percentage from prices, or null when the discount is invalid. */
export function getDiscountPercent(price: number, originalPrice: number): number | null {
  if (!Number.isFinite(price) || !Number.isFinite(originalPrice)) return null
  if (price <= 0 || originalPrice <= 0 || price >= originalPrice) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

/**
 * Resolve the effective discount percentage.
 * Prefers an explicit discount but validates it: a discount whose new price is
 * not lower than the original price is suppressed. Falls back to deriving it
 * from the prices when no explicit discount is given.
 */
export function resolveDiscount(
  discount: string | number | undefined,
  price: number,
  originalPrice: number,
): number | null {
  const explicit = parseDiscount(discount)
  const hasOriginal = Number.isFinite(originalPrice) && originalPrice > 0
  if (explicit != null && explicit > 0) {
    if (hasOriginal && price >= originalPrice) return null
    return Math.min(explicit, 100)
  }
  return getDiscountPercent(price, originalPrice)
}

/** Normalize `string[]` or `ProductColor[]` colors into `ProductColor[]`. */
export function normalizeColors(colors?: Array<string | ProductColor>): ProductColor[] {
  if (!colors) return []
  return colors.map((c) =>
    typeof c === 'string' ? { value: c } : { value: c.value, name: c.name, image: c.image },
  )
}

/** `1,290,000 تومان` — currency-aware price label. */
export function formatCurrency(value: number): string {
  return `${formatPrice(value)} تومان`
}

/**
 * Discount-percent badge colors per tone.
 * Default: solid brand red with white text. Inverted (on colored sections):
 * light red chip with red text so it stays visible against the section bg.
 */
export function discountBadgeClass(tone: ProductTone = 'default'): string {
  return tone === 'inverted' ? 'bg-R-50 text-R-300' : 'bg-R-300 text-white'
}
