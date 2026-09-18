<script setup lang="ts">
import { IconShoppingBag, IconShoppingBagX, IconTag } from '@tabler/icons-vue'

withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'لیست سفارش‌های شما خالی است',
  description: 'هنوز سفارشی ثبت نکرده‌اید! همین حالا از میان هزاران کالای هماکام، اولین خرید خود را انجام دهید.',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
    <span class="flex size-16 items-center justify-center rounded-full bg-T-100 text-T-500">
      <IconShoppingBagX class="size-8" />
    </span>

    <div class="flex flex-col gap-2">
      <h3 class="text-[15px] font-bold text-T-900">{{ title }}</h3>
      <p class="max-w-[420px] text-[12.5px] leading-[22px] text-T-600">
        {{ description }}
      </p>
    </div>

    <div class="mt-2 flex flex-wrap items-center justify-center gap-3">
      <NuxtLink
        to="/"
        class="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[13px] font-bold text-white transition-colors hover:bg-primary/90"
      >
        مشاهده محصولات
        <IconShoppingBag class="size-4" />
      </NuxtLink>
      <NuxtLink
        to="/"
        class="flex h-11 items-center justify-center gap-2 rounded-xl border border-T-400 bg-T-50 px-6 text-[13px] font-semibold text-T-800 transition-colors hover:border-T-500"
      >
        مشاهده تخفیف‌ها
        <IconTag class="size-4" />
      </NuxtLink>
    </div>
  </div>
</template>
