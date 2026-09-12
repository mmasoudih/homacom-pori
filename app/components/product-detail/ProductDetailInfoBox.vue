<script setup lang="ts">
import { computed } from 'vue'
import {
  IconStarFilled,
  IconChevronLeft,
  IconCirclePlus,
  IconShieldCheckFilled,
  IconLockFilled,
} from '@tabler/icons-vue'
import type { ProductDetail } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    product: ProductDetail
    selectedWarrantyId: string
    selectedStorageId: string
    selectedColor: string
    class?: string
  }>(),
  { class: '' },
)

const emit = defineEmits<{
  'update:selectedWarrantyId': [value: string]
  'update:selectedStorageId': [value: string]
  'update:selectedColor': [value: string]
  'open-services': []
  'open-comment': []
  'open-insurance': []
}>()

const isAvailable = computed(() => props.product.stockStatus === 'available')
const selectedColorName = computed(
  () => props.product.colors.find(c => c.value === props.selectedColor)?.name ?? '',
)
const canAddServices = computed(() => Boolean(props.selectedColor))

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div :class="cn('flex w-full flex-col gap-4', props.class)">
    <!-- Title -->
    <div class="flex flex-col gap-2.5">
      <h1 class="text-[18px] font-medium leading-[26px] text-T-900">
        {{ product.title }}
        <span
          v-if="!isAvailable"
          class="ms-2 inline-flex h-[24px] items-center rounded-lg bg-R-50 px-2 align-middle text-[12px] font-bold text-R-300"
        >ناموجود</span>
      </h1>
      <p dir="ltr" class="text-start font-inter text-[12.5px] text-T-700">
        {{ product.englishTitle }}
      </p>
    </div>

    <!-- Rating + quick chips -->
    <div class="flex items-center gap-5">
      <div class="flex items-center gap-1">
        <span class="text-[14px] font-medium text-T-900">{{ product.rating }}</span>
        <IconStarFilled class="size-3.5 text-[#FFAA39]" />
        <span class="text-[12.5px] text-T-700">(امتیاز {{ product.ratingCount }} خریدار)</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-200 px-3 text-[12.5px] text-T-900 transition-colors hover:border-T-500"
          @click="scrollToSection('product-comments')"
        >
          <IconChevronLeft class="size-3 text-T-600" />
          {{ product.commentsCount }} دیدگاه
        </button>
        <button
          type="button"
          class="flex h-[30px] items-center gap-1 rounded-full border border-T-300 bg-T-200 px-3 text-[12.5px] text-T-900 transition-colors hover:border-T-500"
          @click="scrollToSection('product-features')"
        >
          <IconChevronLeft class="size-3 text-T-600" />
          ویژگی‌ها
        </button>
      </div>
    </div>

    <div class="h-px w-full bg-T-300" />

    <!-- ================================================ -->
    <!-- Available: option selectors                        -->
    <!-- ================================================ -->
    <template v-if="isAvailable">
      <!-- Warranty -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[14px] text-T-700">گارانتی:</span>
        <button
          v-for="option in product.warrantyOptions"
          :key="option.id"
          type="button"
          class="flex h-[34px] items-center rounded-full border px-3.5 text-[12.5px] transition-colors"
          :class="selectedWarrantyId === option.id
            ? 'border-R-300 bg-R-10 font-medium text-R-300'
            : 'border-T-300 bg-T-50 text-T-700 hover:border-T-500'"
          :aria-pressed="selectedWarrantyId === option.id"
          @click="emit('update:selectedWarrantyId', option.id)"
        >
          {{ option.label }}
        </button>
      </div>

      <!-- Storage -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[14px] text-T-700">حافظه:</span>
        <button
          v-for="option in product.storageOptions"
          :key="option.id"
          type="button"
          class="flex h-[34px] items-center rounded-full border px-3.5 text-[12.5px] transition-colors"
          :class="selectedStorageId === option.id
            ? 'border-R-300 bg-R-10 font-medium text-R-300'
            : 'border-T-300 bg-T-50 text-T-700 hover:border-T-500'"
          :aria-pressed="selectedStorageId === option.id"
          @click="emit('update:selectedStorageId', option.id)"
        >
          {{ option.label }}
        </button>
      </div>

      <!-- Colors -->
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-[14px] text-T-700">رنگ:</span>
        <span class="text-[12.5px]" :class="selectedColorName ? 'text-T-900' : 'text-T-600'">
          {{ selectedColorName || 'یک رنگ را انتخاب کنید' }}
        </span>
        <div class="flex items-center gap-2">
          <button
            v-for="color in product.colors"
            :key="color.value"
            type="button"
            class="size-6 rounded-lg border border-T-500 transition-shadow"
            :class="selectedColor === color.value && 'ring-1 ring-R-300 ring-offset-2'"
            :style="{ backgroundColor: color.value }"
            :aria-label="`رنگ ${color.name}`"
            :aria-pressed="selectedColor === color.value"
            @click="emit('update:selectedColor', color.value)"
          />
        </div>
      </div>

      <!-- Services CTA -->
      <div class="flex items-center gap-4">
        <button
          type="button"
          :disabled="!canAddServices"
          class="flex h-[42px] items-center gap-2 rounded-xl border px-4 text-[13px] transition-colors"
          :class="canAddServices
            ? 'border-R-300 text-R-300 hover:bg-R-10'
            : 'border-T-400 text-T-600'"
          @click="canAddServices && emit('open-services')"
        >
          <IconCirclePlus class="size-5" />
          افزودن خدمات و لوازم جانبی
        </button>
        <p class="flex items-center gap-1.5 text-[12.5px] text-T-600">
          <IconShieldCheckFilled class="size-4 text-T-600" />
          برای افزودن خدمات ابتدا رنگ محصول را انتخاب کنید
        </p>
      </div>

      <!-- Secondary actions -->
      <div class="flex items-center gap-6 text-[12.5px]">
        <button
          type="button"
          class="flex items-center gap-1.5 text-T-700 transition-colors hover:text-R-300"
          @click="emit('open-comment')"
        >
          ثبت دیدگاه
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 text-T-700 transition-colors hover:text-R-300"
          @click="emit('open-insurance')"
        >
          اطلاعات بیمه
        </button>
      </div>

      <!-- Availability -->
      <div class="mt-1 flex items-center gap-2">
        <span class="size-2 rounded-full bg-[#3BB77E]" />
        <span class="text-[13px] text-[#3BB77E]">{{ product.availabilityText }}</span>
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
