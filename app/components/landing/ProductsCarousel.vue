<script setup lang="ts">
import { IconChevronLeft, IconLayoutGrid, IconDeviceLaptop, IconDeviceMobile } from '@tabler/icons-vue'
import type { Product } from '~/data/landing'
import { toPersianDigits } from '~/utils/format'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const props = withDefaults(defineProps<{
  title: string
  products: Product[]
  showAllHref?: string
  /** How many cards a desktop viewport shows at once (e.g. 5). Omit for fixed-width scrolling. */
  perView?: number
  pills?: {
    prices: string[]
    activePrice: string
    cats: Array<{ label: string, icon: string }>
    activeCat: string
  }
}>(), {
  showAllHref: '#',
  perView: undefined,
  pills: undefined,
})

// Desktop basis per supported viewport count. Kept literal so Tailwind emits them.
const basisByCount: Record<number, string> = {
  2: 'md:basis-1/2',
  3: 'md:basis-1/3',
  4: 'md:basis-1/4',
  5: 'md:basis-1/5',
  6: 'md:basis-1/6',
}

// `basis-1/5` overrides the item width on desktop; mobile keeps fixed 180px cards.
const itemBasisClass = computed(() =>
  props.perView != null && basisByCount[props.perView]
    ? basisByCount[props.perView]
    : 'md:w-[259px]',
)

const catIcons: Record<string, typeof IconLayoutGrid> = {
  laptop: IconDeviceLaptop,
  mobile: IconDeviceMobile,
  grid: IconLayoutGrid,
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] rounded-[20px] border border-T-400 py-5 md:py-6">
    <div class="px-4 md:px-6">
      <!-- Title row -->
      <LandingSectionTitle :title="title" variant="row" :indicator="'right'" />

      <!-- Pills row (bestsellers only) -->
      <div
        v-if="pills"
        class="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between"
      >
        <!-- Category pills -->
        <div class="flex items-center gap-1 rounded-full bg-T-200 p-1">
          <button
            v-for="c in pills.cats"
            :key="c.label"
            class="flex h-[38px] items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors"
            :class="
              (pills.activeCat === c.label)
                ? 'border border-T-400 bg-T-50 text-foreground shadow-sm'
                : 'text-T-700 hover:bg-T-50/50'
            "
          >
            {{ c.label }}
            <component
              :is="catIcons[c.icon]"
              class="size-5"
            />
          </button>
        </div>

        <!-- Price pills -->
        <div class="flex items-center gap-1 rounded-full bg-T-200 p-1">
          <button
            v-for="p in pills.prices"
            :key="p"
            class="flex h-[38px] items-center rounded-full px-4 text-[13px] font-medium transition-colors"
            :class="
              (pills.activePrice === p)
                ? 'border border-T-400 bg-T-50 text-foreground shadow-sm'
                : 'text-T-700 hover:bg-T-50/50'
            "
          >
            {{ toPersianDigits(p) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Products row -->
    <Carousel
      v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }"
      class="relative mt-6 overflow-x-clip px-4 [overflow-clip-margin:24px]"
      :class="perView ? 'md:px-6' : 'md:px-0'"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="ms-0">
        <CarouselItem
          v-for="(product, i) in products"
          :key="i"
          class="w-[180px] shrink-0 basis-auto ps-0"
          :class="[i > 0 ? 'border-s border-T-400' : '', itemBasisClass]"
        >
          <Product
            :product="product"
            variant="vertical"
            discount-placement="inline"
            image-class="bg-transparent"
            :href="product.id ? `/product/${product.id}` : ''"
            class="w-full rounded-none border-0"
          />
        </CarouselItem>
      </CarouselContent>

      <!-- Arrows (desktop only) -->
      <button
        v-if="canScrollNext"
        class="absolute -left-[19px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        aria-label="محصولات قبلی"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        v-if="canScrollPrev"
        class="absolute -right-[19px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        aria-label="محصولات بعدی"
        :disabled="!canScrollPrev"
        @click="scrollPrev"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </Carousel>
  </section>
</template>
