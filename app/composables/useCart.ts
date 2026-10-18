import { computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import type { CartItem } from '~/data/cart'
import { cartInsuranceOptions, cartItems, cartServiceGroups } from '~/data/cart'
import type { ProductDetail, Seller } from '~/data/product'
import { getDiscountPercent } from '~/utils/product'

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

/**
 * Shared, in-session cart (mock — no persistence).
 *
 * Backed by `useState` so the header badge, the cart page and any «add to
 * cart» action read/write the same list across navigation within a session.
 */
const CART_STORAGE_KEY = 'homacom:cart:v1'

/** Client-side singleton: only the first `useCart()` hydrates from storage. */
let storageReady = false

function cloneItems(source: CartItem[]): CartItem[] {
  return source.map(item => ({
    ...item,
    insurance: item.insurance ? { ...item.insurance } : null,
    // Lines saved before the dialog existed (or from another product) still
    // need a policy list to choose from.
    insuranceOptions: item.insuranceOptions?.length
      ? item.insuranceOptions.map(option => ({ ...option }))
      : cartInsuranceOptions.map(option => ({ ...option })),
    serviceGroups: item.serviceGroups?.length
      ? item.serviceGroups.map(group => ({ ...group, items: group.items.map(service => ({ ...service })) }))
      : cartServiceGroups.map(group => ({ ...group, items: group.items.map(service => ({ ...service })) })),
    services: (item.services ?? []).map(service => ({ ...service })),
  }))
}

function readStoredCart(): CartItem[] | null {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return cloneItems(parsed as CartItem[])
  }
  catch {
    return null
  }
}

export function useCart() {
  const items = useState<CartItem[]>('cart-items', () => cloneItems(cartItems))

  // Restore the browser cart after mount (keeps SSR markup stable), then keep
  // it in storage on every mutation.
  if (import.meta.client && !storageReady) {
    storageReady = true
    onMounted(() => {
      const stored = readStoredCart()
      if (stored) items.value = stored
    })
  }

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

  /** Price of the items as they sit in the cart (already discounted). */
  const itemsTotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  /** Savings against the struck-through prices. */
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

  /** Items + insurance + services; the discount is already in `price`. */
  const payableTotal = computed(
    () => itemsTotal.value + insuranceTotal.value + servicesTotal.value,
  )

  const summary = computed(() => [
    { key: 'items', label: 'مجموع قیمت کالاها', value: itemsTotal.value },
    { key: 'discount', label: 'تخفیف', value: discountTotal.value },
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

  /**
   * Adds a product-detail selection to the cart (merging with an existing line
   * for the same colour/warranty/seller) and keeps its insurance/services in sync.
   */
  function addProduct(options: AddToCartOptions) {
    const { product, seller = null } = options
    const quantity = Math.max(1, options.quantity ?? 1)

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
    const insurance
      = insuranceOptions.find(i => i.id === options.insuranceId) ?? null

    const selectedIds = options.serviceIds ?? []
    const serviceGroups = product.serviceCatalog.map(category => ({
      id: category.id,
      title: category.title,
      icon: category.icon,
      items: category.items.map(service => ({
        id: service.id,
        label: service.label,
        price: service.price,
      })),
    }))
    const services = serviceGroups
      .flatMap(category => category.items)
      .filter(service => selectedIds.includes(service.id))

    const price = seller?.price ?? product.price
    const oldPrice = seller?.oldPrice ?? product.oldPrice
    const discount
      = seller?.discount ?? getDiscountPercent(price, oldPrice ?? 0) ?? undefined

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
      existing.services = services.map(service => ({
        id: service.id,
        label: service.label,
        price: service.price,
      }))
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
          services: services.map(service => ({
            id: service.id,
            label: service.label,
            price: service.price,
          })),
        },
        ...items.value,
      ]
    }

    persist()
    toast.success('کالا به سبد خرید اضافه شد.')
    return id
  }

  function increment(id: string) {
    const item = find(id)
    if (!item) return
    const max = item.maxQuantity
    if (max != null && item.quantity >= max) {
      toast.error(`حداکثر ${max} عدد از این کالا قابل سفارش است.`)
      return
    }
    item.quantity += 1
    persist()
  }

  function decrement(id: string) {
    const item = find(id)
    if (!item || item.quantity <= 1) return
    item.quantity -= 1
    persist()
  }

  function removeItem(id: string) {
    items.value = items.value.filter(item => item.id !== id)
    persist()
    toast.success('کالا از سبد خرید حذف شد.')
  }

  function removeAll() {
    if (isEmpty.value) return
    items.value = []
    persist()
    toast.success('همه کالاها از سبد خرید حذف شدند.')
  }

  /** Pick (or clear) the policy for a line from the insurance dialog. */
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

  /** Replace the add-on services of a line from the services dialog. */
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
    itemsTotal,
    discountTotal,
    insuranceTotal,
    servicesTotal,
    payableTotal,
    summary,
    find,
    quantityFor,
    addProduct,
    increment,
    decrement,
    removeItem,
    removeAll,
    setInsurance,
    setServices,
    removeInsurance,
    removeService,
  }
}
