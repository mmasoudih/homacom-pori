<script setup lang="ts">
import type { ProductTone } from '~/utils/product'
import { discountBadgeClass } from '~/utils/product'
import { formatPriceFa, toPersianDigits } from '~/utils/format'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    price: number
    originalPrice?: number
    discount?: number | null
    showOriginalPrice?: boolean
    showDiscount?: boolean
    /** Stacked (default): price above old-price/badge. Inline: all on one row. */
    layout?: 'stacked' | 'inline'
    /** Overrides the current-price text color (unit and old price are unaffected). */
    priceClass?: string
    tone?: ProductTone
    class?: string
  }>(),
  {
    originalPrice: undefined,
    discount: null,
    showOriginalPrice: true,
    showDiscount: true,
    layout: 'stacked',
    priceClass: '',
    tone: 'default',
    class: '',
  },
)

const hasDiscount = computed(() => props.discount != null && props.discount > 0)
const showOldPrice = computed(
  () => props.showOriginalPrice && props.originalPrice != null && props.originalPrice > props.price,
)

const priceColor = computed(() => (props.tone === 'inverted' ? 'text-white' : 'text-T-600'))
const dimColor = computed(() => (props.tone === 'inverted' ? 'text-white/50' : 'text-T-600'))
</script>

<template>
  <!-- Inline: current price (start), old price, discount badge (end) — one row -->
  <div v-if="layout === 'inline'" :class="cn('flex w-full items-center justify-between gap-2', props.class)">
    <div class="flex items-baseline gap-1">
      <span class="text-[15px] font-extrabold leading-none" :class="cn(priceColor, props.priceClass)">
        {{ formatPriceFa(price) }}
      </span>
      <span class="text-[11px]" :class="dimColor">تومان</span>
    </div>

    <span v-if="showOldPrice" class="text-[13px] font-bold leading-none line-through" :class="dimColor">
      {{ formatPriceFa(originalPrice!) }}
    </span>

    <span
      v-if="showDiscount && hasDiscount"
      class="flex h-[21px] shrink-0 items-center justify-center rounded-lg px-1 text-[12px] font-extrabold"
      :class="discountBadgeClass(tone)"
    >{{ toPersianDigits(discount!) }}٪</span>
  </div>

  <!-- Stacked: price above old-price/badge -->
  <div v-else :class="cn('flex flex-col gap-1', props.class)">
    <!-- New / discounted price -->
    <div class="flex items-baseline gap-1">
      <span class="text-[15px] font-extrabold leading-none" :class="cn(priceColor, props.priceClass)">
        {{ formatPriceFa(price) }}
      </span>
      <span class="text-[11px]" :class="dimColor">تومان</span>
    </div>

    <!-- Original price + discount badge -->
    <div class="flex items-center gap-1.5">
      <span v-if="showOldPrice" class="text-[13px] font-bold leading-none line-through" :class="dimColor">
        {{ formatPriceFa(originalPrice!) }}
      </span>
      <span
        v-if="showDiscount && hasDiscount"
        class="flex h-[21px] items-center justify-center rounded-lg px-1 text-[12px] font-extrabold"
        :class="discountBadgeClass(tone)"
      >{{ toPersianDigits(discount!) }}٪</span>
    </div>
  </div>
</template>
