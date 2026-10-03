<script setup lang="ts">
import type { SearchProduct } from '~/data/search'
import { DEMO_PRODUCT_ID } from '~/data/product'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

withDefaults(
  defineProps<{
    products: SearchProduct[]
    /** `list` = rows (panel/overlay). `grid` = cards (full results page). */
    layout?: 'list' | 'grid'
  }>(),
  { layout: 'list' },
)
</script>

<template>
  <!-- Search hits are mock entries, so they all link to the demo PDP. -->
  <ul v-if="layout === 'list'" class="flex flex-col gap-[7px]">
    <li v-for="product in products" :key="product.id">
      <NuxtLink
        :to="`/product/${DEMO_PRODUCT_ID}`"
        class="group relative flex h-[68px] w-full items-center gap-3 rounded-xl border border-T-400 bg-T-50 p-1 text-T-900"
      >
        <!-- Image -->
        <div
          class="relative flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary/40"
        >
          <img
            :src="product.image"
            :alt="product.title"
            loading="lazy"
            class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          >
        </div>

        <!-- Content -->
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <UiTypography
            as="h4"
            size="sm"
            weight="medium"
            class="truncate text-T-800"
            :title="product.title"
          >
            {{ product.title }}
          </UiTypography>

          <div class="flex w-full flex-wrap items-center justify-between gap-2">
            <!-- Price on the right, unit on the left (RTL) -->
            <div class="flex items-baseline gap-[6px]">
              <UiTypography size="md" weight="semibold" leading="none" color="default">
                {{ formatPriceFa(product.price) }}
              </UiTypography>
              <UiTypography size="sm" weight="semibold" color="subtle">
                تومان
              </UiTypography>
            </div>

            <div class="flex items-center gap-2 ml-[14px]">
              <UiTypography
                v-if="product.oldPrice"
                size="lg"
                weight="medium"
                leading="none"
                color="subtle"
                class="line-through"
              >
                {{ formatPriceFa(product.oldPrice) }}
              </UiTypography>

              <UiTypography
                v-if="product.discount"
                as="span"
                size="md"
                weight="bold"
                color="white"
                class="flex h-[22px] w-[38px] shrink-0 items-center justify-center rounded-[16px] bg-R-300 leading-none"
              >
                {{ toPersianDigits(product.discount) }}٪
              </UiTypography>
            </div>
          </div>
        </div>
      </NuxtLink>
    </li>
  </ul>

  <ul v-else class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <li v-for="product in products" :key="product.id">
      <Product
        variant="vertical"
        :product="product"
        :href="`/product/${DEMO_PRODUCT_ID}`"
        :show-colors="false"
        show-compare
        class="h-full"
      />
    </li>
  </ul>
</template>
