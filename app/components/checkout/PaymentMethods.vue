<script setup lang="ts">
import type { PaymentGateway } from '~/data/checkout'
import type { PaymentMethod } from '~/composables/useCheckout'
import { formatPriceFa } from '~/utils/format'

defineProps<{
  method: PaymentMethod
  gatewayId: string
  gateways: PaymentGateway[]
  walletBalance: number
  walletInsufficient: boolean
  creditInsufficient: boolean
}>()

const emit = defineEmits<{
  'update:method': [value: PaymentMethod]
  'update:gatewayId': [value: string]
  requestCredit: []
}>()

const methods: Array<{ id: PaymentMethod, label: string, icon: string, hint?: string }> = [
  { id: 'online', label: 'پرداخت اینترنتی', icon: '/icons/cart/pay-cards.svg' },
  { id: 'wallet', label: 'کیف‌پول', icon: '/icons/cart/pay-wallet.svg' },
  { id: 'installment', label: 'پرداخت اقساطی', icon: '/icons/cart/pay-coins.svg' },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="item in methods"
      :key="item.id"
      class="rounded-[12px] border border-T-300 p-4 lg:p-[16px_20px]"
    >
      <button
        type="button"
        role="radio"
        :aria-checked="method === item.id"
        class="flex w-full items-center gap-2.5 text-start"
        @click="emit('update:method', item.id)"
      >
        <img
          :src="method === item.id
            ? '/icons/cart/radio-selected.svg'
            : '/icons/cart/radio-unselected.svg'"
          alt=""
          class="size-[18px] shrink-0"
        >

        <img :src="item.icon" alt="" class="size-6 shrink-0">

        <UiTypography as="span" size="xl" weight="medium" class="min-w-0 flex-1">
          {{ item.label }}
        </UiTypography>
      </button>

      <!-- Online: gateway chips -->
      <div v-if="item.id === 'online' && method === 'online'" class="mt-4 flex flex-wrap gap-2.5">
        <button
          v-for="gateway in gateways"
          :key="gateway.id"
          type="button"
          class="flex h-[62px] min-w-0 flex-1 items-center justify-center rounded-[12px] border px-4 transition-colors"
          :class="gatewayId === gateway.id
            ? 'border-R-300 bg-R-10'
            : 'border-T-300 bg-T-50 hover:border-T-500'"
          @click="emit('update:gatewayId', gateway.id)"
        >
          <UiTypography as="span" size="lg" weight="medium">{{ gateway.name }}</UiTypography>
        </button>
      </div>

      <!-- Wallet: balance + insufficient note -->
      <template v-if="item.id === 'wallet'">
        <div class="mt-2 flex flex-wrap items-baseline gap-1.5 ps-[26px]">
          <UiTypography as="span" size="md" color="muted">موجودی:</UiTypography>
          <UiTypography as="span" size="lg" weight="medium" leading="none">
            {{ formatPriceFa(walletBalance) }}
          </UiTypography>
          <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
            تومان
          </UiTypography>
        </div>

        <div
          v-if="method === 'wallet' && walletInsufficient"
          class="mt-3 rounded-[8px] border border-dashed border-[#F2DDB4] bg-[#FFFCF7] p-3"
        >
          <UiTypography as="span" size="md" color="muted" class="leading-[18px]">
            اعتبار شما کافی نیست. برای ادامه، می‌توانید موجودی کیف‌پول را شارژ کنید یا روش پرداخت اینترنتی را انتخاب کنید.
          </UiTypography>
        </div>
      </template>

      <!-- Installment: hint + credit request -->
      <div v-if="item.id === 'installment'" class="mt-2 flex flex-wrap items-center gap-2 ps-[26px]">
        <UiTypography as="span" size="md" color="muted">
          پرداخت از طریق سرویس‌های مختلف
        </UiTypography>

        <button
          v-if="method === 'installment' && creditInsufficient"
          type="button"
          class="text-[12.5px] font-medium text-R-300"
          @click="emit('requestCredit')"
        >
          درخواست اعتبار
        </button>
      </div>
    </div>
  </div>
</template>
