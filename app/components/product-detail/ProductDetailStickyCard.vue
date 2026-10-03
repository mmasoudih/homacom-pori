<script setup lang="ts">
import { computed } from 'vue'
import {
  IconChevronLeft,
  IconTruckDelivery,
  IconRefresh,
  IconBuildingStore,
  IconShoppingCart,
  IconShieldCheck,
  IconLock,
} from '@tabler/icons-vue'
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

const isAvailable = computed(() => props.product.stockStatus === 'available')

const selectedColor = computed(() =>
  props.product.colors.find(c => c.value === props.selectedColor),
)

const discountPercent = computed(() =>
  getDiscountPercent(props.product.price, props.product.oldPrice ?? 0),
)

const linkIcons = {
  delivery: IconTruckDelivery,
  return: IconRefresh,
  inPerson: IconBuildingStore,
} as const

const linkIconClass = {
  delivery: 'text-[#FFAA39]',
  return: 'text-[#3D7BFA]',
  inPerson: 'text-R-300',
} as const
</script>

<template>
  <div :class="cn('flex w-full flex-col gap-4', props.class)">
    <!-- Product summary / unavailable card -->
    <div
      v-if="isAvailable"
      class="flex flex-col gap-4 rounded-2xl border border-T-300 bg-T-50 p-4"
    >
      <div class="flex items-center gap-3">
        <div class="relative size-[84px] shrink-0 overflow-hidden rounded-xl border border-T-300 bg-T-50">
          <img
            :src="product.images[0]?.src"
            :alt="product.title"
            class="size-full object-contain p-1"
          >
        </div>
        <p class="line-clamp-3 text-[12.5px] font-medium leading-[20px] text-T-900">
          {{ product.title }}
        </p>
      </div>

      <!-- Total -->
      <div class="flex items-end justify-between gap-3 border-t border-T-300 pt-3">
        <span class="text-[12.5px] text-T-700">جمع کل</span>
        <span class="flex flex-col items-end gap-1">
          <span v-if="product.oldPrice" class="flex items-center gap-2">
            <span
              v-if="discountPercent"
              class="flex h-[21px] items-center rounded-full bg-R-300 px-2 text-[10.5px] font-extrabold text-white"
            >
              ٪{{ discountPercent }}
            </span>
            <span class="text-[12px] text-T-600 line-through">{{ formatPriceFa(product.oldPrice) }}</span>
          </span>
          <span class="flex items-baseline gap-1">
            <span class="text-[18px] font-extrabold text-T-900">{{ formatPriceFa(product.price) }}</span>
            <span class="text-[11px] text-T-700">تومان</span>
          </span>
        </span>
      </div>

      <button
        type="button"
        class="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-R-300 text-[13.5px] font-bold text-white transition-colors hover:bg-R-400"
      >
        <IconShoppingCart class="size-4.5" />
        افزودن به سبد خرید
      </button>

      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between gap-3 rounded-lg bg-R-10 px-4 py-3">
          <span class="text-[12.5px] text-T-700">رنگ:</span>
          <span class="flex items-center gap-2">
            <span
              v-if="selectedColor"
              class="size-[18px] shrink-0 rounded-full border border-T-500"
              :style="{ backgroundColor: selectedColor.value }"
            />
            <span class="text-[12.5px] font-medium text-T-900">
              {{ selectedColor?.name || 'انتخاب نشده' }}
            </span>
          </span>
        </div>

        <div class="flex items-center justify-between gap-3 rounded-lg bg-R-10 px-4 py-3">
          <span class="text-[12.5px] text-T-700">گارانتی:</span>
          <span class="flex items-center gap-1.5">
            <IconShieldCheck class="size-4 text-R-300" />
            <span class="text-[12.5px] font-medium text-T-900">
              {{ selectedWarranty?.label || 'انتخاب نشده' }}
            </span>
          </span>
        </div>
      </div>
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
    <div class="flex flex-col gap-3">
      <button
        v-for="link in links"
        :key="link.title"
        type="button"
        class="flex items-center justify-between gap-3 rounded-xl border border-T-300 bg-T-50 px-4 py-3.5 text-start transition-colors hover:bg-T-100"
      >
        <span class="flex items-center gap-3">
          <component
            :is="linkIcons[link.icon]"
            class="size-7 shrink-0"
            :class="linkIconClass[link.icon]"
            stroke-width="1.5"
          />
          <span class="flex flex-col gap-0.5">
            <span class="text-[13px] font-bold text-T-900">{{ link.title }}</span>
            <span class="text-[11.5px] text-T-700">{{ link.subtitle }}</span>
          </span>
        </span>
        <IconChevronLeft class="size-4 shrink-0 text-T-600" />
      </button>
    </div>
  </div>
</template>
