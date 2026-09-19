<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { IconBell, IconSearch, IconUser } from '@tabler/icons-vue'
import { headerNav } from '~/data/landing'
import { unreadNotifications } from '~/data/dashboard'
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

const token = useCookie('auth_token')
const authed = computed(() => !!token.value)

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

// Hide the phone + nav row when scrolling down, reveal it when scrolling up.
// The row also collapses the header height, which shifts layout and makes the
// browser fire compensating scroll events — a short lock keeps that from
// flipping the state back mid-transition.
const { y: scrollY } = useWindowScroll()
const rowHidden = ref(false)
let lastScrollY = 0
let scrollLockUntil = 0

watch(scrollY, (value) => {
  const now = Date.now()
  if (now < scrollLockUntil) {
    lastScrollY = value
    return
  }

  const delta = value - lastScrollY
  const next = value < 80
    ? false
    : delta > 6
      ? true
      : delta < -6
        ? false
        : rowHidden.value

  if (next !== rowHidden.value) {
    rowHidden.value = next
    scrollLockUntil = now + 700
  }
  lastScrollY = value
})

onMounted(() => {
  lastScrollY = window.scrollY
})
</script>

<template>
  <header class="sticky top-0 z-[60] w-full border-b border-T-400 bg-T-50">
    <!-- Desktop (≥1280px) -->
    <div class="mx-auto hidden max-w-[1350px] xl:block">
      <!-- Row 1: Cart, Auth, Search, Logo -->
      <div class="grid h-[71px] grid-cols-[86px_480px_1fr_269px_61px] px-0">
        <!-- Cart button -->
        <button
          class="relative col-start-5 row-start-1 mt-[22px] flex size-12 items-center justify-center justify-self-end rounded-full border border-T-400 text-foreground transition-colors hover:bg-secondary"
          aria-label="سبد خرید"
        >
          <img src="/icons/shopping-bag.svg" alt="" class="size-6">
          <span class="absolute right-[0px] bottom-[-6px] flex size-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">4</span>
        </button>

        <!-- Auth: logged-in cluster or login pill -->
        <div class="col-start-4 row-start-1 mt-[22px] flex h-12 items-center justify-self-end">
          <div v-if="authed" class="flex items-center gap-2">
            <NuxtLink
              to="/dashboard"
              class="flex size-11 items-center justify-center rounded-full bg-T-200 text-T-600 transition-colors hover:bg-T-300"
              aria-label="حساب کاربری"
            >
              <IconUser class="size-6" />
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="relative flex size-11 items-center justify-center rounded-full border border-T-400 text-T-700 transition-colors hover:bg-secondary"
              aria-label="اعلان‌ها"
            >
              <IconBell class="size-5" />
              <span class="absolute -top-1 -end-1 flex size-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {{ unreadNotifications }}
              </span>
            </NuxtLink>
          </div>

          <div
            v-else
            class="flex h-12 items-center gap-1 rounded-full border border-T-400 px-4 text-[15px] font-medium text-T-900"
            dir="rtl"
          >
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
      </div>

      <!-- Row 2: Phone + Nav (collapses on scroll down, reveals on scroll up) -->
      <div
        class="grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="rowHidden ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'"
      >
        <div class="min-h-0">
          <div
            class="flex items-center justify-between pt-[27px] pb-[21px] transition-[transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            :class="rowHidden ? '-translate-y-4 blur-[2px]' : 'translate-y-0 blur-0'"
          >
            <!-- Nav -->
            <nav class="flex items-center gap-8">
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

            <!-- Phone -->
            <a
              href="tel:0121-3250789"
              class="flex items-center gap-2 text-[15px] font-semibold text-foreground"
              dir="ltr"
            >
              <img src="/icons/phone-call.svg" alt="" class="size-5">
              <span><span class="text-R-300">0121</span>-3250789</span>
            </a>
          </div>
        </div>
      </div>
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

      <NuxtLink
        v-if="authed"
        to="/dashboard"
        class="relative ms-3 flex size-11 shrink-0 items-center justify-center rounded-full bg-T-200 text-T-600"
        aria-label="حساب کاربری"
      >
        <IconUser class="size-6" />
        <span class="absolute -top-1 -end-1 flex size-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
          {{ unreadNotifications }}
        </span>
      </NuxtLink>
    </div>

    <CategoriesCategoryMegaMenu :open="megaOpen" @close="handleMegaClose" />
  </header>
</template>
