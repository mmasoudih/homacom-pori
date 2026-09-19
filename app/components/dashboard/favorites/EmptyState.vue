<script setup lang="ts">
import { IconDiscount, IconHeartOff, IconTag } from '@tabler/icons-vue'
</script>

<template>
  <div class="flex min-h-[640px] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
    <IconHeartOff class="size-16 text-T-300" />

    <div class="flex flex-col gap-2">
      <h3 class="text-[15px] font-bold text-T-900">لیست موردعلاقه‌های شما خالی است</h3>
      <p class="max-w-[420px] text-[12.5px] leading-[22px] text-T-600">
        از بین محصولات، کالاهای موردعلاقه خودتان را پیدا کنید و به لیست اضافه کنید
      </p>
    </div>

    <div class="mt-2 flex flex-wrap items-center justify-center gap-3">
      <NuxtLink
        to="/"
        class="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[13px] font-bold text-white transition-colors hover:bg-primary/90"
      >
        <IconTag class="size-4" />
        مشاهده محصولات
      </NuxtLink>
      <NuxtLink
        to="/"
        class="flex h-11 items-center justify-center gap-2 rounded-xl border border-T-400 bg-T-50 px-6 text-[13px] font-semibold text-T-800 transition-colors hover:border-T-500"
      >
        <IconDiscount class="size-4" />
        مشاهده تخفیف‌ها
      </NuxtLink>
    </div>
  </div>
</template>
