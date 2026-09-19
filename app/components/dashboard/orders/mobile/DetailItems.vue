<script setup lang="ts">
import type { OrderItem } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  items: OrderItem[]
}>()

const count = computed(() => toPersianDigits(props.items.length))
</script>

<template>
  <section>
    <h2 class="my-4 text-center text-[14px] font-bold text-T-900">
      اطلاعات کالاها: ({{ count }})
    </h2>

    <article
      v-for="item in items"
      :key="item.id"
      class="mb-4 rounded-2xl border border-T-300 bg-T-50 p-4"
    >
      <div class="flex flex-row-reverse items-start gap-3">
        <p class="min-w-0 flex-1 text-[12.5px] font-medium leading-[22px] text-T-900">
          {{ item.title }}
        </p>

        <ProductImage
          :src="item.image"
          :alt="item.title"
          container-class="size-16 shrink-0 rounded-xl bg-transparent"
        />
      </div>

      <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11.5px] text-T-600">
        <div class="flex items-center justify-between gap-2">
          <span class="shrink-0">رنگ:</span>
          <span class="flex items-center gap-1.5">
            <b class="font-semibold text-T-800">{{ item.color }}</b>
            <span class="size-3 rounded-full border border-T-300" :style="{ backgroundColor: item.colorHex }" />
          </span>
        </div>

        <div class="flex items-center justify-between gap-2">
          <span class="shrink-0">گارانتی:</span>
          <b class="min-w-0 font-semibold text-T-800">{{ item.warranty }}</b>
        </div>

        <span>محصول ({{ toPersianDigits(item.productCode) }}):</span>

        <div class="flex items-center justify-between gap-2">
          <span class="shrink-0">تعداد:</span>
          <b class="font-semibold text-T-800">{{ toPersianDigits(item.quantity) }}</b>
        </div>

        <div class="flex items-center justify-between gap-2">
          <span class="shrink-0">مبلغ:</span>
          <span>
            <b class="font-semibold text-T-800">{{ formatPriceFa(item.price) }}</b>
            تومان
          </span>
        </div>
      </div>

      <DashboardOrdersMobileItemRating :item="item" class="mt-3" />
    </article>
  </section>
</template>
