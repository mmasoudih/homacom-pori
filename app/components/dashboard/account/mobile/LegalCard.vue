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
  <section class="mt-0 border-t border-T-300 px-4 py-5">
    <h2 class="text-start text-[15px] font-bold text-T-900">مشخصات حقوقی</h2>
    <p class="mt-3 text-start text-[12.5px] leading-6 text-T-600">
      با تکمیل مشخصات حقوقی، می‌توانید اقدام به خرید سازمانی با دریافت فاکتور رسمی و گواهی ارزش افزوده نمایید
    </p>
    <button
      type="button"
      class="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-primary"
      @click="emit('register')"
    >
      ثبت اطلاعات حقوقی
      <IconChevronLeft class="size-4" />
    </button>
  </section>
</template>
