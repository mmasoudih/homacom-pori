<script setup lang="ts">
import { ref } from 'vue'
import { IconHeart, IconArrowsLeftRight, IconShare, IconVideo, IconRefresh } from '@tabler/icons-vue'
import type { GalleryItem } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    images: GalleryItem[]
    alt?: string
    class?: string
  }>(),
  { alt: '', class: '' },
)

const active = ref(0)
const current = computed(() => props.images[active.value])

const actionRail = [
  { icon: IconHeart, label: 'افزودن به علاقه‌مندی‌ها' },
  { icon: IconArrowsLeftRight, label: 'مقایسه' },
  { icon: IconShare, label: 'اشتراک‌گذاری' },
]
</script>

<template>
  <div :class="cn('flex w-full flex-col items-stretch', props.class)">
    <!-- Main image + action rail -->
    <div class="relative w-full">
      <!-- Action rail -->
      <div class="absolute end-1 top-1 z-10 flex flex-col gap-3 text-T-600">
        <button
          v-for="action in actionRail"
          :key="action.label"
          type="button"
          class="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-T-200 hover:text-T-900"
          :aria-label="action.label"
        >
          <component :is="action.icon" class="size-5" />
        </button>
      </div>

      <div class="group relative flex aspect-square w-full items-center justify-center overflow-hidden bg-T-100">
        <ProductImage
          :src="current?.src"
          :alt="alt"
          container-class="rounded-none bg-transparent"
          image-class="max-h-[85%] max-w-[85%]"
        />

        <!-- Video / 360 overlay icon on the main stage -->
        <div
          v-if="current && current.type !== 'image'"
          class="absolute bottom-3 flex items-center gap-1 rounded-full bg-T-900/70 px-3 py-1.5 text-[11px] text-white"
        >
          <component :is="current.type === 'video' ? IconVideo : IconRefresh" class="size-3.5" />
          {{ current.type === 'video' ? 'ویدیوی محصول' : 'نمای ۳۶۰ درجه' }}
        </div>
      </div>
    </div>

    <!-- Thumbnails -->
    <div class="mt-4 flex w-full items-center justify-center gap-3">
      <button
        v-for="(item, i) in images"
        :key="`${item.type}-${i}`"
        type="button"
        class="relative flex size-[68px] items-center justify-center overflow-hidden rounded-xl border bg-T-50 transition-all"
        :class="active === i ? 'border-R-300 ring-1 ring-R-300' : 'border-T-400 hover:border-T-500'"
        :aria-label="item.type === 'video' ? 'ویدیوی محصول' : item.type === 'view360' ? 'نمای ۳۶۰ درجه' : `تصویر ${i + 1}`"
        :aria-pressed="active === i"
        @click="active = i"
      >
        <img
          v-if="item.src"
          :src="item.src"
          :alt="''"
          class="max-h-[80%] max-w-[80%] object-contain"
        >
        <component
          :is="item.type === 'video' ? IconVideo : IconRefresh"
          v-else
          class="size-5 text-T-600"
        />
      </button>
    </div>
  </div>
</template>
