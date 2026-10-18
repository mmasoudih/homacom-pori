<script lang="ts" setup>
import type { CheckoutResult } from '~/data/checkout'
import { formatPriceFa } from '~/utils/format'

/**
 * Payment result card (Figma: 27440 success / 27473 failure, mobile 95779 /
 * 95812). Desktop is a 474px bordered card 131px from the top; mobile runs
 * full width with 32/50 padding and no border, 85px from the top.
 */
defineProps<{
  status: 'success' | 'failure'
  result: CheckoutResult
}>()
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-white">
    <div
      class="mx-auto mt-[85px] flex w-full flex-col items-center gap-8 rounded-[20px] bg-white px-8 py-[50px] lg:mt-[131px] lg:max-w-[474px] lg:border lg:border-T-400 lg:px-[31px] lg:py-[49px]"
    >
      <!-- Icon + title -->
      <div class="flex w-full flex-col items-center gap-[18px]">
        <img
          :src="status === 'success' ? '/icons/checkout/result-success.svg' : '/icons/checkout/result-failure.svg'"
          alt=""
          class="size-[74px]"
        >

        <div class="flex w-full flex-col items-center gap-2 text-center">
          <UiTypography
            as="h1"
            size="3xl"
            weight="semibold"
            class="leading-[24px]"
            :class="status === 'failure' ? 'text-R-300' : ''"
          >
            {{ status === 'success' ? 'پرداخت موفق' : 'پرداخت شما ناموفق بود!' }}
          </UiTypography>

          <UiTypography
            as="p"
            size="md"
            weight="regular"
            color="muted"
            class="max-w-[410px] leading-[15px]"
            :class="status === 'failure' ? 'pb-[14px]' : 'pb-2'"
          >
            <template v-if="status === 'success'">
              تبریک، پرداخت شما با موفقیت انجام شد.
            </template>
            <template v-else>
              این پرداخت به ثبت نرسیده و هیچ مبلغی از حساب شما کسر نشده است. در صورت کسر وجه، مبلغ
              به‌صورت خودکار و حداکثر تا ۷۲ ساعت کاری (معمولاً چند دقیقه) به کارت شما بازمی‌گردد.
            </template>
          </UiTypography>
        </div>
      </div>

      <!-- Receipt -->
      <div
        class="flex h-[222px] w-full flex-col justify-center gap-4 rounded-[12px] border border-T-300 p-[19px]"
      >
        <div class="flex items-center justify-between gap-3">
          <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
            شماره سفارش:
          </UiTypography>
          <UiTypography as="span" size="lg" weight="medium" class="leading-[17px]">
            {{ result.orderNumber }}
          </UiTypography>
        </div>

        <div class="h-px w-full shrink-0 bg-T-300" />

        <div class="flex items-center justify-between gap-3">
          <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
            تاریخ و ساعت پرداخت:
          </UiTypography>
          <UiTypography as="span" size="lg" weight="medium" class="leading-[17px]">
            {{ result.paidAt }}
          </UiTypography>
        </div>

        <div class="h-px w-full shrink-0 bg-T-300" />

        <div class="flex items-center justify-between gap-3">
          <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
            شماره پیگیری سفارش:
          </UiTypography>
          <UiTypography as="span" size="lg" weight="medium" class="leading-[17px]">
            {{ result.trackingNumber }}
          </UiTypography>
        </div>

        <div class="h-px w-full shrink-0 bg-T-300" />

        <div class="flex items-center justify-between gap-3">
          <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
            مبلغ پرداختی:
          </UiTypography>
          <span class="flex items-baseline gap-1">
            <UiTypography as="span" size="2xl" weight="semibold" class="leading-[22px]">
              {{ formatPriceFa(result.amount) }}
            </UiTypography>
            <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
              تومان
            </UiTypography>
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex w-full flex-col gap-3 lg:flex-row">
        <template v-if="status === 'failure'">
          <NuxtLink
            to="/checkout"
            class="flex h-[46px] w-full items-center justify-center rounded-[14px] border border-R-300 transition-opacity hover:opacity-80 lg:w-auto lg:flex-1"
          >
            <UiTypography as="span" size="lg" weight="semibold" class="text-R-300">
              پرداخت مجدد
            </UiTypography>
          </NuxtLink>

          <NuxtLink
            to="/"
            class="flex h-[46px] w-full items-center justify-center rounded-[12px] border border-T-500 transition-colors hover:bg-T-100 lg:w-auto lg:flex-1"
          >
            <UiTypography as="span" size="lg" weight="medium">بازگشت به خانه</UiTypography>
          </NuxtLink>
        </template>

        <NuxtLink
          v-else
          to="/"
          class="flex h-[46px] w-full items-center justify-center rounded-[12px] border border-T-500 transition-colors hover:bg-T-100"
        >
          <UiTypography as="span" size="lg" weight="medium">بازگشت به خانه</UiTypography>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
