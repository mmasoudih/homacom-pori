<script setup lang="ts">
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
    <UiTypography as="td" size="lg" weight="regular" color="default" class="border-b border-T-300 px-3 py-4 text-start">
      {{ ticket.subject }}
    </UiTypography>
    <UiTypography as="td" size="md" weight="regular" color="default" class="border-b border-T-300 px-3 py-4">
      # {{ toPersianDigits(ticket.code) }}
    </UiTypography>
    <td class="border-b border-T-300 px-3 py-4">
      <DashboardTicketsStatusChip :status="ticket.status" />
    </td>
    <UiTypography as="td" size="md" weight="regular" color="default" class="border-b border-T-300 px-3 py-4">
      {{ ticket.date }}
    </UiTypography>
    <td class="border-b border-T-300 px-3 py-4">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex items-center justify-center gap-1.5 rounded-lg border border-[#5A66FC] px-2.5 py-[5px] text-[#5A66FC] transition-colors hover:bg-[#5A66FC]/5"
          @click="emit('view', ticket.id)"
        >
          <UiTypography as="span" size="xs" weight="regular" color="inherit">
            مشاهده
          </UiTypography>
        </button>
        <button
          type="button"
          class="flex items-center justify-center gap-1.5 rounded-lg border border-primary px-2.5 py-[5px] text-primary transition-colors hover:bg-R-50"
          @click="emit('remove', ticket.id)"
        >
          <UiTypography as="span" size="xs" weight="regular" color="inherit">
            حذف
          </UiTypography>
        </button>
      </div>
    </td>
  </tr>
</template>