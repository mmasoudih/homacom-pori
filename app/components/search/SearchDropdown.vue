<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useEventListener, useMediaQuery } from '@vueuse/core'
import type { SearchStatus } from '~/composables/useProductSearch'
import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import { DESKTOP_MEDIA_QUERY } from '~/utils/breakpoints'

const props = defineProps<{
  open: boolean
  /** Element the panel is anchored under (the header search box). */
  anchor: HTMLElement | null
  query: string
  status: SearchStatus
  results: SearchProduct[]
  categories: SearchCategoryTile[]
  recent: string[]
}>()

const emit = defineEmits<{
  close: []
  select: [term: string]
  removeRecent: [term: string]
  clearRecent: []
  selectCategory: [tile: SearchCategoryTile]
  viewAll: []
}>()

const PANEL_WIDTH = 547

/**
 * The dropdown is the *desktop* half of the search UI. On mobile the overlay
 * takes over, but this component is still mounted — so every listener below
 * must be gated on `isOpen`, otherwise its outside-click handler would close
 * the mobile overlay as soon as the user taps inside it.
 */
const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)
const isOpen = computed(() => props.open && isDesktop.value)

/** Panel element, used for outside-click detection. */
const panelEl = ref<HTMLElement | null>(null)

// Sensible fallback so the very first paint is already off-screen-right rather
// than at the document flow position (measured synchronously on open below).
const panelStyle = ref<CSSProperties>({
  top: '142px',
  right: '16px',
  width: `${PANEL_WIDTH}px`,
})

function syncPosition() {
  if (!import.meta.client) return
  const el = props.anchor
  if (!el) return

  const rect = el.getBoundingClientRect()
  // `clientWidth` (not `innerWidth`) — the former excludes the document
  // scrollbar, so the panel's edge lines up exactly with the search box.
  const viewport = document.documentElement.clientWidth
  panelStyle.value = {
    top: `${Math.round(rect.bottom + 8)}px`,
    right: `${Math.max(16, Math.round(viewport - rect.right))}px`,
    width: `${Math.min(PANEL_WIDTH, viewport - 32)}px`,
  }
}

// Measure *before* the panel mounts (the anchor is already laid out), otherwise
// it renders one frame at the fallback offset and visibly jumps into place.
watch(isOpen, (open) => {
  if (open) syncPosition()
})

// Keep the panel glued to the search box while the header collapses/shrinks.
useEventListener(window, 'resize', () => isOpen.value && syncPosition())
useEventListener(window, 'scroll', () => isOpen.value && syncPosition(), { capture: true })

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  if (isOpen.value && event.key === 'Escape') emit('close')
})

// Close on any pointer press outside the panel and outside the search box —
// this also covers the header/top-bar area the scrim doesn't reach.
useEventListener(
  document,
  'pointerdown',
  (event: PointerEvent) => {
    if (!isOpen.value) return
    const target = event.target as Node | null
    if (!target) return
    if (panelEl.value?.contains(target)) return
    if (props.anchor?.contains(target)) return
    emit('close')
  },
  { capture: true },
)

const scrimStyle = computed<CSSProperties>(() => ({
  // Start the scrim below the sticky header (its height is exposed as a CSS
  // variable) so the whole header stays visible and undimmed while the search
  // dropdown is open.
  top: 'var(--site-header-offset, 142px)',
}))
</script>

<template>
  <Teleport to="body">
    <!--
      Sibling transitions (not one wrapper) so each element animates itself:
      an ancestor with `opacity < 1` isolates the backdrop root and makes the
      scrim's backdrop-filter pop instead of fading.
    -->
    <Transition name="search-scrim">
      <div
        v-if="isOpen"
        class="fixed inset-x-0 bottom-0 z-[65] hidden bg-black/10 backdrop-blur-[10px] lg:block"
        :style="scrimStyle"
        aria-hidden="true"
        @click="emit('close')"
      />
    </Transition>

    <Transition name="search-panel">
      <div
        v-if="isOpen"
        ref="panelEl"
        class="scrollbar-thin fixed z-[66] hidden max-h-[min(560px,calc(100vh-160px))] overflow-y-auto overscroll-contain rounded-[20px] border border-T-400 bg-T-50 p-6 shadow-[0_18px_44px_-10px_rgba(0,0,0,0.22),0_6px_16px_-6px_rgba(0,0,0,0.12)] lg:block"
        :style="panelStyle"
        role="dialog"
        aria-label="نتایج جستجو"
        dir="ltr"
      >
        <!-- `dir="ltr"` keeps the scrollbar on the right; inner content stays RTL. -->
        <div dir="rtl">
          <SearchPanel
            :query="query"
            :status="status"
            :results="results"
            :categories="categories"
            :recent="recent"
            @select="emit('select', $event)"
            @remove-recent="emit('removeRecent', $event)"
            @clear-recent="emit('clearRecent')"
            @select-category="emit('selectCategory', $event)"
            @view-all="emit('viewAll')"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Scrim: fades and ramps the blur + tint in together. */
.search-scrim-enter-active,
.search-scrim-leave-active {
  transition:
    opacity 240ms ease,
    background-color 240ms ease,
    backdrop-filter 240ms ease;
}
.search-scrim-enter-from,
.search-scrim-leave-to {
  opacity: 0;
  background-color: rgb(0 0 0 / 0%);
  backdrop-filter: blur(0px);
}

/* Panel: quick fade with a small drop-in from under the search box. */
.search-panel-enter-active,
.search-panel-leave-active {
  transition:
    opacity 180ms ease,
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.search-panel-enter-from,
.search-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}
</style>
