<script setup lang="ts">
import { formatPriceFa } from '~/utils/format'

defineProps<{
  rows: Array<{ key: string; label: string; value: number }>
  total: number
}>()

const emit = defineEmits<{
  checkout: []
}>()

const rowIcons: Record<string, string> = {
  items: '/icons/cart/summary-items.svg',
  discount: '/icons/cart/summary-discount.svg',
  insurance: '/icons/cart/summary-insurance.svg',
  services: '/icons/cart/summary-services.svg',
}
</script>

<template>
  <aside class="flex w-[324px] shrink-0 flex-col gap-6 rounded-[12px] border border-T-400 bg-T-50 p-5">
    <div class="flex flex-col gap-[6px]">
      <div
        v-for="row in rows"
        :key="row.key"
        class="flex h-[45px] items-center gap-1.5 border-b border-T-300 last:border-b-0"
      >
        <img :src="rowIcons[row.key]" alt="" class="size-5 shrink-0">

        <UiTypography as="span" size="md" color="muted">{{ row.label }}:</UiTypography>

        <span class="ms-auto flex items-baseline gap-1.5">
          <UiTypography as="span" size="lg" weight="medium" leading="none">
            {{ formatPriceFa(row.value) }}
          </UiTypography>
          <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
            تومان
          </UiTypography>
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex min-h-[26px] items-center justify-between gap-2">
        <UiTypography as="span" size="lg" weight="semibold">جمع کل</UiTypography>

        <span class="flex items-baseline gap-1.5">
          <UiTypography as="span" size="2xl" weight="bold" leading="none">
            {{ formatPriceFa(total) }}
          </UiTypography>
          <UiTypography as="span" size="md" weight="semibold" leading="none" color="subtle">
            تومان
          </UiTypography>
        </span>
      </div>

      <button
        type="button"
        class="flex h-[42px] w-full items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-R-400"
        @click="emit('checkout')"
      >
        <UiTypography as="span" size="lg" weight="bold" color="white">ثبت سفارش</UiTypography>
      </button>
    </div>
  </aside>
</template>
