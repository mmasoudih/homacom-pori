import type { SearchProduct } from '~/data/search'
import { resolveMediaUrl } from '~/utils/media'

interface ApiCheapestStock {
  id: number
  customer_price?: string | number | null
  discount?: number | null
  quantity?: number | null
  min_in_cart?: number | null
  max_in_cart?: number | null
  is_default?: string | boolean | null
}

interface ApiProductSummary {
  id: number
  slug: string
  title: string
  title_en?: string | null
  img?: string | null
  status?: string | null
  view_count?: number | null
  /** Rating score (0–5), not an invoice count. */
  score?: number | null
  order_count?: number | null
  created_at?: string | null
  brand?: { id: number, title: string, title_en?: string | null } | null
  categories?: Array<{ id: number, title: string }>
  colors?: Array<{ id?: number, title?: string | null, title_en?: string | null, code?: string | null }>
  cheapest_stock?: ApiCheapestStock | null
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
    if (color.id != null) {
      ids.add(String(color.id))
      continue
    }

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

  /**
   * `cheapest_stock` carries the price and the purchase bounds, but the list
   * payload has no `real_price`, so the struck-through price is derived from
   * the percentage discount.
   */
  function listPrice(stock?: ApiCheapestStock | null) {
    const price = num(stock?.customer_price)
    const discount = num(stock?.discount)
    const oldPrice = discount > 0 && discount < 100 && price > 0
      ? Math.round(price / (1 - discount / 100))
      : undefined

    return {
      price,
      oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
      discount: oldPrice && oldPrice > price ? Math.round(discount) : undefined,
    }
  }

  async function fetchList(
    term: string,
    limit = 12,
    sort?: string,
    extraFilters?: Record<string, string | number>,
  ): Promise<SearchProduct[]> {
    const query: Record<string, string | number> = {
      'filters[per_page]': limit,
      'filters[page]': 1,
      ...extraFilters,
    }
    if (term) query['filters[s]'] = term
    if (sort) query['filters[sort]'] = sort

    const res = await api.get<{ items: ApiProductSummary[] }>('/shop/products', { query, skipAuth: true })
    const items = res.data?.items ?? []

    return items.map((item) => {
      const stock = item.cheapest_stock
      const price = listPrice(stock)
      const brandId = mapBrandId(item.brand?.title)
      const createdAt = item.created_at ? new Date(item.created_at).getTime() : 0
      const quantity = num(stock?.quantity)

      return {
        id: item.slug,
        title: item.title,
        image: resolveMediaUrl(item.img, apiBase),
        price: price.price,
        oldPrice: price.oldPrice,
        discount: price.discount,
        stockId: stock?.id,
        minQuantity: num(stock?.min_in_cart) || 1,
        maxQuantity: num(stock?.max_in_cart) || undefined,
        categoryId: brandId,
        brandId,
        tileId: item.categories?.[0]?.title ?? 'products',
        colorIds: mapColorIds(item.colors),
        inStock: quantity > 0 && item.status === 'active',
        hasFingerprint: false,
        sales: num(item.order_count),
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

export function toLandingCard(product: SearchProduct): LandingProductCard {
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

  const { data, pending } = useAsyncData<{ newest: LandingProductCard[], bestsellers: LandingProductCard[] }>(
    'shop-landing-products',
    async () => {
      try {
        const [newestList, bestsellerList] = await Promise.all([
          fetchList('', 6, 'newest'),
          fetchList('', 6, 'more_invoice'),
        ])
        return {
          newest: newestList.map(toLandingCard),
          bestsellers: bestsellerList.map(toLandingCard),
        }
      }
      catch {
        return { newest: [], bestsellers: [] }
      }
    },
    { default: () => ({ newest: [], bestsellers: [] }) },
  )

  const newest = computed(() => data.value.newest)
  const bestsellers = computed(() => data.value.bestsellers)
  const loaded = computed(() => !pending.value)

  return { newest, bestsellers, loaded }
}
