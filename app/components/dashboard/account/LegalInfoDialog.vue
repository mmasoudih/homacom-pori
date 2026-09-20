<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { LegalInfo } from '~/data/account'
import { citiesByProvince, provinces } from '~/data/account'

const props = defineProps<{
  open: boolean
  value: LegalInfo | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [payload: LegalInfo]
}>()

const form = reactive<LegalInfo>({
  organizationName: '',
  nationalId: '',
  registrationId: '',
  phone: '',
  city: '',
  province: '',
  postalAddress: '',
})

const cities = computed(() => (form.province ? citiesByProvince[form.province] ?? [] : []))

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
      })
    }
  },
  { immediate: true },
)

watch(
  () => form.province,
  () => {
    if (!cities.value.some(city => city.value === form.city)) form.city = ''
  },
)

function close() {
  emit('update:open', false)
}

function submit() {
  if (!form.organizationName.trim() || !form.nationalId.trim()) return
  emit('submit', { ...form })
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="gap-6 rounded-2xl p-6 max-sm:top-auto max-sm:bottom-0 max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:border-x-0 max-sm:border-b-0 max-sm:data-[state=open]:slide-in-from-bottom max-sm:data-[state=closed]:slide-out-to-bottom sm:max-w-[560px]">
      <div class="border-b border-T-300 pb-4">
        <DialogTitle class="text-start text-[16px] font-bold text-T-900">
          افزودن اطلاعات حقوقی
        </DialogTitle>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <span class="text-[13px] text-T-800">شماره تلفن ثابت</span>
          <Input v-model="form.phone" inputmode="tel" dir="ltr" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">شهر محل دفتر مرکزی</span>
          <div class="relative">
            <select
              v-model="form.city"
              class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[13px] text-T-800 outline-none focus:border-primary"
            >
              <option value="" disabled>انتخاب شهر</option>
              <option v-for="o in cities" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">نام استان</span>
          <div class="relative">
            <select
              v-model="form.province"
              class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[13px] text-T-800 outline-none focus:border-primary"
            >
              <option value="" disabled>انتخاب استان</option>
              <option v-for="o in provinces" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
          </div>
        </div>

        <div class="flex flex-col gap-2 sm:col-span-2">
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
