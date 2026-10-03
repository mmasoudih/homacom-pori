<script setup lang="ts">
import { toast } from 'vue-sonner'

withDefaults(defineProps<{
  label?: string
  variant?: 'link' | 'button'
}>(), {
  label: 'مشاهده فاکتور',
  variant: 'link',
})

function open() {
  toast.info('فاکتور سفارش در حال آماده‌سازی است.')
}
</script>

<template>
  <button
    type="button"
    :class="
      variant === 'button'
        ? 'inline-flex h-9 items-center gap-1.5 rounded-[12px] border border-T-400 bg-T-50 px-4 text-T-900 transition-colors hover:border-T-500'
        : 'inline-flex items-center gap-1.5 text-[#4E60FF] transition-opacity hover:opacity-80'
    "
    @click="open"
  >
    <span
      v-if="variant === 'button'"
      class="size-[18px] shrink-0 bg-current [mask-image:url(/icons/file-invoice-18.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
      aria-hidden="true"
    />
    <img v-else src="/icons/file-invoice-18.svg" alt="" class="size-[18px]" aria-hidden="true">
    <UiTypography as="span" size="md" weight="medium" color="inherit">{{ label }}</UiTypography>
  </button>
</template>
