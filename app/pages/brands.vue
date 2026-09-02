<script setup lang="ts">
import { IconChevronLeft, IconChevronRight, IconSearch } from '@tabler/icons-vue'
import { brandsPage } from '~/data/pages/brands'

useHead({
  title: 'برندها | هماکام',
})

const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = 120

const visibleBrands = computed(() => {
  const q = searchQuery.value.trim()
  if (!q)
    return brandsPage.items
  return brandsPage.items.filter(item => item.name.includes(q))
})

const paginationItems = computed(() => {
  const items: Array<number | 'ellipsis'> = []
  items.push(1, 2, 3, 4, 'ellipsis', totalPages)
  return items
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center pb-16">
      <PagesPageHeader
        class="pt-10 lg:pt-16"
        :title="brandsPage.title"
        :subtitle="brandsPage.subtitle"
        :breadcrumb="['همکام', 'برندها']"
      >
        <template #icon>
          <img
            src="/assets/medal-color.svg"
            alt="مدال طلایی برندها"
            class="size-[88px] object-contain"
          >
        </template>
      </PagesPageHeader>

      <!-- Search -->
      <div class="mt-8 flex h-12 w-full max-w-[660px] items-center gap-3 rounded-full border border-T-400 bg-T-50 px-5 focus-within:ring-2 focus-within:ring-primary/30">
        <IconSearch class="size-5 shrink-0 text-T-600" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="brandsPage.searchPlaceholder"
          class="w-full bg-transparent text-[15px] text-foreground placeholder:text-T-600 focus:outline-none"
        >
      </div>

      <!-- Brand grid -->
      <div class="mt-10 grid w-full max-w-[1260px] grid-cols-3 gap-3 px-4 sm:grid-cols-4 md:grid-cols-5 lg:mt-12 lg:grid-cols-8 lg:gap-4 lg:px-0">
        <div
          v-for="(brand, i) in visibleBrands"
          :key="`${brand.name}-${i}`"
          class="flex aspect-[1.65] flex-col items-center justify-center gap-2 rounded-[12px] border border-T-400 bg-T-50 px-3 transition-shadow hover:shadow-md"
        >
          <img
            :src="brand.logo"
            :alt="brand.name"
            class="h-[34px] max-w-[75%] object-contain lg:h-[42px]"
          >
          <span class="text-[13px] font-medium leading-[18px] text-T-700">
            {{ brand.name }}
          </span>
        </div>
      </div>

      <!-- Pagination -->
      <nav class="mt-10 flex items-center gap-2 lg:mt-12" aria-label="صفحه‌بندی برندها">
        <button
          class="flex size-9 items-center justify-center rounded-full border border-T-400 bg-T-50 text-T-700 transition-colors hover:text-primary disabled:opacity-40"
          :disabled="currentPage === 1"
          aria-label="صفحه قبل"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          <IconChevronRight class="size-4" />
        </button>

        <template v-for="(item, i) in paginationItems" :key="i">
          <button
            v-if="item === 'ellipsis'"
            class="flex h-9 items-center px-1 text-T-600"
            disabled
          >
            …
          </button>
          <button
            v-else
            class="flex size-9 items-center justify-center rounded-full text-[13px] font-medium transition-colors"
            :class="item === currentPage
              ? 'border border-T-400 bg-T-50 text-foreground'
              : 'border border-T-400 bg-T-50 text-T-600 hover:text-primary'"
            @click="currentPage = item"
          >
            {{ item }}
          </button>
        </template>

        <button
          class="flex size-9 items-center justify-center rounded-full border border-T-400 bg-T-50 text-T-700 transition-colors hover:text-primary disabled:opacity-40"
          :disabled="currentPage === totalPages"
          aria-label="صفحه بعد"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          <IconChevronLeft class="size-4" />
        </button>
      </nav>
    </main>

    <PagesAboutBand class="mt-auto" />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
