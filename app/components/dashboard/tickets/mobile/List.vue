<script setup lang="ts">
import type { Ticket } from '~/data/tickets'

defineProps<{
  tickets: Ticket[]
}>()

const emit = defineEmits<{
  view: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <DashboardTicketsMobileCard
      v-for="t in tickets"
      :key="t.id"
      :ticket="t"
      @view="emit('view', $event)"
      @remove="emit('remove', $event)"
    />
  </div>
</template>
