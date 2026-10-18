<script setup lang="ts">
import type { CartService } from '~/data/cart'
import { toPersianDigits } from '~/utils/format'

const props = defineProps<{
  services: CartService[]
}>()

const emit = defineEmits<{
  add: []
  remove: [id: string]
}>()

const total = computed(() => props.services.length)
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Header: title + count on the start side, «افزودن خدمت» on the end side. -->
    <div class="flex h-[25px] items-center justify-between gap-2.5">
      <div class="flex items-center gap-2.5">
        <UiTypography as="span" size="mdLg" weight="semibold">خدمات و لوازم جانبی:</UiTypography>
        <UiTypography as="span" size="mdLg" color="muted">
          ({{ toPersianDigits(total) }} مورد)
        </UiTypography>
      </div>

      <button type="button" class="flex items-center gap-1 text-R-300" @click="emit('add')">
        <img src="/icons/cart/plus-red.svg" alt="" class="size-[11px] shrink-0">
        <UiTypography as="span" size="xsMd" weight="medium" color="primary">افزودن خدمت</UiTypography>
      </button>
    </div>

    <!-- Selected services -->
    <div v-if="services.length" class="flex flex-wrap gap-3.5">
      <div
        v-for="service in services"
        :key="service.id"
        class="flex items-center gap-2 rounded-[8px] border border-dashed border-[#F8A5AF] bg-[#FFF2F4] p-2.5"
      >
        <img src="/icons/cart/chip-remove.svg" alt="" class="h-[17.083px] w-[19.583px] shrink-0">

        <UiTypography as="span" size="xsMd" weight="medium">
          {{ service.label }}
        </UiTypography>

        <span class="h-5 w-px shrink-0 bg-T-500" aria-hidden="true" />

        <span class="flex items-center gap-1.5">
          <UiTypography
            as="span"
            size="2xs"
            weight="medium"
            color="subtle"
            class="lg:text-[11.5px]"
          >تومان</UiTypography>
          <UiTypography as="span" size="xsMd" weight="medium">
            {{ formatPriceFa(service.price) }}
          </UiTypography>
        </span>

        <button
          type="button"
          class="flex size-[18px] shrink-0 items-center justify-center"
          :aria-label="`حذف ${service.label}`"
          @click="emit('remove', service.id)"
        >
          <img src="/icons/cart/x-mark.svg" alt="" class="size-[11.25px]">
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex items-center gap-2 rounded-[8px] border border-dashed border-T-500 bg-T-100 px-3 py-[9px]"
    >
      <img src="/icons/cart/info.svg" alt="" class="size-[18px] shrink-0 lg:size-[22px]">
      <UiTypography as="span" size="xsMd" color="muted">
        خدمتی برای این کالا انتخاب نشده؛ با
        <UiTypography as="span" size="xsMd" color="primary">«افزودن خدمت»</UiTypography>
        سبدت را کامل‌تر کن.
      </UiTypography>
    </div>
  </div>
</template>
