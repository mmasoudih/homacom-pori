<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconHourglassHigh,
  IconTruck,
  IconWallet,
} from '@tabler/icons-vue'
import type { StatusIcon, StatusTone } from '~/data/orders'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  label: string
  tone: StatusTone
  icon?: StatusIcon
  variant?: 'plain' | 'soft'
  class?: string
}>(), {
  icon: undefined,
  variant: 'plain',
  class: '',
})

const icons: Record<StatusIcon, Component> = {
  hourglass: IconHourglassHigh,
  wallet: IconWallet,
  truck: IconTruck,
  check: IconCircleCheckFilled,
  x: IconCircleXFilled,
}

const toneText: Record<StatusTone, string> = {
  amber: 'text-amber-500',
  sky: 'text-sky-500',
  emerald: 'text-emerald-500',
  red: 'text-primary',
}

const toneSoft: Record<StatusTone, string> = {
  amber: 'bg-amber-50 text-amber-500',
  sky: 'bg-sky-50 text-sky-500',
  emerald: 'bg-emerald-50 text-emerald-500',
  red: 'bg-R-50 text-primary',
}

const iconComponent = computed<Component | null>(() => (props.icon ? icons[props.icon] : null))
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5 text-[12.5px] font-semibold',
      variant === 'soft' && 'rounded-full px-3 py-1.5',
      variant === 'soft' ? toneSoft[tone] : toneText[tone],
      props.class,
    )"
  >
    <component :is="iconComponent" v-if="iconComponent" class="size-4 shrink-0" />
    {{ label }}
  </span>
</template>
