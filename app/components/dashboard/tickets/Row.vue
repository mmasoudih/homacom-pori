<script setup lang="ts">
import { IconEye, IconTrash } from '@tabler/icons-vue'
import type { Ticket } from '~/data/tickets'
import { toPersianDigits } from '~/utils/format'

defineProps<{ ticket: Ticket }>()

const emit = defineEmits<{
  view: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <tr>
    <td class="border-b border-T-300 px-5 py-4 text-start text-[13px] font-semibold text-T-900">
      {{ ticket.subject }}
    </td>
    <td class="border-b border-T-300 px-5 py-4 text-[13px] text-T-700">
      # {{ toPersianDigits(ticket.code) }}
    </td>
    <td class="border-b border-T-300 px-5 py-4 text-[13px]">
      <DashboardTicketsStatusChip :status="ticket.status" />
    </td>
    <td class="border-b border-T-300 px-5 py-4 text-[13px] text-T-700">
      {{ ticket.date }}
    </td>
    <td class="border-b border-T-300 px-5 py-4 text-[13px]">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#5A66FC] px-4 text-[12px] font-semibold text-[#5A66FC] transition-colors hover:bg-[#5A66FC]/5"
          @click="emit('view', ticket.id)"
        >
          <IconEye class="size-4" />
          مشاهده
        </button>
        <button
          type="button"
          class="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-primary px-4 text-[12px] font-semibold text-primary transition-colors hover:bg-R-50"
          @click="emit('remove', ticket.id)"
        >
          <IconTrash class="size-4" />
          حذف
        </button>
      </div>
    </td>
  </tr>
</template>
