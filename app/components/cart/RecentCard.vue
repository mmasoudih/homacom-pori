<script setup lang="ts">
import type { Product } from '~/utils/product'
import { normalizeColors, resolveDiscount, toNumber } from '~/utils/product'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  product: Product
  href?: string
}>()

const price = computed(() => toNumber(props.product.price))
const oldPrice = computed(() =>
  props.product.oldPrice != null ? toNumber(props.product.oldPrice) : undefined,
)
const discount = computed(() =>
  resolveDiscount(props.product.discount, price.value, oldPrice.value),
)
const showOld = computed(
  () => oldPrice.value != null && oldPrice.value > price.value,
)
const colors = computed(() => normalizeColors(props.product.colors))
</script>

<template>
  <NuxtLink
    :to="href ?? '/search'"
    class="relative flex h-[336px] w-[260px] flex-col items-center gap-4 px-5 py-4"
  >
    <!-- Colour swatches sit on the card's end edge (left in RTL). -->
    <div
      v-if="colors.length"
      class="absolute left-[14px] top-[14px] flex flex-col gap-1"
    >
      <span
        v-for="(color, ci) in colors"
        :key="`${color.value}-${ci}`"
        class="size-3 rounded-[2px] border border-T-500"
        :style="{ backgroundColor: color.value }"
        role="img"
        :aria-label="color.name ?? 'رنگ محصول'"
      />
    </div>

    <ProductImage
      :src="product.image"
      :alt="product.title"
      container-class="size-[190px] bg-T-100"
    />

    <UiTypography as="p" size="lg" class="line-clamp-2 h-10 w-full leading-5">
      {{ product.title }}
    </UiTypography>

    <div class="mt-auto flex w-full flex-col">
      <div class="flex h-[25px] items-center justify-between gap-2">
        <UiTypography
          v-if="discount != null && discount > 0"
          as="span"
          size="md"
          weight="bold"
          color="white"
          leading="none"
          class="flex h-[25px] shrink-0 items-center justify-center rounded-[16px] bg-R-300 px-2.5"
        >
          %{{ toPersianDigits(discount) }}
        </UiTypography>

        <div class="flex items-baseline gap-1.5">
          <UiTypography as="span" size="xl" weight="medium" leading="none">
            {{ formatPriceFa(price) }}
          </UiTypography>
          <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
            تومان
          </UiTypography>
        </div>
      </div>

      <UiTypography
        v-if="showOld"
        as="span"
        size="xl"
        weight="medium"
        leading="none"
        color="subtle"
        class="mt-[3px] text-end line-through"
      >
        {{ formatPriceFa(oldPrice!) }}
      </UiTypography>
    </div>
  </NuxtLink>
</template>
