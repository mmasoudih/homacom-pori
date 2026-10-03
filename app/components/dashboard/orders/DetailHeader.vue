<script setup lang="ts">
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
        class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-T-400 text-T-600 transition-colors hover:border-T-500 hover:text-T-900"
        aria-label="بازگشت"
        @click="goBack"
      >
        <img src="/icons/arrow-right-dark.svg" alt="" class="size-5" aria-hidden="true">
      </button>
      <div class="flex flex-col gap-1">
        <UiTypography as="h1" size="xl" weight="semibold">{{ title }}</UiTypography>
        <UiTypography v-if="code" as="span" size="md" weight="medium" color="subtle">{{ toPersianDigits(code) }}</UiTypography>
      </div>
    </div>

    <DashboardOrdersInvoiceButton variant="button" />
  </div>
</template>
