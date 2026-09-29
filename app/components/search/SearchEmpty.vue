<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue'

defineProps<{
  query: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-14 text-center">
    <span class="flex size-14 items-center justify-center rounded-full bg-T-100">
      <IconSearch class="size-7 text-T-500" />
    </span>
    <p class="text-[15px] font-bold text-T-900">
      نتیجه‌ای یافت نشد
    </p>
    <p class="text-[13px] text-T-600">
      متأسفانه محصولی با عنوان «{{ query }}» پیدا نشد.
    </p>
  </div>
</template>
