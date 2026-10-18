import { computed, ref } from 'vue'
import type { CheckoutAddress } from '~/data/checkout'
import {
  checkoutAddresses,
  creditProviders,
  deliveryTimeSlots,
  getDeliveryDays,
  onlineTransactionLimit,
  paymentGateways,
  shippingMethods,
  walletBalance,
} from '~/data/checkout'

export type CheckoutStep = 'shipping' | 'payment'
export type PaymentMethod = 'online' | 'wallet' | 'installment'

/**
 * Checkout session state (step 1 shipping info → step 2 payment).
 *
 * Kept in `useState` so the two steps and the cart summary share one source of
 * truth while the user is on `/checkout`.
 */
export function useCheckout() {
  const { itemsTotal, discountTotal, insuranceTotal, servicesTotal } = useCart()

  const step = ref<CheckoutStep>('shipping')

  // Step 1 — saved addresses live in state so the flow can add new ones.
  const addresses = useState<CheckoutAddress[]>('checkout-addresses', () =>
    checkoutAddresses.map(address => ({ ...address })),
  )
  const addressId = ref(addresses.value.find(address => address.isDefault)?.id ?? addresses.value[0]?.id ?? '')
  const legalEntity = ref(false)
  const shippingMethodId = ref('')
  const deliveryDay = ref('')
  const timeSlot = ref('')
  const deliveryDays = ref(getDeliveryDays())

  // Step 2
  const paymentMethod = ref<PaymentMethod>('online')
  const gatewayId = ref(paymentGateways[0]?.id ?? '')
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
    { key: 'discount', label: 'تخفیف', value: discountTotal.value, icon: 'discount' },
    { key: 'insurance', label: 'مبلغ بیمه‌ها', value: insuranceTotal.value, icon: 'insurance' },
    { key: 'services', label: 'خدمات', value: servicesTotal.value, icon: 'services' },
    { key: 'shipping', label: 'هزینه ارسال', value: shippingCost.value, icon: 'shipping' },
  ])

  const payable = computed(
    () => itemsTotal.value + insuranceTotal.value + servicesTotal.value + shippingCost.value,
  )

  const shippingReady = computed(
    () => !!shippingMethodId.value && !!deliveryDay.value && !!timeSlot.value,
  )

  const walletInsufficient = computed(() => walletBalance < payable.value)
  const limitExceeded = computed(() => payable.value > onlineTransactionLimit)

  const selectedCredit = computed(
    () => creditProviders.find(provider => provider.id === creditProviderId.value) ?? null,
  )
  const creditInsufficient = computed(
    () => !selectedCredit.value || selectedCredit.value.limit < payable.value,
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
    gatewayId.value = paymentGateways[0]?.id ?? ''
    creditProviderId.value = ''
    discountCode.value = ''
    discountOpen.value = false
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
    creditProviderId,
    selectedCredit,
    creditInsufficient,
    discountCode,
    discountOpen,
    rows,
    payable,
    shippingReady,
    walletInsufficient,
    limitExceeded,
    walletBalance,
    onlineTransactionLimit,
    selectShippingMethod,
    toggleCreditProvider,
    goToPayment,
    backToShipping,
    reset,
  }
}
