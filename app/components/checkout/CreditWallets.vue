<script setup lang="ts">
import type { CreditProvider } from '~/data/checkout'
import { formatPriceFa } from '~/utils/format'

defineProps<{
  providers: CreditProvider[]
  selectedId: string
}>()

const emit = defineEmits<{
  toggle: [id: string]
}>()

const logos: Record<string, string> = {
  balon: '/icons/cart/credit-balon.svg',
  ewano: '/icons/cart/credit-ewano.svg',
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="provider in providers"
      :key="provider.id"
      class="relative h-[83px] rounded-[12px] border p-4 transition-colors lg:h-[83px] lg:px-5 lg:py-0"
      :class="provider.id === selectedId ? 'border-R-300' : 'border-T-300'"
    >
      <button
        type="button"
        role="radio"
        :aria-checked="provider.id === selectedId"
        class="flex h-full w-full items-center gap-2.5 text-start"
        @click="emit('toggle', provider.id)"
      >
        <img
          :src="provider.id === selectedId
            ? '/icons/cart/radio-selected.svg'
            : '/icons/cart/radio-unselected.svg'"
          alt=""
          class="size-[18px] shrink-0"
        >

        <!-- Title + «موجودی» row (Figma Frame 3547) -->
        <span class="flex h-[46px] min-w-0 flex-1 flex-col gap-2 pe-[76px] lg:h-[51px] lg:pe-[92px]">
          <UiTypography as="span" size="xl" weight="medium" class="leading-[17px] lg:leading-[19px]">
            {{ provider.label }}
          </UiTypography>

          <span class="flex items-baseline gap-1">
            <UiTypography as="span" size="md" weight="regular" color="muted" class="leading-[14px] lg:leading-[15px]">
              موجودی:
            </UiTypography>
            <UiTypography as="span" size="lg" weight="medium" class="leading-[15px] lg:leading-[17px]">
              {{ formatPriceFa(provider.balance) }}
            </UiTypography>
            <UiTypography as="span" size="sm" weight="semibold" color="subtle" class="leading-[13px] lg:leading-[14px]">
              تومان
            </UiTypography>
          </span>
        </span>
      </button>

      <img
        :src="logos[provider.id]"
        alt=""
        class="pointer-events-none absolute left-4 top-1/2 size-[68px] -translate-y-1/2 lg:left-5 lg:size-[84px]"
      >
    </div>
  </div>
</template>
