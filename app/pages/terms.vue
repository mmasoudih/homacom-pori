<script setup lang="ts">
import { IconClock, IconFileText } from '@tabler/icons-vue'
import { termsPage } from '~/data/pages/terms'

useHead({
  title: 'شرایط و مقررات | هماکام',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center pb-16">
      <PagesPageHeader
        class="pt-10 lg:pt-16"
        :title="termsPage.title"
        :subtitle="termsPage.subtitle"
        :breadcrumb="['کاتالوگ', 'شرایط و مقررات']"
      >
        <template #icon>
          <div class="flex size-[88px] items-center justify-center rounded-[20px] bg-[#C63A76]">
            <div class="relative flex flex-col items-center">
              <IconFileText class="size-9 text-white" />
              <IconClock class="absolute -bottom-7 size-4 text-white/80" />
            </div>
          </div>
        </template>
      </PagesPageHeader>

      <!-- Document sections -->
      <div class="mt-12 w-full max-w-[900px] px-4 lg:mt-16">
        <template v-for="(section, si) in termsPage.sections" :key="si">
          <section class="py-2">
            <h2 class="text-[20px] font-bold leading-[30px] text-foreground">
              {{ section.heading }}
            </h2>

            <p
              v-for="(para, pi) in section.paragraphs ?? []"
              :key="`p-${pi}`"
              class="mt-4 text-[14.5px] leading-[28px] text-T-700"
            >
              {{ para }}
            </p>

            <ul v-if="section.clauses?.length" class="mt-4 flex flex-col gap-3">
              <li
                v-for="(clause, ci) in section.clauses"
                :key="`c-${ci}`"
                class="flex items-start gap-3 text-[14.5px] leading-[28px] text-T-700"
              >
                <span class="mt-[1px] flex size-6 shrink-0 items-center justify-center rounded-full bg-T-100 text-[12.5px] font-semibold text-primary">
                  {{ ci + 1 }}
                </span>
                <span>{{ clause }}؛</span>
              </li>
            </ul>
          </section>

          <div v-if="si < termsPage.sections.length - 1" class="my-8 h-px w-full bg-T-400" />
        </template>
      </div>
    </main>

    <PagesAboutBand class="mt-auto" />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>