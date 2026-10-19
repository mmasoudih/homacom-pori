<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Address } from '~/data/addresses'
import type { AddressInput } from '~/composables/useAddresses'
import { MOBILE_MAX_LENGTH, sanitizeMobileInput } from '~/utils/auth'

const props = withDefaults(defineProps<{
  open: boolean
  address?: Address | null
}>(), {
  address: null,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [payload: AddressInput, id?: string]
}>()

const { states } = useStates()
const stateId = ref<number | null>(null)
const cityId = ref<number | null>(null)
const { cities } = useCities(stateId)

const form = ref({
  title: '',
  addressLine: '',
  postalCode: '',
  mobile: '',
  nickname: '',
  codeMelli: '',
})

watch(
  () => props.open,
  (open) => {
    if (!open) return
    const address = props.address
    form.value = {
      title: address?.title ?? '',
      addressLine: address?.addressLine ?? '',
      postalCode: address?.postalCode ?? '',
      mobile: address?.mobile ?? '',
      nickname: address?.nickname ?? '',
      codeMelli: address?.codeMelli ?? '',
    }
    stateId.value = address?.stateId ?? null
    cityId.value = address?.cityId ?? null
  },
)

watch(stateId, () => {
  if (props.address?.stateId === stateId.value) return
  cityId.value = null
})

function close() {
  emit('update:open', false)
}

function submit() {
  if (!form.value.title.trim() || !stateId.value || !cityId.value
    || !form.value.addressLine.trim() || !form.value.mobile.trim()
    || !form.value.nickname.trim() || !form.value.codeMelli.trim()) {
    toast.error('لطفا عنوان، استان، شهر، آدرس، موبایل، نام تحویل‌گیرنده و کد ملی را کامل کنید.')
    return
  }

  emit('submit', {
    title: form.value.title.trim(),
    state: stateId.value,
    city: cityId.value,
    address: form.value.addressLine.trim(),
    lat: props.address?.lat ?? '35.6892',
    lng: props.address?.lng ?? '51.389',
    mobile: form.value.mobile.trim(),
    nickname: form.value.nickname.trim(),
    code_melli: form.value.codeMelli.trim(),
    zip_code: form.value.postalCode.trim() || null,
  }, props.address?.id)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-h-[90dvh] overflow-y-auto rounded-[20px] p-6 lg:max-w-[560px]">
      <DialogTitle class="text-start">
        <UiTypography as="span" size="xl" weight="bold" color="default">
          {{ address ? 'ویرایش آدرس' : 'افزودن آدرس جدید' }}
        </UiTypography>
      </DialogTitle>

      <div class="mt-5 flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <UiTypography as="span" size="lg" weight="regular" color="default">عنوان آدرس</UiTypography>
          <Input v-model="form.title" placeholder="خانه، محل کار ..." class="h-11 rounded-xl border-T-400 text-[13px] shadow-none" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-2">
            <UiTypography as="span" size="lg" weight="regular" color="default">استان</UiTypography>
            <select
              v-model.number="stateId"
              class="h-11 w-full rounded-xl border border-T-400 bg-T-50 px-3 text-[13px] text-T-800 outline-none focus:border-primary"
            >
              <option :value="null" disabled>انتخاب استان</option>
              <option v-for="state in states" :key="state.id" :value="state.id">{{ state.name }}</option>
            </select>
          </div>

          <div class="flex flex-col gap-2">
            <UiTypography as="span" size="lg" weight="regular" color="default">شهر</UiTypography>
            <select
              v-model.number="cityId"
              :disabled="!stateId"
              class="h-11 w-full rounded-xl border border-T-400 bg-T-50 px-3 text-[13px] text-T-800 outline-none focus:border-primary disabled:opacity-60"
            >
              <option :value="null" disabled>انتخاب شهر</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <UiTypography as="span" size="lg" weight="regular" color="default">نشانی</UiTypography>
          <Textarea v-model="form.addressLine" class="min-h-[90px] rounded-xl border-T-400 text-[13px] shadow-none" placeholder="خیابان، پلاک، واحد" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-2">
            <UiTypography as="span" size="lg" weight="regular" color="default">کد پستی</UiTypography>
            <Input v-model="form.postalCode" dir="ltr" inputmode="numeric" class="h-11 rounded-xl border-T-400 text-[13px] shadow-none" />
          </div>
          <div class="flex flex-col gap-2">
            <UiTypography as="span" size="lg" weight="regular" color="default">شماره موبایل</UiTypography>
            <Input
              :model-value="form.mobile"
              dir="ltr"
              inputmode="numeric"
              :maxlength="MOBILE_MAX_LENGTH"
              class="h-11 rounded-xl border-T-400 text-[13px] shadow-none"
              @update:model-value="form.mobile = sanitizeMobileInput($event)"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-2">
            <UiTypography as="span" size="lg" weight="regular" color="default">نام تحویل‌گیرنده</UiTypography>
            <Input v-model="form.nickname" class="h-11 rounded-xl border-T-400 text-[13px] shadow-none" />
          </div>
          <div class="flex flex-col gap-2">
            <UiTypography as="span" size="lg" weight="regular" color="default">کد ملی</UiTypography>
            <Input v-model="form.codeMelli" dir="ltr" inputmode="numeric" class="h-11 rounded-xl border-T-400 text-[13px] shadow-none" />
          </div>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <Button variant="secondary" class="h-[42px] flex-1 rounded-xl" @click="close">انصراف</Button>
        <Button class="h-[42px] flex-1 rounded-xl" @click="submit">ثبت آدرس</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
