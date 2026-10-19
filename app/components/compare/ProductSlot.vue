<script setup lang="ts">
import { IconChevronLeft, IconCircleXFilled } from '@tabler/icons-vue'
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
  <article
    class="relative flex h-[361px] w-full shrink-0 flex-col gap-4 border border-T-300 bg-T-50 px-3 py-5 lg:h-[432px] lg:rounded-[20px] lg:border-T-400 lg:px-5"
  >
    <!-- Remove — top-left (end in RTL), as in the design -->
    <div class="flex h-5 shrink-0 items-center justify-end">
      <button
        type="button"
        class="flex size-5 items-center justify-center text-T-500 transition-colors hover:text-T-700"
        aria-label="حذف از مقایسه"
        @click="emit('remove', product.id)"
      >
        <IconCircleXFilled class="size-5" />
      </button>
    </div>

    <ProductImage
      :src="product.image"
      :alt="product.title"
      container-class="mx-auto size-[99px] shrink-0 rounded-none bg-transparent lg:size-[190px]"
    />

    <h3
      class="line-clamp-3 h-[60px] w-full text-start text-[14px] leading-5 font-normal text-T-900 lg:line-clamp-2 lg:h-10"
    >
      {{ product.title }}
    </h3>

    <!-- Price at the left, discount at the right (design) -->
    <div class="flex h-[42px] shrink-0 items-start justify-between gap-2">
      <span
        v-if="hasDiscount"
        class="flex h-[25px] shrink-0 items-center justify-center rounded-2xl bg-primary px-[13px] text-[12.5px] font-bold text-white"
      >{{ discountLabel }}</span>
      <span v-else class="shrink-0" aria-hidden="true" />

      <div class="flex flex-col items-end gap-0.5">
        <div class="flex items-baseline gap-1.5">
          <span class="text-[14px] font-medium leading-none text-T-900 lg:text-[16px]">{{ priceLabel }}</span>
          <span class="text-[11.5px] font-semibold text-T-600">تومان</span>
        </div>
        <span
          v-if="originalPrice"
          class="text-[14px] font-medium leading-none text-T-600 line-through lg:text-[16px]"
        >{{ oldPriceLabel }}</span>
      </div>
    </div>

    <NuxtLink
      :to="`/product/${DEMO_PRODUCT_ID}`"
      class="flex h-9 w-full shrink-0 items-center justify-between rounded-lg border border-primary px-3 text-[12.5px] font-medium text-primary transition-colors hover:bg-R-10"
    >
      <span>مشاهده و خرید</span>
      <IconChevronLeft class="size-[13px] shrink-0" />
    </NuxtLink>
  </article>
</template>
