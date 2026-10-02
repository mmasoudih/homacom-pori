<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import type { Order, StatusTone } from '~/data/orders'
import { orderStatusMeta } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  order: Order
}>()

const meta = computed(() => orderStatusMeta[props.order.status])
const isAwaitingPayment = computed(() => props.order.status === 'awaiting_payment')
const isCancelled = computed(() => props.order.status === 'cancelled')
const showFooter = computed(() => !isCancelled.value)
const detailHref = computed(() => `/dashboard/orders/${props.order.id}`)

const toneText: Record<StatusTone, string> = {
  amber: 'text-[#FF9800]',
  sky: 'text-[#4E60FF]',
  emerald: 'text-[#2EC144]',
  red: 'text-primary',
}
</script>

<template>
  <article class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-5">
    <!-- Header: status/meta (right-aligned) + chevron (left, centered on header) -->
    <div class="flex items-center gap-4">
      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <!-- Status -->
        <div class="flex items-center justify-start">
          <DashboardOrdersStatusChip :label="meta.label" :tone="meta.tone" :icon="meta.icon" />
        </div>

        <!-- Meta -->
        <div class="flex items-center justify-start gap-x-6 text-[12.5px] text-T-600">
          <span class="whitespace-nowrap">
            مبلغ: <b class="font-bold text-T-900">{{ formatPriceFa(order.amount) }}</b> تومان
          </span>

          <span class="h-4 w-px shrink-0 bg-T-300" />

          <span class="whitespace-nowrap">
            تاریخ: <b class="font-bold text-T-900">{{ order.date }}</b>
          </span>

          <span class="h-4 w-px shrink-0 bg-T-300" />

          <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
            کد سفارش:
            <DashboardOrdersCopyValue :value="toPersianDigits(order.code)" :copy-value="order.code" />
          </span>
        </div>
      </div>

      <NuxtLink
        :to="detailHref"
        class="shrink-0 text-T-600 transition-colors hover:text-T-900"
        aria-label="جزئیات سفارش"
      >
        <IconChevronLeft class="size-4" />
      </NuxtLink>
    </div>

    <!-- Progress + delivery date -->
    <div v-if="!meta.hideProgress" class="mt-4 border-t border-T-300 pt-4">
      <div class="flex items-center justify-between gap-6">
        <span class="whitespace-nowrap text-[11.5px] text-T-600">
          تحویل: <b class="font-semibold text-T-800">{{ order.deliveredAt }}</b>
        </span>

        <div class="flex w-[45%] flex-col gap-1.5">
          <div class="flex items-center justify-between gap-3 text-[11.5px]">
            <span :class="toneText[meta.tone]">{{ meta.label }}</span>
            <span v-if="isAwaitingPayment" class="whitespace-nowrap text-T-600">
              مبلغ قابل پرداخت:
              (<strong class="font-bold text-T-900">{{ formatPriceFa(order.payment?.total ?? 0) }} تومان</strong>)
            </span>
          </div>

          <DashboardOrdersProgressBar
            :tone="meta.tone"
            :percent="meta.progress"
            :show-dot="false"
          />
        </div>
      </div>
    </div>

    <!-- Products -->
    <div dir="ltr" class="mt-4 flex items-center justify-end gap-4 border-t border-T-300 pt-4">
      <ProductImage
        v-for="item in order.items"
        :key="item.id"
        :src="item.image"
        :alt="item.title"
        container-class="size-[60px] shrink-0 rounded-none bg-transparent"
        class="group"
      />
    </div>

    <!-- Footer -->
    <div
      v-if="showFooter"
      class="mt-4 flex flex-wrap items-center gap-3 border-t border-T-300 pt-4"
      :class="isAwaitingPayment ? 'justify-between' : 'justify-end'"
    >
      <template v-if="isAwaitingPayment">
        <DashboardOrdersAlertNote class="w-full lg:max-w-[560px]">
          پرداخت شما کامل نشده و ۳۰ ساعت دیگر مهلت دارید. برای ثبت نهایی، پرداخت خود را کامل کنید.
        </DashboardOrdersAlertNote>

        <NuxtLink
          :to="detailHref"
          class="inline-flex h-9 items-center gap-2 rounded-lg border border-primary bg-T-50 px-4 text-[12.5px] font-bold text-primary transition-colors hover:bg-R-50"
        >
          ادامه پرداخت
          <IconChevronLeft class="size-4" />
        </NuxtLink>
      </template>

      <DashboardOrdersInvoiceButton v-else />
    </div>
  </article>
</template>
