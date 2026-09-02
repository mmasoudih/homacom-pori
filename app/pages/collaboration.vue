<script setup lang="ts">
import {
  IconCheck,
  IconX,
  IconBuildingStore,
  IconBuilding,
  IconBuildingBank,
  IconPackage,
  IconServer,
  IconSchool,
  IconDeviceMobile,
  IconDeviceLaptop,
  IconDeviceWatch,
  IconHeadphones,
  IconDeviceGamepad2,
  IconDeviceDesktop,
  IconUsb,
  IconSpeakerphone,
  IconChartLine,
} from '@tabler/icons-vue'
import { collaborationPage } from '~/data/pages/collaboration'

useHead({
  title: 'پنل همکار و سازمانی | هماکام',
})

const audienceIcons = {
  store: IconBuildingStore,
  building: IconBuilding,
  bank: IconBuildingBank,
  package: IconPackage,
  server: IconServer,
  school: IconSchool,
} as const

const productIcons = {
  'گوشی موبایل': IconDeviceMobile,
  'لپ‌تاپ و تبلت': IconDeviceLaptop,
  'ساعت هوشمند': IconDeviceWatch,
  'هدفون و هندزفری': IconHeadphones,
  'کنسول بازی': IconDeviceGamepad2,
  'کامپیوتر': IconDeviceDesktop,
  'لوازم جانبی': IconUsb,
  'صوتی و تصویری': IconSpeakerphone,
} as const
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center pb-16">
      <!-- Hero -->
      <section class="mt-10 grid w-full max-w-[1260px] grid-cols-1 items-center gap-10 px-4 lg:mt-16 lg:grid-cols-[380px_1fr] lg:gap-16 lg:px-0">
        <!-- Chart card (left column in RTL) -->
        <div class="order-2">
          <div class="rounded-[16px] border border-T-400 bg-T-50 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <h3 class="text-center text-[15px] font-bold text-foreground">
              {{ collaborationPage.chartTitle }}
            </h3>

            <!-- SVG chart -->
            <div class="relative mt-4">
              <svg viewBox="0 0 320 150" class="h-auto w-full">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FFE0E5" />
                    <stop offset="100%" stop-color="#FFE0E5" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="#ECEDEF" stroke-width="1">
                  <line x1="0" y1="30" x2="320" y2="30" />
                  <line x1="0" y1="70" x2="320" y2="70" />
                  <line x1="0" y1="110" x2="320" y2="110" />
                </g>
                <path
                  d="M0 128 C40 120 60 122 90 108 C120 94 140 98 170 82 C200 66 220 70 250 50 C270 38 300 30 320 20 L320 150 L0 150 Z"
                  fill="url(#chartFill)"
                />
                <path
                  d="M0 128 C40 120 60 122 90 108 C120 94 140 98 170 82 C200 66 220 70 250 50 C270 38 300 30 320 20"
                  fill="none"
                  stroke="#EF233C"
                  stroke-width="3"
                  stroke-linecap="round"
                />
              </svg>

              <!-- Floating badge -->
              <div class="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-full border border-T-400 bg-T-50 px-4 py-2 shadow-sm">
                <IconChartLine class="size-4 text-primary" />
                <span class="text-[12px] text-T-700">حاشیه سود فروش</span>
                <span class="text-[13px] font-bold text-primary">30%+</span>
              </div>
            </div>

            <!-- Stats -->
            <div class="mt-5 grid grid-cols-3 gap-3">
              <div
                v-for="stat in collaborationPage.stats"
                :key="stat.label"
                class="flex flex-col items-center rounded-[12px] bg-T-100 py-4"
              >
                <span class="text-[24px] font-bold text-primary" dir="ltr">
                  {{ stat.value }}
                </span>
                <span class="mt-1 text-[12px] text-T-600">
                  {{ stat.label }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Headline -->
        <div class="order-1 flex flex-col items-center text-center lg:items-start lg:text-start">
          <h1 class="max-w-[560px] text-[30px] font-bold leading-[48px] text-foreground lg:text-[36px]">
            کالای دیجیتال با قیمت
            <span class="text-primary">عمده</span>
            ؛ سود بیشتر برای کسب‌وکار شما
          </h1>
          <p class="mt-5 max-w-[620px] text-[15px] leading-[30px] text-T-700">
            {{ collaborationPage.intro }}
          </p>

          <div class="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="#"
              class="flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
            >
              {{ collaborationPage.primaryCta }}
            </a>
            <a href="#" class="text-[15px] font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline">
              {{ collaborationPage.secondaryCta }}
            </a>
          </div>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
            <span
              v-for="item in collaborationPage.trustRow"
              :key="item"
              class="flex items-center gap-1.5 text-[13.5px] text-foreground"
            >
              <IconCheck class="size-[18px] text-primary" />
              {{ item }}
            </span>
          </div>
        </div>
      </section>

      <!-- Audiences -->
      <section class="mt-20 w-full max-w-[1260px] px-4 lg:mt-24 lg:px-0">
        <LandingSectionTitle :title="collaborationPage.audiencesTitle" variant="centered" />
        <p class="mx-auto mt-4 max-w-[640px] text-center text-[15px] leading-[26px] text-T-700">
          {{ collaborationPage.audiencesIntro }}
        </p>

        <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="audience in collaborationPage.audiences"
            :key="audience.title"
            class="flex flex-col rounded-[16px] border border-T-400 bg-T-50 p-7 transition-shadow hover:shadow-md"
          >
            <span class="flex size-[68px] items-center justify-center rounded-[16px] border-2 border-R-10 bg-R-10">
              <component
                :is="audienceIcons[audience.icon as keyof typeof audienceIcons]"
                class="size-8 text-primary"
              />
            </span>
            <h3 class="mt-5 text-[18px] font-bold leading-[26px] text-foreground">
              {{ audience.title }}
            </h3>
            <p class="mt-3 flex-1 text-[13.5px] leading-[26px] text-T-700">
              {{ audience.body }}
            </p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="tag in audience.tags"
                :key="tag"
                class="rounded-full bg-T-100 px-3.5 py-1.5 text-[12px] font-medium text-T-700"
              >
                {{ tag }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- Comparison -->
      <section class="mt-20 w-full max-w-[1260px] px-4 lg:mt-24 lg:px-0">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Them (right in RTL) -->
          <div class="rounded-[16px] border border-T-400 bg-T-50 p-8">
            <h3 class="text-center text-[18px] font-bold text-foreground">
              {{ collaborationPage.compareThemTitle }}
            </h3>
            <ul class="mt-6 flex flex-col gap-4">
              <li
                v-for="item in collaborationPage.compareThemItems"
                :key="item"
                class="flex items-center gap-3 text-[14.5px] text-T-700"
              >
                <IconX class="size-5 shrink-0 text-T-500" />
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- Us (left in RTL) -->
          <div class="rounded-[16px] border-2 border-primary bg-R-10 p-8">
            <h3 class="text-center text-[18px] font-bold text-foreground">
              {{ collaborationPage.compareUsTitle }}
            </h3>
            <ul class="mt-6 flex flex-col gap-4">
              <li
                v-for="item in collaborationPage.compareUsItems"
                :key="item"
                class="flex items-center gap-3 text-[14.5px] text-foreground"
              >
                <IconCheck class="size-5 shrink-0 text-primary" />
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Products -->
      <section class="mt-20 w-full max-w-[1260px] px-4 lg:mt-24 lg:px-0">
        <LandingSectionTitle :title="collaborationPage.productsTitle" variant="centered" />
        <p class="mx-auto mt-4 max-w-[640px] text-center text-[15px] leading-[26px] text-T-700">
          {{ collaborationPage.productsIntro }}
        </p>

        <div class="mt-10 grid grid-cols-4 gap-6 sm:grid-cols-8">
          <div
            v-for="product in collaborationPage.products"
            :key="product"
            class="flex flex-col items-center gap-3"
          >
            <span class="flex size-[72px] items-center justify-center rounded-full bg-T-200">
              <component
                :is="productIcons[product as keyof typeof productIcons] ?? IconDeviceMobile"
                class="size-8 text-T-500"
              />
            </span>
            <span class="text-center text-[12px] font-medium leading-[18px] text-T-700">
              {{ product }}
            </span>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mt-20 w-full max-w-[1260px] px-4 lg:mt-24 lg:px-0">
        <LandingSectionTitle :title="collaborationPage.faqTitle" variant="centered" />
        <p class="mx-auto mt-4 max-w-[640px] text-center text-[15px] leading-[26px] text-T-700">
          {{ collaborationPage.faqSubtitle }}
        </p>

        <div class="mt-10">
          <PagesFaqAccordion :items="collaborationPage.faqItems" />
        </div>
      </section>
    </main>

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
