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
  <article class="rounded-2xl border border-T-300 bg-T-50 p-4">
    <DashboardOrdersStatusChip
      :label="meta.label"
      :tone="meta.tone"
      :icon="meta.icon"
      variant="soft"
    />

    <!-- Meta -->
    <div class="mt-3 flex flex-col">
      <div class="flex items-center justify-between border-b border-T-300 py-2 text-[12.5px] last:border-b-0">
        <span class="text-T-600">تاریخ:</span>
        <span class="font-semibold text-T-900">{{ request.date }}</span>
      </div>
      <div class="flex items-center justify-between border-b border-T-300 py-2 text-[12.5px] last:border-b-0">
        <span class="text-T-600">کد پیگیری مرجوعی:</span>
        <DashboardOrdersCopyValue :value="toPersianDigits(request.trackingCode)" :copy-value="request.trackingCode" />
      </div>
      <div class="flex items-center justify-between border-b border-T-300 py-2 text-[12.5px] last:border-b-0">
        <span class="text-T-600">مبلغ:</span>
        <span class="font-semibold text-T-900">{{ formatPriceFa(request.amount) }} تومان</span>
      </div>
    </div>

    <!-- Products -->
    <div class="mt-4 grid grid-cols-2 gap-3">
      <div
        v-for="item in request.items"
        :key="item.id"
        class="flex flex-col items-center gap-2 rounded-xl border border-T-300 p-3"
      >
        <ProductImage
          :src="item.image"
          :alt="item.title"
          container-class="size-14 shrink-0 rounded-xl bg-transparent"
        />

        <p class="line-clamp-2 text-center text-[11.5px] font-medium leading-[18px] text-T-800">
          {{ item.title }}
        </p>

        <NuxtLink
          :to="`/dashboard/returns/${request.id}`"
          class="inline-flex h-8 w-full items-center justify-center rounded-lg border border-T-300 bg-T-50 text-[11.5px] font-semibold text-T-800 transition-colors hover:border-T-500"
        >
          انتخاب من
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
