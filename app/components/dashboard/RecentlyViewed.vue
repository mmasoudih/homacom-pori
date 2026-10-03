<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { recentlyViewed } from '~/data/dashboard'
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
    <!-- Section title -->
    <div class="flex items-center gap-[9px]">
      <span class="relative block h-4 w-[17px] rotate-180">
        <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
        <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
      </span>
      <UiTypography as="h2" size="xl" weight="semibold" class="leading-[29px]">
        اخیرا بازدید شده
      </UiTypography>
    </div>

    <Carousel
      v-slot="{ canScrollNext, scrollNext }"
      class="relative mt-4"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="ms-0">
        <CarouselItem
          v-for="(product, i) in recentlyViewed"
          :key="i"
          class="w-[170px] shrink-0 basis-auto ps-0 lg:w-[249.67px]"
          :class="i > 0 ? 'border-s border-T-400' : ''"
        >
          <DashboardRecentProductCard :product="product" />
        </CarouselItem>
      </CarouselContent>

      <button
        class="absolute -left-[13px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground shadow-[0_0_10px_rgba(0,0,0,0.12)] transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        aria-label="محصولات بعدی"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
    </Carousel>
  </section>
</template>
