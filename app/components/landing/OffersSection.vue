<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { offersGridRows, offersMeta } from '~/data/landing'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const flatOffers = offersGridRows.flat()
</script>

<template>
  <section class="mx-auto w-full max-w-[1302px] px-4 py-5 md:px-0 md:py-6">
    <LandingSectionTitle title="پیشنهاد‌های هماکام" variant="centered" />

    <!-- Mobile: 2-col grid -->
    <div class="mt-[18px] grid grid-cols-2 gap-x-[10px] gap-y-[10px] lg:hidden">
      <article
        v-for="(cell, i) in flatOffers"
        :key="i"
        class="flex flex-col items-center gap-[16px]"
      >
        <!-- Image -->
        <div class="flex h-[132px] w-full items-center justify-center">
          <img
            :src="cell.image"
            alt=""
            class="max-h-full max-w-full rounded-[20px] object-contain"
          >
        </div>

        <!-- Price -->
        <div class="flex w-full items-start justify-between">
          <div class="flex flex-col">
            <span
              v-if="offersMeta[i]?.hasOld"
              class="text-[13px] font-bold text-T-600 line-through"
            >87,000,000</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[14px] font-extrabold text-foreground">87,000,000</span>
              <span class="text-[11px] text-T-600">تومان</span>
            </div>
          </div>
          <span
            v-if="offersMeta[i]?.hasOld"
            class="flex h-[21px] w-[38px] items-center justify-center rounded-lg bg-R-10 text-[12px] font-extrabold text-primary"
          >%30</span>
        </div>
      </article>
    </div>

    <!-- Desktop: 6-col carousel -->
    <Carousel
      v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }"
      class="relative mt-[18px] hidden lg:block"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="-ms-[18px]">
        <CarouselItem
          v-for="(cell, i) in flatOffers"
          :key="i"
          class="w-[220px] shrink-0 basis-auto ps-[18px]"
        >
          <article
            class="flex h-[252px] w-full flex-col items-center justify-center gap-2 rounded-[20px] border border-T-400 bg-T-50 p-4 transition-shadow hover:shadow-md"
          >
            <!-- Image -->
            <div class="flex h-[120px] w-full items-center justify-center">
              <img
                :src="cell.image"
                alt=""
                class="max-h-full max-w-full object-contain"
              >
            </div>

            <!-- Price -->
            <div class="flex w-full items-center justify-between">
              <div class="flex flex-col">
                <span
                  v-if="offersMeta[i]?.hasOld"
                  class="text-[13px] font-bold text-T-600 line-through"
                >87,000,000</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-[14px] font-extrabold text-foreground">87,000,000</span>
                  <span class="text-[11px] text-T-600">تومان</span>
                </div>
              </div>
              <span
                v-if="offersMeta[i]?.hasOld"
                class="flex h-[22px] items-center justify-center rounded-lg bg-R-10 px-1 text-[11px] font-extrabold text-primary"
              >%30</span>
            </div>
          </article>
        </CarouselItem>
      </CarouselContent>

      <!-- Arrows -->
      <button
        class="absolute -left-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="قبلی"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        class="absolute -right-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="بعدی"
        :disabled="!canScrollPrev"
        @click="scrollPrev"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </Carousel>
  </section>
</template>
