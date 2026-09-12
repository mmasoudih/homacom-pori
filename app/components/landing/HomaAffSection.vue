<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { homaAffProducts } from '~/data/landing'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const cardRounding = (i: number) => [
  i === 0 ? 'rounded-none rounded-tr-3xl rounded-br-3xl' : '',
  i === homaAffProducts.length - 1 ? 'rounded-none rounded-tl-3xl rounded-bl-3xl' : '',
  i > 0 && i < homaAffProducts.length - 1 ? 'rounded-none' : '',
]
</script>

<template>
  <section class="relative isolate mx-auto w-full max-w-[1401px] overflow-hidden bg-R-300 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[url(/icons/texture.svg)] before:bg-repeat before:opacity-[0.05] before:content-[''] lg:rounded-3xl lg:px-[25px] lg:py-[25px]">
    <!-- Mobile title row -->
    <div class="flex items-center justify-between px-4 pt-[25px] lg:hidden">
      <a
        href="#"
        class="flex items-center gap-1 rounded-full border border-white/30 px-4"
        style="height: 32px"
      >
        <span class="text-[13px] font-semibold text-white">مشاهده همه</span>
        <IconChevronLeft class="size-[14px] text-white" />
      </a>
      <h2 class="text-[16px] font-bold leading-[23px] text-white">هما آف</h2>
      <span class="flex w-[61px] justify-end gap-[3px] text-white">
        <IconChevronLeft class="size-[10px]" />
        <IconChevronLeft class="size-[10px]" />
      </span>
    </div>

    <!-- Desktop title row -->
    <div class="mb-[21px] hidden lg:block">
      <LandingSectionTitle title="هما آف" variant="row" light indicator="right" indicator-color="white" />
    </div>

    <!-- Mobile products row -->
    <Carousel
      class="mt-4 px-4 pb-4 lg:hidden"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="ms-0">
        <CarouselItem
          v-for="(product, i) in homaAffProducts"
          :key="i"
          class="w-[180px] shrink-0 basis-auto ps-0"
        >
          <Product
            :product="product"
            variant="vertical"
            show-countdown
            countdown-label="هما آف"
            image-class="bg-T-50"
            :href="product.id ? `/product/${product.id}` : ''"
            class="w-full"
            :class="cardRounding(i)"
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>

    <!-- Desktop products row -->
    <Carousel
      v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }"
      class="relative hidden lg:block"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="ms-0">
        <CarouselItem
          v-for="(product, i) in homaAffProducts"
          :key="i"
          class="w-[270px] shrink-0 basis-auto ps-0"
        >
          <Product
            :product="product"
            variant="vertical"
            show-countdown
            countdown-label="هما آف"
            image-class="bg-T-50"
            discount-placement="inline"
            :href="product.id ? `/product/${product.id}` : ''"
            class="w-full"
            :class="cardRounding(i)"
          />
        </CarouselItem>
      </CarouselContent>

      <!-- Arrows -->
      <button
        class="absolute -left-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-T-50 text-foreground shadow-md transition-colors hover:bg-T-50/90 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="قبلی"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        class="absolute -right-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-T-50 text-foreground shadow-md transition-colors hover:bg-T-50/90 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="بعدی"
        :disabled="!canScrollPrev"
        @click="scrollPrev"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </Carousel>
  </section>
</template>
