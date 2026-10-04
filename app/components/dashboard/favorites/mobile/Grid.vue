<script setup lang="ts">
import type { Product } from '~/utils/product'

defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  remove: [id: string | number | undefined]
}>()
</script>

<template>
  <div class="grid grid-cols-2 border-x border-T-300">
    <DashboardFavoritesMobileCard
      v-for="(product, index) in products"
      :key="product.id"
      :product="product"
      :class="index % 2 === 0 ? 'border-e border-T-300' : ''"
      @remove="emit('remove', $event)"
    />
  </div>
</template>
