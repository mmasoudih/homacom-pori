<script setup lang="ts">
import {
  IconChartLine,
} from '@tabler/icons-vue'
import { collaborationPage } from '~/data/pages/collaboration'
import audienceStoreIcon from '../../public/icons/collaboration/audience-store.svg?raw'
import audienceBuildingIcon from '../../public/icons/collaboration/audience-building.svg?raw'
import audienceBankIcon from '../../public/icons/collaboration/audience-bank.svg?raw'
import audiencePackageIcon from '../../public/icons/collaboration/audience-package.svg?raw'
import audienceServerIcon from '../../public/icons/collaboration/audience-server.svg?raw'
import audienceSchoolIcon from '../../public/icons/collaboration/audience-school.svg?raw'
import mobileCategoryIcon from '../../public/icons/category-menu/mobile.svg?raw'
import laptopCategoryIcon from '../../public/icons/category-menu/laptop.svg?raw'
import watchCategoryIcon from '../../public/icons/category-menu/watch.svg?raw'
import headphonesCategoryIcon from '../../public/icons/category-menu/headphones.svg?raw'
import gamepadCategoryIcon from '../../public/icons/category-menu/gamepad.svg?raw'
import displayCategoryIcon from '../../public/icons/category-menu/display.svg?raw'
import usbCategoryIcon from '../../public/icons/category-menu/usb.svg?raw'
import speakersCategoryIcon from '../../public/icons/category-menu/speakers.svg?raw'

useHead({
  title: 'پنل همکار و سازمانی | هماکام',
})

const audienceIcons: Record<string, string> = {
  store: audienceStoreIcon,
  building: audienceBuildingIcon,
  bank: audienceBankIcon,
  package: audiencePackageIcon,
  server: audienceServerIcon,
  school: audienceSchoolIcon,
}

const withIconSize = (svg: string) =>
  svg.replace('width="24"', 'width="50"').replace('height="24"', 'height="50"')

const productIcons: Record<string, string> = {
  'گوشی موبایل': withIconSize(mobileCategoryIcon),
  'لپ‌تاپ و تبلت': withIconSize(laptopCategoryIcon),
  'ساعت هوشمند': withIconSize(watchCategoryIcon),
  'هدفون و هندزفری': withIconSize(headphonesCategoryIcon),
  'کنسول بازی': withIconSize(gamepadCategoryIcon),
  'کامپیوتر': withIconSize(displayCategoryIcon),
  'لوازم جانبی': withIconSize(usbCategoryIcon),
  'صوتی و تصویری': withIconSize(speakersCategoryIcon),
}

const selectedCategory = ref(0)
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center">
      <!-- Desktop-only breadcrumb (no breadcrumb on mobile) -->
      <UiBreadcrumb
        :trail="collaborationPage.breadcrumb"
        class="mx-auto hidden w-full max-w-[1121px] px-4 pt-10 lg:flex lg:px-6 lg:pt-4 lg:pb-8"
      />

      <!-- Hero -->
      <section class="mt-10 grid w-full max-w-[1121px] grid-cols-1 items-center gap-10 px-4 lg:mt-0 lg:grid-cols-[477px_minmax(0,537px)] lg:justify-between lg:px-6">
        <!-- Chart card (left column in RTL) -->
        <div class="order-2">
          <div class="rounded-[16px] bg-T-50 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] lg:h-[416px]">
            <UiTypography as="h3" size="xl" weight="bold" color="default" class="text-start max-lg:text-[14px]">
              {{ collaborationPage.chartTitle }}
            </UiTypography>

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
                  d="M0 140 C22 100 52 140 80 96 C106 56 134 108 164 62 C194 22 224 74 254 34 C276 10 302 34 320 12 L320 150 L0 150 Z"
                  fill="url(#chartFill)"
                />
                <path
                  d="M0 140 C22 100 52 140 80 96 C106 56 134 108 164 62 C194 22 224 74 254 34 C276 10 302 34 320 12"
                  fill="none"
                  stroke="#EF233C"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>

              <!-- Floating badge -->
              <div class="absolute right-4 top-4 flex h-[50px] items-center gap-2 rounded-full bg-T-50/70 px-4 shadow-sm backdrop-blur-lg">
                <span class="text-[13px] font-bold text-primary">30%+</span>
                <UiTypography as="span" size="2xs" weight="regular" color="muted" class="lg:text-[12px]">حاشیه سود فروش</UiTypography>
                <IconChartLine class="size-4 text-primary" />
              </div>
            </div>

            <!-- Stats -->
            <div class="mt-5 grid grid-cols-3 gap-[7px]">
              <div
                v-for="stat in collaborationPage.stats"
                :key="stat.label"
                class="flex flex-col items-center rounded-[20px] bg-T-200 py-4"
              >
                <UiTypography as="span" size="2xl" weight="bold" color="default" dir="ltr" class="max-lg:text-[16px]">
                  {{ stat.value }}
                </UiTypography>
                <UiTypography as="span" size="md" weight="regular" color="subtle" class="mt-1 max-lg:text-[11.25px] max-lg:font-bold">
                  {{ stat.label }}
                </UiTypography>
              </div>
            </div>
          </div>
        </div>

        <!-- Headline -->
        <div class="order-1 flex flex-col items-start text-start">
          <UiTypography as="h1" size="5xl" weight="bold" color="default" class="max-w-[560px] leading-[40px] max-lg:text-[22px]">
            کالای دیجیتال با قیمت
            <span class="text-primary">عمده</span>
            ؛ سود بیشتر برای کسب‌وکار شما
          </UiTypography>
          <UiTypography as="p" size="lg" weight="regular" color="muted" class="mt-5 max-w-[620px] leading-[26px]">
            {{ collaborationPage.intro }}
          </UiTypography>

          <div class="mt-7 flex flex-wrap items-center gap-5">
            <a
              href="#"
              class="flex h-[47px] w-[188px] items-center justify-center gap-2 rounded-[12px] bg-primary px-8 text-white transition-colors hover:bg-primary/90"
            >
              <UiTypography as="span" size="md" weight="bold" color="white" class="lg:text-[15px] lg:font-semibold">
                {{ collaborationPage.primaryCta }}
              </UiTypography>
            </a>
            <a href="#" class="text-foreground underline-offset-4 hover:text-primary hover:underline">
              <UiTypography as="span" size="md" weight="semibold" color="inherit" class="lg:text-[15px]">
                {{ collaborationPage.secondaryCta }}
              </UiTypography>
            </a>
          </div>

          <div class="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
            <span
              v-for="item in collaborationPage.trustRow"
              :key="item"
              class="flex items-center gap-1.5 text-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="#EF233C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <UiTypography as="span" size="md" weight="regular" color="inherit" class="lg:text-[13.5px]">
                {{ item }}
              </UiTypography>
            </span>
          </div>
        </div>
      </section>

      <!-- Audiences -->
      <section class="mt-20 w-full max-w-[1121px] px-4 lg:mt-24 lg:px-6">
        <LandingSectionTitle
          :title="collaborationPage.audiencesTitle"
          accent="همابیزنس"
          accent-always
          variant="centered"
        />
        <p class="mx-auto mt-4 max-w-[640px] text-center text-[15px] leading-[26px] text-T-700">
          {{ collaborationPage.audiencesIntro }}
        </p>

        <div class="mt-10 grid grid-cols-1 gap-x-[18px] gap-y-4 lg:-mx-6 lg:grid-cols-3">
          <article
            v-for="audience in collaborationPage.audiences"
            :key="audience.title"
            class="flex flex-col rounded-[20px] border border-T-400 bg-T-50 px-7 py-6 lg:min-h-[248px]"
          >
            <span class="flex size-[48px] shrink-0 items-center justify-center rounded-[12px] border-2 border-R-10 bg-R-10">
              <span
                class="[&>svg]:block [&>svg]:size-6"
                aria-hidden="true"
                v-html="audienceIcons[audience.icon] ?? ''"
              />
            </span>
            <UiTypography as="h3" size="xl" weight="medium" color="default" class="mt-5">
              {{ audience.title }}
            </UiTypography>
            <UiTypography as="p" size="lg" weight="regular" color="muted" class="mt-3 flex-1">
              {{ audience.body }}
            </UiTypography>
            <div class="mt-5 flex flex-wrap gap-2">
              <UiTypography
                v-for="tag in audience.tags"
                :key="tag"
                as="span"
                size="xs"
                weight="medium"
                color="muted"
                class="rounded-full bg-T-100 px-5 py-[7px]"
              >
                {{ tag }}
              </UiTypography>
            </div>
          </article>
        </div>
      </section>

      <!-- Comparison -->
      <section class="mt-20 w-full max-w-[1440px] px-4 lg:mt-24 lg:px-6">
        <div class="mx-auto grid max-w-[920px] grid-cols-1 gap-5 lg:grid-cols-2">
          <!-- Them (right in RTL) -->
          <div class="rounded-[20px] border border-T-400 bg-T-50 p-8">
            <UiTypography as="h3" size="xl" weight="semibold" color="default" class="text-start max-lg:text-[14px]">
              {{ collaborationPage.compareThemTitle }}
            </UiTypography>
            <ul class="mt-6 flex flex-col gap-4">
              <li
                v-for="item in collaborationPage.compareThemItems"
                :key="item"
                class="flex items-center gap-3"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
                  <path d="M13.7197 14.7803C14.0126 15.0732 14.4874 15.0732 14.7803 14.7803C15.0732 14.4874 15.0732 14.0126 14.7803 13.7197L10.0607 9L14.7803 4.28033C15.0732 3.98744 15.0732 3.51256 14.7803 3.21967C14.4874 2.92678 14.0126 2.92678 13.7197 3.21967L9 7.93934L4.28033 3.21967C3.98744 2.92678 3.51256 2.92678 3.21967 3.21967C2.92678 3.51256 2.92678 3.98744 3.21967 4.28033L7.93934 9L3.21967 13.7197C2.92678 14.0126 2.92678 14.4874 3.21967 14.7803C3.51256 15.0732 3.98744 15.0732 4.28033 14.7803L9 10.0607L13.7197 14.7803Z" fill="#9CA3AF"/>
                </svg>
                <UiTypography as="span" size="xl" weight="regular" color="muted" class="max-lg:text-[14px]">
                  {{ item }}
                </UiTypography>
              </li>
            </ul>
          </div>

          <!-- Us (left in RTL) -->
          <div class="max-lg:order-first rounded-[20px] border border-R-300 bg-R-10 p-8">
            <UiTypography as="h3" size="xl" weight="semibold" color="default" class="text-start max-lg:text-[14px]">
              {{ collaborationPage.compareUsTitle }}
            </UiTypography>
            <ul class="mt-6 flex flex-col gap-4">
              <li
                v-for="item in collaborationPage.compareUsItems"
                :key="item"
                class="flex items-center gap-3"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
                  <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="#EF233C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <UiTypography as="span" size="xl" weight="regular" color="muted" class="max-lg:text-[14px]">
                  {{ item }}
                </UiTypography>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Products -->
      <section class="mt-20 w-full max-w-[1020px] px-4 lg:mt-24 lg:px-6">
        <LandingSectionTitle :title="collaborationPage.productsTitle" variant="centered" title-size="16" />

        <!-- Mobile: circular icon grid -->
        <div class="mt-8 grid grid-cols-4 gap-y-[13px] lg:hidden">
          <button
            v-for="(product, pi) in collaborationPage.products"
            :key="product"
            type="button"
            class="group flex flex-col items-center gap-[6px]"
            @click="selectedCategory = pi"
          >
            <span
              class="flex size-[78px] items-center justify-center rounded-full border-[5px] transition-colors"
              :class="pi === selectedCategory ? 'border-R-10 bg-T-50' : 'border-T-200 bg-T-50'"
            >
              <span
                class="[&>svg]:block [&>svg]:size-[30px]"
                :class="pi === selectedCategory ? 'text-primary' : 'text-T-700'"
                aria-hidden="true"
                v-html="productIcons[product]"
              />
            </span>
            <span class="text-center text-[13px] font-medium leading-[18px] text-foreground">
              {{ product }}
            </span>
          </button>
        </div>

        <!-- Desktop: icon grid -->
        <div class="mt-8 hidden grid-cols-8 gap-4 lg:grid">
          <button
            v-for="(product, pi) in collaborationPage.products"
            :key="product"
            type="button"
            class="flex flex-col items-center gap-3 transition-colors"
            :class="pi === selectedCategory ? 'text-primary' : 'text-T-700 hover:text-T-800'"
            @click="selectedCategory = pi"
          >
            <span
              class="[&>svg]:block"
              aria-hidden="true"
              v-html="productIcons[product]"
            />
            <UiTypography
              as="span"
              size="xl"
              weight="regular"
              color="inherit"
              class="leading-[16px]"
            >
              {{ product }}
            </UiTypography>
          </button>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mt-20 w-full max-w-[1020px] px-4 lg:mt-24 lg:px-6">
        <LandingSectionTitle :title="collaborationPage.faqTitle" variant="centered" />
        <p class="mx-auto mt-4 max-w-[640px] text-center text-[15px] leading-[26px] text-T-700">
          {{ collaborationPage.faqSubtitle }}
        </p>

        <div class="mt-10">
          <PagesFaqAccordion :items="collaborationPage.faqItems" />
        </div>
      </section>

      <LandingCeoSection class="mt-20 w-full lg:mt-24" />
    </main>

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
