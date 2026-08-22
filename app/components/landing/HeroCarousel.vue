<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import { useIntervalFn } from '@vueuse/core'

const slides = [
  { id: 1, image: '/figma/fill-fc0d272a9ceafa5f.png', alt: 'بنر تبلیغاتی هماکام' },
  { id: 2, image: '/figma/fill-f48409b4bd7d0235.png', alt: 'بنر تبلیغاتی هماکام' },
  { id: 3, image: '/figma/fill-5db09d93bf7473ad.png', alt: 'بنر تبلیغاتی هماکام' },
]

const current = ref(0)

function next() {
  current.value = (current.value + 1) % slides.length
}

function prev() {
  current.value = (current.value - 1 + slides.length) % slides.length
}

const { pause, resume } = useIntervalFn(next, 6000)
</script>

<template>
  <section class="mx-auto max-w-[1400px] px-5">
    <div
      class="relative"
      @mouseenter="pause()"
      @mouseleave="resume()"
    >
      <div class="relative aspect-[1440/350] w-full overflow-hidden rounded-3xl bg-secondary">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="absolute inset-0 transition-opacity duration-700"
          :class="index === current ? 'opacity-100' : 'pointer-events-none opacity-0'"
        >
          <img
            :src="slide.image"
            :alt="slide.alt"
            class="size-full object-cover"
            draggable="false"
          >
        </div>
      </div>

      <!-- arrows -->
      <button
        class="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur transition-transform hover:scale-105"
        aria-label="اسلاید قبلی"
        @click="prev"
      >
        <IconChevronRight class="size-5" />
      </button>
      <button
        class="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur transition-transform hover:scale-105"
        aria-label="اسلاید بعدی"
        @click="next"
      >
        <IconChevronLeft class="size-5" />
      </button>
    </div>

    <!-- dots -->
    <div class="mt-5 flex items-center justify-center gap-2">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="[
          'h-1.5 cursor-pointer rounded-full transition-all duration-300',
          index === current ? 'w-8 bg-primary' : 'w-6 bg-gray-300 hover:bg-gray-400',
        ]"
        :aria-label="`برو به اسلاید ${index + 1}`"
        @click="current = index"
      />
    </div>
  </section>
</template>
