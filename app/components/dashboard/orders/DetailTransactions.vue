<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import type { OrderTransaction, StatusTone } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  transactions: OrderTransaction[]
}>()

const open = ref(true)

/** Render a transaction timestamp as `time - date` (e.g. ۱۳:۳۵ - ۱۴۰۳/۰۸/۱۵). */
function formatDateTime(value: string) {
  const [date, time] = value.split(' - ')
  return time ? `${time} - ${date}` : value
}

const rows = computed(() =>
  props.transactions.map((t) => {
    const tone: StatusTone = t.status === 'success' ? 'emerald' : 'red'
    return {
      ...t,
      label: t.status === 'success' ? 'پرداخت موفق' : 'پرداخت ناموفق',
      tone,
      methodLabel: t.method ?? 'اینترنتی',
      datetimeLabel: t.datetime ? formatDateTime(t.datetime) : '',
    }
  }),
)
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-100 px-[12px] py-[10px]">
    <button
      type="button"
      class="flex w-full items-center gap-3"
      @click="open = !open"
    >
      <span
        class="flex size-[38px] shrink-0 items-center justify-center rounded-lg border border-[#DDE0FF] bg-[#EAECFF]"
      >
        <img
          src="/icons/transaction-detail.svg"
          alt=""
          class="size-[18px]"
          aria-hidden="true"
        >
      </span>

      <span class="flex flex-1 flex-col items-start gap-0.5">
        <UiTypography as="span" size="lg" weight="medium">جزئیات تراکنش‌ها</UiTypography>
        <UiTypography as="span" size="md" weight="medium" color="muted" class="rounded-md bg-T-200 px-2 py-0.5">
          {{ toPersianDigits(transactions.length) }} تراکنش
        </UiTypography>
      </span>

      <span
        class="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-T-400 bg-T-50 text-T-900 transition-transform"
        :class="open ? 'rotate-180' : ''"
      >
        <IconChevronDown class="size-4" />
      </span>
    </button>

    <div v-if="open" class="mt-5 flex flex-col gap-3">
      <div
        v-for="row in rows"
        :key="row.id"
        class="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-T-50 px-4 py-3"
      >
        <div class="flex flex-wrap items-center gap-3">
          <DashboardOrdersStatusChip
            :label="row.label"
            :tone="row.tone"
            :icon="row.status === 'success' ? 'check' : 'x'"
            variant="soft"
            icon-only
          />
          <div class="flex flex-col gap-1">
            <div class="flex flex-wrap items-center gap-2">
              <UiTypography as="span" size="lg" weight="medium">{{ row.label }}</UiTypography>
              <span class="inline-flex h-5 w-fit items-center justify-center rounded-[50px] bg-[#EAECFF] px-2 text-[#5A6AFF]">
                <UiTypography as="span" size="2xs" weight="regular" color="inherit">
                  {{ row.methodLabel }}
                </UiTypography>
              </span>
            </div>
            <span class="inline-flex flex-wrap items-center gap-3">
              <img
                src="/icons/transaction-calendar.svg"
                alt=""
                class="size-[18px] shrink-0"
                aria-hidden="true"
              >
              <UiTypography as="span" size="md" weight="medium" color="muted" dir="ltr">
                {{ row.datetimeLabel }}
              </UiTypography>
              <UiTypography as="span" size="md" weight="medium" color="muted">
                شماره پیگیری:
              </UiTypography>
              <UiTypography as="span" size="md" weight="medium" color="muted" dir="ltr">
                {{ toPersianDigits(row.trackingCode) }}
              </UiTypography>
            </span>
          </div>
        </div>

        <UiTypography as="span" size="lg" weight="medium">
          {{ formatPriceFa(row.amount) }}
          <UiTypography as="span" size="xs" weight="medium" color="subtle">تومان</UiTypography>
        </UiTypography>
      </div>
    </div>
  </section>
</template>
