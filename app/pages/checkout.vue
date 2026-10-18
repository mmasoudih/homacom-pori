<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { CheckoutAddress } from '~/data/checkout'
import {
  creditProviders,
  discountCodePlaceholder,
  paymentGateways,
  shippingMethods,
} from '~/data/checkout'
import { formatPriceFa } from '~/utils/format'

const {
  isEmpty,
  clear: clearCart,
} = useCart()

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
  creditProviderId,
  creditInsufficient,
  discountCode,
  discountOpen,
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
    creditOpen.value = true
    return
  }

  // Mock payment: the gateway/result pages aren't part of this scope.
  toast.success('پرداخت با موفقیت انجام شد و سفارش شما ثبت شد.')
  clearCart()
  reset()
  navigateTo('/dashboard/orders', { replace: true })
}

function onAddressCreated(values: Omit<CheckoutAddress, 'id'>) {
  addAddress(values)
  toast.success('آدرس جدید ثبت شد.')
}

function applyDiscount() {
  if (!discountCode.value.trim()) {
    toast.error('کد تخفیف را وارد کنید.')
    return
  }
  toast.info('کد تخفیف ثبت شد و پس از بررسی اعمال می‌شود.')
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

    <main class="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-[132px] pt-4 lg:px-[45px] lg:pb-16 lg:pt-6">
      <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_324px] lg:gap-[38px]">
        <!-- ============================ Content ============================ -->
        <div class="flex min-w-0 flex-col gap-3 lg:gap-6">
          <!-- ====================== Step 1 — shipping ====================== -->
          <template v-if="isShippingStep">
            <!-- Address -->
            <section class="flex flex-col gap-4 rounded-[12px] border border-T-400 p-4 lg:gap-6 lg:p-5">
              <UiTypography as="h2" size="lg" weight="bold" class="lg:text-[18px]">
                انتخاب آدرس
              </UiTypography>

              <div
                v-if="address"
                class="flex items-start gap-4 rounded-[12px] border border-T-400 p-4"
              >
                <div class="flex min-w-0 flex-1 flex-col gap-1.5">
                  <UiTypography as="span" size="lg" weight="medium">{{ address.city }}</UiTypography>

                  <div class="flex items-center gap-2.5">
                    <img src="/icons/cart/addr-map.svg" alt="" class="size-[18px] shrink-0">
                    <UiTypography as="span" size="md" color="muted" class="min-w-0 flex-1 leading-[18px]">
                      آدرس: {{ address.address }}
                    </UiTypography>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <img src="/icons/cart/addr-post.svg" alt="" class="size-[18px] shrink-0">
                    <UiTypography as="span" size="md" color="muted" class="min-w-0 flex-1">
                      کد پستی: {{ address.postalCode }}
                    </UiTypography>
                  </div>

                  <UiTypography as="span" size="md" color="muted">
                    {{ address.recipient }} — {{ address.phone }}
                  </UiTypography>
                </div>

                <button
                  type="button"
                  class="flex shrink-0 items-center gap-1 text-R-300"
                  @click="addressOpen = true"
                >
                  <UiTypography as="span" size="md" weight="medium" color="primary">تغییر آدرس</UiTypography>
                  <img src="/icons/cart/angle-down.svg" alt="" class="size-3 rotate-90">
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
            <section class="flex flex-col gap-4 rounded-[12px] border border-T-400 p-4 lg:gap-6 lg:p-5">
              <UiTypography as="h2" size="lg" weight="bold" class="lg:text-[18px]">
                روش پرداخت
              </UiTypography>

              <CheckoutPaymentMethods
                v-model:method="paymentMethod"
                v-model:gateway-id="gatewayId"
                :gateways="paymentGateways"
                :wallet-balance="walletBalance"
                :wallet-insufficient="walletInsufficient"
                :credit-insufficient="creditInsufficient"
                @request-credit="creditOpen = true"
              />

              <div
                v-if="paymentMethod === 'online' && limitExceeded"
                class="rounded-[8px] border border-dashed border-[#F2DDB4] bg-[#FFFCF7] p-3"
              >
                <UiTypography as="span" size="md" color="muted" class="leading-[18px]">
                  به‌دلیل سقف ۳۹۵ میلیون تومانی هر تراکنش اینترنتی، مابقی مبلغ سفارش را می‌توانید از «جزئیات سفارش» در داشبورد پرداخت کنید؛ سفارش با تکمیل پرداخت نهایی می‌شود.
                </UiTypography>
              </div>
            </section>

            <!-- Credit wallets -->
            <section class="flex flex-col gap-4 rounded-[12px] border border-T-400 p-4 lg:gap-6 lg:p-5">
              <UiTypography as="h2" size="lg" weight="bold" class="lg:text-[18px]">
                استفاده از اعتبار
              </UiTypography>

              <CheckoutCreditWallets
                :providers="creditProviders"
                :selected-id="creditProviderId"
                @toggle="toggleCreditProvider"
              />
            </section>

            <!-- Discount code -->
            <section class="flex flex-col gap-4 rounded-[12px] border border-T-400 p-4 lg:p-5">
              <div class="flex items-center justify-between gap-3">
                <UiTypography as="span" size="lg" weight="medium">کد تخفیف دارید؟</UiTypography>

                <button
                  type="button"
                  role="switch"
                  :aria-checked="discountOpen"
                  class="relative h-[17px] w-[30px] shrink-0 rounded-full transition-colors"
                  :class="discountOpen ? 'bg-R-300' : 'bg-T-500'"
                  aria-label="کد تخفیف"
                  @click="discountOpen = !discountOpen"
                >
                  <span
                    class="absolute top-[2px] size-[13px] rounded-full bg-white transition-all"
                    :class="discountOpen ? 'start-[15px]' : 'start-[2px]'"
                  />
                </button>
              </div>

              <div v-if="discountOpen" class="flex flex-col gap-2.5 lg:flex-row">
                <input
                  v-model="discountCode"
                  type="text"
                  :placeholder="discountCodePlaceholder"
                  class="h-[42px] min-w-0 flex-1 rounded-[12px] border border-T-400 bg-T-50 px-4 text-[13px] text-T-900 outline-none placeholder:text-T-600 focus:border-R-300"
                >
                <button
                  type="button"
                  class="flex h-[42px] shrink-0 items-center justify-center rounded-[12px] bg-R-300 px-6"
                  @click="applyDiscount"
                >
                  <UiTypography as="span" size="lg" weight="bold" color="white">اعمال</UiTypography>
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
          title="صورت‌حساب:"
          :rows="rows"
          :total="payable"
          cta-label=""
        />
      </div>
    </main>

    <!-- ========================= Mobile sticky CTA ======================== -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-T-400 bg-T-50/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div class="flex items-center justify-between gap-3">
        <div class="flex flex-col gap-0.5">
          <UiTypography as="span" size="sm" weight="semibold" color="subtle">جمع کل:</UiTypography>
          <div class="flex items-baseline gap-1.5">
            <UiTypography as="span" size="xl" weight="medium" leading="none">
              {{ formatPriceFa(payable) }}
            </UiTypography>
            <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
              تومان
            </UiTypography>
          </div>
        </div>

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
          <UiTypography as="span" size="md" weight="medium" class="text-[#CF982C]">
            {{ blockedLabel }}
          </UiTypography>
        </button>
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
