<script setup lang="ts">
import {
  IconChevronLeft,
  IconChevronRight,
  IconRotateClockwise2,
  IconX,
  IconZoomIn,
  IconZoomOut,
} from '@tabler/icons-vue'
import type { GalleryItem } from '~/data/product'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

const props = withDefaults(defineProps<{
  open: boolean
  images: GalleryItem[]
  startIndex?: number
  alt?: string
}>(), {
  startIndex: 0,
  alt: '',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { t } = useI18n()

const index = ref(props.startIndex)
const zoom = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const dragging = ref(false)

let startX = 0
let startY = 0
let originX = 0
let originY = 0

const current = computed(() => props.images[index.value])

watch(
  () => props.open,
  (open) => {
    if (!open) return
    index.value = Math.min(Math.max(props.startIndex, 0), Math.max(props.images.length - 1, 0))
    resetZoom()
  },
)

watch(index, resetZoom)

function resetZoom() {
  zoom.value = 1
  offsetX.value = 0
  offsetY.value = 0
}

function zoomIn() {
  zoom.value = Math.min(4, zoom.value + 0.5)
}

function zoomOut() {
  zoom.value = Math.max(1, zoom.value - 0.5)
  if (zoom.value === 1) {
    offsetX.value = 0
    offsetY.value = 0
  }
}

function toggleZoom() {
  if (zoom.value > 1) resetZoom()
  else zoom.value = 2.5
}

function onWheel(event: WheelEvent) {
  if (current.value?.type !== 'image') return
  event.preventDefault()
  if (event.deltaY < 0) zoomIn()
  else zoomOut()
}

function onPointerDown(event: PointerEvent) {
  if (current.value?.type !== 'image' || zoom.value <= 1) return
  dragging.value = true
  startX = event.clientX
  startY = event.clientY
  originX = offsetX.value
  originY = offsetY.value
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  offsetX.value = originX + (event.clientX - startX)
  offsetY.value = originY + (event.clientY - startY)
}

function stopDrag() {
  dragging.value = false
}

function prev() {
  index.value = index.value > 0 ? index.value - 1 : props.images.length - 1
}

function next() {
  index.value = index.value < props.images.length - 1 ? index.value + 1 : 0
}

function close() {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent
      :show-close-button="false"
      class="h-dvh w-screen max-w-none gap-0 rounded-none border-0 bg-black/95 p-0 text-white lg:max-w-none"
      overlay-class="bg-black/85"
      @keydown.left.prevent="next"
      @keydown.right.prevent="prev"
    >
      <DialogTitle class="sr-only">{{ t('product.gallery') }}</DialogTitle>

      <div class="relative flex h-full w-full flex-col">
        <!-- Toolbar -->
        <div class="flex items-center justify-between gap-3 p-4" dir="ltr">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
              :aria-label="t('product.zoomOut')"
              :disabled="current?.type !== 'image' || zoom <= 1"
              @click="zoomOut"
            >
              <IconZoomOut class="size-5" />
            </button>
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
              :aria-label="t('product.zoomIn')"
              :disabled="current?.type !== 'image' || zoom >= 4"
              @click="zoomIn"
            >
              <IconZoomIn class="size-5" />
            </button>
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
              :aria-label="t('product.zoomReset')"
              :disabled="current?.type !== 'image' || zoom === 1"
              @click="resetZoom"
            >
              <IconRotateClockwise2 class="size-5" />
            </button>
          </div>

          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            :aria-label="t('common.close')"
            @click="close"
          >
            <IconX class="size-5" />
          </button>
        </div>

        <!-- Stage -->
        <div
          class="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4"
          :style="{ cursor: current?.type === 'image' && zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }"
          @wheel="onWheel"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="stopDrag"
          @pointercancel="stopDrag"
          @pointerleave="stopDrag"
          @dblclick="toggleZoom"
        >
          <img
            v-if="current?.type === 'image'"
            :src="current.src"
            :alt="alt"
            draggable="false"
            class="max-h-full max-w-full select-none object-contain transition-transform duration-150"
            :style="{ transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})` }"
          >
          <video
            v-else-if="current?.type === 'video'"
            :src="current.src"
            :poster="current.poster"
            controls
            autoplay
            playsinline
            class="max-h-full max-w-full rounded-xl"
          />
          <ProductDetailProduct360
            v-else-if="current?.type === 'view360'"
            :src="current.src"
            :alt="alt"
            class="max-h-full max-w-full"
          />

          <!-- Prev / next -->
          <button
            v-if="images.length > 1"
            type="button"
            class="absolute start-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 lg:start-4"
            :aria-label="t('common.previous')"
            @click.stop="prev"
          >
            <IconChevronRight class="size-5" />
          </button>
          <button
            v-if="images.length > 1"
            type="button"
            class="absolute end-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 lg:end-4"
            :aria-label="t('common.next')"
            @click.stop="next"
          >
            <IconChevronLeft class="size-5" />
          </button>
        </div>

        <!-- Thumbnails -->
        <div class="flex items-center justify-center gap-2 overflow-x-auto p-4">
          <button
            v-for="(item, i) in images"
            :key="`${item.type}-${i}`"
            type="button"
            class="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white/5 transition-colors"
            :class="index === i ? 'border-white' : 'border-white/20 hover:border-white/50'"
            :aria-label="item.type === 'video' ? t('product.videoAlt') : item.type === 'view360' ? t('product.view360') : t('product.imageAlt', { index: i + 1 })"
            @click="index = i"
          >
            <img
              v-if="item.poster || item.src"
              :src="item.poster || item.src"
              :alt="''"
              class="max-h-[80%] max-w-[80%] object-contain"
            >
            <IconRotateClockwise2 v-else class="size-5 text-white/70" />
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
