<script setup lang="ts">
import { IconTrash } from '@tabler/icons-vue'
import type { Product } from '~/utils/product'
import { normalizeColors, resolveDiscount, toNumber } from '~/utils/product'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  remove: [id: string | number | undefined]
}>()

const colors = computed(() => normalizeColors(props.product.colors))
const price = computed(() => toNumber(props.product.price))
const originalPrice = computed(() =>
  props.product.oldPrice != null ? toNumber(props.product.oldPrice) : undefined,
)
const discount = computed(() =>
  resolveDiscount(props.product.discount, price.value, originalPrice.value),
)
const hasDiscount = computed(() => discount.value != null && discount.value > 0)
const oldPriceLabel = computed(() => formatPriceFa(originalPrice.value ?? 0))
const priceLabel = computed(() => formatPriceFa(price.value))
const discountLabel = computed(() => `%${toPersianDigits(discount.value ?? 0)}`)
</script>

<template>
  <article class="group relative flex w-full flex-col bg-T-50 p-3">
    <div class="relative">
      <ProductImage :src="product.image" :alt="product.title" container-class="rounded-[16px] bg-transparent" />
      <div v-if="colors.length" class="absolute top-2 end-2 flex flex-col gap-[4px]">
        <span
          v-for="(color, i) in colors"
          :key="i"
          class="size-[10px] rounded-[3px] border border-T-500"
          :style="{ backgroundColor: color.value }"
          role="img"
          :aria-label="color.name ?? 'رنگ محصول'"
        />
      </div>
    </div>

    <h3 class="line-clamp-2 mt-3 h-10 text-[12.5px] font-bold leading-[20px] text-T-900">
      {{ product.title }}
    </h3>

    <div class="mt-2 flex items-center justify-between gap-2">
      <span
        v-if="hasDiscount"
        class="flex h-[21px] shrink-0 items-center justify-center rounded-lg bg-R-300 px-1.5 text-[12px] font-extrabold text-white"
      >{{ discountLabel }}</span>
      <div class="flex flex-col items-end gap-1">
        <div class="flex items-baseline gap-1">
          <span class="text-[14px] font-extrabold leading-none text-T-900">{{ priceLabel }}</span>
          <span class="text-[10px] text-T-600">تومان</span>
        </div>
        <span
          v-if="originalPrice"
          class="text-[12px] font-bold leading-none text-T-600 line-through"
        >{{ oldPriceLabel }}</span>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-2">
      <button
        type="button"
        class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-T-400 text-T-600 transition-colors hover:border-primary hover:text-primary"
        aria-label="حذف از علاقه‌مندی‌ها"
        @click="emit('remove', product.id)"
      >
        <IconTrash class="size-4" />
      </button>
      <button
        type="button"
        class="flex h-9 flex-1 items-center justify-center rounded-xl border border-T-400 text-[12px] font-medium text-T-800 transition-colors hover:border-primary hover:text-primary"
      >
        افزودن به سبد
      </button>
    </div>
  </article>
</template>
