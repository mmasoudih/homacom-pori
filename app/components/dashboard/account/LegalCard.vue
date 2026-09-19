<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import type { AccountProfile } from '~/data/account'

defineProps<{
  profile: AccountProfile
}>()

const emit = defineEmits<{
  register: []
}>()
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
    <h2 class="text-start text-[16px] font-bold text-T-900">مشخصات حقوقی</h2>
    <p class="mt-4 text-start text-[13px] leading-6 text-T-600">
      با تکمیل مشخصات حقوقی، می‌توانید اقدام به خرید سازمانی با دریافت فاکتور رسمی و گواهی ارزش افزوده نمایید
    </p>
    <button
      type="button"
      class="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-R-400"
      @click="emit('register')"
    >
      ثبت اطلاعات حقوقی
      <IconChevronLeft class="size-4" />
    </button>
  </section>
</template>
