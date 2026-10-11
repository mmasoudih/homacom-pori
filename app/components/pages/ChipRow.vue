<script setup lang="ts">
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '~/lib/utils'

export interface ChipItem {
  label: string
  icon: string
  /** Stable identifier used to match the chip against content. */
  id?: string
  /** Desktop-only chip (hidden below `lg`). */
  desktopOnly?: boolean
}

const props = withDefaults(defineProps<{
  items: ChipItem[]
  active?: number
  desktopGrid?: boolean
  /** Color applied to the chip label and icon. Defaults to inheriting the button state color. */
  contentColor?: 'inherit' | 'default'
  class?: string
}>(), {
  active: 0,
  desktopGrid: false,
  contentColor: 'inherit',
  class: '',
})

const emit = defineEmits<{
  select: [index: number]
}>()

/** Chips shown in the mobile carousel (desktop-only chips are excluded). */
const mobileItems = computed(() =>
  props.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.desktopOnly),
)
</script>

<template>
  <div :class="props.class">
    <!-- Mobile: carousel -->
    <Carousel
      class="w-full lg:hidden"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="-ms-3">
        <CarouselItem
          v-for="{ item, index } in mobileItems"
          :key="item.label"
          class="basis-auto ps-3"
        >
          <PagesChipButton
            :item="item"
            :active="index === props.active"
            :content-color="props.contentColor"
            @select="emit('select', index)"
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>

    <!-- Desktop: wrapped row -->
    <div
      :class="cn(
        props.desktopGrid
          ? 'hidden lg:grid lg:grid-cols-7 lg:gap-3'
          : 'hidden lg:flex lg:flex-wrap lg:justify-center lg:gap-3',
      )"
    >
      <PagesChipButton
        v-for="(item, i) in props.items"
        :key="item.label"
        :item="item"
        :fill="props.desktopGrid"
        :active="i === props.active"
        :content-color="props.contentColor"
        @select="emit('select', i)"
      />
    </div>
  </div>
</template>
