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
    <h2 class="text-start text-[15px] font-bold text-T-900">رمزعبور</h2>
    <p class="mt-3 text-start text-[12.5px] leading-6 text-T-600">
      برای حساب شما هنوز رمز عبوری تعیین نشده است. همین حالا یک رمز عبور برای حساب خود انتخاب کنید.
    </p>
    <button
      type="button"
      class="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-primary"
      @click="emit('register')"
    >
      ثبت رمزعبور
      <IconChevronLeft class="size-4" />
    </button>
  </section>
</template>
