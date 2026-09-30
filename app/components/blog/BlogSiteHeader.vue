<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { IconChevronDown, IconMenu, IconSearch } from '@tabler/icons-vue'
import { blogNav, blogShopCta } from '~/data/blog'

const route = useRoute()

/** Slug of the open desktop dropdown ('' = none). */
const openSlug = ref('')
const drawerOpen = ref(false)
const searchQuery = ref('')
const searchOpen = ref(false)
const navEl = ref<HTMLElement | null>(null)
const mobileSearchEl = ref<HTMLInputElement | null>(null)

function toggleDropdown(slug: string) {
  searchOpen.value = false
  openSlug.value = openSlug.value === slug ? '' : slug
}

function closeDropdown() {
  openSlug.value = ''
}

onClickOutside(navEl, closeDropdown)

function submitSearch() {
  const term = searchQuery.value.trim()
  if (!term) return
  searchOpen.value = false
  closeDropdown()
  navigateTo({ path: '/blog/search', query: { q: term } })
}

watch(
  () => route.fullPath,
  () => {
    openSlug.value = ''
    drawerOpen.value = false
    searchOpen.value = false
  },
)

/** Mobile: reveal the inline search field and focus it. */
async function toggleMobileSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) return
  await nextTick()
  mobileSearchEl.value?.focus()
}
</script>

<template>
  <header class="sticky top-0 z-[60] w-full border-b border-T-400 bg-T-50">
    <!-- ============================== Desktop ============================= -->
    <div class="mx-auto hidden h-[94px] max-w-[1440px] items-center lg:flex lg:px-6">
      <NuxtLink to="/blog" class="shrink-0" aria-label="بلاگ هماکام">
        <img src="/icons/logo.svg" alt="هماکام" class="h-[46px] w-[62px] object-contain">
      </NuxtLink>

      <nav ref="navEl" class="relative ms-10 flex items-center gap-[34px]">
        <div v-for="item in blogNav" :key="item.slug" class="relative">
          <button
            type="button"
            class="flex items-center gap-2 text-[15px] font-medium transition-colors"
            :class="openSlug === item.slug ? 'text-primary' : 'text-foreground hover:text-primary'"
            :aria-expanded="openSlug === item.slug"
            aria-haspopup="menu"
            @click="toggleDropdown(item.slug)"
          >
            {{ item.label }}
            <IconChevronDown
              class="size-4 shrink-0 transition-transform"
              :class="openSlug === item.slug ? 'rotate-180 text-primary' : 'text-T-600'"
            />
          </button>

          <BlogNavDropdown
            v-if="openSlug === item.slug"
            :item="item"
            @close="closeDropdown"
          />
        </div>
      </nav>

      <NuxtLink
        :to="blogShopCta.href"
        class="ms-[52px] flex h-11 shrink-0 items-center rounded-full bg-R-10 px-[23px] text-[15px] font-medium text-primary transition-colors hover:bg-R-50"
      >
        {{ blogShopCta.label }}
      </NuxtLink>

      <form
        class="ms-auto flex h-11 w-[270px] shrink-0 items-center gap-2 rounded-full border border-T-400 bg-T-200 ps-4 pe-4"
        role="search"
        @submit.prevent="submitSearch"
      >
        <input
          v-model="searchQuery"
          type="search"
          placeholder="جستجو در مقالات ..."
          aria-label="جستجو در مقالات"
          class="min-w-0 flex-1 bg-transparent text-start text-[15px] text-foreground outline-none placeholder:text-T-600 [&::-webkit-search-cancel-button]:appearance-none"
        >
        <IconSearch class="size-5 shrink-0 text-T-600" />
      </form>
    </div>

    <!-- =============================== Mobile ============================= -->
    <div class="relative flex h-[66px] items-center justify-between px-5 lg:hidden">
      <button
        type="button"
        class="flex size-[26px] items-center justify-center text-foreground"
        aria-label="منو"
        @click="drawerOpen = true"
      >
        <IconMenu class="size-[24px]" />
      </button>

      <NuxtLink to="/blog" class="flex items-center" aria-label="بلاگ هماکام">
        <img src="/icons/logo.svg" alt="" class="me-1.5 h-[21px] w-[28px] object-contain">
        <span class="text-[16px] font-extrabold leading-none text-T-900">هما</span>
        <span class="text-[16px] font-extrabold leading-none text-primary">کام</span>
      </NuxtLink>

      <button
        type="button"
        class="flex size-[26px] items-center justify-center text-foreground"
        aria-label="جستجو در مقالات"
        @click="toggleMobileSearch"
      >
        <IconSearch class="size-[22px]" />
      </button>

      <!-- Inline search (mobile): overlays the header row -->
      <form
        v-if="searchOpen"
        class="absolute inset-0 flex items-center gap-3 bg-T-50 px-5"
        role="search"
        @submit.prevent="submitSearch"
      >
        <button
          type="button"
          class="text-T-700"
          aria-label="بستن جستجو"
          @click="searchOpen = false"
        >
          <IconChevronDown class="size-5 rotate-90" />
        </button>
        <input
          ref="mobileSearchEl"
          v-model="searchQuery"
          type="search"
          placeholder="جستجو در مقالات ..."
          aria-label="جستجو در مقالات"
          class="h-11 min-w-0 flex-1 rounded-full border border-T-400 bg-T-200 px-4 text-start text-[14px] text-foreground outline-none placeholder:text-T-600 [&::-webkit-search-cancel-button]:appearance-none"
        >
        <IconSearch class="size-5 shrink-0 text-T-600" />
      </form>
    </div>

    <BlogMobileDrawer v-model:open="drawerOpen" />
  </header>
</template>
