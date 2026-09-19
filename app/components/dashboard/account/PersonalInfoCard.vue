<script setup lang="ts">
import { IconPencil, IconTrash, IconUser } from '@tabler/icons-vue'
import type { AccountProfile } from '~/data/account'

defineProps<{
  profile: AccountProfile
  image: string | null
}>()

const emit = defineEmits<{
  edit: [field: 'name' | 'birthdate' | 'national-id' | 'email' | 'bank']
  'change-image': []
  'remove-image': []
}>()
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
    <h2 class="text-start text-[16px] font-bold text-T-900">مشخصات فردی</h2>

    <div class="mt-5 flex items-center gap-4">
      <span class="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-T-200 text-T-700">
        <img v-if="image" :src="image" class="size-full object-cover">
        <IconUser v-else class="size-8" />
      </span>

      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <span class="text-[14px] font-bold text-T-900">تصویر پروفایل</span>
        <p class="text-[12px] leading-5 text-T-600">
          تصویر دلخواه خود را انتخاب کنید. فرمت‌های مجاز: JPG و PNG، حداکثر حجم: ۲ مگابایت
        </p>

        <div class="flex items-center gap-6 pt-1">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-colors hover:text-R-400"
            @click="emit('change-image')"
          >
            ویرایش تصویر پروفایل
            <IconPencil class="size-4" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-colors hover:text-R-400"
            @click="emit('remove-image')"
          >
            <IconTrash class="size-4" />
            حذف
          </button>
        </div>
      </div>
    </div>

    <div class="mt-5 border-t border-T-400" />

    <div class="grid grid-cols-2 [&>*]:border-T-400 [&>*:nth-child(-n+4)]:border-b [&>*:nth-child(even)]:border-s">
      <DashboardAccountInfoField
        label="نام و نام خانوادگی"
        :value="`${profile.firstName} ${profile.lastName}`"
        @edit="emit('edit', 'name')"
      />
      <DashboardAccountInfoField
        label="تاریخ تولد"
        :value="profile.birthDate"
        @edit="emit('edit', 'birthdate')"
      />
      <DashboardAccountInfoField
        label="کد ملی"
        :value="profile.nationalId"
        add
        @edit="emit('edit', 'national-id')"
      />
      <DashboardAccountInfoField
        label="ایمیل"
        :value="profile.email"
        ltr
        @edit="emit('edit', 'email')"
      />
      <DashboardAccountInfoField
        label="شماره کارت"
        :value="profile.cardNumber"
        @edit="emit('edit', 'bank')"
      />
      <DashboardAccountInfoField
        label="شماره شبا"
        :value="profile.shebaNumber"
        @edit="emit('edit', 'bank')"
      />
    </div>
  </section>
</template>
