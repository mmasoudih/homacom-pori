<script setup lang="ts">
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
  gold: 'text-[#CF982C]',
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
          <!-- Scoped override: small leading (right in RTL) status icon, and a
               dedicated hourglass asset for processing (detail page keeps the shared one). -->
          <DashboardOrdersStatusChip
            :label="meta.label"
            :tone="meta.tone"
            :icon="meta.icon"
            :img-src="order.status === 'processing' ? '/icons/status-processing-hourglass.svg' : undefined"
            class="[&>img]:order-first [&>img]:size-[18px]"
          />
        </div>

        <!-- Meta -->
        <UiTypography
          as="div"
          size="md"
          weight="medium"
          color="subtle"
          class="flex items-center justify-start gap-x-6"
        >
          <span class="whitespace-nowrap">
            مبلغ: <UiTypography as="span" size="lg" weight="medium" color="default">{{ formatPriceFa(order.amount) }}</UiTypography> تومان
          </span>

          <span class="h-4 w-px shrink-0 bg-T-300" />

          <span class="whitespace-nowrap">
            تاریخ: <UiTypography as="span" size="lg" weight="medium" color="default">{{ order.date }}</UiTypography>
          </span>

          <span class="h-4 w-px shrink-0 bg-T-300" />

          <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
            کد سفارش:
            <DashboardOrdersCopyValue :value="toPersianDigits(order.code)" :copy-value="order.code" :show-copy="false" />
          </span>
        </UiTypography>
      </div>

      <NuxtLink
        :to="detailHref"
        class="shrink-0 text-T-700 transition-colors hover:text-T-900"
        aria-label="جزئیات سفارش"
      >
        <span
          class="block size-4 bg-current [mask-image:url(/icons/chevron-left-gray.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
          aria-hidden="true"
        />
      </NuxtLink>
    </div>

    <!-- Progress + delivery date -->
    <div v-if="!meta.hideProgress" class="mt-4 border-t border-T-300 pt-4">
      <div class="flex items-center justify-between gap-6">
        <UiTypography as="span" size="md" weight="medium" color="subtle" class="whitespace-nowrap">
          تحویل:
          <UiTypography as="span" size="lg" weight="regular" class="ms-2.5">{{ order.deliveredAt }}</UiTypography>
        </UiTypography>

        <div class="flex w-[45%] flex-col gap-1.5">
          <div class="flex items-center justify-between gap-3">
            <span :class="toneText[meta.tone]">
              <UiTypography as="span" size="lg" weight="semibold" color="inherit">
                {{ meta.label }}
              </UiTypography>
            </span>
            <UiTypography
              v-if="isAwaitingPayment"
              as="span"
              size="md"
              weight="medium"
              color="subtle"
              class="whitespace-nowrap"
            >
              مبلغ قابل پرداخت:
              (<strong class="font-bold text-T-900">{{ formatPriceFa(order.payment?.total ?? 0) }} تومان</strong>)
            </UiTypography>
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
        container-class="size-[66px] shrink-0 rounded-none bg-transparent"
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
          پرداخت شما کامل نشده و تا <span class="underline">۲۴ ساعت</span> دیگر رزرو می‌ماند. برای ثبت نهایی، پرداخت خود را کامل کنید.
        </DashboardOrdersAlertNote>

        <NuxtLink
          :to="detailHref"
          class="inline-flex h-9 items-center gap-2 rounded-[12px] border border-primary bg-T-50 px-4 text-primary transition-colors hover:bg-R-50"
        >
          <UiTypography as="span" size="lg" weight="medium" color="inherit">ادامه پرداخت</UiTypography>
          <img src="/icons/chevron-left-red.svg" alt="" class="size-[18px]" aria-hidden="true">
        </NuxtLink>
      </template>

      <DashboardOrdersInvoiceButton v-else />
    </div>
  </article>
</template>
