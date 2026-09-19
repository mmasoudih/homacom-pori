<script setup lang="ts">
import type { Ticket } from '~/data/tickets'

defineProps<{ tickets: Ticket[] }>()

const emit = defineEmits<{
  view: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[760px] border-separate border-spacing-0 text-right">
      <thead>
        <tr>
          <th class="rounded-s-xl bg-T-100 px-5 py-4 text-start text-[12.5px] font-semibold text-T-700">عنوان تیکت</th>
          <th class="bg-T-100 px-5 py-4 text-[12.5px] font-semibold text-T-700">شماره</th>
          <th class="bg-T-100 px-5 py-4 text-[12.5px] font-semibold text-T-700">وضعیت</th>
          <th class="bg-T-100 px-5 py-4 text-[12.5px] font-semibold text-T-700">تاریخ</th>
          <th class="rounded-e-xl bg-T-100 px-5 py-4 text-[12.5px] font-semibold text-T-700">عملیات</th>
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
  </div>
</template>
