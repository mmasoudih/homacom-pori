<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import { toPersianDigits } from '~/utils/format'

const props = withDefaults(defineProps<{
  page: number
  pages: number
  window?: number
}>(), {
  window: 4,
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const visiblePages = computed<(number | 'ellipsis')[]>(() => {
  const total = props.pages
  const size = props.window

  if (total <= size) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const start = Math.min(Math.max(1, props.page - Math.floor(size / 2)), total - size + 1)
  const end = start + size - 1

  const items: (number | 'ellipsis')[] = []
  if (start > 1) {
    items.push(1)
    if (start > 2) items.push('ellipsis')
  }
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total) {
    if (end < total - 1) items.push('ellipsis')
    items.push(total)
  }
  return items
})

function go(page: number) {
  if (page < 1 || page > props.pages || page === props.page) return
  emit('update:page', page)
}
</script>

<template>
  <nav class="flex items-center justify-center gap-1.5">
    <button
      type="button"
      class="flex size-9 items-center justify-center rounded-lg border border-T-400 text-T-600 transition-colors hover:border-T-500 disabled:opacity-40"
      :disabled="page <= 1"
      aria-label="صفحه قبل"
      @click="go(page - 1)"
    >
      <IconChevronRight class="size-4" />
    </button>

    <template v-for="(p, i) in visiblePages" :key="`${p}-${i}`">
      <span
        v-if="p === 'ellipsis'"
        class="flex size-9 items-center justify-center text-[13px] font-bold text-T-500"
      >
        …
      </span>
      <button
        v-else
        type="button"
        class="flex size-9 items-center justify-center rounded-lg text-[13px] font-bold transition-colors"
        :class="p === page ? 'bg-primary text-white' : 'text-T-700 hover:bg-T-100'"
        @click="go(p)"
      >
        {{ toPersianDigits(p) }}
      </button>
    </template>

    <button
      type="button"
      class="flex size-9 items-center justify-center rounded-lg border border-T-400 text-T-600 transition-colors hover:border-T-500 disabled:opacity-40"
      :disabled="page >= pages"
      aria-label="صفحه بعد"
      @click="go(page + 1)"
    >
      <IconChevronLeft class="size-4" />
    </button>
  </nav>
</template>
