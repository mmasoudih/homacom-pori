<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-vue'
import type { StoryItem } from '~/types/story'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

const props = withDefaults(defineProps<{
  open: boolean
  items: StoryItem[]
  startIndex?: number
}>(), {
  startIndex: 0,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { t } = useI18n()

const STORY_DURATION = 6000
const index = ref(props.startIndex)
const progress = ref(0)

const current = computed(() => props.items[index.value])

function resetProgress() {
  progress.value = 0
}

function next() {
  if (index.value >= props.items.length - 1) {
    close()
    return
  }
  index.value += 1
  resetProgress()
}

function prev() {
  if (index.value === 0) {
    resetProgress()
    return
  }
  index.value -= 1
  resetProgress()
}

function close() {
  emit('update:open', false)
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    index.value = Math.min(Math.max(props.startIndex, 0), Math.max(props.items.length - 1, 0))
    resetProgress()
  },
)

watch(index, resetProgress)

const { pause, resume } = useIntervalFn(() => {
  progress.value += 1
  if (progress.value >= 100) next()
}, STORY_DURATION / 100, { immediate: false })

watch(
  () => props.open,
  (open) => {
    if (open) resume()
    else pause()
  },
  { immediate: true },
)

onUnmounted(pause)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent
      :show-close-button="false"
      class="h-dvh w-screen max-w-none gap-0 rounded-none border-0 bg-black/95 p-0 text-white backdrop-blur-sm lg:max-w-none"
      overlay-class="bg-black/80"
    >
      <DialogTitle class="sr-only">{{ t('story.viewerTitle') }}</DialogTitle>
      <DialogDescription class="sr-only">{{ t('story.viewerTitle') }}</DialogDescription>

      <div class="relative flex h-full w-full items-center justify-center overflow-hidden">
        <!-- Progress bars -->
        <div class="absolute inset-x-3 top-4 z-30 flex gap-1" dir="ltr">
          <div
            v-for="(item, i) in items"
            :key="`bar-${i}-${item.title}`"
            class="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
          >
            <span
              class="block h-full rounded-full bg-white transition-[width] duration-100 ease-linear"
              :style="{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }"
            />
          </div>
        </div>

        <!-- Header -->
        <div class="absolute inset-x-4 top-8 z-30 flex items-center justify-between gap-4">
          <div class="min-w-0" dir="rtl">
            <p class="truncate text-sm font-bold">{{ current?.title }}</p>
            <p class="truncate text-xs text-white/70">{{ current?.subtitle }}</p>
          </div>
          <button
            type="button"
            class="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            :aria-label="t('story.close')"
            @click="close"
          >
            <IconX class="size-5" />
          </button>
        </div>

        <!-- Image -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-[1.02]"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <video
            v-if="current && current.type === 'video'"
            :key="`${current.image}-${index}-video`"
            :src="current.image"
            :poster="current.thumbnail"
            autoplay
            muted
            loop
            playsinline
            controls
            class="max-h-[78dvh] max-w-[92vw] rounded-3xl object-contain shadow-2xl"
          />
          <img
            v-else-if="current"
            :key="`${current.image}-${index}`"
            :src="current.image"
            :alt="`${current.title} ${current.subtitle ?? ''}`"
            class="max-h-[78dvh] max-w-[92vw] rounded-3xl object-contain shadow-2xl"
          >
        </Transition>

        <!-- Prev / next click zones -->
        <button
          type="button"
          class="absolute inset-y-0 start-0 z-20 w-1/3 cursor-w-resize"
          :aria-label="t('story.prev')"
          @click="prev"
        />
        <button
          type="button"
          class="absolute inset-y-0 end-0 z-20 w-1/3 cursor-e-resize"
          :aria-label="t('story.next')"
          @click="next"
        />

        <!-- Prev / next arrows -->
        <button
          type="button"
          class="absolute start-4 top-1/2 z-30 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 lg:flex"
          :aria-label="t('story.prev')"
          @click="prev"
        >
          <IconChevronRight class="size-5" />
        </button>
        <button
          type="button"
          class="absolute end-4 top-1/2 z-30 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 lg:flex"
          :aria-label="t('story.next')"
          @click="next"
        >
          <IconChevronLeft class="size-5" />
        </button>

        <!-- Bottom info + CTA -->
        <div class="absolute inset-x-4 bottom-6 z-30 flex flex-col items-center gap-3 text-center" dir="rtl">
          <p class="text-xs text-white/60">
            {{ t('story.progress', { current: index + 1, total: items.length }) }}
          </p>
          <NuxtLink
            v-if="current?.href && current.href !== '#'"
            :to="current.href"
            class="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            @click="close"
          >
            {{ current.badge || t('story.viewerTitle') }}
          </NuxtLink>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
