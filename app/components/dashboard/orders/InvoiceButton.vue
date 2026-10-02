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
    class="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#4E60FF] transition-opacity hover:opacity-80"
    @click="open"
  >
    <IconFileInvoice class="size-4" />
    {{ label }}
  </button>
</template>
