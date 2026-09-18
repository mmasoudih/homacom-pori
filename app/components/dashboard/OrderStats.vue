<script setup lang="ts">
import { IconChevronLeft, IconShoppingBag } from '@tabler/icons-vue'
import type { OrderStatTone } from '~/data/dashboard'
import { orderStats } from '~/data/dashboard'

const toneClass: Record<OrderStatTone, string> = {
  current: 'bg-R-50 text-primary',
  delivered: 'bg-emerald-50 text-emerald-500',
  returned: 'bg-sky-50 text-sky-500',
}

const statHref: Record<OrderStatTone, string> = {
  current: '/dashboard/orders?tab=current',
  delivered: '/dashboard/orders?tab=delivered',
  returned: '/dashboard/orders?tab=returned',
}
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-[9px]">
        <h2 class="text-xl font-bold leading-[29px] text-foreground">
          سفارش‌های من
        </h2>
        <span class="relative block h-4 w-[17px]">
          <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
          <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
        </span>
      </div>

      <NuxtLink
        to="/dashboard/orders"
        class="flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-R-400"
      >
        مشاهده همه
        <IconChevronLeft class="size-4" />
      </NuxtLink>
    </div>

    <div class="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
      <NuxtLink
        v-for="stat in orderStats"
        :key="stat.key"
        :to="statHref[stat.key]"
        class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-T-400 bg-T-50 p-3 text-center transition-colors hover:border-T-500 sm:flex-row sm:justify-between sm:p-4 sm:text-start"
      >
        <div class="order-2 flex flex-col gap-1 sm:order-1">
          <span class="text-lg font-extrabold leading-none text-T-900 sm:text-2xl">{{ stat.count }}</span>
          <span class="text-[10px] leading-tight text-T-600 sm:text-[13px]">{{ stat.label }}</span>
        </div>

        <span
          class="order-1 flex size-9 shrink-0 items-center justify-center rounded-xl sm:order-2 sm:size-11"
          :class="toneClass[stat.key]"
        >
          <IconShoppingBag class="size-5 sm:size-6" />
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
