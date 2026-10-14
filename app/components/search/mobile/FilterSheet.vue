<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import { useEventListener } from '@vueuse/core'
import type { SearchFilterChip } from '~/composables/useSearchFilters'
import type { SearchFingerprintValue } from '~/data/search'

const props = defineProps<{
  open: boolean
  chips: SearchFilterChip[]
  priceMin: number
  priceMax: number
}>()

const emit = defineEmits<{
  close: []
  removeChip: [key: string]
  clearAll: []
}>()

const onlyAvailable = defineModel<boolean>('onlyAvailable', { default: false })
const categories = defineModel<string[]>('categories', { default: () => [] })
const brands = defineModel<string[]>('brands', { default: () => [] })
const color = defineModel<string | null>('color', { default: null })
const fingerprint = defineModel<SearchFingerprintValue | null>('fingerprint', { default: null })
const storage = defineModel<string[]>('storage', { default: () => [] })
const priceRange = defineModel<number[]>('priceRange', { default: () => [0, 0] })

// Lock background scrolling while the sheet is open.
watch(
  () => props.open,
  (open) => {
    if (!import.meta.client) return
    document.documentElement.style.overflow = open ? 'hidden' : ''
  },
)

onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (props.open && event.key === 'Escape') emit('close')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="open"
        class="sheet-panel fixed inset-0 z-[70] flex flex-col bg-T-50 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="فیلترها"
      >
        <!-- Header -->
        <header class="flex shrink-0 items-center justify-between border-b border-T-300 px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
          <span class="flex items-center gap-2">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="shrink-0"
              aria-hidden="true"
            >
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.35425 7.0415C1.35425 4.79785 3.17309 2.979 5.41675 2.979C7.6604 2.979 9.47925 4.79785 9.47925 7.0415C9.47925 9.28516 7.6604 11.104 5.41675 11.104C3.17309 11.104 1.35425 9.28516 1.35425 7.0415ZM5.41675 4.604C4.07055 4.604 2.97925 5.69531 2.97925 7.0415C2.97925 8.3877 4.07055 9.479 5.41675 9.479C6.76294 9.479 7.85425 8.3877 7.85425 7.0415C7.85425 5.69531 6.76294 4.604 5.41675 4.604Z" fill="#1D1D1F" />
              <path d="M14.0834 7.854C13.6347 7.854 13.2709 7.49024 13.2709 7.0415C13.2709 6.59277 13.6347 6.229 14.0834 6.229H23.8334C24.2821 6.229 24.6459 6.59277 24.6459 7.0415C24.6459 7.49024 24.2821 7.854 23.8334 7.854H14.0834Z" fill="#1D1D1F" />
              <path d="M11.9167 19.7707C12.3655 19.7707 12.7292 19.4069 12.7292 18.9582C12.7292 18.5094 12.3655 18.1457 11.9167 18.1457H2.16675C1.71802 18.1457 1.35425 18.5094 1.35425 18.9582C1.35425 19.4069 1.71802 19.7707 2.16675 19.7707H11.9167Z" fill="#1D1D1F" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5834 14.8957C18.3398 14.8957 16.5209 16.7145 16.5209 18.9582C16.5209 21.2018 18.3398 23.0207 20.5834 23.0207C22.8271 23.0207 24.6459 21.2018 24.6459 18.9582C24.6459 16.7145 22.8271 14.8957 20.5834 14.8957ZM18.1459 18.9582C18.1459 17.612 19.2372 16.5207 20.5834 16.5207C21.9296 16.5207 23.0209 17.612 23.0209 18.9582C23.0209 20.3044 21.9296 21.3957 20.5834 21.3957C19.2372 21.3957 18.1459 20.3044 18.1459 18.9582Z" fill="#1D1D1F" />
            </svg>
            <UiTypography as="h2" size="xl" weight="bold" color="default">
              فیلترها
            </UiTypography>
          </span>
          <button
            type="button"
            class="flex size-9 shrink-0 items-center justify-center rounded-full text-T-500 transition-colors hover:bg-T-200"
            aria-label="بستن"
            @click="emit('close')"
          >
            <IconX class="size-6" />
          </button>
        </header>

        <!-- Body -->
        <div class="scrollbar-none flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <section v-if="chips.length" class="flex flex-col gap-4 border-b border-T-300 py-5">
            <div class="flex items-center justify-between gap-4">
              <UiTypography as="h3" size="md" weight="medium" color="default">
                فیلترهای اعمال شده:
              </UiTypography>
              <button
                type="button"
                class="shrink-0 text-T-600 transition-colors hover:text-T-900"
                @click="emit('clearAll')"
              >
                <UiTypography as="span" size="md" weight="medium" color="inherit">
                  حذف همه
                </UiTypography>
              </button>
            </div>

            <SearchFilterChips :chips="chips" @remove="emit('removeChip', $event)" />
          </section>

          <SearchMobileFiltersPanel
            v-model:only-available="onlyAvailable"
            v-model:categories="categories"
            v-model:brands="brands"
            v-model:color="color"
            v-model:fingerprint="fingerprint"
            v-model:storage="storage"
            v-model:price-range="priceRange"
            :price-min="priceMin"
            :price-max="priceMax"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 200ms ease;
}
.sheet-enter-active.sheet-panel,
.sheet-leave-active.sheet-panel {
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from.sheet-panel,
.sheet-leave-to.sheet-panel {
  transform: translateY(100%);
}
</style>
