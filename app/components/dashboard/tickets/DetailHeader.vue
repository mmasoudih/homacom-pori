<script setup lang="ts">
import { IconChevronRight } from '@tabler/icons-vue'
import type { TicketStatus } from '~/data/tickets'

const props = withDefaults(defineProps<{
  subject: string
  department?: string
  status: TicketStatus
}>(), {
  department: '',
})

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }
  router.push('/dashboard/tickets')
}
</script>

<template>
  <div class="flex items-start justify-between gap-3">
    <div class="flex items-start gap-2">
      <button
        type="button"
        class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-T-400 text-T-600 transition-colors hover:border-T-500 hover:text-T-900"
        aria-label="بازگشت"
        @click="goBack"
      >
        <IconChevronRight class="size-4" />
      </button>
      <div class="flex flex-col gap-1">
        <h1 class="text-[18px] font-bold leading-tight text-T-900">جزئیات تیکت</h1>
        <span class="text-[11.5px] text-T-600">{{ subject }}{{ department ? ` - ${department}` : '' }}</span>
      </div>
    </div>

    <button
      v-if="props.status !== 'closed'"
      type="button"
      class="flex h-9 items-center justify-center rounded-xl border border-T-400 px-4 text-[12.5px] font-semibold text-T-800 transition-colors hover:border-T-500"
      @click="emit('close')"
    >
      بستن تیکت
    </button>
    <button
      v-else
      type="button"
      disabled
      class="flex h-9 cursor-default items-center justify-center rounded-xl border border-T-300 px-4 text-[12.5px] font-semibold text-T-500"
    >
      تیکت بسته شده
    </button>
  </div>
</template>
