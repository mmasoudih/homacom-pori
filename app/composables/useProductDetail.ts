import type {
  CommentsSummary,
  FeatureRow,
  GalleryItem,
  ProductComment,
  ProductDetail,
  ProductDetailColor,
  ServiceCatalogItem,
  ServiceCategory,
  ServicePackage,
  Seller,
  SpecTableRow,
  WarrantyOption,
} from '~/data/product'
import { getProductDetail, mockProductDetail } from '~/data/product'
import { resolveMediaUrl } from '~/utils/media'

interface ApiColor {
  id: number
  title: string
  title_en?: string | null
  code: string
}

interface ApiWarranty {
  id: number
  title: string
  description?: string | null
  duration?: number | null
}

interface ApiStore {
  id: number
  title: string
  img?: string | null
}

interface ApiStock {
  id: number
  customer_price?: string | number | null
  real_price?: string | number | null
  discount?: number | null
  quantity?: number | null
  max_in_cart?: number | null
  is_default?: string | boolean | null
  color?: ApiColor | null
  warranty?: ApiWarranty | null
  size?: { id: number, title: string, description?: string | null } | null
  store?: ApiStore | null
}

interface ApiServiceItem {
  id: number
  title: string
  description?: string | null
  price?: string | number | null
}

interface ApiServiceGroup {
  id: number
  name: string
  icon?: string | null
  items?: ApiServiceItem[]
}

interface ApiQuestion {
  id: number
  nickname?: string | null
  title: string
  content?: string | null
}

interface ApiProduct {
  id: number
  product_code?: string | null
  title: string
  title_en?: string | null
  slug: string
  img?: string | null
  rate?: number | null
  comments_count?: number | null
  categories?: Array<{ id: number, title: string, slug?: string }>
  brand?: { id: number, title: string, title_en?: string | null } | null
  galleries?: Array<{ id: number, url: string, title?: string | null }>
  size?: {
    length?: number | null
    width?: number | null
    height?: number | null
    weight?: number | null
  } | null
  stocks?: ApiStock[]
  service_groups?: ApiServiceGroup[]
  questions?: ApiQuestion[]
  suggested?: Array<{ id: number, title: string, slug: string, img?: string | null }>
  unit?: string | null
  created_at?: string | null
}

interface ApiComment {
  id: number
  nickname?: string | null
  content: string
  score?: number | null
  status?: string | null
  created_at?: string | null
  user?: { nickname?: string | null } | null
}

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function uniqueColors(stocks: ApiStock[]): ProductDetailColor[] {
  const seen = new Set<string>()
  const colors: ProductDetailColor[] = []

  for (const stock of stocks) {
    const color = stock.color
    if (!color?.code || seen.has(color.code)) continue
    seen.add(color.code)
    colors.push({ name: color.title, value: color.code })
  }

  return colors
}

function uniqueWarranties(stocks: ApiStock[]): WarrantyOption[] {
  const seen = new Set<number>()
  const options: WarrantyOption[] = []

  for (const stock of stocks) {
    const warranty = stock.warranty
    if (!warranty || seen.has(warranty.id)) continue
    seen.add(warranty.id)
    options.push({ id: String(warranty.id), label: warranty.title })
  }

  return options
}

const SERVICE_ICONS: ServiceCategory['icon'][] = [
  'insurance',
  'invoice',
  'warranty',
  'charger',
  'accessory',
  'games',
  'apps',
  'sim',
]

function mapServiceCatalog(groups: ApiServiceGroup[]): ServiceCategory[] {
  return groups.map((group, index) => ({
    id: `service-group-${group.id}`,
    title: group.name,
    icon: SERVICE_ICONS[index % SERVICE_ICONS.length]!,
    items: (group.items ?? []).map<ServiceCatalogItem>(item => ({
      id: String(item.id),
      label: item.title,
      price: num(item.price),
    })),
  }))
}

function mapServicePackages(groups: ApiServiceGroup[]): ServicePackage[] {
  return groups.flatMap(group =>
    (group.items ?? []).map(item => ({
      id: `service-${item.id}`,
      provider: group.name,
      name: item.title,
      description: item.description ?? '',
      price: num(item.price),
    })),
  )
}

function mapComments(comments: ApiComment[]): { summary: CommentsSummary, items: ProductComment[] } {
  const distribution = [0, 0, 0, 0, 0]

  const items: ProductComment[] = comments.map(comment => {
    const score = Math.round(num(comment.score))
    if (score >= 1 && score <= 5) distribution[5 - score]! += 1

    return {
      id: String(comment.id),
      author: comment.nickname ?? comment.user?.nickname ?? 'کاربر هماکام',
      isBuyer: false,
      date: comment.created_at
        ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date(comment.created_at))
        : '',
      rating: score,
      text: comment.content,
      recommends: score >= 4,
      likes: 0,
      dislikes: 0,
    }
  })

  const total = items.length
  const average = total
    ? Math.round((items.reduce((sum, item) => sum + item.rating, 0) / total) * 10) / 10
    : 0

  return { summary: { average, total, distribution }, items }
}

function mapProduct(api: ApiProduct, comments: ApiComment[], apiBase: string): ProductDetail {
  const base = mockProductDetail
  const stocks = api.stocks ?? []
  const inStockStocks = stocks.filter(stock => num(stock.quantity) > 0)
  const defaultStock = stocks.find(stock => stock.is_default === 'yes' || stock.is_default === true)
    ?? inStockStocks[0]
    ?? stocks[0]

  const price = num(defaultStock?.customer_price)
  const realPrice = num(defaultStock?.real_price)
  const oldPrice = realPrice > price ? realPrice : undefined
  const totalQuantity = stocks.reduce((sum, stock) => sum + num(stock.quantity), 0)
  const colors = uniqueColors(stocks)
  const warrantyOptions = uniqueWarranties(stocks)

  const sellers: Seller[] = stocks.map(stock => ({
    id: `stock-${stock.id}`,
    stockId: stock.id,
    colorValue: stock.color?.code,
    warrantyId: stock.warranty ? String(stock.warranty.id) : undefined,
    name: stock.store?.title ?? 'هماکام',
    logo: resolveMediaUrl(stock.store?.img, apiBase) || '/homacom-logo.png',
    creditLabel: stock.warranty?.title ?? 'گارانتی',
    info: [
      { label: 'فروشگاه', value: stock.store?.title ?? 'هماکام' },
      { label: 'گارانتی', value: stock.warranty?.title ?? '—' },
      { label: 'موجودی', value: `${num(stock.quantity)} عدد` },
      { label: 'حداکثر خرید', value: `${num(stock.max_in_cart)} عدد` },
    ],
    price: num(stock.customer_price),
    oldPrice: num(stock.real_price) > num(stock.customer_price) ? num(stock.real_price) : undefined,
    discount: stock.discount ?? undefined,
    type: 'cash',
  }))

  const images: GalleryItem[] = (api.galleries ?? [])
    .filter(gallery => !!gallery.url)
    .map(gallery => ({ type: 'image', src: resolveMediaUrl(gallery.url, apiBase) }))

  if (!images.length && api.img)
    images.push({ type: 'image', src: resolveMediaUrl(api.img, apiBase) })
  if (!images.length)
    images.push(...base.images)

  const serviceGroups = (api.service_groups ?? []).filter(group => (group.items ?? []).length > 0)
  const serviceCatalog = serviceGroups.length ? mapServiceCatalog(serviceGroups) : base.serviceCatalog
  const servicePackages = serviceGroups.length ? mapServicePackages(serviceGroups) : base.servicePackages

  const specsRows: SpecTableRow[] = [
    { label: 'برند', value: api.brand?.title ?? '—' },
    { label: 'دسته‌بندی', value: api.categories?.map(category => category.title).join(' / ') || '—' },
    { label: 'کد محصول', value: api.product_code || '—' },
    { label: 'واحد', value: api.unit || '—' },
  ]

  if (api.size?.weight)
    specsRows.push({ label: 'وزن', value: `${api.size.weight} گرم` })
  if (api.size?.length || api.size?.width || api.size?.height) {
    specsRows.push({
      label: 'ابعاد',
      value: [api.size?.length, api.size?.width, api.size?.height].filter(Boolean).join(' × '),
    })
  }

  const features: { rows: FeatureRow[], moreCount: number } = {
    rows: [
      { icon: 'cpu', label: 'برند', value: api.brand?.title ?? '—' },
      {
        icon: 'dimensions',
        label: 'ابعاد',
        value: [api.size?.length, api.size?.width, api.size?.height].filter(Boolean).join(' × ') || '—',
      },
      { icon: 'memory', label: 'وزن', value: api.size?.weight ? `${api.size.weight} گرم` : '—' },
      { icon: 'display', label: 'دسته‌بندی', value: api.categories?.[0]?.title ?? '—' },
    ],
    moreCount: 0,
  }

  const specChips = [
    { label: 'برند', value: api.brand?.title ?? '—' },
    { label: 'دسته‌بندی', value: api.categories?.[0]?.title ?? '—' },
    { label: 'امتیاز', value: String(api.rate ?? '—') },
    { label: 'موجودی', value: `${totalQuantity} عدد` },
  ]

  const breadcrumb = ['هماکام', ...(api.categories ?? []).map(category => category.title), api.title]

  const commentsResult = comments.length ? mapComments(comments) : base.comments

  return {
    ...base,
    id: String(api.id),
    stockId: defaultStock?.id,
    title: api.title,
    englishTitle: api.title_en ?? base.englishTitle,
    breadcrumb,
    images,
    rating: num(api.rate),
    ratingCount: num(api.comments_count),
    commentsCount: num(api.comments_count),
    stockStatus: inStockStocks.length ? 'available' : 'out_of_stock',
    availabilityText: inStockStocks.length ? `${totalQuantity} عدد در انبار` : 'ناموجود',
    colors: colors.length ? colors : base.colors,
    warrantyOptions: warrantyOptions.length ? warrantyOptions : base.warrantyOptions,
    defaultWarrantyId: warrantyOptions[0]?.id ?? base.defaultWarrantyId,
    sellers: sellers.length ? sellers : base.sellers,
    seller: { label: 'فروشنده', name: sellers[0]?.name ?? base.seller.name },
    price,
    oldPrice,
    specChips,
    features,
    serviceCatalog,
    servicePackages,
    specsTable: specsRows,
    specGroups: [{ title: 'مشخصات کلی', rows: specsRows }],
    specsMoreCount: 0,
    comments: commentsResult,
    related: base.related,
    relatedTitle: base.relatedTitle,
  }
}

/**
 * Product detail by slug, with the designed mock product as a fallback so the
 * page keeps rendering when the API is cold/offline or the slug is a demo id.
 */
export function useProductDetail(slug: Ref<string>) {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { data: product, pending, error, refresh } = useAsyncData<ProductDetail | undefined>(
    () => `shop-product-${slug.value}`,
    async () => {
      try {
        const res = await api.get<ApiProduct>(`/shop/products/${encodeURIComponent(slug.value)}`)
        if (!res.data)
          return getProductDetail(slug.value)

        let comments: ApiComment[] = []
        try {
          const commentsRes = await api.get<ApiComment[]>(`/shop/products/${res.data.id}/comments`)
          comments = Array.isArray(commentsRes.data) ? commentsRes.data : []
        }
        catch {
          // Comments are optional — the detail page still renders without them.
        }

        return mapProduct(res.data, comments, apiBase)
      }
      catch {
        return getProductDetail(slug.value)
      }
    },
    {
      watch: [slug],
      default: () => undefined,
    },
  )

  const notFound = computed(() => !pending.value && !product.value)

  return { product, pending, error, refresh, notFound }
}
