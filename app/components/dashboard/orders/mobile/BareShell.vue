<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  align?: 'start' | 'center'
  backTo?: string
}>(), {
  align: 'center',
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

    <main class="flex-1 px-4 py-4">
      <slot />
    </main>

    <div
      v-if="$slots.footer"
      class="sticky bottom-0 mt-auto border-t border-T-300 bg-T-50 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
