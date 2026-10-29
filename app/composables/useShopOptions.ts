import { computed } from 'vue'
import type {
  DeliveryPeriod,
  InstallmentProvider,
  PaymentGateway,
  ShippingMethod,
} from '~/data/checkout'
import {
  fallbackDeliveryPeriods,
  installmentProviders as fallbackInstallments,
  paymentGateways as fallbackGateways,
  shippingMethods as fallbackShippingMethods,
} from '~/data/checkout'
import { resolveMediaUrl } from '~/utils/media'

/** `GET /api/shop/public/shipping-methods` row. */
interface ApiShippingMethod {
  id: number
  title: string
  img?: string | null
  cost_price?: string | number | null
  tax_percent?: number | string | null
  description?: string | null
  up_to_free?: string | number | null
  locates?: string | null
  type?: 'postal' | 'present' | 'delivery' | 'in-person' | null
}

/** `GET /api/shop/public/delivery-periods` row. */
interface ApiDeliveryPeriod {
  id: number
  day: string
  start_time: string
  end_time: string
}

/** `GET /api/shop/public/payment-methods` row (`PaymentMethodResource`). */
interface ApiPaymentMethod {
  id: number
  key: string
  title: string
  image?: string | null
  description?: string | null
  type?: PaymentOptionType | null
  type_fa?: string | null
}

export type PaymentOptionType = 'online' | 'wallet' | 'installment'

/**
 * A payment method as the payment step needs it.
 *
 * `id` is the backend id and the value the checkout endpoint expects as
 * `payment_method_id`; `key` is the gateway behind it (`mellat`, `azki`, …).
 */
export interface PaymentOption {
  id: string
  key: string
  title: string
  description: string
  logo: string
  type: PaymentOptionType
  typeFa: string
}

/** Designed marks for the seeded gateways (the API image wins when present). */
const GATEWAY_LOGOS: Record<string, string> = {
  sepah: '/icons/cart/gw-sepah.svg',
  mellat: '/icons/cart/gw-mellat.svg',
}

/** Same fallback for installment providers. */
const INSTALLMENT_LOGOS: Record<string, string> = {
  technopy: '/icons/cart/inst-technopy.svg',
  tapp: '/icons/cart/inst-snappay.svg',
  lendo: '/icons/cart/inst-lendo.svg',
  digipay: '/icons/cart/inst-digipay.svg',
}

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/** `10:00:00` → `10:00`. */
function clock(value: string | null | undefined): string {
  return (value ?? '').slice(0, 5)
}

function mapShippingMethod(row: ApiShippingMethod, apiBase: string): ShippingMethod {
  const base = num(row.cost_price)
  const tax = base * (num(row.tax_percent) / 100)

  return {
    id: String(row.id),
    name: row.title,
    price: Math.round(base + tax),
    provider: row.title,
    type: row.type ?? 'postal',
    logo: resolveMediaUrl(row.img, apiBase),
    description: row.description ?? '',
    freeAbove: num(row.up_to_free) || undefined,
  }
}

function mapDeliveryPeriod(row: ApiDeliveryPeriod): DeliveryPeriod {
  return {
    id: String(row.id),
    day: row.day,
    start: clock(row.start_time),
    end: clock(row.end_time),
  }
}

function mapPaymentOption(row: ApiPaymentMethod, apiBase: string): PaymentOption {
  const type: PaymentOptionType
    = row.type === 'wallet' || row.type === 'installment' ? row.type : 'online'
  const fallbackLogo = type === 'installment' ? INSTALLMENT_LOGOS[row.key] : GATEWAY_LOGOS[row.key]

  return {
    id: String(row.id),
    key: row.key,
    title: row.title,
    description: row.description ?? '',
    logo: resolveMediaUrl(row.image, apiBase) || fallbackLogo || '',
    type,
    typeFa: row.type_fa ?? '',
  }
}

interface ShopOptionsPayload {
  shipping: ApiShippingMethod[]
  periods: ApiDeliveryPeriod[]
  payments: ApiPaymentMethod[]
}

const EMPTY_OPTIONS: ShopOptionsPayload = { shipping: [], periods: [], payments: [] }

/**
 * Shipping methods, delivery slots and payment methods
 * (`GET /api/shop/public/…`), shared by the cart/checkout screens.
 *
 * The designed arrays in `~/data/checkout` stay as a fallback so the checkout
 * screen still renders when the API is unreachable.
 */
export function useShopOptions() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { data, pending, refresh } = useAsyncData<ShopOptionsPayload>(
    'shop-options',
    async () => {
      const [shipping, periods, payments] = await Promise.allSettled([
        api.get<ApiShippingMethod[]>('/shop/public/shipping-methods'),
        api.get<ApiDeliveryPeriod[]>('/shop/public/delivery-periods'),
        api.get<ApiPaymentMethod[]>('/shop/public/payment-methods'),
      ])

      return {
        shipping: shipping.status === 'fulfilled' ? shipping.value.data ?? [] : [],
        periods: periods.status === 'fulfilled' ? periods.value.data ?? [] : [],
        payments: payments.status === 'fulfilled' ? payments.value.data ?? [] : [],
      }
    },
    { default: () => EMPTY_OPTIONS },
  )

  const shippingMethods = computed<ShippingMethod[]>(() => {
    const rows = data.value?.shipping ?? []
    if (!rows.length) return fallbackShippingMethods
    return rows.map(row => mapShippingMethod(row, apiBase))
  })

  const deliveryPeriods = computed<DeliveryPeriod[]>(() => {
    const rows = data.value?.periods ?? []
    if (!rows.length) return fallbackDeliveryPeriods
    return rows.map(mapDeliveryPeriod)
  })

  const paymentOptions = computed<PaymentOption[]>(() => {
    const rows = data.value?.payments ?? []
    if (!rows.length) {
      return [
        ...fallbackGateways.map(gateway => ({
          id: gateway.id,
          key: gateway.id,
          title: gateway.title,
          description: gateway.subtitle,
          logo: gateway.logo,
          type: 'online' as const,
          typeFa: 'پرداخت آنلاین',
        })),
        ...fallbackInstallments.map(provider => ({
          id: provider.id,
          key: provider.id,
          title: provider.name,
          description: provider.terms,
          logo: provider.logo,
          type: 'installment' as const,
          typeFa: provider.badge,
        })),
      ]
    }
    return rows.map(row => mapPaymentOption(row, apiBase))
  })

  const gateways = computed<PaymentGateway[]>(() =>
    paymentOptions.value
      .filter(option => option.type === 'online')
      .map(option => ({
        id: option.id,
        title: option.title,
        subtitle: option.description || option.typeFa,
        logo: option.logo,
      })),
  )

  const installments = computed<InstallmentProvider[]>(() =>
    paymentOptions.value
      .filter(option => option.type === 'installment')
      .map(option => ({
        id: option.id,
        name: option.title,
        badge: 'اقساطی',
        monthly: '',
        terms: option.description || option.typeFa,
        logo: option.logo,
      })),
  )

  const walletOption = computed(
    () => paymentOptions.value.find(option => option.type === 'wallet') ?? null,
  )

  /** True once the first request settled (successful or not). */
  const loaded = computed(() => !pending.value)

  return {
    shippingMethods,
    deliveryPeriods,
    paymentOptions,
    gateways,
    installments,
    walletOption,
    loaded,
    refresh,
  }
}
