<script setup lang="ts">
import type { Order } from '~/data/orders'
import { paymentStatusMeta } from '~/data/orders'
import { toPersianDigits } from '~/utils/format'
import { gatewayLabel } from '~/utils/payment'

const props = defineProps<{
  order: Order
}>()

const items = computed<Array<{ label: string, value: string, wide?: boolean }>>(() => {
  const rows: Array<{ label: string, value: string, wide?: boolean }> = [
    { label: 'کد سفارش', value: toPersianDigits(props.order.code) },
    { label: 'تاریخ ثبت سفارش', value: props.order.date },
    { label: 'تحویل گیرنده', value: props.order.receiver.name },
    { label: 'شماره تلفن همراه', value: toPersianDigits(props.order.receiver.phone) },
  ]

  if (props.order.paymentStatus)
    rows.push({ label: 'وضعیت پرداخت', value: paymentStatusMeta[props.order.paymentStatus].label })

  // `payment_method` reads `manual` after settlement; `gate` is the truth.
  if (props.order.gate)
    rows.push({ label: 'درگاه پرداخت', value: gatewayLabel(props.order.gate) })

  rows.push({ label: 'آدرس', value: toPersianDigits(props.order.receiver.address), wide: true })

  return rows
})
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
    <UiTypography as="h2" size="xl" weight="semibold" class="text-right">اطلاعات کلی سفارش:</UiTypography>
    <div class="mt-6">
      <DashboardOrdersInfoGrid :items="items" />
    </div>
  </section>
</template>
