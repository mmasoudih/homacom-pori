<script setup lang="ts">
const route = useRoute()

const query = computed(() => String(route.query.q ?? '').trim())

/**
 * Category ids selected from the mega menu (the node plus its descendants),
 * reaching `/search` as `?categories=103,104,105`.
 */
const categoryIds = computed<number[]>(() =>
  String(route.query.categories ?? '')
    .split(',')
    .map(value => Number(value.trim()))
    .filter(value => Number.isInteger(value) && value > 0),
)

/** Heading/label for a category listing; falls back to the text query. */
const label = computed(() => String(route.query.name ?? '').trim() || query.value)

const { status, results, categories } = useSearchResults(query, categoryIds)

useHead(() => ({
  title: label.value ? `محصولات «${label.value}» | هماکام` : 'همه محصولات | هماکام',
}))
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 pb-28 lg:px-6 lg:py-10 lg:pb-14">
      <SearchResults :query="label" :category-listing="categoryIds.length > 0" :status="status" :products="results" :categories="categories" />
    </main>

    <LandingSiteFooter />
    <LandingMobileBottomNav />
  </div>
</template>
