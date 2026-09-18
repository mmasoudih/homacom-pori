<script setup lang="ts">
import { IconFileInvoice } from '@tabler/icons-vue'
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
    class="inline-flex h-9 items-center gap-2 rounded-lg border border-T-400 bg-T-50 px-3 text-[12.5px] font-semibold text-T-800 transition-colors hover:border-T-500"
    @click="open"
  >
    <IconFileInvoice class="size-4" />
    {{ label }}
  </button>
</template>
