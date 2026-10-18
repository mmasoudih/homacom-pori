<script setup lang="ts">
import type { CartInsurance } from '~/data/cart'

defineProps<{
  insurance: CartInsurance
}>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <!-- Selected insurance: icon (desktop), details, divider, remove chip. -->
  <div class="flex items-center gap-2 rounded-[8px] border border-dashed border-[#CDD2FF] bg-[#F7F8FE] p-2.5 lg:gap-5">
    <div
      class="hidden size-[39px] shrink-0 items-center justify-center rounded-[10px] border border-[#DEE1FF] bg-[#EAECFF] lg:flex"
    >
      <img src="/icons/cart/insurance-glyph.svg" alt="" class="size-[19px]">
    </div>

    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <div class="flex items-center gap-2">
        <UiTypography as="span" size="mdLg" weight="medium" class="truncate">
          {{ insurance.name }}
        </UiTypography>
        <img src="/icons/cart/insurance-info.svg" alt="" class="size-[18px] shrink-0">
      </div>

      <CartPrice
        size="sm"
        :price="insurance.price"
        :old-price="insurance.oldPrice"
        :discount="insurance.discount"
      />
    </div>

    <span class="hidden h-[51px] w-px shrink-0 bg-T-400 lg:block" aria-hidden="true" />

    <button
      type="button"
      class="flex h-[29px] shrink-0 items-center gap-1.5 rounded-[8px] border border-R-300 bg-T-50 px-3 transition-colors hover:bg-R-10"
      @click="emit('remove')"
    >
      <UiTypography as="span" size="2xs" weight="medium" color="primary" class="lg:text-[11.25px]">
        حذف بیمه
      </UiTypography>
      <img src="/icons/cart/insurance-remove.svg" alt="" class="size-3.5">
    </button>
  </div>
</template>
