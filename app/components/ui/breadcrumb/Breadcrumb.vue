<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  trail: string[]
  class?: string
}>()
</script>

<template>
  <nav aria-label="breadcrumb" :class="cn('flex w-full items-center gap-1 text-[12.5px]', props.class)">
    <template v-for="(item, i) in trail" :key="`${item}-${i}`">
      <span
        v-if="i > 0"
        class="flex size-4 items-center justify-center text-T-600"
        aria-hidden="true"
      >
        <IconChevronLeft class="size-3.5" />
      </span>
      <span :class="i === trail.length - 1 ? 'text-T-900' : 'text-T-700'">{{ item }}</span>
    </template>
  </nav>
</template>
