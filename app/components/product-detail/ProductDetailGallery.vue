<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  IconHeart,
  IconHeartFilled,
  IconArrowsLeftRight,
  IconShare,
  IconVideo,
  IconRotate360,
  IconCircleCheckFilled,
  IconZoomIn,
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
    /** Backend product id for the favourite toggle. */
    productId?: number | null
    /** API-provided favourite state. */
    isFavorite?: boolean
  }>(),
  { alt: '', class: '', compareId: '', productId: null, isFavorite: false },
)

const { t } = useI18n()

const active = ref(0)
const current = computed(() => props.images[active.value])
const lightboxOpen = ref(false)
const favorited = ref(props.isFavorite)
watch(() => props.isFavorite, value => { favorited.value = value })
const favoritesApi = useFavorites()
const hoverZoom = ref(false)
const zoomOrigin = ref('50% 50%')

const { has: inCompare, add: addCompare } = useCompare()

const actionRail = [
  { key: 'favorite', icon: IconHeart, label: t('product.addToFavorites') },
  { key: 'compare', icon: IconArrowsLeftRight, label: t('product.compare') },
  { key: 'share', icon: IconShare, label: t('product.share') },
]

function onAction(key: string) {
  if (key === 'share') {
    shareProduct()
    return
  }

  if (key === 'favorite') {
    if (!props.productId) {
      favorited.value = !favorited.value
      if (favorited.value) toast.success(t('product.favoriteSuccess'))
      return
    }

    favoritesApi.toggle(props.productId)
      .then((added) => {
        favorited.value = added
        if (added) toast.success(t('product.favoriteSuccess'))
      })
      .catch(() => toast.error(t('product.favoriteFailed')))
    return
  }

  if (key === 'compare' && props.compareId) {
    addCompare(props.compareId)
    navigateTo('/compare')
  }
}

async function shareProduct() {
  const url = import.meta.client ? window.location.href : ''
  const payload = { title: props.alt, url }

  try {
    if (import.meta.client && navigator.share) {
      await navigator.share(payload)
      return
    }
    await navigator.clipboard.writeText(url)
    toast.success(t('product.shareSuccess'))
  }
  catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') return
    toast.error(t('product.shareFailed'))
  }
}

function isActionActive(key: string) {
  if (key === 'favorite') return favorited.value
  return key === 'compare' && !!props.compareId && inCompare(props.compareId)
}

function onMouseMove(event: MouseEvent) {
  if (current.value?.type !== 'image') return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  zoomOrigin.value = `${x}% ${y}%`
  hoverZoom.value = true
}

function openLightbox() {
  lightboxOpen.value = true
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
          :key="action.key"
          type="button"
          class="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-T-300 hover:text-T-900"
          :class="isActionActive(action.key) ? 'text-primary' : 'text-T-900'"
          :aria-label="action.label"
          :aria-pressed="action.key === 'favorite' ? favorited : undefined"
          @click="onAction(action.key)"
        >
          <IconHeartFilled v-if="action.key === 'favorite' && favorited" class="size-4.5 text-primary" />
          <component :is="action.icon" v-else class="size-4.5" />
        </button>
      </div>

      <div
        class="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-T-300 bg-T-50"
        @mousemove="onMouseMove"
        @mouseleave="hoverZoom = false"
      >
        <button
          v-if="current?.type === 'image'"
          type="button"
          class="flex size-full items-center justify-center"
          :aria-label="t('product.lightbox')"
          @click="openLightbox"
        >
          <img
            :src="current.src"
            :alt="alt"
            class="max-h-[70%] max-w-[70%] object-contain transition-transform duration-200 ease-out"
            :style="{
              transform: hoverZoom ? 'scale(1.9)' : 'scale(1)',
              transformOrigin: zoomOrigin,
            }"
          >
        </button>

        <video
          v-else-if="current?.type === 'video'"
          :src="current.src"
          :poster="current.poster"
          controls
          autoplay
          muted
          loop
          playsinline
          class="max-h-[86%] max-w-[86%] rounded-xl"
        />

        <ProductDetailProduct360
          v-else-if="current?.type === 'view360'"
          :src="current.src"
          :alt="alt"
          class="max-h-[86%] max-w-[86%]"
        />

        <!-- Zoom affordance -->
        <button
          v-if="current?.type === 'image'"
          type="button"
          class="absolute bottom-3 end-3 z-10 flex items-center gap-1 rounded-full bg-T-900/70 px-3 py-1.5 text-[11px] text-white transition-colors hover:bg-T-900/85"
          :aria-label="t('product.zoomIn')"
          @click="openLightbox"
        >
          <IconZoomIn class="size-3.5" />
          {{ t('product.zoomIn') }}
        </button>

        <!-- Video / 360 badge on the main stage -->
        <div
          v-if="current && current.type !== 'image'"
          class="pointer-events-none absolute start-3 bottom-3 flex items-center gap-1 rounded-full bg-T-900/70 px-3 py-1.5 text-[11px] text-white"
        >
          <component :is="current.type === 'video' ? IconVideo : IconRotate360" class="size-3.5" />
          {{ current.type === 'video' ? t('product.videoAlt') : t('product.view360') }}
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
        :aria-label="item.type === 'video' ? t('product.videoAlt') : item.type === 'view360' ? t('product.view360') : t('product.imageAlt', { index: i + 1 })"
        :aria-pressed="active === i"
        @click="active = i"
      >
        <img
          v-if="item.poster || item.src"
          :src="item.poster || item.src"
          alt=""
          class="max-h-[80%] max-w-[80%] object-contain"
        >
        <component
          :is="item.type === 'video' ? IconVideo : IconRotate360"
          v-else
          class="size-5 text-T-600"
        />
        <span
          v-if="item.type !== 'image'"
          class="absolute inset-0 flex items-center justify-center bg-T-900/20 text-white"
        >
          <component :is="item.type === 'video' ? IconVideo : IconRotate360" class="size-5" />
        </span>
      </button>
    </div>

    <!-- Registered / activation assurance strip -->
    <div class="mt-4 flex items-center justify-center gap-2.5 rounded-xl bg-[#EAECFF] px-4 py-3.5">
      <IconCircleCheckFilled class="size-5 shrink-0 text-[#3D7BFA]" />
      <span class="text-[12.5px] font-medium text-T-900">{{ t('product.registered') }}</span>
    </div>

    <ProductDetailLightbox
      v-model:open="lightboxOpen"
      :images="images"
      :start-index="active"
      :alt="alt"
    />
  </div>
</template>
