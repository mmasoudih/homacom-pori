<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import type { Order } from '~/data/orders'
import { orderStatusMeta } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  order: Order
}>()

const meta = computed(() => orderStatusMeta[props.order.status])
const isAwaitingPayment = computed(() => props.order.status === 'awaiting_payment')
const detailHref = computed(() => `/dashboard/orders/${props.order.id}`)
</script>

<template>
  <article class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-5">
    <!-- Status + open -->
    <div class="flex items-center justify-between gap-3">
      <DashboardOrdersStatusChip :label="meta.label" :tone="meta.tone" :icon="meta.icon" />

      <NuxtLink
        :to="detailHref"
        class="flex size-8 shrink-0 items-center justify-center rounded-full border border-T-400 text-T-600 transition-colors hover:border-T-500 hover:text-T-900"
        aria-label="جزئیات سفارش"
      >
        <IconChevronLeft class="size-4" />
      </NuxtLink>
    </div>

    <!-- Meta -->
    <div class="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12.5px] text-T-600 sm:justify-between">
      <span>مبلغ: <b class="font-bold text-T-900">{{ formatPriceFa(order.amount) }}</b> تومان</span>
      <span>تاریخ: <b class="font-bold text-T-900">{{ order.date }}</b></span>
      <span class="inline-flex items-center gap-1.5">
        کد سفارش:
        <DashboardOrdersCopyValue :value="toPersianDigits(order.code)" :copy-value="order.code" />
      </span>
    </div>

    <!-- Status progress -->
    <DashboardOrdersProgressBar
      v-if="!meta.hideProgress"
      class="mt-5"
      :tone="meta.tone"
      :percent="meta.progress"
      :label="`تحویل: ${order.deliveredAt}`"
    />

    <!-- Products -->
    <div class="mt-5 flex items-center justify-center gap-4">
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
    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
      <template v-if="isAwaitingPayment">
        <DashboardOrdersAlertNote class="w-full sm:max-w-[460px]">
          پرداخت شما کامل نشده و ۳۰ ساعت دیگر مهلت دارید. برای ثبت نهایی، پرداخت خود را کامل کنید.
        </DashboardOrdersAlertNote>

        <NuxtLink
          :to="`${detailHref}`"
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
