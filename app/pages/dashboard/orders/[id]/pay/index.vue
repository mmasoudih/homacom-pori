<script setup lang="ts">
import {
  IconCircleCheckFilled,
  IconCoins,
  IconCreditCard,
  IconInfoCircle,
  IconWallet,
} from '@tabler/icons-vue'
import type { Component } from 'vue'
import { toast } from 'vue-sonner'
import { creditWallets, findOrder, paymentMethods } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))
const order = computed(() => findOrder(id.value))

const methodIcons: Record<string, Component> = {
  card: IconCreditCard,
  wallet: IconWallet,
  coins: IconCoins,
}

const selectedMethod = ref<'internet' | 'wallet' | 'installment'>('internet')
const selectedBank = ref<'mellat' | 'seh'>('mellat')
const selectedWallet = ref<string | null>('avazo')

const totals = computed(() => {
  const total = order.value?.payment?.total ?? order.value?.amount ?? 0
  const paid = order.value?.payment?.paid ?? 0
  return { total, paid, remaining: Math.max(0, total - paid) }
})

function pay() {
  toast.success('پرداخت شما با موفقیت انجام شد.')
  router.push(`/dashboard/orders/${id.value}/pay/success`)
}

useHead({
  title: 'تکمیل پرداخت سفارش | هماکام',
})
</script>

<template>
  <DashboardOrdersCheckoutShell :back-to="`/dashboard/orders/${id}`">
    <template v-if="order">
      <!-- Banner -->
      <div class="flex items-start gap-3 rounded-[16px] bg-indigo-50 p-4 lg:p-5">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-indigo-500">
          <IconInfoCircle class="size-6" />
        </span>
        <div class="flex flex-col gap-1">
          <h1 class="text-[13.5px] font-bold text-indigo-700">
            تکمیل پرداخت سفارش {{ toPersianDigits(order.code) }}
          </h1>
          <p class="text-[12px] leading-[22px] text-indigo-500">
            پرداخت اولیه ثبت شد؛ با تکمیل پرداخت، سفارش نهایی می‌شود. اگر مجموع پرداخت‌ها به مبلغ سفارش نرسید، می‌توانید باقی‌مانده را در چند مرحله و با روش‌های مختلف پرداخت کنید.
          </p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <!-- Payment methods -->
        <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
          <h2 class="text-[14px] font-bold text-T-900">روش پرداخت</h2>

          <div class="mt-5 flex flex-col gap-3">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="rounded-xl border p-4 transition-colors"
              :class="selectedMethod === method.id ? 'border-primary/50' : 'border-T-400'"
              role="button"
              tabindex="0"
              @click="selectedMethod = method.id"
              @keydown.enter="selectedMethod = method.id"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <span class="mt-0.5 text-T-700">
                    <component :is="methodIcons[method.icon]" class="size-5" />
                  </span>
                  <div class="flex flex-col gap-1">
                    <span class="text-[13px] font-bold text-T-900">{{ method.title }}</span>
                    <span class="text-[11.5px] text-T-600">{{ method.description }}</span>
                  </div>
                </div>

                <span
                  class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2"
                  :class="selectedMethod === method.id ? 'border-primary' : 'border-T-400'"
                >
                  <span v-if="selectedMethod === method.id" class="size-2.5 rounded-full bg-primary" />
                </span>
              </div>

              <!-- Internet gateway banks -->
              <div v-if="method.id === 'internet' && selectedMethod === 'internet'" class="mt-4 flex flex-col gap-3">
                <DashboardOrdersAlertNote>
                  {{ method.note }}
                </DashboardOrdersAlertNote>
                <div class="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    class="flex h-11 w-[150px] items-center justify-center gap-2 rounded-xl border bg-T-50 text-[12.5px] font-semibold transition-colors"
                    :class="selectedBank === 'seh' ? 'border-primary text-primary' : 'border-T-400 text-T-700'"
                    @click.stop="selectedBank = 'seh'"
                  >
                    درگاه بانک سیه
                  </button>
                  <button
                    type="button"
                    class="flex h-11 w-[150px] items-center justify-center gap-2 rounded-xl border text-[12.5px] font-semibold transition-colors"
                    :class="selectedBank === 'mellat' ? 'border-primary bg-R-50 text-primary' : 'border-T-400 bg-T-50 text-T-700'"
                    @click.stop="selectedBank = 'mellat'"
                  >
                    درگاه بانک ملت
                  </button>
                </div>
              </div>

              <!-- Wallet note -->
              <div v-if="method.id === 'wallet' && selectedMethod === 'wallet'" class="mt-4">
                <DashboardOrdersAlertNote>
                  اعتبار شما کافی نیست. برای ادامه، می‌توانید موجودی کیف‌پول را شارژ کنید یا روش پرداخت اینترنتی را انتخاب کنید.
                  <NuxtLink to="/dashboard" class="font-bold text-primary" @click.stop>کیف‌پول</NuxtLink>
                </DashboardOrdersAlertNote>
              </div>
            </div>
          </div>

          <hr class="my-6 border-T-300">

          <h2 class="text-[14px] font-bold text-T-900">استفاده از اعتبار</h2>

          <div class="mt-5 flex flex-col gap-3">
            <div
              v-for="walletItem in creditWallets"
              :key="walletItem.id"
              class="flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors"
              :class="selectedWallet === walletItem.id ? 'border-primary/50' : 'border-T-400'"
              role="button"
              tabindex="0"
              @click="selectedWallet = walletItem.id"
              @keydown.enter="selectedWallet = walletItem.id"
            >
              <div class="flex items-center gap-3">
                <span
                  class="flex size-5 shrink-0 items-center justify-center rounded-full border-2"
                  :class="selectedWallet === walletItem.id ? 'border-primary' : 'border-T-400'"
                >
                  <span v-if="selectedWallet === walletItem.id" class="size-2.5 rounded-full bg-primary" />
                </span>
                <div class="flex flex-col gap-1">
                  <span class="text-[13px] font-bold text-T-900">{{ walletItem.name }}</span>
                  <span class="text-[11.5px] text-T-600">
                    موجودی: {{ formatPriceFa(walletItem.balance) }} تومان
                  </span>
                </div>
              </div>

              <span class="text-[15px] font-black" :class="walletItem.id === 'baloon' ? 'text-sky-500' : 'text-indigo-500'">
                {{ walletItem.id === 'baloon' ? 'بالون' : 'آواژو' }}
              </span>
            </div>
          </div>
        </section>

        <!-- Summary -->
        <aside class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-5">
          <div class="flex flex-col gap-4 text-[12.5px]">
            <div class="flex items-center justify-between gap-3 text-T-600">
              <span>مبلغ سفارش:</span>
              <span class="font-bold text-T-900">{{ formatPriceFa(totals.total) }} تومان</span>
            </div>
            <div class="flex items-center justify-between gap-3 text-T-600">
              <span class="flex items-center gap-1.5">
                پرداخت‌شده (۲ تراکنش):
              </span>
              <span class="flex items-center gap-1.5 font-bold text-T-900">
                {{ formatPriceFa(totals.paid) }} تومان
                <IconCircleCheckFilled class="size-4 text-emerald-500" />
              </span>
            </div>
            <div class="flex items-center justify-between gap-3 text-T-600">
              <span>باقی‌مانده:</span>
              <span class="text-[13px] font-extrabold text-T-900">{{ formatPriceFa(totals.remaining) }} تومان</span>
            </div>
          </div>

          <button
            type="button"
            class="mt-5 h-11 w-full rounded-xl bg-primary text-[13px] font-bold text-white transition-colors hover:bg-primary/90"
            @click="pay"
          >
            پرداخت
          </button>
        </aside>
      </div>
    </template>

    <div v-else class="rounded-[20px] border border-T-400 bg-T-50 p-10 text-center">
      <p class="text-[14px] font-bold text-T-900">سفارش مورد نظر یافت نشد.</p>
      <NuxtLink to="/dashboard/orders" class="mt-3 inline-block text-[13px] font-semibold text-primary">
        بازگشت به سفارش‌های من
      </NuxtLink>
    </div>
  </DashboardOrdersCheckoutShell>
</template>
