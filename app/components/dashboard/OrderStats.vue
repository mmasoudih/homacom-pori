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
  <section class="rounded-[20px] bg-T-50 p-4 lg:border lg:border-T-400 lg:p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-[9px]">
        <span class="relative block h-4 w-[17px] rotate-180">
          <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
          <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
        </span>
        <UiTypography as="h2" size="xl" weight="semibold" class="leading-[29px]">
          سفارش‌های من
        </UiTypography>
      </div>

      <NuxtLink
        to="/dashboard/orders"
        class="flex items-center gap-1 text-primary transition-colors hover:text-R-400"
      >
        <UiTypography as="span" size="md" weight="medium" color="inherit">مشاهده همه</UiTypography>
        <IconChevronLeft class="size-4" />
      </NuxtLink>
    </div>

    <div class="mt-4 grid grid-cols-3 gap-2">
      <NuxtLink
        v-for="stat in orderStats"
        :key="stat.key"
        :to="statHref[stat.key]"
        class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-T-50 p-4 text-center transition-colors lg:h-[104px] lg:flex-row lg:items-center lg:gap-5 lg:border lg:border-T-400 lg:px-4 lg:py-6"
      >
        <img
          :src="statIcon[stat.key]"
          :alt="stat.label"
          class="size-11 shrink-0 object-contain lg:size-13"
        >

        <div class="flex min-w-0 flex-col items-center gap-1 lg:items-start lg:gap-1.5 lg:text-start">
          <UiTypography as="span" size="xl2xl" weight="semibold" leading="none">{{ toPersianDigits(stat.count) }}</UiTypography>
          <UiTypography as="span" size="xsMd" weight="medium" leading="tight" class="whitespace-nowrap text-T-800">{{ stat.label }}</UiTypography>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
