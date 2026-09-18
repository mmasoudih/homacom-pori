<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  backTo: string
  backLabel?: string
}>(), {
  backLabel: 'بازگشت به جزئیات سفارش',
})

const navItems = [
  'دسته بندی محصولات',
  'خرید حضوری',
  'پنل همکار و سازمانی',
  'خرید اقساطی',
]
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-50">
    <header class="w-full border-b border-T-400 bg-T-50">
      <div class="mx-auto flex max-w-[1350px] items-center justify-between gap-6 px-4 py-3 lg:px-6">
        <NuxtLink
          :to="props.backTo"
          class="flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors hover:text-R-400"
        >
          {{ props.backLabel }}
          <IconArrowLeft class="size-4" />
        </NuxtLink>

        <NuxtLink to="/" class="shrink-0">
          <img src="/homacom-logo.png" alt="هماکام" class="h-[52px] w-[70px] object-contain">
        </NuxtLink>

        <div class="hidden flex-col items-end gap-1.5 lg:flex">
          <nav class="flex items-center gap-6 text-[13px] font-medium text-foreground">
            <span v-for="item in navItems" :key="item">{{ item }}</span>
          </nav>
          <a href="tel:0121-3250789" class="text-[13px] font-semibold" dir="ltr">
            <span class="text-R-300">0121</span>-3250789
          </a>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 lg:px-6 lg:py-8">
      <slot />
    </main>
  </div>
</template>
