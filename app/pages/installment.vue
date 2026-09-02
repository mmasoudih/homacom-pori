<script setup lang="ts">
import {
  IconArrowLeft,
  IconCreditCard,
  IconPackage,
  IconWallet,
  IconUserCheck,
  IconCircleCheck,
  IconBolt,
  IconDeviceMobile,
  IconDeviceLaptop,
  IconDeviceWatch,
  IconHeadphones,
  IconDeviceGamepad2,
  IconDeviceDesktop,
  IconUsb,
  IconSpeakerphone,
} from '@tabler/icons-vue'
import { installmentPage } from '~/data/pages/installment'

useHead({
  title: 'خرید اقساطی | هماکام',
})

const selectedPlan = ref(1)
const selectedCategory = ref(0)

const stepIcons = {
  user: IconUserCheck,
  credit: IconCreditCard,
  check: IconCircleCheck,
  package: IconPackage,
  wallet: IconWallet,
} as const

const benefitIcons = {
  package: IconPackage,
  bolt: IconBolt,
  user: IconUserCheck,
  wallet: IconWallet,
} as const

const categoryIcons = {
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
      <section class="mt-10 grid w-full max-w-[1260px] grid-cols-1 items-center gap-10 px-4 lg:mt-16 lg:grid-cols-[1fr_380px] lg:gap-16 lg:px-0">
        <div class="flex flex-col items-center text-center lg:items-start lg:text-start">
          <span class="text-[14px] font-semibold text-primary">خرید اقساطی</span>
          <h1 class="mt-2 text-[28px] font-bold leading-[42px] text-foreground lg:text-[34px] lg:leading-[50px]">
            {{ installmentPage.title }}
          </h1>
          <p class="mt-4 max-w-[620px] text-[15px] leading-[28px] text-T-700">
            {{ installmentPage.intro }}
          </p>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#"
              class="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90"
            >
              {{ installmentPage.applyCta }}
              <IconArrowLeft class="size-4" />
            </a>
            <a
              href="#"
              class="flex items-center gap-2 rounded-full border border-T-400 bg-T-50 px-6 py-3 text-[14px] font-medium text-T-700 transition-colors hover:border-T-500"
            >
              {{ installmentPage.complaintsCta }}
            </a>
          </div>
        </div>

        <!-- Credit card graphic -->
        <div class="mx-auto w-full max-w-[380px]">
          <div class="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-[#D32F3C] to-[#A7192A] shadow-[0_18px_40px_rgba(239,35,60,0.35)]">
            <div class="absolute inset-x-0 top-5 flex items-center justify-between px-6">
              <img
                src="/homacom-logo.png"
                alt="هماکام"
                class="h-[26px] w-[36px] object-contain"
              >
              <span class="text-[13px] font-semibold text-white/90">{{ installmentPage.cardBadge }}</span>
            </div>

            <div class="absolute inset-x-6 top-[46%] flex items-center gap-3">
              <div class="relative h-8 w-11 rounded-md bg-gradient-to-br from-[#E8B84B] to-[#C79A34]">
                <div class="absolute inset-0 m-auto h-3 w-6 rounded-sm border border-[#A67C24]/40" />
              </div>
            </div>

            <div class="absolute inset-x-6 bottom-5 flex items-end justify-between">
              <div class="flex flex-col">
                <span class="text-[13px] text-white/70">هماکام</span>
                <span class="text-[16px] font-bold tracking-wider text-white" dir="ltr">۵۶۰۰ •••• •••• ۰۴۲۱</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-[11px] text-white/70">اعتبار</span>
                <span class="text-[15px] font-bold text-white" dir="ltr">۲۵/۰۹/۰۱</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Steps -->
      <section class="mt-16 w-full max-w-[1260px] px-4 lg:mt-20 lg:px-0">
        <h2 class="text-center text-[22px] font-bold leading-[32px] text-foreground lg:text-start">
          {{ installmentPage.stepsTitle }}
        </h2>

        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          <div
            v-for="(step, i) in installmentPage.steps"
            :key="step.label"
            class="relative flex flex-col items-center gap-4 rounded-[16px] border border-T-400 bg-gradient-to-b from-R-10/70 to-T-50 px-4 py-8 text-center"
          >
            <span
              class="absolute left-4 top-3 flex size-7 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white"
            >
              {{ i + 1 }}
            </span>
            <span class="flex size-14 items-center justify-center rounded-full border border-primary bg-T-50">
              <component
                :is="stepIcons[step.icon as keyof typeof stepIcons]"
                class="size-7 text-primary"
              />
            </span>
            <span class="text-[13px] font-semibold leading-[22px] text-foreground">
              {{ step.label }}
            </span>
          </div>
        </div>
      </section>

      <!-- Partners -->
      <section class="mt-16 w-full max-w-[1260px] px-4 lg:mt-20 lg:px-0">
        <h2 class="text-[22px] font-bold leading-[32px] text-primary">
          {{ installmentPage.partnersTitle }}
        </h2>
        <p class="mt-2 max-w-[760px] text-[14px] leading-[26px] text-T-700">
          {{ installmentPage.partnersIntro }}
        </p>

        <div class="mt-8 flex flex-wrap gap-4">
          <div
            v-for="partner in installmentPage.partners"
            :key="partner.name"
            class="flex h-[72px] w-[200px] items-center justify-center rounded-[14px] border bg-T-50 px-6"
            :style="{ borderColor: `${partner.color}55` }"
          >
            <span class="text-[18px] font-black tracking-wide" :style="{ color: partner.color }">
              {{ partner.name }}
            </span>
          </div>
        </div>
      </section>

      <!-- Plan panel -->
      <section class="mt-16 w-full max-w-[1260px] px-4 lg:mt-20 lg:px-0">
        <div class="flex flex-col rounded-[16px] border border-T-400 bg-T-50 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div class="flex flex-col gap-4">
            <h3 class="text-[18px] font-bold text-foreground">
              {{ installmentPage.planTitle }}
            </h3>
            <div class="flex items-center gap-3">
              <span
                v-for="(option, oi) in installmentPage.planOptions"
                :key="option"
                class="flex h-12 w-16 cursor-pointer items-center justify-center rounded-[12px] border text-[16px] font-bold transition-colors"
                :class="
                  oi === selectedPlan
                    ? 'border-primary bg-R-10 text-primary'
                    : 'border-T-400 bg-T-50 text-T-700 hover:border-T-500'
                "
                @click="selectedPlan = oi"
              >
                <span dir="ltr">{{ option }}</span>
                <span class="text-[11px] font-medium">ماهه</span>
              </span>
            </div>
          </div>

          <div class="mt-6 flex flex-col items-start gap-2 lg:mt-0 lg:items-end">
            <button
              class="flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
            >
              {{ installmentPage.planCta }}
              <IconArrowLeft class="size-4" />
            </button>
            <p class="text-[11px] leading-[18px] text-T-600">
              پس از تأیید اعتبار، می‌توانید کالا را انتخاب کنید.
            </p>
          </div>
        </div>
      </section>

      <!-- Benefits -->
      <section class="mt-16 w-full max-w-[1260px] px-4 lg:mt-20 lg:px-0">
        <h2 class="text-[22px] font-bold leading-[32px] text-primary">
          {{ installmentPage.benefitsTitle }}
        </h2>
        <p class="mt-2 max-w-[760px] text-[14px] leading-[26px] text-T-700">
          {{ installmentPage.benefitsIntro }}
        </p>

        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="benefit in installmentPage.benefits"
            :key="benefit.title"
            class="flex flex-col items-center gap-4 rounded-[16px] border border-T-400 bg-T-50 p-6 text-center transition-shadow hover:shadow-md"
          >
            <span class="flex size-12 items-center justify-center rounded-full border border-primary bg-R-10">
              <component
                :is="benefitIcons[benefit.icon as keyof typeof benefitIcons]"
                class="size-6 text-primary"
              />
            </span>
            <div class="flex flex-col gap-2">
              <h3 class="text-[15px] font-bold leading-[22px] text-foreground">
                {{ benefit.title }}
              </h3>
              <p class="text-[12.5px] leading-[22px] text-T-600">
                {{ benefit.body }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mt-16 w-full max-w-[1260px] px-4 lg:mt-20 lg:px-0">
        <h2 class="text-[22px] font-bold leading-[32px] text-primary">
          {{ installmentPage.faqTitle }}
        </h2>
        <p class="mt-2 text-[14px] leading-[26px] text-T-700">
          {{ installmentPage.faqSubtitle }}
        </p>

        <div class="mt-8">
          <PagesFaqAccordion :items="installmentPage.faqItems" />
        </div>
      </section>

      <!-- Categories -->
      <section class="mt-16 w-full max-w-[1260px] px-4 lg:mt-20 lg:px-0">
        <h2 class="text-[22px] font-bold leading-[32px] text-primary">
          {{ installmentPage.categoriesTitle }}
        </h2>

        <div class="mt-8 grid grid-cols-4 gap-4 sm:grid-cols-8">
          <button
            v-for="(category, ci) in installmentPage.categories"
            :key="category"
            class="flex flex-col items-center gap-3 rounded-[14px] border py-5 transition-colors"
            :class="
              ci === selectedCategory
                ? 'border-primary bg-R-10'
                : 'border-T-400 bg-T-50 hover:border-T-500'
            "
            @click="selectedCategory = ci"
          >
            <component
              :is="categoryIcons[category as keyof typeof categoryIcons] ?? IconDeviceMobile"
              class="size-7"
              :class="ci === selectedCategory ? 'text-primary' : 'text-T-600'"
            />
            <span class="text-[11.5px] font-medium leading-[16px] text-T-700">
              {{ category }}
            </span>
          </button>
        </div>
      </section>
    </main>

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
