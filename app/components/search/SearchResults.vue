<script setup lang="ts">
import type { SearchCategoryTile, SearchProduct } from '~/data/search'
import type { SearchResultsStatus } from '~/composables/useSearchResults'
import { searchMobileSortLabels } from '~/utils/search'

const props = defineProps<{
  query: string
  status: SearchResultsStatus
  products: SearchProduct[]
  /** Category tiles for the mobile «بر اساس دسته‌بندی» row. */
  categories: SearchCategoryTile[]
}>()

const source = computed(() => props.products)

// The `دسته‌بندی‌ها` facet is the brand-based category filter — distinct from
// the `categories` prop above (the mobile category tiles).
const {
  onlyAvailable,
  categories: categoryFilters,
  brands: brandFilters,
  color,
  fingerprint,
  storage,
  sort,
  priceRange,
  priceCeiling,
  filtered,
  activeChips,
  removeChip,
  reset,
} = useSearchFilters(source)

const loading = computed(() => props.status === 'loading')

// Mobile-only overlays (sort sheet + filter sheet).
const sortOpen = ref(false)
const filterOpen = ref(false)

const sortLabel = computed(() => searchMobileSortLabels[sort.value])

const breadcrumb = computed(() =>
  props.query ? ['هماکام', 'محصولات', props.query] : ['هماکام', 'محصولات'],
)

function selectCategory(tile: SearchCategoryTile) {
  navigateTo({ path: '/search', query: { q: tile.title } })
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-[1350px] flex-col gap-5 lg:gap-6">
    <!-- ============================ Mobile header ============================ -->
    <UiBreadcrumb class="lg:hidden" :trail="breadcrumb" />

    <!-- Single page heading: the mobile design shows just the term, desktop
         keeps the full «جستجو برای …» wording. -->
    <h1 class="text-[18px] font-bold text-T-900 lg:text-[22px]">
      <span class="lg:hidden">{{ query || 'همه محصولات' }}</span>
      <span class="hidden lg:inline">
        <template v-if="query">جستجو برای «{{ query }}»</template>
        <template v-else>همه محصولات</template>
      </span>
    </h1>

    <div class="flex flex-col gap-5 lg:hidden">
      <section v-if="categories.length" class="flex flex-col gap-4">
        <UiTypography as="h2" size="lg" weight="bold" color="default">
          <template v-if="query">محصولات {{ query }} بر اساس دسته‌بندی:</template>
          <template v-else>محصولات بر اساس دسته‌بندی:</template>
        </UiTypography>

        <SearchMobileCategoryRow :categories="categories" @select="selectCategory" />
      </section>

      <SearchMobileToolbar
        :sort-label="sortLabel"
        :active-count="activeChips.length"
        @sort="sortOpen = true"
        @filter="filterOpen = true"
      />
    </div>

    <SearchResultsSkeleton v-if="loading" />

    <div v-else class="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
      <!-- Facet card — desktop only; mobile uses the filter sheet. -->
      <SearchFilterCard
        v-model:only-available="onlyAvailable"
        v-model:categories="categoryFilters"
        v-model:brands="brandFilters"
        v-model:color="color"
        v-model:fingerprint="fingerprint"
        v-model:price-range="priceRange"
        :chips="activeChips"
        :price-min="0"
        :price-max="priceCeiling"
        default-open
        class="hidden lg:block"
        @remove-chip="removeChip"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-5">
        <div class="hidden lg:block">
          <SearchSortBar v-model:sort="sort" :count="filtered.length" />
        </div>

        <SearchResultsGrid :products="filtered" :query="query || 'محصولات'" />
      </div>
    </div>

    <!-- ============================== Overlays ============================== -->
    <SearchMobileSortSheet
      v-model="sort"
      :open="sortOpen"
      @close="sortOpen = false"
    />

    <SearchMobileFilterSheet
      v-model:only-available="onlyAvailable"
      v-model:categories="categoryFilters"
      v-model:brands="brandFilters"
      v-model:color="color"
      v-model:fingerprint="fingerprint"
      v-model:storage="storage"
      v-model:price-range="priceRange"
      :open="filterOpen"
      :chips="activeChips"
      :price-min="0"
      :price-max="priceCeiling"
      @close="filterOpen = false"
      @remove-chip="removeChip"
      @clear-all="reset"
    />
  </div>
</template>
