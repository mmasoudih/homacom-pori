<script setup lang="ts">
import type { DeliveryDay, ShippingMethod } from '~/data/checkout'

defineProps<{
  open: boolean
  methods: ShippingMethod[]
  methodId: string
  days: DeliveryDay[]
  dayId: string
  timeSlots: readonly string[]
  timeId: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [methodId: string]
  selectDay: [dayId: string]
  selectTime: [slot: string]
}>()

const dialogShell
  = 'max-lg:top-auto! max-lg:bottom-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:rounded-b-none! max-lg:rounded-t-[24px]! max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      overlay-class="bg-[#1D1D1F]/45 backdrop-blur-[8px]"
      class="flex! max-h-[90dvh] flex-col overflow-hidden max-w-[543px] gap-0 rounded-[24px] border-0 p-0 lg:max-w-[543px]"
    >
      <div class="flex shrink-0 items-center justify-between gap-3 border-b border-T-400 px-4 py-6 lg:px-6">
        <UiDialogTitle class="text-[16px] font-bold text-T-900">روش و زمان ارسال</UiDialogTitle>
        <UiDialogDescription class="sr-only">انتخاب روش ارسال، تاریخ و ساعت تحویل</UiDialogDescription>
        <UiDialogClose class="flex size-5 items-center justify-center" aria-label="بستن">
          <img src="/icons/cart/dialog-close.svg" alt="" class="size-5">
        </UiDialogClose>
      </div>

      <div class="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-6">
        <CheckoutShippingOptions
          :methods="methods"
          :method-id="methodId"
          :days="days"
          :day-id="dayId"
          :time-slots="timeSlots"
          :time-id="timeId"
          @select="emit('select', $event)"
          @select-day="emit('selectDay', $event)"
          @select-time="emit('selectTime', $event)"
        />
      </div>

      <div class="shrink-0 p-4 lg:p-6">
        <button
          type="button"
          class="flex h-[42px] w-full items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-R-400 disabled:opacity-50"
          :disabled="!methodId || !dayId || !timeId"
          @click="emit('update:open', false)"
        >
          <UiTypography as="span" size="lg" weight="bold" color="white">تایید</UiTypography>
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
