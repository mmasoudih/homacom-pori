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

  <SearchEmpty v-else-if="!results.length" :query="query" />

  <div v-else class="flex flex-col gap-5">
    <div class="flex items-center justify-between gap-4 border-b border-T-300 pb-4">
      <h3 class="text-[15px] font-bold text-T-900">
        جستجو برای «{{ query }}»
      </h3>
      <button
        type="button"
        class="flex shrink-0 items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
        @click="emit('viewAll')"
      >
        مشاهده همه نتایج
        <IconChevronLeft class="size-4" />
      </button>
    </div>

    <section v-if="categories.length" class="flex flex-col gap-4">
      <h4 class="text-[14px] font-bold text-T-900">
        در دسته‌بندی‌های «{{ query }}»
      </h4>
      <SearchCategoryRow :categories="categories" @select="emit('selectCategory', $event)" />
    </section>

    <div class="h-px w-full bg-T-200" />

    <section class="flex flex-col gap-4">
      <h4 class="text-[14px] font-bold text-T-900">
        همه محصولات «{{ query }}»
      </h4>
      <SearchProductList :products="results" />
    </section>
  </div>
</template>
