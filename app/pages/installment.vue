<script setup lang="ts">
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-vue'
import { installmentPage } from '~/data/pages/installment'
import { toPersianDigits } from '~/utils/format'
import mobileCategoryIcon from '../../public/icons/category-menu/mobile.svg?raw'
import laptopCategoryIcon from '../../public/icons/category-menu/laptop.svg?raw'
import watchCategoryIcon from '../../public/icons/category-menu/watch.svg?raw'
import headphonesCategoryIcon from '../../public/icons/category-menu/headphones.svg?raw'
import gamepadCategoryIcon from '../../public/icons/category-menu/gamepad.svg?raw'
import displayCategoryIcon from '../../public/icons/category-menu/display.svg?raw'
import usbCategoryIcon from '../../public/icons/category-menu/usb.svg?raw'
import speakersCategoryIcon from '../../public/icons/category-menu/speakers.svg?raw'

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

const benefitIcons: Record<string, string> = {
  package: '/icons/installment/benefit-package.svg',
  bolt: '/icons/installment/benefit-bolt.svg',
  user: '/icons/installment/benefit-user.svg',
  wallet: '/icons/installment/benefit-wallet.svg',
}

const withIconSize = (svg: string) =>
  svg.replace('width="24"', 'width="50"').replace('height="24"', 'height="50"')

const categoryIcons: Record<string, string> = {
  'گوشی موبایل': withIconSize(mobileCategoryIcon),
  'لپ‌تاپ و تبلت': withIconSize(laptopCategoryIcon),
  'ساعت هوشمند': withIconSize(watchCategoryIcon),
  'هدفون و هندزفری': withIconSize(headphonesCategoryIcon),
  'کنسول بازی': withIconSize(gamepadCategoryIcon),
  'کامپیوتر': withIconSize(displayCategoryIcon),
  'لوازم جانبی': withIconSize(usbCategoryIcon),
  'صوتی و تصویری': withIconSize(speakersCategoryIcon),
}
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
          <div class="mx-auto flex w-full max-w-[380px] items-center justify-center py-8">
            <div class="relative h-[360px] w-[300px]">
              <!-- Stacked layers behind the card -->
              <div class="absolute inset-0 -translate-x-2 -translate-y-2 -rotate-[12deg] rounded-[30px] bg-white shadow-[0_30px_60px_-12px_rgba(15,15,20,0.28)]" />
              <div class="absolute inset-0 -translate-x-1 -translate-y-1 -rotate-[7deg] rounded-[30px] bg-[#F2B7BE]" />

              <!-- Front card -->
              <div class="relative z-10 flex h-full w-full rotate-[5deg] flex-col justify-between rounded-[30px] bg-gradient-to-br from-[#EF233C] to-[#A7192A] px-7 py-8 shadow-[0_30px_55px_-10px_rgba(167,25,42,0.5)]">
                <div class="flex items-start justify-between">
                  <span class="text-[19px] font-bold leading-none text-white">هماکام</span>
                  <img
                    src="/icons/installment/logo-white.svg"
                    alt=""
                    class="h-[26px] w-[34px] object-contain"
                  >
                </div>

                <div class="flex flex-col items-center gap-1.5">
                  <div class="flex flex-col items-start">
                    <span class="text-[13px] leading-none text-white/80">تا</span>
                    <span class="text-[56px] font-bold leading-[0.95] text-white">۲۴</span>
                  </div>
                  <span class="text-[15px] leading-none text-white/90">ماه اقساط</span>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[12px] text-white/85">۲۴ ماه</span>
                    <span class="text-[12px] text-white/85">قسط اول</span>
                  </div>
                  <div class="h-[6px] w-full overflow-hidden rounded-full bg-white/25">
                    <div class="h-full w-[55%] rounded-full bg-white" />
                  </div>
                </div>
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
                : 'border-T-400 bg-T-50 hover:border-T-500'
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
      <section class="mt-16 w-full max-w-[1122px] px-4 lg:mt-20 lg:px-0">
        <LandingSectionTitle :title="installmentPage.benefitsTitle" variant="centered" />
        <UiTypography
          as="p"
          size="lg"
          weight="regular"
          color="muted"
          class="mx-auto mt-4 max-w-[640px] text-center leading-[26px]"
        >
          {{ installmentPage.benefitsIntro }}
        </UiTypography>

        <div class="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <article
            v-for="benefit in installmentPage.benefits"
            :key="benefit.title"
            class="flex flex-col items-start gap-4 rounded-[16px] border border-T-400 bg-T-50 p-6 text-start transition-shadow"
          >
            <span class="flex size-12 items-center justify-center rounded-[12px] bg-R-10">
              <img :src="benefitIcons[benefit.icon]" alt="" class="size-6">
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
      <section class="mt-16 w-full max-w-[1020px] px-4 lg:mt-20 lg:px-0">
        <LandingSectionTitle :title="installmentPage.faqTitle" variant="centered" />
        <UiTypography
          as="p"
          size="lg"
          weight="regular"
          color="muted"
          class="mx-auto mt-4 max-w-[640px] text-center leading-[26px]"
        >
          {{ installmentPage.faqSubtitle }}
        </UiTypography>

        <div class="mt-8">
          <PagesFaqAccordion :items="installmentPage.faqItems" />
        </div>
      </section>

      <!-- Categories -->
      <section class="mt-16 w-full max-w-[1020px] px-4 lg:mt-20 lg:px-0">
        <LandingSectionTitle :title="installmentPage.categoriesTitle" variant="centered" />

        <div class="mt-8 grid grid-cols-4 gap-4 lg:grid-cols-8">
          <button
            v-for="(category, ci) in installmentPage.categories"
            :key="category"
            type="button"
            class="flex flex-col items-center gap-3 transition-colors"
            :class="ci === selectedCategory ? 'text-primary' : 'text-T-700 hover:text-T-800'"
            @click="selectedCategory = ci"
          >
            <span
              class="[&>svg]:block"
              aria-hidden="true"
              v-html="categoryIcons[category]"
            />
            <UiTypography
              as="span"
              size="xl"
              weight="regular"
              color="inherit"
              class="leading-[16px]"
            >
              {{ category }}
            </UiTypography>
          </button>
        </div>
      </section>
    </main>

    <LandingCeoSection class="mt-16 w-full lg:mt-20" />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
