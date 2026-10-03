<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { dashboardUser, wallet } from '~/data/dashboard'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const balance = ref(wallet.balance)
const fundsOpen = ref(false)

function onCharged(amount: number) {
  balance.value += amount
}
</script>

<template>
  <div class="relative">
    <!-- Profile -->
    <div class="relative flex items-center gap-3">
      <img src="/icons/user-avatar.svg" alt="" class="size-11 shrink-0 rounded-full">
      <div class="flex min-w-0 flex-col gap-0.5">
        <UiTypography as="span" size="lg" weight="semibold" class="truncate">{{ dashboardUser.name }}</UiTypography>
        <span class="truncate text-[11px] text-T-600" dir="ltr">{{ toPersianDigits(dashboardUser.mobile) }}</span>
      </div>
      <button
        type="button"
        class="absolute top-0 end-0 flex size-8 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-primary"
        aria-label="ویرایش اطلاعات"
      >
        <img src="/icons/edit-pencil.svg" alt="" class="size-4">
      </button>
    </div>

    <!-- Wallet -->
    <div class="mt-4 flex h-14 w-full items-center justify-between rounded-[16px] border border-T-400 px-4">
      <img src="/icons/wallet-simple.svg" alt="" class="size-5 shrink-0">
      <span class="flex items-center gap-1">
        <UiTypography as="span" size="lg" weight="bold">{{ formatPriceFa(balance) }}</UiTypography>
        <UiTypography as="span" size="sm" weight="semibold" color="subtle">تومان</UiTypography>
      </span>
    </div>

    <button
      type="button"
      class="mt-3 flex w-full items-center justify-start gap-1 text-[#5A6AFF] transition-colors"
      @click="fundsOpen = true"
    >
      <UiTypography as="span" size="md" weight="medium" color="inherit">افزایش موجودی کیف پول</UiTypography>
      <IconChevronLeft class="size-4" />
    </button>

    <DashboardAddFundsDialog
      v-model:open="fundsOpen"
      :balance="balance"
      :min="wallet.minCharge"
      :max="wallet.maxCharge"
      @charged="onCharged"
    />
  </div>
</template>
