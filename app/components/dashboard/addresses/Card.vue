<script setup lang="ts">
import { IconBarcode, IconMapPin, IconPencil, IconTrash } from '@tabler/icons-vue'
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
      <h3 class="text-[14px] font-bold text-T-900">{{ address.title }}</h3>

      <div class="flex items-center gap-1.5 text-[12.5px] leading-[22px]">
        <IconMapPin class="size-4 shrink-0 text-T-600" />
        <span class="shrink-0 text-T-600">آدرس:</span>
        <span class="truncate text-T-800">{{ address.address }}</span>
      </div>

      <div class="flex items-center gap-1.5 text-[12.5px] leading-[22px]">
        <IconBarcode class="size-4 shrink-0 text-T-600" />
        <span class="shrink-0 text-T-600">کد پستی:</span>
        <span class="text-T-800">{{ postalCode }}</span>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <button
        type="button"
        class="flex size-9 items-center justify-center rounded-lg text-indigo-500 transition-colors hover:bg-T-100"
        aria-label="ویرایش آدرس"
      >
        <IconPencil class="size-5" />
      </button>
      <button
        type="button"
        class="flex size-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-R-10"
        aria-label="حذف آدرس"
        @click="emit('remove', address.id)"
      >
        <IconTrash class="size-5" />
      </button>
    </div>
  </article>
</template>
