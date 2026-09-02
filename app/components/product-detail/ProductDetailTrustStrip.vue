<script setup lang="ts">
import { IconShieldCheck, IconTag, IconTruck, IconTruckDelivery } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ class?: string }>(),
  { class: '' },
)

const items = [
  { icon: IconTag, title: 'بهترین قیمت بازار', description: 'بهترین قیمت بازار با تضمین ارزش خرید در هماکام ارائه می‌شود.' },
  { icon: IconTruck, title: 'ارسال سریع', description: 'سفارش شما در کوتاه‌ترین زمان ممکن پردازش و ارسال می‌شود.' },
  { icon: IconShieldCheck, title: 'ضمانت اصالت کالا', description: 'تمامی محصولات با تضمین اصالت و سلامت فیزیکی عرضه می‌شوند.' },
  { icon: IconTruckDelivery, title: 'نحوه ارسال کالا', description: 'تحویل فوری و بدون هزینه برای سفارش‌های تهران.' },
]
</script>

<template>
  <div :class="cn('grid w-full grid-cols-4 gap-3', props.class)">
    <div
      v-for="item in items"
      :key="item.title"
      class="flex items-center gap-3 rounded-2xl border border-T-300 bg-T-50 px-4 py-3.5"
    >
      <component :is="item.icon" class="size-8 shrink-0 text-T-600" stroke-width="1.5" />
      <div class="flex flex-col gap-1">
        <span class="text-[13px] font-bold text-T-900">{{ item.title }}</span>
        <span class="text-[12px] leading-[17px] text-T-700">{{ item.description }}</span>
      </div>
    </div>
  </div>
</template>
