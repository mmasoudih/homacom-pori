<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { apiErrorMessage } from '~/composables/useApi'
import { formatPriceFa, toEnglishDigits } from '~/utils/format'
import { redirectToGateway } from '~/utils/payment'

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
}>()

const { gateways } = useShopOptions()
const { charge } = useWallet()

const amount = ref<number | null>(null)
const gatewayId = ref('')
const submitting = ref(false)

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

const canSubmit = computed(() => isValid.value && !!gatewayId.value && !submitting.value)

// Keep a valid online gateway selected (wallet methods cannot top up credit).
watch(gateways, (list) => {
  if (!list.length) return
  if (!list.some(gateway => gateway.id === gatewayId.value))
    gatewayId.value = list[0]?.id ?? ''
}, { immediate: true })

function close() {
  emit('update:open', false)
}

/**
 * Start the top-up and hand the browser to the gateway.
 *
 * The balance only changes after the gateway callback, so a successful submit
 * navigates away (and `/payment-result` refreshes the profile on return).
 */
async function submit() {
  if (!canSubmit.value || amount.value == null) return

  submitting.value = true
  try {
    const payment = await charge({
      amount: amount.value,
      paymentMethodId: gatewayId.value,
    })

    if (payment.success === false) {
      toast.error(payment.message || 'اتصال به درگاه پرداخت انجام نشد.')
      return
    }

    if (!redirectToGateway(payment)) {
      toast.error('درگاه پرداخت پاسخ نداد؛ لطفاً دوباره تلاش کنید.')
      return
    }

    amount.value = null
    close()
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'شارژ کیف پول انجام نشد.'))
  }
  finally {
    submitting.value = false
  }
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
    <DialogContent class="max-h-[90dvh] overflow-y-auto rounded-2xl p-6 max-lg:top-auto max-lg:bottom-0 max-lg:max-w-none max-lg:translate-y-0 max-lg:rounded-b-none max-lg:rounded-t-3xl max-lg:border-x-0 max-lg:border-b-0 max-lg:data-[state=open]:slide-in-from-bottom max-lg:data-[state=closed]:slide-out-to-bottom lg:max-w-[450px]">
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

      <!-- Gateway (online methods only — wallet methods cannot charge credit) -->
      <div class="flex flex-col gap-2">
        <UiTypography as="label" size="lg" weight="regular" class="mt-[18px] mb-[6px]">
          درگاه پرداخت
        </UiTypography>

        <div v-if="gateways.length" class="flex flex-wrap gap-2">
          <button
            v-for="gateway in gateways"
            :key="gateway.id"
            type="button"
            class="flex h-[52px] min-w-0 flex-1 items-center gap-2 rounded-[12px] border px-3 text-start transition-colors lg:basis-[calc(50%-4px)]"
            :class="gatewayId === gateway.id
              ? 'border-R-300 bg-R-10'
              : 'border-[#EBEDF0] bg-T-50 hover:border-T-500'"
            @click="gatewayId = gateway.id"
          >
            <img v-if="gateway.logo" :src="gateway.logo" alt="" class="size-7 shrink-0">
            <UiTypography as="span" size="md" weight="medium" class="min-w-0 flex-1 truncate">
              {{ gateway.title }}
            </UiTypography>
          </button>
        </div>

        <UiTypography v-else as="p" size="md" color="muted" class="leading-[18px]">
          درگاه پرداخت آنلاینی در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید.
        </UiTypography>

        <p class="text-end text-[11px] text-T-600">
          موجودی پس از تأیید پرداخت به کیف پول اضافه می‌شود.
        </p>
      </div>

      <div class="flex gap-3">
        <Button
          variant="secondary"
          class="h-11 flex-1 rounded-xl bg-T-300 text-T-900"
          :disabled="submitting"
          @click="close"
        >
          <UiTypography as="span" size="lg" weight="semibold" color="inherit">انصراف</UiTypography>
        </Button>
        <Button
          class="h-11 flex-1 rounded-xl"
          :disabled="!canSubmit"
          @click="submit"
        >
          <UiTypography as="span" size="lg" weight="bold" color="inherit">
            {{ submitting ? 'در حال انتقال…' : 'پرداخت' }}
          </UiTypography>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
