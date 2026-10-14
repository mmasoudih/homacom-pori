<script setup lang="ts">
import type { SearchCategoryTile } from '~/data/search'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

defineProps<{
  categories: SearchCategoryTile[]
}>()

const emit = defineEmits<{
  select: [tile: SearchCategoryTile]
}>()
</script>

<template>
  <!-- Mobile results row: larger circular tiles instead of the desktop squares. -->
  <Carousel
    class="w-full"
    :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
  >
    <CarouselContent class="ms-0 gap-3">
      <CarouselItem
        v-for="tile in categories"
        :key="tile.id"
        class="basis-auto ps-0"
      >
        <button
          type="button"
          class="group flex w-[88px] flex-col items-center gap-2"
          @click="emit('select', tile)"
        >
          <span
            class="flex size-[76px] items-center justify-center overflow-hidden rounded-full border border-T-300 bg-T-200 transition-colors group-hover:border-T-500"
          >
            <img
              :src="tile.image"
              :alt="tile.title"
              loading="lazy"
              class="size-8 object-contain"
            >
          </span>
          <UiTypography
            as="span"
            size="md"
            weight="medium"
            class="line-clamp-2 text-center leading-[17px] text-T-800"
          >
            {{ tile.title }}
          </UiTypography>
        </button>
      </CarouselItem>
    </CarouselContent>
  </Carousel>
</template>
