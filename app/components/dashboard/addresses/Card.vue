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
  <article class="flex items-center justify-between gap-4 rounded-2xl border border-T-300 bg-T-50 p-4">
    <div class="flex min-w-0 flex-col gap-2.5">
      <UiTypography as="h3" size="lg" weight="medium">{{ address.title }}</UiTypography>

      <div class="flex items-center gap-1.5">
        <img src="/icons/address-map-pin.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
        <UiTypography as="span" size="md" weight="regular" color="muted" class="shrink-0 leading-[22px]">آدرس:</UiTypography>
        <UiTypography as="span" size="md" weight="regular" color="muted" class="truncate leading-[22px]">{{ address.address }}</UiTypography>
      </div>

      <div class="flex items-center gap-1.5">
        <img src="/icons/address-barcode.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
        <UiTypography as="span" size="md" weight="regular" color="muted" class="shrink-0 leading-[22px]">کد پستی:</UiTypography>
        <UiTypography as="span" size="md" weight="regular" color="muted" class="leading-[22px]">{{ postalCode }}</UiTypography>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-0">
      <button
        type="button"
        class="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-T-100"
        aria-label="ویرایش آدرس"
      >
        <img src="/icons/address-edit.svg" alt="" class="size-5 shrink-0" aria-hidden="true">
      </button>
      <button
        type="button"
        class="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-R-10"
        aria-label="حذف آدرس"
        @click="emit('remove', address.id)"
      >
        <img src="/icons/address-trash.svg" alt="" class="size-5 shrink-0" aria-hidden="true">
      </button>
    </div>
  </article>
</template>
