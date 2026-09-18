<script setup lang="ts">
import type { Order, OrderStatus } from '~/data/orders'
import { findOrder, orderStatusMeta } from '~/data/orders'

const route = useRoute()
const id = computed(() => String(route.params.id))

const order = ref<Order | undefined>(undefined)
const notFound = ref(false)

watchEffect(() => {
  const base = findOrder(id.value)
  if (!base) {
    notFound.value = true
    order.value = undefined
    return
  }

  notFound.value = false
  const override = route.query.status as OrderStatus | undefined
  order.value = { ...base, status: override && override in orderStatusMeta ? override : base.status }
})

const cancelOpen = ref(false)

function onCancelled() {
  if (order.value) order.value = { ...order.value, status: 'cancelled' }
}

useHead({
  title: 'جزئیات سفارش | هماکام',
})
</script>

<template>
  <div>
  <DashboardOrdersShell>
    <DashboardOrdersDetailHeader
      v-if="order"
      title="جزئیات سفارش"
      :code="order.code"
      back-to="/dashboard/orders"
    />

    <template v-if="order">
      <DashboardOrdersDetailInfo :order="order" />
      <DashboardOrdersDetailShipping :order="order" @cancel="cancelOpen = true" />
      <DashboardOrdersDetailTransactions :transactions="order.transactions" />
      <DashboardOrdersDetailItems :items="order.items" />
    </template>

    <div
      v-else-if="notFound"
      class="rounded-[20px] border border-T-400 bg-T-50 p-10 text-center"
    >
      <p class="text-[14px] font-bold text-T-900">سفارش مورد نظر یافت نشد.</p>
      <NuxtLink to="/dashboard/orders" class="mt-3 inline-block text-[13px] font-semibold text-primary">
        بازگشت به سفارش‌های من
      </NuxtLink>
    </div>
  </DashboardOrdersShell>

  <DashboardOrdersCancelDialog v-model:open="cancelOpen" @confirmed="onCancelled" />
  </div>
</template>
