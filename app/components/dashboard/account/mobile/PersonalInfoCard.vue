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
  <section>
    <h2 class="px-4 pb-3 pt-4 text-[15px] font-bold text-T-900">مشخصات فردی</h2>

    <div class="flex items-center gap-3 px-4">
      <span class="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-T-200 text-T-700">
        <img v-if="image" :src="image" class="size-full object-cover">
        <IconUser v-else class="size-7" />
      </span>

      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <span class="text-[13px] font-bold text-T-900">تصویر پروفایل</span>
        <p class="text-[11px] leading-4 text-T-600">
          تصویر دلخواه خود را انتخاب کنید. فرمت‌های مجاز: JPG و PNG، حداکثر حجم: ۲ مگابایت
        </p>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-5 px-4">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary"
        @click="emit('change-image')"
      >
        ویرایش تصویر پروفایل
        <IconPencil class="size-4" />
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary"
        @click="emit('remove-image')"
      >
        <IconTrash class="size-4" />
        حذف
      </button>
    </div>

    <div class="mt-4 border-t border-T-300" />

    <div class="[&>*:last-child]:border-b-0">
      <DashboardAccountMobileInfoField
        label="نام و نام خانوادگی"
        :value="`${profile.firstName} ${profile.lastName}`"
        @edit="emit('edit', 'name')"
      />
      <DashboardAccountMobileInfoField
        label="تاریخ تولد"
        :value="profile.birthDate"
        @edit="emit('edit', 'birthdate')"
      />
      <DashboardAccountMobileInfoField
        label="کد ملی"
        :value="profile.nationalId"
        add
        @edit="emit('edit', 'national-id')"
      />
      <DashboardAccountMobileInfoField
        label="ایمیل"
        :value="profile.email"
        ltr
        @edit="emit('edit', 'email')"
      />
      <DashboardAccountMobileInfoField
        label="شماره کارت"
        :value="profile.cardNumber"
        @edit="emit('edit', 'bank')"
      />
      <DashboardAccountMobileInfoField
        label="شماره شبا"
        :value="profile.shebaNumber"
        @edit="emit('edit', 'bank')"
      />
    </div>
  </section>
</template>
