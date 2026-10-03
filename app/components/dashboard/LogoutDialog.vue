<script setup lang="ts">
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
    <DialogContent
      class="rounded-2xl p-6 text-center max-lg:top-auto max-lg:bottom-0 max-lg:max-w-none max-lg:translate-y-0 max-lg:rounded-b-none max-lg:rounded-t-3xl max-lg:border-x-0 max-lg:border-b-0 max-lg:data-[state=open]:slide-in-from-bottom max-lg:data-[state=closed]:slide-out-to-bottom lg:max-w-[450px]"
    >
      <div class="flex flex-col items-center gap-4">
        <span class="flex size-[76px] items-center justify-center rounded-full bg-R-10 text-R-300">
          <img src="/icons/logout.svg" alt="" class="size-7">
        </span>

        <div class="flex flex-col gap-2">
          <UiTypography as="h2" size="xl" weight="bold">خروج از حساب کاربری</UiTypography>
          <UiTypography as="p" size="lg" weight="regular" color="muted" class="leading-[22px]">
            آیا مطمئن هستید؟ سبد خرید و اطلاعات شما محفوظ می‌ماند و هر زمان می‌توانید دوباره وارد شوید.
          </UiTypography>
        </div>
      </div>

      <div class="mt-2 flex gap-3">
        <Button variant="secondary" class="h-[42px] flex-1 rounded-xl bg-T-300" @click="close">
          انصراف
        </Button>
        <Button class="h-[42px] flex-1 rounded-xl" @click="confirm">
          خروج از حساب
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
