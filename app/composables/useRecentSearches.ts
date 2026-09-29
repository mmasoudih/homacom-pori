/**
 * «جستجوهای اخیر شما» — recent search terms.
 *
 * Module-level state so the desktop dropdown, the mobile overlay and any other
 * consumer stay in sync. Persisted to `localStorage` (client only, SSR-safe).
 */

const STORAGE_KEY = 'homacom:recent-searches'
const MAX_RECENT = 8

const items = ref<string[]>([])
let loaded = false

function load() {
  if (!import.meta.client) return
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    items.value = Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string').slice(0, MAX_RECENT)
      : []
  }
  catch {
    items.value = []
  }
  loaded = true
}

function persist() {
  if (!import.meta.client) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }
  catch {
    // Storage unavailable (private mode / quota) — recents stay in memory only.
  }
}

export function useRecentSearches() {
  onMounted(() => {
    if (!loaded) load()
  })

  /** Record a term (most recent first, de-duplicated, capped). */
  function add(term: string) {
    const value = term.trim()
    if (!value) return
    items.value = [value, ...items.value.filter(item => item !== value)].slice(0, MAX_RECENT)
    persist()
  }

  function remove(term: string) {
    items.value = items.value.filter(item => item !== term)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  return { items, add, remove, clear, max: MAX_RECENT }
}
