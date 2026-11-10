<script setup lang="ts">
/**
 * Live copy + branch rows from `GET /shop/public/branch-page`; the designed
 * page data remains the fallback for anything the admin has not saved yet.
 */
const { page: branchPage } = useBranchPage()

// Route-driven trail (`~/utils/breadcrumbs`), not mock page copy.
const breadcrumb = useBreadcrumb()

useHead({
  title: 'فروشگاه‌های حضوری هماکام | هماکام',
})

const activeTab = ref(2)

/**
 * The tab list is admin-editable, so highlight the tab that matches the
 * current page title and fall back to the designed index when nothing matches.
 */
watch(
  () => [branchPage.value.tabs, branchPage.value.sectionTitle] as const,
  ([tabs, sectionTitle]) => {
    const match = tabs.findIndex(tab => tab.trim() === sectionTitle.trim())
    activeTab.value = match >= 0
      ? match
      : Math.min(2, Math.max(tabs.length - 1, 0))
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center">
      <!--
        DEBUG: `.not-from-api` paints red everything that does NOT come from
        `GET /shop/public/branch-page` (hardcoded labels, local SVG/PNG assets,
        mock copy). The breadcrumb is route-driven (`~/utils/breadcrumbs`), so
        it is not marked. Remove the class from these nodes to restore the
        design.
      -->

      <!-- Desktop-only breadcrumb (no breadcrumb on mobile) — route-driven -->
      <UiBreadcrumb
        :trail="breadcrumb"
        class="mx-auto hidden w-full max-w-[1398px] px-4 pt-10 lg:flex lg:px-6 lg:pt-3 lg:leading-[15px]"
      />

      <!-- Hero -->
      <section class="flex w-full flex-col items-center px-4 pt-[14px] lg:pt-[5px]">
        <img
          src="/icons/branch/hero.svg"
          alt=""
          class="not-from-api size-[60px]"
        >
        <UiTypography
          as="h1"
          size="xl3xl"
          weight="bold"
          class="mt-[9px] leading-[23px] lg:mt-[18px] lg:leading-[24px]"
        >
          {{ branchPage.title }}
        </UiTypography>
      </section>

      <!-- Tabs -->
      <div class="mt-[26px] flex w-full items-center overflow-x-auto [scrollbar-width:none] lg:mt-[23px] lg:max-w-[1068px] lg:justify-center lg:overflow-visible lg:px-6 [&::-webkit-scrollbar]:hidden">
        <div class="mx-auto flex shrink-0 items-center gap-2 pr-4 lg:gap-3 lg:pr-0 lg:shadow-[0_0_8px_rgba(0,0,0,0.04)]">
          <button
            v-for="(tab, i) in branchPage.tabs"
            :key="tab"
            type="button"
            class="inline-flex h-8 shrink-0 items-center justify-center rounded-full border bg-transparent px-[19px] transition-colors lg:h-[45px] lg:px-8"
            :class="i === activeTab
              ? 'border-[#F2485D] bg-R-50 text-primary'
              : 'border-T-400 text-T-900 hover:border-T-500'"
            @click="activeTab = i"
          >
            <UiTypography as="span" size="xsMd" weight="medium" color="inherit" class="leading-[14px] lg:!text-[14px] lg:leading-normal">
              {{ tab }}
            </UiTypography>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="mt-11 w-full max-w-[1068px] px-4 lg:mt-[60px] lg:px-6">
        <div class="hidden flex-col gap-1.5 text-start lg:flex lg:gap-[6px] lg:pb-1">
          <UiTypography as="h2" size="2xl" weight="bold" color="default" class="lg:leading-[22px]">
            {{ branchPage.sectionTitle }}
          </UiTypography>
          <UiTypography as="p" size="lg" weight="regular" class="leading-[34px] text-T-800">
            {{ branchPage.intro }}
          </UiTypography>
        </div>

        <div class="flex flex-col gap-9 lg:mt-9">
          <section
            v-for="(branch, index) in branchPage.branches"
            :key="branch.id"
            class="flex flex-col gap-3.5"
            :class="index === 0 ? 'lg:gap-9' : 'lg:gap-[18px]'"
          >
            <!-- Branch heading -->
            <div class="flex flex-col gap-2 lg:gap-3 lg:pb-[3px]">
              <div class="flex items-center gap-1">
                <span class="flex h-5 w-[13px] shrink-0 items-center gap-0.5" aria-hidden="true">
                  <span class="h-5 w-[5.5px] rounded-[8px] bg-[#EE4536]" />
                  <span class="h-3 w-[5.5px] rounded-[8px] bg-[#EE4536] opacity-25" />
                </span>
                <UiTypography as="h3" size="lgXl" weight="semibold" color="default" class="leading-[20px]">
                  {{ branch.name }}
                </UiTypography>
              </div>
              <UiTypography as="p" size="mdLg" weight="regular" class="leading-[30px] text-T-800 lg:leading-[34px]">
                {{ branch.hours }}
              </UiTypography>
            </div>

            <!-- Branch card -->
            <article class="overflow-hidden rounded-[20px] bg-white ring-1 ring-inset ring-T-400">
              <!-- Map (static local snapshot — the API has no map field) -->
              <div class="relative h-[141px] w-full">
                <picture class="block size-full">
                  <source media="(min-width: 64rem)" :srcset="branch.map">
                  <img
                    :src="branch.mapMobile"
                    :alt="`نقشه ${branch.name}`"
                    class="size-full object-cover"
                  >
                </picture>
                <img
                  src="/icons/branch/map-pin.svg"
                  alt=""
                  class="absolute left-1/2 top-1/2 size-[30px] -translate-x-1/2 -translate-y-1/2 lg:size-[46px]"
                >
                <!-- DEBUG: the snapshot + pin are local assets, so tint the whole block -->
                <div class="not-from-api pointer-events-none absolute inset-0" aria-hidden="true" />
              </div>

              <!-- Address + actions -->
              <div class="flex flex-col gap-2.5 px-5 pt-2.5 lg:h-[129px] lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:px-[38px] lg:py-[38px]">
                <div class="flex w-full flex-col gap-2.5 lg:w-[379px] lg:self-start">
                  <UiTypography as="h4" size="lgXl" weight="bold" color="default" class="text-start leading-[17px] lg:leading-[19px]">
                    {{ branch.addressLabel }}
                  </UiTypography>
                  <UiTypography as="p" size="mdLg" weight="regular" class="min-h-[30px] text-start leading-[15px] text-T-700 lg:min-h-0 lg:leading-[17px]">
                    {{ branch.address }}
                  </UiTypography>
                </div>

                <div dir="ltr" class="flex w-full flex-col items-center gap-1.5 pt-2 lg:w-auto lg:flex-row lg:flex-wrap lg:gap-2.5 lg:pt-0">
                  <a
                    :href="`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`"
                    target="_blank"
                    rel="noopener"
                    class="flex h-[38px] w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-5 transition-colors hover:bg-T-300 lg:w-[169px] lg:px-4"
                  >
                    <img src="/icons/branch/map-location.svg" alt="" class="not-from-api size-5 rounded-[4px]">
                    <UiTypography as="span" size="mdLg" weight="medium" color="default" class="not-from-api rounded-[4px] px-1">
                      نمایش در نقشه
                    </UiTypography>
                  </a>
                  <a
                    :href="`tel:${branch.phone}`"
                    class="flex h-[38px] w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-5 transition-colors hover:bg-T-300 lg:w-[182px] lg:px-4"
                  >
                    <img src="/icons/branch/phone-call.svg" alt="" class="not-from-api size-5 rounded-[4px]">
                    <UiTypography as="span" size="mdLg" weight="bold" color="default" dir="ltr">
                      {{ branch.phone }}
                    </UiTypography>
                  </a>
                </div>
              </div>

              <!-- Gallery -->
              <div class="px-5 pb-[33px] pt-2.5 lg:px-[38px] lg:pt-5 lg:pb-[39px]">
                <UiTypography as="h4" size="lgXl" weight="bold" color="default" class="not-from-api w-fit rounded-[4px] px-1 text-start leading-[17px] lg:leading-[19px]">
                  تصاویر شعبه:
                </UiTypography>
                <div class="mt-2.5 grid grid-cols-1 gap-2.5 lg:mt-[21px] lg:grid-cols-2 lg:gap-x-2 lg:gap-y-[11px]">
                  <img
                    v-for="(img, i) in branch.images"
                    :key="i"
                    :src="img"
                    :alt="`تصویر ${branch.name} ${i + 1}`"
                    class="aspect-[328/217] w-full rounded-[12px] object-cover lg:aspect-[468/310]"
                  >
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>

      <!-- CEO band (shared landing component, copy comes from `~/data/landing`) -->
      <LandingCeoSection class="not-from-api mt-4 rounded-[24px] lg:mt-[85px]" />
    </main>

    <LandingSiteFooter class="mt-auto lg:mt-[10px]" />
    <LandingMobileBottomNav />
  </div>
</template>

<style scoped>
/*
 * DEBUG marker: red = this piece does NOT come from
 * `GET /shop/public/branch-page` (hardcoded label, local asset, mock copy).
 * `grep -n not-from-api` lists every marked node; delete the rule and the
 * class usages to restore the normal design.
 */
.not-from-api {
  background-color: rgb(239 68 68 / 0.35);
  outline: 1px solid #ef4444;
  outline-offset: 1px;
}
</style>
