<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { birthDays, birthMonths, birthYears, formatBirthDate } from '~/data/account'

const props = defineProps<{
  open: boolean
  year: string
  month: string
  day: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [payload: { year: string, month: string, day: string, birthDate: string }]
}>()

const year = ref('')
const month = ref('')
const day = ref('')

watch(
  () => props.open,
  (open) => {
    if (open) {
      year.value = props.year
      month.value = props.month
      day.value = props.day
    }
  },
  { immediate: true },
)

function close() {
  emit('update:open', false)
}

function submit() {
  if (!year.value || !month.value || !day.value) return
  emit('submit', {
    year: year.value,
    month: month.value,
    day: day.value,
    birthDate: formatBirthDate(year.value, month.value, day.value),
  })
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="rounded-2xl p-6 max-sm:top-auto max-sm:bottom-0 max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:border-x-0 max-sm:border-b-0 max-sm:data-[state=open]:slide-in-from-bottom max-sm:data-[state=closed]:slide-out-to-bottom sm:max-w-[380px]">
      <DialogTitle class="text-start text-[15px] font-bold text-T-900">
        تاریخ تولد
      </DialogTitle>

      <div class="flex gap-3">
        <div class="flex flex-1 flex-col gap-2">
          <span class="text-[13px] text-T-800">سال</span>
          <div class="relative">
            <select
              v-model="year"
              class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[13px] text-T-800 outline-none focus:border-primary"
            >
              <option value="" disabled>انتخاب سال</option>
              <option v-for="o in birthYears" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
          </div>
        </div>

        <div class="flex flex-1 flex-col gap-2">
          <span class="text-[13px] text-T-800">ماه</span>
          <div class="relative">
            <select
              v-model="month"
              class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[13px] text-T-800 outline-none focus:border-primary"
            >
              <option value="" disabled>انتخاب ماه</option>
              <option v-for="o in birthMonths" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
          </div>
        </div>

        <div class="flex flex-1 flex-col gap-2">
          <span class="text-[13px] text-T-800">روز</span>
          <div class="relative">
            <select
              v-model="day"
              class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[13px] text-T-800 outline-none focus:border-primary"
            >
              <option value="" disabled>انتخاب روز</option>
              <option v-for="o in birthDays" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <Button variant="secondary" class="h-11 flex-1 rounded-xl" @click="close">انصراف</Button>
        <Button class="h-11 flex-1 rounded-xl" @click="submit">ثبت</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
