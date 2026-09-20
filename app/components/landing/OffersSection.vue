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
  <section class="mx-auto w-full max-w-[1350px] px-4 py-5 md:px-0 md:py-6">
    <div class="relative rounded-3xl border border-T-400 bg-T-50 px-4 py-5 md:px-6 md:py-6">
      <LandingSectionTitle title="پیشنهاد‌های هماکام" variant="centered" />

      <!-- Mobile: 2-col grid -->
      <div class="mt-[18px] grid grid-cols-2 gap-3 lg:hidden">
        <Product
          v-for="(product, i) in offerProducts"
          :key="i"
          :product="product"
          variant="vertical"
          :show-title="false"
          discount-placement="inline"
          image-class="bg-transparent"
        />
      </div>

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
                image-class="bg-transparent"
              />
            </div>
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
    </div>
  </section>
</template>
