<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { megaCategories, initialMegaPath, type Category } from '~/data/categories'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const panelRoot = ref<HTMLElement | null>(null)

const activeRoot = ref<Category | undefined>()
const activeSecondary = ref<Category | undefined>()
const activeTertiary = ref<Category | undefined>()

const secondaryItems = computed(() => activeRoot.value?.children ?? [])
const tertiaryItems = computed(() => activeSecondary.value?.children ?? [])

const columnOrder = ['root', 'secondary', 'tertiary'] as const
type Column = (typeof columnOrder)[number]

function applyPath(ids: string[]) {
  const root = megaCategories.find((c) => c.id === ids[0]) ?? megaCategories[0]
  const secondary = root?.children?.find((c) => c.id === ids[1])
  const tertiary = secondary?.children?.find((c) => c.id === ids[2])
  activeRoot.value = root
  activeSecondary.value = secondary
  activeTertiary.value = tertiary
}

function onRootSelect(item: Category) {
  if (activeRoot.value?.id === item.id) return
  activeRoot.value = item
  activeSecondary.value = item.children?.[0]
  activeTertiary.value = activeSecondary.value?.children?.[0]
}

function onSecondarySelect(item: Category) {
  if (activeSecondary.value?.id === item.id) return
  activeSecondary.value = item
  activeTertiary.value = item.children?.[0]
}

function onTertiarySelect(item: Category) {
  activeTertiary.value = item
}

function columnItems(column: Column) {
  return Array.from(
    panelRoot.value?.querySelectorAll<HTMLElement>(`[data-mega-column="${column}"] [data-mega-item]`) ?? [],
  )
}

function onKeydown(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }
  if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return

  const current = document.activeElement as HTMLElement | null
  if (!current?.hasAttribute('data-mega-item')) return
  const column = current.getAttribute('data-mega-column') as Column | null
  if (!column) return
  const items = columnItems(column)
  const idx = items.indexOf(current)

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const dir = event.key === 'ArrowDown' ? 1 : -1
    items[(idx + dir + items.length) % items.length]?.focus()
    return
  }

  const colIdx = columnOrder.indexOf(column)
  const targetCol = columnOrder[colIdx + (event.key === 'ArrowLeft' ? 1 : -1)]
  if (!targetCol) return
  event.preventDefault()
  columnItems(targetCol)[0]?.focus()
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      applyPath(initialMegaPath)
      nextTick(() => columnItems('root')[0]?.focus())
    }
  },
)

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="mega">
      <div v-if="open" class="hidden xl:block">
        <CategoriesMegaMenuBackdrop @close="emit('close')" />

        <nav
          ref="panelRoot"
          class="mega-panel bg-T-50 shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
          aria-label="دسته‌بندی محصولات"
          dir="rtl"
        >
          <div class="flex h-full">
            <!-- Level 1 — root categories -->
            <div
              data-mega-column="root"
              class="flex-1 overflow-y-auto border-l border-T-400 px-6 pb-8 pt-4"
              role="group"
              aria-label="دسته‌بندی‌های اصلی"
            >
              <CategoriesCategoryItem
                v-for="item in megaCategories"
                :key="item.id"
                :item="item"
                variant="root"
                :active="item.id === activeRoot?.id"
                @select="onRootSelect(item)"
              />
            </div>

            <!-- Level 2 — secondary categories -->
            <div
              data-mega-column="secondary"
              class="flex-1 overflow-y-auto border-l border-T-400 px-6 pb-8 pt-4"
              role="group"
              aria-label="زیردسته‌ها"
            >
              <CategoriesCategoryColumnHeader :title="`همه محصولات ${activeRoot?.title ?? ''}`" />
              <CategoriesCategoryItem
                v-for="item in secondaryItems"
                :key="item.id"
                :item="item"
                variant="secondary"
                :active="item.id === activeSecondary?.id"
                @select="onSecondarySelect(item)"
              />
            </div>

            <!-- Level 3 — deepest categories -->
            <div
              v-if="activeSecondary"
              data-mega-column="tertiary"
              class="flex-1 overflow-y-auto px-6 pb-8 pt-4"
              role="group"
              aria-label="جزئیات"
            >
              <CategoriesCategoryColumnHeader :title="`همه محصولات ${activeSecondary.title}`" />
              <CategoriesCategoryItem
                v-for="item in tertiaryItems"
                :key="item.id"
                :item="item"
                variant="tertiary"
                :active="item.id === activeTertiary?.id"
                @select="onTertiarySelect(item)"
              />
            </div>
          </div>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mega-enter-active,
.mega-leave-active {
  transition: opacity 180ms ease;
}
.mega-enter-from,
.mega-leave-to {
  opacity: 0;
}

.mega-panel {
  position: fixed;
  top: 142px;
  right: 0;
  z-index: 50;
  width: 66.667%;
  height: calc(100vh - 142px);
  animation: mega-panel-in 180ms ease-out;
}

@keyframes mega-panel-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>