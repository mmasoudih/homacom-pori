<script setup lang="ts">
import { IconShoppingBag } from '@tabler/icons-vue'
import { aboutPage } from '~/data/pages/about'

useHead({
  title: 'درباره ما | هماکام',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-100">
    <LandingSiteHeader />

    <main class="flex w-full flex-col items-center px-4 pb-16 lg:px-0">
      <!-- Hero card -->
      <section class="mt-10 w-full max-w-[1100px] rounded-[16px] border border-T-400 bg-T-50 p-6 lg:mt-14 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 lg:p-10">
        <!-- Right rail -->
        <div class="flex flex-col items-center gap-5 lg:items-start lg:pt-2">
          <span class="flex size-14 items-center justify-center rounded-full bg-R-10">
            <IconShoppingBag class="size-7 text-primary" />
          </span>
          <div class="flex flex-col items-center lg:items-start">
            <span
              v-for="(line, i) in aboutPage.titleLines"
              :key="i"
              class="text-[34px] font-black leading-[46px] text-foreground"
            >
              {{ line }}
            </span>
          </div>
          <span class="text-[15px] font-semibold text-primary">
            {{ aboutPage.subtitle }}
          </span>
        </div>

        <!-- Content -->
        <div class="mt-8 lg:mt-0">
          <p class="text-[14.5px] leading-[30px] text-T-800">
            {{ aboutPage.hero }}
          </p>
        </div>
      </section>

      <!-- Article -->
      <section class="mt-10 w-full max-w-[1100px] rounded-[16px] border border-T-400 bg-T-50 p-6 lg:mt-12 lg:p-8">
        <template v-for="(section, si) in aboutPage.sections" :key="si">
          <h2
            class="text-[18px] font-bold leading-[28px] text-primary"
            :class="si > 0 ? 'mt-8' : ''"
          >
            {{ section.heading }}
          </h2>
          <p
            v-for="(para, pi) in section.paragraphs"
            :key="`p-${pi}`"
            class="mt-4 text-[14.5px] leading-[30px] text-T-800"
          >
            {{ para }}
          </p>
          <h3 v-if="section.subHeading" class="mt-6 text-[16px] font-semibold leading-[26px] text-foreground">
            {{ section.subHeading }}
          </h3>
        </template>
      </section>
    </main>

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>