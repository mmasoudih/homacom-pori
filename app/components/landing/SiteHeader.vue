<script setup lang="ts">
import {
  IconMenu2,
  IconPhone,
  IconSearch,
  IconShoppingBag,
  IconUser,
  IconX,
} from '@tabler/icons-vue'
import { headerNavLinks } from '~/data/landing'

const mobileOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
    <div class="mx-auto max-w-[1400px] px-5">
      <div class="flex h-20 items-center justify-between gap-4">
        <!-- Right: logo + mobile + drawer toggle -->
        <div class="flex items-center gap-3">
          <button
            class="rounded-lg border border-border p-2 text-foreground lg:hidden"
            aria-label="منو"
            @click="mobileOpen = true"
          >
            <IconMenu2 class="size-5" />
          </button>
          <a href="#" class="shrink-0">
            <img src="/homacom-logo.png" alt="هماکام" class="h-12 w-12 object-contain">
          </a>
        </div>

        <!-- Center: search -->
        <div class="hidden flex-1 justify-center px-4 lg:flex">
          <div class="flex w-full max-w-xl items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30">
            <IconSearch class="size-5 shrink-0 text-muted-foreground" />
            <input
                              type="text"
                              placeholder="جستجو در محصولات ..."
                              class="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            >
          </div>
        </div>

        <!-- Left: cart + auth -->
        <div class="flex items-center gap-1">
          <button class="relative rounded-xl p-2.5 text-foreground transition-colors hover:bg-secondary" aria-label="سبد خرید">
            <IconShoppingBag class="size-6" />
            <span class="absolute left-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">4</span>
          </button>
          <NuxtLink
            to="/auth/login"
            class="hidden items-center gap-1.5 rounded-xl border border-primary p-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:flex"
          >
            <IconUser class="size-5" />
            <span class="pl-1">ثبت‌نام / ورود</span>
        </NuxtLink>
          <NuxtLink
            to="/auth/login"
            class="rounded-xl p-2.5 text-foreground md:hidden"
            aria-label="ورود"
          >
            <IconUser class="size-6" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Bottom nav bar -->
    <div class="hidden border-t border-border/60">
      <div class="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-5">
        <nav class="flex items-center gap-7">
          <a
            v-for="link in headerNavLinks"
            :key="link.href + link.label"
            :href="link.href"
            class="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {{ link.label }}
          </a>
        </nav>
        <a href="tel:0132530789" class="flex items-center gap-2 text-sm font-bold text-foreground" dir="ltr">
          <IconPhone class="size-5 text-primary" />
          ۰۱۳-۳۲۵۰۷۸۹
        </a>
      </div>
    </div>

    <!-- Mobile drawer -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="fixed inset-0 z-50 lg:hidden">
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
              v-for="link in headerNavLinks"
              :key="link.label"
              :href="link.href"
              class="rounded-xl px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              @click="mobileOpen = false"
            >
              {{ link.label }}
            </a>
          </nav>
          <div class="mt-auto flex items-center gap-2 border-t border-border pt-4 text-sm font-bold text-foreground" dir="ltr">
            <IconPhone class="size-5 text-primary" />
            ۰۱۳-۳۲۵۰۷۸۹
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
