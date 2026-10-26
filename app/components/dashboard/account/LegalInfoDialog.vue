<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { IconChevronDown } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { LegalInfo } from '~/data/account'
import { useCities, useStates } from '~/composables/useAddresses'

const props = defineProps<{
  open: boolean
  value: LegalInfo | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [payload: LegalInfo]
}>()

const { states } = useStates()

const form = reactive<LegalInfo>({
  organizationName: '',
  nationalId: '',
  registrationId: '',
  phone: '',
  city: '',
  province: '',
  postalAddress: '',
  economicCode: '',
  ceo: '',
  stateId: undefined,
  cityId: undefined,
  establishmentDate: undefined,
})

const stateId = computed<number | null>(() => form.stateId ?? null)
const { cities } = useCities(stateId)

watch(
  () => props.open,
  (open) => {
    if (open) {
      Object.assign(form, {
        organizationName: props.value?.organizationName ?? '',
        nationalId: props.value?.nationalId ?? '',
        registrationId: props.value?.registrationId ?? '',
        phone: props.value?.phone ?? '',
        city: props.value?.city ?? '',
        province: props.value?.province ?? '',
        postalAddress: props.value?.postalAddress ?? '',
        economicCode: props.value?.economicCode ?? '',
        ceo: props.value?.ceo ?? '',
        stateId: props.value?.stateId,
        cityId: props.value?.cityId,
        establishmentDate: props.value?.establishmentDate,
      })
    }
  },
  { immediate: true },
)

// Resolve names → ids when the payload predates the id fields.
watch(
  [states, () => props.open],
  ([items, open]) => {
    if (!open || form.stateId != null || !form.province) return
    const match = items.find(state => state.name === form.province)
    if (match) form.stateId = match.id
  },
  { immediate: true },
)

watch(
  [cities, () => props.open],
  ([items, open]) => {
    if (!open || form.cityId != null || !form.city) return
    const match = items.find(city => city.name === form.city)
    if (match) form.cityId = match.id
  },
  { immediate: true },
)

watch(
  () => form.stateId,
  (next, previous) => {
    form.province = states.value.find(state => state.id === next)?.name ?? ''
    if (previous != null && previous !== next) {
      form.cityId = undefined
      form.city = ''
    }
  },
)

watch(
  () => form.cityId,
  (next) => {
    form.city = cities.value.find(city => city.id === next)?.name ?? ''
  },
)

function close() {
  emit('update:open', false)
}

function submit() {
  if (!form.organizationName.trim() || !form.nationalId.trim() || !form.registrationId.trim()
    || !form.economicCode?.trim() || !form.ceo?.trim() || !form.phone.trim()) return
  emit('submit', { ...form })
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="gap-6 rounded-2xl p-6 max-lg:top-auto max-lg:bottom-0 max-lg:max-w-none max-lg:translate-y-0 max-lg:rounded-b-none max-lg:rounded-t-3xl max-lg:border-x-0 max-lg:border-b-0 max-lg:data-[state=open]:slide-in-from-bottom max-lg:data-[state=closed]:slide-out-to-bottom lg:max-w-[560px]">
      <div class="border-b border-T-300 pb-4">
        <DialogTitle class="text-start text-[16px] font-bold text-T-900">
          افزودن اطلاعات حقوقی
        </DialogTitle>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">نام سازمان</span>
          <Input v-model="form.organizationName" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">شناسه ملی</span>
          <Input v-model="form.nationalId" inputmode="numeric" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">شناسه ثبت</span>
          <Input v-model="form.registrationId" inputmode="numeric" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">کد اقتصادی</span>
          <Input v-model="form.economicCode" inputmode="numeric" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">نام مدیرعامل</span>
          <Input v-model="form.ceo" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">شماره تلفن ثابت</span>
          <Input v-model="form.phone" inputmode="tel" dir="ltr" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">شهر محل دفتر مرکزی</span>
          <div class="relative">
            <select
              v-model="form.cityId"
              class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[13px] text-T-800 outline-none focus:border-primary"
            >
              <option :value="undefined" disabled>انتخاب شهر</option>
              <option v-for="o in cities" :key="o.id" :value="o.id">{{ o.name }}</option>
            </select>
            <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">نام استان</span>
          <div class="relative">
            <select
              v-model="form.stateId"
              class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[13px] text-T-800 outline-none focus:border-primary"
            >
              <option :value="undefined" disabled>انتخاب استان</option>
              <option v-for="o in states" :key="o.id" :value="o.id">{{ o.name }}</option>
            </select>
            <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
          </div>
        </div>

        <div class="flex flex-col gap-2 lg:col-span-2">
          <span class="text-[13px] text-T-800">آدرس پستی</span>
          <Input v-model="form.postalAddress" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>
      </div>

      <div class="flex gap-3">
        <Button variant="secondary" class="h-11 flex-1 rounded-xl" @click="close">انصراف</Button>
        <Button class="h-11 flex-1 rounded-xl" @click="submit">ثبت</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
