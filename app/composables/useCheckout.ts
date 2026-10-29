import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import type {
  CheckoutAddress,
  DeliveryDay,
  DeliveryPeriod,
  ShippingMethod,
} from '~/data/checkout'
import {
  creditProviders,
  getDeliveryDays,
  onlineTransactionLimit,
  walletBalance as fallbackWalletBalance,
} from '~/data/checkout'
import { apiErrorMessage } from '~/composables/useApi'
import { useUserAddresses } from '~/composables/useAddresses'
import { useShopOptions } from '~/composables/useShopOptions'
import { useUserProfile } from '~/composables/useUserProfile'

export type CheckoutStep = 'shipping' | 'payment'
export type PaymentMethod = 'online' | 'wallet' | 'installment'

/**
 * Checkout session state (step 1 shipping info → step 2 payment).
 *
 * Shipping methods, delivery slots and payment methods come from the public
 * `/shop/public/*` endpoints; the shipping selection is persisted on the cart
 * through `set-shipping` as soon as it is complete.
 */
export function useCheckout() {
  const cart = useCart()
  const {
    itemsTotal,
    discountTotal,
    insuranceTotal,
    servicesTotal,
    couponCode: promoCode,
    couponDiscount: promoDiscount,
    payableTotal,
    applyCoupon,
    clearCoupon,
    setShipping,
  } = cart

  const { shippingMethods, deliveryPeriods, gateways, installments, walletOption } = useShopOptions()
  const { profile } = useUserProfile()

  const step = ref<CheckoutStep>('shipping')

  // Step 1 — saved addresses live in state so the flow can add new ones.
  const addresses = useState<CheckoutAddress[]>('checkout-addresses', () => [])
  const addressId = ref(addresses.value.find(address => address.isDefault)?.id ?? addresses.value[0]?.id ?? '')
  const legalEntity = ref(false)

  /** Backend `shop_shipping.id`, as a string. */
  const shippingMethodId = ref('')
  /** `yyyy-mm-dd` receive date. */
  const deliveryDay = ref('')
  /** Backend `delivery_periods.id`, only for methods of type `delivery`. */
  const deliveryPeriodId = ref('')

  // Replace the designed addresses with the user's saved addresses once loaded.
  const { addresses: savedAddresses, load: loadSavedAddresses } = useUserAddresses()

  async function loadCheckoutAddresses() {
    try {
      await loadSavedAddresses()
      addresses.value = savedAddresses.value.map(address => ({
        id: address.id,
        city: address.title,
        address: address.address,
        postalCode: address.postalCode,
        recipient: address.nickname ?? '',
        phone: address.mobile ?? '',
        isDefault: address.isDefault,
      }))
      addressId.value = addresses.value.find(address => address.isDefault)?.id ?? addresses.value[0]?.id ?? ''
    }
    catch {
      // No session / offline: start with an empty address book.
      addresses.value = []
      addressId.value = ''
    }
  }

  // Step 2
  const paymentMethod = ref<PaymentMethod>('online')
  const gatewayId = ref('')
  const installmentId = ref('tapp')
  const creditProviderId = ref('')
  const discountCode = ref('')
  const discountOpen = ref(false)
  const submitting = ref(false)

  const address = computed(
    () => addresses.value.find(item => item.id === addressId.value) ?? null,
  )

  function addAddress(values: Omit<CheckoutAddress, 'id'>) {
    const created: CheckoutAddress = { ...values, id: `addr-${Date.now().toString(36)}` }
    addresses.value = [...addresses.value, created]
    addressId.value = created.id
    return created
  }

  const shipping = computed<ShippingMethod | null>(
    () => shippingMethods.value.find(method => method.id === shippingMethodId.value) ?? null,
  )

  /** Only a `delivery` method (courier) asks for a 30-minute slot. */
  const requiresPeriod = computed(() => shipping.value?.type === 'delivery')

  const shippingCost = computed(() => {
    const method = shipping.value
    if (!method) return 0
    // `up_to_free`: free shipping above that cart subtotal.
    if (method.freeAbove && itemsTotal.value >= method.freeAbove) return 0
    return method.price
  })

  /** Dates that actually have a slot (weekday-matched server slots). */
  const deliveryDays = computed<DeliveryDay[]>(() => getDeliveryDays(deliveryPeriods.value))

  const selectedDay = computed(
    () => deliveryDays.value.find(day => day.id === deliveryDay.value) ?? null,
  )

  /** Slots of the selected date's weekday. */
  const timeSlots = computed<DeliveryPeriod[]>(() => {
    const day = selectedDay.value
    if (!day) return []
    return deliveryPeriods.value.filter(period => !period.day || period.day === day.weekdayEn)
  })

  const selectedPeriod = computed(
    () => timeSlots.value.find(period => period.id === deliveryPeriodId.value) ?? null,
  )

  /** Display label («۱۰:۰۰ الی ۱۰:۳۰»). */
  const timeSlot = computed(() => (selectedPeriod.value
    ? `${selectedPeriod.value.start} الی ${selectedPeriod.value.end}`
    : ''))

  function selectShippingMethod(id: string) {
    if (shippingMethodId.value !== id) {
      // Reset the date/slot when switching providers.
      deliveryDay.value = ''
      deliveryPeriodId.value = ''
    }
    shippingMethodId.value = id
  }

  function selectDeliveryDay(id: string) {
    deliveryDay.value = id
    if (!timeSlots.value.some(period => period.id === deliveryPeriodId.value))
      deliveryPeriodId.value = ''
  }

  function selectDeliveryPeriod(id: string) {
    deliveryPeriodId.value = id
  }

  // Keep the gateway/installment ids valid once the public list arrives.
  watch(gateways, (rows) => {
    if (!rows.some(gateway => gateway.id === gatewayId.value))
      gatewayId.value = rows[0]?.id ?? ''
  }, { immediate: true })

  watch(installments, (rows) => {
    if (!rows.some(provider => provider.id === installmentId.value))
      installmentId.value = rows[0]?.id ?? ''
  }, { immediate: true })

  /** The `payment_method_id` sent to the checkout endpoint. */
  const paymentMethodId = computed(() => {
    if (paymentMethod.value === 'wallet') return walletOption.value?.id ?? ''
    if (paymentMethod.value === 'installment') return installmentId.value
    return gatewayId.value
  })

  const paymentMethodLabel = computed(() => {
    if (paymentMethod.value === 'wallet') return walletOption.value?.title ?? 'کیف پول'
    if (paymentMethod.value === 'installment')
      return installments.value.find(provider => provider.id === installmentId.value)?.name ?? 'پرداخت اقساطی'
    return gateways.value.find(gateway => gateway.id === gatewayId.value)?.title ?? 'پرداخت اینترنتی'
  })

  const rows = computed(() => [
    { key: 'items', label: 'مجموع قیمت کالاها', value: itemsTotal.value, icon: 'items' },
    { key: 'discount', label: 'تخفیف', value: discountTotal.value + promoDiscount.value, icon: 'discount' },
    { key: 'insurance', label: 'مبلغ بیمه‌ها', value: insuranceTotal.value, icon: 'insurance' },
    { key: 'services', label: 'خدمات', value: servicesTotal.value, icon: 'services' },
    { key: 'shipping', label: 'هزینه ارسال', value: shippingCost.value, icon: 'shipping' },
  ])

  const payable = computed(() => Math.max(0, payableTotal.value + shippingCost.value))

  async function applyPromoCode(code: string) {
    const normalized = code.trim()
    if (!normalized) return 0
    await applyCoupon(normalized)
    discountCode.value = normalized
    return promoDiscount.value
  }

  async function clearPromoCode() {
    await clearCoupon()
    discountCode.value = ''
  }

  const shippingReady = computed(
    () => !!shippingMethodId.value
      && !!deliveryDay.value
      && (!requiresPeriod.value || !!deliveryPeriodId.value),
  )

  const walletBalance = computed(() =>
    profile.value.mobile ? profile.value.credit : fallbackWalletBalance,
  )

  const walletInsufficient = computed(() => walletBalance.value < payable.value)
  const limitExceeded = computed(() => payable.value > onlineTransactionLimit)

  const selectedCredit = computed(
    () => creditProviders.find(provider => provider.id === creditProviderId.value) ?? null,
  )
  const creditInsufficient = computed(
    () => !selectedCredit.value || selectedCredit.value.balance < payable.value,
  )

  function toggleCreditProvider(id: string) {
    creditProviderId.value = creditProviderId.value === id ? '' : id
  }

  const authToken = useCookie<string | null>('auth_token')

  /**
   * Persist the shipping selection on the cart (`set-shipping`, auth only).
   *
   * Guests never reach this screen (the auth middleware sends them to login),
   * but the guard keeps a stale cookie from firing a 401 during hydration.
   */
  async function persistShipping() {
    if (!authToken.value || !shippingReady.value) return
    try {
      await setShipping({
        shippingId: shippingMethodId.value,
        receiveDate: deliveryDay.value,
        deliveryPeriodId: requiresPeriod.value ? deliveryPeriodId.value : null,
      })
    }
    catch (err) {
      toast.error(apiErrorMessage(err, 'ثبت روش ارسال انجام نشد.'))
    }
  }

  // Persist whenever the selection becomes complete (date → slot included).
  watch([shippingMethodId, deliveryDay, deliveryPeriodId], () => {
    void persistShipping()
  })

  function goToPayment() {
    if (!shippingReady.value) return false
    step.value = 'payment'
    if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
    return true
  }

  function backToShipping() {
    step.value = 'shipping'
    if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reset() {
    step.value = 'shipping'
    legalEntity.value = false
    shippingMethodId.value = ''
    deliveryDay.value = ''
    deliveryPeriodId.value = ''
    paymentMethod.value = 'online'
    gatewayId.value = gateways.value[0]?.id ?? ''
    installmentId.value = installments.value[0]?.id ?? ''
    creditProviderId.value = ''
    discountCode.value = ''
    discountOpen.value = false
    promoCode.value = ''
    promoDiscount.value = 0
  }

  return {
    step,
    addresses,
    addressId,
    address,
    addAddress,
    legalEntity,
    shippingMethods,
    shippingMethodId,
    shipping,
    shippingCost,
    requiresPeriod,
    deliveryDays,
    deliveryDay,
    selectedDay,
    deliveryPeriods,
    deliveryPeriodId,
    timeSlots,
    selectedPeriod,
    timeSlot,
    gateways,
    installments,
    walletOption,
    paymentMethod,
    paymentMethodId,
    paymentMethodLabel,
    gatewayId,
    installmentId,
    creditProviderId,
    selectedCredit,
    creditInsufficient,
    discountCode,
    discountOpen,
    submitting,
    promoCode,
    promoDiscount,
    applyPromoCode,
    clearPromoCode,
    rows,
    payable,
    shippingReady,
    walletInsufficient,
    limitExceeded,
    walletBalance,
    onlineTransactionLimit,
    selectShippingMethod,
    selectDeliveryDay,
    selectDeliveryPeriod,
    toggleCreditProvider,
    loadCheckoutAddresses,
    persistShipping,
    goToPayment,
    backToShipping,
    reset,
  }
}
