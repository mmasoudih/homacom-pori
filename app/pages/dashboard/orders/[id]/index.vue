<script setup lang="ts">
import { IconArrowLeft, IconBox, IconFileInvoice } from '@tabler/icons-vue'
import { useMediaQuery } from '@vueuse/core'
import { toast } from 'vue-sonner'
import type { Order, OrderStatus } from '~/data/orders'
import { findOrder, orderStatusMeta } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const route = useRoute()
const id = computed(() => String(route.params.id))

const order = ref<Order | undefined>(undefined)
const notFound = ref(false)

watchEffect(() => {
  const base = findOrder(id.value)
  if (!base) {
    notFound.value = true
    order.value = undefined
    return
  }

  notFound.value = false
  const override = route.query.status as OrderStatus | undefined
  order.value = { ...base, status: override && override in orderStatusMeta ? override : base.status }
})

const cancelOpen = ref(false)

function onCancelled() {
  if (order.value) order.value = { ...order.value, status: 'cancelled' }
}

function onInvoice() {
  toast.info('فاکتور سفارش در حال آماده‌سازی است.')
}

const isDesktop = useMediaQuery('(min-width: 1280px)')

const mobileStatus = computed(() => (order.value ? orderStatusMeta[order.value.status] : undefined))

const mobileInfoItems = computed<{ label: string; value: string; stacked?: boolean }[]>(() => {
  if (!order.value) return []
  return [
    { label: 'کد سفارش', value: toPersianDigits(order.value.code) },
    { label: 'تاریخ ثبت سفارش', value: order.value.date },
    { label: 'تحویل گیرنده', value: order.value.receiver.name },
    { label: 'شماره تلفن همراه', value: toPersianDigits(order.value.receiver.phone) },
    { label: 'آدرس', value: order.value.receiver.address, stacked: true },
  ]
})

const mobileAmountItems = computed<{ label: string; value: string }[]>(() => {
  if (!order.value) return []
  return [
    { label: 'مبلغ سفارش', value: `${formatPriceFa(order.value.amount)} تومان` },
    { label: 'تاریخ تحویل', value: order.value.shipping.deliveryDate },
    { label: 'هزینه ارسال', value: `${formatPriceFa(order.value.shipping.cost)} تومان` },
  ]
})

useHead({
  title: 'جزئیات سفارش | هماکام',
})
</script>

<template>
  <div>
  <DashboardOrdersShell>
    <DashboardOrdersDetailHeader
      v-if="order"
      title="جزئیات سفارش"
      :code="order.code"
      back-to="/dashboard/orders"
    />

    <template v-if="order">
      <DashboardOrdersDetailInfo :order="order" />
      <DashboardOrdersDetailShipping :order="order" @cancel="cancelOpen = true" />
      <DashboardOrdersDetailTransactions :transactions="order.transactions" />
      <DashboardOrdersDetailItems :items="order.items" />
    </template>

    <div
      v-else-if="notFound"
      class="rounded-[20px] border border-T-400 bg-T-50 p-10 text-center"
    >
      <p class="text-[14px] font-bold text-T-900">سفارش مورد نظر یافت نشد.</p>
      <NuxtLink to="/dashboard/orders" class="mt-3 inline-block text-[13px] font-semibold text-primary">
        بازگشت به سفارش‌های من
      </NuxtLink>
    </div>
  </DashboardOrdersShell>

  <DashboardOrdersMobileBareShell
    v-if="order"
    title="جزئیات سفارش"
    align="center"
    :back-to="'/dashboard/orders'"
  >
    <template #action>
      <button
        type="button"
        class="flex items-center gap-1.5 text-[12.5px] font-semibold text-T-800"
        @click="onInvoice"
      >
        <IconFileInvoice class="size-4" /> مشاهده فاکتور
      </button>
    </template>

    <!-- 1. Order info -->
    <div class="mb-4 rounded-2xl border border-T-300 bg-T-50 p-4">
      <DashboardOrdersMobileInfoList :items="mobileInfoItems" />
    </div>

    <!-- 2. Amounts -->
    <DashboardOrdersMobileInfoList :divided="true" class="mb-4" :items="mobileAmountItems" />

    <!-- 3. Status -->
    <DashboardOrdersMobileStatusPanel
      v-if="mobileStatus"
      class="mb-4"
      :label="mobileStatus.label"
      :tone="mobileStatus.tone"
      :icon="mobileStatus.icon"
      :percent="mobileStatus.progress"
    />

    <!-- 4a. Shipping extras -->
    <div v-if="order.status === 'shipping'" class="mb-4 flex flex-col gap-3">
      <div class="rounded-xl bg-indigo-50/70 p-4">
        <p class="text-[11.5px] leading-[20px] text-T-600">
          کد تحویل سفارش را همراه داشته باشید و هنگام تحویل به مامور ارسال تحویل دهید.
        </p>
        <div class="mt-3 flex items-center justify-between gap-3">
          <span class="text-[12px] text-T-600">کد تحویل سفارش:</span>
          <span class="flex items-center gap-2 rounded-lg border border-dashed border-T-400 bg-T-50 px-3 py-1.5 text-[13px] font-bold text-T-900">
            {{ toPersianDigits(order.deliveryCode ?? '') }}
            <IconBox class="size-4 text-indigo-500" />
          </span>
        </div>
      </div>

      <div class="rounded-xl bg-indigo-50/70 p-4">
        <p class="text-[11.5px] leading-[20px] text-T-600">
          با کد پیگیری زیر می‌توانید از طریق سامانه رهگیری پست، وضعیت ارسال مرسوله خود را پیگیری کنید.
        </p>
        <a
          href="https://tracking.post.ir"
          target="_blank"
          rel="noopener"
          class="mt-1 flex items-center justify-end gap-1 text-[11.5px] font-semibold text-primary"
        >
          سامانه رهگیری پست
          <IconArrowLeft class="size-3.5" />
        </a>
        <div class="mt-3 flex items-center justify-between gap-3">
          <span class="text-[12px] text-T-600">کد پیگیری مرسوله:</span>
          <span class="rounded-lg border border-dashed border-T-400 bg-T-50 px-3 py-1.5">
            <DashboardOrdersCopyValue :value="toPersianDigits(order.postalTracking ?? '')" :copy-value="order.postalTracking" />
          </span>
        </div>
      </div>
    </div>

    <!-- 4b. Awaiting payment extras -->
    <div v-if="order.status === 'awaiting_payment' && order.payment" class="mb-4 flex flex-col gap-3">
      <DashboardOrdersAlertNote>
        پرداخت شما کامل نشده و ۳۴ ساعت دیگر مهلت دارید. برای ثبت نهایی، پرداخت خود را کامل کنید.
      </DashboardOrdersAlertNote>

      <div class="flex items-center gap-4 rounded-2xl border border-T-300 bg-T-50 p-4">
        <div class="flex flex-1 flex-col gap-2 text-[11.5px] text-T-600">
          <span>
            مبلغ پرداخت‌شده:
            <b class="font-bold text-T-900">{{ formatPriceFa(order.payment.paid) }}</b> تومان
          </span>
          <span>
            مبلغ باقی‌مانده:
            <b class="font-bold text-T-900">{{ formatPriceFa(order.payment.total - order.payment.paid) }}</b> تومان
          </span>
          <NuxtLink
            :to="`/dashboard/orders/${order.id}/pay`"
            class="mt-1 inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-primary px-4 text-[12.5px] font-bold text-primary transition-colors hover:bg-R-50"
          >
            ادامه پرداخت
            <IconArrowLeft class="size-4" />
          </NuxtLink>
        </div>

        <DashboardOrdersProgressRing :percent="order.payment.percent" label="پرداخت شده" />
      </div>
    </div>

    <!-- 5. Transactions -->
    <DashboardOrdersMobileTransactions
      :transactions="order.transactions"
      :default-open="order.status !== 'processing' && order.status !== 'awaiting_payment'"
      class="mb-4"
    />

    <!-- 6. Items -->
    <DashboardOrdersMobileDetailItems :items="order.items" class="mb-4" />

    <!-- 7. Bottom CTA -->
    <NuxtLink
      v-if="order.status === 'delivered' || order.status === 'cancelled'"
      :to="`/dashboard/orders/${order.id}/return`"
      class="flex h-12 w-full items-center justify-center rounded-xl border border-primary text-[13px] font-bold text-primary transition-colors hover:bg-R-50"
    >
      درخواست مرجوعی کالا
    </NuxtLink>

    <button
      v-else-if="order.status === 'processing' || order.status === 'shipping'"
      type="button"
      class="flex h-12 w-full items-center justify-center rounded-xl border border-primary text-[13px] font-bold text-primary transition-colors hover:bg-R-50"
      @click="cancelOpen = true"
    >
      لغو سفارش
    </button>

    <NuxtLink
      v-else-if="order.status === 'awaiting_payment'"
      :to="`/dashboard/orders/${order.id}/pay`"
      class="flex h-12 w-full items-center justify-center rounded-xl border border-primary text-[13px] font-bold text-primary transition-colors hover:bg-R-50"
    >
      ادامه پرداخت
    </NuxtLink>
  </DashboardOrdersMobileBareShell>

  <DashboardOrdersMobileBareShell
    v-else
    title="جزئیات سفارش"
    align="center"
    :back-to="'/dashboard/orders'"
  >
    <div class="rounded-2xl border border-T-300 bg-T-50 p-10 text-center">
      <p class="text-[14px] font-bold text-T-900">سفارش مورد نظر یافت نشد.</p>
      <NuxtLink to="/dashboard/orders" class="mt-3 inline-block text-[13px] font-semibold text-primary">
        بازگشت به سفارش‌های من
      </NuxtLink>
    </div>
  </DashboardOrdersMobileBareShell>

  <ClientOnly>
    <DashboardOrdersCancelDialog v-if="isDesktop" v-model:open="cancelOpen" @confirmed="onCancelled" />
    <DashboardOrdersMobileCancelSheet v-else v-model:open="cancelOpen" @confirmed="onCancelled" />
  </ClientOnly>
  </div>
</template>
