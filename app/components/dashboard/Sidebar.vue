<script setup lang="ts">
import {
  IconBell,
  IconChevronLeft,
  IconHeadset,
  IconHeart,
  IconLayoutDashboard,
  IconLogout,
  IconMapPin,
  IconMessageCircle,
  IconPencil,
  IconShoppingBag,
  IconUser,
  IconUserCircle,
  IconWallet,
} from '@tabler/icons-vue'
import type { DashboardNavIcon } from '~/data/dashboard'
import { dashboardNav, dashboardUser, wallet } from '~/data/dashboard'
import { formatPrice } from '~/utils/format'

const navIcons: Record<DashboardNavIcon, typeof IconUser> = {
  dashboard: IconLayoutDashboard,
  orders: IconShoppingBag,
  favorites: IconHeart,
  addresses: IconMapPin,
  comments: IconMessageCircle,
  notifications: IconBell,
  support: IconHeadset,
  account: IconUserCircle,
  logout: IconLogout,
}

const balance = ref(wallet.balance)
const fundsOpen = ref(false)
const logoutOpen = ref(false)

function onCharged(amount: number) {
  balance.value += amount
}

function onNavClick(item: typeof dashboardNav[number]) {
  if (item.key === 'logout') logoutOpen.value = true
}
</script>

<template>
  <aside class="relative w-full">
    <div class="rounded-[20px] border border-T-400 bg-T-50 p-4">
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

      <!-- Navigation -->
      <nav class="mt-5 flex flex-col gap-1">
        <button
          v-for="item in dashboardNav"
          :key="item.key"
          type="button"
          class="flex items-center gap-3 rounded-xl px-3 py-3 text-[13.5px] font-medium transition-colors"
          :class="
            item.key === 'dashboard'
              ? 'bg-T-200 text-T-900'
              : item.danger
                ? 'text-primary hover:bg-R-10'
                : 'text-T-800 hover:bg-T-100'
          "
          @click="onNavClick(item)"
        >
          <component
            :is="navIcons[item.icon]"
            class="size-5 shrink-0"
            :class="item.danger ? 'text-primary' : 'text-T-700'"
          />
          {{ item.label }}
        </button>
      </nav>
    </div>

    <!-- Support FAB -->
    <button
      type="button"
      class="absolute end-[-14px] top-[300px] hidden size-11 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 xl:flex"
      aria-label="پشتیبانی"
    >
      ؟
    </button>

    <DashboardAddFundsDialog
      v-model:open="fundsOpen"
      :balance="balance"
      :min="wallet.minCharge"
      :max="wallet.maxCharge"
      @charged="onCharged"
    />
    <DashboardLogoutDialog v-model:open="logoutOpen" />
  </aside>
</template>
