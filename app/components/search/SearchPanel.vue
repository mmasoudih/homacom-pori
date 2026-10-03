<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import type { SearchStatus } from '~/composables/useProductSearch'
import type { SearchCategoryTile, SearchProduct } from '~/data/search'

defineProps<{
  query: string
  status: SearchStatus
  results: SearchProduct[]
  categories: SearchCategoryTile[]
  recent: string[]
}>()

const emit = defineEmits<{
  select: [term: string]
  removeRecent: [term: string]
  clearRecent: []
  selectCategory: [tile: SearchCategoryTile]
  viewAll: []
}>()
</script>

<template>
  <!-- Shared by the desktop dropdown and the mobile overlay. -->
  <SearchSuggestions
    v-if="status === 'idle'"
    :recent="recent"
    @select="emit('select', $event)"
    @remove="emit('removeRecent', $event)"
    @clear="emit('clearRecent')"
  />

  <SearchSkeleton v-else-if="status === 'loading'" />

  <div v-else class="flex flex-col gap-5">
    <!-- Header + separator stay visible in both the results and empty states. -->
    <div class="flex items-center justify-between gap-4 border-b border-T-300 pb-4">
      <UiTypography as="h3" size="lg" weight="medium" color="default">
        جستجو برای «{{ query }}»
      </UiTypography>
      <button
        type="button"
        class="flex shrink-0 items-center gap-1 text-primary transition-colors hover:text-primary/80"
        @click="emit('viewAll')"
      >
        <UiTypography as="span" size="md" weight="medium" color="primary">
          مشاهده همه نتایج
        </UiTypography>
        <IconChevronLeft class="size-4" />
      </button>
    </div>

    <!-- No results -->
    <SearchEmpty v-if="!results.length" :query="query" />

    <template v-else>
      <section v-if="categories.length" class="flex flex-col gap-4">
        <UiTypography as="h4" size="lg" weight="medium" color="subtle">
          در دسته‌بندی‌های <span class="text-T-900">«{{ query }}»</span>
        </UiTypography>
        <SearchCategoryRow :categories="categories" @select="emit('selectCategory', $event)" />
      </section>

      <div class="h-px w-full bg-T-200" />

      <section class="flex flex-col gap-4">
        <UiTypography as="h4" size="lg" weight="medium" color="subtle">
          همه محصولات <span class="text-T-900">«{{ query }}»</span>
        </UiTypography>
        <SearchProductList :products="results" />
      </section>
    </template>
  </div>
</template>
