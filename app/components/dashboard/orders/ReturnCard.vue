<script setup lang="ts">
import { IconExclamationMark } from '@tabler/icons-vue'
import type { ReturnRequest } from '~/data/orders'
import { returnStatusMeta } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  request: ReturnRequest
}>()

const meta = computed(() => returnStatusMeta[props.request.status])
const primaryItem = computed(() => props.request.items[0])
const itemCards = computed(() => props.request.items.slice(1))
const detailHref = computed(() => `/dashboard/returns/${props.request.id}`)
const selectedReason = 'مغایرت انتخابی من'
</script>

<template>
  <article class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-5">
    <DashboardOrdersStatusChip
      :label="meta.label"
      :tone="meta.tone"
      :icon="meta.icon"
    />

    <div class="mt-4 flex flex-wrap items-center justify-start gap-x-6 gap-y-2 text-[12.5px] text-T-600">
      <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
        کد پیگیری مرجوعی:
        <DashboardOrdersCopyValue :value="toPersianDigits(request.trackingCode)" :copy-value="request.trackingCode" />
      </span>

      <span class="h-4 w-px shrink-0 bg-T-300" />

      <span class="whitespace-nowrap">
        تاریخ: <b class="font-bold text-T-900">{{ request.date }}</b>
      </span>

      <span class="h-4 w-px shrink-0 bg-T-300" />

      <span class="whitespace-nowrap">
        مبلغ: <b class="font-bold text-T-900">{{ formatPriceFa(request.amount) }}</b> تومان
      </span>
    </div>

    <div class="mt-4 flex flex-col gap-4 border-t border-T-300 pt-4 lg:flex-row">
      <!-- Highlighted selected item -->
      <NuxtLink
        v-if="primaryItem"
        :to="detailHref"
        class="flex flex-col rounded-[16px] border border-T-400 p-4 transition-colors hover:border-T-500 lg:w-44 lg:shrink-0"
      >
        <div class="flex flex-1 items-center justify-center">
          <ProductImage
            :src="primaryItem.image"
            :alt="primaryItem.title"
            container-class="size-20 shrink-0 rounded-xl bg-transparent"
          />
        </div>

        <div class="mt-4 flex items-center gap-2 border-t border-T-300 pt-4">
          <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-T-600 text-T-50">
            <IconExclamationMark class="size-3.5" />
          </span>
          <span class="flex-1 text-right text-[12px] font-medium leading-[20px] text-T-700">
            {{ selectedReason }}
          </span>
        </div>
      </NuxtLink>

      <!-- Remaining items -->
      <div class="grid gap-4 lg:flex-1 lg:grid-cols-2">
        <NuxtLink
          v-for="item in itemCards"
          :key="item.id"
          :to="detailHref"
          class="flex flex-col rounded-[16px] border border-T-400 p-4 transition-colors hover:border-T-500"
        >
          <div class="flex flex-1 items-start justify-between gap-3">
            <ProductImage
              :src="item.image"
              :alt="item.title"
              container-class="size-[72px] shrink-0 rounded-xl bg-transparent"
            />
            <p class="text-right text-[12.5px] font-medium leading-[22px] text-T-800">
              {{ item.title }}
            </p>
          </div>

          <div class="mt-4 flex items-center gap-2 border-t border-T-300 pt-4">
            <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-T-600 text-T-50">
              <IconExclamationMark class="size-3.5" />
            </span>
            <span class="flex-1 text-right text-[12px] leading-[20px] text-T-600">
              {{ item.reason }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
