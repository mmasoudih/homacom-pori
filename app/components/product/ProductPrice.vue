<script setup lang="ts">
import type { ProductTone } from "~/utils/product";
import { discountBadgeClass } from "~/utils/product";
import { formatPriceFa, toPersianDigits } from "~/utils/format";
import { cn } from "~/lib/utils";

const props = withDefaults(
  defineProps<{
    price: number;
    originalPrice?: number;
    discount?: number | null;
    showOriginalPrice?: boolean;
    showDiscount?: boolean;
    /** Stacked (default): price above old-price/badge. Inline: all on one row. */
    layout?: "stacked" | "inline";
    /** Overrides the current-price text color (unit and old price are unaffected). */
    priceClass?: string;
    /** Inline discount chip size. `lg`: 42×25, `sm`: 30×16.5. */
    badgeSize?: "sm" | "lg";
    tone?: ProductTone;
    class?: string;
  }>(),
  {
    originalPrice: undefined,
    discount: null,
    showOriginalPrice: true,
    showDiscount: true,
    layout: "stacked",
    priceClass: "",
    badgeSize: "lg",
    tone: "default",
    class: "",
  },
);

const hasDiscount = computed(
  () => props.discount != null && props.discount > 0,
);
const showOldPrice = computed(
  () =>
    props.showOriginalPrice &&
    props.originalPrice != null &&
    props.originalPrice > props.price,
);

const priceColor = computed(() =>
  props.tone === "inverted" ? "text-white" : "text-T-600",
);
const dimColor = computed(() =>
  props.tone === "inverted" ? "text-white/50" : "text-T-600",
);

const badgeSizeClass = computed(() =>
  props.badgeSize === "sm"
    ? "w-[30px] h-[16.5px] rounded-full"
    : "w-[42px] h-[25px] rounded-[16px]",
);
</script>

<template>
  <!-- Inline: current price (start), old price, discount badge (end) — one row -->
  <div
    v-if="layout === 'inline'"
    :class="cn('flex w-full flex-wrap items-center justify-between gap-2', props.class)"
  >
    <!-- Unit on the right, price on the left (RTL) with a 6px gap. -->
    <div class="flex items-baseline gap-[6px]">
      <UiTypography size="sm" weight="semibold" :class="dimColor">تومان</UiTypography>
      <UiTypography
        size="xl"
        weight="medium"
        leading="none"
        :class="cn(priceColor, props.priceClass)"
      >
        {{ formatPriceFa(price) }}
      </UiTypography>
    </div>

    <div class="flex items-center gap-2">
      <UiTypography
        v-if="showOldPrice"
        size="xl"
        weight="medium"
        leading="none"
        :class="cn(dimColor, 'line-through')"
      >
        {{ formatPriceFa(originalPrice!) }}
      </UiTypography>

      <UiTypography
        v-if="showDiscount && hasDiscount"
        as="span"
        size="md"
        weight="bold"
        :class="cn('flex shrink-0 items-center justify-center leading-none', badgeSizeClass, discountBadgeClass(tone))"
      >
        {{ toPersianDigits(discount!) }}٪
      </UiTypography>
    </div>
  </div>

  <!-- Stacked: price above old-price/badge -->
  <div v-else :class="cn('flex flex-col gap-1', props.class)">
    <!-- New / discounted price -->
    <div class="flex items-baseline gap-1">
      <UiTypography
        size="xl"
        weight="medium"
        leading="none"
        :class="cn(priceColor, props.priceClass)"
      >
        {{ formatPriceFa(price) }}
      </UiTypography>
      <UiTypography size="sm" weight="semibold" :class="dimColor">تومان</UiTypography>
    </div>

    <!-- Original price + discount badge -->
    <div class="flex min-h-4 items-center gap-1.5">
      <UiTypography
        v-if="showOldPrice"
        size="xl"
        weight="medium"
        leading="none"
        :class="cn(dimColor, 'line-through')"
      >
        {{ formatPriceFa(originalPrice!) }}
      </UiTypography>
      <UiTypography
        v-if="showDiscount && hasDiscount"
        as="span"
        size="md"
        weight="bold"
        :class="cn('flex h-[21px] items-center justify-center rounded-lg px-1', discountBadgeClass(tone))"
      >
        {{ toPersianDigits(discount!) }}٪
      </UiTypography>
    </div>
  </div>
</template>
