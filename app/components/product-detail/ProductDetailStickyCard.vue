<script setup lang="ts">
import {
  IconChevronLeft,
  IconCreditCard,
  IconUmbrella,
  IconTruckDelivery,
  IconShoppingCart,
  IconLock,
} from '@tabler/icons-vue'
import type { ProductDetail, StickyLink } from '~/data/product'
import { formatPrice } from '~/utils/format'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    product: ProductDetail
    links: StickyLink[]
    class?: string
  }>(),
  { class: '' },
)

const isAvailable = computed(() => props.product.stockStatus === 'available')

const linkIcons = {
  installment: IconCreditCard,
  insurance: IconUmbrella,
  delivery: IconTruckDelivery,
} as const
</script>

<template>
  <div :class="cn('flex w-full flex-col gap-4', props.class)">
    <!-- Product summary / unavailable card -->
    <div
      v-if="isAvailable"
      class="flex flex-col gap-3 rounded-2xl border border-T-300 bg-T-50 p-4"
    >
      <div class="flex items-center gap-3">
        <div class="relative size-[84px] shrink-0 overflow-hidden rounded-xl bg-T-100">
          <img
            :src="product.images[0]?.src"
            :alt="product.title"
            class="size-full object-contain p-1"
          >
        </div>
        <p class="line-clamp-2 text-[12.5px] font-medium leading-[19px] text-T-900">
          {{ product.title }}
        </p>
      </div>

      <div class="flex items-end justify-between">
        <span class="text-[11.5px] text-T-700">قیمت کالا:</span>
        <span class="flex items-baseline gap-1">
          <span class="text-[16px] font-extrabold text-T-900">{{ formatPrice(product.price) }}</span>
          <span class="text-[11px] text-T-700">تومان</span>
        </span>
      </div>

      <button
        type="button"
        class="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-R-300 text-[13px] font-bold text-white transition-colors hover:bg-R-400"
      >
        <IconShoppingCart class="size-4.5" />
        افزودن به سبد خرید
      </button>
    </div>

    <div v-else class="flex flex-col items-center gap-3 rounded-2xl border border-T-300 bg-T-50 p-4 text-center">
      <IconLock class="mt-1 size-9 text-T-600" stroke-width="1.5" />
      <p class="text-[13px] font-medium text-T-900">این کالا فعلا موجود نیست</p>
      <p class="text-[12px] leading-[18px] text-T-700">
        این محصول در حال حاضر موجود نیست. می‌توانید از محصولات جایگزین در بالای صفحه دیدن نمایید.
      </p>
      <span class="my-1 flex w-full items-center gap-3">
        <span class="h-px flex-1 bg-T-300" />
        <span class="text-[14px] text-T-700">ناموجود</span>
        <span class="h-px flex-1 bg-T-300" />
      </span>
    </div>

    <!-- Service links -->
    <div class="flex flex-col overflow-hidden rounded-2xl border border-T-300 bg-T-50">
      <button
        v-for="(link, i) in links"
        :key="link.title"
        type="button"
        class="flex items-center justify-between px-4 py-3.5 text-start transition-colors hover:bg-T-100"
        :class="i > 0 && 'border-t border-T-300'"
      >
        <span class="flex items-center gap-3">
          <component :is="linkIcons[link.icon]" class="size-7 text-T-600" stroke-width="1.5" />
          <span class="flex flex-col gap-0.5">
            <span class="text-[13px] font-bold text-T-900">{{ link.title }}</span>
            <span class="text-[11.5px] text-T-700">{{ link.subtitle }}</span>
          </span>
        </span>
        <IconChevronLeft class="size-4 text-T-600" />
      </button>
    </div>
  </div>
</template>
