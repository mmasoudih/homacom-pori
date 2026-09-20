<script setup lang="ts">
import type { ClassValue } from 'clsx'
import type { Product, ProductTone, ProductVariant } from '~/utils/product'
import { discountBadgeClass, normalizeColors, resolveDiscount, toNumber } from '~/utils/product'
import { toPersianDigits } from '~/utils/format'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    product: Product
    variant?: ProductVariant
    tone?: ProductTone
    /** Extra classes on the image container (e.g. `bg-T-50` on colored sections). */
    imageClass?: string
    /** Color `value` that should render as selected (adds a ring). */
    selectedColor?: string
    /** Optional label rendered inside the countdown chip. */
    countdownLabel?: string
    /** Where the discount badge renders: over the image (default) or inline beside the price. */
    discountPlacement?: 'image' | 'inline'
    showColors?: boolean
    showTitle?: boolean
    showDiscount?: boolean
    showOriginalPrice?: boolean
    showCountdown?: boolean
    /** When set, the card renders as a link pointing to this route. */
    href?: string
    class?: ClassValue
  }>(),
  {
    variant: 'vertical',
    tone: 'default',
    imageClass: '',
    selectedColor: '',
    countdownLabel: '',
    discountPlacement: 'image',
    showColors: undefined,
    showTitle: undefined,
    showDiscount: undefined,
    showOriginalPrice: undefined,
    showCountdown: undefined,
    href: '',
    class: '',
  },
)

// Renders as a NuxtLink when `href` is provided, otherwise a plain article.
const cardTag = computed(() => (props.href ? resolveComponent('NuxtLink') : 'article'))
const cardLinkAttrs = computed(() => (props.href ? { to: props.href } : {}))

// --- Variant defaults ------------------------------------------------------

const variantDefaults: Record<
  ProductVariant,
  { colors: boolean, title: boolean, discount: boolean, originalPrice: boolean }
> = {
  vertical: { colors: true, title: true, discount: true, originalPrice: true },
  horizontal: { colors: false, title: true, discount: true, originalPrice: true },
  minimal: { colors: false, title: false, discount: true, originalPrice: true },
}

const showColors = computed(() => props.showColors ?? variantDefaults[props.variant].colors)
const showTitle = computed(() => props.showTitle ?? variantDefaults[props.variant].title)
const showDiscount = computed(() => props.showDiscount ?? variantDefaults[props.variant].discount)
const showOriginalPrice = computed(
  () => props.showOriginalPrice ?? variantDefaults[props.variant].originalPrice,
)
// Vertical shows the countdown automatically when an expiry exists; other
// variants only when explicitly enabled.
const showCountdown = computed(() => {
  if (props.showCountdown != null) return props.showCountdown
  return props.variant === 'vertical' && !!props.product.discountExpiresAt
})

// --- Normalized product data ----------------------------------------------

const price = computed(() => toNumber(props.product.price))
const originalPrice = computed(() =>
  props.product.oldPrice != null ? toNumber(props.product.oldPrice) : undefined,
)
const discount = computed(() =>
  resolveDiscount(props.product.discount, price.value, originalPrice.value),
)
const hasDiscount = computed(() => discount.value != null && discount.value > 0)
const colors = computed(() => normalizeColors(props.product.colors))

// --- Tone helpers ----------------------------------------------------------

const toneTitle = computed(() => (props.tone === 'inverted' ? 'text-white' : 'text-T-900'))
const swatchBorder = computed(() =>
  props.tone === 'inverted' ? 'border-white/40' : 'border-T-500',
)
// Card surface: white bg + T-400 border for the default tone; transparent on
// colored (inverted) sections so the section bg shows through.
const cardSurface = computed(() =>
  props.tone === 'inverted' ? '' : 'bg-T-50 border border-T-400',
)
// When true, the discount badge moves out of the image into a row beside the price.
const inlineDiscount = computed(() => props.discountPlacement === 'inline')
</script>

<template>
  <!-- ============================== Vertical ============================= -->
  <component
    :is="cardTag"
    v-if="variant === 'vertical'"
    v-bind="cardLinkAttrs"
    :class="cn('group relative flex w-full flex-col rounded-2xl p-3', toneTitle, cardSurface, props.class)"
  >
    <div class="relative">
      <ProductImage
        :src="product.image"
        :alt="product.title"
        :container-class="cn('rounded-[20px]', imageClass)"
      />

      <!-- Colors: top-inline-end corner, stacked vertically -->
      <div
        v-if="showColors && colors.length"
        class="absolute top-2 end-2 flex flex-col gap-[4px]"
      >
        <span
          v-for="(color, ci) in colors"
          :key="`${color.value}-${ci}`"
          class="size-[10px] rounded-[3px] border"
          :class="cn(swatchBorder, selectedColor === color.value && 'ring-1 ring-primary ring-offset-1')"
          :style="{ backgroundColor: color.value }"
          role="img"
          :aria-label="color.name ?? 'رنگ محصول'"
        />
      </div>

      <!-- Discount: bottom-inline-start corner (hidden when inline beside the price) -->
      <span
        v-if="showDiscount && hasDiscount && !inlineDiscount"
        class="absolute bottom-2 start-2 flex h-[25px] items-center justify-center rounded-lg px-1.5 text-[13px] font-extrabold"
        :class="discountBadgeClass(tone)"
      >{{ toPersianDigits(discount!) }}٪</span>
    </div>

    <h3 v-if="showTitle" class="line-clamp-2 mt-3 h-10 text-[14px] font-bold leading-[20px]">
      {{ product.title }}
    </h3>

    <!-- Inline: discount badge on the right, price on the left -->
    <div
      v-if="inlineDiscount"
      class="mt-auto flex items-start gap-2 pt-2"
    >
      <span
        v-if="showDiscount && hasDiscount"
        class="flex h-[21px] shrink-0 items-center justify-center rounded-lg px-1 text-[12px] font-extrabold"
        :class="discountBadgeClass(tone)"
      >{{ toPersianDigits(discount!) }}٪</span>
      <ProductPrice
        class="ms-auto items-end"
        price-class="text-T-900"
        :price="price"
        :original-price="originalPrice"
        :discount="discount"
        :show-original-price="showOriginalPrice"
        :show-discount="false"
        :tone="tone"
      />
    </div>

    <ProductPrice
      v-else
      class="mt-auto pt-2"
      :price="price"
      :original-price="originalPrice"
      :discount="discount"
      :show-original-price="showOriginalPrice"
      :show-discount="false"
      :tone="tone"
    />

    <ProductCountdown
      v-if="showCountdown && product.discountExpiresAt"
      :expires-at="product.discountExpiresAt"
      :label="countdownLabel"
      class="mt-3"
    />
  </component>

  <!-- ============================= Horizontal ============================ -->
  <component
    :is="cardTag"
    v-else-if="variant === 'horizontal'"
    v-bind="cardLinkAttrs"
    :class="cn('group relative flex w-full items-center gap-3 rounded-xl p-2', toneTitle, cardSurface, props.class)"
  >
    <ProductImage
      :src="product.image"
      :alt="product.title"
      :container-class="cn('w-[84px] rounded-xl', imageClass)"
    />

    <div class="flex min-w-0 flex-1 flex-col gap-1.5">
      <h4 v-if="showTitle" class="line-clamp-2 text-[13px] leading-[22px] text-T-800">
        {{ product.title }}
      </h4>

      <ProductPrice
        :layout="inlineDiscount ? 'inline' : 'stacked'"
        :price="price"
        :original-price="originalPrice"
        :discount="discount"
        :show-original-price="showOriginalPrice"
        :show-discount="showDiscount"
        :tone="tone"
      />

      <ProductCountdown
        v-if="showCountdown && product.discountExpiresAt"
        :expires-at="product.discountExpiresAt"
        :label="countdownLabel"
        class="mt-1"
      />
    </div>
  </component>

  <!-- =============================== Minimal ============================= -->
  <component
    :is="cardTag"
    v-else
    v-bind="cardLinkAttrs"
    :class="cn('group relative flex w-full flex-col gap-2 rounded-2xl p-2.5', toneTitle, cardSurface, props.class)"
  >
    <ProductImage
      :src="product.image"
      :alt="product.title"
      :container-class="cn('rounded-[20px]', imageClass)"
    />

    <ProductPrice
      :price="price"
      :original-price="originalPrice"
      :discount="discount"
      :show-original-price="showOriginalPrice"
      :show-discount="showDiscount"
      :tone="tone"
    />

    <ProductCountdown
      v-if="showCountdown && product.discountExpiresAt"
      :expires-at="product.discountExpiresAt"
      :label="countdownLabel"
    />
  </component>
</template>
