<script setup lang="ts">
import type { SearchProduct } from '~/data/search'
import type { Product } from '~/utils/product'

const props = defineProps<{
  product: SearchProduct
}>()

const { colors: shopColors } = useShopColors()
const colorMap = computed(() => new Map(shopColors.value.map(option => [option.id, option])))

/**
 * Adapts the search facet fields onto the shared `<Product>` model. The card
 * itself is rendered by `<Product variant="vertical" discount-placement="inline">`
 * so search results match every other listing on the site.
 */
const product = computed<Product>(() => ({
  id: props.product.id,
  apiId: props.product.apiId,
  isFavorite: props.product.isFavorite,
  title: props.product.title,
  image: props.product.image,
  price: props.product.price,
  oldPrice: props.product.oldPrice,
  discount: props.product.discount,
  colors: props.product.colorIds.map((id) => {
    const option = colorMap.value.get(id)
    return { value: option?.dot ?? '#e5e7eb', name: option?.label ?? 'رنگ محصول' }
  }),
}))
</script>

<template>
  <!-- Search hits are mock entries, so they all link to the demo PDP. -->
  <Product
    variant="vertical"
    discount-placement="inline"
    show-favorite
    :product="product"
    :href="`/product/${product.id}`"
    image-class="bg-transparent"
    class="h-full rounded-none border-0 p-4"
  />
</template>
