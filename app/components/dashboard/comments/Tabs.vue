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
  <div class="flex items-center gap-8 border-b-2 border-T-300">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="relative shrink-0 pb-3 pt-1 transition-colors"
      :class="tab.key === modelValue ? 'text-primary' : 'text-T-600 hover:text-T-700'"
      @click="emit('update:modelValue', tab.key)"
    >
      <UiTypography as="span" size="lg" weight="medium" color="inherit">
        {{ tab.label }} ({{ toPersianDigits(tab.count) }})
      </UiTypography>
      <span
        v-if="tab.key === modelValue"
        class="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-primary"
      />
    </button>
  </div>
</template>
