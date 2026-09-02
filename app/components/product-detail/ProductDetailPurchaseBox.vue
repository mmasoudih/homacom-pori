<script setup lang="ts">
import { computed } from 'vue'
import {
  IconChevronDown,
  IconBuildingStore,
  IconCirclePlus,
  IconBell,
  IconX,
} from '@tabler/icons-vue'
import type { ProductDetail, ServiceCatalogItem, WarrantyOption } from '~/data/product'
import { formatPrice } from '~/utils/format'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    product: ProductDetail
    selectedWarranty: WarrantyOption
    selectedInsuranceId: string | null
    addedServices: ServiceCatalogItem[]
    servicesPrice: number
    class?: string
  }>(),
  { class: '' },
)

const emit = defineEmits<{
  'update:selectedWarrantyId': [value: string]
  'update:selectedInsuranceId': [value: string | null]
  'open-services': []
  'remove-service': [id: string]
  'notify-me': []
}>()

const isAvailable = computed(() => props.product.stockStatus === 'available')

const insuranceOptions = computed(() => [
  { id: null, label: 'بدون بیمه', price: 0 },
  ...props.product.servicePackages.map(p => ({ id: p.id, label: p.name, price: p.price })),
])

const selectedInsurance = computed(
  () =>
    insuranceOptions.value.find(o => o.id === props.selectedInsuranceId)
    ?? { id: null as string | null, label: 'بدون بیمه', price: 0 },
)

const discountAmount = computed(() =>
  props.product.oldPrice ? props.product.oldPrice - props.product.price : 0,
)

const payable = computed(
  () => props.product.price + props.servicesPrice + selectedInsurance.value.price,
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
  <!-- Purchase box                                     -->
  <!-- =============================================== -->
  <div
    v-else
    :class="cn('flex w-full flex-col gap-4 rounded-2xl border border-T-300 bg-T-50 p-5', props.class)"
  >
    <!-- Seller -->
    <div class="flex items-center justify-between">
      <span class="text-[12.5px] text-T-700">{{ product.seller.label }}:</span>
      <span class="flex items-center gap-1.5 text-[12.5px] font-medium text-T-900">
        <IconBuildingStore class="size-4 text-T-600" />
        {{ product.seller.name }}
      </span>
    </div>

    <!-- Warranty selector -->
    <div class="flex items-center justify-between">
      <span class="text-[12.5px] text-T-700">گارانتی:</span>
      <UiDropdownMenu>
        <UiDropdownMenuTrigger
          class="flex items-center gap-1 text-[12.5px] font-medium text-T-900 outline-none"
        >
          {{ selectedWarranty.label }}
          <IconChevronDown class="size-3.5 text-T-600" />
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent align="start" class="min-w-[240px]">
          <UiDropdownMenuRadioGroup
            :model-value="selectedWarranty.id"
            @update:model-value="emit('update:selectedWarrantyId', $event as string)"
          >
            <UiDropdownMenuRadioItem
              v-for="option in product.warrantyOptions"
              :key="option.id"
              :value="option.id"
              class="text-[12.5px]"
            >
              {{ option.label }}
            </UiDropdownMenuRadioItem>
          </UiDropdownMenuRadioGroup>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </div>

    <!-- Insurance selector -->
    <div class="flex items-center justify-between">
      <span class="text-[12.5px] text-T-700">بیمه‌ها:</span>
      <UiDropdownMenu>
        <UiDropdownMenuTrigger
          class="flex items-center gap-1 text-[12.5px] font-medium text-T-900 outline-none"
        >
          {{ selectedInsurance.label }}
          <IconChevronDown class="size-3.5 text-T-600" />
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent align="start" class="min-w-[260px]">
          <UiDropdownMenuRadioGroup
            :model-value="selectedInsuranceId ?? 'none'"
            @update:model-value="emit('update:selectedInsuranceId', $event === 'none' ? null : ($event as string))"
          >
            <UiDropdownMenuRadioItem
              v-for="option in insuranceOptions"
              :key="option.id ?? 'none'"
              :value="option.id ?? 'none'"
              class="text-[12.5px]"
            >
              {{ option.label }}
              <span v-if="option.price" class="ms-2 text-[11px] text-T-700">+ {{ formatPrice(option.price) }} تومان</span>
            </UiDropdownMenuRadioItem>
          </UiDropdownMenuRadioGroup>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </div>

    <div class="h-px w-full bg-T-300" />

    <!-- Services shortcut -->
    <div class="flex items-center justify-between">
      <span class="text-[12.5px] text-T-700">خدمات و لوازم جانبی:</span>
      <button
        type="button"
        class="flex items-center gap-1 text-[12.5px] font-medium text-R-300 transition-colors hover:text-R-400"
        @click="emit('open-services')"
      >
        افزودن خدمات پیشنهادی
        <IconCirclePlus class="size-4" />
      </button>
    </div>

    <!-- Added services -->
    <ul v-if="addedServices.length" class="flex flex-col gap-2">
      <li
        v-for="service in addedServices"
        :key="service.id"
        class="flex items-center justify-between gap-2"
      >
        <span class="text-[12.5px] text-T-900">{{ service.label }}</span>
        <span class="flex items-center gap-2">
          <span class="text-[12.5px] text-T-700">
            {{ service.price ? `${formatPrice(service.price)} تومان` : 'رایگان' }}
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

    <div class="h-px w-full bg-T-300" />

    <!-- Price rows -->
    <div class="flex flex-col gap-2.5">
      <div v-if="product.oldPrice" class="flex items-center justify-between">
        <span class="text-[12.5px] text-T-700">قیمت کالا:</span>
        <span class="flex items-center gap-1 text-[12.5px] text-T-600 line-through">
          {{ formatPrice(product.oldPrice) }}
          <span class="text-[11px]">تومان</span>
        </span>
      </div>

      <div v-if="discountAmount > 0" class="flex items-center justify-between">
        <span class="text-[12.5px] text-R-300">تخفیف:</span>
        <span class="flex items-center gap-1 text-[12.5px] font-medium text-R-300">
          {{ formatPrice(discountAmount) }}
          <span class="text-[11px]">تومان</span>
        </span>
      </div>

      <div v-if="selectedInsurance.price" class="flex items-center justify-between">
        <span class="text-[12.5px] text-T-700">مبلغ بیمه:</span>
        <span class="flex items-center gap-1 text-[12.5px] text-T-900">
          {{ formatPrice(selectedInsurance.price) }}
          <span class="text-[11px]">تومان</span>
        </span>
      </div>

      <div class="mt-1 flex items-end justify-between">
        <span class="text-[13px] text-T-700">قیمت نهایی:</span>
        <span class="flex items-baseline gap-1">
          <span class="text-[22px] font-extrabold text-T-900">{{ formatPrice(payable) }}</span>
          <span class="text-[12px] text-T-700">تومان</span>
        </span>
      </div>
    </div>

    <!-- Add to cart (no-op until cart phase) -->
    <button
      type="button"
      class="flex h-[42px] w-full items-center justify-center rounded-xl bg-R-300 text-[14px] font-bold text-white transition-colors hover:bg-R-400"
    >
      افزودن به سبد خرید
    </button>

    <div class="flex flex-col gap-2">
      <label class="flex cursor-pointer items-center gap-2 text-[12.5px] text-T-700">
        <UiCheckbox class="size-[18px]" />
        اکنون خدمات و لوازم جانبی به سبد اضافه شود
      </label>
      <label class="flex cursor-pointer items-center gap-2 text-[12.5px] text-T-700">
        <UiCheckbox class="size-[18px]" />
        در کنارش خدمات سبد خرید شما اضافه شود
      </label>
    </div>
  </div>
</template>
