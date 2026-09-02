<script setup lang="ts">
import { IconFilePencil } from '@tabler/icons-vue'
import { guaranteeChips, guaranteePage } from '~/data/pages/guarantee'

useHead({
  title: 'راهنمای گارانتی | هماکام',
})

const activeTab = ref(0)
const activeChip = ref(0)
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center pb-16">
      <PagesPageHeader
        class="pt-10 lg:pt-16"
        :title="guaranteePage.title"
        subtitle=""
        :breadcrumb="['همکام', 'راهنمای کاربران']"
      >
        <template #icon>
          <div class="flex size-[64px] items-center justify-center rounded-[16px] bg-[#F8EFE8]">
            <IconFilePencil class="size-9 text-primary" />
          </div>
        </template>
      </PagesPageHeader>

      <!-- Tabs -->
      <PagesPillTabs
        :tabs="guaranteePage.tabs"
        :active="activeTab"
        class="mt-8 px-4 lg:mt-10"
        @select="(i: number) => (activeTab = i)"
      />

      <!-- Sections -->
      <div class="mt-10 w-full max-w-[1260px] px-4 lg:mt-14">
        <!-- First section: warranty guide + product chips -->
        <section class="flex flex-col items-center text-center lg:items-start lg:text-start">
          <h2 class="text-[20px] font-bold leading-[30px] text-foreground">
            {{ guaranteePage.sections[0].heading }}
          </h2>
          <p class="mt-3 max-w-[1000px] text-[14.5px] leading-[28px] text-T-700">
            {{ guaranteePage.sections[0].body }}
          </p>
        </section>

        <PagesChipRow
        :active="activeChip"
        :items="guaranteeChips"
        desktop-grid
          class="mt-8"
          @select="(i: number) => (activeChip = i)"
        />

        <!-- Remaining sections -->
        <template v-for="(section, si) in guaranteePage.sections.slice(1)" :key="si">
          <section class="mt-12 flex flex-col items-center text-center lg:items-start lg:text-start">
            <h2 class="text-[20px] font-bold leading-[30px] text-foreground">
              {{ section.heading }}
            </h2>
            <p class="mt-3 max-w-[1000px] text-[14.5px] leading-[28px] text-T-700">
              {{ section.body }}
            </p>
          </section>
        </template>
      </div>
    </main>

    <PagesAboutBand class="mt-auto" />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
