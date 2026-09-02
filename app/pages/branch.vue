<script setup lang="ts">
import { IconMapPin, IconNavigation, IconPhoneCall } from '@tabler/icons-vue'
import { branchPage } from '~/data/pages/branch'

useHead({
  title: 'فروشگاه‌های حضوری هماکام | هماکام',
})

const activeTab = ref(3)
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center pb-16">
      <PagesPageHeader
        class="pt-10 lg:pt-16"
        :title="branchPage.title"
        :subtitle="branchPage.subtitle"
        :breadcrumb="['هماکام', 'فروشگاه‌های حضوری']"
      >
        <template #icon>
          <img
            src="/assets/map-pin.svg"
            alt="نشان مکان"
            class="size-[88px] object-contain"
          >
        </template>
      </PagesPageHeader>

      <!-- Tabs -->
      <PagesPillTabs
        :tabs="branchPage.tabs"
        :active="activeTab"
        variant="purple"
        class="mt-8 px-4 lg:mt-10"
        @select="(i: number) => (activeTab = i)"
      />

      <!-- Section title -->
      <section class="mt-12 flex w-full max-w-[1260px] flex-col items-center px-4 text-center lg:mt-14 lg:items-start lg:text-start">
        <h2 class="text-[22px] font-bold leading-[32px] text-[#D0021B]">
          {{ branchPage.sectionTitle }}
        </h2>
        <p class="mt-3 max-w-[1000px] text-[14.5px] leading-[28px] text-T-700">
          {{ branchPage.intro }}
        </p>
      </section>

      <!-- Branches -->
      <div class="mt-12 flex w-full max-w-[1260px] flex-col gap-16 px-4 lg:mt-16">
        <section
          v-for="branch in branchPage.branches"
          :key="branch.id"
          class="flex flex-col"
        >
          <div class="flex items-center gap-3">
            <span class="size-2.5 rounded-full bg-[#D0021B]" />
            <h3 class="text-[18px] font-semibold leading-[26px] text-foreground">
              {{ branch.name }}
            </h3>
          </div>
          <p class="mt-2 text-[13px] leading-[22px] text-T-600">
            {{ branch.hours }}
          </p>

          <!-- Map -->
          <div class="mt-5">
            <PagesMapPlaceholder class="h-[260px] w-full lg:h-[380px]" />
          </div>

          <!-- Address + actions -->
          <div class="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex flex-col">
              <span class="text-[13px] font-semibold text-foreground">
                {{ branch.addressLabel }}
              </span>
              <span class="mt-1 text-[13.5px] leading-[24px] text-T-700">
                {{ branch.address }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                class="flex items-center gap-2 rounded-[10px] bg-T-100 px-5 py-2.5 text-[13px] font-medium text-T-800 transition-colors hover:text-primary"
              >
                <IconMapPin class="size-4 text-primary" />
                نمایش در نقشه
              </button>
              <a
                :href="`tel:${branch.phone}`"
                class="flex items-center gap-2 rounded-[10px] bg-T-100 px-5 py-2.5 text-[13px] font-medium text-T-800 transition-colors hover:text-primary"
                dir="ltr"
              >
                <IconPhoneCall class="size-4 text-primary" />
                {{ branch.phone }}
              </a>
              <button
                class="flex items-center gap-2 rounded-[10px] bg-T-100 px-5 py-2.5 text-[13px] font-medium text-T-800 transition-colors hover:text-primary"
              >
                <IconNavigation class="size-4 text-primary" />
                مسیریابی
              </button>
            </div>
          </div>

          <!-- Photo gallery -->
          <div class="mt-6 flex flex-col gap-3 lg:mt-8">
            <span class="text-[13px] font-semibold text-foreground">تصاویر شعبه:</span>
            <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <img
                v-for="(img, i) in branch.images"
                :key="i"
                :src="img"
                :alt="`تصویر ${branch.name} ${i + 1}`"
                class="aspect-[4/5] w-full rounded-[12px] object-cover"
              >
            </div>
          </div>
        </section>
      </div>
    </main>

    <PagesAboutBand class="mt-auto" />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
