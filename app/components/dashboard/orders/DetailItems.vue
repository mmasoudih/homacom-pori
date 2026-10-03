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
    <UiTypography as="h2" size="xl" weight="semibold" class="text-right">
      اطلاعات کالاها:
      <UiTypography as="span" size="lg" weight="regular">({{ count }})</UiTypography>
    </UiTypography>

    <div class="mt-6 divide-y divide-T-300">
      <article
        v-for="(item, index) in items"
        :key="item.id"
        class="flex flex-col gap-4 py-6 first:pt-0"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex shrink-0 flex-col items-center gap-2 self-stretch">
            <ProductImage
              :src="item.image"
              :alt="item.title"
              container-class="size-[72px] shrink-0 rounded-xl bg-transparent"
            />
            <UiTypography as="span" size="md" weight="regular" class="whitespace-nowrap">
              محصول ({{ toPersianDigits(items.length) }}/{{ toPersianDigits(index + 1) }})
            </UiTypography>
            <span class="flex items-center gap-1 whitespace-nowrap">
              <UiTypography as="span" size="md" weight="regular" color="muted">تعداد:</UiTypography>
              <UiTypography as="span" size="md" weight="regular">{{ toPersianDigits(item.quantity) }}</UiTypography>
            </span>
          </div>

          <div class="flex min-w-0 flex-1 flex-col gap-2.5">
            <UiTypography as="p" size="lg" weight="medium" class="leading-[24px]">
              {{ item.title }}
            </UiTypography>

            <div class="flex flex-col gap-2">
              <span class="flex items-center gap-1.5">
                <img src="/icons/color-swatch.svg" alt="" class="size-5 shrink-0" aria-hidden="true">
                <UiTypography as="span" size="md" weight="regular" color="muted">رنگ:</UiTypography>
                <UiTypography as="span" size="md" weight="regular">{{ item.color }}</UiTypography>
              </span>
              <span class="flex items-center gap-1.5">
                <img src="/icons/warranty.svg" alt="" class="size-5 shrink-0" aria-hidden="true">
                <UiTypography as="span" size="md" weight="regular" color="muted">گارانتی:</UiTypography>
                <UiTypography as="span" size="md" weight="regular">{{ item.warranty }}</UiTypography>
              </span>
              <span class="flex items-center gap-1.5">
                <UiTypography as="span" size="xl" weight="medium">{{ formatPriceFa(item.price) }}</UiTypography>
                <UiTypography as="span" size="md" weight="semibold" color="subtle">تومان</UiTypography>
              </span>
              <DashboardOrdersItemRatingRow :item="item" />
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
