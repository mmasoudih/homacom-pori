import type { Product } from '~/utils/product'
import { resolveMediaUrl } from '~/utils/media'

interface ApiFavorite {
  id: number
  relate_to: string
  relate_id: number
  created_at?: string | null
}

interface ApiProductSummary {
  id: number
  slug: string
  title: string
  img?: string | null
  colors?: Array<{ code?: string | null, title?: string | null }>
}

interface ApiProductDetail {
  stocks?: Array<{
    customer_price?: string | number | null
    real_price?: string | number | null
    quantity?: number | null
    is_default?: string | boolean | null
  }>
}

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Authenticated user's favorite products (records → product lookups). */
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

      if (!favoriteIds.value.length) {
        favorites.value = []
        loaded.value = true
        return
      }

      const idsQuery = favoriteIds.value
        .map(id => `filters[ids][]=${encodeURIComponent(id)}`)
        .join('&')
      const list = await api.get<{ items: ApiProductSummary[] }>(
        `/shop/products?${idsQuery}&filters[per_page]=${favoriteIds.value.length}`,
      )
      const summaries = list.data?.items ?? []

      const details = await Promise.allSettled(
        summaries.map(product => api.get<ApiProductDetail>(`/shop/products/${encodeURIComponent(product.slug)}`)),
      )

      const byId = new Map<number, Product>()
      summaries.forEach((summary, index) => {
        const detail = details[index]
        const stocks = detail?.status === 'fulfilled' ? detail.value.data?.stocks ?? [] : []
        const stock = stocks.find(item => item.is_default === 'yes' || item.is_default === true)
          ?? stocks.find(item => num(item.quantity) > 0)
          ?? stocks[0]
        const price = num(stock?.customer_price)
        const realPrice = num(stock?.real_price)

        byId.set(summary.id, {
          id: summary.slug,
          title: summary.title,
          image: resolveMediaUrl(summary.img, apiBase),
          price,
          oldPrice: realPrice > price ? realPrice : undefined,
          discount: realPrice > price && price > 0
            ? Math.round(((realPrice - price) / realPrice) * 100)
            : undefined,
          colors: (summary.colors ?? [])
            .map(color => color.code)
            .filter((code): code is string => !!code),
        })
      })

      favorites.value = favoriteIds.value
        .map(id => byId.get(id))
        .filter((product): product is Product => !!product)
    }
    finally {
      loaded.value = true
      pending.value = false
    }
  }

  /** Add/remove a product from favorites via the toggle endpoint. */
  async function toggle(productId: string | number, action: 'default' | 'add' | 'remove' = 'default') {
    const res = await api.post<{ added: boolean }>('/shop/user/favorite', {
      relate_to: 'product',
      relate_id: Number(productId),
      action,
    })

    const id = Number(productId)
    if (res.data?.added === false) {
      favoriteIds.value = favoriteIds.value.filter(value => value !== id)
      favorites.value = favorites.value.filter(product => Number(product.id) !== id)
    }
    else {
      favoriteIds.value = [...new Set([...favoriteIds.value, id])]
    }

    return res.data?.added ?? false
  }

  async function remove(productId: string | number) {
    return toggle(productId, 'remove')
  }

  return { favorites, favoriteIds, pending, loaded, load, toggle, remove }
}
