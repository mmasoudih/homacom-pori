<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import type { ProductDetail } from '~/data/product'
import { cn } from '~/lib/utils'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const props = withDefaults(
  defineProps<{
    title: string
    products: ProductDetail['related']
    class?: string
  }>(),
  { class: '' },
)
</script>

<template>
  <section :class="cn('flex w-full flex-col gap-4', props.class)">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="h-[18px] w-1 rounded-full bg-R-300" />
        <h2 class="text-[16px] font-bold text-T-900">{{ title }}</h2>
      </div>
      <button
        type="button"
        class="flex items-center gap-1 text-[12.5px] text-T-700 transition-colors hover:text-R-300"
      >
        مشاهده همه
        <IconChevronLeft class="size-4" />
      </button>
    </div>

    <Carousel :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }">
      <CarouselContent class="-ms-3 lg:-ms-4">
        <CarouselItem
          v-for="item in products"
          :key="item.id"
          class="w-[184px] shrink-0 basis-auto ps-3 lg:w-[254px] lg:ps-4"
        >
          <NuxtLink :to="`/product/${item.id}`" class="block h-full">
            <Product :product="item" class="h-full" />
          </NuxtLink>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </section>
</template>
