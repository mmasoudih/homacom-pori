<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import {
  Dialog as UiDialog,
  DialogClose as UiDialogClose,
  DialogContent as UiDialogContent,
  DialogTitle as UiDialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirmed': []
}>()

const reason = ref('')

watch(
  () => props.open,
  (open) => {
    if (!open) reason.value = ''
  },
)

function close() {
  emit('update:open', false)
}

function confirm() {
  if (!reason.value.trim()) {
    toast.error('لطفا دلیل لغو سفارش را بنویسید.')
    return
  }
  emit('confirmed')
  toast.success('سفارش شما لغو شد.')
  close()
}

const sheetShell
  = 'top-auto! bottom-0! start-0! end-0! translate-x-0! rtl:translate-x-0! translate-y-0! w-full! max-w-full! sm:max-w-full! max-h-[90dvh]! gap-0! rounded-t-2xl! rounded-b-none! p-0! flex! flex-col! overflow-hidden!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent :class="sheetShell" :show-close-button="false">
      <div class="flex shrink-0 items-center justify-between border-b border-T-300 px-4 py-4">
        <UiDialogTitle class="text-[15px] font-bold text-T-900">لغو سفارش</UiDialogTitle>
        <UiDialogClose
          class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
          aria-label="بستن"
        >
          <IconX class="size-5" />
        </UiDialogClose>
      </div>

      <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <DashboardOrdersAlertNote>
          با لغو سفارش، اقلام از سبد شما آزاد می‌شوند و این عملیات قابل بازگشت نیست
        </DashboardOrdersAlertNote>

        <div class="flex flex-col gap-2">
          <span class="text-[13px] font-bold text-T-900">دلیل لغو سفارش</span>
          <Textarea
            v-model="reason"
            class="min-h-[120px] rounded-xl border-T-400 text-[13px]"
            placeholder="لطفا دلیل لغو سفارش را بنویسید"
          />
        </div>
      </div>

      <div class="flex shrink-0 gap-3 p-4 pt-0">
        <button
          type="button"
          class="h-11 flex-1 rounded-xl bg-T-100 text-[13px] font-semibold text-T-800 transition-colors hover:bg-T-200"
          @click="close"
        >
          انصراف
        </button>
        <button
          type="button"
          class="h-11 flex-1 rounded-xl bg-primary text-[13px] font-bold text-white transition-colors hover:bg-primary/90"
          @click="confirm"
        >
          لغو سفارش
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
