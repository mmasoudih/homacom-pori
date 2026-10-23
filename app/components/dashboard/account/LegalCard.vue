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
    <template v-if="profile.legal">
      <div class="mt-4 flex flex-col gap-2 text-start text-[13px] text-T-800">
        <span>نام سازمان: {{ profile.legal.organizationName }}</span>
        <span v-if="profile.legal.nationalId">شناسه ملی: {{ profile.legal.nationalId }}</span>
        <span v-if="profile.legal.city || profile.legal.province">
          {{ [profile.legal.province, profile.legal.city].filter(Boolean).join(' / ') }}
        </span>
      </div>
      <button
        type="button"
        class="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-R-400"
        @click="emit('register')"
      >
        ویرایش اطلاعات حقوقی
        <IconChevronLeft class="size-4" />
      </button>
    </template>
    <template v-else>
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
    </template>
  </section>
</template>
