<script setup lang="ts">
import { IconLogout } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const token = useCookie('auth_token')

function close() {
  emit('update:open', false)
}

async function confirm() {
  token.value = null
  close()
  toast.success('از حساب کاربری خود خارج شدید.')
  await navigateTo('/')
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="rounded-2xl p-6 text-center sm:max-w-[400px]">
      <div class="flex flex-col items-center gap-4">
        <span class="flex size-16 items-center justify-center rounded-full bg-R-50 text-primary">
          <IconLogout class="size-7" />
        </span>

        <div class="flex flex-col gap-2">
          <h2 class="text-[15px] font-bold text-T-900">خروج از حساب کاربری</h2>
          <p class="text-[13px] leading-[22px] text-T-600">
            آیا مطمئن هستید؟ سبد خرید و اطلاعات شما محفوظ می‌ماند و هر زمان می‌توانید دوباره وارد شوید.
          </p>
        </div>
      </div>

      <div class="mt-2 flex gap-3">
        <Button class="h-11 flex-1 rounded-xl" @click="confirm">
          خروج از حساب
        </Button>
        <Button variant="secondary" class="h-11 flex-1 rounded-xl" @click="close">
          انصراف
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
