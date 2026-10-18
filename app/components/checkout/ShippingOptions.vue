<script setup lang="ts">
import type { DeliveryDay, ShippingMethod } from '~/data/checkout'
import { formatPriceFa } from '~/utils/format'

withDefaults(
  defineProps<{
    methods: ShippingMethod[]
    methodId: string
    days: DeliveryDay[]
    dayId: string
    timeSlots: readonly string[]
    timeId: string
    /** Expand the selected row with date/time chips (design: 25074). */
    expandable?: boolean
  }>(),
  { expandable: true },
)

const emit = defineEmits<{
  select: [methodId: string]
  selectDay: [dayId: string]
  selectTime: [slot: string]
}>()

const logos: Record<string, string> = {
  tipax: '/icons/cart/ship-tipax.svg',
  'pishtaz-bike': '/icons/cart/ship-pishtaz.svg',
  bike: '/icons/cart/ship-bike.svg',
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="method in methods"
      :key="method.id"
      class="rounded-[12px] border border-T-400 transition-colors"
      :class="method.id === methodId ? 'border-R-300' : ''"
    >
      <button
        type="button"
        role="radio"
        :aria-checked="method.id === methodId"
        class="flex min-h-[52px] w-full items-center gap-3.5 p-4 text-start"
        @click="emit('select', method.id)"
      >
        <img
          :src="method.id === methodId
            ? '/icons/cart/radio-selected.svg'
            : '/icons/cart/radio-unselected.svg'"
          alt=""
          class="size-[18px] shrink-0"
        >

        <img
          :src="logos[method.id]"
          alt=""
          class="h-6 w-auto max-w-[56px] shrink-0 object-contain"
        >

        <UiTypography as="span" size="lg" weight="medium" class="min-w-0 flex-1">
          {{ method.name }}
        </UiTypography>

        <span class="flex shrink-0 items-baseline gap-1.5">
          <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle">
            تومان
          </UiTypography>
          <UiTypography as="span" size="lg" weight="medium" leading="none">
            {{ formatPriceFa(method.price) }}
          </UiTypography>
        </span>
      </button>

      <!-- Date + time (only for the selected method) -->
      <div
        v-if="expandable && method.id === methodId"
        class="flex flex-col gap-4 px-4 pb-4"
      >
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-start gap-1.5">
            <img src="/icons/cart/calendar.svg" alt="" class="size-4 shrink-0">
            <UiTypography as="span" size="md" color="muted">تاریخ ارسال را انتخاب کنید:</UiTypography>
          </div>

          <div class="flex flex-wrap items-stretch justify-start gap-2">
            <button
              v-for="day in days"
              :key="day.id"
              type="button"
              class="flex h-[92px] w-[78px] shrink-0 flex-col items-center justify-center gap-1 rounded-[12px] border transition-colors"
              :class="day.id === dayId ? 'border-R-300 bg-R-10' : 'border-T-300 bg-T-50 hover:border-T-500'"
              @click="emit('selectDay', day.id)"
            >
              <UiTypography as="span" size="lg" color="muted" leading="none">{{ day.weekday }}</UiTypography>
              <UiTypography as="span" size="2xl" weight="semibold" leading="none">{{ day.day }}</UiTypography>
              <UiTypography as="span" size="md" color="muted" leading="none">{{ day.month }}</UiTypography>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-start gap-1.5">
            <img src="/icons/cart/clock.svg" alt="" class="size-4 shrink-0">
            <UiTypography as="span" size="md" color="muted">ساعت ارسال را انتخاب کنید:</UiTypography>
          </div>

          <div class="flex flex-wrap justify-start gap-2">
            <button
              v-for="slot in timeSlots"
              :key="slot"
              type="button"
              class="flex h-[37px] items-center gap-1.5 rounded-[12px] border px-4 transition-colors"
              :class="slot === timeId ? 'border-R-300 bg-R-10' : 'border-T-300 bg-T-50 hover:border-T-500'"
              @click="emit('selectTime', slot)"
            >
              <UiTypography as="span" size="lg" weight="medium" leading="none">{{ slot.split(' ')[0] }}</UiTypography>
              <UiTypography as="span" size="md" color="muted" leading="none">الی</UiTypography>
              <UiTypography as="span" size="lg" weight="medium" leading="none">{{ slot.split(' ')[2] }}</UiTypography>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
