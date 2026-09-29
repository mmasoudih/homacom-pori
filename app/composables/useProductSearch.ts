import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import { searchCatalog } from '~/utils/search'

export type SearchStatus = 'idle' | 'loading' | 'ready'

/**
 * Simulated request latency so the loading skeleton is exercised. Replace the
 * body of `run()` with an `await $fetch(...)` call and this drops away.
 */
const SEARCH_LATENCY = 350

export function useProductSearch() {
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

  /** Run a search for `value` (debounced-by-reset; stale responses are dropped). */
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

    timer = setTimeout(() => {
      if (id !== requestId) return
      const found = searchCatalog(trimmed)
      results.value = found.products
      categories.value = found.categories
      status.value = 'ready'
    }, SEARCH_LATENCY)
  }

  onBeforeUnmount(() => clearTimeout(timer))

  const isEmpty = computed(() => status.value === 'ready' && results.value.length === 0)

  return { query, status, results, categories, isEmpty, run, reset }
}
