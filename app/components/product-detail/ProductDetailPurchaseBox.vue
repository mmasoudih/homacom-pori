<script setup lang="ts">
import { computed } from 'vue'
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
  'add-to-cart': []
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
    :class="cn('flex w-full flex-col items-center gap-6 rounded-[12px] border border-T-400 bg-white p-5', props.class)"
  >
    <img src="/icons/product-detail/tag-exclamation-circle-46.svg" alt="" class="size-[46px]">

    <div class="flex w-full flex-col items-center gap-2 text-center">
      <UiTypography as="p" size="lg" weight="medium">این کالا فعلا موجود نیست</UiTypography>
      <UiTypography as="p" size="md" color="muted" class="w-full">
        این محصول در حال حاضر موجود نیست. می‌توانید از محصولات جایگزین در بالای صفحه دیدن نمایید.
      </UiTypography>
    </div>

    <div class="flex w-full flex-col items-center gap-3">
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

  <!-- =============================================== -->
  <!-- Summary / purchase box (design: frame-product-price) -->
  <!-- =============================================== -->
  <div
    v-else
    :class="cn('flex w-full flex-col gap-6 rounded-[12px] border border-T-400 bg-white p-5', props.class)"
  >
    <!-- Price breakdown -->
    <div class="flex flex-col gap-1.5">
      <!-- Product price -->
      <div class="flex items-center justify-between gap-3 border-b border-T-300 py-3">
        <span class="flex items-center gap-1.5">
          <img src="/icons/product-detail/tag-simple-20.svg" alt="" class="size-5 shrink-0">
          <UiTypography size="md" color="muted">قیمت کالا:</UiTypography>
        </span>
        <span class="flex items-baseline gap-1.5">
          <UiTypography size="lg" weight="medium">{{ formatPriceFa(product.price) }}</UiTypography>
          <UiTypography size="sm" weight="semibold" color="subtle">تومان</UiTypography>
        </span>
      </div>

      <!-- Discount -->
      <div v-if="discountAmount > 0" class="flex items-center justify-between gap-3 border-b border-T-300 py-3">
        <span class="flex items-center gap-1.5">
          <img src="/icons/product-detail/percent-bubble-tag-20.svg" alt="" class="size-5 shrink-0">
          <UiTypography size="md" color="muted">تخفیف:</UiTypography>
        </span>
        <span class="flex items-baseline gap-1.5">
          <UiTypography size="lg" weight="medium">{{ formatPriceFa(discountAmount) }}</UiTypography>
          <UiTypography size="sm" weight="semibold" color="subtle">تومان</UiTypography>
        </span>
      </div>

      <!-- Insurance -->
      <div
        v-if="selectedInsurance"
        class="flex min-h-[75px] flex-col justify-center gap-1.5 border-b border-T-300 py-3"
      >
        <div class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-1.5">
            <img src="/icons/product-detail/shield-check-20.svg" alt="" class="size-5 shrink-0">
            <UiTypography size="md" color="muted">مبلغ بیمه‌:</UiTypography>
          </span>
          <span class="flex items-baseline gap-1.5">
            <UiTypography size="lg" weight="medium">{{ formatPriceFa(selectedInsurance.price) }}</UiTypography>
            <UiTypography size="sm" weight="semibold" color="subtle">تومان</UiTypography>
          </span>
        </div>
        <div class="flex min-h-[25px] items-center justify-between gap-3 pr-3">
          <UiTypography size="lg" class="truncate text-start">
            ({{ selectedInsurance.name }})
          </UiTypography>
          <button
            type="button"
            class="flex shrink-0 items-center gap-1"
            @click="emit('open-insurance')"
          >
            <UiTypography size="md" weight="medium" class="text-R-300 transition-colors hover:text-R-400">جزئیات</UiTypography>
            <img src="/icons/product-detail/angle-left-13.svg" alt="" class="size-[13px]">
          </button>
        </div>
      </div>

      <!-- Services -->
      <div
        v-if="addedServices.length"
        class="flex min-h-[75px] flex-col justify-center gap-1.5 border-b border-T-300 py-3"
      >
        <div class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-1.5">
            <img src="/icons/product-detail/package-simple-arrow-down-20.svg" alt="" class="size-5 shrink-0">
            <UiTypography size="md" color="muted">خدمات:</UiTypography>
          </span>
          <span class="flex items-baseline gap-1.5">
            <UiTypography size="lg" weight="medium">{{ formatPriceFa(servicesPrice) }}</UiTypography>
            <UiTypography size="sm" weight="semibold" color="subtle">تومان</UiTypography>
          </span>
        </div>
        <div class="flex min-h-[25px] items-center justify-between gap-3 pr-3">
          <UiTypography size="lg" class="truncate text-start">
            ({{ addedServices.length }} مورد)
          </UiTypography>
          <button
            type="button"
            class="flex shrink-0 items-center gap-1"
            @click="emit('open-services')"
          >
            <UiTypography size="md" weight="medium" class="text-R-300 transition-colors hover:text-R-400">جزئیات</UiTypography>
            <img src="/icons/product-detail/angle-left-13.svg" alt="" class="size-[13px]">
          </button>
        </div>
      </div>
    </div>

    <!-- Total + add to cart -->
    <div class="flex flex-col gap-3">
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
            <UiTypography size="2xl" weight="bold" class="leading-[22px]">{{ formatPriceFa(payable) }}</UiTypography>
            <UiTypography size="md" weight="semibold" color="subtle">تومان</UiTypography>
          </span>
        </span>
      </div>

      <button
        type="button"
        class="flex h-[42px] w-full items-center justify-center gap-1.5 rounded-[12px] bg-R-300 px-[18px] transition-colors hover:bg-R-400"
        @click="emit('add-to-cart')"
      >
        <img src="/icons/product-detail/shopping-bag-22.svg" alt="" class="size-[22px] shrink-0">
        <UiTypography size="lg" weight="bold" color="white">افزودن به سبد خرید</UiTypography>
      </button>

      <UiTypography
        v-if="(product.minOrderQuantity ?? 1) > 1"
        as="p"
        size="sm"
        color="subtle"
        class="text-center"
      >
        حداقل خرید این کالا {{ product.minOrderQuantity }} عدد است.
      </UiTypography>
    </div>

    <!-- Selected color + warranty -->
    <div class="flex flex-col gap-1.5">
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
          <img src="/icons/product-detail/certificate-20.svg" alt="" class="size-5 shrink-0">
          <UiTypography size="md" color="muted" class="shrink-0">گارانتی:</UiTypography>
        </span>
        <UiTypography size="md" weight="medium" class="truncate text-end">
          {{ selectedWarranty.label }}
        </UiTypography>
      </div>
    </div>
  </div>
</template>
