<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import { useEventListener } from '@vueuse/core'
import type { SearchSortKey } from '~/utils/search'
import { searchMobileSortOptions } from '~/utils/search'

const props = defineProps<{
  open: boolean
  modelValue: SearchSortKey
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchSortKey]
  close: []
}>()

function select(value: SearchSortKey) {
  emit('update:modelValue', value)
  emit('close')
}

// Lock background scrolling while the sheet is open.
watch(
  () => props.open,
  (open) => {
    if (!import.meta.client) return
    document.documentElement.style.overflow = open ? 'hidden' : ''
  },
)

onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (props.open && event.key === 'Escape') emit('close')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] flex flex-col bg-T-900/30 backdrop-blur-[2px] lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="مرتب‌سازی بر اساس"
        @click.self="emit('close')"
      >
        <div class="sheet-panel mt-auto flex max-h-[85dvh] flex-col rounded-t-[24px] bg-T-50">
          <header class="flex shrink-0 items-center justify-between px-4 pb-3 pt-5">
            <UiTypography as="h2" size="xl" weight="bold" color="default">
              مرتب‌سازی بر اساس
            </UiTypography>
            <button
              type="button"
              class="flex size-9 shrink-0 items-center justify-center rounded-full text-T-500 transition-colors hover:bg-T-200"
              aria-label="بستن"
              @click="emit('close')"
            >
              <IconX class="size-6" />
            </button>
          </header>

          <div class="scrollbar-none flex flex-col gap-3 overflow-y-auto overscroll-contain px-4 pb-8 pt-3">
            <button
              v-for="option in searchMobileSortOptions"
              :key="option.value"
              type="button"
              class="flex h-[56px] w-full shrink-0 items-center rounded-[16px] border px-4 transition-colors"
              :class="modelValue === option.value
                ? 'border-primary text-primary'
                : 'border-T-300 text-T-900'"
              :aria-pressed="modelValue === option.value"
              @click="select(option.value)"
            >
              <UiTypography as="span" size="lg" weight="medium" color="inherit">
                {{ option.label }}
              </UiTypography>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 200ms ease;
}
.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateY(100%);
}
</style>
