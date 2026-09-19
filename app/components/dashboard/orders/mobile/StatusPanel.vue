<script setup lang="ts">
import type { StatusIcon, StatusTone } from '~/data/orders'

withDefaults(defineProps<{
  label: string
  tone: StatusTone
  icon?: StatusIcon
  percent: number
}>(), {
  icon: undefined,
})
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <DashboardOrdersStatusChip :label="label" :tone="tone" :icon="icon" />
    <DashboardOrdersProgressBar class="w-full" :tone="tone" :percent="percent" />
  </div>
</template>
