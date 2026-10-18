<script setup lang="ts">
import type { CartItem } from '~/data/cart'

defineProps<{
  color: CartItem['color']
  warranty: string
  installment?: string
  seller?: string
}>()
</script>

<template>
  <!-- Color / warranty / installment rows. Icon at the start (right in RTL). -->
  <div class="flex flex-col gap-1.5">
    <div class="flex h-6 items-center gap-1.5">
      <img src="/icons/color-swatch.svg" alt="" class="size-4 shrink-0 lg:size-5">
      <UiTypography as="span" size="xsMd" color="muted" class="leading-[18px]">رنگ:</UiTypography>
      <UiTypography as="span" size="xsMd" class="leading-[18px]">{{ color.name }}</UiTypography>
    </div>

    <div class="flex h-6 items-center gap-1.5">
      <img src="/icons/warranty.svg" alt="" class="size-4 shrink-0 lg:size-5">
      <UiTypography as="span" size="xsMd" color="muted" class="leading-[18px]">گارانتی:</UiTypography>
      <UiTypography as="span" size="xsMd" class="leading-[18px]">{{ warranty }}</UiTypography>
    </div>

    <div v-if="seller" class="flex h-6 items-center gap-1.5">
      <img src="/icons/store.svg" alt="" class="size-4 shrink-0 lg:size-5">
      <UiTypography as="span" size="xsMd" color="muted" class="leading-[18px]">فروشنده:</UiTypography>
      <UiTypography as="span" size="xsMd" class="leading-[18px]">{{ seller }}</UiTypography>
    </div>

    <div v-if="installment" class="flex h-6 items-center gap-1.5">
      <img src="/icons/cart/coins-muted.svg" alt="" class="size-4 shrink-0 lg:size-5">
      <UiTypography as="span" size="xsMd" color="muted" class="leading-[18px]">اقساط:</UiTypography>
      <UiTypography as="span" size="xsMd" class="leading-[18px]">{{ installment }}</UiTypography>
      <UiTypography
        as="span"
        size="md"
        weight="semibold"
        leading="none"
        class="hidden text-[#5A6AFF] lg:inline"
      >اقساطی</UiTypography>
    </div>
  </div>
</template>
