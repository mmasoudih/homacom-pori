<script setup lang="ts">
import { formatPriceFa } from '~/utils/format'

defineProps<{
  total: number
}>()

const emit = defineEmits<{
  checkout: []
}>()
</script>

<template>
  <!-- Fixed CTA above the floating mobile nav (68px + 16px offset + 19px gap). -->
  <div
    class="fixed inset-x-0 bottom-0 z-[66] border-t border-T-400 bg-T-50/90 pb-[103px] pt-[13px] backdrop-blur-[7.5px] lg:hidden"
  >
    <div class="flex items-center justify-between gap-3 px-4">
      <button
        type="button"
        class="flex h-[42px] min-w-0 max-w-[217px] flex-1 shrink items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-R-400"
        @click="emit('checkout')"
      >
        <UiTypography as="span" size="lg" weight="bold" color="white">ثبت سفارش</UiTypography>
      </button>

      <div class="flex shrink-0 flex-col gap-0.5">
        <UiTypography as="span" size="sm" weight="semibold" color="subtle">جمع کل:</UiTypography>
        <div class="flex items-baseline gap-1.5">
          <UiTypography as="span" size="xl" weight="medium" leading="none">
            {{ formatPriceFa(total) }}
          </UiTypography>
          <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
            تومان
          </UiTypography>
        </div>
      </div>
    </div>
  </div>
</template>
