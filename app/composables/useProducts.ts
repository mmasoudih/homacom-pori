import type { SearchProduct } from '~/data/search'
import { resolveMediaUrl } from '~/utils/media'

interface ApiProductSummary {
  id: number
  slug: string
  title: string
  title_en?: string | null
  img?: string | null
  status?: string | null
  view_count?: number | null
  score?: number | null
  created_at?: string | null
  brand?: { id: number, title: string, title_en?: string | null } | null
  categories?: Array<{ id: number, title: string }>
  colors?: Array<{ title?: string | null, title_en?: string | null, code?: string | null }>
}

interface ApiProductDetail {
  stocks?: Array<{
    customer_price?: string | number | null
    real_price?: string | number | null
    quantity?: number | null
    is_default?: string | boolean | null
  }>
}

const BRAND_IDS: Record<string, string> = {
  'سامسونگ': 'samsung',
  'اپل': 'iphone',
  'آیفون': 'iphone',
  'آنر': 'honor',
  'شیائومی': 'xiaomi',
  'گوگل': 'google',
  'نوکیا': 'nokia',
  'وان پلاس': 'oneplus',
}

const COLOR_IDS: Array<[string, string]> = [
  ['black', 'black'],
  ['white', 'white'],
  ['silver', 'silver'],
  ['gray', 'gray'],
  ['grey', 'gray'],
  ['red', 'red'],
  ['green', 'green'],
  ['blue', 'blue'],
  ['yellow', 'yellow'],
  ['golden', 'yellow'],
  ['purple', 'purple'],
  ['pink', 'pink'],
  ['brown', 'brown'],
  ['orange', 'orange'],
]

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function mapBrandId(title?: string | null): string {
  return (title && BRAND_IDS[title]) || `other-${title ?? 'unknown'}`
}

function mapColorIds(colors?: ApiProductSummary['colors']): string[] {
  const ids = new Set<string>()
  for (const color of colors ?? []) {
    const haystack = `${color.title_en ?? ''} ${color.title ?? ''}`.toLowerCase()
    for (const [needle, id] of COLOR_IDS) {
      if (haystack.includes(needle)) {
        ids.add(id)
        break
      }
    }
  }
  return [...ids]
}

/** API-backed product catalog mapped onto the search/listing view model. */
export function useProductCatalog() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  async function fetchPrice(slug: string) {
    try {
      const res = await api.get<ApiProductDetail>(`/shop/products/${encodeURIComponent(slug)}`)
      const stocks = res.data?.stocks ?? []
      const stock = stocks.find(item => item.is_default === 'yes' || item.is_default === true)
        ?? stocks.find(item => num(item.quantity) > 0)
        ?? stocks[0]
      const price = num(stock?.customer_price)
      const oldPrice = num(stock?.real_price)
      return {
        price,
        oldPrice: oldPrice > price ? oldPrice : undefined,
        discount: oldPrice > price && price > 0
          ? Math.round(((oldPrice - price) / oldPrice) * 100)
          : undefined,
      }
    }
    catch {
      return { price: 0, oldPrice: undefined, discount: undefined }
    }
  }

  async function fetchList(term: string, limit = 12, sort?: string): Promise<SearchProduct[]> {
    const query: Record<string, string | number> = {
      'filters[per_page]': limit,
      'filters[page]': 1,
    }
    if (term) query['filters[s]'] = term
    if (sort) query['filters[sort]'] = sort

    const res = await api.get<{ items: ApiProductSummary[] }>('/shop/products', { query })
    const items = res.data?.items ?? []
    const prices = await Promise.allSettled(items.map(item => fetchPrice(item.slug)))

    return items.map((item, index) => {
      const price = prices[index]?.status === 'fulfilled'
        ? prices[index].value
        : { price: 0, oldPrice: undefined, discount: undefined }
      const brandId = mapBrandId(item.brand?.title)
      const createdAt = item.created_at ? new Date(item.created_at).getTime() : 0

      return {
        id: item.slug,
        title: item.title,
        image: resolveMediaUrl(item.img, apiBase),
        price: price.price,
        oldPrice: price.oldPrice,
        discount: price.discount,
        categoryId: brandId,
        brandId,
        tileId: item.categories?.[0]?.title ?? 'products',
        colorIds: mapColorIds(item.colors),
        inStock: item.status === 'active',
        hasFingerprint: false,
        sales: num(item.score),
        views: num(item.view_count),
        addedAt: Number.isFinite(createdAt) ? createdAt : 0,
        keywords: [item.title_en, item.brand?.title, item.brand?.title_en]
          .filter((value): value is string => !!value),
      }
    })
  }

  return { fetchList }
}


export interface LandingProductCard {
  id: string
  image: string
  title: string
  price: string
  oldPrice?: string
  discount?: string
}

function toLandingCard(product: SearchProduct): LandingProductCard {
  return {
    id: product.id,
    image: product.image,
    title: product.title,
    price: String(product.price),
    oldPrice: product.oldPrice != null ? String(product.oldPrice) : undefined,
    discount: product.discount ? `%${product.discount}` : undefined,
  }
}

/** Newest + best-selling rows for the landing page (design mock as fallback). */
export function useLandingProducts() {
  const { fetchList } = useProductCatalog()
  const newest = ref<LandingProductCard[]>([])
  const bestsellers = ref<LandingProductCard[]>([])
  const loaded = ref(false)

  onMounted(async () => {
    try {
      const [newestList, bestsellerList] = await Promise.all([
        fetchList('', 6, 'newest'),
        fetchList('', 6),
      ])
      newest.value = newestList.map(toLandingCard)
      bestsellers.value = bestsellerList.map(toLandingCard)
      loaded.value = true
    }
    catch {
      // The page keeps the designed rows when the API is unavailable.
    }
  })

  return { newest, bestsellers, loaded }
}
