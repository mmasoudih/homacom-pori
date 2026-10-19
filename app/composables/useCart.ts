import { computed } from 'vue'
import { toast } from 'vue-sonner'
import type { CartItem, CartServiceGroup } from '~/data/cart'
import { cartInsuranceOptions, cartServiceGroups } from '~/data/cart'
import type { ProductDetail, Seller } from '~/data/product'
import { apiErrorMessage } from '~/composables/useApi'
import { getDiscountPercent } from '~/utils/product'
import { resolveMediaUrl } from '~/utils/media'
import { toastIcons } from '~/utils/toast'

export interface AddToCartOptions {
  product: ProductDetail
  /** Selected colour value (`ProductDetailColor.value`). */
  color?: string
  /** Selected warranty id (`WarrantyOption.id`). */
  warrantyId?: string
  /** Selected insurance id, or null when none is picked. */
  insuranceId?: string | null
  /** Selected service ids (`ServiceCatalogItem.id`). */
  serviceIds?: string[]
  quantity?: number
  /** When set, the line carries that seller's offer instead of the product price. */
  seller?: Seller | null
}

/** Stable cart-line id: product + colour + warranty (+ seller offer). */
export function cartLineId(options: {
  product: { id: string }
  color?: string
  warrantyId?: string
  sellerId?: string
}): string {
  return [options.product.id, options.color ?? '', options.warrantyId ?? '', options.sellerId ?? ''].join('__')
}

interface ApiCartService {
  id: number
  title?: string | null
  customer_price?: string | number | null
  real_price?: string | number | null
  line_total?: string | number | null
  service_item?: { id?: number, title?: string | null } | null
}

interface ApiCartItem {
  id: number
  title: string
  image?: string | null
  customer_price?: string | number | null
  real_price?: string | number | null
  quantity: number
  services?: ApiCartService[]
  stock?: {
    id: number
    customer_price?: string | number | null
    real_price?: string | number | null
    discount?: number | null
    max_in_cart?: number | null
    color?: { title?: string | null, code?: string | null } | null
    warranty?: { title?: string | null } | null
    store?: { title?: string | null } | null
  } | null
  color?: { title?: string | null, code?: string | null } | null
  warranty?: { title?: string | null } | null
}

interface ApiCart {
  id: number
  cart_token?: string | null
  items?: ApiCartItem[]
  coupon?: { code?: string | null, discount_price?: number | null } | null
}

const CART_STORAGE_KEY = 'homacom:cart:v1'

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function cloneGroups(groups: CartServiceGroup[]): CartServiceGroup[] {
  return groups.map(group => ({ ...group, items: group.items.map(item => ({ ...item })) }))
}

function mapCartItem(item: ApiCartItem, apiBase: string): CartItem {
  const stock = item.stock
  const color = stock?.color ?? item.color
  const warranty = stock?.warranty ?? item.warranty
  const price = num(item.customer_price ?? stock?.customer_price)
  const realPrice = num(item.real_price ?? stock?.real_price)

  return {
    id: String(item.id),
    apiId: item.id,
    stockId: stock?.id,
    title: item.title,
    href: '#',
    image: resolveMediaUrl(item.image, apiBase),
    color: { name: color?.title ?? '', value: color?.code ?? '' },
    warranty: warranty?.title ?? '',
    price,
    oldPrice: realPrice > price ? realPrice : undefined,
    discount: stock?.discount ?? undefined,
    quantity: num(item.quantity),
    maxQuantity: stock?.max_in_cart ?? undefined,
    sellerName: stock?.store?.title ?? undefined,
    insurance: null,
    insuranceOptions: cartInsuranceOptions.map(option => ({ ...option })),
    serviceGroups: cloneGroups(cartServiceGroups),
    services: (item.services ?? []).map(service => ({
      id: String(service.id),
      label: service.title ?? service.service_item?.title ?? 'خدمت',
      price: num(service.customer_price ?? service.real_price),
    })),
  }
}

export function useCart() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')
  const cartToken = useCookie<string | null>('cart_token')

  const items = useState<CartItem[]>('cart-items', () => [])
  const couponCode = useState<string>('cart-coupon-code', () => '')
  const couponDiscount = useState<number>('cart-coupon-discount', () => 0)
  const loading = useState<boolean>('cart-loading', () => false)

  function ensureCartToken(): string {
    if (!cartToken.value) {
      const generated = globalThis.crypto?.randomUUID?.()
        ?? `cart-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
      cartToken.value = generated
      api.setCartToken(generated)
    }
    return cartToken.value
  }

  function applyCart(cart: ApiCart | undefined | null) {
    if (!cart) return
    items.value = (cart.items ?? []).map(item => mapCartItem(item, apiBase))
    couponCode.value = cart.coupon?.code ?? ''
    couponDiscount.value = num(cart.coupon?.discount_price)
    if (cart.cart_token) cartToken.value = cart.cart_token
  }

  async function reload() {
    ensureCartToken()
    loading.value = true
    try {
      const res = await api.get<ApiCart>('/shop/cart')
      applyCart(res.data)
    }
    finally {
      loading.value = false
    }
  }

  const authToken = useCookie<string | null>('auth_token')

  // SSR + client hydration share one keyed fetch. Guests without a cart token
  // (and anonymous visitors) skip the request entirely.
  const { data: initialCart } = useAsyncData<ApiCart | null>(
    'shop-cart',
    async () => {
      if (!cartToken.value && !authToken.value) return null
      try {
        const res = await api.get<ApiCart>('/shop/cart')
        return res.data ?? null
      }
      catch {
        return null
      }
    },
    { default: () => null },
  )

  watch(initialCart, (cart) => {
    if (cart) applyCart(cart)
  }, { immediate: true })

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
    }
    catch {
      // Storage full/blocked — the in-memory cart still works.
    }
  }

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const isEmpty = computed(() => items.value.length === 0)

  const itemsTotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  const discountTotal = computed(() =>
    items.value.reduce((sum, item) => {
      const original = item.oldPrice ?? 0
      if (original <= item.price) return sum
      return sum + (original - item.price) * item.quantity
    }, 0),
  )

  const insuranceTotal = computed(() =>
    items.value.reduce(
      (sum, item) => sum + (item.insurance?.price ?? 0) * item.quantity,
      0,
    ),
  )

  const servicesTotal = computed(() =>
    items.value.reduce(
      (sum, item) =>
        sum + item.services.reduce((line, service) => line + service.price, 0) * item.quantity,
      0,
    ),
  )

  /** Items + insurance + services, minus the applied coupon. */
  const payableTotal = computed(
    () => Math.max(0, itemsTotal.value + insuranceTotal.value + servicesTotal.value - couponDiscount.value),
  )

  const summary = computed(() => [
    { key: 'items', label: 'مجموع قیمت کالاها', value: itemsTotal.value },
    { key: 'discount', label: 'تخفیف', value: discountTotal.value + couponDiscount.value },
    { key: 'insurance', label: 'مبلغ بیمه‌ها', value: insuranceTotal.value },
    { key: 'services', label: 'خدمات', value: servicesTotal.value },
  ])

  function find(id: string) {
    return items.value.find(item => item.id === id)
  }

  /** Quantity of the line for a given product/colour/warranty/seller selection. */
  function quantityFor(options: Omit<AddToCartOptions, 'insuranceId' | 'serviceIds' | 'quantity'>) {
    return find(
      cartLineId({
        product: options.product,
        color: options.color,
        warrantyId: options.warrantyId,
        sellerId: options.seller?.id,
      }),
    )?.quantity ?? 0
  }

  function addLocal(options: AddToCartOptions, quantity: number): string {
    const { product, seller = null } = options

    const color = product.colors.find(c => c.value === options.color) ?? product.colors[0]
    const warranty
      = product.warrantyOptions.find(w => w.id === options.warrantyId) ?? product.warrantyOptions[0]
    const insuranceOptions = product.insuranceOptions.map(policy => ({
      id: policy.id,
      name: policy.name,
      price: policy.price,
      oldPrice: policy.oldPrice,
      discount: policy.discount,
    }))
    const insurance = insuranceOptions.find(i => i.id === options.insuranceId) ?? null

    const selectedIds = options.serviceIds ?? []
    const serviceGroups = product.serviceCatalog.map(category => ({
      id: category.id,
      title: category.title,
      icon: category.icon,
      items: category.items.map(service => ({ ...service })),
    }))
    const services = serviceGroups
      .flatMap(category => category.items)
      .filter(service => selectedIds.includes(service.id))

    const price = seller?.price ?? product.price
    const oldPrice = seller?.oldPrice ?? product.oldPrice
    const discount = seller?.discount ?? getDiscountPercent(price, oldPrice ?? 0) ?? undefined

    const id = cartLineId({
      product,
      color: color?.value,
      warrantyId: warranty?.id,
      sellerId: seller?.id,
    })

    const existing = find(id)
    if (existing) {
      existing.quantity += quantity
      existing.price = price
      existing.oldPrice = oldPrice
      existing.discount = discount
      existing.sellerName = seller?.name
      existing.insuranceOptions = insuranceOptions
      existing.insurance = insurance ? { ...insurance } : null
      existing.serviceGroups = serviceGroups
      existing.services = services.map(service => ({ ...service }))
    }
    else {
      items.value = [
        {
          id,
          title: product.title,
          href: `/product/${product.id}`,
          image: product.images.find(image => image.src)?.src ?? '',
          color: { name: color?.name ?? '', value: color?.value ?? '' },
          warranty: warranty?.label ?? '',
          price,
          oldPrice,
          discount,
          quantity,
          sellerName: seller?.name,
          insurance: insurance ? { ...insurance } : null,
          insuranceOptions,
          serviceGroups,
          services: services.map(service => ({ ...service })),
        },
        ...items.value,
      ]
    }

    persist()
    return id
  }

  /**
   * Adds a product-detail selection to the server cart (or the local demo cart
   * for mock products that have no backend stock id).
   */
  async function addProduct(options: AddToCartOptions): Promise<string> {
    const quantity = Math.max(1, options.quantity ?? 1)
    const stockId = options.seller?.stockId ?? options.product.stockId

    if (!stockId) {
      const id = addLocal(options, quantity)
      toast.success('این کالا به سبد خرید شما اضافه شد.', { icon: toastIcons.bag })
      return id
    }

    const services = (options.serviceIds ?? [])
      .map((id) => {
        const serviceId = Number(id)
        return Number.isFinite(serviceId) ? { service_item_id: serviceId, quantity: 1 } : null
      })
      .filter((service): service is { service_item_id: number, quantity: number } => !!service)

    try {
      const res = await api.post<ApiCart>('/shop/cart/add-to-cart', {
        stock_id: stockId,
        quantity,
        services,
        cart_token: ensureCartToken(),
      })
      applyCart(res.data)

      // Keep the product-detail selection key so its quantity stepper can find
      // the line without a page reload.
      const color = options.product.colors.find(c => c.value === options.color) ?? options.product.colors[0]
      const warranty = options.product.warrantyOptions.find(w => w.id === options.warrantyId)
        ?? options.product.warrantyOptions[0]
      const localId = cartLineId({
        product: options.product,
        color: color?.value,
        warrantyId: warranty?.id,
        sellerId: options.seller?.id,
      })
      const added = items.value.filter(item => item.stockId === stockId).at(-1)
      if (added) added.id = localId

      toast.success('این کالا به سبد خرید شما اضافه شد.', { icon: toastIcons.bag })
      return localId
    }
    catch (err) {
      toast.error(apiErrorMessage(err, 'افزودن کالا به سبد خرید انجام نشد.'))
      return ''
    }
  }

  async function increment(id: string) {
    const item = find(id)
    if (!item) return

    const max = item.maxQuantity
    if (max != null && item.quantity >= max) {
      toast.error(`حداکثر ${max} عدد از این کالا قابل سفارش است.`)
      return
    }

    if (item.apiId) {
      try {
        const res = await api.post<ApiCart>('/shop/cart/add-qty', {
          cart_item_id: item.apiId,
          quantity: 1,
          cart_token: ensureCartToken(),
        })
        applyCart(res.data)
      }
      catch (err) {
        toast.error(apiErrorMessage(err, 'افزایش تعداد انجام نشد.'))
      }
      return
    }

    item.quantity += 1
    persist()
  }

  async function decrement(id: string) {
    const item = find(id)
    if (!item || item.quantity <= 1) return

    if (item.apiId) {
      try {
        const res = await api.post<ApiCart>('/shop/cart/sub-qty', {
          cart_item_id: item.apiId,
          quantity: 1,
          cart_token: ensureCartToken(),
        })
        applyCart(res.data)
      }
      catch (err) {
        toast.error(apiErrorMessage(err, 'کاهش تعداد انجام نشد.'))
      }
      return
    }

    item.quantity -= 1
    persist()
  }

  async function removeItem(id: string) {
    const item = find(id)
    if (!item) return

    if (item.apiId) {
      try {
        const res = await api.request<ApiCart>('/shop/cart/item', {
          method: 'DELETE',
          body: { cart_item_id: item.apiId, cart_token: ensureCartToken() },
        })
        applyCart(res.data)
        toast.success('کالا از سبد خرید حذف شد.')
      }
      catch (err) {
        toast.error(apiErrorMessage(err, 'حذف کالا از سبد خرید انجام نشد.'))
      }
      return
    }

    items.value = items.value.filter(item => item.id !== id)
    persist()
    toast.success('کالا از سبد خرید حذف شد.')
  }

  /** Empty the cart on the server and locally. */
  async function clear() {
    if (items.value.length) {
      try {
        const res = await api.request<ApiCart>('/shop/cart/item', {
          method: 'DELETE',
          body: { cart_token: ensureCartToken() },
        })
        applyCart(res.data)
      }
      catch {
        // Local clear below still empties the visible cart.
      }
    }

    items.value = []
    couponCode.value = ''
    couponDiscount.value = 0
    persist()
  }

  async function removeAll() {
    if (isEmpty.value) return
    await clear()
    toast.success('همه کالاها از سبد خرید حذف شدند.')
  }

  /** Apply or clear a coupon on the cart. */
  async function applyCoupon(code: string) {
    const res = await api.post<ApiCart>('/shop/cart/set-discount', {
      coupon_code: code.trim() || null,
      cart_token: ensureCartToken(),
    })
    applyCart(res.data)
  }

  async function clearCoupon() {
    await applyCoupon('')
  }

  /** Choose the delivery address for the cart. */
  async function setAddress(addressId: string) {
    const res = await api.post<ApiCart>('/shop/cart/set-user-address', {
      user_address_id: Number(addressId),
      cart_token: ensureCartToken(),
    })
    applyCart(res.data)
  }

  /** Choose the payment method for the cart. */
  async function setPaymentMethod(method: 'online' | 'pay_in_delivery' | 'pay_in_person' | 'mixed' | 'manual') {
    const res = await api.post<ApiCart>('/shop/cart/set/payment-method', {
      payment_method: method,
      cart_token: ensureCartToken(),
    })
    applyCart(res.data)
  }

  function setInsurance(itemId: string, insuranceId: string | null) {
    const item = find(itemId)
    if (!item) return
    const option
      = item.insuranceOptions?.find(policy => policy.id === insuranceId)
        ?? cartInsuranceOptions.find(policy => policy.id === insuranceId)
        ?? null
    item.insurance = option ? { ...option } : null
    persist()
  }

  function setServices(itemId: string, serviceIds: string[]) {
    const item = find(itemId)
    if (!item) return
    const catalog = item.serviceGroups ?? cartServiceGroups
    item.services = catalog
      .flatMap(group => group.items)
      .filter(service => serviceIds.includes(service.id))
      .map(service => ({ ...service }))
    persist()
  }

  function removeInsurance(id: string) {
    const item = find(id)
    if (!item) return
    item.insurance = null
    persist()
  }

  function removeService(itemId: string, serviceId: string) {
    const item = find(itemId)
    if (!item) return
    item.services = item.services.filter(service => service.id !== serviceId)
    persist()
  }

  return {
    items,
    count,
    isEmpty,
    loading,
    itemsTotal,
    discountTotal,
    insuranceTotal,
    servicesTotal,
    payableTotal,
    summary,
    couponCode,
    couponDiscount,
    find,
    quantityFor,
    reload,
    addProduct,
    increment,
    decrement,
    removeItem,
    removeAll,
    clear,
    applyCoupon,
    clearCoupon,
    setAddress,
    setPaymentMethod,
    setInsurance,
    setServices,
    removeInsurance,
    removeService,
  }
}
