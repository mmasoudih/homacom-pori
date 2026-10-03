<script setup lang="ts">
import { IconChevronLeft } from "@tabler/icons-vue";
import { headerCircles } from "~/data/landing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
</script>

<template>
  <Carousel
    v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }"
    class="relative w-full overflow-x-clip [overflow-clip-margin:24px]"
    :opts="{
      direction: 'rtl',
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: true,
    }"
  >
    <CarouselContent class="ms-0">
      <CarouselItem
        v-for="(item, i) in headerCircles"
        :key="i"
        class="basis-auto ps-0 pe-5 lg:pe-7"
      >
        <a
          :href="item.href"
          class="group flex w-[78px] flex-col items-center gap-2 lg:w-[96px]"
        >
          <span
            class="border-R-300 relative flex size-[78px] items-center justify-center overflow-hidden rounded-full border-[2px] p-1 transition-colors lg:size-[96px]"
            :class="
              item.accent
                ? 'group-hover:border-primary'
                : 'group-hover:border-R-100'
            "
          >
            <img
              :src="item.image"
              :alt="`${item.title} ${item.subtitle}`"
              class="size-full object-cover"
              loading="lazy"
            >
          </span>

          <UiTypography
            as="span"
            size="md"
            weight="regular"
            class="text-center leading-[17px] text-foreground"
          >
            {{ item.title }}
            <span class="block">{{ item.subtitle }}</span>
          </UiTypography>
        </a>
      </CarouselItem>
    </CarouselContent>

    <!-- Arrows (desktop / tablet) -->
    <button
      v-if="canScrollNext"
      type="button"
      class="absolute left-0 top-[39px] z-20 hidden size-[34px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground shadow-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex lg:top-[48px] lg:-left-4"
      aria-label="قبلی"
      :disabled="!canScrollNext"
      @click="scrollNext"
    >
      <IconChevronLeft class="size-[18px]" />
    </button>
    <button
      v-if="canScrollPrev"
      type="button"
      class="absolute -right-4 top-[39px] z-20 hidden size-[34px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground shadow-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex lg:top-[48px]"
      aria-label="بعدی"
      :disabled="!canScrollPrev"
      @click="scrollPrev"
    >
      <IconChevronLeft class="size-[18px] rotate-180" />
    </button>
  </Carousel>
</template>
