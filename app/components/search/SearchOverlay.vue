<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue'
import { useEventListener, useMediaQuery } from '@vueuse/core'
import type { SearchStatus } from '~/composables/useProductSearch'
import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import { DESKTOP_MEDIA_QUERY } from '~/utils/breakpoints'

const props = defineProps<{
  open: boolean
  query: string
  status: SearchStatus
  results: SearchProduct[]
  categories: SearchCategoryTile[]
  recent: string[]
}>()

const emit = defineEmits<{
  close: []
  'update:query': [value: string]
  submit: [term: string]
  select: [term: string]
  removeRecent: [term: string]
  clearRecent: []
  selectCategory: [tile: SearchCategoryTile]
  viewAll: []
}>()

const inputRef = ref<{ focus: () => void } | null>(null)
const overlayEl = ref<HTMLElement | null>(null)

// Mobile half of the search UI: only ever mounted below the desktop tier.
const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)
const isOpen = computed(() => props.open && !isDesktop.value)

watch(
  () => isOpen.value,
  async (open) => {
    if (!open) return
    await nextTick()
    inputRef.value?.focus()
  },
)

// The overlay covers the viewport, so the only "outside" surface is the
// floating mobile bottom nav — pressing it must close the search too.
useEventListener(
  document,
  'pointerdown',
  (event: PointerEvent) => {
    if (!isOpen.value) return
    const target = event.target as Node | null
    if (!target) return
    if (overlayEl.value?.contains(target)) return
    emit('close')
  },
  { capture: true },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="search-overlay">
      <div
        v-if="isOpen"
        ref="overlayEl"
        class="fixed inset-0 z-[66] flex flex-col bg-T-50 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="جستجو در محصولات"
      >
        <div class="flex items-center gap-3 px-4 pb-3 pt-4">
          <button
            type="button"
            class="flex size-9 shrink-0 items-center justify-center rounded-full text-T-900 transition-colors hover:bg-T-200"
            aria-label="بازگشت"
            @click="emit('close')"
          >
            <IconArrowRight class="size-5" />
          </button>

          <SearchInput
            ref="inputRef"
            :model-value="query"
            :icon="false"
            class="flex-1"
            @update:model-value="emit('update:query', $event)"
            @submit="emit('submit', $event)"
            @escape="emit('close')"
          />
        </div>

        <!-- pb leaves room for the floating bottom navigation. -->
        <div class="scrollbar-thin flex-1 overflow-y-auto overscroll-contain px-4 pb-28 pt-2">
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
.search-overlay-enter-active,
.search-overlay-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.search-overlay-enter-from,
.search-overlay-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
