<script setup lang="ts">
import { computed } from 'vue'
import { IconStarFilled, IconChevronLeft, IconInfoCircle } from '@tabler/icons-vue'
import type { ProductDetail, ProductDetailColor, ServiceCatalogItem } from '~/data/product'
import { formatPriceFa, toPersianDigits } from '~/utils/format'
import { typographyVariants } from '~/components/ui/typography'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    product: ProductDetail
    selectedWarrantyId: string
    selectedColor: string
    selectedInsuranceId: string | null
    addedServices?: ServiceCatalogItem[]
    class?: string
  }>(),
  { addedServices: () => [], class: '' },
)

const emit = defineEmits<{
  'update:selectedWarrantyId': [value: string]
  'update:selectedColor': [value: string]
  'update:selectedInsuranceId': [value: string | null]
  'open-services': []
  'open-comment': []
  'open-insurance': []
  'remove-service': [id: string]
}>()

const isAvailable = computed(() => props.product.stockStatus === 'available')
const selectedColorName = computed(
  () => props.product.colors.find(c => c.value === props.selectedColor)?.name ?? '',
)
const selectedWarrantyLabel = computed(
  () => props.product.warrantyOptions.find(w => w.id === props.selectedWarrantyId)?.label ?? '',
)
const selectedInsuranceName = computed(
  () => props.product.insuranceOptions.find(i => i.id === props.selectedInsuranceId)?.name ?? '',
)

function colorShades(color: ProductDetailColor) {
  return color.shades?.length ? color.shades : [color.value]
}

function toggleInsurance(id: string) {
  emit('update:selectedInsuranceId', props.selectedInsuranceId === id ? null : id)
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div :class="cn('flex w-full flex-col gap-8', props.class)">
    <!-- ================================================ -->
    <!-- Available: option selectors                        -->
    <!-- ================================================ -->
    <template v-if="isAvailable">
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-2.5 text-start">
          <UiTypography as="h1" size="2xl" weight="medium">
            {{ product.title }}
          </UiTypography>
          <UiTypography as="p" dir="ltr" size="md" weight="medium" color="muted" class="text-right">
            {{ product.englishTitle }}
          </UiTypography>
        </div>

        <div class="h-px w-full bg-T-300" />

        <!-- Rating + quick chips -->
        <div class="flex items-center gap-[22px]">
          <div class="flex items-center gap-1">
            <IconStarFilled class="size-3.5 text-[#FFAA39]" />
            <UiTypography size="lg" weight="medium">{{ product.rating }}</UiTypography>
            <UiTypography size="md" color="muted">(امتیاز {{ toPersianDigits(product.ratingCount) }} خریدار)</UiTypography>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-200 px-[15px] transition-colors hover:bg-T-300"
              :class="typographyVariants({ size: 'md', weight: 'medium' })"
              @click="scrollToSection('product-features')"
            >
              ویژگی‌ها
              <IconChevronLeft class="size-3 text-T-600" />
            </button>
            <button
              type="button"
              class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-200 px-[15px] transition-colors hover:bg-T-300"
              :class="typographyVariants({ size: 'md', weight: 'medium' })"
              @click="scrollToSection('product-comments')"
            >
              {{ toPersianDigits(product.commentsCount) }} دیدگاه
              <IconChevronLeft class="size-3 text-T-600" />
            </button>
          </div>
        </div>
      </div>

      <!-- Colors -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center gap-2.5">
          <UiTypography as="p" size="xl" weight="semibold">رنگ:</UiTypography>
          <UiTypography as="p" size="lg" color="muted">({{ selectedColorName || 'انتخاب نشده' }})</UiTypography>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
          <button
            v-for="color in product.colors"
            :key="color.value"
            type="button"
            class="flex h-[38px] items-center gap-2 rounded-lg border px-[18px] transition-colors"
            :class="selectedColor === color.value
              ? 'border-R-300'
              : 'border-T-400 hover:border-T-500'"
            :aria-pressed="selectedColor === color.value"
            @click="emit('update:selectedColor', color.value)"
          >
            <span dir="ltr" class="flex size-5 shrink-0 overflow-hidden rounded-full">
              <span
                v-for="(shade, si) in colorShades(color)"
                :key="si"
                class="h-full flex-1"
                :style="{ backgroundColor: shade }"
              />
            </span>
            <UiTypography
              as="span"
              size="lg"
              color="muted"
            >{{ color.name }}</UiTypography>
          </button>
        </div>
      </div>

      <!-- Warranty -->
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center gap-2.5">
          <UiTypography as="p" size="xl" weight="semibold">گارانتی:</UiTypography>
          <UiTypography as="p" size="lg" color="muted">({{ selectedWarrantyLabel }})</UiTypography>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button
            v-for="option in product.warrantyOptions"
            :key="option.id"
            type="button"
            class="flex h-[38px] min-w-[150px] flex-1 items-center gap-2 rounded-lg border px-3 text-start transition-colors"
            :class="selectedWarrantyId === option.id
              ? 'border-R-300'
              : 'border-T-400 hover:border-T-500'"
            :aria-pressed="selectedWarrantyId === option.id"
            @click="emit('update:selectedWarrantyId', option.id)"
          >
            <span
              class="size-[18px] shrink-0 rounded-full"
              :class="selectedWarrantyId === option.id
                ? 'border-[4px] border-R-300'
                : 'border-[1.5px] border-T-500'"
            />
            <UiTypography
              as="span"
              size="md"
              class="truncate"
              :color="selectedWarrantyId === option.id ? 'default' : 'muted'"
            >{{ option.label }}</UiTypography>
          </button>
        </div>
      </div>

      <!-- Insurance -->
      <div class="flex flex-col gap-[18px]">
        <div class="flex items-center gap-2.5">
          <UiTypography as="p" size="xl" weight="semibold">بیمه‌ها:</UiTypography>
          <UiTypography as="p" size="lg" color="muted">({{ selectedInsuranceName || 'بدون بیمه' }})</UiTypography>
        </div>
        <div class="flex flex-col gap-2.5">
          <button
            v-for="option in product.insuranceOptions"
            :key="option.id"
            type="button"
            class="flex items-center gap-[14px] rounded-lg border bg-white px-3 py-[9px] text-start transition-colors"
            :class="selectedInsuranceId === option.id
              ? 'border-R-300'
              : 'border-T-400 hover:border-T-500'"
            :aria-pressed="selectedInsuranceId === option.id"
            @click="toggleInsurance(option.id)"
          >
            <span
              class="size-[18px] shrink-0 rounded-full"
              :class="selectedInsuranceId === option.id
                ? 'border-[4px] border-R-300'
                : 'border-[1.5px] border-T-500'"
            />

            <span class="flex min-w-0 flex-1 flex-col gap-2">
              <UiTypography as="span" size="lg" weight="medium" class="truncate">{{ option.name }}</UiTypography>
              <span class="flex items-center gap-1.5">
                <span class="flex items-baseline gap-1.5">
                  <UiTypography size="md" weight="medium">{{ formatPriceFa(option.price) }}</UiTypography>
                  <UiTypography size="sm" weight="medium" color="subtle">تومان</UiTypography>
                </span>
                <template v-if="option.oldPrice">
                  <span class="flex h-5 min-w-[30px] items-center justify-center rounded-2xl bg-R-300 px-1">
                    <UiTypography size="xs" weight="bold" color="white">٪{{ option.discount }}</UiTypography>
                  </span>
                  <UiTypography size="sm" weight="medium" color="subtle" class="line-through">{{ formatPriceFa(option.oldPrice) }}</UiTypography>
                </template>
              </span>
            </span>

            <span
              class="flex size-6 shrink-0 items-center justify-center text-T-700"
              role="button"
              aria-label="اطلاعات بیمه"
              @click.stop="emit('open-insurance')"
            >
              <IconInfoCircle class="size-[18px]" />
            </span>
          </button>
        </div>
      </div>

      <!-- Services & accessories -->
      <ProductDetailSelectedServices
        v-if="addedServices.length"
        :services="addedServices"
        @open-services="emit('open-services')"
        @remove-service="id => emit('remove-service', id)"
      />

      <!-- Empty services state -->
      <div v-else class="flex flex-col gap-[18px]">
        <div class="flex h-[25px] items-center justify-between gap-2.5">
          <UiTypography as="h2" size="xl" weight="semibold" class="leading-[19px]">خدمات و لوازم جانبی:</UiTypography>
          <button
            type="button"
            class="flex h-[25px] items-center gap-1 transition-colors"
            @click="emit('open-services')"
          >
            <img src="/icons/product-detail/plus-15.svg" alt="" class="size-[15px]">
            <UiTypography size="md" weight="medium" class="text-R-300 transition-colors hover:text-R-400">
              افزودن خدمت
            </UiTypography>
          </button>
        </div>

        <div class="relative flex h-[159px] flex-col items-center justify-center gap-[14px] rounded-[20px] bg-T-100 px-3 py-[9px]">
          <!-- Dashed outline from the design (5/5 dash, radius 20) -->
          <svg class="pointer-events-none absolute inset-0 size-full text-T-500" aria-hidden="true">
            <rect
              x="0.5"
              y="0.5"
              width="calc(100% - 1px)"
              height="calc(100% - 1px)"
              rx="19.5"
              ry="19.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-dasharray="5 5"
            />
          </svg>

          <img src="/icons/product-detail/package-simple-arrow-down-22.svg" alt="" class="size-[22px]">

          <div class="flex flex-col items-center gap-0.5 text-center">
            <UiTypography as="p" size="lg" weight="medium" class="text-black">هنوز خدمتی اضافه نکرده‌اید!</UiTypography>
            <UiTypography as="p" size="md" color="subtle">
              با نصب نرم‌افزار و بازی، گلس، قاب یا لوازم جانبی، خرید‌تان را کامل کنید.
            </UiTypography>
          </div>

          <button
            type="button"
            class="flex h-9 w-full max-w-[202px] items-center justify-center gap-1.5 rounded-[12px] border border-R-300 px-[18px] transition-colors hover:bg-R-25"
            @click="emit('open-services')"
          >
            <img src="/icons/product-detail/plus-15.svg" alt="" class="size-[15px]">
            <UiTypography size="md" weight="semibold" class="text-R-300">افزودن خدمات پیشنهادی</UiTypography>
          </button>
        </div>
      </div>

      <!-- Feature spec cards -->
      <div id="product-features" class="flex scroll-mt-24 flex-col gap-[18px]">
        <UiTypography as="h2" size="lg" weight="semibold">ویژگی‌های محصول:</UiTypography>
        <div class="grid grid-cols-3 gap-x-3 gap-y-2">
          <div
            v-for="chip in product.specChips"
            :key="chip.label"
            class="flex h-[66px] flex-col justify-center gap-1.5 rounded-xl bg-T-200 px-3 py-3 text-start"
          >
            <UiTypography as="span" size="md" color="muted">{{ chip.label }}</UiTypography>
            <UiTypography as="span" size="md">{{ chip.value }}</UiTypography>
          </div>
        </div>
      </div>
    </template>

    <!-- ================================================ -->
    <!-- Out of stock: detail state                         -->
    <!-- ================================================ -->
    <template v-else>
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-2.5 text-start">
          <UiTypography as="h1" size="2xl" weight="medium">
            {{ product.title }}
          </UiTypography>
          <UiTypography as="p" dir="ltr" size="md" weight="medium" color="muted" class="text-right">
            {{ product.englishTitle }}
          </UiTypography>
        </div>

        <div class="h-px w-full bg-T-300" />

        <div class="flex items-center gap-[22px]">
          <div class="flex items-center gap-1">
            <img src="/icons/product-detail/star-14.svg" alt="" class="size-3.5">
            <UiTypography size="lg" weight="medium">{{ product.rating }}</UiTypography>
            <UiTypography size="md" color="muted">(امتیاز {{ toPersianDigits(product.ratingCount) }} خریدار)</UiTypography>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-200 px-[15px] transition-colors hover:bg-T-300"
              :class="typographyVariants({ size: 'md', weight: 'medium' })"
              @click="scrollToSection('product-features')"
            >
              ویژگی‌ها
              <img src="/icons/product-detail/angle-left-12.svg" alt="" class="size-3">
            </button>
            <button
              type="button"
              class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-200 px-[15px] transition-colors hover:bg-T-300"
              :class="typographyVariants({ size: 'md', weight: 'medium' })"
              @click="scrollToSection('product-comments')"
            >
              {{ toPersianDigits(product.commentsCount) }} دیدگاه
              <img src="/icons/product-detail/angle-left-12.svg" alt="" class="size-3">
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-[18px]">
        <UiTypography as="h2" size="lg" weight="semibold">ویژگی‌های محصول:</UiTypography>
        <div class="grid grid-cols-3 gap-x-3 gap-y-2">
          <div
            v-for="chip in product.specChips"
            :key="chip.label"
            class="flex h-[66px] flex-col justify-center gap-1.5 rounded-xl bg-T-200 px-3 py-3 text-start"
          >
            <UiTypography as="span" size="md" color="muted">{{ chip.label }}</UiTypography>
            <UiTypography as="span" size="md">{{ chip.value }}</UiTypography>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
