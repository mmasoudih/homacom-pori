<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue'

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
  <div class="flex min-h-dvh flex-col bg-T-50 xl:hidden">
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
      class="fixed bottom-[106px] end-4 z-40 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[12.5px] font-bold text-white shadow-lg transition-colors hover:bg-primary/90 xl:hidden"
      @click="emit('create')"
    >
      <IconPlus class="size-4" />
      ایجاد تیکت جدید
    </button>

    <div
      v-if="$slots.footer"
      class="sticky bottom-0 mt-auto border-t border-T-300 bg-T-50 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3"
    >
      <slot name="footer" />
    </div>

    <LandingMobileBottomNav v-if="showNav" />
  </div>
</template>
