<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceCatalogItem } from '~/data/product'
import { SERVICE_CHIP_ICON_SRC } from '~/utils/productDetailIcons'
import { formatPriceFa } from '~/utils/format'

const props = defineProps<{
  services: ServiceCatalogItem[]
}>()

const emit = defineEmits<{
  'open-services': []
  'remove-service': [id: string]
}>()

const countLabel = computed(() => `(${props.services.length}مورد)`)

function iconFor(service: ServiceCatalogItem) {
  return SERVICE_CHIP_ICON_SRC[service.icon ?? 'apps']
}
</script>

<template>
  <div class="flex flex-col gap-[18px]">
    <!-- Header -->
    <div class="flex h-[25px] items-center justify-between gap-2.5">
      <div class="flex items-center gap-2.5">
        <UiTypography as="h2" size="xl" weight="semibold" class="leading-[19px]">خدمات و لوازم جانبی:</UiTypography>
        <UiTypography size="lg" color="muted">{{ countLabel }}</UiTypography>
      </div>

      <button
        type="button"
        class="flex h-[25px] items-center gap-1 transition-colors"
        @click="emit('open-services')"
      >
        <img src="/icons/product-detail/plus-15.svg" alt="" class="size-[15px]">
        <UiTypography size="md" weight="medium" class="text-R-300 transition-colors hover:text-R-400">
          افزودن خدمت
        </UiTypography>
      </button>
    </div>

    <!-- Selected chips -->
    <div class="flex flex-wrap items-center gap-[14px]">
      <div
        v-for="service in services"
        :key="service.id"
        class="flex h-[42px] items-center gap-2 rounded-lg border border-R-75 bg-R-25 px-2.5"
      >
        <img :src="iconFor(service)" alt="" class="size-5 shrink-0 object-contain">

        <UiTypography size="md" weight="medium" class="whitespace-nowrap">{{ service.label }}</UiTypography>

        <UiTypography size="lg" weight="medium" class="text-T-500">|</UiTypography>

        <span class="flex items-center gap-1.5">
          <UiTypography size="md" weight="medium">{{ formatPriceFa(service.price) }}</UiTypography>
          <UiTypography size="sm" weight="medium" color="subtle">تومان</UiTypography>
        </span>

        <button
          type="button"
          class="flex size-4 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
          :aria-label="`حذف ${service.label}`"
          @click="emit('remove-service', service.id)"
        >
          <img src="/icons/product-detail/xmark-16.svg" alt="" class="size-4">
        </button>
      </div>
    </div>
  </div>
</template>
