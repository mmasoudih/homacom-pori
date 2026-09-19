<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  align?: 'start' | 'center'
  backTo?: string
}>(), {
  align: 'start',
  backTo: '/dashboard/orders',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-50 xl:hidden">
    <DashboardOrdersMobileHeader :title="title" :align="align" :back-to="backTo">
      <template #action>
        <slot name="action" />
      </template>
    </DashboardOrdersMobileHeader>

    <main class="flex-1 px-4 pb-28 pt-4">
      <slot />
    </main>

    <LandingMobileBottomNav />
  </div>
</template>
