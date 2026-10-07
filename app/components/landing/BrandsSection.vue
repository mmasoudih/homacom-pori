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
          <BrandBox :name="brand.name" :logo="brand.logo" href="#" />
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
          <BrandBox :name="brand.name" :logo="brand.logo" href="#" class="lg:w-[166px]" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </section>
</template>
