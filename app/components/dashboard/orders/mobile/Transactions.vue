<script setup lang="ts">
import { IconCalendar, IconChevronDown, IconFileInvoice } from '@tabler/icons-vue'
import type { OrderTransaction, StatusTone } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = withDefaults(defineProps<{
  transactions: OrderTransaction[]
  defaultOpen?: boolean
}>(), {
  defaultOpen: true,
})

const open = ref(props.defaultOpen)

const rows = computed(() =>
  props.transactions.map((t) => {
    const tone: StatusTone = t.status === 'success' ? 'emerald' : 'red'
    return {
      ...t,
      label: t.status === 'success' ? 'پرداخت موفق' : 'پرداخت ناموفق',
      tone,
    }
  }),
)
</script>

<template>
  <section class="rounded-2xl border border-T-300 bg-T-50 p-4">
    <button
      type="button"
      class="flex w-full items-center gap-3"
      @click="open = !open"
    >
      <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
        <IconFileInvoice class="size-5" />
      </span>

      <span class="flex flex-1 flex-col items-center gap-0.5">
        <span class="text-[14px] font-bold text-T-900">جزئیات تراکنش‌ها</span>
        <span class="text-[11px] text-T-600">{{ toPersianDigits(transactions.length) }} تراکنش</span>
      </span>

      <span
        class="flex size-7 shrink-0 items-center justify-center rounded-full border border-T-300 text-T-600 transition-transform"
        :class="open ? '' : 'rotate-180'"
      >
        <IconChevronDown class="size-4" />
      </span>
    </button>

    <div v-if="open" class="mt-4 flex flex-col gap-3">
      <div
        v-for="row in rows"
        :key="row.id"
        class="flex items-start justify-between gap-3 rounded-xl bg-T-100 p-3"
      >
        <div class="flex flex-col items-start gap-2">
          <DashboardOrdersStatusChip
            :label="row.label"
            :tone="row.tone"
            :icon="row.status === 'success' ? 'check' : 'x'"
            variant="soft"
          />
          <span
            v-if="row.method"
            class="w-fit rounded-md bg-indigo-50 px-2 py-0.5 text-[10.5px] text-indigo-500"
          >
            {{ row.method }}
          </span>
        </div>

        <div class="flex flex-col items-end gap-1 text-[11px] text-T-600">
          <span class="text-[12px] font-bold text-T-900">
            {{ formatPriceFa(row.amount) }}
            <span class="text-[11px] font-normal text-T-600">تومان</span>
          </span>
          <span class="flex items-center gap-1.5">
            <IconCalendar class="size-3.5" />
            {{ row.datetime }}
          </span>
          <span class="flex items-center gap-1.5">
            شماره پیگیری:
            <DashboardOrdersCopyValue :value="toPersianDigits(row.trackingCode)" :copy-value="row.trackingCode" />
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
