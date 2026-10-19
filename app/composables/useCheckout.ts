import { computed, ref } from 'vue'
import type { CheckoutAddress } from '~/data/checkout'
import {
  creditProviders,
  deliveryTimeSlots,
  getDeliveryDays,
  onlineTransactionLimit,
  shippingMethods,
  walletBalance,
} from '~/data/checkout'
import { useUserAddresses } from '~/composables/useAddresses'

export type CheckoutStep = 'shipping' | 'payment'
export type PaymentMethod = 'online' | 'wallet' | 'installment'

/**
 * Checkout session state (step 1 shipping info → step 2 payment).
 *
 * Kept in `useState` so the two steps and the cart summary share one source of
 * truth while the user is on `/checkout`.
 */
export function useCheckout() {
  const {
  itemsTotal,
  discountTotal,
  insuranceTotal,
  servicesTotal,
  couponCode: promoCode,
  couponDiscount: promoDiscount,
  applyCoupon,
  clearCoupon,
} = useCart()

  const step = ref<CheckoutStep>('shipping')

  // Step 1 — saved addresses live in state so the flow can add new ones.
  const addresses = useState<CheckoutAddress[]>('checkout-addresses', () => [])
  const addressId = ref(addresses.value.find(address => address.isDefault)?.id ?? addresses.value[0]?.id ?? '')
  const legalEntity = ref(false)
  const shippingMethodId = ref('')
  const deliveryDay = ref('')
  const timeSlot = ref('')
  const deliveryDays = ref(getDeliveryDays())

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
  const gatewayId = ref('mellat')
  const installmentId = ref('tapp')
  const creditProviderId = ref('')
  const discountCode = ref('')
  const discountOpen = ref(false)

  const address = computed(
    () => addresses.value.find(item => item.id === addressId.value) ?? null,
  )

  function addAddress(values: Omit<CheckoutAddress, 'id'>) {
    const created: CheckoutAddress = { ...values, id: `addr-${Date.now().toString(36)}` }
    addresses.value = [...addresses.value, created]
    addressId.value = created.id
    return created
  }
  const shipping = computed(
    () => shippingMethods.find(method => method.id === shippingMethodId.value) ?? null,
  )
  const shippingCost = computed(() => shipping.value?.price ?? 0)

  const rows = computed(() => [
    { key: 'items', label: 'مجموع قیمت کالاها', value: itemsTotal.value, icon: 'items' },
    { key: 'discount', label: 'تخفیف', value: discountTotal.value + promoDiscount.value, icon: 'discount' },
    { key: 'insurance', label: 'مبلغ بیمه‌ها', value: insuranceTotal.value, icon: 'insurance' },
    { key: 'services', label: 'خدمات', value: servicesTotal.value, icon: 'services' },
    { key: 'shipping', label: 'هزینه ارسال', value: shippingCost.value, icon: 'shipping' },
  ])

  const payable = computed(() => Math.max(
    0,
    itemsTotal.value + insuranceTotal.value + servicesTotal.value + shippingCost.value - promoDiscount.value,
  ))

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
    () => !!shippingMethodId.value && !!deliveryDay.value && !!timeSlot.value,
  )

  const walletInsufficient = computed(() => walletBalance < payable.value)
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

  function selectShippingMethod(id: string) {
    if (shippingMethodId.value !== id) {
      // Reset the slot values when switching providers.
      deliveryDay.value = ''
      timeSlot.value = ''
    }
    shippingMethodId.value = id
  }

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
    timeSlot.value = ''
    paymentMethod.value = 'online'
    gatewayId.value = 'mellat'
    installmentId.value = 'tapp'
    creditProviderId.value = ''
    discountCode.value = ''
    discountOpen.value = false
    promoCode.value = ''
    promoDiscount.value = 0
    deliveryDays.value = getDeliveryDays()
  }

  return {
    step,
    addresses,
    addressId,
    address,
    addAddress,
    legalEntity,
    shippingMethodId,
    shipping,
    shippingCost,
    deliveryDays,
    deliveryDay,
    timeSlot,
    timeSlots: deliveryTimeSlots,
    paymentMethod,
    gatewayId,
    installmentId,
    creditProviderId,
    selectedCredit,
    creditInsufficient,
    discountCode,
    discountOpen,
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
    toggleCreditProvider,
    loadCheckoutAddresses,
    goToPayment,
    backToShipping,
    reset,
  }
}
