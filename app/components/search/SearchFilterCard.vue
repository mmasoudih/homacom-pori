<script setup lang="ts">
import type { SearchFilterChip } from '~/composables/useSearchFilters'
import type { SearchFingerprintValue } from '~/data/search'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  chips: SearchFilterChip[]
  priceMin: number
  priceMax: number
  /** Expand every section on first paint (desktop) or keep them closed (mobile). */
  defaultOpen?: boolean
  class?: string
}>(), {
  defaultOpen: false,
  class: '',
})

const emit = defineEmits<{
  removeChip: [key: string]
}>()

const onlyAvailable = defineModel<boolean>('onlyAvailable', { default: false })
const categories = defineModel<string[]>('categories', { default: () => [] })
const brands = defineModel<string[]>('brands', { default: () => [] })
const color = defineModel<string | null>('color', { default: null })
const fingerprint = defineModel<SearchFingerprintValue | null>('fingerprint', { default: null })
const priceRange = defineModel<number[]>('priceRange', { default: () => [0, 0] })
</script>

<template>
  <aside
    :class="cn(
      'w-full rounded-[20px] border border-T-400 bg-T-50 lg:w-[245px] lg:shrink-0',
      props.class,
    )"
  >
    <div class="px-[calc(1.25rem_-_1px)] pt-5">
      <UiTypography as="h2" size="xl" weight="bold" color="default">
        فیلترها
      </UiTypography>

      <SearchFilterChips
        v-if="chips.length"
        :chips="chips"
        class="mt-4"
        @remove="emit('removeChip', $event)"
      />
    </div>

    <SearchFiltersPanel
      v-model:only-available="onlyAvailable"
      v-model:categories="categories"
      v-model:brands="brands"
      v-model:color="color"
      v-model:fingerprint="fingerprint"
      v-model:price-range="priceRange"
      :price-min="priceMin"
      :price-max="priceMax"
      :default-open="defaultOpen"
      class="mt-1"
    />
  </aside>
</template>
