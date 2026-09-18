<script setup lang="ts">
import {
  IconAlertTriangle,
  IconCircleCheckFilled,
  IconInfoCircle,
} from '@tabler/icons-vue'
import type { StatusTone } from '~/data/orders'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  tone?: StatusTone
  variant?: 'exclamation' | 'info' | 'check'
  class?: string
}>(), {
  tone: 'amber',
  variant: 'exclamation',
  class: '',
})

const toneSoft: Record<StatusTone, string> = {
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  red: 'bg-R-50 text-primary',
}

const iconComponent = computed(() => {
  if (props.variant === 'check') return IconCircleCheckFilled
  if (props.variant === 'info') return IconInfoCircle
  return IconAlertTriangle
})
</script>

<template>
  <div :class="cn('flex items-start gap-2 rounded-xl px-4 py-3 text-[12px] leading-[22px]', toneSoft[tone], props.class)">
    <component :is="iconComponent" class="mt-0.5 size-4 shrink-0" />
    <div class="min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>
