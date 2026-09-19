<script setup lang="ts">
import { IconMapPinOff, IconPlus } from '@tabler/icons-vue'
</script>

<template>
  <div class="flex flex-col items-center gap-4 px-4 pt-[210px] text-center">
    <IconMapPinOff class="size-16 text-T-300" />

    <div class="flex flex-col gap-2">
      <h3 class="text-[15px] font-bold text-T-900">لیست آدرس‌ها خالی است</h3>
      <p class="max-w-[340px] text-[12.5px] leading-[22px] text-T-600">
        آدرس‌های تحویل خود را مدیریت کنید؛ هنگام ثبت سفارش، یکی را انتخاب کنید
      </p>
    </div>

    <button
      type="button"
      class="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-T-50 px-5 text-[13px] font-bold text-primary transition-colors hover:bg-R-50"
    >
      <IconPlus class="size-4" />
      افزودن آدرس جدید
    </button>
  </div>
</template>
