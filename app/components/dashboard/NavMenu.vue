<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconBell,
  IconHeadset,
  IconHeart,
  IconLayoutDashboard,
  IconLogout,
  IconMapPin,
  IconMessageCircle,
  IconShoppingBag,
  IconUserCircle,
} from '@tabler/icons-vue'
import type { DashboardNavIcon } from '~/data/dashboard'
import { dashboardNav } from '~/data/dashboard'

const navIcons: Record<DashboardNavIcon, Component> = {
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
        <component
          :is="navIcons[item.icon]"
          class="size-5 shrink-0"
          :class="item.danger ? 'text-primary' : 'text-T-700'"
        />
        {{ item.label }}
      </button>
    </nav>

    <DashboardLogoutDialog v-model:open="logoutOpen" />
  </div>
</template>
