<script setup lang="ts">
import {
  IconHeadphones,
  IconDeviceWatch,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconDeviceGamepad2,
  IconCreditCard,
  IconTruckDelivery,
  IconArrowBackUp,
  IconUser,
  IconTag,
  IconPackage,
  IconSpeakerphone,
  IconKeyboard,
  IconWallet,
} from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

export interface ChipItem {
  label: string
  icon: string
}

const props = withDefaults(defineProps<{
  items: ChipItem[]
  active?: number
  desktopGrid?: boolean
  class?: string
}>(), {
  active: 0,
  desktopGrid: false,
  class: '',
})

const emit = defineEmits<{
  select: [index: number]
}>()

const iconMap: Record<string, typeof IconHeadphones> = {
  headphones: IconHeadphones,
  watch: IconDeviceWatch,
  laptop: IconDeviceLaptop,
  mobile: IconDeviceMobile,
  display: IconDeviceDesktop,
  gamepad: IconDeviceGamepad2,
  credit: IconCreditCard,
  delivery: IconTruckDelivery,
  return: IconArrowBackUp,
  user: IconUser,
  tag: IconTag,
  package: IconPackage,
  speakers: IconSpeakerphone,
  keyboard: IconKeyboard,
  wallet: IconWallet,
}

function select(i: number) {
  emit('select', i)
}
</script>

<template>
  <div
    :class="cn(
      props.desktopGrid
        ? 'flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-7 lg:gap-3 lg:overflow-visible'
        : 'flex gap-3 overflow-x-auto pb-1 lg:flex-wrap lg:justify-center lg:overflow-visible',
      props.class,
    )"
  >
    <button
      v-for="(item, i) in items"
      :key="item.label"
      type="button"
      class="flex min-w-[112px] shrink-0 flex-col items-center gap-2 rounded-[14px] border px-4 py-4 transition-colors lg:min-w-0"
      :class="
        i === active
          ? 'border-primary bg-R-10 text-primary'
          : 'border-T-400 bg-T-50 text-T-700 hover:border-T-500'
      "
      @click="select(i)"
    >
      <component
        :is="iconMap[item.icon] ?? IconPackage"
        class="size-6"
      />
      <span class="text-[13px] font-medium leading-[18px]">
        {{ item.label }}
      </span>
    </button>
  </div>
</template>
