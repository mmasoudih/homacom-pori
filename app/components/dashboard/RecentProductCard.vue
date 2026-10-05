<script setup lang="ts">
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
  <article class="group relative flex w-full flex-col bg-T-50 p-2.5 lg:h-[328px] lg:p-3">
    <div
      v-if="colors.length"
      class="absolute top-2 end-2 flex flex-col gap-1"
    >
      <span
        v-for="(color, ci) in colors"
        :key="`${color.value}-${ci}`"
        class="size-3 rounded-[3px] border border-T-500"
        :style="{ backgroundColor: color.value }"
        role="img"
        :aria-label="color.name ?? 'رنگ محصول'"
      />
    </div>

    <div class="relative lg:flex lg:min-h-0 lg:flex-1 lg:items-center lg:justify-center">
      <ProductImage
        :src="product.image"
        :alt="product.title"
        container-class="mx-auto size-[120px] shrink-0 rounded-[16px]"
      />
    </div>

    <UiTypography as="h3" size="lg" weight="regular" class="mt-3 line-clamp-2 h-10 leading-[20px]">
      {{ product.title }}
    </UiTypography>

    <ProductPrice
      class="mt-2 items-end"
      price-class="text-T-900"
      :discount-in-price-row="true"
      :price="price"
      :original-price="originalPrice"
      :discount="discount"
    />

    <button
      type="button"
      class="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-T-400 text-T-900 transition-colors hover:border-primary hover:text-primary lg:h-10"
    >
      <span
        class="h-[15.52px] w-[15.6px] shrink-0 bg-current [mask-image:url(/icons/shopping-bag.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
        aria-hidden="true"
      />
      <UiTypography as="span" size="xsMd" weight="medium" color="inherit">
        افزودن به سبد
      </UiTypography>
    </button>
  </article>
</template>
