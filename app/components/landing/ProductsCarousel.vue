<script setup lang="ts">
import { IconChevronLeft, IconLayoutGrid, IconDeviceLaptop, IconDeviceMobile } from '@tabler/icons-vue'
import type { Product } from '~/data/landing'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

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
  <section class="mx-auto w-full max-w-[1302px] rounded-[20px] border border-T-400 py-5 md:py-6">
    <div class="px-4 md:px-5">
      <!-- Title row -->
      <LandingSectionTitle :title="title" variant="row" :indicator="'right'" />

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
                ? 'bg-T-50 text-foreground shadow-sm'
                : 'bg-transparent text-T-700 hover:bg-T-50/50'
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
                ? 'bg-T-50 text-foreground shadow-sm'
                : 'bg-transparent text-T-700 hover:bg-T-50/50'
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
    </div>

    <!-- Products row -->
    <Carousel
      v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }"
      class="relative mt-4 px-4 md:px-0"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps' }"
    >
      <CarouselContent class="ms-0">
        <CarouselItem
          v-for="(product, i) in products"
          :key="i"
          class="w-[180px] shrink-0 basis-auto ps-0 md:w-[259px]"
          :class="i > 0 ? 'border-s border-T-400' : ''"
        >
          <Product
            :product="product"
            variant="vertical"
            :href="product.id ? `/product/${product.id}` : ''"
            class="w-full rounded-none border-0"
          />
        </CarouselItem>
      </CarouselContent>

      <!-- Arrows (desktop only) -->
      <button
        class="absolute -left-[19px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        aria-label="محصولات قبلی"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        class="absolute -right-[19px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        aria-label="محصولات بعدی"
        :disabled="!canScrollPrev"
        @click="scrollPrev"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </Carousel>
  </section>
</template>
