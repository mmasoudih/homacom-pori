<script setup lang="ts">
const route = useRoute()

const query = computed(() => String(route.query.q ?? '').trim())

const { status, results, categories, load } = useSearchResults()

watch(query, (value) => {
  load(value)
}, { immediate: true })

useHead(() => ({
  title: query.value ? `جستجو برای «${query.value}» | هماکام` : 'همه محصولات | هماکام',
}))
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 pb-28 lg:px-6 lg:py-10 lg:pb-14">
      <SearchResults :query="query" :status="status" :products="results" :categories="categories" />
    </main>

    <LandingSiteFooter />
    <LandingMobileBottomNav />
  </div>
</template>
