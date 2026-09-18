<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue'
import { orderTabs, orders, returnRequests } from '~/data/orders'

const route = useRoute()
const router = useRouter()

const activeTab = ref((route.query.tab as string) || 'all')
const page = ref(1)
const search = ref('')

const currentStatuses = ['awaiting_payment', 'processing', 'shipping']

const tabCount = computed(() => orderTabs.find(t => t.key === activeTab.value)?.count ?? 0)
const pages = computed(() => Math.max(1, Math.ceil(tabCount.value / 10)))

const filteredOrders = computed(() => {
  const term = search.value.trim().toLowerCase()

  const list = activeTab.value === 'current'
    ? orders.filter(o => currentStatuses.includes(o.status))
    : activeTab.value === 'delivered'
      ? orders.filter(o => o.status === 'delivered')
      : activeTab.value === 'cancelled'
        ? orders.filter(o => o.status === 'cancelled')
        : orders

  if (!term) return list
  return list.filter(o =>
    o.code.toLowerCase().includes(term)
    || o.items.some(i => i.title.toLowerCase().includes(term)),
  )
})

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
  || (isReturnTab.value ? filteredReturns.value.length === 0 : filteredOrders.value.length === 0),
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
  <DashboardOrdersShell>
    <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-4">
        <h1 class="text-xl font-bold text-T-900">سفارش‌های من</h1>

        <div class="flex w-full max-w-[260px] items-center gap-2 border-b border-T-400 pb-1.5">
          <input
            v-model="search"
            type="search"
            placeholder="جستجو در سفارش‌ها..."
            class="min-w-0 flex-1 bg-transparent text-[13px] text-T-900 outline-none placeholder:text-T-500"
          >
          <IconSearch class="size-4 shrink-0 text-T-500" />
        </div>
      </div>

      <!-- Tabs -->
      <DashboardOrdersTabs v-model="activeTab" :tabs="orderTabs" />

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
              v-for="order in filteredOrders"
              :key="order.id"
              :order="order"
            />
          </template>
        </div>

        <DashboardOrdersPagination v-model:page="page" :pages="pages" class="mt-6" />
      </template>
    </section>
  </DashboardOrdersShell>
</template>
