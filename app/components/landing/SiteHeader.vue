<script setup lang="ts">
import { useElementSize, useEventListener, useWindowScroll } from '@vueuse/core'
import { IconBell, IconSearch, IconUser } from '@tabler/icons-vue'
import { headerNav } from '~/data/landing'
import { toPersianDigits } from '~/utils/format'
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

    <!-- Desktop (≥1024px) — `lg:px-6` keeps the canvas off the browser edge. -->
    <div class="mx-auto hidden max-w-[1440px] lg:block lg:px-6">
      <!-- Row 1: Cart, Auth, Search, Logo -->
      <div class="grid h-[71px] grid-cols-[86px_480px_1fr_269px_61px] px-0">
        <!-- Cart button -->
        <button
          class="relative col-start-5 row-start-1 mt-[22px] flex size-12 items-center justify-center justify-self-end rounded-full border border-T-400 text-foreground transition-colors hover:bg-secondary"
          aria-label="سبد خرید"
        >
          <img src="/icons/shopping-bag.svg" alt="" class="size-6">
          <UiTypography
            as="span"
            size="md"
            weight="bold"
            tracking="wide"
            color="white"
            class="absolute right-[0px] bottom-[-6px] flex size-[18px] items-center justify-center rounded-full bg-primary"
          >{{ toPersianDigits('4') }}</UiTypography>
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
            class="flex h-12 items-center gap-1 rounded-full border border-T-400 px-4 text-T-900"
            dir="rtl"
          >
            <NuxtLink to="/auth/login" class="hover:text-primary">
              <UiTypography as="span" size="lg" weight="medium" color="inherit">ورود</UiTypography>
            </NuxtLink>
            <span class="text-T-500">|</span>
            <NuxtLink to="/auth/register" class="hover:text-primary">
              <UiTypography as="span" size="lg" weight="medium" color="inherit">ثبت‌نام</UiTypography>
            </NuxtLink>
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
              class="flex items-center gap-2 text-foreground"
              dir="ltr"
            >
              <img src="/icons/phone-call.svg" alt="" class="size-5">
              <UiTypography as="span" size="lg" weight="bold" tracking="wide">
                <span class="text-R-300">{{ toPersianDigits('0121') }}</span>{{ toPersianDigits('-3250789') }}
              </UiTypography>
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
      <div class="flex items-center gap-3 px-4 py-[14.5px]">
        <!-- Search pill — opens the full-screen search -->
        <button
          type="button"
          class="flex h-11 flex-1 items-center gap-2 rounded-full border border-T-400 bg-T-200 px-4"
          aria-label="جستجو در محصولات"
          @click="openSearch"
        >
          <IconSearch class="size-5 shrink-0 text-T-600" />
          <span class="text-[15px] text-T-600">جستجو در</span>
          <svg
            width="56"
            height="20"
            viewBox="0 0 56 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="shrink-0"
            aria-hidden="true"
          >
            <path d="M52.0954 6.75037H42.7085C42.9741 7.15007 43.3665 7.45487 43.8265 7.61862V11.8885H41.6428V9.29481C41.6428 8.62125 41.3672 7.97527 40.8768 7.49898C40.3863 7.0227 39.7211 6.75513 39.0275 6.75513H34.0586C34.3182 7.12766 34.6881 7.41493 35.1194 7.57894V11.8932H34.263C33.9101 11.8932 33.5717 11.7571 33.3222 11.5148C33.0726 11.2725 32.9325 10.9438 32.9325 10.6012V2.73926C32.6463 2.73926 32.363 2.79399 32.0987 2.90032C31.8343 3.00665 31.5941 3.16251 31.3918 3.35898C31.1895 3.55546 31.029 3.78871 30.9195 4.04542C30.81 4.30213 30.7537 4.57727 30.7537 4.85513V10.7377C30.7537 11.3355 30.9982 11.9088 31.4335 12.3315C31.8687 12.7542 32.4591 12.9916 33.0747 12.9916H54.7156V9.29481C54.7162 8.96049 54.6489 8.62934 54.5174 8.32035C54.386 8.01136 54.193 7.73061 53.9496 7.49422C53.7062 7.25782 53.4171 7.07043 53.0989 6.94278C52.7807 6.81513 52.4397 6.74974 52.0954 6.75037ZM39.4656 11.8885H37.2966V7.85354C37.447 7.85354 39.4656 7.94879 39.4656 10.4218V11.8885ZM48.1792 11.8885H46.0004V7.9091C46.5782 7.9091 47.1324 8.13202 47.541 8.52882C47.9496 8.92562 48.1792 9.46381 48.1792 10.025V11.8885ZM52.5368 11.8885H50.358V8.86148C50.3587 8.50938 50.2682 8.16276 50.0948 7.85354H50.358C50.3857 7.85354 52.5351 7.87101 52.5351 10.4218L52.5368 11.8885Z" fill="#EF233C" />
            <path d="M10.4334 6.75135H5.14743C4.35512 6.75177 3.59539 7.05761 3.03515 7.60167C2.47491 8.14573 2.15998 8.88351 2.15955 9.65293V14.3529C2.15933 14.6309 2.21553 14.9062 2.32493 15.1631C2.43433 15.42 2.59478 15.6535 2.79712 15.8501C2.99946 16.0468 3.23972 16.2028 3.50417 16.3092C3.76863 16.4156 4.05208 16.4704 4.33834 16.4704V9.19738C4.33834 8.84123 4.48403 8.49967 4.74335 8.24784C5.00268 7.996 5.3544 7.85452 5.72114 7.85452H6.51715V10.7387C6.51715 11.3364 6.76167 11.9097 7.19695 12.3324C7.63222 12.7551 8.22258 12.9926 8.83815 12.9926H13.0535V9.29579C13.0542 8.96147 12.9869 8.63032 12.8554 8.32133C12.724 8.01234 12.531 7.73159 12.2876 7.4952C12.0441 7.2588 11.755 7.07141 11.4369 6.94376C11.1187 6.81611 10.7777 6.75072 10.4334 6.75135ZM10.8747 11.8894H10.0281C9.85321 11.8897 9.68002 11.8564 9.51841 11.7915C9.3568 11.7267 9.20993 11.6316 9.08621 11.5116C8.96249 11.3916 8.86434 11.2491 8.79738 11.0922C8.73041 10.9353 8.69594 10.7672 8.69594 10.5974V7.85452C8.69594 7.85452 10.8747 7.85453 10.8747 10.4228V11.8894Z" fill="#1D1D1F" />
            <path d="M23.1874 3.8533H27.1495C27.4512 3.85331 27.7408 3.73756 27.9551 3.53124C28.1693 3.32492 28.291 3.04475 28.2936 2.75171H21.9697C21.7 2.75151 21.4328 2.80292 21.1836 2.90302C20.9343 3.00311 20.7078 3.14993 20.517 3.33508C20.3262 3.52023 20.1748 3.74008 20.0716 3.98206C19.9683 4.22405 19.9151 4.48342 19.9151 4.74536V7.866H23.6434C23.972 7.86598 24.2973 7.92928 24.6004 8.05223C24.9036 8.17518 25.1786 8.35534 25.4095 8.58227C25.6405 8.80919 25.8228 9.07838 25.9458 9.37421C26.0688 9.67005 26.1302 9.98666 26.1263 10.3057L26.1066 11.9025H19.263C18.8477 11.9025 18.4494 11.7423 18.1557 11.4571C17.8621 11.1719 17.6971 10.7852 17.6971 10.3819V2.72791C17.1192 2.72791 16.5651 2.95083 16.1565 3.34763C15.7479 3.74443 15.5183 4.28261 15.5183 4.84378V10.4089C15.5183 10.7497 15.5874 11.0871 15.7217 11.402C15.856 11.7169 16.0529 12.003 16.301 12.244C16.5492 12.485 16.8438 12.6761 17.168 12.8065C17.4923 12.937 17.8398 13.0041 18.1907 13.0041H28.2855V9.38504C28.2855 8.69001 28.0011 8.02344 27.4951 7.53198C26.989 7.04051 26.3026 6.76441 25.5869 6.76441H22.0939V4.9168C22.0939 4.63501 22.2091 4.36475 22.4141 4.16535C22.6191 3.96595 22.8973 3.85372 23.1874 3.8533Z" fill="#1D1D1F" />
          </svg>
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
