<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { toast } from 'vue-sonner'
import type { NewTicketPayload } from '~/data/tickets'
import { apiErrorMessage } from '~/composables/useApi'
import { DESKTOP_MEDIA_QUERY } from '~/utils/breakpoints'

const route = useRoute()
const router = useRouter()
const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)

const {
  tickets: items,
  loaded,
  load: loadTickets,
  create: createTicketApi,
  close: closeTicketApi,
} = useTickets()
const { departments, load: loadDepartments } = useTicketDepartments()
const dialogOpen = ref(false)

onMounted(() => {
  Promise.all([loadTickets(), loadDepartments()])
    .catch(err => toast.error(apiErrorMessage(err, 'دریافت تیکت‌ها انجام نشد.')))
})

const isEmpty = computed(
  () => route.query.empty === '1' || (loaded.value && items.value.length === 0),
)

function openDialog() {
  dialogOpen.value = true
}

function viewTicket(id: string) {
  router.push(`/dashboard/tickets/${id}`)
}

async function removeTicket(id: string) {
  try {
    await closeTicketApi(id)
    toast.success('تیکت بسته شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'بستن تیکت انجام نشد.'))
  }
}

async function createTicket(payload: NewTicketPayload) {
  const departmentId = Number(payload.topic)
  if (!departmentId) {
    toast.error('بخش پشتیبانی را انتخاب کنید.')
    return
  }

  try {
    await createTicketApi({
      subject: payload.subject,
      departmentId,
      priority: 'medium',
      content: payload.description,
    })
    toast.success('تیکت شما ثبت شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت تیکت انجام نشد.'))
  }
}

useHead({ title: 'پشتیبانی | هماکام' })
</script>

<template>
  <div>
    <DashboardTicketsShell>
      <section class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
        <DashboardTicketsHeader @create="openDialog" />

        <DashboardTicketsEmptyState v-if="isEmpty" @create="openDialog" />
        <DashboardTicketsTable
          v-else
          class="mt-6"
          :tickets="items"
          @view="viewTicket"
          @remove="removeTicket"
        />
      </section>
    </DashboardTicketsShell>

    <DashboardTicketsMobileShell title="پشتیبانی" back-to="/dashboard" @create="openDialog">
      <DashboardTicketsMobileEmptyState v-if="isEmpty" @create="openDialog" />
      <DashboardTicketsMobileList
        v-else
        :tickets="items"
        @view="viewTicket"
        @remove="removeTicket"
      />
    </DashboardTicketsMobileShell>

    <ClientOnly>
      <DashboardTicketsNewTicketDialog v-if="isDesktop" v-model:open="dialogOpen" :departments="departments" @submit="createTicket" />
      <DashboardTicketsMobileNewTicketSheet v-else v-model:open="dialogOpen" :departments="departments" @submit="createTicket" />
    </ClientOnly>
  </div>
</template>
