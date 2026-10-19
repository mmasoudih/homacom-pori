import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import { searchCategoryTiles } from '~/data/search'

export type SearchResultsStatus = 'loading' | 'ready'

/**
 * SSR-backed search results for `/search`.
 *
 * The query is the async-data key, so the server renders the real result set
 * (no skeleton/mock flash) and client-side query changes refetch.
 */
export function useSearchResults(term: Ref<string>) {
  const { fetchList } = useProductCatalog()

  const { data, pending } = useAsyncData<SearchProduct[]>(
    () => `shop-search-${term.value || 'all'}`,
    async () => {
      try {
        return await fetchList(term.value.trim(), 24)
      }
      catch {
        return []
      }
    },
    {
      watch: [term],
      default: () => [],
    },
  )

  const results = computed(() => data.value)
  const status = computed<SearchResultsStatus>(() => (pending.value ? 'loading' : 'ready'))
  const categories = computed<SearchCategoryTile[]>(() => [...searchCategoryTiles])

  return { query: term, status, results, categories }
}
