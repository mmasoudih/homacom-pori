<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { AccountProfile, LegalInfo } from '~/data/account'
import { accountProfile } from '~/data/account'

useHead({
  title: 'اطلاعات حساب کاربری | هماکام',
})

type EditField = 'name' | 'birthdate' | 'national-id' | 'email' | 'bank'

const profile = ref<AccountProfile>({
  ...accountProfile,
  legal: accountProfile.legal ? { ...accountProfile.legal } : null,
})

const image = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const open = reactive({
  name: false,
  birthdate: false,
  nationalId: false,
  email: false,
  bank: false,
  legal: false,
  password: false,
})

function pickImage() {
  fileInput.value?.click()
}

function onImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) image.value = URL.createObjectURL(file)
  ;(event.target as HTMLInputElement).value = ''
}

function removeImage() {
  image.value = null
  toast.success('تصویر پروفایل حذف شد.')
}

function onEdit(field: EditField) {
  if (field === 'name') open.name = true
  else if (field === 'birthdate') open.birthdate = true
  else if (field === 'national-id') open.nationalId = true
  else if (field === 'email') open.email = true
  else open.bank = true
}

function saveName(payload: { firstName: string, lastName: string }) {
  profile.value.firstName = payload.firstName
  profile.value.lastName = payload.lastName
  toast.success('نام و نام خانوادگی با موفقیت ثبت شد.')
}

function saveBirthdate(payload: { year: string, month: string, day: string, birthDate: string }) {
  profile.value.birthYear = payload.year
  profile.value.birthMonth = payload.month
  profile.value.birthDay = payload.day
  profile.value.birthDate = payload.birthDate
  toast.success('تاریخ تولد با موفقیت ثبت شد.')
}

function saveNationalId(payload: { nationalId: string }) {
  profile.value.nationalId = payload.nationalId
  toast.success('کد ملی با موفقیت ثبت شد.')
}

function saveEmail(payload: { email: string }) {
  profile.value.email = payload.email
  toast.success('ایمیل با موفقیت ثبت شد.')
}

function saveBank(payload: { cardNumber: string, shebaNumber: string }) {
  profile.value.cardNumber = payload.cardNumber
  profile.value.shebaNumber = payload.shebaNumber
  toast.success('اطلاعات حساب بانکی با موفقیت ثبت شد.')
}

function saveLegal(payload: LegalInfo) {
  profile.value.legal = { ...payload }
  toast.success('اطلاعات حقوقی با موفقیت ثبت شد.')
}

function savePassword(_payload: { password: string }) {
  profile.value.hasPassword = true
  toast.success('رمز عبور با موفقیت ثبت شد.')
}
</script>

<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png"
      class="hidden"
      @change="onImageChange"
    >

    <DashboardAccountShell>
      <DashboardAccountPersonalInfoCard
        :profile="profile"
        :image="image"
        @edit="onEdit"
        @change-image="pickImage"
        @remove-image="removeImage"
      />
      <DashboardAccountLegalCard :profile="profile" @register="open.legal = true" />
      <DashboardAccountPasswordCard :profile="profile" @register="open.password = true" />
    </DashboardAccountShell>

    <DashboardAccountMobileShell title="اطلاعات حساب" back-to="/dashboard">
      <DashboardAccountMobilePersonalInfoCard
        :profile="profile"
        :image="image"
        @edit="onEdit"
        @change-image="pickImage"
        @remove-image="removeImage"
      />
      <DashboardAccountMobileLegalCard :profile="profile" @register="open.legal = true" />
      <DashboardAccountMobilePasswordCard :profile="profile" @register="open.password = true" />
    </DashboardAccountMobileShell>

    <DashboardAccountNameDialog
      v-model:open="open.name"
      :first-name="profile.firstName"
      :last-name="profile.lastName"
      @submit="saveName"
    />
    <DashboardAccountBirthdateDialog
      v-model:open="open.birthdate"
      :year="profile.birthYear"
      :month="profile.birthMonth"
      :day="profile.birthDay"
      @submit="saveBirthdate"
    />
    <DashboardAccountNationalIdDialog
      v-model:open="open.nationalId"
      :national-id="profile.nationalId"
      @submit="saveNationalId"
    />
    <DashboardAccountEmailDialog
      v-model:open="open.email"
      :email="profile.email"
      @submit="saveEmail"
    />
    <DashboardAccountBankCardDialog
      v-model:open="open.bank"
      :card-number="profile.cardNumber"
      :sheba-number="profile.shebaNumber"
      @submit="saveBank"
    />
    <DashboardAccountLegalInfoDialog
      v-model:open="open.legal"
      :value="profile.legal"
      @submit="saveLegal"
    />
    <DashboardAccountPasswordDialog
      v-model:open="open.password"
      @submit="savePassword"
    />
  </div>
</template>
