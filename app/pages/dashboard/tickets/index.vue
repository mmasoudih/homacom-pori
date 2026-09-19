<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { toast } from 'vue-sonner'
import type { NewTicketPayload, Ticket } from '~/data/tickets'
import { tickets as initialTickets } from '~/data/tickets'

const route = useRoute()
const router = useRouter()
const isDesktop = useMediaQuery('(min-width: 1280px)')

const items = ref<Ticket[]>([...initialTickets])
const dialogOpen = ref(false)

const isEmpty = computed(() => route.query.empty === '1' || items.value.length === 0)

function openDialog() {
  dialogOpen.value = true
}

function viewTicket(id: string) {
  router.push(`/dashboard/tickets/${id}`)
}

function removeTicket(id: string) {
  items.value = items.value.filter(ticket => ticket.id !== id)
  toast.success('تیکت حذف شد.')
}

let ticketSeq = items.value.length

function createTicket(payload: NewTicketPayload) {
  ticketSeq += 1
  const id = `ticket-${Date.now()}`
  items.value = [
    {
      id,
      code: `321EAAP6-${String(ticketSeq).padStart(4, '0')}`,
      subject: payload.subject,
      department: 'بخش مالی',
      status: 'waiting',
      date: '۱۴۰۴ مهر ۲۸ - ۱۰:۳۰',
      messages: [
        { id: `${id}-message-1`, author: 'user', body: payload.description, date: '۱۴۰۴ مهر ۲۸ - ۱۰:۳۰' },
      ],
    },
    ...items.value,
  ]
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
      <DashboardTicketsNewTicketDialog v-if="isDesktop" v-model:open="dialogOpen" @submit="createTicket" />
      <DashboardTicketsMobileNewTicketSheet v-else v-model:open="dialogOpen" @submit="createTicket" />
    </ClientOnly>
  </div>
</template>
