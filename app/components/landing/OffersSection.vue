<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { offersGridRows, offersMeta } from '~/data/landing'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const PRICE = 87_000_000
const OLD_PRICE = 92_000_000
const DISCOUNT = 30

const flatOffers = offersGridRows.flat()

interface OfferProduct {
  image: string
  title: string
  price: number
  oldPrice?: number
  discount?: number
}

const offerProducts: OfferProduct[] = flatOffers.map((cell, i) => ({
  image: cell.image,
  title: '',
  price: PRICE,
  ...(offersMeta[i]?.hasOld ? { oldPrice: OLD_PRICE, discount: DISCOUNT } : {}),
}))

// Transpose the two rows into columns of two so the desktop carousel renders a
// 2-row grid while still scrolling by column.
const rowLength = offersGridRows[0]?.length ?? 0
const offerColumns: OfferProduct[][] = Array.from({ length: rowLength }, (_, col) =>
  [offerProducts[col], offerProducts[col + rowLength]].filter(
    (product): product is OfferProduct => product !== undefined,
  ),
)
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] px-4 py-5 max-lg:mt-[42px] max-lg:border-y max-lg:border-T-400 lg:px-0 lg:py-6">
    <div class="relative rounded-3xl border border-T-400 bg-T-50 px-4 py-5 max-lg:rounded-none max-lg:border-0 max-lg:bg-transparent max-lg:p-0 lg:px-6 lg:py-6">
      <LandingSectionTitle title="پیشنهاد‌های" accent=" هماکام" accent-always variant="centered" />

      <!-- Mobile: single-row carousel -->
      <Carousel
        class="offers-cards relative mt-[18px] overflow-x-clip lg:hidden"
        :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
      >
        <CarouselContent class="ms-0 gap-2.5">
          <CarouselItem
            v-for="(product, i) in offerProducts"
            :key="i"
            class="w-[164px] shrink-0 basis-auto ps-0"
          >
            <Product
              :product="product"
              variant="vertical"
              :show-title="false"
              discount-placement="inline"
              image-class="max-lg:w-[132px] max-lg:h-[132px] bg-transparent"
              class="max-lg:h-[209px]"
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <!-- Desktop: 6 columns × 2 rows -->
      <Carousel
        v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }"
        class="relative mt-[18px] hidden lg:block"
        :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
      >
        <CarouselContent class="-ms-[18px]">
          <CarouselItem
            v-for="(column, ci) in offerColumns"
            :key="ci"
            class="basis-1/6 ps-[18px]"
          >
            <div class="flex flex-col gap-[18px]">
              <Product
                v-for="(product, pi) in column"
                :key="pi"
                :product="product"
                variant="vertical"
                :show-title="false"
                discount-placement="inline"
                badge-size="lg"
                image-class="bg-transparent lg:w-[170px] lg:h-[170px] lg:mx-auto"
                class="lg:w-[202px] lg:h-[252px] lg:rounded-[12px]"
              />
            </div>
          </CarouselItem>
        </CarouselContent>

        <!-- Arrows -->
        <button
          v-if="canScrollNext"
          class="absolute -left-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="قبلی"
          :disabled="!canScrollNext"
          @click="scrollNext"
        >
          <IconChevronLeft class="size-[18px]" />
        </button>
        <button
          v-if="canScrollPrev"
          class="absolute -right-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="بعدی"
          :disabled="!canScrollPrev"
          @click="scrollPrev"
        >
          <IconChevronLeft class="size-[18px] rotate-180" />
        </button>
      </Carousel>
    </div>
  </section>
</template>

<style scoped>
@media (width < 64rem) {
  .offers-cards :deep(article > .mt-auto > span) {
    width: 38px;
    height: 21px;
  }
  .offers-cards :deep(article > .mt-auto > div > div:first-child > div > span:first-child) {
    font-size: 14px;
  }
  .offers-cards :deep(article > .mt-auto > div > div:first-child > div > span:last-child) {
    font-size: 10px;
  }
  .offers-cards :deep(article > .mt-auto > div > div:last-child > span) {
    font-size: 14px;
  }
}
</style>
