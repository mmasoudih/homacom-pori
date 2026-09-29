<script setup lang="ts">
import { toPersianDigits } from '~/utils/format'

const route = useRoute()

const query = computed(() => String(route.query.q ?? '').trim())

const { status, results, run } = useProductSearch()

watch(query, (value) => {
  run(value)
}, { immediate: true })

useHead(() => ({
  title: query.value ? `جستجو برای «${query.value}» | هماکام` : 'جستجو | هماکام',
}))
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 pb-28 lg:px-6 lg:py-10 lg:pb-14">
      <header class="flex flex-col gap-1">
        <h1 class="text-[18px] font-bold text-T-900 lg:text-[22px]">
          جستجو برای «{{ query }}»
        </h1>
        <p v-if="query && status === 'ready' && results.length" class="text-[13px] text-T-600">
          {{ toPersianDigits(results.length) }} کالا پیدا شد
        </p>
      </header>

      <div class="mt-6">
        <SearchSkeleton v-if="status === 'loading'" />

        <SearchEmpty v-else-if="status === 'ready' && !results.length" :query="query" />

        <div v-else-if="!query" class="py-16 text-center text-[14px] text-T-600">
          برای شروع، عبارتی را در کادر جستجو وارد کنید.
        </div>

        <SearchProductList v-else :products="results" layout="grid" />
      </div>
    </main>

    <LandingSiteFooter />
    <LandingMobileBottomNav />
  </div>
</template>
