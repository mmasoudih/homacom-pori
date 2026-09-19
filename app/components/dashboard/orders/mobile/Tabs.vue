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
  <div class="flex items-center gap-2 overflow-x-auto">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="shrink-0 whitespace-nowrap text-[11px] transition-colors"
      :class="tab.key === modelValue ? 'font-bold text-primary' : 'text-T-600'"
      @click="select(tab.key)"
    >
      {{ tab.label }} ({{ toPersianDigits(tab.mobileCount ?? tab.count) }})
    </button>
  </div>
</template>
