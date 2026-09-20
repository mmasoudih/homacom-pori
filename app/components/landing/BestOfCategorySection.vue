<script setup lang="ts">
import { IconChevronLeft, IconDeviceLaptop, IconDeviceMobile } from '@tabler/icons-vue'
import { bestOfCategories } from '~/data/landing'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import mobileIcon from '../../../public/icons/mobile.svg?raw'
import laptopIcon from '../../../public/icons/laptop.svg?raw'
import headphonesIcon from '../../../public/icons/headphones-waveform.svg?raw'

const activeTab = ref('لپ‌تاپ')

const tabs = [
  { label: 'لپ‌تاپ', icon: IconDeviceLaptop },
  { label: 'گوشی موبایل', icon: IconDeviceMobile },
]

const iconMap: Record<string, string> = {
  mobile: mobileIcon,
  laptop: laptopIcon,
  headphones: headphonesIcon,
}

const activeItems = computed(() => {
  const col = bestOfCategories.find((c) => c.category === activeTab.value)
  return col?.items ?? []
})
</script>

<template>
  <section class="mx-auto w-full max-w-[1350px] px-4 py-5 md:px-0 md:py-6">
    <LandingSectionTitle title="بهترین‌های هر دسته‌بندی" variant="centered" />

    <!-- Mobile: tabs + list -->
    <div class="mt-[18px] lg:hidden">
      <!-- Tab bar -->
      <div class="flex border-b border-T-400">
        <button
          v-for="tab in tabs"
          :key="tab.label"
          class="flex h-[60px] flex-1 items-center justify-center gap-2 border-b-2 text-[15px] font-bold transition-colors"
          :class="
            activeTab === tab.label
              ? 'border-primary text-foreground'
              : 'border-transparent text-T-600'
          "
          @click="activeTab = tab.label"
        >
          <component :is="tab.icon" class="size-[22px]" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Items -->
      <Product
        v-for="(item, i) in activeItems"
        :key="i"
        :product="item"
        variant="horizontal"
        discount-placement="inline"
        :href="item.id ? `/product/${item.id}` : ''"
        class="h-[122px] border-b border-T-400 px-4"
        image-class="w-[84px] bg-transparent"
      />
    </div>

    <!-- Desktop: 3-column carousel -->
    <Carousel
      v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }"
      class="relative mt-[18px] hidden lg:block"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="-ms-[10px]">
        <CarouselItem
          v-for="col in bestOfCategories"
          :key="col.category"
          class="basis-1/3 ps-[10px]"
        >
          <div class="flex flex-col overflow-hidden rounded-3xl border border-T-400 bg-T-50">
            <!-- Column header -->
            <div class="flex h-[70px] items-center justify-center gap-2 bg-T-200 px-4">
              <span
                class="[&>svg]:block [&>svg]:size-[22px] text-T-700"
                aria-hidden="true"
                v-html="iconMap[col.icon]"
              />
              <h3 class="text-[14px] font-bold text-foreground">{{ col.category }}</h3>
            </div>

            <!-- Mini cards -->
            <Product
              v-for="(item, i) in col.items"
              :key="i"
              :product="item"
              variant="horizontal"
              discount-placement="inline"
              :href="item.id ? `/product/${item.id}` : ''"
              class="h-[150px] border-b border-T-400 px-4 last:border-b-0 transition-colors hover:bg-secondary/30"
              image-class="w-[96px] bg-transparent"
            />
          </div>
        </CarouselItem>
      </CarouselContent>

      <!-- Arrows (desktop) -->
      <button
        class="absolute -left-[19px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
        aria-label="قبلی"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
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
