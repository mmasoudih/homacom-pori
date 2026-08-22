<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'

const active = ref(0)
const total = 6
const slide = '/figma/fill-4f5b0b1a98425788.png'

let timer: ReturnType<typeof setInterval>

function startAutoplay() {
  timer = setInterval(() => {
    active.value = (active.value + 1) % total
  }, 6000)
}

function go(dir: 1 | -1) {
  active.value = (active.value + dir + total) % total
  clearInterval(timer)
  startAutoplay()
}

onMounted(startAutoplay)
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="relative mx-auto w-full max-w-[1440px]">
    <div class="relative aspect-[1440/342] w-full overflow-hidden">
      <!-- Slide -->
      <img
        :src="slide"
        alt=" بنر اصلی هماکام"
        class="h-full w-full object-cover transition-opacity duration-500"
      >

      <!-- Arrows -->
      <button
        class="absolute left-[41px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white shadow-sm transition-colors hover:bg-secondary"
        aria-label="قبلی"
        @click="go(-1)"
      >
        <IconChevronLeft class="size-[18px] text-[#6b7280]" />
      </button>
      <button
        class="absolute right-[41px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white shadow-sm transition-colors hover:bg-secondary"
        aria-label="بعدی"
        @click="go(1)"
      >
        <IconChevronLeft class="size-[18px] rotate-180 text-[#6b7280]" />
      </button>
    </div>

    <!-- Dots -->
    <div class="mt-[18px] flex justify-center gap-[3px]">
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
