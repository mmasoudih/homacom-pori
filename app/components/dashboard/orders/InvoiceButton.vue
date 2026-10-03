<script setup lang="ts">
import { toast } from 'vue-sonner'

withDefaults(defineProps<{
  label?: string
}>(), {
  label: 'مشاهده فاکتور',
})

function open() {
  toast.info('فاکتور سفارش در حال آماده‌سازی است.')
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-1.5 text-[#4E60FF] transition-opacity hover:opacity-80"
    @click="open"
  >
    <img src="/icons/file-invoice-18.svg" alt="" class="size-[18px]" aria-hidden="true">
    <UiTypography as="span" size="md" weight="medium" color="inherit">{{ label }}</UiTypography>
  </button>
</template>
