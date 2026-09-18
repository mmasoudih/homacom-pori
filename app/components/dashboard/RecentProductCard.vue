<script setup lang="ts">
import { IconShoppingBag } from '@tabler/icons-vue'
import type { Product } from '~/utils/product'
import { normalizeColors, resolveDiscount, toNumber } from '~/utils/product'

const props = defineProps<{
  product: Product
}>()

const colors = computed(() => normalizeColors(props.product.colors))
const price = computed(() => toNumber(props.product.price))
const originalPrice = computed(() =>
  props.product.oldPrice != null ? toNumber(props.product.oldPrice) : undefined,
)
const discount = computed(() =>
  resolveDiscount(props.product.discount, price.value, originalPrice.value),
)
</script>

<template>
  <article class="group relative flex w-full flex-col rounded-2xl border border-T-400 bg-T-50 p-2.5 sm:p-3">
    <div class="relative">
      <ProductImage
        :src="product.image"
        :alt="product.title"
        container-class="rounded-[16px]"
      />

      <span
        v-if="colors.length"
        class="absolute top-2 end-2 size-[10px] rounded-[3px] border border-T-500"
        :style="{ backgroundColor: colors[0].value }"
        role="img"
        :aria-label="colors[0].name ?? 'رنگ محصول'"
      />
    </div>

    <h3 class="mt-3 line-clamp-2 h-10 text-[12px] font-bold leading-[20px] text-T-900 sm:text-[13px]">
      {{ product.title }}
    </h3>

    <ProductPrice
      class="mt-2"
      price-class="text-T-900"
      :price="price"
      :original-price="originalPrice"
      :discount="discount"
    />

    <button
      type="button"
      class="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-T-400 text-[12px] font-medium text-T-800 transition-colors hover:border-primary hover:text-primary sm:h-10 sm:text-[13px]"
    >
      <IconShoppingBag class="size-4" />
      افزودن به سبد
    </button>
  </article>
</template>
