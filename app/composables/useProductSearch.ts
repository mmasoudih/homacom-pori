import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import { searchCategoryTiles } from '~/data/search'

export type SearchStatus = 'idle' | 'loading' | 'ready'

const SEARCH_LATENCY = 300

/** Header search suggestions backed by the products endpoint. */
export function useProductSearch() {
  const { fetchList } = useProductCatalog()
  const query = ref('')
  const status = ref<SearchStatus>('idle')
  const results = ref<SearchProduct[]>([])
  const categories = ref<SearchCategoryTile[]>([])

  let timer: ReturnType<typeof setTimeout> | undefined
  let requestId = 0

  function reset() {
    clearTimeout(timer)
    requestId += 1
    status.value = 'idle'
    results.value = []
    categories.value = []
  }

  function run(value: string) {
    const trimmed = value.trim()
    clearTimeout(timer)
    requestId += 1

    if (!trimmed) {
      status.value = 'idle'
      results.value = []
      categories.value = []
      return
    }

    status.value = 'loading'

    // On the server, always stay in the loading state so the markup is
    // deterministic; the client resolves the query after hydration.
    if (!import.meta.client) return

    const id = requestId

    timer = setTimeout(async () => {
      try {
        const products = await fetchList(trimmed, 6)
        if (id !== requestId) return
        results.value = products
        categories.value = searchCategoryTiles.slice(0, 4)
        status.value = 'ready'
      }
      catch {
        if (id !== requestId) return
        results.value = []
        categories.value = []
        status.value = 'ready'
      }
    }, SEARCH_LATENCY)
  }

  onBeforeUnmount(() => clearTimeout(timer))

  const isEmpty = computed(() => status.value === 'ready' && results.value.length === 0)

  return { query, status, results, categories, isEmpty, run, reset }
}
