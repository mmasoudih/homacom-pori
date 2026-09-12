<script setup lang="ts">
import { headerNav } from '~/data/landing'
import coinsFront from '../../../public/icons/coins-front.svg?raw'
import userCheckCircleAlt from '../../../public/icons/user-check-circle-alt.svg?raw'
import storeIcon from '../../../public/icons/store.svg?raw'
import gridSquareCircle from '../../../public/icons/grid-square-circle.svg?raw'

const navIcons: Record<string, string> = {
  coins: coinsFront,
  'user-check': userCheckCircleAlt,
  store: storeIcon,
  grid: gridSquareCircle,
}

const route = useRoute()

const megaOpen = ref(false)
const megaTriggerEl = ref<HTMLElement | null>(null)

function handleMegaClose() {
  megaOpen.value = false
  megaTriggerEl.value?.focus()
}

watch(
  () => route.fullPath,
  () => {
    megaOpen.value = false
  },
)
</script>

<template>
  <header class="sticky top-0 z-[60] w-full border-b border-T-400 bg-T-50">
    <!-- Desktop (≥1280px) -->
    <div class="mx-auto hidden h-[142px] max-w-[1350px] grid-cols-[86px_480px_1fr_269px_61px] grid-rows-2 px-0 xl:grid">
      <!-- Row 1: Cart, Auth, Search, Logo -->
      <!-- Cart button -->
      <button
        class="relative col-start-5 row-start-1 mt-[22px] flex size-12 items-center justify-center justify-self-end rounded-full border border-T-400 text-foreground transition-colors hover:bg-secondary"
        aria-label="سبد خرید"
      >
        <img src="/icons/shopping-bag.svg" alt="" class="size-6">
        <span class="absolute right-[0px] bottom-[-6px] flex size-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">4</span>
      </button>

      <!-- Auth pill -->
      <div class="col-start-4 row-start-1 mt-[22px] flex h-12 items-center justify-self-end">
        <div class="flex h-12 items-center gap-1 rounded-full border border-T-400 px-4 text-[15px] font-medium text-T-900" dir="rtl">
          <NuxtLink to="/auth/login" class="hover:text-primary">ورود</NuxtLink>
          <span class="text-T-500">|</span>
          <NuxtLink to="/auth/register" class="hover:text-primary">ثبت‌نام</NuxtLink>
        </div>
      </div>

      <!-- Search -->
      <div class="col-start-2 row-start-1 mt-[22px] flex h-11 w-[480px] items-center justify-self-start gap-3 rounded-full border border-T-300 bg-T-200 px-4">
        <input
          type="text"
          placeholder="جستجو در محصولات ..."
          class="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-T-600"
        >
        <span
          class="size-5 shrink-0 bg-T-800 [mask-image:url(/icons/search.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
          aria-hidden="true"
        />
      </div>

      <!-- Logo -->
      <a href="#" class="col-start-1 row-start-1 mt-4 justify-self-start self-start">
        <img src="/icons/logo.svg" alt="هماکام" class="h-[52px] w-[70px] object-contain">
      </a>

      <!-- Row 2: Phone, Nav -->
      <!-- Phone -->
      <a
        href="tel:0121-3250789"
        class="col-span-2 col-start-4 row-start-2 mb-[22px] flex items-center justify-self-end gap-2 self-end text-[15px] font-semibold text-foreground"
        dir="ltr"
      >
        <img src="/icons/phone-call.svg" alt="" class="size-5">
        <span><span class="text-R-300">0121</span>-3250789</span>
      </a>

      <!-- Nav -->
      <nav class="col-span-3 col-start-1 row-start-2 mb-[22px] flex items-center justify-self-start gap-8 self-end">
        <template v-for="item in headerNav" :key="item.label">
          <button
            v-if="item.mega"
            :ref="(el) => (megaTriggerEl = el as HTMLElement | null)"
            type="button"
            class="group flex items-center gap-2 text-[15px] font-medium transition-colors"
            :class="megaOpen ? 'text-primary' : 'text-foreground hover:text-primary'"
            aria-haspopup="menu"
            :aria-expanded="megaOpen"
            @click="megaOpen = !megaOpen"
          >
            <span class="text-T-600 transition-colors group-hover:text-R-300 [&>svg]:block [&>svg]:size-5" aria-hidden="true" v-html="navIcons[item.icon]" />
            {{ item.label }}
          </button>
          <NuxtLink
            v-else
            :to="item.href"
            class="group flex items-center gap-2 text-[15px] font-medium text-foreground transition-colors hover:text-primary"
          >
            <span class="text-T-600 transition-colors group-hover:text-R-300 [&>svg]:block [&>svg]:size-5" aria-hidden="true" v-html="navIcons[item.icon]" />
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>
    </div>

    <!-- Mobile / Tablet (<1280px) -->
    <div class="flex h-[73px] items-center justify-between px-4 xl:hidden">
      <!-- Logo (right in RTL) -->
      <a href="#" class="shrink-0">
        <img src="/homacom-logo.png" alt="هماکام" class="h-[52px] w-[70px] object-contain">
      </a>

      <!-- Search pill (left in RTL) -->
      <div class="mr-4 flex h-11 flex-1 items-center gap-3 rounded-full border border-T-400 bg-T-200 px-4">
        <span class="flex-1 text-[15px] text-T-600">جستجو در</span>
        <IconSearch class="size-5 shrink-0 text-T-600" />
      </div>
    </div>

    <CategoriesCategoryMegaMenu :open="megaOpen" @close="handleMegaClose" />
  </header>
</template>
