<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IconChevronLeft,
  IconStarFilled,
  IconInfoCircle,
  IconPlus,
  IconX,
  IconBox,
  IconCoins,
  IconPhoto,
} from '@tabler/icons-vue'
import type { ProductDetail, ServiceCatalogItem } from '~/data/product'
import { formatPrice } from '~/utils/format'
import { getDiscountPercent } from '~/utils/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    product: ProductDetail
    selectedWarrantyId: string
    selectedColor: string
    selectedInsuranceId: string | null
    addedServices: ServiceCatalogItem[]
    activeTab: 'review' | 'specs' | 'comments'
    class?: string
  }>(),
  { class: '' },
)

const emit = defineEmits<{
  'update:selectedWarrantyId': [value: string]
  'update:selectedColor': [value: string]
  'update:selectedInsuranceId': [value: string | null]
  'update:activeTab': [value: 'review' | 'specs' | 'comments']
  'open-services': []
  'open-sellers': []
  'open-insurance': []
  'remove-service': [id: string]
}>()

const activeImage = ref(0)
const discountPercent = computed(() =>
  getDiscountPercent(props.product.price, props.product.oldPrice ?? 0),
)
const selectedColorName = computed(
  () => props.product.colors.find(c => c.value === props.selectedColor)?.name ?? '',
)
const selectedWarrantyLabel = computed(
  () => props.product.warrantyOptions.find(w => w.id === props.selectedWarrantyId)?.label ?? '',
)
const selectedInsuranceName = computed(
  () => props.product.insuranceOptions.find(i => i.id === props.selectedInsuranceId)?.name ?? '',
)

const tabs = [
  { id: 'review', label: 'نقد و بررسی' },
  { id: 'specs', label: 'مشخصات فنی' },
  { id: 'comments', label: 'دیدگاه کاربران' },
] as const

function pickTab(id: 'review' | 'specs' | 'comments') {
  emit('update:activeTab', id)
  document.getElementById(`product-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div :class="cn('flex w-full flex-col bg-T-100 lg:hidden', props.class)">
    <!-- Gallery -->
    <div class="relative flex w-full items-center justify-center bg-T-50">
      <ProductImage
        :src="product.images[activeImage]?.src"
        :alt="product.title"
        container-class="aspect-square w-full max-w-[370px] rounded-none bg-transparent"
        image-class="max-h-[92%] max-w-[92%]"
      />
      <!-- Image counter -->
      <span
        class="absolute bottom-3 start-3 flex h-7 items-center gap-1.5 rounded-lg bg-T-900/60 px-2.5 text-[11px] font-medium text-white"
      >
        <IconPhoto class="size-4" />
        <span dir="ltr">{{ product.images.length }}/{{ activeImage + 1 }}</span>
      </span>
    </div>

    <!-- Discount badge -->
    <div v-if="product.oldPrice" class="flex justify-start bg-T-50 px-4 pb-3 pt-1">
      <span class="flex h-6 items-center rounded-lg bg-R-300 px-2 text-[12px] font-extrabold text-white">
        ٪{{ discountPercent ?? 30 }}
      </span>
    </div>

    <!-- Content sheet -->
    <div class="-mt-1 flex flex-col rounded-t-2xl bg-T-50 px-4 pt-5">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="flex items-center justify-center gap-1 pb-4 text-[11px] text-T-700">
        <template v-for="(item, i) in ['هماکام', ...product.breadcrumb.slice(1)]" :key="i">
          <span v-if="i > 0" class="text-T-600">&lt;</span>
          <span>{{ item }}</span>
        </template>
      </nav>

      <!-- Title -->
      <h1 class="text-[16px] font-bold leading-[26px] text-T-900">{{ product.title }}</h1>
      <p dir="ltr" class="mt-1.5 text-start font-inter text-[11px] text-T-700">{{ product.englishTitle }}</p>

      <div class="my-4 h-px w-full bg-T-300" />

      <!-- Rating row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="flex items-center gap-1">
            <span class="text-[13px] font-medium text-T-900">{{ product.rating }}</span>
            <IconStarFilled class="size-3.5 text-[#FFAA39]" />
            <span class="text-[11px] text-T-700">(امتیاز {{ product.ratingCount }} خریدار)</span>
          </span>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-100 px-2.5 text-[11px] text-T-900"
            @click="pickTab('comments')"
          >
            <IconChevronLeft class="size-3 text-T-600" />
            {{ product.commentsCount }} دیدگاه
          </button>
          <button
            type="button"
            class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-100 px-2.5 text-[11px] text-T-900"
            @click="pickTab('specs')"
          >
            <IconChevronLeft class="size-3 text-T-600" />
            ویژگی‌ها
          </button>
        </div>
      </div>

      <!-- ============================ Options ============================ -->
      <template v-if="product.stockStatus === 'available'">
        <!-- Colors -->
        <div class="mt-5 flex flex-col gap-2.5">
          <p class="text-[13px] text-T-900">
            رنگ: <span class="text-[12px] text-T-700">({{ selectedColorName || 'انتخاب نشده' }})</span>
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="color in product.colors"
              :key="color.value"
              type="button"
              class="flex h-[38px] items-center gap-2 rounded-lg border px-3 transition-colors"
              :class="selectedColor === color.value ? 'border-R-300' : 'border-T-300'"
              :aria-pressed="selectedColor === color.value"
              @click="emit('update:selectedColor', color.value)"
            >
              <span
                class="text-[12px]"
                :class="selectedColor === color.value ? 'font-medium text-R-300' : 'text-T-900'"
              >{{ color.name }}</span>
              <span class="flex h-5 w-5 overflow-hidden rounded">
                <span
                  v-for="(shade, si) in (color.shades ?? [color.value])"
                  :key="si"
                  class="h-full flex-1"
                  :style="{ backgroundColor: shade }"
                />
              </span>
            </button>
          </div>
        </div>

        <!-- Warranty -->
        <div class="mt-5 flex flex-col gap-2.5">
          <p class="text-[13px] text-T-900">
            گارانتی: <span class="text-[12px] text-T-700">({{ selectedWarrantyLabel }})</span>
          </p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in product.warrantyOptions"
              :key="option.id"
              type="button"
              class="flex h-[38px] items-center justify-between gap-2 rounded-lg border px-3 transition-colors"
              :class="selectedWarrantyId === option.id ? 'border-R-300' : 'border-T-300'"
              :aria-pressed="selectedWarrantyId === option.id"
              @click="emit('update:selectedWarrantyId', option.id)"
            >
              <span
                class="truncate text-[11.5px]"
                :class="selectedWarrantyId === option.id ? 'font-medium text-T-900' : 'text-T-700'"
              >{{ option.label }}</span>
              <span
                class="flex size-[18px] shrink-0 items-center justify-center rounded-full border-2"
                :class="selectedWarrantyId === option.id ? 'border-R-300' : 'border-T-500'"
              >
                <span
                  v-if="selectedWarrantyId === option.id"
                  class="size-2.5 rounded-full bg-R-300"
                />
              </span>
            </button>
          </div>
        </div>

        <!-- Insurance -->
        <div class="mt-5 flex flex-col gap-2.5">
          <p class="text-[13px] text-T-900">
            بیمه: <span class="text-[12px] text-T-700">({{ selectedInsuranceName || 'بدون بیمه' }})</span>
          </p>
          <div class="flex flex-col gap-2">
            <button
              v-for="option in product.insuranceOptions"
              :key="option.id"
              type="button"
              class="flex items-start justify-between gap-3 rounded-xl border p-3 text-start transition-colors"
              :class="selectedInsuranceId === option.id ? 'border-R-300' : 'border-T-300'"
              :aria-pressed="selectedInsuranceId === option.id"
              @click="emit('update:selectedInsuranceId', selectedInsuranceId === option.id ? null : option.id)"
            >
              <span
                class="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2"
                :class="selectedInsuranceId === option.id ? 'border-R-300' : 'border-T-500'"
              >
                <span
                  v-if="selectedInsuranceId === option.id"
                  class="size-2.5 rounded-full bg-R-300"
                />
              </span>
              <span class="flex min-w-0 flex-1 flex-col gap-1.5">
                <span class="truncate text-[12.5px] text-T-900">{{ option.name }}</span>
                <span class="flex items-center gap-2">
                  <template v-if="option.oldPrice">
                    <span class="text-[12px] text-T-600 line-through">{{ formatPrice(option.oldPrice) }}</span>
                    <span class="flex h-[19px] items-center rounded-full bg-R-300 px-1.5 text-[10px] font-extrabold text-white">
                      ٪{{ option.discount }}
                    </span>
                  </template>
                  <span class="text-[12.5px] font-bold text-T-900">{{ formatPrice(option.price) }}</span>
                  <span class="text-[10.5px] text-T-700">تومان</span>
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

        <!-- Services -->
        <div class="mt-6 flex items-center justify-between border-t border-T-300 py-3.5">
          <h2 class="text-[13.5px] font-bold text-T-900">خدمت و لوازم جانبی</h2>
          <button
            type="button"
            class="flex items-center gap-1 text-[12.5px] font-medium text-R-300"
            @click="emit('open-services')"
          >
            <IconPlus class="size-4" />
            افزودن خدمت
          </button>
        </div>

        <!-- Services card -->
        <div class="rounded-2xl border border-T-300 bg-T-100 p-4">
          <template v-if="addedServices.length">
            <ul class="flex flex-col gap-2.5">
              <li
                v-for="service in addedServices"
                :key="service.id"
                class="flex items-center justify-between gap-2"
              >
                <span class="truncate text-[12px] text-T-900">{{ service.label }}</span>
                <span class="flex shrink-0 items-center gap-2">
                  <span class="text-[11.5px] text-T-700">
                    {{ service.price ? `${formatPrice(service.price)} تومان` : 'رایگان' }}
                  </span>
                  <button
                    type="button"
                    class="text-T-600"
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
              class="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-R-300 py-2 text-[12px] font-medium text-R-300"
              @click="emit('open-services')"
            >
              <IconPlus class="size-3.5" />
              افزودن خدمت پیشنهادی
            </button>
          </template>

          <template v-else>
            <div class="flex flex-col items-center gap-2 py-3 text-center">
              <IconBox class="size-6 text-T-600" stroke-width="1.5" />
              <p class="text-[12.5px] font-bold text-T-900">هیچ خدمتی انتخاب نکردید</p>
              <p class="max-w-[240px] text-[11.5px] leading-[18px] text-T-700">
                با انتخاب هر خدمت، هزینه آن به قیمت نهایی کالا اضافه می‌شود
              </p>
            </div>
            <button
              type="button"
              class="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-R-300 py-2 text-[12px] font-medium text-R-300"
              @click="emit('open-services')"
            >
              <IconPlus class="size-3.5" />
              افزودن خدمت پیشنهادی
            </button>
          </template>
        </div>
      </template>

      <!-- Spec chips -->
      <div class="mt-6 flex flex-col gap-3">
        <h2 class="text-[13.5px] font-bold text-T-900">ویژگی‌های محصول</h2>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="chip in product.specChips.slice(0, 4)"
            :key="chip.label"
            class="flex min-h-[58px] flex-col justify-center gap-1 rounded-xl bg-T-200 p-3"
          >
            <span class="text-[10.5px] text-T-700">{{ chip.label }}</span>
            <span class="truncate text-[12px] text-T-900">{{ chip.value }}</span>
          </div>
        </div>
      </div>

      <!-- Sellers banner -->
      <button
        type="button"
        class="mt-5 flex h-[41px] w-full items-center justify-between rounded-xl bg-[#EAECFF] px-3.5"
        @click="emit('open-sellers')"
      >
        <span class="flex items-center gap-2">
          <IconCoins class="size-5 text-[#5A6AFF]" />
          <span class="text-[12px] font-medium text-[#5A6AFF]">
            فروشندگان طریق قرارداد اقساطی و اعتباری
          </span>
        </span>
        <IconChevronLeft class="size-4 text-[#5A6AFF]" />
      </button>
    </div>

    <!-- Tabs -->
    <div class="sticky top-12 z-30 mt-6 grid grid-cols-3 border-y border-T-300 bg-T-50">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="relative py-3 text-center text-[12.5px] transition-colors"
        :class="activeTab === tab.id ? 'font-bold text-R-300' : 'text-T-700'"
        @click="pickTab(tab.id)"
      >
        {{ tab.label }}
        <span
          v-if="activeTab === tab.id"
          class="absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-R-300"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: 'Inter', 'Arad', sans-serif;
}
</style>
