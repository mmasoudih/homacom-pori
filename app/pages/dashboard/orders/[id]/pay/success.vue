<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { findOrder } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const route = useRoute()
const id = computed(() => String(route.params.id))
const order = computed(() => findOrder(id.value))

const totals = computed(() => {
  const total = order.value?.payment?.total ?? order.value?.amount ?? 0
  const paid = order.value?.payment?.paid ?? 0
  return { total, paid, remaining: Math.max(0, total - paid) }
})

const orderNumber = computed(() => `AXM-${order.value?.code.slice(-5) ?? '24578'}`)

useHead({
  title: 'پرداخت موفق | هماکام',
})
</script>

<template>
  <DashboardOrdersSuccessShell>
    <DashboardOrdersSuccessCard
      v-if="order"
      title="پرداخت شما با موفقیت انجام شد"
      description="این پرداخت ثبت شد؛ اما بخشی از مبلغ سفارش هنوز باقی مانده و سفارش شما پس از تکمیل پرداخت نهایی و وارد مرحله ارسال می‌شود."
    >
      <!-- Receipt -->
      <div class="mt-6 flex flex-col divide-y divide-T-300 rounded-xl border border-T-400 text-start">
        <div class="flex items-center justify-between gap-3 px-4 py-3 text-[12px]">
          <span class="text-T-600">شماره سفارش:</span>
          <span class="font-bold text-T-900">{{ toPersianDigits(orderNumber) }}</span>
        </div>
        <div class="flex items-center justify-between gap-3 px-4 py-3 text-[12px]">
          <span class="text-T-600">تاریخ و ساعت پرداخت:</span>
          <span class="font-bold text-T-900">۱۴۰۴/۱۱/۱۳ - ۲۰:۴۵</span>
        </div>
        <div class="flex items-center justify-between gap-3 px-4 py-3 text-[12px]">
          <span class="text-T-600">شماره پیگیری سفارش:</span>
          <DashboardOrdersCopyValue value="۱۲۵۸۴۷۶۰۲" copy-value="125847602" />
        </div>
        <div class="flex items-center justify-between gap-3 px-4 py-3 text-[12px]">
          <span class="text-T-600">مبلغ پرداختی:</span>
          <span class="font-bold text-T-900">{{ formatPriceFa(totals.paid) }} تومان</span>
        </div>
      </div>

      <!-- Remaining -->
      <div class="mt-4 flex flex-col items-center justify-center gap-6 rounded-xl border border-T-400 p-4 sm:flex-row">
        <DashboardOrdersProgressRing :percent="order.payment?.percent ?? 45" label="پرداخت شده" />

        <div class="flex w-full flex-col gap-3 text-start text-[12px] text-T-600">
          <div class="flex items-center justify-between gap-3">
            <span>مبلغ سفارش:</span>
            <b class="font-bold text-T-900">{{ formatPriceFa(totals.total) }} تومان</b>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span>مجموع پرداخت‌شده:</span>
            <b class="font-bold text-T-900">{{ formatPriceFa(totals.paid) }} تومان</b>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span>مبلغ باقی‌مانده:</span>
            <b class="font-bold text-T-900">{{ formatPriceFa(totals.remaining) }} تومان</b>
          </div>
        </div>
      </div>

      <p class="mt-5 text-start text-[11.5px] leading-[22px] text-T-600">
        هر پرداخت شما به‌صورت جداگانه ثبت می‌شود؛ می‌توانید همین حالا ادامه دهید یا از مسیر
        «<NuxtLink to="/dashboard" class="font-semibold text-indigo-500">داشبورد</NuxtLink>
        ←
        «<NuxtLink :to="`/dashboard/orders`" class="font-semibold text-indigo-500">سفارش‌های من</NuxtLink>
        ←
        <NuxtLink :to="`/dashboard/orders/${id}`" class="font-semibold text-indigo-500">جزئیات سفارش</NuxtLink>»
        باقی مانده را کامل کنید.
      </p>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <NuxtLink
          :to="`/dashboard/orders/${id}`"
          class="flex h-11 flex-1 items-center justify-center rounded-xl border border-T-400 bg-T-50 text-[13px] font-semibold text-T-800 transition-colors hover:border-T-500"
        >
          جزئیات سفارش
        </NuxtLink>
        <NuxtLink
          :to="`/dashboard/orders/${id}/pay`"
          class="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-primary bg-T-50 text-[13px] font-bold text-primary transition-colors hover:bg-R-50"
        >
          ادامه پرداخت - {{ formatPriceFa(totals.remaining) }}
          <IconChevronLeft class="size-4" />
        </NuxtLink>
      </div>
    </DashboardOrdersSuccessCard>

    <div v-else class="rounded-[20px] border border-T-400 bg-T-50 p-10 text-center">
      <p class="text-[14px] font-bold text-T-900">اطلاعات پرداخت یافت نشد.</p>
      <NuxtLink to="/dashboard/orders" class="mt-3 inline-block text-[13px] font-semibold text-primary">
        بازگشت به سفارش‌های من
      </NuxtLink>
    </div>
  </DashboardOrdersSuccessShell>
</template>
