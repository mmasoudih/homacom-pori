<script setup lang="ts">
import type { Address } from '~/data/addresses'
import { toPersianDigits } from '~/utils/format'

const props = defineProps<{
  address: Address
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const postalCode = computed(() => toPersianDigits(props.address.postalCode))
</script>

<template>
  <article class="flex items-center justify-between gap-3 rounded-lg border border-T-400 bg-T-50 p-4">
    <div class="flex min-w-0 flex-col gap-2">
      <h3 class="text-[13.5px] font-bold text-T-900">{{ address.title }}</h3>

      <div class="flex items-center gap-1.5">
        <img src="/icons/address-map-pin.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
        <UiTypography as="span" size="md" weight="regular" color="muted" class="shrink-0 leading-[21px]">آدرس:</UiTypography>
        <UiTypography as="span" size="md" weight="regular" color="muted" class="truncate leading-[21px]">{{ address.address }}</UiTypography>
      </div>

      <div class="flex items-center gap-1.5">
        <img src="/icons/address-barcode.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
        <UiTypography as="span" size="md" weight="regular" color="muted" class="shrink-0 leading-[21px]">کد پستی:</UiTypography>
        <UiTypography as="span" size="md" weight="regular" color="muted" class="leading-[21px]">{{ postalCode }}</UiTypography>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-T-100"
        aria-label="ویرایش آدرس"
      >
        <img src="/icons/address-edit.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
      </button>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-R-10"
        aria-label="حذف آدرس"
        @click="emit('remove', address.id)"
      >
        <img src="/icons/address-trash.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
      </button>
    </div>
  </article>
</template>
