<script setup lang="ts">
import type { InstallmentProvider, PaymentGateway } from '~/data/checkout'
import type { PaymentMethod } from '~/composables/useCheckout'
import { formatPriceFa } from '~/utils/format'

defineProps<{
  method: PaymentMethod
  gatewayId: string
  gateways: PaymentGateway[]
  installmentId: string
  installments: InstallmentProvider[]
  walletBalance: number
  walletInsufficient: boolean
  /** Shows the 395M note inside the online card on mobile (Figma 3509). */
  limitExceeded?: boolean
}>()

const emit = defineEmits<{
  'update:method': [value: PaymentMethod]
  'update:gatewayId': [value: string]
  'update:installmentId': [value: string]
  'requestCredit': []
}>()

const methods: Array<{ id: PaymentMethod, label: string, hint?: string, icon: string }> = [
  {
    id: 'online',
    label: 'پرداخت اینترنتی',
    hint: 'پرداخت انلاین از طریق درگاه‌های بانکی',
    icon: '/icons/cart/pay-cards.svg',
  },
  { id: 'wallet', label: 'کیف‌پول', icon: '/icons/cart/pay-wallet.svg' },
  {
    id: 'installment',
    label: 'پرداخت اقساطی',
    hint: 'پرداخت از طریق سرویس های مختلف',
    icon: '/icons/cart/pay-coins.svg',
  },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="item in methods"
      :key="item.id"
      class="flex cursor-pointer flex-col rounded-[12px] border border-[#EBEDF0] px-5 py-4 lg:py-[15px]"
      :class="item.id === 'wallet' ? 'gap-2' : 'gap-5'"
      @click="emit('update:method', item.id)"
    >
      <!-- Title row: title, icon, radio (Figma Frame 3347) -->
      <button
        type="button"
        role="radio"
        :aria-checked="method === item.id"
        class="flex w-full flex-col gap-2 text-start"
        @click="emit('update:method', item.id)"
      >
        <span class="flex h-6 w-full items-center gap-2.5">
          <img
            :src="method === item.id
              ? '/icons/cart/radio-selected.svg'
              : '/icons/cart/radio-unselected.svg'"
            alt=""
            class="size-[18px] shrink-0"
          >

          <img :src="item.icon" alt="" class="size-6 shrink-0">

          <UiTypography as="span" size="lgXl" weight="medium" class="min-w-0 flex-1">
            {{ item.label }}
          </UiTypography>
        </span>

        <UiTypography v-if="item.hint" as="span" size="md" color="muted" class="leading-[14px] lg:leading-[18px] max-lg:ms-[62px]">
          {{ item.hint }}
        </UiTypography>
      </button>

      <!-- Wallet balance (+ insufficient pill, Figma 27704) -->
      <template v-if="item.id === 'wallet'">
        <div class="flex items-baseline gap-1.5 ms-[62px] max-lg:h-[15px] max-lg:gap-1 lg:h-5">
          <UiTypography as="span" size="md" color="muted">موجودی:</UiTypography>
          <UiTypography as="span" size="lg" weight="medium" leading="none">
            {{ formatPriceFa(walletBalance) }}
          </UiTypography>
          <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
            تومان
          </UiTypography>
        </div>

        <div
          v-if="walletInsufficient && method !== 'online'"
          class="hidden h-[29px] items-center gap-1.5 self-start rounded-full border border-[#F2DDB4] bg-[#FFF6E9] px-3 lg:flex lg:ms-[62px]"
        >
          <span class="flex size-4 shrink-0 items-center justify-center rounded-full border border-[#CF982C] text-[10px] font-bold text-[#CF982C]">!</span>
          <span class="min-w-0 flex-1 truncate text-[12.5px] font-medium leading-[15px] text-[#CF982C]">
            اعتبار شما کافی نیست. برای ادامه، می‌توانید موجودی کیف‌پول را شارژ کنید یا می‌توانید روش پرداخت اینترنتی را انتخاب کنید.
          </span>
        </div>

        <!-- Mobile warning (Figma Frame 3521): wraps to three lines -->
        <div
          v-if="walletInsufficient && method !== 'online'"
          class="rounded-[8px] border border-[#F2DDB4] bg-[#FFF6E9] p-2 lg:hidden"
        >
          <div class="flex items-start gap-1.5">
            <span class="mt-px flex size-4 shrink-0 items-center justify-center rounded-full border border-[#CF982C] text-[10px] font-bold text-[#CF982C]">!</span>
            <span class="min-w-0 flex-1 text-[12.5px] font-medium leading-[13px] text-[#CF982C]">
              اعتبار شما کافی نیست. برای ادامه، می‌توانید موجودی کیف‌پول را شارژ کنید یا می‌توانید روش پرداخت اینترنتی را انتخاب کنید.
            </span>
          </div>
        </div>
      </template>

      <!-- 395M note, inside the card on mobile (Figma Frame 3509) -->
      <div
        v-if="item.id === 'online' && limitExceeded"
        class="flex items-start gap-1.5 rounded-[12px] border border-[#F2DDB4] bg-[#FFF6E9] p-2 lg:hidden"
      >
        <span class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-[#CF982C] text-[10px] font-bold text-[#CF982C]">!</span>
        <span class="min-w-0 flex-1 text-[12.5px] leading-[13px] text-[#CF982C]">
          به‌دلیل سقف ۳۹۵ میلیون تومانی هر تراکنش اینترنتی، مابقی مبلغ سفارش را می‌توانید از «جزئیات سفارش» در داشبورد پرداخت کنید؛ سفارش با تکمیل پرداخت نهایی می‌شود.
        </span>
      </div>

      <!-- Online gateways (Figma Frame 3348) -->
      <div
        v-if="item.id === 'online' && method === 'online'"
        class="flex flex-wrap gap-2.5"
      >
        <button
          v-for="gateway in gateways"
          :key="gateway.id"
          type="button"
          class="flex h-[58px] min-w-0 flex-1 items-center gap-3 rounded-[12px] border px-4 py-2.5 transition-colors lg:h-[62px] lg:w-[204px] lg:flex-none lg:px-5"
          :class="gatewayId === gateway.id
            ? 'border-R-300 bg-R-10'
            : 'border-[#EBEDF0] bg-T-50 hover:border-T-500'"
          @click.stop="emit('update:method', 'online'); emit('update:gatewayId', gateway.id)"
        >
          <img v-if="gateway.logo" :src="gateway.logo" alt="" class="size-8 shrink-0 lg:size-10">

          <span class="flex min-w-0 flex-1 flex-col gap-1 text-start">
            <UiTypography as="span" size="lg">{{ gateway.title }}</UiTypography>
            <UiTypography as="span" size="md" color="muted" class="leading-[15px]">
              {{ gateway.subtitle }}
            </UiTypography>
          </span>
        </button>
      </div>

      <!-- Installment services (Figma Frame 3349 / 3350) -->
      <div
        v-if="item.id === 'installment' && method === 'installment'"
        class="grid grid-cols-1 gap-x-2.5 gap-y-2.5 lg:grid-cols-2 lg:gap-y-5"
      >
        <button
          v-for="provider in installments"
          :key="provider.id"
          type="button"
          role="radio"
          :aria-checked="installmentId === provider.id"
          class="flex h-[64px] items-center gap-3 rounded-[12px] border px-5 py-2.5 transition-colors"
          :class="installmentId === provider.id
            ? 'border-R-300 bg-R-10'
            : 'border-[#EBEDF0] bg-T-50 hover:border-T-500'"
          @click.stop="emit('update:method', 'installment'); emit('update:installmentId', provider.id)"
        >
          <img v-if="provider.logo" :src="provider.logo" alt="" class="size-10 shrink-0">

          <span class="flex min-w-0 flex-1 flex-col gap-1 text-start">
            <span class="flex items-center gap-2.5">
              <UiTypography as="span" size="sm" color="muted" class="lg:hidden">{{ provider.badge }}</UiTypography>
              <span class="text-T-400 lg:hidden">|</span>
              <UiTypography as="span" size="lg" class="leading-[17px]">{{ provider.name }}</UiTypography>
            </span>
            <span
              v-if="provider.monthly || provider.terms"
              class="flex items-center gap-1 text-[12.5px] leading-[15px] text-T-700"
            >
              <span v-if="provider.monthly" class="truncate">{{ provider.monthly }}</span>
              <span v-if="provider.monthly && provider.terms" class="text-T-400">|</span>
              <span v-if="provider.terms" class="shrink-0">{{ provider.terms }}</span>
            </span>
          </span>

          <span class="hidden h-[29px] shrink-0 items-center gap-1 rounded-full bg-[#DEE1FF] px-2.5 lg:flex">
            <span class="text-[12.5px] font-semibold leading-none text-[#5A6AFF]">{{ provider.badge }}</span>
            <img src="/icons/cart/coins-blue.svg" alt="" class="size-[15px]">
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
