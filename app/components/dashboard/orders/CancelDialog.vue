<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

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
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="rounded-[20px] p-6">
      <DialogTitle class="text-start text-[15px] font-bold text-T-900">
        لغو سفارش
      </DialogTitle>

      <hr class="border-T-300">

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

      <div class="mt-2 flex gap-3">
        <button
          type="button"
          class="h-11 flex-1 rounded-xl bg-primary text-[13px] font-bold text-white transition-colors hover:bg-primary/90"
          @click="confirm"
        >
          لغو سفارش
        </button>
        <button
          type="button"
          class="h-11 flex-1 rounded-xl bg-T-100 text-[13px] font-semibold text-T-800 transition-colors hover:bg-T-200"
          @click="close"
        >
          انصراف
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
