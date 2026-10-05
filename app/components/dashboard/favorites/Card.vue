<script setup lang="ts">
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
  <article class="group relative flex w-full flex-col bg-T-50 p-4 lg:p-5">
    <div class="relative">
      <ProductImage :src="product.image" :alt="product.title" container-class="mx-auto size-[120px] rounded-[20px] bg-transparent" />

      <div v-if="colors.length" class="absolute top-2 end-2 flex flex-col gap-[4px]">
        <span
          v-for="(color, i) in colors"
          :key="i"
          class="size-3 rounded-[3px] border border-T-500"
          :style="{ backgroundColor: color.value }"
          role="img"
          :aria-label="color.name ?? 'رنگ محصول'"
        />
      </div>
    </div>

    <UiTypography as="h3" size="lg" weight="regular" class="line-clamp-2 mt-3 h-10 leading-[20px]">
      {{ product.title }}
    </UiTypography>

    <div class="mt-2 flex items-start justify-between gap-2">
      <UiTypography
        v-if="hasDiscount"
        as="span"
        size="md"
        weight="bold"
        color="white"
        class="flex h-[25px] w-[42px] shrink-0 items-center justify-center rounded-[16px] bg-R-300"
      >{{ discountLabel }}</UiTypography>
      <div class="ms-auto flex flex-col items-end gap-1">
        <div class="flex items-baseline gap-1">
          <UiTypography as="span" size="xl" weight="medium" color="default" class="leading-none">{{ priceLabel }}</UiTypography>
          <UiTypography as="span" size="sm" weight="semibold" color="subtle">تومان</UiTypography>
        </div>
        <UiTypography
          v-if="originalPrice"
          as="span"
          size="xl"
          weight="medium"
          color="subtle"
          class="leading-none line-through"
        >{{ oldPriceLabel }}</UiTypography>
      </div>
    </div>

    <div class="mt-auto flex items-center gap-2 pt-3">
      <button
        type="button"
        class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-T-400 text-T-600 transition-colors hover:border-primary hover:text-primary"
        aria-label="حذف از علاقه‌مندی‌ها"
        @click="emit('remove', product.id)"
      >
        <span
          class="size-[18px] shrink-0 bg-current"
          :style="{
            maskImage: 'url(/icons/favorites-trash.svg)',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskImage: 'url(/icons/favorites-trash.svg)',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            WebkitMaskSize: 'contain',
          }"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        class="flex h-9 flex-1 items-center justify-center rounded-xl border border-T-400 text-T-800 transition-colors hover:border-primary hover:text-primary"
      >
        <UiTypography as="span" size="md" weight="medium" color="inherit">افزودن به سبد</UiTypography>
      </button>
    </div>
  </article>
</template>
