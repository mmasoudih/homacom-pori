<script setup lang="ts">
import type { TicketStatus, TicketTone } from '~/data/tickets'
import { ticketStatusMeta } from '~/data/tickets'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  status: TicketStatus
  class?: string
}>(), {
  class: '',
})

const toneClass: Record<TicketTone, string> = {
  emerald: 'bg-[#DAFFE0] text-[#35CD4C]',
  indigo: 'bg-[#EAECFF] text-[#5A6AFF]',
  red: 'bg-R-50 text-R-300',
}

const meta = computed(() => ticketStatusMeta[props.status])
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold lg:h-[26px] lg:rounded-lg',
      toneClass[meta.tone],
      props.class,
    )"
  >
    {{ meta.label }}
  </span>
</template>
