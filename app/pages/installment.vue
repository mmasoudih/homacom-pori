<script setup lang="ts">
import {
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-vue'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
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

function partnerTabClass(pi: number) {
  return pi === selectedPartner.value
    ? 'border-R-200 bg-R-50'
    : 'border-T-400 bg-T-50 hover:border-T-500'
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
          <UiBreadcrumb :trail="['هماکام', 'خرید اقساطی']" class="-mt-8 mb-6 shrink-0 max-lg:hidden" />
          <div class="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          <!-- Mobile: hero copy sits on the plain page background — the offset
               utilities bleed it over the overlay padding + grid gap so no
               image/overlay shows behind it. Desktop restores the normal box. -->
          <div class="flex flex-col items-start text-start max-lg:-mx-4 max-lg:-my-10 max-lg:bg-[linear-gradient(to_bottom,var(--background)_65%,transparent)] max-lg:px-4 max-lg:py-10">
            <UiTypography
              as="h1"
              size="4xl"
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

            <div class="mt-6 flex flex-wrap items-center justify-start gap-3">
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
                class="flex h-[47px] w-[188px] items-center justify-center rounded-[12px] border border-T-400 bg-white transition-colors max-lg:border-transparent hover:border-T-500"
              >
                <UiTypography as="span" size="lg" weight="semibold" color="default">
                  {{ installmentPage.complaintsCta }}
                </UiTypography>
              </a>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-start gap-x-6 gap-y-2">
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
            <div class="relative h-[234px] w-[207px] lg:h-[280px] lg:w-[232px]">
              <!-- Stacked layers behind the card -->
              <div class="absolute inset-0 -translate-x-1.5 -translate-y-1.5 -rotate-[12deg] rounded-[24px] bg-white shadow-[0_24px_50px_-10px_rgba(15,15,20,0.28)]" />
              <div class="absolute inset-0 -translate-x-1 -translate-y-1 -rotate-[7deg] rounded-[24px] bg-[#F2B7BE]" />

              <!-- Front card -->
              <div class="relative z-10 flex h-full w-full rotate-[5deg] flex-col justify-between rounded-[24px] bg-gradient-to-br from-[#EF233C] to-[#A7192A] px-5 py-6 shadow-[0_24px_45px_-8px_rgba(167,25,42,0.5)]">
                <div class="flex items-start justify-between">
                  <span class="text-[16px] font-bold leading-none text-white">هماکام</span>
                  <img
                    src="/icons/installment/logo-white.svg"
                    alt=""
                    class="h-[22px] w-[28px] object-contain"
                  >
                </div>

                <div class="flex flex-col items-start gap-1">
                  <div class="flex flex-col items-start">
                    <span class="text-[11px] leading-none text-white/80">تا</span>
                    <span class="text-[42px] font-bold leading-[0.95] text-white">24</span>
                  </div>
                  <span class="text-[13px] leading-none text-white/90">ماه اقساط</span>
                </div>

                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] text-white/85">24 ماه</span>
                    <span class="text-[11px] text-white/85">قسط اول</span>
                  </div>
                  <div class="h-[5px] w-full overflow-hidden rounded-full bg-white/25">
                    <div class="h-full w-[55%] rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          <!-- Steps (anchored to the end of the hero) -->
          <div class="mt-4 shrink-0">
            <UiTypography
              as="h2"
              size="xl"
              weight="bold"
              color="default"
              class="text-start leading-[32px]"
            >
              {{ installmentPage.stepsTitle }}
            </UiTypography>

            <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-[repeat(5,214.4px)] lg:gap-3">
              <div
                v-for="(step, i) in installmentPage.steps"
                :key="step.label"
                class="relative flex h-[168px] w-full flex-col gap-4 rounded-[20px] border-[1.5px] border-white bg-white/20 p-6 text-center lg:w-[214.4px]"
                :class="i === installmentPage.steps.length - 1 ? 'max-lg:col-span-2' : ''"
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
                    weight="semibold"
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
        <LandingSectionTitle :title="installmentPage.partnersTitle" variant="centered" title-size="16" />
        <UiTypography
          as="p"
          size="lg"
          weight="regular"
          color="muted"
          class="mx-auto mt-4 max-w-[640px] text-center leading-[26px]"
        >
          {{ installmentPage.partnersIntro }}
        </UiTypography>

        <!-- Mobile: single-row carousel -->
        <Carousel
          class="mt-8 w-full lg:hidden"
          :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
        >
          <CarouselContent class="-ms-1.5">
            <CarouselItem
              v-for="(partner, pi) in installmentPage.partners"
              :key="partner.name"
              class="basis-auto ps-1.5"
            >
              <button
                type="button"
                class="flex h-[97px] w-[85px] shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] border px-2 transition-colors"
                :class="partnerTabClass(pi)"
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
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <!-- Desktop: wrapped row -->
        <div class="mt-8 hidden flex-wrap justify-center gap-3 lg:flex">
          <button
            v-for="(partner, pi) in installmentPage.partners"
            :key="partner.name"
            type="button"
            class="flex h-[97px] w-[214.8px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] border px-6 transition-colors"
            :class="partnerTabClass(pi)"
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
      <section class="mt-8 w-full max-w-[1122px] px-4 lg:mt-12 lg:px-0">
        <div class="flex flex-col rounded-[16px] border border-T-400 bg-T-50 p-6 lg:p-8">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <img :src="currentPartner.logo" alt="" class="size-[60px] object-contain">
              <div class="flex flex-col">
                <UiTypography as="h3" size="xl" weight="bold" color="default">
                  {{ currentPartner.name }}
                </UiTypography>
                <UiTypography as="p" size="md" weight="regular" color="muted">
                  {{ currentPartner.description }}
                </UiTypography>
              </div>
            </div>

            <div class="flex shrink-0 items-center gap-3 max-lg:hidden">
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
              class="flex items-center gap-2 rounded-[12px] bg-primary px-6 py-3 transition-colors hover:bg-primary/90"
            >
              <UiTypography as="span" size="lg" weight="bold" color="white">
                ثبت درخواست از {{ currentPartner.name }}
              </UiTypography>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7.10861 6.27495C7.35269 6.03087 7.35269 5.63514 7.10861 5.39107C6.86453 5.14699 6.4688 5.14699 6.22473 5.39107L2.05806 9.55773C1.81398 9.80181 1.81398 10.1975 2.05806 10.4416L6.22473 14.6083C6.4688 14.8524 6.86453 14.8524 7.10861 14.6083C7.35269 14.3642 7.35269 13.9685 7.10861 13.7244L4.00888 10.6247H17.5C17.8452 10.6247 18.125 10.3449 18.125 9.99967C18.125 9.6545 17.8452 9.37467 17.5 9.37467H4.00888L7.10861 6.27495Z" fill="white" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- Benefits -->
      <section class="mt-16 w-full max-w-[1122px] px-4 max-lg:hidden lg:mt-20 lg:px-0">
        <LandingSectionTitle :title="installmentPage.benefitsTitle" variant="centered" title-size="16" />
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

      <!-- Categories -->
      <section class="mt-16 w-full max-w-[1020px] px-4 lg:mt-20 lg:px-0">
        <LandingSectionTitle :title="installmentPage.categoriesTitle" variant="centered" title-size="16" />

        <!-- Mobile: homepage-style circular icon grid -->
        <div class="mt-8 grid grid-cols-4 gap-y-[13px] lg:hidden">
          <button
            v-for="(category, ci) in installmentPage.categories"
            :key="category"
            type="button"
            class="group flex flex-col items-center gap-[6px]"
            @click="selectedCategory = ci"
          >
            <span
              class="flex size-[78px] items-center justify-center rounded-full border-[5px] transition-colors"
              :class="ci === selectedCategory ? 'border-R-10 bg-T-50' : 'border-T-200 bg-T-50'"
            >
              <span
                class="[&>svg]:block [&>svg]:size-[30px]"
                :class="ci === selectedCategory ? 'text-primary' : 'text-T-700'"
                aria-hidden="true"
                v-html="categoryIcons[category]"
              />
            </span>
            <span class="text-center text-[13px] font-medium leading-[18px] text-foreground">
              {{ category }}
            </span>
          </button>
        </div>

        <!-- Desktop: icon grid -->
        <div class="mt-8 hidden grid-cols-8 gap-4 lg:grid">
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

      <!-- FAQ -->
      <section class="mt-16 w-full max-w-[1020px] px-4 lg:mt-20 lg:px-0">
        <LandingSectionTitle :title="installmentPage.faqTitle" variant="centered" title-size="16" />
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
    </main>

    <LandingCeoSection class="mt-16 w-full lg:mt-20" />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
