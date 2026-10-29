<script setup lang="ts">
import type { Order } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'
import { gatewayLabel } from '~/utils/payment'

/**
 * Return page for every gateway payment.
 *
 * The bank handler redirects here as `/payment-result?pid=<hashed payment id>`.
 * There is no endpoint that resolves `pid` to an order (flagged to the backend),
 * so the page reads the newest invoice (`GET /shop/order?per_page=1`) and
 * refreshes the profile so wallet top-ups show their new balance.
 */
const route = useRoute()
const pid = computed(() => String(route.query.pid || ''))

const { orders, load } = useOrders()
const { refresh: refreshProfile } = useUserProfile()

// Best effort: a failed request (e.g. signed-out visitor) leaves the neutral
// "not confirmed yet" state instead of breaking the page.
await Promise.allSettled([
  load({ perPage: 1, allPages: false }),
  refreshProfile(),
])

const order = computed<Order | undefined>(() => orders.value[0])

const paid = computed(
  () => order.value?.paymentStatus === 'done' || order.value?.paymentStatus === 'slice_payment',
)
const partial = computed(() => order.value?.paymentStatus === 'slice_payment')

const title = computed(() => {
  if (paid.value) return partial.value ? 'پرداخت شما ثبت شد' : 'پرداخت موفق'
  return 'نتیجه پرداخت هنوز تأیید نشده است'
})

const description = computed(() => {
  if (paid.value) {
    return partial.value
      ? 'بخشی از مبلغ فاکتور پرداخت شد؛ مانده را می‌توانید از جزئیات سفارش پرداخت کنید.'
      : 'پرداخت شما با موفقیت ثبت شد. وضعیت سفارش از بخش سفارش‌های من قابل پیگیری است.'
  }
  if (!order.value) {
    return 'اگر مبلغی از حساب شما کسر شده، نگران نباشید؛ نتیجه تأیید بانک ممکن است چند لحظه زمان ببرد. وضعیت را از بخش سفارش‌ها یا کیف پول بررسی کنید.'
  }
  return 'این فاکتور هنوز پرداخت‌نشده است. اگر پرداخت انجام داده‌اید، چند لحظه صبر کنید و صفحه را دوباره باز کنید؛ در صورت کسر وجه، مبلغ حداکثر تا ۷۲ ساعت کاری بازمی‌گردد.'
})

const paidAt = computed(() => order.value?.date ?? '')

useHead({
  title: 'نتیجه پرداخت | هماکام',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-white">
    <div
      class="mx-auto mt-[85px] flex w-full flex-col items-center gap-8 rounded-[20px] bg-white px-8 py-[50px] lg:mt-[131px] lg:max-w-[474px] lg:border lg:border-T-400 lg:px-[31px] lg:py-[49px]"
    >
      <div class="flex w-full flex-col items-center gap-[18px]">
        <img
          v-if="paid"
          :src="partial ? '/icons/checkout/result-failure.svg' : '/icons/checkout/result-success.svg'"
          alt=""
          class="size-[74px]"
        >
        <img
          v-else
          src="/icons/clock-history.svg"
          alt=""
          class="size-[74px]"
        >

        <div class="flex w-full flex-col items-center gap-2 text-center">
          <UiTypography
            as="h1"
            size="3xl"
            weight="semibold"
            class="leading-[24px]"
            :class="paid ? '' : 'text-T-800'"
          >
            {{ title }}
          </UiTypography>

          <UiTypography as="p" size="md" weight="regular" color="muted" class="max-w-[410px] leading-[20px]">
            {{ description }}
          </UiTypography>
        </div>
      </div>

      <!-- Receipt (best effort: `pid` has no order resolver yet) -->
      <div
        v-if="order"
        class="flex w-full flex-col justify-center gap-4 rounded-[12px] border border-T-300 p-[19px]"
      >
        <div class="flex items-center justify-between gap-3">
          <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
            شماره سفارش:
          </UiTypography>
          <UiTypography as="span" size="lg" weight="medium" class="leading-[17px]">
            {{ toPersianDigits(order.code) }}
          </UiTypography>
        </div>

        <div class="h-px w-full shrink-0 bg-T-300" />

        <div class="flex items-center justify-between gap-3">
          <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
            تاریخ ثبت سفارش:
          </UiTypography>
          <UiTypography as="span" size="lg" weight="medium" class="leading-[17px]">
            {{ paidAt }}
          </UiTypography>
        </div>

        <template v-if="pid">
          <div class="h-px w-full shrink-0 bg-T-300" />

          <div class="flex items-center justify-between gap-3">
            <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
              شناسه پرداخت:
            </UiTypography>
            <UiTypography as="span" size="lg" weight="medium" class="leading-[17px]" dir="ltr">
              {{ pid }}
            </UiTypography>
          </div>
        </template>

        <div v-if="order.gate" class="flex items-center justify-between gap-3">
          <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
            درگاه پرداخت:
          </UiTypography>
          <UiTypography as="span" size="lg" weight="medium" class="leading-[17px]">
            {{ gatewayLabel(order.gate) }}
          </UiTypography>
        </div>

        <div class="h-px w-full shrink-0 bg-T-300" />

        <div class="flex items-center justify-between gap-3">
          <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
            مبلغ پرداختی:
          </UiTypography>
          <span class="flex items-baseline gap-1">
            <UiTypography as="span" size="2xl" weight="semibold" class="leading-[22px]">
              {{ formatPriceFa(order.paidPrice || order.amount) }}
            </UiTypography>
            <UiTypography as="span" size="lg" weight="regular" color="muted" class="leading-[17px]">
              تومان
            </UiTypography>
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex w-full flex-col gap-3 lg:flex-row">
        <NuxtLink
          to="/dashboard/orders"
          class="flex h-[46px] w-full items-center justify-center rounded-[14px] bg-R-300 transition-opacity hover:opacity-80 lg:flex-1"
        >
          <UiTypography as="span" size="lg" weight="semibold" color="white">سفارش‌های من</UiTypography>
        </NuxtLink>

        <NuxtLink
          to="/dashboard/wallet"
          class="flex h-[46px] w-full items-center justify-center rounded-[12px] border border-T-500 transition-colors hover:bg-T-100 lg:flex-1"
        >
          <UiTypography as="span" size="lg" weight="medium">کیف پول</UiTypography>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
