<script setup lang="ts">
import type { ReturnItem } from '~/data/orders'
import { returnItemStatusMeta } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  item: ReturnItem
}>()

const meta = computed(() => returnItemStatusMeta[props.item.status])
</script>

<template>
  <article class="mb-4 rounded-2xl border border-T-300 bg-T-50 p-4">
    <div class="flex justify-center">
      <DashboardOrdersStatusChip
        :label="meta.label"
        :tone="meta.tone"
        :icon="meta.icon"
        variant="soft"
        class="w-full justify-center"
      />
    </div>

    <div class="mt-4 flex items-start gap-3">
      <ProductImage
        :src="item.image"
        :alt="item.title"
        container-class="size-14 shrink-0 rounded-xl bg-transparent"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-1.5 text-[11.5px] text-T-600">
        <p class="text-[12.5px] leading-[22px] text-T-800">{{ item.title }}</p>
        <span>تعداد: <b class="font-semibold text-T-800">{{ toPersianDigits(item.quantity) }}</b></span>
        <span class="flex items-center gap-1.5">
          رنگ: <b class="font-semibold text-T-800">{{ item.color }}</b>
          <span class="size-3 rounded-full border border-T-300" :style="{ backgroundColor: item.colorHex }" />
        </span>
        <span>گارانتی: <b class="font-semibold text-T-800">{{ item.warranty }}</b></span>
        <span>مبلغ مرجوعی: <b class="font-semibold text-T-800">{{ formatPriceFa(item.amount) }}</b> تومان</span>
      </div>
    </div>

    <div class="mt-3 border-t border-T-300 pt-3 text-[11.5px] text-T-600">
      علت مرجوعی: <b class="font-semibold text-T-800">{{ item.reason }}</b>
    </div>
  </article>
</template>
