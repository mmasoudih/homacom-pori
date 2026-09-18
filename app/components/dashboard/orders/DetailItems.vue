<script setup lang="ts">
import type { OrderItem } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  items: OrderItem[]
}>()

const count = computed(() => toPersianDigits(props.items.length))
</script>

<template>
  <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
    <h2 class="text-center text-[14px] font-bold text-T-900">
      اطلاعات کالاها: ({{ count }})
    </h2>

    <div class="mt-6 divide-y divide-T-300">
      <article
        v-for="item in items"
        :key="item.id"
        class="flex flex-col gap-4 py-6 first:pt-0"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex min-w-0 flex-1 flex-col gap-2.5">
            <p class="text-[13px] font-medium leading-[24px] text-T-900">
              {{ item.title }}
            </p>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] text-T-600">
              <span class="flex items-center gap-1.5">
                رنگ:
                <b class="font-semibold text-T-800">{{ item.color }}</b>
                <span class="size-3 rounded-full border border-T-300" :style="{ backgroundColor: item.colorHex }" />
              </span>
              <span>گارانتی: <b class="font-semibold text-T-800">{{ item.warranty }}</b></span>
              <span>محصول ({{ toPersianDigits(item.productCode) }}):</span>
              <span>تعداد: <b class="font-semibold text-T-800">{{ toPersianDigits(item.quantity) }}</b></span>
              <span>مبلغ کل: <b class="font-semibold text-T-800">{{ formatPriceFa(item.price) }}</b> تومان</span>
            </div>
          </div>

          <ProductImage
            :src="item.image"
            :alt="item.title"
            container-class="size-[72px] shrink-0 rounded-xl bg-transparent"
          />
        </div>

        <DashboardOrdersItemRatingRow :item="item" />
      </article>
    </div>
  </section>
</template>
