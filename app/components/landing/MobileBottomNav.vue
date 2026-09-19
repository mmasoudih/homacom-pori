<script setup lang="ts">
import {
  IconHome2,
  IconLayoutGrid,
  IconShoppingBag,
  IconNotes,
  IconUser,
} from '@tabler/icons-vue'

interface NavItem {
  label: string
  icon: typeof IconHome2
  href: string
  active?: boolean
  sheet?: boolean
}

const route = useRoute()

const items: NavItem[] = [
  { label: 'خانه', icon: IconHome2, href: '/' },
  { label: 'دسته‌بندی', icon: IconLayoutGrid, href: '/categories', sheet: true },
  { label: 'سبد خرید', icon: IconShoppingBag, href: '/cart' },
  { label: 'بلاگ', icon: IconNotes, href: '/blog' },
  { label: 'پروفایل', icon: IconUser, href: '/dashboard' },
]

const categoriesOpen = ref(false)

function isActive(href: string) {
  if (href === '/') return route.path === '/'
  return route.path === href || route.path.startsWith(`${href}/`)
}
</script>

<template>
  <nav
    class="fixed bottom-4 inset-x-4 z-50 grid grid-cols-5 rounded-full border border-T-400 bg-T-50/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] xl:hidden"
    dir="rtl"
  >
    <template v-for="item in items" :key="item.label">
      <button
        v-if="item.sheet"
        type="button"
        class="flex h-[68px] flex-col items-center justify-center gap-[5px] transition-colors"
        :class="categoriesOpen ? 'text-primary' : 'text-muted-foreground'"
        @click="categoriesOpen = true"
      >
        <component :is="item.icon" class="size-5" />
        <span class="text-[12.5px] font-semibold leading-[17.9px]">{{ item.label }}</span>
      </button>
      <NuxtLink
        v-else
        :to="item.href"
        class="flex h-[68px] flex-col items-center justify-center gap-[5px] transition-colors"
        :class="isActive(item.href) ? 'text-primary' : 'text-muted-foreground'"
      >
        <component :is="item.icon" class="size-5" />
        <span class="text-[12.5px] font-semibold leading-[17.9px]">{{ item.label }}</span>
      </NuxtLink>
    </template>
  </nav>

  <CategoriesCategoryMobileMenu v-model:open="categoriesOpen" />
</template>
