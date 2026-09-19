<script setup lang="ts">
import type { TicketMessage } from '~/data/tickets'

defineProps<{ messages: TicketMessage[] }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <DashboardTicketsMessageBubble v-for="m in messages" :key="m.id" :message="m" />
  </div>
</template>
