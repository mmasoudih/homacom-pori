<script setup lang="ts">
import { IconChevronLeft, IconPencil, IconUser, IconWallet } from '@tabler/icons-vue'
import { dashboardUser, wallet } from '~/data/dashboard'
import { formatPrice } from '~/utils/format'

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
      <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-T-200 text-T-600">
        <IconUser class="size-6" />
      </span>
      <div class="flex min-w-0 flex-col gap-0.5">
        <span class="truncate text-[14px] font-bold text-T-900">{{ dashboardUser.name }}</span>
        <span class="truncate text-[11px] text-T-600" dir="ltr">{{ dashboardUser.email }}</span>
      </div>
      <button
        type="button"
        class="absolute top-0 end-0 flex size-8 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-primary"
        aria-label="ویرایش اطلاعات"
      >
        <IconPencil class="size-4" />
      </button>
    </div>

    <!-- Wallet -->
    <div class="mt-4 flex items-center justify-between rounded-xl border border-T-400 px-4 py-3">
      <IconWallet class="size-5 shrink-0 text-T-800" />
      <span class="text-[14px] font-bold text-T-900">
        {{ formatPrice(balance) }}
        <span class="text-[11px] font-normal text-T-600">تومان</span>
      </span>
    </div>

    <button
      type="button"
      class="mt-3 flex w-full items-center justify-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-R-400"
      @click="fundsOpen = true"
    >
      افزایش موجودی کیف پول
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
