<script setup lang="ts">
import type { DashboardNavIcon } from '~/data/dashboard'
import { dashboardNav } from '~/data/dashboard'
import { toPersianDigits } from '~/utils/format'

const navIcons: Record<DashboardNavIcon, string> = {
  dashboard: '/icons/layout-dashboard.svg',
  orders: '/icons/package.svg',
  favorites: '/icons/heart-simple.svg',
  addresses: '/icons/signs-post.svg',
  comments: '/icons/message-text.svg',
  notifications: '/icons/bell.svg',
  support: '/icons/headphones-simple.svg',
  account: '/icons/user-circle.svg',
  logout: '/icons/logout.svg',
}

const route = useRoute()
const router = useRouter()
const logoutOpen = ref(false)

/** Longest nav href that the current path lives under (so nested order pages keep "سفارش‌های من" active). */
const activeHref = computed(() => {
  const matches = dashboardNav
    .filter(item => item.href !== '#' && (route.path === item.href || route.path.startsWith(`${item.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)
  return matches[0]?.href
})

function onNavClick(item: typeof dashboardNav[number]) {
  if (item.key === 'logout') {
    logoutOpen.value = true
    return
  }
  if (item.href.startsWith('/')) router.push(item.href)
}
</script>

<template>
  <div>
    <nav class="flex flex-col gap-1">
      <button
        v-for="item in dashboardNav"
        :key="item.key"
        type="button"
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-[13.5px] font-medium transition-colors"
        :class="
          !item.danger && activeHref === item.href
            ? 'bg-T-200 text-T-900'
            : item.danger
              ? 'text-primary hover:bg-R-10'
              : 'text-T-800 hover:bg-T-100'
        "
        @click="onNavClick(item)"
      >
        <img :src="navIcons[item.icon]" alt="" class="size-5 shrink-0">
        {{ item.label }}
        <UiTypography
          v-if="item.badge"
          as="span"
          size="md"
          weight="bold"
          tracking="wide"
          color="white"
          class="ms-auto flex h-[25px] w-[29px] shrink-0 items-center justify-center rounded-[50px] bg-primary"
        >
          {{ toPersianDigits(item.badge) }}
        </UiTypography>
      </button>
    </nav>

    <DashboardLogoutDialog v-model:open="logoutOpen" />
  </div>
</template>
