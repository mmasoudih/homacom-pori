<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const props = withDefaults(defineProps<{
  open: boolean
  codeSent?: boolean
  sendingCode?: boolean
}>(), {
  codeSent: false,
  sendingCode: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'send-code': []
  'submit': [payload: { code: string, password: string }]
}>()

const code = ref('')
const password = ref('')
const confirmPassword = ref('')

watch(
  () => props.open,
  (open) => {
    if (!open) {
      code.value = ''
      password.value = ''
      confirmPassword.value = ''
    }
  },
)

function close() {
  emit('update:open', false)
}

function submit() {
  if (!props.codeSent) {
    emit('send-code')
    return
  }

  if (!/^\d{5}$/.test(code.value.trim())) {
    toast.error('کد تایید ۵ رقمی را وارد کنید.')
    return
  }
  if (password.value.length < 8
    || !/[a-z]/.test(password.value)
    || !/[A-Z]/.test(password.value)
    || !/\d/.test(password.value)
    || !/[^A-Za-z0-9]/.test(password.value)) {
    toast.error('رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک، عدد و علامت باشد.')
    return
  }
  if (password.value !== confirmPassword.value) {
    toast.error('رمز عبور و تکرار آن یکسان نیستند.')
    return
  }

  emit('submit', { code: code.value.trim(), password: password.value })
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="gap-6 rounded-2xl p-6 max-lg:top-auto max-lg:bottom-0 max-lg:max-w-none max-lg:translate-y-0 max-lg:rounded-b-none max-lg:rounded-t-3xl max-lg:border-x-0 max-lg:border-b-0 max-lg:data-[state=open]:slide-in-from-bottom max-lg:data-[state=closed]:slide-out-to-bottom lg:max-w-[380px]">
      <div class="border-b border-T-300 pb-4">
        <DialogTitle class="text-start text-[16px] font-bold text-T-900">
          رمزعبور
        </DialogTitle>
      </div>

      <p class="text-start text-[12.5px] leading-6 text-T-600">
        {{ codeSent
          ? 'کد ارسال‌شده به موبایل خود را وارد کنید و رمز عبور جدید را انتخاب کنید.'
          : 'برای ثبت رمز عبور، ابتدا کد تایید به شماره موبایل شما ارسال می‌شود.' }}
      </p>

      <template v-if="codeSent">
        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">کد تایید</span>
          <Input v-model="code" inputmode="numeric" maxlength="5" dir="ltr" class="h-11 rounded-xl border-T-400 text-center text-[15px] tracking-[0.4em]" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">رمز عبور</span>
          <Input v-model="password" type="password" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] text-T-800">تکرار رمز عبور</span>
          <Input v-model="confirmPassword" type="password" class="h-11 rounded-xl border-T-400 text-[13px]" />
        </div>
      </template>

      <div class="flex gap-3">
        <Button variant="secondary" class="h-11 flex-1 rounded-xl" @click="close">انصراف</Button>
        <Button class="h-11 flex-1 rounded-xl" :disabled="sendingCode" @click="submit">
          {{ codeSent ? 'ثبت' : (sendingCode ? 'در حال ارسال…' : 'ارسال کد تایید') }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
