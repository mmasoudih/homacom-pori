<script setup lang="ts">
import { IconChevronLeft, IconX } from '@tabler/icons-vue'
import type { SearchProduct } from '~/data/search'
import { DEMO_PRODUCT_ID } from '~/data/product'
import { resolveDiscount, toNumber } from '~/utils/product'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  product: SearchProduct
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const price = computed(() => toNumber(props.product.price))
const originalPrice = computed(() =>
  props.product.oldPrice != null ? toNumber(props.product.oldPrice) : undefined,
)
const discount = computed(() =>
  resolveDiscount(props.product.discount, price.value, originalPrice.value),
)
const hasDiscount = computed(() => discount.value != null && discount.value > 0)
const priceLabel = computed(() => formatPriceFa(price.value))
const oldPriceLabel = computed(() => formatPriceFa(originalPrice.value ?? 0))
const discountLabel = computed(() => `%${toPersianDigits(discount.value ?? 0)}`)
</script>

<template>
  <article class="relative flex h-full flex-col bg-T-50 p-3 lg:p-5">
    <button
      type="button"
      class="absolute end-2 top-2 flex size-8 items-center justify-center rounded-full bg-T-200 text-T-600 transition-colors hover:bg-T-300 hover:text-T-900"
      aria-label="حذف از مقایسه"
      @click="emit('remove', product.id)"
    >
      <IconX class="size-4" />
    </button>

    <ProductImage
      :src="product.image"
      :alt="product.title"
      container-class="mx-auto w-[140px] max-w-full rounded-[20px] bg-transparent lg:w-[190px]"
    />

    <h3 class="mt-4 line-clamp-2 h-10 text-[13px] font-bold leading-[20px] text-T-900 lg:h-12 lg:text-[15px] lg:leading-[24px]">
      {{ product.title }}
    </h3>

    <div class="mb-4 mt-2 flex items-start justify-between gap-2">
      <span
        v-if="hasDiscount"
        class="flex h-[21px] shrink-0 items-center justify-center rounded-lg bg-R-300 px-1.5 text-[12px] font-extrabold text-white"
      >{{ discountLabel }}</span>
      <div class="flex flex-col items-end gap-1">
        <div class="flex items-baseline gap-1">
          <span class="text-[15px] font-extrabold leading-none text-T-900">{{ priceLabel }}</span>
          <span class="text-[11px] text-T-600">تومان</span>
        </div>
        <span
          v-if="originalPrice"
          class="text-[13px] font-bold leading-none text-T-600 line-through"
        >{{ oldPriceLabel }}</span>
      </div>
    </div>

    <NuxtLink
      :to="`/product/${DEMO_PRODUCT_ID}`"
      class="mt-auto flex h-10 w-full items-center justify-center gap-1 rounded-xl border border-T-400 text-[13px] font-medium text-T-800 transition-colors hover:border-primary hover:text-primary lg:h-11"
    >
      <IconChevronLeft class="size-4" />
      مشاهده و خرید
    </NuxtLink>
  </article>
</template>
