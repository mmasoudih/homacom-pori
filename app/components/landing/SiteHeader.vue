<script setup lang="ts">
import {
  IconMenu2,
  IconPhoneCall,
  IconSearch,
  IconShoppingBag,
  IconUserCheck,
  IconX,
  IconCoins,
  IconUserCheck as IconUserPanel,
  IconBuildingStore,
  IconLayoutGrid,
} from '@tabler/icons-vue'
import { headerNav } from '~/data/landing'

const mobileOpen = ref(false)

const navIcons: Record<string, typeof IconCoins> = {
  coins: IconCoins,
  'user-check': IconUserPanel,
  store: IconBuildingStore,
  grid: IconLayoutGrid,
}
</script>

<template>
  <header class="relative z-50 h-[142px] w-full border-b border-[#e5e7eb] bg-white">
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
    <div class="flex h-20 items-center justify-between px-4 xl:hidden">
      <div class="flex items-center gap-3">
        <button
          class="rounded-lg border border-border p-2 text-foreground"
          aria-label="منو"
          @click="mobileOpen = true"
        >
          <IconMenu2 class="size-5" />
        </button>
        <a href="#" class="shrink-0">
          <img src="/homacom-logo.png" alt="هماکام" class="h-12 w-12 object-contain">
        </a>
      </div>

      <div class="flex items-center gap-1">
        <button class="relative rounded-xl p-2.5 text-foreground" aria-label="سبد خرید">
          <IconShoppingBag class="size-6" />
          <span class="absolute left-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">4</span>
        </button>
        <NuxtLink
          to="/auth/login"
          class="rounded-xl p-2.5 text-foreground"
          aria-label="ورود"
        >
          <IconUserCheck class="size-6" />
        </NuxtLink>
      </div>
    </div>

    <!-- Mobile drawer -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="fixed inset-0 z-50 xl:hidden">
        <button class="absolute inset-0 bg-black/40" aria-label="بستن" @click="mobileOpen = false" />
        <div class="absolute right-0 top-0 flex h-full w-72 flex-col bg-background p-4">
          <div class="flex items-center justify-between border-b border-border pb-4">
            <img src="/homacom-logo.png" alt="هماکام" class="h-12 w-12 object-contain">
            <button class="rounded-lg p-2 hover:bg-secondary" aria-label="بستن" @click="mobileOpen = false">
              <IconX class="size-5" />
            </button>
          </div>
          <nav class="flex flex-col py-4">
            <a
              v-for="item in headerNav"
              :key="item.label"
              :href="item.href"
              class="rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              @click="mobileOpen = false"
            >
              {{ item.label }}
            </a>
          </nav>
          <div class="mt-auto flex items-center gap-2 border-t border-border pt-4 text-sm font-bold text-foreground" dir="ltr">
            <IconPhoneCall class="size-5 text-primary" />
            0121-3250789
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
