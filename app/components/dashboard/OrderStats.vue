<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import type { OrderStatTone } from '~/data/dashboard'
import { orderStats } from '~/data/dashboard'
import { toPersianDigits } from '~/utils/format'

const statIcon: Record<OrderStatTone, string> = {
  current: '/icons/truck-colour.svg',
  delivered: '/icons/box-check.svg',
  returned: '/icons/box-return.svg',
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

    <div class="mt-4 grid grid-cols-3 gap-2 lg:gap-3">
      <NuxtLink
        v-for="stat in orderStats"
        :key="stat.key"
        :to="statHref[stat.key]"
        class="flex items-center justify-center gap-3 rounded-2xl border border-T-400 bg-T-50 p-4 text-start transition-colors hover:border-T-500 lg:gap-5 lg:px-4 lg:py-6"
      >
        <img
          :src="statIcon[stat.key]"
          :alt="stat.label"
          class="size-11 shrink-0 object-contain lg:size-13"
        >

        <div class="flex min-w-0 flex-col gap-1 lg:gap-1.5">
          <span class="text-xl font-extrabold leading-none text-T-900 lg:text-[18px]">{{ toPersianDigits(stat.count) }}</span>
          <span class="text-[13px] font-medium leading-tight text-T-800 lg:text-[12.5px]">{{ stat.label }}</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
