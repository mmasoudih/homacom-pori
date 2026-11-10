<script setup lang="ts">
import { IconCircleCheckFilled, IconCloudUpload, IconFileDescription, IconX } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import type { Order } from '~/data/orders'
import { apiErrorMessage, ApiError } from '~/composables/useApi'
import { useOrderActions } from '~/composables/useOrders'
import { useShopOptions } from '~/composables/useShopOptions'

/**
 * Offline `bank_transfer` payment: the shop's bank accounts, then the receipt
 * upload (`POST /shop/order/{invoice}/bank-transfer`, 2026-11-09).
 *
 * One submission per invoice — once `order.bankTransfer` is set (or the upload
 * succeeded) the form is replaced by the "waiting for review" state.
 */
const props = defineProps<{
  order: Order
}>()

const emit = defineEmits<{
  submitted: []
}>()

const { submitBankTransferReceipt } = useOrderActions()
const { bankAccounts } = useShopOptions()

const RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024

const trackingNumber = ref('')
const receipt = ref<File | null>(null)
const previewUrl = ref('')
const submitting = ref(false)
const submittedLocally = ref(false)
const errors = ref<{ trackingNumber?: string, receipt?: string }>({})
const fileInput = ref<HTMLInputElement | null>(null)

const uploaded = computed(() => submittedLocally.value || !!props.order.bankTransfer)

const receiptLink = computed(() => props.order.bankTransfer?.receipt ?? '')
const submittedAt = computed(() => props.order.bankTransfer?.submittedAt ?? '')
const submittedTracking = computed(() => props.order.bankTransfer?.trackingNumber ?? '')

function clearPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  errors.value.receipt = undefined

  if (!file) {
    clearPreview()
    receipt.value = null
    return
  }
  if (!RECEIPT_TYPES.includes(file.type)) {
    errors.value.receipt = 'فقط تصویر JPG، PNG یا WEBP پذیرفته می‌شود.'
    input.value = ''
    return
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    errors.value.receipt = 'حجم تصویر رسید نباید بیشتر از ۵ مگابایت باشد.'
    input.value = ''
    return
  }

  clearPreview()
  receipt.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function removeFile() {
  clearPreview()
  receipt.value = null
  if (fileInput.value) fileInput.value.value = ''
}

onBeforeUnmount(clearPreview)

/** API error keys → the two form fields. */
const FIELD_MAP: Record<string, 'trackingNumber' | 'receipt'> = {
  tracking_number: 'trackingNumber',
  receipt: 'receipt',
}

async function submit() {
  errors.value = {}

  const tracking = trackingNumber.value.trim()
  if (!tracking) errors.value.trackingNumber = 'شماره پیگیری را وارد کنید.'
  else if (tracking.length > 50) errors.value.trackingNumber = 'شماره پیگیری حداکثر ۵۰ کاراکتر باشد.'
  if (!receipt.value) errors.value.receipt = 'تصویر رسید پرداخت را انتخاب کنید.'
  if (errors.value.trackingNumber || errors.value.receipt) return

  submitting.value = true
  try {
    const res = await submitBankTransferReceipt(props.order.id, {
      trackingNumber: tracking,
      receipt: receipt.value!,
    })
    submittedLocally.value = true
    removeFile()
    toast.success(res.message || 'رسید پرداخت با موفقیت ثبت شد.')
    emit('submitted')
  }
  catch (err) {
    const fieldErrors = err instanceof ApiError ? err.data?.errors : undefined
    if (fieldErrors) {
      const mapped: typeof errors.value = {}
      for (const [field, messages] of Object.entries(fieldErrors)) {
        const key = FIELD_MAP[field]
        const first = messages?.[0]
        if (key && first && !mapped[key]) mapped[key] = first
      }
      // `invoice_id` (someone else's invoice) surfaces on the generic message.
      errors.value = mapped
    }
    toast.error(apiErrorMessage(err, 'ثبت رسید پرداخت انجام نشد.'))
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="flex flex-col gap-4 rounded-[16px] border border-T-400 bg-T-50 p-4 lg:p-5">
    <div class="flex items-start gap-3">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
        <IconCircleCheckFilled v-if="uploaded" class="size-5" />
        <IconFileDescription v-else class="size-5" />
      </span>
      <div class="flex min-w-0 flex-col gap-1">
        <h3 class="text-[13.5px] font-bold text-T-900">
          {{ uploaded ? 'رسید پرداخت در انتظار تایید' : 'پرداخت کارت به کارت / واریز بانکی' }}
        </h3>
        <p class="text-[11.5px] leading-[20px] text-T-600">
          <template v-if="uploaded">
            رسید شما ثبت شد و پس از بررسی کارشناسان، پرداخت این سفارش تایید می‌شود. وضعیت پرداخت تا
            آن زمان «در انتظار پرداخت» باقی می‌ماند.
          </template>
          <template v-else>
            مبلغ سفارش را به یکی از حساب‌های زیر واریز کنید، سپس شماره پیگیری و تصویر رسید را ثبت
            کنید.
          </template>
        </p>
      </div>
    </div>

    <div v-if="uploaded" class="flex flex-col gap-2 rounded-[12px] bg-T-200 p-3">
      <div v-if="submittedTracking" class="flex items-center justify-between gap-3">
        <span class="text-[11.5px] text-T-600">شماره پیگیری:</span>
        <span class="text-[12.5px] font-semibold text-T-900" dir="ltr">{{ submittedTracking }}</span>
      </div>
      <div v-if="submittedAt" class="flex items-center justify-between gap-3">
        <span class="text-[11.5px] text-T-600">زمان ثبت رسید:</span>
        <span class="text-[12.5px] font-semibold text-T-900">{{ submittedAt }}</span>
      </div>
      <a
        v-if="receiptLink"
        :href="receiptLink"
        target="_blank"
        rel="noopener noreferrer"
        class="text-[12px] font-semibold text-primary underline-offset-4 hover:underline"
      >
        مشاهده رسید بارگذاری‌شده
      </a>
    </div>

    <template v-else>
      <CheckoutBankAccounts :accounts="bankAccounts" />

      <form class="flex flex-col gap-3" @submit.prevent="submit">
        <label class="flex flex-col gap-1.5">
          <span class="text-[12px] font-medium text-T-800">شماره پیگیری</span>
          <input
            v-model="trackingNumber"
            type="text"
            inputmode="numeric"
            dir="ltr"
            maxlength="50"
            placeholder="مثال: 123456789"
            class="h-11 w-full rounded-[12px] border border-T-400 bg-white px-3 text-[12.5px] text-T-900 outline-none transition-colors placeholder:text-T-500 focus:border-primary"
          >
          <span v-if="errors.trackingNumber" class="text-[11.5px] text-primary">
            {{ errors.trackingNumber }}
          </span>
        </label>

        <div class="flex flex-col gap-1.5">
          <span class="text-[12px] font-medium text-T-800">تصویر رسید</span>

          <div v-if="receipt" class="flex items-center gap-3 rounded-[12px] border border-T-400 bg-white p-2.5">
            <img v-if="previewUrl" :src="previewUrl" alt="" class="size-12 shrink-0 rounded-lg object-cover">
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="truncate text-[12px] font-medium text-T-900">{{ receipt.name }}</span>
              <span class="text-[11px] text-T-600">{{ Math.round(receipt.size / 1024) }} کیلوبایت</span>
            </span>
            <button
              type="button"
              class="shrink-0 text-T-500 transition-colors hover:text-primary"
              aria-label="حذف رسید"
              @click="removeFile"
            >
              <IconX class="size-4" />
            </button>
          </div>

          <label
            v-else
            class="flex h-[86px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-T-500 bg-white text-T-600 transition-colors hover:border-primary hover:text-primary"
          >
            <IconCloudUpload class="size-6" />
            <span class="text-[11.5px]">انتخاب تصویر رسید (JPG، PNG یا WEBP تا ۵ مگابایت)</span>
            <input
              ref="fileInput"
              data-bank-transfer-receipt
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="hidden"
              @change="onFileChange"
            >
          </label>

          <span v-if="errors.receipt" class="text-[11.5px] text-primary">{{ errors.receipt }}</span>
        </div>

        <button
          type="submit"
          class="h-11 w-full rounded-[12px] bg-primary text-[13px] font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
        >
          {{ submitting ? 'در حال ارسال…' : 'ثبت رسید پرداخت' }}
        </button>
      </form>
    </template>
  </section>
</template>
