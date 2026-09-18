<script setup lang="ts">
import { IconChevronLeft, IconShoppingBag } from '@tabler/icons-vue'
import type { OrderStatTone } from '~/data/dashboard'
import { orderStats } from '~/data/dashboard'

const toneClass: Record<OrderStatTone, string> = {
  current: 'bg-R-50 text-primary',
  delivered: 'bg-emerald-50 text-emerald-500',
  returned: 'bg-sky-50 text-sky-500',
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

      <a
        href="#"
        class="flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-R-400"
      >
        مشاهده همه
        <IconChevronLeft class="size-4" />
      </a>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div
        v-for="stat in orderStats"
        :key="stat.key"
        class="flex items-center justify-between rounded-2xl border border-T-400 bg-T-50 p-4"
      >
        <div class="flex flex-col gap-1">
          <span class="text-2xl font-extrabold leading-none text-T-900">{{ stat.count }}</span>
          <span class="text-[13px] text-T-600">{{ stat.label }}</span>
        </div>

        <span
          class="flex size-11 shrink-0 items-center justify-center rounded-xl"
          :class="toneClass[stat.key]"
        >
          <IconShoppingBag class="size-6" />
        </span>
      </div>
    </div>
  </section>
</template>
