<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import type { OrderPaymentStatus } from '~/data/orders'
import { orderTabs, returnRequests } from '~/data/orders'
import { typographyVariants } from '~/components/ui/typography'
import { apiErrorMessage } from '~/composables/useApi'

const route = useRoute()
const router = useRouter()

const activeTab = ref((route.query.tab as string) || 'all')
const page = ref(1)
const search = ref('')

/**
 * Optional invoice-payment filter (`?payment=waiting_payment|slice_payment|done`).
 *
 * The designed tabs group by order status; the API's `payment_status` axis
 * (paid / unpaid / instalment) is exposed through this query parameter and
 * applied server-side.
 */
const paymentFilter = computed<OrderPaymentStatus | 'all'>(() => {
  const value = String(route.query.payment || '')
  return value === 'waiting_payment' || value === 'slice_payment' || value === 'done'
    ? value
    : 'all'
})

const { orders, loaded, load: loadOrders } = useOrders()

await loadOrders({ type: 'sales', paymentStatus: paymentFilter.value }).catch((err) => {
  // A 422 here means the filters were rejected; never fall back silently.
  toast.error(apiErrorMessage(err, 'دریافت سفارش‌ها انجام نشد.'))
})

const filteredOrders = computed(() => {
  const term = search.value.trim().toLowerCase()

  const list = activeTab.value === 'current'
    ? orders.value.filter(o => o.status === 'awaiting_payment' || o.status === 'processing')
    : activeTab.value === 'delivered'
      ? orders.value.filter(o => o.status === 'delivered')
      : activeTab.value === 'cancelled'
        ? orders.value.filter(o => o.status === 'cancelled')
        : orders.value

  if (!term) return list
  return list.filter(o =>
    o.code.toLowerCase().includes(term)
    || o.items.some(i => i.title.toLowerCase().includes(term)),
  )
})

const pages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / 10)))
const pagedOrders = computed(() =>
  filteredOrders.value.slice((page.value - 1) * 10, page.value * 10),
)

const tabs = computed(() => orderTabs.map(tab => ({
  ...tab,
  count: tab.key === 'returned'
    ? returnRequests.length
    : tab.key === 'all'
      ? orders.value.length
      : tab.key === 'current'
        ? orders.value.filter(order => order.status === 'awaiting_payment' || order.status === 'processing').length
        : orders.value.filter(order => order.status === tab.key).length,
})))

const filteredReturns = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return returnRequests
  return returnRequests.filter(r =>
    r.trackingCode.toLowerCase().includes(term)
    || r.items.some(i => i.title.toLowerCase().includes(term)),
  )
})

const isReturnTab = computed(() => activeTab.value === 'returned')
const showEmpty = computed(() =>
  route.query.empty === '1'
  || (loaded.value && (isReturnTab.value ? filteredReturns.value.length === 0 : filteredOrders.value.length === 0)),
)

watch(activeTab, (tab) => {
  page.value = 1
  router.replace({ query: { ...route.query, tab: tab === 'all' ? undefined : tab } })
})

useHead({
  title: 'سفارش‌های من | هماکام',
})
</script>

<template>
  <div>
    <DashboardOrdersShell>
      <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4">
          <UiTypography as="h1" size="2xl" weight="semibold">سفارش‌های من</UiTypography>

          <div class="flex w-full max-w-[260px] items-center gap-2 border-b border-T-400 pb-1.5">
            <img src="/icons/search-18.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
            <input
              v-model="search"
              type="search"
              placeholder="جستجو در سفارش‌ها..."
              class="min-w-0 flex-1 bg-transparent text-T-900 outline-none placeholder:text-T-500"
              :class="typographyVariants({ size: 'md', weight: 'medium' })"
            >
          </div>
        </div>

        <!-- Tabs -->
        <DashboardOrdersTabs v-model="activeTab" :tabs="tabs" />

        <!-- List -->
        <div v-if="showEmpty" class="mt-2">
          <DashboardOrdersEmptyState />
        </div>

        <template v-else>
          <div class="mt-6 flex flex-col gap-4">
            <template v-if="isReturnTab">
              <DashboardOrdersReturnCard
                v-for="request in filteredReturns"
                :key="request.id"
                :request="request"
              />
            </template>
            <template v-else>
              <DashboardOrdersOrderCard
                v-for="order in pagedOrders"
                :key="order.id"
                :order="order"
              />
            </template>
          </div>

          <AppPagination v-model:page="page" :pages="pages" class="mt-6" />
        </template>
      </section>
    </DashboardOrdersShell>

    <DashboardOrdersMobileShell title="سفارش‌های من" align="start">
      <!-- Search -->
      <div class="mb-4 flex h-11 items-center gap-3 rounded-[12px] border border-T-300 bg-T-200 px-4">
        <input
          v-model="search"
          type="search"
          placeholder="جستجو در سفارش‌ها ..."
          class="flex-1 bg-transparent text-[13px] text-T-900 outline-none placeholder:text-T-600"
        >
        <IconSearch class="size-5 shrink-0 text-T-600" />
      </div>

      <!-- Tabs -->
      <div class="mb-4 border-b border-T-300 pb-3">
        <DashboardOrdersMobileTabs v-model="activeTab" :tabs="tabs" />
      </div>

      <!-- List -->
      <DashboardOrdersMobileEmptyState v-if="showEmpty" />

      <template v-if="isReturnTab">
        <div class="flex flex-col">
          <DashboardOrdersMobileReturnCard
            v-for="request in filteredReturns"
            :key="request.id"
            :request="request"
          />
        </div>
      </template>
      <div v-else class="flex flex-col">
        <DashboardOrdersMobileOrderCard
          v-for="order in pagedOrders"
          :key="order.id"
          :order="order"
        />
      </div>
    </DashboardOrdersMobileShell>
  </div>
</template>
