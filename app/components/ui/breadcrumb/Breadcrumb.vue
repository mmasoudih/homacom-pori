<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'
import type { BreadcrumbCrumb } from '~/utils/breadcrumbs'

const props = defineProps<{
  /**
   * Trail from left (home) to right (current page). Plain strings render as
   * labels; objects may carry a `to` to become links.
   */
  trail: Array<string | BreadcrumbCrumb>
  class?: string
}>()

const crumbs = computed<BreadcrumbCrumb[]>(() =>
  props.trail.map(item => (typeof item === 'string' ? { label: item } : item)),
)
</script>

<template>
  <nav aria-label="breadcrumb" :class="cn('flex w-full items-center gap-1 text-[12.5px]', props.class)">
    <template v-for="(item, i) in crumbs" :key="`${item.label}-${i}`">
      <span
        v-if="i > 0"
        class="flex size-4 items-center justify-center text-T-600"
        aria-hidden="true"
      >
        <IconChevronLeft class="size-3.5" />
      </span>

      <!-- Linked crumb; the current page never links to itself. -->
      <NuxtLink
        v-if="item.to && i < crumbs.length - 1"
        :to="item.to"
        class="rounded text-T-700 transition-colors hover:text-primary focus-visible:outline-1 focus-visible:outline-primary"
      >
        {{ item.label }}
      </NuxtLink>

      <span
        v-else
        :class="i === crumbs.length - 1 ? 'text-T-900' : 'text-T-700'"
        :aria-current="i === crumbs.length - 1 ? 'page' : undefined"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
