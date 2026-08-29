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

let timer: ReturnType<typeof setInterval>
let touchX = 0

function startAutoplay() {
  clearInterval(timer)
  timer = setInterval(() => {
    active.value = (active.value + 1) % total
  }, 6000)
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
        class="absolute left-[41px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white shadow-sm transition-colors hover:bg-secondary xl:flex"
        aria-label="قبلی"
        @click="go(-1)"
      >
        <IconChevronLeft class="size-[18px] text-[#6b7280]" />
      </button>
      <button
        class="absolute right-[41px] top-1/2 hidden size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white shadow-sm transition-colors hover:bg-secondary xl:flex"
        aria-label="بعدی"
        @click="go(1)"
      >
        <IconChevronLeft class="size-[18px] rotate-180 text-[#6b7280]" />
      </button>

      <!-- Dots (mobile: inside bottom) -->
      <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-[3px] xl:hidden">
        <button
          v-for="i in total"
          :key="i"
          class="h-2 rounded-full transition-all duration-300"
          :class="
            active === i - 1
              ? 'relative w-[29px] bg-white/60'
              : 'w-2 bg-white/60'
          "
          :aria-label="`اسلاید ${i}`"
          @click="active = i - 1"
        >
          <span
            v-if="active === i - 1"
            class="absolute inset-y-0 right-0 w-[14px] rounded-full bg-white"
          />
        </button>
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
            ? 'relative w-[29px] bg-[#c8ccd2]'
            : 'w-2 bg-[#c8ccd2]'
        "
        :aria-label="`اسلاید ${i}`"
        @click="active = i - 1"
      >
        <span
          v-if="active === i - 1"
          class="absolute inset-y-0 right-0 w-[14px] rounded-full bg-primary"
        />
      </button>
    </div>
  </section>
</template>
