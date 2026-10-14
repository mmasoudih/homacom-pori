<script setup lang="ts">
import { searchColorOptions } from '~/data/search'

withDefaults(defineProps<{
  modelValue: string | null
  class?: string
}>(), {
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const options = searchColorOptions
</script>

<template>
  <div :class="['grid grid-cols-3 gap-x-1 gap-y-[10px]', $props.class]">
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      class="flex h-[60px] w-full flex-col items-center justify-center gap-1 rounded-[14px] border bg-T-50 transition-colors"
      :class="modelValue === option.id ? 'border-primary' : 'border-T-400 hover:border-T-500'"
      :aria-pressed="modelValue === option.id"
      @click="emit('update:modelValue', modelValue === option.id ? null : option.id)"
    >
      <!-- Border box for the swatch; the colour fills it with an inner inset. -->
      <span
        class="flex size-[28px] shrink-0 items-center justify-center rounded-[8px] border border-T-400 p-[2px]"
        aria-hidden="true"
      >
        <span
          class="size-full rounded-[6px]"
          :style="{ background: option.swatch }"
        />
      </span>
      <UiTypography
        as="span"
        size="md"
        :weight="modelValue === option.id ? 'bold' : 'medium'"
        :class="modelValue === option.id ? 'text-primary' : 'text-T-700'"
      >
        {{ option.label }}
      </UiTypography>
    </button>
  </div>
</template>
