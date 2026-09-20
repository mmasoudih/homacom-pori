<script setup lang="ts">
import { IconInfoCircle } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  open: boolean
  cardNumber: string
  shebaNumber: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [payload: { cardNumber: string, shebaNumber: string }]
}>()

const form = reactive({ cardNumber: '', shebaNumber: '' })

watch(
  () => props.open,
  (open) => {
    if (open) {
      form.cardNumber = props.cardNumber
      form.shebaNumber = props.shebaNumber
    }
  },
  { immediate: true },
)

function close() {
  emit('update:open', false)
}

function submit() {
  if (!form.cardNumber.trim() || !form.shebaNumber.trim()) return
  emit('submit', { cardNumber: form.cardNumber.trim(), shebaNumber: form.shebaNumber.trim() })
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="gap-6 rounded-2xl p-6 max-sm:top-auto max-sm:bottom-0 max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:border-x-0 max-sm:border-b-0 max-sm:data-[state=open]:slide-in-from-bottom max-sm:data-[state=closed]:slide-out-to-bottom sm:max-w-[380px]">
      <div class="border-b border-T-300 pb-4">
        <DialogTitle class="text-start text-[16px] font-bold text-T-900">
          شماره کارت
        </DialogTitle>
      </div>

      <p class="text-start text-[12.5px] leading-6 text-T-600">
        اطلاعات حساب بانکی خود را وارد کنید
      </p>

      <div class="flex items-start gap-2 rounded-xl border border-[#e8cf9a] bg-[#f2ddb4] px-4 py-3 text-[#cf982c]">
        <IconInfoCircle class="mt-0.5 size-4 shrink-0" />
        <span class="text-[12px] font-bold leading-5">
          نام دارنده حساب بانکی باید با نام صاحب شماره موبایل ثبت‌شده در حساب کاربری یکسان باشد.
        </span>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-[13px] text-T-800">شماره کارت</span>
        <Input v-model="form.cardNumber" inputmode="numeric" dir="ltr" class="h-11 rounded-xl border-T-400 text-[13px]" />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-[13px] text-T-800">شماره شبا</span>
        <Input v-model="form.shebaNumber" inputmode="numeric" dir="ltr" class="h-11 rounded-xl border-T-400 text-[13px]" />
      </div>

      <div class="flex gap-3">
        <Button variant="secondary" class="h-11 flex-1 rounded-xl" @click="close">انصراف</Button>
        <Button class="h-11 flex-1 rounded-xl" @click="submit">ثبت</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
