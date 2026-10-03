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
  <article class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-5">
    <DashboardOrdersStatusChip
      :label="meta.label"
      :tone="meta.tone"
      :icon="meta.icon"
    />

    <UiTypography
      as="div"
      size="md"
      weight="medium"
      color="subtle"
      class="mt-4 flex flex-wrap items-center justify-start gap-x-6 gap-y-2"
    >
      <span class="whitespace-nowrap">
        مبلغ: <UiTypography as="span" size="lg" weight="medium" color="default">{{ formatPriceFa(request.amount) }}</UiTypography> تومان
      </span>

      <span class="h-4 w-px shrink-0 bg-T-300" />

      <span class="whitespace-nowrap">
        تاریخ: <UiTypography as="span" size="lg" weight="medium" color="default">{{ request.date }}</UiTypography>
      </span>

      <span class="h-4 w-px shrink-0 bg-T-300" />

      <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
        کد پیگیری مرجوعی:
        <DashboardOrdersCopyValue :value="toPersianDigits(request.trackingCode)" :copy-value="request.trackingCode" :show-copy="false" />
      </span>
    </UiTypography>

    <!-- Return items carousel (single row) -->
    <Carousel
      class="mt-4 border-t border-T-300 pt-4"
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
