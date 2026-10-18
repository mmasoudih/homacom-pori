<script setup lang="ts">
import { toPersianDigits } from '~/utils/format'

defineProps<{
  count: number
}>()

const emit = defineEmits<{
  removeAll: []
}>()
</script>

<template>
  <div
    class="flex h-[62px] items-center justify-between gap-3 bg-T-50/90 px-4 shadow-[0_0_6px_rgba(0,0,0,0.08)] backdrop-blur-[7.5px]"
  >
    <div class="flex items-baseline gap-1.5">
      <UiTypography as="h1" size="xl" weight="bold">سبد خرید</UiTypography>
      <UiTypography as="span" size="md" color="muted">
        ({{ toPersianDigits(count) }} کالا)
      </UiTypography>
    </div>

    <button
      v-if="count > 0"
      type="button"
      class="flex items-center gap-1"
      @click="emit('removeAll')"
    >
      <UiTypography as="span" size="xs" weight="semibold" color="primary">حذف همه</UiTypography>
      <img src="/icons/cart/trash-all.svg" alt="" class="h-[14.333px] w-[13px]">
    </button>
  </div>
</template>
