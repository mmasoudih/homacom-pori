import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import { searchCategoryTiles, searchableProducts } from '~/data/search'
import { searchCatalog } from '~/utils/search'

export type SearchResultsStatus = 'loading' | 'ready'

/**
 * Simulated request latency so the loading skeleton is exercised. Replace the
 * body of `load()` with an `await $fetch(...)` call and this drops away.
 */
const SEARCH_LATENCY = 450

/**
 * Search-results data source for the `/search` page.
 *
 * Unlike the header's `useProductSearch` (which only ever holds a handful of
 * matches), this resolves the *complete* result set for a term — or the whole
 * catalog when the term is empty — so the facet sidebar has something to filter.
 */
export function useSearchResults() {
  const status = ref<SearchResultsStatus>('loading')
  const query = ref('')
  const results = ref<SearchProduct[]>([])
  /** Category tiles for the mobile «بر اساس دسته‌بندی» row. */
  const categories = ref<SearchCategoryTile[]>([])

  let timer: ReturnType<typeof setTimeout> | undefined
  let requestId = 0

  function load(term: string) {
    const trimmed = term.trim()
    query.value = trimmed
    clearTimeout(timer)
    requestId += 1
    status.value = 'loading'

    // On the server, always stay in the loading state so the markup is
    // deterministic; the client resolves the query after hydration.
    if (!import.meta.client) return

    const id = requestId
    timer = setTimeout(() => {
      if (id !== requestId) return
      if (trimmed) {
        const found = searchCatalog(trimmed)
        results.value = found.products
        categories.value = found.categories
      }
      else {
        results.value = [...searchableProducts]
        categories.value = [...searchCategoryTiles]
      }
      status.value = 'ready'
    }, SEARCH_LATENCY)
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { query, status, results, categories, load }
}
