<script setup lang="ts">
useHead({
  title: 'داشبورد | هماکام',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-50">
    <LandingSiteHeader />

    <main class="mx-auto w-full max-w-[1350px] flex-1 px-4 py-6 lg:px-6 lg:py-8">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-start">
        <DashboardSidebar class="xl:w-[340px] xl:shrink-0" />

        <div class="flex min-w-0 flex-1 flex-col gap-6">
          <DashboardOrderStats />
          <DashboardRecentlyViewed />
        </div>
      </div>
    </main>

    <LandingCeoSection class="hidden lg:block" />
    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
