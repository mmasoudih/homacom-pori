<script setup lang="ts">
import { toast } from 'vue-sonner'
import { apiErrorMessage } from '~/composables/useApi'

const route = useRoute()
const {
  addresses: items,
  load: loadAddresses,
  remove: deleteAddress,
} = useUserAddresses()

onMounted(() => {
  loadAddresses().catch(err => toast.error(apiErrorMessage(err, 'دریافت آدرس‌ها انجام نشد.')))
})

const isEmpty = computed(
  () => route.query.empty === '1' || items.value.length === 0,
)

async function remove(id: string) {
  try {
    await deleteAddress(id)
    toast.success('آدرس حذف شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'حذف آدرس انجام نشد.'))
  }
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
