<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { CheckoutAddress } from '~/data/checkout'
import { checkoutCurrentUser } from '~/data/checkout'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  created: [address: CheckoutAddress]
}>()

/**
 * The file's add-address wizard:
 * 1) pick the location on the map → 2) confirm the parsed address (unit/plaque/postal)
 * → 3) manual edit (province/city/address) → 4) who receives the order → 5) other person's details.
 */
type Step = 'location' | 'confirm' | 'edit' | 'recipient' | 'recipient-other'

const step = ref<Step>('location')

const chosen = ref<{ lat: number, lng: number } | null>(null)

const chosenCenter = computed<[number, number] | undefined>(() =>
  chosen.value ? [chosen.value.lat, chosen.value.lng] : undefined,
)

const form = ref({
  province: '',
  city: '',
  street: '',
  unit: '',
  plaque: '',
  postalCode: '',
  recipient: 'self' as 'self' | 'other',
  recipientName: '',
  recipientPhone: '',
})

const errors = ref<Record<string, string>>({})
const locating = ref(false)

const mapRef = ref<{ flyTo: (lat: number, lng: number) => void } | null>(null)
const searchQuery = ref('')
const searching = ref(false)

const dialogShell
  = 'max-lg:top-auto! max-lg:bottom-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:rounded-b-none! max-lg:rounded-t-[24px]! max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'

const title = computed(() => {
  if (step.value === 'location') return 'انتخاب موقعیت مکانی روی نقشه'
  if (step.value === 'recipient' || step.value === 'recipient-other') return 'ثبت اطلاعات آدرس'
  return 'تایید اطلاعات آدرس'
})

const submitLabel = computed(() => {
  if (step.value === 'location') return 'ثبت موقعیت'
  if (step.value === 'recipient' || step.value === 'recipient-other') return 'ثبت آدرس'
  return 'تایید و بعدی'
})

const addressLine = computed(() =>
  [form.value.province, form.value.city, form.value.street]
    .map(part => part.trim())
    .filter(Boolean)
    .join('، '),
)

watch(
  () => props.open,
  (open) => {
    if (!open) return
    step.value = 'location'
    chosen.value = null
    errors.value = {}
    searchQuery.value = ''
    form.value = {
      province: '',
      city: '',
      street: '',
      unit: '',
      plaque: '',
      postalCode: '',
      recipient: 'self',
      recipientName: '',
      recipientPhone: '',
    }
  },
)

function onPick(position: { lat: number, lng: number }) {
  chosen.value = position
}

async function searchLocation() {
  const query = searchQuery.value.trim()
  if (!query) return

  searching.value = true
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=fa&q=${encodeURIComponent(query)}`,
      { headers: { Accept: 'application/json' } },
    )
    const results = (await response.json()) as Array<{ lat: string, lon: string }>
    const first = results[0]
    if (!first) {
      toast.error('موقعیتی با این نشانی پیدا نشد.')
      return
    }
    mapRef.value?.flyTo(Number(first.lat), Number(first.lon))
  }
  catch {
    toast.error('جستجوی موقعیت انجام نشد؛ نقشه را دستی انتخاب کنید.')
  }
  finally {
    searching.value = false
  }
}

/** «ثبت موقعیت» — resolve the pin to an address (Nominatim reverse). */
async function confirmLocation() {
  const position = chosen.value ?? { lat: 36.4696, lng: 52.3507 }

  locating.value = true
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=fa&lat=${position.lat}&lon=${position.lng}`,
      { headers: { Accept: 'application/json' } },
    )
    const data = (await response.json()) as {
      display_name?: string
      address?: Record<string, string>
    }
    const parts = data.address ?? {}
    const clean = (value?: string) => (value ?? '').replace(/^(استان|شهر|شهرستان|بخش)\s+/, '').trim()

    form.value.province = clean(parts.state)
    form.value.city = clean(parts.city ?? parts.town ?? parts.village ?? parts.county)
    const streetParts = [
      parts.road ?? parts.pedestrian,
      parts.neighbourhood ?? parts.suburb,
      parts.quarter,
    ].filter((part): part is string => !!part)
    form.value.street = streetParts.length
      ? streetParts.join('، ')
      : clean(data.display_name)
  }
  catch {
    // Offline: keep whatever the user typed, the map position stands in.
  }
  finally {
    locating.value = false
  }

  step.value = 'confirm'
}

function validateAddress(requireAll = false) {
  const next: Record<string, string> = {}
  if (requireAll) {
    if (!form.value.province.trim()) next.province = 'استان را انتخاب کنید.'
    if (!form.value.city.trim()) next.city = 'شهر را انتخاب کنید.'
    if (!form.value.street.trim()) next.street = 'نشانی کامل را وارد کنید.'
  }
  if (!/^\d{10}$/.test(form.value.postalCode.trim())) next.postalCode = 'کد پستی باید ۱۰ رقم باشد.'
  errors.value = next
  return Object.keys(next).length === 0
}

function next() {
  if (step.value === 'location') {
    void confirmLocation()
    return
  }

  if (step.value === 'confirm') {
    if (!validateAddress()) {
      toast.error('کد پستی را کامل کنید.')
      return
    }
    step.value = 'recipient'
    return
  }

  if (step.value === 'edit') {
    if (!validateAddress(true)) {
      toast.error('اطلاعات آدرس را کامل کنید.')
      return
    }
    step.value = 'recipient'
    return
  }

  if (step.value === 'recipient') {
    submit()
    return
  }

  // recipient-other
  if (!form.value.recipientName.trim() || !/^0?9\d{9}$/.test(form.value.recipientPhone.replace(/\s|-/g, ''))) {
    toast.error('نام و شماره همراه تحویل‌گیرنده را کامل کنید.')
    return
  }
  submit()
}

function submit() {
  const isOther = form.value.recipient === 'other'
  const address: CheckoutAddress = {
    id: '',
    city: [form.value.province, form.value.city].filter(Boolean).join('، ') || 'آدرس جدید',
    address: [
      addressLine.value,
      form.value.plaque ? `پلاک ${form.value.plaque}` : '',
      form.value.unit ? `واحد ${form.value.unit}` : '',
    ].filter(Boolean).join('، '),
    postalCode: form.value.postalCode.trim(),
    recipient: isOther ? form.value.recipientName.trim() : checkoutCurrentUser.name,
    phone: isOther ? form.value.recipientPhone.trim() : checkoutCurrentUser.phone,
    province: form.value.province.trim(),
    cityName: form.value.city.trim(),
    street: form.value.street.trim(),
    plaque: form.value.plaque.trim() || undefined,
    unit: form.value.unit.trim() || undefined,
    lat: chosen.value?.lat,
    lng: chosen.value?.lng,
  }

  emit('created', address)
  emit('update:open', false)
}

const fieldClass
  = 'h-[50px] w-full rounded-[12px] border border-T-500 bg-T-50 px-4 text-[14px] text-T-900 outline-none transition-colors placeholder:text-T-600 focus:border-R-300'

const labelClass = 'text-[14px] text-T-900'
const errorClass = 'text-[11.25px] text-destructive'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      overlay-class="bg-[#1D1D1F]/45 backdrop-blur-[8px]"
      class="flex! max-h-[90dvh] flex-col overflow-hidden max-w-[544px] gap-0 rounded-[24px] border-0 p-0 lg:max-w-[544px]"
    >
      <!-- Header -->
      <div class="flex shrink-0 items-center justify-between gap-3 border-b border-T-400 px-6 py-6">
        <UiDialogTitle class="text-[16px] font-bold text-T-900">{{ title }}</UiDialogTitle>
        <UiDialogDescription class="sr-only">افزودن نشانی تحویل سفارش</UiDialogDescription>
        <UiDialogClose class="flex size-5 shrink-0 items-center justify-center" aria-label="بستن">
          <img src="/icons/cart/dialog-close.svg" alt="" class="size-5">
        </UiDialogClose>
      </div>

      <!-- ==================== 1) location ==================== -->
      <div v-if="step === 'location'" class="scrollbar-thin flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
        <UiTypography as="p" size="md" color="muted">موقعیت مکانی را روی نقشه مشخص کنید.</UiTypography>

        <form class="flex gap-2" @submit.prevent="searchLocation">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو ..."
            class="h-[44px] min-w-0 flex-1 rounded-[12px] border border-T-300 bg-T-200 px-4 text-[13px] text-T-900 outline-none placeholder:text-T-600 focus:border-R-300"
          >
          <button
            type="submit"
            class="flex h-[44px] w-[84px] shrink-0 items-center justify-center rounded-[12px] bg-R-300 text-[13px] font-bold text-white disabled:opacity-60"
            :disabled="searching"
          >
            {{ searching ? '…' : 'جستجو' }}
          </button>
        </form>

        <CheckoutMapPicker ref="mapRef" @pick="onPick" />
      </div>

      <!-- ==================== 2 & 3) confirm / edit ==================== -->
      <div v-else-if="step === 'confirm' || step === 'edit'" class="scrollbar-thin flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
        <CheckoutMapPicker compact :interactive="false" :center="chosenCenter" />

        <div class="flex items-center gap-3 rounded-[12px] border border-T-400 bg-T-200 px-3 py-3.5">
          <img src="/icons/cart/addr-map.svg" alt="" class="size-5 shrink-0">
          <UiTypography as="span" size="lg" color="muted" class="min-w-0 flex-1 truncate">
            {{ addressLine || 'موقعیت انتخاب‌شده روی نقشه' }}
          </UiTypography>
        </div>

        <!-- 2) just unit/plaque/postal + manual-edit notice -->
        <template v-if="step === 'confirm'">
          <div class="flex flex-wrap items-center gap-2 rounded-[12px] bg-R-10 px-5 py-3">
            <button type="button" class="flex items-center gap-1 text-R-300" @click="step = 'edit'">
              <UiTypography as="span" size="md" weight="medium" color="primary">ویرایش آدرس</UiTypography>
              <img src="/icons/cart/pen.svg" alt="" class="size-4">
            </button>
            <UiTypography as="span" size="md" class="leading-[18px]">
              اگر آدرس به درستی انتخاب نشده می‌توانید به صورت دستی ویرایش کنید.
            </UiTypography>
          </div>

          <div class="flex gap-4">
            <label class="flex min-w-0 flex-1 flex-col gap-1.5">
              <span :class="labelClass">واحد <span class="text-T-600">(اختیاری)</span></span>
              <input v-model="form.unit" :class="fieldClass" type="text">
            </label>

            <label class="flex min-w-0 flex-1 flex-col gap-1.5">
              <span :class="labelClass">پلاک</span>
              <input v-model="form.plaque" :class="fieldClass" type="text">
            </label>
          </div>
        </template>

        <!-- 3) manual edit: province/city/address too -->
        <template v-else>
          <div class="flex gap-4">
            <label class="flex min-w-0 flex-1 flex-col gap-1.5">
              <span :class="labelClass">استان</span>
              <input v-model="form.province" :class="fieldClass" type="text" placeholder="مازندران">
              <span v-if="errors.province" :class="errorClass">{{ errors.province }}</span>
            </label>

            <label class="flex min-w-0 flex-1 flex-col gap-1.5">
              <span :class="labelClass">شهر</span>
              <input v-model="form.city" :class="fieldClass" type="text" placeholder="آمل">
              <span v-if="errors.city" :class="errorClass">{{ errors.city }}</span>
            </label>
          </div>

          <label class="flex flex-col gap-1.5">
            <span :class="labelClass">نشانی کامل</span>
            <input v-model="form.street" :class="fieldClass" type="text" placeholder="خیابان، کوچه و نشانی">
            <span v-if="errors.street" :class="errorClass">{{ errors.street }}</span>
          </label>

          <div class="flex gap-4">
            <label class="flex min-w-0 flex-1 flex-col gap-1.5">
              <span :class="labelClass">واحد <span class="text-T-600">(اختیاری)</span></span>
              <input v-model="form.unit" :class="fieldClass" type="text">
            </label>

            <label class="flex min-w-0 flex-1 flex-col gap-1.5">
              <span :class="labelClass">پلاک</span>
              <input v-model="form.plaque" :class="fieldClass" type="text">
            </label>
          </div>
        </template>

        <label class="flex flex-col gap-1.5">
          <span :class="labelClass">کدپستی</span>
          <input
            v-model="form.postalCode"
            :class="fieldClass"
            type="text"
            inputmode="numeric"
            placeholder="10 رقم کدپستی رو کامل وارد کنید"
          >
          <span v-if="errors.postalCode" :class="errorClass">{{ errors.postalCode }}</span>
        </label>
      </div>

      <!-- ==================== 4 & 5) who receives it ==================== -->
      <div v-else class="scrollbar-thin flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
        <CheckoutMapPicker compact :interactive="false" :center="chosenCenter" />

        <div class="flex items-center gap-3 rounded-[12px] border border-T-400 bg-T-200 px-3 py-3.5">
          <img src="/icons/cart/addr-map.svg" alt="" class="size-5 shrink-0">
          <UiTypography as="span" size="lg" color="muted" class="min-w-0 flex-1 truncate">
            {{ addressLine || 'موقعیت انتخاب‌شده روی نقشه' }}
          </UiTypography>
        </div>

        <div class="flex flex-col gap-4">
          <UiTypography as="p" size="lg">
            سفارش‌های این آدرس را چه کسی تحویل می‌گیرد:
          </UiTypography>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              role="radio"
              :aria-checked="form.recipient === 'self'"
              class="flex h-[40px] items-center gap-2 rounded-[8px] border px-3"
              :class="form.recipient === 'self' ? 'border-R-300 text-R-300' : 'border-T-400 text-T-900'"
              @click="form.recipient = 'self'; step = 'recipient'"
            >
              <img
                :src="form.recipient === 'self'
                  ? '/icons/cart/radio-selected.svg'
                  : '/icons/cart/radio-unselected.svg'"
                alt=""
                class="size-4 shrink-0"
              >
              <UiTypography as="span" size="md" weight="medium" :color="form.recipient === 'self' ? 'primary' : 'default'">
                تحویل به خودم
              </UiTypography>
            </button>

            <button
              type="button"
              role="radio"
              :aria-checked="form.recipient === 'other'"
              class="flex h-[40px] items-center gap-2 rounded-[8px] border px-3"
              :class="form.recipient === 'other' ? 'border-R-300 text-R-300' : 'border-T-400 text-T-900'"
              @click="form.recipient = 'other'; step = 'recipient-other'"
            >
              <img
                :src="form.recipient === 'other'
                  ? '/icons/cart/radio-selected.svg'
                  : '/icons/cart/radio-unselected.svg'"
                alt=""
                class="size-4 shrink-0"
              >
              <UiTypography as="span" size="md" weight="medium" :color="form.recipient === 'other' ? 'primary' : 'default'">
                تحویل به شخص دیگر
              </UiTypography>
            </button>
          </div>
        </div>

        <!-- 5) other person's details -->
        <div v-if="step === 'recipient-other'" class="flex flex-col gap-4 lg:flex-row">
          <label class="flex min-w-0 flex-1 flex-col gap-1.5">
            <span :class="labelClass">نام و نام خانوادگی تحویل‌گیرنده</span>
            <input v-model="form.recipientName" :class="fieldClass" type="text">
          </label>

          <label class="flex min-w-0 flex-1 flex-col gap-1.5">
            <span :class="labelClass">شماره همراه تحویل‌گیرنده</span>
            <input v-model="form.recipientPhone" :class="fieldClass" type="tel" inputmode="numeric" placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷">
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex shrink-0 items-center justify-between gap-3 px-6 py-6">
        <button
          v-if="step !== 'location'"
          type="button"
          class="flex h-[42px] w-[182px] shrink-0 items-center justify-center rounded-[12px] bg-T-300 transition-colors hover:bg-T-400"
          @click="emit('update:open', false)"
        >
          <UiTypography as="span" size="lg" weight="bold">انصراف</UiTypography>
        </button>

        <button
          type="button"
          class="flex h-[42px] shrink-0 items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-R-400 disabled:opacity-60"
          :class="step === 'location' ? 'w-[480px] flex-1' : 'w-[185px]'"
          :disabled="locating"
          @click="next"
        >
          <UiTypography as="span" size="lg" weight="bold" color="white">
            {{ locating ? '…' : submitLabel }}
          </UiTypography>
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
