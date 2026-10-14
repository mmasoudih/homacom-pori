<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import type { SearchProduct } from '~/data/search'
import { DESKTOP_MEDIA_QUERY } from '~/utils/breakpoints'

defineProps<{
  products: SearchProduct[]
  query: string
}>()

// Desktop keeps the square-card grid; mobile switches to the single-column
// horizontal rows of the mobile design. Both trees are styled for their tier,
// so neither leaks into the other.
const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)
</script>

<template>
  <SearchEmpty v-if="!products.length" :query="query" />

  <div
    v-else-if="isDesktop"
    class="grid grid-cols-4 border-t border-T-200"
  >
    <div
      v-for="product in products"
      :key="product.id"
      class="border-e border-b border-T-200"
    >
      <SearchResultCard :product="product" />
    </div>
  </div>

  <div v-else class="flex flex-col border-t border-T-200">
    <div
      v-for="product in products"
      :key="product.id"
      class="border-b border-T-200"
    >
      <SearchMobileResultCard :product="product" />
    </div>
  </div>
</template>
