<script setup lang="ts">
import type { SearchProduct } from '~/data/search'
import { searchColorOptions } from '~/data/search'
import { DEMO_PRODUCT_ID } from '~/data/product'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  product: SearchProduct
}>()

const colorMap = new Map(searchColorOptions.map(option => [option.id, option]))

const colors = computed(() =>
  props.product.colorIds.map(id => colorMap.get(id) ?? { id, label: 'رنگ محصول', dot: '#e5e7eb' }),
)
</script>

<template>
  <!-- Search hits are mock entries, so they all link to the demo PDP. -->
  <NuxtLink
    :to="`/product/${DEMO_PRODUCT_ID}`"
    class="group flex items-stretch gap-3 py-5"
  >
    <!-- Image + colours (start/right column in RTL) -->
    <div class="flex shrink-0 flex-col items-center gap-2">
      <ProductImage
        :src="product.image"
        :alt="product.title"
        container-class="w-[96px] rounded-[16px] bg-transparent"
      />

      <div v-if="colors.length" class="flex flex-wrap items-center justify-center gap-1.5">
        <span
          v-for="color in colors"
          :key="color.id"
          class="size-[14px] rounded-[4px] border border-T-400"
          :style="{ backgroundColor: color.dot }"
          role="img"
          :aria-label="color.label"
        />
      </div>
    </div>

    <!-- Text column (end/left in RTL) -->
    <div class="flex min-w-0 flex-1 flex-col gap-3">
      <h3 class="line-clamp-2 text-start text-[13px] leading-[22px] text-T-900">
        {{ product.title }}
      </h3>

      <div class="mt-auto flex flex-col items-end gap-1.5">
        <div class="flex items-center gap-2">
          <span
            v-if="product.discount"
            class="flex h-[21px] w-[38px] shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white"
          >
            {{ toPersianDigits(product.discount) }}٪
          </span>
          <span class="text-[15px] font-medium text-T-900">
            {{ formatPriceFa(product.price) }}
          </span>
          <span class="text-[10px] font-semibold text-T-600">تومان</span>
        </div>

        <span
          v-if="product.oldPrice && product.oldPrice > product.price"
          class="text-[12px] font-medium text-T-600 line-through"
        >
          {{ formatPriceFa(product.oldPrice) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
