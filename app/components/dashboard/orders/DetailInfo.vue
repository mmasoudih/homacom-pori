<script setup lang="ts">
import type { Order } from '~/data/orders'
import { toPersianDigits } from '~/utils/format'

const props = defineProps<{
  order: Order
}>()

const items = computed(() => [
  { label: 'کد سفارش', value: toPersianDigits(props.order.code) },
  { label: 'تاریخ ثبت سفارش', value: props.order.date },
  { label: 'تحویل گیرنده', value: props.order.receiver.name },
  { label: 'شماره تلفن همراه', value: toPersianDigits(props.order.receiver.phone) },
  { label: 'آدرس', value: toPersianDigits(props.order.receiver.address), wide: true },
])
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
    <UiTypography as="h2" size="xl" weight="semibold" class="text-right">اطلاعات کلی سفارش:</UiTypography>
    <div class="mt-6">
      <DashboardOrdersInfoGrid :items="items" />
    </div>
  </section>
</template>
