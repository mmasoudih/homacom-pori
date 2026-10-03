<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconHourglassHigh,
  IconRefresh,
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
  refresh: IconRefresh,
}

const toneText: Record<StatusTone, string> = {
  amber: 'text-[#FF9800]',
  sky: 'text-[#4E60FF]',
  emerald: 'text-[#2EC144]',
  red: 'text-primary',
}

const toneSoft: Record<StatusTone, string> = {
  amber: 'bg-[#FFF4E5] text-[#FF9800]',
  sky: 'bg-[#EEF0FF] text-[#4E60FF]',
  emerald: 'bg-[#E9F9ED] text-[#2EC144]',
  red: 'bg-R-50 text-primary',
}

/**
 * Plain order-status chips use the dedicated coloured icons shipped in
 * `/public/icons`, each with its own label colour and weight.
 */
const plainIcons: Partial<Record<StatusIcon, { src: string, text: string, weight: 'semibold' | 'bold' }>> = {
  hourglass: { src: '/icons/status-hourglass.svg', text: 'text-[#FF9E02]', weight: 'semibold' },
  wallet: { src: '/icons/status-wallet.svg', text: 'text-[#CF982C]', weight: 'semibold' },
  truck: { src: '/icons/status-truck.svg', text: 'text-[#4E60FF]', weight: 'bold' },
  check: { src: '/icons/status-check.svg', text: 'text-[#2EC144]', weight: 'bold' },
  x: { src: '/icons/status-x.svg', text: 'text-primary', weight: 'semibold' },
  refresh: { src: '/icons/status-refresh.svg', text: 'text-[#FF9E02]', weight: 'semibold' },
}

const plain = computed(() => (props.variant === 'plain' && props.icon ? plainIcons[props.icon] : undefined))

const colorClass = computed(() => {
  if (plain.value) return plain.value.text
  return props.variant === 'soft' ? toneSoft[props.tone] : toneText[props.tone]
})

const iconComponent = computed<Component | null>(() => (props.icon ? icons[props.icon] : null))
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5',
      variant === 'soft' && 'rounded-full px-3 py-1.5',
      colorClass,
      props.class,
    )"
  >
    <img
      v-if="plain"
      :src="plain.src"
      alt=""
      class="size-5 shrink-0"
      aria-hidden="true"
    >
    <component
      :is="iconComponent"
      v-else-if="iconComponent"
      class="size-4 shrink-0"
    />

    <UiTypography
      as="span"
      :size="variant === 'soft' ? 'md' : 'lg'"
      :weight="plain?.weight ?? 'semibold'"
      color="inherit"
    >
      {{ label }}
    </UiTypography>
  </span>
</template>
