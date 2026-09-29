import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import { searchCategoryTiles, searchableProducts } from '~/data/search'

/**
 * Search matching for the mock catalog.
 *
 * Kept deliberately small and dependency-free: the real implementation will be
 * an API call, so this only needs to make the demo behave like the design
 * (typos such as «Galaxi» / «لیپاپ» still resolve).
 */

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

/**
 * Fold a string into a canonical form for matching: lowercase, Arabic→Persian
 * letter variants, no diacritics/zero-width marks, ASCII digits.
 */
export function normalizeSearchText(input: string): string {
  let out = input.normalize('NFKC').toLowerCase()

  out = out
    .replace(/[يىئ]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ةۀ]/g, 'ه')
    .replace(/ؤ/g, 'و')

  // Persian/Arabic-Indic digits → ASCII
  out = out
    .replace(/[۰-۹]/g, d => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, d => String(ARABIC_DIGITS.indexOf(d)))

  // Harakat, tatweel and zero-width joiners/direction marks
  out = out.replace(/[\u064B-\u0652\u0670\u0640\u200b-\u200f\u200c]/g, '')

  return out.replace(/\s+/g, ' ').trim()
}

/** Iterative Levenshtein distance with an early length guard. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost)
    }
    prev = curr
  }
  return prev[b.length]!
}

/** Does a single haystack token satisfy a query token (substring or 1–2 typos)? */
function tokenMatches(haystack: string, needle: string): boolean {
  if (!needle) return true
  if (!haystack) return false
  if (haystack.includes(needle) || needle.includes(haystack)) return true

  // Fuzzy fallback so «Galaxi»→«galaxy» and «لیپاپ»→«لپتاپ» still match.
  if (needle.length >= 4 && haystack.length >= 4) {
    const tolerance = 2
    if (
      Math.abs(haystack.length - needle.length) <= tolerance
      && levenshtein(haystack, needle) <= tolerance
    ) {
      return true
    }
  }

  return false
}

/** Every query token must match at least one haystack token. */
export function matchesQuery(text: string, query: string): boolean {
  const haystack = normalizeSearchText(text).split(' ').filter(Boolean)
  const needles = normalizeSearchText(query).split(' ').filter(Boolean)
  if (!needles.length) return false
  return needles.every(needle => haystack.some(word => tokenMatches(word, needle)))
}

export interface CatalogSearchResult {
  products: SearchProduct[]
  categories: SearchCategoryTile[]
}

/**
 * Search the mock catalog. Products match on title + keywords; the category
 * row prefers tiles matching the query, then the categories of the matched
 * products, then pads with curated tiles so the design's 6-tile row always
 * has content (demo behaviour — a real API returns relevant categories).
 */
export function searchCatalog(query: string): CatalogSearchResult {
  const trimmed = query.trim()
  if (!trimmed) return { products: [], categories: [] }

  const products = searchableProducts.filter(product =>
    matchesQuery([product.title, ...(product.keywords ?? [])].join(' '), trimmed),
  )

  const picked: SearchCategoryTile[] = []
  const push = (tile?: SearchCategoryTile) => {
    if (tile && !picked.some(t => t.id === tile.id)) picked.push(tile)
  }

  for (const tile of searchCategoryTiles) {
    if (matchesQuery(tile.title, trimmed)) push(tile)
  }
  for (const product of products) {
    push(searchCategoryTiles.find(tile => tile.id === product.categoryId))
  }
  for (const tile of searchCategoryTiles) {
    if (picked.length >= 6) break
    push(tile)
  }

  return { products, categories: picked.slice(0, 6) }
}
