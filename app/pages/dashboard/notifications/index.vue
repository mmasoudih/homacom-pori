<script setup lang="ts">
import type { AppNotification } from '~/data/notifications'
import { notifications as initialNotifications } from '~/data/notifications'

const route = useRoute()

const items = ref<AppNotification[]>([...initialNotifications])

const showEmpty = computed(() => route.query.empty === '1' || items.value.length === 0)

function markRead(id: string) {
  items.value = items.value.map(item => (item.id === id ? { ...item, unread: false } : item))
}

useHead({
  title: 'اعلان‌ها | هماکام',
})
</script>

<template>
  <div>
    <DashboardNotificationsShell>
      <section class="rounded-2xl border border-T-400 bg-T-50 p-6">
        <h1 class="mb-6 text-xl font-bold text-T-900">اعلان‌ها</h1>

        <DashboardNotificationsEmptyState v-if="showEmpty" />

        <div v-else class="flex flex-col gap-3">
          <DashboardNotificationsCard
            v-for="item in items"
            :key="item.id"
            :notification="item"
            @read="markRead"
          />
        </div>
      </section>
    </DashboardNotificationsShell>

    <DashboardNotificationsMobileShell title="اعلان‌ها" back-to="/dashboard">
      <DashboardNotificationsMobileEmptyState v-if="showEmpty" />

      <div v-else>
        <DashboardNotificationsMobileCard
          v-for="item in items"
          :key="item.id"
          :notification="item"
          @read="markRead"
        />
      </div>
    </DashboardNotificationsMobileShell>
  </div>
</template>
