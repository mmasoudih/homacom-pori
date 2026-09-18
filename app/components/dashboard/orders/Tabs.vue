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
  <div class="flex items-center justify-between gap-3 overflow-x-auto border-b border-T-400">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="relative flex shrink-0 items-center gap-1.5 pb-3 pt-1 text-[13px] font-semibold transition-colors sm:text-[13.5px]"
      :class="tab.key === modelValue ? 'text-primary' : 'text-T-600 hover:text-T-800'"
      @click="select(tab.key)"
    >
      {{ tab.label }}
      <span
        class="rounded-md px-1.5 py-0.5 text-[10.5px] font-bold"
        :class="tab.key === modelValue ? 'bg-R-50 text-primary' : 'bg-T-200 text-T-600'"
      >
        {{ toPersianDigits(tab.count) }}
      </span>
      <span
        v-if="tab.key === modelValue"
        class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
      />
    </button>
  </div>
</template>
