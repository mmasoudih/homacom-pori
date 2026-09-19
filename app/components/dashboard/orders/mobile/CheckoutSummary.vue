<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconCoins,
  IconCreditCard,
  IconEye,
  IconShieldCheck,
  IconShoppingBag,
  IconTag,
  IconTools,
  IconTruckDelivery,
  IconWallet,
} from '@tabler/icons-vue'
import { checkoutInvoice, creditWallets, paymentMethods } from '~/data/orders'
import type { InvoiceLine } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

type PaymentMethodId = 'internet' | 'wallet' | 'installment'

defineProps<{
  selectedMethod: PaymentMethodId
  selectedBank: string
  selectedWallet: string | null
  orderCode: string
}>()

const emit = defineEmits<{
  'update:selectedMethod': [value: PaymentMethodId]
  'update:selectedBank': [value: string]
  'update:selectedWallet': [value: string | null]
}>()

const methodIcons: Record<string, Component> = {
  card: IconCreditCard,
  wallet: IconWallet,
  coins: IconCoins,
}

const invoiceIcons: Record<InvoiceLine['icon'], Component> = {
  bag: IconShoppingBag,
  tag: IconTag,
  shield: IconShieldCheck,
  tools: IconTools,
  truck: IconTruckDelivery,
  wallet: IconWallet,
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Banner -->
    <div class="rounded-2xl bg-indigo-50 p-4">
      <h1 class="text-[13.5px] font-bold text-indigo-700">
        تکمیل پرداخت سفارش {{ toPersianDigits(orderCode) }}
      </h1>
      <p class="mt-1.5 text-[12px] leading-[22px] text-indigo-500">
        پرداخت اولیه ثبت شده؛ با تکمیل پرداخت، سفارش نهایی می‌شود. اگر مجموع پرداخت‌ها به مبلغ سفارش نرسید، می‌توانید باقی‌مانده را در چند مرحله و با روش‌های مختلف و کارت‌های مختلف پرداخت کنید.
      </p>
    </div>

    <!-- Payment methods -->
    <h2 class="mt-6 text-[14px] font-bold text-T-900">روش پرداخت</h2>

    <div class="mt-4 flex flex-col gap-3">
      <div
        v-for="method in paymentMethods"
        :key="method.id"
        class="rounded-2xl border p-4 transition-colors"
        :class="selectedMethod === method.id ? 'border-primary/50' : 'border-T-300'"
        role="button"
        tabindex="0"
        @click="emit('update:selectedMethod', method.id)"
        @keydown.enter="emit('update:selectedMethod', method.id)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <span class="mt-0.5 text-T-700">
              <component :is="methodIcons[method.icon]" class="size-5" />
            </span>
            <div class="flex flex-col gap-1">
              <span class="text-[13px] font-bold text-T-900">{{ method.title }}</span>
              <span class="text-[11.5px] text-T-600">{{ method.description }}</span>
            </div>
          </div>

          <span
            class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2"
            :class="selectedMethod === method.id ? 'border-primary' : 'border-T-300'"
          >
            <span v-if="selectedMethod === method.id" class="size-2.5 rounded-full bg-primary" />
          </span>
        </div>

        <!-- Internet gateway banks -->
        <div
          v-if="method.id === 'internet' && selectedMethod === 'internet'"
          class="mt-4 grid grid-cols-2 gap-3"
        >
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[12px] font-semibold transition-colors"
            :class="selectedBank === 'mellat' ? 'border-primary bg-R-50 text-primary' : 'border-T-300 bg-T-50 text-T-700'"
            @click.stop="emit('update:selectedBank', 'mellat')"
          >
            <IconEye class="size-4 shrink-0" />
            درگاه بانک ملت
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[12px] font-semibold transition-colors"
            :class="selectedBank === 'seh' ? 'border-primary bg-R-50 text-primary' : 'border-T-300 bg-T-50 text-T-700'"
            @click.stop="emit('update:selectedBank', 'seh')"
          >
            <IconEye class="size-4 shrink-0" />
            درگاه بانک سیه
          </button>
        </div>
      </div>
    </div>

    <!-- Credit wallets -->
    <h2 class="mt-6 text-[14px] font-bold text-T-900">استفاده از اعتبار</h2>

    <div class="mt-4 flex flex-col gap-3">
      <div
        v-for="walletItem in creditWallets"
        :key="walletItem.id"
        class="flex items-center justify-between gap-3 rounded-2xl border p-4 transition-colors"
        :class="selectedWallet === walletItem.id ? 'border-primary/50' : 'border-T-300'"
        role="button"
        tabindex="0"
        @click="emit('update:selectedWallet', walletItem.id)"
        @keydown.enter="emit('update:selectedWallet', walletItem.id)"
      >
        <span
          class="text-[15px] font-black"
          :class="walletItem.id === 'baloon' ? 'text-sky-500' : 'text-indigo-500'"
        >
          {{ walletItem.id === 'baloon' ? 'بالون' : 'آواژو' }}
        </span>

        <div class="flex items-center gap-3">
          <div class="flex flex-col gap-1">
            <span class="text-[13px] font-bold text-T-900">{{ walletItem.name }}</span>
            <span class="text-[11.5px] text-T-600">
              موجودی: {{ formatPriceFa(walletItem.balance) }} تومان
            </span>
          </div>
          <span
            class="flex size-5 shrink-0 items-center justify-center rounded-full border-2"
            :class="selectedWallet === walletItem.id ? 'border-primary' : 'border-T-300'"
          >
            <span v-if="selectedWallet === walletItem.id" class="size-2.5 rounded-full bg-primary" />
          </span>
        </div>
      </div>
    </div>

    <!-- Invoice -->
    <h2 class="mt-6 text-[14px] font-bold text-T-900">صورت‌حساب:</h2>

    <div class="mt-2 flex flex-col">
      <div
        v-for="(item, index) in checkoutInvoice"
        :key="`${item.label}-${index}`"
        class="flex items-center justify-between gap-3 py-3 text-[13px]"
        :class="index < checkoutInvoice.length - 1 ? 'border-b border-T-300' : ''"
      >
        <span
          class="flex items-center gap-2"
          :class="index === checkoutInvoice.length - 1 ? 'font-bold text-T-900' : 'text-T-600'"
        >
          <component :is="invoiceIcons[item.icon]" class="size-4 shrink-0" />
          {{ item.label }}:
        </span>
        <span
          class="text-left"
          :class="index === checkoutInvoice.length - 1 ? 'font-bold text-T-900' : 'font-medium text-T-900'"
        >
          {{ formatPriceFa(item.value) }} تومان
        </span>
      </div>
    </div>
  </div>
</template>
