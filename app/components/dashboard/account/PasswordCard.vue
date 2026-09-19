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
    <h2 class="text-start text-[16px] font-bold text-T-900">رمزعبور</h2>
    <p class="mt-4 text-start text-[13px] leading-6 text-T-600">
      برای حساب شما هنوز رمز عبوری تعیین نشده است. همین حالا یک رمز عبور برای حساب خود انتخاب کنید.
    </p>
    <button
      type="button"
      class="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-R-400"
      @click="emit('register')"
    >
      ثبت رمزعبور
      <IconChevronLeft class="size-4" />
    </button>
  </section>
</template>
