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
    <template v-if="profile.legal">
      <div class="mt-3 flex flex-col gap-1.5 text-start text-[12.5px] text-T-800">
        <span>نام سازمان: {{ profile.legal.organizationName }}</span>
        <span v-if="profile.legal.nationalId">شناسه ملی: {{ profile.legal.nationalId }}</span>
        <span v-if="profile.legal.city || profile.legal.province">
          {{ [profile.legal.province, profile.legal.city].filter(Boolean).join(' / ') }}
        </span>
      </div>
      <button
        type="button"
        class="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-primary"
        @click="emit('register')"
      >
        ویرایش اطلاعات حقوقی
        <IconChevronLeft class="size-4" />
      </button>
    </template>
    <template v-else>
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
    </template>
  </section>
</template>
