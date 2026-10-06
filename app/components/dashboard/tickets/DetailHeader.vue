<script setup lang="ts">
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
        class="mt-0.5 flex size-[38px] shrink-0 items-center justify-center rounded-[8px] border border-T-400 text-T-600 transition-colors hover:border-T-500 hover:text-T-900"
        aria-label="بازگشت"
        @click="goBack"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.8914 6.27397C12.6473 6.0299 12.6473 5.63417 12.8914 5.39009C13.1355 5.14601 13.5312 5.14601 13.7753 5.39009L17.9419 9.55676C18.186 9.80083 18.186 10.1966 17.9419 10.4406L13.7753 14.6073C13.5312 14.8514 13.1355 14.8514 12.8914 14.6073C12.6473 14.3632 12.6473 13.9675 12.8914 13.7234L15.9911 10.6237H2.5C2.15482 10.6237 1.875 10.3439 1.875 9.9987C1.875 9.65352 2.15482 9.3737 2.5 9.3737H15.9911L12.8914 6.27397Z" fill="#1D1D1F" />
        </svg>
      </button>
      <div class="flex flex-col gap-1">
        <UiTypography as="h1" size="xl" weight="semibold" color="default" class="leading-tight">
          جزئیات تیکت
        </UiTypography>
        <UiTypography as="span" size="md" weight="medium" color="subtle">
          {{ subject }}{{ department ? ` - ${department}` : '' }}
        </UiTypography>
      </div>
    </div>

    <button
      v-if="props.status !== 'closed'"
      type="button"
      class="flex h-9 items-center justify-center rounded-[12px] border border-T-400 px-[38px] transition-colors hover:border-T-500"
      @click="emit('close')"
    >
      <UiTypography as="span" size="md" weight="medium" color="default">بستن تیکت</UiTypography>
    </button>
    <button
      v-else
      type="button"
      disabled
      class="flex h-9 cursor-default items-center justify-center rounded-[12px] border border-T-300 px-[38px]"
    >
      <UiTypography as="span" size="md" weight="medium" color="inherit" class="text-T-500">تیکت بسته شده</UiTypography>
    </button>
  </div>
</template>