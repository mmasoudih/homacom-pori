<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import type { OrderTransaction, StatusTone } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  transactions: OrderTransaction[]
}>()

const open = ref(true)

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
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
    <button
      type="button"
      class="flex w-full items-center gap-3"
      @click="open = !open"
    >
      <span
        class="flex size-7 shrink-0 items-center justify-center rounded-full border border-T-400 text-T-600 transition-transform"
        :class="open ? '' : '-rotate-90'"
      >
        <IconChevronDown class="size-4" />
      </span>

      <span class="flex flex-1 flex-wrap items-center justify-center gap-2">
        <span class="text-[14px] font-bold text-T-900">جزئیات تراکنش‌ها</span>
        <span class="rounded-md bg-T-200 px-2 py-0.5 text-[10.5px] font-bold text-T-600">
          {{ toPersianDigits(transactions.length) }} تراکنش
        </span>
      </span>

      <span class="size-7 shrink-0" />
    </button>

    <div v-if="open" class="mt-5 flex flex-col gap-3">
      <div
        v-for="row in rows"
        :key="row.id"
        class="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-T-100 px-4 py-3"
      >
        <div class="flex flex-wrap items-center gap-3">
          <DashboardOrdersStatusChip
            :label="row.label"
            :tone="row.tone"
            :icon="row.status === 'success' ? 'check' : 'x'"
            variant="soft"
          />
          <div class="flex flex-col gap-1 text-[11.5px] text-T-600">
            <span>{{ row.bank }}</span>
            <span class="inline-flex items-center gap-1.5">
              شماره پیگیری:
              <DashboardOrdersCopyValue :value="toPersianDigits(row.trackingCode)" :copy-value="row.trackingCode" />
            </span>
          </div>
        </div>

        <span class="text-[12.5px] font-bold text-T-900">
          {{ formatPriceFa(row.amount) }}
          <span class="text-[11px] font-normal text-T-600">تومان</span>
        </span>
      </div>
    </div>
  </section>
</template>
