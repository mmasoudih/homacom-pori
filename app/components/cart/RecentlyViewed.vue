<script setup lang="ts">
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cartRecentlyViewed } from '~/data/cart'
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-6">
    <!-- The file puts the chevron at the header's start edge, right of the title. -->
    <div class="flex h-8 items-center gap-2.5">
      <NuxtLink to="/search" aria-label="مشاهده همه محصولات" class="flex items-center">
        <img src="/icons/cart/recent-chevron.svg" alt="" class="h-5 w-[13px]">
      </NuxtLink>
      <UiTypography as="h2" size="3xl" weight="bold">بازدیدهای اخیر شما</UiTypography>
    </div>

    <Carousel
      v-slot="{ canScrollNext, scrollNext }"
      class="relative mt-8"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="ms-0">
        <CarouselItem
          v-for="(product, i) in cartRecentlyViewed"
          :key="product.id"
          class="w-[260px] shrink-0 basis-auto ps-0"
          :class="i > 0 ? 'border-s border-T-400' : ''"
        >
          <CartRecentCard :product="product" />
        </CarouselItem>
      </CarouselContent>

      <button
        type="button"
        class="absolute -left-1 top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-T-900 shadow-[0_0_10px_rgba(0,0,0,0.12)] transition-colors hover:bg-T-100 disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        aria-label="محصولات بعدی"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        <img src="/icons/cart/carousel-arrow.svg" alt="" class="size-4">
      </button>
    </Carousel>
  </section>
</template>
