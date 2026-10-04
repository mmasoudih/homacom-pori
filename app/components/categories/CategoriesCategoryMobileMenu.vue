<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconPackage,
} from '@tabler/icons-vue'
import { megaCategories, type Category } from '~/data/categories'
import mobileIcon from '../../../public/icons/category-menu/mobile.svg?raw'
import laptopIcon from '../../../public/icons/category-menu/laptop.svg?raw'
import smartWatchIcon from '../../../public/icons/category-menu/watch.svg?raw'
import headphonesIcon from '../../../public/icons/category-menu/headphones.svg?raw'
import gameControllerIcon from '../../../public/icons/category-menu/gamepad.svg?raw'
import displayIcon from '../../../public/icons/category-menu/display.svg?raw'
import usbDriveIcon from '../../../public/icons/category-menu/usb.svg?raw'
import speakersIcon from '../../../public/icons/category-menu/speakers.svg?raw'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

/** Same raw line icons the desktop landing grid uses, so the rail matches. */
const railIcons: Record<string, string> = {
  mobile: mobileIcon,
  laptop: laptopIcon,
  watch: smartWatchIcon,
  headphones: headphonesIcon,
  gamepad: gameControllerIcon,
  display: displayIcon,
  usb: usbDriveIcon,
  speakers: speakersIcon,
}

const overlayEl = ref<HTMLElement | null>(null)

const activeRootId = ref(megaCategories[0]?.id ?? '')
const activeChild = ref<Category | null>(null)
const expandedIds = ref<Set<string>>(new Set())

const activeRoot = computed(
  () => megaCategories.find((c) => c.id === activeRootId.value) ?? megaCategories[0]!,
)
const rootItems = computed(() => activeRoot.value.children ?? [])
const groupItems = computed(() => activeChild.value?.children ?? [])
/** A drilled level whose children are themselves groups (accordion) vs leaves (grid). */
const groupHasNested = computed(() => groupItems.value.some((item) => (item.children?.length ?? 0) > 0))

function reset() {
  activeRootId.value = megaCategories[0]?.id ?? ''
  activeChild.value = null
  expandedIds.value = new Set()
}

function selectRoot(cat: Category) {
  if (activeRootId.value === cat.id && !activeChild.value) return
  activeRootId.value = cat.id
  activeChild.value = null
  expandedIds.value = new Set()
}

/** Drill from the root list into a brand / subcategory. */
function openChild(cat: Category) {
  if (!cat.children?.length) {
    close()
    return
  }
  activeChild.value = cat
  expandedIds.value = new Set()
}

function backToRoot() {
  activeChild.value = null
}

function toggleGroup(cat: Category) {
  if (!cat.children?.length) return
  const next = new Set(expandedIds.value)
  if (next.has(cat.id)) next.delete(cat.id)
  else next.add(cat.id)
  expandedIds.value = next
}

function isExpanded(cat: Category) {
  return expandedIds.value.has(cat.id)
}

function close() {
  emit('update:open', false)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

// Close when tapping anything outside the sheet (only the floating bottom nav
// sits above it). Uses click (bubble) so the bottom-nav trigger — which stops
// propagation — can still toggle the sheet without it instantly closing.
function onOutsideClick(event: MouseEvent) {
  if (!props.open) return
  const target = event.target as Node | null
  if (!target) return
  if (overlayEl.value?.contains(target)) return
  close()
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      reset()
      document.addEventListener('keydown', onKeydown)
      document.addEventListener('click', onOutsideClick)
      // Lock background scrolling while the full-screen sheet is open.
      document.documentElement.style.overflow = 'hidden'
    }
    else {
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('click', onOutsideClick)
      document.documentElement.style.overflow = ''
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onOutsideClick)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="menu">
      <div
        v-if="open"
        ref="overlayEl"
        class="fixed inset-0 z-[66] bg-T-50 lg:hidden"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label="دسته‌بندی محصولات"
      >
        <div class="flex h-full pt-[env(safe-area-inset-top)]">
          <!-- Category rail (right edge) -->
          <aside class="scrollbar-none w-[100px] shrink-0 overflow-y-auto px-3 pb-28 pt-1">
            <div class="flex flex-col gap-3">
              <button
                v-for="cat in megaCategories"
                :key="cat.id"
                type="button"
                class="flex w-full flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition-colors"
                :class="
                  cat.id === activeRootId
                    ? 'border-primary bg-[#FFF2F4] text-primary'
                    : 'border-T-400 bg-T-50 text-T-900 hover:bg-T-100'
                "
                @click="selectRoot(cat)"
              >
                <span
                  class="[&>svg]:block [&>svg]:size-6"
                  :class="cat.id === activeRootId ? 'text-primary' : 'text-T-700'"
                  aria-hidden="true"
                  v-html="railIcons[cat.icon ?? ''] ?? ''"
                />
                <UiTypography
                  as="span"
                  size="md"
                  weight="semibold"
                  color="inherit"
                  class="text-center leading-[17px]"
                  :class="cat.id === activeRootId ? 'text-R-300' : 'text-T-800'"
                >
                  {{ cat.title }}
                </UiTypography>
              </button>
            </div>
          </aside>

          <!-- Subcategory panel (left) -->
          <section class="flex min-w-0 flex-1 flex-col">
            <div class="shrink-0 px-3 pt-2">
              <div v-if="activeChild" class="flex">
                <button
                  type="button"
                  class="mb-1.5 flex items-center gap-1 rounded-full bg-T-200 px-3 py-1.5 text-[13px] font-medium text-T-900 transition-colors hover:bg-T-300"
                  @click="backToRoot"
                >
                  <IconChevronRight class="size-4 shrink-0" />
                  {{ activeRoot.title }}
                </button>
              </div>

              <button
                type="button"
                class="flex h-[52px] w-full items-center gap-2 text-start text-primary"
                @click="close"
              >
                <span class="text-[15px] font-semibold">
                  همه محصولات {{ activeChild?.title ?? activeRoot.title }}
                </span>
                <IconChevronLeft class="size-5 shrink-0" />
              </button>

              <div class="border-b border-T-400" />
            </div>

            <div class="scrollbar-none min-h-0 flex-1 overflow-y-auto px-3 pt-1 pb-28">
              <!-- Root level: brand / subcategory list -->
              <ul v-if="!activeChild">
                <li v-for="cat in rootItems" :key="cat.id">
                  <button
                    type="button"
                    class="flex h-[54px] w-full items-center justify-between rounded-xl px-3 text-start text-[15px] font-medium text-T-900 transition-colors hover:bg-T-200"
                    @click="openChild(cat)"
                  >
                    <span>{{ cat.title }}</span>
                    <IconChevronLeft v-if="cat.children?.length" class="size-5 shrink-0 text-T-600" />
                  </button>
                </li>
              </ul>

              <!-- Drilled level with nested groups: accordion rows + inline grid -->
              <div v-else-if="groupHasNested" class="flex flex-col gap-1">
                <div
                  v-for="cat in groupItems"
                  :key="cat.id"
                  :class="isExpanded(cat) ? 'rounded-2xl bg-T-100' : ''"
                >
                  <button
                    type="button"
                    class="flex h-[54px] w-full items-center justify-between rounded-xl px-3 text-start text-[15px] font-medium text-T-900"
                    @click="cat.children?.length ? toggleGroup(cat) : close()"
                  >
                    <span>{{ cat.title }}</span>
                    <IconChevronUp v-if="isExpanded(cat)" class="size-5 shrink-0 text-T-900" />
                    <IconChevronDown
                      v-else-if="cat.children?.length"
                      class="size-5 shrink-0 text-T-600"
                    />
                  </button>

                  <div v-if="isExpanded(cat)" class="grid grid-cols-3 gap-x-1 gap-y-4 px-1.5 pb-4 pt-1">
                    <button
                      v-for="leaf in cat.children"
                      :key="leaf.id"
                      type="button"
                      class="flex flex-col items-center gap-2"
                      @click="close"
                    >
                      <span class="flex size-14 items-center justify-center rounded-full bg-T-50 text-T-600">
                        <IconPackage class="size-6" />
                      </span>
                      <span class="px-0.5 text-center text-[12px] leading-4 text-T-900">
                        {{ leaf.title }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Drilled level of leaf categories: tile grid -->
              <div v-else class="rounded-2xl bg-T-100 p-3">
                <div class="grid grid-cols-3 gap-x-1 gap-y-4">
                  <button
                    v-for="cat in groupItems"
                    :key="cat.id"
                    type="button"
                    class="flex flex-col items-center gap-2"
                    @click="openChild(cat)"
                  >
                    <span class="flex size-14 items-center justify-center rounded-full bg-T-50 text-T-600">
                      <IconPackage class="size-6" />
                    </span>
                    <span class="px-0.5 text-center text-[12px] leading-4 text-T-900">
                      {{ cat.title }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.menu-enter-from,
.menu-leave-to {
  transform: translateY(100%);
}
</style>
