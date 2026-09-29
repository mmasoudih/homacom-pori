<script setup lang="ts">
import { useElementSize, useEventListener, useWindowScroll } from '@vueuse/core'
import { IconBell, IconSearch, IconUser } from '@tabler/icons-vue'
import { headerNav } from '~/data/landing'
import type { SearchCategoryTile } from '~/data/search'
import { unreadNotifications } from '~/data/dashboard'
import coinsFront from '../../../public/icons/coins-front.svg?raw'
import userCheckCircleAlt from '../../../public/icons/user-check-circle-alt.svg?raw'
import storeIcon from '../../../public/icons/store.svg?raw'
import gridSquareCircle from '../../../public/icons/grid-square-circle.svg?raw'

withDefaults(defineProps<{
  /** Render the quick-access circle strip inside the header (home page only). */
  quickCategories?: boolean
}>(), {
  quickCategories: false,
})

const navIcons: Record<string, string> = {
  coins: coinsFront,
  'user-check': userCheckCircleAlt,
  store: storeIcon,
  grid: gridSquareCircle,
}

const route = useRoute()

// Expose the rendered header height as a CSS variable so the mega-menu panel
// (teleported to <body>, position: fixed) sits flush under the header on every
// page — accounting for the top bar, the collapsing nav row and circle strip.
const headerEl = ref<HTMLElement | null>(null)
const { height: headerHeight } = useElementSize(headerEl)

watch(headerHeight, (height) => {
  if (!import.meta.client || height <= 0) return
  document.documentElement.style.setProperty('--site-header-offset', `${Math.round(height)}px`)
})

const token = useCookie('auth_token')
const authed = computed(() => !!token.value)

const megaOpen = ref(false)
const megaTriggerEl = ref<HTMLElement | null>(null)

function handleMegaClose() {
  megaOpen.value = false
  megaTriggerEl.value?.focus()
}

// --- Header search ---------------------------------------------------------
const {
  query: searchQuery,
  status: searchStatus,
  results: searchResults,
  categories: searchCategories,
  run: runSearch,
} = useProductSearch()

const {
  items: recentSearches,
  add: addRecentSearch,
  remove: removeRecentSearch,
  clear: clearRecentSearches,
} = useRecentSearches()

const searchOpen = ref(false)
const searchBoxEl = ref<HTMLElement | null>(null)

function openSearch() {
  megaOpen.value = false
  searchOpen.value = true
}

function closeSearch() {
  searchOpen.value = false
}

function onSearchInput(value: string) {
  searchQuery.value = value
  searchOpen.value = true
  // `runSearch('')` resets the panel back to the suggestion state.
  runSearch(value)
}

/** Run a term in place (recent / popular suggestion chips). */
function selectSearchTerm(term: string) {
  searchQuery.value = term
  searchOpen.value = true
  runSearch(term)
}

/** Navigate to the full results page for a term. */
function goToResults(term: string) {
  const value = term.trim()
  if (!value) return
  addRecentSearch(value)
  closeSearch()
  navigateTo({ path: '/search', query: { q: value } })
}

function selectSearchCategory(tile: SearchCategoryTile) {
  goToResults(tile.title)
}

watch(
  () => route.fullPath,
  () => {
    megaOpen.value = false
    searchOpen.value = false
  },
)

// Hide the phone + nav row when scrolling down, reveal it when scrolling up.
const { y: scrollY } = useWindowScroll()
const rowHidden = ref(false)
let lastScrollY = 0

watch(scrollY, (value) => {
  const delta = value - lastScrollY
  lastScrollY = value

  // Never collapse the header while the mega menu is open.
  if (megaOpen.value) {
    rowHidden.value = false
    return
  }

  // Always reveal at the very top of the page.
  if (value < 80) {
    rowHidden.value = false
    return
  }

  if (delta > 6) rowHidden.value = true
  else if (delta < -6) rowHidden.value = false
})

// Anchor the teleported mega panel right under the trigger button rather than
// under the whole header: expose the button's viewport coordinates as CSS vars.
function syncMegaPosition() {
  if (!import.meta.client) return
  const el = megaTriggerEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  document.documentElement.style.setProperty('--mega-panel-top', `${Math.round(rect.bottom)}px`)
}

function toggleMega() {
  // Measure before opening so the panel/backdrop mount at their final position
  // instead of flashing at the fallback offset and jumping.
  if (!megaOpen.value) syncMegaPosition()
  searchOpen.value = false
  megaOpen.value = !megaOpen.value
}

watch(megaOpen, async (open) => {
  if (!open) return
  // Keep the header expanded while the menu is open, then re-measure once the
  // DOM has settled so the panel stays anchored under the trigger button.
  rowHidden.value = false
  await nextTick()
  syncMegaPosition()
})

watch(rowHidden, () => {
  if (megaOpen.value) syncMegaPosition()
})

useEventListener(window, 'resize', () => {
  if (megaOpen.value) syncMegaPosition()
})

onMounted(() => {
  lastScrollY = window.scrollY
})
</script>

<template>
  <header ref="headerEl" class="sticky top-0 z-[60] w-full border-b border-T-400 bg-T-50" :class="{'pb-2' : rowHidden || megaOpen}">
    <LandingTopBar />

    <!-- Desktop (≥1024px) -->
    <div class="mx-auto hidden max-w-[1440px] lg:block">
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
        <div
          ref="searchBoxEl"
          class="col-start-2 row-start-1 mt-[22px] flex h-11 w-[480px] items-center justify-self-start"
        >
          <SearchInput
            :model-value="searchQuery"
            @update:model-value="onSearchInput"
            @focus="openSearch"
            @submit="goToResults"
            @escape="closeSearch"
          />
        </div>

        <!-- Logo -->
        <a href="#" class="col-start-1 row-start-1 mt-4 justify-self-start self-start">
          <img src="/icons/logo.svg" alt="هماکام" class="h-[52px] w-[70px] object-contain">
        </a>
      </div>

      <!-- Row 2: Phone + Nav (collapses on scroll down, reveals on scroll up) -->
      <!-- overflow-clip + clip-margin (instead of overflow-hidden) so the strip's
           arrows can protrude past the container edge without being cropped. -->
      <div
        class="grid grid-cols-1 overflow-clip transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [overflow-clip-margin:24px]"
        :class="rowHidden ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'"
      >
        <div class="min-h-0 min-w-0">
          <div
            class="flex items-center justify-between pt-[27px] transition-[transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            :class="[
              quickCategories ? 'pb-3' : 'pb-[21px]',
              rowHidden ? '-translate-y-4 blur-[2px]' : 'translate-y-0 blur-0',
            ]"
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
                  @click="toggleMega"
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

          <div v-if="quickCategories" class="w-full h-0.5 rounded-full bg-T-400 my-2"/>
          <!-- Quick-access circle strip (home only) -->
          <LandingHeaderCircleStrip v-if="quickCategories" class="w-full pb-[20px]" />

        </div>
      </div>
    </div>

    <!-- Mobile (<1024px) -->
    <div class="lg:hidden">
      <div class="flex h-[73px] items-center justify-between px-4">
        <!-- Logo (right in RTL) -->
        <a href="#" class="shrink-0">
          <img src="/homacom-logo.png" alt="هماکام" class="h-[52px] w-[70px] object-contain">
        </a>

        <!-- Search pill (left in RTL) — opens the full-screen search -->
        <button
          type="button"
          class="mr-4 flex h-11 flex-1 items-center gap-3 rounded-full border border-T-400 bg-T-200 px-4"
          aria-label="جستجو در محصولات"
          @click="openSearch"
        >
          <span class="flex-1 text-start text-[15px] text-T-600">جستجو در محصولات ...</span>
          <IconSearch class="size-5 shrink-0 text-T-600" />
        </button>

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

      <!-- Quick-access circle strip, after the search box (home only) -->
      <div
        v-if="quickCategories"
        class="grid grid-cols-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="rowHidden ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'"
      >
        <div class="min-h-0 min-w-0">
          <LandingHeaderCircleStrip class="w-full px-4 pb-3" />
        </div>
      </div>
    </div>

    <CategoriesCategoryMegaMenu :open="megaOpen" @close="handleMegaClose" />

    <!-- Desktop search dropdown (anchored under the header search box) -->
    <SearchDropdown
      :open="searchOpen"
      :anchor="searchBoxEl"
      :query="searchQuery"
      :status="searchStatus"
      :results="searchResults"
      :categories="searchCategories"
      :recent="recentSearches"
      @close="closeSearch"
      @select="selectSearchTerm"
      @remove-recent="removeRecentSearch"
      @clear-recent="clearRecentSearches"
      @select-category="selectSearchCategory"
      @view-all="goToResults(searchQuery)"
    />

    <!-- Mobile full-screen search -->
    <SearchOverlay
      :open="searchOpen"
      :query="searchQuery"
      :status="searchStatus"
      :results="searchResults"
      :categories="searchCategories"
      :recent="recentSearches"
      @close="closeSearch"
      @update:query="onSearchInput"
      @submit="goToResults"
      @select="selectSearchTerm"
      @remove-recent="removeRecentSearch"
      @clear-recent="clearRecentSearches"
      @select-category="selectSearchCategory"
      @view-all="goToResults(searchQuery)"
    />
  </header>
</template>
