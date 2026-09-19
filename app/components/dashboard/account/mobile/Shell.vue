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
    <DashboardAccountMobileHeader :title="title" :back-to="backTo" />

    <main class="flex flex-1 flex-col pb-28">
      <slot />
    </main>

    <LandingMobileBottomNav />
  </div>
</template>
