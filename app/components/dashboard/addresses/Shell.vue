<template>
  <div class="hidden min-h-dvh flex-col bg-T-50 lg:flex">
    <LandingSiteHeader />

    <main class="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 lg:px-0 lg:py-8">
      <div class="flex flex-col gap-6 lg:mx-[159px] lg:flex-row lg:items-start lg:gap-5">
        <DashboardSidebar class="hidden lg:block lg:w-[304px] lg:shrink-0" />

        <div class="flex min-w-0 flex-1 flex-col gap-6">
          <DashboardProfileCard class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:hidden" />

          <slot />

          <DashboardNavMenu class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:hidden" />
        </div>
      </div>
    </main>

    <LandingCeoSection />
    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
