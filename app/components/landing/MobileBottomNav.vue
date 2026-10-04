<script setup lang="ts">
import homeIcon from '../../../public/icons/bottom-nav/home.svg?raw'
import gridIcon from '../../../public/icons/bottom-nav/grid.svg?raw'
import bagIcon from '../../../public/icons/bottom-nav/bag.svg?raw'
import notesIcon from '../../../public/icons/bottom-nav/notes.svg?raw'
import userIcon from '../../../public/icons/bottom-nav/user.svg?raw'

interface NavItem {
  label: string
  icon: string
  href: string
  active?: boolean
  sheet?: boolean
}

const route = useRoute()

const items: NavItem[] = [
  { label: 'خانه', icon: homeIcon, href: '/' },
  { label: 'دسته‌بندی', icon: gridIcon, href: '/categories', sheet: true },
  { label: 'سبد خرید', icon: bagIcon, href: '/cart' },
  { label: 'بلاگ', icon: notesIcon, href: '/blog' },
  { label: 'پروفایل', icon: userIcon, href: '/dashboard' },
]

const categoriesOpen = ref(false)

// Navigating away should always dismiss the category sheet.
watch(
  () => route.fullPath,
  () => {
    categoriesOpen.value = false
  },
)

function isActive(href: string) {
  if (href === '/') return route.path === '/'
  return route.path === href || route.path.startsWith(`${href}/`)
}
</script>

<template>
  <nav
    class="fixed bottom-4 inset-x-4 z-[67] grid h-[68px] grid-cols-5 rounded-full border border-T-400 bg-T-50/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] lg:hidden"
    dir="rtl"
  >
    <template v-for="item in items" :key="item.label">
      <button
        v-if="item.sheet"
        type="button"
        class="flex h-full flex-col items-center justify-center gap-[5px] transition-colors"
        :class="categoriesOpen ? 'text-primary' : 'text-T-600'"
        @click.stop="categoriesOpen = !categoriesOpen"
      >
        <span class="[&>svg]:block [&>svg]:size-5" aria-hidden="true" v-html="item.icon" />
        <UiTypography as="span" size="xs" weight="semibold" color="inherit" class="leading-[17.9px]">
          {{ item.label }}
        </UiTypography>
      </button>
      <NuxtLink
        v-else
        :to="item.href"
        class="flex h-full flex-col items-center justify-center gap-[5px] transition-colors"
        :class="isActive(item.href) ? 'text-primary' : 'text-T-600'"
      >
        <span class="[&>svg]:block [&>svg]:size-5" aria-hidden="true" v-html="item.icon" />
        <UiTypography as="span" size="xs" weight="semibold" color="inherit" class="leading-[17.9px]">
          {{ item.label }}
        </UiTypography>
      </NuxtLink>
    </template>
  </nav>

  <CategoriesCategoryMobileMenu v-model:open="categoriesOpen" />
</template>
