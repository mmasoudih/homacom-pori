<script setup lang="ts">
import { brands } from '~/data/landing'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
</script>

<template>
  <section class="mx-auto w-full max-w-[1350px] px-4 pt-5 pb-24 md:px-0 md:py-6">
    <LandingSectionTitle title="محبوب‌ترین برندها" variant="row" />

    <!-- Mobile: horizontal scroll logo boxes -->
    <Carousel
      class="mt-[18px] lg:hidden"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps' }"
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
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps' }"
    >
      <CarouselContent class="-ms-2">
        <CarouselItem
          v-for="brand in brands"
          :key="brand.name + brand.logo"
          class="w-[174px] shrink-0 basis-auto ps-2"
        >
          <a
            href="#"
            class="flex w-full flex-col items-center justify-center gap-3 rounded-[20px] border border-T-400 bg-T-50 py-4 transition-shadow hover:shadow-md"
          >
            <img
              :src="brand.logo"
              :alt="brand.name"
              class="h-[49px] w-[65px] object-contain"
            >
            <span class="text-[14px] font-medium text-foreground">{{ brand.name }}</span>
          </a>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </section>
</template>
