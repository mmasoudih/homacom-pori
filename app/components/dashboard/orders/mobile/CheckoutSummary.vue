<script setup lang="ts">
import { IconWallet } from '@tabler/icons-vue'
import type { PaymentOption } from '~/composables/useShopOptions'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

defineProps<{
  methods: PaymentOption[]
  selectedMethod: string
  orderCode: string
  total: number
  paid: number
  remaining: number
}>()

const emit = defineEmits<{
  'update:selectedMethod': [value: string]
}>()
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
        v-for="method in methods"
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
            <span class="mt-0.5 flex size-5 items-center justify-center text-T-700">
              <img
                v-if="method.logo"
                :src="method.logo"
                :alt="method.title"
                class="size-5 object-contain"
              >
              <IconWallet v-else class="size-5" />
            </span>
            <div class="flex flex-col gap-1">
              <span class="text-[13px] font-bold text-T-900">{{ method.title }}</span>
              <span class="text-[11.5px] text-T-600">{{ method.description || method.typeFa }}</span>
            </div>
          </div>

          <span
            class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2"
            :class="selectedMethod === method.id ? 'border-primary' : 'border-T-300'"
          >
            <span v-if="selectedMethod === method.id" class="size-2.5 rounded-full bg-primary" />
          </span>
        </div>
      </div>
    </div>

    <!-- Invoice -->
    <h2 class="mt-6 text-[14px] font-bold text-T-900">صورت‌حساب:</h2>

    <div class="mt-2 flex flex-col">
      <div class="flex items-center justify-between gap-3 border-b border-T-300 py-3 text-[13px]">
        <span class="text-T-600">مبلغ سفارش:</span>
        <span class="font-medium text-T-900">{{ formatPriceFa(total) }} تومان</span>
      </div>
      <div class="flex items-center justify-between gap-3 border-b border-T-300 py-3 text-[13px]">
        <span class="text-T-600">پرداخت‌شده:</span>
        <span class="font-medium text-T-900">{{ formatPriceFa(paid) }} تومان</span>
      </div>
      <div class="flex items-center justify-between gap-3 py-3 text-[13px]">
        <span class="font-bold text-T-900">باقی‌مانده:</span>
        <span class="font-bold text-T-900">{{ formatPriceFa(remaining) }} تومان</span>
      </div>
    </div>
  </div>
</template>
