<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  backTo?: string
}>(), {
  backTo: '/dashboard',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-50 xl:hidden">
    <DashboardAddressesMobileHeader :title="title" :back-to="backTo" />

    <main class="flex flex-1 flex-col px-4 pb-28 pt-4">
      <slot />
    </main>

    <DashboardAddressesMobileAddButton />
    <LandingMobileBottomNav />
  </div>
</template>
