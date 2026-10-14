<script setup lang="ts">
import type { SearchProduct } from '~/data/search'

defineProps<{
  products: SearchProduct[]
  query: string
}>()
</script>

<template>
  <SearchEmpty v-if="!products.length" :query="query" />

  <div
    v-else
    class="grid grid-cols-2 border-t border-T-200 lg:grid-cols-4"
  >
    <div
      v-for="product in products"
      :key="product.id"
      class="border-e border-b border-T-200"
    >
      <SearchResultCard :product="product" />
    </div>
  </div>
</template>
