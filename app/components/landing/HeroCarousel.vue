<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'

const slides = [
  '/figma/fill-4f5b0b1a98425788.jpg',
  '/figma/fill-fc0d272a9ceafa5f.jpg',
  '/figma/fill-f48409b4bd7d0235.jpg',
  '/figma/fill-5db09d93bf7473ad.jpg',
  '/figma/fill-c0c190e0bee60b2a.jpg',
  '/figma/fill-8cfc51f6d61983d7.jpg',
]

const active = ref(0)
const total = slides.length

const SLIDE_DURATION = 6000

let timer: ReturnType<typeof setInterval>
let touchX = 0

function startAutoplay() {
  clearInterval(timer)
  timer = setInterval(() => {
    active.value = (active.value + 1) % total
  }, SLIDE_DURATION)
}

function go(dir: 1 | -1) {
  active.value = (active.value + dir + total) % total
  startAutoplay()
}

function onTouchStart(e: TouchEvent) {
  touchX = e.touches[0]?.clientX ?? 0
}

function onTouchEnd(e: TouchEvent) {
  const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX
  // RTL: swipe left → next slide
  if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
}

onMounted(startAutoplay)
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="relative mx-auto w-full max-w-[1440px]">
    <div
      class="relative aspect-[402/291] w-full cursor-pointer touch-pan-y overflow-hidden md:aspect-[1440/342]"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <!-- Slides -->
      <img
        v-for="(slide, i) in slides"
        :key="slide"
        :src="slide"
        alt=" بنر اصلی هماکام"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        :class="active === i ? 'opacity-100' : 'opacity-0'"
      >

      <!-- Arrows (desktop only) -->
      <button
        class="absolute left-[41px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 shadow-sm transition-colors hover:bg-secondary xl:flex"
        aria-label="قبلی"
        @click="go(-1)"
      >
        <IconChevronLeft class="size-[18px] text-T-700" />
      </button>
      <button
        class="absolute right-[41px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 shadow-sm transition-colors hover:bg-secondary xl:flex"
        aria-label="بعدی"
        @click="go(1)"
      >
        <IconChevronLeft class="size-[18px] rotate-180 text-T-700" />
      </button>

      <!-- Dots (mobile: inside bottom) -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 xl:hidden">
        <div
          class="flex items-center justify-center gap-[2px] rounded-[50px] bg-T-50/65 px-[20px] py-2 shadow-[0_0_6px_rgba(0,0,0,0.08)] backdrop-blur-[75px]"
        >
          <button
            v-for="i in total"
            :key="i"
            class="h-2 rounded-full transition-all duration-300"
            :class="
              active === i - 1
                ? 'relative w-[29px] bg-T-500'
                : 'w-2 bg-T-500'
            "
            :aria-label="`اسلاید ${i}`"
            @click="active = i - 1"
          >
            <span
              v-if="active === i - 1"
              class="carousel-fill absolute inset-y-0 right-0 w-full rounded-full bg-primary"
              :style="{ animationDuration: `${SLIDE_DURATION}ms` }"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Dots (desktop: below) -->
    <div class="mt-[18px] hidden justify-center gap-[3px] xl:flex">
      <button
        v-for="i in total"
        :key="i"
        class="h-2 rounded-full transition-all duration-300"
        :class="
          active === i - 1
            ? 'relative w-[29px] bg-T-500'
            : 'w-2 bg-T-500'
        "
        :aria-label="`اسلاید ${i}`"
        @click="active = i - 1"
      >
        <span
          v-if="active === i - 1"
          class="carousel-fill absolute inset-y-0 right-0 w-full rounded-full bg-primary"
          :style="{ animationDuration: `${SLIDE_DURATION}ms` }"
        />
      </button>
    </div>
  </section>
</template>

<style scoped>
@keyframes carousel-fill {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.carousel-fill {
  animation-name: carousel-fill;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
</style>
