<script setup lang="ts">
import { toast } from 'vue-sonner'
import { IconChevronDown, IconWallet } from '@tabler/icons-vue'
import type { StatusTone } from '~/data/orders'
import type { WalletDirection } from '~/data/wallet'
import { walletDirectionMeta } from '~/data/wallet'
import { wallet } from '~/data/dashboard'
import type { WalletInOut } from '~/composables/useWallet'
import { apiErrorMessage } from '~/composables/useApi'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const { profile, refresh: refreshProfile } = useUserProfile()
const { transactions, pending, loaded, hasMore, load, loadMore } = useWallet()

const fundsOpen = ref(false)

const filters: Array<{ key: WalletInOut, label: string }> = [
  { key: 'all', label: 'همه' },
  { key: 'in', label: 'واریز' },
  { key: 'out', label: 'برداشت' },
]

const activeFilter = ref<WalletInOut>('all')

// The dashboard shell is already auth-gated; refresh the balance so a top-up
// confirmed by the gateway is visible without a hard reload.
void refreshProfile().catch(() => {})

await load({ inOut: activeFilter.value }).catch((err) => {
  toast.error(apiErrorMessage(err, 'دریافت تراکنش‌های کیف پول انجام نشد.'))
})

watch(activeFilter, (value) => {
  load({ inOut: value }).catch((err) => {
    toast.error(apiErrorMessage(err, 'دریافت تراکنش‌های کیف پول انجام نشد.'))
  })
})

const balance = computed(() => profile.value.credit)

const toneClass: Record<StatusTone, string> = {
  emerald: 'text-[#2EC144]',
  red: 'text-primary',
  amber: 'text-[#CF982C]',
  gold: 'text-[#CF982C]',
  sky: 'text-[#4E60FF]',
}

const amountPrefix: Record<WalletDirection, string> = {
  in: '+',
  out: '−',
  in_out: '±',
}

function loadMorePage() {
  loadMore().catch((err) => {
    toast.error(apiErrorMessage(err, 'دریافت تراکنش‌های بیشتر انجام نشد.'))
  })
}

useHead({
  title: 'کیف پول | هماکام',
})
</script>

<template>
  <div>
    <DashboardOrdersShell>
      <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4">
          <UiTypography as="h1" size="2xl" weight="semibold">کیف پول من</UiTypography>

          <button
            type="button"
            class="flex h-10 items-center gap-2 rounded-[12px] bg-R-300 px-4"
            @click="fundsOpen = true"
          >
            <UiTypography as="span" size="md" weight="bold" color="white">افزایش موجودی</UiTypography>
          </button>
        </div>

        <!-- Balance -->
        <div class="flex items-center gap-4 rounded-[16px] border border-T-400 bg-T-100 px-4 py-4">
          <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-T-50 text-[#5A6AFF]">
            <IconWallet class="size-5" />
          </span>
          <span class="flex flex-col gap-1">
            <UiTypography as="span" size="md" color="muted">موجودی کیف پول</UiTypography>
            <span class="flex items-baseline gap-1.5">
              <UiTypography as="span" size="2xl" weight="bold">{{ formatPriceFa(balance) }}</UiTypography>
              <UiTypography as="span" size="sm" weight="semibold" color="subtle">تومان</UiTypography>
            </span>
          </span>
        </div>

        <!-- Filters -->
        <div class="mt-5 flex flex-wrap items-center gap-2">
          <button
            v-for="filter in filters"
            :key="filter.key"
            type="button"
            class="flex h-9 items-center rounded-[50px] border px-4 transition-colors"
            :class="activeFilter === filter.key
              ? 'border-R-300 bg-R-10 text-primary'
              : 'border-T-400 text-T-700 hover:border-T-500'"
            @click="activeFilter = filter.key"
          >
            <UiTypography as="span" size="md" weight="medium" color="inherit">{{ filter.label }}</UiTypography>
          </button>
        </div>

        <!-- Ledger -->
        <div class="mt-4 flex flex-col">
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="flex items-start justify-between gap-3 border-b border-T-300 py-3 last:border-b-0"
          >
            <div class="flex min-w-0 flex-col gap-1">
              <div class="flex flex-wrap items-center gap-2">
                <UiTypography as="span" size="lg" weight="medium">{{ transaction.reasonTitle }}</UiTypography>
                <span class="inline-flex h-5 items-center rounded-[50px] bg-T-200 px-2">
                  <UiTypography as="span" size="2xs" color="muted">
                    {{ walletDirectionMeta[transaction.direction].label }}
                  </UiTypography>
                </span>
              </div>

              <UiTypography v-if="transaction.description" as="span" size="md" color="muted" class="leading-[18px]">
                {{ transaction.description }}
              </UiTypography>

              <span class="flex flex-wrap items-center gap-x-2 text-[11px] text-T-600">
                <span dir="ltr">{{ transaction.date }}</span>
                <template v-if="transaction.trackingNumber">
                  <span aria-hidden="true">·</span>
                  <span>شماره پیگیری: {{ toPersianDigits(transaction.trackingNumber) }}</span>
                </template>
              </span>
            </div>

            <span class="shrink-0 text-end" :class="toneClass[walletDirectionMeta[transaction.direction].tone]">
              <UiTypography as="span" size="lg" weight="semibold" color="inherit">
                {{ amountPrefix[transaction.direction] }}{{ formatPriceFa(transaction.amount) }}
              </UiTypography>
              <UiTypography as="span" size="xs" weight="medium" color="subtle"> تومان</UiTypography>
            </span>
          </div>

          <p
            v-if="loaded && !transactions.length"
            class="py-8 text-center text-[13px] text-T-600"
          >
            هنوز تراکنشی برای کیف پول شما ثبت نشده است.
          </p>

          <button
            v-if="hasMore"
            type="button"
            class="mx-auto mt-4 flex h-10 items-center gap-2 rounded-[12px] border border-T-400 px-5 text-T-800 transition-colors hover:border-T-500 disabled:opacity-60"
            :disabled="pending"
            @click="loadMorePage"
          >
            <UiTypography as="span" size="md" weight="medium" color="inherit">
              {{ pending ? 'در حال دریافت…' : 'تراکنش‌های بیشتر' }}
            </UiTypography>
            <IconChevronDown class="size-4" />
          </button>
        </div>
      </section>
    </DashboardOrdersShell>

    <DashboardOrdersMobileShell title="کیف پول" align="start" back-to="/dashboard">
      <div class="mb-4 flex flex-col gap-3 rounded-2xl border border-T-300 bg-T-50 p-4">
        <span class="flex items-center justify-between gap-3">
          <UiTypography as="span" size="md" color="muted">موجودی کیف پول</UiTypography>
          <span class="flex items-baseline gap-1">
            <UiTypography as="span" size="xl" weight="bold">{{ formatPriceFa(balance) }}</UiTypography>
            <UiTypography as="span" size="xs" weight="semibold" color="subtle">تومان</UiTypography>
          </span>
        </span>

        <button
          type="button"
          class="flex h-10 w-full items-center justify-center rounded-[12px] bg-R-300"
          @click="fundsOpen = true"
        >
          <UiTypography as="span" size="md" weight="bold" color="white">افزایش موجودی</UiTypography>
        </button>
      </div>

      <div class="mb-4 flex flex-wrap items-center gap-2">
        <button
          v-for="filter in filters"
          :key="filter.key"
          type="button"
          class="flex h-9 items-center rounded-[50px] border px-4 transition-colors"
          :class="activeFilter === filter.key
            ? 'border-R-300 bg-R-10 text-primary'
            : 'border-T-300 text-T-700'"
          @click="activeFilter = filter.key"
        >
          <UiTypography as="span" size="md" weight="medium" color="inherit">{{ filter.label }}</UiTypography>
        </button>
      </div>

      <div class="flex flex-col">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="flex items-start justify-between gap-3 border-b border-T-300 py-3 last:border-b-0"
        >
          <div class="flex min-w-0 flex-col gap-1">
            <UiTypography as="span" size="md" weight="medium">{{ transaction.reasonTitle }}</UiTypography>
            <UiTypography v-if="transaction.description" as="span" size="sm" color="muted" class="leading-[18px]">
              {{ transaction.description }}
            </UiTypography>
            <span class="text-[11px] text-T-600" dir="ltr">{{ transaction.date }}</span>
          </div>

          <span class="shrink-0 text-end" :class="toneClass[walletDirectionMeta[transaction.direction].tone]">
            <UiTypography as="span" size="md" weight="semibold" color="inherit">
              {{ amountPrefix[transaction.direction] }}{{ formatPriceFa(transaction.amount) }}
            </UiTypography>
            <UiTypography as="span" size="2xs" weight="medium" color="subtle"> تومان</UiTypography>
          </span>
        </div>

        <p v-if="loaded && !transactions.length" class="py-8 text-center text-[13px] text-T-600">
          هنوز تراکنشی برای کیف پول شما ثبت نشده است.
        </p>

        <button
          v-if="hasMore"
          type="button"
          class="mx-auto mt-4 flex h-10 items-center gap-2 rounded-[12px] border border-T-400 px-5 text-T-800 disabled:opacity-60"
          :disabled="pending"
          @click="loadMorePage"
        >
          <UiTypography as="span" size="md" weight="medium" color="inherit">
            {{ pending ? 'در حال دریافت…' : 'تراکنش‌های بیشتر' }}
          </UiTypography>
          <IconChevronDown class="size-4" />
        </button>
      </div>
    </DashboardOrdersMobileShell>

    <DashboardAddFundsDialog
      v-model:open="fundsOpen"
      :balance="balance"
      :min="wallet.minCharge"
      :max="wallet.maxCharge"
    />
  </div>
</template>
