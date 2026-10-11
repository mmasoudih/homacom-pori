<script setup lang="ts">
import type { TicketMessage } from '~/data/tickets'
import { cn } from '~/lib/utils'

const props = defineProps<{ message: TicketMessage }>()

const isUser = computed(() => props.message.author === 'user')
</script>

<template>
  <div
    :class="cn(
      'w-fit rounded-2xl px-4 py-3 text-[12.5px] leading-[22px] text-T-900 lg:rounded-[12px]',
      isUser
        ? 'me-auto max-w-[82%] bg-[#EFF6FF] lg:me-[142px] lg:w-auto lg:max-w-none lg:rounded-br-none'
        : 'ms-auto max-w-[62%] bg-T-100 lg:rounded-bl-none',
    )"
  >
    <UiTypography
      as="p"
      size="lg"
      weight="regular"
      color="default"
      class="whitespace-pre-line leading-[22px]"
    >
      {{ message.body }}
    </UiTypography>
  </div>
</template>