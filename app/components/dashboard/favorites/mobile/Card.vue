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
  <article class="group relative flex w-full flex-col border-b border-T-300 bg-T-50 p-3">
    <div class="relative mx-auto w-fit">
      <ProductImage :src="product.image" :alt="product.title" container-class="size-[120px] rounded-[16px] bg-transparent" />
      <div v-if="colors.length" class="absolute top-2 -end-2 flex flex-col gap-[4px]">
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

    <UiTypography as="h3" size="lg" weight="regular" class="line-clamp-2 mt-3 h-10 leading-[20px]">
      {{ product.title }}
    </UiTypography>

    <div class="mt-2 flex items-center justify-between gap-2">
      <UiTypography
        v-if="hasDiscount"
        as="span"
        size="xs"
        weight="bold"
        color="white"
        class="flex h-[21px] shrink-0 items-center justify-center rounded-lg bg-R-300 px-1.5"
      >{{ discountLabel }}</UiTypography>
      <div class="ms-auto flex flex-col items-end gap-1">
        <div class="flex items-baseline gap-1">
          <UiTypography as="span" size="lg" weight="medium" color="default" class="leading-none">{{ priceLabel }}</UiTypography>
          <UiTypography as="span" size="3xs" weight="semibold" color="subtle">تومان</UiTypography>
        </div>
        <span
          v-if="originalPrice"
          class="text-[12px] font-bold leading-none text-T-600 line-through"
        >{{ oldPriceLabel }}</span>
      </div>
    </div>

    <div class="mt-auto flex items-center gap-2 pt-3">
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
