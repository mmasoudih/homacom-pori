<script setup lang="ts">
import type { ReturnRequest } from '~/data/orders'
import { findReturn, returnItemStatusMeta, returnStatusMeta } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const route = useRoute()
const id = computed(() => String(route.params.id))
const request = computed<ReturnRequest | undefined>(() => findReturn(id.value))

const meta = computed(() => (request.value ? returnStatusMeta[request.value.status] : null))

const infoItems = computed(() => request.value
  ? [
      { label: 'کد پیگیری مرجوعی', value: toPersianDigits(request.value.trackingCode) },
      { label: 'تاریخ ثبت مرجوعی', value: request.value.date },
    ]
  : [])

useHead({
  title: 'جزئیات درخواست مرجوعی | هماکام',
})
</script>

<template>
  <DashboardOrdersShell>
    <DashboardOrdersDetailHeader
      v-if="request"
      title="جزئیات درخواست مرجوعی"
      :code="request.trackingCode"
      back-to="/dashboard/orders?tab=returned"
    />

    <template v-if="request && meta">
      <!-- Status -->
      <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
        <h2 class="text-center text-[14px] font-bold text-T-900">وضعیت درخواست مرجوعی:</h2>

        <div class="mt-6">
          <DashboardOrdersInfoGrid :items="infoItems" :cols="2" />
        </div>

        <div class="mt-6">
          <DashboardOrdersProgressBar :tone="meta.tone" :percent="meta.progress" />
          <div class="mt-3 flex justify-center">
            <DashboardOrdersStatusChip :label="meta.label" :tone="meta.tone" :icon="meta.icon" />
          </div>
        </div>

        <!-- Warehouse address (approved) -->
        <div v-if="request.status === 'approved' || request.status === 'completed'" class="mt-6 rounded-xl bg-indigo-50/70 p-4">
          <p class="text-[12px] font-bold text-T-800">کالاهای تاییدشده را به آدرس زیر ارسال کنید</p>
          <div class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-[11.5px] text-T-600">
            <span>آدرس:</span>
            <b class="font-semibold text-T-800">انبار مرکزی هماکام - واحد مرجوعی، تهران، بلوار فردوس شرق، پلاک ۱۲۸</b>
          </div>
          <div class="mt-2 flex flex-wrap items-center gap-x-2 text-[11.5px] text-T-600">
            <span>کد پستی:</span>
            <DashboardOrdersCopyValue :value="toPersianDigits(request.postalCode)" :copy-value="request.postalCode" />
          </div>
        </div>

        <DashboardOrdersAlertNote class="mt-4">
          <template v-if="request.status === 'review'">
            درخواست مرجوعی شما با موفقیت ثبت شد و در صف بررسی قرار گرفت. نتیجه بررسی از طریق پیامک و همین صفحه اعلام می‌شود.
          </template>
          <template v-else-if="request.status === 'approved'">
            درخواست مرجوعی شما تایید شد و آماده مرحله ارسال کالا است. پس از رسیدن کالا به انبار، کارشناسان صحت کالا و تطابق آن با دلیل مرجوعی را بررسی می‌کنند.
          </template>
          <template v-else-if="request.status === 'completed'">
            مرجوعی با موفقیت انجام شد و مبلغ به کیف پول شما واریز و پیگیری می‌شود.
          </template>
          <template v-else>
            درخواست مرجوعی شما بررسی شد و با توجه به شرایط اعلام‌شده، امکان مرجوع کردن کالا وجود ندارد.
          </template>
        </DashboardOrdersAlertNote>
      </section>

      <!-- Items -->
      <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
        <h2 class="text-center text-[14px] font-bold text-T-900">
          اطلاعات کالاهای مرجوعی: ({{ toPersianDigits(request.items.length) }})
        </h2>

        <div class="mt-6 flex flex-col gap-4">
          <article
            v-for="item in request.items"
            :key="item.id"
            class="rounded-[16px] border border-T-400 bg-T-50 p-4"
          >
            <div class="flex justify-center">
              <DashboardOrdersStatusChip
                :label="returnItemStatusMeta[item.status].label"
                :tone="returnItemStatusMeta[item.status].tone"
                :icon="returnItemStatusMeta[item.status].icon"
                variant="soft"
              />
            </div>

            <div class="mt-4 flex items-start justify-between gap-4">
              <div class="flex min-w-0 flex-1 flex-col gap-2 text-[11.5px] text-T-600">
                <p class="text-[12.5px] font-medium leading-[22px] text-T-800">{{ item.title }}</p>
                <span class="flex items-center gap-1.5">
                  رنگ: <b class="font-semibold text-T-800">{{ item.color }}</b>
                  <span class="size-3 rounded-full border border-T-300" :style="{ backgroundColor: item.colorHex }" />
                </span>
                <span>گارانتی: <b class="font-semibold text-T-800">{{ item.warranty }}</b></span>
                <span>مبلغ مرجوعی: <b class="font-semibold text-T-800">{{ formatPriceFa(item.amount) }}</b> تومان</span>
                <span>تعداد: <b class="font-semibold text-T-800">{{ toPersianDigits(item.quantity) }}</b></span>
              </div>

              <ProductImage
                :src="item.image"
                :alt="item.title"
                container-class="size-16 shrink-0 rounded-xl bg-transparent"
              />
            </div>

            <div class="mt-3 border-t border-T-300 pt-3 text-[11.5px] text-T-600">
              علت مرجوعی: <b class="font-semibold text-T-800">{{ item.reason }}</b>
            </div>
          </article>
        </div>
      </section>
    </template>

    <div
      v-else
      class="rounded-[20px] border border-T-400 bg-T-50 p-10 text-center"
    >
      <p class="text-[14px] font-bold text-T-900">درخواست مرجوعی مورد نظر یافت نشد.</p>
      <NuxtLink to="/dashboard/orders" class="mt-3 inline-block text-[13px] font-semibold text-primary">
        بازگشت به سفارش‌های من
      </NuxtLink>
    </div>
  </DashboardOrdersShell>
</template>
