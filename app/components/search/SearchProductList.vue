<script setup lang="ts">
import type { SearchProduct } from '~/data/search'
import { DEMO_PRODUCT_ID } from '~/data/product'

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
  <ul v-if="layout === 'list'" class="flex flex-col gap-3">
    <li v-for="product in products" :key="product.id">
      <Product
        variant="horizontal"
        :product="product"
        :href="`/product/${DEMO_PRODUCT_ID}`"
        :show-original-price="false"
        discount-placement="inline"
      />
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
