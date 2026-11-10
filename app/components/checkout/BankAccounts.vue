<script setup lang="ts">
import { IconCheck, IconCopy } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import type { BankAccount } from '~/composables/useShopOptions'

/**
 * Shop bank accounts for the offline `bank_transfer` method
 * (`GET /shop/public/payment-methods` → `bank_accounts`).
 *
 * The customer wires the money outside the shop and uploads the receipt from
 * the order page, so every value is copyable and shown LTR.
 */
defineProps<{
  accounts: BankAccount[]
}>()

const copied = ref('')

async function copy(key: string, value: string) {
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
    copied.value = key
    toast.success('کپی شد.')
    setTimeout(() => {
      if (copied.value === key) copied.value = ''
    }, 1500)
  }
  catch {
    toast.error('کپی انجام نشد.')
  }
}

function accountRows(account: BankAccount) {
  return [
    { key: 'account', label: 'شماره حساب', value: account.accountNumber },
    { key: 'card', label: 'شماره کارت', value: account.cardNumber },
    { key: 'sheba', label: 'شماره شبا', value: account.shebaNumber },
  ].filter(row => !!row.value)
}
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <p
      v-if="!accounts.length"
      class="rounded-[12px] border border-dashed border-T-400 bg-T-50 p-3 text-[12.5px] leading-[20px] text-T-600"
    >
      حساب بانکی فعالی برای واریز ثبت نشده است؛ لطفاً با پشتیبانی تماس بگیرید.
    </p>

    <div
      v-for="account in accounts"
      :key="account.id"
      class="flex flex-col gap-2.5 rounded-[12px] border border-T-400 bg-T-50 p-4"
    >
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[13px] font-bold text-T-900">{{ account.title || 'حساب فروشگاه' }}</span>
        <span
          v-if="account.bankName"
          class="rounded-full bg-T-200 px-2.5 py-1 text-[11.5px] font-medium text-T-800"
        >
          {{ account.bankName }}
        </span>
      </div>

      <div
        v-for="row in accountRows(account)"
        :key="row.key"
        class="flex items-start justify-between gap-3"
      >
        <span class="shrink-0 text-[11.5px] text-T-600">{{ row.label }}:</span>
        <span class="flex min-w-0 items-start gap-1.5">
          <span class="min-w-0 break-all text-[12.5px] font-semibold text-T-900" dir="ltr">
            {{ row.value }}
          </span>
          <button
            type="button"
            class="mt-0.5 shrink-0 text-T-500 transition-colors hover:text-primary"
            :aria-label="`کپی ${row.label}`"
            @click.stop="copy(`${account.id}-${row.key}`, row.value)"
          >
            <IconCheck
              v-if="copied === `${account.id}-${row.key}`"
              class="size-3.5 text-emerald-500"
            />
            <IconCopy v-else class="size-3.5" />
          </button>
        </span>
      </div>
    </div>

    <p v-if="accounts.length" class="text-[11.5px] leading-[20px] text-T-600">
      پس از واریز، شماره پیگیری و تصویر رسید را از «جزئیات سفارش» بارگذاری کنید. پرداخت پس از
      تایید رسید توسط کارشناسان ثبت می‌شود.
    </p>
  </div>
</template>
