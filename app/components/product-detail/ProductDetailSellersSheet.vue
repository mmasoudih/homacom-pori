<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { IconX } from '@tabler/icons-vue'
import type { Seller, SellerType } from '~/data/product'
import { formatPrice } from '~/utils/format'

const props = withDefaults(
  defineProps<{
    open: boolean
    sellers: Seller[]
  }>(),
  {},
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const filters: Array<{ id: SellerType | 'all', label: string }> = [
  { id: 'all', label: 'همه' },
  { id: 'installment', label: 'اقساطی' },
  { id: 'credit', label: 'اعتباری' },
]

const activeFilter = ref<SellerType | 'all'>('all')

watch(
  () => props.open,
  (open) => {
    if (open) activeFilter.value = 'all'
  },
)

const filtered = computed(() =>
  activeFilter.value === 'all'
    ? props.sellers
    : props.sellers.filter(s => s.type === activeFilter.value),
)

function addToCart(seller: Seller) {
  toast.success(`کالای فروشنده «${seller.name}» به سبد خرید اضافه شد.`)
}

const dialogShell
  = 'top-0! start-0! translate-x-0! translate-y-0! w-full! max-w-full! h-[100dvh]! max-h-[100dvh]! rounded-none! flex! flex-col!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      class="max-w-[402px] gap-0 rounded-2xl p-0 sm:max-w-[402px]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-T-300 px-4 py-4">
        <UiDialogTitle class="text-[15px] font-bold text-T-900">فروشندگان</UiDialogTitle>
        <UiDialogClose
          class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
          aria-label="بستن"
        >
          <IconX class="size-5" />
        </UiDialogClose>
      </div>

      <!-- Filters -->
      <div class="flex items-center justify-end gap-2 px-4 py-4">
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          class="flex h-[30px] items-center rounded-full border px-3 text-[11.5px] transition-colors"
          :class="activeFilter === filter.id
            ? 'border-R-300 bg-R-10 font-medium text-R-300'
            : 'border-T-300 text-T-700'"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Seller cards -->
      <div class="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <article
          v-for="seller in filtered"
          :key="seller.id"
          class="flex flex-col gap-4 rounded-2xl border border-T-300 p-4"
        >
          <!-- Identity -->
          <div class="flex flex-col items-center gap-1.5 border-b border-T-300 pb-4">
            <div class="flex items-center gap-2">
              <img :src="seller.logo" :alt="seller.name" class="size-8 object-contain">
              <h3 class="text-[14px] font-bold text-T-900">{{ seller.name }}</h3>
            </div>
            <p class="text-[11px] text-T-700">{{ seller.creditLabel }}</p>
          </div>

          <!-- Info grid -->
          <div class="grid grid-cols-2 gap-x-4 gap-y-4">
            <div
              v-for="item in seller.info"
              :key="item.label"
              class="flex flex-col items-center gap-1"
            >
              <span class="text-[12px] font-bold text-T-900">{{ item.label }}</span>
              <span class="text-[11px] text-T-700">{{ item.value }}</span>
            </div>
          </div>

          <!-- Price + CTA -->
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-0.5">
              <div v-if="seller.oldPrice" class="flex items-center gap-1.5">
                <span class="text-[12px] text-T-600 line-through">{{ formatPrice(seller.oldPrice) }}</span>
                <span
                  v-if="seller.discount"
                  class="flex h-[21px] items-center rounded-full bg-R-300 px-2 text-[10.5px] font-extrabold text-white"
                >
                  ٪{{ seller.discount }}
                </span>
              </div>
              <span class="flex items-baseline gap-1">
                <span class="text-[14px] font-extrabold text-T-900">{{ formatPrice(seller.price) }}</span>
                <span class="text-[10.5px] text-T-700">تومان</span>
              </span>
            </div>

            <button
              type="button"
              class="flex h-[42px] items-center justify-center rounded-xl bg-R-300 px-6 text-[13px] font-bold text-white transition-colors hover:bg-R-400"
              @click="addToCart(seller)"
            >
              افزودن به سبد
            </button>
          </div>
        </article>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
