<script setup lang="ts">
import { computed } from 'vue'
import type { ProductDetail, StickyLink, WarrantyOption } from '~/data/product'
import { formatPriceFa } from '~/utils/format'
import { getDiscountPercent } from '~/utils/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    product: ProductDetail
    links: StickyLink[]
    selectedColor?: string
    selectedWarranty?: WarrantyOption
    class?: string
  }>(),
  { selectedColor: '', selectedWarranty: undefined, class: '' },
)

const emit = defineEmits<{
  'add-to-cart': []
  'notify-me': []
}>()

const isAvailable = computed(() => props.product.stockStatus === 'available')

const selectedColor = computed(() =>
  props.product.colors.find(c => c.value === props.selectedColor),
)

const discountPercent = computed(() =>
  getDiscountPercent(props.product.price, props.product.oldPrice ?? 0),
)

/** Icon assets exported from the Figma frame «Frame 3294». */
const linkIcons = {
  delivery: '/icons/product-detail/truck-color-32.svg',
  return: '/icons/product-detail/reload-32.svg',
  inPerson: '/icons/product-detail/building-32.svg',
} as const
</script>

<template>
  <div :class="cn('flex w-full flex-col gap-[18px]', props.class)">
    <!-- Product summary -->
    <div
      v-if="isAvailable"
      class="flex flex-col gap-5 rounded-[12px] border border-T-400 bg-T-50 px-6 py-[22px]"
    >
      <!-- Thumbnail + title -->
      <div class="flex items-center gap-2">
        <div
          class="size-[60px] shrink-0 overflow-hidden rounded-[7px] border border-T-400 bg-T-50"
        >
          <img
            :src="product.images[0]?.src"
            :alt="product.title"
            class="size-full object-contain"
          >
        </div>
        <UiTypography as="p" size="md" class="line-clamp-3 flex-1 text-start leading-[15px]">
          {{ product.title }}
        </UiTypography>
      </div>

      <div class="h-px w-full bg-T-300" />

      <!-- Total -->
      <div class="flex items-end justify-between gap-3">
        <UiTypography size="lg" weight="semibold">جمع کل</UiTypography>

        <span class="flex flex-col items-end gap-1">
          <span v-if="product.oldPrice" class="flex items-center gap-1.5">
            <UiTypography size="xl" weight="medium" color="subtle" class="line-through leading-[19px]">
              {{ formatPriceFa(product.oldPrice) }}
            </UiTypography>
            <span
              v-if="discountPercent"
              class="flex h-5 items-center rounded-full bg-R-300 px-2"
            >
              <UiTypography size="xs" weight="bold" color="white">٪{{ discountPercent }}</UiTypography>
            </span>
          </span>

          <span class="flex items-baseline gap-1.5">
            <UiTypography size="2xl" weight="bold" class="leading-[22px]">{{ formatPriceFa(product.price) }}</UiTypography>
            <UiTypography size="md" weight="semibold" color="subtle">تومان</UiTypography>
          </span>
        </span>
      </div>

      <!-- Add to cart -->
      <button
        type="button"
        class="flex h-[42px] w-full items-center justify-center gap-1.5 rounded-[12px] bg-R-300 px-[18px] transition-colors hover:bg-R-400"
        @click="emit('add-to-cart')"
      >
        <img
          src="/icons/product-detail/shopping-bag-22.svg"
          alt=""
          class="size-[22px] shrink-0"
        >
        <UiTypography size="lg" weight="bold" color="white">افزودن به سبد خرید</UiTypography>
      </button>

      <!-- Selected colour / warranty -->
      <div class="flex flex-col gap-1">
        <div class="flex h-11 items-center justify-between gap-3 rounded-[12px] bg-R-25 px-4">
          <span class="flex min-w-0 items-center gap-1.5">
            <ProductDetailColorSwatch />
            <UiTypography size="md" color="muted" class="shrink-0">رنگ:</UiTypography>
          </span>
          <UiTypography size="md" weight="medium" class="truncate">
            {{ selectedColor?.name || 'انتخاب نشده' }}
          </UiTypography>
        </div>

        <div class="flex h-11 items-center justify-between gap-3 rounded-[12px] bg-R-25 px-4">
          <span class="flex min-w-0 items-center gap-1.5">
            <img
              src="/icons/product-detail/certificate-20.svg"
              alt=""
              class="size-5 shrink-0"
            >
            <UiTypography size="md" color="muted" class="shrink-0">گارانتی:</UiTypography>
          </span>
          <UiTypography size="md" weight="medium" class="truncate text-end">
            {{ selectedWarranty?.label || 'انتخاب نشده' }}
          </UiTypography>
        </div>
      </div>
    </div>

    <!-- Unavailable -->
    <div
      v-else
      class="flex flex-col gap-5 rounded-[12px] border border-T-400 bg-T-50 px-6 py-[22px]"
    >
      <div class="flex items-center gap-2">
        <div
          class="size-[60px] shrink-0 overflow-hidden rounded-[7px] border border-T-400 bg-T-50"
        >
          <img
            :src="product.images[0]?.src"
            :alt="product.title"
            class="size-full object-contain"
          >
        </div>
        <UiTypography as="p" size="md" class="line-clamp-3 flex-1 text-start leading-[15px]">
          {{ product.title }}
        </UiTypography>
      </div>

      <div class="h-px w-full bg-T-300" />

      <div class="flex flex-col items-center gap-3">
        <div class="flex w-full items-center gap-1.5">
          <span class="h-px flex-1 bg-T-500" />
          <UiTypography size="xl" color="muted">ناموجود</UiTypography>
          <span class="h-px flex-1 bg-T-500" />
        </div>

        <button
          type="button"
          class="flex h-[42px] w-full items-center justify-center gap-1.5 rounded-[12px] border border-R-300 px-[18px] transition-colors hover:bg-R-25"
          @click="emit('notify-me')"
        >
          <img src="/icons/product-detail/bell-22.svg" alt="" class="size-[22px]">
          <UiTypography size="lg" weight="medium" class="text-R-300">موجود شد خبرم کن</UiTypography>
        </button>
      </div>
    </div>

    <!-- Service links -->
    <div class="flex flex-col gap-1">
      <button
        v-for="link in links"
        :key="link.title"
        type="button"
        class="flex items-center justify-between gap-3 rounded-[12px] border border-T-400 bg-T-50 px-4 py-3 text-start transition-colors hover:bg-T-100"
      >
        <span class="flex min-w-0 flex-1 items-center gap-3">
          <img
            :src="linkIcons[link.icon]"
            alt=""
            class="size-8 shrink-0"
          >
          <span class="flex min-h-[46px] min-w-0 flex-col justify-center gap-1">
            <UiTypography size="lg" weight="medium" class="truncate leading-[17px]">{{ link.title }}</UiTypography>
            <UiTypography size="md" color="muted" class="truncate leading-[15px]">{{ link.subtitle }}</UiTypography>
          </span>
        </span>
        <img
          src="/icons/product-detail/angle-left-16.svg"
          alt=""
          class="size-4 shrink-0"
        >
      </button>
    </div>
  </div>
</template>
