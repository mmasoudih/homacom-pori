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
const showDelivered = computed(() => props.order.status !== 'delivered' && props.order.status !== 'cancelled')
const detailHref = computed(() => `/dashboard/orders/${props.order.id}`)
</script>

<template>
  <article class="rounded-2xl border border-T-300 bg-T-50 p-4">
    <!-- Status + open -->
    <div class="flex items-center justify-between gap-3">
      <DashboardOrdersStatusChip :label="meta.label" :tone="meta.tone" :icon="meta.icon" />

      <NuxtLink
        :to="detailHref"
        class="flex size-7 shrink-0 items-center justify-center rounded-full bg-T-100 transition-colors hover:bg-T-200"
        aria-label="جزئیات سفارش"
      >
        <IconChevronLeft class="size-4 text-T-600" />
      </NuxtLink>
    </div>

    <!-- Status progress -->
    <DashboardOrdersProgressBar class="mt-3" :tone="meta.tone" :percent="meta.progress" />

    <!-- Awaiting payment total -->
    <div v-if="isAwaitingPayment" class="mt-4 text-center text-[12px]">
      <span class="text-T-600">مبلغ قابل پرداخت: </span>
      <span class="font-semibold text-T-900">{{ formatPriceFa(order.payment?.total ?? order.amount) }} تومان</span>
    </div>

    <!-- Meta -->
    <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
      <div class="flex items-center gap-1">
        <span class="text-T-600">تاریخ:</span>
        <span class="font-semibold text-T-900">{{ order.date }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-T-600">کد سفارش:</span>
        <DashboardOrdersCopyValue :value="toPersianDigits(order.code)" :copy-value="order.code" />
      </div>
      <div class="flex items-center gap-1">
        <span class="text-T-600">مبلغ:</span>
        <span class="font-semibold text-T-900">{{ formatPriceFa(order.amount) }} تومان</span>
      </div>
      <div v-if="showDelivered" class="flex items-center gap-1">
        <span class="text-T-600">تحویل:</span>
        <span class="font-semibold text-T-900">{{ order.deliveredAt }}</span>
      </div>
    </div>

    <!-- Products -->
    <div class="mt-4 flex items-center justify-center gap-4">
      <ProductImage
        v-for="item in order.items"
        :key="item.id"
        :src="item.image"
        :alt="item.title"
        container-class="size-14 shrink-0 rounded-xl bg-transparent"
      />
    </div>

    <!-- Awaiting payment note -->
    <DashboardOrdersAlertNote v-if="isAwaitingPayment" class="mt-4 w-full">
      پرداخت شما کامل نشده و ۳۴ ساعت دیگر مهلت دارید. برای ثبت نهایی، پرداخت خود را کامل کنید.
    </DashboardOrdersAlertNote>
  </article>
</template>
