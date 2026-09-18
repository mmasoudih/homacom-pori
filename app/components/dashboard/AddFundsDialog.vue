<script setup lang="ts">
import { IconWallet } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatPrice } from '~/utils/format'

const props = withDefaults(defineProps<{
  open: boolean
  balance: number
  min?: number
  max?: number
}>(), {
  min: 10_000,
  max: 100_000_000,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'charged': [amount: number]
}>()

const amount = ref<number | null>(null)

const display = computed({
  get: () => (amount.value ? formatPrice(amount.value) : ''),
  set: (value: string) => {
    const digits = value.replace(/\D/g, '')
    amount.value = digits ? Number(digits) : null
  },
})

const isValid = computed(
  () => amount.value != null && amount.value >= props.min && amount.value <= props.max,
)

function close() {
  emit('update:open', false)
}

function submit() {
  if (!isValid.value || amount.value == null) return
  emit('charged', amount.value)
  toast.success('کیف پول شما با موفقیت شارژ شد.', {
    description: `${formatPrice(amount.value)} تومان به موجودی شما اضافه شد.`,
  })
  amount.value = null
  close()
}

watch(
  () => props.open,
  (open) => {
    if (!open) amount.value = null
  },
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="rounded-2xl p-6 sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle class="text-center text-[15px] font-bold text-T-900 sm:text-start">
          افزایش موجودی کیف پول
        </DialogTitle>
      </DialogHeader>

      <!-- Current balance -->
      <div class="flex items-center justify-between rounded-xl border border-T-400 px-4 py-3">
        <span class="flex flex-col gap-1">
          <span class="text-[12px] text-T-600">موجودی فعلی کیف پول</span>
          <span class="text-[15px] font-bold text-T-900">
            {{ formatPrice(balance) }}
            <span class="text-[11px] font-normal text-T-600">تومان</span>
          </span>
        </span>
        <IconWallet class="size-6 shrink-0 text-T-800" />
      </div>

      <!-- Amount -->
      <div class="flex flex-col gap-2">
        <label for="add-funds-amount" class="text-[13px] font-bold text-T-900">
          مبلغ شارژ کیف پول
        </label>
        <div class="flex h-11 items-center gap-3 rounded-xl border border-T-400 px-3 transition-colors focus-within:border-primary">
          <input
            id="add-funds-amount"
            v-model="display"
            type="text"
            inputmode="numeric"
            placeholder="مبلغ مورد نظر خود را وارد کنید"
            class="min-w-0 flex-1 bg-transparent text-[13px] text-T-900 outline-none placeholder:text-T-600"
          >
          <span class="shrink-0 text-[12px] text-T-600">تومان</span>
        </div>
        <p class="text-[11px] text-T-600">
          حداقل {{ formatPrice(min) }} و حداکثر {{ formatPrice(max) }} تومان
        </p>
      </div>

      <div class="flex gap-3">
        <Button
          class="h-11 flex-1 rounded-xl"
          :disabled="!isValid"
          @click="submit"
        >
          پرداخت
        </Button>
        <Button
          variant="secondary"
          class="h-11 flex-1 rounded-xl"
          @click="close"
        >
          انصراف
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
