<script setup lang="ts">
import { addresses as initialAddresses } from '~/data/addresses'

const route = useRoute()
const items = ref([...initialAddresses])

const isEmpty = computed(
  () => route.query.empty === '1' || items.value.length === 0,
)

function remove(id: string) {
  items.value = items.value.filter(address => address.id !== id)
}

useHead({
  title: 'لیست آدرس‌ها | هماکام',
})
</script>

<template>
  <div>
    <DashboardAddressesShell>
      <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
        <DashboardAddressesHeader />

        <DashboardAddressesEmptyState v-if="isEmpty" />

        <DashboardAddressesList
          v-else
          class="mt-5"
          :addresses="items"
          @remove="remove"
        />
      </section>
    </DashboardAddressesShell>

    <DashboardAddressesMobileShell title="لیست آدرس‌ها" back-to="/dashboard">
      <DashboardAddressesMobileEmptyState v-if="isEmpty" />

      <DashboardAddressesMobileList
        v-else
        :addresses="items"
        @remove="remove"
      />
    </DashboardAddressesMobileShell>
  </div>
</template>
