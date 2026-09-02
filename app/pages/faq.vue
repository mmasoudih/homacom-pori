<script setup lang="ts">
import { IconClock, IconSearch } from '@tabler/icons-vue'
import { faqPage } from '~/data/pages/faq'

useHead({
  title: 'سوالات متداول | هماکام',
})

const activeCategory = ref(0)
const searchQuery = ref('')

const filteredItems = computed(() => {
  const q = searchQuery.value.trim()
  if (!q)
    return faqPage.items
  return faqPage.items.filter(item => item.question.includes(q) || item.answer.includes(q))
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center pb-16">
      <PagesPageHeader
        class="pt-10 lg:pt-16"
        :title="faqPage.title"
        :subtitle="faqPage.subtitle"
        :breadcrumb="['کاتالوگ', 'سوالات متداول']"
      >
        <template #icon>
          <div class="flex size-[64px] items-center justify-center rounded-[14px] bg-primary">
            <div class="relative flex flex-col items-center">
              <span class="text-[18px] font-black leading-[24px] text-white">FAQ</span>
              <span class="mt-1 h-1 w-7 rounded-full bg-white/75" />
              <IconClock class="absolute -bottom-5 size-3.5 text-white/80" />
            </div>
          </div>
        </template>
      </PagesPageHeader>

      <!-- Search -->
      <div class="mt-8 flex h-12 w-full max-w-[560px] items-center gap-3 rounded-full border border-T-400 bg-T-50 px-5 focus-within:ring-2 focus-within:ring-primary/30 lg:mt-10">
        <IconSearch class="size-5 shrink-0 text-T-600" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="faqPage.searchPlaceholder"
          class="w-full bg-transparent text-[15px] text-foreground placeholder:text-T-600 focus:outline-none"
        >
      </div>

      <!-- Category chips -->
      <PagesChipRow
        :active="activeCategory"
        :items="faqPage.categories"
        class="mt-8 w-full max-w-[1260px] px-4 lg:mt-10"
        @select="(i: number) => (activeCategory = i)"
      />

      <!-- FAQ accordion -->
      <div class="mt-10 w-full max-w-[1260px] px-4 lg:mt-14">
        <PagesFaqAccordion :items="filteredItems" :default-open="2" />
      </div>
    </main>

    <PagesAboutBand class="mt-auto" />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
