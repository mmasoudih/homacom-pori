<script setup lang="ts">
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  tabs: string[]
  active?: number
  variant?: 'red' | 'purple'
  class?: string
}>(), {
  active: 0,
  variant: 'red',
  class: '',
})

const emit = defineEmits<{
  select: [index: number]
}>()

function tabClass(i: number) {
  if (i === props.active) {
    return props.variant === 'red'
      ? 'border border-primary bg-R-10 text-primary'
      : 'border border-[#7C5CFF] bg-[#EFE9FB] text-[#6C4BD8]'
  }
  return props.variant === 'red'
    ? 'border border-T-400 bg-T-50 text-T-900 hover:border-T-500'
    : 'border border-T-400 bg-T-50 text-[#6C4BD8] hover:border-[#C9B8FF]'
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <!-- Mobile: carousel -->
    <Carousel
      class="w-full lg:hidden"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="-ms-2">
        <CarouselItem
          v-for="(tab, i) in tabs"
          :key="tab"
          class="basis-auto ps-2"
        >
          <button
            type="button"
            class="inline-flex h-[42px] shrink-0 items-center justify-center rounded-full px-5 transition-colors"
            :class="tabClass(i)"
            @click="emit('select', i)"
          >
            <UiTypography as="span" size="mdLg" weight="medium" color="inherit">
              {{ tab }}
            </UiTypography>
          </button>
        </CarouselItem>
      </CarouselContent>
    </Carousel>

    <!-- Desktop: wrapped row -->
    <div class="hidden lg:flex lg:flex-wrap lg:justify-center lg:gap-2">
      <button
        v-for="(tab, i) in tabs"
        :key="tab"
        type="button"
        class="inline-flex h-[45px] shrink-0 items-center justify-center rounded-full px-5 transition-colors"
        :class="tabClass(i)"
        @click="emit('select', i)"
      >
        <UiTypography as="span" size="mdLg" weight="medium" color="inherit">
          {{ tab }}
        </UiTypography>
      </button>
    </div>
  </div>
</template>
