<script setup lang="ts">
import type { CommentTab } from '~/data/comments'
import { toPersianDigits } from '~/utils/format'

defineProps<{
  tabs: CommentTab[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex items-center gap-5 border-b-2 border-T-300 px-4">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="relative shrink-0 whitespace-nowrap pb-3 pt-3 text-[13px] transition-colors"
      :class="tab.key === modelValue ? 'font-bold text-primary' : 'text-T-500'"
      @click="emit('update:modelValue', tab.key)"
    >
      {{ tab.label }} ({{ toPersianDigits(tab.count) }})
      <span
        v-if="tab.key === modelValue"
        class="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-primary"
      />
    </button>
  </div>
</template>
