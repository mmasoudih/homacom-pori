<script setup lang="ts">
import {
  IconPhoneCall,
  IconSearch,
  IconShoppingBag,
  IconUserCheck,
  IconCoins,
  IconUserCheck as IconUserPanel,
  IconBuildingStore,
  IconLayoutGrid,
} from '@tabler/icons-vue'
import { headerNav } from '~/data/landing'

const navIcons: Record<string, typeof IconCoins> = {
  coins: IconCoins,
  'user-check': IconUserPanel,
  store: IconBuildingStore,
  grid: IconLayoutGrid,
}
</script>

<template>
  <header class="relative z-50 w-full border-b border-[#e5e7eb] bg-white">
    <!-- Desktop (≥1280px) -->
    <div class="relative mx-auto hidden h-[142px] max-w-[1350px] px-0 xl:block">
      <!-- Row 1: Cart, Auth, Search, Logo -->
      <!-- Cart button -->
      <button
        class="absolute left-0 top-[22px] flex size-12 items-center justify-center rounded-full border border-[#c8ccd2] text-foreground transition-colors hover:bg-secondary"
        aria-label="سبد خرید"
      >
        <IconShoppingBag class="size-6" />
        <span class="absolute left-[7px] top-[7px] flex size-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">4</span>
      </button>

      <!-- Auth pill -->
      <div class="absolute left-[61px] top-[22px] flex h-12 items-center gap-0">
        <NuxtLink
          to="/auth/login"
          class="flex items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <IconUserCheck class="size-5" />
        </NuxtLink>
        <div class="mr-3 flex items-center gap-1 text-[15px] font-medium text-foreground" dir="rtl">
          <NuxtLink to="/auth/login" class="hover:text-primary">ورود</NuxtLink>
          <span class="text-[#c8ccd2]">|</span>
          <NuxtLink to="/auth/register" class="hover:text-primary">ثبت‌نام</NuxtLink>
        </div>
      </div>

      <!-- Search -->
      <div class="absolute left-[330px] top-[22px] flex h-11 w-[480px] items-center gap-3 rounded-full border border-[#e5e7eb] bg-white px-4 focus-within:ring-2 focus-within:ring-primary/30">
        <IconSearch class="size-5 shrink-0 text-[#9ca3af]" />
        <input
          type="text"
          placeholder="جستجو در محصولات ..."
          class="w-full bg-transparent text-[15px] text-foreground placeholder:text-[#9ca3af] focus:outline-none"
        >
      </div>

      <!-- Logo -->
      <a href="#" class="absolute right-0 top-4">
        <img src="/homacom-logo.png" alt="هماکام" class="h-[52px] w-[70px] object-contain">
      </a>

      <!-- Row 2: Phone, Nav -->
      <!-- Phone -->
      <a
        href="tel:0121-3250789"
        class="absolute bottom-[22px] left-0 flex items-center gap-2 text-[15px] font-semibold text-foreground"
        dir="ltr"
      >
        <IconPhoneCall class="size-5 text-primary" />
        0121-3250789
      </a>

      <!-- Nav -->
      <nav class="absolute bottom-[22px] right-0 flex items-center gap-8">
        <a
          v-for="item in headerNav"
          :key="item.label"
          :href="item.href"
          class="flex items-center gap-2 text-[15px] font-medium text-foreground transition-colors hover:text-primary"
        >
          <component
            :is="navIcons[item.icon]"
            class="size-5 text-primary"
          />
          {{ item.label }}
        </a>
      </nav>
    </div>

    <!-- Mobile / Tablet (<1280px) -->
    <div class="flex h-[73px] items-center justify-between px-4 xl:hidden">
      <!-- Logo (right in RTL) -->
      <a href="#" class="shrink-0">
        <img src="/homacom-logo.png" alt="هماکام" class="h-[52px] w-[70px] object-contain">
      </a>

      <!-- Search pill (left in RTL) -->
      <div class="mr-4 flex h-11 flex-1 items-center gap-3 rounded-full border border-[#e5e7eb] bg-[#f5f6f7] px-4">
        <span class="flex-1 text-[15px] text-[#9ca3af]">جستجو در</span>
        <IconSearch class="size-5 shrink-0 text-[#9ca3af]" />
      </div>
    </div>
  </header>
</template>
