<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { IconBell } from '@tabler/icons-vue'
import { apiErrorMessage } from '~/composables/useApi'
import type { NotifyChannel } from '~/composables/useProductNotify'
import { toastIcons } from '~/utils/toast'

const props = withDefaults(
  defineProps<{
    open: boolean
    slug: string
    stockId?: number | null
  }>(),
  { stockId: null },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const route = useRoute()
const api = useApi()
const token = useCookie<string | null>('auth_token')
const { notify } = useProductNotify()

interface ApiContact {
  mobile?: string | null
  email?: string | null
}

const contacts = ref<ApiContact>({ mobile: '', email: '' })
const loadingContacts = ref(false)
const submitting = ref(false)
const checked = ref<Set<string>>(new Set())

const authenticated = computed(() => !!token.value)

const options = computed(() => {
  const rows: Array<{ id: 'sms' | 'email', label: string }> = []
  if (contacts.value.mobile)
    rows.push({ id: 'sms', label: `از طریق پیامک به شماره ${contacts.value.mobile}` })
  if (contacts.value.email)
    rows.push({ id: 'email', label: `از طریق ایمیل به آدرس ${contacts.value.email}` })
  return rows
})

watch(
  () => props.open,
  async (open) => {
    if (!open) return

    contacts.value = { mobile: '', email: '' }
    checked.value = new Set()

    if (!token.value) return

    loadingContacts.value = true
    try {
      const res = await api.get<ApiContact>('/shop/user/profile/me')
      contacts.value = {
        mobile: res.data?.mobile ?? '',
        email: res.data?.email ?? '',
      }
    }
    catch {
      // Contacts stay empty; the user is asked to complete the profile.
    }
    finally {
      loadingContacts.value = false
      checked.value = new Set(options.value.map(option => option.id))
    }
  },
)

function toggle(id: string) {
  if (checked.value.has(id))
    checked.value.delete(id)
  else
    checked.value.add(id)
  checked.value = new Set(checked.value)
}

async function submit() {
  if (!authenticated.value) {
    emit('update:open', false)
    await navigateTo({ path: '/auth/login', query: { redirect: route.fullPath } })
    return
  }

  const picked = options.value.filter(option => checked.value.has(option.id)).map(option => option.id)

  if (!picked.length) {
    toast.error('لطفا حداقل یک روش اطلاع‌رسانی را انتخاب کنید.')
    return
  }

  const channel: NotifyChannel = picked.length > 1 ? 'both' : picked[0] as 'sms' | 'email'

  submitting.value = true
  try {
    const res = await notify({ slug: props.slug, channel, stockId: props.stockId })
    toast.success(res.message || 'اطلاع‌رسانی موجودی برای شما فعال شد.', { icon: toastIcons.bell })
    emit('update:open', false)
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت اطلاع‌رسانی موجودی انجام نشد.'))
  }
  finally {
    submitting.value = false
  }
}

const dialogShell
  = 'max-lg:top-auto! max-lg:bottom-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:rounded-b-none! max-lg:rounded-t-2xl! max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      class="max-w-[420px] gap-0 rounded-2xl p-0 lg:max-w-[420px]"
    >
      <!-- Header -->
      <div class="flex flex-col gap-3.5 px-6 pt-5">
        <div class="flex items-center justify-between">
          <UiDialogTitle class="text-[16px] font-bold text-T-900">اطلاع‌رسانی موجودی</UiDialogTitle>
          <UiDialogClose
            class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
            aria-label="بستن"
          />
        </div>
        <div class="h-px w-full bg-T-300" />
      </div>

      <!-- Body -->
      <div class="flex flex-col gap-7 px-6 py-6">
        <p class="text-[15px] leading-[24px] text-T-900">
          در صورت موجود شدن کالا، چطور می‌توانیم به شما اطلاع دهیم؟
        </p>

        <p v-if="!authenticated" class="text-[13px] leading-[22px] text-T-700">
          برای فعال‌سازی اطلاع‌رسانی موجودی ابتدا وارد حساب کاربری خود شوید. شماره موبایل و ایمیل
          از پروفایل شما خوانده می‌شود.
        </p>

        <p v-else-if="loadingContacts" class="text-[13px] leading-[22px] text-T-700">
          در حال دریافت اطلاعات حساب کاربری…
        </p>

        <p v-else-if="!options.length" class="text-[13px] leading-[22px] text-T-700">
          شماره موبایل یا ایمیل فعالی در حساب شما ثبت نشده است. برای دریافت اطلاع‌رسانی، ابتدا
          اطلاعات حساب خود را تکمیل کنید.
        </p>

        <div v-else class="flex flex-col gap-2.5">
          <label
            v-for="option in options"
            :key="option.id"
            class="flex cursor-pointer items-center justify-end gap-2"
          >
            <span class="order-1 text-[12.5px] text-T-900">{{ option.label }}</span>
            <UiCheckbox
              :model-value="checked.has(option.id)"
              class="order-2 size-[18px]"
              @update:model-value="toggle(option.id)"
            />
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between gap-6 px-6 pb-6">
        <button
          type="button"
          class="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-xl bg-R-300 text-[14px] font-bold text-white transition-colors hover:bg-R-400 disabled:opacity-60"
          :disabled="submitting || loadingContacts"
          @click="submit"
        >
          {{ authenticated ? 'ثبت' : 'ورود به حساب' }}
          <IconBell v-if="false" class="size-4" />
        </button>
        <button
          type="button"
          class="flex h-[42px] flex-1 items-center justify-center rounded-xl bg-T-300 text-[14px] font-semibold text-T-900 transition-colors hover:bg-T-400"
          @click="emit('update:open', false)"
        >
          انصراف
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
