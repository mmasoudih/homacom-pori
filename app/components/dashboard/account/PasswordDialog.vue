<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [payload: { password: string }]
}>()

const password = ref('')
const confirmPassword = ref('')

watch(
  () => props.open,
  (open) => {
    if (!open) {
      password.value = ''
      confirmPassword.value = ''
    }
  },
)

function close() {
  emit('update:open', false)
}

function submit() {
  if (!password.value || password.value !== confirmPassword.value) {
    toast.error('رمز عبور و تکرار آن یکسان نیستند.')
    return
  }
  emit('submit', { password: password.value })
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="gap-6 rounded-2xl p-6 max-sm:top-auto max-sm:bottom-0 max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:border-x-0 max-sm:border-b-0 max-sm:data-[state=open]:slide-in-from-bottom max-sm:data-[state=closed]:slide-out-to-bottom sm:max-w-[380px]">
      <div class="border-b border-T-300 pb-4">
        <DialogTitle class="text-start text-[16px] font-bold text-T-900">
          رمزعبور
        </DialogTitle>
      </div>

      <p class="text-start text-[12.5px] leading-6 text-T-600">
        برای حساب خود یک رمز عبور انتخاب کنید
      </p>

      <div class="flex flex-col gap-2">
        <span class="text-[13px] text-T-800">رمز عبور</span>
        <Input v-model="password" type="password" class="h-11 rounded-xl border-T-400 text-[13px]" />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-[13px] text-T-800">تکرار رمز عبور</span>
        <Input v-model="confirmPassword" type="password" class="h-11 rounded-xl border-T-400 text-[13px]" />
      </div>

      <div class="flex gap-3">
        <Button variant="secondary" class="h-11 flex-1 rounded-xl" @click="close">انصراف</Button>
        <Button class="h-11 flex-1 rounded-xl" @click="submit">ثبت</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
