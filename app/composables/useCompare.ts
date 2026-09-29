import { computed } from 'vue'
import { toast } from 'vue-sonner'
import type { SearchProduct } from '~/data/search'
import { COMPARE_MAX, getCompareProduct, initialCompareIds } from '~/data/compare'

/**
 * Shared, in-session compare list (mock — no persistence).
 *
 * Backed by `useState` so the header badge, product cards and the /compare page
 * all read/write the same list across navigation within a session.
 */
export function useCompare() {
  const ids = useState<string[]>('compare-ids', () => [...initialCompareIds])

  const items = computed(() =>
    ids.value
      .map(id => getCompareProduct(id))
      .filter((product): product is SearchProduct => product != null),
  )

  const count = computed(() => items.value.length)
  const max = COMPARE_MAX
  const isFull = computed(() => count.value >= max)

  function has(id: string | number | undefined): boolean {
    if (id == null) return false
    return ids.value.includes(String(id))
  }

  function add(id: string | number | undefined) {
    const value = String(id ?? '')
    if (!value || !getCompareProduct(value)) return
    if (ids.value.includes(value)) {
      toast.message('این کالا از قبل در لیست مقایسه است.')
      return
    }
    if (isFull.value) {
      toast.error(`حداکثر ${max} کالا را می‌توانید مقایسه کنید.`)
      return
    }
    ids.value = [...ids.value, value]
    toast.success('کالا به لیست مقایسه اضافه شد.')
  }

  function remove(id: string | number | undefined) {
    const value = String(id ?? '')
    ids.value = ids.value.filter(item => item !== value)
  }

  function toggle(id: string | number | undefined) {
    const value = String(id ?? '')
    if (ids.value.includes(value)) remove(value)
    else add(value)
  }

  function clear() {
    ids.value = []
  }

  return { ids, items, count, max, isFull, has, add, remove, toggle, clear }
}
