<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue'
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <h1 class="text-xl font-bold text-T-900">لیست آدرس‌ها</h1>

    <button
      type="button"
      class="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-T-400 bg-T-50 px-4 text-[12.5px] font-semibold text-T-800 transition-colors hover:border-T-500"
    >
      <IconPlus class="size-4" />
      افزودن آدرس جدید
    </button>
  </div>
</template>
