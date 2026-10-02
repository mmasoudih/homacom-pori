<script setup lang="ts">
import { computed } from 'vue'
import {
  IconStarFilled,
  IconChevronLeft,
  IconPlus,
  IconInfoCircle,
  IconPackage,
  IconX,
  IconLockFilled,
} from '@tabler/icons-vue'
import type { ProductDetail, ProductDetailColor, ServiceCatalogItem } from '~/data/product'
import { formatPriceFa } from '~/utils/format'
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
  <div :class="cn('flex w-full flex-col gap-5', props.class)">
    <!-- Title -->
    <div class="flex flex-col gap-2 text-start">
      <h1 class="text-[19px] font-bold leading-[30px] text-T-900">
        {{ product.title }}
        <span
          v-if="!isAvailable"
          class="ms-2 inline-flex h-[24px] items-center rounded-lg bg-R-50 px-2 align-middle text-[12px] font-bold text-R-300"
        >ناموجود</span>
      </h1>
      <p dir="ltr" class="text-right font-inter text-[12.5px] text-T-700">
        {{ product.englishTitle }}
      </p>
    </div>

    <div class="h-px w-full bg-T-300" />

    <!-- Rating + quick chips -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-1.5">
        <span class="text-[13.5px] font-medium text-T-900">{{ product.rating }}</span>
        <IconStarFilled class="size-3.5 text-[#FFAA39]" />
        <span class="text-[12.5px] text-T-700">(امتیاز {{ product.ratingCount }} خریدار)</span>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-200 px-3 text-[12.5px] text-T-900 transition-colors hover:border-T-500"
          @click="scrollToSection('product-features')"
        >
          <IconChevronLeft class="size-3 text-T-600" />
          ویژگی‌ها
        </button>
        <button
          type="button"
          class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-200 px-3 text-[12.5px] text-T-900 transition-colors hover:border-T-500"
          @click="scrollToSection('product-comments')"
        >
          <IconChevronLeft class="size-3 text-T-600" />
          {{ product.commentsCount }} دیدگاه
        </button>
      </div>
    </div>

    <!-- ================================================ -->
    <!-- Available: option selectors                        -->
    <!-- ================================================ -->
    <template v-if="isAvailable">
      <!-- Colors -->
      <div class="flex flex-col gap-2.5">
        <p class="text-[14px] text-T-900">
          رنگ:
          <span class="text-[12.5px] text-T-700">({{ selectedColorName || 'انتخاب نشده' }})</span>
        </p>
        <div class="flex flex-wrap items-center gap-2.5">
          <button
            v-for="color in product.colors"
            :key="color.value"
            type="button"
            class="flex h-[46px] items-center gap-2.5 rounded-xl border px-3.5 transition-colors"
            :class="selectedColor === color.value
              ? 'border-R-300 bg-R-10'
              : 'border-T-300 bg-T-50 hover:border-T-500'"
            :aria-pressed="selectedColor === color.value"
            @click="emit('update:selectedColor', color.value)"
          >
            <span dir="ltr" class="flex size-[28px] shrink-0 overflow-hidden rounded-full">
              <span
                v-for="(shade, si) in colorShades(color)"
                :key="si"
                class="h-full flex-1"
                :style="{ backgroundColor: shade }"
              />
            </span>
            <span
              class="text-[13px]"
              :class="selectedColor === color.value ? 'font-medium text-R-300' : 'text-T-900'"
            >{{ color.name }}</span>
          </button>
        </div>
      </div>

      <!-- Warranty -->
      <div class="flex flex-col gap-2.5">
        <p class="text-[14px] text-T-900">
          گارانتی:
          <span class="text-[12.5px] text-T-700">({{ selectedWarrantyLabel }})</span>
        </p>
        <div class="grid grid-cols-3 gap-2.5">
          <button
            v-for="option in product.warrantyOptions"
            :key="option.id"
            type="button"
            class="flex h-[46px] items-center gap-2.5 rounded-lg border px-3.5 text-start transition-colors"
            :class="selectedWarrantyId === option.id
              ? 'border-R-300 bg-T-50'
              : 'border-T-300 bg-T-50 hover:border-T-500'"
            :aria-pressed="selectedWarrantyId === option.id"
            @click="emit('update:selectedWarrantyId', option.id)"
          >
            <span
              class="flex size-[17px] shrink-0 items-center justify-center rounded-full border-2"
              :class="selectedWarrantyId === option.id ? 'border-R-300' : 'border-T-500'"
            >
              <span
                v-if="selectedWarrantyId === option.id"
                class="size-2 rounded-full bg-R-300"
              />
            </span>
            <span
              class="truncate text-[12px]"
              :class="selectedWarrantyId === option.id ? 'font-medium text-T-900' : 'text-T-700'"
            >{{ option.label }}</span>
          </button>
        </div>
      </div>

      <!-- Insurance -->
      <div class="flex flex-col gap-2.5">
        <p class="text-[14px] text-T-900">
          بیمه‌ها:
          <span class="text-[12.5px] text-T-700">({{ selectedInsuranceName || 'بدون بیمه' }})</span>
        </p>
        <div class="flex flex-col gap-2.5">
          <button
            v-for="option in product.insuranceOptions"
            :key="option.id"
            type="button"
            class="flex items-center gap-3 rounded-xl border bg-T-50 p-4 text-start transition-colors"
            :class="selectedInsuranceId === option.id
              ? 'border-R-300'
              : 'border-T-300 hover:border-T-500'"
            :aria-pressed="selectedInsuranceId === option.id"
            @click="toggleInsurance(option.id)"
          >
            <span
              class="flex size-[18px] shrink-0 items-center justify-center rounded-full border-2"
              :class="selectedInsuranceId === option.id ? 'border-R-300' : 'border-T-500'"
            >
              <span
                v-if="selectedInsuranceId === option.id"
                class="size-2.5 rounded-full bg-R-300"
              />
            </span>

            <span class="flex min-w-0 flex-1 flex-col gap-1.5">
              <span class="truncate text-[13.5px] font-bold text-T-900">{{ option.name }}</span>
              <span class="flex items-center gap-2">
                <span class="flex items-baseline gap-1">
                  <span class="text-[13px] font-bold text-T-900">{{ formatPriceFa(option.price) }}</span>
                  <span class="text-[10.5px] font-normal text-T-700">تومان</span>
                </span>
                <template v-if="option.oldPrice">
                  <span class="flex h-[19px] items-center rounded-full bg-R-300 px-1.5 text-[10px] font-extrabold text-white">
                    ٪{{ option.discount }}
                  </span>
                  <span class="text-[12px] text-T-600 line-through">{{ formatPriceFa(option.oldPrice) }}</span>
                </template>
              </span>
            </span>

            <span
              class="flex size-6 shrink-0 items-center justify-center text-T-600"
              role="button"
              aria-label="اطلاعات بیمه"
              @click.stop="emit('open-insurance')"
            >
              <IconInfoCircle class="size-4" />
            </span>
          </button>
        </div>
      </div>

      <!-- Services & accessories -->
      <div class="flex flex-col gap-4 pt-1">
        <div class="flex items-center justify-between">
          <h2 class="text-[16px] font-bold text-T-900">خدمات و لوازم جانبی:</h2>
          <button
            type="button"
            class="flex items-center gap-1 text-[13px] font-medium text-R-300 transition-colors hover:text-R-400"
            @click="emit('open-services')"
          >
            <IconPlus class="size-4" />
            افزودن خدمت
          </button>
        </div>

        <!-- Added services list -->
        <template v-if="addedServices.length">
          <ul class="flex flex-col gap-2.5">
            <li
              v-for="service in addedServices"
              :key="service.id"
              class="flex items-center justify-between gap-2 rounded-xl bg-T-100 px-4 py-3"
            >
              <span class="truncate text-[12.5px] text-T-900">{{ service.label }}</span>
              <span class="flex shrink-0 items-center gap-3">
                <span class="text-[12px] text-T-700">
                  {{ service.price ? `${formatPriceFa(service.price)} تومان` : 'رایگان' }}
                </span>
                <button
                  type="button"
                  class="text-T-600 transition-colors hover:text-R-300"
                  :aria-label="`حذف ${service.label}`"
                  @click="emit('remove-service', service.id)"
                >
                  <IconX class="size-4" />
                </button>
              </span>
            </li>
          </ul>
          <button
            type="button"
            class="flex h-[42px] items-center justify-center gap-1.5 self-center rounded-xl border border-R-300 px-6 text-[13px] font-medium text-R-300 transition-colors hover:bg-R-10"
            @click="emit('open-services')"
          >
            <IconPlus class="size-4" />
            افزودن خدمات پیشنهادی
          </button>
        </template>

        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center gap-2.5 rounded-2xl border border-dashed border-T-400 bg-T-100 px-6 py-7 text-center"
        >
          <IconPackage class="size-7 text-T-600" stroke-width="1.5" />
          <div class="flex flex-col gap-1.5">
            <p class="text-[14px] font-bold text-T-900">هنوز خدمتی اضافه نکرده‌اید</p>
            <p class="text-[12.5px] leading-[20px] text-T-700">
              با نصب نرم‌افزار و بازی، گلس، قاب یا لوازم جانبی، خریدتان را کامل کنید.
            </p>
          </div>
          <button
            type="button"
            class="mt-2 flex h-[44px] items-center justify-center gap-1.5 rounded-xl border border-R-300 bg-T-50 px-7 text-[13px] font-medium text-R-300 transition-colors hover:bg-R-10"
            @click="emit('open-services')"
          >
            <IconPlus class="size-4" />
            افزودن خدمات پیشنهادی
          </button>
        </div>
      </div>

      <!-- Feature spec cards -->
      <div id="product-features" class="flex scroll-mt-24 flex-col gap-4 pt-1">
        <h2 class="text-[16px] font-bold text-T-900">ویژگی‌های محصول:</h2>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="chip in product.specChips"
            :key="chip.label"
            class="flex min-h-[86px] flex-col items-start justify-center gap-1.5 rounded-xl bg-T-200 px-4 py-3 text-start"
          >
            <span class="text-[12.5px] text-T-700">{{ chip.label }}</span>
            <span class="text-[13px] font-medium text-T-900">{{ chip.value }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- ================================================ -->
    <!-- Out of stock: spec chips grid                      -->
    <!-- ================================================ -->
    <template v-else>
      <p class="text-[14px] font-semibold text-T-900">ویژگی‌های محصول:</p>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="chip in product.specChips"
          :key="chip.label"
          class="flex min-h-[66px] flex-col justify-center gap-1.5 rounded-xl bg-T-200 p-3"
        >
          <span class="text-[12.5px] text-T-700">{{ chip.label }}</span>
          <span class="text-[12.5px] text-T-900">{{ chip.value }}</span>
        </div>
      </div>

      <div class="mt-1 flex items-center gap-2">
        <IconLockFilled class="size-4 text-R-300" />
        <span class="text-[13px] font-medium text-R-300">ناموجود</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: 'Arad', 'Inter', sans-serif;
}
</style>
