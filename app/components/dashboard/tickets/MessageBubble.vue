<script setup lang="ts">
import type { TicketMessage } from '~/data/tickets'
import { cn } from '~/lib/utils'

const props = defineProps<{ message: TicketMessage }>()

const isUser = computed(() => props.message.author === 'user')
</script>

<template>
  <div
    :class="cn(
      'w-fit max-w-[62%] rounded-2xl px-4 py-3 text-[12.5px] leading-[22px] text-T-900',
      isUser ? 'me-auto max-w-[82%] bg-[#EFF6FF]' : 'ms-auto bg-T-100',
    )"
  >
    <p class="whitespace-pre-line">{{ message.body }}</p>
  </div>
</template>
