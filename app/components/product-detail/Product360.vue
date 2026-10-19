<script setup lang="ts">
import { IconRotate360 } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  class?: string
}>(), {
  src: '',
  alt: '',
  class: '',
})

const { t } = useI18n()

const angle = ref(0)
const dragging = ref(false)
let startX = 0
let startAngle = 0

function onPointerDown(event: PointerEvent) {
  dragging.value = true
  startX = event.clientX
  startAngle = angle.value
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  angle.value = startAngle + (event.clientX - startX) * 0.6
}

function stopDrag() {
  dragging.value = false
}

function reset() {
  angle.value = 0
}
</script>

<template>
  <div
    :class="cn('relative flex size-full select-none items-center justify-center overflow-hidden', props.class)"
    :style="{ cursor: dragging ? 'grabbing' : 'grab' }"
    role="img"
    :aria-label="`${alt} — ${t('product.dragToRotate')}`"
    @pointerdown.prevent="onPointerDown"
    @pointermove.prevent="onPointerMove"
    @pointerup="stopDrag"
    @pointercancel="stopDrag"
    @pointerleave="stopDrag"
    @dblclick="reset"
  >
    <img
      :src="src"
      :alt="alt"
      draggable="false"
      class="max-h-[70%] max-w-[70%] object-contain transition-transform duration-75"
      :style="{ transform: `perspective(900px) rotateY(${angle}deg)` }"
    >

    <span class="pointer-events-none absolute bottom-3 flex items-center gap-1.5 rounded-full bg-T-900/70 px-3 py-1.5 text-[11px] text-white">
      <IconRotate360 class="size-4" />
      {{ t('product.dragToRotate') }}
    </span>
  </div>
</template>
