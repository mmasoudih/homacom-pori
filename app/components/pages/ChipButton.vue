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
import orderBagIcon from '../../../public/icons/faq-order-bag.svg?raw'
import paymentCardIcon from '../../../public/icons/faq-payment-card.svg?raw'
import shippingTruckIcon from '../../../public/icons/faq-shipping-truck.svg?raw'
import returnArrowIcon from '../../../public/icons/faq-return-arrow.svg?raw'
import accountUserIcon from '../../../public/icons/faq-account-user.svg?raw'
import warrantyTagIcon from '../../../public/icons/faq-warranty-tag.svg?raw'
import productsBoxIcon from '../../../public/icons/faq-products-box.svg?raw'
import guaranteeMobileIcon from '../../../public/icons/guarantee-mobile.svg?raw'
import guaranteeLaptopIcon from '../../../public/icons/guarantee-laptop.svg?raw'
import guaranteeWatchIcon from '../../../public/icons/guarantee-watch.svg?raw'
import guaranteeHeadphonesIcon from '../../../public/icons/guarantee-headphones.svg?raw'
import guaranteeGamepadIcon from '../../../public/icons/guarantee-gamepad.svg?raw'
import guaranteeDisplayIcon from '../../../public/icons/guarantee-display.svg?raw'
import guaranteeSpeakersIcon from '../../../public/icons/guarantee-speakers.svg?raw'
import type { ChipItem } from './ChipRow.vue'

const props = withDefaults(defineProps<{
  item: ChipItem
  active?: boolean
  /** Fill the parent cell (used by the desktop grid so the gap is the true grid gap). */
  fill?: boolean
  /** Color applied to the chip label and icon. Defaults to inheriting the button state color. */
  contentColor?: 'inherit' | 'default'
}>(), {
  active: false,
  fill: false,
  contentColor: 'inherit',
})

const emit = defineEmits<{
  select: []
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
  mobile: guaranteeMobileIcon,
  laptop: guaranteeLaptopIcon,
  watch: guaranteeWatchIcon,
  headphones: guaranteeHeadphonesIcon,
  gamepad: guaranteeGamepadIcon,
  display: guaranteeDisplayIcon,
  speakers: guaranteeSpeakersIcon,
}
</script>

<template>
  <button
    type="button"
    class="flex h-[70px] w-[112px] shrink-0 flex-col items-center justify-center gap-2 rounded-[20px] border px-4 py-4 transition-colors lg:h-[97px]"
    :class="[
      props.fill ? 'lg:w-full' : 'lg:w-[135.43px]',
      props.active
        ? 'border-primary bg-R-50'
        : 'border-T-400 bg-T-50 hover:border-T-500',
      props.contentColor === 'default'
        ? (props.active ? 'text-R-300' : 'text-T-900')
        : (props.active ? 'text-primary' : 'text-T-700'),
    ]"
    @click="emit('select')"
  >
    <span
      v-if="svgIconMap[props.item.icon]"
      class="[&>svg]:block [&>svg]:size-5 lg:[&>svg]:size-6"
      aria-hidden="true"
      v-html="svgIconMap[props.item.icon]"
    />
    <component
      :is="iconMap[props.item.icon] ?? IconPackage"
      v-else
      class="size-5 lg:size-6"
    />
    <UiTypography
      as="span"
      size="xs"
      weight="medium"
      color="inherit"
      class="leading-[18px] lg:text-[14px]"
    >
      {{ props.item.label }}
    </UiTypography>
  </button>
</template>
