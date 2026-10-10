<script setup lang="ts">
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconPackage,
  IconWallet,
  IconUserCheck,
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
import { toPersianDigits } from '~/utils/format'

useHead({
  title: 'خرید اقساطی | هماکام',
})

const selectedCategory = ref(0)
const selectedPartner = ref(0)

const currentPartner = computed(() => installmentPage.partners[selectedPartner.value]!)
const currentPartnerDetails = computed(() => {
  const partner = currentPartner.value
  return [
    { label: 'نوع ضمانت', value: partner.guarantee },
    { label: 'بازه تسویه', value: partner.settlement },
    { label: 'سقف وام', value: partner.ceiling },
    { label: 'اعتبار / وام', value: partner.credit },
  ]
})

function selectPartner(step: number) {
  const count = installmentPage.partners.length
  selectedPartner.value = (selectedPartner.value + step + count) % count
}

const stepIcons: Record<string, string> = {
  verify: '/icons/installment/step-1-verify.svg',
  account: '/icons/installment/step-2-account.svg',
  cart: '/icons/installment/step-3-cart.svg',
  order: '/icons/installment/step-4-order.svg',
  payment: '/icons/installment/step-5-payment.svg',
}

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
      <section
        class="relative w-full max-w-[1440px] overflow-hidden bg-[url(/images/installment-bg-hero.png)] bg-cover bg-center bg-no-repeat lg:h-[668px]"
      >
        <div class="relative z-10 flex h-full w-full flex-col bg-white/60 px-4 py-10 backdrop-blur-[45px] lg:px-8 lg:py-14">
          <div class="mx-auto flex w-full max-w-[1120px] flex-1 flex-col">
          <UiBreadcrumb :trail="['هماکام', 'خرید اقساطی']" class="-mt-8 mb-6 shrink-0" />
          <div class="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div class="flex flex-col items-center text-center lg:items-start lg:text-start">
            <UiTypography
              as="h1"
              size="5xl"
              weight="bold"
              color="default"
              class="leading-[38px]"
            >
              {{ installmentPage.title.replace(installmentPage.titleAccent, '') }}<span class="text-R-300">{{ installmentPage.titleAccent }}</span>
            </UiTypography>
            <UiTypography
              as="p"
              size="lg"
              weight="regular"
              color="muted"
              class="mt-4 max-w-[620px] leading-[28px]"
            >
              {{ installmentPage.intro }}
            </UiTypography>

            <div class="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a
                href="#"
                class="flex h-[47px] w-[188px] items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-primary/90"
              >
                <UiTypography as="span" size="lg" weight="bold" color="white">
                  {{ installmentPage.applyCta }}
                </UiTypography>
              </a>
              <a
                href="#"
                class="flex h-[47px] w-[188px] items-center justify-center rounded-[12px] border border-T-400 bg-white transition-colors hover:border-T-500"
              >
                <UiTypography as="span" size="lg" weight="semibold" color="default">
                  {{ installmentPage.complaintsCta }}
                </UiTypography>
              </a>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
              <span class="flex items-center gap-2">
                <img src="/icons/installment/check-badge.svg" alt="" class="size-4 shrink-0">
                <UiTypography as="span" size="md" weight="regular" color="muted">
                  تایید در چند دقیقه
                </UiTypography>
              </span>
              <span class="flex items-center gap-2">
                <img src="/icons/installment/check-badge.svg" alt="" class="size-4 shrink-0">
                <UiTypography as="span" size="md" weight="regular" color="muted">
                  اقساط تا ۲۴ ماه
                </UiTypography>
              </span>
            </div>
          </div>

          <!-- Homacom branded panel -->
          <div class="mx-auto w-full max-w-[380px]">
            <div class="relative mx-auto flex h-[280px] w-[232px] flex-col justify-between overflow-hidden rounded-[20px] bg-gradient-to-br from-[#D32F3C] to-[#A7192A] px-6 py-5 shadow-[0_18px_40px_rgba(239,35,60,0.35)]">
              <div class="flex items-center justify-between">
                <img
                  src="/icons/installment/logo-white.svg"
                  alt="هماکام"
                  class="h-[27px] w-[35px] object-contain"
                >
                <span class="text-[13px] font-semibold text-white/90">{{ installmentPage.cardBadge }}</span>
              </div>

              <div class="flex flex-col items-center gap-1 text-center">
                <span class="text-[22px] font-bold leading-[32px] text-white">هماکام</span>
                <span class="text-[13px] leading-[24px] text-white/80">خرید اقساطی بدون ضامن</span>
              </div>

              <div class="flex items-center justify-center">
                <span class="text-[13px] font-medium text-white/90">اقساط تا ۲۴ ماه</span>
              </div>
            </div>
          </div>
          </div>

          <!-- Steps (anchored to the end of the hero) -->
          <div class="mt-8 shrink-0">
            <UiTypography
              as="h2"
              size="2xl"
              weight="bold"
              color="default"
              class="text-center leading-[32px] lg:text-start"
            >
              {{ installmentPage.stepsTitle }}
            </UiTypography>

            <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-[repeat(5,214.4px)] lg:gap-3">
              <div
                v-for="(step, i) in installmentPage.steps"
                :key="step.label"
                class="relative flex h-[168px] w-full flex-col gap-4 rounded-[20px] border-[1.5px] border-white bg-white/20 p-6 text-center lg:w-[214.4px]"
              >
                <div class="flex items-center justify-between">
                  <img
                    :src="stepIcons[step.icon]"
                    alt=""
                    class="size-8"
                  >
                  <UiTypography
                    as="span"
                    size="3xl"
                    weight="medium"
                    color="primary"
                  >
                    {{ toPersianDigits(i + 1) }}
                  </UiTypography>
                </div>
                <div class="flex flex-col gap-1 text-start">
                  <UiTypography
                    as="span"
                    size="lg"
                    weight="medium"
                    color="default"
                    class="leading-[22px]"
                  >
                    {{ step.label }}
                  </UiTypography>
                  <UiTypography
                    as="span"
                    size="md"
                    weight="regular"
                    color="muted"
                    class="leading-[20px]"
                  >
                    {{ step.subtitle }}
                  </UiTypography>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <!-- Partners -->
      <section class="mt-16 w-full max-w-[1122px] px-4 lg:mt-20 lg:px-0">
        <LandingSectionTitle :title="installmentPage.partnersTitle" variant="centered" />
        <UiTypography
          as="p"
          size="lg"
          weight="regular"
          color="muted"
          class="mx-auto mt-4 max-w-[640px] text-center leading-[26px]"
        >
          {{ installmentPage.partnersIntro }}
        </UiTypography>

        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <button
            v-for="(partner, pi) in installmentPage.partners"
            :key="partner.name"
            type="button"
            class="flex h-[97px] w-[214.8px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] border px-6 transition-colors"
            :class="
              pi === selectedPartner
                ? 'border-R-200 bg-R-50'
                : 'bg-T-50 hover:border-T-500'
            "
            :style="
              pi === selectedPartner ? undefined : { borderColor: `${partner.color}55` }
            "
            :aria-pressed="pi === selectedPartner"
            @click="selectedPartner = pi"
          >
            <img :src="partner.logo" alt="" class="size-10 object-contain">
            <UiTypography
              as="span"
              size="lg"
              weight="medium"
              :color="pi === selectedPartner ? 'primary' : undefined"
              :style="pi === selectedPartner ? undefined : { color: partner.color }"
            >
              {{ partner.name }}
            </UiTypography>
          </button>
        </div>
      </section>

      <!-- Plan panel -->
      <section class="mt-16 w-full max-w-[1122px] px-4 lg:mt-20 lg:px-0">
        <div class="flex flex-col rounded-[16px] border border-T-400 bg-T-50 p-6 lg:p-8">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <img :src="currentPartner.logo" alt="" class="size-[60px] object-contain">
              <div class="flex flex-col">
                <UiTypography as="h3" size="lg" weight="bold" color="default">
                  {{ currentPartner.name }}
                </UiTypography>
                <UiTypography as="p" size="sm" weight="regular" color="muted">
                  {{ currentPartner.description }}
                </UiTypography>
              </div>
            </div>

            <div class="flex shrink-0 items-center gap-3">
              <button
                type="button"
                aria-label="شریک قبلی"
                class="flex size-10 items-center justify-center rounded-full border border-T-400 text-T-700 transition-colors hover:border-T-500"
                @click="selectPartner(-1)"
              >
                <IconChevronRight class="size-5" />
              </button>
              <button
                type="button"
                aria-label="شریک بعدی"
                class="flex size-10 items-center justify-center rounded-full border border-T-400 text-T-700 transition-colors hover:border-T-500"
                @click="selectPartner(1)"
              >
                <IconChevronLeft class="size-5" />
              </button>
            </div>
          </div>

          <hr class="mt-6 border-T-300">

          <!-- Details -->
          <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <div
              v-for="detail in currentPartnerDetails"
              :key="detail.label"
              class="flex flex-col items-start gap-2 rounded-[20px] bg-T-100 px-4 py-6 text-right"
            >
              <UiTypography as="span" size="lg" weight="medium" color="default">
                {{ detail.label }}
              </UiTypography>
              <UiTypography as="span" size="md" weight="regular" color="muted">
                {{ detail.value }}
              </UiTypography>
            </div>
          </div>

          <!-- CTA -->
          <div class="mt-6 flex justify-start">
            <button
              type="button"
              class="flex items-center gap-2 rounded-[12px] bg-primary px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90"
            >
              ثبت درخواست از {{ currentPartner.name }}
              <IconArrowLeft class="size-4" />
            </button>
          </div>
        </div>
      </section>

      <!-- Benefits -->
      <section class="mt-16 w-full max-w-[1440px] px-4 lg:mt-20 lg:px-6">
        <h2 class="text-[22px] font-bold leading-[32px] text-primary">
          {{ installmentPage.benefitsTitle }}
        </h2>
        <p class="mt-2 max-w-[760px] text-[14px] leading-[26px] text-T-700">
          {{ installmentPage.benefitsIntro }}
        </p>

        <div class="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
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
      <section class="mt-16 w-full max-w-[1440px] px-4 lg:mt-20 lg:px-6">
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
      <section class="mt-16 w-full max-w-[1440px] px-4 lg:mt-20 lg:px-6">
        <h2 class="text-[22px] font-bold leading-[32px] text-primary">
          {{ installmentPage.categoriesTitle }}
        </h2>

        <div class="mt-8 grid grid-cols-4 gap-4 lg:grid-cols-8">
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
