<script setup lang="ts">
import type { Ticket } from '~/data/tickets'

defineProps<{ tickets: Ticket[] }>()

const emit = defineEmits<{
  view: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <table class="w-full border-separate border-spacing-0 text-right">
    <thead>
      <tr>
        <UiTypography as="th" size="lg" weight="medium" color="muted" class="rounded-s-xl bg-T-200 px-3 py-4 text-start">
          عنوان تیکت
        </UiTypography>
        <UiTypography as="th" size="lg" weight="medium" color="muted" class="bg-T-200 px-3 py-4">
          شماره
        </UiTypography>
        <UiTypography as="th" size="lg" weight="medium" color="muted" class="bg-T-200 px-3 py-4">
          وضعیت
        </UiTypography>
        <UiTypography as="th" size="lg" weight="medium" color="muted" class="bg-T-200 px-3 py-4">
          تاریخ
        </UiTypography>
        <UiTypography as="th" size="lg" weight="medium" color="muted" class="rounded-e-xl bg-T-200 px-3 py-4">
          عملیات
        </UiTypography>
      </tr>
    </thead>
    <tbody>
      <DashboardTicketsRow
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
        @view="emit('view', $event)"
        @remove="emit('remove', $event)"
      />
    </tbody>
  </table>
</template>