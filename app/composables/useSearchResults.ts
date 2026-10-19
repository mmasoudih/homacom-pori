import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import { searchCategoryTiles } from '~/data/search'

export type SearchResultsStatus = 'loading' | 'ready'

/** Search-results data source for the `/search` page. */
export function useSearchResults() {
  const { fetchList } = useProductCatalog()
  const status = ref<SearchResultsStatus>('loading')
  const query = ref('')
  const results = ref<SearchProduct[]>([])
  /** Category tiles for the mobile «بر اساس دسته‌بندی» row. */
  const categories = ref<SearchCategoryTile[]>([...searchCategoryTiles])

  let requestId = 0

  async function load(term: string) {
    const trimmed = term.trim()
    query.value = trimmed
    requestId += 1
    const id = requestId
    status.value = 'loading'

    // On the server, stay in the loading state so the markup is deterministic.
    if (!import.meta.client) return

    try {
      const products = await fetchList(trimmed, 24)
      if (id !== requestId) return
      results.value = products
      categories.value = [...searchCategoryTiles]
      status.value = 'ready'
    }
    catch {
      if (id !== requestId) return
      results.value = []
      status.value = 'ready'
    }
  }

  return { query, status, results, categories, load }
}
