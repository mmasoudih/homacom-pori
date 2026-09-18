<script setup lang="ts">
import { IconArrowLeft, IconBox, IconTruckDelivery } from '@tabler/icons-vue'
import type { Order } from '~/data/orders'
import { orderStatusMeta } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  order: Order
}>()

const emit = defineEmits<{
  cancel: []
}>()

const meta = computed(() => orderStatusMeta[props.order.status])
const isShipping = computed(() => props.order.status === 'shipping')
const isAwaitingPayment = computed(() => props.order.status === 'awaiting_payment')
const canCancel = computed(() => props.order.status === 'processing' || props.order.status === 'shipping')
const canReturn = computed(() => props.order.status === 'delivered')

const items = computed(() => [
  { label: 'مبلغ سفارش', value: `${formatPriceFa(props.order.amount)} تومان` },
  { label: 'تخفیف', value: `${formatPriceFa(props.order.shipping.discount)} تومان` },
  { label: 'نحوه ارسال', value: props.order.shipping.method },
  { label: 'تاریخ تحویل', value: props.order.shipping.deliveryDate },
  { label: 'هزینه ارسال', value: `${formatPriceFa(props.order.shipping.cost)} تومان` },
])
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
    <h2 class="text-center text-[14px] font-bold text-T-900">اطلاعات ارسال و پرداخت</h2>

    <div class="mt-6">
      <DashboardOrdersInfoGrid :items="items" />
    </div>

    <!-- Status progress -->
    <div class="mt-6">
      <DashboardOrdersProgressBar
        :tone="meta.tone"
        :percent="meta.progress"
      />
      <div class="mt-3 flex items-center justify-center">
        <DashboardOrdersStatusChip :label="meta.label" :tone="meta.tone" :icon="meta.icon" />
      </div>
    </div>

    <!-- Shipping tracking -->
    <div v-if="isShipping" class="mt-6 flex flex-col gap-3">
      <div class="rounded-xl bg-indigo-50/70 p-4">
        <div class="flex items-center justify-between gap-3">
          <span class="text-[12px] text-T-600">کد تحویل سفارش</span>
          <span class="flex items-center gap-2 text-[13px] font-bold text-T-900">
            {{ toPersianDigits(order.deliveryCode ?? '') }}
            <IconBox class="size-4 text-T-500" />
          </span>
        </div>
        <p class="mt-1.5 text-[11.5px] leading-[20px] text-T-600">
          کد تحویل سفارش را همراه داشته باشید و هنگام تحویل به مامور ارسال تحویل دهید.
        </p>
      </div>

      <div class="rounded-xl bg-indigo-50/70 p-4">
        <div class="flex items-center justify-between gap-3">
          <span class="text-[12px] text-T-600">کد پیگیری مرسوله</span>
          <DashboardOrdersCopyValue :value="toPersianDigits(order.postalTracking ?? '')" :copy-value="order.postalTracking" />
        </div>
        <div class="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <p class="text-[11.5px] leading-[20px] text-T-600">
            با کد پیگیری زیر می‌توانید از طریق سامانه رهگیری پست، وضعیت ارسال مرسوله خود را پیگیری کنید.
          </p>
          <a
            href="https://tracking.post.ir"
            target="_blank"
            rel="noopener"
            class="inline-flex shrink-0 items-center gap-1 text-[11.5px] font-semibold text-primary transition-colors hover:text-R-400"
          >
            سامانه رهگیری پست
            <IconArrowLeft class="size-3.5" />
          </a>
        </div>
      </div>
    </div>

    <!-- Awaiting payment -->
    <div v-if="isAwaitingPayment && order.payment" class="mt-6 flex flex-col gap-5">
      <DashboardOrdersAlertNote>
        پرداخت شما کامل نشده و ۳۰ ساعت دیگر مهلت دارید. برای ثبت نهایی، پرداخت خود را کامل کنید.
      </DashboardOrdersAlertNote>

      <div class="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <DashboardOrdersProgressRing :percent="order.payment.percent" label="پرداخت شده" />

        <div class="flex flex-col gap-3 text-[12.5px] text-T-600">
          <span>
            مبلغ سفارش:
            <b class="font-bold text-T-900">{{ formatPriceFa(order.payment.total) }}</b> تومان
          </span>
          <span>
            مبلغ پرداخت‌شده:
            <b class="font-bold text-T-900">{{ formatPriceFa(order.payment.paid) }}</b> تومان
          </span>
        </div>
      </div>

      <NuxtLink
        :to="`/dashboard/orders/${order.id}/pay`"
        class="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-primary bg-T-50 px-5 text-[12.5px] font-bold text-primary transition-colors hover:bg-R-50"
      >
        ادامه پرداخت
        <IconArrowLeft class="size-4" />
      </NuxtLink>
    </div>

    <!-- Actions -->
    <div v-if="canCancel || canReturn" class="mt-6 flex justify-end">
      <button
        v-if="canCancel"
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-T-50 px-5 text-[12.5px] font-bold text-primary transition-colors hover:bg-R-50"
        @click="emit('cancel')"
      >
        لغو سفارش
      </button>

      <NuxtLink
        v-else
        :to="`/dashboard/orders/${order.id}/return`"
        class="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-T-50 px-5 text-[12.5px] font-bold text-primary transition-colors hover:bg-R-50"
      >
        <IconTruckDelivery class="size-4" />
        درخواست مرجوعی کالا
      </NuxtLink>
    </div>
  </section>
</template>
