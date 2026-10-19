<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { CheckoutAddress } from '~/data/checkout'
import {
  creditProviders,
  discountCodePlaceholder,
  installmentProviders,
  paymentGateways,
  shippingMethods,
} from '~/data/checkout'
import { formatPriceFa } from '~/utils/format'
import { apiErrorMessage } from '~/composables/useApi'
import { normalizeSearchText } from '~/utils/search'
import { sanitizeMobileInput } from '~/utils/auth'

const {
  isEmpty,
  clear: clearCart,
  setAddress: persistAddress,
  setPaymentMethod: persistPaymentMethod,
} = useCart()

const { setResult } = useCheckoutResult()

const {
  step,
  addresses,
  addressId,
  address,
  addAddress,
  legalEntity,
  shippingMethodId,
  shipping,
  deliveryDays,
  deliveryDay,
  timeSlot,
  timeSlots,
  paymentMethod,
  gatewayId,
  installmentId,
  creditProviderId,
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
  walletBalance,
  limitExceeded,
  selectShippingMethod,
  toggleCreditProvider,
  goToPayment,
  backToShipping,
  reset,
} = useCheckout()

const discountTotal = computed(() => rows.value.find(row => row.key === 'discount')?.value ?? 0)

const selectedDay = computed(
  () => deliveryDays.value.find(day => day.id === deliveryDay.value) ?? null,
)

const shippingSummary = computed(() => {
  if (!shipping.value || !selectedDay.value || !timeSlot.value) return ''
  return `${shipping.value.name} · ${selectedDay.value.weekday} ${selectedDay.value.day} ${selectedDay.value.month} · ساعت ${timeSlot.value}`
})

const isShippingStep = computed(() => step.value === 'shipping')

const stepTitle = computed(() => (isShippingStep.value ? 'اطلاعات آدرس' : 'اطلاعات پرداخت'))
const backLabel = computed(() =>
  isShippingStep.value ? 'بازگشت به سبد خرید' : 'بازگشت به اطلاعات ارسال',
)

const blockedLabel = computed(() => {
  if (!isShippingStep.value) return ''
  if (!address.value) return 'آدرس تحویل را انتخاب کنید'
  if (!shippingReady.value) return 'روش ارسال و زمان ارسال را انتخاب کنید'
  return ''
})

const ctaLabel = computed(() => (isShippingStep.value ? 'ثبت سفارش' : 'پرداخت'))

const addressOpen = ref(false)
const addAddressOpen = ref(false)
const shippingOpen = ref(false)
const creditOpen = ref(false)

const route = useRoute()
const api = useApi()
const { states, refresh: refreshStates } = useStates()
const { create: createAddress } = useUserAddresses()
const { profile, load: loadProfile } = useUserProfile()

onMounted(loadProfile)

// Keep the server cart in sync with the current checkout selection. The final
// submit endpoint is still missing, but the cart already stores these choices.
watch(addressId, (id) => {
  if (!id || !/^\d+$/.test(id)) return
  persistAddress(id).catch(() => {})
})

watch(paymentMethod, (method) => {
  const apiMethod = method === 'online' || method === 'wallet' ? 'online' : 'mixed'
  persistPaymentMethod(apiMethod).catch(() => {})
})

onMounted(() => {
  if (isEmpty.value) navigateTo('/cart')
  // `?empty-address=1` previews the «no saved address» state.
  if (route.query['empty-address'] === '1') {
    addresses.value = []
    addressId.value = ''
  }
})

useHead({ title: 'تکمیل خرید | هماکام' })

function next() {
  if (isShippingStep.value) {
    if (!address.value) {
      if (addresses.value.length) addressOpen.value = true
      else addAddressOpen.value = true
      return
    }
    if (!shippingReady.value) {
      // Desktop shows the inline picker; mobile opens the shipping sheet.
      shippingOpen.value = true
      return
    }
    goToPayment()
    return
  }

  if (paymentMethod.value === 'wallet' && walletInsufficient.value) {
    toast.error('موجودی کیف‌پول برای این سفارش کافی نیست.')
    return
  }

  if (paymentMethod.value === 'installment') {
    if (!installmentId.value) {
      creditOpen.value = true
      return
    }
    settlePayment()
    return
  }

  settlePayment()
}

/** Mock gateway: store the receipt, empty the cart and show the result page. */
function settlePayment() {
  setResult(createCheckoutResult(payable.value))
  clearCart()
  reset()
  navigateTo('/checkout/success', { replace: true })
}

async function onAddressCreated(values: Omit<CheckoutAddress, 'id'>) {
  const province = values.province?.trim() ?? ''
  const cityName = values.cityName?.trim() ?? ''

  if (!states.value.length) {
    try {
      await refreshStates()
    }
    catch {
      // Fall through to the "state not found" error below.
    }
  }

  const state = states.value.find(item =>
    normalizeSearchText(item.name) === normalizeSearchText(province),
  )
  if (!state) {
    toast.error('استان انتخاب‌شده در سامانه یافت نشد.')
    return
  }

  try {
    const cities = await api.get<Array<{ id: number, name: string }>>('/address/cities', {
      query: { 'filters[parent_id]': state.id },
    })
    const city = (cities.data ?? []).find(item =>
      normalizeSearchText(item.name) === normalizeSearchText(cityName),
    )
    if (!city) {
      toast.error('شهر انتخاب‌شده در سامانه یافت نشد.')
      return
    }

    if (!profile.value.nationalId) {
      toast.error('برای ثبت آدرس، ابتدا کد ملی را در اطلاعات حساب کاربری ثبت کنید.')
      return
    }

    const mobile = sanitizeMobileInput(values.phone)
    if (mobile.length !== 11) {
      toast.error('شماره موبایل تحویل‌گیرنده معتبر نیست.')
      return
    }

    await createAddress({
      title: values.city || 'آدرس جدید',
      state: state.id,
      city: city.id,
      address: values.street || values.address,
      lat: values.lat ?? 35.6892,
      lng: values.lng ?? 51.389,
      mobile,
      nickname: values.recipient || '',
      code_melli: profile.value.nationalId,
      zip_code: values.postalCode || null,
      plaque: values.plaque ?? null,
      unit: values.unit ?? null,
    })

    addAddress(values)
    toast.success('آدرس جدید ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت آدرس انجام نشد.'))
  }
}

async function applyDiscount() {
  if (!discountCode.value.trim()) {
    toast.error('کد تخفیف را وارد کنید.')
    return
  }

  try {
    await applyPromoCode(discountCode.value)
    toast.success('کد تخفیف اعمال شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'کد تخفیف اعمال نشد.'))
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-50">
    <CheckoutHeader
      :back-label="backLabel"
      :title="stepTitle"
      :back-to="isShippingStep ? '/cart' : undefined"
      @back="backToShipping"
    />

    <main
      class="mx-auto w-full max-w-[1440px] flex-1 px-4 pt-4 lg:px-[45px] lg:pb-16 lg:pt-6"
      :class="isShippingStep ? 'pb-[132px]' : 'pb-[200px]'"
    >
      <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_324px] lg:gap-[38px]">
        <!-- ============================ Content ============================ -->
        <div class="flex min-w-0 flex-col gap-4 lg:gap-6">
          <!-- ====================== Step 1 — shipping ====================== -->
          <template v-if="isShippingStep">
            <!-- Address (mobile: address-checkout-box-mobile, no outer card) -->
            <section class="flex flex-col gap-[17px] lg:gap-6 lg:rounded-[12px] lg:border lg:border-T-400 lg:p-5">
              <UiTypography as="h2" size="lg" weight="bold" class="lg:text-[18px]">
                انتخاب آدرس
              </UiTypography>

              <div
                v-if="address"
                class="flex flex-col gap-[14px] rounded-[12px] border border-T-400 p-[15px] lg:flex-row lg:items-start lg:gap-4 lg:p-4"
              >
                <div class="flex min-w-0 flex-1 flex-col gap-2 lg:gap-1.5 lg:min-h-0 max-lg:min-h-[72px]">
                  <UiTypography as="span" size="lg" weight="medium" class="leading-[17px]">{{ address.city }}</UiTypography>

                  <div class="flex items-center gap-2.5">
                    <img src="/icons/cart/addr-map.svg" alt="" class="size-[18px] shrink-0">
                    <UiTypography as="span" size="md" color="muted" class="min-w-0 flex-1 leading-[18px]">
                      آدرس: {{ address.address }}
                    </UiTypography>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <img src="/icons/cart/addr-post.svg" alt="" class="size-[18px] shrink-0">
                    <UiTypography as="span" size="md" color="muted" class="min-w-0 flex-1 leading-[18px]">
                      کد پستی: {{ address.postalCode }}
                    </UiTypography>
                  </div>

                  <UiTypography as="span" size="md" color="muted" class="hidden lg:block">
                    {{ address.recipient }} — {{ address.phone }}
                  </UiTypography>
                </div>

                <button
                  type="button"
                  class="flex shrink-0 items-center gap-1 self-start text-R-300 max-lg:h-[25px] lg:self-auto"
                  @click="addressOpen = true"
                >
                  <UiTypography as="span" size="md" weight="medium" color="primary">تغییر آدرس</UiTypography>
                  <img src="/icons/cart/angle-left.svg" alt="" class="size-[13px]">
                </button>
              </div>

              <!-- Empty state -->
              <div
                v-else
                class="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-T-400 p-6 text-center"
              >
                <img src="/icons/cart/map-pin.svg" alt="" class="size-[46px]">
                <UiTypography as="p" size="lg" weight="medium">هنوز آدرسی ثبت نکرده‌اید</UiTypography>
                <UiTypography as="p" size="md" color="muted" class="max-w-[360px] leading-[18px]">
                  برای ادامه، نشانی تحویل سفارش را اضافه کنید.
                </UiTypography>
                <button
                  type="button"
                  class="mt-1 flex h-[42px] items-center justify-center gap-2 rounded-[12px] bg-R-300 px-6"
                  @click="addAddressOpen = true"
                >
                  <img src="/icons/cart/plus-white.svg" alt="" class="size-[18px]">
                  <UiTypography as="span" size="lg" weight="bold" color="white">افزودن آدرس</UiTypography>
                </button>
              </div>
            </section>

            <!-- Shipping method + date/time -->
            <section class="flex flex-col gap-4 rounded-[12px] border border-T-400 p-4 lg:gap-6 lg:p-5">
              <UiTypography as="h2" size="lg" weight="bold" class="lg:text-[18px]">
                روش و زمان ارسال
              </UiTypography>

              <!-- Desktop: inline options (Figma 25074) -->
              <div class="hidden lg:block">
                <CheckoutShippingOptions
                  :methods="shippingMethods"
                  :method-id="shippingMethodId"
                  :days="deliveryDays"
                  :day-id="deliveryDay"
                  :time-slots="timeSlots"
                  :time-id="timeSlot"
                  @select="selectShippingMethod"
                  @select-day="deliveryDay = $event"
                  @select-time="timeSlot = $event"
                />
              </div>

              <!-- Mobile: trigger → bottom sheet -->
              <button
                type="button"
                class="flex min-h-[52px] items-center justify-between gap-3 rounded-[12px] border border-T-400 p-4 text-start lg:hidden"
                @click="shippingOpen = true"
              >
                <UiTypography as="span" size="md" :color="shippingSummary ? 'default' : 'muted'">
                  {{ shippingSummary || 'روش ارسال و زمان ارسال را انتخاب کنید' }}
                </UiTypography>
                <img src="/icons/cart/angle-down.svg" alt="" class="size-4 shrink-0">
              </button>
            </section>

            <CheckoutLegalEntity
              v-model="legalEntity"
              notice="اطلاعات حقوقی شما تکمیل نشده"
              description="با فعال‌سازی، فاکتور رسمی به نام شرکت صادر و سفارش با مشخصات حقوقی شما به‌جای مشخصات فردی ثبت می‌شود."
            />
          </template>

          <!-- ======================= Step 2 — payment ====================== -->
          <template v-else>
            <section class="flex flex-col gap-[17px] lg:gap-6 lg:rounded-[12px] lg:border lg:border-T-400 lg:p-5">
              <UiTypography as="h2" size="lg" weight="bold" class="lg:text-[18px]">
                روش پرداخت
              </UiTypography>

              <CheckoutPaymentMethods
                v-model:method="paymentMethod"
                v-model:gateway-id="gatewayId"
                v-model:installment-id="installmentId"
                :gateways="paymentGateways"
                :installments="installmentProviders"
                :wallet-balance="walletBalance"
                :wallet-insufficient="walletInsufficient"
                :limit-exceeded="paymentMethod === 'online' && limitExceeded"
              />

              <div
                v-if="paymentMethod === 'online' && limitExceeded"
                class="hidden rounded-[8px] border border-dashed border-[#F2DDB4] bg-[#FFFCF7] p-3 lg:block"
              >
                <UiTypography as="span" size="md" color="muted" class="leading-[18px]">
                  به‌دلیل سقف ۳۹۵ میلیون تومانی هر تراکنش اینترنتی، مابقی مبلغ سفارش را می‌توانید از «جزئیات سفارش» در داشبورد پرداخت کنید؛ سفارش با تکمیل پرداخت نهایی می‌شود.
                </UiTypography>
              </div>
            </section>

            <!-- Credit wallets -->
            <section class="flex flex-col gap-[17px] lg:gap-6 lg:rounded-[12px] lg:border lg:border-T-400 lg:p-5">
              <UiTypography as="h2" size="lg" weight="bold" class="lg:text-[18px]">
                استفاده از اعتبار
              </UiTypography>

              <CheckoutCreditWallets
                :providers="creditProviders"
                :selected-id="creditProviderId"
                @toggle="toggleCreditProvider"
              />
            </section>

            <!-- Discount code: the whole card toggles, the field itself doesn't -->
            <section
              class="flex cursor-pointer flex-col gap-[14px] rounded-[12px] border border-T-400 p-[11px] lg:gap-4 lg:p-5"
              @click="discountOpen = !discountOpen"
            >
              <div class="flex items-center gap-[14px] max-lg:h-[30px] lg:justify-between lg:gap-3">
                <UiTypography as="span" size="lg" weight="medium" class="min-w-0 flex-1 text-start lg:flex-none">
                  کد تخفیف دارید؟
                </UiTypography>

                <button
                  type="button"
                  role="switch"
                  :aria-checked="discountOpen"
                  class="relative h-[17px] w-[30px] shrink-0 rounded-full transition-colors max-lg:order-first"
                  :class="discountOpen ? 'bg-R-300' : 'bg-T-500'"
                  aria-label="کد تخفیف"
                >
                  <span
                    class="absolute top-[2px] size-[13px] rounded-full bg-white transition-all"
                    :class="discountOpen ? 'start-[15px]' : 'start-[2px]'"
                  />
                </button>

                <!-- Mobile: disclosure chevron at the end (left) -->
                <img
                  src="/icons/cart/angle-down.svg"
                  alt=""
                  class="size-[18px] shrink-0 transition-transform lg:hidden"
                  :class="discountOpen ? '-rotate-90' : 'rotate-90'"
                >
              </div>

              <!-- Applied code (Figma 3528 / discount-box) -->
              <div
                v-if="promoDiscount > 0"
                class="flex h-[53px] w-full items-center gap-3 rounded-[12px] border border-[#5A6AFF] bg-[#EAECFF] px-3 py-1 lg:w-[314px] lg:self-start"
                @click.stop
              >
                <img src="/icons/cart/discount-check.svg" alt="" class="size-[27px] shrink-0">
                <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                  <UiTypography as="span" size="md" weight="bold" class="leading-[15px] text-[#5A6AFF]">
                    {{ promoCode }}
                  </UiTypography>
                  <UiTypography as="span" size="md" weight="medium" class="leading-[15px] text-[#5A6AFF]">
                    {{ formatPriceFa(promoDiscount / 1000) }} هزار تومان تخفیف
                  </UiTypography>
                </span>
                <button type="button" aria-label="حذف کد تخفیف" @click="clearPromoCode">
                  <img src="/icons/cart/discount-x.svg" alt="" class="size-4">
                </button>
              </div>

              <div
                v-if="discountOpen && !promoDiscount"
                class="flex h-[42px] w-full items-center gap-1.5 rounded-[12px] border border-T-500 py-1 pe-1 ps-3 lg:w-[314px] lg:self-start"
                @click.stop
              >
                <input
                  v-model="discountCode"
                  type="text"
                  :placeholder="discountCodePlaceholder"
                  class="min-w-0 flex-1 bg-transparent text-[12.5px] text-T-900 outline-none placeholder:text-T-600"
                >
                <button
                  type="button"
                  class="flex h-[34px] w-[56px] shrink-0 items-center justify-center rounded-[12px] bg-R-300"
                  @click="applyDiscount"
                >
                  <UiTypography as="span" size="md" weight="semibold" color="white">اعمال</UiTypography>
                </button>
              </div>
            </section>
          </template>
        </div>

        <!-- ========================= Desktop summary ======================== -->
        <CheckoutSummary
          :rows="rows"
          :total="payable"
          :cta-label="ctaLabel"
          :blocked-label="blockedLabel"
          class="sticky top-6 hidden lg:flex"
          @submit="next"
        />
      </div>

      <!-- ========================= Mobile invoice ========================= -->
      <div class="mt-6 lg:hidden">
        <CheckoutSummary
          :payment="!isShippingStep"
          :title="isShippingStep ? '' : 'صورت‌حساب:'"
          :rows="rows"
          :total="payable"
          cta-label=""
        />
      </div>
    </main>

    <!-- ========================= Mobile sticky CTA ======================== -->
    <div
      class="fixed inset-x-0 bottom-0 z-40 border-t border-T-400 bg-T-50/95 backdrop-blur lg:hidden"
      :class="isShippingStep
        ? 'px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3'
        : 'px-[18px] pb-[calc(19px+env(safe-area-inset-bottom))] pt-[10px]'"
    >
      <!-- Step 2 — Figma Frame 3587: discount + payable rows over the pay CTA -->
      <div v-if="!isShippingStep" class="flex flex-col gap-3">
        <div class="flex flex-col">
          <div class="flex h-[45px] items-center gap-1.5 border-b border-T-300 px-3">
            <img src="/icons/cart/row-discount.svg" alt="" class="size-5 shrink-0">
            <UiTypography as="span" size="md" color="muted">تخفیف:</UiTypography>
            <span class="ms-auto flex items-baseline gap-1.5">
              <UiTypography as="span" size="lg" weight="medium" leading="none">
                {{ formatPriceFa(discountTotal) }}
              </UiTypography>
              <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
                تومان
              </UiTypography>
            </span>
          </div>

          <div class="flex h-[46px] items-center gap-1.5 px-3">
            <img src="/icons/cart/row-items.svg" alt="" class="size-5 shrink-0">
            <UiTypography as="span" size="md" color="muted">مبلغ قابل پرداخت</UiTypography>
            <span class="ms-auto flex items-baseline gap-1.5">
              <UiTypography as="span" size="2xl" weight="semibold" class="leading-[22px]">
                {{ formatPriceFa(payable) }}
              </UiTypography>
              <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
                تومان
              </UiTypography>
            </span>
          </div>
        </div>

        <button
          type="button"
          class="flex h-[42px] w-full items-center justify-center rounded-[12px] bg-R-300"
          @click="next"
        >
          <UiTypography as="span" size="lg" weight="bold" color="white">{{ ctaLabel }}</UiTypography>
        </button>
      </div>

      <!-- Step 1 — CTA at the start (right), sum at the end (left), Figma Frame 3642 -->
      <div v-else class="flex items-center justify-between gap-3">
        <button
          v-if="!blockedLabel"
          type="button"
          class="flex h-[42px] min-w-0 max-w-[217px] flex-1 items-center justify-center rounded-[12px] bg-R-300"
          @click="next"
        >
          <UiTypography as="span" size="lg" weight="bold" color="white">{{ ctaLabel }}</UiTypography>
        </button>
        <button
          v-else
          type="button"
          class="flex h-[42px] min-w-0 max-w-[217px] flex-1 items-center justify-center rounded-[12px] border border-[#F2DDB4] px-2 text-center"
          @click="shippingOpen = true"
        >
          <UiTypography as="span" size="md" weight="medium" class="min-w-0 text-center leading-[17px] text-[#CF982C]">
            {{ blockedLabel }}
          </UiTypography>
        </button>

        <div class="flex flex-col gap-0.5">
          <UiTypography as="span" size="sm" weight="semibold" color="subtle" class="leading-[14px]">جمع کل:</UiTypography>
          <div class="flex items-baseline gap-1.5">
            <UiTypography as="span" size="2xl" weight="semibold" class="leading-[22px]">
              {{ formatPriceFa(payable) }}
            </UiTypography>
            <UiTypography as="span" size="sm" weight="semibold" color="subtle" class="leading-[14px]">
              تومان
            </UiTypography>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================== Dialogs ============================= -->
    <CheckoutAddressDialog
      v-model:open="addressOpen"
      v-model:selected-id="addressId"
      :addresses="addresses"
      @add="addressOpen = false; addAddressOpen = true"
    />

    <CheckoutAddAddressDialog
      v-model:open="addAddressOpen"
      @created="onAddressCreated"
    />

    <CheckoutShippingSheet
      v-model:open="shippingOpen"
      :methods="shippingMethods"
      :method-id="shippingMethodId"
      :days="deliveryDays"
      :day-id="deliveryDay"
      :time-slots="timeSlots"
      :time-id="timeSlot"
      @select="selectShippingMethod"
      @select-day="deliveryDay = $event"
      @select-time="timeSlot = $event"
    />

    <CheckoutNoCreditDialog v-model:open="creditOpen" />
  </div>
</template>
