<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  backTo?: string
  showFab?: boolean
  showNav?: boolean
}>(), {
  backTo: '/dashboard/tickets',
  showFab: true,
  showNav: true,
})

const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-50 lg:hidden">
    <DashboardTicketsMobileHeader :title="title" :back-to="backTo">
      <template #action>
        <slot name="action" />
      </template>
    </DashboardTicketsMobileHeader>

    <main class="flex flex-1 flex-col px-4 pb-28 pt-4">
      <slot />
    </main>

    <button
      v-if="showFab"
      type="button"
      class="fixed bottom-[106px] end-4 z-40 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[12.5px] font-bold text-white shadow-lg transition-colors hover:bg-primary/90 lg:hidden"
      @click="emit('create')"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 15C8.25 15.4142 8.58579 15.75 9 15.75C9.41421 15.75 9.75 15.4142 9.75 15V9.75H15C15.4142 9.75 15.75 9.41421 15.75 9C15.75 8.58579 15.4142 8.25 15 8.25H9.75V3C9.75 2.58579 9.41421 2.25 9 2.25C8.58579 2.25 8.25 2.58579 8.25 3V8.25H3C2.58579 8.25 2.25 8.58579 2.25 9C2.25 9.41421 2.58579 9.75 3 9.75H8.25V15Z" fill="currentColor" />
      </svg>
      ایجاد تیکت جدید
    </button>

    <div
      v-if="$slots.footer"
      class="sticky bottom-0 mt-auto border-t border-T-300 bg-T-50"
    >
      <slot name="footer" />
    </div>

    <LandingMobileBottomNav v-if="showNav" />
  </div>
</template>
