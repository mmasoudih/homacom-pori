<script setup lang="ts">
import { IconChevronLeft, IconLayoutGrid, IconDeviceLaptop, IconDeviceMobile } from '@tabler/icons-vue'
import type { Product } from '~/data/landing'

withDefaults(defineProps<{
  title: string
  products: Product[]
  showAllHref?: string
  pills?: {
    prices: string[]
    activePrice: string
    cats: Array<{ label: string, icon: string }>
    activeCat: string
  }
}>(), {
  showAllHref: '#',
  pills: undefined,
})

const catIcons: Record<string, typeof IconLayoutGrid> = {
  laptop: IconDeviceLaptop,
  mobile: IconDeviceMobile,
  grid: IconLayoutGrid,
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1302px] px-4 py-5 md:px-0 md:py-6">
    <!-- Title row -->
    <LandingSectionTitle :title="title" variant="row" />

    <!-- Pills row (bestsellers only) -->
    <div
      v-if="pills"
      class="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between"
    >
      <!-- Price pills -->
      <div class="flex items-center gap-2">
        <button
          v-for="p in pills.prices"
          :key="p"
          class="flex h-[38px] items-center rounded-full px-4 text-[13px] font-medium transition-colors"
          :class="
            (pills.activePrice === p)
              ? 'bg-white text-foreground shadow-sm'
              : 'bg-transparent text-[#6b7280] hover:bg-white/50'
          "
        >
          {{ p }}
        </button>
      </div>

      <!-- Category pills -->
      <div class="flex items-center gap-2">
        <button
          v-for="c in pills.cats"
          :key="c.label"
          class="flex h-[38px] items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors"
          :class="
            (pills.activeCat === c.label)
              ? 'bg-white text-foreground shadow-sm'
              : 'bg-transparent text-[#6b7280] hover:bg-white/50'
          "
        >
          {{ c.label }}
          <component
            :is="catIcons[c.icon]"
            class="size-5"
          />
        </button>
      </div>
    </div>

    <!-- Products row -->
    <div class="relative mt-4">
      <div class="flex gap-3 overflow-x-auto pb-1 lg:gap-0 lg:overflow-hidden lg:pb-0">
        <LandingProductCard
          v-for="(product, i) in products"
          :key="i"
          :product="product"
        />
      </div>

      <!-- Arrow (desktop only) -->
      <button
        class="absolute -left-[19px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-foreground transition-colors hover:bg-secondary lg:flex"
        aria-label="محصولات قبلی"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
    </div>
  </section>
</template>
