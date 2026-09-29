<script setup lang="ts">
useHead({
  title: 'داشبورد | هماکام',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-50">
    <LandingSiteHeader />

    <main class="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 lg:px-6 lg:py-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
        <!-- Desktop sidebar -->
        <DashboardSidebar class="hidden lg:block lg:w-[340px] lg:shrink-0" />

        <div class="flex min-w-0 flex-1 flex-col gap-6">
          <!-- Mobile profile + wallet -->
          <DashboardProfileCard class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:hidden" />

          <DashboardOrderStats />
          <DashboardRecentlyViewed />

          <!-- Mobile account menu -->
          <DashboardNavMenu class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:hidden" />
        </div>
      </div>
    </main>

    <LandingCeoSection class="hidden lg:block" />
    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
