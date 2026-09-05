<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="mb-1.5 border-b border-T-400">
    <button
      type="button"
      class="flex h-[54px] w-full items-center text-[14px] font-medium text-primary transition-colors duration-150 ease-out hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span>{{ title }}</span>
      <IconChevronLeft class="ms-3 size-4 shrink-0" />
    </button>
  </div>
</template>