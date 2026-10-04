<script setup lang="ts">
import type { Product } from '~/utils/product'

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  remove: [id: string | number | undefined]
}>()

const columns = 3

function separatorClass(index: number) {
  const isLastColumn = index % columns === columns - 1
  const lastRowStart = props.products.length - (props.products.length % columns || columns)
  const isLastRow = index >= lastRowStart

  return [
    !isLastColumn && 'border-e border-T-300',
    !isLastRow && 'border-b border-T-300',
  ]
}
</script>

<template>
  <div class="grid grid-cols-3">
    <DashboardFavoritesCard
      v-for="(product, index) in products"
      :key="product.id"
      :product="product"
      :class="separatorClass(index)"
      @remove="emit('remove', $event)"
    />
  </div>
</template>
