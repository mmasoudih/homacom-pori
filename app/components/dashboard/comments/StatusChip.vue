<script setup lang="ts">
import type { Component } from 'vue'
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconHourglassHigh,
} from '@tabler/icons-vue'
import type { CommentStatus } from '~/data/comments'

defineProps<{
  status: CommentStatus
}>()

const meta: Record<CommentStatus, { label: string, icon: Component, class: string }> = {
  approved: { label: 'ثبت شد', icon: IconCircleCheckFilled, class: 'bg-[#E8FFEC] text-[#35CD4C]' },
  rejected: { label: 'رد شد', icon: IconCircleXFilled, class: 'bg-R-50 text-primary' },
  pending: { label: 'در انتظار تایید', icon: IconHourglassHigh, class: 'bg-[#FFF7EB] text-[#FFAA39]' },
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-bold"
    :class="meta[status].class"
  >
    <component :is="meta[status].icon" class="size-4 shrink-0" />
    {{ meta[status].label }}
  </span>
</template>
