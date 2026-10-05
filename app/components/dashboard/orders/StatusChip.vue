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
  /** Render only the status icon, without the label or pill background. */
  iconOnly?: boolean
  /** Optional override for the plain status image (falls back to the shared mapping). */
  imgSrc?: string
  class?: string
}>(), {
  icon: undefined,
  variant: 'plain',
  iconOnly: false,
  imgSrc: undefined,
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
  gold: 'text-[#CF982C]',
  sky: 'text-[#4E60FF]',
  emerald: 'text-[#2EC144]',
  red: 'text-primary',
}

const toneSoft: Record<StatusTone, string> = {
  amber: 'bg-[#FFF4E5] text-[#FF9800]',
  gold: 'bg-[#FFF4E5] text-[#CF982C]',
  sky: 'bg-[#EEF0FF] text-[#4E60FF]',
  emerald: 'bg-[#E9F9ED] text-[#2EC144]',
  red: 'bg-R-50 text-primary',
}

/**
 * Plain order-status chips use the dedicated coloured icons shipped in
 * `/public/icons`, each with its own label colour and weight.
 */
const plainIcons: Partial<Record<StatusIcon, { src: string, text: string, weight: 'semibold' | 'bold' }>> = {
  hourglass: { src: '/icons/status-processing.svg', text: 'text-[#FF9E02]', weight: 'semibold' },
  wallet: { src: '/icons/status-wallet.svg', text: 'text-[#CF982C]', weight: 'semibold' },
  truck: { src: '/icons/status-truck.svg', text: 'text-[#4E60FF]', weight: 'bold' },
  check: { src: '/icons/status-check.svg', text: 'text-[#2EC144]', weight: 'bold' },
  x: { src: '/icons/status-x.svg', text: 'text-primary', weight: 'semibold' },
  refresh: { src: '/icons/status-refresh.svg', text: 'text-[#FF9E02]', weight: 'semibold' },
}

const plain = computed(() => (props.variant === 'plain' && props.icon ? plainIcons[props.icon] : undefined))

const iconOnlyImage = computed(() =>
  props.iconOnly && props.icon ? plainIcons[props.icon]?.src : undefined,
)

const colorClass = computed(() => {
  if (props.iconOnly) return toneText[props.tone]
  if (plain.value) return plain.value.text
  return props.variant === 'soft' ? toneSoft[props.tone] : toneText[props.tone]
})

const iconComponent = computed<Component | null>(() => (props.icon ? icons[props.icon] : null))
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5',
      variant === 'soft' && !iconOnly && 'rounded-full px-3 py-1.5',
      colorClass,
      props.class,
    )"
  >
    <UiTypography
      v-if="!iconOnly"
      as="span"
      size="md"
      :weight="plain?.weight ?? 'semibold'"
      color="inherit"
    >
      {{ label }}
    </UiTypography>

    <img
      v-if="plain"
      :src="props.imgSrc ?? plain.src"
      alt=""
      class="size-[32px] shrink-0"
      aria-hidden="true"
    >
    <img
      v-else-if="iconOnlyImage"
      :src="iconOnlyImage"
      alt=""
      class="size-[18px] shrink-0"
      aria-hidden="true"
    >
    <img
      v-else-if="props.imgSrc"
      :src="props.imgSrc"
      alt=""
      class="size-[18px] shrink-0"
      aria-hidden="true"
    >
    <component
      :is="iconComponent"
      v-else-if="iconComponent"
      class="size-4 shrink-0"
    />
  </span>
</template>
