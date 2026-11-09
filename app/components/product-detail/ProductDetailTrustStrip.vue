<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ class?: string }>(),
  { class: '' },
)

/**
 * Icons are exported from «Frame 3217» in the product desktop design
 * (`tag-simple`, `coins-front`, `truck`, `shield-slash` at 38px, #9CA3AF with
 * the design's 40% half-tone layer).
 */
const items = [
  {
    icon: '/icons/product-detail/tag-simple-38.svg',
    title: 'بهترین قیمت بازار',
    description: 'بهترین قیمت بازار با تضمین ارزش خرید در هماکام ارائه می‌شود.',
  },
  {
    icon: '/icons/product-detail/coins-front-38.svg',
    title: 'خرید اقساطی',
    description: 'امکان خرید اقساطی برای کالاهای منتخب فراهم است.',
  },
  {
    icon: '/icons/product-detail/truck-38.svg',
    title: 'ارسال سریع',
    description: 'سفارش شما در کوتاه‌ترین زمان ممکن پردازش و ارسال می‌شود.',
  },
  {
    icon: '/icons/product-detail/shield-slash-38.svg',
    title: 'ضمانت اصالت کالا',
    description: 'تمامی محصولات با تضمین اصالت و سلامت فیزیکی عرضه می‌شوند.',
  },
]
</script>

<template>
  <div
    :class="cn(
      'grid w-full grid-cols-4 items-center gap-8 rounded-[20px] border border-T-400 bg-T-50 px-6 py-5',
      props.class,
    )"
  >
    <div
      v-for="item in items"
      :key="item.title"
      class="flex h-[61px] items-center gap-5"
    >
      <img :src="item.icon" alt="" class="size-[38px] shrink-0">

      <div class="flex min-w-0 flex-col">
        <span class="text-[12.5px] font-semibold leading-[25px] text-T-900">{{ item.title }}</span>
        <span class="text-[12.5px] leading-[15px] text-T-700">{{ item.description }}</span>
      </div>
    </div>
  </div>
</template>
