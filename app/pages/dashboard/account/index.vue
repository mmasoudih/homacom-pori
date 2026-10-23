<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { LegalInfo } from '~/data/account'
import { apiErrorMessage } from '~/composables/useApi'

useHead({
  title: 'اطلاعات حساب کاربری | هماکام',
})

type EditField = 'name' | 'birthdate' | 'national-id' | 'email' | 'bank'

const {
  profile,
  saveName: updateName,
  saveEmail: updateEmail,
  saveNationalId: updateNationalId,
  saveBirthdate: updateBirthdate,
  saveCompany: updateCompany,
  saveBank: updateBank,
  uploadAvatar,
  requestPasswordCode,
  savePassword: updatePassword,
} = useUserProfile()


const image = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadingAvatar = ref(false)

watch(
  () => profile.value.avatar,
  (avatar) => {
    if (!uploadingAvatar.value) image.value = avatar ?? null
  },
  { immediate: true },
)

const passwordCodeSent = ref(false)
const sendingPasswordCode = ref(false)

const open = reactive({
  name: false,
  birthdate: false,
  nationalId: false,
  email: false,
  bank: false,
  legal: false,
  password: false,
})

watch(
  () => open.password,
  (isOpen) => {
    if (!isOpen) passwordCodeSent.value = false
  },
)

function pickImage() {
  fileInput.value?.click()
}

async function onImageChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  const preview = URL.createObjectURL(file)
  image.value = preview
  uploadingAvatar.value = true

  try {
    const uploaded = await uploadAvatar(file)
    image.value = uploaded ?? null
    toast.success('تصویر پروفایل به‌روزرسانی شد.')
  }
  catch (err) {
    image.value = profile.value.avatar ?? null
    toast.error(apiErrorMessage(err, 'بارگذاری تصویر پروفایل انجام نشد.'))
  }
  finally {
    uploadingAvatar.value = false
    URL.revokeObjectURL(preview)
  }
}

function removeImage() {
  toast.info('حذف تصویر پروفایل از این صفحه هنوز توسط سرور پشتیبانی نمی‌شود.')
}

function onEdit(field: EditField) {
  if (field === 'name') open.name = true
  else if (field === 'birthdate') open.birthdate = true
  else if (field === 'national-id') open.nationalId = true
  else if (field === 'email') open.email = true
  else open.bank = true
}

async function saveName(payload: { firstName: string, lastName: string }) {
  try {
    await updateName(payload)
    toast.success('نام و نام خانوادگی با موفقیت ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت نام و نام خانوادگی انجام نشد.'))
  }
}

async function saveBirthdate(payload: { year: string, month: string, day: string, birthDate: string }) {
  try {
    await updateBirthdate(payload)
    toast.success('تاریخ تولد با موفقیت ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت تاریخ تولد انجام نشد.'))
  }
}

async function saveNationalId(payload: { nationalId: string }) {
  try {
    await updateNationalId(payload)
    toast.success('کد ملی با موفقیت ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت کد ملی انجام نشد.'))
  }
}

async function saveEmail(payload: { email: string }) {
  try {
    await updateEmail(payload)
    toast.success('ایمیل با موفقیت ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت ایمیل انجام نشد.'))
  }
}

async function saveBank(payload: { cardNumber: string, shebaNumber: string }) {
  try {
    await updateBank(payload)
    toast.success('اطلاعات حساب بانکی با موفقیت ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت اطلاعات حساب بانکی انجام نشد.'))
  }
}

async function saveLegal(payload: LegalInfo) {
  try {
    await updateCompany(payload)
    toast.success('اطلاعات حقوقی با موفقیت ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت اطلاعات حقوقی انجام نشد.'))
  }
}

async function sendPasswordCode() {
  sendingPasswordCode.value = true
  try {
    await requestPasswordCode()
    passwordCodeSent.value = true
    toast.success('کد تایید به شماره موبایل شما ارسال شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ارسال کد تایید انجام نشد.'))
  }
  finally {
    sendingPasswordCode.value = false
  }
}

async function savePassword(payload: { code: string, password: string }) {
  try {
    await updatePassword(payload)
    passwordCodeSent.value = false
    toast.success('رمز عبور با موفقیت ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت رمز عبور انجام نشد.'))
  }
}
</script>

<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
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
      :code-sent="passwordCodeSent"
      :sending-code="sendingPasswordCode"
      @send-code="sendPasswordCode"
      @submit="savePassword"
    />
  </div>
</template>
