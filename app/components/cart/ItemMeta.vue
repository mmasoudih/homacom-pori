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
    <div class="flex items-center gap-1.5">
      <img src="/icons/color-swatch.svg" alt="" class="size-4 shrink-0 lg:size-5">
      <UiTypography as="span" size="xsMd" color="muted" class="leading-[24px]">رنگ:</UiTypography>
      <UiTypography as="span" size="xsMd" class="leading-[24px]">{{ color.name }}</UiTypography>
    </div>

    <div class="flex items-center gap-1.5">
      <img src="/icons/warranty.svg" alt="" class="size-4 shrink-0 lg:size-5">
      <UiTypography as="span" size="xsMd" color="muted" class="leading-[24px]">گارانتی:</UiTypography>
      <UiTypography as="span" size="xsMd" class="leading-[24px]">{{ warranty }}</UiTypography>
    </div>

    <div v-if="seller" class="flex items-center gap-1.5">
      <img src="/icons/store.svg" alt="" class="size-4 shrink-0 lg:size-5">
      <UiTypography as="span" size="xsMd" color="muted" class="leading-[24px]">فروشنده:</UiTypography>
      <UiTypography as="span" size="xsMd" class="leading-[24px]">{{ seller }}</UiTypography>
    </div>

    <div v-if="installment" class="flex items-center gap-1.5">
      <span
        class="size-4 shrink-0 bg-T-700 [mask-image:url(/icons/coins-front.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] lg:size-5"
        aria-hidden="true"
      />
      <UiTypography as="span" size="xsMd" color="muted" class="leading-[24px]">اقساط:</UiTypography>
      <UiTypography as="span" size="xsMd" class="leading-[24px]">{{ installment }}</UiTypography>
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
