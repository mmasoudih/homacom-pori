import type { SearchFingerprintValue, SearchProduct } from '~/data/search'
import {
  searchBrandOptions,
  searchCategoryOptions,
  searchFingerprintOptions,
  searchStorageOptions,
} from '~/data/search'
import type { SearchSortKey } from '~/utils/search'
import { searchPriceCeiling, sortSearchProducts } from '~/utils/search'
import { formatPriceFa } from '~/utils/format'

/** A removable chip rendered at the top of the filter panel. */
export interface SearchFilterChip {
  key: string
  label: string
}

const CATEGORY_LABELS = new Map(searchCategoryOptions.map(o => [o.id, o.label]))
const BRAND_LABELS = new Map(searchBrandOptions.map(o => [o.id, o.label]))
const FINGERPRINT_LABELS = new Map(
  searchFingerprintOptions.map(o => [o.value, o.label] as const),
)
const STORAGE_LABELS = new Map(searchStorageOptions.map(o => [o.id, o.label]))

/**
 * Facet + sort state for the search-results page. Filters are applied live
 * (client-side) on top of the products the search resolved.
 */
export function useSearchFilters(source: Ref<SearchProduct[]>) {
  const { colors: shopColors } = useShopColors()
  const onlyAvailable = ref(false)
  const categories = ref<string[]>([])
  const brands = ref<string[]>([])
  const color = ref<string | null>(null)
  const fingerprint = ref<SearchFingerprintValue | null>(null)
  /** «حافظه داخلی» — mobile-only facet; ids are capacities in GB. */
  const storage = ref<string[]>([])
  const sort = ref<SearchSortKey>('best-selling')

  const priceCeiling = computed(() => searchPriceCeiling(source.value))
  const priceRange = ref<[number, number]>([0, 0])

  // Whenever the result set changes, reset the price window to the new bounds.
  watch(
    priceCeiling,
    (ceiling) => {
      priceRange.value = [0, ceiling]
    },
    { immediate: true },
  )

  function toggle(list: Ref<string[]>, id: string) {
    list.value = list.value.includes(id)
      ? list.value.filter(value => value !== id)
      : [...list.value, id]
  }

  function toggleCategory(id: string) {
    toggle(categories, id)
  }

  function toggleBrand(id: string) {
    toggle(brands, id)
  }

  function setColor(id: string) {
    color.value = color.value === id ? null : id
  }

  function setFingerprint(value: SearchFingerprintValue) {
    fingerprint.value = fingerprint.value === value ? null : value
  }

  function toggleStorage(id: string) {
    toggle(storage, id)
  }

  function resetPrice() {
    priceRange.value = [0, priceCeiling.value]
  }

  function reset() {
    onlyAvailable.value = false
    categories.value = []
    brands.value = []
    color.value = null
    fingerprint.value = null
    storage.value = []
    resetPrice()
  }

  const filtered = computed(() => {
    const [min, max] = priceRange.value
    const list = source.value.filter((product) => {
      if (onlyAvailable.value && !product.inStock) return false
      if (categories.value.length && !categories.value.includes(product.categoryId)) return false
      if (brands.value.length && !brands.value.includes(product.brandId)) return false
      if (color.value && !product.colorIds.includes(color.value)) return false
      if (fingerprint.value === 'has' && !product.hasFingerprint) return false
      if (fingerprint.value === 'none' && product.hasFingerprint) return false
      if (storage.value.length && !storage.value.includes(String(product.storageGb))) return false
      if (product.price < min || product.price > max) return false
      return true
    })
    return sortSearchProducts(list, sort.value)
  })

  const activeChips = computed<SearchFilterChip[]>(() => {
    const chips: SearchFilterChip[] = []

    if (priceRange.value[0] > 0 || priceRange.value[1] < priceCeiling.value) {
      chips.push({
        key: 'price',
        label: `قیمت از ${formatPriceFa(priceRange.value[0])} تا ${formatPriceFa(priceRange.value[1])}`,
      })
    }
    if (onlyAvailable.value) {
      chips.push({ key: 'available', label: 'کالاهای موجود' })
    }
    for (const id of categories.value) {
      chips.push({ key: `category:${id}`, label: CATEGORY_LABELS.get(id) ?? id })
    }
    for (const id of brands.value) {
      chips.push({ key: `brand:${id}`, label: BRAND_LABELS.get(id) ?? id })
    }
    if (color.value) {
      const colorLabels = new Map(shopColors.value.map(option => [option.id, option.label]))
      chips.push({ key: `color:${color.value}`, label: colorLabels.get(color.value) ?? color.value })
    }
    if (fingerprint.value) {
      const label = FINGERPRINT_LABELS.get(fingerprint.value) ?? fingerprint.value
      chips.push({ key: 'fingerprint', label: `اثر انگشت: ${label}` })
    }
    for (const id of storage.value) {
      chips.push({ key: `storage:${id}`, label: `حافظه داخلی: ${STORAGE_LABELS.get(id) ?? id}` })
    }

    return chips
  })

  function removeChip(key: string) {
    if (key === 'price') return resetPrice()
    if (key === 'available') {
      onlyAvailable.value = false
      return
    }
    if (key === 'fingerprint') {
      fingerprint.value = null
      return
    }
    const [kind, id] = key.split(':')
    if (kind === 'category' && id) toggleCategory(id)
    else if (kind === 'brand' && id) toggleBrand(id)
    else if (kind === 'color' && id) color.value = null
    else if (kind === 'storage' && id) storage.value = storage.value.filter(value => value !== id)
  }

  const hasActiveFilters = computed(() =>
    activeChips.value.length > 0,
  )

  return {
    // state
    onlyAvailable,
    categories,
    brands,
    color,
    fingerprint,
    storage,
    sort,
    priceRange,
    priceCeiling,
    // derived
    filtered,
    activeChips,
    hasActiveFilters,
    // actions
    toggleCategory,
    toggleBrand,
    setColor,
    setFingerprint,
    toggleStorage,
    resetPrice,
    removeChip,
    reset,
  }
}
