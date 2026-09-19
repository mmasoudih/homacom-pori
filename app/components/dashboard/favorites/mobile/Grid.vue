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
  <div class="grid grid-cols-2 gap-px bg-T-300">
    <DashboardFavoritesMobileCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @remove="emit('remove', $event)"
    />
  </div>
</template>
