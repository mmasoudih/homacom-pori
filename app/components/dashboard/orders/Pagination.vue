<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import { toPersianDigits } from '~/utils/format'

const props = withDefaults(defineProps<{
  page: number
  pages: number
  window?: number
}>(), {
  window: 5,
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const visiblePages = computed(() => {
  const total = props.pages
  const size = Math.min(props.window, total)
  let start = Math.max(1, props.page - Math.floor(size / 2))
  if (start + size - 1 > total) start = Math.max(1, total - size + 1)
  return Array.from({ length: size }, (_, i) => start + i)
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
      aria-label="صفحه بعد"
      @click="go(page - 1)"
    >
      <IconChevronLeft class="size-4" />
    </button>

    <button
      v-for="p in visiblePages"
      :key="p"
      type="button"
      class="flex size-9 items-center justify-center rounded-lg text-[13px] font-bold transition-colors"
      :class="p === page ? 'bg-primary text-white' : 'text-T-700 hover:bg-T-100'"
      @click="go(p)"
    >
      {{ toPersianDigits(p) }}
    </button>

    <button
      type="button"
      class="flex size-9 items-center justify-center rounded-lg border border-T-400 text-T-600 transition-colors hover:border-T-500 disabled:opacity-40"
      :disabled="page >= pages"
      aria-label="صفحه قبل"
      @click="go(page + 1)"
    >
      <IconChevronRight class="size-4" />
    </button>
  </nav>
</template>
