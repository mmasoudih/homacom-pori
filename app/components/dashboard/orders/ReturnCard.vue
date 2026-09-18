<script setup lang="ts">
import type { ReturnRequest } from '~/data/orders'
import { returnStatusMeta } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  request: ReturnRequest
}>()

const meta = computed(() => returnStatusMeta[props.request.status])
</script>

<template>
  <article class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-5">
    <DashboardOrdersStatusChip
      :label="meta.label"
      :tone="meta.tone"
      :icon="meta.icon"
      variant="soft"
    />

    <div class="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[12.5px] text-T-600 sm:justify-between">
      <span>مبلغ: <b class="font-bold text-T-900">{{ formatPriceFa(request.amount) }}</b> تومان</span>
      <span>تاریخ: <b class="font-bold text-T-900">{{ request.date }}</b></span>
      <span class="inline-flex items-center gap-1.5">
        کد پیگیری مرجوعی:
        <DashboardOrdersCopyValue :value="toPersianDigits(request.trackingCode)" :copy-value="request.trackingCode" />
      </span>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-T-300 pt-4 sm:grid-cols-2">
      <div
        v-for="item in request.items"
        :key="item.id"
        class="flex items-start gap-3"
      >
        <ProductImage
          :src="item.image"
          :alt="item.title"
          container-class="size-14 shrink-0 rounded-lg bg-transparent"
        />

        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <p class="line-clamp-2 text-[12.5px] font-medium leading-[22px] text-T-800">
            {{ item.title }}
          </p>
          <p class="text-[11.5px] leading-[20px] text-T-600">
            {{ item.reason }}
          </p>
          <NuxtLink
            :to="`/dashboard/returns/${request.id}`"
            class="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-T-400 bg-T-50 px-3 text-[11.5px] font-semibold text-T-800 transition-colors hover:border-T-500"
          >
            انتخاب من
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>
