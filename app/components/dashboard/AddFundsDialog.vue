<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatPrice, formatPriceFa, toEnglishDigits } from '~/utils/format'

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
  get: () => (amount.value ? formatPriceFa(amount.value) : ''),
  set: (value: string) => {
    const digits = toEnglishDigits(value).replace(/\D/g, '')
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
    <DialogContent class="rounded-2xl p-6 max-lg:top-auto max-lg:bottom-0 max-lg:max-w-none max-lg:translate-y-0 max-lg:rounded-b-none max-lg:rounded-t-3xl max-lg:border-x-0 max-lg:border-b-0 max-lg:data-[state=open]:slide-in-from-bottom max-lg:data-[state=closed]:slide-out-to-bottom lg:max-w-[450px]">
      <DialogHeader>
        <DialogTitle class="text-center text-[16px] font-bold text-T-900 lg:text-start">
          افزایش موجودی کیف پول
        </DialogTitle>
      </DialogHeader>

      <UiSeparator class="bg-T-400" />

      <!-- Current balance -->
      <div class="flex items-center gap-[13.15px] rounded-[16px] border border-T-400 bg-T-100 px-4 py-3">
        <img src="/icons/wallet-simple.svg" alt="" class="size-6 shrink-0">
        <span class="flex flex-col gap-1">
          <span class="text-[12px] text-T-600">موجودی فعلی کیف پول</span>
          <span class="flex items-center gap-1">
            <UiTypography as="span" size="lg" weight="bold">{{ formatPriceFa(balance) }}</UiTypography>
            <UiTypography as="span" size="sm" weight="semibold" color="subtle">تومان</UiTypography>
          </span>
        </span>
      </div>

      <!-- Amount -->
      <div class="flex flex-col gap-2">
        <UiTypography as="label" for="add-funds-amount" size="lg" weight="regular" class="mt-[18px] mb-[6px]">
          مبلغ شارژ کیف پول
        </UiTypography>
        <div class="flex h-[50px] items-center gap-3 rounded-[16px] border border-T-500 px-3 transition-colors focus-within:border-primary">
          <input
            id="add-funds-amount"
            v-model="display"
            type="text"
            inputmode="numeric"
            placeholder="مبلغ مورد نظر خود را وارد کنید"
            class="min-w-0 flex-1 bg-transparent text-[13px] text-T-900 outline-none placeholder:text-T-600"
          >
          <UiTypography as="span" size="md" weight="regular" color="muted" class="shrink-0">تومان</UiTypography>
        </div>
        <p class="text-end text-[11px] text-T-600">
          حداقل {{ formatPriceFa(min) }} و حداکثر {{ formatPriceFa(max) }} تومان
        </p>
      </div>

      <div class="flex gap-3">
        <Button
          variant="secondary"
          class="h-11 flex-1 rounded-xl bg-T-300 text-T-900"
          @click="close"
        >
          <UiTypography as="span" size="lg" weight="semibold" color="inherit">انصراف</UiTypography>
        </Button>
        <Button
          class="h-11 flex-1 rounded-xl"
          :disabled="!isValid"
          @click="submit"
        >
          <UiTypography as="span" size="lg" weight="bold" color="inherit">پرداخت</UiTypography>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
