import type { Product } from '~/utils/product'
import { resolveMediaUrl } from '~/utils/media'

interface ApiFavoriteProduct {
  id: number
  slug: string
  title: string
  img?: string | null
  colors?: Array<{ code?: string | null, title?: string | null }>
  cheapest_stock?: {
    customer_price?: string | number | null
    discount?: number | null
    quantity?: number | null
  } | null
}

interface ApiFavorite {
  id: number
  relate_to: string
  relate_id: number
  /** Full related product/blog payload. */
  item?: ApiFavoriteProduct | null
  created_at?: string | null
}

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function mapFavoriteProduct(item: ApiFavoriteProduct, apiBase: string): Product {
  const stock = item.cheapest_stock
  const price = num(stock?.customer_price)
  const discountPercent = num(stock?.discount)
  const oldPrice = discountPercent > 0 && discountPercent < 100 && price > 0
    ? Math.round(price / (1 - discountPercent / 100))
    : undefined

  return {
    id: String(item.id),
    title: item.title,
    image: resolveMediaUrl(item.img, apiBase),
    price,
    oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
    discount: oldPrice && oldPrice > price ? Math.round(discountPercent) : undefined,
    colors: (item.colors ?? [])
      .map(color => color.code)
      .filter((code): code is string => !!code),
  }
}

/** Authenticated user's favorite products (summaries included in the payload). */
export function useFavorites() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const favorites = ref<Product[]>([])
  const favoriteIds = ref<number[]>([])
  const pending = ref(false)
  const loaded = ref(false)

  async function load() {
    pending.value = true
    try {
      const res = await api.get<ApiFavorite[]>('/shop/user/favorite', {
        query: { 'filters[relate_to]': 'product' },
      })
      const records = (res.data ?? []).filter(record => record.relate_to === 'product')
      favoriteIds.value = records.map(record => record.relate_id)
      favorites.value = records
        .filter(record => !!record.item)
        .map(record => mapFavoriteProduct(record.item!, apiBase))
    }
    finally {
      loaded.value = true
      pending.value = false
    }
  }

  /** Toggle a product favorite. The endpoint flips the current state. */
  async function toggle(productId: string | number) {
    const id = Number(productId)
    const res = await api.post<{ added: boolean }>('/shop/user/favorite', {
      relate_to: 'product',
      relate_id: id,
    })

    const added = res.data?.added ?? false
    if (added) {
      favoriteIds.value = [...new Set([...favoriteIds.value, id])]
    }
    else {
      favoriteIds.value = favoriteIds.value.filter(value => value !== id)
      favorites.value = favorites.value.filter(product => Number(product.id) !== id)
    }

    return added
  }

  async function remove(productId: string | number) {
    const id = Number(productId)
    if (!favoriteIds.value.includes(id)) {
      favorites.value = favorites.value.filter(product => Number(product.id) !== id)
      return false
    }
    return toggle(id)
  }

  return { favorites, favoriteIds, pending, loaded, load, toggle, remove }
}
