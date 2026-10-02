<script setup lang="ts">
import { computed } from 'vue'
import {
  IconBell,
  IconChevronLeft,
  IconShoppingCart,
  IconShieldCheck,
  IconTag,
  IconPencil,
  IconShoppingBag,
} from '@tabler/icons-vue'
import type { ProductDetail, ServiceCatalogItem, WarrantyOption } from '~/data/product'
import { formatPriceFa } from '~/utils/format'
import { getDiscountPercent } from '~/utils/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    product: ProductDetail
    selectedWarranty: WarrantyOption
    selectedColor: string
    selectedInsuranceId: string | null
    addedServices: ServiceCatalogItem[]
    servicesPrice: number
    class?: string
  }>(),
  { class: '' },
)

const emit = defineEmits<{
  'open-services': []
  'open-insurance': []
  'notify-me': []
}>()

const isAvailable = computed(() => props.product.stockStatus === 'available')

const selectedColor = computed(() =>
  props.product.colors.find(c => c.value === props.selectedColor),
)

const selectedInsurance = computed(() =>
  props.product.insuranceOptions.find(i => i.id === props.selectedInsuranceId) ?? null,
)

const discountAmount = computed(() =>
  props.product.oldPrice ? props.product.oldPrice - props.product.price : 0,
)

const discountPercent = computed(() =>
  getDiscountPercent(props.product.price, props.product.oldPrice ?? 0),
)

const payable = computed(
  () => props.product.price + props.servicesPrice + (selectedInsurance.value?.price ?? 0),
)
</script>

<template>
  <!-- =============================================== -->
  <!-- Out of stock card                                -->
  <!-- =============================================== -->
  <div
    v-if="!isAvailable"
    :class="cn('flex w-full flex-col items-center gap-6 rounded-2xl border border-T-300 bg-T-50 p-5', props.class)"
  >
    <div class="mt-1 flex size-[46px] items-center justify-center text-T-600">
      <svg viewBox="0 0 24 24" fill="none" class="size-[46px]" aria-hidden="true">
        <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M9.5 9.5 12 12m0 0 2.5 2.5M12 12l-2.5 2.5M12 12l2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </div>

    <div class="flex flex-col items-center gap-2 text-center">
      <p class="text-[14px] font-medium text-T-900">این کالا فعلا موجود نیست</p>
      <p class="max-w-[282px] text-[12.5px] leading-[18px] text-T-700">
        این محصول در حال حاضر موجود نیست. می‌توانید از محصولات جایگزین در بالای صفحه دیدن نمایید.
      </p>
    </div>

    <div class="flex w-full items-center gap-3">
      <span class="h-px flex-1 bg-T-300" />
      <span class="text-[16px] text-T-700">ناموجود</span>
      <span class="h-px flex-1 bg-T-300" />
    </div>

    <button
      type="button"
      class="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-R-300 text-[14px] font-medium text-R-300 transition-colors hover:bg-R-10"
      @click="emit('notify-me')"
    >
      موجود شد خبرم کن
      <IconBell class="size-5" />
    </button>
  </div>

  <!-- =============================================== -->
  <!-- Summary / purchase box                           -->
  <!-- =============================================== -->
  <div
    v-else
    :class="cn('flex w-full flex-col gap-4 rounded-2xl border border-T-300 bg-T-50 p-5', props.class)"
  >
    <div class="flex flex-col">
      <!-- Product price -->
      <div class="flex items-center justify-between gap-3 py-3">
        <span class="flex items-center gap-1.5 text-[12.5px] text-T-700">
          <IconTag class="size-4 text-T-600" />
          قیمت کالا:
        </span>
        <span class="flex items-baseline gap-1 text-[13px] font-medium text-T-900">
          {{ formatPriceFa(product.price) }}
          <span class="text-[11px] font-normal text-T-700">تومان</span>
        </span>
      </div>
      <div class="h-px w-full bg-T-300" />

      <!-- Discount -->
      <div v-if="discountAmount > 0" class="flex items-center justify-between gap-3 py-3">
        <span class="flex items-center gap-1.5 text-[12.5px] text-T-700">
          <IconPencil class="size-4 text-R-300" />
          تخفیف:
        </span>
        <span class="flex items-baseline gap-1 text-[13px] font-medium text-T-900">
          {{ formatPriceFa(discountAmount) }}
          <span class="text-[11px] font-normal text-T-700">تومان</span>
        </span>
      </div>
      <div v-if="discountAmount > 0" class="h-px w-full bg-T-300" />

      <!-- Insurance -->
      <div v-if="selectedInsurance" class="flex flex-col gap-1.5 py-3">
        <div class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-1.5 text-[12.5px] text-T-700">
            <IconShieldCheck class="size-4 text-T-600" />
            مبلغ بیمه:
          </span>
          <span class="flex items-baseline gap-1 text-[13px] font-medium text-T-900">
            {{ formatPriceFa(selectedInsurance.price) }}
            <span class="text-[11px] font-normal text-T-700">تومان</span>
          </span>
        </div>
        <div class="flex items-center justify-between gap-3">
          <span class="truncate text-[11.5px] text-T-700">({{ selectedInsurance.name }})</span>
          <button
            type="button"
            class="flex shrink-0 items-center gap-0.5 text-[11.5px] font-medium text-R-300 transition-colors hover:text-R-400"
            @click="emit('open-insurance')"
          >
            جزئیات
            <IconChevronLeft class="size-3.5" />
          </button>
        </div>
      </div>
      <div v-if="selectedInsurance" class="h-px w-full bg-T-300" />

      <!-- Services -->
      <div v-if="addedServices.length" class="flex flex-col gap-1.5 py-3">
        <div class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-1.5 text-[12.5px] text-T-700">
            <IconShoppingBag class="size-4 text-T-600" />
            خدمات:
          </span>
          <span class="flex items-baseline gap-1 text-[13px] font-medium text-T-900">
            {{ formatPriceFa(servicesPrice) }}
            <span class="text-[11px] font-normal text-T-700">تومان</span>
          </span>
        </div>
        <div class="flex items-center justify-between gap-3">
          <span class="truncate text-[11.5px] text-T-700">
            ({{ addedServices.length }} مورد)
          </span>
          <button
            type="button"
            class="flex shrink-0 items-center gap-0.5 text-[11.5px] font-medium text-R-300 transition-colors hover:text-R-400"
            @click="emit('open-services')"
          >
            جزئیات
            <IconChevronLeft class="size-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Total -->
    <div class="flex items-end justify-between gap-3 border-t border-T-300 pt-4">
      <span class="text-[13px] text-T-700">جمع کل</span>
      <span class="flex flex-col items-end gap-1">
        <span v-if="product.oldPrice" class="flex items-center gap-2">
          <span class="text-[12px] text-T-600 line-through">{{ formatPriceFa(product.oldPrice) }}</span>
          <span
            v-if="discountPercent"
            class="flex h-[21px] items-center rounded-full bg-R-300 px-2 text-[10.5px] font-extrabold text-white"
          >
            ٪{{ discountPercent }}
          </span>
        </span>
        <span class="flex items-baseline gap-1">
          <span class="text-[22px] font-extrabold text-T-900">{{ formatPriceFa(payable) }}</span>
          <span class="text-[12px] text-T-700">تومان</span>
        </span>
      </span>
    </div>

    <!-- Add to cart -->
    <button
      type="button"
      class="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-R-300 text-[14px] font-bold text-white transition-colors hover:bg-R-400"
    >
      <IconShoppingCart class="size-5" />
      افزودن به سبد خرید
    </button>

    <!-- Selected color + warranty -->
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
          <span class="text-[12.5px] font-medium text-T-900">{{ selectedWarranty.label }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
