<script setup lang="ts">
import { IconCircleCheckFilled, IconInfoCircle, IconWallet } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import { apiErrorMessage } from '~/composables/useApi'
import { useShopOptions } from '~/composables/useShopOptions'
import { formatPriceFa, toPersianDigits } from '~/utils/format'
import { redirectToGateway } from '~/utils/payment'

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))
const { order } = useOrderDetail(id)
const { paymentOptions } = useShopOptions()
const { repay } = useOrderActions()

const selectedMethodId = ref('')
const paying = ref(false)

/**
 * A bank-transfer method without an active account cannot be paid, so it is
 * hidden from the list instead of offering a dead end.
 */
const repayMethods = computed(() =>
  paymentOptions.value.filter(option =>
    option.type !== 'bank_transfer' || option.bankAccounts.length > 0,
  ),
)

// Default to the first online gateway as soon as `/public/payment-methods`
// resolves (the fallback list also works when the API is unreachable).
watch(repayMethods, (options) => {
  if (selectedMethodId.value && options.some(option => option.id === selectedMethodId.value)) return
  const first = options.find(option => option.type === 'online') ?? options[0]
  selectedMethodId.value = first?.id ?? ''
}, { immediate: true })

const totals = computed(() => {
  const total = order.value?.payablePrice ?? order.value?.amount ?? 0
  const paid = order.value?.paidPrice ?? order.value?.payment?.paid ?? 0
  return { total, paid, remaining: Math.max(0, total - paid) }
})

const selectedMethod = computed(
  () => paymentOptions.value.find(option => option.id === selectedMethodId.value) ?? null,
)

/** Bank transfer has no gateway: the CTA only switches the invoice to it. */
const payLabel = computed(() =>
  selectedMethod.value?.type === 'bank_transfer' ? 'ادامه' : 'پرداخت',
)

async function pay() {
  if (!order.value) return
  if (!selectedMethodId.value) {
    toast.error('روش پرداخت را انتخاب کنید.')
    return
  }

  paying.value = true
  try {
    // `POST /order/{invoice}/repay` returns the same CheckoutResource shape as
    // cart checkout, so the gateway hand-off is reused verbatim. The offline
    // bank-transfer method answers `payment: null` instead of a redirect.
    const res = await repay(order.value.id, selectedMethodId.value)
    const payment = res.data?.payment ?? null

    if (payment && payment.success === false) {
      toast.error(payment.message || 'اتصال به درگاه پرداخت انجام نشد.')
      return
    }

    if (payment && redirectToGateway(payment)) return

    if (res.data?.invoice?.payment_method === 'bank_transfer') {
      toast.success(res.message || 'فاکتور برای واریز بانکی ثبت شد.', {
        description: 'رسید واریز را از صفحه سفارش بارگذاری کنید تا کارشناسان بررسی کنند.',
      })
      router.push(`/dashboard/orders/${order.value.id}`)
      return
    }

    // Wallet/credit methods settle server-side and return no redirect.
    toast.success(res.message || 'پرداخت شما ثبت شد.')
    router.push(`/dashboard/orders/${order.value.id}`)
  }
  catch (err) {
    // 422: already paid, no longer payable or an invalid payment method.
    toast.error(apiErrorMessage(err, 'شروع مجدد پرداخت انجام نشد.'))
  }
  finally {
    paying.value = false
  }
}

useHead({
  title: 'تکمیل پرداخت سفارش | هماکام',
})
</script>

<template>
  <div>
    <DashboardOrdersCheckoutShell :back-to="`/dashboard/orders/${id}`">
    <template v-if="order">
      <!-- Banner -->
      <div class="flex items-start gap-3 rounded-[16px] bg-indigo-50 p-4 lg:p-5">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-indigo-500">
          <IconInfoCircle class="size-6" />
        </span>
        <div class="flex flex-col gap-1">
          <h1 class="text-[13.5px] font-bold text-indigo-700">
            تکمیل پرداخت سفارش {{ toPersianDigits(order.code) }}
          </h1>
          <p class="text-[12px] leading-[22px] text-indigo-500">
            پرداخت اولیه ثبت شد؛ با تکمیل پرداخت، سفارش نهایی می‌شود. اگر مجموع پرداخت‌ها به مبلغ سفارش نرسید، می‌توانید باقی‌مانده را در چند مرحله و با روش‌های مختلف پرداخت کنید.
          </p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <!-- Payment methods -->
        <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
          <h2 class="text-[14px] font-bold text-T-900">روش پرداخت</h2>

          <div v-if="repayMethods.length" class="mt-5 flex flex-col gap-3">
            <div
              v-for="method in repayMethods"
              :key="method.id"
              class="rounded-xl border p-4 transition-colors"
              :class="selectedMethodId === method.id ? 'border-primary/50' : 'border-T-400'"
              role="button"
              tabindex="0"
              @click="selectedMethodId = method.id"
              @keydown.enter="selectedMethodId = method.id"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <span class="mt-0.5 flex size-5 items-center justify-center text-T-700">
                    <img
                      v-if="method.logo"
                      :src="method.logo"
                      :alt="method.title"
                      class="size-5 object-contain"
                    >
                    <IconWallet v-else class="size-5" />
                  </span>
                  <div class="flex flex-col gap-1">
                    <span class="text-[13px] font-bold text-T-900">{{ method.title }}</span>
                    <span class="text-[11.5px] text-T-600">{{ method.description || method.typeFa }}</span>
                  </div>
                </div>

                <span
                  class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2"
                  :class="selectedMethodId === method.id ? 'border-primary' : 'border-T-400'"
                >
                  <span v-if="selectedMethodId === method.id" class="size-2.5 rounded-full bg-primary" />
                </span>
              </div>

              <div v-if="selectedMethodId === method.id && method.type === 'bank_transfer'" class="mt-3">
                <CheckoutBankAccounts :accounts="method.bankAccounts" />
              </div>

              <div v-else-if="selectedMethodId === method.id && method.typeFa" class="mt-3">
                <DashboardOrdersAlertNote>
                  {{ method.typeFa }}
                </DashboardOrdersAlertNote>
              </div>
            </div>
          </div>

          <p v-else class="mt-5 text-[12.5px] text-T-600">
            روش پرداخت فعالی یافت نشد. لطفا بعدا دوباره تلاش کنید.
          </p>
        </section>

        <!-- Summary -->
        <aside class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-5">
          <div class="flex flex-col gap-4 text-[12.5px]">
            <div class="flex items-center justify-between gap-3 text-T-600">
              <span>مبلغ سفارش:</span>
              <span class="font-bold text-T-900">{{ formatPriceFa(totals.total) }} تومان</span>
            </div>
            <div class="flex items-center justify-between gap-3 text-T-600">
              <span>پرداخت‌شده:</span>
              <span class="flex items-center gap-1.5 font-bold text-T-900">
                {{ formatPriceFa(totals.paid) }} تومان
                <IconCircleCheckFilled class="size-4 text-emerald-500" />
              </span>
            </div>
            <div class="flex items-center justify-between gap-3 text-T-600">
              <span>باقی‌مانده:</span>
              <span class="text-[13px] font-extrabold text-T-900">{{ formatPriceFa(totals.remaining) }} تومان</span>
            </div>
          </div>

          <button
            type="button"
            class="mt-5 h-11 w-full rounded-xl bg-primary text-[13px] font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="paying || !repayMethods.length"
            @click="pay"
          >
            {{ paying ? 'در حال انتقال…' : payLabel }}
          </button>

          <p v-if="selectedMethod" class="mt-3 text-center text-[11.5px] text-T-600">
            {{ selectedMethod.title }}
          </p>
        </aside>
      </div>
    </template>

    <div v-else class="rounded-[20px] border border-T-400 bg-T-50 p-10 text-center">
      <p class="text-[14px] font-bold text-T-900">سفارش مورد نظر یافت نشد.</p>
      <NuxtLink to="/dashboard/orders" class="mt-3 inline-block text-[13px] font-semibold text-primary">
        بازگشت به سفارش‌های من
      </NuxtLink>
    </div>
  </DashboardOrdersCheckoutShell>

  <DashboardOrdersMobileBareShell
    v-if="order"
    title="اطلاعات پرداخت"
    align="center"
    :back-to="`/dashboard/orders/${id}`"
  >
    <DashboardOrdersMobileCheckoutSummary
      :methods="repayMethods"
      :selected-method="selectedMethodId"
      :order-code="order.code"
      :total="totals.total"
      :paid="totals.paid"
      :remaining="totals.remaining"
      @update:selected-method="selectedMethodId = $event"
    />

    <div v-if="selectedMethod?.type === 'bank_transfer'" class="mt-4">
      <CheckoutBankAccounts :accounts="selectedMethod.bankAccounts" />
    </div>
    <template #footer>
      <button
        type="button"
        class="h-12 w-full rounded-xl bg-primary text-[13px] font-bold text-white disabled:opacity-60"
        :disabled="paying || !repayMethods.length"
        @click="pay"
      >
        {{ paying ? 'در حال انتقال…' : payLabel }}
      </button>
    </template>
  </DashboardOrdersMobileBareShell>

  <DashboardOrdersMobileBareShell
    v-else
    title="اطلاعات پرداخت"
    align="center"
    :back-to="`/dashboard/orders/${id}`"
  >
    <div class="rounded-2xl border border-T-300 bg-T-50 p-10 text-center">
      <p class="text-[14px] font-bold text-T-900">سفارش مورد نظر یافت نشد.</p>
      <NuxtLink to="/dashboard/orders" class="mt-3 inline-block text-[13px] font-semibold text-primary">
        بازگشت به سفارش‌های من
      </NuxtLink>
    </div>
  </DashboardOrdersMobileBareShell>
  </div>
</template>
