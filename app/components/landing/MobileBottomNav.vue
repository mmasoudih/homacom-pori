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
}

const route = useRoute()

const items: NavItem[] = [
  { label: 'خانه', icon: IconHome2, href: '/', active: true },
  { label: 'دسته\u200Cبندی', icon: IconLayoutGrid, href: '/categories' },
  { label: 'سبد خرید', icon: IconShoppingBag, href: '/cart' },
  { label: 'بلاگ', icon: IconNotes, href: '/blog' },
  { label: 'پروفایل', icon: IconUser, href: '/profile' },
]
</script>

<template>
  <nav
    class="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-white/90 px-5 py-2 backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.08)] xl:hidden"
    dir="rtl"
  >
    <NuxtLink
      v-for="item in items"
      :key="item.label"
      :to="item.href"
      class="flex flex-col items-center gap-[5px] px-4 transition-colors"
      :class="route.path === item.href ? 'text-primary' : 'text-muted-foreground'"
    >
      <component :is="item.icon" class="size-5" />
      <span class="text-[12.5px] font-semibold leading-[17.9px]">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>
