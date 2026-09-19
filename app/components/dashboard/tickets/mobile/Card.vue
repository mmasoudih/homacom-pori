<script setup lang="ts">
import { IconCalendar, IconEye, IconHash, IconTrash } from '@tabler/icons-vue'
import type { Ticket } from '~/data/tickets'
import { toPersianDigits } from '~/utils/format'

defineProps<{
  ticket: Ticket
}>()

const emit = defineEmits<{
  view: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <article class="rounded-2xl border border-T-300 bg-T-50 p-4">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-[13.5px] font-bold text-T-900">{{ ticket.subject }}</h3>
      <DashboardTicketsStatusChip :status="ticket.status" />
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-T-700">
      <span class="flex items-center gap-1.5">
        <IconCalendar class="size-4 text-T-500" />
        {{ ticket.date }}
      </span>
      <span class="flex items-center gap-1.5">
        <IconHash class="size-4 text-T-500" />
        {{ toPersianDigits(ticket.code) }}
      </span>
    </div>

    <div class="mt-4 border-t border-T-300 pt-4">
      <div class="flex gap-3">
        <button
          type="button"
          class="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#5A66FC] text-[12.5px] font-semibold text-[#5A66FC] transition-colors hover:bg-[#5A66FC]/5"
          @click="emit('view', ticket.id)"
        >
          <IconEye class="size-4" />
          مشاهده
        </button>
        <button
          type="button"
          class="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary text-[12.5px] font-semibold text-primary transition-colors hover:bg-R-50"
          @click="emit('remove', ticket.id)"
        >
          <IconTrash class="size-4" />
          حذف
        </button>
      </div>
    </div>
  </article>
</template>
