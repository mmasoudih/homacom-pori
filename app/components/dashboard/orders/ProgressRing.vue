<script setup lang="ts">
import type { StatusTone } from '~/data/orders'
import { toPersianDigits } from '~/utils/format'

const props = withDefaults(defineProps<{
  percent: number
  tone?: StatusTone
  label?: string
  size?: number
}>(), {
  tone: 'amber',
  label: '',
  size: 96,
})

const radius = 42
const circumference = 2 * Math.PI * radius

const toneStroke: Record<StatusTone, string> = {
  amber: 'text-amber-400',
  sky: 'text-sky-500',
  emerald: 'text-emerald-500',
  red: 'text-primary',
}

const clamped = computed(() => Math.min(100, Math.max(0, props.percent)))
const dashOffset = computed(() => circumference * (1 - clamped.value / 100))
</script>

<template>
  <div class="relative inline-flex shrink-0 items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg class="size-full -rotate-90" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        :r="radius"
        fill="none"
        stroke="currentColor"
        class="text-T-300"
        stroke-width="9"
      />
      <circle
        cx="50"
        cy="50"
        :r="radius"
        fill="none"
        stroke="currentColor"
        :class="toneStroke[tone]"
        stroke-width="9"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>

    <div class="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
      <span class="text-[15px] font-extrabold leading-none text-T-900">
        {{ toPersianDigits(Math.round(clamped)) }}٪
      </span>
      <span v-if="label" class="text-[9.5px] text-T-600">{{ label }}</span>
    </div>
  </div>
</template>
