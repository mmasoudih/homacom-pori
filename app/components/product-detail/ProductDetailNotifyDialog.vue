<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
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
      overlay-class="bg-[#1D1D1F]/45"
      :show-close-button="false"
      class="flex max-w-[419px] flex-col gap-8 rounded-3xl border-0 bg-white p-0 shadow-none lg:h-[348px] lg:max-w-[419px]"
    >
      <!-- Header -->
      <div class="flex h-[72px] shrink-0 flex-col">
        <div class="flex h-[71px] items-center gap-3 px-6">
          <div class="flex min-w-0 flex-1 flex-col gap-[5px]">
            <UiDialogTitle as-child>
              <UiTypography as="h2" size="xl" weight="bold">
                اطلاع‌رسانی موجودی
              </UiTypography>
            </UiDialogTitle>
          </div>

          <UiDialogClose
            class="flex size-5 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
            aria-label="بستن"
          >
            <img src="/icons/product-detail/xmark-20.svg" alt="" class="size-5">
          </UiDialogClose>
        </div>

        <div class="mx-6 h-px bg-T-400" />
      </div>

      <!-- Body -->
      <div class="flex flex-col gap-7 px-6 lg:min-h-[122px]">
        <UiTypography as="p" size="xl">
          در صورت موجود شدن کالا، چطور می‌توانیم به شما اطلاع دهیم؟
        </UiTypography>

        <UiTypography v-if="!authenticated" as="p" size="md" color="muted" class="leading-[20px]">
          برای فعال‌سازی اطلاع‌رسانی موجودی ابتدا وارد حساب کاربری خود شوید. شماره موبایل و ایمیل
          از پروفایل شما خوانده می‌شود.
        </UiTypography>

        <UiTypography v-else-if="loadingContacts" as="p" size="md" color="muted" class="leading-[20px]">
          در حال دریافت اطلاعات حساب کاربری…
        </UiTypography>

        <UiTypography v-else-if="!options.length" as="p" size="md" color="muted" class="leading-[20px]">
          شماره موبایل یا ایمیل فعالی در حساب شما ثبت نشده است. برای دریافت اطلاع‌رسانی، ابتدا
          اطلاعات حساب خود را تکمیل کنید.
        </UiTypography>

        <div v-else class="flex flex-col gap-2">
          <button
            v-for="option in options"
            :key="option.id"
            type="button"
            class="flex items-center gap-1.5 text-start"
            role="checkbox"
            :aria-checked="checked.has(option.id)"
            @click="toggle(option.id)"
          >
            <img
              :src="checked.has(option.id)
                ? '/icons/product-detail/check-square-18-red.svg'
                : '/icons/product-detail/check-square-18-gray.svg'"
              alt=""
              class="size-[18px] shrink-0"
            >
            <UiTypography as="span" size="md" class="min-w-0 flex-1 text-start">
              {{ option.label }}
            </UiTypography>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex h-[90px] shrink-0 items-center gap-6 px-8 py-6">
        <button
          type="button"
          class="flex h-[42px] min-w-0 flex-1 items-center justify-center rounded-xl bg-T-300 px-[18px] transition-colors hover:bg-T-400"
          @click="emit('update:open', false)"
        >
          <UiTypography size="lg" weight="semibold">انصراف</UiTypography>
        </button>
        <button
          type="button"
          class="flex h-[42px] min-w-0 flex-1 items-center justify-center rounded-xl bg-R-300 px-[18px] transition-colors hover:bg-R-400 disabled:opacity-60"
          :disabled="submitting || loadingContacts"
          @click="submit"
        >
          <UiTypography size="lg" weight="bold" color="white">
            {{ authenticated ? 'ثبت' : 'ورود به حساب' }}
          </UiTypography>
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
