<script setup lang="ts">
import { ref } from 'vue'
import {
  IconHeart,
  IconArrowsLeftRight,
  IconShare,
  IconVideo,
  IconRefresh,
  IconCircleCheckFilled,
} from '@tabler/icons-vue'
import type { GalleryItem } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    images: GalleryItem[]
    alt?: string
    class?: string
    /** Catalog id to add/remove from the compare list when «مقایسه» is clicked. */
    compareId?: string
  }>(),
  { alt: '', class: '', compareId: '' },
)

const active = ref(0)
const current = computed(() => props.images[active.value])

const { has: inCompare, add: addCompare } = useCompare()

const actionRail = [
  { icon: IconHeart, label: 'افزودن به علاقه‌مندی‌ها' },
  { icon: IconArrowsLeftRight, label: 'مقایسه' },
  { icon: IconShare, label: 'اشتراک‌گذاری' },
]

function onAction(label: string) {
  if (label !== 'مقایسه' || !props.compareId) return
  addCompare(props.compareId)
  navigateTo('/compare')
}

function isActionActive(label: string) {
  return label === 'مقایسه' && !!props.compareId && inCompare(props.compareId)
}
</script>

<template>
  <div :class="cn('flex w-full flex-col items-stretch', props.class)">
    <!-- Main image + action rail -->
    <div class="relative w-full">
      <!-- Action rail -->
      <div
        class="absolute start-3 top-3 z-10 flex flex-col gap-0.5 rounded-full bg-T-200 p-0.5 text-T-900"
      >
        <button
          v-for="action in actionRail"
          :key="action.label"
          type="button"
          class="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-T-300 hover:text-T-900"
          :class="isActionActive(action.label) ? 'text-primary' : 'text-T-900'"
          :aria-label="action.label"
          @click="onAction(action.label)"
        >
          <component :is="action.icon" class="size-4.5" />
        </button>
      </div>

      <div class="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-T-300 bg-T-50">
        <ProductImage
          :src="current?.src"
          :alt="alt"
          container-class="rounded-none bg-transparent"
          image-class="max-h-[70%] max-w-[70%]"
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

    <!-- Registered / activation assurance strip -->
    <div class="mt-4 flex items-center justify-center gap-2.5 rounded-xl bg-[#EAECFF] px-4 py-3.5">
      <IconCircleCheckFilled class="size-5 shrink-0 text-[#3D7BFA]" />
      <span class="text-[12.5px] font-medium text-T-900">رجیسترشده - به همراه کد فعال سازی</span>
    </div>
  </div>
</template>
