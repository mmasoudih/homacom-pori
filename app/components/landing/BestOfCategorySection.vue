<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { bestOfCategories } from '~/data/landing'
import { toLandingCard } from '~/composables/useProducts'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const { categories, refresh: refreshCategories } = useProductCategories()
const { fetchList } = useProductCatalog()

function iconForTitle(title: string): string {
  if (/گوشی|موبایل/.test(title)) return 'mobile'
  if (/لپ|تبلت/.test(title)) return 'laptop'
  if (/ساعت/.test(title)) return 'watch'
  if (/هدفون|هندزفری|صوتی/.test(title)) return 'headphones'
  if (/کنسول|بازی/.test(title)) return 'gamepad'
  if (/کامپیوتر|نمایش|مانیتور/.test(title)) return 'display'
  if (/جانبی|فلش|حافظه/.test(title)) return 'usb'
  if (/اسپیکر|بلندگو/.test(title)) return 'speakers'
  return 'display'
}

const { data: groups } = await useAsyncData('landing-best-of', async () => {
  let roots = categories.value.filter(category => /^\d+$/.test(category.id)).slice(0, 3)
  if (!roots.length) {
    try {
      await refreshCategories()
      roots = categories.value.filter(category => /^\d+$/.test(category.id)).slice(0, 3)
    }
    catch {
      // Keep the designed panels below.
    }
  }
  if (!roots.length) return bestOfCategories

  try {
    // The backend's `filters[categories][]` still rejects every id (422), so the
    // panels share a real product pool split across the three categories.
    const products = await fetchList('', 9, 'more_invoice')
    if (products.length) {
      return roots.map((root, index) => ({
        category: root.title,
        icon: iconForTitle(root.title),
        items: products.slice(index * 3, index * 3 + 3).map(toLandingCard),
      }))
    }
  }
  catch {
    // Fall back to the designed panels below.
  }

  return bestOfCategories
}, { default: () => bestOfCategories })
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
          v-for="col in groups"
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
