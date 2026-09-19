<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { Ticket, TicketMessage } from '~/data/tickets'
import { findTicket } from '~/data/tickets'

const route = useRoute()

const id = computed(() => String(route.params.id))
const ticket = ref<Ticket | undefined>()
const notFound = ref(false)

watchEffect(() => {
  const base = findTicket(id.value)
  if (!base) {
    notFound.value = true
    ticket.value = undefined
    return
  }
  notFound.value = false
  ticket.value = { ...base, messages: [...base.messages] }
})

const closed = computed(() => ticket.value?.status === 'closed')

function closeTicket() {
  if (!ticket.value) return
  ticket.value = { ...ticket.value, status: 'closed' }
  toast.success('تیکت بسته شد.')
}

let messageSeq = 100

function sendMessage(text: string) {
  if (!ticket.value) return
  messageSeq += 1
  const message: TicketMessage = {
    id: `${ticket.value.id}-message-${messageSeq}`,
    author: 'user',
    body: text,
    date: '۱۴۰۴ مهر ۲۸ - ۱۰:۳۵',
  }
  ticket.value.messages = [...ticket.value.messages, message]
}

useHead({ title: 'جزئیات تیکت | هماکام' })
</script>

<template>
  <div>
    <DashboardTicketsShell>
      <section v-if="ticket" class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:p-6">
        <DashboardTicketsDetailHeader
          :subject="ticket.subject"
          :department="ticket.department"
          :status="ticket.status"
          @close="closeTicket"
        />

        <div class="mt-5 border-t border-T-300 pt-6">
          <DashboardTicketsMessageList :messages="ticket.messages" />
        </div>

        <div class="mt-6 border-t border-T-300 pt-4">
          <DashboardTicketsMessageComposer @send="sendMessage" />
        </div>
      </section>

      <div v-else-if="notFound" class="rounded-[20px] border border-T-400 bg-T-50 p-10 text-center">
        <p class="text-[14px] font-bold text-T-900">تیکت مورد نظر یافت نشد.</p>
        <NuxtLink to="/dashboard/tickets" class="mt-3 inline-block text-[13px] font-semibold text-primary">
          بازگشت به پشتیبانی
        </NuxtLink>
      </div>
    </DashboardTicketsShell>

    <DashboardTicketsMobileShell title="جزئیات تیکت" :show-fab="false" :show-nav="false">
      <template #action>
        <button
          v-if="ticket && !closed"
          type="button"
          class="flex h-8 items-center justify-center rounded-lg border border-T-400 px-3 text-[12px] font-semibold text-T-800"
          @click="closeTicket"
        >
          بستن تیکت
        </button>
        <span v-else-if="ticket" class="text-[12px] font-semibold text-T-500">بسته شده</span>
      </template>

      <DashboardTicketsMessageList v-if="ticket" :messages="ticket.messages" />
      <div v-else-if="notFound" class="pt-[210px] text-center">
        <p class="text-[14px] font-bold text-T-900">تیکت مورد نظر یافت نشد.</p>
        <NuxtLink to="/dashboard/tickets" class="mt-3 inline-block text-[13px] font-semibold text-primary">
          بازگشت به پشتیبانی
        </NuxtLink>
      </div>

      <template #footer>
        <DashboardTicketsMessageComposer v-if="ticket" @send="sendMessage" />
      </template>
    </DashboardTicketsMobileShell>
  </div>
</template>
