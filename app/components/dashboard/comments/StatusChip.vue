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
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 lg:h-8"
    :class="meta[status].class"
  >
    <svg
      v-if="status === 'pending'"
      class="size-[18px] shrink-0"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M15.5625 1.5C15.5625 1.81066 15.3107 2.0625 15 2.0625H14.1109C14.197 3.13255 14.2308 3.82665 14.1011 4.47892C13.9078 5.4511 13.4525 6.35195 12.7843 7.08408C12.2685 7.64934 11.5796 8.07316 10.4084 8.7938L10.0733 9L10.4084 9.2062C11.5796 9.92685 12.2685 10.3507 12.7843 10.9159C13.4525 11.6481 13.9078 12.5489 14.1011 13.5211C14.2308 14.1733 14.197 14.8674 14.1109 15.9375H15C15.3107 15.9375 15.5625 16.1893 15.5625 16.5C15.5625 16.8107 15.3107 17.0625 15 17.0625H13.5018C13.5012 17.0625 13.5006 17.0625 13.5 17.0625L3 17.0625C2.68934 17.0625 2.4375 16.8107 2.4375 16.5C2.4375 16.1893 2.68934 15.9375 3 15.9375H3.8891C3.803 14.8675 3.76921 14.1734 3.89889 13.5211C4.09216 12.5489 4.5475 11.6481 5.21567 10.9159C5.73154 10.3507 6.42037 9.92684 7.59165 9.2062L7.92673 9L7.59165 8.79381C6.42037 8.07316 5.73154 7.64934 5.21567 7.08408C4.5475 6.35195 4.09216 5.4511 3.89889 4.47893C3.76921 3.82665 3.803 3.13255 3.8891 2.0625H3C2.68934 2.0625 2.4375 1.81066 2.4375 1.5C2.4375 1.18934 2.68934 0.9375 3 0.9375H15C15.3107 0.9375 15.5625 1.18934 15.5625 1.5Z" fill="currentColor" />
    </svg>
    <component :is="meta[status].icon" v-else class="size-[18px] shrink-0" />
    <UiTypography as="span" size="md" weight="bold" color="inherit">
      {{ meta[status].label }}
    </UiTypography>
  </span>
</template>
