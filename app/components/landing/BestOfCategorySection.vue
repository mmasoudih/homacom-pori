<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { bestOfCategories } from '~/data/landing'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] px-4 py-5 lg:px-0 lg:py-6">
    <LandingSectionTitle title="بهترین‌های" accent=" هر دسته‌بندی" variant="centered" />

    <!--
      Category panels carousel — shown on every breakpoint so mobile uses the
      same desktop panels instead of a separate stacked list. Mobile shows one
      panel per view (with a peek of the next); desktop fits three per view.
    -->
    <Carousel
      v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }"
      class="relative mt-[18px]"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="-ms-[10px]">
        <CarouselItem
          v-for="col in bestOfCategories"
          :key="col.category"
          class="basis-[86%] ps-[10px] lg:basis-1/3"
        >
          <LandingBestOfCategoryColumn
            :category="col.category"
            :icon="col.icon"
            :items="col.items"
          />
        </CarouselItem>
      </CarouselContent>

      <!-- Arrows (desktop) -->
      <button
        v-if="canScrollNext"
        class="absolute -left-[19px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        aria-label="قبلی"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        v-if="canScrollPrev"
        class="absolute -right-[19px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        aria-label="بعدی"
        :disabled="!canScrollPrev"
        @click="scrollPrev"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </Carousel>
  </section>
</template>
