<script setup lang="ts">
import type { StatusTone } from '~/data/orders'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  tone: StatusTone
  percent: number
  label?: string
  class?: string
}>(), {
  label: '',
  class: '',
})

const toneBg: Record<StatusTone, string> = {
  amber: 'bg-amber-400',
  sky: 'bg-sky-500',
  emerald: 'bg-emerald-500',
  red: 'bg-primary',
}

const clamped = computed(() => Math.min(100, Math.max(0, props.percent)))
</script>

<template>
  <div :class="cn('flex flex-col gap-2', props.class)">
    <span v-if="label" class="text-[11.5px] text-T-600">{{ label }}</span>

    <div class="relative h-[6px] w-full rounded-full bg-T-300">
      <div
        class="absolute inset-y-0 start-0 rounded-full transition-[width] duration-500"
        :class="toneBg[tone]"
        :style="{ width: `${clamped}%` }"
      />
      <span
        class="absolute top-1/2 size-[11px] -translate-y-1/2 rounded-full border-2 border-T-50 transition-[inset-inline-start] duration-500"
        :class="toneBg[tone]"
        :style="{ insetInlineStart: `calc(${clamped}% - 5.5px)` }"
      />
    </div>
  </div>
</template>
