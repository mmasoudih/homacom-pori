<script setup lang="ts">
import { IconChevronRight } from '@tabler/icons-vue'
import { toPersianDigits } from '~/utils/format'

const props = withDefaults(defineProps<{
  title: string
  code?: string
  backTo: string
}>(), {
  code: '',
})

const router = useRouter()

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }
  router.push(props.backTo)
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
        <h1 class="text-[18px] font-bold leading-tight text-T-900">{{ title }}</h1>
        <span v-if="code" class="text-[11.5px] text-T-600">{{ toPersianDigits(code) }}</span>
      </div>
    </div>

    <DashboardOrdersInvoiceButton />
  </div>
</template>
