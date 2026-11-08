import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import { searchCategoryTiles } from '~/data/search'

export type SearchResultsStatus = 'loading' | 'ready'

/**
 * SSR-backed search results for `/search`.
 *
 * The query (and the selected category ids) form the async-data key, so the
 * server renders the real result set (no skeleton/mock flash) and client-side
 * query changes refetch.
 *
 * `categoryIds` are the ids of the selected menu category **and its
 * descendants**; they are sent as repeated `filters[categories][]` params.
 */
export function useSearchResults(
  term: Ref<string>,
  categoryIds: Ref<number[]> = ref<number[]>([]),
) {
  const { fetchList } = useProductCatalog()

  const { data, pending } = useAsyncData<SearchProduct[]>(
    () => `shop-search-${term.value || 'all'}-${categoryIds.value.join('.') || 'any'}`,
    async () => {
      try {
        const filters = categoryIds.value.length
          ? { 'filters[categories][]': categoryIds.value }
          : undefined
        return await fetchList(term.value.trim(), 24, undefined, filters)
      }
      catch {
        return []
      }
    },
    {
      watch: [term, categoryIds],
      default: () => [],
    },
  )

  const results = computed(() => data.value)
  const status = computed<SearchResultsStatus>(() => (pending.value ? 'loading' : 'ready'))
  const categories = computed<SearchCategoryTile[]>(() => [...searchCategoryTiles])

  return { query: term, status, results, categories }
}
