<script setup lang="ts">
import { IconHeadset, IconPlus } from '@tabler/icons-vue'

const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="flex min-h-[520px] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
    <IconHeadset class="size-16 text-T-300" />

    <div class="flex flex-col gap-2">
      <h3 class="text-[15px] font-bold text-T-900">هنوز تیکتی ثبت نکرده‌اید</h3>
      <p class="max-w-[420px] text-[12.5px] leading-[22px] text-T-600">
        اگر سؤال، مشکل یا درخواستی دارید؛ همین حالا یک تیکت جدید ایجاد کنید.
      </p>
    </div>

    <button
      type="button"
      class="flex h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-T-50 px-6 text-[13px] font-bold text-primary transition-colors hover:bg-R-50"
      @click="emit('create')"
    >
      <IconPlus class="size-4" />
      ایجاد تیکت جدید
    </button>
  </div>
</template>
