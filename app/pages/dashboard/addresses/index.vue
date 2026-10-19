<script setup lang="ts">
import { toast } from 'vue-sonner'
import { apiErrorMessage } from '~/composables/useApi'

const route = useRoute()
const {
  addresses: items,
  load: loadAddresses,
  create: createAddress,
  update: updateAddress,
  remove: deleteAddress,
} = useUserAddresses()

const dialogOpen = ref(false)
const editingAddress = ref<import('~/data/addresses').Address | null>(null)

function openAdd() {
  editingAddress.value = null
  dialogOpen.value = true
}

function openEdit(address: import('~/data/addresses').Address) {
  editingAddress.value = address
  dialogOpen.value = true
}

async function saveAddress(payload: import('~/composables/useAddresses').AddressInput, id?: string) {
  try {
    if (id) await updateAddress(id, payload)
    else await createAddress(payload)
    dialogOpen.value = false
    toast.success(id ? 'آدرس ویرایش شد.' : 'آدرس ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت آدرس انجام نشد.'))
  }
}

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
        <DashboardAddressesHeader @add="openAdd" />

        <DashboardAddressesEmptyState v-if="isEmpty" />

        <DashboardAddressesList
          v-else
          class="mt-5"
          :addresses="items"
          @remove="remove"
          @edit="openEdit"
        />
      </section>
    </DashboardAddressesShell>

    <DashboardAddressesMobileShell title="لیست آدرس‌ها" back-to="/dashboard">
      <DashboardAddressesMobileEmptyState v-if="isEmpty" />

      <DashboardAddressesMobileList
        v-else
        :addresses="items"
        @remove="remove"
        @edit="openEdit"
      />
    </DashboardAddressesMobileShell>

    <DashboardAddressesDialog
      v-model:open="dialogOpen"
      :address="editingAddress"
      @submit="saveAddress"
    />
  </div>
</template>
