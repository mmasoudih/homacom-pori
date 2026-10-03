<script setup lang="ts">
import type { OrderTab } from '~/data/orders'
import { toPersianDigits } from '~/utils/format'

defineProps<{
  tabs: OrderTab[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function select(key: string) {
  emit('update:modelValue', key)
}
</script>

<template>
  <UiTypography
    as="div"
    size="lg"
    weight="medium"
    color="inherit"
    class="flex items-center justify-start gap-8 overflow-x-auto border-b border-T-400"
  >
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="relative flex shrink-0 items-center gap-1.5 pb-3 pt-1 transition-colors"
      :class="tab.key === modelValue ? 'text-primary' : 'text-T-600 hover:text-T-800'"
      @click="select(tab.key)"
    >
      {{ tab.label }}
      <UiTypography as="span" size="sm" weight="semibold" color="inherit">({{ toPersianDigits(tab.count) }})</UiTypography>
      <span
        v-if="tab.key === modelValue"
        class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
      />
    </button>
  </UiTypography>
</template>
