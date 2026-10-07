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
import orderBagIcon from '../../../public/icons/faq-order-bag.svg?raw'
import paymentCardIcon from '../../../public/icons/faq-payment-card.svg?raw'
import shippingTruckIcon from '../../../public/icons/faq-shipping-truck.svg?raw'
import returnArrowIcon from '../../../public/icons/faq-return-arrow.svg?raw'
import accountUserIcon from '../../../public/icons/faq-account-user.svg?raw'
import warrantyTagIcon from '../../../public/icons/faq-warranty-tag.svg?raw'
import productsBoxIcon from '../../../public/icons/faq-products-box.svg?raw'

export interface ChipItem {
  label: string
  icon: string
  /** Stable identifier used to match the chip against content. */
  id?: string
  /** Desktop-only chip (hidden below `lg`). */
  desktopOnly?: boolean
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

/** Icons sourced from `public/icons` and inlined so `currentColor` follows the text color. */
const svgIconMap: Record<string, string> = {
  package: orderBagIcon,
  credit: paymentCardIcon,
  delivery: shippingTruckIcon,
  return: returnArrowIcon,
  user: accountUserIcon,
  tag: warrantyTagIcon,
  products: productsBoxIcon,
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
      class="flex h-[97px] min-w-[112px] shrink-0 flex-col items-center justify-center gap-2 rounded-[20px] border px-4 py-4 transition-colors lg:w-[135.43px] lg:min-w-0"
      :class="[
        i === active
          ? 'border-primary bg-R-50 text-primary'
          : 'border-T-400 bg-T-50 text-T-700 hover:border-T-500',
        item.desktopOnly ? 'hidden lg:flex' : '',
      ]"
      @click="select(i)"
    >
      <span
        v-if="svgIconMap[item.icon]"
        class="[&>svg]:block [&>svg]:size-6"
        aria-hidden="true"
        v-html="svgIconMap[item.icon]"
      />
      <component
        :is="iconMap[item.icon] ?? IconPackage"
        v-else
        class="size-6"
      />
      <UiTypography as="span" size="lg" weight="medium" color="inherit" class="leading-[18px]">
        {{ item.label }}
      </UiTypography>
    </button>
  </div>
</template>
