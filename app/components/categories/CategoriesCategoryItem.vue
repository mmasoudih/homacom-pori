<script setup lang="ts">
import { computed } from 'vue'
import {
  IconChevronLeft,
  IconDeviceMobile,
  IconDeviceLaptop,
  IconDeviceWatch,
  IconHeadphones,
  IconDeviceGamepad2,
  IconDeviceDesktop,
  IconUsb,
  IconSpeakerphone,
} from '@tabler/icons-vue'
import type { Category } from '~/data/categories'

const props = defineProps<{
  item: Category
  active?: boolean
  variant: 'root' | 'secondary' | 'tertiary'
}>()

defineEmits<{
  select: []
}>()

const iconMap: Record<string, typeof IconDeviceMobile> = {
  mobile: IconDeviceMobile,
  laptop: IconDeviceLaptop,
  watch: IconDeviceWatch,
  headphones: IconHeadphones,
  gamepad: IconDeviceGamepad2,
  display: IconDeviceDesktop,
  usb: IconUsb,
  speakers: IconSpeakerphone,
}

const Icon = computed(() => (props.item.icon ? iconMap[props.item.icon] : undefined))
const withIcon = computed(() => props.variant === 'root' && Icon.value !== undefined)
const withChevron = computed(() => props.variant === 'root' || props.variant === 'secondary')
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center rounded-[10px] px-4 text-start transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    :class="[
      active ? 'bg-T-200' : 'hover:bg-T-200/60',
      variant === 'root' ? 'h-[56px]' : variant === 'secondary' ? 'h-[54px]' : 'h-[50px]',
    ]"
    data-mega-item
    :data-mega-column="variant"
    @click="$emit('select')"
    @mouseenter="$emit('select')"
  >
    <Icon
      v-if="withIcon"
      class="ml-3 size-[22px] shrink-0"
      :class="active ? 'text-T-800' : 'text-T-700'"
    />
    <span
      class="flex-1 truncate text-[14px]"
      :class="[
        variant === 'tertiary' ? 'font-normal' : 'font-medium',
        active ? 'text-T-900' : 'text-T-900',
      ]"
    >
      {{ item.title }}
    </span>
    <IconChevronLeft v-if="withChevron" class="ms-4 size-4 shrink-0 text-T-600" />
  </button>
</template>