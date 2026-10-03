<script setup lang="ts">
import { toast } from 'vue-sonner'
import { IconShoppingCart, IconUser } from '@tabler/icons-vue'
import type { Seller } from '~/data/product'
import { formatPriceFa } from '~/utils/format'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    sellers: Seller[]
    class?: string
  }>(),
  { class: '' },
)

const emit = defineEmits<{
  'add-to-cart': [seller: Seller]
}>()

function typeLabel(type: Seller['type']) {
  return type === 'credit' ? 'اعتباری' : 'اقساطی'
}

function addToCart(seller: Seller) {
  emit('add-to-cart', seller)
  toast.success(`کالای فروشنده «${seller.name}» به سبد خرید اضافه شد.`)
}
</script>

<template>
  <section :class="cn('flex w-full flex-col gap-4', props.class)">
    <h2 class="text-[16px] font-bold text-T-900">فروشندگان طرف قرارداد اقساطی و اعتباری:</h2>

    <div class="flex flex-col gap-3 rounded-2xl border border-T-300 bg-T-50 p-4">
      <article
        v-for="seller in sellers"
        :key="seller.id"
        class="flex items-center gap-6 rounded-xl bg-T-200 px-5 py-3.5"
      >
        <!-- Identity -->
        <div class="flex shrink-0 items-center gap-2.5">
          <span class="text-[13.5px] font-bold text-T-900">{{ seller.name }}</span>
          <span
            class="flex h-[26px] items-center gap-1 rounded-full bg-[#EAECFF] px-3 text-[11.5px] font-medium text-[#5A6AFF]"
          >
            <IconUser class="size-3.5" />
            {{ typeLabel(seller.type) }}
          </span>
        </div>

        <!-- Guarantee -->
        <span class="flex-1 text-center text-[12.5px] text-T-700">{{ seller.creditLabel }}</span>

        <!-- Price -->
        <div class="flex shrink-0 flex-col items-start gap-0.5">
          <div v-if="seller.oldPrice" class="flex items-center gap-1.5">
            <span class="text-[12px] text-T-600 line-through">{{ formatPriceFa(seller.oldPrice) }}</span>
            <span
              v-if="seller.discount"
              class="flex h-[20px] items-center rounded-full bg-R-300 px-2 text-[10.5px] font-extrabold text-white"
            >
              ٪{{ seller.discount }}
            </span>
          </div>
          <span class="flex items-baseline gap-1">
            <span class="text-[14px] font-extrabold text-T-900">{{ formatPriceFa(seller.price) }}</span>
            <span class="text-[10.5px] text-T-700">تومان</span>
          </span>
        </div>

        <!-- CTA -->
        <button
          type="button"
          class="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-R-300 px-6 text-[13px] font-bold text-white transition-colors hover:bg-R-400"
          @click="addToCart(seller)"
        >
          <IconShoppingCart class="size-4.5" />
          افزودن به سبد خرید
        </button>
      </article>
    </div>
  </section>
</template>
