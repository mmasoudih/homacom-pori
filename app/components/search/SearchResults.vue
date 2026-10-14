<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import type { SearchProduct } from '~/data/search'
import type { SearchResultsStatus } from '~/composables/useSearchResults'
import { DESKTOP_MEDIA_QUERY } from '~/utils/breakpoints'

const props = defineProps<{
  query: string
  status: SearchResultsStatus
  products: SearchProduct[]
}>()

// Desktop expands every filter section; mobile keeps them collapsed so the
// card stays compact until the shopper opens a section.
const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)

const source = computed(() => props.products)

const {
  onlyAvailable,
  categories,
  brands,
  color,
  fingerprint,
  sort,
  priceRange,
  priceCeiling,
  filtered,
  activeChips,
  removeChip,
} = useSearchFilters(source)

const loading = computed(() => props.status === 'loading')
</script>

<template>
  <div class="mx-auto flex w-full max-w-[1350px] flex-col gap-6">
    <h1 class="text-[18px] font-bold text-T-900 lg:text-[22px]">
      <template v-if="query">جستجو برای «{{ query }}»</template>
      <template v-else>همه محصولات</template>
    </h1>

    <SearchResultsSkeleton v-if="loading" />

    <div v-else class="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
      <SearchFilterCard
        v-model:only-available="onlyAvailable"
        v-model:categories="categories"
        v-model:brands="brands"
        v-model:color="color"
        v-model:fingerprint="fingerprint"
        v-model:price-range="priceRange"
        :chips="activeChips"
        :price-min="0"
        :price-max="priceCeiling"
        :default-open="isDesktop"
        @remove-chip="removeChip"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-5">
        <SearchSortBar v-model:sort="sort" :count="filtered.length" />
        <SearchResultsGrid :products="filtered" :query="query || 'محصولات'" />
      </div>
    </div>
  </div>
</template>
