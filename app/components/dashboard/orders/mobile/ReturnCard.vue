<script setup lang="ts">
import type { ReturnRequest } from '~/data/orders'
import { returnStatusMeta } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const props = defineProps<{
  request: ReturnRequest
}>()

const meta = computed(() => returnStatusMeta[props.request.status])
const detailHref = computed(() => `/dashboard/returns/${props.request.id}`)
</script>

<template>
  <article class="-mx-4 border-b border-T-300 px-4 py-4 last:border-b-0">
    <DashboardOrdersStatusChip
      :label="meta.label"
      :tone="meta.tone"
      :icon="meta.icon"
      :img-src="meta.icon === 'refresh' ? '/icons/return-refresh.svg' : undefined"
      variant="soft"
      class="[&>img]:order-first [&>svg]:order-first [&>svg]:size-[18px] !bg-transparent !ps-0"
    />

    <!-- Meta -->
    <div class="mt-3 flex flex-col gap-2 text-[12.5px]">
      <div class="flex items-center gap-2">
        <span class="text-T-600">تاریخ:</span>
        <span class="font-semibold text-T-900">{{ request.date }}</span>
        <span class="h-4 w-px shrink-0 bg-T-300" />
        <span class="text-T-600">کد پیگیری مرجوعی:</span>
        <DashboardOrdersCopyValue :value="toPersianDigits(request.trackingCode)" :copy-value="request.trackingCode" :show-copy="false" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-T-600">مبلغ:</span>
        <span class="font-semibold text-T-900">{{ formatPriceFa(request.amount) }} تومان</span>
      </div>
    </div>

    <!-- Products (single-row carousel) -->
    <Carousel
      class="mt-4"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="ms-0">
        <CarouselItem
          v-for="item in request.items"
          :key="item.id"
          class="w-[314px] shrink-0 basis-auto ps-0 me-4"
        >
          <NuxtLink
            :to="detailHref"
            class="flex h-[158px] w-full flex-col rounded-[16px] border border-T-400 p-4 transition-colors hover:border-T-500"
          >
            <div class="flex flex-1 items-start gap-2">
              <ProductImage
                :src="item.image"
                :alt="item.title"
                container-class="size-[56px] shrink-0 rounded-xl bg-transparent"
              />
              <p class="flex-1 text-right text-[12.5px] font-medium leading-[22px] text-T-800">
                {{ item.title }}
              </p>
            </div>

            <div class="mt-4 flex items-center gap-2 border-t border-T-300 pt-4">
              <img src="/icons/return-mismatch.svg" alt="" class="size-4 shrink-0" aria-hidden="true">
              <span class="flex-1 text-right text-[12px] leading-[20px] text-T-600">
                {{ item.reason }}
              </span>
            </div>
          </NuxtLink>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </article>
</template>
