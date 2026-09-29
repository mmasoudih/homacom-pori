<script setup lang="ts">
import { brands } from '~/data/landing'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] px-4 pt-5 pb-24 lg:px-0 lg:py-6">
    <LandingSectionTitle title="محبوب‌ترین برندها" variant="row" />

    <!-- Mobile: horizontal scroll logo boxes -->
    <Carousel
      class="mt-[18px] lg:hidden"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="-ms-2">
        <CarouselItem
          v-for="brand in brands"
          :key="brand.name + brand.logo"
          class="w-[138px] shrink-0 basis-auto ps-2"
        >
          <a
            href="#"
            class="flex h-[78px] w-full items-center justify-center rounded-[20px] border border-T-400 bg-T-50"
          >
            <img
              :src="brand.logo"
              :alt="brand.name"
              class="h-[49px] w-[65px] object-contain"
            >
          </a>
        </CarouselItem>
      </CarouselContent>
    </Carousel>

    <!-- Desktop: cards -->
    <Carousel
      class="mt-[18px] hidden lg:block"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="-ms-2">
        <CarouselItem
          v-for="brand in brands"
          :key="brand.name + brand.logo"
          class="shrink-0 basis-auto ps-2 py-2"
        >
          <a
            href="#"
            class="px-14 flex w-full flex-col items-center justify-center gap-0 rounded-[20px] border border-T-400 bg-T-50 py-2 transition-shadow"
          >
            <img
              :src="brand.logo"
              :alt="brand.name"
              class="h-[50px] w-[65px] object-contain"
            >
            <span class="text-[16px] text-foreground">{{ brand.name }}</span>
          </a>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </section>
</template>
